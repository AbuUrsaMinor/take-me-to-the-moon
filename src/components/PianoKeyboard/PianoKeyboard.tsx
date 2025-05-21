import React, { useCallback, useEffect, useState } from 'react';
import * as Tone from 'tone';
import { useAudioContext } from '../../hooks/useAudioContext';
import { PianoKey } from './PianoKey';

const NOTES = ['C', 'D', 'E', 'F', 'G', 'A', 'B'];
const OCTAVES = [3, 4]; // Two octaves: C3-B3 and C4-B4

interface PianoKeyboardProps {
    audioBuffer: AudioBuffer | null;
    volume: number;
    envelope: {
        attack: number;
        decay: number;
        sustain: number;
        release: number;
    };
}

export const PianoKeyboard: React.FC<PianoKeyboardProps> = ({ audioBuffer, volume, envelope }) => {
    const [player, setPlayer] = useState<Tone.Player | null>(null);
    const [gain, setGain] = useState<Tone.Gain | null>(null);
    const [ampEnv, setAmpEnv] = useState<Tone.AmplitudeEnvelope | null>(null);
    const [isNoteOn, setIsNoteOn] = useState<Record<string, boolean>>({});
    const { initializeContext } = useAudioContext();

    useEffect(() => {
        const setupAudioChain = async () => {
            if (!audioBuffer) return;
            await initializeContext();

            if (player) player.dispose();
            if (gain) gain.dispose();
            if (ampEnv) ampEnv.dispose();

            const buffer = new Tone.ToneAudioBuffer();
            buffer.set(audioBuffer);
            const newPlayer = new Tone.Player({
                playbackRate: 1,
                fadeOut: 0.1,
                volume: 0,
            });
            newPlayer.buffer = buffer;
            const newGain = new Tone.Gain(volume).toDestination();
            const newEnv = new Tone.AmplitudeEnvelope({
                attack: envelope.attack,
                decay: envelope.decay,
                sustain: envelope.sustain,
                release: envelope.release,
            });
            newPlayer.connect(newEnv);
            newEnv.connect(newGain);
            setPlayer(newPlayer);
            setGain(newGain);
            setAmpEnv(newEnv);
        };
        setupAudioChain();
        return () => {
            if (player) player.dispose();
            if (gain) gain.dispose();
            if (ampEnv) ampEnv.dispose();
        };
    }, [audioBuffer, volume, envelope, initializeContext]);

    useEffect(() => {
        if (gain) gain.gain.value = volume;
    }, [volume, gain]);
    useEffect(() => {
        if (ampEnv) {
            ampEnv.attack = envelope.attack;
            ampEnv.decay = envelope.decay;
            ampEnv.sustain = envelope.sustain;
            ampEnv.release = envelope.release;
        }
    }, [envelope, ampEnv]);

    const playNote = useCallback(
        async (note: string) => {
            try {
                await initializeContext();
                if (player && ampEnv && !isNoteOn[note]) {
                    const noteFreq = Tone.Frequency(note).toFrequency();
                    const baseFreq = Tone.Frequency('C4').toFrequency();
                    player.playbackRate = noteFreq / baseFreq;
                    player.start();
                    ampEnv.triggerAttack();
                    setIsNoteOn((prev) => ({ ...prev, [note]: true }));
                }
            } catch (error) {
                console.error('Error playing note:', error);
            }
        },
        [player, ampEnv, isNoteOn, initializeContext]
    );

    const stopNote = useCallback(
        (note: string) => {
            try {
                if (player && ampEnv && isNoteOn[note]) {
                    ampEnv.triggerRelease();
                    setIsNoteOn((prev) => ({ ...prev, [note]: false }));
                }
            } catch (error) {
                console.error('Error stopping note:', error);
            }
        },
        [player, ampEnv, isNoteOn]
    );    // Calculate white and black keys for rendering
    const whiteKeys: React.ReactNode[] = [];
    const blackKeys: React.ReactNode[] = [];
    // For left percentage calculation
    const totalWhiteKeys = OCTAVES.length * NOTES.length;
    let whiteKeyIndex = 0;
    const blackKeyWidthPercent = 70 / 100; // 70% of a white key (was 60%)
    OCTAVES.forEach((octave) => {
        NOTES.forEach((note) => {
            const fullNote = `${note}${octave}`;
            whiteKeys.push(
                <PianoKey
                    key={fullNote}
                    note={fullNote}
                    isWhite={true}
                    isOn={isNoteOn[fullNote]}
                    onNoteOn={() => playNote(fullNote)}
                    onNoteOff={() => stopNote(fullNote)}
                />
            );
            // Black key logic
            const hasSharp = note !== 'E' && note !== 'B';
            if (hasSharp) {
                // Black key sits between this and next white key
                // Place it at (whiteKeyIndex + 0.7) / totalWhiteKeys for a natural look
                const leftPercent = ((whiteKeyIndex + 0.7) / totalWhiteKeys) * 100;
                const widthPercent = (1 / totalWhiteKeys) * 100 * blackKeyWidthPercent;
                blackKeys.push(
                    <PianoKey
                        key={`${note}#${octave}`}
                        note={`${note}#${octave}`}
                        isWhite={false}
                        isOn={isNoteOn[`${note}#${octave}`]}
                        onNoteOn={() => playNote(`${note}#${octave}`)}
                        onNoteOff={() => stopNote(`${note}#${octave}`)}
                        extraClass={`pointer-events-auto`}
                        width={widthPercent}
                        left={leftPercent}
                    />
                );
            }
            whiteKeyIndex++;
        });
    });

    return (
        <div className="relative w-full h-full overflow-hidden">
            <div className="flex flex-row w-full h-full z-10">
                {whiteKeys}
            </div>
            <div className="absolute top-0 left-0 w-full h-full pointer-events-none z-20">
                {blackKeys}
            </div>
        </div>
    );
};
