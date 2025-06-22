import { useState, useEffect, useRef } from "react";

const stepsCount = 8;
const bpm = 120;
const intervalMs = (60 / bpm) * 1000 / 2; // 8th notes

const instruments = [
  { name: "Kick", src: "/beyinwebdaw/kick.mp3" },
  { name: "Snare", src: "/beyinwebdaw/snare.mp3" },
  { name: "Synth", src: "/beyinwebdaw/synth.mp3" },
];

export default function Sequencer() {
  // State: 2D array [instrument][step] boolean
  const [sequence, setSequence] = useState(
    instruments.map(() => new Array(stepsCount).fill(false))
  );

  const [currentStep, setCurrentStep] = useState(-1);
  const intervalRef = useRef(null);

  // Preload audio elements
  const audioRefs = useRef(
    instruments.map(({ src }) => new Audio(src))
  );

  // Toggle step on/off
  function toggleStep(instIdx, stepIdx) {
    setSequence((prev) => {
      const newSeq = prev.map((row) => row.slice());
      newSeq[instIdx][stepIdx] = !newSeq[instIdx][stepIdx];
      return newSeq;
    });
  }

  // Play sound function
  function playSound(instIdx) {
    const audio = audioRefs.current[instIdx];
    audio.currentTime = 0;
    audio.play();
  }

  // Start playback
  function start() {
    if (intervalRef.current) return;
    let step = 0;
    intervalRef.current = setInterval(() => {
      setCurrentStep(step);
      // Play sounds for active steps
      sequence.forEach((row, instIdx) => {
        if (row[step]) playSound(instIdx);
      });
      step = (step + 1) % stepsCount;
    }, intervalMs);
  }

  // Stop playback
  function stop() {
    clearInterval(intervalRef.current);
    intervalRef.current = null;
    setCurrentStep(-1);
  }

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
        <button
          onClick={start}
          className="bg-green-600 px-4 py-2 rounded hover:bg-green-700"
        >
          ▶ Play
        </button>
        <button
          onClick={stop}
          className="bg-red-600 px-4 py-2 rounded hover:bg-red-700"
        >
          ■ Stop
        </button>
      </div>
    </div>
  );
}
