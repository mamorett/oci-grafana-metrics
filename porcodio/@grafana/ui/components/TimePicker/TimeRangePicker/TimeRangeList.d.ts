import React, { ReactNode } from 'react';
import { TimeRange, TimeOption, TimeZone } from '@grafana/data';
interface Props {
    title?: string;
    options: TimeOption[];
    value?: TimeRange;
    onSelect: (option: TimeRange) => void;
    placeholderEmpty?: ReactNode;
    timeZone?: TimeZone;
}
export declare const TimeRangeList: React.FC<Props>;
export {};
