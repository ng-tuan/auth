import express from 'express';
import { Server } from 'socket.io';
import { ChatService } from '../services/chatService';

export const createChatController = (io: Server) => {
  const chatController = express.Router();
  const chatService = new ChatService(io);

  /**
   * @swagger
   * /api/chat/rooms:
   *   post:
   *     summary: Create a new chat room
   *     tags: [Chat]
   *     security:
   *       - bearerAuth: []
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             type: object
   *             required:
   *               - name
   *             properties:
   *               name:
   *                 type: string
   *               description:
   *                 type: string
   *     responses:
   *       201:
   *         description: Room created successfully
   *       500:
   *         description: Failed to create room
   */
  chatController.post('/rooms', async (req, res) => {
    try {
      const room = await chatService.createRoom(req.body);
      res.status(201).json(room);
    } catch (error) {
      res.status(500).json({ error: 'Failed to create room' });
    }
  });

  /**
   * @swagger
   * /api/chat/rooms:
   *   get:
   *     summary: Get all chat rooms
   *     tags: [Chat]
   *     security:
   *       - bearerAuth: []
   *     responses:
   *       200:
   *         description: List of chat rooms
   *       500:
   *         description: Failed to fetch rooms
   */
  chatController.get('/rooms', async (req, res) => {
    try {
      const rooms = await chatService.getRooms();
      res.json(rooms);
    } catch (error) {
      res.status(500).json({ error: 'Failed to fetch rooms' });
    }
  });

  /**
   * @swagger
   * /api/chat/rooms/{id}:
   *   get:
   *     summary: Get a specific chat room
   *     tags: [Chat]
   *     security:
   *       - bearerAuth: []
   *     parameters:
   *       - in: path
   *         name: id
   *         required: true
   *         schema:
   *           type: string
   *     responses:
   *       200:
   *         description: Room details
   *       404:
   *         description: Room not found
   *       500:
   *         description: Failed to fetch room
   */
  chatController.get('/rooms/:id', async (req, res) => {
    try {
      const room = await chatService.getRoom(req.params.id);
      if (!room) {
        return res.status(404).json({ error: 'Room not found' });
      }
      res.json(room);
    } catch (error) {
      res.status(500).json({ error: 'Failed to fetch room' });
    }
  });

  /**
   * @swagger
   * /api/chat/rooms/{roomId}/messages:
   *   get:
   *     summary: Get messages in a chat room
   *     tags: [Chat]
   *     security:
   *       - bearerAuth: []
   *     parameters:
   *       - in: path
   *         name: roomId
   *         required: true
   *         schema:
   *           type: string
   *     responses:
   *       200:
   *         description: List of messages
   *       500:
   *         description: Failed to fetch messages
   */
  chatController.get('/rooms/:roomId/messages', async (req, res) => {
    try {
      const messages = await chatService.getMessages(req.params.roomId);
      res.json(messages);
    } catch (error) {
      res.status(500).json({ error: 'Failed to fetch messages' });
    }
  });

  /**
   * @swagger
   * /api/chat/rooms/{roomId}/messages:
   *   post:
   *     summary: Send a message in a chat room
   *     tags: [Chat]
   *     security:
   *       - bearerAuth: []
   *     parameters:
   *       - in: path
   *         name: roomId
   *         required: true
   *         schema:
   *           type: string
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             type: object
   *             required:
   *               - content
   *               - userId
   *             properties:
   *               content:
   *                 type: string
   *               userId:
   *                 type: number
   *     responses:
   *       201:
   *         description: Message sent successfully
   *       500:
   *         description: Failed to send message
   */
  chatController.post('/rooms/:roomId/messages', async (req, res) => {
    try {
      const message = await chatService.sendMessage({
        ...req.body,
        roomId: req.params.roomId,
        senderId: req.body.userId,
      });
      res.status(201).json(message);
    } catch (error) {
      res.status(500).json({ error: 'Failed to send message' });
    }
  });

  /**
   * @swagger
   * /api/chat/rooms/{roomId}/messages/{messageId}/read:
   *   put:
   *     summary: Mark a message as read
   *     tags: [Chat]
   *     security:
   *       - bearerAuth: []
   *     parameters:
   *       - in: path
   *         name: roomId
   *         required: true
   *         schema:
   *           type: string
   *       - in: path
   *         name: messageId
   *         required: true
   *         schema:
   *           type: string
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             type: object
   *             required:
   *               - userId
   *             properties:
   *               userId:
   *                 type: number
   *     responses:
   *       200:
   *         description: Message marked as read
   *       500:
   *         description: Failed to mark message as read
   */
  chatController.put(
    '/rooms/:roomId/messages/:messageId/read',
    async (req, res) => {
      try {
        await chatService.markMessageAsRead(
          req.params.messageId,
          req.body.userId,
        );
        res.json({ success: true });
      } catch (error) {
        res.status(500).json({ error: 'Failed to mark message as read' });
      }
    },
  );

  /**
   * @swagger
   * /api/chat/rooms/{roomId}/join:
   *   post:
   *     summary: Join a chat room
   *     tags: [Chat]
   *     security:
   *       - bearerAuth: []
   *     parameters:
   *       - in: path
   *         name: roomId
   *         required: true
   *         schema:
   *           type: string
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             type: object
   *             required:
   *               - userId
   *             properties:
   *               userId:
   *                 type: number
   *     responses:
   *       200:
   *         description: Successfully joined room
   *       500:
   *         description: Failed to join room
   */
  chatController.post('/rooms/:roomId/join', async (req, res) => {
    try {
      await chatService.joinRoom(req.params.roomId, req.body.userId);
      res.json({ success: true });
    } catch (error) {
      res.status(500).json({ error: 'Failed to join room' });
    }
  });

  /**
   * @swagger
   * /api/chat/rooms/{roomId}/leave:
   *   post:
   *     summary: Leave a chat room
   *     tags: [Chat]
   *     security:
   *       - bearerAuth: []
   *     parameters:
   *       - in: path
   *         name: roomId
   *         required: true
   *         schema:
   *           type: string
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             type: object
   *             required:
   *               - userId
   *             properties:
   *               userId:
   *                 type: number
   *     responses:
   *       200:
   *         description: Successfully left room
   *       500:
   *         description: Failed to leave room
   */
  chatController.post('/rooms/:roomId/leave', async (req, res) => {
    try {
      await chatService.leaveRoom(req.params.roomId, req.body.userId);
      res.json({ success: true });
    } catch (error) {
      res.status(500).json({ error: 'Failed to leave room' });
    }
  });

  return chatController;
};
