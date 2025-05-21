import { useCallback, useState } from 'react';
import * as Tone from 'tone';
import { useAudioContext } from './useAudioContext';

// Function to trim silence from an AudioBuffer
const trimSilence = (audioBuffer: AudioBuffer, threshold = 0.01): AudioBuffer => {
    const channelData = audioBuffer.getChannelData(0); // Get first channel
    const bufferLength = channelData.length;

    // Find start position (first sample above threshold)
    let startPos = 0;
    for (let i = 0; i < bufferLength; i++) {
        if (Math.abs(channelData[i]) > threshold) {
            startPos = Math.max(0, i - 100); // Keep a tiny bit before the sound
            break;
        }
    }

    // Find end position (last sample above threshold)
    let endPos = bufferLength - 1;
    for (let i = bufferLength - 1; i >= 0; i--) {
        if (Math.abs(channelData[i]) > threshold) {
            endPos = Math.min(bufferLength - 1, i + 100); // Keep a tiny bit after the sound
            break;
        }
    }

    // If no sound was found above threshold, return original buffer
    if (startPos === 0 && endPos === bufferLength - 1) {
        return audioBuffer;
    }

    // Create new buffer with trimmed audio
    const trimmedBuffer = Tone.context.createBuffer(
        audioBuffer.numberOfChannels,
        endPos - startPos,
        audioBuffer.sampleRate
    );

    // Copy the trimmed portion for each channel
    for (let channel = 0; channel < audioBuffer.numberOfChannels; channel++) {
        const newChannelData = trimmedBuffer.getChannelData(channel);
        const originalChannelData = audioBuffer.getChannelData(channel);
        for (let i = 0; i < endPos - startPos; i++) {
            newChannelData[i] = originalChannelData[startPos + i];
        }
    }

    return trimmedBuffer;
};

export const useAudioRecorder = () => {
    const [isRecording, setIsRecording] = useState(false);
    const [recorder, setRecorder] = useState<Tone.Recorder | null>(null);
    const [audioBuffer, setAudioBuffer] = useState<AudioBuffer | null>(null);
    const { initializeContext } = useAudioContext();

    const startRecording = useCallback(async () => {
        console.log('Starting recording, initializing context...');
        const initialized = await initializeContext();
        if (!initialized) {
            console.error('Failed to initialize audio context');
            return;
        }
        console.log('Context initialized successfully');

        // Clean up any existing recorder
        if (recorder) {
            try {
                await recorder.stop();
            } catch (e) {
                // Ignore error if recorder wasn't running
            }
            setRecorder(null);
        }

        try {
            const mic = new Tone.UserMedia();
            await mic.open(); // Wait for permission and mic to be ready
            const rec = new Tone.Recorder();
            mic.connect(rec);
            rec.start();
            console.log('Recording started successfully');

            setRecorder(rec);
            setIsRecording(true);

            // Store mic for cleanup
            (rec as any)._mic = mic;
        } catch (err) {
            console.error('Error starting recording (mic not open or permission denied):', err);
            setIsRecording(false);
            setRecorder(null);
        }
    }, [initializeContext, recorder]);
    const stopRecording = useCallback(async () => {
        if (!recorder) {
            console.log('No recorder available when stopping');
            setAudioBuffer(null);
            return;
        } try {
            console.log('Stopping recorder and processing audio...');
            const recording = await recorder.stop();

            // Close the microphone
            const mic = (recorder as any)._mic as Tone.UserMedia;
            if (mic) {
                mic.close();
            }

            // Convert to Blob and check if it has data
            const blob = new Blob([recording], { type: 'audio/wav' });
            if (blob.size === 0) {
                console.warn('Recording is empty!');
                setAudioBuffer(null);
                setIsRecording(false);
                setRecorder(null);
                return;
            }

            const arrayBuffer = await blob.arrayBuffer();
            console.log('Decoding audio data...');
            const buffer = await Tone.context.decodeAudioData(arrayBuffer);
            console.log('Audio successfully decoded');

            // Trim silence from the audio buffer
            const trimmedBuffer = trimSilence(buffer);
            console.log('Silence trimmed from audio');

            setAudioBuffer(trimmedBuffer);
            setIsRecording(false);
            setRecorder(null);
        } catch (err) {
            console.error('Error stopping recording:', err);
            setAudioBuffer(null);
            setIsRecording(false);
            setRecorder(null);
        }
    }, [recorder]);

    return {
        isRecording,
        audioBuffer,
        startRecording,
        stopRecording,
    };
};
