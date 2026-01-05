import { useEffect, useState } from "react";
import { usePlayer } from "../context/PlayerContext";
import { httpRequest } from "../api/http";

export default function Tracks() {
  const [tracks, setTracks] = useState([]);
  const [query, setQuery] = useState("");

  const { playQueue } = usePlayer(); // 🔥 NOT playTrack

  useEffect(() => {
    const url =
      query.trim().length > 0
        ? `/tracks/search?name=${encodeURIComponent(query)}`
        : "/tracks";

    httpRequest(url).then(setTracks);
  }, [query]);

  return (
    <div>
      <h2>Tracks</h2>

      <input
        type="text"
        className="search-box"
        placeholder="Search tracks…"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
      />

      {tracks.map((t, index) => (
        <div
          key={t.id}
          className="track-row"
          onClick={() =>
            playQueue(
              tracks.map(track => ({
                id: track.id,
                title: track.title,
                artist:
                  track.artists?.map(a => a.name).join(", ") ??
                  "Unknown",
                streamUrl: `http://localhost:8080/tracks/${track.id}/stream`
              })),
              {
                type: "tracks",
                startIndex: index
              }
            )
          }
        >
          ▶ {t.title} —{" "}
          {t.artists?.map(a => a.name).join(", ")}
        </div>
      ))}
    </div>
  );
}
