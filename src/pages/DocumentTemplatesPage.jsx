import React, { useState } from 'react';
import { GOOGLE_AI_API_KEY } from '../config'; // Still used directly on frontend for AI calls
import { DataStore } from '@aws-amplify/datastore'; // Import DataStore for userData updates
import { UserProfile } from '../models/index.js'; // Import UserProfile model
import { ChevronDownIcon, XIcon, SaveIcon, PrinterIcon, Edit3Icon, Trash2Icon } from '../icons';

// --- Self-contained UI Components to prevent external dependency errors ---
const LockIcon = (props) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
        <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
        <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
    </svg>
);

const Button = ({ children, onClick, disabled, title, variant = 'primary', className = '' }) => {
    const baseStyles = "inline-flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2 transition-colors";
    const variantStyles = {
        primary: 'text-white bg-[#c62727] hover:bg-[#a52020] focus:ring-[#c62727]',
        secondary: 'text-slate-700 bg-slate-200 hover:bg-slate-300 focus:ring-slate-500 dark:bg-slate-600 dark:text-slate-100 dark:hover:bg-slate-500',
        green: 'text-white bg-green-600 hover:bg-green-700 focus:ring-green-500',
    };
    const disabledStyles = "opacity-50 cursor-not-allowed";

    return (
        <button
            onClick={onClick}
            disabled={disabled}
            title={title}
            className={`${baseStyles} ${variantStyles[variant]} ${disabled ? disabledStyles : ''} ${className}`}
        >
            {children}
        </button>
    );
};

const DocumentGuide = () => {
    return (
        <div className="bg-blue-50 dark:bg-blue-900/40 border-l-4 border-blue-400 dark:border-blue-600 p-6 rounded-r-lg mb-6">
            <h2 className="text-2xl font-bold text-blue-900 dark:text-blue-200 mb-3">A Guide to Your VA Claim Documents</h2>
            <p className="text-blue-800 dark:text-blue-300 mb-4 leading-relaxed">
                The VA makes decisions based on evidence. These documents are your tools to provide clear, compelling, and structured evidence to the VA rater. Using the right document for the right purpose helps paint a complete picture of your condition, its origins, and its impact on your life. Submitting well-written, specific documentation can significantly improve your chances of a successful outcome.
            </p>
            <div className="space-y-3 text-sm">
                <p className="font-semibold text-blue-900 dark:text-blue-200">When to use each template:</p>
                <ul className="list-disc list-outside space-y-2 pl-5 text-blue-700 dark:text-blue-300/80">
                    <li><strong>Personal Statement:</strong> Use for almost every claim. This is your story in your own words. Explain how the condition started, how the symptoms affect your work, social life, and daily activities.</li>
                    <li><strong>Buddy/Lay Statement:</strong> Use to provide firsthand witness accounts of your condition. Ask a spouse, friend, or fellow service member who has witnessed your struggles to fill this out.</li>
                    <li><strong>Nexus Letter:</strong> A powerful document from a medical professional linking your condition to your service.</li>
                </ul>
            </div>
        </div>
    );
};


