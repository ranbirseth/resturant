import React, { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AppContext } from "../context/AppContext";
import { Coffee } from "lucide-react";

const Login = () => {
  const [name, setName] = useState("");
  const [mobile, setMobile] = useState("");
  const [error, setError] = useState("");
  const [isNewUser, setIsNewUser] = useState(null); // null, true, false

  const { login, checkUserExist } = useContext(AppContext);
  const navigate = useNavigate();

  const handleMobileBlur = async () => {
    if (mobile.length === 10) {
        const exists = await checkUserExist(mobile);
        setIsNewUser(!exists);
    } else {
        setIsNewUser(null);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name || !mobile) {
      setError("Please enter your name and mobile number");
      return;
    }
    const success = await login(name, mobile);
    if (success) navigate("/home");
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-amber-50 via-orange-50 to-yellow-100 px-4">
      
      {/* Glass Card */}
      <div className="w-full max-w-sm bg-white/80 backdrop-blur-xl border border-amber-100 rounded-3xl shadow-2xl p-8">
        
        {/* Logo */}
        <div className="flex flex-col items-center mb-8">
          <div className="w-16 h-16 rounded-full bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center shadow-lg shadow-amber-300">
            <Coffee className="text-white w-8 h-8" />
          </div>
          <h1 className="mt-4 text-2xl font-bold text-gray-800">
            Zing Zaika
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            Café & Restaurant
          </p>
        </div>

        {/* Error */}
        {error && (
          <div className="mb-4 text-center text-sm text-red-500 bg-red-50 py-2 rounded-xl">
            {error}
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          
          <div>
            <label className="text-sm font-medium text-gray-700">
              Full Name
            </label>
            <input
              type="text"
              placeholder="Your name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="mt-1 w-full px-4 py-3 rounded-xl bg-gray-50 border border-gray-200 focus:ring-2 focus:ring-amber-400 focus:outline-none"
            />
          </div>

          <div>
            <label className="text-sm font-medium text-gray-700">
              Mobile Number
            </label>
            <input
              type="tel"
              placeholder="10 digit mobile number"
              value={mobile}
              onChange={(e) => setMobile(e.target.value)}
              onBlur={handleMobileBlur}
              className={`mt-1 w-full px-4 py-3 rounded-xl bg-gray-50 border focus:outline-none transition-all ${
                  isNewUser === true ? 'border-green-400 focus:ring-2 focus:ring-green-200' : 
                  isNewUser === false ? 'border-amber-200 focus:ring-2 focus:ring-amber-400' :
                  'border-gray-200 focus:ring-2 focus:ring-amber-400'
              }`}
            />
            {isNewUser === true && (
                <div className="mt-2 text-sm text-green-600 font-bold bg-green-50 p-2 rounded-lg animate-bounce">
                    🎉 First time? Use 'WELCOME10' for 10% OFF!
                </div>
            )}
            {isNewUser === false && (
                <p className="mt-2 text-sm text-gray-500">
                    Welcome back, foodie! 🍕
                </p>
            )}
          </div>

          <button
            type="submit"
            className="w-full mt-2 bg-gradient-to-r from-amber-500 to-orange-600 text-white py-3 rounded-xl font-semibold shadow-lg shadow-amber-300 hover:scale-[1.02] active:scale-95 transition"
          >
            Enter Café 🍽️
          </button>
        </form>

        {/* Footer */}
        <p className="text-xs text-center text-gray-500 mt-6">
          By continuing, you agree to our{" "}
          <span className="text-amber-600 font-medium">
            Terms & Privacy Policy
          </span>
        </p>
      </div>
    </div>
  );
};

export default Login;
