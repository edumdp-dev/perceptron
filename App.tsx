import React, { useState, useEffect, useCallback, useRef, createContext, useContext, useMemo } from 'react';
import { PerceptronState, HistoryEntry, CalculationTraceType, Weights, ActivationFunction, AndGateData } from './types';
import { INITIAL_STATE, DEFAULT_AND_GATE_DATA } from './constants';
import ControlPanel from './components/ControlPanel';
import StateDisplay from './components/StateDisplay';
import HistoryLog from './components/CalculationTrace';
import InfoPanel from './components/InfoPanel';
import DataTable from './components/DataTable';
import DecisionBoundaryPlot from './components/DecisionBoundaryPlot';

// --- Lógica do Tema ---
type Theme = 'light' | 'dark';
interface ThemeContextType {
    theme: Theme;
    toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

const useTheme = (): ThemeContextType => {
    const context = useContext(ThemeContext);
    if (context === undefined) {
        throw new Error('useTheme must be used within a ThemeProvider');
    }
    return context;
};

const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [theme, setTheme] = useState<Theme>(() => {
        const savedTheme = localStorage.getItem('theme') as Theme;
        const userPrefersDark = window.matchMedia?.('(prefers-color-scheme: dark)').matches;
        return savedTheme || (userPrefersDark ? 'dark' : 'light');
    });

    useEffect(() => {
        const root = window.document.documentElement;
        if (theme === 'dark') {
            root.classList.add('dark');
        } else {
            root.classList.remove('dark');
        }
        localStorage.setItem('theme', theme);
    }, [theme]);

    const toggleTheme = () => {
        setTheme(prevTheme => (prevTheme === 'light' ? 'dark' : 'light'));
    };
    
    const value = useMemo(() => ({ theme, toggleTheme }), [theme]);

    return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
};


const ThemeToggler: React.FC = () => {
    const { theme, toggleTheme } = useTheme();

    return (
        <button
            onClick={toggleTheme}
            className="absolute top-0 right-0 p-2 rounded-full bg-slate-200 dark:bg-gray-800 text-slate-600 dark:text-gray-300 hover:bg-slate-300 dark:hover:bg-gray-700 transition-colors focus:outline-none focus:ring-2 focus:ring-picpay-green focus:ring-offset-2 focus:ring-offset-slate-50 dark:focus:ring-offset-gray-950"
            aria-label="Toggle theme"
        >
            {theme === 'light' ? (
                 <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
                </svg>
            ) : (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
                </svg>
            )}
        </button>
    );
};
// --- Fim da Lógica do Tema ---


const CodeBlock: React.FC<{ children: React.ReactNode, className?: string }> = ({ children, className }) => (
    <code className={`block bg-slate-100 dark:bg-gray-800/80 border border-slate-200 dark:border-gray-700 text-cyan-700 dark:text-cyan-300 px-3 py-2 rounded-lg text-sm mt-1 whitespace-pre-wrap ${className}`}>
        {children}
    </code>
);

