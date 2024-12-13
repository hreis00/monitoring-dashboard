import Fastify from "fastify"
import fastifyCors from "@fastify/cors"

const fastify = Fastify({
  logger: {
    level: "debug",
    transport: {
      target: "pino-pretty",
    },
  },
})

const start = async () => {
  try {
    // Register CORS
    await fastify.register(fastifyCors, {
      origin: [
        "http://localhost:3001",
        "http://localhost",
        "http://localhost:80",
        "http://127.0.0.1:3001",
        "http://127.0.0.1",
        "http://127.0.0.1:80"
      ],
      methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
      credentials: true,
    })

    // API routes
    fastify.get("/api/status", async (request, reply) => {
      try {
        return {
          status: "healthy",
          timestamp: new Date().toISOString(),
          message: "Backend is running!",
        }
      } catch (error) {
        fastify.log.error(error)
        reply.status(500).send({ error: "Internal Server Error" })
      }
    })

    // Start the server
    await fastify.listen({ port: 3000, host: "0.0.0.0" })
    console.log("Server is running on port 3000")
  } catch (err) {
    fastify.log.error(err)
    process.exit(1)
  }
}

start().catch((err) => {
  console.error("Failed to start server:", err)
  process.exit(1)
})
