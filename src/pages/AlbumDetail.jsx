import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { usePlayer } from "../context/PlayerContext";
import { httpRequest } from "../api/http";

export default function AlbumDetail() {
  const { id } = useParams();
  const { playQueue } = usePlayer(); // 🔥 FIX
  const [album, setAlbum] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    httpRequest(`/albums/${id}`)
      .then(setAlbum)
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) return <h2>Loading album…</h2>;
  if (!album) return <h2>Album not found</h2>;

  const queue = album.tracks.map(t => ({
    id: t.id,
    title: t.title,
    artist: t.artist?.name ?? album.artist.name,
    streamUrl: `http://localhost:8080/tracks/${t.id}/stream`
  }));

  return (
    <div>
      <h1>{album.title}</h1>
      <p>
        {album.artist.name} • {album.releaseYear}
      </p>

      <h3>Tracks</h3>

      {album.tracks.map((track, index) => (
        <div
          key={track.id}
          className="track-row"
          onClick={() =>
            playQueue(queue, {
              type: "album",
              id: album.id,
              startIndex: index
            })
          }
        >
          {index + 1}. ▶ {track.title}
          <span style={{ float: "right", opacity: 0.6 }}>
            {Math.floor(track.durationSec / 60)}:
            {(track.durationSec % 60).toString().padStart(2, "0")}
          </span>
        </div>
      ))}
    </div>
  );
}
