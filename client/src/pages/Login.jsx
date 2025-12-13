import React, { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AppContext } from "../context/AppContext";
import { UtensilsCrossed } from "lucide-react";

const Login = () => {
  const [name, setName] = useState("");
  const [mobile, setMobile] = useState("");
  const [error, setError] = useState("");
  const { login } = useContext(AppContext);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name || !mobile) {
      setError("Please fill in all fields");
      return;
    }

    const success = await login(name, mobile);
    if (success) navigate("/home");
    else setError("Login failed. Please try again.");
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 bg-gradient-to-br from-orange-50 via-amber-50 to-red-50">

      {/* Card */}
      <div className="w-full max-w-sm rounded-3xl bg-white/80 backdrop-blur-xl border border-white/40 shadow-2xl p-8">

        {/* Logo */}
        <div className="flex flex-col items-center mb-8">
          <div className="w-14 h-14 flex items-center justify-center rounded-2xl bg-gradient-to-br from-orange-500 to-red-500 shadow-lg shadow-orange-200">
            <UtensilsCrossed className="w-7 h-7 text-white" />
          </div>

          <h1 className="mt-4 text-2xl font-extrabold text-gray-800 tracking-tight">
            Zink Zaika
          </h1>

          <p className="text-sm text-gray-500 mt-1 text-center">
            Delicious moments start here 🍴
          </p>
        </div>

        {/* Error */}
        {error && (
          <div className="mb-4 rounded-xl bg-red-50 text-red-600 text-sm px-4 py-2 text-center">
            {error}
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-5">

          {/* Name */}
          <div>
            <label className="text-xs font-semibold text-gray-600 uppercase">
              Full Name
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="John Doe"
              className="mt-2 w-full rounded-xl bg-gray-100 px-4 py-3 text-gray-800 outline-none border border-transparent focus:border-orange-400 focus:ring-2 focus:ring-orange-300 transition"
            />
          </div>

          {/* Mobile */}
          <div>
            <label className="text-xs font-semibold text-gray-600 uppercase">
              Mobile Number
            </label>
            <input
              type="tel"
              value={mobile}
              onChange={(e) => setMobile(e.target.value)}
              placeholder="98765 43210"
              className="mt-2 w-full rounded-xl bg-gray-100 px-4 py-3 text-gray-800 outline-none border border-transparent focus:border-orange-400 focus:ring-2 focus:ring-orange-300 transition"
            />
          </div>

          {/* Button */}
          <button
            type="submit"
            className="w-full mt-2 rounded-xl bg-gradient-to-r from-orange-500 to-red-500 py-3 font-semibold text-white shadow-lg shadow-orange-200 hover:brightness-110 active:scale-95 transition-all duration-200"
          >
            Continue to Menu 🍽️
          </button>
        </form>

        {/* Footer */}
        <p className="mt-6 text-center text-xs text-gray-400">
          By continuing, you agree to our Terms & Privacy Policy
        </p>
      </div>
    </div>
  );
};

export default Login;
