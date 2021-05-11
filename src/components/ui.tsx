import * as _colors from './_design/colors';
import { Heading as _heading, Text as _text } from './_design/typography';
import { Button as _button } from './_design/buttons';
import { ToggleBtn as _toggleBtn } from './_design/buttons';
import { Buying as _buying, SmallCard as _smallcard } from './_design/buying-card';
import { Box as _box } from './_design/box';
import { Input as _input } from './_design/textInputs';
import { Tags as _tags } from './_design/tags';
import { Spacing as _spacing } from './_design/spacing';

// Components
export const Heading = _heading;
export const Text = _text;
export const Button = _button;
export const Input = _input;
export const Box = _box;
export const Tags = _tags;
export const Buying = _buying;
export const SmallCard = _smallcard;


// Variable
export const Colors = _colors.Colors;
export const Gradient = _colors.Gradient;


// Media Query Breakpoints
const breakpoints = [576, 769, 992, 1100]
export const mq = breakpoints.map(
  bp => `@media (min-width: ${bp}px)`
);

// Styles
export const ToggleBtn = _toggleBtn;

// Method
export const Spacing = _spacing;