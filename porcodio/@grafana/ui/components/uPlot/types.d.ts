import React from 'react';
import uPlot, { Options, Hooks, AlignedData } from 'uplot';
import { TimeRange } from '@grafana/data';
import { UPlotConfigBuilder } from './config/UPlotConfigBuilder';
export declare type PlotConfig = Pick<Options, 'series' | 'scales' | 'axes' | 'cursor' | 'bands' | 'hooks' | 'select' | 'tzDate'>;
export declare type PlotPlugin = {
    id: string;
    /** can mutate provided opts as necessary */
    opts?: (self: uPlot, opts: Options) => void;
    hooks: Hooks.ArraysOrFuncs;
};
export interface PlotPluginProps {
    id: string;
}
export interface PlotProps {
    data: AlignedData;
    width: number;
    height: number;
    config: UPlotConfigBuilder;
    timeRange: TimeRange;
    children?: React.ReactNode;
}
export declare abstract class PlotConfigBuilder<P, T> {
    props: P;
    constructor(props: P);
    abstract getConfig(): T;
}
