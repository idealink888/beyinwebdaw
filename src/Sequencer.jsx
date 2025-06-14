import React, { useState, useRef, useImperativeHandle, forwardRef } from 'react';

const stepsCount = 8;
const bpm = 120;
const intervalMs = (60 / bpm) * 1000 / 2; // 8th notes

const instruments = [
  { name: 'Kick', src: '/kick.mp3' },
  { name: 'Snare', src: '/snare.mp3' },
  { name: 'Synth', src: '/synth.mp3' },
];

const Sequencer = forwardRef((props, ref) => {
  const [volumes, setVolumes] = useState([1,1,1]);
  const [sequence, setSequence] = useState(instruments.map(() => new Array(stepsCount).fill(false)));
  const [currentStep, setCurrentStep] = useState(-1);
  const intervalRef = useRef(null);

  const audioRefs = useRef(instruments.map(({src}) => new Audio(src)));

  const playSound = (instIdx) => {
    const audio = audioRefs.current[instIdx];
    audio.currentTime = 0;
    audio.play();
  };

  const toggleStep = (instIdx, stepIdx) => {
    setSequence(prev => {
      const newSeq = prev.map(row => row.slice());
      newSeq[instIdx][stepIdx] = !newSeq[instIdx][stepIdx];
      return newSeq;
    });
  };

  const handleVolumeChange = (index, value) => {
    setVolumes(prev => {
      const newVolumes = [...prev];
      newVolumes[index] = value;
      audioRefs.current[index].volume = value;
      return newVolumes;
    });
  };

  const start = () => {
    if (intervalRef.current) return;
    let step = 0;
    intervalRef.current = setInterval(() => {
      setCurrentStep(step);
      sequence.forEach((row, instIdx) => {
        if (row[step]) playSound(instIdx);
      });
      step = (step + 1) % stepsCount;
    }, intervalMs);
  };

  const pause = () => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  };

  const stop = () => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
    setCurrentStep(-1);
  };

  useImperativeHandle(ref, () => ({
    start,
    pause,
    stop,
  }));

  return (
    <div style={{ padding: 20, backgroundColor: "#222", color: "white", minHeight: "100vh" }}>
      <h2>Sequencer</h2>
      {instruments.map(({name}, instIdx) => (
        <div key={name} style={{ marginBottom: 20 }}>
          <div style={{ marginBottom: 8, fontWeight: "bold" }}>
            {name}
            <input
              type="range"
              min="0"
              max="1"
              step="0.01"
              value={volumes[instIdx]}
              onChange={e => handleVolumeChange(instIdx, parseFloat(e.target.value))}
              style={{ marginLeft: 12 }}
            />
          </div>
          <div style={{ display: "grid", gridTemplateColumns: `repeat(${stepsCount}, 40px)`, gap: 8 }}>
            {sequence[instIdx].map((active, stepIdx) => (
              <button
                key={stepIdx}
                style={{
                  width: 40,
                  height: 40,
                  borderRadius: 4,
                  backgroundColor: active ? "#4ade80" : "#444",
                  border: currentStep === stepIdx ? "3px solid #facc15" : "1px solid #666",
                  cursor: "pointer",
                }}
                onClick={() => toggleStep(instIdx, stepIdx)}
              />
            ))}
          </div>
        </div>
      ))}

      <div>
        <button onClick={start} style={{ marginRight: 10, padding: '8px 16px' }}>▶ Play</button>
        <button onClick={pause} style={{ marginRight: 10, padding: '8px 16px' }}>⏸ Pause</button>
        <button onClick={stop} style={{ padding: '8px 16px' }}>■ Stop</button>
      </div>
    </div>
  );
});

export default Sequencer;
