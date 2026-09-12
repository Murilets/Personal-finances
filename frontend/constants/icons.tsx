import React from 'react';
import Svg, { Circle, Path, SvgProps } from 'react-native-svg';

export interface IconProps extends SvgProps {
  size?: number;
  color?: string;
}

export function SearchIcon({ size = 18, color = 'currentColor', ...props }: IconProps) {
  return (
    <Svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke={color}
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <Circle cx="11" cy="11" r="8" />
      <Path d="m21 21-4.3-4.3" />
    </Svg>
  );
}

export function XIcon({ size = 18, color = 'currentColor', ...props }: IconProps) {
  return (
    <Svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke={color}
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <Path d="M18 6 6 18" />
      <Path d="m6 6 12 12" />
    </Svg>
  );
}

export const ICONS = {
  search: SearchIcon,
  x: XIcon,
} as const;
