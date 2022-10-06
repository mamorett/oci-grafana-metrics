import { FC } from 'react';
export interface Props {
    placeholder?: string;
    tags?: string[];
    onChange: (tags: string[]) => void;
}
export declare const TagsInput: FC<Props>;
