import React from 'react'
import { Link } from 'react-router-dom'

const Notfound: React.FC = () => {
  return (
    <div className="flex flex-col items-center justify-center h-[80vh] px-4">
      <div className="text-center">
        <h1 className="text-8xl font-bold text-[#1c2434] dark:text-bodydark1">404</h1>
        <h2 className="text-2xl font-semibold text-gray-800 dark:text-bodydark1 mt-2">Page Not Found</h2>
        <p className="font-medium text-gray-600 dark:text-bodydark1 mt-6 mb-6">Désolé, la page que vous recherchez n'existe pas ou a été déplacée</p>
        <Link to="/dashboard" className="bg-[#1c2434] text-bodydark1 px-6 py-3 rounded-md hover:bg-opacity-95 transition-colors">Retour au tableau de bord</Link>
      </div>
    </div>
  )
}

export default Notfound