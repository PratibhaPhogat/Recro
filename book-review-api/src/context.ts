import { PrismaClient } from '@prisma/client';
import { authenticate } from './utils/auth';

export const createContext = (prisma: PrismaClient, token: String) => {
  return {
    prisma,
    user: (async (token: string | undefined) => {
      if (token) {
        const user = authenticate(token);
        if (user) {
          return { id: (user as any).userId };
        }
      }
      return null;
    })(process.env.AUTH_TOKEN),
  };
};
