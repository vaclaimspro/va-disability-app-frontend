import React, { useEffect } from 'react';
import { Card } from '../components';

export default function AffiliateDashboardPage({ user }) {
    useEffect(() => {
        // This function contains the logic to initialize and render the portal.
        const initializeAndRenderPortal = () => {
            // Ensure the user object and the global 'rewardful' function are available.
            if (user && window.rewardful) {
                // The 'ready' callback ensures that the Rewardful script is fully loaded and initialized.
                window.rewardful('ready', function() {
                    // This is the critical function that finds the portal div and renders the affiliate dashboard.
                    // If an affiliate account exists for this user, this will display it.
                    if (window.Rewardful && typeof window.Rewardful.render === 'function') {
                        window.Rewardful.render();
                    }

                    // This part associates the user's session with their email for referral tracking,
                    // but only if a referral isn't already being tracked.
                    if (window.Rewardful && !window.Rewardful.referral) {
                        window.rewardful('convert', { email: user.email });
                    }
                });
            }
        };

        // The Rewardful script might load after this component has already rendered.
        // We need to handle both cases: script is already ready, or we need to wait for it.

        if (window.rewardful && window.Rewardful?.isReady) {
            // Scenario 1: The script is already good to go. Call our function immediately.
            initializeAndRenderPortal();
        } else {
            // Scenario 2: The script is not ready. We add a one-time event listener.
            // This listener will wait for the 'rewardful-ready' event that the script fires when it's done loading.
            const handleRewardfulReady = () => {
                initializeAndRenderPortal();
            };
            document.addEventListener('rewardful-ready', handleRewardfulReady, { once: true });

            // It's good practice to have a cleanup function to remove the event listener
            // if the user navigates away from the page before the script loads.
            return () => {
                document.removeEventListener('rewardful-ready', handleRewardfulReady);
            };
        }
    }, [user]); // This effect will re-run if the user object changes.

    return (
        <div className="max-w-6xl mx-auto">
            <Card title="Affiliate Program Dashboard">
                <div className="p-6">
                    <p className="mb-6 text-slate-600 dark:text-slate-300">Welcome to your affiliate dashboard. Here you can track your referrals, view your commissions, and access your unique sharing links. Thank you for helping us empower more veterans!</p>
                    {/* This div is the target where Rewardful will inject the affiliate portal content. It must be present. */}
                    <div data-rewardful-portal="3503fd"></div>
                </div>
            </Card>
        </div>
    );
}
