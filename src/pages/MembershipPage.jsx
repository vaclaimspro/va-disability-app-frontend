import React, { useState, useEffect } from 'react';
import { getCurrentUser } from 'aws-amplify/auth';
import { DataStore } from '@aws-amplify/datastore';
import { post } from '@aws-amplify/api';
import { UserSubscription, UserProfile } from '../models/index.js';
import { Card, Button } from '../components';
import { CheckCircleIcon, ExternalLinkIcon } from '../icons';

const API_NAME = 'apistripeapi';

export default function MembershipPage({ userData, setPage, isStripeCustomerReady }) {
    const [isLoading, setIsLoading] = useState(false);
    const [isPro, setIsPro] = useState(false);
    const [isStatusLoading, setIsStatusLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        if (userData && userData.membershipStatus === 'Pro') {
            setIsPro(true);
        } else {
            setIsPro(false);
        }
        setIsStatusLoading(false);
    }, [userData]);

    const features = [
        "Unlimited AI-Powered Analysis",
        "Generate All Document Types",
        "Track Unlimited Claims",
        "Advanced C&P Exam Prep Guides",
        "Priority Support"
    ];

    const subscribeAndPay = async () => {
        setIsLoading(true);
        setError(null);
        try {
            const user = await getCurrentUser();
            if (!user) {
                throw new Error('User not authenticated.');
            }
            const restOperation = post({
                apiName: API_NAME,
                path: '/stripe/create-checkout-session',
                options: {
                    body: {
                        userId: user.userId,
                        priceId: "price_1Rt7qcGx5e4THAKThtB0CObv", // IMPORTANT: This is a placeholder. Use your actual Stripe Price ID.
                        successUrl: window.location.origin + '?upgrade=success',
                        cancelUrl: window.location.origin + '?upgrade=cancelled',
                    },
                },
            });
            const { body } = await restOperation.response;
            const result = await body.json();
            if (result?.url) {
                window.location.assign(result.url);
            } else {
                throw new Error("No checkout URL returned from backend.");
            }
        } catch (err) {
            console.error('Error creating checkout session:', err);
            setError('Failed to create checkout session: ' + err.message);
        } finally {
            setIsLoading(false);
        }
    };

    const manageBilling = async () => {
        setIsLoading(true);
        setError(null);
        try {
            const user = await getCurrentUser();
            if (!user) {
                throw new Error('User not authenticated.');
            }
            const restOperation = post({
                apiName: API_NAME,
                path: '/stripe/create-billing-portal-link',
                options: {
                    body: { userId: user.userId },
                },
            });
            const { body } = await restOperation.response;
            const result = await body.json();
            if (!result?.url) {
                throw new Error('No portal URL returned from backend.');
            }
            window.location.assign(result.url);
        } catch (err) {
            console.error('Billing portal error:', err);
            setError('Unable to open billing portal: ' + (err.message || 'Unknown error'));
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        const urlParams = new URLSearchParams(window.location.search);
        const upgradeStatus = urlParams.get('upgrade');
        if (upgradeStatus === 'success') {
            window.history.replaceState({}, document.title, window.location.pathname);
        } else if (upgradeStatus === 'cancelled') {
            window.history.replaceState({}, document.title, window.location.pathname);
            setError('Checkout was cancelled. You can try again anytime.');
        }
    }, []);

    if (isStatusLoading) {
        return (
            <div className="flex flex-col items-center justify-center p-10">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600 mb-4"></div>
                <p className="text-slate-600 dark:text-slate-400">Loading subscription status...</p>
            </div>
        );
    }

    return (
        <div className="max-w-4xl mx-auto">
            <h1 className="text-3xl font-bold text-slate-900 dark:text-white mb-4">
                {isPro ? 'Your Membership' : 'Upgrade Your Plan'}
            </h1>
            <p className="text-slate-600 dark:text-slate-400 mb-8">
                {isPro
                    ? 'Thank you for your support! You can manage your subscription below.'
                    : 'Unlock the full power of VA Claims Pro to build your strongest possible claim.'
                }
            </p>
            {error && (
                <div className="mb-6 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
                    <p className="text-red-700 dark:text-red-400 text-sm">{error}</p>
                    <button
                        onClick={() => setError(null)}
                        className="mt-2 text-red-600 dark:text-red-400 hover:text-red-800 dark:hover:text-red-300 text-sm underline"
                    >
                        Dismiss
                    </button>
                </div>
            )}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
                <Card className="dark:bg-slate-900">
                    <h3 className="text-2xl font-bold text-slate-800 dark:text-slate-100">Pro Monthly</h3>
                    <p className="text-slate-500 dark:text-slate-400 mt-2">All features, cancel anytime.</p>
                    <p className="text-4xl font-extrabold text-slate-900 dark:text-white my-6">
                        $29.00 <span className="text-base font-medium text-slate-500">/ month</span>
                    </p>
                    <ul className="space-y-3">
                        {features.map((feature, i) => (
                            <li key={i} className="flex items-center">
                                <CheckCircleIcon className="w-5 h-5 text-green-500 mr-2 flex-shrink-0" />
                                <span className="text-slate-600 dark:text-slate-300">{feature}</span>
                            </li>
                        ))}
                    </ul>
                </Card>
                <Card className="dark:bg-slate-900">
                    {isPro ? (
                        <>
                            <h3 className="text-xl font-bold text-slate-800 dark:text-slate-100 mb-4">
                                Subscription Active ✅
                            </h3>
                            <p className="text-slate-600 dark:text-slate-400 mb-6">
                                Manage your subscription, view invoices, and update your payment method.
                            </p>
                            <Button
                                onClick={manageBilling}
                                className="w-full mb-4"
                                disabled={isLoading}
                            >
                                {isLoading ? 'Loading...' : 'Manage Billing'}
                                <ExternalLinkIcon className="ml-2 w-4 h-4" />
                            </Button>
                        </>
                    ) : (
                        <>
                            <h3 className="text-xl font-bold text-slate-800 dark:text-slate-100 mb-4">
                                Complete Your Upgrade
                            </h3>
                            <p className="text-slate-600 dark:text-slate-400 mb-6">
                                Click below to complete your payment on our secure checkout page.
                            </p>
                            <Button
                                onClick={subscribeAndPay}
                                className="w-full mb-4"
                                disabled={isLoading}
                            >
                                {isLoading
                                    ? 'Processing...'
                                    : 'Subscribe & Pay'}
                            </Button>
                        </>
                    )}
                </Card>
            </div>
        </div>
    );
}
