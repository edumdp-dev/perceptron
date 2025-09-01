import React from 'react';
import { AND_GATE_DATA } from '../constants';

interface DataTableProps {
    currentStep: number;
}

const DataTable: React.FC<DataTableProps> = ({ currentStep }) => {
    return (
        <div className="bg-white dark:bg-gray-900 border border-slate-200 dark:border-gray-800 rounded-xl p-4 shadow-lg">
            <h3 className="text-lg font-bold text-slate-800 dark:text-white mb-3 text-center">Dados de Treino (Porta AND)</h3>
            <table className="w-full text-center">
                <thead>
                    <tr className="border-b border-slate-200 dark:border-gray-700">
                        <th className="p-2 font-semibold text-slate-500 dark:text-gray-400">x₁</th>
                        <th className="p-2 font-semibold text-slate-500 dark:text-gray-400">x₂</th>
                        <th className="p-2 font-semibold text-picpay-green">y (Correto)</th>
                    </tr>
                </thead>
                <tbody>
                    {AND_GATE_DATA.map((row, index) => (
                        <tr
                            key={index}
                            className={`transition-colors duration-300 rounded-lg ${index === currentStep ? 'bg-picpay-green/10' : ''}`}
                        >
                            <td className={`p-2 font-mono text-lg`}>{row.x1}</td>
                            <td className={`p-2 font-mono text-lg`}>{row.x2}</td>
                            <td className={`p-2 font-mono text-lg text-picpay-green`}>{row.y}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default DataTable;