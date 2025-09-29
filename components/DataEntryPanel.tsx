import React, { useState } from 'react';
import { CVData, Experience, Education, Skill, Language, Certificate } from '../types';
import { processText } from '../services/geminiService';

interface DataEntryPanelProps {
    data: CVData;
    onDataChange: (data: CVData) => void;
}

type AccordionSection = keyof CVData | '';

const Input: React.FC<React.InputHTMLAttributes<HTMLInputElement>> = (props) => (
    <input {...props} className="w-full p-2 bg-slate-700 border border-slate-600 rounded-md text-sm text-slate-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none" />
);

const Textarea: React.FC<React.TextareaHTMLAttributes<HTMLTextAreaElement>> = (props) => (
    <textarea {...props} rows={5} className="w-full p-2 bg-slate-700 border border-slate-600 rounded-md text-sm text-slate-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none resize-y" />
);

const Accordion: React.FC<{
    title: string;
    children: React.ReactNode;
    isOpen: boolean;
    onToggle: () => void;
}> = ({ title, children, isOpen, onToggle }) => (
    <div className="border-b border-slate-700">
        <button onClick={onToggle} className={`w-full flex justify-between items-center p-4 text-left font-semibold transition-colors duration-200 hover:bg-slate-700/50 ${isOpen ? 'bg-slate-700/50' : ''}`}>
            <span>{title}</span>
            <span className={`transform transition-transform duration-300 ease-in-out ${isOpen ? 'rotate-180' : 'rotate-0'}`}>
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" /></svg>
            </span>
        </button>
        <div className={`grid transition-all duration-300 ease-in-out ${isOpen ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0'}`}>
            <div className="overflow-hidden">
                <div className="p-4 bg-slate-900/30">
                    {children}
                </div>
            </div>
        </div>
    </div>
);


const AiButton: React.FC<{
    onClick: () => void;
    isProcessing: boolean;
    isDisabled: boolean;
    label: string;
    icon: React.ReactNode;
}> = ({ onClick, isProcessing, isDisabled, label, icon }) => (
    <button
        onClick={onClick}
        disabled={isDisabled}
        className="flex-1 flex items-center justify-center p-2 text-xs font-semibold text-slate-300 bg-slate-700 hover:bg-slate-600 disabled:opacity-50 disabled:cursor-not-allowed transition rounded-md"
    >
        {isProcessing ? (
            <svg className="animate-spin h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
        ) : (
            <>
                {icon}
                <span className="ms-1.5">{label}</span>
            </>
        )}
    </button>
);


