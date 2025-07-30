// src/components/filtros/FiltroNutriScore.tsx
import React from 'react';

interface FiltroNutriScoreProps {
    selectedNutriScore: string | null;
    onSelect: (score: string) => void;
}

const FiltroNutriScore: React.FC<FiltroNutriScoreProps> = ({ selectedNutriScore, onSelect }) => {
    return (
        <div className="flex flex-col gap-3">
            <label className="text-xl font-semibold">NutriScore</label>
            <div className="flex flex-wrap gap-3 justify-center">
                {["A", "B", "C", "D", "E"].map((score) => {
                    const isSelected = selectedNutriScore?.toUpperCase() === score;

                    const defaultColors = {
                        A: "bg-green-100 text-green-700 hover:bg-green-200",
                        B: "bg-lime-100 text-lime-700 hover:bg-lime-200",
                        C: "bg-yellow-100 text-yellow-700 hover:bg-yellow-200",
                        D: "bg-orange-100 text-orange-700 hover:bg-orange-200",
                        E: "bg-red-100 text-red-700 hover:bg-red-200",
                    };

                    const selectedColors = {
                        A: "bg-green-500 text-white shadow-md",
                        B: "bg-lime-500 text-white shadow-md",
                        C: "bg-yellow-500 text-white shadow-md",
                        D: "bg-orange-500 text-white shadow-md",
                        E: "bg-red-500 text-white shadow-md",
                    };

                    const baseStyle = "w-12 h-12 rounded-full flex justify-center items-center text-lg font-bold transition-all duration-200 transform hover:scale-105 cursor-pointer";

                    return (
                        <button
                            key={score}
                            type="button"
                            onClick={() => onSelect(score)}
                            className={`${baseStyle} ${isSelected ? selectedColors[score as keyof typeof selectedColors] : defaultColors[score as keyof typeof defaultColors]}`}
                        >
                            {score}
                        </button>
                    );
                })}
            </div>
        </div>
    );
};

export default FiltroNutriScore;