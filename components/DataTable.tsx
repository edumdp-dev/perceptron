import React from 'react';
import { AndGateData } from '../types';

interface DataTableProps {
    currentStep: number;
    trainingData: AndGateData[];
    onDataChange: (index: number, newRow: AndGateData) => void;
    onAddRow: () => void;
    onRemoveRow: (index: number) => void;
    isRunning: boolean;
}

const DataInput: React.FC<{ value: number, onChange: (value: number) => void, disabled: boolean }> = ({ value, onChange, disabled }) => (
    <input
        type="number"
        min="0"
        max="1"
        value={value}
        onChange={(e) => {
            const val = parseInt(e.target.value);
            if (!isNaN(val)) onChange(val > 1 ? 1 : val < 0 ? 0 : val);
        }}
        onBlur={(e) => { // Snap back to 0 or 1 on blur
             const val = parseInt(e.target.value);
             if(!isNaN(val)) onChange(val > 0.5 ? 1 : 0); else onChange(0)
        }}
        disabled={disabled}
        className="w-12 text-center bg-slate-100 dark:bg-gray-800 text-slate-800 dark:text-gray-200 font-mono text-lg rounded-md border border-slate-300 dark:border-gray-700 focus:ring-2 focus:ring-picpay-green focus:border-picpay-green outline-none disabled:opacity-50 disabled:cursor-not-allowed"
    />
);

const DataTable: React.FC<DataTableProps> = ({ currentStep, trainingData, onDataChange, onAddRow, onRemoveRow, isRunning }) => {
    return (
        <div className="bg-white dark:bg-gray-900 border border-slate-200 dark:border-gray-800 rounded-xl p-4 shadow-lg">
            <h3 className="text-lg font-bold text-slate-800 dark:text-white mb-3 text-center">Dados de Treino (Editável)</h3>
            <table className="w-full text-center">
                <thead>
                    <tr className="border-b border-slate-200 dark:border-gray-700">
                        <th className="p-2 font-semibold text-slate-500 dark:text-gray-400">x₁</th>
                        <th className="p-2 font-semibold text-slate-500 dark:text-gray-400">x₂</th>
                        <th className="p-2 font-semibold text-picpay-green">y</th>
                        <th className="w-10"></th>
                    </tr>
                </thead>
                <tbody>
                    {trainingData.map((row, index) => (
                        <tr
                            key={index}
                            className={`transition-colors duration-300 ${index === currentStep && isRunning ? 'bg-picpay-green/10 animate-pulse-fast' : ''}`}
                        >
                            <td className="p-2"><DataInput value={row.x1} onChange={(val) => onDataChange(index, {...row, x1: val as 0|1})} disabled={isRunning} /></td>
                            <td className="p-2"><DataInput value={row.x2} onChange={(val) => onDataChange(index, {...row, x2: val as 0|1})} disabled={isRunning} /></td>
                            <td className="p-2"><DataInput value={row.y} onChange={(val) => onDataChange(index, {...row, y: val as 0|1})} disabled={isRunning} /></td>
                            <td className="p-2">
                                <button onClick={() => onRemoveRow(index)} disabled={isRunning || trainingData.length <= 1} className="text-slate-400 hover:text-red-500 disabled:text-slate-300 dark:disabled:text-gray-700 disabled:cursor-not-allowed transition-colors">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM7 9a1 1 0 000 2h6a1 1 0 100-2H7z" clipRule="evenodd" />
                                    </svg>
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
            <div className="mt-2 flex justify-center">
                 <button onClick={onAddRow} disabled={isRunning} className="w-full flex items-center justify-center p-2 text-slate-400 hover:text-picpay-green hover:bg-slate-100 dark:hover:bg-gray-800 disabled:text-slate-300 dark:disabled:text-gray-700 disabled:cursor-not-allowed transition-colors rounded-lg">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-11a1 1 0 10-2 0v2H7a1 1 0 100 2h2v2a1 1 0 102 0v-2h2a1 1 0 100-2h-2V7z" clipRule="evenodd" />
                    </svg>
                    <span className="ml-1 text-sm font-semibold">Adicionar Linha</span>
                </button>
            </div>
        </div>
    );
};

export default DataTable;