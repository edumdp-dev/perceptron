import React, { useState, useEffect, useCallback, useRef } from 'react';
import { PerceptronState, HistoryEntry, CalculationTraceType } from './types';
import { INITIAL_STATE, AND_GATE_DATA } from './constants';
import ControlPanel from './components/ControlPanel';
import StateDisplay from './components/StateDisplay';
import HistoryLog from './components/CalculationTrace';
import InfoPanel from './components/InfoPanel';
import CalculationDetails from './components/CalculationDetails';
import DataTable from './components/DataTable';
import DecisionBoundaryPlot from './components/DecisionBoundaryPlot';

const App: React.FC = () => {
    const [state, setState] = useState<PerceptronState>(INITIAL_STATE);
    const [isRunning, setIsRunning] = useState<boolean>(false);
    const [history, setHistory] = useState<HistoryEntry[]>([]);
    const [isConverged, setIsConverged] = useState<boolean>(false);
    const [lastCalculation, setLastCalculation] = useState<CalculationTraceType | null>(null);

    const intervalRef = useRef<number | null>(null);
    
    const resetSimulation = useCallback(() => {
        setIsRunning(false);
        if (intervalRef.current) {
            clearInterval(intervalRef.current);
            intervalRef.current = null;
        }
        setState(INITIAL_STATE);
        setHistory([]);
        setIsConverged(false);
        setLastCalculation(null);
    }, []);

    const handleLearningRateChange = (newRate: number) => {
        if (isRunning) return;
        setState(prevState => ({ ...prevState, learningRate: newRate }));
    };

    const step = useCallback(() => {
        setState(prevState => {
            if (isConverged) {
                setIsRunning(false);
                return prevState;
            }

            const { currentStep, epoch, weights, totalErrorsInEpoch, learningRate } = prevState;
            const oldWeights = { ...weights };

            const { x1, x2, y: y_actual } = AND_GATE_DATA[currentStep];

            const z = (x1 * oldWeights.w1) + (x2 * oldWeights.w2) + oldWeights.b;
            const y_predicted = z >= 0 ? 1 : 0;
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

            const calculationDetails: CalculationTraceType = {
                x1, x2, y_actual, z, y_predicted, error,
                old_w1: oldWeights.w1,
                old_w2: oldWeights.w2,
                old_b: oldWeights.b,
                new_w1: newWeights.w1,
                new_w2: newWeights.w2,
                new_b: newWeights.b,
                learningRate: learningRate,
            };
            setLastCalculation(calculationDetails);
            
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
            };
            setHistory(prevHistory => [...prevHistory, newHistoryEntry]);
            
            let nextStep = (currentStep + 1) % AND_GATE_DATA.length;
            let nextEpoch = epoch;
            
            if (nextStep === 0) {
                nextEpoch++;
                if(currentTotalErrors === 0 && currentStep === AND_GATE_DATA.length - 1) {
                    setIsConverged(true);
                    setIsRunning(false);
                }
                currentTotalErrors = 0;
            }

            return {
                ...prevState,
                weights: newWeights,
                epoch: nextEpoch,
                currentStep: nextStep,
                totalErrorsInEpoch: currentTotalErrors,
            };
        });
    }, [isConverged]);

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
        <div className="min-h-screen bg-gray-950 p-4 sm:p-6 lg:p-8 font-sans">
            <div className="max-w-7xl mx-auto">
                <header className="text-center mb-10">
                    <h1 className="text-4xl sm:text-5xl font-bold text-white tracking-tight">
                        Simulação de Aprendizagem do <span className="text-picpay-green">Perceptron</span>
                    </h1>
                    <p className="mt-3 text-lg text-gray-400 max-w-3xl mx-auto">
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
                        />
                        <StateDisplay state={state} isConverged={isConverged}/>
                        <DataTable currentStep={state.currentStep} />
                        {lastCalculation && lastCalculation.error !== 0 && (
                            <CalculationDetails calculation={lastCalculation} />
                        )}
                        <InfoPanel />
                    </div>

                    <div className="xl:col-span-3 space-y-6">
                         <DecisionBoundaryPlot weights={state.weights} currentStep={state.currentStep} />
                        <HistoryLog history={history} />
                        {isConverged && (
                            <div className="bg-picpay-green/10 border border-picpay-green/50 text-picpay-green rounded-lg p-4 text-center text-lg font-semibold shadow-lg">
                                ✨ Modelo convergiu! O Perceptron aprendeu com sucesso a porta AND.
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default App;