import { PrismaClient } from '@prisma/client';
import { AuthenticationError } from 'apollo-server-express';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';

const JWT_SECRET = 'your_jwt_secret';

export const resolvers = {
  Query: {
    getBooks: async (_parent: any, _args: any, context: any) => {
      return context.prisma.book.findMany();
    },
    getBook: async (_parent: any, args: any, context: any) => {
      const id = parseInt(args.id, 10);
      return context.prisma.book.findUnique({ where: { id: id } });
    },
    getReviews: async (_parent: any, args: any, context: any) => {
      return context.prisma.review.findMany({ where: { bookId: args.bookId } });
    },
    getMyReviews: async (_parent: any, _args: any, context: any) => {
      if (!context.user) throw new AuthenticationError('Not authenticated');
      return context.prisma.review.findMany({ where: { userId: context.user.id } });
    },
  },
  Mutation: {
    register: async (_parent: any, args: any, context: any) => {
      const hashedPassword = await bcrypt.hash(args.password, 10);
      return context.prisma.user.create({
        data: { ...args, password: hashedPassword },
      });
    },
    login: async (_parent: any, args: any, context: any) => {
      const user = await context.prisma.user.findUnique({ where: { email: args.email } });
      if (!user || !(await bcrypt.compare(args.password, user.password))) {
        throw new AuthenticationError('Invalid credentials');
      }
      return jwt.sign({ userId: user.id }, JWT_SECRET, { expiresIn: '1h' });
    },
    addBook: async (_parent: any, args: any, context: any) => {
      if (!context.user) throw new AuthenticationError('Not authenticated');
      return context.prisma.book.create({ data: args });
    },
    addReview: async (_parent: any, args: any, context: any) => {
        console.log("======user ", context.user);
      if (!context.user) throw new AuthenticationError('Not authenticated');
      return context.prisma.review.create({
        data: { ...args, userId: context.user.id },
      });
    },
    updateReview: async (_parent: any, args: any, context: any) => {
      if (!context.user) throw new AuthenticationError('Not authenticated');
      return context.prisma.review.updateMany({
        where: { id: args.reviewId, userId: context.user.id },
        data: args,
      });
    },
    deleteReview: async (_parent: any, args: any, context: any) => {
      if (!context.user) throw new AuthenticationError('Not authenticated');
      await context.prisma.review.deleteMany({
        where: { id: args.reviewId, userId: context.user.id },
      });
      return true;
    },
  },
  User: {
    reviews: (parent: any, _args: any, context: any) => {
      return context.prisma.review.findMany({ where: { userId: parent.id } });
    },
  },
  Book: {
    reviews: (parent: any, _args: any, context: any) => {
      return context.prisma.review.findMany({ where: { bookId: parent.id } });
    },
  },
  Review: {
    user: (parent: any, _args: any, context: any) => {
      return context.prisma.user.findUnique({ where: { id: parent.userId } });
    },
    book: (parent: any, _args: any, context: any) => {
      return context.prisma.book.findUnique({ where: { id: parent.bookId } });
    },
  },
};
