"use client";
import { Check } from "lucide-react";

const steps = ["Business", "Documents", "Review"];

export default function SellerStepper({ currentStep }: { currentStep: number }) {
  return (
    <div className="flex items-center justify-between mb-12">
      {steps.map((step, index) => {
        const stepNumber = index + 1;
        const isCompleted = currentStep > stepNumber;
        const isActive = currentStep === stepNumber;

        return (
          <div key={step} className="flex items-center flex-1 last:flex-none">
            <div className="flex flex-col items-center relative">
              <div
                className={`w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300 border-2 ${
                  isCompleted
                    ? "bg-black border-black text-white"
                    : isActive
                    ? "border-black text-black font-bold ring-4 ring-gray-100"
                    : "border-gray-200 text-gray-400"
                }`}
              >
                {isCompleted ? <Check size={20} /> : stepNumber}
              </div>
              <span className={`absolute -bottom-7 text-xs font-medium whitespace-nowrap ${isActive ? "text-black" : "text-gray-400"}`}>
                {step}
              </span>
            </div>
            {index < steps.length - 1 && (
              <div className={`flex-1 h-0.5 mx-4 ${currentStep > stepNumber ? "bg-black" : "bg-gray-200"}`} />
            )}
          </div>
        );
      })}
    </div>
  );
}