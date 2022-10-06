export declare const SPACE_BETWEEN = 1;
export declare const SPACE_AROUND = 2;
export declare const SPACE_EVENLY = 3;
export declare type Each = (idx: number, offPct: number, dimPct: number) => void;
/**
 * @internal
 */
export declare function distribute(numItems: number, sizeFactor: number, justify: number, onlyIdx: number | null, each: Each): void;
