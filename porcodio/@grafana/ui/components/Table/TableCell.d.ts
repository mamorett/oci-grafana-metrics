import { FC } from 'react';
import { Cell } from 'react-table';
import { Field } from '@grafana/data';
import { TableFilterActionCallback } from './types';
import { TableStyles } from './styles';
export interface Props {
    cell: Cell;
    field: Field;
    tableStyles: TableStyles;
    onCellFilterAdded?: TableFilterActionCallback;
    columnIndex: number;
    columnCount: number;
    /** Index before table sort */
    dataRowIndex: number;
}
export declare const TableCell: FC<Props>;
