import { BackendStatus } from "./components/BackendStatus"

function App() {
  return (
    <div className="min-h-screen bg-gray-900 py-6 flex flex-col justify-center sm:py-12">
      <div className="relative py-3 sm:max-w-xl sm:mx-auto">
        <div className="relative px-4 py-10 bg-gray-800 shadow-xl sm:rounded-3xl sm:p-20 border border-gray-700">
          <div className="max-w-md mx-auto">
            <div className="divide-y divide-gray-700">
              <div className="py-8 text-base leading-6 space-y-4 text-gray-300 sm:text-lg sm:leading-7">
                <h1 className="text-3xl font-bold text-purple-400 mb-8">
                  Monitoring Dashboard
                </h1>
                <BackendStatus />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default App
