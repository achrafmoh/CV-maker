import React from 'react';
import { TemplateProps } from './BaseTemplate';

const ColumnSection: React.FC<{ title: string; children: React.ReactNode; color: string; }> = ({ title, children, color }) => (
    <div className="mb-4">
        <h2 className="text-sm font-bold uppercase tracking-wider border-b pb-1 mb-2" style={{ color }}>
            {title}
        </h2>
        {children}
    </div>
);

const normalizeUrl = (url: string) => {
    if (!url) return '#';
    if (url.startsWith('http://') || url.startsWith('https://')) {
        return url;
    }
    return `https://${url}`;
};


export const TechFocusedTemplate: React.FC<TemplateProps> = ({ data, color }) => {
    const { personal, summary, experience, education, skills, languages, certificates } = data;
    
    return (
        <div className="flex h-full text-sm font-sans text-gray-800 bg-white">
            {/* Left Column */}
            <div className="w-1/3 bg-gray-50 p-6 border-r border-gray-200">
                <div className="mb-6">
                    <h1 className="text-2xl font-bold" style={{color}}>{personal.name}</h1>
                    <p className="text-sm font-medium text-gray-700">{personal.title}</p>
                </div>
                
                <ColumnSection title="Contact" color={color}>
                    <div className="space-y-1 text-xs text-gray-700 break-all">
                        {personal.email && <p><strong>Email:</strong> <a href={`mailto:${personal.email}`} className="hover:underline">{personal.email}</a></p>}
                        {personal.phone && <p><strong>Phone:</strong> <a href={`tel:${personal.phone.replace(/\s/g, '')}`} className="hover:underline">{personal.phone}</a></p>}
                        {personal.linkedin && <p><strong>LinkedIn:</strong> <a href={normalizeUrl(personal.linkedin)} target="_blank" rel="noopener noreferrer" className="hover:underline">{personal.linkedin}</a></p>}
                        {personal.github && <p><strong>GitHub:</strong> <a href={normalizeUrl(personal.github)} target="_blank" rel="noopener noreferrer" className="hover:underline">{personal.github}</a></p>}
                    </div>
                </ColumnSection>
                
                <ColumnSection title="Education" color={color}>
                    {education.map((edu, i) => (
                        <div key={i} className="mb-2">
                            <h3 className="font-bold text-xs">{edu.institution}</h3>
                            <p className="text-xs text-gray-600">{edu.degree}</p>
                            <p className="text-xs text-gray-500">{edu.period}</p>
                        </div>
                    ))}
                </ColumnSection>

                <ColumnSection title="Skills" color={color}>
                    <div className="columns-2 gap-4">
                        <ul className="text-xs space-y-1">
                            {skills.map((skill, i) => (
                                <li key={i}>{skill.name}</li>
                            ))}
                        </ul>
                    </div>
                </ColumnSection>

                {languages && languages.length > 0 && (
                    <ColumnSection title="Languages" color={color}>
                        <div className="text-xs space-y-1">
                            {languages.map((lang, i) => (
                                <p key={i}><span className="font-semibold">{lang.language}:</span> {lang.proficiency}</p>
                            ))}
                        </div>
                    </ColumnSection>
                )}

                {certificates && certificates.length > 0 && (
                     <ColumnSection title="Certificates" color={color}>
                        <div className="text-xs space-y-1">
                            {certificates.map((cert, i) => (
                                <div key={i} className="mb-1">
                                    <p className="font-semibold">{cert.name}</p>
                                    <p className="text-gray-600">{cert.issuer} - {cert.date}</p>
                                </div>
                            ))}
                        </div>
                    </ColumnSection>
                )}
            </div>

            {/* Right Column */}
            <div className="w-2/3 p-6 overflow-y-auto">
                <ColumnSection title="Summary" color={color}>
                    <p className="text-xs text-gray-700 text-justify">{summary}</p>
                </ColumnSection>

                <div className="mt-4">
                    <ColumnSection title="Experience" color={color}>
                        {experience.map((exp, i) => (
                            <div key={i} className="mb-3">
                                <div className="flex justify-between items-baseline">
                                    <h3 className="font-bold">{exp.role}</h3>
                                    <p className="text-xs text-gray-500">{exp.period}</p>
                                </div>
                                <p className="italic text-gray-600 text-xs mb-1">{exp.company}</p>
                                <p className="text-xs text-gray-700 space-y-1 whitespace-pre-wrap">
                                    {exp.description}
                                </p>
                            </div>
                        ))}
                    </ColumnSection>
                </div>
            </div>
        </div>
    );
};