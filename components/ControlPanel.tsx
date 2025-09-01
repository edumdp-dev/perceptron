import React from 'react';
import { Weights, ActivationFunction } from '../types';

interface ControlPanelProps {
    isRunning: boolean;
    isConverged: boolean;
    learningRate: number;
    onToggleRunning: () => void;
    onStep: () => void;
    onReset: () => void;
    onLearningRateChange: (rate: number) => void;
    initialWeights: Weights;
    onInitialWeightsChange: (weights: Weights) => void;
    activationFunction: ActivationFunction;
    onActivationFunctionChange: (func: ActivationFunction) => void;
    trainingDataLength: number;
}

const Button: React.FC<{ onClick: () => void; disabled?: boolean; className?: string; children: React.ReactNode }> = ({ onClick, disabled, className, children }) => (
    <button
        onClick={onClick}
        disabled={disabled}
        className={`w-full px-4 py-3 text-sm font-semibold rounded-lg shadow-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-white dark:focus:ring-offset-gray-900 transition-all duration-150 ease-in-out disabled:bg-slate-200 dark:disabled:bg-gray-700 disabled:text-slate-400 dark:disabled:text-gray-500 disabled:cursor-not-allowed ${className}`}
    >
        {children}
    </button>
);

const WeightInput: React.FC<{ label: string; value: number; onChange: (value: number) => void; disabled?: boolean; id: string; }> = ({ label, value, onChange, disabled, id }) => (
    <div>
        <label htmlFor={id} className="block text-xs font-medium text-slate-500 dark:text-gray-400 mb-1">{label}</label>
        <input
            id={id}
            type="number"
            step="0.1"
            value={value}
            disabled={disabled}
            onChange={(e) => onChange(parseFloat(e.target.value) || 0)}
            className="w-full bg-slate-100 dark:bg-gray-800 text-slate-800 dark:text-white rounded-md px-2 py-1.5 border border-slate-300 dark:border-gray-700 focus:ring-2 focus:ring-picpay-green focus:border-picpay-green outline-none disabled:opacity-50"
        />
    </div>
);

const ActivationFunctionSelector: React.FC<{
    current: ActivationFunction;
    onChange: (func: ActivationFunction) => void;
    disabled?: boolean;
}> = ({ current, onChange, disabled }) => {
    const options: { id: ActivationFunction; label: string }[] = [
        { id: 'step', label: 'Degrau' },
        { id: 'sigmoid', label: 'Sigmóide' },
    ];

    return (
        <div>
             <h3 className="text-sm font-medium text-slate-500 dark:text-gray-400 mb-2">Função de Ativação</h3>
             <div className={`grid grid-cols-2 gap-2 rounded-lg p-1 transition-opacity ${disabled ? 'opacity-50' : ''}`}>
                {options.map(option => (
                     <button
                        key={option.id}
                        onClick={() => onChange(option.id)}
                        disabled={disabled}
                        className={`px-3 py-2 text-sm font-semibold rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-white dark:focus:ring-offset-gray-900 transition-colors duration-200 ${
                            current === option.id
                                ? 'bg-picpay-green text-white shadow'
                                : 'bg-slate-200 dark:bg-gray-800 text-slate-600 dark:text-gray-300 hover:bg-slate-300 dark:hover:bg-gray-700'
                        }`}
                     >
                        {option.label}
                     </button>
                ))}
             </div>
        </div>
    );
};


const ControlPanel: React.FC<ControlPanelProps> = ({ isRunning, isConverged, onToggleRunning, onStep, onReset, learningRate, onLearningRateChange, initialWeights, onInitialWeightsChange, activationFunction, onActivationFunctionChange, trainingDataLength }) => {
    const isSimDisabled = isConverged || trainingDataLength === 0;

    return (
        <div className="bg-white dark:bg-gray-900 border border-slate-200 dark:border-gray-800 rounded-xl p-6 shadow-lg">
            <h2 className="text-xl font-bold text-slate-800 dark:text-white mb-4">Controles</h2>
            <div className="grid grid-cols-2 gap-3">
                <Button
                    onClick={onToggleRunning}
                    disabled={isSimDisabled}
                    className={isRunning ? 'bg-amber-500 hover:bg-amber-600 text-white focus:ring-amber-500' : 'bg-picpay-green hover:bg-green-600 text-white focus:ring-picpay-green'}
                >
                    {isRunning ? 'Pausar' : 'Executar'}
                </Button>
                 <Button
                    onClick={onStep}
                    disabled={isRunning || isSimDisabled}
                    className="bg-slate-600 hover:bg-slate-700 dark:bg-gray-700 dark:hover:bg-gray-600 text-white focus:ring-gray-500"
                >
                    Passo
                </Button>
                 <Button
                    onClick={onReset}
                    className="col-span-2 bg-slate-600 hover:bg-red-500/80 dark:bg-gray-700 dark:hover:bg-red-600/50 text-white focus:ring-red-500"
                >
                    Resetar
                </Button>
            </div>
            
             <div className="mt-6 pt-4 border-t border-slate-200 dark:border-gray-800 space-y-4">
                <h3 className="text-base font-bold text-slate-600 dark:text-gray-300 mb-2">Configuração Inicial</h3>
                
                <ActivationFunctionSelector
                    current={activationFunction}
                    onChange={onActivationFunctionChange}
                    disabled={isRunning}
                />

                <div>
                    <label htmlFor="learning-rate" className="block text-sm font-medium text-slate-500 dark:text-gray-400 mb-2">
                        Taxa de Aprendizado (η): <span className="font-bold text-picpay-green">{learningRate.toFixed(2)}</span>
                    </label>
                    <input
                        id="learning-rate"
                        type="range"
                        min="0.1"
                        max="2"
                        step="0.1"
                        value={learningRate}
                        disabled={isRunning}
                        onChange={(e) => onLearningRateChange(parseFloat(e.target.value))}
                        className="w-full h-2 bg-slate-200 dark:bg-gray-700 rounded-lg appearance-none cursor-pointer accent-picpay-green disabled:cursor-not-allowed disabled:opacity-50"
                    />
                </div>

                <div>
                     <h3 className="text-sm font-medium text-slate-500 dark:text-gray-400 mb-2">Pesos Iniciais</h3>
                    <div className="grid grid-cols-3 gap-3">
                        <WeightInput
                            id="initial-w1"
                            label="Peso w₁"
                            value={initialWeights.w1}
                            onChange={(val) => onInitialWeightsChange({ ...initialWeights, w1: val })}
                            disabled={isRunning}
                        />
                        <WeightInput
                            id="initial-w2"
                            label="Peso w₂"
                            value={initialWeights.w2}
                            onChange={(val) => onInitialWeightsChange({ ...initialWeights, w2: val })}
                            disabled={isRunning}
                        />
                        <WeightInput
                            id="initial-b"
                            label="Bias b"
                            value={initialWeights.b}
                            onChange={(val) => onInitialWeightsChange({ ...initialWeights, b: val })}
                            disabled={isRunning}
                        />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ControlPanel;