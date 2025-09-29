import React from 'react';
import { COLOR_PALETTES, FONT_PAIRINGS } from '../constants';

interface CustomizePanelProps {
    color: string;
    setColor: (color: string) => void;
    font: string;
    setFont: (font: string) => void;
}

export const CustomizePanel: React.FC<CustomizePanelProps> = ({ color, setColor, font, setFont }) => {
    return (
        <div className="p-4 space-y-6">
            
            <div>
                <h3 className="font-semibold text-slate-300 mb-2">Accent Color</h3>
                <div className="grid grid-cols-4 gap-3">
                    {COLOR_PALETTES.map(palette => (
                        <button
                            key={palette.name}
                            title={palette.name}
                            onClick={() => setColor(palette.color)}
                            className={`w-full h-12 rounded-lg transition-transform duration-150 transform hover:scale-105 ${color === palette.color ? 'ring-2 ring-offset-2 ring-offset-slate-800 ring-white' : ''}`}
                            style={{ backgroundColor: palette.color }}
                        />
                    ))}
                </div>
            </div>

            <div>
                <h3 className="font-semibold text-slate-300 mb-2">Font Pairing</h3>
                <div className="space-y-2">
                    {FONT_PAIRINGS.map(pairing => (
                            <button
                            key={pairing.name}
                            onClick={() => setFont(pairing.className)}
                            className={`w-full p-3 rounded-lg text-start transition-all duration-200 border-2 ${font === pairing.className ? 'border-blue-400 bg-slate-700' : 'border-transparent bg-slate-700/50 hover:bg-slate-700'}`}
                        >
                            <span className="font-semibold text-white">{pairing.name}</span>
                            <p className="text-xs text-slate-400">{pairing.description}</p>
                        </button>
                    ))}
                </div>
            </div>

        </div>
    );
};