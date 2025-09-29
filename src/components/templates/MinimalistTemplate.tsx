import React from 'react';
import { TemplateProps, Section, ContactInfo } from './BaseTemplate';

export const MinimalistTemplate: React.FC<TemplateProps> = ({ data, color }) => {
    const { personal, summary, experience, education, skills, languages, certificates } = data;

    return (
        <div className="p-10 bg-white h-full text-sm font-sans text-gray-800">
            <header className="mb-8">
                <h1 className="text-3xl font-light tracking-widest uppercase">{personal.name}</h1>
                <p className="text-sm tracking-widest" style={{ color }}>{personal.title}</p>
                 <div className="mt-4 border-y py-2">
                    <ContactInfo phone={personal.phone} email={personal.email} linkedin={personal.linkedin} color={color} />
                </div>
            </header>

            <div className="mb-6">
                <p className="text-gray-700 text-center italic">{summary}</p>
            </div>
            
            <Section title="Experience" color={color}>
                {experience.map((exp, i) => (
                    <div key={i} className="mb-4">
                        <div className="flex justify-between">
                            <h3 className="font-bold">
                                {exp.role} 
                                <span className="font-normal text-gray-600"> at {exp.company}</span>
                            </h3>
                            <p className="text-xs text-gray-500">{exp.period}</p>
                        </div>
                        <p className="text-gray-700 text-xs pl-4 whitespace-pre-wrap">{exp.description}</p>
                    </div>
                ))}
            </Section>

            <Section title="Education" color={color}>
                {education.map((edu, i) => (
                    <div key={i} className="flex justify-between mb-1">
                        <h3 className="font-bold">
                            {edu.institution} 
                            <span className="font-normal text-gray-600"> - {edu.degree}</span>
                        </h3>
                        <p className="text-xs text-gray-500">{edu.period}</p>
                    </div>
                ))}
            </Section>

            <Section title="Skills" color={color}>
                <div className="text-gray-700 leading-relaxed text-center">
                    {skills.map((skill, i) => (
                        <span key={i} className="inline-block mr-2">
                        {skill.name}
                        {i < skills.length -1 && ' • '}
                        </span>
                    ))}
                </div>
            </Section>

            {languages && languages.length > 0 && (
                <Section title="Languages" color={color}>
                    <div className="text-gray-700 leading-relaxed text-center">
                        {languages.map((lang, i) => (
                             <span key={i} className="inline-block mr-3">
                                <span className="font-semibold">{lang.language}:</span> {lang.proficiency}
                                {i < languages.length - 1 && ' • '}
                            </span>
                        ))}
                    </div>
                </Section>
            )}

            {certificates && certificates.length > 0 && (
                <Section title="Certificates" color={color}>
                     <div className="text-gray-700 leading-relaxed text-center">
                        {certificates.map((cert, i) => (
                             <span key={i} className="inline-block mr-3">
                                <span className="font-semibold">{cert.name}</span> ({cert.issuer}, {cert.date})
                                {i < certificates.length - 1 && ' • '}
                            </span>
                        ))}
                    </div>
                </Section>
            )}
        </div>
    );
};