function App() {
  return (
    <main className="min-h-screen flex items-center justify-center bg-gradient-to-b from-blue-50 to-purple-50">
      <div className="text-center p-8 rounded-2xl shadow-lg bg-white">
        <h1 className="text-3xl md:text-4xl font-display font-extrabold">
          Young Minds @ Edura
        </h1>
        <p className="mt-2 text-gray-600">
          Fuel your world of endless imagination
        </p>
        <div className="mt-6 inline-flex gap-3">
          <button className="px-4 py-2 rounded-xl bg-blue-600 text-white hover:opacity-90">
            Express Yourself
          </button>
          <button className="px-4 py-2 rounded-xl bg-purple-600 text-white hover:opacity-90">
            Challenge Yourself
          </button>
          <button className="px-4 py-2 rounded-xl bg-emerald-600 text-white hover:opacity-90">
            Brainy Bites
          </button>
        </div>
      </div>
    </main>
  );
}

export default App
