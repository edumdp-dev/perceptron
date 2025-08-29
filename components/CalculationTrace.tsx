import React, { useRef, useEffect } from 'react';
import { HistoryEntry } from '../types';

interface HistoryLogProps {
    history: HistoryEntry[];
}

const HistoryLog: React.FC<HistoryLogProps> = ({ history }) => {
    const scrollContainerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (scrollContainerRef.current) {
            scrollContainerRef.current.scrollTop = scrollContainerRef.current.scrollHeight;
        }
    }, [history]);

    if (history.length === 0) {
        return (
             <div className="bg-gray-900 border border-gray-800 rounded-xl p-6 shadow-lg text-center text-gray-500 h-full flex items-center justify-center min-h-[400px]">
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
        <div ref={scrollContainerRef} className="space-y-8 max-h-[85vh] overflow-y-auto pr-2 -mr-2">
            {Object.entries(groupedHistory).map(([epoch, entries]) => (
                <div key={epoch} className="bg-gray-900 border border-gray-800 rounded-xl shadow-lg overflow-hidden animate-fade-in">
                    <h3 className="text-xl font-bold text-white p-4 border-b border-gray-800 bg-gray-900">Época {epoch}</h3>
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm text-center min-w-[800px]">
                            <thead className="sticky top-0 bg-gray-800 text-xs uppercase text-gray-400">
                                <tr>
                                    <th className="px-2 py-2">x1</th>
                                    <th className="px-2 py-2">x2</th>
                                    <th className="px-2 py-2">y</th>
                                    <th className="px-4 py-2 text-left">Cálculo da Soma (z)</th>
                                    <th className="px-2 py-2">Resultado (z)</th>
                                    <th className="px-2 py-2">ŷ</th>
                                    <th className="px-2 py-2">Erro</th>
                                    <th className="px-2 py-2 text-picpay-green">w1'</th>
                                    <th className="px-2 py-2 text-picpay-green">w2'</th>
                                    <th className="px-2 py-2 text-picpay-green">b'</th>
                                </tr>
                            </thead>
                            <tbody className="font-mono text-gray-200">
                                {entries.map((entry, index) => (
                                    <tr key={index} className={`border-t border-gray-800 hover:bg-gray-800/50 transition-colors duration-300 ${entry.error === 0 ? 'bg-picpay-green/10' : 'bg-red-500/10'}`}>
                                        <td className="px-2 py-3">{entry.x1}</td>
                                        <td className="px-2 py-3">{entry.x2}</td>
                                        <td className="px-2 py-3 text-pink-400">{entry.y_actual}</td>
                                        <td className="px-4 py-3 text-left text-cyan-300 text-xs">{`(${entry.old_w1.toFixed(2)}*${entry.x1}) + (${entry.old_w2.toFixed(2)}*${entry.x2}) + (${entry.old_b.toFixed(2)})`}</td>
                                        <td className="px-2 py-3">{entry.z.toFixed(2)}</td>
                                        <td className="px-2 py-3 font-bold">{entry.y_predicted}</td>
                                        <td className={`px-2 py-3 font-bold ${entry.error === 0 ? 'text-gray-400' : 'text-red-400'}`}>{entry.error}</td>
                                        <td className={`px-2 py-3 text-white ${entry.weights_updated ? 'font-bold' : ''}`}>{entry.w1.toFixed(2)}</td>
                                        <td className={`px-2 py-3 text-white ${entry.weights_updated ? 'font-bold' : ''}`}>{entry.w2.toFixed(2)}</td>
                                        <td className={`px-2 py-3 text-white ${entry.weights_updated ? 'font-bold' : ''}`}>{entry.b.toFixed(2)}</td>
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