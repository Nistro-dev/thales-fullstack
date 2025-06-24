import React from 'react'

const TailwindTest: React.FC = () => {
  return (
    <div className="max-w-sm mx-auto bg-white rounded-xl shadow-lg overflow-hidden m-4">
      <div className="px-6 py-4">
        <div className="font-bold text-xl mb-2 text-blue-600">Tailwind CSS Test</div>
        <p className="text-gray-700 text-base">
          Si tu vois ce composant stylé avec des couleurs et des ombres, 
          alors Tailwind CSS fonctionne parfaitement ! 🎉
        </p>
      </div>
      <div className="px-6 pt-4 pb-2">
        <span className="inline-block bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full font-semibold mr-2 mb-2">
          #tailwind
        </span>
        <span className="inline-block bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full font-semibold mr-2 mb-2">
          #css
        </span>
        <span className="inline-block bg-purple-100 text-purple-800 text-xs px-2 py-1 rounded-full font-semibold mr-2 mb-2">
          #working
        </span>
      </div>
      <div className="bg-gradient-to-r from-blue-500 to-purple-600 p-4">
        <button className="bg-white text-blue-600 font-bold py-2 px-4 rounded-lg hover:bg-gray-100 transition-colors duration-200 w-full">
          Test Button avec Hover
        </button>
      </div>
    </div>
  )
}

export default TailwindTest
