import ReactDOM from "react-dom/client";
import App from "./App";
import { AuthProvider } from "./auth/AuthContext";
import { PlayerProvider } from "./context/PlayerContext";


import './styles/variables.css'
import './styles/layout.css'
import './styles/sidebar.css'
import './styles/player.css'
import './styles/content.css'
import './styles/forms.css'
import './styles/responsive.css'
// import './styles/visualizer.css'
import './styles/home.css'



ReactDOM.createRoot(document.getElementById("root")).render(
  <AuthProvider>
    <PlayerProvider>
      <App />
    </PlayerProvider>
  </AuthProvider>
);
