import { useCallback, useState } from 'react';
import * as Tone from 'tone';

export const useAudioContext = () => {
    const [isInitialized, setIsInitialized] = useState(false);

    const initializeContext = useCallback(async () => {
        if (isInitialized) {
            return true;
        }

        try {
            // Ensure Tone.js context is started
            await Tone.start();
            await Tone.context.resume();
            console.log('Audio context initialized:', Tone.context.state);
            setIsInitialized(true);
            return true;
        } catch (error) {
            console.error('Failed to initialize audio context:', error);
            return false;
        }
    }, [isInitialized]);

    return {
        context: Tone.context,
        isInitialized,
        initializeContext,
    };
};