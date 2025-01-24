import { DialogAtom } from "@/types/dialog";
import { atom } from "jotai";

export const dialogAtom = atom<DialogAtom | null>(null);
