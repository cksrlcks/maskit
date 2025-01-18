import { ALERT_LABEL_ACTION, ALERT_LABEL_CANCEL } from "@/constants/common";
import { createContext, PropsWithChildren, useContext, useState } from "react";

type AlertType = {
  title: string;
  message: string;
  actionLabel?: string;
  cancelLabel?: string;
  onAction?: () => void;
};

type AlertContextProps = Partial<AlertType> & {
  alertState: AlertType;
  open: boolean;
  onAlert: (alert: AlertType) => void;
  onClose: () => void;
};

const AlertContext = createContext<AlertContextProps | null>(null);

export function AlertProvider({ children }: PropsWithChildren) {
  const [open, setOpen] = useState(false);
  const [alertState, setAlertState] = useState<AlertType>({
    title: "",
    message: "",
    actionLabel: ALERT_LABEL_ACTION,
    cancelLabel: ALERT_LABEL_CANCEL,
  });

  function handleAlert(alert: AlertType) {
    setOpen(true);
    setAlertState((prev) => ({ ...prev, ...alert }));
  }

  function handleAction() {
    setOpen(false);
    if (alertState && alertState.onAction) {
      alertState.onAction();
    }
  }

  function handleClose() {
    setOpen(false);
  }

  const value = {
    alertState,
    open,
    onAlert: handleAlert,
    onAction: handleAction,
    onClose: handleClose,
  };

  return <AlertContext.Provider value={value}>{children}</AlertContext.Provider>;
}

export function useAlert() {
  const context = useContext(AlertContext);

  if (!context) {
    throw new Error("Alert 컨택스트는 AlertProvider 내부에서 사용가능합니다.");
  }

  return context;
}
