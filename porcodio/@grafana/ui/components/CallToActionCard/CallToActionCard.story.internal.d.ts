import React from 'react';
import { CallToActionCardProps } from './CallToActionCard';
import { Story } from '@storybook/react';
declare const _default: {
    title: string;
    component: React.FunctionComponent<CallToActionCardProps>;
    parameters: {
        knobs: {
            disable: boolean;
        };
    };
    argTypes: {
        Element: {
            control: {
                type: string;
                options: string[];
            };
        };
        className: {
            control: {
                disable: boolean;
            };
        };
        callToActionElement: {
            control: {
                disable: boolean;
            };
        };
        theme: {
            control: {
                disable: boolean;
            };
        };
    };
};
export default _default;
interface StoryProps extends Partial<CallToActionCardProps> {
    Element: string;
    H1Text: string;
    buttonText: string;
}
export declare const Basic: Story<StoryProps>;
