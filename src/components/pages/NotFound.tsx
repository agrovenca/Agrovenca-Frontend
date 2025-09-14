import { Link } from 'react-router-dom'
import { Leaf } from 'lucide-react'

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-green-50 dark:bg-gray-900 text-center p-6">
      <Leaf className="w-20 h-20 text-green-600 dark:text-green-500 mb-4" />

      <h1 className="text-6xl font-bold text-green-800">404</h1>
      <p className="mt-4 text-xl text-green-700">¡Ups! Esta parcela está vacía 🌱</p>
      <p className="mt-2 text-gray-600 dark:text-gray-400">
        No encontramos la página que buscas. Tal vez quieras volver al campo principal.
      </p>

      <div className="mt-6 flex gap-4">
        <Link
          to="/"
          className="px-6 py-3 rounded-2xl bg-green-600 text-white font-semibold shadow hover:bg-green-700 transition"
        >
          Volver al inicio
        </Link>
        <Link
          to="/products"
          className="px-6 py-3 rounded-2xl border border-green-600 text-green-700 font-semibold hover:bg-green-100 transition"
        >
          Ver productos
        </Link>
      </div>
    </div>
  )
}
