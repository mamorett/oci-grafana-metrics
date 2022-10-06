import React from 'react';
import { CartesianCoords2D } from '@grafana/data';
import { PlotPluginProps } from '../types';
interface ClickPluginAPI {
    point: {
        seriesIdx: number | null;
        dataIdx: number | null;
    };
    coords: {
        plotCanvas: CartesianCoords2D;
        viewport: CartesianCoords2D;
    };
    clearSelection: () => void;
}
/**
 * @alpha
 */
interface ClickPluginProps extends PlotPluginProps {
    onClick: (e: {
        seriesIdx: number | null;
        dataIdx: number | null;
    }) => void;
    children: (api: ClickPluginAPI) => React.ReactElement | null;
}
export declare const ClickPlugin: React.FC<ClickPluginProps>;
export {};
