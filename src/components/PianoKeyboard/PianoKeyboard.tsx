import React, { useCallback, useEffect, useState } from 'react';
import * as Tone from 'tone';
import { useAudioContext } from '../../hooks/useAudioContext';
import { PianoKey } from './PianoKey';

const NOTES = ['C', 'D', 'E', 'F', 'G', 'A', 'B'];
const OCTAVES = [3, 4]; // Two octaves: C3-B3 and C4-B4

interface PianoKeyboardProps {
    audioBuffer: AudioBuffer | null;
}

export const PianoKeyboard: React.FC<PianoKeyboardProps> = ({ audioBuffer }) => {
    const [player, setPlayer] = useState<Tone.Player | null>(null);
    const [isNoteOn, setIsNoteOn] = useState<Record<string, boolean>>({});
    const { initializeContext } = useAudioContext();

    useEffect(() => {
        const setupPlayer = async () => {
            console.log('PianoKeyboard setup starting:', {
                hasAudioBuffer: !!audioBuffer,
                contextState: Tone.context.state
            });

            if (!audioBuffer) return;

            try {
                const initialized = await initializeContext();
                if (!initialized) {
                    console.error('Failed to initialize audio context');
                    return;
                }
                console.log('Context initialized for piano keyboard');

                // Clean up any existing player
                if (player) {
                    player.dispose();
                }

                // Create a new buffer and player
                const buffer = new Tone.ToneAudioBuffer();
                buffer.set(audioBuffer);

                const newPlayer = new Tone.Player({
                    playbackRate: 1,
                    fadeOut: 0.1,
                    volume: 0,
                }).toDestination();

                newPlayer.buffer = buffer;
                setPlayer(newPlayer);
                console.log('Player setup complete with buffer:', !!newPlayer.buffer);
            } catch (error) {
                console.error('Error setting up audio player:', error);
            }
        };

        setupPlayer();

        return () => {
            if (player) {
                player.dispose();
            }
        };
    }, [audioBuffer, initializeContext]);

    const playNote = useCallback(
        async (note: string) => {
            try {
                await initializeContext();

                if (player && !isNoteOn[note]) {
                    console.log('Playing note:', note);
                    const noteFreq = Tone.Frequency(note).toFrequency();
                    const baseFreq = Tone.Frequency('C4').toFrequency();
                    player.playbackRate = noteFreq / baseFreq;
                    await player.start();
                    setIsNoteOn((prev) => ({ ...prev, [note]: true }));
                }
            } catch (error) {
                console.error('Error playing note:', error);
            }
        },
        [player, isNoteOn, initializeContext]
    );

    const stopNote = useCallback(
        (note: string) => {
            try {
                if (player && isNoteOn[note]) {
                    player.stop();
                    setIsNoteOn((prev) => ({ ...prev, [note]: false }));
                }
            } catch (error) {
                console.error('Error stopping note:', error);
            }
        },
        [player, isNoteOn]
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
