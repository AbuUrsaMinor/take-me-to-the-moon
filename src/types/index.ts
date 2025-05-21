export interface AudioRecorderProps {
    onRecordingComplete: (audioBuffer: AudioBuffer) => void;
}

export interface PianoKeyProps {
    note: string;
    isWhite: boolean;
    isOn: boolean;
    onNoteOn: () => void;
    onNoteOff: () => void;
}

export interface SoundControlsProps {
    volume: number;
    onVolumeChange: (value: number) => void;
    attack: number;
    decay: number;
    sustain: number;
    release: number;
    onEnvelopeChange: (type: 'attack' | 'decay' | 'sustain' | 'release', value: number) => void;
}
