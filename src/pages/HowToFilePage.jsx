import React, { useState } from 'react';
import { Card, Button } from '../components';
import { ExternalLinkIcon, TrendingUpIcon, Share2Icon, ShieldCheckIcon, ChevronDownIcon, CheckSquareIcon, AlertTriangleIcon } from '../icons';

const ClaimTypeCard = ({ icon, title, description, onSelect }) => (
    <div className="bg-white dark:bg-slate-900 dark:border dark:border-slate-700 rounded-lg shadow-lg p-8 text-center flex flex-col items-center hover:shadow-xl transition-shadow duration-300">
        <div className="mb-4 text-red-600">{icon}</div>
        <h3 className="text-xl font-bold text-slate-800 dark:text-slate-100 mb-2">{title}</h3>
        <p className="text-slate-600 dark:text-slate-400 text-sm mb-6 flex-grow">{description}</p>
        <Button onClick={onSelect} variant="primary" className="w-full">View Filing Steps</Button>
    </div>
);

const ClaimTypeGuide = ({ title, steps, checklist, forms, vaLink, onBack }) => (
    <Card>
        <div className="space-y-8">
            <div>
                <h3 className="text-2xl font-bold text-slate-800 dark:text-slate-100">{title}</h3>
                <ol className="list-decimal list-outside space-y-6 pl-5 mt-4">
                    {steps.map((step, index) => (
                        <li key={index}>
                            <p className="font-semibold text-slate-700 dark:text-slate-200">{step.title}</p>
                            <p className="text-slate-600 dark:text-slate-400 mt-1">{step.description}</p>
                            {step.action && <div className="mt-2">{step.action}</div>}
                        </li>
                    ))}
                </ol>
            </div>
            
            <div>
                <h4 className="text-xl font-bold text-slate-800 dark:text-slate-100 mb-3">Document Checklist</h4>
                <ul className="space-y-2">
                    {checklist.map((item, index) => (
                        <li key={index} className="flex items-start"><CheckSquareIcon className="w-5 h-5 text-green-600 mr-3 mt-0.5 flex-shrink-0"/> <span className="text-slate-600 dark:text-slate-400">{item}</span></li>
                    ))}
                </ul>
            </div>

            <div>
                <h4 className="text-xl font-bold text-slate-800 dark:text-slate-100 mb-3">Essential VA Forms</h4>
                <ul className="space-y-3">
                    {forms.map((form, index) => (
                        <li key={index} className="flex items-center justify-between p-3 bg-slate-50 dark:bg-slate-800 rounded-md">
                            <div>
                                <p className="font-semibold text-slate-700 dark:text-slate-200">{form.name}</p>
                                <p className="text-sm text-slate-500 dark:text-slate-400">{form.description}</p>
                            </div>
                            <a href={form.link} target="_blank" rel="noopener noreferrer"><Button variant="secondary" className="flex-shrink-0 ml-4">Download</Button></a>
                        </li>
                    ))}
                </ul>
            </div>

            <div className="mt-6 pt-6 border-t border-gray-200 dark:border-slate-700 flex flex-col sm:flex-row gap-4">
                <a href={vaLink} target="_blank" rel="noopener noreferrer" className="w-full sm:w-auto">
                    <Button variant="primary" className="w-full">
                        Start Your Claim on VA.gov <ExternalLinkIcon className="ml-2 w-4 h-4" />
                    </Button>
                </a>
                <Button onClick={onBack} variant="secondary" className="w-full sm:w-auto">
                    Back to All Guides
                </Button>
            </div>
        </div>
    </Card>
);

const AccordionSection = ({ title, children }) => {
    const [isOpen, setIsOpen] = useState(false);
    return (
        <Card>
            <button onClick={() => setIsOpen(!isOpen)} className="w-full flex justify-between items-center text-left">
                <h3 className="text-xl font-bold text-slate-800 dark:text-slate-100">{title}</h3>
                <ChevronDownIcon className={`transition-transform duration-300 dark:text-slate-400 ${isOpen ? 'rotate-180' : ''}`} />
            </button>
            {isOpen && <div className="mt-4 pt-4 border-t border-gray-200 dark:border-slate-700 text-slate-600 dark:text-slate-400">{children}</div>}
        </Card>
    );
};

