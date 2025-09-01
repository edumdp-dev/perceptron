import React from 'react';
import { HistoryEntry, CalculationTraceType } from '../types';
import CalculationDetails from './CalculationDetails';

interface HistoryLogProps {
    history: HistoryEntry[];
}

const mapHistoryToTrace = (entry: HistoryEntry): CalculationTraceType => ({
    x1: entry.x1,
    x2: entry.x2,
    y_actual: entry.y_actual,
    z: entry.z,
    y_predicted: entry.y_predicted,
    error: entry.error,
    old_w1: entry.old_w1,
    old_w2: entry.old_w2,
    old_b: entry.old_b,
    new_w1: entry.w1,
    new_w2: entry.w2,
    new_b: entry.b,
    learningRate: entry.learningRate,
    sigmoidOutput: entry.sigmoidOutput,
    activationFunction: entry.activationFunction,
});

const HistoryLog: React.FC<HistoryLogProps> = ({ history }) => {
    if (history.length === 0) {
        return (
             <div className="bg-white dark:bg-gray-900 border border-slate-200 dark:border-gray-800 rounded-xl p-6 shadow-lg text-center text-slate-500 dark:text-gray-500 h-full flex items-center justify-center min-h-[400px]">
                <p>Execute ou avance passo a passo para ver o histórico de cálculos.</p>
            </div>
        );
    }

    const groupedHistory = history.reduce((acc, entry) => {
        const epoch = entry.epoch;
        if (!acc[epoch]) {
            acc[epoch] = [];
        }
        acc[epoch].push(entry);
        return acc;
    }, {} as Record<number, HistoryEntry[]>);

    return (
        <div className="space-y-8">
            {Object.entries(groupedHistory).map(([epoch, entries]) => (
                <div key={epoch} className="bg-white dark:bg-gray-900 border border-slate-200 dark:border-gray-800 rounded-xl shadow-lg animate-fade-in">
                    <h3 className="text-xl font-bold text-slate-800 dark:text-white p-4 border-b border-slate-200 dark:border-gray-800 bg-slate-50 dark:bg-gray-900/50">Época {epoch}</h3>
                    <div>
                        <table className="w-full text-center text-sm table-auto">
                            <thead className="bg-slate-100 dark:bg-gray-800 text-xs uppercase text-slate-500 dark:text-gray-400">
                                <tr>
                                    <th className="px-2 py-3 font-semibold">x₁</th>
                                    <th className="px-2 py-3 font-semibold">x₂</th>
                                    <th className="px-2 py-3 font-semibold">y</th>
                                    <th className="px-2 py-3 font-semibold text-left">Soma (z)</th>
                                    <th className="px-2 py-3 font-semibold">z</th>
                                    <th className="px-2 py-3 font-semibold">ŷ</th>
                                    <th className="px-2 py-3 font-semibold">Erro</th>
                                    <th className="px-2 py-3 font-semibold text-picpay-green">w₁'</th>
                                    <th className="px-2 py-3 font-semibold text-picpay-green">w₂'</th>
                                    <th className="px-2 py-3 font-semibold text-picpay-green">b'</th>
                                </tr>
                            </thead>
                            <tbody className="font-mono text-slate-800 dark:text-gray-200">
                                {entries.map((entry, index) => (
                                    <tr key={index} className={`group border-t border-slate-200 dark:border-gray-800 hover:bg-slate-50 dark:hover:bg-gray-800/50 transition-colors duration-300 animate-fade-in ${entry.error === 0 ? 'bg-picpay-green/5 dark:bg-picpay-green/10' : 'bg-red-500/5 dark:bg-red-500/10'}`}>
                                        <td className="px-2 py-3">{entry.x1}</td>
                                        <td className="px-2 py-3">{entry.x2}</td>
                                        <td className="px-2 py-3 text-pink-500 dark:text-pink-400">{entry.y_actual}</td>
                                        <td className="px-2 py-3 text-left text-cyan-600 dark:text-cyan-300 text-xs break-all">{`(${entry.old_w1.toFixed(1)}*${entry.x1}) + (${entry.old_w2.toFixed(1)}*${entry.x2}) + (${entry.old_b.toFixed(1)})`}</td>
                                        <td className="px-2 py-3">{entry.z.toFixed(2)}</td>
                                        <td className="px-2 py-3 font-bold">{entry.y_predicted}</td>
                                        <td className={`relative px-2 py-3 font-bold ${entry.error === 0 ? 'text-slate-400 dark:text-gray-400' : 'text-red-500 dark:text-red-400'}`}>
                                            {entry.error}
                                            {entry.error !== 0 && (
                                                <div className="absolute bottom-full mb-2 left-1/2 -translate-x-1/2 w-[450px] z-50 opacity-0 group-hover:opacity-100 pointer-events-none group-hover:pointer-events-auto transition-opacity duration-200">
                                                    <CalculationDetails calculation={mapHistoryToTrace(entry)} />
                                                </div>
                                            )}
                                        </td>
                                        <td className={`px-2 py-3 text-slate-800 dark:text-gray-200 ${entry.weights_updated ? 'font-bold' : ''}`}>{entry.w1.toFixed(2)}</td>
                                        <td className={`px-2 py-3 text-slate-800 dark:text-gray-200 ${entry.weights_updated ? 'font-bold' : ''}`}>{entry.w2.toFixed(2)}</td>
                                        <td className={`px-2 py-3 text-slate-800 dark:text-gray-200 ${entry.weights_updated ? 'font-bold' : ''}`}>{entry.b.toFixed(2)}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            ))}
        </div>
    );
};

export default HistoryLog;