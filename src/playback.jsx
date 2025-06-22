import { useState, useEffect, useRef } from "react";

const stepsCount = 8;
const bpm = 120;
const intervalMs = (60 / bpm) * 1000 / 2; // 8th notes

const base = import.meta.env.BASE_URL;

const instruments = [
  { name: "Kick", src: `${base}kick.mp3` },
  { name: "Snare", src: `${base}snare.mp3` },
  { name: "Synth", src: `${base}synth.mp3` },
];

export default function Sequencer() {
  const [sequence, setSequence] = useState(
    instruments.map(() => new Array(stepsCount).fill(false))
  );
  const [currentStep, setCurrentStep] = useState(-1);
  const [isPlaying, setIsPlaying] = useState(false);
  const intervalRef = useRef(null);
  const audioRefs = useRef(instruments.map(({ src }) => new Audio(src)));

  const playSound = (instIdx) => {
    const audio = audioRefs.current[instIdx];
    audio.currentTime = 0;
    audio.play();
  };

  useEffect(() => {
    if (!isPlaying) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
      setCurrentStep(-1);
      return;
    }
    let step = 0;
    intervalRef.current = setInterval(() => {
      setCurrentStep(step);
      sequence.forEach((row, instIdx) => {
        if (row[step]) playSound(instIdx);
      });
      step = (step + 1) % stepsCount;
    }, intervalMs);

    return () => clearInterval(intervalRef.current);
  }, [isPlaying, sequence]);

  // Toggle step on/off
  const toggleStep = (instIdx, stepIdx) => {
    setSequence((prev) => {
      const newSeq = prev.map((row) => [...row]);
      newSeq[instIdx][stepIdx] = !newSeq[instIdx][stepIdx];
      return newSeq;
    });
  };

  return (
    <div className="p-6 bg-gray-900 text-white min-h-screen">
      <h1 className="text-3xl mb-6">Web DAW Step Sequencer</h1>

      {instruments.map(({ name }, instIdx) => (
        <div key={name} className="mb-4">
          <div className="mb-1 font-bold">{name}</div>
          <div className="grid grid-cols-8 gap-2">
            {sequence[instIdx].map((active, stepIdx) => (
              <button
                key={stepIdx}
                className={`w-10 h-10 rounded ${
                  active ? "bg-green-500" : "bg-gray-700"
                } ${
                  currentStep === stepIdx ? "ring-4 ring-yellow-400" : ""
                }`}
                onClick={() => toggleStep(instIdx, stepIdx)}
              />
            ))}
          </div>
        </div>
      ))}

      <div className="space-x-4 mt-6">
        {!isPlaying ? (
          <button
            onClick={() => setIsPlaying(true)}
            className="bg-green-600 px-4 py-2 rounded hover:bg-green-700"
          >
            ▶ Play
          </button>
        ) : (
          <button
            onClick={() => setIsPlaying(false)}
            className="bg-red-600 px-4 py-2 rounded hover:bg-red-700"
          >
            ■ Stop
          </button>
        )}
      </div>
    </div>
  );
}
