import React from 'react';
import { TemplateProps, Section } from './BaseTemplate';

const normalizeUrl = (url: string) => {
    if (!url) return '#';
    if (url.startsWith('http://') || url.startsWith('https://')) {
        return url;
    }
    return `https://${url}`;
};

export const ExecutiveTemplate: React.FC<TemplateProps> = ({ data, color }) => {
    const { personal, summary, experience, education, skills, languages, certificates } = data;
    
    return (
        <div className="p-8 bg-white h-full text-sm font-sans text-gray-800">
            <header 
                className="flex justify-between items-center mb-6 pb-4 border-b-4" 
                style={{borderColor: color}}
            >
                <div>
                    <h1 className="text-4xl font-extrabold tracking-tighter">{personal.name}</h1>
                    <p className="text-lg font-medium tracking-wide text-gray-600">{personal.title}</p>
                </div>
                <div className="text-right text-xs text-gray-600 space-y-1">
                    {personal.phone && <a href={`tel:${personal.phone.replace(/\s/g, '')}`} className="hover:underline">{personal.phone}</a>}
                    {personal.email && <a href={`mailto:${personal.email}`} className="hover:underline block">{personal.email}</a>}
                    {personal.linkedin && <a href={normalizeUrl(personal.linkedin)} target="_blank" rel="noopener noreferrer" className="hover:underline block">{personal.linkedin}</a>}
                </div>
            </header>

            <Section title="Professional Profile" color={color}>
                <p className="text-gray-700 leading-relaxed">{summary}</p>
            </Section>

            <Section title="Professional Experience" color={color}>
                {experience.map((exp, i) => (
                    <div key={i} className="mb-5">
                        <div className="grid grid-cols-12 gap-4">
                            <div className="col-span-3">
                                <p className="font-bold">{exp.company}</p>
                                <p className="text-xs text-gray-500">{exp.period}</p>
                            </div>
                            <div className="col-span-9">
                                <h3 className="font-bold text-base">{exp.role}</h3>
                                <p className="text-gray-700 text-xs leading-normal whitespace-pre-wrap">{exp.description}</p>
                            </div>
                        </div>
                    </div>
                ))}
            </Section>

            <Section title="Education" color={color}>
                {education.map((edu, i) => (
                    <div key={i} className="mb-1">
                        <h3 className="font-bold text-base inline">{edu.degree}, </h3>
                        <p className="inline text-gray-700">{edu.institution} - {edu.period}</p>
                    </div>
                ))}
            </Section>

             {certificates && certificates.length > 0 && (
                <Section title="Certificates & Training" color={color}>
                    {certificates.map((cert, i) => (
                         <div key={i} className="mb-1">
                            <h3 className="font-bold text-base inline">{cert.name} </h3>
                            <p className="inline text-gray-700">- {cert.issuer}, {cert.date}</p>
                        </div>
                    ))}
                </Section>
            )}

            <Section title="Core Competencies" color={color}>
                <div className="columns-3 gap-8 text-xs text-gray-700">
                    <ul className="list-disc list-inside space-y-1">
                        {skills.map((skill, i) => (
                            <li key={i}>{skill.name}</li>
                        ))}
                    </ul>
                    {languages && languages.length > 0 && (
                         <ul className="list-disc list-inside space-y-1 mt-2">
                            {languages.map((lang, i) => (
                                <li key={i}>{lang.language} ({lang.proficiency})</li>
                            ))}
                        </ul>
                    )}
                </div>
            </Section>
        </div>
    );
};