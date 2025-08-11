import React, { useState } from 'react';
import { Button, Card, Input } from '../components';

// --- NEW AMPLIFY IMPORTS (CORRECTED) ---
import { signUp, confirmSignUp, signIn, updateUserAttributes } from 'aws-amplify/auth';
import { DataStore } from '@aws-amplify/datastore'; // <-- CORRECTED IMPORT PATH
import { UserProfile } from '../models/index.js';

export default function SignUpPage({ setPage }) {
    const [formData, setFormData] = useState({ name: '', email: '', password: '', verificationCode: '' });
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [isSignedUp, setIsSignedUp] = useState(false);

    const handleFormSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        setError('');
        try {
            const { isSignUpComplete, nextStep } = await signUp({
                username: formData.email,
                password: formData.password,
                options: {
                    userAttributes: {
                        email: formData.email,
                        name: formData.name,
                    },
                },
            });

            if (nextStep.signUpStep === 'CONFIRM_SIGN_UP') {
                setIsSignedUp(true);
                // You might want a toast message here: showToast('Verification code sent to your email!');
            } else if (isSignUpComplete) {
                // If autoSignIn is true and no verification, user is signed in directly.
                // App.jsx's Hub listener for 'signedIn' will handle navigation and profile creation.
            }

        } catch (authError) {
            console.error("Amplify sign up error:", authError);
            setError(`Failed to create an account: ${authError.message || 'Please check your details and try again.'}`);
        } finally {
            setIsLoading(false);
        }
    };

    const handleConfirmSignUp = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        setError('');
        try {
            const { isSignUpComplete, nextStep } = await confirmSignUp({
                username: formData.email,
                confirmationCode: formData.verificationCode,
            });

            if (isSignUpComplete) {
                await signIn({ username: formData.email, password: formData.password });
                // App.jsx's Hub listener for 'signedIn' will handle the rest.
            } else {
                console.log('Confirmation next step:', nextStep);
                setError('Confirmation failed. Please try again or check your code.');
            }
        } catch (error) {
            console.error("Amplify confirm sign up error:", error);
            setError(`Confirmation failed: ${error.message || 'Please check your code and try again.'}`);
        } finally {
            setIsLoading(false);
        }
    };

    // The createUserProfile function in App.jsx will handle initial UserProfile creation on first login.
    // So, no need for it directly in SignUpPage.jsx unless you have a specific reason.

    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-50 dark:bg-slate-900">
            <div className="w-full max-w-md p-8">
                <div className="mb-8 text-center">
                    <img src="https://i.ibb.co/YB8HrVsD/VALogo1.png" alt="VA Claims Pro Logo" className="h-14 w-auto mx-auto" />
                </div>
                <Card>
                    {!isSignedUp ? (
                        <form onSubmit={handleFormSubmit} className="space-y-6">
                            <h2 className="text-2xl font-bold text-center text-gray-800 dark:text-slate-100">Create Your Free Account</h2>
                            <Input label="Full Name" name="name" type="text" value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} required />
                            <Input label="Email Address" name="email" type="email" value={formData.email} onChange={(e) => setFormData({...formData, email: e.target.value})} required />
                            <Input label="Password" name="password" type="password" value={formData.password} onChange={(e) => setFormData({...formData, password: e.target.value})} required />
                            {error && <p className="text-red-500 text-sm text-center">{error}</p>}
                            <Button type="submit" className="w-full" disabled={isLoading}>{isLoading ? 'Creating Account...' : 'Create Account'}</Button>
                        </form>
                    ) : (
                        <form onSubmit={handleConfirmSignUp} className="space-y-6">
                            <h2 className="text-2xl font-bold text-center text-gray-800 dark:text-slate-100">Verify Your Email</h2>
                            <p className="text-center text-sm text-slate-600 dark:text-slate-400">
                                A verification code has been sent to {formData.email}. Please enter it below.
                            </p>
                            <Input label="Verification Code" name="verificationCode" type="text" value={formData.verificationCode} onChange={(e) => setFormData({...formData, verificationCode: e.target.value})} required />
                            {error && <p className="text-red-500 text-sm text-center">{error}</p>}
                            <Button type="submit" className="w-full" disabled={isLoading}>{isLoading ? 'Verifying...' : 'Confirm Account'}</Button>
                            {/* Optionally, add a resend code button */}
                        </form>
                    )}
                </Card>
                <p className="text-center text-sm text-slate-600 dark:text-slate-400 mt-6">
                    Already have an account?{' '}
                    <button onClick={() => setPage('login')} className="font-semibold text-blue-600 hover:underline dark:text-blue-400">
                        Sign In
                    </button>
                </p>
            </div>
        </div>
    );
}