import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { CheckCircle, Clock } from 'lucide-react';

const Countdown = () => {
  const navigate = useNavigate();
  // 15 minutes = 900 seconds
  const [timeLeft, setTimeLeft] = useState(900);
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    if (timeLeft <= 0) {
        setIsReady(true);
        return;
    }

    const timer = setInterval(() => {
        setTimeLeft(prev => prev - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [timeLeft]);

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  return (
    <div className={`min-h-screen flex flex-col items-center justify-center p-6 text-center transition-colors duration-500 ${isReady ? 'bg-green-50' : 'bg-gray-900'}`}>
        
        {isReady ? (
            <div className="animate-in zoom-in duration-500">
                <div className="w-24 h-24 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg shadow-green-200">
                    <CheckCircle className="w-12 h-12 text-white" />
                </div>
                <h1 className="text-3xl font-black text-gray-900 mb-2">Order Ready!</h1>
                <p className="text-gray-600 mb-8">Your food is ready to be served/picked up.</p>
                <button 
                    onClick={() => navigate('/home')}
                    className="bg-green-600 text-white px-8 py-3 rounded-xl font-bold hover:bg-green-700 transition-all"
                >
                    Order More
                </button>
            </div>
        ) : (
            <div>
                <div className="mb-8 relative">
                    <div className="w-48 h-48 rounded-full border-4 border-gray-700 flex items-center justify-center mx-auto">
                        <div className="text-5xl font-mono font-bold text-white tracking-widest">
                            {formatTime(timeLeft)}
                        </div>
                    </div>
                    <div className="absolute top-0 right-10 animate-bounce">
                        <Clock className="w-8 h-8 text-orange-500" />
                    </div>
                </div>
                
                <h1 className="text-2xl font-bold text-white mb-2">Preparing your food...</h1>
                <p className="text-gray-400 max-w-xs mx-auto">Sit tight! Our chefs are working their magic.</p>
                
                <div className="mt-12 w-full max-w-md bg-gray-800 rounded-full h-2 overflow-hidden">
                    <div 
                        className="h-full bg-orange-500 transition-all duration-1000 ease-linear"
                        style={{ width: `${((900 - timeLeft) / 900) * 100}%` }}
                    />
                </div>
            </div>
        )}

    </div>
  );
};

export default Countdown;
