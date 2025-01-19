import { Lang } from "@/types/lang";
import { atomWithStorage } from "jotai/utils";

export const langAtom = atomWithStorage<Lang>("lang", "ko");
