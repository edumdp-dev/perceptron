import React from 'react';
import { CalculationTraceType } from '../types';

interface CalculationDetailsProps {
    calculation: CalculationTraceType;
}

const CodeBlock: React.FC<{ children: React.ReactNode, className?: string }> = ({ children, className }) => (
    <code className={`block bg-slate-100 dark:bg-gray-800/80 border border-slate-200 dark:border-gray-700 text-cyan-700 dark:text-cyan-300 px-3 py-2 rounded-lg text-xs mt-1 whitespace-pre-wrap ${className}`}>
        {children}
    </code>
);

const Arrow: React.FC = () => (
    <div className="flex justify-center my-2">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-slate-400 dark:text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
        </svg>
    </div>
)

const CalculationDetails: React.FC<CalculationDetailsProps> = ({ calculation }) => {
    const { x1, x2, y_actual, z, y_predicted, error, old_w1, old_w2, old_b, new_w1, new_w2, new_b, learningRate } = calculation;

    return (
        <div className="bg-white dark:bg-gray-900 border border-red-500/30 rounded-xl p-4 shadow-lg animate-fade-in text-left">
            <h3 className="text-lg font-bold text-red-500 dark:text-red-400 mb-3 flex items-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M12.316 3.051a1 1 0 01.633 1.265l-4 12a1 1 0 01-1.898-.632l4-12a1 1 0 011.265-.633zM5.707 6.293a1 1 0 010 1.414L3.414 10l2.293 2.293a1 1 0 11-1.414 1.414l-3-3a1 1 0 010-1.414l3-3a1 1 0 011.414 0zm8.586 0a1 1 0 011.414 0l3 3a1 1 0 010 1.414l-3 3a1 1 0 11-1.414-1.414L16.586 10l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
                Detalhes do Ajuste de Peso
            </h3>
            <div className="space-y-1 text-sm text-slate-700 dark:text-gray-300">
                 <p className="text-slate-500 dark:text-gray-400 text-xs mb-3">O modelo errou. Veja o passo a passo de como ele aprende:</p>
                
                <div>
                    <h4 className="font-semibold text-slate-600 dark:text-gray-300 text-xs">1. Cálculo da Soma Ponderada (z)</h4>
                    <CodeBlock>{`z = (w₁*x₁) + (w₂*x₂) + b\nz = (${old_w1.toFixed(2)}*${x1}) + (${old_w2.toFixed(2)}*${x2}) + (${old_b.toFixed(2)}) = ${z.toFixed(2)}`}</CodeBlock>
                </div>

                <Arrow />

                <div>
                    <h4 className="font-semibold text-slate-600 dark:text-gray-300 text-xs">2. Função de Ativação (ŷ)</h4>
                    <CodeBlock>{`ŷ = (z >= 0) ? 1 : 0\nŷ = (${z.toFixed(2)} >= 0) ? 1 : 0  =>  ${y_predicted}`}</CodeBlock>
                </div>
                
                <Arrow />

                <div>
                    <h4 className="font-semibold text-slate-600 dark:text-gray-300 text-xs">3. Cálculo do Erro</h4>
                    <CodeBlock className="text-red-600 dark:text-red-300">{`erro = y - ŷ\nerro = ${y_actual} - ${y_predicted} = ${error}`}</CodeBlock>
                </div>

                <Arrow />
                
                <div>
                    <h4 className="font-semibold text-slate-600 dark:text-gray-300 text-xs">4. Atualização dos Pesos (η = {learningRate.toFixed(2)})</h4>
                     <ul className="space-y-2 mt-1">
                        <li>
                            <CodeBlock>{`w₁' = w₁ + η*erro*x₁ = ${old_w1.toFixed(2)} + ${learningRate.toFixed(2)}*(${error})*${x1} = ${new_w1.toFixed(2)}`}</CodeBlock>
                        </li>
                        <li>
                           <CodeBlock>{`w₂' = w₂ + η*erro*x₂ = ${old_w2.toFixed(2)} + ${learningRate.toFixed(2)}*(${error})*${x2} = ${new_w2.toFixed(2)}`}</CodeBlock>
                        </li>
                        <li>
                            <CodeBlock>{`b' = b + η*erro = ${old_b.toFixed(2)} + ${learningRate.toFixed(2)}*(${error}) = ${new_b.toFixed(2)}`}</CodeBlock>
                        </li>
                    </ul>
                </div>
                
                <div className="pt-3 mt-3 border-t border-slate-200 dark:border-gray-700/50">
                    <p className="text-xs text-slate-500 dark:text-gray-400 italic">
                        <strong>Próximo passo:</strong> Estes novos pesos (<code className="text-cyan-600 dark:text-cyan-300">{new_w1.toFixed(2)}</code>, <code className="text-cyan-600 dark:text-cyan-300">{new_w2.toFixed(2)}</code>, <code className="text-cyan-600 dark:text-cyan-300">{new_b.toFixed(2)}</code>) serão usados na próxima iteração.
                    </p>
                </div>

            </div>
        </div>
    );
};

export default CalculationDetails;