export default function DocumentTemplatesPage({ userData, setUserData = () => {}, setPage = () => {} }) {
    const { claimPackage = [], symptomLogs = {}, savedDocuments = [] } = userData || {};
    const isPro = userData?.membershipStatus === 'Pro'; // Access membershipStatus directly from UserProfile

    const [activeModal, setActiveModal] = useState({ isOpen: false, mode: 'new', templateId: null, conditionName: null, documentId: null });
    const [generatedContent, setGeneratedContent] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');
    
    const [openAccordion, setOpenAccordion] = useState(() => {
        if (Array.isArray(claimPackage) && claimPackage.length > 0 && claimPackage[0] && typeof claimPackage[0].name === 'string') {
            return claimPackage[0].name;
        }
        return null;
    });

    const templates = [
        { id: 'personal', title: 'Personal Statement', description: 'Your own detailed account of your condition and its impact.' },
        { id: 'nexus', title: 'Nexus Letter', description: 'A letter from a medical professional linking your condition to your service.' },
        { id: 'buddy', title: 'Buddy/Lay Statement', description: 'A statement from someone who knows you, supporting your claim.' },
        { id: 'claimStatement', title: 'VA Claim Statement (Short Form)', description: 'A concise statement for VA Form 21-4138.' },
        { id: 'adl', title: 'Activities of Daily Living (ADLs)', description: 'Describes how your condition affects daily tasks.' },
        { id: 'secondary', title: 'Secondary Condition Statement', description: 'Explains how one condition caused another.' },
        { id: 'reconsideration', title: 'Higher-Level Review Request', description: 'Challenge a low rating or denial.' },
        { id: 'appealCover', title: 'Appeal Cover Letter', description: 'A cover letter for a Notice of Disagreement.' },
        { id: 'workImpact', title: 'Work Impact Statement', description: 'Details how your condition affects your job performance.' },
        { id: 'tdiu', title: 'TDIU Support Statement', description: 'Supports a claim for Total Disability based on Individual Unemployability.' },
    ];

    const handleOpenModal = (mode, conditionName, templateId, document = null) => {
        setActiveModal({ isOpen: true, mode, conditionName, templateId, documentId: document ? document.id : null });
        setError('');
        if (mode === 'edit') {
            setGeneratedContent(document.content);
            setIsLoading(false);
        } else {
            setGeneratedContent('');
            setIsLoading(true);
            handleGenerateTemplate(templateId, conditionName);
        }
    };

    const handleCloseModal = () => {
        setActiveModal({ isOpen: false, mode: 'new', templateId: null, conditionName: null, documentId: null });
        setGeneratedContent('');
        setError('');
    };

    const getAIPrompt = (templateId, conditionName) => {
        const conditionData = (claimPackage || []).find(c => c && c.name === conditionName); // Add null check
        if (!conditionData) return "Error: Condition data not found.";
        
        const logs = symptomLogs[conditionName] || [];
        const logSummary = logs.length > 0 ? `The user has logged the following symptoms for ${conditionName}: ${logs.map(l => `${l.date}: Severity ${l.severity}/10, Impact: ${l.impact || 'N/A'}, Notes: ${l.notes || 'N/A'}`).join('; ')}` : `The user has not logged specific symptoms for ${conditionName} yet.`; // Add null checks
        
        const notes = conditionData.notes || {};
        const notesSummary = `The user has written the following notes for this claim: In-service event: ${notes.inServiceEvent || 'N/A'}. Current Symptoms: ${notes.symptoms || 'N/A'}. Work Impact: ${notes.workImpact || 'N/A'}. Personal Life Impact: ${notes.personalImpact || 'N/A'}.`;
        
        const basePrompt = `You are an expert AI assistant creating VA claim support documents. Generate a professional, well-structured document for a veteran claiming "${conditionName}". Use the following personalized data to pre-fill the document with specific details, creating a near-complete draft: - Symptom Data: ${logSummary} - Claim Notes: ${notesSummary}. Use placeholders like [Veteran's Name] or [Date] only for information not provided. CRITICAL: Do not use any markdown formatting. Use all caps for headings (e.g., 'I. VETERAN IDENTIFICATION').`;

        switch(templateId) {
            case 'nexus': return `${basePrompt} Generate a draft Nexus Letter for a medical professional to review and sign...`;
            case 'buddy': return `${basePrompt} Generate a draft Buddy/Lay Statement (for VA Form 21-10210)...`;
            case 'personal': return `${basePrompt} Generate a draft Personal Statement (for VA Form 21-4138)...`;
            case 'claimStatement': return `${basePrompt} Generate a concise VA Claim Statement for VA Form 21-4138...`;
            case 'adl': return `${basePrompt} Generate an Activities of Daily Living (ADLs) Impact Statement...`;
            case 'secondary': return `${basePrompt} Generate a Secondary Condition Statement...`;
            case 'reconsideration': return `${basePrompt} Generate a draft request for a Higher-Level Review...`;
            case 'appealCover': return `${basePrompt} Generate a formal Appeal Cover Letter for a Notice of Disagreement (NOD)...`;
            case 'workImpact': return `${basePrompt} Generate a detailed Work Impact Statement...`;
            case 'tdiu': return `${basePrompt} Generate a support statement for a TDIU application...`;
            default: return "Please select a template.";
        }
    };

    // --- AMPLIFY MODIFICATION: Direct fetch, or ideally, move this to a Lambda via Amplify API ---
    const handleGenerateTemplate = async (templateId, conditionName) => {
        const prompt = getAIPrompt(templateId, conditionName);
        if (!GOOGLE_AI_API_KEY || GOOGLE_AI_API_KEY.includes("YOUR_GOOGLE")) {
            setError("API Key is missing. Please add your Google AI API key in the config file.");
            setIsLoading(false);
            return;
        }
        const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${GOOGLE_AI_API_KEY}`;
        const payload = { contents: [{ role: "user", parts: [{ text: prompt }] }] };
        try {
            const response = await fetch(apiUrl, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) });
            if (!response.ok) throw new Error(`API Error: ${response.status}`);
            const result = await response.json();
            if (result.candidates && result.candidates.length > 0) {
                const text = result.candidates[0].content.parts[0].text;
                setGeneratedContent(text.replace(/\\n/g, '\n'));
            } else { throw new Error("No content received from AI."); }
        } catch (e) { setError(`Failed to generate template: ${e.message}`);
        } finally { setIsLoading(false); }
    };

    // --- AMPLIFY MODIFICATION: DataStore saves for savedDocuments ---
    const handleSaveDocument = async () => {
        const { mode, documentId, conditionName, templateId } = activeModal;
        const currentDocs = savedDocuments || [];
        
        let updatedDocuments;
        if (mode === 'edit') {
            updatedDocuments = currentDocs.map(doc => doc.id === documentId ? { ...doc, content: generatedContent } : doc);
        } else {
            const existingVersions = currentDocs.filter(doc => doc.conditionName === conditionName && doc.templateId === templateId).length;
            const newDocument = { id: Date.now(), conditionName, templateId, templateTitle: templates.find(t => t.id === templateId)?.title || 'Untitled', content: generatedContent, version: existingVersions + 1, createdAt: new Date().toISOString() };
            updatedDocuments = [...currentDocs, newDocument];
        }

        try {
            await DataStore.save(UserProfile.copyOf(userData, updated => {
                updated.savedDocuments = updatedDocuments; // Assume savedDocuments is AWSJSON
            }));
            handleCloseModal();
        } catch (error) {
            console.error("Error saving document to DataStore:", error);
            setError("Failed to save document: " + error.message);
        }
    };

    // --- AMPLIFY MODIFICATION: DataStore delete for savedDocuments ---
    const handleDeleteDocument = async (docId) => {
        try {
            await DataStore.save(UserProfile.copyOf(userData, updated => {
                updated.savedDocuments = (updated.savedDocuments || []).filter(doc => doc.id !== docId);
            }));
        } catch (error) {
            console.error("Error deleting document from DataStore:", error);
            setError("Failed to delete document: " + error.message);
        }
    };

    const handlePrint = () => {
        const printWindow = window.open('', '_blank');
        printWindow.document.write('<html><head><title>Print Document</title><style>body { font-family: sans-serif; white-space: pre-wrap; }</style></head><body>');
        const content = generatedContent.replace(/\n/g, '<br>');
        printWindow.document.write(`<h2>${templates.find(t => t.id === activeModal.templateId)?.title} for ${activeModal.conditionName}</h2>`);
        printWindow.document.write(`<div>${content}</div>`);
        printWindow.document.write('</body></html>');
        printWindow.document.close();
        printWindow.print();
    };

    if (!Array.isArray(claimPackage) || claimPackage.length === 0) {
        return (
            <div className="font-sans text-center p-10 bg-white dark:bg-slate-900 rounded-lg shadow">
                 <h1 className="text-3xl font-bold text-slate-900 dark:text-white mb-2">Document Generation</h1>
                 <p className="text-slate-500 dark:text-slate-400">Start tracking a condition in the Claim Builder to access document templates here.</p>
            </div>
        );
    }

    return (
        <div className="font-sans">
            <h1 className="text-3xl font-bold text-slate-900 dark:text-white mb-2">Document Generation</h1>
            <p className="text-slate-600 dark:text-slate-400 mb-6">Select a condition to manage saved documents or generate new ones from the templates below.</p>
            <DocumentGuide />
            <div className="space-y-4">
                {claimPackage.filter(condition => condition && typeof condition.name === 'string').map(condition => (
                    <div key={condition.name} className="bg-white dark:bg-slate-900 rounded-lg shadow-md">
                        <button onClick={() => setOpenAccordion(openAccordion === condition.name ? null : condition.name)} className="w-full flex justify-between items-center p-6 text-left">
                            <h2 className="text-xl font-bold text-gray-800 dark:text-slate-100">{condition.name}</h2>
                            <ChevronDownIcon className={`transition-transform duration-300 dark:text-slate-400 ${openAccordion === condition.name ? 'rotate-180' : ''}`} />
                        </button>
                        {openAccordion === condition.name && (
                            <div className="p-6 border-t border-gray-200 dark:border-slate-700">
                                <div className="mb-6">
                                    <h3 className="font-bold text-lg text-slate-800 dark:text-slate-200 mb-3">Saved Documents</h3>
                                    {(savedDocuments || []).filter(d => d && d.conditionName === condition.name).length > 0 ? (
                                        <div className="space-y-2">
                                            {(savedDocuments || []).filter(d => d && d.conditionName === condition.name).map(doc => (
                                                <div key={doc.id} className="flex items-center justify-between p-3 bg-slate-50 dark:bg-slate-800 rounded-md border dark:border-slate-700">
                                                    <p className="font-semibold text-slate-700 dark:text-slate-300">{doc.templateTitle} V{doc.version}</p>
                                                    <div className="flex items-center gap-2">
                                                        <button onClick={() => handleOpenModal('edit', doc.conditionName, doc.templateId, doc)} className="p-2 text-slate-500 hover:text-blue-600 dark:text-slate-400 dark:hover:text-blue-400"><Edit3Icon className="w-4 h-4"/></button>
                                                        <button onClick={() => handleDeleteDocument(doc.id)} className="p-2 text-slate-500 hover:text-red-600 dark:text-slate-400 dark:hover:text-red-400"><Trash2Icon className="w-4 h-4"/></button>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    ) : <p className="text-sm text-slate-500 dark:text-slate-400">No documents saved for this condition yet.</p>}
                                </div>
                                <div>
                                    <h3 className="font-bold text-lg text-slate-800 dark:text-slate-200 mb-4">Generate New Template</h3>
                                    <div className="space-y-3">
                                        {templates.map(template => {
                                            const isSecondaryClaim = condition.type === 'Secondary';
                                            const isDisabled = template.id === 'secondary' && !isSecondaryClaim;
                                            const canGenerate = isPro || template.id === 'personal';

                                            return (
                                                <div key={template.id} className={`flex items-center justify-between p-4 rounded-lg ${isDisabled ? 'bg-gray-100 dark:bg-slate-800' : 'bg-slate-50 dark:bg-slate-800 border dark:border-slate-700'}`}>
                                                    <div>
                                                        <h4 className={`font-bold text-slate-800 dark:text-slate-200 ${isDisabled ? 'text-gray-400 dark:text-slate-500' : ''}`}>{template.title}</h4>
                                                        <p className={`text-sm mt-1 max-w-md ${isDisabled ? 'text-gray-400 dark:text-slate-500' : 'text-slate-600 dark:text-slate-400'}`}>{template.description}</p>
                                                    </div>
                                                    <div className="ml-4 flex-shrink-0">
                                                        {canGenerate ? (
                                                            <Button 
                                                                onClick={() => handleOpenModal('new', condition.name, template.id)} 
                                                                disabled={isDisabled} 
                                                                title={isDisabled ? "This template is only for secondary conditions." : "Generate this template"}
                                                            >
                                                                Generate
                                                            </Button>
                                                        ) : (
                                                            <Button 
                                                                onClick={() => setPage('membership')}
                                                                variant="secondary"
                                                                title="Upgrade to Pro to generate this document"
                                                            >
                                                                <LockIcon className="w-4 h-4 mr-2" />
                                                                Upgrade to Pro
                                                            </Button>
                                                        )}
                                                    </div>
                                                </div>
                                            );
                                        })}
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                ))}
            </div>

            {activeModal.isOpen && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white dark:bg-slate-900 rounded-lg shadow-2xl w-full max-w-4xl h-[90vh] flex flex-col">
                        <div className="p-6 border-b dark:border-slate-700 flex justify-between items-center flex-shrink-0">
                            <div><h2 className="text-2xl font-bold text-slate-800 dark:text-slate-100">{templates.find(t => t.id === activeModal.templateId)?.title}</h2><p className="text-sm text-slate-500 dark:text-slate-400">For Condition: {activeModal.conditionName}</p></div>
                            <button onClick={handleCloseModal} className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-slate-700"><XIcon className="w-6 h-6 dark:text-slate-300" /></button>
                        </div>
                        <div className="p-6 overflow-y-auto flex-grow">
                            {isLoading ? <div className="flex items-center justify-center h-full"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#002458]"></div></div> :
                            error ? <p className="text-red-500 text-sm">{error}</p> :
                            <textarea value={generatedContent} onChange={(e) => setGeneratedContent(e.target.value)} className="w-full h-full p-3 border border-gray-300 rounded-md text-sm font-mono bg-gray-50 dark:bg-slate-800 dark:border-slate-700 dark:text-slate-300 resize-none" placeholder="Generated template will appear here..." />}
                        </div>
                        <div className="p-4 bg-gray-50 dark:bg-slate-800 border-t dark:border-slate-700 flex justify-end space-x-4 flex-shrink-0">
                            <Button onClick={handleSaveDocument} disabled={!generatedContent || isLoading}><SaveIcon className="w-5 h-5 mr-2"/> Save</Button>
                            <Button onClick={handlePrint} disabled={!generatedContent} variant="green"><PrinterIcon className="w-5 h-5 mr-2"/> Print</Button>
                            <Button onClick={handleCloseModal} variant="secondary">Close</Button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}