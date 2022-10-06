import uPlot, { Axis, Series } from 'uplot';
/**
 * @internal
 */
export interface BarsOptions {
    xOri: 1 | 0;
    xDir: 1 | -1;
    groupWidth: number;
    barWidth: number;
    formatValue?: (seriesIdx: number, value: any) => string;
    onHover?: (seriesIdx: number, valueIdx: any) => void;
    onLeave?: (seriesIdx: number, valueIdx: any) => void;
}
/**
 * @internal
 */
export declare function getConfig(opts: BarsOptions): {
    cursor: uPlot.Cursor;
    select: Partial<uPlot.BBox>;
    xValues: Axis.DynamicValues;
    xSplits: (self: uPlot, axisIdx: number, scaleMin: number, scaleMax: number, foundIncr: number, foundSpace: number) => number[];
    drawBars: Series.PathBuilder;
    drawPoints: false | ((self: uPlot, seriesIdx: number, idx0: number, idx1: number) => boolean | undefined);
    init: (u: uPlot) => void;
    drawClear: (u: uPlot) => void;
    setCursor: (u: uPlot) => void;
};
