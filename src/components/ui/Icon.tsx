import Feather from '@expo/vector-icons/Feather';
import type { ComponentProps } from 'react';
import { colors } from '../../theme/tokens';

export type IconName = ComponentProps<typeof Feather>['name'];

type IconProps = {
  name: IconName;
  size?: number;
  color?: string;
};

export function Icon({ name, size = 18, color = colors.textSecondary }: IconProps) {
  return (
    <Feather
      name={name}
      size={size}
      color={color}
      accessibilityElementsHidden
      importantForAccessibility="no"
    />
  );
}
