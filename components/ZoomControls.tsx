import React from 'react';

interface ZoomControlsProps {
    zoomLevel: number;
    setZoomLevel: (level: number) => void;
}

const MIN_ZOOM = 0.5;
const MAX_ZOOM = 2;
const ZOOM_STEP = 0.1;

export const ZoomControls: React.FC<ZoomControlsProps> = ({ zoomLevel, setZoomLevel }) => {
    const handleZoomIn = () => {
        setZoomLevel(Math.min(MAX_ZOOM, zoomLevel + ZOOM_STEP));
    };

    const handleZoomOut = () => {
        setZoomLevel(Math.max(MIN_ZOOM, zoomLevel - ZOOM_STEP));
    };

    const handleResetZoom = () => {
        setZoomLevel(1);
    };

    return (
        <div className="fixed bottom-6 end-6 z-20 flex items-center bg-slate-900/80 backdrop-blur-sm text-white rounded-lg shadow-lg p-1 space-x-1">
            <button
                onClick={handleZoomOut}
                disabled={zoomLevel <= MIN_ZOOM}
                className="w-10 h-10 flex items-center justify-center rounded-md hover:bg-slate-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                aria-label="Zoom out"
            >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M5 10a1 1 0 011-1h8a1 1 0 110 2H6a1 1 0 01-1-1z" clipRule="evenodd" />
                </svg>
            </button>
            <button
                onClick={handleResetZoom}
                className="px-3 h-10 text-sm font-semibold hover:bg-slate-700 rounded-md transition-colors"
                aria-label="Reset zoom to 100%"
            >
                {Math.round(zoomLevel * 100)}%
            </button>
            <button
                onClick={handleZoomIn}
                disabled={zoomLevel >= MAX_ZOOM}
                className="w-10 h-10 flex items-center justify-center rounded-md hover:bg-slate-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                aria-label="Zoom in"
            >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 3a1 1 0 011 1v4h4a1 1 0 110 2h-4v4a1 1 0 11-2 0v-4H5a1 1 0 110-2h4V4a1 1 0 011-1z" clipRule="evenodd" />
                </svg>
            </button>
        </div>
    );
};