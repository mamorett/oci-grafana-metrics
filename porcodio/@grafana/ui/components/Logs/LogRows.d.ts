import React from 'react';
import { TimeZone, LogsDedupStrategy, LogRowModel, Field, LinkModel, LogsSortOrder } from '@grafana/data';
import { Themeable } from '../../types/theme';
import { RowContextOptions } from './LogRowContextProvider';
export declare const PREVIEW_LIMIT = 100;
export interface Props extends Themeable {
    logRows?: LogRowModel[];
    deduplicatedRows?: LogRowModel[];
    dedupStrategy: LogsDedupStrategy;
    highlighterExpressions?: string[];
    showLabels: boolean;
    showTime: boolean;
    wrapLogMessage: boolean;
    timeZone: TimeZone;
    logsSortOrder?: LogsSortOrder | null;
    allowDetails?: boolean;
    previewLimit?: number;
    disableCustomHorizontalScroll?: boolean;
    forceEscape?: boolean;
    showDetectedFields?: string[];
    showContextToggle?: (row?: LogRowModel) => boolean;
    onClickFilterLabel?: (key: string, value: string) => void;
    onClickFilterOutLabel?: (key: string, value: string) => void;
    getRowContext?: (row: LogRowModel, options?: RowContextOptions) => Promise<any>;
    getFieldLinks?: (field: Field, rowIndex: number) => Array<LinkModel<Field>>;
    onClickShowDetectedField?: (key: string) => void;
    onClickHideDetectedField?: (key: string) => void;
}
export declare const LogRows: React.FunctionComponent<Pick<Props, "timeZone" | "getRowContext" | "logsSortOrder" | "highlighterExpressions" | "wrapLogMessage" | "showContextToggle" | "onClickFilterLabel" | "onClickFilterOutLabel" | "showDetectedFields" | "onClickShowDetectedField" | "onClickHideDetectedField" | "getFieldLinks" | "showLabels" | "showTime" | "allowDetails" | "forceEscape" | "logRows" | "deduplicatedRows" | "dedupStrategy" | "previewLimit" | "disableCustomHorizontalScroll">>;
