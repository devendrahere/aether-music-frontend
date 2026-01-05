import { httpRequest } from "./http";

export const getAlbums = () => httpRequest("/albums");
