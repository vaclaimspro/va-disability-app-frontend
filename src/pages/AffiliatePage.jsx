import React from 'react';
import { Card } from '../components';

export default function AffiliatePage({ setPage }) {
    return (
        <div className="bg-white text-gray-800">
            {/* Header */}
            <header className="bg-white/30 backdrop-blur-lg shadow-sm sticky top-0 z-50">
                <div className="container mx-auto px-6 py-4 flex justify-between items-center">
                    <div className="flex items-center space-x-3">
                        <button onClick={() => setPage('landing')} className="flex items-center space-x-3">
                            <img src="https://i.ibb.co/YB8HrVsD/VALogo1.png" alt="VA Claims Pro Logo" className="h-12 w-auto" />
                        </button>
                    </div>
                    <div className="flex items-center space-x-4">
                        <button onClick={() => setPage('login')} className="text-gray-600 hover:text-[#c62727] font-semibold text-sm">
                            Login
                        </button>
                        <button onClick={() => setPage('signup')} className="cta-button bg-[#c62727] text-white font-semibold py-2 px-5 rounded-lg text-sm shadow-md hover:bg-red-800 transition-colors">
                            Get Started Free
                        </button>
                    </div>
                </div>
            </header>

            {/* Main Content */}
            <main className="max-w-6xl mx-auto px-4 py-16">
                <Card title="Partner with VA Claims Pro">
                    <div className="p-6 space-y-6 text-slate-600 dark:text-slate-300 prose dark:prose-invert max-w-none">
                        <p>Join our mission to empower veterans by becoming an affiliate partner. If you create content for veterans or have an audience that could benefit from our tools, we invite you to apply. Our program is managed through Rewardful, ensuring reliable tracking, timely payments, and a seamless experience for you.</p>

                        <h2 className="font-bold text-xl text-slate-800 dark:text-slate-100">Why Partner with Us?</h2>
                        <ul>
                            <li><strong>Generous Commissions:</strong> Earn a competitive, recurring commission for every customer you refer to our Premium AI plan.</li>
                            <li><strong>Help Veterans:</strong> Promote a product that makes a real difference in the lives of veterans by helping them secure the benefits they've earned.</li>
                            <li><strong>Powered by Rewardful:</strong> Get the peace of mind that comes with a best-in-class affiliate platform. Track your performance and get paid on time, every time.</li>
                            <li><strong>Marketing Assets:</strong> Gain access to our library of professionally designed banners, links, and promotional materials to help you succeed.</li>
                        </ul>

                        <h2 className="font-bold text-xl text-slate-800 dark:text-slate-100">How It Works</h2>
                        <ol>
                            <li><strong>Sign Up:</strong> Apply to our program through our Rewardful-powered portal. The process is quick and easy.</li>
                            <li><strong>Share Your Link:</strong> Once approved, you’ll receive a unique referral link. Share it on your website, blog, newsletter, or social media channels.</li>
                            <li><strong>Earn Commissions:</strong> You’ll earn a commission for every visitor who clicks your link and signs up for a paid plan.</li>
                        </ol>

                        <div className="text-center pt-6">
                             <a href="#" className="cta-button bg-[#c62727] text-white font-bold py-3 px-8 rounded-lg text-lg shadow-xl no-underline">
                                Become an Affiliate Today
                            </a>
                        </div>
                    </div>
                </Card>
            </main>

            {/* Footer */}
            <footer className="bg-[#002458] text-white py-16">
                <div className="container mx-auto px-6 text-center">
                    <img src="https://i.ibb.co/75002Dq/VAClaims-Logo-WHITE.png" alt="VA Claims Pro Logo" className="h-12 w-auto mx-auto mb-4" />
                    <p className="text-gray-400 max-w-xl mx-auto mb-8">Ready to Find Out What You’re Owed? Don’t settle. Don’t wonder. Take control of your VA claim—today.</p>
                    <div className="flex justify-center items-center gap-4 mb-8">
                        <button onClick={() => setPage('signup')} className="cta-button bg-[#c62727] text-white font-bold py-3 px-8 rounded-lg text-base shadow-xl">
                            Try VAClaimsPro Free
                        </button>
                    </div>
                    <div className="flex justify-center space-x-6 mb-8 text-sm">
                        <button onClick={() => setPage('landing')} className="text-gray-300 hover:text-white">Home</button>
                        <button onClick={() => setPage('privacy')} className="text-gray-300 hover:text-white">Privacy Policy</button>
                        <button onClick={() => setPage('terms')} className="text-gray-300 hover:text-white">Terms of Use</button>
                        <button onClick={() => setPage('affiliate')} className="text-gray-300 hover:text-white font-bold">Affiliates</button>
                    </div>
                    <p className="text-xs text-gray-500">&copy; {new Date().getFullYear()} VA Claims Pro. All Rights Reserved. <br/>This site is not affiliated with the U.S. Department of Veterans Affairs.</p>
                </div>
            </footer>
        </div>
    );
}