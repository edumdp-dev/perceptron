import React from 'react';
import { InfoIcon } from '../constants';

const Code: React.FC<{children: React.ReactNode}> = ({children}) => (
    <code className="bg-slate-100 dark:bg-gray-800 text-cyan-700 dark:text-cyan-300 px-1.5 py-0.5 rounded-md text-xs mx-1">{children}</code>
)

const InfoPanel: React.FC = () => {
    return (
        <div className="bg-white dark:bg-gray-900 border border-slate-200 dark:border-gray-800 rounded-xl p-6 shadow-lg">
            <h2 className="text-xl font-bold text-slate-800 dark:text-white mb-4 flex items-center">
                <InfoIcon className="h-6 w-6 mr-2 text-picpay-green"/>
                Como Funciona
            </h2>
            <div className="text-slate-500 dark:text-gray-400 text-sm space-y-3">
                <p>
                    O Perceptron é um algoritmo de aprendizado supervisionado para classificação binária. Ele aprende uma fronteira de decisão linear para separar duas classes.
                </p>
                <ol className="list-decimal list-inside space-y-2 pl-2">
                    <li>
                        <strong>Inicializar:</strong> Comece com pesos (<Code>w₁</Code>, <Code>w₂</Code>) e bias (<Code>b</Code>).
                    </li>
                    <li>
                        <strong>Soma Ponderada:</strong> Calcule a soma:<Code>z = (w₁*x₁) + (w₂*x₂) + b</Code>.
                    </li>
                    <li>
                        <strong>Função de Ativação:</strong> A saída (<Code>ŷ</Code>) é determinada por uma função de ativação.
                        <ul className="list-disc list-inside pl-4 mt-1 space-y-1">
                            <li><strong>Função Degrau (Step):</strong> Se<Code>z &gt;= 0</Code>, a saída é 1, caso contrário, é 0. É uma decisão binária direta.</li>
                            <li><strong>Função Sigmóide:</strong> A saída é uma probabilidade entre 0 e 1, calculada como <Code>1 / (1 + e⁻ᶻ)</Code>. Um limiar (0.5) é usado para converter em 1 ou 0.</li>
                        </ul>
                    </li>
                    <li>
                        <strong>Atualizar Pesos:</strong> Se a previsão (<Code>ŷ</Code>) estiver errada, ajuste os pesos e o bias para reduzir o erro (<Code>erro = y - ŷ</Code>).
                    </li>
                </ol>
                <p>
                    Este processo se repete para cada exemplo, época por época, até que o algoritmo não cometa mais erros e convirja.
                </p>
            </div>
        </div>
    );
};

export default InfoPanel;