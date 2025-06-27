
import React from 'react';
import { Calendar, Target, CheckCircle, Clock, Zap } from 'lucide-react';

const MyPlan = () => {
  const weeklyPlan = [
    { day: 'Segunda', type: 'Corrida Leve', distance: '5 km', duration: '25-30 min', completed: true },
    { day: 'Terça', type: 'Treino Intervalado', distance: '6 km', duration: '35-40 min', completed: true },
    { day: 'Quarta', type: 'Descanso Ativo', distance: 'Caminhada', duration: '30 min', completed: false },
    { day: 'Quinta', type: 'Corrida Moderada', distance: '7 km', duration: '35-40 min', completed: false },
    { day: 'Sexta', type: 'Descanso', distance: '-', duration: '-', completed: false },
    { day: 'Sábado', type: 'Corrida Longa', distance: '12 km', duration: '60-70 min', completed: false },
    { day: 'Domingo', type: 'Recuperação', distance: '4 km', duration: '20-25 min', completed: false },
  ];

  const goals = [
    { title: 'Correr 5km em menos de 25 minutos', progress: 75, target: '23 de Fevereiro' },
    { title: 'Completar primeira corrida de 10km', progress: 40, target: '15 de Março' },
    { title: 'Correr 4 vezes por semana', progress: 85, target: 'Contínuo' },
  ];

  return (
    <div className="min-h-screen bg-gray-900 p-4 lg:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl lg:text-4xl font-bold text-white mb-2">
            Meu Plano de Treino 📅
          </h1>
          <p className="text-gray-400 text-lg">
            Seu plano personalizado criado pelo Kai para alcançar seus objetivos
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Weekly Plan */}
          <div className="lg:col-span-2">
            <div className="bg-gray-800 border border-gray-700 rounded-xl p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold text-white">Plano Semanal</h2>
                <div className="flex items-center space-x-2">
                  <Calendar className="w-5 h-5 text-orange-400" />
                  <span className="text-gray-400">15-21 Jan 2024</span>                 
                </div>
              </div>
              
              <div className="space-y-4">
                {weeklyPlan.map((day, index) => (
                  <div
                    key={index}
                    className={`p-4 rounded-lg border transition-all ${
                      day.completed
                        ? 'bg-green-900/20 border-green-700'
                        : index === 2
                        ? 'bg-orange-900/20 border-orange-700 ring-1 ring-orange-500'
                        : 'bg-gray-700 border-gray-600 hover:bg-gray-650'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4">
                        <div className="flex items-center space-x-2">
                          {day.completed ? (
                            <CheckCircle className="w-6 h-6 text-green-400" />
                          ) : index === 2 ? (
                            <Clock className="w-6 h-6 text-orange-400" />
                          ) : (
                            <div className="w-6 h-6 border-2 border-gray-400 rounded-full" />
                          )}
                          <span className="font-semibold text-white">{day.day}</span>
                        </div>
                        
                        <div>
                          <p className="text-gray-300 font-medium">{day.type}</p>
                          <div className="flex items-center space-x-4 text-sm text-gray-400">
                            <span>{day.distance}</span>
                            <span>•</span>
                            <span>{day.duration}</span>
                          </div>
                        </div>
                      </div>
                      
                      {index === 2 && (
                        <span className="text-orange-400 text-sm font-medium">Hoje</span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Goals & Progress */}
          <div className="space-y-6">
            {/* Kai's Message */}
            <div className="bg-gray-800 border border-gray-700 rounded-xl p-6">
              <div className="flex items-center space-x-3 mb-4">
                <div className="w-10 h-10 bg-orange-500 rounded-full flex items-center justify-center">
                  <span className="text-xl">🐆</span>
                </div>
                <h3 className="text-lg font-semibold text-white">Mensagem do Kai</h3>
              </div>
              <div className="bg-gray-700 rounded-lg p-4">
                <p className="text-gray-300">
                  "Ótimo trabalho nesta semana! Você completou 2 treinos. 
                  Hoje é dia de descanso ativo - uma caminhada leve vai ajudar 
                  na recuperação. Continue assim! 🚀"
                </p>
              </div>
            </div>

            {/* Goals */}
            <div className="bg-gray-800 border border-gray-700 rounded-xl p-6">
              <div className="flex items-center space-x-2 mb-6">
                <Target className="w-6 h-6 text-orange-400" />
                <h3 className="text-lg font-semibold text-white">Metas</h3>
              </div>
              
              <div className="space-y-4">
                {goals.map((goal, index) => (
                  <div key={index} className="bg-gray-700 rounded-lg p-4">
                    <div className="flex items-center justify-between mb-2">
                      <p className="text-white font-medium text-sm">{goal.title}</p>
                      <span className="text-orange-400 font-semibold">{goal.progress}%</span>
                    </div>
                    <div className="w-full bg-gray-600 rounded-full h-2 mb-2">
                      <div
                        className="bg-orange-500 h-2 rounded-full transition-all duration-500"
                        style={{ width: `${goal.progress}%` }}
                      />
                    </div>
                    <p className="text-gray-400 text-xs">Meta: {goal.target}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Weekly Stats */}
            <div className="bg-gray-800 border border-gray-700 rounded-xl p-6">
              <h3 className="text-lg font-semibold text-white mb-4">Estatísticas da Semana</h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Zap className="w-4 h-4 text-yellow-400" />
                    <span className="text-gray-300">Treinos Concluídos</span>
                  </div>
                  <span className="text-white font-semibold">2/5</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Target className="w-4 h-4 text-blue-400" />
                    <span className="text-gray-300">Km Percorridos</span>
                  </div>
                  <span className="text-white font-semibold">11.2 km</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Clock className="w-4 h-4 text-green-400" />
                    <span className="text-gray-300">Tempo Total</span>
                  </div>
                  <span className="text-white font-semibold">1h 15m</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MyPlan;
