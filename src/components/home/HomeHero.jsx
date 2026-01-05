import { useNavigate } from "react-router-dom";

export default function HomeHero({ hero }) {
  const navigate = useNavigate();
  const playlist = hero.featuredPlaylist;

  return (
    <>
      <h1>{hero.greeting}</h1>

      {playlist && (
        <div
          className="featured-playlist clickable"
          onClick={() => navigate(`/playlists/${playlist.id}`)}
        >
            <h3>Continue listening</h3>
          <div>
            
            <p>{playlist.name}</p>
            <span>{playlist.trackCount} tracks</span>
          </div>
        </div>
      )}
    </>
  );
}