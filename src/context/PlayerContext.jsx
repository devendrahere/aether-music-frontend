import {
  createContext,
  useContext,
  useEffect,
  useRef,
  useState
} from "react";
import { recordPlayEvent } from "../api/playEvent.api";

const PlayerContext = createContext(null);

export function PlayerProvider({ children }) {
  const audioRef = useRef(null);


  const sessionIdRef = useRef(
    localStorage.getItem("sessionId") ?? crypto.randomUUID()
  );

  useEffect(() => {
    localStorage.setItem("sessionId", sessionIdRef.current);
  }, []);


  const [queue, setQueue] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(null);

  const [context, setContext] = useState({
    type: null,
    id: null
  });

  const [isPlaying, setIsPlaying] = useState(false);
  const [shuffle, setShuffle] = useState(false);
  const [loop, setLoop] = useState("off"); // off | one | all

  const currentTrack =
    currentIndex !== null ? queue[currentIndex] : null;


  const playQueue = (tracks, { type, id = null, startIndex = 0 }) => {
    if (!Array.isArray(tracks) || tracks.length === 0) return;

    setQueue(tracks);
    setCurrentIndex(startIndex);
    setContext({ type, id });
  };

  const playTrack = (track) => {
    if (!track) return;

    playQueue([track], {
      type: "single",
      id: track.id,
      startIndex: 0
    });
  };


  useEffect(() => {
    const audio = audioRef.current;
    if (!audio || !currentTrack) return;

    audio.src = currentTrack.streamUrl;

    audio.play()
      .then(() => {
        recordPlayEvent({
          sessionId: sessionIdRef.current,
          trackId: currentTrack.id,
          playlistId: context.type === "playlist" ? context.id : null,
          albumId: context.type === "album" ? context.id : null,
          eventType: "PLAY"
        });
      })
      .catch(() => { });
  }, [currentTrack?.id]);


  const next = () => {
    setCurrentIndex(i => {
      if (i === null) return i;

      if (shuffle) {
        return Math.floor(Math.random() * queue.length);
      }

      if (i + 1 < queue.length) return i + 1;

      return loop === "all" ? 0 : i;
    });
  };

  const previous = () => {
    setCurrentIndex(i => {
      if (i === null) return i;

      if (shuffle) {
        return Math.floor(Math.random() * queue.length);
      }

      if (i > 0) return i - 1;

      return loop === "all" ? queue.length - 1 : i;
    });
  };


  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const onEnded = () => {
      if (loop === "one") {
        audio.currentTime = 0;
        audio.play();
        return;
      }
      next();
    };

    audio.addEventListener("ended", onEnded);
    return () => audio.removeEventListener("ended", onEnded);
  }, [queue, shuffle, loop]);


  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const onPlay = () => setIsPlaying(true);
    const onPause = () => setIsPlaying(false);

    audio.addEventListener("play", onPlay);
    audio.addEventListener("pause", onPause);

    return () => {
      audio.removeEventListener("play", onPlay);
      audio.removeEventListener("pause", onPause);
    };
  }, [currentTrack]);

  return (
    <PlayerContext.Provider
      value={{
        audioRef,
        currentTrack,
        queue,
        currentIndex,
        context,
        isPlaying,
        playQueue,
        playTrack,
        next,
        previous,
        shuffle,
        loop,
        setShuffle,
        setLoop
      }}
    >
      {children}
    </PlayerContext.Provider>
  );
}

export const usePlayer = () => {
  const ctx = useContext(PlayerContext);
  if (!ctx) {
    throw new Error("usePlayer must be used inside PlayerProvider");
  }
  return ctx;
};
