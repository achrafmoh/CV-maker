import React from 'react';
import { CVData } from '../../types';
import { ContactInfo } from './BaseTemplate';

interface TemplateProps {
    data: CVData;
    color: string;
    font: string;
}

const CustomSection: React.FC<{ title: string; children: React.ReactNode; color: string; className?: string }> = ({ title, children, color, className = '' }) => (
    <div className={`mb-6 ${className}`}>
        <h2 className="text-lg font-bold uppercase tracking-wider mb-4 border-b pb-1" style={{ color, borderColor: `${color}40` }}>
            {title}
        </h2>
        {children}
    </div>
);

const TimelineItem: React.FC<{ period: string; title: string; subtitle: string; description: string; color: string; isLast: boolean; }> = ({ period, title, subtitle, description, color, isLast }) => {
    return (
        <div className="relative pl-8">
            {!isLast && <div className="absolute left-[5px] top-5 h-full w-px bg-gray-200"></div>}
            
            <div 
                className="absolute left-0 top-1.5 h-3 w-3 rounded-full border-2 border-white ring-2 ring-gray-200"
                style={{ backgroundColor: color }}
            ></div>
            
            <p className="absolute left-[-80px] top-1 text-xs font-semibold text-gray-500 w-[70px] text-right">{period}</p>
            <div className="pb-6">
                <h3 className="font-bold text-base">{title}</h3>
                <p className="italic text-gray-700 text-sm mb-1">{subtitle}</p>
                <p className="text-gray-700 text-xs leading-normal whitespace-pre-wrap">{description}</p>
            </div>
        </div>
    );
};

export const TimelineAccentTemplate: React.FC<TemplateProps> = ({ data, color }) => {
    const { personal, summary, experience, education, skills, languages, certificates } = data;

    return (
        <div className="p-10 bg-white h-full text-sm font-sans text-gray-800">
            <header className="text-center mb-8">
                <h1 className="text-4xl font-bold tracking-tight">{personal.name}</h1>
                <p className="text-lg font-medium" style={{ color }}>{personal.title}</p>
                <div className="mt-3">
                    <ContactInfo {...personal} />
                </div>
            </header>

            <CustomSection title="Summary" color={color}>
                <p className="text-gray-700 text-justify leading-relaxed">{summary}</p>
            </CustomSection>

            {experience.length > 0 &&
                <CustomSection title="Experience" color={color} className="ml-20">
                    <div className="relative">
                        {experience.map((exp, i) => (
                            <TimelineItem
                                key={i}
                                period={exp.period}
                                title={exp.role}
                                subtitle={exp.company}
                                description={exp.description}
                                color={color}
                                isLast={i === experience.length - 1}
                            />
                        ))}
                    </div>
                </CustomSection>
            }

            {education.length > 0 &&
                 <CustomSection title="Education" color={color} className="ml-20">
                    <div className="relative">
                        {education.map((edu, i) => (
                             <div className="relative pl-8" key={i}>
                                {!(i === education.length - 1) && <div className="absolute left-[5px] top-5 h-full w-px bg-gray-200"></div>}
                                <div className="absolute left-0 top-1.5 h-3 w-3 rounded-full border-2 border-white ring-2 ring-gray-200" style={{ backgroundColor: color }}></div>
                                <p className="absolute left-[-80px] top-1 text-xs font-semibold text-gray-500 w-[70px] text-right">{edu.period}</p>
                                <div className="pb-6">
                                    <h3 className="font-bold text-base">{edu.institution}</h3>
                                    <p className="italic text-gray-700 text-sm">{edu.degree}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </CustomSection>
            }
           
            {skills.length > 0 &&
                <CustomSection title="Skills" color={color}>
                    <p className="text-gray-700 leading-relaxed text-sm">
                        {skills.map(s => s.name).join(' • ')}
                    </p>
                </CustomSection>
            }
            
            {(languages.length > 0 || certificates.length > 0) && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8">
                     {languages.length > 0 && (
                        <CustomSection title="Languages" color={color}>
                            <div className="flex flex-col space-y-1">
                                {languages.map((lang, i) => (
                                    <div key={i} className="text-xs flex justify-between">
                                        <span className="font-semibold">{lang.language}</span>
                                        <span className="text-gray-600">{lang.proficiency}</span>
                                    </div>
                                ))}
                            </div>
                        </CustomSection>
                    )}

                    {certificates.length > 0 && (
                        <CustomSection title="Certificates" color={color}>
                             <div className="flex flex-col space-y-2">
                                {certificates.map((cert, i) => (
                                    <div key={i} className="text-xs">
                                        <h3 className="font-bold">{cert.name}</h3>
                                        <p className="text-gray-600">{cert.issuer}, {cert.date}</p>
                                    </div>
                                ))}
                            </div>
                        </CustomSection>
                    )}
                </div>
            )}
        </div>
    );
};