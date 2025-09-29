import React from 'react';

export interface PersonalInfo {
    name: string;
    title: string;
    phone: string;
    email: string;
    linkedin: string;
    github?: string;
}

export interface Experience {
    role: string;
    company: string;
    period: string;
    description: string;
}

export interface Education {
    institution: string;
    degree: string;
    period: string;
}

export interface Skill {
    name: string;
    level: 'Beginner' | 'Intermediate' | 'Advanced' | 'Expert';
}

export interface Language {
    language: string;
    proficiency: string;
}

export interface Certificate {
    name: string;
    issuer: string;
    date: string;
}

export interface CVData {
    personal: PersonalInfo;
    summary: string;
    experience: Experience[];
    education: Education[];
    skills: Skill[];
    languages: Language[];
    certificates: Certificate[];
}

export type TemplateId = 'classic' | 'timeline-accent' | 'minimalist' | 'two-column' | 'executive' | 'tech' | 'academic' | 'corporate';

export interface Template {
    id: TemplateId;
    name: string;
    component: React.FC<{ 
        data: CVData; 
        color: string; 
        font: string;
    }>;
}

export interface ColorPalette {
    name: string;
    primary: string;
    background: string;
}

export interface FontPairing {
    name:string;
    heading: string;
    body: string;
}

export interface ATSResult {
    score: number;
    suggestions: string[];
    keywordMatch: {
        matched: string[];
        missing: string[];
    }
}