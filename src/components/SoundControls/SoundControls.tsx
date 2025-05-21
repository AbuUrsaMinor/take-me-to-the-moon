import React from 'react';
import type { SoundControlsProps } from '../../types';

export const SoundControls: React.FC<SoundControlsProps> = ({
    volume,
    onVolumeChange,
    attack,
    decay,
    sustain,
    release,
    onEnvelopeChange,
}) => {
    return (
        <div className="w-full p-4 bg-gray-800 rounded-lg">
            <div className="space-y-4">
                <div>
                    <label className="block text-sm font-medium text-gray-300 mb-1">
                        Volume
                    </label>
                    <input
                        type="range"
                        min="0"
                        max="1"
                        step="0.01"
                        value={volume}
                        onChange={(e) => onVolumeChange(parseFloat(e.target.value))}
                        className="w-full h-2 bg-gray-600 rounded-lg appearance-none cursor-pointer"
                    />
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-300 mb-1">
                            Attack
                        </label>
                        <input
                            type="range"
                            min="0"
                            max="2"
                            step="0.01"
                            value={attack}
                            onChange={(e) => onEnvelopeChange('attack', parseFloat(e.target.value))}
                            className="w-full h-2 bg-gray-600 rounded-lg appearance-none cursor-pointer"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-300 mb-1">
                            Decay
                        </label>
                        <input
                            type="range"
                            min="0"
                            max="2"
                            step="0.01"
                            value={decay}
                            onChange={(e) => onEnvelopeChange('decay', parseFloat(e.target.value))}
                            className="w-full h-2 bg-gray-600 rounded-lg appearance-none cursor-pointer"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-300 mb-1">
                            Sustain
                        </label>
                        <input
                            type="range"
                            min="0"
                            max="1"
                            step="0.01"
                            value={sustain}
                            onChange={(e) => onEnvelopeChange('sustain', parseFloat(e.target.value))}
                            className="w-full h-2 bg-gray-600 rounded-lg appearance-none cursor-pointer"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-300 mb-1">
                            Release
                        </label>
                        <input
                            type="range"
                            min="0"
                            max="2"
                            step="0.01"
                            value={release}
                            onChange={(e) => onEnvelopeChange('release', parseFloat(e.target.value))}
                            className="w-full h-2 bg-gray-600 rounded-lg appearance-none cursor-pointer"
                        />
                    </div>
                </div>
            </div>
        </div>
    );
};
