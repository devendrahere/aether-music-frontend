import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  getPlaylists,
  createPlaylist,
  deletePlaylist
} from "../api/playlist.api";

export default function Playlists() {
  const [playlists, setPlaylists] = useState([]);
  const [name, setName] = useState("");

  const load = async () => {
    const data = await getPlaylists();
    setPlaylists(data);
  };

  useEffect(() => {
    load();
  }, []);

  const create = async () => {
    if (!name.trim()) return;

    await createPlaylist({ name });
    setName("");
    load();
  };

  const remove = async (id) => {
    if (!confirm("Delete this playlist?")) return;
    await deletePlaylist(id);
    load();
  };

  return (
    <div>
      <h1>Your Playlists</h1>

      <div style={{ marginBottom: 16 }}>
        <input
          placeholder="New playlist name"
          value={name}
          onChange={e => setName(e.target.value)}
        />
        <button onClick={create}>Create</button>
      </div>

      {playlists.length === 0 && <p>No playlists yet</p>}

      {playlists.map(p => (
        <div
          key={p.id}
          style={{
            display: "flex",
            alignItems: "center",
            gap: 12
          }}
        >
          {/* Navigation ONLY */}
          <Link to={`/playlists/${p.id}`}>
            🎵 {p.name} ({p.trackCount})
          </Link>

          {/* Action ONLY */}
          <button
            type="button"
            onClick={() => remove(p.id)}
          >
            🗑️
          </button>
        </div>
      ))}

    </div>
  );
}