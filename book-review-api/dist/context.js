"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createContext = void 0;
const jwt = require('jsonwebtoken');
const auth_1 = require("./utils/auth");
const createContext = (prisma, token) => {
    try {
      if (token) {
        const bearer_token = token?.replace('Bearer ', '');
        const decoded = jwt.verify(bearer_token, '2646f687d975b2909aff2886c50ce4c51cabfe8d19d20c569b53ddd8bb0f47a12225125adc888f4afad9879cbe6aa5ed2a2628aa53c120e7666b0a799c4a937e'); // Replace with your actual secret key
        return { prisma, user: decoded };
      }
      return { prisma, user: null };
    } catch (err) {
        console.log("==========error ", err);
    }
  };
exports.createContext = createContext;
