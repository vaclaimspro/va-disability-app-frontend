import React from 'react';
import { Button, Card } from '../components';
import { HomeIcon, PlusCircleIcon, ActivityIcon, FileTextIcon, SendIcon } from '../icons';

export default function GetStartedPage({ setPage }) {
    const roadmapSteps = [
        { step: 1, title: "Start with the Calculator", description: "Go to the Calculator page to enter your current disability ratings. You can upload a VA document for automatic extraction or add them manually. This is the foundation of your profile.", page: 'calculator', buttonLabel: 'the Calculator' },
        { step: 2, title: "Build Your Claim Package", description: "After analyzing your conditions, head to the Claim Builder. Here, you'll add potential new claims and fill out detailed notes that will power your document templates.", page: 'claimBuilder', buttonLabel: 'Claim Builder' },
        { step: 3, title: "Track Your Symptoms", description: "Use the Symptom Tracker daily. Consistent, detailed logs are powerful evidence for the VA. This data will be automatically used in your generated documents.", page: 'symptomTracker', buttonLabel: 'Symptom Tracker' },
        { step: 4, title: "Generate Your Documents", description: "Once you have detailed notes in the Claim Builder, go to the Document Generation page. Create personalized, pre-filled statements and letters ready for your claim submission.", page: 'documentTemplates', buttonLabel: 'Document Generation' },
        { step: 5, title: "File Your Claim", description: "Once your evidence is prepared, use our step-by-step guide to navigate the submission process on VA.gov and file your claim with confidence.", page: 'howToFile', buttonLabel: 'the How to File Guide' }
    ];

    return (
        <div className="max-w-6xl mx-auto">
            <div className="text-center mb-12">
                <h1 className="text-4xl font-extrabold text-slate-900 dark:text-white mb-4">Welcome to VA Claims Pro</h1>
                <p className="text-lg text-slate-600 dark:text-slate-400">Your all-in-one toolkit for building a stronger, evidence-based VA disability claim. Let's get started.</p>
            </div>

            <Card className="dark:bg-slate-900 dark:border-slate-700">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
                    <div className="bg-slate-800 dark:bg-slate-950 rounded-lg aspect-video flex items-center justify-center p-4">
                        <div className="text-center">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-slate-500 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                            <p className="text-slate-400 mt-2 text-sm">Video guide coming soon</p>
                        </div>
                    </div>
                    <div>
                        <h2 className="text-2xl font-bold text-slate-800 dark:text-slate-100 mb-3">Watch the Quick Start Guide</h2>
                        <p className="text-slate-600 dark:text-slate-400">
                            This short video will walk you through the essential features of the platform, from calculating your rating to generating personalized documents for your claim.
                        </p>
                    </div>
                </div>
            </Card>

            <div className="mt-12">
                <h2 className="text-3xl font-bold text-slate-900 dark:text-white text-center mb-8">Your Roadmap to a Stronger Claim</h2>
                <div className="space-y-8">
                    {roadmapSteps.map((item) => (
                        <Card key={item.step} className="flex items-start space-x-6 dark:bg-slate-900 dark:border-slate-700">
                            <div className="flex-shrink-0 w-12 h-12 bg-red-100 text-red-700 rounded-full flex items-center justify-center font-bold text-xl">
                                {item.step}
                            </div>
                            <div>
                                <h3 className="text-xl font-bold text-slate-800 dark:text-slate-100 mb-2">{item.title}</h3>
                                <p className="text-slate-600 dark:text-slate-400 mb-4">{item.description}</p>
                                <Button onClick={() => setPage(item.page)} variant="secondary">
                                    Go to {item.buttonLabel}
                                </Button>
                            </div>
                        </Card>
                    ))}
                </div>
            </div>
        </div>
    );
}