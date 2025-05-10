const Loader = () => {
  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-gray-600 to-gray-700">
      <div className="relative flex flex-col items-center">

        {/* Circular Loader Animation */}
        <div className="relative flex items-center justify-center">

          {/* Rotating loader with starburst effect */}
          <div className="absolute w-56 h-56 rounded-full">
            <div className="absolute inset-0 rounded-full border-4 border-transparent border-t-indigo-500 border-r-indigo-400 animate-spin-slow"></div>
            
            {/* Starburst particles */}
            {[...Array(12)].map((_, i) => (
              <div 
                key={i} 
                className="absolute w-8 h-8 bg-indigo-300 rounded-full"
                style={{
                  top: '6px',
                  left: '50%',
                  transform: `rotate(${i * 60}deg) translateY(-140px)`,
                  opacity: 0,
                }}
              />
            ))}
          </div>

                  {/* Logo with background and fade-in - MODIFIED SECTION */}
                  <div className="relative flex items-center justify-center h-48 w-48 rounded-full bg-gray-600 z-10 overflow-hidden">
            {/* Radiating Rings */}
            <div className="absolute inset-0 rounded-full border-4 border-indigo-400/30 animate-radiate"></div>
            <div className="absolute inset-0 rounded-full border-4 border-indigo-300/30 animate-radiate animation-delay-1000"></div>
            <div className="absolute inset-0 rounded-full border-4 border-indigo-200/30 animate-radiate animation-delay-2000"></div>
            
            <img
              src="/AcctAbility_transparent.png"
              alt="AcctAbility Logo"
              className="h-48 object-contain opacity-80 animate-fade-in"
            />
          </div>
        </div>

        {/* Dots indicator */}
        <div className="mt-8 flex space-x-2">
          {[0, 1, 2].map((dot) => (
            <div
              key={dot}
              className="h-2 w-2 rounded-full bg-indigo-500 animate-pulse"
              style={{
                animationDelay: `${dot * 200}ms`,
                animationDuration: '1.4s',
              }}
            />
          ))}
        </div>
      </div>

      {/* Animation CSS */}
      <style>{`
        @keyframes fade-in {
          0% {
            opacity: 0;
            transform: scale(0.95);
          }
          100% {
            opacity: 1;
            transform: scale(1);
          }
        }

        .animate-fade-in {
          animation: fade-in 0.6s ease-out forwards;
        }

        @keyframes spin-slow {
          0% {
            transform: rotate(0deg);
          }
          80% {
            transform: rotate(324deg);
            border-width: 4px;
          }
          85% {
            transform: rotate(345deg);
            border-width: 6px;
          }
          90% {
            transform: rotate(355deg);
            border-width: 4px;
          }
          100% {
            transform: rotate(360deg);
          }
        }

        .animate-spin-slow {
          animation: spin-slow 4s linear infinite;
        }

        /* Gooey Effect Styles */
        .filter-gooey {
          filter: url('#gooey');
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
        }

        .gooey-ring {
          position: absolute;
          width: 100%;
          height: 100%;
          top: 0;
          left: 0;
        }

        .ring-1 {
          animation: rotate-ring 2s linear infinite;
        }

        .ring-2 {
          animation: rotate-ring-reverse 2s linear infinite;
        }

        .gooey-blob {
          position: absolute;
          background: rgba(125, 99, 255, 0.7);
          border-radius: 50%;
          transform-origin: center;
          width: 25px;
          height: 25px;
        }

        /* First ring blobs */
        .ring-1 .gooey-blob {
          width: 28px;
          height: 28px;
          top: calc(50% - 14px);
          left: calc(50% - 14px);
          transform-origin: 30px 0;
          animation: orbit 2s linear infinite;
        }

        /* Second ring blobs */
        .ring-2 .gooey-blob {
          width: 22px;
          height: 22px;
          top: calc(50% - 11px);
          left: calc(50% - 11px);
          transform-origin: 35px 0;
          animation: orbit-reverse 2s linear infinite;
        }

        @keyframes rotate-ring {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }

        @keyframes rotate-ring-reverse {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(-360deg); }
        }

        @keyframes orbit {
          0% {
            transform: rotate(0deg) translateX(80px) rotate(0deg);
            background: rgba(125, 99, 255, 0.7);
          }
          50% {
            background: rgba(99, 179, 255, 0.8);
          }
          100% {
            transform: rotate(360deg) translateX(80px) rotate(-360deg);
            background: rgba(125, 99, 255, 0.7);
          }
        }

        @keyframes orbit-reverse {
          0% {
            transform: rotate(0deg) translateX(65px) rotate(0deg);
            background: rgba(147, 99, 255, 0.7);
          }
          50% {
            background: rgba(186, 99, 255, 0.8);
          }
          100% {
            transform: rotate(-360deg) translateX(65px) rotate(360deg);
            background: rgba(147, 99, 255, 0.7);
          }
        }
          /* New Radiating Effect */
        @keyframes radiate {
          0% {
            opacity: 1;
            transform: scale(1);
          }
          100% {
            opacity: 0;
            transform: scale(1.5);
          }
        }
        
        .animate-radiate {
          animation: radiate 3s cubic-bezier(0.4, 0, 0.6, 1) infinite;
        }
        
        .animation-delay-1000 {
          animation-delay: 1s;
        }
        
        .animation-delay-2000 {
          animation-delay: 2s;
        }
      `}</style>
    </div>
  );
};

export default Loader;