import { useState, useEffect } from "react"

interface Metric {
  _id: string
  name: string
  team: string
  role: string
  timestamp: string
}

function App() {
  const [metrics, setMetrics] = useState<Metric[]>([])
  const [name, setName] = useState("")
  const [team, setTeam] = useState("")
  const [role, setRole] = useState("")
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [editingMetric, setEditingMetric] = useState<Metric | null>(null)

  useEffect(() => {
    fetchMetrics()
  }, [])

  const fetchMetrics = async () => {
    try {
      const response = await fetch("http://localhost:3000/api/metrics")
      if (!response.ok) throw new Error("Failed to fetch metrics")
      const data = await response.json()
      setMetrics(data)
      setLoading(false)
    } catch (err) {
      setError("Failed to fetch metrics")
      setLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      const metricData = {
        name,
        team,
        role,
      }

      const url = editingMetric
        ? `http://localhost:3000/api/metrics/${editingMetric._id}`
        : "http://localhost:3000/api/metrics"

      const response = await fetch(url, {
        method: editingMetric ? "PUT" : "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(metricData),
      })

      if (!response.ok) throw new Error("Failed to save metric")

      resetForm()
      fetchMetrics()
    } catch (err) {
      setError(
        editingMetric ? "Failed to update metric" : "Failed to add metric"
      )
    }
  }

  const deleteMetric = async (id: string) => {
    if (!window.confirm("Are you sure you want to delete this metric?")) return

    try {
      const response = await fetch(`http://localhost:3000/api/metrics/${id}`, {
        method: "DELETE",
      })

      if (!response.ok) throw new Error("Failed to delete metric")

      await fetchMetrics()
    } catch (err) {
      setError("Failed to delete metric")
    }
  }

  const editMetric = (metric: Metric) => {
    setEditingMetric(metric)
    setName(metric.name)
    setTeam(metric.team)
    setRole(metric.role)
    // Scroll to form
    window.scrollTo({ top: 0, behavior: "smooth" })
  }

  const resetForm = () => {
    setEditingMetric(null)
    setName("")
    setTeam("")
    setRole("")
    setError("")
  }

  if (loading) return <div className="text-center p-4">Loading...</div>

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6">Team Members Dashboard</h1>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4">
          {error}
          <button
            className="absolute top-0 right-0 px-4 py-3"
            onClick={() => setError("")}
          >
            ×
          </button>
        </div>
      )}

      {/* Member Form */}
      <div className="bg-white shadow-md rounded-lg p-6 mb-6">
        <h2 className="text-xl font-semibold mb-4">
          {editingMetric ? "Edit Team Member" : "Add New Team Member"}
        </h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Name
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              required
              placeholder="John Doe"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Team
            </label>
            <input
              type="text"
              value={team}
              onChange={(e) => setTeam(e.target.value)}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              required
              placeholder="Engineering"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Role
            </label>
            <input
              type="text"
              value={role}
              onChange={(e) => setRole(e.target.value)}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              required
              placeholder="Software Engineer"
            />
          </div>
          <div className="flex gap-2">
            <button
              type="submit"
              className="flex-1 bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            >
              {editingMetric ? "Update Member" : "Add Member"}
            </button>
            {editingMetric && (
              <button
                type="button"
                onClick={resetForm}
                className="bg-gray-500 text-white py-2 px-4 rounded-md hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
              >
                Cancel
              </button>
            )}
          </div>
        </form>
      </div>

      {/* Members List */}
      <div className="bg-white shadow-md rounded-lg overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-xl font-semibold">Team Members</h2>
        </div>
        <div className="divide-y divide-gray-200">
          {metrics.map((metric) => (
            <div key={metric._id} className="p-6">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="text-lg font-medium text-gray-900">
                    {metric.name}
                  </h3>
                  <p className="text-gray-600 mt-1">Team: {metric.team}</p>
                  <p className="text-gray-600">Role: {metric.role}</p>
                  <p className="text-sm text-gray-500 mt-1">
                    Added: {new Date(metric.timestamp).toLocaleString()}
                  </p>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => editMetric(metric)}
                    className="text-blue-500 hover:text-blue-700 font-medium"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => deleteMetric(metric._id)}
                    className="text-red-500 hover:text-red-700 font-medium"
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
          {metrics.length === 0 && (
            <div className="p-6 text-center text-gray-500">
              No team members found. Add some using the form above.
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default App
