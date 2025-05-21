import { useEffect, useState } from 'react';

type Orientation = 'portrait' | 'landscape';

interface WindowSize {
    width: number;
    height: number;
    orientation: Orientation;
}

export const useWindowOrientation = () => {
    const [windowSize, setWindowSize] = useState<WindowSize>({
        width: window.innerWidth,
        height: window.innerHeight,
        orientation: window.innerHeight > window.innerWidth ? 'portrait' : 'landscape'
    });

    useEffect(() => {
        const handleResize = () => {
            const width = window.innerWidth;
            const height = window.innerHeight;
            const orientation: Orientation = height > width ? 'portrait' : 'landscape';

            setWindowSize({
                width,
                height,
                orientation,
            });
        };

        window.addEventListener('resize', handleResize);
        window.addEventListener('orientationchange', handleResize);

        // Initial call
        handleResize();

        return () => {
            window.removeEventListener('resize', handleResize);
            window.removeEventListener('orientationchange', handleResize);
        };
    }, []);

    return windowSize;
};
