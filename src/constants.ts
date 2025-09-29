import React from 'react';
import { CVData, TemplateId } from './types';
import { ClassicTemplate } from './components/templates/ClassicTemplate';
import { TimelineAccentTemplate } from './components/templates/TimelineAccentTemplate';
import { MinimalistTemplate } from './components/templates/MinimalistTemplate';
import { CompactTwoColumnTemplate } from './components/templates/CompactTwoColumnTemplate';
import { ExecutiveTemplate } from './components/templates/ExecutiveTemplate';
import { TechFocusedTemplate } from './components/templates/TechFocusedTemplate';
import { AcademicTemplate } from './components/templates/AcademicTemplate';
import { CorporateTemplate } from './components/templates/CorporateTemplate';

export const DEFAULT_CV_DATA: CVData = {
    personal: {
        name: 'Your Name',
        title: 'Your Professional Title',
        phone: '(555) 123-4567',
        email: 'your.email@example.com',
        linkedin: 'linkedin.com/in/yourprofile',
        github: '',
    },
    summary: 'A brief summary of your professional background, skills, and career goals. Use the AI tools below to refine this text.',
    experience: [
        {
            role: 'Job Title',
            company: 'Company Name',
            period: 'Date - Date',
            description: 'Your responsibilities and key achievements will appear here. Use the AI tools below to refine this text.'
        }
    ],
    education: [
        {
            institution: 'University Name',
            degree: 'Degree and Major',
            period: 'Date - Date'
        }
    ],
    skills: [
        { name: 'Core Skill 1', level: 'Expert' },
        { name: 'Core Skill 2', level: 'Advanced' },
        { name: 'Technical Skill', level: 'Intermediate' }
    ],
    languages: [
        { language: 'Language Name', proficiency: 'e.g., Native, Fluent, Professional' }
    ],
    certificates: [
        { name: 'Certificate Name', issuer: 'Issuing Organization', date: 'Date' }
    ]
};

export const EMPTY_CV_DATA: CVData = {
    personal: {
        name: '',
        title: '',
        phone: '',
        email: '',
        linkedin: '',
        github: '',
    },
    summary: '',
    experience: [],
    education: [],
    skills: [],
    languages: [],
    certificates: [],
};

export const TEMPLATES: Record<TemplateId, { name: string; description: string; component: React.FC<any> }> = {
    classic: { name: "Classic", description: "A timeless, single-column format ideal for any industry.", component: ClassicTemplate },
    'timeline-accent': { name: "Timeline Accent", description: "A creative, ATS-friendly layout with a timeline motif.", component: TimelineAccentTemplate },
    minimalist: { name: "Minimalist", description: "Clean, simple, and elegantly text-focused.", component: MinimalistTemplate },
    'two-column': { name: "Compact Two-Column", description: "Efficiently organizes content, perfect for dense information.", component: CompactTwoColumnTemplate },
    executive: { name: "Executive", description: "A professional and bold design for leadership roles.", component: ExecutiveTemplate },
    tech: { name: "Modern Column", description: "Info-dense and scannable, perfect for skill-heavy roles.", component: TechFocusedTemplate },
    academic: { name: "Academic", description: "Structured for publications, research, and grants.", component: AcademicTemplate },
    corporate: { name: "Corporate", description: "A sleek and highly professional look for corporate roles.", component: CorporateTemplate },
};


export const COLOR_PALETTES: { name: string; color: string }[] = [
    { name: 'Slate', color: '#475569' },
    { name: 'Blue', color: '#2563eb' },
    { name: 'Red', color: '#dc2626' },
    { name: 'Green', color: '#16a34a' },
    { name: 'Purple', color: '#7c3aed' },
    { name: 'Teal', color: '#0d9488' },
    { name: 'Orange', color: '#ea580c' },
    { name: 'Indigo', color: '#4f46e5' },
];

export const FONT_PAIRINGS: { name: string; className: string; description: string }[] = [
    { name: 'Inter', description: 'Modern & Clean', className: 'font-sans' },
    { name: 'Lora / Inter', description: 'Classic & Readable', className: 'font-serif-body-sans' },
    { name: 'Source Code Pro', description: 'Technical & Sharp', className: 'font-mono' },
];