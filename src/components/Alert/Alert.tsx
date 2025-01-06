import {
  AlertDialog,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogTitle,
} from "@/components/ui";
import { useAlert } from "@/context/AlertContext";
import {} from "@radix-ui/react-alert-dialog";

export function Alert() {
  const {
    open,
    onAction,
    onClose,
    alertState: { title, message, cancelLabel, actionLabel },
  } = useAlert();

  return (
    <AlertDialog open={open}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>{title}</AlertDialogTitle>
          <AlertDialogDescription>{message}</AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel onClick={() => onClose()}>{cancelLabel || "취소"}</AlertDialogCancel>
          <AlertDialogAction onClick={onAction}>{actionLabel || "확인"}</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
