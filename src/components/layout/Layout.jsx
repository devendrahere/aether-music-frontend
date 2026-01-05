import { Outlet } from "react-router-dom";
import Sidebar from "./Sidebar";
import Player from "./Player";

export default function Layout() {
  return (
    <div className="app">
      <Sidebar />
      <main className="content">
        <Outlet />
      </main>
      <Player />
    </div>
  );
}
