export type DialogProps = {
  open: boolean;
  setOpen: (open: boolean) => void;
};

export type DialogAtom = "help" | "guide" | "feature";
