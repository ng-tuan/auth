export const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';

type AuthEndpoints = {
  login: string;
  register: string;
  refresh: string;
};

type ApiEndpoints = {
  auth: AuthEndpoints;
};

type Config = {
  api: {
    baseUrl: string;
    endpoints: ApiEndpoints;
    headers: {
      'Content-Type': string;
      'Accept': string;
      'Origin': string;
    };
    credentials: RequestCredentials;
  };
};

export const config: Config = {
  api: {
    baseUrl: API_URL,
    endpoints: {
      auth: {
        login: '/api/auth/login',
        register: '/api/auth/register',
        refresh: '/api/auth/refresh',
      },
    },
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
      'Origin': 'http://localhost:3001',
    },
    credentials: 'include',
  },
};

type EndpointPath = 'auth.login' | 'auth.register' | 'auth.refresh';

export const getUrl = (path: EndpointPath, fullUrl: boolean = true): string => {
  const [category, endpoint] = path.split('.') as [keyof ApiEndpoints, keyof AuthEndpoints];
  const endpointPath = config.api.endpoints[category][endpoint];
  return fullUrl ? `${config.api.baseUrl}${endpointPath}` : endpointPath;
};

export const getHeaders = () => config.api.headers;
export const getCredentials = () => config.api.credentials; 