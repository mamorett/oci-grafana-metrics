import { ScaleProps } from './UPlotScaleBuilder';
import { SeriesProps, UPlotSeriesBuilder } from './UPlotSeriesBuilder';
import { AxisProps } from './UPlotAxisBuilder';
import { AxisPlacement } from '../config';
import uPlot, { Cursor, Band, Hooks, BBox } from 'uplot';
declare type valueof<T> = T[keyof T];
export declare class UPlotConfigBuilder {
    private getTimeZone;
    private series;
    private axes;
    private scales;
    private bands;
    private cursor;
    private select;
    private hasLeftAxis;
    private hasBottomAxis;
    private hooks;
    constructor(getTimeZone?: () => string);
    addHook(type: keyof Hooks.Defs, hook: valueof<Hooks.Defs>): void;
    addAxis(props: AxisProps): void;
    getAxisPlacement(scaleKey: string): AxisPlacement;
    setCursor(cursor?: Cursor): void;
    setSelect(select: Partial<BBox>): void;
    addSeries(props: SeriesProps): void;
    getSeries(): UPlotSeriesBuilder[];
    /** Add or update the scale with the scale key */
    addScale(props: ScaleProps): void;
    addBand(band: Band): void;
    getConfig(): Pick<uPlot.Options, "select" | "cursor" | "series" | "scales" | "axes" | "bands" | "hooks" | "tzDate">;
    private ensureNonOverlappingAxes;
    private tzDate;
}
export {};
