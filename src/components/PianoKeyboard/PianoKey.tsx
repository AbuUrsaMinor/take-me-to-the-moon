import React, { useEffect, useRef } from 'react';

interface PianoKeyProps {
    note: string;
    isWhite: boolean;
    isOn: boolean;
    onNoteOn: () => void;
    onNoteOff: () => void;
    extraClass?: string;
    // Add optional width and left for black key positioning
    width?: number; // in percentage or px
    left?: number; // in percentage or px
}

export const PianoKey: React.FC<PianoKeyProps> = ({
    note,
    isWhite,
    isOn,
    onNoteOn,
    onNoteOff,
    extraClass = '',
    width,
    left,
}) => {
    // Define size classes based on orientation and key type
    const keySize = isWhite
        ? 'flex-1 min-w-0 h-full' // White keys fill available space
        : 'h-[60%] w-2/5 absolute z-20'; // Black keys: fixed width, parent sets left

    // Define appearance classes
    const keyColor = isWhite
        ? (isOn ? 'bg-blue-100' : 'bg-white')
        : (isOn ? 'bg-blue-800' : 'bg-gray-900');
    const keyHover = isWhite
        ? 'hover:bg-gray-100 active:bg-blue-100'
        : 'hover:bg-gray-800 active:bg-blue-800';
    const textColor = isWhite ? 'text-gray-600' : 'text-white';

    // Position black keys
    const position = !isWhite ? '' : 'relative';

    // Combine all classes
    const keyClasses = `
        ${keyColor} ${keySize} ${keyHover} ${position}
        rounded-b-md cursor-pointer border border-gray-300
        flex flex-col justify-end items-center pb-2
        transition-colors duration-75
    `.trim();

    // Inline style for black keys
    let style: React.CSSProperties | undefined = undefined;
    if (!isWhite && width !== undefined && left !== undefined) {
        style = {
            width: typeof width === 'number' ? `${width}%` : width,
            left: typeof left === 'number' ? `${left}%` : left,
            position: 'absolute',
            height: '60%',
            zIndex: 20,
        };
    }

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
            style={style}
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
