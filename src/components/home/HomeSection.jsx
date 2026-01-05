import TrackList from "../track/TrackList";
// import '../styles/home.css';

export default function HomeSection({ section }) {
  if (!section.items.length) return null;
  

  return (
    <section className="home-section">
      <h2>{section.title}</h2>
      <TrackList tracks={section.items} />
    </section>
  );
}
