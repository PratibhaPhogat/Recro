"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.typeDefs = void 0;
const apollo_server_express_1 = require("apollo-server-express");
exports.typeDefs = (0, apollo_server_express_1.gql) `
  directive @auth on FIELD_DEFINITION

  type User {
    id: ID!
    username: String!
    email: String!
    reviews: [Review!]!
  }

  type Book {
    id: ID!
    title: String!
    author: String!
    publishedYear: Int!
    reviews: [Review!]!
  }

  type Review {
    id: ID!
    user: User!
    book: Book!
    rating: Int!
    comment: String!
    createdAt: String!
  }

  type Query {
    getBooks: [Book!]!
    getBook(id: ID!): Book
    getReviews(bookId: ID!): [Review!]!
    getMyReviews: [Review!]! @auth
  }

  type Mutation {
    register(username: String!, email: String!, password: String!): User!
    login(email: String!, password: String!): String! # JWT Token
    addBook(title: String!, author: String!, publishedYear: Int!): Book! @auth
    addReview(bookId: ID!, rating: Int!, comment: String!): Review! @auth
    updateReview(reviewId: ID!, rating: Int, comment: String): Review! @auth
    deleteReview(reviewId: ID!): Boolean! @auth
  }
`;
