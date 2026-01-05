import { httpRequest } from "./http";

export const likeTrack = (trackId) =>
  httpRequest(`/tracks/reaction/${trackId}/like`, {
    method: "POST",
  });

export const unlikeTrack = (trackId) =>
  httpRequest(`/tracks/reaction/${trackId}/like`, {
    method: "DELETE",
  });

export const getLikedTracks = () =>
  httpRequest("/me/liked-tracks");
export const isTrackLiked = async (trackId) => {
  const likedTracks = await getLikedTracks();
  return likedTracks.some(t => t.id === trackId);
};