export const DataEntryPanel: React.FC<DataEntryPanelProps> = ({ data, onDataChange }) => {
    const [openSection, setOpenSection] = useState<AccordionSection>('personal');
    const [isAiProcessing, setIsAiProcessing] = useState<string | null>(null);
    const [aiError, setAiError] = useState('');
    const [newSkill, setNewSkill] = useState('');


    const handleToggle = (section: AccordionSection) => {
        setOpenSection(openSection === section ? '' : section);
    };

    const handleChange = (section: keyof CVData, value: any, index?: number) => {
        const newData = JSON.parse(JSON.stringify(data));
        if (index !== undefined && Array.isArray(newData[section])) {
            (newData[section] as any[])[index] = value;
        } else {
            newData[section] = value;
        }
        onDataChange(newData);
    };

    const handleFieldChange = (section: 'personal', field: keyof CVData['personal'], value: string) => {
        handleChange(section, { ...data[section], [field]: value });
    };

    const handleNestedFieldChange = (section: 'experience' | 'education' | 'skills' | 'languages' | 'certificates', index: number, field: string, value: string) => {
        const item = { ...data[section][index], [field]: value };
        handleChange(section, item, index);
    };

    const handleAddItem = (section: 'experience' | 'education' | 'skills' | 'languages' | 'certificates') => {
        let newItem: Experience | Education | Skill | Language | Certificate;
        switch (section) {
            case 'experience':
                newItem = { role: '', company: '', period: '', description: '' };
                break;
            case 'education':
                newItem = { institution: '', degree: '', period: '' };
                break;
            case 'skills':
                newItem = { name: '', level: 'Intermediate' };
                break;
            case 'languages':
                newItem = { language: '', proficiency: '' };
                break;
            case 'certificates':
                newItem = { name: '', issuer: '', date: '' };
                break;
        }
        
        const newData = JSON.parse(JSON.stringify(data));
        newData[section].push(newItem);
        onDataChange(newData);
    };

    const handleRemoveItem = (section: 'experience' | 'education' | 'skills' | 'languages' | 'certificates', index: number) => {
        const newData = JSON.parse(JSON.stringify(data));
        newData[section].splice(index, 1);
        onDataChange(newData);
    };

    const handleAiTextProcess = async (
        action: 'rephrase' | 'expand' | 'shorten',
        text: string,
        context: 'summary' | 'experience description',
        index?: number
    ) => {
        if (!text || isAiProcessing) return;

        const processId = context === 'summary' ? `summary-${action}` : `experience-${index}-${action}`;
        setIsAiProcessing(processId);
        setAiError('');
        try {
            const result = await processText(text, action, context);
            if (context === 'summary') {
                handleChange('summary', result);
            } else if (context === 'experience description' && index !== undefined) {
                handleNestedFieldChange('experience', index, 'description', result);
            }
        } catch (error: any) {
            setAiError(error.message || 'An error occurred.');
        } finally {
            setIsAiProcessing(null);
        }
    };

    const handleAddSkills = () => {
        if (!newSkill.trim()) return;

        const skillNames = newSkill.split(/[\n,]+/)
            .map(name => name.trim())
            .filter(name => name);

        if (skillNames.length === 0) return;

        const newSkills: Skill[] = skillNames.map(name => ({ name, level: 'Intermediate' }));
        
        const newData = JSON.parse(JSON.stringify(data));
        newData.skills.push(...newSkills);
        onDataChange(newData);
        setNewSkill('');
    };

    const handleSkillInputKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleAddSkills();
        }
    };


    return (
        <div>
            <Accordion title="Personal Details" isOpen={openSection === 'personal'} onToggle={() => handleToggle('personal')}>
                    <div className="space-y-4">
                    <Input placeholder="Full Name" value={data.personal.name} onChange={(e) => handleFieldChange('personal', 'name', e.target.value)} />
                    <Input placeholder="Professional Title" value={data.personal.title} onChange={(e) => handleFieldChange('personal', 'title', e.target.value)} />
                    <Input placeholder="Phone" value={data.personal.phone} onChange={(e) => handleFieldChange('personal', 'phone', e.target.value)} />
                    <Input placeholder="Email" value={data.personal.email} onChange={(e) => handleFieldChange('personal', 'email', e.target.value)} />
                    <Input placeholder="LinkedIn Profile URL" value={data.personal.linkedin} onChange={(e) => handleFieldChange('personal', 'linkedin', e.target.value)} />
                </div>
            </Accordion>
            <Accordion title="Professional Summary" isOpen={openSection === 'summary'} onToggle={() => handleToggle('summary')}>
                <Textarea placeholder="Write a brief professional summary..." value={data.summary} onChange={(e) => handleChange('summary', e.target.value)} />
                <div className="mt-2 space-y-2">
                    <div className="flex items-center gap-2">
                        <AiButton label="Rephrase" icon={<svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor"><path d="M17.414 2.586a2 2 0 00-2.828 0L7 10.172V13h2.828l7.586-7.586a2 2 0 000-2.828z" /><path fillRule="evenodd" d="M2 6a2 2 0 012-2h4a1 1 0 010 2H4v10h10v-4a1 1 0 112 0v4a2 2 0 01-2 2H4a2 2 0 01-2-2V6z" clipRule="evenodd" /></svg>}
                            onClick={() => handleAiTextProcess('rephrase', data.summary, 'summary')}
                            isProcessing={isAiProcessing === 'summary-rephrase'}
                            isDisabled={!data.summary || !!isAiProcessing}
                        />
                        <AiButton label="Expand" icon={<svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M10 3a1 1 0 011 1v4h4a1 1 0 110 2h-4v4a1 1 0 11-2 0v-4H5a1 1 0 110-2h4V4a1 1 0 011-1z" clipRule="evenodd" /></svg>}
                            onClick={() => handleAiTextProcess('expand', data.summary, 'summary')}
                            isProcessing={isAiProcessing === 'summary-expand'}
                            isDisabled={!data.summary || !!isAiProcessing}
                        />
                        <AiButton label="Shorten" icon={<svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M5 10a1 1 0 011-1h8a1 1 0 110 2H6a1 1 0 01-1-1z" clipRule="evenodd" /></svg>}
                            onClick={() => handleAiTextProcess('shorten', data.summary, 'summary')}
                            isProcessing={isAiProcessing === 'summary-shorten'}
                            isDisabled={!data.summary || !!isAiProcessing}
                        />
                    </div>
                        {aiError && isAiProcessing?.startsWith('summary') && <p className="text-xs text-red-400 mt-1">{aiError}</p>}
                </div>
            </Accordion>
            <Accordion title="Work Experience" isOpen={openSection === 'experience'} onToggle={() => handleToggle('experience')}>
                <div className="space-y-4">
                {data.experience.length === 0 ? (
                    <p className="text-sm text-slate-400 text-center py-2">No work experience added yet.</p>
                ) : (
                    data.experience.map((exp, i) => (
                        <div key={i} className="p-4 border border-slate-600 rounded-md bg-slate-700/50 space-y-3 relative group">
                            <button onClick={() => handleRemoveItem('experience', i)} className="absolute top-2 end-2 text-slate-400 hover:text-red-400 opacity-0 group-hover:opacity-100 transition-opacity">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" /></svg>
                            </button>
                            <Input placeholder="Role" value={exp.role} onChange={(e) => handleNestedFieldChange('experience', i, 'role', e.target.value)} />
                            <Input placeholder="Company" value={exp.company} onChange={(e) => handleNestedFieldChange('experience', i, 'company', e.target.value)} />
                            <Input placeholder="Period (e.g., Jan 2020 - Present)" value={exp.period} onChange={(e) => handleNestedFieldChange('experience', i, 'period', e.target.value)} />
                            <Textarea placeholder="Description & Achievements" value={exp.description} onChange={(e) => handleNestedFieldChange('experience', i, 'description', e.target.value)} />
                            <div className="mt-2 space-y-2">
                                <div className="flex items-center gap-2">
                                    <AiButton label="Rephrase" icon={<svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor"><path d="M17.414 2.586a2 2 0 00-2.828 0L7 10.172V13h2.828l7.586-7.586a2 2 0 000-2.828z" /><path fillRule="evenodd" d="M2 6a2 2 0 012-2h4a1 1 0 010 2H4v10h10v-4a1 1 0 112 0v4a2 2 0 01-2 2H4a2 2 0 01-2-2V6z" clipRule="evenodd" /></svg>}
                                        onClick={() => handleAiTextProcess('rephrase', exp.description, 'experience description', i)}
                                        isProcessing={isAiProcessing === `experience-${i}-rephrase`}
                                        isDisabled={!exp.description || !!isAiProcessing}
                                    />
                                    <AiButton label="Expand" icon={<svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M10 3a1 1 0 011 1v4h4a1 1 0 110 2h-4v4a1 1 0 11-2 0v-4H5a1 1 0 110-2h4V4a1 1 0 011-1z" clipRule="evenodd" /></svg>}
                                        onClick={() => handleAiTextProcess('expand', exp.description, 'experience description', i)}
                                        isProcessing={isAiProcessing === `experience-${i}-expand`}
                                        isDisabled={!exp.description || !!isAiProcessing}
                                    />
                                    <AiButton label="Shorten" icon={<svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M5 10a1 1 0 011-1h8a1 1 0 110 2H6a1 1 0 01-1-1z" clipRule="evenodd" /></svg>}
                                        onClick={() => handleAiTextProcess('shorten', exp.description, 'experience description', i)}
                                        isProcessing={isAiProcessing === `experience-${i}-shorten`}
                                        isDisabled={!exp.description || !!isAiProcessing}
                                    />
                                </div>
                                {aiError && isAiProcessing?.startsWith(`experience-${i}`) && <p className="text-xs text-red-400 mt-1">{aiError}</p>}
                            </div>
                        </div>
                    ))
                )}
                    <button onClick={() => handleAddItem('experience')} className="w-full text-sm font-semibold text-blue-300 hover:text-blue-200 p-2 rounded-md bg-blue-500/20 hover:bg-blue-500/30 transition">+ Add Experience</button>
                </div>
            </Accordion>
            <Accordion title="Education" isOpen={openSection === 'education'} onToggle={() => handleToggle('education')}>
                <div className="space-y-4">
                    {data.education.length === 0 ? (
                        <p className="text-sm text-slate-400 text-center py-2">No education history added yet.</p>
                    ) : (
                        data.education.map((edu, i) => (
                            <div key={i} className="p-4 border border-slate-600 rounded-md bg-slate-700/50 space-y-3 relative group">
                                <button onClick={() => handleRemoveItem('education', i)} className="absolute top-2 end-2 text-slate-400 hover:text-red-400 opacity-0 group-hover:opacity-100 transition-opacity">
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" /></svg>
                                </button>
                                <Input placeholder="Institution" value={edu.institution} onChange={(e) => handleNestedFieldChange('education', i, 'institution', e.target.value)} />
                                <Input placeholder="Degree / Major" value={edu.degree} onChange={(e) => handleNestedFieldChange('education', i, 'degree', e.target.value)} />
                                <Input placeholder="Period (e.g., Aug 2016 - May 2020)" value={edu.period} onChange={(e) => handleNestedFieldChange('education', i, 'period', e.target.value)} />
                            </div>
                        ))
                    )}
                    <button onClick={() => handleAddItem('education')} className="w-full text-sm font-semibold text-blue-300 hover:text-blue-200 p-2 rounded-md bg-blue-500/20 hover:bg-blue-500/30 transition">+ Add Education</button>
                </div>
            </Accordion>
            <Accordion title="Skills" isOpen={openSection === 'skills'} onToggle={() => handleToggle('skills')}>
                <div className="space-y-4">
                    <div className="flex flex-wrap gap-2">
                        {data.skills.length === 0 ? (
                            <p className="text-xs text-slate-400">No skills added yet.</p>
                        ) : (
                            data.skills.map((skill, i) => (
                                <div key={i} className="flex items-center bg-slate-700 text-slate-200 text-sm rounded-full px-3 py-1">
                                    <span>{skill.name}</span>
                                    <button onClick={() => handleRemoveItem('skills', i)} className="ms-2 text-slate-400 hover:text-red-400 rounded-full focus:outline-none focus:ring-1 focus:ring-red-400">
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" /></svg>
                                    </button>
                                </div>
                            ))
                        )}
                    </div>
                    
                    <div className="flex items-start gap-2 pt-2">
                        <Textarea 
                            placeholder="Add skill(s)... (e.g., React, Python)"
                            value={newSkill}
                            onChange={(e) => setNewSkill(e.target.value)}
                            onKeyDown={handleSkillInputKeyDown}
                            rows={2}
                        />
                        <button 
                            onClick={handleAddSkills} 
                            className="p-2 h-full bg-blue-600 text-white rounded-md hover:bg-blue-700 transition disabled:bg-slate-500 disabled:cursor-not-allowed"
                            disabled={!newSkill.trim()}
                            aria-label="Add Skill(s)"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                <path d="M10.894 2.553a1 1 0 00-1.788 0l-7 14a1 1 0 001.169 1.409l5-1.429A1 1 0 009 15.571V11a1 1 0 112 0v4.571a1 1 0 00.725.962l5 1.428a1 1 0 001.17-1.408l-7-14z" />
                            </svg>
                        </button>
                    </div>
                    <p className="text-xs text-slate-500 -mt-2 px-1">You can add multiple skills separated by commas or new lines.</p>
                </div>
            </Accordion>
            <Accordion title="Languages" isOpen={openSection === 'languages'} onToggle={() => handleToggle('languages')}>
                <div className="space-y-4">
                {data.languages.length === 0 ? (
                    <p className="text-sm text-slate-400 text-center py-2">No languages added yet.</p>
                ) : (
                    data.languages.map((lang, i) => (
                        <div key={i} className="p-3 border border-slate-600 rounded-md bg-slate-700/50 flex items-center gap-3 relative group">
                            <button onClick={() => handleRemoveItem('languages', i)} className="absolute top-1/2 -translate-y-1/2 end-2 text-slate-400 hover:text-red-400 opacity-0 group-hover:opacity-100 transition-opacity">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" /></svg>
                            </button>
                            <Input placeholder="Language" value={lang.language} onChange={(e) => handleNestedFieldChange('languages', i, 'language', e.target.value)} />
                            <Input placeholder="Proficiency" value={lang.proficiency} onChange={(e) => handleNestedFieldChange('languages', i, 'proficiency', e.target.value)} />
                        </div>
                    ))
                )}
                <button onClick={() => handleAddItem('languages')} className="w-full text-sm font-semibold text-blue-300 hover:text-blue-200 p-2 rounded-md bg-blue-500/20 hover:bg-blue-500/30 transition">+ Add Language</button>
                </div>
            </Accordion>
            <Accordion title="Certificates" isOpen={openSection === 'certificates'} onToggle={() => handleToggle('certificates')}>
            <div className="space-y-4">
                {data.certificates.length === 0 ? (
                     <p className="text-sm text-slate-400 text-center py-2">No certificates added yet.</p>
                ) : (
                    data.certificates.map((cert, i) => (
                        <div key={i} className="p-4 border border-slate-600 rounded-md bg-slate-700/50 space-y-3 relative group">
                            <button onClick={() => handleRemoveItem('certificates', i)} className="absolute top-2 end-2 text-slate-400 hover:text-red-400 opacity-0 group-hover:opacity-100 transition-opacity">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" /></svg>
                            </button>
                            <Input placeholder="Certificate Name" value={cert.name} onChange={(e) => handleNestedFieldChange('certificates', i, 'name', e.target.value)} />
                            <Input placeholder="Issuing Organization" value={cert.issuer} onChange={(e) => handleNestedFieldChange('certificates', i, 'issuer', e.target.value)} />
                            <Input placeholder="Date (e.g., June 2023)" value={cert.date} onChange={(e) => handleNestedFieldChange('certificates', i, 'date', e.target.value)} />
                        </div>
                    ))
                )}
                <button onClick={() => handleAddItem('certificates')} className="w-full text-sm font-semibold text-blue-300 hover:text-blue-200 p-2 rounded-md bg-blue-500/20 hover:bg-blue-500/30 transition">+ Add Certificate</button>
            </div>
        </Accordion>
        </div>
    );
};