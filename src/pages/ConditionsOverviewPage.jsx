import React, { useState, useEffect } from 'react';
import { GOOGLE_AI_API_KEY } from '../config'; // Still used directly on frontend for AI calls
import { DataStore } from '@aws-amplify/datastore'; // Add DataStore for userData updates
import {
    Link2Icon,
    LightbulbIcon,
    ArrowUpCircleIcon,
    ChevronDownIcon,
    Trash2Icon
} from '../icons';
import { Button } from '../components';
import { UserProfile } from '../models/index.js'; // Import UserProfile model for userData updates

// --- Icon Component defined locally to prevent errors ---
const LockIcon = (props) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
        <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
        <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
    </svg>
);


// --- UI Components for Overview Page ---
const StatusBadge = ({ status = "Service Connected" }) => {
    const statusStyles = {
        'Service Connected': 'bg-green-100 text-green-800 dark:bg-green-900/50 dark:text-green-300',
        'Pending Review': 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/50 dark:text-yellow-300',
        'Denied': 'bg-red-100 text-red-800 dark:bg-red-900/50 dark:text-red-300',
        'Suggested': 'bg-purple-100 text-purple-800 dark:bg-purple-900/50 dark:text-purple-300',
        'Presumptive Suggestion': 'bg-cyan-100 text-cyan-800 dark:bg-cyan-900/50 dark:text-cyan-300', 
    };
    return <span className={`text-xs font-bold px-2.5 py-1 rounded-full ${statusStyles[status]}`}>{status}</span>;
};

const ChanceBadge = ({ chance = "Low" }) => {
    const chanceStyles = {
        'High': 'bg-green-100 text-green-800 dark:bg-green-900/50 dark:text-green-300',
        'Medium': 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/50 dark:text-yellow-300',
        'Low': 'bg-red-100 text-red-800 dark:bg-red-900/50 dark:text-red-300',
    };
    return <span className={`text-xs font-bold px-2.5 py-1 rounded-full ${chanceStyles[chance]}`}>{chance} Chance</span>;
};

const PresumptiveMiniBadge = ({ act }) => (
    <span className="ml-2 text-xs font-semibold px-2 py-0.5 bg-[#e6e9ef] dark:bg-slate-700 text-[#002458] dark:text-slate-300 rounded-full">{act}</span>
);

const EducationalInfo = () => (
    <div className="bg-blue-50 dark:bg-slate-900/50 border border-blue-200 dark:border-blue-900 p-6 rounded-lg shadow-sm mb-6">
        <h2 className="text-2xl font-bold text-blue-900 dark:text-blue-300 mb-4">Maximize Your Claim Strategy</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white dark:bg-slate-800 p-4 rounded-lg border dark:border-slate-700">
                <h3 className="flex items-center gap-2 font-bold text-lg text-blue-800 dark:text-blue-400 mb-2">
                    <Link2Icon className="w-6 h-6" />
                    The Power of Secondary Claims
                </h3>
                <p className="text-sm text-gray-700 dark:text-slate-300 leading-relaxed">
                    A secondary condition is one that was caused or aggravated by an existing service-connected disability. For example, if your service-connected knee injury causes an abnormal gait that leads to hip problems, that hip condition can be claimed as secondary.
                </p>
            </div>
            <div className="bg-white dark:bg-slate-800 p-4 rounded-lg border dark:border-slate-700">
                <h3 className="flex items-center gap-2 font-bold text-lg text-blue-800 dark:text-blue-400 mb-2">
                    <LightbulbIcon className="w-6 h-6" />
                    Understanding Presumptive Conditions
                </h3>
                <p className="text-sm text-gray-700 dark:text-slate-300 leading-relaxed">
                    The VA "presumes" that certain disabilities were caused by military service because of unique circumstances, like exposure to specific chemicals or serving in certain locations. If you have a diagnosed presumptive condition and meet the service requirements, you do not need to provide a medical nexus linking it to your service.
                </p>
            </div>
        </div>
    </div>
);

