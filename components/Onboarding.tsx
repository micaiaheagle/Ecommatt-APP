import React, { useState } from 'react';

interface OnboardingProps {
  onComplete: () => void;
}

const steps = [
  {
    title: "Track Metrics",
    desc: "This is your main dashboard summary. See real-time weather, herd count, and critical KPIs at a glance.",
  },
  {
    title: "Manage Livestock",
    desc: "Access individual profiles, track lineage, and update statuses from the Pig Database.",
  },
  {
    title: "Smart Alerts",
    desc: "Receive AI-powered notifications about mortality risks, feed levels, and breeding schedules.",
  },
  {
    title: "Offline Ready",
    desc: "Work in the field without internet. Data syncs automatically when connection is restored.",
  }
];

const Onboarding: React.FC<OnboardingProps> = ({ onComplete }) => {
  const [currentStep, setCurrentStep] = useState(0);

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(curr => curr + 1);
    } else {
      onComplete();
    }
  };

  const step = steps[currentStep];

  return (
    <div className="fixed inset-0 z-50 flex flex-col justify-end p-6 bg-black/60 backdrop-blur-sm animate-in fade-in duration-500">
      
      <div className="bg-white p-6 rounded-2xl shadow-2xl relative animate-in slide-in-from-bottom duration-500 max-w-md mx-auto w-full mb-8">
        <div className="flex justify-between items-start mb-2">
            <h3 className="text-lg font-bold text-gray-900">{step.title}</h3>
            <span className="text-xs font-bold text-gray-400">{currentStep + 1} / {steps.length}</span>
        </div>
        <p className="text-sm text-gray-600 mb-6 leading-relaxed">
            {step.desc}
        </p>
        <div className="flex justify-between items-center">
            <button onClick={onComplete} className="text-gray-400 text-sm font-bold hover:text-gray-600">Skip</button>
            <button 
                onClick={handleNext}
                className="bg-ecomattGreen text-white px-6 py-3 rounded-xl font-bold shadow-lg hover:bg-green-600 transition-colors"
            >
                {currentStep === steps.length - 1 ? "Get Started" : "Next"}
            </button>
        </div>
      </div>
    </div>
  );
};

export default Onboarding;