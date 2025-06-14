import React, { useRef, useState } from 'react';
import Upload from './upload';
import Sequencer from './Sequencer';

export default function App() {
  const uploadedAudioRef = useRef(null);
  const sequencerRef = useRef(null);
  const [uploadedVolume, setUploadedVolume] = useState(1);

  const handleAudioLoaded = (audio) => {
    audio.volume = uploadedVolume;
    uploadedAudioRef.current = audio;
  };

  const handleVolumeChange = (volume) => {
    setUploadedVolume(volume);
    if (uploadedAudioRef.current) {
      uploadedAudioRef.current.volume = volume;
    }
  };

  const startPlayback = () => {
    if (uploadedAudioRef.current) {
      uploadedAudioRef.current.currentTime = 0;
      uploadedAudioRef.current.play();
    }
    if (sequencerRef.current) {
      sequencerRef.current.start();
    }
  };

  const pausePlayback = () => {
    if (uploadedAudioRef.current) {
      uploadedAudioRef.current.pause();
    }
    if (sequencerRef.current) {
      sequencerRef.current.pause();
    }
  };

  const stopPlayback = () => {
    if (uploadedAudioRef.current) {
      uploadedAudioRef.current.pause();
      uploadedAudioRef.current.currentTime = 0;
    }
    if (sequencerRef.current) {
      sequencerRef.current.stop();
    }
  };

  return (
    <div style={{ padding: 20 }}>
      <h1>🎛️ 北隱 Web DAW</h1>
      <Upload onAudioLoaded={handleAudioLoaded} onVolumeChange={handleVolumeChange} />
      <div style={{ marginTop: 20 }}>
        <button onClick={startPlayback} style={{ marginRight: 10 }}>▶ Play</button>
        <button onClick={pausePlayback} style={{ marginRight: 10 }}>⏸ Pause</button>
        <button onClick={stopPlayback}>⏹ Stop</button>
      </div>

      <Sequencer ref={sequencerRef} />
    </div>
  );
}
