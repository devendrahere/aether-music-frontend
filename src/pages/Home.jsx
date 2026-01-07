import { useEffect, useState } from "react";
import { getHome } from "../api/home.api";
import HomeHero from "../components/home/HomeHero";
import HomeSection from "../components/home/HomeSection";


export default function Home() {
  const [home, setHome] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getHome()
      .then(setHome)
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <p>Loading...</p>;
  if (!home) return <p>No data</p>;

  return (
    <div className="content">
      {/* THIS is where featured playlist comes from */}
      <HomeHero hero={home.hero} />

      {home.sections.map((section, index) => (
        <HomeSection key={`${section.type}-${index}`} section={section} />
      ))}

    </div>
  );
}
