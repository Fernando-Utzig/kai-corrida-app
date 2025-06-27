
import React, { useState } from 'react';
import { Send, Mic, Image } from 'lucide-react';

const ChatWithKai = () => {
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([
    {
      id: 1,
      sender: 'kai',
      text: 'Olá! Eu sou o Kai, seu coach pessoal de corrida! 🐆 Como posso te ajudar hoje?',
      timestamp: '10:30'
    },
    {
      id: 2,
      sender: 'user',
      text: 'Oi Kai! Estou me sentindo desmotivado para correr hoje...',
      timestamp: '10:32'
    },
    {
      id: 3,
      sender: 'kai',
      text: 'Entendo perfeitamente! Todos passamos por dias assim. Que tal começarmos devagar? Uma caminhada rápida de 10 minutos pode ser o suficiente para reativar sua energia. O importante é manter o movimento! 💪',
      timestamp: '10:33'
    }
  ]);

  const handleSendMessage = () => {
    if (message.trim()) {
      const newMessage = {
        id: messages.length + 1,
        sender: 'user',
        text: message,
        timestamp: new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })
      };
      setMessages([...messages, newMessage]);
      setMessage('');
      
      // Simulate Kai's response
      setTimeout(() => {
        const kaiResponse = {
          id: messages.length + 2,
          sender: 'kai',
          text: 'Ótima pergunta! Como seu coach, recomendo que...',
          timestamp: new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })
        };
        setMessages(prev => [...prev, kaiResponse]);
      }, 1500);
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 flex flex-col">
      {/* Header */}
      <div className="bg-gray-800 border-b border-gray-700 p-4 lg:p-6">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center space-x-4">
            <div className="w-12 h-12 bg-orange-500 rounded-full flex items-center justify-center">
              <span className="text-2xl">🐆</span>
            </div>
            <div>
              <h1 className="text-xl font-bold text-white">Chat com o Kai</h1>
              <p className="text-gray-400 text-sm">Seu coach pessoal está online</p>
            </div>
          </div>
        </div>
      </div>

      {/* Chat Messages */}
      <div className="flex-1 overflow-y-auto p-4 lg:p-6">
        <div className="max-w-4xl mx-auto space-y-4">
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div className={`max-w-xs lg:max-w-md xl:max-w-lg ${msg.sender === 'user' ? 'order-2' : 'order-1'}`}>
                <div
                  className={`p-4 rounded-2xl ${
                    msg.sender === 'user'
                      ? 'bg-orange-500 text-white ml-4'
                      : 'bg-gray-800 text-gray-100 border border-gray-700'
                  }`}
                >
                  {msg.sender === 'kai' && (
                    <div className="flex items-center space-x-2 mb-2">
                      <span className="text-lg">🐆</span>
                      <span className="text-sm font-semibold text-orange-400">Kai</span>
                    </div>
                  )}
                  <p className="text-sm lg:text-base">{msg.text}</p>
                </div>
                <p className={`text-xs text-gray-500 mt-1 ${msg.sender === 'user' ? 'text-right mr-4' : 'ml-4'}`}>
                  {msg.timestamp}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Quick Suggestions */}
      <div className="bg-gray-800 border-t border-gray-700 p-4">
        <div className="max-w-4xl mx-auto">
          <p className="text-gray-400 text-sm mb-3">Sugestões rápidas:</p>
          <div className="flex flex-wrap gap-2">
            {[
              'Como melhorar meu pace?',
              'Plano para iniciantes',
              'Dicas de aquecimento',
              'Como evitar lesões?'
            ].map((suggestion, index) => (
              <button
                key={index}
                onClick={() => setMessage(suggestion)}
                className="bg-gray-700 hover:bg-gray-600 text-gray-300 px-3 py-2 rounded-full text-sm transition-colors"
              >
                {suggestion}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Message Input */}
      <div className="bg-gray-800 border-t border-gray-700 p-4 lg:p-6">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center space-x-4">
            <div className="flex-1 relative">
              <input
                type="text"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                placeholder="Digite sua mensagem para o Kai..."
                className="w-full bg-gray-700 border border-gray-600 rounded-full px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
              />
            </div>
            <div className="flex items-center space-x-2">
              <button className="p-3 text-gray-400 hover:text-orange-400 transition-colors">
                <Image size={20} />
              </button>
              <button className="p-3 text-gray-400 hover:text-orange-400 transition-colors">
                <Mic size={20} />
              </button>
              <button
                onClick={handleSendMessage}
                className="bg-orange-500 hover:bg-orange-600 text-white p-3 rounded-full transition-colors"
              >
                <Send size={20} />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatWithKai;
