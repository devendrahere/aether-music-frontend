import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getAlbums } from "../api/album.api";

export default function Albums() {
  const [albums, setAlbums] = useState([]);

  useEffect(() => {
    getAlbums().then(data => {
      console.log("ALBUMS:", data); // DEBUG
      setAlbums(data);
    });
  }, []);

  if (albums.length === 0) {
    return <h2>No albums found</h2>;
  }

  return (
    <div>
      <h1>Albums</h1>

      {albums.map(album => (
        <Link
          key={album.id}
          to={`/albums/${album.id}`}
          style={{ display: "block", marginBottom: 10 }}
        >
          💿 {album.title} — {album.artistName}
        </Link>
      ))}
    </div>
  );
}
