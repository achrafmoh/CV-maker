import React from 'react';
import { TEMPLATES } from '../constants';
import { TemplateId } from '../types';

interface TemplatePanelProps {
    currentTemplate: TemplateId;
    onTemplateChange: (id: TemplateId) => void;
}

const TemplateIcon: React.FC<{ templateId: TemplateId }> = ({ templateId }) => {
    const icons: Record<TemplateId, React.ReactNode> = {
        'classic': (
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="3" y="4" width="18" height="4" rx="1"></rect>
                <line x1="3" y1="12" x2="21" y2="12"></line>
                <line x1="3" y1="16" x2="15" y2="16"></line>
            </svg>
        ),
        'timeline-accent': (
             <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="6" y1="4" x2="6" y2="20"></line>
                <line x1="10" y1="8" x2="20" y2="8"></line>
                <circle cx="6" cy="8" r="1.5" fill="currentColor"></circle>
                <line x1="10" y1="16" x2="18" y2="16"></line>
                <circle cx="6" cy="16" r="1.5" fill="currentColor"></circle>
            </svg>
        ),
        'minimalist': (
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <line x1="3" y1="6" x2="21" y2="6"></line>
                <line x1="3" y1="10" x2="18" y2="10"></line>
                <line x1="3" y1="14" x2="21" y2="14"></line>
                <line x1="3" y1="18" x2="16" y2="18"></line>
            </svg>
        ),
        'two-column': (
             <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="3" y="4" width="7" height="16" rx="1"></rect>
                <line x1="13" y1="6" x2="20" y2="6"></line>
                <line x1="13" y1="10" x2="20" y2="10"></line>
                <line x1="13" y1="14" x2="20" y2="14"></line>
                <line x1="13" y1="18" x2="18" y2="18"></line>
            </svg>
        ),
        'executive': (
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="3" y="4" width="18" height="5" rx="1"></rect>
                <line x1="3" y1="12" x2="18" y2="12"></line>
                <line x1="3" y1="16" x2="12" y2="16"></line>
            </svg>
        ),
        'tech': (
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="3" y="4" width="6" height="16" rx="1"></rect>
                <line x1="11" y1="7" x2="21" y2="7"></line>
                <line x1="11" y1="11" x2="18" y2="11"></line>
                <line x1="11" y1="15" x2="20" y2="15"></line>
            </svg>
        ),
        'academic': (
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                 <line x1="3" y1="5" x2="21" y2="5"></line>
                 <line x1="3" y1="7" x2="15" y2="7"></line>
                 <line x1="3" y1="11" x2="21" y2="11"></line>
                 <line x1="3" y1="13" x2="18" y2="13"></line>
                 <line x1="3" y1="17" x2="21" y2="17"></line>
                 <line x1="3" y1="19" x2="16" y2="19"></line>
            </svg>
        ),
        'corporate': (
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="3" y="4" width="18" height="5" rx="1" fill="currentColor" strokeWidth="0"></rect>
                <rect x="3" y="11" width="6" height="9" rx="1"></rect>
                <line x1="11" y1="13" x2="21" y2="13"></line>
                <line x1="11" y1="17" x2="18" y2="17"></line>
            </svg>
        ),
    };

    return <div className="w-8 h-8 text-slate-400 group-hover:text-white transition-colors">{icons[templateId]}</div>;
}


export const TemplatePanel: React.FC<TemplatePanelProps> = ({ currentTemplate, onTemplateChange }) => {
    return (
        <div className="p-4">
            <div className="space-y-2">
                {Object.entries(TEMPLATES).map(([key, { name, description }]) => {
                    const isSelected = currentTemplate === key;
                    return (
                        <button
                            key={key}
                            onClick={() => onTemplateChange(key as TemplateId)}
                            className={`w-full p-3 rounded-lg text-start transition-all duration-200 border-2 flex items-center gap-4 group ${isSelected ? 'border-blue-400 bg-slate-700' : 'border-transparent bg-slate-700/50 hover:bg-slate-700'}`}
                        >
                            <TemplateIcon templateId={key as TemplateId} />
                            <div>
                                <span className={`font-semibold transition-colors ${isSelected ? 'text-white' : 'text-slate-300 group-hover:text-white'}`}>{name}</span>
                                <p className={`text-xs transition-colors ${isSelected ? 'text-slate-300' : 'text-slate-400 group-hover:text-slate-300'}`}>{description}</p>
                            </div>
                        </button>
                    )
                })}
            </div>
        </div>
    );
};