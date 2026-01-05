import { httpRequest } from "./http";

export function getHome() {
  return httpRequest("/home");
}
