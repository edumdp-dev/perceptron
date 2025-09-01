export interface Weights {
    w1: number;
    w2: number;
    b: number;
}

export interface PerceptronState {
    weights: Weights;
    epoch: number;
    currentStep: number;
    totalErrorsInEpoch: number;
    learningRate: number;
}

export interface AndGateData {
    x1: 0 | 1;
    x2: 0 | 1;
    y: 0 | 1;
}

export interface CalculationTraceType {
    x1: number;
    x2: number;
    y_actual: number;
    z: number;
    y_predicted: number;
    error: number;
    old_w1: number;
    old_w2: number;
    old_b: number;
    new_w1: number;
    new_w2: number;
    new_b: number;
    learningRate: number;
}

export interface HistoryEntry {
    epoch: number;
    step: number;
    x1: number;
    x2: number;
    y_actual: number;
    z: number;
    y_predicted: number;
    error: number;
    w1: number; // New weight
    w2: number; // New weight
    b: number;  // New weight
    old_w1: number;
    old_w2: number;
    old_b: number;
    weights_updated: boolean;
    learningRate: number;
}
