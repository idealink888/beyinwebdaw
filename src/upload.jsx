import React, { useRef } from 'react';

export default function Upload({ onAudioLoaded, onVolumeChange }) {
  const audioRef = useRef(null);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const url = URL.createObjectURL(file);
    const audio = new Audio(url);
    audioRef.current = audio;
    if (onAudioLoaded) onAudioLoaded(audio);
  };

  const handleVolume = (e) => {
    const vol = parseFloat(e.target.value);
    if (onVolumeChange) onVolumeChange(vol);
  };

  return (
    <div>
      <input type="file" accept="audio/*" onChange={handleFileChange} />
      <br />
      Volume:
      <input type="range" min="0" max="1" step="0.01" defaultValue="1" onChange={handleVolume} />
    </div>
  );
}
