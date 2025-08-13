import React, { useState, useEffect } from 'react';

import { getCurrentUser, signOut } from 'aws-amplify/auth';
import { Hub } from 'aws-amplify/utils';
import { get } from 'aws-amplify/api';
import { uploadData, getUrl } from 'aws-amplify/storage'; // kept if you use it elsewhere

// ---------- REST API NAME ----------
const API_NAME = import.meta.env.VITE_STRIPE_API_NAME; // FIX: Use build-time environment variable

// ---------- PAGES ----------
import LoginPage from './pages/LoginPage';
import SignUpPage from './pages/SignUpPage';
import GetStartedPage from './pages/GetStartedPage';
import CalculatorPage from './pages/CalculatorPage';
import ConditionsOverviewPage from './pages/ConditionsOverviewPage';
import ClaimBuilderPage from './pages/ClaimBuilderPage';
import DocumentTemplatesPage from './pages/DocumentTemplatesPage';
import CalendarAndTasksPage from './pages/CalendarAndTasksPage';
import SymptomTrackerPage from './pages/SymptomTrackerPage';
import UserProfilePage from './pages/UserProfilePage';
import MembershipPage from './pages/MembershipPage';
import HowToFilePage from './pages/HowToFilePage';
import CandPPrepPage from './pages/CandPPrepPage';
import LandingPage from './pages/LandingPage';
import PrivacyPolicyPage from './pages/PrivacyPolicyPage';
import TermsOfUsePage from './pages/TermsOfUsePage';
import AffiliatePage from './pages/AffiliatePage';
import AffiliateDashboardPage from './pages/AffiliateDashboardPage';

// ---------- ICONS ----------
const Icon = ({ children, className = "w-5 h-5", viewBox = "0 0 24 24", strokeWidth = 1.5 }) => ( // FIX: Changed "0 0 24" to "0 0 24 24"
    <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox={viewBox} stroke="currentColor" strokeWidth={strokeWidth} aria-hidden="true">
        {children}
    </svg>
);
const HomeIcon = (p) => <Icon {...p}><path strokeLinecap="round" strokeLinejoin="round" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"/></Icon>;
const DocumentTextIcon = (p) => <Icon {...p}><path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/></Icon>;
const PlusCircleIcon = (p) => <Icon {...p}><path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3m0 0v3m0-3h3m-3 0H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z"/></Icon>;
const ActivityIcon = (p) => <Icon {...p}><path strokeLinecap="round" strokeLinejoin="round" d="M16 8v8m-4-5v5m-4-2v2m-2 4h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"/></Icon>;
const CalendarIcon = (p) => <Icon {...p}><path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"/></Icon>;
const UserIcon = (p) => <Icon {...p}><path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"/></Icon>;
const RocketIcon = (p) => <Icon {...p}><path strokeLinecap="round" strokeLinejoin="round" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"/></Icon>;
const ClipboardCheckIcon = (p) => <Icon {...p}><path strokeLinecap="round" strokeLinejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4"/></Icon>;
const FileTextIcon = (p) => <Icon {...p}><path strokeLinecap="round" strokeLinejoin="round" d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z"/></Icon>;
const SunIcon = (p) => <Icon {...p}><path strokeLinecap="round" strokeLinejoin="round" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"/></Icon>;
const MoonIcon = (p) => <Icon {...p}><path strokeLinecap="round" strokeLinejoin="round" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"/></Icon>;
const LogOutIcon = (p) => <Icon {...p}><path strokeLinecap="round" strokeLinejoin="round" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"/></Icon>;
const MenuIcon = (p) => <Icon {...p}><path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16"/></Icon>;
const SendIcon = (p) => <Icon {...p}><path strokeLinecap="round" strokeLinejoin="round" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"/></Icon>;
const GiftIcon = (p) => <Icon {...p}><path strokeLinecap="round" strokeLinejoin="round" d="M12 8v13m0-13V6a2 2 0 112 2h-2zm0 0V5.5A2.5 2.5 0 109.5 8H12zm-7 4h14M5 12a2 2 0 110-4h14a2 2 0 110 4H5z"/></Icon>;

