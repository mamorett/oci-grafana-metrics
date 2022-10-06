import { DataFrame, FieldConfig, FieldSparkline } from '@grafana/data';
import { GraphFieldConfig } from '../uPlot/config';
/** @internal
 * Given a sparkline config returns a DataFrame ready to be turned into Plot data set
 **/
export declare function preparePlotFrame(sparkline: FieldSparkline, config?: FieldConfig<GraphFieldConfig>): DataFrame;
