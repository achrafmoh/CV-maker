import React, { useState } from 'react';
import { CVData, ATSResult } from '../types';
import { analyzeATS } from '../services/geminiService';

interface ATSTestPanelProps {
    cvData: CVData;
    result: ATSResult | null;
    setResult: (result: ATSResult | null) => void;
    isTesting: boolean;
    setIsTesting: (isTesting: boolean) => void;
}

export const ATSTestPanel: React.FC<ATSTestPanelProps> = ({ cvData, result, setResult, isTesting, setIsTesting }) => {
    const [jobDescription, setJobDescription] = useState('');
    const [error, setError] = useState<string | null>(null);

    const handleAnalyze = async () => {
        if (!jobDescription.trim()) {
            setError("Please paste a job description first.");
            return;
        }
        setError(null);
        setResult(null);
        setIsTesting(true);
        try {
            const analysisResult = await analyzeATS(cvData, jobDescription);
            setResult(analysisResult);
        } catch (err: any) {
            setError(err.message || "An unknown error occurred.");
        } finally {
            setIsTesting(false);
        }
    };
    
    return (
        <div className="p-4">
            <div className="space-y-4">
                <div>
                    <label htmlFor="job-description" className="block text-sm font-medium text-slate-300 mb-1">
                        Paste Job Description
                    </label>
                    <textarea
                        id="job-description"
                        rows={8}
                        className="w-full p-2 bg-slate-900 border border-slate-600 rounded-md text-sm text-slate-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none resize-y"
                        value={jobDescription}
                        onChange={(e) => setJobDescription(e.target.value)}
                        placeholder="Paste the full job description here..."
                    />
                </div>
                <button
                    onClick={handleAnalyze}
                    disabled={isTesting}
                    className="w-full bg-blue-600 text-white font-bold py-2 px-4 rounded-md hover:bg-blue-700 transition duration-300 shadow-lg disabled:bg-slate-500 disabled:cursor-not-allowed flex items-center justify-center"
                >
                    {isTesting ? (
                        <>
                            <svg className="animate-spin -ms-1 me-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                            Analyzing...
                        </>
                    ) : "Run ATS Analysis"}
                </button>

                    {error && <p className="text-sm text-red-400">{error}</p>}
            </div>
            
            {result && (
                <div className="mt-6 space-y-4">
                    <h3 className="text-lg font-bold">Analysis Results</h3>
                    <div className="p-4 bg-slate-700/50 rounded-lg">
                        <p className="text-sm text-slate-300">Compatibility Score</p>
                        <p className="text-3xl font-bold" style={{color: result.score > 75 ? '#4ade80' : result.score > 50 ? '#facc15' : '#f87171'}}>{result.score}%</p>
                    </div>
                    <div>
                            <h4 className="font-semibold mb-2">Suggestions for Improvement</h4>
                            <ul className="list-disc list-inside ps-5 text-sm space-y-1 text-slate-300">
                                {result.suggestions.map((s, i) => <li key={i}>{s}</li>)}
                            </ul>
                    </div>
                        <div>
                            <h4 className="font-semibold mb-2">Keyword Analysis</h4>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <p className="text-sm text-green-400 font-medium">Matched Keywords</p>
                                    <div className="flex flex-wrap gap-1 mt-1">
                                    {result.keywordMatch.matched.map((k, i) => <span key={i} className="text-xs bg-green-500/20 text-green-300 px-2 py-0.5 rounded-full">{k}</span>)}
                                    </div>
                                </div>
                                <div>
                                    <p className="text-sm text-yellow-400 font-medium">Missing Keywords</p>
                                    <div className="flex flex-wrap gap-1 mt-1">
                                    {result.keywordMatch.missing.map((k, i) => <span key={i} className="text-xs bg-yellow-500/20 text-yellow-300 px-2 py-0.5 rounded-full">{k}</span>)}
                                    </div>
                                </div>
                            </div>
                    </div>
                </div>
            )}

        </div>
    );
};