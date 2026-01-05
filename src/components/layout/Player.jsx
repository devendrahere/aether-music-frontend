import { usePlayer } from "../../context/PlayerContext";
import { useAuth } from "../../auth/AuthContext";
import { likeTrack, unlikeTrack, isTrackLiked } from "../../api/track.api";
import { useEffect, useState } from "react";
import AudioVisualizer from "./AudioVisualizer";
import {
  getPlaylists,
  addTrackToPlaylist,
  createPlaylist
} from "../../api/playlist.api";
import { recordPlayEvent } from "../../api/playEvent.api";

export default function Player() {
  const {
    audioRef,
    currentTrack,
    isPlaying,
    next,
    previous,
    shuffle,
    loop,
    setShuffle,
    setLoop
  } = usePlayer();

  const { user } = useAuth();

  const [liked, setLiked] = useState(false);
  const [playlists, setPlaylists] = useState([]);
  const [showPicker, setShowPicker] = useState(false);
  const [showVisualizer, setShowVisualizer] = useState(false);
  const [newPlaylistName, setNewPlaylistName] = useState("");
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(0.8);


  /* ---------------- AUDIO TIME ---------------- */
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const onTimeUpdate = () => setCurrentTime(audio.currentTime);
    const onLoadedMetadata = () => setDuration(audio.duration || 0);

    audio.addEventListener("timeupdate", onTimeUpdate);
    audio.addEventListener("loadedmetadata", onLoadedMetadata);

    return () => {
      audio.removeEventListener("timeupdate", onTimeUpdate);
      audio.removeEventListener("loadedmetadata", onLoadedMetadata);
    };
  }, [currentTrack?.id]);
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = volume;
    }
  }, [volume]);
  /* ---------------- LIKE STATE ---------------- */
  useEffect(() => {
    if (!currentTrack || !user) {
      setLiked(false);
      return;
    }
    isTrackLiked(currentTrack.id).then(setLiked);
  }, [currentTrack?.id, user]);

  /* ---------------- PLAY EVENT ---------------- */
  useEffect(() => {
    if (currentTrack && user) {
      recordPlayEvent(currentTrack.id).catch(() => { });
    }
  }, [currentTrack?.id]);

  if (!currentTrack) {
    return <footer className="player">No track selected</footer>;
  }
  

  /* ---------------- ACTIONS ---------------- */
  const toggleLike = async () => {
    if (!user) return alert("Login to like songs");

    try {
      liked
        ? await unlikeTrack(currentTrack.id)
        : await likeTrack(currentTrack.id);
      setLiked(!liked);
    } catch {
      alert("Failed to update like");
    }
  };

  const openPlaylistPicker = async () => {
    if (!user) return alert("Login first");
    const data = await getPlaylists();
    setPlaylists(data);
    setShowPicker(true);
  };

  const handleAddToPlaylist = async (playlistId) => {
    try {
      await addTrackToPlaylist(playlistId, currentTrack.id);
      setShowPicker(false);
    } catch {
      alert("Failed to add track");
    }
  };

  // FINAL FIX — DEFENSIVE & CORRECT
  const handleCreateAndAdd = async () => {
    if (!newPlaylistName.trim()) return;

    try {
      const res = await createPlaylist({ name: newPlaylistName });

      const playlistId =
        res?.id || res?.data?.id || res?.playlistId;

      if (!playlistId) {
        throw new Error("Playlist ID missing from createPlaylist response");
      }

      await addTrackToPlaylist(playlistId, currentTrack.id);

      setNewPlaylistName("");
      setShowPicker(false);
    } catch (err) {
      console.error(err);
      alert("Failed to create playlist");
    }
  };

  /* ---------------- UI ---------------- */
  return (
    <>
      <footer className="player">
        {/* LEFT */}
        <div className="player__left">
          <div className="player__track-info">
            <strong>{currentTrack.title}</strong> — {currentTrack.artist}
          </div>

          <button className="player__like-btn" onClick={toggleLike}>
            {liked ? "💔" : "❤️"}
          </button>

          <button
            className="player__playlist-btn"
            onClick={() => {
              openPlaylistPicker();
            }}
          >
            ➕ Playlist
          </button>

        </div>

        {/* CENTER */}
        <div className="player__center">
          <audio ref={audioRef} crossOrigin="anonymous" />

          <div className="player-controls">
            <button onClick={previous}>⏮</button>

            <button
              onClick={() => {
                const audio = audioRef.current;
                audio?.paused ? audio.play() : audio.pause();
              }}
            >
              {isPlaying ? "⏸" : "▶"}
            </button>

            <button onClick={next}>⏭</button>
          </div>

          <div className="player-progress">
            <span>
              {Math.floor(currentTime / 60)}:
              {Math.floor(currentTime % 60).toString().padStart(2, "0")}
            </span>

            <input
              type="range"
              min={0}
              max={duration || 0}
              value={currentTime}
              onChange={(e) => {
                audioRef.current.currentTime = e.target.value;
                setCurrentTime(e.target.value);
              }}
            />

            <span>
              {Math.floor(duration / 60)}:
              {Math.floor(duration % 60).toString().padStart(2, "0")}
            </span>
          </div>

          <div className="player-modes">
            <button
              className={shuffle ? "active" : ""}
              onClick={() => setShuffle(s => !s)}
            >
              🔀
            </button>

            <button
              onClick={() =>
                setLoop(l =>
                  l === "off" ? "all" : l === "all" ? "one" : "off"
                )
              }
            >
              {loop === "off" && "🔁"}
              {loop === "all" && "🔁 All"}
              {loop === "one" && "🔂 One"}
            </button>
          </div>
        </div>

        {/* RIGHT */}
        <div className="player__right">
          <div className="volume-control">
            <span className="volume-icon">
              {volume === 0 ? "🔇" : volume < 0.5 ? "🔉" : "🔊"}
            </span>

            <input
              type="range"
              min="0"
              max="100"
              value={Math.round(volume * 100)}
              onChange={(e) => setVolume(e.target.value / 100)}
            />
          </div>

          <button onClick={() => setShowVisualizer(v => !v)}>
            {showVisualizer ? "🔽" : "🔼"}
          </button>
        </div>

      </footer>

      {showVisualizer && (
        <div className="visualizer-overlay">
          <h1>{currentTrack.title}</h1>
          <p>{currentTrack.artist}</p>
          <AudioVisualizer audioRef={audioRef} key={currentTrack.id} />
        </div>
      )}

      {showPicker && (
        <div className="playlist-picker">
          <h4>Add to playlist</h4>

          <input
            placeholder="New playlist name"
            value={newPlaylistName}
            onChange={(e) => setNewPlaylistName(e.target.value)}
          />

          <button onClick={handleCreateAndAdd}>
            Create & Add
          </button>

          {playlists.map(p => (
            <button key={p.id} onClick={() => handleAddToPlaylist(p.id)}>
              {p.name}
            </button>
          ))}

          <button onClick={() => setShowPicker(false)}>Cancel</button>
        </div>
      )}
    </>
  );
}