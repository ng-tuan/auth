import { SwaggerOptions } from 'swagger-ui-express';

export const swaggerDocument = {
  openapi: '3.1.0',
  info: {
    title: 'Auth API Documentation',
    version: '1.0.0',
    description: 'API documentation for the Auth application',
  },
  servers: [
    {
      url: 'http://localhost:3000',
      description: 'Development server',
    },
  ],
  components: {
    securitySchemes: {
      bearerAuth: {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
      },
    },
    schemas: {
      User: {
        type: 'object',
        properties: {
          id: {
            type: 'string',
            format: 'uuid',
          },
          user_name: {
            type: 'string',
          },
          password: {
            type: 'string',
            format: 'password',
          },
        },
      },
      Room: {
        type: 'object',
        properties: {
          id: {
            type: 'string',
            format: 'uuid',
          },
          name: {
            type: 'string',
          },
          type: {
            type: 'string',
            enum: ['public', 'private'],
          },
          createdBy: {
            type: 'string',
            format: 'uuid',
          },
          members: {
            type: 'array',
            items: {
              type: 'string',
              format: 'uuid',
            },
          },
        },
      },
      Message: {
        type: 'object',
        properties: {
          id: {
            type: 'string',
            format: 'uuid',
          },
          roomId: {
            type: 'string',
            format: 'uuid',
          },
          senderId: {
            type: 'string',
            format: 'uuid',
          },
          content: {
            type: 'string',
          },
          type: {
            type: 'string',
            enum: ['text', 'image', 'file'],
          },
          status: {
            type: 'string',
            enum: ['sent', 'delivered', 'read'],
          },
        },
      },
    },
  },
  security: [
    {
      bearerAuth: [],
    },
  ],
  paths: {
    '/api/auth/register': {
      post: {
        tags: ['Auth'],
        summary: 'Register a new user',
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                $ref: '#/components/schemas/User',
              },
            },
          },
        },
        responses: {
          '200': {
            description: 'User registered successfully',
          },
          '400': {
            description: 'Invalid input',
          },
        },
      },
    },
    '/api/auth/login': {
      post: {
        tags: ['Auth'],
        summary: 'Login user',
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                required: ['user_name', 'password'],
                properties: {
                  user_name: {
                    type: 'string',
                  },
                  password: {
                    type: 'string',
                    format: 'password',
                  },
                },
              },
            },
          },
        },
        responses: {
          '200': {
            description: 'Login successful',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    accessToken: {
                      type: 'string',
                    },
                    refreshToken: {
                      type: 'string',
                    },
                    userId: {
                      type: 'string',
                      format: 'uuid',
                    },
                  },
                },
              },
            },
          },
          '401': {
            description: 'Invalid credentials',
          },
        },
      },
    },
    '/api/chat/rooms': {
      post: {
        tags: ['Chat'],
        summary: 'Create a new chat room',
        security: [{ bearerAuth: [] }],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                $ref: '#/components/schemas/Room',
              },
            },
          },
        },
        responses: {
          '201': {
            description: 'Room created successfully',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/Room',
                },
              },
            },
          },
          '500': {
            description: 'Failed to create room',
          },
        },
      },
      get: {
        tags: ['Chat'],
        summary: 'Get all chat rooms',
        security: [{ bearerAuth: [] }],
        responses: {
          '200': {
            description: 'List of chat rooms',
            content: {
              'application/json': {
                schema: {
                  type: 'array',
                  items: {
                    $ref: '#/components/schemas/Room',
                  },
                },
              },
            },
          },
        },
      },
    },
    '/api/chat/rooms/{id}': {
      get: {
        tags: ['Chat'],
        summary: 'Get a specific chat room',
        security: [{ bearerAuth: [] }],
        parameters: [
          {
            in: 'path',
            name: 'id',
            required: true,
            schema: {
              type: 'string',
              format: 'uuid',
            },
          },
        ],
        responses: {
          '200': {
            description: 'Room details',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/Room',
                },
              },
            },
          },
          '404': {
            description: 'Room not found',
          },
        },
      },
    },
    '/api/chat/rooms/{roomId}/messages': {
      get: {
        tags: ['Chat'],
        summary: 'Get messages in a chat room',
        security: [{ bearerAuth: [] }],
        parameters: [
          {
            in: 'path',
            name: 'roomId',
            required: true,
            schema: {
              type: 'string',
              format: 'uuid',
            },
          },
        ],
        responses: {
          '200': {
            description: 'List of messages',
            content: {
              'application/json': {
                schema: {
                  type: 'array',
                  items: {
                    $ref: '#/components/schemas/Message',
                  },
                },
              },
            },
          },
        },
      },
      post: {
        tags: ['Chat'],
        summary: 'Send a message in a chat room',
        security: [{ bearerAuth: [] }],
        parameters: [
          {
            in: 'path',
            name: 'roomId',
            required: true,
            schema: {
              type: 'string',
              format: 'uuid',
            },
          },
        ],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                $ref: '#/components/schemas/Message',
              },
            },
          },
        },
        responses: {
          '201': {
            description: 'Message sent successfully',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/Message',
                },
              },
            },
          },
        },
      },
    },
  },
};

export const swaggerOptions: SwaggerOptions = {
  swaggerDefinition: swaggerDocument,
  apis: ['./src/controllers/*.ts'],
};
