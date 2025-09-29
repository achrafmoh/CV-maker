import React, { useState } from 'react';
import { CVData } from '../types';

// Type declarations for CDN libraries
declare global {
  interface Window {
    html2canvas: any;
    jspdf: any;
  }
}

interface ExportModalProps {
    isOpen: boolean;
    onClose: () => void;
    cvData: CVData;
}

export const ExportModal: React.FC<ExportModalProps> = ({ isOpen, onClose, cvData }) => {
    const [isLoading, setIsLoading] = useState<boolean>(false);

    if (!isOpen) return null;

    const handleDownloadPdf = async () => {
        setIsLoading(true);
        try {
            // Wait a bit to ensure CDN scripts are loaded
            await new Promise(resolve => setTimeout(resolve, 100));
            
            const cvElement = document.getElementById('cv-print-area');
            if (!cvElement) {
                throw new Error('CV element not found. Cannot generate PDF.');
            }

            // Check if html2canvas is available
            if (!window.html2canvas) {
                throw new Error('PDF generation library not loaded. Please refresh and try again.');
            }

            const canvas = await window.html2canvas(cvElement, {
                scale: 2,
                useCORS: true,
                logging: false,
                backgroundColor: '#ffffff'
            });

            const imgData = canvas.toDataURL('image/png');
            
            // Check if jsPDF is available
            if (!window.jspdf) {
                throw new Error('PDF generation library not loaded. Please refresh and try again.');
            }

            const { jsPDF } = window.jspdf;
            const pdf = new jsPDF({
                orientation: 'portrait',
                unit: 'mm',
                format: 'a4',
            });

            const pdfWidth = pdf.internal.pageSize.getWidth();
            const imgHeight = (canvas.height * pdfWidth) / canvas.width;

            pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, imgHeight);
            
            const fileName = `${cvData.personal.name?.replace(/\s+/g, '_') || 'CV'}.pdf`;
            pdf.save(fileName);

        } catch (error: any) {
            console.error("Error generating PDF file:", error);
            alert(`An error occurred while generating the PDF: ${error.message}`);
        } finally {
            setTimeout(() => {
                setIsLoading(false);
                onClose();
            }, 500);
        }
    };

    return (
        <div 
            className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center p-4 transition-opacity" 
            onClick={onClose}
            role="dialog"
            aria-modal="true"
            aria-labelledby="export-title"
        >
            <div 
                className="bg-slate-800 rounded-lg shadow-2xl w-full max-w-md p-6 transform transition-all" 
                onClick={(e) => e.stopPropagation()}
            >
                <div className="flex justify-between items-center mb-4">
                    <h2 id="export-title" className="text-2xl font-bold text-white">Download CV</h2>
                    <button onClick={onClose} className="text-slate-400 hover:text-white" aria-label="Close">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>

                <p className="text-slate-400 text-sm mb-6">
                    Download a high-quality PDF of your CV that perfectly preserves the visual design.
                </p>
                
                <div className="space-y-3">
                    <button 
                        onClick={handleDownloadPdf} 
                        disabled={isLoading}
                        className="w-full bg-blue-600 text-white font-bold py-3 px-4 rounded-lg hover:bg-blue-700 transition duration-300 shadow-lg flex items-center justify-center disabled:opacity-50"
                        aria-label="Download as PDF"
                    >
                         {isLoading ? (
                             <>
                                <svg className="animate-spin h-5 w-5 me-2" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                </svg>
                                <span>Generating...</span>
                             </>
                        ) : (
                            <>
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 me-2" viewBox="0 0 20 20" fill="currentColor">
                                    <path fillRule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z" clipRule="evenodd" />
                                </svg>
                                <span>Download as PDF</span>
                            </>
                        )}
                    </button>
                </div>
            </div>
        </div>
    );
};