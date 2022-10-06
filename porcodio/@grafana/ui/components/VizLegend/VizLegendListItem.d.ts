import React from 'react';
import { VizLegendItem, SeriesColorChangeHandler } from './types';
export interface Props {
    item: VizLegendItem;
    className?: string;
    onLabelClick?: (item: VizLegendItem, event: React.MouseEvent<HTMLDivElement>) => void;
    onSeriesColorChange?: SeriesColorChangeHandler;
}
/**
 * @internal
 */
export declare const VizLegendListItem: React.FunctionComponent<Props>;
