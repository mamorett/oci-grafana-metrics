import uPlot, { Scale, Range } from 'uplot';
import { PlotConfigBuilder } from '../types';
import { ScaleDistribution, ScaleOrientation, ScaleDirection } from '../config';
export interface ScaleProps {
    scaleKey: string;
    isTime?: boolean;
    min?: number | null;
    max?: number | null;
    softMin?: number | null;
    softMax?: number | null;
    range?: Scale.Range;
    distribution?: ScaleDistribution;
    orientation: ScaleOrientation;
    direction: ScaleDirection;
    log?: number;
}
export declare class UPlotScaleBuilder extends PlotConfigBuilder<ScaleProps, Scale> {
    merge(props: ScaleProps): void;
    getConfig(): {
        [x: string]: {
            distr: number;
            log: number | undefined;
            time: boolean | undefined;
            auto: boolean;
            range: Range.MinMax | Range.Config | ((u: uPlot, dataMin: number, dataMax: number, scaleKey: string) => number[]);
            dir: ScaleDirection;
            ori: ScaleOrientation;
        } | {
            distr?: undefined;
            log?: undefined;
            time: boolean | undefined;
            auto: boolean;
            range: Range.MinMax | Range.Config | ((u: uPlot, dataMin: number, dataMax: number, scaleKey: string) => number[]);
            dir: ScaleDirection;
            ori: ScaleOrientation;
        };
    };
}
export declare function optMinMax(minmax: 'min' | 'max', a?: number | null, b?: number | null): undefined | number | null;
