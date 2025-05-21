import React, { useState } from 'react';
import { FaBars, FaTimes } from 'react-icons/fa';

interface CornerMenuProps {
    children: React.ReactNode;
}

export const CornerMenu: React.FC<CornerMenuProps> = ({ children }) => {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <div className="fixed top-6 right-6 z-50">
            {/* Toggle button */}
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="p-3 rounded-full bg-gray-900 text-blue-400 border border-blue-400 shadow-xl hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-400 transition-colors"
                aria-label={isOpen ? 'Close menu' : 'Open menu'}
                style={{ boxShadow: '0 4px 16px rgba(0,0,0,0.25)' }}
            >
                {isOpen ? <FaTimes size={28} aria-hidden="true" /> : <FaBars size={28} aria-hidden="true" />}
                {/* Fallback if icon fails */}
                <span className="sr-only">{isOpen ? 'Close' : 'Open'}</span>
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
