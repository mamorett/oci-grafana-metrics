/// <reference types="react" />
import { Story } from '@storybook/react';
import { ClipboardButton, Props } from './ClipboardButton';
declare const _default: {
    title: string;
    component: typeof ClipboardButton;
    decorators: ((story: import("../..").RenderFunction) => JSX.Element)[];
    parameters: {
        docs: {
            page: (props: any) => JSX.Element;
        };
        knobs: {
            disable: boolean;
        };
    };
    argTypes: {
        size: {
            control: {
                disable: boolean;
            };
        };
        variant: {
            control: {
                disable: boolean;
            };
        };
        icon: {
            control: {
                disable: boolean;
            };
        };
        className: {
            control: {
                disable: boolean;
            };
        };
        fullWidth: {
            control: {
                disable: boolean;
            };
        };
    };
};
export default _default;
interface StoryProps extends Partial<Props> {
    inputText: string;
    buttonText: string;
}
export declare const CopyToClipboard: Story<StoryProps>;
