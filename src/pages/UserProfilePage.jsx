import React, { useState, useEffect } from 'react';
// --- NEW AMPLIFY IMPORTS ---
import { getCurrentUser, updateUserAttributes } from 'aws-amplify/auth';
import { DataStore } from '@aws-amplify/datastore'; // <-- Add DataStore import
import { post } from '@aws-amplify/api';

// Import Components and Icons (no change)
import { Card, Button, Input, Select } from '../components';
import { SaveIcon, ExternalLinkIcon } from '../icons';

// Import UserProfile model
import { UserProfile } from '../models/index.js'; // <-- Add UserProfile model import

const API_NAME = 'vadisabilityapp20bfae195'; // Ensure this matches your Lambda function's resource name

export default function UserProfilePage({ user, userData, setUserData, setPage }) {
    const [personalInfo, setPersonalInfo] = useState({
        name: userData?.fullName || '',
        email: userData?.email || ''
    });
    const [militaryInfo, setMilitaryInfo] = useState(userData?.militaryInfo || { branch: '', rank: '' });
    const [goals, setGoals] = useState(userData?.goals || '');
    const [toastMessage, setToastMessage] = useState('');
    const [error, setError] = useState('');
    const [isBillingLoading, setIsBillingLoading] = useState(false);

    useEffect(() => {
        if (userData) {
            setPersonalInfo({
                name: userData.fullName || '',
                email: userData.email || ''
            });
            setMilitaryInfo(userData.militaryInfo || { branch: '', rank: '' });
            setGoals(userData.goals || '');
        }
    }, [userData]);

    const showToast = (message) => {
        setToastMessage(message);
        setTimeout(() => setToastMessage(''), 3000);
    };

    const handleSave = async (section) => {
        setError('');

        try {
            if (!user) {
                throw new Error("User not authenticated.");
            }

            let updatedUserAttributes = {};
            let updatedProfileModel = { ...userData };

            if (section === 'personal') {
                if (user.attributes?.name !== personalInfo.name) {
                    updatedUserAttributes.name = personalInfo.name;
                }
                if (user.attributes?.email !== personalInfo.email) {
                    updatedUserAttributes.email = personalInfo.email;
                }

                if (Object.keys(updatedUserAttributes).length > 0) {
                    const { nextStep } = await updateUserAttributes({
                        userAttributes: updatedUserAttributes
                    });
                    if (nextStep.updateAttributeStep === 'CONFIRM_ATTRIBUTE_WITH_CODE') {
                        showToast('Email update requires verification. Check your inbox!');
                    } else {
                        showToast('Personal info saved!');
                    }
                } else {
                    showToast('Personal info saved!');
                }

                updatedProfileModel = { ...updatedProfileModel, fullName: personalInfo.name, email: personalInfo.email };
                setPersonalInfo(personalInfo);
            } else if (section === 'military') {
                updatedProfileModel = { ...updatedProfileModel, militaryInfo: militaryInfo };
                setMilitaryInfo(militaryInfo);
            } else if (section === 'goals') {
                updatedProfileModel = { ...updatedProfileModel, goals: goals };
                setGoals(goals);
            }

            if (userData && updatedProfileModel) {
                 await DataStore.save(
                    UserProfile.copyOf(userData, updated => {
                        updated.fullName = updatedProfileModel.fullName;
                        updated.email = updatedProfileModel.email;
                        updated.militaryInfo = updatedProfileModel.militaryInfo;
                        updated.goals = updatedProfileModel.goals;
                    })
                );
            }

            showToast(`${section.charAt(0).toUpperCase() + section.slice(1)} information saved!`);

        } catch (error) {
            console.error("Error saving profile:", error);
            setError(`Failed to save. Error: ${error.message || error.code}`);
        }
    };

    const handleManageBilling = async () => {
        setIsBillingLoading(true);
        setError('');
        try {
          if (!userData?.stripeCustomerId) {
            throw new Error('No Stripe customer on file yet. Please subscribe first.');
          }
          const rest = post({
            apiName: API_NAME,
            path: '/stripe/create-billing-portal-link',
            options: {
              body: {
                customerId: userData.stripeCustomerId,
                returnUrl: window.location.origin + '/membership',
              },
            },
          });
          const { body } = await rest.response;
          const data = await body.json();
          if (!data?.url) throw new Error('API did not return a portal URL');
          window.location.assign(data.url);
        } catch (e) {
          console.error('Billing portal error:', e);
          setError(e.message || 'Unable to open billing portal.');
        } finally {
          setIsBillingLoading(false);
        }
      };
      
    return (
        <div className="space-y-6">
            {toastMessage &&
                <div className="fixed top-20 right-5 bg-green-600 text-white py-2 px-4 rounded-lg shadow-lg z-50 animate-fade-in-out">
                    {toastMessage}
                </div>
            }

            <h1 className="text-3xl font-bold text-slate-900 dark:text-white">Your Account</h1>

            <Card title="Personal Information">
                {error &&
                    <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-4" role="alert">
                        <p className="font-bold">Error</p>
                        <p>{error}</p>
                    </div>
                }
                <div className="space-y-4">
                    <Input label="Full Name" name="name" type="text" value={personalInfo.name} onChange={(e) => setPersonalInfo({...personalInfo, name: e.target.value})} />
                    <Input label="Email Address" name="email" type="email" value={personalInfo.email} onChange={(e) => setPersonalInfo({...personalInfo, email: e.target.value})} />
                </div>
                <div className="mt-6 border-t dark:border-slate-700 pt-4 flex justify-end">
                    <Button onClick={() => handleSave('personal')}><SaveIcon className="mr-2"/> Save Personal Info</Button>
                </div>
            </Card>

            <Card title="Military Service">
                <div className="space-y-4">
                    <Select label="Branch of Service" value={militaryInfo.branch} onChange={(e) => setMilitaryInfo({...militaryInfo, branch: e.target.value})}>
                        <option value="">Select a branch...</option>
                        <option value="Army">Army</option>
                        <option value="Marine Corps">Marine Corps</option>
                        <option value="Navy">Navy</option>
                        <option value="Air Force">Air Force</option>
                        <option value="Space Force">Space Force</option>
                        <option value="Coast Guard">Coast Guard</option>
                    </Select>
                    <Input label="Rank (e.g., Sergeant, SGT, E-5)" name="rank" type="text" value={militaryInfo.rank} onChange={(e) => setMilitaryInfo({...militaryInfo, rank: e.target.value})} />
                    <div>
                        <label className="text-sm font-medium text-gray-700 dark:text-slate-300">Service Dates (EOD/RAD)</label>
                        <p className="text-gray-600 dark:text-slate-400 p-2 bg-gray-50 dark:bg-slate-800 rounded-md mt-1">
                            {/* Assuming serviceDates is directly on userData (UserProfile) or needs to be fetched differently */}
                            {userData?.serviceDates?.eod && userData?.serviceDates?.rad ?
                            `${userData.serviceDates.eod} to ${userData.serviceDates.rad}` :
                            'Not set. Please add on the Calculator page.'}
                        </p>
                    </div>
                </div>
                <div className="mt-6 border-t dark:border-slate-700 pt-4 flex justify-end">
                    <Button onClick={() => handleSave('military')}><SaveIcon className="mr-2"/> Save Service Info</Button>
                </div>
            </Card>

            <Card title="Membership & Billing">
                <div className="flex items-center justify-between">
                    <div>
                        <p className="font-semibold dark:text-slate-200">Current Plan:
                            <span className={`font-bold ml-2 ${userData?.membershipStatus === 'Pro' ? 'text-green-500' : 'text-blue-600 dark:text-blue-400'}`}>
                                {userData?.membershipStatus}
                            </span>
                        </p>
                        <p className="text-sm text-gray-500 dark:text-slate-400 mt-1">Manage your subscription and view payment history.</p>
                    </div>
                    <div>
                        {userData?.membershipStatus === 'Pro' ? (
                            <Button onClick={handleManageBilling} variant="secondary" disabled={isBillingLoading}>
                                {isBillingLoading ? 'Loading...' : 'Manage Subscription'}
                                <ExternalLinkIcon className="ml-2 w-4 h-4"/>
                            </Button>
                        ) : (
                            <Button onClick={() => setPage('membership')} variant="primary">
                                Upgrade to Pro
                                <ExternalLinkIcon className="ml-2 w-4 h-4"/>
                            </Button>
                        )}
                    </div>
                </div>
            </Card>

            <Card title="Personalization">
                <label className="text-sm font-medium text-gray-700 dark:text-slate-300 block mb-1">My Goals</label>
                <p className="text-sm text-gray-500 dark:text-slate-400 mb-2">Help us personalize your content. What are you hoping to achieve?</p>
                <textarea
                    value={goals}
                    onChange={(e) => setGoals(e.target.value)}
                    rows="4"
                    className="w-full p-2 border border-gray-300 rounded-md dark:bg-slate-800 dark:border-slate-600 dark:text-slate-300"
                    placeholder="e.g., 'File for tinnitus,' 'Increase my back rating...'"
                />
                <div className="mt-6 border-t dark:border-slate-700 pt-4 flex justify-end">
                    <Button onClick={() => handleSave('goals')}><SaveIcon className="mr-2"/> Save Goals</Button>
                </div>
            </Card>
        </div>
    );
}