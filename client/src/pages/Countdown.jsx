import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AppContext } from '../context/AppContext';
import { CheckCircle, Clock } from 'lucide-react';
import FeedbackModal from '../components/FeedbackModal';
import axios from 'axios';
import API_URL from '../config';

const Countdown = () => {
  const navigate = useNavigate();
  const { currentOrderId, user } = useContext(AppContext);
  // 15 minutes = 900 seconds (default)
  const [timeLeft, setTimeLeft] = useState(900);
  const [totalTime, setTotalTime] = useState(900);
  const [isReady, setIsReady] = useState(false);
  const [showFeedback, setShowFeedback] = useState(false);

  useEffect(() => {
    if (!currentOrderId) return;

    const fetchOrderAndPoll = async () => {
        try {
            const res = await axios.get(`${API_URL}/orders/${currentOrderId}`);
            const order = res.data;
            
            // Sync initial time based on server config
            if (order.completionConfig?.countDownSeconds && order.createdAt) {
                const fetchedTotal = order.completionConfig.countDownSeconds;
                setTotalTime(fetchedTotal); // Set total duration

                const createdTime = new Date(order.createdAt).getTime();
                const totalDuration = fetchedTotal * 1000;
                const expectedEndTime = createdTime + totalDuration;
                const now = Date.now();
                const remaining = Math.max(0, Math.floor((expectedEndTime - now) / 1000));
                
                setTimeLeft(remaining); 
            }

            if (order.status === 'Completed' || order.status === 'Ready') {
                setIsReady(true);
            }

            if (order.feedbackStatus === 'Requested' || order.status === 'Completed') {
                if (order.feedbackStatus !== 'Submitted' && order.feedbackStatus !== 'Skipped') {
                   setShowFeedback(true);
                }
            }
        } catch (error) {
            console.error("Polling error", error);
        }
    };

    fetchOrderAndPoll(); // Initial call
    
    const pollStatus = setInterval(fetchOrderAndPoll, 5000); // Check every 5 seconds

    return () => clearInterval(pollStatus);
  }, [currentOrderId]);

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
                        style={{ width: `${((totalTime - timeLeft) / totalTime) * 100}%` }}
                    />
                </div>
            </div>
        )}

        {showFeedback && currentOrderId && (
            <FeedbackModal 
                orderId={currentOrderId}
                userId={user?._id}
                onClose={() => setShowFeedback(false)}
            />
        )}

        {/* DEV ONLY: TRIGGER FEEDBACK */}
        <div className="fixed bottom-4 right-4 opacity-50 hover:opacity-100">
             <button 
                onClick={async () => {
                    await axios.put(`${API_URL}/orders/${currentOrderId}/status`, {
                        status: 'Completed',
                        feedbackStatus: 'Requested'
                    });
                    setIsReady(true);
                }}
                className="bg-gray-800 text-white text-xs px-2 py-1 rounded shadow-lg"
             >
                DEV: Complete Order
             </button>
        </div>

    </div>
  );
};

export default Countdown;
