import { PerceptronState, AndGateData } from './types';
import React from 'react';

export const INITIAL_STATE: PerceptronState = {
    weights: { w1: 0, w2: 0, b: 0 },
    epoch: 1,
    currentStep: 0,
    totalErrorsInEpoch: 0,
    learningRate: 1.0,
    activationFunction: 'step',
};

export const DEFAULT_AND_GATE_DATA: AndGateData[] = [
    { x1: 0, x2: 0, y: 0 },
    { x1: 1, x2: 0, y: 0 },
    { x1: 0, x2: 1, y: 0 },
    { x1: 1, x2: 1, y: 1 },
];

// FIX: Rewrote InfoIcon component using React.createElement to avoid JSX parsing errors in a .ts file.
export const InfoIcon: React.FC<{className?: string}> = ({className}) => (
    React.createElement('svg', {
        xmlns: "http://www.w3.org/2000/svg",
        className: className || "h-5 w-5 inline-block mr-2",
        viewBox: "0 0 20 20",
        fill: "currentColor"
    }, React.createElement('path', {
        fillRule: "evenodd",
        d: "M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z",
        clipRule: "evenodd"
    }))
);