const PremiumFeatureBlocker = ({ setPage, isSection = false }) => (
    <div className={`absolute inset-0 bg-white/70 dark:bg-slate-900/80 backdrop-blur-md flex flex-col items-center justify-center z-10 p-4 text-center ${isSection ? 'rounded-xl' : 'rounded-b-lg'}`}>
        <LockIcon className="w-12 h-12 text-slate-500 mb-4" />
        <h4 className="text-xl font-bold text-slate-800 dark:text-slate-100">Unlock Full Details with Pro</h4>
        <p className="text-slate-600 dark:text-slate-400 mt-2 mb-6 max-w-md">Upgrade your plan to view this analysis.</p>
        <Button onClick={() => setPage('membership')} variant="primary" size="lg">
            Upgrade to Pro
        </Button>
    </div>
);

const IncreaseRatingSection = ({ condition }) => {
    const [isOpen, setIsOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [strategy, setStrategy] = useState(null);
    const [error, setError] = useState(null);

    const handleGenerateStrategy = async () => {
        if (!isOpen) {
            setIsOpen(true);
            if (strategy) return;
        } else {
            setIsOpen(false);
            return;
        }

        setIsLoading(true);
        setError(null);
        // --- AMPLIFY MODIFICATION: Ensure API Key is available ---
        if (!GOOGLE_AI_API_KEY || GOOGLE_AI_API_KEY.includes("YOUR_GOOGLE")) {
            setError("API Key is missing. Please add your Google AI API key.");
            setIsLoading(false);
            return;
        }
        
        const prompt = `For a veteran with "${condition.name}", provide the official VA criteria for ALL possible rating percentages (e.g., 10%, 30%, 50%, 100%). Format the response as a single, valid JSON object with one key: "ratingStrategies". "ratingStrategies" should be an array of objects. Each object must have the following keys: "rating" (a string like "30%"), "criteria" (a string explaining the official VA criteria for that rating), "howToIncrease" (a string explaining what a veteran needs to demonstrate to potentially increase their rating to this level), and "actionSteps" (an object with three string properties: "crucialEvidence", "highLevelDocumentation", and "statements"). Do not include any text outside the final JSON object.`;
        
        // --- AMPLIFY MODIFICATION: Direct fetch, or ideally, move this to a Lambda via Amplify API ---
        const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${GOOGLE_AI_API_KEY}`;
        const payload = { contents: [{ role: "user", parts: [{ text: prompt }] }], generationConfig: { responseMimeType: "application/json" } };
        
        try {
            const response = await fetch(apiUrl, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) });
            if (!response.ok) throw new Error(`API Error: ${response.status}`);
            const result = await response.json();
            if (result.candidates && result.candidates.length > 0) {
                const parsedJson = JSON.parse(result.candidates[0].content.parts[0].text);
                setStrategy(parsedJson.ratingStrategies || []);
            } else { throw new Error("No content received from AI."); }
        } catch (e) {
            setError(`Failed to get strategy: ${e.message}`);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="p-4 bg-[#e6e9ef] dark:bg-slate-800 rounded-lg">
            <div className="flex items-start gap-4">
                <div className="bg-[#ccd3e0] dark:bg-slate-700 p-2 rounded-full flex-shrink-0">
                    <ArrowUpCircleIcon className="w-6 h-6 text-[#002458] dark:text-blue-400" />
                </div>
                <div>
                    <h4 className="font-bold text-slate-800 dark:text-slate-100">Rating Increase Strategy</h4>
                    <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">View the official criteria for all rating levels for this condition to see if you qualify for an increase.</p>
                    <button onClick={handleGenerateStrategy} className="text-sm font-semibold text-[#c62727] hover:text-[#a52020] transition-colors mt-2">
                        {isOpen ? 'Hide All Strategies' : 'Show All Strategies'}
                    </button>
                </div>
            </div>
            {isOpen && (
                <div className="mt-4 pt-4 border-t border-[#b3b9c7] dark:border-slate-700 relative">
                    <div>
                        {isLoading && <div className="text-center text-sm text-slate-600 dark:text-slate-400">Loading strategies...</div>}
                        {error && <div className="text-center text-sm text-red-600 p-2 bg-red-50 rounded-md">{error}</div>}
                        {strategy && (
                            <div className="space-y-4">
                                {strategy.map((item, index) => (
                                    <div key={index} className="bg-white dark:bg-slate-900 p-4 rounded-lg shadow-sm border dark:border-slate-700">
                                        <h5 className="font-bold text-slate-800 dark:text-slate-100">Strategy for {item.rating}</h5>
                                        <p className="text-sm font-semibold text-gray-700 dark:text-slate-200 mt-2">Official Criteria for {item.rating} Rating:</p>
                                        <p className="text-sm text-gray-600 dark:text-slate-400">{item.criteria}</p>
                                        
                                        <div className="mt-4 pt-4 border-t border-gray-200 dark:border-slate-700">
                                            <h6 className="font-bold text-slate-800 dark:text-slate-100">How to Increase:</h6>
                                            <p className="text-sm text-gray-600 dark:text-slate-400 mt-1">{item.howToIncrease}</p>
                                            
                                            <h6 className="font-bold text-slate-800 dark:text-slate-100 mt-3">Action Steps:</h6>
                                            <ul className="list-disc list-outside space-y-1 text-sm text-gray-600 dark:text-slate-400 mt-1 pl-5">
                                                <li><strong>Crucial Evidence:</strong> {item.actionSteps?.crucialEvidence}</li>
                                                <li><strong>High-Level Documentation:</strong> {item.actionSteps?.highLevelDocumentation}</li>
                                                <li><strong>Statements:</strong> {item.actionSteps?.statements}</li>
                                            </ul>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};

const SecondaryConditionRow = ({ condition, onDelete, addClaimToPackage, removeClaimFromPackage, claimPackage, primaryConditionName }) => {
    const [isOpen, setIsOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [details, setDetails] = useState(null);
    const [error, setError] = useState(null);
    const isAdded = claimPackage.some(c => c.name === condition.name);

    const handleFetchDetails = async () => {
        setIsOpen(!isOpen);
        if (details || isOpen) return; 
        setIsLoading(true);
        setError(null);
        // --- AMPLIFY MODIFICATION: Ensure API Key is available ---
        if (!GOOGLE_AI_API_KEY || GOOGLE_AI_API_KEY.includes("YOUR_GOOGLE")) {
            setError("API Key is missing. Please add your Google AI API key.");
            setIsLoading(false);
            return;
        }
        const prompt = `You are an expert AI assistant for VA claims. A veteran has a primary condition of "${primaryConditionName}" and is claiming "${condition.name}" as a secondary condition. Provide a single, valid JSON object with four keys: "whatItIs", "howItsConnected", "whatToDo" (as an array of strings), and "howToFile". - "whatItIs": A brief, one-sentence explanation of the secondary condition. - "howItsConnected": A brief, one-sentence explanation of how it's medically linked to the primary condition. - "whatToDo": An array of 3 short, actionable steps a veteran should take. - "howToFile": A one-sentence guide on how to file, mentioning VA Form 21-526EZ. Ensure the "whatToDo" value is an array of strings. Do not include any text outside the final JSON object.`;
        // --- AMPLIFY MODIFICATION: Direct fetch, or ideally, move this to a Lambda via Amplify API ---
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

    const handleToggleClaim = (e) => {
        e.stopPropagation();
        if (isAdded) {
            removeClaimFromPackage(condition.name);
        } else {
            const claimToAdd = { name: condition.name, type: 'Secondary', primary: primaryConditionName, chance: condition.chance, status: 'Tracking', approvedRating: 0, notes: { inServiceEvent: '', symptoms: '', workImpact: '', personalImpact: '' } };
            addClaimToPackage(claimToAdd);
        }
    };

    return (
        <div className="bg-slate-50 dark:bg-slate-800 rounded-lg transition-all duration-300">
            <div className="grid grid-cols-12 gap-4 items-center p-3">
                <div className="col-span-12 md:col-span-5 font-medium text-slate-700 dark:text-slate-200 cursor-pointer" onClick={handleFetchDetails}>{condition.name}</div>
                <div className="col-span-6 md:col-span-3"><ChanceBadge chance={condition.chance} /></div>
                <div className="col-span-6 md:col-span-4 flex items-center justify-end gap-1">
                    <button onClick={handleToggleClaim} className={`px-2 py-1 text-xs font-semibold rounded-md transition ${isAdded ? 'bg-green-200 text-green-800 hover:bg-green-300 dark:bg-green-900/50 dark:text-green-300' : 'bg-[#002458] text-white hover:bg-[#001c46]'}`}>{isAdded ? 'In Builder' : 'Add to Builder'}</button>
                    <button onClick={handleFetchDetails} className="p-2 text-slate-500 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-md transition-colors"><ChevronDownIcon className={`transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`} /></button>
                    <button onClick={(e) => { e.stopPropagation(); onDelete(condition.id); }} className="p-2 text-slate-500 dark:text-slate-400 hover:bg-red-100 hover:text-red-600 dark:hover:bg-red-900/50 dark:hover:text-red-400 rounded-md transition-colors" aria-label="Delete condition"><Trash2Icon className="w-4 h-4" /></button>
                </div>
            </div>
            {isOpen && (
                <div className="px-4 pb-4 pt-2 border-t border-slate-200 dark:border-slate-700">
                    {isLoading && <div className="text-center text-sm text-slate-600 dark:text-slate-400 py-4">Loading details...</div>}
                    {error && <div className="text-center text-sm text-red-600 p-2 bg-red-50 rounded-md">{error}</div>}
                    {details && (
                        <div className="space-y-3 text-sm">
                            <div><h5 className="font-bold text-slate-800 dark:text-slate-100">What It Is:</h5><p className="text-slate-600 dark:text-slate-400 mt-1">{details.whatItIs}</p></div>
                             <div><h5 className="font-bold text-slate-800 dark:text-slate-100">How It's Connected:</h5><p className="text-slate-600 dark:text-slate-400 mt-1">{details.howItsConnected}</p></div>
                            <div><h5 className="font-bold text-slate-800 dark:text-slate-100">What To Do:</h5><ol className="list-decimal list-inside mt-1 space-y-1 text-slate-600 dark:text-slate-400">{details.whatToDo.map((step, index) => <li key={index}>{step}</li>)}</ol></div>
                             <div><h5 className="font-bold text-slate-800 dark:text-slate-100">How To File:</h5><p className="text-slate-600 dark:text-slate-400 mt-1">{details.howToFile}</p></div>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

const PresumptiveClaimCard = ({ claim, onDeleteClaim, addClaimToPackage, removeClaimFromPackage, claimPackage }) => {
    const { primaryCondition } = claim;
    const isAdded = claimPackage.some(c => c.name === primaryCondition.name);

    const handleToggleClaim = (e) => {
        e.stopPropagation();
        if (isAdded) {
            removeClaimFromPackage(primaryCondition.name);
        } else {
            const claimToAdd = { name: primaryCondition.name, type: 'Presumptive', act: primaryCondition.act, status: 'Tracking', approvedRating: 0, notes: { inServiceEvent: '', symptoms: '', workImpact: '', personalImpact: '' } };
            addClaimToPackage(claimToAdd);
        }
    };

    return (
        <div className="bg-white dark:bg-slate-900 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700">
            <div className="grid grid-cols-12 gap-4 items-center p-4">
                <div className="col-span-12 sm:col-span-6 flex items-center"><h3 className="text-lg font-bold text-slate-900 dark:text-slate-100 capitalize">{primaryCondition.name}</h3><PresumptiveMiniBadge act={primaryCondition.act} /></div>
                <div className="col-span-6 sm:col-span-2"><StatusBadge status={primaryCondition.status} /></div>
                <div className="col-span-6 sm:col-span-4 flex items-center justify-end gap-2">
                     <button onClick={handleToggleClaim} className={`px-2 py-1 text-xs font-semibold rounded-md transition ${isAdded ? 'bg-green-200 text-green-800 hover:bg-green-300 dark:bg-green-900/50 dark:text-green-300' : 'bg-[#002458] text-white hover:bg-[#001c46]'}`}>{isAdded ? 'In Builder' : 'Add to Builder'}</button>
                    <button onClick={(e) => { e.stopPropagation(); onDeleteClaim(claim.id); }} className="p-2 text-slate-500 dark:text-slate-400 hover:bg-red-100 hover:text-red-600 dark:hover:bg-red-900/50 dark:hover:text-red-400 rounded-lg transition-colors" aria-label="Delete claim"><Trash2Icon className="w-5 h-5" /></button>
                </div>
            </div>
        </div>
    );
};


const ClaimCard = ({ claim, onUpdateClaim, onDeleteClaim, addClaimToPackage, removeClaimFromPackage, claimPackage, isPro, setPage }) => {
    const { primaryCondition, secondaryConditions } = claim;
    const isPrimaryAdded = claimPackage.some(c => c.name === primaryCondition.name);

    const handleTogglePrimaryClaim = (e) => {
        e.stopPropagation();
        if (isPrimaryAdded) {
            removeClaimFromPackage(primaryCondition.name);
        } else {
            const claimToAdd = { 
                ...primaryCondition, 
                type: 'Primary', 
                status: 'Tracking', 
                approvedRating: primaryCondition.rating, 
                notes: { inServiceEvent: '', symptoms: '', workImpact: '', personalImpact: '' } 
            };
            addClaimToPackage(claimToAdd);
        }
    };
    
    // --- AMPLIFY MODIFICATION: Update DataStore for secondary conditions ---
    const handleDeleteSecondary = async (secondaryId) => {
        // Find the specific UserProfile based on props.userData.id
        if (!secondaryId || !primaryCondition || !primaryCondition.id || !onUpdateClaim) return;

        const updatedSecondaries = secondaryConditions.filter(sec => sec.id !== secondaryId);
        
        // This part needs to update the actual UserProfile model in DataStore
        // Assuming 'disabilities' in UserProfile contains primary conditions, and
        // 'secondaryConditions' are nested within them or linked.
        // This might require a more complex DataStore.save operation depending on your schema.
        // For simplicity, let's assume primaryCondition is part of userData.disabilities
        // and its secondaryConditions are nested.

        // You need to update the userData prop via setUserData, which will then trigger DataStore.save in App.jsx
        // This function probably needs access to the main userData object from App.jsx
        // For now, I'll keep the direct onUpdateClaim as it is passed down, but note its actual implementation.
        onUpdateClaim({ ...claim, secondaryConditions: updatedSecondaries }); 
    };

    return (
        <div className="bg-white dark:bg-slate-900 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700">
            <div className="grid grid-cols-12 gap-4 items-center p-4 border-b border-slate-200 dark:border-slate-700">
                <div className="col-span-12 md:col-span-5 flex items-center">
                    <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100 capitalize">{primaryCondition.name}</h3>
                    {primaryCondition.act && <PresumptiveMiniBadge act={primaryCondition.act} />}
                </div>
                <div className="col-span-4 md:col-span-2"><StatusBadge status={primaryCondition.status} /></div>
                <div className="col-span-3 md:col-span-1 text-center text-lg font-extrabold text-[#c62727]">{primaryCondition.rating}%</div>
                <div className="col-span-5 md:col-span-4 flex items-center justify-end gap-2">
                    <button onClick={handleTogglePrimaryClaim} className={`px-2 py-1 text-xs font-semibold rounded-md transition ${isPrimaryAdded ? 'bg-green-200 text-green-800 hover:bg-green-300 dark:bg-green-900/50 dark:text-green-300' : 'bg-[#002458] text-white hover:bg-[#001c46]'}`}>{isPrimaryAdded ? 'In Builder' : 'Add to Builder'}</button>
                    <button onClick={() => onDeleteClaim(claim.id)} className="p-2 text-slate-500 dark:text-slate-400 hover:bg-red-100 hover:text-red-600 dark:hover:bg-red-900/50 dark:hover:text-red-400 rounded-lg transition-colors" aria-label="Delete claim"><Trash2Icon className="w-5 h-5" /></button>
                </div>
            </div>
            {primaryCondition.status === 'Service Connected' && (<div className="p-4"><IncreaseRatingSection condition={primaryCondition} /></div>)}
            {/* FIX: Add min-height to the container when the blocker is active */}
            <div className={`px-4 pb-4 relative ${!isPro ? 'min-h-[250px]' : ''}`}>
                {!isPro && <PremiumFeatureBlocker setPage={setPage} />}
                <div className={!isPro ? 'blur-sm pointer-events-none' : ''}>
                    <h4 className="text-sm font-semibold text-slate-600 dark:text-slate-300 mb-2 mt-2">Secondary Conditions</h4>
                    <div className="space-y-3 mb-3">
                        {secondaryConditions && secondaryConditions.length > 0 ? (
                            secondaryConditions.map(sec => (<SecondaryConditionRow key={sec.id} condition={sec} primaryConditionName={primaryCondition.name} onDelete={() => handleDeleteSecondary(sec.id)} addClaimToPackage={addClaimToPackage} removeClaimFromPackage={removeClaimFromPackage} claimPackage={claimPackage} />))
                        ) : (<p className="text-sm text-slate-500 dark:text-slate-400 text-center py-4">No secondary conditions suggested. Run the "Analyze & Save Claims" tool on the Calculator page.</p>)}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default function ConditionsOverviewPage({ userData, setUserData, addClaimToPackage, removeClaimFromPackage, claimPackage, setPage }) {
    const [serviceConnectedClaims, setServiceConnectedClaims] = useState([]);
    const [newPresumptiveClaims, setNewPresumptiveClaims] = useState([]);
    const isPro = userData?.membershipStatus === 'Pro'; // Access membershipStatus directly from UserProfile

    useEffect(() => {
        const presumptiveConditions = userData?.strategyData?.potentialNewClaims?.presumptiveConditions || [];
        
        const scClaims = (userData?.disabilities || []).map(disability => {
            const strategyForPrimary = userData?.strategyData?.potentialNewClaims?.secondaryConditions?.find(s => s.primaryConditionName?.toLowerCase() === disability.name?.toLowerCase());
            const aiSecondaries = strategyForPrimary?.suggestedSecondaries?.map(sec => ({ id: `ai-sec-${disability.id}-${sec.name.replace(/\s+/g, '-')}`, name: sec.name, rating: 0, status: 'Suggested', chance: sec.chance })) || [];
            
            const presumptiveMatch = presumptiveConditions.find(p => p.name.toLowerCase() === disability.name.toLowerCase());

            return { 
                id: `claim-${disability.id}`, 
                primaryCondition: { 
                    ...disability, 
                    status: 'Service Connected',
                    act: presumptiveMatch ? presumptiveMatch.act : null 
                }, 
                secondaryConditions: aiSecondaries 
            };
        });
        setServiceConnectedClaims(scClaims);

        const existingClaimNames = new Set(scClaims.map(c => c.primaryCondition.name.toLowerCase()));
        
        const presumptive = presumptiveConditions
            .filter(presumptive => !existingClaimNames.has(presumptive.name.toLowerCase()))
            .map(presumptive => ({ 
                id: `claim-presumptive-${presumptive.name.replace(/\s+/g, '-')}`, 
                primaryCondition: { 
                    id: `presumptive-${presumptive.name.replace(/\s+/g, '-')}`, 
                    name: presumptive.name, 
                    rating: 0, 
                    status: 'Presumptive Suggestion', 
                    act: presumptive.act, 
                    userSymptom: presumptive.userSymptom 
                }, 
                secondaryConditions: [] 
            }));
        setNewPresumptiveClaims(presumptive);

    }, [userData]);

    // --- AMPLIFY MODIFICATION: Update DataStore when claims are modified/deleted ---
    const handleUpdateClaim = async (updatedClaim) => { 
        // This function is for updating secondary conditions nested within a primary condition
        // The `userData` prop is assumed to be an instance of UserProfile DataStore model
        // We need to find the specific disability within userData.disabilities and update its secondaries.
        if (!userData || !userData.disabilities) return;

        const updatedDisabilities = userData.disabilities.map(d => {
            if (d.id === updatedClaim.primaryCondition.id) {
                // Return a new object with updated secondaryConditions
                return { ...d, secondaryConditions: updatedClaim.secondaryConditions };
            }
            return d;
        });

        try {
            await DataStore.save(
                UserProfile.copyOf(userData, updated => {
                    updated.disabilities = updatedDisabilities; // Ensure this matches your schema type (e.g., AWSJSON or a list of another model)
                })
            );
            // After DataStore.save, the App.jsx's observation of UserProfile will update userData prop
            // No need to call setServiceConnectedClaims here if App.jsx handles it.
        } catch (error) {
            console.error("Error updating claim in DataStore:", error);
        }
    };
    
    const handleDeleteClaim = async (claimIdToDelete) => {
        // This function needs to update the userData prop via DataStore.save
        if (!userData) return;

        let updatedDisabilities = userData.disabilities || [];
        let updatedStrategyData = userData.strategyData ? { ...userData.strategyData } : {};

        const claimToDelete = [...serviceConnectedClaims, ...newPresumptiveClaims].find(c => c.id === claimIdToDelete);
        if (!claimToDelete) return;

        if (claimToDelete.primaryCondition.status === 'Service Connected') {
            updatedDisabilities = updatedDisabilities.filter(d => d.id !== claimToDelete.primaryCondition.id);
        } else {
            if (updatedStrategyData.potentialNewClaims && updatedStrategyData.potentialNewClaims.presumptiveConditions) {
                updatedStrategyData.potentialNewClaims.presumptiveConditions = updatedStrategyData.potentialNewClaims.presumptiveConditions.filter(p => p.name !== claimToDelete.primaryCondition.name);
            }
        }
        
        try {
            await DataStore.save(
                UserProfile.copyOf(userData, updated => {
                    updated.disabilities = updatedDisabilities; // Assuming 'disabilities' is directly on UserProfile
                    updated.strategyData = updatedStrategyData; // Assuming 'strategyData' is directly on UserProfile (as AWSJSON)
                })
            );
        } catch (error) {
            console.error("Error deleting claim from DataStore:", error);
        }
    };
    
    const hasServiceConnectedClaims = serviceConnectedClaims && serviceConnectedClaims.length > 0;
    const hasPresumptiveClaims = newPresumptiveClaims && newPresumptiveClaims.length > 0;

    return (
        <div className="font-sans">
            <div className="space-y-6">
                <h1 className="text-3xl font-bold text-slate-900 dark:text-white">My Conditions Overview</h1>
                <p className="mt-1 text-slate-600 dark:text-slate-400 mb-4">This is an overview of your current service-connected conditions and potential new claims identified by our analysis. Use the "Claim Builder" page to select and prepare new claims for filing.</p>
                <EducationalInfo />
                
                {hasServiceConnectedClaims && (
                    <div className="space-y-4">
                        <h2 className="text-2xl font-bold text-slate-800 dark:text-slate-200 mt-8 mb-2">Your Service-Connected Conditions</h2>
                        {serviceConnectedClaims.map(claim => (<ClaimCard 
                            key={claim.id} 
                            claim={claim} 
                            onUpdateClaim={handleUpdateClaim} // This needs to trigger DataStore update
                            onDeleteClaim={handleDeleteClaim} // This needs to trigger DataStore update
                            addClaimToPackage={addClaimToPackage} // This needs to trigger DataStore update in App.jsx
                            removeClaimFromPackage={removeClaimFromPackage} // This needs to trigger DataStore update in App.jsx
                            claimPackage={claimPackage}
                            isPro={isPro}
                            setPage={setPage}
                        />))}
                    </div>
                )}

                {hasPresumptiveClaims && (
                     <div className="space-y-4">
                        <h2 className="text-2xl font-bold text-slate-800 dark:text-slate-200 mt-8 mb-2">Potential Presumptive Conditions</h2>
                        {/* FIX: Add min-height to the container when the blocker is active */}
                        <div className={`relative ${!isPro ? 'min-h-[300px]' : ''}`}>
                            {!isPro && <PremiumFeatureBlocker setPage={setPage} isSection={true} />}
                            <div className={`space-y-4 ${!isPro ? 'blur-sm pointer-events-none' : ''}`}>
                                {newPresumptiveClaims.map(claim => (
                                     <PresumptiveClaimCard
                                        key={claim.id}
                                        claim={claim}
                                        onDeleteClaim={handleDeleteClaim} // This needs to trigger DataStore update
                                        addClaimToPackage={addClaimToPackage} // This needs to trigger DataStore update in App.jsx
                                        removeClaimFromPackage={removeClaimFromPackage} // This needs to trigger DataStore update in App.jsx
                                        claimPackage={claimPackage}
                                    />
                                ))}
                            </div>
                        </div>
                    </div>
                )}

                {!hasServiceConnectedClaims && !hasPresumptiveClaims && (
                    <div className="text-center text-gray-500 dark:text-slate-400 p-8 bg-white dark:bg-slate-900 rounded-lg shadow"><p className="font-semibold text-lg">No conditions saved.</p><p className="mt-2">Go to the Calculator page to add your service-connected disabilities and run an analysis.</p></div>
                )}
            </div>
        </div>
    );
}