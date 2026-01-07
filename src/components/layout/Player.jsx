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
import {
  Play,
  Pause,
  SkipBack,
  SkipForward,
  Heart,
  HeartOff,
  Shuffle,
  Repeat,
  Repeat1,
  Volume,
  Volume1,
  Volume2,
  VolumeX,
  Plus,
  ChevronUp,
  ChevronDown,
  ListPlus
} from "lucide-react";


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

  // State management
  const [liked, setLiked] = useState(false);
  const [playlists, setPlaylists] = useState([]);
  const [showPicker, setShowPicker] = useState(false);
  const [showVisualizer, setShowVisualizer] = useState(false);
  const [newPlaylistName, setNewPlaylistName] = useState("");
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(0.8);

  // Audio event listeners
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
  }, [currentTrack?.id, audioRef]);

  // Volume control
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = volume;
    }
  }, [volume, audioRef]);

  // Like state sync
  useEffect(() => {
    if (!currentTrack || !user) {
      setLiked(false);
      return;
    }
    isTrackLiked(currentTrack.id).then(setLiked);
  }, [currentTrack?.id, user]);

  // Action handlers
  const toggleLike = async () => {
    if (!user) return alert("Login to like songs");

    try {
      liked ? await unlikeTrack(currentTrack.id) : await likeTrack(currentTrack.id);
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

  const handleCreateAndAdd = async () => {
    if (!newPlaylistName.trim()) return;

    try {
      const res = await createPlaylist({ name: newPlaylistName });
      const playlistId = res?.id || res?.data?.id || res?.playlistId;

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

  const togglePlayPause = () => {
    const audio = audioRef.current;
    audio?.paused ? audio.play() : audio.pause();
  };

  const handleSeek = (e) => {
    const newTime = parseFloat(e.target.value);
    if (audioRef.current) {
      audioRef.current.currentTime = newTime;
      setCurrentTime(newTime);
    }
  };

  const toggleLoop = () => {
    setLoop((l) => (l === "off" ? "all" : l === "all" ? "one" : "off"));
  };

  const handleVolumeChange = (e) => {
    setVolume(e.target.value / 100);
  };

  // Utility functions
  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  const getVolumeIcon = () => {
    if (volume === 0) return "🔇";
    if (volume < 0.5) return "🔉";
    return "🔊";
  };

  const getLoopDisplay = () => {
    if (loop === "off") return "🔁";
    if (loop === "all") return "🔁 All";
    return "🔂 One";
  };

  // Early return if no track
  if (!currentTrack) {
    return <footer className="player">No track selected</footer>;
  }

  return (
    <>
      <footer className="player">
        {/* LEFT SECTION */}
        <div className="player__left">
          <div className="player__track-info">
            <div className="player__track-text">
              <strong className="player__track-title">{currentTrack.title}</strong>
              <span className="player__track-artist">{currentTrack.artist}</span>
            </div>
          </div>

          <button className="icon-btn like-btn" onClick={toggleLike}>
            {liked ? <Heart fill="currentColor" /> : <Heart />}
          </button>

          <button className="player__playlist-btn" onClick={openPlaylistPicker}>
            <ListPlus size={18} />
          </button>

        </div>

        {/* CENTER SECTION */}
        <div className="player__center">
          <audio ref={audioRef} crossOrigin="anonymous" />

          {/* Playback Controls */}
          <div className="player-controls">
            <button className="icon-btn" onClick={previous}>
              <SkipBack />
            </button>
            <button onClick={togglePlayPause} className="icon-btn">
              {isPlaying ? <Pause /> : <Play />}
            </button>

            <button className="icon-btn" onClick={next}>
              <SkipForward />
            </button>
          </div>

          {/* Progress Bar */}
          <div className="player-progress">
            <span>{formatTime(currentTime)}</span>
            <input
              type="range"
              min={0}
              max={duration || 0}
              value={currentTime}
              onChange={handleSeek}
              style={{
                "--progress": `${(currentTime / (duration || 1)) * 100}%`
              }}
            />

            <span>{formatTime(duration)}</span>
          </div>

          {/* Shuffle/Loop Modes */}
          <div className="player-modes">
            <button
              className={`icon-btn ${shuffle ? "active" : ""}`}
              onClick={() => setShuffle(s => !s)}
            >
              <Shuffle />
            </button>

            <button className="icon-btn" onClick={toggleLoop}>
              {loop === "one" ? <Repeat1 /> : <Repeat />}
            </button>

          </div>
        </div>

        {/* RIGHT SECTION */}
        <div className="player__right">
          <div className="volume-control">
            <span className="volume-icon">
              {volume === 0 && <VolumeX />}
              {volume > 0 && volume < 0.5 && <Volume1 />}
              {volume >= 0.5 && <Volume2 />}
            </span>

            <input
              type="range"
              min="0"
              max="100"
              value={Math.round(volume * 100)}
              onChange={handleVolumeChange}
            />
          </div>

          <button className="icon-btn" onClick={() => setShowVisualizer(v => !v)}>
            {showVisualizer ? <ChevronDown /> : <ChevronUp />}
          </button>

        </div>
      </footer>

      {/* VISUALIZER OVERLAY */}
      {showVisualizer && (
        <div className="visualizer-overlay">
          <h1>{currentTrack.title}</h1>
          <p>{currentTrack.artist}</p>
          <AudioVisualizer audioRef={audioRef} key={currentTrack.id} />
        </div>
      )}

      {/* PLAYLIST PICKER MODAL */}
      {showPicker && (
        <div className="playlist-picker">
          <h4>Add to playlist</h4>

          <input
            placeholder="New playlist name"
            value={newPlaylistName}
            onChange={(e) => setNewPlaylistName(e.target.value)}
          />

          <button onClick={handleCreateAndAdd}>Create & Add</button>

          {playlists.map((p) => (
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