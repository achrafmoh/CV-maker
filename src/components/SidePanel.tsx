import React from 'react';
import { CVData, TemplateId, ATSResult } from '../types';
import { PanelTab } from '../App';
import { DataEntryPanel } from './DataEntryPanel';
import { TemplatePanel } from './TemplatePanel';
import { CustomizePanel } from './CustomizePanel';
import { ATSTestPanel } from './ATSTestPanel';

interface SidePanelProps {
    isOpen: boolean;
    setIsOpen: (isOpen: boolean) => void;
    activeTab: PanelTab;
    setActiveTab: (tab: PanelTab) => void;
    formCvData: CVData;
    displayCvData: CVData;
    onDataChange: (data: CVData) => void;
    templateId: TemplateId;
    setTemplateId: (id: TemplateId) => void;
    color: string;
    setColor: (color: string) => void;
    font: string;
    setFont: (font: string) => void;
    atsResult: ATSResult | null;
    setAtsResult: (result: ATSResult | null) => void;
    isTesting: boolean;
    setIsTesting: (isTesting: boolean) => void;
    onOpenExportModal: () => void;
}

const NavButton: React.FC<{
    label: string;
    icon: React.ReactNode;
    isActive?: boolean;
    onClick: () => void;
}> = ({ label, icon, isActive = false, onClick }) => (
    <button
        onClick={onClick}
        className={`flex flex-col items-center justify-center w-full h-20 transition-colors duration-200 ${
            isActive ? 'bg-slate-700 text-white' : 'text-slate-400 hover:bg-slate-700/50 hover:text-white'
        }`}
        aria-label={label}
    >
        {icon}
        <span className="text-xs mt-1">{label}</span>
    </button>
);

export const SidePanel: React.FC<SidePanelProps> = (props) => {
    const { 
        isOpen, setIsOpen, activeTab, setActiveTab,
        formCvData, onDataChange, displayCvData,
        templateId, setTemplateId,
        color, setColor,
        font, setFont,
        atsResult, setAtsResult,
        isTesting, setIsTesting,
        onOpenExportModal
    } = props;

    const panelInfo: Record<PanelTab, { title: string; subtitle: string; }> = {
        content: { title: "CV Content", subtitle: "Fill in the details below." },
        templates: { title: "Select Template", subtitle: "Choose a professional, ATS-friendly layout." },
        customize: { title: "Customize", subtitle: "Fine-tune colors and fonts." },
        test: { title: "ATS Test", subtitle: "Analyze your CV against a job description." },
    };

    const renderPanel = () => {
        switch (activeTab) {
            case 'content':
                return <DataEntryPanel data={formCvData} onDataChange={onDataChange} />;
            case 'templates':
                return <TemplatePanel currentTemplate={templateId} onTemplateChange={setTemplateId} />;
            case 'customize':
                return <CustomizePanel color={color} setColor={setColor} font={font} setFont={setFont} />;
            case 'test':
                return <ATSTestPanel cvData={displayCvData} result={atsResult} setResult={setAtsResult} isTesting={isTesting} setIsTesting={setIsTesting} />;
            default:
                return null;
        }
    };

    return (
        <>
            {/* Overlay for mobile */}
            <div 
                className={`fixed inset-0 bg-black/60 z-30 transition-opacity lg:hidden ${isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
                onClick={() => setIsOpen(false)}
            />

            <aside className={`fixed lg:relative flex z-40 h-screen transition-transform duration-300 ease-in-out ${isOpen ? 'translate-x-0' : '-translate-x-full'} lg:translate-x-0`}>
                {/* Navigation Bar */}
                <div className="w-20 bg-slate-900 flex flex-col items-center flex-shrink-0">
                     <div className="w-full text-center py-4 border-b border-slate-700">
                        <span className="text-xl font-bold text-white">CV</span>
                    </div>
                    <nav className="w-full">
                        <NavButton
                            label="Content"
                            isActive={activeTab === 'content'}
                            onClick={() => setActiveTab('content')}
                            icon={<svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>}
                        />
                         <NavButton
                            label="Templates"
                            isActive={activeTab === 'templates'}
                            onClick={() => setActiveTab('templates')}
                            icon={<svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 5a1 1 0 011-1h14a1 1 0 011 1v2a1 1 0 01-1 1H5a1 1 0 01-1-1V5zM4 13a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H5a1 1 0 01-1-1v-6zM16 13a1 1 0 011-1h2a1 1 0 011 1v6a1 1 0 01-1 1h-2a1 1 0 01-1-1v-6z" /></svg>}
                        />
                         <NavButton
                            label="Customize"
                            isActive={activeTab === 'customize'}
                            onClick={() => setActiveTab('customize')}
                            icon={<svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.5L15.232 5.232z" /></svg>}
                        />
                        <NavButton
                            label="ATS Test"
                            isActive={activeTab === 'test'}
                            onClick={() => setActiveTab('test')}
                            icon={<svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" /></svg>}
                        />
                    </nav>

                    <div className="mt-auto w-full">
                         <NavButton
                            label="Download"
                            onClick={onOpenExportModal}
                            icon={<svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" /></svg>}
                        />
                    </div>
                </div>
                
                {/* Panel Content */}
                <div className="w-80 bg-slate-800 text-slate-200 flex flex-col shadow-2xl">
                    <header className="p-4 border-b border-slate-700 flex-shrink-0">
                        <h2 className="text-xl font-bold text-white">{panelInfo[activeTab].title}</h2>
                        <p className="text-sm text-slate-400">{panelInfo[activeTab].subtitle}</p>
                    </header>
                    <div className="flex-1 overflow-y-auto">
                        {renderPanel()}
                    </div>
                </div>
            </aside>
        </>
    );
};