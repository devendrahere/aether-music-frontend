import { httpRequest } from "./http";

export const recordPlayEvent = (dto) =>
  httpRequest("/play-event", {
    method: "POST",
    body: dto
  });
