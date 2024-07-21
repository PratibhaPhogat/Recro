"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.resolvers = void 0;
const apollo_server_express_1 = require("apollo-server-express");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const JWT_SECRET = '2646f687d975b2909aff2886c50ce4c51cabfe8d19d20c569b53ddd8bb0f47a12225125adc888f4afad9879cbe6aa5ed2a2628aa53c120e7666b0a799c4a937e';
exports.resolvers = {
    Query: {
        getBooks: async (_parent, _args, context) => {
            return context.prisma.book.findMany();
        },
        getBook: async (_parent, args, context) => {
            const id = parseInt(args.id, 10);
            return context.prisma.book.findUnique({ where: { id: id } });
        },
        getReviews: async (_parent, args, context) => {
            return context.prisma.review.findMany({ where: { bookId: parseInt(args.bookId) } });
        },
        getMyReviews: async (_parent, _args, context) => {
            if (!context.user)
                throw new apollo_server_express_1.AuthenticationError('Not authenticated');
            return context.prisma.review.findMany({ where: { userId: context.user.userId } });
        },
    },
    Mutation: {
        register: async (_parent, args, context) => {
            const hashedPassword = await bcryptjs_1.default.hash(args.password, 10);
            return context.prisma.user.create({
                data: { ...args, password: hashedPassword },
            });
        },
        login: async (_parent, args, context) => {
            const user = await context.prisma.user.findUnique({ where: { email: args.email } });
            if (!user || !(await bcryptjs_1.default.compare(args.password, user.password))) {
                throw new apollo_server_express_1.AuthenticationError('Invalid credentials');
            }
            return jsonwebtoken_1.default.sign({ userId: user.id }, JWT_SECRET, { expiresIn: '1h' });
        },
        addBook: async (_parent, args, context) => {
            if (!context.user)
                throw new apollo_server_express_1.AuthenticationError('Not authenticated');
            return context.prisma.book.create({ data: args });
        },
        addReview: async (_parent, args, context) => {
            if (!context.user)
                throw new apollo_server_express_1.AuthenticationError('Not authenticated');
            // Ensure `context.user.id` exists in the User table
            const user = await context.prisma.user.findUnique({
                where: { id: context.user.userId },
            });

            if (!user) {
                throw new AuthenticationError('Invalid user');
            }

            // Ensure `args.bookId` exists in the Book table
            const book = await context.prisma.book.findUnique({
                where: { id: parseInt(args.bookId) },
            });

            if (!book) {
                throw new Error('Book does not exist');
            }

            return context.prisma.review.create({
                data: {
                ...args,
                bookId: parseInt(args.bookId),
                userId: context.user.userId,
                },
            });
        },
        updateReview: async (_parent, args, context) => {
            if (!context.user)
                throw new apollo_server_express_1.AuthenticationError('Not authenticated');
            return context.prisma.review.update({
                where: { id: parseInt(args.reviewId), userId: context.user.userId },
                data: {
                    id: parseInt(args.reviewId),
                    rating: args?.rating,
                    comment: args?.comment,
                }
            });
        },
        deleteReview: async (_parent, args, context) => {
            if (!context.user)
                throw new apollo_server_express_1.AuthenticationError('Not authenticated');
            await context.prisma.review.deleteMany({
                where: { id: parseInt(args.reviewId), userId: context.user.userId },
            });
            return true;
        },
    },
    User: {
        reviews: (parent, _args, context) => {
            return context.prisma.review.findMany({ where: { userId: parent.id } });
        },
    },
    Book: {
        reviews: (parent, _args, context) => {
            return context.prisma.review.findMany({ where: { bookId: parent.id } });
        },
    },
    Review: {
        user: (parent, _args, context) => {
            return context.prisma.user.findUnique({ where: { id: parent.userId } });
        },
        book: (parent, _args, context) => {
            return context.prisma.book.findUnique({ where: { id: parent.bookId } });
        },
    },
};
