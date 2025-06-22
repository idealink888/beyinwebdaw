import { useEffect, useRef, useState } from "react";

const NUM_STEPS = 16;

// Correct basePath for Vite (production = GitHub Pages repo subpath, else empty for local)
const basePath = import.meta.env.MODE === 'production' ? '/beyinwebdaw' : '';

const TrackEditor = () => {
  const [steps, setSteps] = useState({
    kick: new Array(NUM_STEPS).fill(false),
    snare: new Array(NUM_STEPS).fill(false),
    synth: new Array(NUM_STEPS).fill(false),
  });

  const [isPlaying, setIsPlaying] = useState(false);
  const [samplesLoaded, setSamplesLoaded] = useState(false);

  const audioCtxRef = useRef(null);
  const samples = useRef({});
  const currentStep = useRef(0);
  const intervalId = useRef(null);

  const loadSample = async (name, url) => {
    const response = await fetch(url);
    const arrayBuffer = await response.arrayBuffer();
    samples.current[name] = await audioCtxRef.current.decodeAudioData(arrayBuffer);
  };

  useEffect(() => {
    audioCtxRef.current = new (window.AudioContext || window.webkitAudioContext)();

    const loadAllSamples = async () => {
      await Promise.all([
        loadSample("kick", `${basePath}/kick.mp3`),
        loadSample("snare", `${basePath}/snare.mp3`),
        loadSample("synth", `${basePath}/synth.mp3`),
      ]);
      setSamplesLoaded(true);
    };

    loadAllSamples();

    // Cleanup interval on unmount
    return () => clearInterval(intervalId.current);
  }, []);

  const toggleStep = (track, index) => {
    setSteps((prev) => ({
      ...prev,
      [track]: prev[track].map((on, i) => (i === index ? !on : on)),
    }));
  };

  const playSample = (name) => {
    const buffer = samples.current[name];
    if (!buffer) {
      console.warn(`Sample ${name} not loaded yet.`);
      return;
    }
    const source = audioCtxRef.current.createBufferSource();
    source.buffer = buffer;
    source.connect(audioCtxRef.current.destination);
    source.start();
  };

  const playLoop = () => {
    intervalId.current = setInterval(() => {
      ["kick", "snare", "synth"].forEach((track) => {
        if (steps[track][currentStep.current]) {
          playSample(track);
        }
      });
      currentStep.current = (currentStep.current + 1) % NUM_STEPS;
    }, 150);
  };

  const startPlayback = () => {
    if (!audioCtxRef.current) return;
    audioCtxRef.current.resume();
    currentStep.current = 0;
    setIsPlaying(true);
    playLoop();
  };

  const stopPlayback = () => {
    clearInterval(intervalId.current);
    setIsPlaying(false);
  };

  if (!samplesLoaded) {
    return <div className="p-6 text-white">Loading samples… 🎧</div>;
  }

  return (
    <div className="p-6 text-white">
      <h2 className="text-2xl font-bold mb-4">Track Editor</h2>
      {["kick", "snare", "synth"].map((track) => (
        <div key={track} className="mb-4">
          <div className="mb-1 capitalize">{track}</div>
          <div className="flex gap-1">
            {steps[track].map((active, index) => (
              <div
                key={index}
                onClick={() => toggleStep(track, index)}
                className={`w-6 h-6 cursor-pointer rounded ${
                  active ? "bg-green-500" : "bg-gray-700"
                }`}
              />
            ))}
          </div>
        </div>
      ))}

      <button
        onClick={() => playSample("kick")}
        className="mt-4 bg-blue-600 px-4 py-2 rounded"
      >
        🔊 Test Kick Sound
      </button>

      <div className="mt-6 flex gap-4">
        {!isPlaying ? (
          <button
            onClick={startPlayback}
            className="px-6 py-2 bg-green-600 hover:bg-green-700 rounded"
          >
            ▶ Play
          </button>
        ) : (
          <button
            onClick={stopPlayback}
            className="px-6 py-2 bg-red-600 hover:bg-red-700 rounded"
          >
            ⏹ Stop
          </button>
        )}
      </div>
    </div>
  );
};

export default TrackEditor;
