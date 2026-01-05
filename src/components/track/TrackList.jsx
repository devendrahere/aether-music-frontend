import { usePlayer } from "../../context/PlayerContext";

export default function TrackList({ tracks, context }) {
  const { playQueue } = usePlayer();

  const queue = tracks.map(t => ({
    id: t.id,
    title: t.title,
    artist: t.artists?.map(a => a.name).join(", ") ?? "Unknown Artist",
    streamUrl: `http://localhost:8080/tracks/${t.id}/stream`,
  }));

  return (
    <div className="track-list">
      {tracks.map((t, i) => (
        <div
          key={t.id}
          className="track-row"
          onClick={() =>
            playQueue(queue, {
              type: context?.type ?? "tracks",
              id: context?.id ?? null,
              startIndex: i
            })
          }
        >
          {i + 1}. ▶ {t.title}
        </div>
      ))}
    </div>
  );
}
