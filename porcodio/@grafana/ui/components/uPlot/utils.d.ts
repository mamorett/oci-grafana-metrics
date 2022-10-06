/// <reference types="lodash" />
import { DataFrame, FieldType } from '@grafana/data';
import { AlignedData, Options } from 'uplot';
import { PlotPlugin, PlotProps } from './types';
export declare function timeFormatToTemplate(f: string): string;
export declare function buildPlotConfig(props: PlotProps, plugins: Record<string, PlotPlugin>): Options;
/** @internal */
export declare function preparePlotData(frame: DataFrame, ignoreFieldTypes?: FieldType[]): AlignedData;
/** @internal */
export declare const throttledLog: ((...t: any[]) => void) & import("lodash").Cancelable;
/** @internal */
export declare function pluginLog(id: string, throttle?: boolean, ...t: any[]): void;
