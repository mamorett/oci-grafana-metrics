import React from 'react';
import { DataFrame, TimeZone } from '@grafana/data';
import { TooltipMode } from '../../Chart/Tooltip';
interface TooltipPluginProps {
    mode?: TooltipMode;
    timeZone: TimeZone;
    data: DataFrame[];
}
/**
 * @alpha
 */
export declare const TooltipPlugin: React.FC<TooltipPluginProps>;
export {};
