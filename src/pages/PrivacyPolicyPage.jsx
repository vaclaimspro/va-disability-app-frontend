import React from 'react';
import { Card } from '../components';

export default function PrivacyPolicyPage({ setPage }) {
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
                <Card title="Privacy Policy">
                    <div className="p-6 space-y-6 text-slate-600 dark:text-slate-300 prose dark:prose-invert max-w-none">
                        <p><strong>Effective Date:</strong> August 1, 2025</p>
                        <p>
                            This Privacy Policy outlines how VAClaimsPro (“we,” “our,” or “us”) collects, uses, and protects your personal information across our website, applications, and services (collectively, the “Platform”).
                        </p>

                        <h2 className="font-bold text-xl text-slate-800 dark:text-slate-100">1. Acceptance of Privacy Policy</h2>
                        <p>
                            By accessing or using VAClaimsPro’s Platform, you accept this Privacy Policy and any future updates. If you do not agree with our policy, please discontinue use of our services.
                            We may revise this policy from time to time. Notice of significant changes will be posted on the Platform or sent via email. Continued use of the Platform after such changes means you accept the new terms.
                        </p>

                        <h2 className="font-bold text-xl text-slate-800 dark:text-slate-100">2. Information We Collect</h2>
                        <h3 className="font-semibold">Personal Information</h3>
                        <p>We may collect the following information when you use VAClaimsPro:</p>
                        <ul>
                            <li>Name and contact information (email address, phone number, mailing address)</li>
                            <li>Account credentials (username, password)</li>
                            <li>Military and medical records or details, if you choose to provide them</li>
                            <li>Social Security Number (handled with strict security; deleted regularly)</li>
                            <li>Payment details (processed securely via third-party providers such as Stripe)</li>
                            <li>Usage data (such as device type, browser, IP address, time of access, and activity logs)</li>
                        </ul>
                        <h3 className="font-semibold">Usage Data & Device Information</h3>
                        <p>
                            We automatically collect data about how you interact with the Platform for performance, troubleshooting, and improvement purposes.
                        </p>
                        <h3 className="font-semibold">Social Media Integrations</h3>
                        <p>
                            If you connect your account using a third-party social login (such as Google), we may access certain information as authorized by your privacy settings on those platforms.
                        </p>

                        <h2 className="font-bold text-xl text-slate-800 dark:text-slate-100">3. How We Use Your Information</h2>
                        <p>We use your information to:</p>
                        <ul>
                            <li>Provide, maintain, and improve our Platform and services</li>
                            <li>Process account registration and manage your user profile</li>
                            <li>Send important updates, communications, and security alerts</li>
                            <li>Respond to your support inquiries</li>
                            <li>Offer relevant features, promotions, or updates (with your consent)</li>
                            <li>Analyze and understand usage trends for product improvement</li>
                            <li>Fulfill legal and contractual obligations</li>
                        </ul>

                        <h2 className="font-bold text-xl text-slate-800 dark:text-slate-100">4. How We Share Your Information</h2>
                        <p>Your information may be shared:</p>
                        <ul>
                            <li>With trusted service providers (for data processing, analytics, support, payment processing, or communications)</li>
                            <li>With affiliates or business partners, as required for delivering services</li>
                            <li>In connection with business transactions such as mergers, acquisitions, or asset sales</li>
                            <li>To comply with legal requirements or protect our rights, users, or the public</li>
                            <li>With your explicit consent, for any other specified purpose</li>
                        </ul>

                        <h2 className="font-bold text-xl text-slate-800 dark:text-slate-100">5. Data Security</h2>
                        <p>
                            We take data security seriously and implement commercially reasonable safeguards to protect your personal information. However, no method of transmission or storage is completely secure, and we cannot guarantee absolute security.
                        </p>

                        <h2 className="font-bold text-xl text-slate-800 dark:text-slate-100">6. Children’s Privacy</h2>
                        <p>
                            VAClaimsPro does not knowingly collect personal information from children under 13. If you believe a child has provided us information without parental consent, please contact us so we can promptly delete it.
                        </p>

                        <h2 className="font-bold text-xl text-slate-800 dark:text-slate-100">7. Retention and International Transfer</h2>
                        <p>
                            Your data is retained only as long as necessary for our business purposes and legal requirements. Information may be processed in locations outside your jurisdiction, subject to adequate data protection standards.
                        </p>

                        <h2 className="font-bold text-xl text-slate-800 dark:text-slate-100">8. Links to Third-Party Sites</h2>
                        <p>
                            Our Platform may contain links to third-party websites. We are not responsible for the privacy practices or content of those sites. Please review their privacy policies before providing personal information.
                        </p>

                        <h2 className="font-bold text-xl text-slate-800 dark:text-slate-100">9. Your Rights</h2>
                        <p>
                            You may request to review, correct, or delete your personal information at any time by contacting us at support@vaclaimspro.com.
                        </p>

                        <h2 className="font-bold text-xl text-slate-800 dark:text-slate-100">10. Contact Us</h2>
                        <p>
                            If you have any questions about this Privacy Policy or our data practices, please reach out to us at:
                            <br />
                            VAClaimsPro
                            <br />
                            Email: support@vaclaimspro.com
                        </p>

                        <p>This policy was last updated on August 1, 2025.</p>
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
                        <button onClick={() => setPage('privacy')} className="text-gray-300 hover:text-white font-bold">Privacy Policy</button>
                    </div>
                    <p className="text-xs text-gray-500">&copy; {new Date().getFullYear()} VA Claims Pro. All Rights Reserved. <br/>This site is not affiliated with the U.S. Department of Veterans Affairs.</p>
                </div>
            </footer>
        </div>
    );
}