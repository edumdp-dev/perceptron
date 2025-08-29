import React, { useRef, useEffect } from 'react';
import { Weights } from '../types';
import { AND_GATE_DATA } from '../constants';

interface DecisionBoundaryPlotProps {
    weights: Weights;
    currentStep: number;
}

const DecisionBoundaryPlot: React.FC<DecisionBoundaryPlotProps> = ({ weights, currentStep }) => {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const animationFrameIdRef = useRef<number | null>(null);
    const prevWeightsRef = useRef<Weights>(weights);

    useEffect(() => {
        const startWeights = prevWeightsRef.current;
        const endWeights = weights;

        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        const drawScene = (w: Weights) => {
            const { w1, w2, b } = w;
            const dpr = window.devicePixelRatio || 1;
            const rect = canvas.getBoundingClientRect();
            
            if (rect.width === 0 || rect.height === 0) return;

            canvas.width = rect.width * dpr;
            canvas.height = rect.height * dpr;
            ctx.scale(dpr, dpr);

            const width = rect.width;
            const height = rect.height;
            const padding = 30;
            const plotWidth = width - 2 * padding;
            const plotHeight = height - 2 * padding;
            const xMin = -0.5, xMax = 1.5, yMin = -0.5, yMax = 1.5;

            const toCanvasX = (x: number) => padding + ((x - xMin) / (xMax - xMin)) * plotWidth;
            const toCanvasY = (y: number) => padding + (1 - (y - yMin) / (yMax - yMin)) * plotHeight;

            ctx.fillStyle = '#1C1C1E'; // gray-900
            ctx.fillRect(0, 0, width, height);

            ctx.strokeStyle = '#2C2C2E'; // gray-800
            ctx.lineWidth = 1;
            ctx.font = '12px "Courier New", monospace';
            ctx.fillStyle = '#98989A'; // gray-400

            ctx.beginPath();
            ctx.moveTo(toCanvasX(0), toCanvasY(yMin));
            ctx.lineTo(toCanvasX(0), toCanvasY(yMax));
            ctx.stroke();
            ctx.fillText('0', toCanvasX(0) - 15, toCanvasY(0) + 5);
            ctx.fillText('1', toCanvasX(0) - 15, toCanvasY(1) + 5);

            ctx.beginPath();
            ctx.moveTo(toCanvasX(xMin), toCanvasY(0));
            ctx.lineTo(toCanvasX(xMax), toCanvasY(0));
            ctx.stroke();
            ctx.fillText('0', toCanvasX(0) - 5, toCanvasY(0) + 15);
            ctx.fillText('1', toCanvasX(1) - 5, toCanvasY(0) + 15);

            AND_GATE_DATA.forEach((point, index) => {
                const { x1, x2, y } = point;
                const cx = toCanvasX(x1);
                const cy = toCanvasY(x2);

                ctx.beginPath();
                ctx.arc(cx, cy, 6, 0, 2 * Math.PI);
                ctx.fillStyle = y === 1 ? '#22C55E' : '#EF4444'; // picpay-green or red-500
                ctx.fill();

                if (index === currentStep) {
                    ctx.strokeStyle = '#FFFFFF';
                    ctx.lineWidth = 3;
                    ctx.lineCap = 'round';
                    ctx.beginPath();
                    ctx.arc(cx, cy, 10, 0, 2 * Math.PI);
                    ctx.stroke();
                }
            });

            if (Math.abs(w1) > 0.001 || Math.abs(w2) > 0.001) {
                ctx.beginPath();
                ctx.strokeStyle = '#38bdf8'; // sky-400
                ctx.lineWidth = 2.5;

                let y1_boundary, y2_boundary, x1_boundary;

                if (Math.abs(w2) > 0.001) {
                    y1_boundary = (-w1 * xMin - b) / w2;
                    y2_boundary = (-w1 * xMax - b) / w2;
                    ctx.moveTo(toCanvasX(xMin), toCanvasY(y1_boundary));
                    ctx.lineTo(toCanvasX(xMax), toCanvasY(y2_boundary));
                } else {
                    x1_boundary = -b / w1;
                    ctx.moveTo(toCanvasX(x1_boundary), toCanvasY(yMin));
                    ctx.lineTo(toCanvasX(x1_boundary), toCanvasY(yMax));
                }
                ctx.stroke();
            }
        };
        
        const weightsChanged = startWeights.w1 !== endWeights.w1 || startWeights.w2 !== endWeights.w2 || startWeights.b !== endWeights.b;

        if (!weightsChanged) {
            drawScene(endWeights);
            return;
        }

        const duration = 500;
        let startTime: number | null = null;

        const animate = (timestamp: number) => {
            if (!startTime) startTime = timestamp;
            const elapsed = timestamp - startTime;
            const progress = Math.min(elapsed / duration, 1);
            const easeOutProgress = 1 - Math.pow(1 - progress, 3);

            const interpolatedWeights: Weights = {
                w1: startWeights.w1 + (endWeights.w1 - startWeights.w1) * easeOutProgress,
                w2: startWeights.w2 + (endWeights.w2 - startWeights.w2) * easeOutProgress,
                b: startWeights.b + (endWeights.b - startWeights.b) * easeOutProgress,
            };

            drawScene(interpolatedWeights);

            if (progress < 1) {
                animationFrameIdRef.current = requestAnimationFrame(animate);
            } else {
                prevWeightsRef.current = endWeights;
            }
        };

        if (animationFrameIdRef.current) {
            cancelAnimationFrame(animationFrameIdRef.current);
        }
        animationFrameIdRef.current = requestAnimationFrame(animate);

        return () => {
            if (animationFrameIdRef.current) {
                cancelAnimationFrame(animationFrameIdRef.current);
            }
            prevWeightsRef.current = endWeights;
        };

    }, [weights, currentStep]);

    return (
        <div className="bg-gray-900 border border-gray-800 rounded-xl p-4 shadow-lg aspect-square">
            <h3 className="text-lg font-bold text-white mb-3 text-center">Fronteira de Decisão</h3>
            <canvas ref={canvasRef} className="w-full h-full"></canvas>
        </div>
    );
};

export default DecisionBoundaryPlot;