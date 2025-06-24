import React from 'react'
import ApiStatus from '../components/ApiStatus'
import TailwindTest from '../components/TailwindTest'

const HomePage: React.FC = () => {
  return (
    <div className="container mx-auto px-4 py-8">
      <header className="text-center mb-12">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">
          Bienvenue sur Thales Project
        </h1>
        <p className="text-xl text-gray-600 max-w-2xl mx-auto">
          Une application moderne construite avec React, TypeScript, et Tailwind CSS
        </p>
      </header>

      <main className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-3">Frontend</h2>
          <ul className="text-gray-600 space-y-1">
            <li>• React 19</li>
            <li>• TypeScript</li>
            <li>• Vite</li>
            <li>• Tailwind CSS</li>
            <li>• React Router</li>
          </ul>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-3">Backend</h2>
          <ul className="text-gray-600 space-y-1">
            <li>• Fastify</li>
            <li>• TypeScript</li>
            <li>• Sequelize</li>
            <li>• MySQL</li>
            <li>• Swagger</li>
          </ul>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-3">Outils</h2>
          <ul className="text-gray-600 space-y-1">
            <li>• PNPM</li>
            <li>• ESLint</li>
            <li>• Architecture Scalable</li>
            <li>• Hot Reload</li>
          </ul>
        </div>
      </main>

      {/* Composant de statut de l'API */}
      <div className="max-w-md mx-auto mb-8">
        <ApiStatus />
      </div>

      {/* Test Tailwind CSS */}
      <div className="max-w-md mx-auto">
        <TailwindTest />
      </div>
    </div>
  )
}

export default HomePage
