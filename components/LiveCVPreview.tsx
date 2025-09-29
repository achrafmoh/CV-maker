import React from 'react';
import { CVData, TemplateId } from '../types';
import { TEMPLATES } from '../constants';

interface LiveCVPreviewProps {
    data: CVData;
    templateId: TemplateId;
    color: string;
    font: string;
    zoomLevel: number;
}

export const LiveCVPreview: React.FC<LiveCVPreviewProps> = ({ data, templateId, color, font, zoomLevel }) => {
    const TemplateComponent = TEMPLATES[templateId].component;

    return (
        <div className="w-full flex justify-center">
            <div 
                id="cv-print-area"
                className="w-[210mm] min-w-[700px] shadow-2xl border border-slate-300 transition-transform duration-300 ease-in-out"
                style={{
                    transform: `scale(${zoomLevel})`,
                    transformOrigin: 'top center'
                }}
            >
                <div 
                    id="cv-preview-content"
                    className="w-full bg-white overflow-hidden aspect-[210/297]"
                >
                    <div className={`h-full overflow-hidden ${font}`}>
                        <TemplateComponent data={data} color={color} font={font} />
                    </div>
                </div>
            </div>
        </div>
    );
};