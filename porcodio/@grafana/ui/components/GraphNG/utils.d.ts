import React from 'react';
import { GraphNGLegendEventMode, XYFieldMatchers } from './types';
import { DataFrame, GrafanaTheme, TimeRange, TimeZone } from '@grafana/data';
import { UPlotConfigBuilder } from '../uPlot/config/UPlotConfigBuilder';
export declare function mapMouseEventToMode(event: React.MouseEvent): GraphNGLegendEventMode;
export declare function preparePlotFrame(data: DataFrame[], dimFields: XYFieldMatchers): DataFrame | undefined;
export declare function preparePlotConfigBuilder(frame: DataFrame, theme: GrafanaTheme, getTimeRange: () => TimeRange, getTimeZone: () => TimeZone): UPlotConfigBuilder;
export declare function getNamesToFieldIndex(frame: DataFrame): Map<string, number>;
