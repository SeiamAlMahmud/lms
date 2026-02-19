import app from "./app";
import { env } from "./config/env";
import { prisma } from "./config/prisma";

const startServer = async () => {
  try {
    await prisma.$connect();
    console.log("MongoDB connected successfully");

    app.listen(env.PORT, () => {
      console.log(`Server is running on port ${env.PORT}`);
    });
  } catch (error) {
    console.error("Failed to start server", error);
    process.exit(1);
  }
};

process.on("SIGINT", async () => {
  await prisma.$disconnect();
  process.exit(0);
});

process.on("SIGTERM", async () => {
  await prisma.$disconnect();
  process.exit(0);
});

void startServer();
