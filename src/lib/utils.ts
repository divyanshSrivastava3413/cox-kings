import { MASTER_ROUTES } from "../config/constants";
import clsx from "clsx";

export function cn(...inputs) {
  return clsx(inputs);
}

export function getMasterRoute(masterType) {
  return MASTER_ROUTES[masterType];
}
