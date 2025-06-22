import { useState, useEffect, useRef } from "react";

const stepsCount = 8;
const bpm = 120;
const intervalMs = (60 / bpm) * 1000 / 2; // 8th notes

const instruments = [
  { name: "Kick", src: "/beiyinwebdaw/kick.mp3" },
  { name: "Snare", src: "/beiyinwebdaw/snare.mp3" },
  { name: "Synth", src: "/beiyinwebdaw/synth.mp3" },
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
