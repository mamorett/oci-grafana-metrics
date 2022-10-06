import { FC, ReactNode } from 'react';
import { IconName } from '../../types';
export interface Props {
    pageIcon?: IconName;
    title: string;
    parent?: string;
    onGoBack?: () => void;
    onClickTitle?: () => void;
    onClickParent?: () => void;
    leftItems?: ReactNode[];
    children?: ReactNode;
    className?: string;
    isFullscreen?: boolean;
}
/** @alpha */
export declare const PageToolbar: FC<Props>;
