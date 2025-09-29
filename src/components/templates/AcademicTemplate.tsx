import React from 'react';
import { TemplateProps, Section, ContactInfo } from './BaseTemplate';

export const AcademicTemplate: React.FC<TemplateProps> = ({ data, color }) => {
    const { personal, summary, experience, education, skills, languages, certificates } = data;

    return (
        <div className="p-8 bg-white h-full text-sm font-sans text-gray-800">
            <header className="text-center mb-6 pb-4 border-b">
                <h1 className="text-3xl font-bold tracking-tight">{personal.name}</h1>
                <p className="text-md font-medium text-gray-600">{personal.title}</p>
                <div className="mt-3">
                     <ContactInfo email={personal.email} phone={personal.phone} linkedin={personal.linkedin} github={personal.github} />
                </div>
            </header>

            <Section title="Research Statement" color={color}>
                <p className="text-gray-700 text-justify leading-relaxed">{summary}</p>
            </Section>

            <Section title="Education" color={color}>
                {education.map((edu, i) => (
                    <div key={i} className="flex justify-between items-start mb-2">
                        <div>
                            <h3 className="font-bold text-base">{edu.institution}</h3>
                            <p className="italic text-gray-700 text-sm">{edu.degree}</p>
                        </div>
                        <p className="text-xs text-gray-600 font-medium text-right">{edu.period}</p>
                    </div>
                ))}
            </Section>
            
            <Section title="Research Experience" color={color}>
                <div className="space-y-4">
                    {experience.map((exp, i) => (
                        <div key={i}>
                            <div className="flex justify-between items-baseline">
                                <h3 className="font-bold text-base">{exp.role}</h3>
                                <p className="text-xs text-gray-600 font-medium">{exp.period}</p>
                            </div>
                            <p className="italic text-gray-700 text-sm mb-1">{exp.company}</p>
                            <p className="text-gray-700 text-xs leading-normal whitespace-pre-wrap">{exp.description}</p>
                        </div>
                    ))}
                </div>
            </Section>

            <Section title="Skills & Methods" color={color}>
                <div className="text-gray-700 leading-relaxed">
                    {skills.map((skill, i) => (
                        <span key={i} className="inline-block after:content-['•'] after:mx-2 last:after:content-['']">
                        {skill.name}
                        </span>
                    ))}
                </div>
            </Section>

            {languages && languages.length > 0 && (
                <Section title="Languages" color={color}>
                    <div className="text-gray-700 leading-relaxed">
                        {languages.map((lang, i) => (
                            <span key={i} className="inline-block after:content-['•'] after:mx-2 last:after:content-['']">
                                <span className="font-semibold">{lang.language}:</span> {lang.proficiency}
                            </span>
                        ))}
                    </div>
                </Section>
            )}

            {certificates && certificates.length > 0 && (
                <Section title="Certificates" color={color}>
                    {certificates.map((cert, i) => (
                         <div key={i} className="mb-1">
                            <h3 className="font-bold text-base inline">{cert.name} </h3>
                            <p className="inline text-gray-700">- {cert.issuer}, {cert.date}</p>
                        </div>
                    ))}
                </Section>
            )}
        </div>
    );
};