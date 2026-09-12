import React, { createContext, useContext, useState, useCallback, ReactNode } from 'react';
import { Portal, Snackbar } from 'react-native-paper';
import { snackbarColor } from '../constants/theme';

export type SnackbarType = 'success' | 'error';

interface SnackbarOptions {
  message: string;
  type?: SnackbarType;
  duration?: number;
}

interface SnackbarContextData {
  showSnackbar: (options: SnackbarOptions) => void;
  showSuccess: (message: string, duration?: number) => void;
  showError: (message: string, duration?: number) => void;
  hideSnackbar: () => void;
}

const SnackbarContext = createContext<SnackbarContextData | undefined>(undefined);

export function SnackbarProvider({ children }: { children: ReactNode }) {
  const [visible, setVisible] = useState(false);
  const [message, setMessage] = useState('');
  const [type, setType] = useState<SnackbarType>('success');
  const [duration, setDuration] = useState(3000);

  const showSnackbar = useCallback(
    ({ message: msg, type: t = 'success', duration: d = 3000 }: SnackbarOptions) => {
      setMessage(msg);
      setType(t);
      setDuration(d);
      setVisible(true);
    },
    []
  );

  const showSuccess = useCallback(
    (msg: string, d = 3000) => {
      showSnackbar({ message: msg, type: 'success', duration: d });
    },
    [showSnackbar]
  );

  const showError = useCallback(
    (msg: string, d = 3000) => {
      showSnackbar({ message: msg, type: 'error', duration: d });
    },
    [showSnackbar]
  );

  const hideSnackbar = useCallback(() => {
    setVisible(false);
  }, []);

  const backgroundColor =
    type === 'success' ? snackbarColor.success : snackbarColor.error;

  return (
    <SnackbarContext.Provider value={{ showSnackbar, showSuccess, showError, hideSnackbar }}>
      {children}
      <Portal>
        <Snackbar
          visible={visible}
          onDismiss={hideSnackbar}
          duration={duration}
          style={{ backgroundColor }}
        >
          {message}
        </Snackbar>
      </Portal>
    </SnackbarContext.Provider>
  );
}

export function useSnackbar(): SnackbarContextData {
  const context = useContext(SnackbarContext);
  if (!context) {
    throw new Error('useSnackbar deve ser utilizado dentro de um SnackbarProvider');
  }
  return context;
}
