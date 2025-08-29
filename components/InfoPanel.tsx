import React from 'react';
import { InfoIcon } from '../constants';

const Code: React.FC<{children: React.ReactNode}> = ({children}) => (
    <code className="bg-gray-800 text-cyan-300 px-1.5 py-0.5 rounded-md text-xs mx-1">{children}</code>
)

const InfoPanel: React.FC = () => {
    return (
        <div className="bg-gray-900 border border-gray-800 rounded-xl p-6 shadow-lg">
            <h2 className="text-xl font-bold text-white mb-4 flex items-center">
                <InfoIcon className="h-6 w-6 mr-2 text-picpay-green"/>
                Como Funciona
            </h2>
            <div className="text-gray-400 text-sm space-y-3">
                <p>
                    O Perceptron é um algoritmo de aprendizado supervisionado para classificação binária. Ele aprende uma fronteira de decisão linear para separar duas classes.
                </p>
                <ol className="list-decimal list-inside space-y-2 pl-2">
                    <li>
                        <strong>Inicializar:</strong> Comece com pesos (<Code>w₁</Code>, <Code>w₂</Code>) e bias (<Code>b</Code>) definidos.
                    </li>
                    <li>
                        <strong>Soma Ponderada:</strong> Calcule a soma:<Code>z = (w₁*x₁) + (w₂*x₂) + b</Code>.
                    </li>
                    <li>
                        <strong>Ativação:</strong> Se<Code>z &gt;= 0</Code>, a saída (<Code>ŷ</Code>) é 1, caso contrário, é 0.
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