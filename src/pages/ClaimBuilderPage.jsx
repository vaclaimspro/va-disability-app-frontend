import React, { useState } from 'react';
import { GOOGLE_AI_API_KEY } from '../config'; // Still used directly on frontend for AI calls
import { DataStore } from '@aws-amplify/datastore'; // Import DataStore
import { UserProfile } from '../models/index.js'; // Import UserProfile model
import { ChevronDownIcon, Trash2Icon } from '../icons';

const Instructions = () => {
    return (
        <div className="bg-blue-50 dark:bg-blue-900/40 border-l-4 border-blue-400 dark:border-blue-600 p-4 rounded-r-lg my-6 text-sm">
            <h2 className="font-bold text-lg text-blue-900 dark:text-blue-200 mb-2">How to Build Your Claim Package</h2>
            <ol className="list-decimal list-inside space-y-2 text-blue-800 dark:text-blue-300">
                <li>
                    <strong>Start Strong:</strong> Begin by adding potential claims from the "Conditions Overview" page. Use the "Add to Builder" button for any condition you plan to file.
                </li>
                <li>
                    <strong>Be Thorough:</strong> For each claim below, provide detailed answers to all questions. This information is critical, as it will be used to automatically generate your claim templates on the "Document Generation" page.
                </li>
                <li>
                    <strong>Review the Criteria:</strong> Understanding the official "VA Rating Criteria" for each condition helps you build a stronger case. You can find this information on the "Conditions Overview" page for your existing disabilities.
                </li>
            </ol>
        </div>
    );
};

const ClaimStatusBadge = ({ status }) => {
    const statusStyles = {
        'Tracking': 'bg-gray-200 text-gray-800 dark:bg-slate-700 dark:text-slate-300',
        'Submitted': 'bg-blue-200 text-blue-800 dark:bg-blue-900/50 dark:text-blue-300',
        'Pending Review': 'bg-yellow-200 text-yellow-800 dark:bg-yellow-900/50 dark:text-yellow-300',
        'C&P Scheduled': 'bg-indigo-200 text-indigo-800 dark:bg-indigo-900/50 dark:text-indigo-300',
        'C&P Completed': 'bg-purple-200 text-purple-800 dark:bg-purple-900/50 dark:text-purple-300',
        'Denied': 'bg-red-200 text-red-800 dark:bg-red-900/50 dark:text-red-300',
        'Approved': 'bg-green-200 text-green-800 dark:bg-green-900/50 dark:text-green-300',
        'Appeal in Progress': 'bg-orange-200 text-orange-800 dark:bg-orange-900/50 dark:text-orange-300',
    };
    return <span className={`text-xs font-bold px-2.5 py-1 rounded-full ${statusStyles[status] || 'bg-gray-200 text-gray-800'}`}>{status}</span>;
};

