import React, { useState, useMemo, useRef, useEffect } from 'react';
import { GOOGLE_AI_API_KEY } from '../config'; // Still used directly on frontend for AI calls
import { VA_KNOWLEDGE_BASE } from '../data/vaKnowledgeBase'; // Assuming this is local data
import { roundToNearestTen, calculateVACombinedRating } from '../utils'; // Assuming these are local utils
import { DataStore } from '@aws-amplify/datastore'; // Import DataStore for userData updates
import { UserProfile } from '../models/index.js'; // Import UserProfile model
import {
    ChevronDownIcon,
    CircularUploadIcon,
    CircularPlusIcon,
    FileStackIcon,
    CalendarIcon,
    ListChecksIcon,
    XIcon,
    Trash2Icon,
    PlusCircleIcon
} from '../icons';
import { Button, Input, Select, Card, Modal } from '../components';

const PRESUMPTIVE_SYMPTOM_MAP = {
    'asthma': "Do you have difficulty breathing, wheezing, or shortness of breath, especially after activity?",
    'rhinitis': "Do you experience seasonal allergies, sneezing, a chronic runny nose, or congestion?",
    'sinusitis': "Do you suffer from frequent sinus infections, facial pressure, or headaches?",
    'copd': "Do you have a chronic cough, produce a lot of mucus, or feel constantly short of breath?",
    'gastrointestinal cancer': "Are you experiencing unexplained stomach pain, changes in bowel habits, or digestive issues?",
    'melanoma': "Have you noticed any new, unusual, or changing moles or spots on your skin?",
};

