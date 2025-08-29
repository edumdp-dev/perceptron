import React from 'react';

interface ControlPanelProps {
    isRunning: boolean;
    isConverged: boolean;
    learningRate: number;
    onToggleRunning: () => void;
    onStep: () => void;
    onReset: () => void;
    onLearningRateChange: (rate: number) => void;
}

const Button: React.FC<{ onClick: () => void; disabled?: boolean; className?: string; children: React.ReactNode }> = ({ onClick, disabled, className, children }) => (
    <button
        onClick={onClick}
        disabled={disabled}
        className={`w-full px-4 py-3 text-sm font-semibold rounded-lg shadow-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-950 transition-all duration-150 ease-in-out disabled:bg-gray-700 disabled:text-gray-500 disabled:cursor-not-allowed ${className}`}
    >
        {children}
    </button>
);


const ControlPanel: React.FC<ControlPanelProps> = ({ isRunning, isConverged, onToggleRunning, onStep, onReset, learningRate, onLearningRateChange }) => {
    return (
        <div className="bg-gray-900 border border-gray-800 rounded-xl p-6 shadow-lg">
            <h2 className="text-xl font-bold text-white mb-4">Controles</h2>
            <div className="grid grid-cols-2 gap-3">
                <Button
                    onClick={onToggleRunning}
                    disabled={isConverged}
                    className={isRunning ? 'bg-amber-600 hover:bg-amber-700 text-white focus:ring-amber-500' : 'bg-picpay-green hover:bg-green-600 text-white focus:ring-picpay-green'}
                >
                    {isRunning ? 'Pausar' : 'Executar'}
                </Button>
                 <Button
                    onClick={onStep}
                    disabled={isRunning || isConverged}
                    className="bg-gray-700 hover:bg-gray-600 text-white focus:ring-gray-500"
                >
                    Passo
                </Button>
                 <Button
                    onClick={onReset}
                    className="col-span-2 bg-gray-700 hover:bg-red-600/50 text-white focus:ring-red-500"
                >
                    Resetar
                </Button>
            </div>
            <div className="mt-6">
                <label htmlFor="learning-rate" className="block text-sm font-medium text-gray-400 mb-2">
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
                    className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-picpay-green disabled:cursor-not-allowed disabled:opacity-50"
                />
            </div>
        </div>
    );
};

export default ControlPanel;