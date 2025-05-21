import React, { useEffect } from 'react';
import { FaMicrophone, FaStop } from 'react-icons/fa';
import { useAudioRecorder } from '../../hooks/useAudioRecorder';

interface AudioRecorderProps {
    onRecordingComplete: (buffer: AudioBuffer) => void;
}

export const AudioRecorder: React.FC<AudioRecorderProps> = ({ onRecordingComplete }) => {
    const { isRecording, audioBuffer, startRecording, stopRecording } = useAudioRecorder();

    useEffect(() => {
        if (audioBuffer) {
            console.log('Audio buffer available:', audioBuffer);
            onRecordingComplete(audioBuffer);
        }
    }, [audioBuffer, onRecordingComplete]);

    const handleStartRecording = async (e: React.MouseEvent) => {
        e.preventDefault();
        console.log('Starting recording...');
        await startRecording();
    };
    const handleStopRecording = async (e: React.MouseEvent) => {
        e.preventDefault();
        console.log('Stopping recording...');
        await stopRecording();
        // Do not check audioBuffer here; useEffect will handle it
    };

    return (
        <div className="flex flex-col items-center gap-4">
            <button
                className={`p-4 rounded-full ${isRecording ? 'bg-red-500 hover:bg-red-600' : 'bg-blue-500 hover:bg-blue-600'
                    } text-white transition-colors`}
                onClick={isRecording ? handleStopRecording : handleStartRecording}
            >
                {isRecording ? <FaStop size={24} /> : <FaMicrophone size={24} />}
            </button>
            <p className="text-gray-400">
                {isRecording ? 'Recording... Click to stop' : 'Click to start recording'}
            </p>
        </div>
    );
};
