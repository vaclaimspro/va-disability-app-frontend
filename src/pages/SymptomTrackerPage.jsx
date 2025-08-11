import React, { useState } from 'react';
import { ChevronDownIcon } from '../icons';
import { Button } from '../components';
import { DataStore } from '@aws-amplify/datastore'; // Import DataStore for userData updates
import { UserProfile } from '../models/index.js'; // Import UserProfile model

const TrackerInstructions = () => {
    return (
        <div className="bg-blue-50 dark:bg-blue-900/40 border-l-4 border-blue-400 dark:border-blue-600 p-6 rounded-r-lg mb-6 text-sm">
            <h2 className="font-bold text-lg text-blue-900 dark:text-blue-200 mb-2">Building a Strong Evidence Record</h2>
            <p className="text-blue-800 dark:text-blue-300 mb-4">
                Consistently documenting your symptoms is one of the most powerful steps you can take to support your claim. A detailed log creates a clear history of your condition's impact on your daily life, which is a key factor the VA considers. Provide as much detail as possible in each entry.
            </p>
            <p className="font-semibold text-blue-900 dark:text-blue-200 mb-2">Helpful Phrases to Describe Your Symptoms:</p>
            <ul className="list-disc list-outside space-y-1 pl-5 text-blue-700 dark:text-blue-300/80">
                <li>
                    <strong>For Frequency:</strong> Describe how often symptoms occur (e.g., "constant," "frequent," "intermittent," "episodes happen 4-5 times a week").
                </li>
                <li>
                    <strong>For Duration:</strong> Note how long an episode lasts (e.g., "lasts for several hours," "all day," "a few minutes at a time").
                </li>
                <li>
                    <strong>For Type of Pain:</strong> Use descriptive words (e.g., "sharp, stabbing pain," "dull, aching," "burning sensation," "radiating down my leg," "numbness and tingling").
                </li>
                <li>
                    <strong>For Functional Impact:</strong> Explain how it affects your life (e.g., "unable to lift groceries," "prevents me from standing for more than 10 minutes," "interferes with my ability to concentrate at work," "forces me to lie down").
                </li>
            </ul>
        </div>
    );
};


const SeverityScale = ({ severity, onSeverityChange }) => {
    const scale = [
        { value: 1, color: 'bg-green-300' }, { value: 2, color: 'bg-green-400' },
        { value: 3, color: 'bg-green-500' }, { value: 4, color: 'bg-yellow-400' },
        { value: 5, color: 'bg-yellow-500' }, { value: 6, color: 'bg-orange-400' },
        { value: 7, color: 'bg-orange-500' }, { value: 8, color: 'bg-red-500' },
        { value: 9, color: 'bg-red-600' }, { value: 10, color: 'bg-red-700' },
    ];

    return (
        <div>
            <label className="text-sm font-medium text-gray-700 dark:text-slate-300 block mb-2">Severity</label>
            <div className="grid grid-cols-10 gap-1">
                {scale.map(item => (
                     <div key={item.value} className="flex flex-col items-center">
                        <button
                            type="button"
                            onClick={() => onSeverityChange(item.value)}
                            className={`w-full h-10 rounded-md transition-transform transform ${item.color} ${severity === item.value ? 'ring-2 ring-offset-2 ring-blue-500 scale-110 z-10' : 'hover:scale-105'}`}
                        >
                            <span className="font-bold text-white" style={{textShadow: '1px 1px 2px rgba(0,0,0,0.5)'}}>{item.value}</span>
                        </button>
                    </div>
                ))}
            </div>
             <div className="flex justify-between mt-2 px-1">
                <span className="text-xs text-gray-500 dark:text-slate-400">Mild</span>
                <span className="text-xs text-gray-500 dark:text-slate-400">Moderate</span>
                <span className="text-xs text-gray-500 dark:text-slate-400">Severe</span>
                <span className="text-xs text-gray-500 dark:text-slate-400">Extreme</span>
            </div>
        </div>
    );
};


