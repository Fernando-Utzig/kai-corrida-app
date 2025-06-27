
import React from 'react';
import { Calendar, Clock, MapPin, TrendingUp } from 'lucide-react';

const MyRuns = () => {
  const runs = [
    {
      id: 1,
      date: '2024-01-15',
      distance: '5.2 km',
      duration: '26:30',
      pace: '5:05 min/km',
      location: 'Parque Ibirapuera',
      calories: 320
    },
    {
      id: 2,
      date: '2024-01-13',
      distance: '8.1 km',
      duration: '42:15',
      pace: '5:13 min/km',
      location: 'Marginal Pinheiros',
      calories: 485
    },
    {
      id: 3,
      date: '2024-01-10',
      distance: '3.8 km',
      duration: '19:45',
      pace: '5:12 min/km',
      location: 'Rua da Casa',
      calories: 230
    }
  ];

  return (
    <div className="min-h-screen bg-gray-900 p-4 lg:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl lg:text-4xl font-bold text-white mb-2">
            Minhas Corridas 🏃‍♂️
          </h1>
          <p className="text-gray-400 text-lg">
            Acompanhe seu histórico de corridas e evolução
          </p>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-gray-800 border border-gray-700 rounded-xl p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm">Total de Corridas</p>
                <p className="text-2xl font-bold text-white">47</p>
              </div>
              <TrendingUp className="w-8 h-8 text-green-400" />
            </div>
          </div>
          <div className="bg-gray-800 border border-gray-700 rounded-xl p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm">Distância Total</p>
                <p className="text-2xl font-bold text-white">234.7 km</p>
              </div>
              <MapPin className="w-8 h-8 text-blue-400" />
            </div>
          </div>
          <div className="bg-gray-800 border border-gray-700 rounded-xl p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm">Tempo Total</p>
                <p className="text-2xl font-bold text-white">18h 45m</p>
              </div>
              <Clock className="w-8 h-8 text-orange-400" />
            </div>
          </div>
        </div>

        {/* Runs List */}
        <div className="bg-gray-800 border border-gray-700 rounded-xl">
          <div className="p-6 border-b border-gray-700">
            <h2 className="text-xl font-semibold text-white">Histórico de Corridas</h2>
          </div>
          <div className="divide-y divide-gray-700">
            {runs.map((run) => (
              <div key={run.id} className="p-6 hover:bg-gray-750 transition-colors">
                <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
                  <div className="flex items-center space-x-6">
                    <div className="w-12 h-12 bg-orange-500 rounded-full flex items-center justify-center">
                      <span className="text-white font-semibold">{run.id}</span>
                    </div>
                    <div>
                      <div className="flex items-center space-x-2 mb-1">
                        <Calendar className="w-4 h-4 text-gray-400" />
                        <span className="text-white font-medium">
                          {new Date(run.date).toLocaleDateString('pt-BR')}
                        </span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <MapPin className="w-4 h-4 text-gray-400" />
                        <span className="text-gray-400">{run.location}</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-8">
                    <div className="text-center">
                      <p className="text-gray-400 text-sm">Distância</p>
                      <p className="text-white font-semibold">{run.distance}</p>
                    </div>
                    <div className="text-center">
                      <p className="text-gray-400 text-sm">Tempo</p>
                      <p className="text-white font-semibold">{run.duration}</p>
                    </div>
                    <div className="text-center">
                      <p className="text-gray-400 text-sm">Pace</p>
                      <p className="text-white font-semibold">{run.pace}</p>
                    </div>
                    <div className="text-center">
                      <p className="text-gray-400 text-sm">Calorias</p>
                      <p className="text-white font-semibold">{run.calories}</p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MyRuns;
