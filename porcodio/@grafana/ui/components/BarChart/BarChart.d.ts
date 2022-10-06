import React from 'react';
import { DataFrame } from '@grafana/data';
import { Themeable } from '../../types';
import { GraphNGLegendEvent } from '../GraphNG/types';
import { BarChartOptions } from './types';
/**
 * @alpha
 */
export interface BarChartProps extends Themeable, BarChartOptions {
    height: number;
    width: number;
    data: DataFrame[];
    onLegendClick?: (event: GraphNGLegendEvent) => void;
    onSeriesColorChange?: (label: string, color: string) => void;
}
export declare const BarChart: React.FunctionComponent<Pick<BarChartProps, "data" | "height" | "legend" | "width" | "onSeriesColorChange" | "orientation" | "onLegendClick" | "groupWidth" | "barWidth" | "showValue" | "stacking">>;
