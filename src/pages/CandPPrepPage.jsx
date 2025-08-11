import React, { useState, useEffect } from 'react';
import { GOOGLE_AI_API_KEY } from '../config';
import { ChevronDownIcon, ExternalLinkIcon } from '../icons';
import { Button } from '../components';

// --- Self-contained UI Components to prevent external dependency errors ---
const LockIcon = (props) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
        <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
        <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
    </svg>
);

const PrepInstructions = () => {
    return (
        <div className="bg-blue-50 dark:bg-blue-900/40 border-l-4 border-blue-400 dark:border-blue-600 p-4 rounded-r-lg my-6 text-sm">
            <p className="text-blue-800 dark:text-blue-300">
                This is your interactive, personalized C&P exam prep tool. Start by selecting a condition from the dropdown menu below. The guide will automatically use your saved information from the Claim Builder and Symptom Tracker to generate a step-by-step preparation plan, including a customized checklist and personal script.
            </p>
        </div>
    );
};

const PremiumFeatureBlocker = ({ setPage }) => (
    <div className="absolute inset-0 bg-white/70 dark:bg-slate-900/80 backdrop-blur-md flex flex-col items-center justify-center z-10 p-4 text-center rounded-lg min-h-[500px]">
        <LockIcon className="w-12 h-12 text-slate-500 mb-4" />
        <h4 className="text-xl font-bold text-slate-800 dark:text-slate-100">Unlock Your C&P Prep Guide</h4>
        <p className="text-slate-600 dark:text-slate-400 mt-2 mb-6 max-w-md">Upgrade to Pro to access your personalized exam preparation checklist, practice questions, and DBQ insights.</p>
        <Button onClick={() => setPage('membership')} variant="primary" size="lg">
            Upgrade to Pro
        </Button>
    </div>
);