const TrackedClaimItem = ({ claim, onRemoveClaim, onStatusChange, onRatingChange, onNoteChange, claimStatuses, userData }) => { // Pass userData
    const [isOpen, setIsOpen] = useState(false);
    const [details, setDetails] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);

    const handleToggle = () => {
        const newOpenState = !isOpen;
        setIsOpen(newOpenState);
        if (newOpenState && !details) {
            handleFetchDetails();
        }
    };

    const handleFetchDetails = async () => {
        setIsLoading(true);
        setError(null);
        // --- AMPLIFY MODIFICATION: Ensure API Key is available ---
        if (!GOOGLE_AI_API_KEY || GOOGLE_AI_API_KEY.includes("YOUR_GOOGLE")) {
            setError("API Key is missing. Please add your Google AI API key.");
            setIsLoading(false);
            return;
        }
        const prompt = `You are an expert AI assistant for VA claims. For the condition "${claim.name}", provide a detailed, veteran-friendly description and the official VA rating criteria for all possible percentages. Format the response as a single, valid JSON object with two keys: "description" and "ratingCriteria". "description" should be a string. "ratingCriteria" should be an array of objects, where each object has two keys: "rating" (a string like "10%") and "criteria" (a string explaining the official criteria). Do not include any text outside the final JSON object.`;
        const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${GOOGLE_AI_API_KEY}`;
        const payload = { contents: [{ role: "user", parts: [{ text: prompt }] }], generationConfig: { responseMimeType: "application/json" } };
        
        try {
            const response = await fetch(apiUrl, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) });
            if (!response.ok) throw new Error(`API Error: ${response.status}`);
            const result = await response.json();
            if (result.candidates && result.candidates.length > 0) {
                const parsedJson = JSON.parse(result.candidates[0].content.parts[0].text);
                setDetails(parsedJson);
            } else { throw new Error("No content received from AI."); }
        } catch (e) {
            setError(`Failed to get details: ${e.message}`);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="bg-slate-50 dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700">
            <div className="flex items-center p-4 cursor-pointer" onClick={handleToggle}>
                <div className="flex-1">
                    <p className="font-bold text-slate-800 dark:text-slate-100">{claim.name}</p>
                    <p className="text-sm text-slate-500 dark:text-slate-400">{claim.type === 'Primary' ? 'Primary Condition' : claim.type === 'Presumptive' ? `Presumptive (${claim.act})` : `Secondary to ${claim.primary}`}</p>
                </div>
                <div className="mx-4">
                     <ClaimStatusBadge status={claim.status} />
                </div>
                <ChevronDownIcon className={`transition-transform duration-300 dark:text-slate-400 ${isOpen ? 'rotate-180' : ''}`} />
            </div>

            {isOpen && (
                <div className="p-4 border-t border-slate-200 dark:border-slate-700 space-y-4">
                    <div>
                        <label className="text-sm font-medium text-gray-700 dark:text-slate-300 block mb-1">Update Status</label>
                        <div className="flex items-center gap-2">
                            <select 
                                value={claim.status} 
                                onChange={(e) => onStatusChange(claim.name, e.target.value)}
                                className="w-full p-2 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-[#002458] dark:bg-slate-700 dark:border-slate-600 dark:text-slate-300"
                            >
                                {claimStatuses.map(s => <option key={s} value={s}>{s}</option>)}
                            </select>
                            {claim.status === 'Approved' && (
                                <div className="flex items-center">
                                    <input type="number" value={claim.approvedRating} onChange={(e) => onRatingChange(claim.name, e.target.value)} className="w-20 p-2 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-[#002458] dark:bg-slate-700 dark:border-slate-600 dark:text-slate-300" placeholder="%" />
                                    <span className="ml-2 font-semibold dark:text-slate-300">%</span>
                                </div>
                            )}
                        </div>
                    </div>

                    <div className="pt-4 border-t border-slate-200 dark:border-slate-700 space-y-4">
                        <div>
                            <label className="text-sm font-medium text-gray-700 dark:text-slate-300 block mb-1">Describe the in-service injury, event, or illness that caused this condition.</label>
                            <textarea value={claim.notes.inServiceEvent} onChange={(e) => onNoteChange(claim.name, 'inServiceEvent', e.target.value)} className="w-full p-2 border border-gray-300 rounded-md text-sm dark:bg-slate-700 dark:border-slate-600 dark:text-slate-300" rows="3" placeholder="Example: 'Fell from a truck during a training exercise...'"/>
                        </div>
                        <div>
                            <label className="text-sm font-medium text-gray-700 dark:text-slate-300 block mb-1">Describe your symptoms and their history.</label>
                            <textarea value={claim.notes.symptoms} onChange={(e) => onNoteChange(claim.name, 'symptoms', e.target.value)} className="w-full p-2 border border-gray-300 rounded-md text-sm dark:bg-slate-700 dark:border-slate-600 dark:text-slate-300" rows="3" placeholder="Example: 'The pain started right after the injury...'"/>
                        </div>
                        <div>
                            <label className="text-sm font-medium text-gray-700 dark:text-slate-300 block mb-1">How does this condition impact your ability to work?</label>
                            <textarea value={claim.notes.workImpact} onChange={(e) => onNoteChange(claim.name, 'workImpact', e.target.value)} className="w-full p-2 border border-gray-300 rounded-md text-sm dark:bg-slate-700 dark:border-slate-600 dark:text-slate-300" rows="3" placeholder="Example: 'As a mechanic, I can no longer kneel...'"/>
                        </div>
                        <div>
                            <label className="text-sm font-medium text-gray-700 dark:text-slate-300 block mb-1">How does this condition impact your personal life?</label>
                            <textarea value={claim.notes.personalImpact} onChange={(e) => onNoteChange(claim.name, 'personalImpact', e.target.value)} className="w-full p-2 border border-gray-300 rounded-md text-sm dark:bg-slate-700 dark:border-slate-600 dark:text-slate-300" rows="3" placeholder="Example: 'I can no longer go on hikes with my family...'"/>
                        </div>
                    </div>

                    <div className="pt-4 border-t border-slate-200 dark:border-slate-700">
                        {isLoading && <div className="text-center text-sm text-slate-600 dark:text-slate-400">Loading details...</div>}
                        {error && <div className="text-center text-sm text-red-600 p-2 bg-red-50 dark:bg-red-900/40 dark:text-red-300 rounded-md">{error}</div>}
                        {details && (
                            <div className="space-y-4">
                                <div><h4 className="font-bold text-slate-800 dark:text-slate-100">Condition Description</h4><p className="text-sm text-slate-600 dark:text-slate-400 mt-1">{details.description}</p></div>
                                <div>
                                    <h4 className="font-bold text-slate-800 dark:text-slate-100">VA Rating Criteria</h4>
                                    <div className="mt-2 space-y-2">
                                        {details.ratingCriteria && details.ratingCriteria.map(item => (<div key={item.rating} className="text-sm p-3 bg-white dark:bg-slate-900 rounded-md border dark:border-slate-700"><p className="font-bold text-slate-700 dark:text-slate-200">{item.rating}</p><p className="text-slate-600 dark:text-slate-400 mt-1">{item.criteria}</p></div>))}
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                    <div className="flex justify-end pt-4 border-t border-slate-200 dark:border-slate-700">
                        <button onClick={() => onRemoveClaim(claim.name)} className="flex items-center gap-2 text-sm text-[#c62727] hover:text-[#a52020] font-semibold p-2 rounded-md hover:bg-red-50 dark:hover:bg-red-900/30 transition-colors"><Trash2Icon className="w-4 h-4" />Remove from Package</button>
                    </div>
                </div>
            )}
        </div>
    );
};


export default function ClaimBuilderPage({ userData, setUserData, setPage }) {
    const { claimPackage = [] } = userData || {}; // Add null check for safety

    // --- AMPLIFY MODIFICATION: DataStore saves for claimPackage ---
    const handleRemoveClaim = async (claimNameToRemove) => {
        try {
            await DataStore.save(UserProfile.copyOf(userData, updated => {
                updated.claimPackage = (updated.claimPackage || []).filter(c => c.name !== claimNameToRemove); // Assume claimPackage is AWSJSON
            }));
        } catch (error) {
            console.error("Error removing claim from DataStore:", error);
        }
    };
    const handleStatusChange = async (claimName, newStatus) => {
        try {
            await DataStore.save(UserProfile.copyOf(userData, updated => {
                updated.claimPackage = (updated.claimPackage || []).map(c => c.name === claimName ? { ...c, status: newStatus } : c);
            }));
        } catch (error) {
            console.error("Error updating claim status:", error);
        }
    };
    const handleRatingChange = async (claimName, newRating) => {
        try {
            await DataStore.save(UserProfile.copyOf(userData, updated => {
                updated.claimPackage = (updated.claimPackage || []).map(c => c.name === claimName ? { ...c, approvedRating: parseInt(newRating, 10) || 0 } : c);
            }));
        } catch (error) {
            console.error("Error updating claim rating:", error);
        }
    };
    const handleNoteChange = async (claimName, noteType, value) => {
        try {
            await DataStore.save(UserProfile.copyOf(userData, updated => {
                updated.claimPackage = (updated.claimPackage || []).map(c => c.name === claimName ? { ...c, notes: { ...(c.notes || {}), [noteType]: value } } : c); // Add null check for c.notes
            }));
        } catch (error) {
            console.error("Error updating claim note:", error);
        }
    };

    const claimStatuses = [ 'Tracking', 'Submitted', 'Pending Review', 'C&P Scheduled', 'C&P Completed', 'Denied', 'Approved', 'Appeal in Progress' ];

    return (
        <div className="font-sans">
            <div className="space-y-6">
                <div>
                    <h1 className="text-3xl font-bold text-slate-900 dark:text-white">Claim Builder</h1>
                    <Instructions />
                </div>

                <div className="bg-white dark:bg-slate-900 rounded-lg shadow">
                    <div className="p-6">
                        <h2 className="text-xl font-bold text-gray-800 dark:text-slate-100">Your New Claim Package</h2>
                    </div>
                    {(claimPackage || []).length > 0 ? ( // Add null check
                        <div className="p-4 pt-0 space-y-3">
                            {claimPackage.map(claim => (
                               <TrackedClaimItem key={claim.name} claim={claim} onRemoveClaim={handleRemoveClaim} onStatusChange={handleStatusChange} onRatingChange={handleRatingChange} onNoteChange={onNoteChange} claimStatuses={claimStatuses} userData={userData}/>
                            ))}
                        </div>
                    ) : (
                        <div className="text-center py-10 border-2 border-dashed border-gray-300 dark:border-slate-700 rounded-lg m-6">
                            <p className="text-sm text-gray-500 dark:text-slate-400">Your claim package is empty.</p>
                            <p className="text-xs text-gray-400 dark:text-slate-500 mt-1">Go to the "Conditions Overview" page to add claims.</p>
                        </div>
                    )}
                     {(claimPackage || []).length > 0 && ( // Add null check
                         <div className="p-6 border-t border-gray-200 dark:border-slate-700">
                             <button onClick={() => setPage('docTemplates')} className="w-full bg-green-600 text-white font-bold py-3 px-4 rounded-lg hover:bg-green-700 transition-colors">
                                 Prepare Filing Documents
                             </button>
                         </div>
                     )}
                </div>
            </div>
        </div>
    );
}