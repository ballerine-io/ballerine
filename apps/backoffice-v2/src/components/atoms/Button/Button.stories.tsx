import React from "react";

import { Button } from "./Button";
import { Meta, StoryFn } from "@storybook/react";

// More on default export: https://storybook.js.org/docs/react/writing-stories/introduction#default-export
export default {
  title: 'Button',
  component: Button,
  // More on argTypes: https://storybook.js.org/docs/react/api/argtypes
  argTypes: {
    backgroundColor: { control: 'color' },
  },
} as Meta<typeof Button>;

// More on component templates: https://storybook.js.org/docs/react/writing-stories/introduction#using-args
const Template: StoryFn<typeof Button> = args => <Button {...args} />;

export const Default = Template.bind({});
// More on args: https://storybook.js.org/docs/react/writing-stories/args
Default.args = {
  variant: 'default',
  children: 'Button',
};

export const Destructive = Template.bind({});
Destructive.args = {
  variant: 'destructive',
  children: 'Button',
};

export const Subtle = Template.bind({});
Subtle.args = {
  variant: 'subtle',
  children: 'Button',
};


export const Ghost = Template.bind({});
Ghost.args = {
  variant: 'ghost',
  children: 'Button',
};

export const Link = Template.bind({});
Link.args = {
  variant: 'link',
  children: 'Button',
};

export const Outline = Template.bind({});
Outline.args = {
  variant: 'outline',
  children: 'Button',
};

export const Large = Template.bind({});
Large.args = {
  size: 'lg',
  children: 'Button',
};

export const Small = Template.bind({});
Small.args = {
  size: 'sm',
  children: 'Button',
};

export const FullWidth = Template.bind({});
FullWidth.args = {
  fullWidth: true,
  children: 'Button',
};

export const Circle = Template.bind({});
Circle.args = {
  circle: true,
  children: 'X',
};

export const Square = Template.bind({});
Square.args = {
  square: true,
  children: 'X',
};
