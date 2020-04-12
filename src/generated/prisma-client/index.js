"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var prisma_lib_1 = require("prisma-client-lib");
var typeDefs = require("./prisma-schema").typeDefs;

var models = [
  {
    name: "Owner",
    embedded: false
  },
  {
    name: "PermAddress",
    embedded: false
  },
  {
    name: "Site",
    embedded: false
  },
  {
    name: "Bill",
    embedded: false
  },
  {
    name: "Payment",
    embedded: false
  }
];
exports.Prisma = prisma_lib_1.makePrismaClientClass({
  typeDefs,
  models,
  endpoint: `http://localhost:4466`
});
exports.prisma = new exports.Prisma();
