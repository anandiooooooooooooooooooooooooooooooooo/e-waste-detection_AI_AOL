import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

export default function Loading() {
  const navigate = useNavigate();
  const location = useLocation();
  const resultData = location.state?.resultData;

  const [currentStep, setCurrentStep] = useState(0);
  const steps = [
    "Detecting components...",
    "Analyzing materials...",
    "Calculating value...",
  ];

  useEffect(() => {
    if (!resultData) {
      navigate("/", { replace: true }); // no data, go home
      return;
    }

    const interval = setInterval(() => {
      setCurrentStep((prev) => {
        if (prev < steps.length - 1) return prev + 1;
        clearInterval(interval);
        return prev;
      });
    }, 1500);

    const timer = setTimeout(() => {
      navigate("/result", { state: { resultData } });
    }, 5000);

    return () => {
      clearInterval(interval);
      clearTimeout(timer);
    };
  }, [navigate, resultData]);

  return (
    <div className="bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 min-h-screen flex items-center justify-center p-4">
      <div className="w-full max-w-md text-center">
        {/* Animated Scanner */}
        <div className="mb-12 flex justify-center relative w-32 h-32 mx-auto">
          <div className="absolute inset-0 rounded-full border-2 border-transparent border-t-green-500 border-r-green-500 animate-spin-slow"></div>
          <div className="absolute inset-2 rounded-full border border-green-500 opacity-50"></div>
          <div className="absolute inset-4 rounded-full bg-gradient-to-b from-green-500/20 to-transparent flex items-center justify-center overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-b from-green-400 to-transparent opacity-30 animate-scan-line"></div>
            <svg
              className="w-12 h-12 text-green-400"
              fill="currentColor"
              viewBox="0 0 24 24"
            >
              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.42 0-8-3.58-8-8s3.58-8 8-8 8 3.58 8 8-3.58 8-8 8zm3.5-9c.83 0 1.5-.67 1.5-1.5S16.33 8 15.5 8 14 8.67 14 9.5s.67 1.5 1.5 1.5zm-7 0c.83 0 1.5-.67 1.5-1.5S9.33 8 8.5 8 7 8.67 7 9.5 7.67 11 8.5 11zm3.5 6.5c2.33 0 4.31-1.46 5.11-3.5H6.89c.8 2.04 2.78 3.5 5.11 3.5z" />
            </svg>
          </div>
          <div className="absolute inset-0 rounded-full border border-green-500 animate-pulse-ring"></div>
        </div>
        {/* Status Text */}
        <h2 className="text-3xl font-bold text-white mb-2">
          Analyzing E-Waste
        </h2>
        <p className="text-slate-400 mb-8 text-sm">
          Our AI is scanning your image for components and materials...
        </p>
        {/* Progress Bar */}
        <div className="mb-8">
          <div className="h-1 bg-slate-700 rounded-full overflow-hidden">
            <div className="h-full bg-gradient-to-r from-green-500 to-emerald-400 w-full animate-progress-bar"></div>
          </div>
        </div>
        {/* Processing Steps */}
        <div className="space-y-3 mb-8">
          {steps.map((step, index) => (
            <div
              key={index}
              className={`flex items-center gap-3 ${
                index <= currentStep ? "text-slate-300" : "text-slate-400"
              }`}
            >
              <div
                className={`w-2 h-2 rounded-full ${
                  index <= currentStep
                    ? "bg-green-500 animate-pulse"
                    : "bg-slate-600"
                }`}
              ></div>
              <span className="text-sm">{step}</span>
            </div>
          ))}
        </div>
        {/* Floating particles */}
        <div className="flex justify-center gap-4 mb-8">
          <div
            className="w-2 h-2 rounded-full bg-green-500 animate-float"
            style={{ animationDelay: "0s" }}
          ></div>
          <div
            className="w-2 h-2 rounded-full bg-green-400 animate-float"
            style={{ animationDelay: "0.5s" }}
          ></div>
          <div
            className="w-2 h-2 rounded-full bg-emerald-500 animate-float"
            style={{ animationDelay: "1s" }}
          ></div>
        </div>
        <p className="text-xs text-slate-500">
          This usually takes about 5 seconds...
        </p>
      </div>
    </div>
  );
}