const TestingPanel: React.FC<{ weights: Weights, activationFunction: ActivationFunction }> = ({ weights, activationFunction }) => {
    const [inputs, setInputs] = useState({ x1: 1, x2: 1 });

    const { z, y_predicted, sigmoidOutput } = React.useMemo(() => {
        const z_calc = (weights.w1 * inputs.x1) + (weights.w2 * inputs.x2) + weights.b;
        let y_pred: 0 | 1 = 0;
        let sig_out: number | undefined = undefined;

        if (activationFunction === 'sigmoid') {
            sig_out = 1 / (1 + Math.exp(-z_calc));
            y_pred = sig_out >= 0.5 ? 1 : 0;
        } else {
            y_pred = z_calc >= 0 ? 1 : 0;
        }
        return { z: z_calc, y_predicted: y_pred, sigmoidOutput: sig_out };
    }, [weights, inputs, activationFunction]);

    return (
        <div className="bg-white dark:bg-gray-900 border border-slate-200 dark:border-gray-800 rounded-xl p-6 shadow-lg">
            <h2 className="text-xl font-bold text-slate-800 dark:text-white mb-4">🧪 Testar Modelo</h2>
            <p className="text-sm text-slate-500 dark:text-gray-400 mb-4">Insira valores para <code className="text-cyan-600 dark:text-cyan-300">x₁</code> e <code className="text-cyan-600 dark:text-cyan-300">x₂</code> para ver a previsão do Perceptron com os pesos e função de ativação (<code className="text-cyan-600 dark:text-cyan-300">{activationFunction}</code>) atuais.</p>
            
            <div className="grid grid-cols-2 gap-4 mb-4">
                <div>
                    <label htmlFor="testX1" className="block text-sm font-medium text-slate-500 dark:text-gray-400 mb-1">Entrada x₁</label>
                    <input id="testX1" type="number" value={inputs.x1} onChange={(e) => setInputs(i => ({...i, x1: Number(e.target.value) || 0}))} className="w-full bg-slate-100 dark:bg-gray-800 text-slate-800 dark:text-white rounded-md px-3 py-2 border border-slate-300 dark:border-gray-700 focus:ring-2 focus:ring-picpay-green focus:border-picpay-green outline-none"/>
                </div>
                 <div>
                    <label htmlFor="testX2" className="block text-sm font-medium text-slate-500 dark:text-gray-400 mb-1">Entrada x₂</label>
                    <input id="testX2" type="number" value={inputs.x2} onChange={(e) => setInputs(i => ({...i, x2: Number(e.target.value) || 0}))} className="w-full bg-slate-100 dark:bg-gray-800 text-slate-800 dark:text-white rounded-md px-3 py-2 border border-slate-300 dark:border-gray-700 focus:ring-2 focus:ring-picpay-green focus:border-picpay-green outline-none"/>
                </div>
            </div>

            <div className="mt-4 pt-4 border-t border-slate-200 dark:border-gray-800 space-y-3">
                 <div>
                    <h4 className="font-semibold text-slate-600 dark:text-gray-300 text-xs">1. Pesos Atuais</h4>
                     <CodeBlock>{`w₁=${weights.w1.toFixed(2)}, w₂=${weights.w2.toFixed(2)}, b=${weights.b.toFixed(2)}`}</CodeBlock>
                </div>
                <div>
                    <h4 className="font-semibold text-slate-600 dark:text-gray-300 text-xs">2. Soma Ponderada (z)</h4>
                    <CodeBlock>{`z = (${weights.w1.toFixed(2)}*${inputs.x1}) + (${weights.w2.toFixed(2)}*${inputs.x2}) + (${weights.b.toFixed(2)}) = ${z.toFixed(2)}`}</CodeBlock>
                </div>
                 <div>
                    <h4 className="font-semibold text-slate-600 dark:text-gray-300 text-xs">3. Previsão (ŷ)</h4>
                    {activationFunction === 'sigmoid' && sigmoidOutput !== undefined && (
                        <CodeBlock>{`σ(z) = 1 / (1 + e⁻ᶻ) = ${sigmoidOutput.toFixed(4)}\nŷ = (${sigmoidOutput.toFixed(4)} >= 0.5) ? 1 : 0 => ${y_predicted}`}</CodeBlock>
                    )}
                    {activationFunction === 'step' && (
                         <CodeBlock className={y_predicted === 1 ? 'text-picpay-green' : 'text-red-500 dark:text-red-400'}>{`ŷ = (${z.toFixed(2)} >= 0) ? 1 : 0  =>  ${y_predicted}`}</CodeBlock>
                    )}
                </div>
            </div>

        </div>
    );
};

const TabButton: React.FC<{ label: string; isActive: boolean; onClick: () => void; }> = ({ label, isActive, onClick }) => (
    <button
        onClick={onClick}
        aria-selected={isActive}
        role="tab"
        className={`w-full text-center px-4 py-2 text-sm font-semibold rounded-lg transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-slate-50 dark:focus:ring-offset-gray-950 ${
            isActive
                ? 'bg-white dark:bg-gray-800 text-slate-800 dark:text-white shadow'
                : 'text-slate-500 dark:text-gray-400 hover:bg-slate-200/50 dark:hover:bg-gray-800/50 hover:text-slate-800 dark:hover:text-white'
        }`}
    >
        {label}
    </button>
);


