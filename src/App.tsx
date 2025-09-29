import React, { useState, useCallback, useEffect } from 'react';
import { CVData, TemplateId, ATSResult } from './types';
import { DEFAULT_CV_DATA, EMPTY_CV_DATA } from './constants';
import { LiveCVPreview } from './components/LiveCVPreview';
import { SidePanel } from './components/SidePanel';
import { COLOR_PALETTES, FONT_PAIRINGS } from './constants';
import { ExportModal } from './components/ExportModal';
import { ZoomControls } from './components/ZoomControls';

export type PanelTab = 'content' | 'templates' | 'customize' | 'test';

const MobilePanelHandle: React.FC<{
    isOpen: boolean;
    onClick: () => void;
}> = ({ isOpen, onClick }) => {
    const panelWidth = '25rem'; // 5rem nav + 20rem content

    return (
        <button
            onClick={onClick}
            className={`fixed lg:hidden top-1/2 -translate-y-1/2 z-50
                       w-8 h-20 bg-slate-900 shadow-lg 
                       flex items-center justify-center text-slate-400 
                       hover:bg-slate-800 hover:text-white transition-all duration-300 ease-in-out group 
                       focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-slate-100 focus:ring-blue-500
                       rounded-r-lg`}
            style={{
                left: isOpen ? panelWidth : '0rem',
                transitionProperty: 'left',
            }}
            aria-label={isOpen ? "Close panel" : "Open panel"}
        >
            <div className="relative w-6 h-6 overflow-hidden">
                <span className={`absolute inset-0 flex items-center justify-center transition-transform duration-300 ease-in-out ${isOpen ? '-translate-x-full' : 'translate-x-0'}`}>
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 5l7 7-7 7M5 5l7 7-7 7" /></svg>
                </span>
                <span className={`absolute inset-0 flex items-center justify-center transition-transform duration-300 ease-in-out ${isOpen ? 'translate-x-0' : 'translate-x-full'}`}>
                     <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 19l-7-7 7-7m8 14l-7-7 7-7" /></svg>
                </span>
            </div>
        </button>
    );
};


const App: React.FC = () => {
    const [formCvData, setFormCvData] = useState<CVData>(EMPTY_CV_DATA);
    const [displayCvData, setDisplayCvData] = useState<CVData>(DEFAULT_CV_DATA);
    
    const [templateId, setTemplateId] = useState<TemplateId>('timeline-accent');
    const [color, setColor] = useState<string>(COLOR_PALETTES[0].color);
    const [font, setFont] = useState<string>(FONT_PAIRINGS[0].className);
    const [activeTab, setActiveTab] = useState<PanelTab>('content');
    const [atsResult, setAtsResult] = useState<ATSResult | null>(null);
    const [isTesting, setIsTesting] = useState(false);
    const [isPanelOpen, setIsPanelOpen] = useState(true);
    const [isExportModalOpen, setIsExportModalOpen] = useState(false);
    const [zoomLevel, setZoomLevel] = useState(1);
    
    useEffect(() => {
        const mergedData: CVData = {
            personal: {
                name: formCvData.personal.name || DEFAULT_CV_DATA.personal.name,
                title: formCvData.personal.title || DEFAULT_CV_DATA.personal.title,
                phone: formCvData.personal.phone || DEFAULT_CV_DATA.personal.phone,
                email: formCvData.personal.email || DEFAULT_CV_DATA.personal.email,
                linkedin: formCvData.personal.linkedin || DEFAULT_CV_DATA.personal.linkedin,
                github: formCvData.personal.github || DEFAULT_CV_DATA.personal.github,
            },
            summary: formCvData.summary || DEFAULT_CV_DATA.summary,
            experience: formCvData.experience.length > 0 ? formCvData.experience : DEFAULT_CV_DATA.experience,
            education: formCvData.education.length > 0 ? formCvData.education : DEFAULT_CV_DATA.education,
            skills: formCvData.skills.length > 0 ? formCvData.skills : DEFAULT_CV_DATA.skills,
            languages: formCvData.languages.length > 0 ? formCvData.languages : DEFAULT_CV_DATA.languages,
            certificates: formCvData.certificates.length > 0 ? formCvData.certificates : DEFAULT_CV_DATA.certificates,
        };
        setDisplayCvData(mergedData);
    }, [formCvData]);


    const handleDataChange = useCallback((newData: CVData) => {
        setFormCvData(newData);
    }, []);
    
    return (
        <div className="flex flex-col lg:flex-row h-screen w-screen bg-slate-100 font-sans text-slate-800 overflow-hidden">
             <MobilePanelHandle isOpen={isPanelOpen} onClick={() => setIsPanelOpen(!isPanelOpen)} />
            <SidePanel
                isOpen={isPanelOpen}
                setIsOpen={setIsPanelOpen}
                activeTab={activeTab}
                setActiveTab={setActiveTab}
                formCvData={formCvData}
                displayCvData={displayCvData}
                onDataChange={handleDataChange}
                templateId={templateId}
                setTemplateId={setTemplateId}
                color={color}
                setColor={setColor}
                font={font}
                setFont={setFont}
                atsResult={atsResult}
                setAtsResult={setAtsResult}
                isTesting={isTesting}
                setIsTesting={setIsTesting}
                onOpenExportModal={() => setIsExportModalOpen(true)}
            />
            
            <main className="flex-1 flex flex-col justify-start overflow-auto relative p-4 md:p-8">
                 <LiveCVPreview
                    data={displayCvData}
                    templateId={templateId}
                    color={color}
                    font={font}
                    zoomLevel={zoomLevel}
                />
                <ZoomControls zoomLevel={zoomLevel} setZoomLevel={setZoomLevel} />
            </main>

            <ExportModal 
                isOpen={isExportModalOpen} 
                onClose={() => setIsExportModalOpen(false)}
                cvData={displayCvData}
             />
        </div>
    );
};

export default App;
