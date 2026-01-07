import { useNavigate } from "react-router-dom";

export default function HomeHero({ hero }) {
  const navigate = useNavigate();

  if (!hero?.context?.length) return null;

  return (
    <section className="home-hero">
      <h1>{hero.greeting}</h1>

      <div className="hero-context">
        {hero.context.map(item => (
          <div
            key={`${item.type}-${item.id}`}
            className="hero-card clickable"
            onClick={() => {
              if (item.type === "PLAYLIST") {
                navigate(`/playlists/${item.id}`);
              }
              if (item.type === "ALBUM") {
                navigate(`/albums/${item.id}`);
              }
            }}
          >
            <span className="hero-type">{item.type}</span>
            <p className="hero-title">{item.title}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
