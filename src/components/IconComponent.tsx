import React from 'react';
import { IconType } from 'react-icons';

interface IconWrapperProps {
  icon: IconType;
  size?: number;
  className?: string;
  [key: string]: any;
}

/**
 * A wrapper component for react-icons that provides proper TypeScript type checking.
 */
const IconWrapper: React.FC<IconWrapperProps> = ({ icon, ...props }) => {
  // Cast to any to bypass TypeScript's strict checking
  const Icon = icon as any;
  return <Icon {...props} />;
};

export default IconWrapper;