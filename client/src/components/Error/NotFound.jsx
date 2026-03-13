import { motion } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import { Home, ArrowLeft } from 'lucide-react';

export default function NotFound() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen w-full bg-[#f8fafc] flex items-center justify-center p-6 overflow-hidden relative">
      <div
        className="absolute inset-0 z-0 pointer-events-none"
        style={{
          backgroundImage: `
            linear-gradient(to right, #e2e8f0 1px, transparent 1px),
            linear-gradient(to bottom, #e2e8f0 1px, transparent 1px)
          `,
          backgroundSize: "20px 30px",
          WebkitMaskImage:
            "radial-gradient(ellipse 70% 60% at 50% 50%, #000 60%, transparent 100%)",
          maskImage:
            "radial-gradient(ellipse 70% 60% at 50% 50%, #000 60%, transparent 100%)",
        }}
      />

      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="max-w-md w-full text-center relative z-10"
      >
        <motion.div
          initial={{ scale: 0.8, opacity: 0, y: 20 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.1, ease: "backOut" }}
        >
          <h1 className="text-9xl font-extrabold tracking-tighter text-transparent bg-clip-text bg-gradient-to-br from-slate-400 to-slate-900 pointer-events-none select-none drop-shadow-sm">
            404
          </h1>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="mt-6 space-y-3"
        >
          <h2 className="text-3xl font-semibold tracking-tight text-slate-900">Lost in the Clouds</h2>
          <p className="text-slate-500 text-sm md:text-base max-w-[280px] mx-auto">
            The page you are looking for has drifted away or doesn't exist. Let's get you back.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.5 }}
          className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4"
        >
          <button 
            onClick={() => navigate(-1)} 
            className="flex items-center justify-center w-full sm:w-auto gap-2 px-6 py-3 bg-slate-900 text-white font-medium rounded-xl hover:bg-slate-800 transition-colors shadow-md hover:shadow-lg focus:ring-4 focus:ring-slate-300 outline-none"
          >
            <ArrowLeft className="w-4 h-4" />
            Go Back
          </button>
          
          <Link to="/" className="w-full sm:w-auto">
            <button className="flex items-center justify-center w-full sm:w-auto gap-2 px-6 py-3 bg-white text-slate-700 font-medium rounded-xl hover:bg-slate-50 transition-colors ring-1 ring-slate-200 hover:ring-slate-300 shadow-sm focus:ring-4 focus:ring-slate-100 outline-none">
              <Home className="w-4 h-4" />
              Home
            </button>
          </Link>
        </motion.div>
      </motion.div>
    </div>
  );
}
