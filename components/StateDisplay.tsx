import React, { useState, useEffect, useRef } from 'react';
import { PerceptronState } from '../types';

interface StateDisplayProps {
    state: PerceptronState;
    isConverged: boolean;
}

const usePrevious = <T,>(value: T): T | undefined => {
    // FIX: Provide an initial value of `undefined` to `useRef` to fix "Expected 1 arguments, but got 0" error.
    const ref = useRef<T | undefined>(undefined);
    useEffect(() => {
        ref.current = value;
    });
    return ref.current;
};


const StateItem: React.FC<{ label: string; value: string | number; colorClass?: string; highlight?: boolean }> = ({ label, value, colorClass = "text-picpay-green", highlight = false }) => (
    <div className={`flex justify-between items-baseline transition-all duration-300 p-1 -m-1 rounded-md ${highlight ? 'bg-picpay-green/20' : ''}`}>
        <span className="text-gray-400">{label}:</span>
        <span className={`font-mono text-lg font-bold ${colorClass}`}>{typeof value === 'number' ? value.toFixed(2) : value}</span>
    </div>
);

const StateDisplay: React.FC<StateDisplayProps> = ({ state, isConverged }) => {
    const { weights, epoch } = state;
    const prevWeights = usePrevious(weights);
    const [highlights, setHighlights] = useState({ w1: false, w2: false, b: false });

    useEffect(() => {
        if (prevWeights && (
            weights.w1 !== prevWeights.w1 ||
            weights.w2 !== prevWeights.w2 ||
            weights.b !== prevWeights.b
        )) {
            setHighlights({
                w1: weights.w1 !== prevWeights.w1,
                w2: weights.w2 !== prevWeights.w2,
                b: weights.b !== prevWeights.b,
            });

            const timer = setTimeout(() => {
                setHighlights({ w1: false, w2: false, b: false });
            }, 700);

            return () => clearTimeout(timer);
        }
    }, [weights, prevWeights]);

    return (
        <div className="bg-gray-900 border border-gray-800 rounded-xl p-4 shadow-lg h-full">
            <h3 className="text-lg font-bold text-white mb-3 text-center">Estado Atual</h3>
            <div className="space-y-2">
                <StateItem label="Época" value={epoch} colorClass={isConverged ? "text-picpay-green" : "text-white"} />
                <hr className="border-gray-800 my-2" />
                <StateItem label="Peso w₁" value={weights.w1} highlight={highlights.w1} />
                <StateItem label="Peso w₂" value={weights.w2} highlight={highlights.w2} />
                <StateItem label="Bias b" value={weights.b} highlight={highlights.b} />
            </div>
        </div>
    );
};

export default StateDisplay;