import fastify from "fastify"
import fastifyMongodb from "@fastify/mongodb"
import fastifyCors from "@fastify/cors"
import { config } from "dotenv"

// Load environment variables
config()

// Define interfaces
interface Metric {
  name: string
  team: string
  role: string
  timestamp: Date
}

interface MetricDocument extends Metric {
  _id: any
}

interface MetricQuery {
  name?: string
  team?: string
  role?: string
  startDate?: string
  endDate?: string
}

const server = fastify({
  logger: {
    level: "info",
    transport: {
      target: "pino-pretty",
    },
  },
})

// Register MongoDB plugin
server.register(fastifyMongodb, {
  url: process.env.MONGODB_URI || "mongodb://admin:password@mongodb:27017/metrics-db?authSource=admin",
  database: "metrics-db",
})

// Register CORS
server.register(fastifyCors, {
  origin: true,
  credentials: true,
})

// Health check endpoint
server.get("/api/status", async (request, reply) => {
  try {
    const mongoStatus = server.mongo.client ? "connected" : "disconnected"
    return {
      status: "ok",
      timestamp: new Date().toISOString(),
      mongodb: mongoStatus,
    }
  } catch (error) {
    server.log.error(error)
    reply.status(500).send({ error: "Internal Server Error" })
  }
})

// Create a new metric
server.post<{ Body: Metric }>("/api/metrics", async (request, reply) => {
  try {
    const collection = server.mongo.db?.collection("metrics")
    const metric = {
      ...request.body,
      timestamp: new Date(),
    }

    const result = await collection?.insertOne(metric)
    reply.code(201).send({ id: result?.insertedId, ...metric })
  } catch (error) {
    server.log.error(error)
    reply.status(500).send({ error: "Failed to create metric" })
  }
})

// Get all metrics with optional filtering
server.get<{ Querystring: MetricQuery }>("/api/metrics", async (request, reply) => {
  try {
    const collection = server.mongo.db?.collection("metrics")
    const { name, team, role, startDate, endDate } = request.query
    const query: any = {}

    if (name) query.name = name
    if (team) query.team = team
    if (role) query.role = role
    if (startDate || endDate) {
      query.timestamp = {}
      if (startDate) query.timestamp.$gte = new Date(startDate)
      if (endDate) query.timestamp.$lte = new Date(endDate)
    }

    const metrics = await collection
      ?.find(query)
      .sort({ timestamp: -1 })
      .limit(100)
      .toArray()

    reply.send(metrics)
  } catch (error) {
    server.log.error(error)
    reply.status(500).send({ error: "Failed to fetch metrics" })
  }
})

// Get a single metric by ID
server.get("/api/metrics/:id", async (request, reply) => {
  try {
    const collection = server.mongo.db?.collection("metrics")
    const id = (request.params as any).id
    
    const metric = await collection?.findOne({ 
      _id: new server.mongo.ObjectId(id) 
    })

    if (!metric) {
      reply.status(404).send({ error: "Metric not found" })
      return
    }

    reply.send(metric)
  } catch (error) {
    server.log.error(error)
    reply.status(500).send({ error: "Failed to fetch metric" })
  }
})

// Update a metric
server.put<{ Body: Metric }>("/api/metrics/:id", async (request, reply) => {
  try {
    const collection = server.mongo.db?.collection("metrics")
    const id = (request.params as any).id

    const updateData = {
      ...request.body,
      timestamp: new Date(),
    }

    const result = await collection?.findOneAndUpdate(
      { _id: new server.mongo.ObjectId(id) },
      { $set: updateData },
      { returnDocument: "after" }
    )

    if (!result?.value) {
      reply.status(404).send({ error: "Metric not found" })
      return
    }

    reply.send(result.value)
  } catch (error) {
    server.log.error(error)
    reply.status(500).send({ error: "Failed to update metric" })
  }
})

// Delete a metric
server.delete("/api/metrics/:id", async (request, reply) => {
  try {
    const collection = server.mongo.db?.collection("metrics")
    const id = (request.params as any).id

    const result = await collection?.findOneAndDelete({
      _id: new server.mongo.ObjectId(id)
    })

    if (!result?.value) {
      reply.status(404).send({ error: "Metric not found" })
      return
    }

    reply.send({ message: "Metric deleted successfully" })
  } catch (error) {
    server.log.error(error)
    reply.status(500).send({ error: "Failed to delete metric" })
  }
})

// Start server
const start = async () => {
  try {
    await server.listen({ port: 3000, host: "0.0.0.0" })
  } catch (err) {
    server.log.error(err)
    process.exit(1)
  }
}

start()
