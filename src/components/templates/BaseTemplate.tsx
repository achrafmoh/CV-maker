import React from 'react';
import { CVData } from '../../types';

export interface TemplateProps {
    data: CVData;
    color: string;
    font: string;
}

export const Section: React.FC<{ title: string; children: React.ReactNode; color: string; }> = ({ title, children, color }) => (
    <div className="mb-4">
        <h2 className="text-lg font-bold uppercase tracking-wider border-b-2 pb-1 mb-3" style={{ color, borderColor: color }}>
            {title}
        </h2>
        {children}
    </div>
);


interface ContactInfoProps {
    phone?: string;
    email?: string;
    linkedin?: string;
    github?: string;
    color?: string;
}

const normalizeUrl = (url: string) => {
    if (!url) return '#';
    if (url.startsWith('http://') || url.startsWith('https://')) {
        return url;
    }
    return `https://${url}`;
};


export const ContactInfo: React.FC<ContactInfoProps> = ({ phone, email, linkedin, github, color }) => {
    const items = [
        phone && { type: 'phone', value: phone, href: `tel:${phone.replace(/\s/g, '')}` },
        email && { type: 'email', value: email, href: `mailto:${email}` },
        linkedin && { type: 'linkedin', value: linkedin, href: normalizeUrl(linkedin) },
        github && { type: 'github', value: github, href: normalizeUrl(github) },
    ].filter((item): item is { type: string; value: string; href: string } => !!item);

    return (
        <div className="flex flex-wrap justify-center items-center text-gray-600 text-xs">
            {items.map((item, index) => (
                <React.Fragment key={item.type}>
                    <a href={item.href} target="_blank" rel="noopener noreferrer" className="hover:underline" style={{ color: item.type === 'email' ? color : 'inherit' }}>
                        {item.value}
                    </a>
                    {index < items.length - 1 && <span className="mx-2 text-gray-400 select-none">|</span>}
                </React.Fragment>
            ))}
        </div>
    );
};