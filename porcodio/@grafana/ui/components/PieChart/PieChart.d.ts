import { FC } from 'react';
import { DisplayValue } from '@grafana/data';
import { VizLegendOptions } from '../VizLegend/types';
export declare enum PieChartLabels {
    Name = "name",
    Value = "value",
    Percent = "percent"
}
export declare enum PieChartLegendValues {
    Value = "value",
    Percent = "percent"
}
interface SvgProps {
    height: number;
    width: number;
    values: DisplayValue[];
    pieType: PieChartType;
    displayLabels?: PieChartLabels[];
    useGradients?: boolean;
    onSeriesColorChange?: (label: string, color: string) => void;
}
export interface Props extends SvgProps {
    legendOptions?: PieChartLegendOptions;
}
export declare enum PieChartType {
    Pie = "pie",
    Donut = "donut"
}
export interface PieChartLegendOptions extends VizLegendOptions {
    values: PieChartLegendValues[];
}
export declare const PieChart: FC<Props>;
export declare const PieChartSvg: FC<SvgProps>;
export {};
