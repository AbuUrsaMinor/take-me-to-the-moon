import { useState } from 'react';
import './App.css';
import { AudioRecorder } from './components/AudioRecorder/AudioRecorder';
import { CornerMenu } from './components/CornerMenu/CornerMenu';
import { PianoKeyboard } from './components/PianoKeyboard/PianoKeyboard';
import { SoundControls } from './components/SoundControls/SoundControls';
import { useAudioContext } from './hooks/useAudioContext';
import { useWindowOrientation } from './hooks/useWindowOrientation';

function App() {
  const [audioBuffer, setAudioBuffer] = useState<AudioBuffer | null>(null);
  const [volume, setVolume] = useState(0.7);
  const [envelope, setEnvelope] = useState({
    attack: 0.1,
    decay: 0.2,
    sustain: 0.5,
    release: 0.5,
  });
  const { initializeContext } = useAudioContext();
  const { orientation } = useWindowOrientation();

  const handleEnvelopeChange = (type: 'attack' | 'decay' | 'sustain' | 'release', value: number) => {
    setEnvelope(prev => ({ ...prev, [type]: value }));
  };

  const handleRecordingComplete = async (buffer: AudioBuffer) => {
    try {
      await initializeContext();
      setAudioBuffer(buffer);
      console.log('Recording complete, buffer received:', buffer);
    } catch (error) {
      console.error('Error handling recording completion:', error);
    }
  };

  const handleReRecord = () => {
    setAudioBuffer(null);
  };

  return (
    <div className={`min-h-screen bg-gray-900 text-white ${audioBuffer && orientation === 'landscape' ? 'p-0' : 'p-4'}`}>
      {/* Initial Recording Screen - Show in portrait or when no recording exists */}
      {(!audioBuffer || orientation === 'portrait') && (
        <>
          <header className="text-center mb-8">
            <h1 className="text-4xl font-bold text-blue-500 mb-2">Take Me To The Moon</h1>
            <p className="text-gray-400">Record a sound and play it on the piano!</p>
          </header>

          <main className="max-w-4xl mx-auto space-y-8">
            <div className="w-full max-w-md mx-auto">
              <AudioRecorder onRecordingComplete={handleRecordingComplete} />
            </div>
          </main>
        </>
      )}

      {/* Playback Screen - Show after recording */}
      {audioBuffer && (
        <>
          {/* Full-screen keyboard in landscape */}
          {orientation === 'landscape' ? (
            <div className="h-screen w-screen flex items-center">
              <PianoKeyboard audioBuffer={audioBuffer} />
              <CornerMenu>
                <div className="space-y-4">
                  <h2 className="text-xl font-semibold text-blue-400 mb-4">Sound Controls</h2>
                  <SoundControls
                    volume={volume}
                    onVolumeChange={setVolume}
                    attack={envelope.attack}
                    decay={envelope.decay}
                    sustain={envelope.sustain}
                    release={envelope.release}
                    onEnvelopeChange={handleEnvelopeChange}
                  />
                  <button
                    onClick={handleReRecord}
                    className="w-full py-2 px-4 bg-blue-600 hover:bg-blue-700 rounded-md text-white transition-colors"
                  >
                    Re-record Sound
                  </button>
                </div>
              </CornerMenu>
            </div>
          ) : (
            // Portrait layout with controls below keyboard
            <div className="space-y-8">
              <PianoKeyboard audioBuffer={audioBuffer} />
              <div className="space-y-4">
                <SoundControls
                  volume={volume}
                  onVolumeChange={setVolume}
                  attack={envelope.attack}
                  decay={envelope.decay}
                  sustain={envelope.sustain}
                  release={envelope.release}
                  onEnvelopeChange={handleEnvelopeChange}
                />
                <button
                  onClick={handleReRecord}
                  className="w-full py-2 px-4 bg-blue-600 hover:bg-blue-700 rounded-md text-white transition-colors"
                >
                  Re-record Sound
                </button>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}

export default App;
