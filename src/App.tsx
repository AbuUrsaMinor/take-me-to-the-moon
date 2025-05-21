import { useState } from 'react';
import { AudioRecorder } from './components/AudioRecorder/AudioRecorder';
import { PianoKeyboard } from './components/PianoKeyboard/PianoKeyboard';
import { SoundControls } from './components/SoundControls/SoundControls';
import './App.css';

function App() {
  const [audioBuffer, setAudioBuffer] = useState<AudioBuffer | null>(null);
  const [volume, setVolume] = useState(0.7);
  const [envelope, setEnvelope] = useState({
    attack: 0.1,
    decay: 0.2,
    sustain: 0.5,
    release: 0.5,
  });

  const handleEnvelopeChange = (type: 'attack' | 'decay' | 'sustain' | 'release', value: number) => {
    setEnvelope(prev => ({ ...prev, [type]: value }));
  };

  const handleRecordingComplete = (buffer: AudioBuffer) => {
    setAudioBuffer(buffer);
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white p-4">
      <header className="text-center mb-8">
        <h1 className="text-4xl font-bold text-blue-500 mb-2">Take Me To The Moon</h1>
        <p className="text-gray-400">Record a sound and play it on the piano!</p>
      </header>

      <main className="max-w-4xl mx-auto space-y-8">
        <div className="w-full max-w-md mx-auto">
          <AudioRecorder onRecordingComplete={handleRecordingComplete} />
        </div>

        {audioBuffer && (
          <>
            <PianoKeyboard audioBuffer={audioBuffer} />
            
            <SoundControls
              volume={volume}
              onVolumeChange={setVolume}
              attack={envelope.attack}
              decay={envelope.decay}
              sustain={envelope.sustain}
              release={envelope.release}
              onEnvelopeChange={handleEnvelopeChange}
            />
          </>
        )}
      </main>
    </div>
  );
}

export default App;
