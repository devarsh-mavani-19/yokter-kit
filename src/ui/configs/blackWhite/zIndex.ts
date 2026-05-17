import type { ZIndexType } from "../../types";

export const zIndex: Record<ZIndexType, number> = {
  base: 0,
  raised: 1,
  dropdown: 10,
  sticky: 20,
  overlay: 30,
  modal: 40,
  toast: 50,
};
