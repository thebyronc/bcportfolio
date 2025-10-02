import React from 'react';

// Common component props
export interface BaseComponentProps {
  className?: string;
  children?: React.ReactNode;
}

// Size variants
export type Size = 'sm' | 'md' | 'lg' | 'xl';

// Icon component props
export interface IconProps {
  className?: string;
  size?: Size;
}

// Button variants
export type ButtonVariant = 'primary' | 'secondary' | 'danger' | 'ghost';
export type ButtonSize = 'sm' | 'md' | 'lg';

// Modal/Dialog props
export interface ModalProps extends BaseComponentProps {
  open: boolean;
  onClose: () => void;
}

// Form props
export interface FormProps extends BaseComponentProps {
  onSubmit: (data: any) => void;
  loading?: boolean;
}

// Navigation props
export interface NavItemProps {
  href: string;
  label: string;
  children?: NavItemProps[];
}

// Animation props
export interface AnimationProps {
  duration?: number;
  delay?: number;
  easing?: string;
}

// Layout props
export interface LayoutProps extends BaseComponentProps {
  title?: string;
  description?: string;
}
