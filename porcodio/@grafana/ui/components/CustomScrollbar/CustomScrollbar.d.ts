import { FC } from 'react';
interface Props {
    className?: string;
    autoHide?: boolean;
    autoHideTimeout?: number;
    autoHeightMax?: string;
    hideTracksWhenNotNeeded?: boolean;
    hideHorizontalTrack?: boolean;
    hideVerticalTrack?: boolean;
    scrollTop?: number;
    setScrollTop?: (event: any) => void;
    autoHeightMin?: number | string;
    updateAfterMountMs?: number;
}
/**
 * Wraps component into <Scrollbars> component from `react-custom-scrollbars`
 */
export declare const CustomScrollbar: FC<Props>;
export default CustomScrollbar;
