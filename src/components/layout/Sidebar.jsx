import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../auth/AuthContext";

export default function Sidebar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();        // clear state + storage
    navigate("/");  // safe public page
  };

  return (
    <aside className="sidebar">
      <h2>Aether</h2>
      <nav>
        <Link to="/">Home</Link>
        <Link to="/tracks">Tracks</Link>
        <Link to="/albums">Albums</Link>

        {user && (
          <>
            <Link to="/playlists">Playlists</Link>
            <Link to="/liked">Liked Songs</Link>
            <button onClick={handleLogout}>Logout</button>
          </>
        )}

        {!user && <Link to="/auth">Login</Link>}
      </nav>
    </aside>
  );
}
