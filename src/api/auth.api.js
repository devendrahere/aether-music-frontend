import { httpRequest } from "./http";

export function loginUser(credentials) {
  return httpRequest("/users/login", {
    method: "POST",
    body: credentials,
  });
}
