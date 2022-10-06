import { FC, PropsWithChildren } from 'react';
import { IconName } from '../../types';
export interface Props {
    icon?: IconName;
    iconTooltip?: string;
    /** Title for the modal or custom header element */
    title: string | JSX.Element;
    className?: string;
    contentClassName?: string;
    closeOnEscape?: boolean;
    isOpen?: boolean;
    onDismiss?: () => void;
    /** If not set will call onDismiss if that is set. */
    onClickBackdrop?: () => void;
}
export declare function Modal(props: PropsWithChildren<Props>): ReturnType<FC<Props>>;
