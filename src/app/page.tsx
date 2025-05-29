'use client';

import { useEffect, useState } from 'react';

export default function Home() {
  const [health, setHealth] = useState<{ status: string; timestamp: string } | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const checkHealth = async () => {
      try {
        const response = await fetch('/api/health');
        const data = await response.json();
        setHealth(data);
        setError(null);
      } catch (err) {
        setError('Errore nella comunicazione con il backend');
        console.error('Error fetching health:', err);
      }
    };

    checkHealth();
  }, []);

  return (
    <div className="min-h-screen bg-gray-100 py-6 flex flex-col justify-center sm:py-12">
      <div className="relative py-3 sm:max-w-xl sm:mx-auto">
        <div className="absolute inset-0 bg-gradient-to-r from-cyan-400 to-light-blue-500 shadow-lg transform -skew-y-6 sm:skew-y-0 sm:-rotate-6 sm:rounded-3xl"></div>
        <div className="relative px-4 py-10 bg-white shadow-lg sm:rounded-3xl sm:p-20">
          <div className="max-w-md mx-auto">
            <div className="divide-y divide-gray-200">
              <div className="py-8 text-base leading-6 space-y-4 text-gray-700 sm:text-lg sm:leading-7">
                <h1 className="text-2xl font-bold mb-8">Test Connessione Backend</h1>
                
                {error ? (
                  <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
                    <strong className="font-bold">Errore!</strong>
                    <span className="block sm:inline"> {error}</span>
                  </div>
                ) : health ? (
                  <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded relative">
                    <p><strong>Status:</strong> {health.status}</p>
                    <p><strong>Timestamp:</strong> {health.timestamp}</p>
                  </div>
                ) : (
                  <div className="text-center">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mx-auto"></div>
                    <p className="mt-2">Caricamento...</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 