// ---------- COMPONENT ----------
export default function App() {
  const [page, setPage] = useState('landing');
  const [currentUser, setCurrentUser] = useState(null);
  const [userData, setUserData] = useState(null);        // profile hydrated from Cognito
  const [isAuthLoading, setIsAuthLoading] = useState(true);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [theme, setTheme] = useState('light');
  const [isStripeCustomerReady, setIsStripeCustomerReady] = useState(false);
  const [isPro, setIsPro] = useState(false);             // gate Pro features (based on membershipStatus)

  // theme toggle
  useEffect(() => {
    document.documentElement.classList.toggle('dark', theme === 'dark');
  }, [theme]);

  // hydrate profile from Cognito only (no DataStore)
  const hydrateFromCognito = (user) => {
    if (!user) {
      setUserData(null);
      setIsPro(false);
      return;
    }
    const profile = {
      fullName: user.attributes?.name || 'Veteran User',
      email: user.attributes?.email || '',
      membershipStatus: 'Free', // flip to 'Pro' after webhook if you store it
    };
    setUserData(profile);
    setIsPro(profile.membershipStatus === 'Pro');
  };

  // check Stripe customer status via your REST API
  const checkStripeCustomerStatus = async (user) => {
    if (!user?.userId) {
      setIsStripeCustomerReady(false);
      return;
    }
    try {
      const rest = get({
        apiName: 'StripeApi',
        path: '/stripe/customer-status',
        options: { queryParams: { userId: user.userId } },
      });
      const { body } = await rest.response;
      const data = await body.json();
      setIsStripeCustomerReady(Boolean(data?.stripeId));
    } catch (err) {
      console.warn('customer-status failed:', err);
      setIsStripeCustomerReady(false);
    }
  };

  // auth lifecycle
  useEffect(() => {
    const onAuth = async ({ payload: { event } }) => {
      setIsAuthLoading(true);
      try {
        if (event === 'signedIn') {
          const user = await getCurrentUser();
          setCurrentUser(user);
          hydrateFromCognito(user);
          await checkStripeCustomerStatus(user);
          if (['landing', 'login', 'signup', 'privacy', 'terms', 'affiliate'].includes(page)) {
            setPage('calculator');
          }
        } else if (event === 'signedOut') {
          setCurrentUser(null);
          hydrateFromCognito(null);
          setIsStripeCustomerReady(false);
          setPage('landing');
        }
      } finally {
        setIsAuthLoading(false);
      }
    };

    const unsub = Hub.listen('auth', onAuth);

    // initial check
    (async () => {
      try {
        const user = await getCurrentUser();
        setCurrentUser(user);
        hydrateFromCognito(user);
        await checkStripeCustomerStatus(user);
        if (['landing', 'login', 'signup', 'privacy', 'terms', 'affiliate'].includes(page)) {
          setPage('calculator');
        }
      } catch {
        setCurrentUser(null);
        hydrateFromCognito(null);
        setPage('landing');
      } finally {
        setIsAuthLoading(false);
      }
    })();

    return () => unsub();
  }, []); // run once

  const handleLogout = async () => {
    try { await signOut(); } catch (e) { console.error('Sign out error', e); }
  };

  const mainNavItems = [
    { name: 'Get Started', icon: <RocketIcon />, id: 'getStarted' },
    { name: 'Calculator', icon: <HomeIcon />, id: 'calculator' },
    { name: 'Conditions Overview', icon: <DocumentTextIcon />, id: 'conditions' },
    { name: 'Claim Builder', icon: <PlusCircleIcon />, id: 'claimBuilder' },
    { name: 'Symptom Tracker', icon: <ActivityIcon />, id: 'symptomTracker' },
    { name: 'Calendar & Tasks', icon: <CalendarIcon />, id: 'appointments' },
    { name: 'C&P Exam Prep', icon: <ClipboardCheckIcon />, id: 'candpPrep' },
    { name: 'Document Generation', icon: <FileTextIcon />, id: 'docTemplates' },
    { name: 'How to File', icon: <SendIcon />, id: 'howToFile' },
    { name: 'Affiliate Program', icon: <GiftIcon />, id: 'affiliateDashboard' },
  ];

  const NavContent = () => (
    <div className="flex flex-col h-full">
      <div className="p-4 border-b dark:border-slate-700">
        <img
          src={theme === 'dark' ? "https://i.ibb.co/75002Dq/VAClaims-Logo-WHITE.png" : "https://i.ibb.co/YB8HrVsD/VALogo1.png"}
          alt="VA Claims Pro Logo" className="h-auto w-full"
        />
      </div>
      <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
        {mainNavItems.map(item => (
          <button key={item.id} onClick={() => { setPage(item.id); setIsMobileMenuOpen(false); }}
                  className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${page === item.id ? 'bg-red-600 text-white' : 'text-slate-700 dark:text-slate-300 hover:bg-gray-100 dark:hover:bg-slate-700'}`}>
            {item.icon}<span>{item.name}</span>
          </button>
        ))}
      </nav>
      <div className="p-4 border-t dark:border-slate-700 space-y-2">
        <button onClick={() => { setPage('profile'); setIsMobileMenuOpen(false); }}
                className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${page === 'profile' ? 'bg-red-600 text-white' : 'text-slate-700 dark:text-slate-300 hover:bg-gray-100 dark:hover:bg-slate-700'}`}>
          <UserIcon className="w-5 h-5" /> My Profile
        </button>
        <button onClick={handleLogout}
                className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium text-slate-700 dark:text-slate-300 hover:bg-gray-100 dark:hover:bg-slate-700">
          <LogOutIcon className="w-5 h-5" /> Logout
        </button>
      </div>
    </div>
  );

  const Sidebar = () => (
    <aside className="hidden md:flex w-64 flex-col bg-white dark:bg-slate-900 border-r dark:border-slate-700">
      <NavContent />
    </aside>
  );

  const MobileMenu = () => !isMobileMenuOpen ? null : (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 md:hidden" onClick={() => setIsMobileMenuOpen(false)}>
      <div className="fixed top-0 left-0 h-full w-64 bg-white dark:bg-slate-900 shadow-xl flex flex-col" onClick={e => e.stopPropagation()}>
        <NavContent />
      </div>
    </div>
  );

  const Header = () => {
    const initials =
      currentUser?.username?.split(' ').map(n => n[0]).slice(0, 2).join('').toUpperCase()
      || currentUser?.attributes?.email?.charAt(0).toUpperCase()
      || '';
    return (
      <header className="flex items-center justify-between p-4 bg-white dark:bg-slate-900 border-b dark:border-slate-700">
        <div className="flex items-center gap-4">
          <button onClick={() => setIsMobileMenuOpen(true)} className="md:hidden p-2">
            <MenuIcon className="w-6 h-6 text-gray-600 dark:text-gray-300"/>
          </button>
          <div className="md:hidden">
            <img
              src={theme === 'dark' ? "https://i.ibb.co/75002Dq/VAClaims-Logo-WHITE.png" : "https://i.ibb.co/YB8HrVsD/VALogo1.png"}
              alt="VA Claims Pro Logo" className="h-8 w-auto"
            />
          </div>
        </div>
        <div className="flex items-center gap-4">
          <button onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
                  className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300">
            {theme === 'light' ? <MoonIcon/> : <SunIcon/>}
          </button>
          <div className="w-9 h-9 rounded-full bg-red-600 flex items-center justify-center text-white font-bold text-sm">
            {initials}
          </div>
        </div>
      </header>
    );
  };

  const ProGate = ({ children, featureName = 'This feature' }) =>
    isPro ? children : (
      <div className="max-w-2xl mx-auto text-center p-8 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-700">
        <h3 className="text-lg font-semibold mb-2">{featureName} is for Pro members</h3>
        <p className="text-slate-600 dark:text-slate-300 mb-6">
          Upgrade to unlock this tool instantly. Your access updates in real time after checkout.
        </p>
        <button onClick={() => setPage('membership')}
                className="inline-flex items-center justify-center px-4 py-2 rounded-lg bg-red-600 text-white hover:bg-red-700 transition">
          Upgrade to Pro
        </button>
      </div>
    );

  const renderPage = () => {
    if (!userData) {
      return (
        <div className="flex items-center justify-center h-full">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600"></div>
        </div>
      );
    }
    switch (page) {
      case 'getStarted': return <GetStartedPage setPage={setPage} />;
      case 'calculator': return <CalculatorPage userData={userData} setPage={setPage} />;
      case 'conditions': return <ConditionsOverviewPage userData={userData} setPage={setPage} />;
      case 'claimBuilder': return <ClaimBuilderPage userData={userData} setPage={setPage} />;
      case 'symptomTracker': return <SymptomTrackerPage userData={userData} />;
      case 'appointments': return <CalendarAndTasksPage userData={userData} setPage={setPage} />;
      case 'candpPrep': return <ProGate featureName="C&P Exam Prep"><CandPPrepPage userData={userData} setPage={setPage} /></ProGate>;
      case 'docTemplates': return <ProGate featureName="Document Generation"><DocumentTemplatesPage userData={userData} setPage={setPage} /></ProGate>;
      case 'howToFile': return <HowToFilePage setPage={setPage} />;
      case 'profile': return <UserProfilePage user={currentUser} userData={userData} setPage={setPage} />;
      case 'membership': return <MembershipPage userData={userData} setPage={setPage} isStripeCustomerReady={isStripeCustomerReady} />;
      case 'affiliateDashboard': return <AffiliateDashboardPage user={currentUser} />;
      default: return <GetStartedPage setPage={setPage} />;
    }
  };

  if (isAuthLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50 dark:bg-slate-900">
        <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-red-600"></div>
      </div>
    );
  }

  if (!currentUser) {
    switch (page) {
      case 'signup': return <SignUpPage setPage={setPage} />;
      case 'login': return <LoginPage setPage={setPage} />;
      case 'privacy': return <PrivacyPolicyPage setPage={setPage} />;
      case 'terms': return <TermsOfUsePage setPage={setPage} />;
      case 'affiliate': return <AffiliatePage setPage={setPage} />;
      default: return <LandingPage setPage={setPage} />;
    }
  }

  return (
    <div className="flex h-screen bg-gray-50 dark:bg-slate-800 font-sans">
      <aside className="hidden md:flex w-64 flex-col bg-white dark:bg-slate-900 border-r dark:border-slate-700">
        <NavContent />
      </aside>
      <div className="md:hidden">{/* mobile drawer is created on demand */}</div>
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header />
        <main className="flex-1 p-4 md:p-6 overflow-y-auto">{renderPage()}</main>
      </div>
    </div>
  );
}
