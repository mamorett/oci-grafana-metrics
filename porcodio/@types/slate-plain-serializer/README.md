# Installation
> `npm install --save @types/slate-plain-serializer`

# Summary
This package contains type definitions for slate-plain-serializer (https://github.com/ianstormtaylor/slate).

# Details
Files were exported from https://github.com/DefinitelyTyped/DefinitelyTyped/tree/master/types/slate-plain-serializer.
## [index.d.ts](https://github.com/DefinitelyTyped/DefinitelyTyped/tree/master/types/slate-plain-serializer/index.d.ts)
````ts
// Type definitions for slate-plain-serializer 0.7
// Project: https://github.com/ianstormtaylor/slate
// Definitions by: Brandon Shelton <https://github.com/YangusKhan>
//                 Martin Kiefel <https://github.com/mkiefel>
// Definitions: https://github.com/DefinitelyTyped/DefinitelyTyped
// TypeScript Version: 2.8
import { BlockProperties, MarkProperties, Value } from 'slate';

export interface DeserializeOptions {
    toJson?: boolean | undefined;
    defaultBlock?: BlockProperties | undefined;
    defaultMarks?: MarkProperties[] | Set<MarkProperties> | undefined;
    delimiter?: string | undefined;
}

export interface SerializeOptions {
    delimiter?: string | undefined;
}

declare namespace Plain {
    function deserialize(string: string, options?: DeserializeOptions): Value;
    function serialize(value: Value, options?: SerializeOptions): string;
}

export default Plain;

````

### Additional Details
 * Last updated: Thu, 23 Dec 2021 23:35:51 GMT
 * Dependencies: [@types/slate](https://npmjs.com/package/@types/slate)
 * Global values: none

# Credits
These definitions were written by [Brandon Shelton](https://github.com/YangusKhan), and [Martin Kiefel](https://github.com/mkiefel).
