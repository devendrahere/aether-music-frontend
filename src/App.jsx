import { Routes, Route } from "react-router-dom";
import Layout from "./components/layout/Layout";
import RequireAuth from "./auth/RequireAuth";

import Home from "./pages/Home";
import Albums from "./pages/Albums";
import AlbumDetail from "./pages/AlbumDetail";
import Tracks from "./pages/Tracks";
import Auth from "./pages/Auth";
import Playlists from "./pages/Playlists";
import LikedSongs from "./pages/LikedSongs";
import PlaylistDetail from "./pages/PlaylistDetail";

function App() {
  return (
    <Routes>
      {/* Auth */}
      <Route path="/login" element={<Auth />} />
      <Route path="/auth" element={<Auth />} />

      {/* Layout */}
      <Route element={<Layout />}>
        <Route path="/" element={<Home />} />
        <Route path="/tracks" element={<Tracks />} />
        <Route path="/albums" element={<Albums />} />
        <Route path="/albums/:id" element={<AlbumDetail />} />

        <Route element={<RequireAuth />}>
          <Route path="/playlists" element={<Playlists />} />
          <Route path="/playlists/:id" element={<PlaylistDetail />} />
          <Route path="/liked" element={<LikedSongs />} />
        </Route>
      </Route>
    </Routes>
  );
}

export default App;
