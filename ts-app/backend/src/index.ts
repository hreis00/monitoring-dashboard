import Fastify from "fastify"
import fastifyCors from "@fastify/cors"
import fastifyMongodb from "@fastify/mongodb"
import { config } from "dotenv"
import { ObjectId } from "mongodb"

// Load environment variables
config()

// Define interfaces
interface Metric {
  name: string
  value: number
  timestamp: Date
  tags?: Record<string, string>
}

interface QueryParams {
  name?: string
  startDate?: string
  endDate?: string
  tags?: Record<string, string>
}

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
    // Register MongoDB
    await fastify.register(fastifyMongodb, {
      url: process.env.MONGODB_URI,
      database: "metrics-db"
    })

    // Register CORS
    await fastify.register(fastifyCors, {
      origin: [
        "http://localhost:3001",
        "http://localhost",
        "http://localhost:80",
        "http://127.0.0.1:3001",
        "http://127.0.0.1",
        "http://127.0.0.1:80",
      ],
      methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
      credentials: true,
    })

    // Health check endpoint
    fastify.get("/api/status", async (request, reply) => {
      try {
        const mongoStatus = fastify.mongo.client ? "connected" : "disconnected"
        return {
          status: "healthy",
          timestamp: new Date().toISOString(),
          message: "Backend is running!",
          mongodb: mongoStatus
        }
      } catch (error) {
        fastify.log.error(error)
        reply.status(500).send({ error: "Internal Server Error" })
      }
    })

    // Create new metric
    fastify.post<{ Body: Metric }>("/api/metrics", async (request, reply) => {
      const { name, value, tags } = request.body
      const metric = {
        name,
        value,
        tags,
        timestamp: new Date()
      }

      const result = await fastify.mongo.db?.collection("metrics").insertOne(metric)
      reply.code(201).send({ id: result?.insertedId, ...metric })
    })

    // Query metrics
    fastify.get<{ Querystring: QueryParams }>("/api/metrics", async (request, reply) => {
      const { name, startDate, endDate, tags } = request.query
      const query: any = {}

      if (name) query.name = name
      if (startDate || endDate) {
        query.timestamp = {}
        if (startDate) query.timestamp.$gte = new Date(startDate)
        if (endDate) query.timestamp.$lte = new Date(endDate)
      }
      if (tags) query.tags = { $all: Object.entries(tags).map(([k, v]) => ({ [k]: v })) }

      const metrics = await fastify.mongo.db?.collection("metrics")
        .find(query)
        .sort({ timestamp: -1 })
        .limit(100)
        .toArray()

      reply.send(metrics)
    })

    // Get metrics statistics
    fastify.get("/api/metrics/stats", async (request, reply) => {
      const pipeline = [
        {
          $group: {
            _id: "$name",
            count: { $sum: 1 },
            avgValue: { $avg: "$value" },
            minValue: { $min: "$value" },
            maxValue: { $max: "$value" },
            lastTimestamp: { $max: "$timestamp" }
          }
        }
      ]

      const stats = await fastify.mongo.db?.collection("metrics")
        .aggregate(pipeline)
        .toArray()

      reply.send(stats)
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
