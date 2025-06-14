import { useState, useRef } from "react";

function App() {
  const [isRecording, setIsRecording] = useState(false);
  const [audioURL, setAudioURL] = useState(null);
  const [audioBlob, setAudioBlob] = useState(null);
  const mediaRecorderRef = useRef(null);
  const audioChunks = useRef([]);

  const startRecording = async () => {
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });

    mediaRecorderRef.current = new MediaRecorder(stream);
    audioChunks.current = [];

    mediaRecorderRef.current.ondataavailable = (e) => {
      audioChunks.current.push(e.data);
    };

    mediaRecorderRef.current.onstop = () => {
      const blob = new Blob(audioChunks.current, { type: "audio/wav" });
      const url = URL.createObjectURL(blob);
      setAudioBlob(blob);
      setAudioURL(url);
    };

    mediaRecorderRef.current.start();
    setIsRecording(true);
  };

  const stopRecording = () => {
    mediaRecorderRef.current.stop();
    setIsRecording(false);
  };

  const downloadAudio = () => {
    if (!audioBlob) return;

    const link = document.createElement("a");
    link.href = URL.createObjectURL(audioBlob);
    link.download = "recording.wav";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white flex flex-col items-center justify-center gap-6 p-6">
      <h1 className="text-4xl font-bold">🎙️ Mic Recorder</h1>

      {!isRecording ? (
        <button
          onClick={startRecording}
          className="bg-green-600 hover:bg-green-700 px-6 py-3 rounded-full"
        >
          Start Recording
        </button>
      ) : (
        <button
          onClick={stopRecording}
          className="bg-red-600 hover:bg-red-700 px-6 py-3 rounded-full"
        >
          Stop Recording
        </button>
      )}

      {audioURL && (
        <div className="flex flex-col items-center gap-4 mt-4">
          <audio controls src={audioURL} className="w-full max-w-md" />
          <button
            onClick={downloadAudio}
            className="bg-blue-600 hover:bg-blue-700 px-5 py-2 rounded-full"
          >
            Download Recording
          </button>
        </div>
      )}
    </div>
  );
}

export default App;
