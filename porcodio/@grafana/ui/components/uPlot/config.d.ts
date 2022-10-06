import { SelectableValue } from '@grafana/data';
/**
 * @alpha
 */
export declare enum AxisPlacement {
    Auto = "auto",
    Top = "top",
    Right = "right",
    Bottom = "bottom",
    Left = "left",
    Hidden = "hidden"
}
/**
 * @alpha
 */
export declare enum PointVisibility {
    Auto = "auto",
    Never = "never",
    Always = "always"
}
/**
 * @alpha
 */
export declare enum DrawStyle {
    Line = "line",
    Bars = "bars",
    Points = "points"
}
/**
 * @alpha
 */
export declare enum LineInterpolation {
    Linear = "linear",
    Smooth = "smooth",
    StepBefore = "stepBefore",
    StepAfter = "stepAfter"
}
/**
 * @alpha
 */
export declare enum BarAlignment {
    Before = -1,
    Center = 0,
    After = 1
}
/**
 * @alpha
 */
export declare enum ScaleDistribution {
    Linear = "linear",
    Logarithmic = "log",
    Ordinal = "ordinal"
}
/**
 * @alpha
 */
export declare enum ScaleOrientation {
    Horizontal = 0,
    Vertical = 1
}
/**
 * @alpha
 */
export declare enum ScaleDirection {
    Up = 1,
    Right = 1,
    Down = -1,
    Left = -1
}
/**
 * @alpha
 */
export interface LineStyle {
    fill?: 'solid' | 'dash' | 'dot' | 'square';
    dash?: number[];
}
/**
 * @alpha
 */
export interface LineConfig {
    lineColor?: string;
    lineWidth?: number;
    lineInterpolation?: LineInterpolation;
    lineStyle?: LineStyle;
    spanNulls?: boolean;
}
/**
 * @alpha
 */
export interface BarConfig {
    barAlignment?: BarAlignment;
}
/**
 * @alpha
 */
export interface FillConfig {
    fillColor?: string;
    fillOpacity?: number;
    fillBelowTo?: string;
}
/**
 * @alpha
 */
export declare enum GraphGradientMode {
    None = "none",
    Opacity = "opacity",
    Hue = "hue",
    Scheme = "scheme"
}
/**
 * @alpha
 */
export interface PointsConfig {
    showPoints?: PointVisibility;
    pointSize?: number;
    pointColor?: string;
    pointSymbol?: string;
}
/**
 * @alpha
 */
export interface ScaleDistributionConfig {
    type: ScaleDistribution;
    log?: number;
}
/**
 * @alpha
 * Axis is actually unique based on the unit... not each field!
 */
export interface AxisConfig {
    axisPlacement?: AxisPlacement;
    axisLabel?: string;
    axisWidth?: number;
    axisSoftMin?: number;
    axisSoftMax?: number;
    scaleDistribution?: ScaleDistributionConfig;
}
/**
 * @alpha
 */
export interface HideSeriesConfig {
    tooltip: boolean;
    legend: boolean;
    graph: boolean;
}
/**
 * @alpha
 */
export interface HideableFieldConfig {
    hideFrom?: HideSeriesConfig;
}
/**
 * @alpha
 */
export interface GraphFieldConfig extends LineConfig, FillConfig, PointsConfig, AxisConfig, BarConfig, HideableFieldConfig {
    drawStyle?: DrawStyle;
    gradientMode?: GraphGradientMode;
}
/**
 * @alpha
 */
export declare const graphFieldOptions: {
    drawStyle: SelectableValue<DrawStyle>[];
    lineInterpolation: SelectableValue<LineInterpolation>[];
    barAlignment: SelectableValue<BarAlignment>[];
    showPoints: SelectableValue<PointVisibility>[];
    axisPlacement: SelectableValue<AxisPlacement>[];
    fillGradient: SelectableValue<GraphGradientMode>[];
};
