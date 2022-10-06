import React from 'react';
import { DataFrame, TimeRange, TimeZone } from '@grafana/data';
import { Themeable } from '../../types';
import { GraphNGLegendEvent, XYFieldMatchers } from './types';
import { VizLegendOptions } from '../VizLegend/types';
export declare const FIXED_UNIT = "__fixed";
export interface GraphNGProps extends Themeable {
    width: number;
    height: number;
    data: DataFrame[];
    timeRange: TimeRange;
    legend: VizLegendOptions;
    timeZone: TimeZone;
    fields?: XYFieldMatchers;
    onLegendClick?: (event: GraphNGLegendEvent) => void;
    onSeriesColorChange?: (label: string, color: string) => void;
    children?: React.ReactNode;
}
export declare const GraphNG: React.FunctionComponent<Pick<GraphNGProps, "fields" | "data" | "timeZone" | "children" | "height" | "legend" | "width" | "onSeriesColorChange" | "timeRange" | "onLegendClick">>;
