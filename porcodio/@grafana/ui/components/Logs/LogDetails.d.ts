import React from 'react';
import { Field, LinkModel, LogRowModel } from '@grafana/data';
import { Themeable } from '../../types/theme';
export interface Props extends Themeable {
    row: LogRowModel;
    showDuplicates: boolean;
    getRows: () => LogRowModel[];
    wrapLogMessage: boolean;
    className?: string;
    hasError?: boolean;
    onClickFilterLabel?: (key: string, value: string) => void;
    onClickFilterOutLabel?: (key: string, value: string) => void;
    getFieldLinks?: (field: Field, rowIndex: number) => Array<LinkModel<Field>>;
    showDetectedFields?: string[];
    onClickShowDetectedField?: (key: string) => void;
    onClickHideDetectedField?: (key: string) => void;
}
export declare const LogDetails: React.FunctionComponent<Pick<Props, "className" | "row" | "wrapLogMessage" | "getRows" | "onClickFilterLabel" | "onClickFilterOutLabel" | "showDetectedFields" | "onClickShowDetectedField" | "onClickHideDetectedField" | "showDuplicates" | "hasError" | "getFieldLinks">>;
