import React, { useEffect, useRef } from 'react';
import { useWindowOrientation } from '../../hooks/useWindowOrientation';

interface PianoKeyProps {
    note: string;
    isWhite: boolean;
    isOn: boolean;
    onNoteOn: () => void;
    onNoteOff: () => void;
}

export const PianoKey: React.FC<PianoKeyProps> = ({
    note,
    isWhite,
    isOn,
    onNoteOn,
    onNoteOff,
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

    useEffect(() => {
        const el = keyRef.current;
        if (!el) return;
        const handleTouchStart = (e: TouchEvent) => {
            e.preventDefault();
            onNoteOn();
        };
        const handleTouchEnd = (e: TouchEvent) => {
            e.preventDefault();
            onNoteOff();
        };
        el.addEventListener('touchstart', handleTouchStart, { passive: false });
        el.addEventListener('touchend', handleTouchEnd, { passive: false });
        return () => {
            el.removeEventListener('touchstart', handleTouchStart);
            el.removeEventListener('touchend', handleTouchEnd);
        };
    }, [onNoteOn, onNoteOff]);

    return (
        <div
            ref={keyRef}
            className={keyClasses}
            onMouseDown={onNoteOn}
            onMouseUp={onNoteOff}
            onMouseLeave={onNoteOff}
            onContextMenu={(e) => e.preventDefault()}
        >
            <span className={`text-sm font-semibold opacity-50 ${textColor}`}>
                {note}
            </span>
        </div>
    );
};