export default function HowToFilePage({ setPage }) {
    const [selectedGuide, setSelectedGuide] = useState(null);

    const formsData = {
        intent: { name: "VA Form 21-0966 (Intent to File)", description: "Secures your effective date, locking in the earliest possible start date for your benefits.", link: "https://www.va.gov/find-forms/about-form-21-0966/" },
        application: { name: "VA Form 21-526EZ (Application for Disability Compensation)", description: "The primary form used to file claims for disability benefits.", link: "https://www.va.gov/find-forms/about-form-21-526ez/" },
        statement: { name: "VA Form 21-4138 (Statement in Support of Claim)", description: "Used for your Personal Statements or for Buddy/Lay Statements.", link: "https://www.va.gov/find-forms/about-form-21-4138/" }
    };

    const guides = {
        increase: {
            title: "Filing for an Increase",
            icon: <TrendingUpIcon className="w-12 h-12"/>,
            description: "Your condition has worsened, and you believe you qualify for a higher disability rating.",
            steps: [
                { title: "Review Increase Criteria", description: "Go to the 'Conditions Overview' page to compare your current symptoms against the VA's criteria for a higher rating.", action: <Button variant="secondary" onClick={() => setPage('conditionsOverview')}>Go to Conditions Overview</Button> },
                { title: "Document Worsening Symptoms", description: "Use the 'Symptom Tracker' to create a detailed log showing a clear pattern of increased severity, frequency, or duration.", action: <Button variant="secondary" onClick={() => setPage('symptomTracker')}>Go to Symptom Tracker</Button> },
                { title: "Generate Supporting Statements", description: "Use the 'Document Generation' tool to create a 'Personal Statement' and a 'Work Impact Statement' detailing how your condition has worsened.", action: <Button variant="secondary" onClick={() => setPage('documentTemplates')}>Go to Document Generation</Button> }
            ],
            checklist: ["Medical records showing the condition has worsened", "Symptom logs from our tracker", "A detailed Personal Statement (VA Form 21-4138)", "Buddy/Lay statements describing the increased impact"],
            forms: [formsData.intent, formsData.application, formsData.statement],
            vaLink: "https://www.va.gov/disability/how-to-file-claim/"
        },
        secondary: {
            title: "Filing for a Secondary Condition",
            icon: <Share2Icon className="w-12 h-12"/>,
            description: "You have a new condition that was caused or aggravated by an existing service-connected disability.",
            steps: [
                { title: "Identify the Link", description: "The key is to prove the new condition was caused by your existing service-connected disability. Our 'Conditions Overview' page can help you identify potential links.", action: <Button variant="secondary" onClick={() => setPage('conditionsOverview')}>Go to Conditions Overview</Button> },
                { title: "Obtain a Medical Nexus", description: "A 'Nexus Letter' from a medical professional is crucial. Use our 'Document Generation' tool to create a template for your doctor to review, edit, and sign.", action: <Button variant="secondary" onClick={() => setPage('documentTemplates')}>Generate Nexus Template</Button> },
                { title: "Gather Lay Evidence", description: "Generate 'Buddy/Lay Statements' for friends or family to complete. These witness statements provide powerful, non-medical evidence of your new condition's impact.", action: <Button variant="secondary" onClick={() => setPage('documentTemplates')}>Generate Buddy Statement</Button> }
            ],
            checklist: ["A signed Nexus Letter from a medical professional", "Current medical records for the secondary condition", "Personal Statement explaining the connection and impact", "Buddy/Lay Statements"],
            forms: [formsData.intent, formsData.application, formsData.statement],
            vaLink: "https://www.va.gov/disability/how-to-file-claim/"
        },
        presumptive: {
            title: "Filing for a Presumptive Condition",
            icon: <ShieldCheckIcon className="w-12 h-12"/>,
            description: "You have a condition that the VA automatically presumes is related to your military service.",
            steps: [
                { title: "Confirm Eligibility", description: "Enter your service dates on the 'Calculator' page. Our tool will check for eligibility under programs like the PACT Act or Agent Orange exposure.", action: <Button variant="secondary" onClick={() => setPage('calculator')}>Go to Calculator</Button> },
                { title: "Get a Current Diagnosis", description: "For presumptive claims, a current diagnosis of the condition from a medical professional is the most critical piece of evidence you can provide." },
                { title: "Describe Your Symptoms", description: "While the link to service is presumed, you must still show the condition's impact. Use 'Document Generation' to create a 'Personal Statement' detailing your symptoms.", action: <Button variant="secondary" onClick={() => setPage('documentTemplates')}>Generate Personal Statement</Button> }
            ],
            checklist: ["DD-214 or other proof of service in a qualifying location/period", "Medical records showing a current diagnosis", "Personal Statement describing the severity of your symptoms"],
            forms: [formsData.intent, formsData.application, formsData.statement],
            vaLink: "https://www.va.gov/disability/how-to-file-claim/"
        }
    };

    const activeGuide = selectedGuide ? guides[selectedGuide] : null;

    return (
        <div className="max-w-7xl mx-auto">
            <h1 className="text-3xl font-bold text-slate-900 dark:text-white mb-4">How to File a Claim</h1>
            <p className="text-slate-600 dark:text-slate-400 mb-8">This guide provides a step-by-step roadmap for preparing and filing your claim using the tools on this site. Select the type of claim you are filing to get started.</p>

            {activeGuide ? (
                <ClaimTypeGuide 
                    title={activeGuide.title} 
                    steps={activeGuide.steps} 
                    checklist={activeGuide.checklist}
                    forms={activeGuide.forms}
                    vaLink={activeGuide.vaLink}
                    onBack={() => setSelectedGuide(null)} 
                />
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {Object.keys(guides).map(key => (
                        <ClaimTypeCard 
                            key={key}
                            icon={guides[key].icon}
                            title={guides[key].title}
                            description={guides[key].description}
                            onSelect={() => setSelectedGuide(key)}
                        />
                    ))}
                </div>
            )}

            <div className="mt-12 space-y-4">
                <AccordionSection title="Tips for a Strong Claim">
                    <ul className="list-disc list-outside space-y-3 pl-5">
                        <li><strong>Be Specific and Honest:</strong> Never exaggerate, but do not downplay your symptoms. Instead of saying "my back hurts," describe how it impacts you: "My back pain prevents me from standing for more than 10 minutes, making it difficult to cook dinner."</li>
                        <li><strong>Connect the Dots (Nexus):</strong> For non-presumptive claims, clearly explain how your condition is connected to your service. A Nexus Letter from a doctor is the strongest way to do this.</li>
                        <li><strong>Organize Your Evidence:</strong> Submit your evidence in a clean, organized manner. Use our Document Generation tool to create clear, consistently formatted statements.</li>
                        <li><strong>Use the VA's Language:</strong> Pay attention to the criteria for your rating on the 'Conditions Overview' page. Describing your symptoms in terms of "frequency, duration, and severity" helps the VA rater make a decision.</li>
                    </ul>
                </AccordionSection>

                <AccordionSection title="Common Mistakes to Avoid">
                    <ul className="list-disc list-outside space-y-3 pl-5">
                        <li><strong>Missing an "Intent to File":</strong> Filing an Intent to File (VA Form 21-0966) sets your effective date, which can secure you months or even years of back pay. Do this first.</li>
                        <li><strong>Lack of a Current Diagnosis:</strong> The VA cannot rate a condition that hasn't been formally diagnosed by a medical professional. Make sure your medical records contain a recent, clear diagnosis.</li>
                        <li><strong>Vague Statements:</strong> Statements that are not specific are less effective. Use the Symptom Tracker and your detailed notes from the Claim Builder to provide concrete examples.</li>
                        <li><strong>Ignoring Negative Evidence:</strong> Do not hide evidence that may seem unfavorable. It is better to address it head-on in your personal statement and provide context.</li>
                    </ul>
                </AccordionSection>
                
                <AccordionSection title="Frequently Asked Questions (FAQs)">
                    <div className="space-y-4">
                        <div>
                            <p className="font-semibold text-slate-700 dark:text-slate-200">How long does a claim take?</p>
                            <p>Timelines vary greatly, but as of 2024-2025, many initial claims are processed in 4-6 months. Using all available tools to submit a well-developed claim can help avoid delays.</p>
                        </div>
                        <div>
                            <p className="font-semibold text-slate-700 dark:text-slate-200">What happens after I file?</p>
                            <p>After filing, the VA will review your claim. They will likely schedule you for one or more Compensation & Pension (C&P) exams. Our C&P Exam Prep page can help you prepare.</p>
                        </div>
                         <div>
                            <p className="font-semibold text-slate-700 dark:text-slate-200">What if my claim is denied?</p>
                            <p>You have options. You can file for a Higher-Level Review, a Supplemental Claim (if you have new evidence), or an appeal to the Board of Veterans' Appeals. Our 'Higher-Level Review Request' template can help you get started.</p>
                        </div>
                    </div>
                </AccordionSection>
            </div>
        </div>
    );
}