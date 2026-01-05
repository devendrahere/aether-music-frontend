import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import {
  getPlaylistById,
  removeTrackFromPlaylist
} from "../api/playlist.api";
import { usePlayer } from "../context/PlayerContext";

export default function PlaylistDetail() {
  const { id } = useParams();
  const [playlist, setPlaylist] = useState(null);
  const { playQueue } = usePlayer(); // 🔥 FIX

  useEffect(() => {
    getPlaylistById(id).then(setPlaylist);
  }, [id]);

  if (!playlist) return <p>Loading…</p>;

  const queue = playlist.tracks.map(t => ({
    id: t.id,
    title: t.title,
    artist: t.artists.map(a => a.name).join(", "),
    streamUrl: `http://localhost:8080/tracks/${t.id}/stream`
  }));

  return (
    <div>
      <h1>{playlist.name}</h1>
      <p>{playlist.description}</p>

      {playlist.tracks.length === 0 && <p>No tracks</p>}

      {playlist.tracks.map((t, index) => (
        <div key={t.id} className="track-row">
          <span
            onClick={() =>
              playQueue(queue, {
                type: "playlist",
                id: playlist.id,
                startIndex: index
              })
            }
          >
            {index + 1}. ▶ {t.title} —{" "}
            {t.artists.map(a => a.name).join(", ")}
          </span>

          <button
            onClick={async () => {
              await removeTrackFromPlaylist(playlist.id, t.id);
              setPlaylist({
                ...playlist,
                tracks: playlist.tracks.filter(x => x.id !== t.id),
              });
            }}
          >
            ❌
          </button>
        </div>
      ))}
    </div>
  );
}
