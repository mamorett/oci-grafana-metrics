import React, { HTMLAttributes } from 'react';
import { PopoverContent } from '../Tooltip/Tooltip';
import { SelectableValue } from '@grafana/data';
import { ToolbarButtonVariant } from '../Button';
export interface Props<T> extends HTMLAttributes<HTMLButtonElement> {
    className?: string;
    options: Array<SelectableValue<T>>;
    value?: SelectableValue<T>;
    onChange: (item: SelectableValue<T>) => void;
    tooltipContent?: PopoverContent;
    narrow?: boolean;
    variant?: ToolbarButtonVariant;
}
/**
 * @internal
 * A temporary component until we have a proper dropdown component
 */
export declare const ButtonSelect: React.MemoExoticComponent<(<T>(props: Props<T>) => JSX.Element)>;
