import React, { useCallback, useEffect, useState } from 'react';
import * as Tone from 'tone';
import { useAudioContext } from '../../hooks/useAudioContext';
import { useWindowOrientation } from '../../hooks/useWindowOrientation';
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
    const { orientation } = useWindowOrientation();

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
    );    // Determine keyboard container styles based on orientation
    const containerClasses = orientation === 'landscape'
        ? 'fixed inset-0 flex flex-row items-stretch justify-center w-screen h-screen'
        : 'fixed inset-0 flex flex-col items-stretch justify-center w-screen h-screen';

    const keysContainerClasses = orientation === 'landscape'
        ? 'flex flex-row items-stretch justify-center w-full h-full'
        : 'flex flex-col items-stretch justify-center w-full h-full';

    return (
        <div className={containerClasses}>
            <div className={keysContainerClasses}>
                {OCTAVES.map((octave) =>
                    NOTES.map((note) => {
                        const fullNote = `${note}${octave}`;
                        const hasSharp = note !== 'E' && note !== 'B';
                        // If this white key is E or B, the next key is also white (no black key between)
                        const isNarrowWhite = note === 'E' || note === 'B';
                        return (
                            <React.Fragment key={fullNote}>
                                <PianoKey
                                    note={fullNote}
                                    isWhite={true}
                                    isOn={isNoteOn[fullNote]}
                                    onNoteOn={() => playNote(fullNote)}
                                    onNoteOff={() => stopNote(fullNote)}
                                    extraClass={isNarrowWhite ? 'white-key-narrow' : ''}
                                />
                                {hasSharp && (
                                    <PianoKey
                                        note={`${note}#${octave}`}
                                        isWhite={false}
                                        isOn={isNoteOn[`${note}#${octave}`]}
                                        onNoteOn={() => playNote(`${note}#${octave}`)}
                                        onNoteOff={() => stopNote(`${note}#${octave}`)}
                                    />
                                )}
                            </React.Fragment>
                        );
                    })
                )}
            </div>
        </div>
    );
};
