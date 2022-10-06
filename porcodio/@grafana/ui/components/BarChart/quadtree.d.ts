export declare type Quads = [Quadtree, Quadtree, Quadtree, Quadtree];
export declare type Rect = {
    x: number;
    y: number;
    w: number;
    h: number;
    [_: string]: any;
};
/**
 * @internal
 */
export declare function pointWithin(px: number, py: number, rlft: number, rtop: number, rrgt: number, rbtm: number): boolean;
/**
 * @internal
 */
export declare class Quadtree {
    x: number;
    y: number;
    w: number;
    h: number;
    l: number;
    o: Rect[];
    q: Quads | null;
    constructor(x: number, y: number, w: number, h: number, l?: number);
    split(): void;
    quads(x: number, y: number, w: number, h: number, cb: (q: Quadtree) => void): void;
    add(o: Rect): void;
    get(x: number, y: number, w: number, h: number, cb: (o: Rect) => void): void;
    clear(): void;
}
