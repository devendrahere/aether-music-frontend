import { httpRequest } from "./http";

export const getPlaylists = () =>
  httpRequest("/playlists", { authCritical: true });

export const getPlaylistById = (id) =>
  httpRequest(`/playlists/${id}`, { authCritical: true });

export const createPlaylist = (data) =>
  httpRequest("/playlists", {
    method: "POST",
    body: data,
    authCritical: true,
  });

export const deletePlaylist = (playlistId) =>
  httpRequest(`/playlists/${playlistId}`, {
    method: "DELETE",
    authCritical: true,
  });

export const addTrackToPlaylist = (playlistId, trackId) =>
  httpRequest(`/playlists/${playlistId}/tracks/${trackId}`, {
    method: "POST",
    authCritical: true,
  });

export const removeTrackFromPlaylist = (playlistId, trackId) =>
  httpRequest(`/playlists/${playlistId}/tracks/${trackId}`, {
    method: "DELETE",
    authCritical: true,
  });
