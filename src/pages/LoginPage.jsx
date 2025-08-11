import React, { useState } from 'react';
// --- REMOVE FIREBASE IMPORTS ---
// import { auth } from '../firebase';
// import { signInWithEmailAndPassword, sendPasswordResetEmail } from 'firebase/auth';

// --- NEW AMPLIFY IMPORTS ---
import { signIn, resetPassword, autoSignIn } from 'aws-amplify/auth'; // Import signIn and resetPassword
// No need to import other specific services like DataStore here unless this page directly uses them beyond auth

export default function LoginPage({ setPage }) {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [message, setMessage] = useState('');
    const [isLoading, setIsLoading] = useState(false); // Add loading state

    const handleLogin = async (e) => { // Made async
        e.preventDefault();
        setError('');
        setMessage('');
        setIsLoading(true); // Set loading true

        if (!email || !password) {
            setError('Please enter both email and password.');
            setIsLoading(false); // Reset loading
            return;
        }

        try {
            // --- AMPLIFY SIGN IN ---
            // 'username' typically maps to email for Cognito User Pools configured to sign in with email
            const { isSignedIn, nextStep } = await signIn({
                username: email,
                password: password,
            });

            if (isSignedIn) {
                // The Hub listener in App.jsx will detect 'signedIn' and handle redirection/user data fetching.
                console.log('Signed in successfully via Amplify Auth.');
            } else {
                // Handle various next steps, e.g., MFA, force change password
                console.log('Sign-in requires further steps:', nextStep.signInStep);
                // You might want to update UI to prompt for MFA code etc.
                setError(`Sign-in requires further action: ${nextStep.signInStep}`); // Provide user feedback
            }
        } catch (amplifyError) {
            console.error("Amplify sign in error:", amplifyError);
            if (amplifyError.name === 'UserNotFoundException' || amplifyError.name === 'NotAuthorizedException') {
                setError('Invalid email or password. Please try again.');
            } else if (amplifyError.name === 'EmptySignInUsernameException' || amplifyError.name === 'EmptySignInPasswordException') {
                 setError('Please enter both email and password.');
            } else {
                setError('An error occurred during login. Please try again later.');
            }
        } finally {
            setIsLoading(false); // Reset loading
        }
    };

    const handlePasswordReset = async () => { // Made async
        setError('');
        setMessage('');
        setIsLoading(true); // Set loading true

        if (!email) {
            setError('Please enter your email address to reset your password.');
            setIsLoading(false); // Reset loading
            return;
        }

        try {
            // --- AMPLIFY PASSWORD RESET ---
            const { nextStep } = await resetPassword({ username: email }); // username is usually email

            if (nextStep.resetPasswordStep === 'CONFIRM_RESET_PASSWORD_WITH_CODE') {
                setMessage('A password reset link has been sent to your email address. Please check your inbox and follow the instructions.');
            } else {
                setMessage('If an account with this email exists, a reset link has been sent.');
            }
        } catch (amplifyError) {
            console.error("Amplify password reset error:", amplifyError);
            // We usually don't reveal if email exists for security reasons, similar to Firebase
            setMessage('If an account with this email exists, a reset link has been sent.');
        } finally {
            setIsLoading(false); // Reset loading
        }
    };

    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-50 dark:bg-slate-900 px-4">
            <div className="w-full max-w-md">
                <div className="flex justify-center mb-12">
                    <img
                        src="https://i.ibb.co/YB8HrVsD/VALogo1.png"
                        alt="VetClaim Pro Logo"
                        className="w-48 mx-auto"
                    />
                </div>
                <div className="bg-white dark:bg-slate-800 rounded-lg shadow-lg p-8">
                    <h2 className="text-2xl font-bold text-center text-slate-800 dark:text-white mb-6">
                        Welcome Back
                    </h2>
                    
                    {error && <p className="bg-red-100 text-red-700 p-3 rounded-md text-sm mb-4">{error}</p>}
                    {message && <p className="bg-green-100 text-green-700 p-3 rounded-md text-sm mb-4">{message}</p>}

                    <form onSubmit={handleLogin} className="space-y-6">
                        <div>
                            <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-slate-300">
                                Email Address
                            </label>
                            <input
                                id="email"
                                name="email"
                                type="email"
                                autoComplete="email"
                                required
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="mt-1 block w-full px-3 py-2 bg-white dark:bg-slate-700 border border-gray-300 dark:border-slate-600 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-red-500 focus:border-red-500"
                            />
                        </div>

                        <div>
                            <div className="flex items-center justify-between">
                                <label htmlFor="password"className="block text-sm font-medium text-gray-700 dark:text-slate-300">
                                    Password
                                </label>
                                <button
                                    type="button" // Important: type="button" to prevent form submission
                                    onClick={handlePasswordReset}
                                    className="text-sm text-red-600 hover:text-red-500 font-medium"
                                    disabled={isLoading} // Disable during loading
                                >
                                    Forgot password?
                                </button>
                            </div>
                            <input
                                id="password"
                                name="password"
                                type="password"
                                autoComplete="current-password"
                                required
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="mt-1 block w-full px-3 py-2 bg-white dark:bg-slate-700 border border-gray-300 dark:border-slate-600 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-red-500 focus:border-red-500"
                            />
                        </div>

                        <div>
                            <button
                                type="submit"
                                className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                                disabled={isLoading} // Disable during loading
                            >
                                {isLoading ? 'Signing In...' : 'Sign in'}
                            </button>
                        </div>
                    </form>

                    <p className="mt-6 text-center text-sm text-gray-600 dark:text-slate-400">
                        Don't have an account?{' '}
                        <button onClick={() => setPage('signup')} className="font-medium text-red-600 hover:text-red-500">
                            Sign up
                        </button>
                    </p>
                </div>
            </div>
        </div>
    );
}