const AppContent: React.FC = () => {
    const { theme } = useTheme();
    const [initialWeights, setInitialWeights] = useState<Weights>({ w1: 0, w2: 0, b: 0 });
    const [initialLearningRate, setInitialLearningRate] = useState<number>(1.0);
    const [initialActivationFunction, setInitialActivationFunction] = useState<ActivationFunction>('step');
    const [trainingData, setTrainingData] = useState<AndGateData[]>(DEFAULT_AND_GATE_DATA);


    const getInitialState = useCallback((): PerceptronState => {
        return {
            ...INITIAL_STATE,
            weights: initialWeights,
            learningRate: initialLearningRate,
            activationFunction: initialActivationFunction,
        };
    }, [initialWeights, initialLearningRate, initialActivationFunction]);

    const [state, setState] = useState<PerceptronState>(getInitialState());
    const [isRunning, setIsRunning] = useState<boolean>(false);
    const [history, setHistory] = useState<HistoryEntry[]>([]);
    const [isConverged, setIsConverged] = useState<boolean>(false);
    const [activeTab, setActiveTab] = useState<'simulation' | 'testing'>('simulation');

    const intervalRef = useRef<number | null>(null);
    
    const resetSimulation = useCallback(() => {
        setIsRunning(false);
        if (intervalRef.current) {
            clearInterval(intervalRef.current);
            intervalRef.current = null;
        }
        setState(getInitialState());
        setHistory([]);
        setIsConverged(false);
        setTrainingData(DEFAULT_AND_GATE_DATA);
    }, [getInitialState]);

    const handleLearningRateChange = (newRate: number) => {
        if (isRunning) return;
        setInitialLearningRate(newRate);
        setState(prevState => ({ ...prevState, learningRate: newRate }));
    };

    const handleInitialWeightsChange = (newWeights: Weights) => {
        if(isRunning) return;
        setInitialWeights(newWeights);
        setState(prevState => ({ ...prevState, weights: newWeights }));
    }

    const handleActivationFunctionChange = (func: ActivationFunction) => {
        if (isRunning) return;
        setInitialActivationFunction(func);
        setState(prevState => ({ ...prevState, activationFunction: func }));
    };

    const handleTrainingDataChange = (index: number, newRow: AndGateData) => {
        if (isRunning) return;
        const newData = [...trainingData];
        // Clamp values to 0 or 1
        const clampedRow: AndGateData = {
            x1: Math.max(0, Math.min(1, Math.round(newRow.x1))) as 0 | 1,
            x2: Math.max(0, Math.min(1, Math.round(newRow.x2))) as 0 | 1,
            y: Math.max(0, Math.min(1, Math.round(newRow.y))) as 0 | 1,
        };
        newData[index] = clampedRow;
        setTrainingData(newData);
    };

    const addTrainingDataRow = () => {
        if (isRunning) return;
        setTrainingData([...trainingData, { x1: 0, x2: 0, y: 0 }]);
    };

    const removeTrainingDataRow = (index: number) => {
        if (isRunning || trainingData.length <= 1) return;
        setTrainingData(trainingData.filter((_, i) => i !== index));
    };

    const step = useCallback(() => {
        if (trainingData.length === 0) {
            setIsRunning(false);
            return;
        }
        setState(prevState => {
            if (isConverged) {
                setIsRunning(false);
                return prevState;
            }

            const { currentStep, epoch, weights, totalErrorsInEpoch, learningRate, activationFunction } = prevState;
            const oldWeights = { ...weights };

            const { x1, x2, y: y_actual } = trainingData[currentStep];

            const z = (x1 * oldWeights.w1) + (x2 * oldWeights.w2) + oldWeights.b;
            
            let y_predicted: 0 | 1;
            let sigmoidOutput: number | undefined = undefined;

            if (activationFunction === 'sigmoid') {
                sigmoidOutput = 1 / (1 + Math.exp(-z));
                y_predicted = sigmoidOutput >= 0.5 ? 1 : 0;
            } else { // step function
                y_predicted = z >= 0 ? 1 : 0;
            }

            const error = y_actual - y_predicted;
            
            const newWeights = { ...oldWeights };
            let weights_updated = false;
            let currentTotalErrors = totalErrorsInEpoch;

            if (error !== 0) {
                currentTotalErrors++;
                newWeights.w1 += learningRate * error * x1;
                newWeights.w2 += learningRate * error * x2;
                newWeights.b += learningRate * error;
                weights_updated = true;
            }
            
            const newHistoryEntry: HistoryEntry = {
                epoch,
                step: currentStep,
                x1, x2, y_actual, z, y_predicted, error,
                w1: newWeights.w1,
                w2: newWeights.w2,
                b: newWeights.b,
                old_w1: oldWeights.w1,
                old_w2: oldWeights.w2,
                old_b: oldWeights.b,
                weights_updated,
                learningRate,
                sigmoidOutput,
                activationFunction
            };
            setHistory(prevHistory => [...prevHistory, newHistoryEntry]);
            
            let nextStep = (currentStep + 1) % trainingData.length;
            let nextEpoch = epoch;
            let nextTotalErrors = currentTotalErrors;
            
            if (nextStep === 0) { // End of an epoch
                if (currentTotalErrors === 0) {
                    setIsConverged(true);
                    setIsRunning(false);
                     return { // Retorna o estado final sem incrementar a época
                        ...prevState,
                        weights: newWeights,
                        totalErrorsInEpoch: 0,
                    };
                } else {
                    nextEpoch++;
                    nextTotalErrors = 0; // Reset for next epoch
                }
            }

            return {
                ...prevState,
                weights: newWeights,
                epoch: nextEpoch,
                currentStep: nextStep,
                totalErrorsInEpoch: nextTotalErrors,
            };
        });
    }, [isConverged, trainingData]);

    useEffect(() => {
        if (isRunning) {
            intervalRef.current = window.setInterval(step, 1000);
        } else {
            if (intervalRef.current) {
                clearInterval(intervalRef.current);
                intervalRef.current = null;
            }
        }
        return () => {
            if (intervalRef.current) {
                clearInterval(intervalRef.current);
            }
        };
    }, [isRunning, step]);


    return (
        <div className="min-h-screen bg-slate-50 dark:bg-gray-950 text-slate-800 dark:text-gray-200 p-4 sm:p-6 lg:p-8 transition-colors duration-300">
            <div className="max-w-7xl mx-auto relative">
                <ThemeToggler />
                <header className="text-center mb-10">
                    <h1 className="text-4xl sm:text-5xl font-bold text-slate-900 dark:text-white tracking-tight">
                        Simulação de Aprendizagem do <span className="text-picpay-green">Perceptron</span>
                    </h1>
                    <p className="mt-3 text-lg text-slate-500 dark:text-gray-400 max-w-3xl mx-auto">
                        Uma visualização interativa do algoritmo Perceptron aprendendo a porta lógica AND.
                    </p>
                </header>

                <div className="grid grid-cols-1 xl:grid-cols-5 gap-6">
                    <div className="xl:col-span-2 space-y-6">
                        <ControlPanel
                            isRunning={isRunning}
                            isConverged={isConverged}
                            learningRate={state.learningRate}
                            onToggleRunning={() => setIsRunning(prev => !prev)}
                            onStep={step}
                            onReset={resetSimulation}
                            onLearningRateChange={handleLearningRateChange}
                            initialWeights={initialWeights}
                            onInitialWeightsChange={handleInitialWeightsChange}
                            activationFunction={state.activationFunction}
                            onActivationFunctionChange={handleActivationFunctionChange}
                            trainingDataLength={trainingData.length}
                        />

                        <div role="tablist" className="flex space-x-1 bg-slate-200 dark:bg-gray-900 border border-slate-300 dark:border-gray-800 rounded-xl p-1">
                            <TabButton label="Simulação" isActive={activeTab === 'simulation'} onClick={() => setActiveTab('simulation')} />
                            <TabButton label="Testar Modelo" isActive={activeTab === 'testing'} onClick={() => setActiveTab('testing')} />
                        </div>
                        
                        {activeTab === 'simulation' && (
                            <div className="space-y-6 animate-fade-in">
                                <StateDisplay state={state} isConverged={isConverged}/>
                                <DataTable 
                                    currentStep={state.currentStep} 
                                    trainingData={trainingData}
                                    onDataChange={handleTrainingDataChange}
                                    onAddRow={addTrainingDataRow}
                                    onRemoveRow={removeTrainingDataRow}
                                    isRunning={isRunning}
                                />
                                <InfoPanel />
                            </div>
                        )}
                        {activeTab === 'testing' && (
                             <div className="animate-fade-in">
                                <TestingPanel weights={state.weights} activationFunction={state.activationFunction} />
                             </div>
                        )}

                    </div>

                    <div className="xl:col-span-3 space-y-8">
                         <DecisionBoundaryPlot weights={state.weights} currentStep={state.currentStep} theme={theme} trainingData={trainingData} />
                        <HistoryLog history={history} />
                        {isConverged && (
                            <div className="bg-picpay-green/10 border border-picpay-green/50 text-picpay-green rounded-lg p-4 text-center text-lg font-semibold shadow-lg animate-fade-in">
                                ✨ Modelo convergiu! O Perceptron aprendeu com sucesso.
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

const App: React.FC = () => (
    <ThemeProvider>
        <AppContent />
    </ThemeProvider>
);


export default App;