const PracticeQuestionSection = ({ questions = [], conditionName, userData, setUserData }) => {
    const [openQuestion, setOpenQuestion] = useState(null);
    const practiceAnswers = userData.practiceAnswers || {};

    const handleAnswerChange = (question, answer) => {
        setUserData(prev => ({
            ...prev,
            practiceAnswers: {
                ...prev.practiceAnswers,
                [conditionName]: {
                    ...(prev.practiceAnswers?.[conditionName] || {}),
                    [question]: answer
                }
            }
        }));
    };

    return (
        <div className="bg-white dark:bg-slate-900 p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-bold text-[#c62727] mb-4">Practice Common Questions</h2>
            <div className="space-y-4">
                {questions.map((q, i) => (
                    <div key={i} className="border border-gray-200 dark:border-slate-700 rounded-lg">
                        <button onClick={() => setOpenQuestion(openQuestion === i ? null : i)} className="w-full text-left p-4 flex justify-between items-center">
                            <span className="font-semibold text-gray-800 dark:text-slate-200">{q}</span>
                            <ChevronDownIcon className={`transition-transform dark:text-slate-400 ${openQuestion === i ? 'rotate-180' : ''}`} />
                        </button>
                        {openQuestion === i && (
                            <div className="p-4 border-t dark:border-slate-700 bg-slate-50 dark:bg-slate-800">
                                <textarea
                                    className="w-full p-2 border rounded-md text-sm dark:bg-slate-700 dark:border-slate-600 dark:text-slate-300"
                                    rows="4"
                                    placeholder={`Practice your answer for: "${q}"`}
                                    value={practiceAnswers[conditionName]?.[q] || ''}
                                    onChange={(e) => handleAnswerChange(q, e.target.value)}
                                />
                                <p className="text-xs text-gray-500 dark:text-slate-500 mt-1">Your answer is saved automatically.</p>
                            </div>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
};

const DBQExplorer = ({ dbqSections = [], conditionName, userData, setUserData }) => {
    const [openSection, setOpenSection] = useState(null);
    const dbqAnswers = userData.dbqAnswers || {};

    const handleNoteChange = (sectionTitle, question, note) => {
        const key = `${sectionTitle} - ${question}`;
        setUserData(prev => ({
            ...prev,
            dbqAnswers: {
                ...prev.dbqAnswers,
                [conditionName]: {
                    ...(prev.dbqAnswers?.[conditionName] || {}),
                    [key]: note
                }
            }
        }));
    };

    if (!dbqSections || dbqSections.length === 0) {
        return null;
    }

    return (
        <div className="bg-white dark:bg-slate-900 p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-bold text-[#c62727] mb-4">DBQ Explorer</h2>
            <p className="text-sm text-slate-600 dark:text-slate-400 mb-4">Prepare for the exact questions the examiner will use from the Disability Benefits Questionnaire (DBQ). Add your notes and answers below.</p>
            <div className="space-y-2">
                {dbqSections.map((section, i) => (
                    <div key={i} className="border dark:border-slate-700 rounded-lg">
                        <button onClick={() => setOpenSection(openSection === i ? null : i)} className="w-full p-4 text-left font-bold text-gray-800 dark:text-slate-200 flex justify-between items-center">
                            {section.sectionTitle}
                            <ChevronDownIcon className={`transition-transform dark:text-slate-400 ${openSection === i ? 'rotate-180' : ''}`} />
                        </button>
                        {openSection === i && (
                            <div className="p-4 border-t dark:border-slate-700 space-y-4">
                                {(section.questions || []).map((q, qi) => (
                                    <div key={qi} className="bg-slate-50 dark:bg-slate-800 p-3 rounded-md">
                                        <p className="text-sm font-semibold text-gray-700 dark:text-slate-300">{q}</p>
                                        <textarea
                                            className="w-full mt-2 p-2 border rounded-md text-sm dark:bg-slate-700 dark:border-slate-600 dark:text-slate-300"
                                            rows="3"
                                            placeholder="Add your notes or practice answer here..."
                                            value={dbqAnswers[conditionName]?.[`${section.sectionTitle} - ${q}`] || ''}
                                            onChange={(e) => handleNoteChange(section.sectionTitle, q, e.target.value)}
                                        />
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
};

const PostExamReflection = ({ conditionName, userData, setUserData }) => {
    const [log, setLog] = useState({ date: new Date().toISOString().slice(0,10), examiner: '', questions: '', responses: '', forgot: '', impression: '' });
    const postExamLogs = userData.postExamLogs || {};

    const handleSaveLog = () => {
        setUserData(prev => {
            const existingLogs = prev.postExamLogs?.[conditionName] || [];
            return {
                ...prev,
                postExamLogs: {
                    ...prev.postExamLogs,
                    [conditionName]: [...existingLogs, { ...log, id: Date.now() }]
                }
            };
        });
        setLog({ date: new Date().toISOString().slice(0,10), examiner: '', questions: '', responses: '', forgot: '', impression: '' });
    };

    const logsForCondition = postExamLogs[conditionName] || [];

    return (
        <div className="bg-white dark:bg-slate-900 p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-bold text-[#c62727] mb-4">After the Exam: Reflection Log</h2>
            <p className="text-sm text-slate-600 dark:text-slate-400 mb-4">Immediately after your exam, record everything you remember. This can be crucial for appeals.</p>
            <div className="space-y-3 p-4 border dark:border-slate-700 rounded-lg bg-slate-50 dark:bg-slate-800">
                <input type="date" value={log.date} onChange={e => setLog({...log, date: e.target.value})} className="w-full p-2 border rounded dark:bg-slate-700 dark:border-slate-600 dark:text-slate-300"/>
                <input type="text" value={log.examiner} onChange={e => setLog({...log, examiner: e.target.value})} placeholder="Examiner's Name (if you know it)" className="w-full p-2 border rounded dark:bg-slate-700 dark:border-slate-600 dark:text-slate-300"/>
                <textarea value={log.questions} onChange={e => setLog({...log, questions: e.target.value})} placeholder="What questions were you asked?" rows="3" className="w-full p-2 border rounded dark:bg-slate-700 dark:border-slate-600 dark:text-slate-300"/>
                <textarea value={log.responses} onChange={e => setLog({...log, responses: e.target.value})} placeholder="How did you respond?" rows="3" className="w-full p-2 border rounded dark:bg-slate-700 dark:border-slate-600 dark:text-slate-300"/>
                <textarea value={log.forgot} onChange={e => setLog({...log, forgot: e.target.value})} placeholder="What did you forget to mention?" rows="3" className="w-full p-2 border rounded dark:bg-slate-700 dark:border-slate-600 dark:text-slate-300"/>
                <textarea value={log.impression} onChange={e => setLog({...log, impression: e.target.value})} placeholder="Overall impression of the exam..." rows="3" className="w-full p-2 border rounded dark:bg-slate-700 dark:border-slate-600 dark:text-slate-300"/>
                <Button onClick={handleSaveLog} variant="primary" className="w-full">Save Reflection</Button>
            </div>
            {logsForCondition.length > 0 && (
                <div className="mt-6">
                    <h3 className="font-bold text-lg text-slate-800 dark:text-slate-200 mb-2">Saved Reflections</h3>
                    {logsForCondition.map(l => (
                        <div key={l.id} className="p-3 border dark:border-slate-700 rounded-md mb-2 bg-gray-50 dark:bg-slate-800 text-sm">
                            <p className="dark:text-slate-300"><strong>Exam Date:</strong> {l.date}</p>
                            <p className="dark:text-slate-300"><strong>Examiner:</strong> {l.examiner}</p>
                            <p className="mt-2 whitespace-pre-wrap dark:text-slate-300"><strong>Impression:</strong> {l.impression}</p>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};


export default function CandPPrepPage({ userData, setUserData, setPage }) {
    // DEFINITIVE FIX: Safely destructure userData and provide default empty values for all expected properties.
    // This prevents the component from crashing if userData is null or if any nested properties are missing.
    const { 
        claimPackage = [], 
        symptomLogs = {}, 
        checklistProgress = {}, 
        postExamLogs = {}, 
        practiceAnswers = {}, 
        dbqAnswers = {} 
    } = userData || {};
    const isPro = userData?.membership?.status === 'Pro';

    const [selectedCondition, setSelectedCondition] = useState(null);
    const [prepData, setPrepData] = useState({});
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);
    const [toast, setToast] = useState('');

    useEffect(() => {
        if (Array.isArray(claimPackage) && claimPackage.length > 0 && !selectedCondition) {
            setSelectedCondition(claimPackage[0].name);
        }
    }, [claimPackage, selectedCondition]);

    useEffect(() => {
        if (selectedCondition && !prepData[selectedCondition] && isPro) {
            handleGenerateGuide(selectedCondition);
        }
    }, [selectedCondition, isPro]);
    
    useEffect(() => {
        if (toast) {
            const timer = setTimeout(() => setToast(''), 3000);
            return () => clearTimeout(timer);
        }
    }, [toast]);

    const handleGenerateGuide = async (conditionName) => {
        setIsLoading(true);
        setError(null);
        const conditionData = claimPackage.find(c => c.name === conditionName);
        if (!conditionData) { setError("Condition data not found."); setIsLoading(false); return; }
        const logs = symptomLogs[conditionName] || [];
        const logSummary = logs.length > 0 ? `Symptom Logs: ${logs.slice(0, 5).map(l => `On ${l.date}, severity was ${l.severity}/10 with impact: '${l.impact}' and notes: '${l.notes}'`).join('; ')}` : "No symptom logs available.";
        const notesSummary = `Claim Notes: In-service event: ${conditionData.notes?.inServiceEvent || 'not specified'}. Current Symptoms: ${conditionData.notes?.symptoms || 'not specified'}. Work Impact: ${conditionData.notes?.workImpact || 'not specified'}. Personal Life Impact: ${conditionData.notes?.personalImpact || 'not specified'}.`;
        const prompt = `You are an expert AI assistant creating a personalized C&P Exam Preparation Guide for a veteran claiming "${conditionName}". Use the following veteran-provided data to generate the guide: - Condition Data: ${JSON.stringify(conditionData)} - ${logSummary} - ${notesSummary} Generate the response as a single, valid JSON object with keys for each section of the guide. DO NOT include any text outside the JSON object. The JSON structure must be: { "disclaimer": "...", "examinerAssessment": "...", "goalExplanation": "...", "dbqInfo": "...", "actionPlan": ["..."], "personalScript": ["..."], "examDayCommunication": ["..."], "afterExamSteps": ["..."], "commonQuestions": ["..."], "dbqSections": [{"sectionTitle": "...", "questions": ["..."]}] }`;
        const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${GOOGLE_AI_API_KEY}`;
        const payload = { contents: [{ role: "user", parts: [{ text: prompt }] }], generationConfig: { responseMimeType: "application/json" } };
        try {
            const response = await fetch(apiUrl, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) });
            if (!response.ok) throw new Error(`API Error: ${response.status}`);
            const result = await response.json();
            if (result.candidates && result.candidates.length > 0) {
                const parsedJson = JSON.parse(result.candidates[0].content.parts[0].text);
                setPrepData(prev => ({ ...prev, [conditionName]: parsedJson }));
            } else { throw new Error("No content received from AI."); }
        } catch (e) {
            setError(`Failed to generate prep guide: ${e.message}`);
        } finally {
            setIsLoading(false);
        }
    };

    const handleChecklistToggle = (itemText) => {
        setUserData(prev => {
            const newProgress = { ...(prev.checklistProgress?.[selectedCondition] || {}) };
            newProgress[itemText] = !newProgress[itemText];
            return { ...prev, checklistProgress: { ...(prev.checklistProgress || {}), [selectedCondition]: newProgress } };
        });
    };
    
    const handleSetReminder = (taskTitle) => {
        const newAppointment = { id: Date.now(), title: `Reminder: ${taskTitle}`, date: new Date().toISOString().slice(0, 10), time: '', location: 'Home', condition: selectedCondition, notes: `Preparation task for ${selectedCondition} C&P exam.` };
        setUserData(prev => ({ ...prev, appointments: [...(prev.appointments || []), newAppointment] }));
        setToast(`Reminder for "${taskTitle}" added to your calendar!`);
        if (setPage) setPage('appointments');
    };
    
    const currentPrepData = prepData[selectedCondition];
    const currentChecklist = checklistProgress[selectedCondition] || {};
    const totalTasks = currentPrepData?.actionPlan?.length || 0;
    const completedTasks = Object.values(currentChecklist).filter(Boolean).length;
    const progressPercentage = totalTasks > 0 ? (completedTasks / totalTasks) * 100 : 0;

    return (
        <div className="font-sans">
            {toast && <div className="fixed top-20 right-5 bg-green-500 text-white py-2 px-4 rounded-lg shadow-lg z-50">{toast}</div>}
            
            <div className="bg-white dark:bg-slate-900 p-6 rounded-lg shadow-md mb-6">
                <h1 className="text-3xl font-bold text-slate-900 dark:text-white mb-2">C&P Exam Preparation Guide</h1>
                <PrepInstructions />
                <div className="mt-4">
                    <label htmlFor="condition-select" className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-1">Select a condition to prepare for:</label>
                    <select id="condition-select" value={selectedCondition || ''} onChange={(e) => setSelectedCondition(e.target.value)} className="w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-[#c62727] focus:border-[#c62727] dark:bg-slate-800 dark:border-slate-600 dark:text-slate-200">
                        {claimPackage.length > 0 ? claimPackage.map(c => <option key={c.name} value={c.name}>{c.name}</option>) : <option>Add a claim to the Claim Builder first</option>}
                    </select>
                </div>
            </div>

            <div className="relative">
                {!isPro && <PremiumFeatureBlocker setPage={setPage} />}
                
                <div className={!isPro ? 'blur-sm pointer-events-none' : ''}>
                    {isLoading && <div className="text-center p-10"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#c62727] mx-auto"></div><p className="mt-4 dark:text-slate-400">Generating your personalized guide for {selectedCondition}...</p></div>}
                    {error && <div className="bg-red-100 text-red-700 p-4 rounded-lg dark:bg-red-900/40 dark:text-red-300">{error}</div>}

                    {!isLoading && currentPrepData && (
                        <main id="cp-prep-content" className="space-y-8">
                            <div className="bg-[#fefafa] dark:bg-red-900/30 border-l-4 border-[#c62727] dark:border-red-500 text-[#c62727] dark:text-red-300 p-6 rounded-r-lg shadow-md">
                                <h2 className="flex items-center gap-3 font-bold text-xl mb-3">Foundational Rule</h2>
                                <p className="text-sm">{currentPrepData.disclaimer}</p>
                            </div>

                            <div className="bg-white dark:bg-slate-900 p-6 rounded-lg shadow-md">
                                <h2 className="text-xl font-bold text-[#c62727] mb-4">Action Plan Checklist</h2>
                                <div className="w-full bg-gray-200 dark:bg-slate-700 rounded-full h-2.5 mb-4">
                                    <div className="bg-green-600 h-2.5 rounded-full" style={{ width: `${progressPercentage}%` }}></div>
                                </div>
                                <p className="text-sm text-gray-600 dark:text-slate-400 mb-4">{completedTasks} of {totalTasks} tasks completed.</p>
                                <ul className="space-y-3">
                                    {(currentPrepData.actionPlan || []).map((item, i) => (
                                        <li key={i} className="flex items-center justify-between p-3 bg-slate-50 dark:bg-slate-800 rounded-md">
                                            <div className="flex items-center">
                                                <input type="checkbox" checked={!!currentChecklist[item]} onChange={() => handleChecklistToggle(item)} className="h-5 w-5 rounded text-[#c62727] focus:ring-[#c62727] mr-3"/>
                                                <span className={`text-sm ${currentChecklist[item] ? 'line-through text-gray-400 dark:text-slate-500' : 'text-gray-800 dark:text-slate-300'}`}>{item}</span>
                                            </div>
                                            <button onClick={() => handleSetReminder(item)} className="text-xs font-semibold text-blue-600 dark:text-blue-400 hover:underline ml-4">Set Reminder</button>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                            
                            <DBQExplorer dbqSections={currentPrepData.dbqSections} conditionName={selectedCondition} userData={userData} setUserData={setUserData} />
                            <PracticeQuestionSection questions={currentPrepData.commonQuestions} conditionName={selectedCondition} userData={userData} setUserData={setUserData} />
                            <PostExamReflection conditionName={selectedCondition} userData={userData} setUserData={setUserData} />
                            
                            <div className="bg-slate-50 dark:bg-slate-800 p-6 rounded-lg shadow-md">
                                <h2 className="text-xl font-bold text-[#c62727] mb-4">Helpful Resources</h2>
                                <ul className="list-disc list-outside space-y-2 text-sm pl-5">
                                    <li><a href="https://www.benefits.va.gov/compensation/dbq_publicdbqs.asp" target="_blank" rel="noopener noreferrer" className="text-blue-600 dark:text-blue-400 hover:underline inline-flex items-center gap-1">Official VA DBQ Forms <ExternalLinkIcon className="w-4 h-4" /></a></li>
                                    <li><a href="https://www.youtube.com/results?search_query=VA+C%26P+exam+tips" target="_blank" rel="noopener noreferrer" className="text-blue-600 dark:text-blue-400 hover:underline inline-flex items-center gap-1">C&P Exam Tip Videos on YouTube <ExternalLinkIcon className="w-4 h-4" /></a></li>
                                </ul>
                            </div>
                        </main>
                    )}
                </div>
            </div>
        </div>
    );
}
