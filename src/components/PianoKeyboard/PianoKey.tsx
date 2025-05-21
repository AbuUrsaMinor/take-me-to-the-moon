import React, { useEffect, useRef } from 'react';
import { useWindowOrientation } from '../../hooks/useWindowOrientation';

interface PianoKeyProps {
    note: string;
    isWhite: boolean;
    isOn: boolean;
    onNoteOn: () => void;
    onNoteOff: () => void;
    extraClass?: string;
}

export const PianoKey: React.FC<PianoKeyProps> = ({
    note,
    isWhite,
    isOn,
    onNoteOn,
    onNoteOff,
    extraClass = '',
}) => {
    const { orientation } = useWindowOrientation();
    const isLandscape = orientation === 'landscape';

    // Define size classes based on orientation and key type
    const keySize = isWhite
        ? (isLandscape ? 'h-screen w-24' : 'h-40 w-full')
        : (isLandscape ? 'h-[60vh] w-16' : 'h-24 w-[70%]');

    // Define appearance classes
    const keyColor = isWhite
        ? (isOn ? 'bg-blue-100' : 'bg-white')
        : (isOn ? 'bg-blue-800' : 'bg-gray-900');
    const keyHover = isWhite
        ? 'hover:bg-gray-100 active:bg-blue-100'
        : 'hover:bg-gray-800 active:bg-blue-800';
    const textColor = isWhite ? 'text-gray-600' : 'text-white';

    // Position black keys
    const position = !isWhite ? 'absolute top-0 -mx-8 z-20' : '';

    // Combine all classes
    const keyClasses = `
        ${keyColor} ${keySize} ${keyHover} ${position}
        relative rounded-b-md cursor-pointer border border-gray-300
        flex flex-col justify-end items-center pb-2
        transition-colors duration-75
    `.trim();

    const keyRef = useRef<HTMLDivElement>(null);

    // Track if pointer is down globally
    const isPointerDown = useRef(false);

    useEffect(() => {
        const handlePointerDown = () => { isPointerDown.current = true; };
        const handlePointerUp = () => { isPointerDown.current = false; };
        window.addEventListener('pointerdown', handlePointerDown);
        window.addEventListener('pointerup', handlePointerUp);
        return () => {
            window.removeEventListener('pointerdown', handlePointerDown);
            window.removeEventListener('pointerup', handlePointerUp);
        };
    }, []);

    // Use pointer events for both mouse and touch drag
    const handlePointerDown = () => {
        isPointerDown.current = true;
        onNoteOn();
    };
    const handlePointerUp = () => {
        isPointerDown.current = false;
        onNoteOff();
    };
    const handlePointerEnter = () => {
        if (isPointerDown.current) {
            onNoteOn();
        }
    };
    const handlePointerLeave = () => {
        if (isPointerDown.current) {
            onNoteOff();
        }
    };

    return (
        <div
            ref={keyRef}
            className={`${keyClasses} ${extraClass}`}
            onPointerDown={handlePointerDown}
            onPointerUp={handlePointerUp}
            onPointerEnter={handlePointerEnter}
            onPointerLeave={handlePointerLeave}
            onContextMenu={(e) => e.preventDefault()}
        >
            <span className={`text-sm font-semibold opacity-50 ${textColor}`}>
                {note}
            </span>
        </div>
    );
};
