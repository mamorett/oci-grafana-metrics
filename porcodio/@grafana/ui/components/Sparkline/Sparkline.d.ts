import { PureComponent } from 'react';
import { AlignedData } from 'uplot';
import { DataFrame, FieldConfig, FieldSparkline } from '@grafana/data';
import { GraphFieldConfig } from '../uPlot/config';
import { UPlotConfigBuilder } from '../uPlot/config/UPlotConfigBuilder';
import { Themeable } from '../../types';
export interface SparklineProps extends Themeable {
    width: number;
    height: number;
    config?: FieldConfig<GraphFieldConfig>;
    sparkline: FieldSparkline;
}
interface State {
    data: AlignedData;
    alignedDataFrame: DataFrame;
    configBuilder: UPlotConfigBuilder;
}
export declare class Sparkline extends PureComponent<SparklineProps, State> {
    constructor(props: SparklineProps);
    static getDerivedStateFromProps(props: SparklineProps, state: State): {
        data: AlignedData;
        alignedDataFrame: DataFrame;
        configBuilder: UPlotConfigBuilder;
    };
    componentDidUpdate(prevProps: SparklineProps, prevState: State): void;
    prepareConfig(data: DataFrame): UPlotConfigBuilder;
    render(): JSX.Element;
}
export {};
