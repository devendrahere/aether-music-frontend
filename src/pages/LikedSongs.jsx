import { useEffect, useState } from "react";
import { getLikedTracks } from "../api/track.api";
import { usePlayer } from "../context/PlayerContext";

export default function LikedSongs() {
  const [tracks, setTracks] = useState([]);
  const { playTrack } = usePlayer();

  useEffect(() => {
    getLikedTracks().then(setTracks);
  }, []);

  if (tracks.length === 0) {
    return <h2>No liked songs yet</h2>;
  }

  return (
    <div>
      <h1>Liked Songs</h1>

      {tracks.map((t, i) => (
        <div
          key={t.id}
          className="track-row"
          onClick={() =>
            playTrack({
              id: t.id,
              title: t.title,
              artist:
                t.artists?.map(a => a.name).join(", ") ??
                "Unknown Artist",
              streamUrl: `http://localhost:8080/tracks/${t.id}/stream`,
            })
          }
        >
          {i + 1}. ▶ {t.title}
        </div>
      ))}
    </div>
  );
}
