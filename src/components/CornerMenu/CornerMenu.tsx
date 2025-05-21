import React, { useState } from 'react';
import { FaBars, FaTimes } from 'react-icons/fa';

interface CornerMenuProps {
    children: React.ReactNode;
}

export const CornerMenu: React.FC<CornerMenuProps> = ({ children }) => {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <div className="fixed top-4 right-4 z-50">
            {/* Toggle button */}
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="p-3 rounded-full bg-gray-800 text-white shadow-lg hover:bg-gray-700 transition-colors"
                aria-label={isOpen ? 'Close menu' : 'Open menu'}
            >
                {isOpen ? <FaTimes size={24} /> : <FaBars size={24} />}
            </button>

            {/* Menu content */}
            <div
                className={`
          absolute top-16 right-0
          min-w-[280px]
          bg-gray-800 rounded-lg shadow-xl
          transform transition-all duration-200 ease-in-out
          ${isOpen ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-4 pointer-events-none'}
        `}
            >
                <div className="p-4">
                    {children}
                </div>
            </div>
        </div>
    );
};
