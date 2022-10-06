import React from 'react';
import { DataFrame } from '@grafana/data';
import { UPlotConfigBuilder } from './config/UPlotConfigBuilder';
import { VizLegendOptions } from '../VizLegend/types';
import { VizLayoutLegendProps } from '../VizLayout/VizLayout';
import { GraphNGLegendEvent } from '..';
interface PlotLegendProps extends VizLegendOptions, Omit<VizLayoutLegendProps, 'children'> {
    data: DataFrame[];
    config: UPlotConfigBuilder;
    onSeriesColorChange?: (label: string, color: string) => void;
    onLegendClick?: (event: GraphNGLegendEvent) => void;
}
export declare const PlotLegend: React.FC<PlotLegendProps>;
export {};
