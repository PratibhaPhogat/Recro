"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const apollo_server_1 = require("apollo-server");
const typeDefs_1 = require("./graphql/typeDefs");
const resolvers_1 = require("./graphql/resolvers");
const context_1 = require("./context");
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
const server = new apollo_server_1.ApolloServer({
    typeDefs: typeDefs_1.typeDefs,
    resolvers: resolvers_1.resolvers,
    context: ({ req }) => {
        const token = req.headers.authorization || '';
        return (0, context_1.createContext)(prisma, token);
    },
});
server.listen({ port: 4000 }).then(({ url }) => {
    console.log(`Server ready at ${url}`);
});
