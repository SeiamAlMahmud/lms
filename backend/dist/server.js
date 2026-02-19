"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const app_1 = __importDefault(require("./app"));
const env_1 = require("./config/env");
const prisma_1 = require("./config/prisma");
const startServer = async () => {
    try {
        await prisma_1.prisma.$connect();
        console.log("MongoDB connected successfully");
        app_1.default.listen(env_1.env.PORT, () => {
            console.log(`Server is running on port ${env_1.env.PORT}`);
        });
    }
    catch (error) {
        console.error("Failed to start server", error);
        process.exit(1);
    }
};
process.on("SIGINT", async () => {
    await prisma_1.prisma.$disconnect();
    process.exit(0);
});
process.on("SIGTERM", async () => {
    await prisma_1.prisma.$disconnect();
    process.exit(0);
});
void startServer();
