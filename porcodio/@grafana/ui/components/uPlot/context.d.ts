import React from 'react';
import uPlot, { AlignedData, Series } from 'uplot';
import { PlotPlugin } from './types';
interface PlotCanvasContextType {
    width: number;
    height: number;
    plot: {
        width: number;
        height: number;
        top: number;
        left: number;
    };
}
interface PlotPluginsContextType {
    registerPlugin: (plugin: PlotPlugin) => () => void;
}
interface PlotContextType extends PlotPluginsContextType {
    isPlotReady: boolean;
    getPlotInstance: () => uPlot | undefined;
    getSeries: () => Series[];
    getCanvas: () => PlotCanvasContextType;
    canvasRef: any;
    data: AlignedData;
}
export declare const PlotContext: React.Context<PlotContextType>;
export declare const usePlotContext: () => PlotContextType;
export declare const usePlotPluginContext: () => PlotPluginsContextType;
export declare const buildPlotContext: (isPlotReady: boolean, canvasRef: any, data: uPlot.AlignedData, registerPlugin: any, getPlotInstance: () => uPlot | undefined) => PlotContextType;
export {};
