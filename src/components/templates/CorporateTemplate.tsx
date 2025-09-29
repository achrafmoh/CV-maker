import React from 'react';
import { TemplateProps, Section } from './BaseTemplate';

const normalizeUrl = (url: string) => {
    if (!url) return '#';
    if (url.startsWith('http://') || url.startsWith('https://')) {
        return url;
    }
    return `https://${url}`;
};

export const CorporateTemplate: React.FC<TemplateProps> = ({ data, color }) => {
    const { personal, summary, experience, education, skills, languages, certificates } = data;
    
    return (
        <div className="h-full text-sm font-sans text-gray-800 bg-white">
            <header className="p-8" style={{ backgroundColor: color }}>
                <h1 className="text-4xl font-extrabold tracking-tight text-white">{personal.name}</h1>
                <p className="text-lg font-medium tracking-wide text-white/90">{personal.title}</p>
            </header>
            
            <div className="p-8">
                <div className="grid grid-cols-12 gap-8">
                    <div className="col-span-4">
                        <div className="space-y-4">
                             <div>
                                <h2 className="text-sm font-bold uppercase tracking-wider text-gray-500 mb-2">Contact</h2>
                                <div className="text-xs space-y-1 break-all">
                                    {personal.phone && <a href={`tel:${personal.phone.replace(/\s/g, '')}`} className="hover:underline block">{personal.phone}</a>}
                                    {personal.email && <a href={`mailto:${personal.email}`} className="hover:underline block">{personal.email}</a>}
                                    {personal.linkedin && <a href={normalizeUrl(personal.linkedin)} target="_blank" rel="noopener noreferrer" className="hover:underline block">{personal.linkedin}</a>}
                                </div>
                            </div>
                            <div>
                                <h2 className="text-sm font-bold uppercase tracking-wider text-gray-500 mb-2">Education</h2>
                                {education.map((edu, i) => (
                                    <div key={i} className="mb-2 text-xs">
                                        <h3 className="font-bold">{edu.institution}</h3>
                                        <p className="text-gray-600">{edu.degree}</p>
                                        <p className="text-gray-500">{edu.period}</p>
                                    </div>
                                ))}
                            </div>
                             <div>
                                <h2 className="text-sm font-bold uppercase tracking-wider text-gray-500 mb-2">Skills</h2>
                                <p className="text-xs text-gray-700 leading-relaxed">
                                    {skills.map(s => s.name).join(' • ')}
                                </p>
                            </div>
                             {languages && languages.length > 0 && (
                                <div>
                                    <h2 className="text-sm font-bold uppercase tracking-wider text-gray-500 mb-2">Languages</h2>
                                    <div className="text-xs space-y-1">
                                        {languages.map((lang, i) => (
                                            <p key={i}><span className="font-semibold">{lang.language}:</span> {lang.proficiency}</p>
                                        ))}
                                    </div>
                                </div>
                            )}

                             {certificates && certificates.length > 0 && (
                                <div>
                                    <h2 className="text-sm font-bold uppercase tracking-wider text-gray-500 mb-2">Certificates</h2>
                                    <div className="text-xs space-y-1">
                                        {certificates.map((cert, i) => (
                                            <div key={i} className="mb-1">
                                                <p className="font-semibold">{cert.name}</p>
                                                <p className="text-gray-600">{cert.issuer} - {cert.date}</p>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>

                    <div className="col-span-8">
                        <Section title="Summary" color={color}>
                            <p className="text-gray-700 leading-relaxed">{summary}</p>
                        </Section>

                        <Section title="Experience" color={color}>
                            {experience.map((exp, i) => (
                                <div key={i} className="mb-4">
                                    <div className="flex justify-between items-baseline">
                                        <h3 className="font-bold text-base">{exp.role}</h3>
                                        <p className="text-xs text-gray-500">{exp.period}</p>
                                    </div>
                                    <p className="italic text-gray-600 text-sm mb-1">{exp.company}</p>
                                    <p className="text-gray-700 text-xs leading-normal whitespace-pre-wrap">{exp.description}</p>
                                </div>
                            ))}
                        </Section>
                    </div>
                </div>
            </div>
        </div>
    );
};