const SymptomLogAccordion = ({ condition, symptomLogs, setUserData, userData }) => { // Pass userData from App.jsx
    const [isOpen, setIsOpen] = useState(false);
    const [newSymptom, setNewSymptom] = useState({
        date: new Date().toISOString().split('T')[0],
        severity: 5,
        duration: '',
        impact: '',
        notes: ''
    });

    const educationalPrompts = {
        'Migraines': "For the highest ratings, the VA looks for evidence of frequent and completely 'prostrating' attacks that severely impact your ability to work. Your log should detail these moments clearly, noting how often they force you to lie down in a dark room and for how long.",
        'Anxiety': "Higher ratings for anxiety often depend on the level of social and occupational impairment. When logging, describe specific instances where anxiety prevented you from working, attending social events, or even leaving your home.",
        'Depression': "For depression, focus on how your symptoms impact your work and social life. Note days you couldn't get out of bed, instances of social withdrawal, lack of energy, or feelings of hopelessness. The VA evaluates the level of 'social and occupational impairment,' so logs showing this are critical.",
        'PTSD': "Similar to anxiety, documenting impairment is crucial for PTSD. Log specific examples of symptoms like flashbacks, hypervigilance, or avoidance behaviors. Describe how these impact your daily routines, relationships, and ability to work. For instance, 'A loud noise triggered a flashback, leaving me unable to focus at work for the rest of the day.'",
        'Back Condition': "The VA closely examines 'functional loss,' primarily your range of motion. Instead of just stating 'my back hurts,' describe the limitation. For example: 'Pain was an 8/10 when bending, could not bend forward more than 15 degrees,' or 'Unable to lift a gallon of milk from the fridge.' Note periods of flare-up where you are bedridden.",
        'Radiculopathy': "For nerve pain, be descriptive about the type and frequency of your symptoms. The VA distinguishes between mild, moderate, and severe nerve issues. Use your notes to describe the sensation (e.g., 'numbness in my first two toes,' 'burning pain down my entire leg,' 'pins and needles feeling that lasted for 3 hours'). This helps paint a clear picture of the severity.",
        'Tinnitus': "While tinnitus is typically rated at 10%, consistently logging its impact can be vital, especially for secondary claims. Describe how the ringing affects you daily. For instance: 'Ringing was so loud it was difficult to fall asleep last night,' or 'Had to ask people to repeat themselves multiple times in a meeting because the tinnitus was distracting.'",
        'Sleep Apnea': "For sleep apnea, the key factor for a higher sleep apnea rating is the medical necessity of a breathing assistance device (like a CPAP). Your log should confirm its use. A good entry would be: 'Used CPAP machine all night as prescribed. Still woke up feeling fatigued.' This documents both compliance and persistent symptoms.",
        'Irritable Bowel Syndrome (IBS)': "The VA rates IBS based on the severity of symptoms like abdominal distress, diarrhea, and constipation. For a higher rating, your log should show these symptoms are frequent and severe enough to interfere with your daily life. Note episodes of pain and how often you experience alternating diarrhea and constipation.",
        'Gastroesophageal Reflux Disease (GERD)': "For GERD, document the frequency and severity of heartburn, regurgitation, and any difficulty swallowing. Note if symptoms are worse at night or disrupt your sleep. Mentioning if you need to sleep propped up on pillows is a key detail.",
        'Insomnia': "The VA evaluates insomnia based on its effects. It's not just about lack of sleep, but the daytime consequences. Log how many hours you slept and, crucially, how you felt the next day. Examples: 'Slept only 3 hours, felt exhausted all day.' 'Couldn’t focus at work due to fatigue.' 'Felt irritable and disconnected from my family after a sleepless night.'",
        'Hyperacusis': "For hyperacusis, focus on how sensitivity to everyday sounds impacts your life. Document specific instances of pain or discomfort from sounds like a closing door, dishes clanking, or a ringing phone. Note any avoidance behaviors, such as wearing earplugs constantly or avoiding social situations.",
        'Default': "For any condition, the key is to document the frequency, duration, and severity of your symptoms, and most importantly, their impact on your daily life and ability to work. This pattern of evidence is crucial for the VA."
    };
    
    const getPromptForCondition = (conditionName) => {
        const lowerCaseName = conditionName.toLowerCase();
        const keywordMap = {
            'migraine': 'Migraines', 'anxiety': 'Anxiety', 'depression': 'Depression', 'ptsd': 'PTSD', 'back': 'Back Condition', 'radiculopathy': 'Radiculopathy',
            'tinnitus': 'Tinnitus', 'sleep apnea': 'Sleep Apnea', 'ibs': 'Irritable Bowel Syndrome (IBS)', 'irritable bowel': 'Irritable Bowel Syndrome (IBS)',
            'gerd': 'Gastroesophageal Reflux Disease (GERD)', 'reflux': 'Gastroesophageal Reflux Disease (GERD)', 'insomnia': 'Insomnia', 'hyperacusis': 'Hyperacusis'
        };
        for (const keyword in keywordMap) {
            if (lowerCaseName.includes(keyword)) { return educationalPrompts[keywordMap[keyword]]; }
        }
        return educationalPrompts['Default'];
    };

    const currentPrompt = getPromptForCondition(condition.name);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setNewSymptom(prev => ({ ...prev, [name]: value }));
    };

    // --- AMPLIFY MODIFICATION: Add Symptom Log to DataStore ---
    const handleAddSymptom = async (e) => {
        e.preventDefault();
        if (!newSymptom.notes.trim() || !newSymptom.date) { // Ensure required fields are present
            alert("Please provide a date and notes for your symptom log.");
            return;
        }

        const logToAdd = { ...newSymptom, id: Date.now() }; // Add unique ID for the log
        
        try {
            // Update the symptomLogs field on the UserProfile model
            await DataStore.save(
                UserProfile.copyOf(userData, updated => {
                    const currentLogsForCondition = updated.symptomLogs?.[condition.name] || [];
                    updated.symptomLogs = {
                        ...updated.symptomLogs,
                        [condition.name]: [...currentLogsForCondition, logToAdd]
                    };
                })
            );
            setNewSymptom({ date: new Date().toISOString().split('T')[0], severity: 5, duration: '', impact: '', notes: '' });
            setIsOpen(true); // Keep accordion open after adding
        } catch (error) {
            console.error("Error adding symptom log to DataStore:", error);
            alert("Failed to save symptom log. " + error.message);
        }
    };
    
    const downloadCSV = () => {
        // Access symptomLogs from props, which should be the specific condition's logs
        if (!symptomLogs || symptomLogs.length === 0) return;
        const headers = "Date,Severity,Duration,Impact on Daily Activities,Notes\n";
        // Ensure all log properties exist before accessing
        const rows = symptomLogs.map(log => `"${log.date || ''}","${log.severity || ''}","${log.duration || ''}","${log.impact || ''}","${(log.notes || '').replace(/"/g, '""')}"`).join("\n");
        const csvContent = "data:text/csv;charset=utf-8," + headers + rows;
        const encodedUri = encodeURI(csvContent);
        const link = document.createElement("a");
        link.setAttribute("href", encodedUri);
        link.setAttribute("download", `${condition.name.replace(/\s+/g, '_')}_symptom_log.csv`);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    return (
        <div className="bg-white dark:bg-slate-900 rounded-lg shadow">
            <div className="flex items-center p-4 cursor-pointer" onClick={() => setIsOpen(!isOpen)}>
                <h2 className="text-xl font-bold text-gray-800 dark:text-slate-100 flex-1">{condition.name}</h2>
                <span className="text-sm font-medium text-gray-500 dark:text-slate-400 mr-4">{(symptomLogs || []).length} Entries</span> {/* Add null check */}
                <ChevronDownIcon className={`transition-transform duration-300 dark:text-slate-400 ${isOpen ? 'rotate-180' : ''}`} />
            </div>

            {isOpen && (
                <div className="p-6 border-t border-gray-200 dark:border-slate-700">
                    <div className="bg-yellow-50 dark:bg-yellow-900/40 border-l-4 border-yellow-400 dark:border-yellow-600 p-4 mb-6 rounded-r-lg">
                        <h4 className="font-bold text-yellow-800 dark:text-yellow-200">Pro Tip for Logging {condition.name}</h4>
                        <p className="text-sm text-yellow-700 dark:text-yellow-300 mt-1">{currentPrompt}</p>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <form onSubmit={handleAddSymptom} className="space-y-4">
                             <div>
                                <label htmlFor="date" className="text-sm font-medium text-gray-700 dark:text-slate-300 block mb-1">Date</label>
                                <input type="date" name="date" value={newSymptom.date} onChange={handleInputChange} className="w-full p-2 border border-gray-300 dark:border-slate-600 dark:bg-slate-800 dark:text-slate-300 rounded-md"/>
                            </div>
                            <SeverityScale severity={newSymptom.severity} onSeverityChange={(value) => setNewSymptom(prev => ({ ...prev, severity: value }))} />
                            <div>
                                <label htmlFor="duration" className="text-sm font-medium text-gray-700 dark:text-slate-300 block mb-1">Duration</label>
                                <input type="text" name="duration" value={newSymptom.duration} onChange={handleInputChange} className="w-full p-2 border border-gray-300 dark:border-slate-600 dark:bg-slate-800 dark:text-slate-300 rounded-md" placeholder='e.g., "2 hours", "All day"'/>
                            </div>
                            <div>
                                <label htmlFor="impact" className="text-sm font-medium text-gray-700 dark:text-slate-300 block mb-1">Impact on Daily Activities</label>
                                <input type="text" name="impact" value={newSymptom.impact} onChange={handleInputChange} className="w-full p-2 border border-gray-300 dark:border-slate-600 dark:bg-slate-800 dark:text-slate-300 rounded-md" placeholder="e.g., 'Had to leave work early'"/>
                            </div>
                            <div>
                                <label htmlFor="notes" className="text-sm font-medium text-gray-700 dark:text-slate-300 block mb-1">Notes</label>
                                <textarea name="notes" value={newSymptom.notes} onChange={handleInputChange} rows="3" className="w-full p-2 border border-gray-300 dark:border-slate-600 dark:bg-slate-800 dark:text-slate-300 rounded-md" placeholder="Describe the symptom, what triggered it, etc."></textarea>
                            </div>
                            <Button type="submit" variant="primary">Add Log</Button>
                        </form>
                        <div>
                            {(symptomLogs || []).length > 0 ? ( // Add null check
                                <>
                                    <div className="space-y-3 max-h-96 overflow-y-auto pr-2 border-b dark:border-slate-700 pb-4 mb-4">
                                        {symptomLogs.sort((a, b) => new Date(b.date) - new Date(a.date)).map(log => (
                                            <div key={log.id} className="p-3 bg-gray-50 dark:bg-slate-800 rounded-lg text-sm">
                                                <p className="font-bold text-gray-800 dark:text-slate-200">{new Date(log.date).toLocaleDateString()}</p>
                                                <p className="dark:text-slate-300"><strong>Severity:</strong> {log.severity}/10, <strong>Duration:</strong> {log.duration}</p>
                                                <p className="dark:text-slate-300"><strong>Impact:</strong> {log.impact}</p>
                                                <p className="mt-1 italic text-gray-600 dark:text-slate-400">"{log.notes}"</p>
                                            </div>
                                        ))}
                                    </div>
                                    <Button onClick={downloadCSV} variant="green">Download CSV</Button>
                                </>
                            ) : <p className="text-sm text-gray-500 dark:text-slate-400 text-center pt-16">No symptoms logged yet.</p>}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};


export default function SymptomTrackerPage({ userData, setUserData }) {
    const { claimPackage = [], symptomLogs = {} } = userData || {}; // Add null checks and default empty objects

    return (
        <div className="font-sans">
            <h1 className="text-3xl font-bold text-slate-900 dark:text-white mb-2">Symptom Tracker</h1>
            <TrackerInstructions />

            <div className="space-y-4">
                {(claimPackage || []).length > 0 ? ( // Add null check
                    claimPackage.map(condition => (
                        <SymptomLogAccordion 
                            key={condition.name}
                            condition={condition}
                            symptomLogs={symptomLogs[condition.name] || []}
                            setUserData={setUserData}
                            userData={userData} // Pass userData for DataStore save
                        />
                    ))
                ) : (
                    <div className="text-center py-10 border-2 border-dashed border-gray-300 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-900">
                        <p className="text-sm text-gray-500 dark:text-slate-400">No conditions are being tracked.</p>
                        <p className="text-xs text-gray-400 dark:text-slate-500 mt-1">Go to the "Claim Builder" to add conditions to track.</p>
                    </div>
                )}
            </div>
        </div>
    );
}