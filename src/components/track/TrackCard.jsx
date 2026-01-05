import { usePlayer } from "../../context/PlayerContext";

export default function TrackCard({ track, index, tracks }) {
  const { playTracks } = usePlayer();

  return (
    <div
      className="track-card"
      onClick={() => playTracks(tracks, index)}
    >
      <div>{track.title}</div>
      <div>{track.artist?.name}</div>
    </div>
  );
}
