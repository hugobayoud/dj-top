'use client';

import * as React from 'react';
import { Toast } from 'radix-ui';
import { CheckCircledIcon, CrossCircledIcon } from '@radix-ui/react-icons';

import './styles.css';

// Define Toast component
export interface ToastProps {
  title?: string;
  description: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  type?: 'success' | 'error';
  duration?: number;
}

export const ToastNotification = ({
  title,
  description,
  open,
  onOpenChange,
  type = 'success',
  duration = 3000,
}: ToastProps) => {
  const backgroundColor =
    type === 'success' ? 'var(--green-4)' : 'var(--red-4)';
  const color = type === 'success' ? 'var(--green-11)' : 'var(--red-11)';
  const borderColor = type === 'success' ? 'var(--green-6)' : 'var(--red-6)';

  return (
    <Toast.Root
      className="ToastRoot"
      open={open}
      onOpenChange={onOpenChange}
      duration={duration}
      data-type={type}
      style={{
        backgroundColor,
        color,
        border: `1px solid ${borderColor}`,
        borderRadius: '4px',
        padding: '12px',
      }}
    >
      {title && (
        <Toast.Title className="ToastTitle">
          {type === 'success' ? (
            <CheckCircledIcon color={`var(--green-9)`} />
          ) : (
            <CrossCircledIcon color={`var(--red-9)`} />
          )}
          {title}
        </Toast.Title>
      )}
      <Toast.Description className="ToastDescription">
        {description}
      </Toast.Description>
      <Toast.Action
        className="ToastAction"
        asChild
        altText="Dismiss notification"
      >
        <button className="ToastDismiss">Dismiss</button>
      </Toast.Action>
    </Toast.Root>
  );
};

// Create a combined component for easier usage
type ToastContextType = {
  showToast: (props: Omit<ToastProps, 'open' | 'onOpenChange'>) => void;
};

const ToastContext = React.createContext<ToastContextType | undefined>(
  undefined
);

export const ToastContainer = ({ children }: { children: React.ReactNode }) => {
  const [open, setOpen] = React.useState(false);
  const [toastProps, setToastProps] = React.useState<
    Omit<ToastProps, 'open' | 'onOpenChange'>
  >({
    description: '',
  });

  const showToast = React.useCallback(
    (props: Omit<ToastProps, 'open' | 'onOpenChange'>) => {
      setToastProps(props);
      setOpen(true);
    },
    []
  );

  const value = React.useMemo(() => ({ showToast }), [showToast]);

  return (
    <ToastContext.Provider value={value}>
      <Toast.Provider swipeDirection="right">
        {children}
        <ToastNotification {...toastProps} open={open} onOpenChange={setOpen} />
        <Toast.Viewport className="ToastViewport" />
      </Toast.Provider>
    </ToastContext.Provider>
  );
};

// Create a hook for using the toast
export const useToast = () => {
  const context = React.useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within a ToastContainer');
  }
  return context;
};