const PresumptiveSymptomModal = ({ isOpen, onClose, userData, setUserData, handleGenerateStrategy, isGeneratingStrategy, areDatesEntered }) => {
    if (!isOpen) return null;
    const { presumptiveSymptoms = {} } = userData || {}; // Add default empty object for safety
    const handlePresumptiveSymptomChange = async (symptomId, checked) => { // Make async
        const newPresumptiveSymptoms = { ...presumptiveSymptoms, [symptomId]: checked };
        try {
            await DataStore.save(UserProfile.copyOf(userData, updated => {
                updated.presumptiveSymptoms = newPresumptiveSymptoms; // Assume presumptiveSymptoms is AWSJSON
            }));
            // setUserData will be updated by App.jsx's observation
        } catch (error) {
            console.error("Error updating presumptive symptoms:", error);
        }
    };
    return (
        <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 p-4">
            <div className="bg-white dark:bg-slate-900 rounded-lg shadow-2xl w-full max-w-3xl max-h-[90vh] flex flex-col">
                <div className="p-6 border-b dark:border-slate-700 flex justify-between items-center"><h2 className="text-2xl font-bold text-slate-800 dark:text-slate-100">Presumptive Symptom Checker</h2><button onClick={onClose} className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-slate-700"><XIcon className="w-6 h-6 dark:text-slate-300" /></button></div>
                <div className="p-6 space-y-6 overflow-y-auto">
                    <div className="bg-blue-50 dark:bg-blue-900/40 border border-blue-200 dark:border-blue-800 rounded-lg p-4"><p className="text-blue-800 dark:text-blue-200 text-sm">Your service dates may indicate eligibility for presumptive conditions. Select any symptoms you experience that are <strong>not yet service-connected</strong>.</p></div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">{Object.entries(PRESUMPTIVE_SYMPTOM_MAP).map(([symptomId, question]) => (<div key={symptomId} className="border dark:border-slate-700 rounded-lg p-4 hover:bg-gray-50 dark:hover:bg-slate-800 transition-colors"><div className="flex items-start space-x-3"><input type="checkbox" id={`modal-${symptomId}`} checked={presumptiveSymptoms[symptomId] || false} onChange={(e) => handlePresumptiveSymptomChange(symptomId, e.target.checked)} className="mt-1 h-4 w-4 text-[#002458] rounded focus:ring-[#002458]" /><label htmlFor={`modal-${symptomId}`} className="text-sm text-gray-700 dark:text-slate-300 cursor-pointer leading-relaxed">{question}</label></div></div>))}</div>
                    {Object.values(presumptiveSymptoms).some(Boolean) && (<div className="bg-green-50 dark:bg-green-900/50 border border-green-200 dark:border-green-800 rounded-lg p-4"><h4 className="font-semibold text-green-800 dark:text-green-200 mb-2">Next Steps</h4><p className="text-green-700 dark:text-green-300 text-sm mb-3">Based on your selected symptoms, you may be eligible. Consider discussing these with your doctor and gathering evidence for a potential claim.</p></div>)}
                </div>
                <div className="p-4 bg-gray-50 dark:bg-slate-800 border-t dark:border-slate-700 flex justify-end"><Button onClick={() => { handleGenerateStrategy(); onClose(); }} variant="primary" disabled={isGeneratingStrategy || !areDatesEntered} title={!areDatesEntered ? "Please enter service dates first" : "Analyze and save your claims"}>{isGeneratingStrategy ? 'Analyzing...' : 'Analyze & Save Claims'}</Button></div>
            </div>
        </div>
    );
};

const SeverityScale = ({ severity, onSeverityChange }) => {
    const scale = [ { value: 1, color: 'bg-green-300' }, { value: 2, color: 'bg-green-400' }, { value: 3, color: 'bg-green-500' }, { value: 4, color: 'bg-yellow-400' }, { value: 5, color: 'bg-yellow-500' }, { value: 6, color: 'bg-orange-400' }, { value: 7, color: 'bg-orange-500' }, { value: 8, color: 'bg-red-500' }, { value: 9, color: 'bg-red-600' }, { value: 10, color: 'bg-red-700' }, ];
    return ( <div> <label className="text-sm font-medium text-gray-700 dark:text-slate-300 block mb-2">Severity</label> <div className="grid grid-cols-10 gap-1"> {scale.map(item => ( <button key={item.value} type="button" onClick={() => onSeverityChange(item.value)} className={`w-full h-10 rounded-md transition-transform transform ${item.color} ${severity === item.value ? 'ring-2 ring-offset-2 ring-indigo-500 scale-110 z-10' : 'hover:scale-105'}`}> <span className="font-bold text-white" style={{textShadow: '1px 1px 2px rgba(0,0,0,0.5)'}}>{item.value}</span> </button> ))} </div> </div> );
};

const QuickLogModal = ({ isOpen, onClose, userData, setUserData }) => {
    if (!isOpen) return null;
    const { claimPackage = [] } = userData || {};
    const [newLog, setNewLog] = useState({ condition: claimPackage.length > 0 ? claimPackage[0].name : '', date: new Date().toISOString().split('T')[0], severity: 5, notes: '' });
    const handleInputChange = (e) => { const { name, value } = e.target; setNewLog(prev => ({ ...prev, [name]: value })); };
    const handleAddSymptom = async (e) => { // Made async
        e.preventDefault();
        if (!newLog.condition) { alert("Please select a condition to log."); return; }
        const logToAdd = { ...newLog, id: Date.now() };
        try {
            await DataStore.save(UserProfile.copyOf(userData, updated => {
                const existingLogs = updated.symptomLogs?.[logToAdd.condition] || [];
                updated.symptomLogs = { ...updated.symptomLogs, [logToAdd.condition]: [...existingLogs, logToAdd] }; // Assume symptomLogs is AWSJSON
            }));
            setNewLog({ condition: claimPackage.length > 0 ? claimPackage[0].name : '', date: new Date().toISOString().split('T')[0], severity: 5, notes: '' });
            onClose();
        } catch (error) {
            console.error("Error saving symptom log:", error);
            alert("Failed to save symptom log. " + error.message);
        }
    };
    return ( <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 p-4"> <form onSubmit={handleAddSymptom} className="bg-white dark:bg-slate-900 rounded-lg shadow-2xl w-full max-w-lg"> <div className="p-6 border-b dark:border-slate-700"><h2 className="text-2xl font-bold text-slate-800 dark:text-slate-100">Add New Symptom Log</h2></div> <div className="p-6 space-y-4"> <Select label="Condition" name="condition" value={newLog.condition} onChange={handleInputChange} disabled={claimPackage.length === 0}> {claimPackage.length > 0 ? claimPackage.map(c => <option key={c.name} value={c.name}>{c.name}</option>) : <option>Add a condition in Claim Builder first</option>} </Select> <Input label="Date" type="date" name="date" value={newLog.date} onChange={handleInputChange}/> <SeverityScale severity={newLog.severity} onSeverityChange={(value) => setNewLog(prev => ({ ...prev, severity: value }))} /> <div><label className="text-sm font-medium text-gray-700 dark:text-slate-300 block mb-1">Notes</label><textarea name="notes" value={newLog.notes} onChange={handleInputChange} rows="3" className="w-full p-2 border border-gray-300 rounded-md dark:bg-slate-800 dark:border-slate-600 dark:text-slate-300" placeholder="Describe the symptom, impact, etc."></textarea></div> </div> <div className="p-4 bg-gray-50 dark:bg-slate-800 border-t dark:border-slate-700 flex justify-end space-x-2"><Button type="button" onClick={onClose} variant="secondary">Cancel</Button><Button type="submit" variant="primary" disabled={claimPackage.length === 0}>Save Log</Button></div> </form> </div> );
};

const MiniCalendar = ({ appointments = [], setPage }) => { // Add default empty array
    const [currentDate, setCurrentDate] = useState(new Date());
    const appointmentDates = useMemo(() => new Set(appointments.map(a => a.date)), [appointments]);
    const handlePrevMonth = () => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
    const handleNextMonth = () => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));
    const renderCalendarDays = () => {
        const year = currentDate.getFullYear();
        const month = currentDate.getMonth();
        const firstDayOfMonth = new Date(year, month, 1).getDay();
        const daysInMonth = new Date(year, month + 1, 0).getDate();
        const days = [];
        for (let i = 0; i < firstDayOfMonth; i++) { days.push(<div key={`empty-${i}`} className="w-8 h-8"></div>); }
        for (let day = 1; day <= daysInMonth; day++) {
            const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
            const hasAppointment = appointmentDates.has(dateStr);
            const isToday = new Date().toDateString() === new Date(year, month, day).toDateString();
            days.push( <div key={day} className="relative w-8 h-8 flex items-center justify-center"> <button onClick={() => setPage('appointments')} className={`w-7 h-7 rounded-full text-xs transition-colors ${isToday ? 'bg-red-600 text-white' : 'hover:bg-gray-100 dark:text-slate-300 dark:hover:bg-slate-700'}`}>{day}</button> {hasAppointment && <div className="absolute bottom-0.5 left-1/2 -translate-x-1/2 w-1 h-1 bg-blue-600 rounded-full"></div>} </div> );
        }
        return days;
    };
    return ( <div className="p-2"> <div className="flex justify-between items-center mb-2 px-2"><h3 className="font-bold text-sm dark:text-slate-100">{currentDate.toLocaleString('default', { month: 'long', year: 'numeric' })}</h3><div><button onClick={handlePrevMonth} className="w-6 h-6 rounded hover:bg-gray-200 dark:hover:bg-slate-700 dark:text-slate-300 text-xs">{'<'}</button><button onClick={handleNextMonth} className="w-6 h-6 rounded hover:bg-gray-200 dark:hover:bg-slate-700 dark:text-slate-300 text-xs">{'>'}</button></div></div> <div className="grid grid-cols-7 gap-y-1 text-center text-xs text-gray-500 dark:text-slate-400"><span>S</span><span>M</span><span>T</span><span>W</span><span>T</span><span>F</span><span>S</span></div> <div className="grid grid-cols-7 gap-y-1 mt-1 mx-auto">{renderCalendarDays()}</div> </div> );
};


