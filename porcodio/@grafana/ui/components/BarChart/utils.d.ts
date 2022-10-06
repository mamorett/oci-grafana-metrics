import { UPlotConfigBuilder } from '../uPlot/config/UPlotConfigBuilder';
import { DataFrame, GrafanaTheme, MutableDataFrame } from '@grafana/data';
import { BarChartOptions } from './types';
/** @alpha */
export declare function preparePlotConfigBuilder(data: DataFrame, theme: GrafanaTheme, { orientation, showValue, groupWidth, barWidth }: BarChartOptions): UPlotConfigBuilder;
/** @internal */
export declare function preparePlotFrame(data: DataFrame[]): MutableDataFrame<any>;
