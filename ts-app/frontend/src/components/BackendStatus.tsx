import { useState, useEffect } from "react"

interface StatusResponse {
  status: string
  timestamp: string
  message: string
}

export function BackendStatus() {
  const [status, setStatus] = useState<StatusResponse | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchStatus = async () => {
      try {
        setLoading(true)

        const response = await fetch(`http://localhost:3000/api/status`)
        if (!response.ok) {
          throw new Error("Failed to fetch status")
        }
        const data = await response.json()
        setStatus(data)
        setError(null)
      } catch (err) {
        setError(err instanceof Error ? err.message : "An error occurred")
      } finally {
        setLoading(false)
      }
    }

    fetchStatus()
    // Set up polling every 30 seconds
    const interval = setInterval(fetchStatus, 30000)
    return () => clearInterval(interval)
  }, [])

  if (loading) {
    return (
      <div className="flex items-center justify-center space-x-2 text-purple-400">
        <div className="w-4 h-4 rounded-full animate-pulse bg-purple-400"></div>
        <div
          className="w-4 h-4 rounded-full animate-pulse bg-purple-400"
          style={{ animationDelay: "0.2s" }}
        ></div>
        <div
          className="w-4 h-4 rounded-full animate-pulse bg-purple-400"
          style={{ animationDelay: "0.4s" }}
        ></div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="bg-red-900/50 border border-red-700 rounded-lg p-4 text-red-300">
        <div className="font-semibold mb-1">Error</div>
        <div>{error}</div>
      </div>
    )
  }

  if (!status) {
    return (
      <div className="bg-yellow-900/50 border border-yellow-700 rounded-lg p-4 text-yellow-300">
        No status available
      </div>
    )
  }

  return (
    <div className="bg-gray-900/50 border border-gray-700 rounded-lg p-6 space-y-4">
      <h2 className="text-2xl font-semibold text-purple-400 mb-4">
        Backend Status
      </h2>
      <div className="space-y-3">
        <div className="flex items-center space-x-2">
          <span className="text-gray-400">Status:</span>
          <span
            className={
              status.status === "healthy" ? "text-green-400" : "text-red-400"
            }
          >
            {status.status}
          </span>
        </div>
        <div className="flex items-center space-x-2">
          <span className="text-gray-400">Last Updated:</span>
          <span className="text-purple-300">
            {new Date(status.timestamp).toLocaleString()}
          </span>
        </div>
        <div className="flex items-center space-x-2">
          <span className="text-gray-400">Message:</span>
          <span className="text-gray-300">{status.message}</span>
        </div>
      </div>
    </div>
  )
}