export default function CalculatorPage({ userData, setUserData, setPage }) {
    // --- AMPLIFY MODIFICATION: Destructure with default values for safety ---
    const { 
        disabilities = [], 
        dependents = {}, 
        serviceDates = {}, 
        strategyData = { potentialIncreases: [], potentialNewClaims: { presumptiveConditions: [], secondaryConditions: [] } }, 
        claimPackage = [], 
        appointments = [], 
        todos = [], 
        symptomLogs = {}, 
        presumptiveSymptoms = {}, 
        sessionInfo = {} 
    } = userData || {}; // Provide empty object default for userData itself

    const [dependentsOpen, setDependentsOpen] = useState(false);
    const [serviceInfoOpen, setServiceInfoOpen] = useState(false);
    const [showPresumptiveModal, setShowPresumptiveModal] = useState(false);
    const [showQuickLogModal, setShowQuickLogModal] = useState(false);
    const [isProcessingFile, setIsProcessingFile] = useState(false);
    const [isGeneratingStrategy, setIsGeneratingStrategy] = useState(false);
    const [modalMessage, setModalMessage] = useState(null);
    const [promptForDates, setPromptForDates] = useState(false);
    const fileInputRef = useRef(null);
    const increaseSectionRef = useRef(null);

    const isPro = userData?.membershipStatus === 'Pro'; // Access membershipStatus directly from UserProfile

    const COMPENSATION_RATES_FULL = { 10: { alone: 175.51 }, 20: { alone: 346.95 }, 30: { alone: 537.42, spouse: 601.42, child1: 579.42, spouse_child1: 648.42, parent1: 588.42, spouse_parent1: 652.42, child1_parent1: 630.42, spouse_child1_parent1: 699.42 }, 40: { alone: 774.16, spouse: 859.16, child1: 831.16, spouse_child1: 922.16, parent1: 842.16, spouse_parent1: 927.16, child1_parent1: 899.16, spouse_child1_parent1: 990.16 }, 50: { alone: 1102.04, spouse: 1208.04, child1: 1173.04, spouse_child1: 1287.04, parent1: 1187.04, spouse_parent1: 1293.04, child1_parent1: 1258.04, spouse_child1_parent1: 1372.04 }, 60: { alone: 1395.93, spouse: 1523.93, child1: 1480.93, spouse_child1: 1617.93, parent1: 1497.93, spouse_parent1: 1625.93, child1_parent1: 1582.93, spouse_child1_parent1: 1719.93 }, 70: { alone: 1759.19, spouse: 1908.19, child1: 1858.19, spouse_child1: 2018.19, parent1: 1879.19, spouse_parent1: 2028.19, child1_parent1: 1978.19, spouse_child1_parent1: 2138.19 }, 80: { alone: 2044.89, spouse: 2214.89, child1: 2158.89, spouse_child1: 2340.89, parent1: 2181.89, spouse_parent1: 2351.89, child1_parent1: 2295.89, spouse_child1_parent1: 2478.89 }, 90: { alone: 2297.96, spouse: 2489.96, child1: 2425.96, spouse_child1: 2630.96, parent1: 2451.96, spouse_parent1: 2643.96, child1_parent1: 2579.96, spouse_child1_parent1: 2784.96 }, 100: { alone: 3831.30, spouse: 4044.91, child1: 3974.15, spouse_child1: 4201.35, parent1: 4002.74, spouse_parent1: 4216.35, child1_parent1: 4145.59, spouse_child1_parent1: 4372.79 }};
    const ADDITIONAL_DEPENDENT_AMOUNTS = { child_under_18_each_additional: { 30: 31, 40: 42, 50: 53, 60: 63, 70: 74, 80: 84, 90: 95, 100: 106.14 }, child_over_18_school_each: { 30: 102, 40: 137, 50: 171, 60: 205, 70: 239, 80: 274, 90: 308, 100: 342.85 }, parent_each_additional: { 30: 51, 40: 68, 50: 85, 60: 102, 70: 120, 80: 137, 90: 154, 100: 171.44 }, spouse_a_a_fixed: { 30: 58, 40: 78, 50: 98, 60: 117, 70: 137, 80: 157, 90: 176, 100: 195.92 }, smc_k_fixed: 136.06 };

    const isEligibleForPresumptives = useMemo(() => {
        const eod = serviceDates.eod ? new Date(serviceDates.eod) : null;
        const rad = serviceDates.rad ? new Date(serviceDates.rad) : null;
        if (!eod || !rad || rad <= eod) return false;

        return Object.values(VA_KNOWLEDGE_BASE.presumptiveCategories).some(category =>
            category.dateRanges.some(range => eod <= range.end && rad >= range.start)
        );
    }, [serviceDates.eod, serviceDates.rad]);

    useEffect(() => {
        const eod = serviceDates.eod ? new Date(serviceDates.eod) : null;
        const rad = serviceDates.rad ? new Date(serviceDates.rad) : null;
        const datesKey = `${serviceDates.eod}|${serviceDates.rad}`;
        
        const shownPresumptiveModalFor = sessionInfo?.shownPresumptiveModalFor;

        if (eod && rad && rad > eod && shownPresumptiveModalFor !== datesKey) {
            if (isEligibleForPresumptives) {
                setShowPresumptiveModal(true);
                // --- AMPLIFY MODIFICATION: Update DataStore for sessionInfo ---
                DataStore.save(UserProfile.copyOf(userData, updated => {
                    updated.sessionInfo = { // Assume sessionInfo is AWSJSON
                        ...updated.sessionInfo,
                        shownPresumptiveModalFor: datesKey,
                    };
                })).catch(error => console.error("Error updating sessionInfo in DataStore:", error));
            }
        }
    }, [serviceDates.eod, serviceDates.rad, sessionInfo, userData, isEligibleForPresumptives]); // Add userData to dependency array
    
    // --- AMPLIFY MODIFICATION: DataStore saves ---
    const addDisability = async () => {
        const newDisabilities = [...disabilities, { id: Date.now(), name: '', rating: 0 }];
        try {
            await DataStore.save(UserProfile.copyOf(userData, updated => {
                updated.disabilities = newDisabilities; // Assume disabilities is AWSJSON or a list of nested objects
            }));
        } catch (error) {
            console.error("Error adding disability:", error);
        }
    };
    const removeDisability = async (id) => {
        const updatedDisabilities = disabilities.filter(d => d.id !== id);
        try {
            await DataStore.save(UserProfile.copyOf(userData, updated => {
                updated.disabilities = updatedDisabilities;
            }));
        } catch (error) {
            console.error("Error removing disability:", error);
        }
    };
    const handleDisabilityChange = async (id, field, value) => {
        const updatedDisabilities = disabilities.map(d => d.id === id ? { ...d, [field]: value } : d);
        try {
            await DataStore.save(UserProfile.copyOf(userData, updated => {
                updated.disabilities = updatedDisabilities;
            }));
        } catch (error) {
            console.error("Error changing disability:", error);
        }
    };
    const handleDependentChange = async (e) => {
        const { name, value, type, checked } = e.target;
        let newDependents = { ...dependents };
        if (type === 'checkbox') {
            newDependents = { ...newDependents, [name]: checked };
        } else {
            const numValue = parseInt(value, 10);
            newDependents = { ...newDependents, [name]: isNaN(numValue) ? 0 : numValue };
        }
        try {
            await DataStore.save(UserProfile.copyOf(userData, updated => {
                updated.dependents = newDependents; // Assume dependents is AWSJSON
            }));
        } catch (error) {
            console.error("Error changing dependents:", error);
        }
    };
    const handleServiceDateChange = async (e) => {
        const { name, value } = e.target;
        const newServiceDates = { ...serviceDates, [name]: value };
        try {
            await DataStore.save(UserProfile.copyOf(userData, updated => {
                updated.serviceDates = newServiceDates; // Assume serviceDates is AWSJSON
            }));
        } catch (error) {
            console.error("Error changing service dates:", error);
        }
    };
    const handleReset = async () => {
        try {
            await DataStore.save(UserProfile.copyOf(userData, updated => {
                updated.disabilities = [];
                updated.strategyData = { potentialIncreases: [], potentialNewClaims: { presumptiveConditions: [], secondaryConditions: [] } };
                updated.claimPackage = [];
                updated.symptomLogs = {};
                updated.presumptiveSymptoms = {};
            }));
        } catch (error) {
            console.error("Error resetting data:", error);
        }
    };
    
    // --- AMPLIFY MODIFICATION: Replace direct fetch to AI with Amplify API (Lambda) if possible ---
    // For now, keeping direct fetch, but note this should ideally be a Lambda.
    const handleGenerateStrategy = async () => {
        const areDatesEntered = !!serviceDates.eod && !!serviceDates.rad;
        if (disabilities.length === 0) { setModalMessage("Please add at least one disability."); return; }
        if (!areDatesEntered) { setModalMessage("Please enter your service dates first."); return; }
        setIsGeneratingStrategy(true);
        const allEligiblePresumptives = [];
        const eod = serviceDates.eod ? new Date(serviceDates.eod) : null;
        const rad = serviceDates.rad ? new Date(serviceDates.rad) : null;
        if (eod && rad) {
            for (const key in VA_KNOWLEDGE_BASE.presumptiveCategories) {
                const category = VA_KNOWLEDGE_BASE.presumptiveCategories[key];
                if (category.dateRanges.some(range => eod <= range.end && rad >= range.start)) {
                    allEligiblePresumptives.push(...category.conditions.map(cond => ({ name: cond, act: category.shortLabel })));
                }
            }
        }
        const selectedSymptomIds = Object.keys(presumptiveSymptoms).filter(
            key => presumptiveSymptoms[key]
        );
        const finalPresumptiveConditions = allEligiblePresumptives
            .map(condition => {
                const matchingSymptomId = selectedSymptomIds.find(symptomId =>
                    condition.name.toLowerCase().includes(symptomId.toLowerCase())
                );
                if (matchingSymptomId) {
                    return { ...condition, userSymptom: PRESUMPTIVE_SYMPTOM_MAP[matchingSymptomId] };
                }
                return null;
            })
            .filter(Boolean);
        const secondaryConditions = disabilities.map(primary => {
            const primaryNameLower = primary.name.toLowerCase();
            const matchingKey = Object.keys(VA_KNOWLEDGE_BASE.secondaryConditionsMap).find(key => primaryNameLower.includes(key));
            if (matchingKey) { return { primaryConditionName: primary.name, suggestedSecondaries: VA_KNOWLEDGE_BASE.secondaryConditionsMap[matchingKey] }; }
            return null;
        }).filter(Boolean);
        
        const prompt = `You are an expert AI assistant for VA claims. For each disability in this list: ${JSON.stringify(disabilities.map(d => ({name: d.name, rating: d.rating})))}, provide a detailed strategy for an increase. Format the response as a single, valid JSON object with one key: "potentialIncreases". "potentialIncreases" should be an array of objects, where each object has: "name", "currentRating", "nextRating", "criteriaForNextRating", "howToIncrease", and "actionSteps" (an object with "crucialEvidence", "documentation", "statements"). If a condition is at its maximum rating, state that in "howToIncrease", set "nextRating" to the current rating, and make "actionSteps" values null.`;
        const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${GOOGLE_AI_API_KEY}`;
        const payload = { contents: [{ role: "user", parts: [{ text: prompt }] }], generationConfig: { responseMimeType: "application/json" } };
        
        try {
            const response = await fetch(apiUrl, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) });
            if (!response.ok) throw new Error(`API Error: ${response.status}`);
            const result = await response.json();
            let potentialIncreases = [];
            if (result.candidates && result.candidates.length > 0) {
                const parsedJson = JSON.parse(result.candidates[0].content.parts[0].text);
                potentialIncreases = parsedJson.potentialIncreases || [];
            } else { throw new Error("No content received from AI."); }
            
            // --- AMPLIFY MODIFICATION: Update strategyData in DataStore ---
            await DataStore.save(UserProfile.copyOf(userData, updated => {
                updated.strategyData = { potentialIncreases, potentialNewClaims: { presumptiveConditions: finalPresumptiveConditions, secondaryConditions } };
            }));
            
            setModalMessage("Analysis complete!");
            setTimeout(() => { increaseSectionRef.current?.scrollIntoView({ behavior: 'smooth' }); }, 100);
        } catch (error) {
            setModalMessage(`An error occurred during analysis: ${error.message}`);
        } finally {
            setIsGeneratingStrategy(false);
        }
    };
    
    // --- AMPLIFY MODIFICATION: Replace direct fetch to AI with Amplify API (Lambda) if possible ---
    // For now, keeping direct fetch, but note this should ideally be a Lambda.
    const processTextWithAI = async (text) => {
        const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${GOOGLE_AI_API_KEY}`;
        const prompt = `From the VA document text, extract disabilities with their ratings, the Entry on Duty date (EOD), and the Release from Active Duty date (RAD). Format as a single, valid JSON object: { "disabilities": [{"name": "tinnitus", "rating": 10}], "entryOnDutyDate": "YYYY-MM-DD", "releaseFromActiveDutyDate": "YYYY-MM-DD" }. IMPORTANT: If no disabilities are found, return an empty array [] for the "disabilities" key. If dates are not found, return null for those specific date keys. Text: ${text}`;
        const payload = { contents: [{ role: "user", parts: [{ text: prompt }] }], generationConfig: { responseMimeType: "application/json" } };
        try {
            const response = await fetch(apiUrl, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) });
            if (!response.ok) throw new Error(`API Error: ${response.status} ${response.statusText}`);
            const result = await response.json();
            if (!result.candidates || result.candidates.length === 0 || !result.candidates[0].content?.parts?.[0]?.text) {
                throw new Error("No valid content received from AI.");
            }
            const parsedJson = JSON.parse(result.candidates[0].content.parts[0].text);
            return {
                disabilities: parsedJson.disabilities || [],
                entryOnDutyDate: parsedJson.entryOnDutyDate || null,
                releaseFromActiveDutyDate: parsedJson.releaseFromActiveDutyDate || null,
            };
        } catch (error) {
            throw new Error(`An error occurred during AI processing: ${error.message}`);
        }
    };

    // --- AMPLIFY MODIFICATION: DataStore save for uploaded file data ---
    const handleFileSelect = async (event) => {
        const file = event.target.files[0];
        if (!file) return;

        setIsProcessingFile(true);
        setModalMessage(null);

        try {
            let text;
            if (file.type === 'application/pdf') {
                const pdfjsLib = await import('pdfjs-dist/build/pdf');
                pdfjsLib.GlobalWorkerOptions.workerSrc = `/pdf.worker.min.mjs`;
                const pdfData = await file.arrayBuffer();
                const pdf = await pdfjsLib.getDocument({ data: new Uint8Array(pdfData) }).promise;
                let fullText = '';
                for (let i = 1; i <= pdf.numPages; i++) {
                    const page = await pdf.getPage(i);
                    const textContent = await page.getTextContent();
                    fullText += textContent.items.map(item => item.str).join(' ') + '\n';
                }
                text = fullText;
            } else if (file.type === 'text/plain') {
                text = await file.text();
            } else {
                throw new Error('Unsupported file type. Please upload a PDF or TXT file.');
            }

            if (!text || text.trim().length === 0) {
                throw new Error('No text content could be extracted from the file.');
            }

            const extractedData = await processTextWithAI(text);
            
            const existingNames = new Set((userData.disabilities || []).map(d => d.name.toLowerCase().trim())); // Add null check for userData.disabilities
            const newDisabilities = (extractedData.disabilities || [])
                .filter(d => d.name && typeof d.name === 'string' && !existingNames.has(d.name.toLowerCase().trim()))
                .map(d => ({ id: Date.now() + Math.random(), name: d.name, rating: parseInt(d.rating, 10) || 0 }));
            
            const datesFound = !!(extractedData.entryOnDutyDate && extractedData.releaseFromActiveDutyDate);

            if (newDisabilities.length > 0 || datesFound) {
                await DataStore.save(UserProfile.copyOf(userData, updated => {
                    if (newDisabilities.length > 0) {
                        updated.disabilities = [...(updated.disabilities || []), ...newDisabilities];
                    }
                    if (datesFound) {
                        updated.serviceDates = { eod: extractedData.entryOnDutyDate, rad: extractedData.releaseFromActiveDutyDate };
                    }
                }));
            }

            if (newDisabilities.length > 0) {
                setModalMessage(`${newDisabilities.length} new condition(s) extracted and added!`);
                if (!datesFound) {
                    setPromptForDates(true);
                }
            } else if (datesFound) {
                setModalMessage("Service dates found, but no new disabilities were extracted.");
            } else {
                 if (extractedData.disabilities.length > 0) {
                    setModalMessage("AI found conditions, but they were already in your list.");
                 } else {
                    setModalMessage("Could not extract any disabilities or service dates from this document.");
                 }
            }
        } catch (error) {
            setModalMessage(error.message);
        } finally {
            setIsProcessingFile(false);
            if (fileInputRef.current) {
                fileInputRef.current.value = "";
            }
        }
    };
    
    const calculationResult = useMemo(() => {
        const ratings = (disabilities || []).map(d => parseInt(d.rating, 10)); // Add null check
        const rawCombined = calculateVACombinedRating(ratings);
        const roundedCombined = roundToNearestTen(rawCombined);
        const getCompensation = () => {
            if (roundedCombined < 10) return 0;
            let comp = 0; 
            const hasSpouse = dependents?.maritalStatus === 'married'; // Add null check
            const hasChildren = (dependents?.childrenUnder18 || 0) > 0; // Add null check
            const hasParents = (dependents?.dependentParents || 0) > 0; // Add null check
            let key = 'alone';
            if (roundedCombined >= 30) { if (hasSpouse && hasChildren && hasParents) key = 'spouse_child1_parent1'; else if (hasSpouse && hasChildren) key = 'spouse_child1'; else if (hasSpouse && hasParents) key = 'spouse_parent1'; else if (hasChildren && hasParents) key = 'child1_parent1'; else if (hasSpouse) key = 'spouse'; else if (hasChildren) key = 'child1'; else if (hasParents) key = 'parent1'; }
            comp = COMPENSATION_RATES_FULL[roundedCombined]?.[key] || COMPENSATION_RATES_FULL[roundedCombined]?.['alone'] || 0;
            const addlChildren = (dependents?.childrenUnder18 || 0) - (key.includes('child1') ? 1 : 0); // Add null check
            if (addlChildren > 0) comp += addlChildren * (ADDITIONAL_DEPENDENT_AMOUNTS.child_under_18_each_additional[roundedCombined] || 0);
            comp += (dependents?.childrenOver18School || 0) * (ADDITIONAL_DEPENDENT_AMOUNTS.child_over_18_school_each[roundedCombined] || 0); // Add null check
            const addlParents = (dependents?.dependentParents || 0) - (key.includes('parent1') ? 1 : 0); // Add null check
            if (addlParents > 0) comp += addlParents * (ADDITIONAL_DEPENDENT_AMOUNTS.parent_each_additional[roundedCombined] || 0);
            if (roundedCombined >= 30) { 
                comp += (dependents?.smcKAwards || 0) * ADDITIONAL_DEPENDENT_AMOUNTS.smc_k_fixed; // Add null check
                if (hasSpouse && dependents?.spouseAidAttendance) comp += ADDITIONAL_DEPENDENT_AMOUNTS.spouse_a_a_fixed[roundedCombined] || 0; // Add null check
            }
            return comp;
        };
        const compensation = getCompensation();
        return { rawCombined, roundedCombined, compensation: isNaN(compensation) ? 0 : compensation };
    }, [disabilities, dependents]);

    const totalSecondaryConditions = useMemo(() => { return strategyData?.potentialNewClaims?.secondaryConditions?.reduce((acc, item) => acc + (item.suggestedSecondaries?.length || 0), 0) || 0; }, [strategyData]); // Add null check
    const areDatesEntered = useMemo(() => !!serviceDates?.eod && !!serviceDates?.rad, [serviceDates]); // Add null check
    const latestLogs = useMemo(() => { const allLogs = Object.entries(symptomLogs || {}).flatMap(([condition, logs]) => (logs || []).map(log => ({ ...log, condition }))); return allLogs.sort((a, b) => new Date(b.date) - new Date(a.date)).slice(0, 5); }, [symptomLogs]); // Add null checks
    
    const CircularProgressBar = ({ percentage, size = 100, strokeWidth = 10 }) => {
        const radius = (size - strokeWidth) / 2;
        const circumference = radius * 2 * Math.PI;
        const offset = circumference - (percentage / 100) * circumference;
        return (<svg width={size} height={size} className="transform -rotate-90"><circle stroke="#e5e7eb" className="dark:stroke-slate-700" fill="transparent" strokeWidth={strokeWidth} r={radius} cx={size / 2} cy={size / 2} /><circle stroke="#002458" fill="transparent" strokeWidth={strokeWidth} strokeDasharray={circumference} style={{ strokeDashoffset: offset }} strokeLinecap="round" r={radius} cx={size / 2} cy={size / 2} className="transition-all duration-300" /><text x="50%" y="50%" textAnchor="middle" dy=".3em" className="text-2xl font-bold fill-current text-gray-700 dark:text-slate-100 transform rotate-90" style={{ transformOrigin: 'center' }} >{`${Math.round(percentage)}%`}</text></svg>);
    };

    const IncreaseStrategyCard = ({ strategy }) => {
        if (!strategy) return null;
        const isMaxRating = strategy.currentRating === strategy.nextRating;
        return (<div className="bg-white dark:bg-slate-800/50 rounded-lg shadow p-6 mb-6"><div className="flex justify-between items-start mb-4"><div><h3 className="text-xl font-bold text-gray-800 dark:text-slate-100 capitalize">{strategy.name}</h3></div><div className="flex items-center space-x-2 text-lg font-bold"><span className="bg-gray-200 text-gray-800 dark:bg-slate-700 dark:text-slate-300 px-3 py-1 rounded-md">{strategy.currentRating}%</span>{!isMaxRating && (<><span className="text-[#002458] dark:text-blue-400">→</span><span className="bg-[#002458] text-white px-3 py-1 rounded-md">{strategy.nextRating}%</span></>)}</div></div>{isMaxRating ? (<div><p className="text-gray-700 dark:text-slate-300 mb-2">{strategy.howToIncrease}</p><p className="font-semibold text-[#002458] dark:text-blue-400">Action Step: Explore filing a new claim for a secondary condition.</p></div>) : (<><div className="mb-4"><p className="font-semibold text-gray-700 dark:text-slate-200">Official Criteria for {strategy.nextRating}% Rating:</p><p className="text-gray-600 dark:text-slate-400">{strategy.criteriaForNextRating}</p></div><div className="bg-[#e6e9ef] dark:bg-slate-800 p-4 rounded-lg"><h4 className="font-bold text-[#001c46] dark:text-blue-300">How to Increase:</h4><p className="text-sm text-[#002458] dark:text-blue-400 mb-3">{strategy.howToIncrease}</p><h5 className="font-semibold text-[#001c46] dark:text-blue-300 mb-2">Action Steps:</h5><ul className="list-disc list-inside space-y-2 text-sm text-[#002458] dark:text-blue-400"><li><strong>Crucial Evidence:</strong> {strategy.actionSteps.crucialEvidence}</li><li><strong>High-Level Documentation:</strong> {strategy.actionSteps.documentation}</li><li><strong>Statements:</strong> {strategy.actionSteps.statements}</li></ul></div></>)}</div>);
    };

    const OverviewCard = () => {
        const upcomingAppointments = (appointments || []).filter(a => new Date(a.date) >= new Date(new Date().toDateString())).length; // Add null check
        const openTodos = (todos || []).filter(t => !t.completed).length; // Add null check
        const overviewItems = [{ icon: <FileStackIcon className="w-8 h-8 text-blue-600"/>, count: (claimPackage || []).length, label: 'Tracked Claims', page: 'claimBuilder' },{ icon: <CalendarIcon className="w-8 h-8 text-green-600"/>, count: upcomingAppointments, label: 'Upcoming Appointments', page: 'appointments' },{ icon: <ListChecksIcon className="w-8 h-8 text-yellow-600"/>, count: openTodos, label: 'Open To-Do Items', page: 'appointments' },];
        return ( <Card title="Your Overview"> <MiniCalendar appointments={appointments} setPage={setPage} /> <hr className="my-4 border-gray-200 dark:border-slate-700" /> <div className="space-y-4"> {overviewItems.map(item => (<button key={item.label} onClick={() => setPage(item.page)} className="w-full flex items-center p-3 bg-gray-50 dark:bg-slate-800 dark:hover:bg-slate-700 rounded-lg hover:bg-gray-100 transition-colors text-left"><div className="p-2 bg-white dark:bg-slate-900 rounded-full shadow-sm mr-4">{item.icon}</div><div><p className="text-2xl font-bold text-gray-800 dark:text-slate-100">{item.count}</p><p className="text-sm text-gray-600 dark:text-slate-400">{item.label}</p></div></button>))} </div> </Card> );
    };

    return (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <PresumptiveSymptomModal isOpen={showPresumptiveModal} onClose={() => setShowPresumptiveModal(false)} userData={userData} setUserData={setUserData} handleGenerateStrategy={handleGenerateStrategy} isGeneratingStrategy={isGeneratingStrategy} areDatesEntered={areDatesEntered} />
            <QuickLogModal isOpen={showQuickLogModal} onClose={() => setShowQuickLogModal(false)} userData={userData} setUserData={setUserData} />
            {modalMessage && <Modal message={modalMessage} onClose={() => setModalMessage(null)} />}
            {promptForDates && <Modal message="We successfully extracted your disabilities, but couldn't find your service dates. Please enter them in the 'Service Information' section to check for presumptive eligibility." onClose={() => setPromptForDates(false)} />}
            <div className="lg:col-span-2 space-y-6">
                <div className="bg-white dark:bg-slate-900 rounded-lg shadow p-6">
                    <div className="flex items-center gap-6">
                        <CircularProgressBar percentage={calculationResult.roundedCombined} />
                        <div>
                            <h2 className="text-xl font-bold text-slate-800 dark:text-white">
                                Welcome back, {userData?.fullName?.split(' ')[0] || userData?.username || 'Veteran'}! {/* Adjusted for UserProfile fields */}
                            </h2>
                            <p className="text-slate-600 dark:text-slate-400 mt-2">
                                Your current combined disability rating is <strong className="font-bold text-slate-800 dark:text-slate-200">{calculationResult.roundedCombined}%</strong>
                            </p>
                            <p className="text-3xl font-bold text-green-600 mt-1">
                                ${calculationResult.compensation.toFixed(2)}
                                <span className="text-lg font-medium text-slate-500 dark:text-slate-400"> / month</span>
                            </p>
                            <p className="text-xs text-gray-400 dark:text-slate-500 mt-1">
                                (Pre-rounded calculation: {calculationResult.rawCombined.toFixed(1)}%)
                            </p>
                        </div>
                    </div>
                </div>
                <div className="bg-white dark:bg-slate-900 rounded-lg shadow"><div className="p-6 flex justify-between items-center cursor-pointer" onClick={() => setServiceInfoOpen(!serviceInfoOpen)}><h2 className="text-xl font-bold text-gray-800 dark:text-slate-100">Service Information</h2><div className="flex items-center space-x-4">{serviceDates?.eod && serviceDates?.rad && (<div className="text-sm text-gray-600 dark:text-slate-400"><span className="font-medium">EOD:</span> {serviceDates.eod} <span className="ml-4 font-medium">RAD:</span> {serviceDates.rad}</div>)}<ChevronDownIcon className="dark:text-slate-300"/></div></div>{serviceInfoOpen && (<div className="p-6 border-t border-gray-200 dark:border-slate-700 space-y-6"><p className="text-gray-600 dark:text-slate-400 text-sm">Please provide your service dates to allow for presumptive eligibility analysis.</p><div className="grid grid-cols-1 md:grid-cols-2 gap-4"><Input label="Entry on Duty (EOD)" name="eod" type="date" value={serviceDates?.eod || ''} onChange={handleServiceDateChange} /><Input label="Release from Active Duty (RAD)" name="rad" type="date" value={serviceDates?.rad || ''} onChange={handleServiceDateChange} /></div></div>)}</div>
                <div className="bg-white dark:bg-slate-900 rounded-lg shadow"><div className="p-6 flex justify-between items-center cursor-pointer" onClick={() => setDependentsOpen(!dependentsOpen)}><h2 className="text-xl font-bold text-gray-800 dark:text-slate-100">Dependent Information</h2><ChevronDownIcon className="dark:text-slate-300"/></div>{dependentsOpen && (<div className="p-6 border-t border-gray-200 dark:border-slate-700"><div className="grid grid-cols-1 md:grid-cols-2 gap-4"><Select label="Marital Status" name="maritalStatus" value={dependents?.maritalStatus || ''} onChange={handleDependentChange}><option value="single">Single</option><option value="married">Married</option></Select><Input label="Children Under 18" name="childrenUnder18" type="number" min="0" value={dependents?.childrenUnder18 || 0} onChange={handleDependentChange} /><Input label="Children 18-23 in School" name="childrenOver18School" type="number" min="0" value={dependents?.childrenOver18School || 0} onChange={handleDependentChange} /><Input label="Dependent Parents" name="dependentParents" type="number" min="0" value={dependents?.dependentParents || 0} onChange={handleDependentChange} /><div className="flex items-center mt-4 col-span-1 md:col-span-2"><input type="checkbox" id="spouse-aid-attendance" name="spouseAidAttendance" checked={dependents?.spouseAidAttendance || false} onChange={handleDependentChange} className="h-4 w-4 text-indigo-600 rounded focus:ring-indigo-500" /><label htmlFor="spouse-aid-attendance" className="ml-2 text-sm text-gray-700 dark:text-slate-300">Spouse requires Aid and Attendance</label></div></div></div>)}</div>
                <Card title="Your Service Information & Disabilities"><p className="text-gray-600 dark:text-slate-400 text-sm mb-6">Start by uploading a VA document for an AI-powered analysis, or enter your service dates and conditions manually.</p><div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6"><div className="border border-gray-200 dark:border-slate-700 rounded-lg p-4 text-center flex flex-col items-center"><CircularUploadIcon /><h3 className="font-bold dark:text-slate-100">Document Upload</h3><p className="text-xs text-gray-500 dark:text-slate-400 my-2 flex-grow">Upload a VA award letter (PDF/TXT) to automatically extract your conditions and ratings.</p><input type="file" ref={fileInputRef} onChange={handleFileSelect} className="hidden" accept=".pdf,.txt" /><Button onClick={() => fileInputRef.current.click()} variant="action" className="w-full mt-auto" disabled={isProcessingFile}>{isProcessingFile ? 'Processing...' : 'Upload'}</Button></div><div className="border border-gray-200 dark:border-slate-700 rounded-lg p-4 text-center flex flex-col items-center"><CircularPlusIcon /><h3 className="font-bold dark:text-slate-100">Add Manually</h3><p className="text-xs text-gray-500 dark:text-slate-400 my-2 flex-grow">Click the button to add a new disability condition to your profile below.</p><Button onClick={addDisability} variant="green" className="w-full mt-auto">Add Condition</Button></div></div><div className="space-y-3">{disabilities.map(d => (<div key={d.id} className="grid grid-cols-10 gap-2 items-end p-3 bg-gray-50 dark:bg-slate-800 rounded-lg"><div className="col-span-10 md:col-span-5"><Input label="Disability Name" type="text" value={d.name} onChange={e => handleDisabilityChange(d.id, 'name', e.target.value)} /></div><div className="col-span-5 md:col-span-2"><Select label="Rating" value={d.rating} onChange={e => handleDisabilityChange(d.id, 'rating', e.target.value)}>{[0, 10, 20, 30, 40, 50, 60, 70, 80, 90, 100].map(r => <option key={r} value={r}>{r}%</option>)}</Select></div><div className="col-span-5 md:col-span-3"><Button onClick={() => removeDisability(d.id)} variant="danger" className="w-full py-2">Remove</Button></div></div>))}</div><div className="mt-6 border-t border-gray-200 dark:border-slate-700 pt-6 grid grid-cols-2 gap-4"><Button onClick={handleGenerateStrategy} variant="primary" disabled={isGeneratingStrategy || !areDatesEntered} title={!areDatesEntered ? "Please enter service dates first" : ""} className="w-full">{isGeneratingStrategy ? 'Analyzing...' : 'Analyze & Save Claims'}</Button><Button onClick={handleReset} variant="danger" className="w-full">Reset</Button></div></Card>
                <div ref={increaseSectionRef} className="bg-white dark:bg-slate-900 rounded-lg shadow p-6"><h2 className="text-2xl font-bold text-gray-800 dark:text-slate-100 mb-2">How to Increase Your Current Ratings</h2><p className="text-sm text-gray-600 dark:text-slate-400 mb-6">For each disability you entered, we've listed the official VA criteria for the next highest rating. Compare these with your current symptoms and evidence to see if you might qualify for an increase.</p>{isGeneratingStrategy && <div className="text-center p-4"><div className="w-6 h-6 border-4 border-[#002458] border-t-transparent rounded-full animate-spin mx-auto"></div><p className="mt-2 text-gray-600 dark:text-slate-400">Analyzing... Please wait.</p></div>}{!isGeneratingStrategy && (!strategyData?.potentialIncreases || strategyData.potentialIncreases.length === 0) && <p className="text-gray-600 dark:text-slate-400 text-sm text-center py-4">Click "Analyze My Claims" above to generate detailed strategies for increasing your ratings.</p>}<div className="space-y-4">{strategyData?.potentialIncreases && strategyData.potentialIncreases.map((strategy, index) => (<IncreaseStrategyCard key={index} strategy={strategy} />))}</div></div>
                <Card title="Maximize Your Rating">
                    <p className="text-gray-600 dark:text-slate-400 text-sm mb-4">Our analysis may identify additional claims you are eligible for. Click "Analyze My Claims" to find out.</p>
                    {!areDatesEntered && (
                        <div className="bg-yellow-50 dark:bg-yellow-900/40 border-l-4 border-yellow-400 dark:border-yellow-600 p-4 mb-4">
                            <p className="font-bold text-yellow-800 dark:text-yellow-200">Enter Service Dates</p>
                            <p className="text-sm text-yellow-700 dark:text-yellow-300">Please provide your Entry on Duty and Release from Active Duty dates in the "Service Information" section above to check for presumptive eligibility.</p>
                        </div>
                    )}
                    <div className="flex space-x-4 bg-gray-50 dark:bg-slate-800 p-4 rounded-lg mb-4 justify-around">
                        <div className="text-center">
                            <p className="text-2xl font-bold text-[#c62727]">{strategyData?.potentialNewClaims?.presumptiveConditions?.length || 0}</p>
                            <p className="text-xs text-gray-500 dark:text-slate-400">Potential Presumptive Conditions</p>
                        </div>
                        <div className="border-l border-gray-200 dark:border-slate-700"></div>
                        <div className="text-center">
                            <p className="text-2xl font-bold text-[#c62727]">{totalSecondaryConditions}</p>
                            <p className="text-xs text-gray-500 dark:text-slate-400">Potential Secondary Conditions</p>
                        </div>
                    </div>
                    
                    {/* --- CORRECTED BUTTON LOGIC --- */}
                    {isPro ? (
                         <div className="text-center p-4 bg-green-50 dark:bg-green-900/50 rounded-lg">
                            <p className="font-semibold text-green-800 dark:text-green-200">
                                Pro Membership Active
                            </p>
                            <p className="text-sm text-green-700 dark:text-green-300">
                                Your full maximization report is available on the <button onClick={() => setPage('conditions')} className="underline font-bold">Conditions Overview</button> page.
                            </p>
                        </div>
                    ) : (
                        <Button 
                            onClick={() => setPage('membership')}
                            variant="primary"
                            className="w-full !bg-red-600 hover:!bg-red-700"
                        >
                            Unlock Full Report
                        </Button>
                    )}
                </Card>
            </div>
            <div className="lg:col-span-1 space-y-6">
                <OverviewCard />
                <Card title="Condition Symptom Tracker"><div className="mb-4 space-y-2">{latestLogs.length > 0 ? ( latestLogs.map(log => ( <div key={log.id} className="text-sm p-2 bg-gray-50 dark:bg-slate-800 rounded-md"><div className="flex justify-between font-semibold dark:text-slate-200"><span>{log.condition}</span><span className="text-gray-600 dark:text-slate-400">{new Date(log.date).toLocaleDateString()}</span></div><p className="text-gray-700 dark:text-slate-300">Severity: {log.severity}/10</p></div>)) ) : ( <p className="text-sm text-gray-500 dark:text-slate-400 text-center py-4">No symptoms logged yet.</p> )}</div><div className="grid grid-cols-2 gap-2"><Button onClick={() => setShowQuickLogModal(true)} variant="primary" className="w-full"><PlusCircleIcon className="w-4 h-4 mr-2"/> Add New Log</Button><Button onClick={() => setPage('symptomTracker')} variant="secondary" className="w-full">View Full Tracker</Button></div></Card>
                <Card title="Help and Support"><ul className="space-y-3"><li className="flex items-center text-sm text-gray-700 dark:text-slate-300"><svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-gray-500 dark:text-slate-400" fill="none" viewBox="0 0 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.546-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>Frequently Asked Questions</li><li className="flex items-center text-sm text-gray-700 dark:text-slate-300"><svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-gray-500 dark:text-slate-400" fill="none" viewBox="0 0 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>Contact Support</li></ul></Card>
            </div>
        </div>
    );
}