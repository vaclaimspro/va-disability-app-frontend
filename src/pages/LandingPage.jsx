import React, { useEffect } from 'react';

export default function LandingPage({ setPage }) {

    useEffect(() => {
        // This function will now safely handle cases where elements might not be found.
        const setupLandingPage = () => {
            // --- Interactive "How We're Different" Section ---
            const problemList = document.getElementById('problem-list');
            const solutionList = document.getElementById('solution-list');

            const handleProblemClick = (e) => {
                const problemItem = e.target.closest('.problem-item');
                if (!problemItem || !problemList || !solutionList) return;

                const solutionId = problemItem.dataset.solution;

                problemList.querySelectorAll('.problem-item').forEach(item => item.classList.remove('active'));
                solutionList.querySelectorAll('.solution-item').forEach(item => item.classList.remove('active'));

                problemItem.classList.add('active');
                const solutionElement = solutionList.querySelector(`.solution-item[data-solution='${solutionId}']`);
                if (solutionElement) {
                    solutionElement.classList.add('active');
                }
            };

            if (problemList) {
                problemList.addEventListener('click', handleProblemClick);
            }

            // --- Calculator Logic ---
            const disabilityList = document.getElementById('disability-list');
            const addDisabilityBtn = document.getElementById('add-disability-btn');
            const dependentInputs = document.querySelectorAll('#interactive-calculator select, #interactive-calculator input');
            
            // Exit if the main calculator elements aren't on the page
            if (!disabilityList || !addDisabilityBtn) {
                 console.warn("Interactive calculator elements not found. Skipping calculator logic.");
                 return;
            }

            let disabilities = [];
            let dependents = { maritalStatus: 'single', childrenUnder18: 0, childrenInSchool: 0, dependentParents: 0, spouseAid: false };

            const COMPENSATION_RATES_FULL = { 10: { alone: 175.51 }, 20: { alone: 346.95 }, 30: { alone: 537.42, spouse: 601.42, child1: 579.42, spouse_child1: 648.42, parent1: 588.42, spouse_parent1: 652.42, child1_parent1: 630.42, spouse_child1_parent1: 699.42 }, 40: { alone: 774.16, spouse: 859.16, child1: 831.16, spouse_child1: 922.16, parent1: 842.16, spouse_parent1: 927.16, child1_parent1: 899.16, spouse_child1_parent1: 990.16 }, 50: { alone: 1102.04, spouse: 1208.04, child1: 1173.04, spouse_child1: 1287.04, parent1: 1187.04, spouse_parent1: 1293.04, child1_parent1: 1258.04, spouse_child1_parent1: 1372.04 }, 60: { alone: 1395.93, spouse: 1523.93, child1: 1480.93, spouse_child1: 1617.93, parent1: 1497.93, spouse_parent1: 1625.93, child1_parent1: 1582.93, spouse_child1_parent1: 1719.93 }, 70: { alone: 1759.19, spouse: 1908.19, child1: 1858.19, spouse_child1: 2018.19, parent1: 1879.19, spouse_parent1: 2028.19, child1_parent1: 1978.19, spouse_child1_parent1: 2138.19 }, 80: { alone: 2044.89, spouse: 2214.89, child1: 2158.89, spouse_child1: 2340.89, parent1: 2181.89, spouse_parent1: 2351.89, child1_parent1: 2295.89, spouse_child1_parent1: 2478.89 }, 90: { alone: 2297.96, spouse: 2489.96, child1: 2425.96, spouse_child1: 2630.96, parent1: 2451.96, spouse_parent1: 2643.96, child1_parent1: 2579.96, spouse_child1_parent1: 2784.96 }, 100: { alone: 3831.30, spouse: 4044.91, child1: 3974.15, spouse_child1: 4201.35, parent1: 4002.74, spouse_parent1: 4216.35, child1_parent1: 4145.59, spouse_child1_parent1: 4372.79 }};
            const ADDITIONAL_DEPENDENT_AMOUNTS = { child_under_18_each_additional: { 30: 31, 40: 42, 50: 53, 60: 63, 70: 74, 80: 84, 90: 95, 100: 106.14 }, child_over_18_school_each: { 30: 102, 40: 137, 50: 171, 60: 205, 70: 239, 80: 274, 90: 308, 100: 342.85 }, parent_each_additional: { 30: 51, 40: 68, 50: 85, 60: 102, 70: 120, 80: 137, 90: 154, 100: 171.44 }, spouse_a_a_fixed: { 30: 58, 40: 78, 50: 98, 60: 117, 70: 137, 80: 157, 90: 176, 100: 195.92 }};

            function calculateCompensation(ratings, currentDependents) {
                let remainingEfficiency = 100;
                [...ratings].sort((a, b) => b - a).forEach(rating => {
                    remainingEfficiency *= (1 - rating / 100);
                });
                const combinedRaw = 100 - remainingEfficiency;
                const roundedCombined = Math.round(combinedRaw / 10) * 10;
                let compensation = 0;
                if (roundedCombined >= 10) {
                    const hasSpouse = currentDependents.maritalStatus === 'married';
                    const hasChildren = currentDependents.childrenUnder18 > 0;
                    const hasParents = currentDependents.dependentParents > 0;
                    let key = 'alone';
                    if (roundedCombined >= 30) { if (hasSpouse && hasChildren && hasParents) key = 'spouse_child1_parent1'; else if (hasSpouse && hasChildren) key = 'spouse_child1'; else if (hasSpouse && hasParents) key = 'spouse_parent1'; else if (hasChildren && hasParents) key = 'child1_parent1'; else if (hasSpouse) key = 'spouse'; else if (hasChildren) key = 'child1'; else if (hasParents) key = 'parent1'; }
                    compensation = COMPENSATION_RATES_FULL[roundedCombined]?.[key] || COMPENSATION_RATES_FULL[roundedCombined]?.['alone'] || 0;
                    const addlChildren = currentDependents.childrenUnder18 - (key.includes('child1') ? 1 : 0);
                    if (addlChildren > 0) compensation += addlChildren * (ADDITIONAL_DEPENDENT_AMOUNTS.child_under_18_each_additional[roundedCombined] || 0);
                    compensation += currentDependents.childrenInSchool * (ADDITIONAL_DEPENDENT_AMOUNTS.child_over_18_school_each[roundedCombined] || 0);
                    const addlParents = currentDependents.dependentParents - (key.includes('parent1') ? 1 : 0);
                    if (addlParents > 0) compensation += addlParents * (ADDITIONAL_DEPENDENT_AMOUNTS.parent_each_additional[roundedCombined] || 0);
                    if (roundedCombined >= 30 && hasSpouse && currentDependents.spouseAid) {
                        compensation += ADDITIONAL_DEPENDENT_AMOUNTS.spouse_a_a_fixed[roundedCombined] || 0;
                    }
                }
                return { roundedCombined, compensation };
            }

            function updateDisplay() {
                const currentRatings = disabilities.map(d => d.rating);
                const currentCalc = calculateCompensation(currentRatings, dependents);
                
                const combinedRatingEl = document.getElementById('combinedRating');
                const monthlyCompensationEl = document.getElementById('monthlyCompensation');
                const whatIfSectionEl = document.getElementById('what-if-section');
                const whatIfPromptEl = document.getElementById('what-if-prompt');

                if (combinedRatingEl) combinedRatingEl.textContent = `${currentCalc.roundedCombined}%`;
                if (monthlyCompensationEl) monthlyCompensationEl.textContent = `$` + currentCalc.compensation.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });

                if (disabilities.length > 0 && whatIfSectionEl && whatIfPromptEl) {
                    whatIfSectionEl.style.display = 'block';
                    whatIfPromptEl.style.display = 'none';
                    const potentialRatings = [...currentRatings, 20];
                    const potentialCalc = calculateCompensation(potentialRatings, dependents);
                    
                    const potentialRatingEl = document.getElementById('potentialRating');
                    const potentialCompensationEl = document.getElementById('potentialCompensation');
                    const annualIncreaseEl = document.getElementById('annualIncrease');
                    
                    if(potentialRatingEl) potentialRatingEl.textContent = `${potentialCalc.roundedCombined}%`;
                    if(potentialCompensationEl) potentialCompensationEl.textContent = `$` + potentialCalc.compensation.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
                    
                    const annualIncrease = (potentialCalc.compensation - currentCalc.compensation) * 12;
                    if(annualIncreaseEl) annualIncreaseEl.textContent = `$` + annualIncrease.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
                } else if (whatIfSectionEl && whatIfPromptEl) {
                    whatIfSectionEl.style.display = 'none';
                    whatIfPromptEl.style.display = 'block';
                }
            }

            function renderDisabilities() {
                if (!disabilityList) return;
                disabilityList.innerHTML = '';
                if (disabilities.length === 0) {
                    disabilityList.innerHTML = `<p class="text-gray-500 text-sm text-center py-4">No conditions added yet. Click the button below to add your first one.</p>`;
                }
                disabilities.forEach((disability, index) => {
                    const div = document.createElement('div');
                    div.className = 'grid grid-cols-10 gap-2 items-center p-3 bg-white rounded-lg border';
                    div.innerHTML = `
                        <div class="col-span-10 md:col-span-6">
                            <label class="text-xs text-gray-500">Disability Name</label>
                            <input type="text" value="${disability.name}" data-index="${index}" class="disability-name w-full p-2 border-gray-200 rounded-md" placeholder="e.g., Tinnitus">
                        </div>
                        <div class="col-span-5 md:col-span-2">
                            <label class="text-xs text-gray-500">Rating</label>
                            <select data-index="${index}" class="disability-rating w-full p-2 border-gray-200 rounded-md">
                                ${[0, 10, 20, 30, 40, 50, 60, 70, 80, 90, 100].map(r => `<option value="${r}" ${r === disability.rating ? 'selected' : ''}>${r}%</option>`).join('')}
                            </select>
                        </div>
                        <div class="col-span-5 md:col-span-2 pt-5">
                            <button data-index="${index}" class="remove-disability-btn w-full bg-red-600 text-white text-sm font-semibold py-2 px-3 rounded-md hover:bg-red-700">Remove</button>
                        </div>
                    `;
                    disabilityList.appendChild(div);
                });
            }
            
            const handleAddDisability = () => {
                disabilities.push({ name: '', rating: 10 });
                renderDisabilities();
                updateDisplay();
            };

            const handleDisabilityListChange = (e) => {
                if (e.target.matches('.disability-name, .disability-rating')) {
                    const index = e.target.dataset.index;
                    const key = e.target.matches('.disability-name') ? 'name' : 'rating';
                    const value = e.target.matches('.disability-rating') ? parseInt(e.target.value) : e.target.value;
                    disabilities[index][key] = value;
                    updateDisplay();
                }
            };

            const handleDisabilityListClick = (e) => {
                if (e.target.matches('.remove-disability-btn')) {
                    const index = e.target.dataset.index;
                    disabilities.splice(index, 1);
                    renderDisabilities();
                    updateDisplay();
                }
            };

            const handleDependentInputChange = (e) => {
                const { name, value, type, checked } = e.target;
                if (type === 'checkbox') {
                    dependents[name] = checked;
                } else if (type === 'number') {
                    dependents[name] = parseInt(value) || 0;
                } else {
                    dependents[name] = value;
                }
                updateDisplay();
            };
            
            // Safely add event listeners
            addDisabilityBtn.addEventListener('click', handleAddDisability);
            disabilityList.addEventListener('change', handleDisabilityListChange);
            disabilityList.addEventListener('click', handleDisabilityListClick);
            dependentInputs.forEach(input => {
                input.addEventListener('change', handleDependentInputChange);
            });

            renderDisabilities();
            updateDisplay();

            // Cleanup function to remove event listeners
            return () => {
                if (problemList) problemList.removeEventListener('click', handleProblemClick);
                if (addDisabilityBtn) addDisabilityBtn.removeEventListener('click', handleAddDisability);
                if (disabilityList) {
                    disabilityList.removeEventListener('change', handleDisabilityListChange);
                    disabilityList.removeEventListener('click', handleDisabilityListClick);
                }
                if (dependentInputs) {
                    dependentInputs.forEach(input => {
                        input.removeEventListener('change', handleDependentInputChange);
                    });
                }
            };
        };

        const cleanup = setupLandingPage();
        return cleanup;

    }, []);

    const scrollTo = (id) => {
        const element = document.getElementById(id);
        if (element) {
            element.scrollIntoView({ behavior: 'smooth' });
        }
    };

    return (
        <div className="bg-white text-gray-800">
            {/* Header */}
            <header className="bg-white/30 backdrop-blur-lg shadow-sm sticky top-0 z-50">
                <div className="container mx-auto px-6 py-4 flex justify-between items-center">
                    <div className="flex items-center space-x-3">
                        <img src="https://i.ibb.co/YB8HrVsD/VALogo1.png" alt="VA Claims Pro Logo" className="h-12 w-auto" />
                    </div>
                    <nav className="hidden lg:flex space-x-8 items-center">
                        <button onClick={() => scrollTo('agitate')} className="text-gray-600 hover:text-[#c62727]">The Problem</button>
                        <button onClick={() => scrollTo('solution')} className="text-gray-600 hover:text-[#c62727]">Our Solution</button>
                        <button onClick={() => scrollTo('pricing')} className="text-gray-600 hover:text-[#c62727]">Pricing</button>
                        <button onClick={() => scrollTo('faq')} className="text-gray-600 hover:text-[#c62727]">FAQ</button>
                    </nav>
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

            {/* PROBLEM (Attention): Hero Section */}
            <section className="hero-section text-white" style={{ backgroundImage: `url('https://i.ibb.co/Kx507tPP/Hero.png')` }}>
                <div className="container mx-auto px-6 py-32 md:py-48 text-center">
                    <h1 className="text-5xl md:text-6xl font-black leading-tight tracking-tight max-w-4xl mx-auto">Stuck With a Rating That Doesn't Tell the Whole Story?</h1>
                    <p className="mt-6 text-xl md:text-2xl max-w-3xl mx-auto text-gray-200">You've been through the VA system. You have your award letter. But you know your rating doesn't reflect your reality. It's time to stop feeling stuck and start building a case for the rating you've truly earned.</p>
                    <div className="mt-10">
                        <button onClick={() => scrollTo('interactive-calculator-section')} className="cta-button bg-white text-[#002458] font-bold py-4 px-10 rounded-lg text-lg shadow-xl">
                            Calculate My VA Rating Now
                        </button>
                    </div>
                </div>
            </section>
            
            {/* AGITATE (Interest): The Consequences Section */}
            <section id="agitate" className="pt-24 bg-gray-50">
                <div className="container mx-auto px-6">
                    <div className="grid md:grid-cols-2 gap-16 items-end">
                        <div className="flex justify-center">
                            <img src="https://i.ibb.co/nsCgZK9B/Veteran01.png" alt="Veteran looking thoughtfully out a window" className="max-w-md md:max-w-lg"/>
                        </div>
                        <div className="text-left pb-24">
                            <h2 className="text-sm font-bold uppercase text-[#c62727] tracking-widest">THE REAL COST OF AN INCOMPLETE CLAIM</h2>
                            <h3 className="text-4xl font-bold text-gray-900 mt-2 mb-6">It's More Than Just a Low Rating.</h3>
                            <p className="text-gray-600 mb-6">An incomplete claim means you're leaving money on the table—money that could provide stability for your family. It means your service-connected conditions might be causing other issues (secondaries) that you're not being compensated for. It means the constant stress of appeals, the feeling of being unheard, and the gnawing fear that you're missing the key piece of evidence needed to win.</p>
                            <p className="text-gray-600 font-semibold">Every month you wait with an incorrect rating is a month you're not receiving the full benefits you deserve. The stakes are too high to go in unprepared.</p>
                        </div>
                    </div>
                </div>
            </section>

            {/* DESIRE (Solution Part 1): Introducing VA Claims Pro */}
            <section id="solution" className="py-24 bg-white">
                <div className="container mx-auto px-6">
                    <div className="text-center mb-16">
                        <h2 className="text-sm font-bold uppercase text-[#c62727] tracking-widest">YOUR STRATEGIC ADVANTAGE</h2>
                        <h3 className="text-4xl font-bold text-gray-900 mt-2">Deploy Your AI Co-Pilot and Take Control.</h3>
                        <p className="mt-4 text-gray-600 max-w-3xl mx-auto">Stop guessing and start strategizing. VA Claims Pro is the definitive solution, an intelligent platform that transforms your raw evidence into a powerful, organized, and compelling claim. We replace confusion with clarity and give you the tools to fight back and win.</p>
                    </div>
                    <div className="grid md:grid-cols-3 gap-x-8 gap-y-12">
                        {/* Step 1 */}
                        <div className="text-center">
                            <div className="flex items-center justify-center h-16 w-16 rounded-full bg-[#002458] text-white font-bold text-2xl mx-auto mb-6 border-4 border-[#c62727]">1</div>
                            <h4 className="text-xl font-bold mb-2">Upload & Analyze</h4>
                            <p className="text-gray-600 px-4">Securely upload your Decision letter. Our AI instantly reads and understands your entire file, extracting every condition, rating, and service date.</p>
                        </div>
                        {/* Step 2 */}
                        <div className="text-center">
                            <div className="flex items-center justify-center h-16 w-16 rounded-full bg-[#002458] text-white font-bold text-2xl mx-auto mb-6 border-4 border-[#c62727]">2</div>
                            <h4 className="text-xl font-bold mb-2">Uncover & Strategize</h4>
                            <p className="text-gray-600 px-4">The AI finds every potential secondary and presumptive claim, building a "Maximization Report" that shows you every path to a higher rating.</p>
                        </div>
                        {/* Step 3 */}
                        <div className="text-center">
                            <div className="flex items-center justify-center h-16 w-16 rounded-full bg-[#002458] text-white font-bold text-2xl mx-auto mb-6 border-4 border-[#c62727]">3</div>
                            <h4 className="text-xl font-bold mb-2">Prepare & Execute</h4>
                            <p className="text-gray-600 px-4">Generate compelling statements and supporting documents and get a personalized C&P exam prep guide based on the examiner's own questions (DBQs).</p>
                        </div>
                    </div>
                </div>
            </section>

            {/* "Who This Is For" Section */}
            <section className="py-24 bg-gray-50">
                <div className="container mx-auto px-6">
                    <div className="grid md:grid-cols-2 gap-16 items-center">
                        <div className="text-left">
                            <h2 className="text-sm font-bold uppercase text-[#c62727] tracking-widest">A TOOL FOR EVERY VETERAN</h2>
                            <h3 className="text-4xl font-bold text-gray-900 mt-2 mb-8">Does This Sound Like You?</h3>
                            <div className="space-y-6">
                                <div className="who-for-card bg-white p-6 rounded-r-lg border-l-4 border-red-500 transition-all duration-300">
                                    <h4 className="text-xl font-bold text-[#002458] mb-1">The Underrated Veteran</h4>
                                    <p className="text-gray-600">You're at 30%, 50%, or even 70%, but you know your rating doesn't match your daily reality. You're looking for a clear path to an increase but don't know where to start.</p>
                                </div>
                                <div className="who-for-card bg-white p-6 rounded-r-lg border-l-4 border-blue-500 transition-all duration-300">
                                    <h4 className="text-xl font-bold text-[#002458] mb-1">The Denied Veteran</h4>
                                    <p className="text-gray-600">You submitted a claim for a secondary condition you know is valid, but it was denied. You need to understand why and build a stronger, evidence-based case for appeal.</p>
                                </div>
                                <div className="who-for-card bg-white p-6 rounded-r-lg border-l-4 border-yellow-500 transition-all duration-300">
                                    <h4 className="text-xl font-bold text-[#002458] mb-1">The Confused Veteran</h4>
                                    <p className="text-gray-600">You hear terms like "presumptives" and "secondaries" but have no idea how to connect them to your service records and current conditions. You need a clear, simple strategy.</p>
                                </div>
                            </div>
                        </div>
                        <div className="flex justify-center">
                            <img src="https://i.ibb.co/35TbDw4x/Veteran02.png" alt="Veteran planning their claim" className="rounded-lg shadow-2xl" />
                        </div>
                    </div>
                </div>
            </section>

            {/* --- NEW: Features Section --- */}
            <section className="py-24 bg-white">
                <div className="container mx-auto px-6">
                    <div className="text-center mb-16">
                        <h2 className="text-sm font-bold uppercase text-[#c62727] tracking-widest">Key Features of VAClaimsPro</h2>
                        <h3 className="text-4xl font-bold text-gray-900 mt-2">Everything You Need to Navigate Your VA Disability Claim—All in One Place</h3>
                    </div>
                    <div className="mb-16">
                        <img src="https://i.ibb.co/QBJn6j1/Dashboard-Mockup1.png" alt="Dashboard Mockup of VA Claims Pro" className="w-full mx-auto max-w-5xl" />
                    </div>
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                        <div className="feature-card bg-white p-6 rounded-lg border border-gray-200 border-t-4 border-t-red-500 transition-all duration-300">
                            <h4 className="text-lg font-bold text-[#002458] mb-2">AI-Powered Disability Calculator</h4>
                            <p className="text-gray-600 text-sm">Get an instant estimate of your combined VA disability rating and projected monthly compensation, tailored to your unique set of conditions.</p>
                        </div>
                        <div className="feature-card bg-white p-6 rounded-lg border border-gray-200 border-t-4 border-t-red-500 transition-all duration-300">
                            <h4 className="text-lg font-bold text-[#002458] mb-2">Document Upload & Smart Extraction</h4>
                            <p className="text-gray-600 text-sm">Easily upload your VA award letters or decision documents. Our AI automatically extracts your conditions and ratings—eliminating the need for manual data entry.</p>
                        </div>
                        <div className="feature-card bg-white p-6 rounded-lg border border-gray-200 border-t-4 border-t-red-500 transition-all duration-300">
                            <h4 className="text-lg font-bold text-[#002458] mb-2">Manual Condition Management</h4>
                            <p className="text-gray-600 text-sm">Quickly add, update, or remove your service-connected disabilities to keep your claim information accurate and up to date.</p>
                        </div>
                        <div className="feature-card bg-white p-6 rounded-lg border border-gray-200 border-t-4 border-t-blue-500 transition-all duration-300">
                            <h4 className="text-lg font-bold text-[#002458] mb-2">Comprehensive Condition Overview</h4>
                            <p className="text-gray-600 text-sm">See all your tracked conditions, ratings, and claim details at a glance. Easily access symptom logs and your claim history from one dashboard.</p>
                        </div>
                        <div className="feature-card bg-white p-6 rounded-lg border border-gray-200 border-t-4 border-t-blue-500 transition-all duration-300">
                            <h4 className="text-lg font-bold text-[#002458] mb-2">Dynamic Claim Builder</h4>
                            <p className="text-gray-600 text-sm">Effortlessly generate essential VA claim documents—including Nexus Letters, Buddy Statements, ADL statements, Work Impact statements, and more.</p>
                        </div>
                        <div className="feature-card bg-white p-6 rounded-lg border border-gray-200 border-t-4 border-t-blue-500 transition-all duration-300">
                            <h4 className="text-lg font-bold text-[#002458] mb-2">Personalized C&P Exam Prep</h4>
                            <p className="text-gray-600 text-sm">Receive a custom exam preparation guide, complete with real examiner (DBQ) questions based on your specific conditions.</p>
                        </div>
                        <div className="feature-card bg-white p-6 rounded-lg border border-gray-200 border-t-4 border-t-red-500 transition-all duration-300">
                            <h4 className="text-lg font-bold text-[#002458] mb-2">Symptom Tracker</h4>
                            <p className="text-gray-600 text-sm">Monitor and log your symptoms over time to build a strong case and track your health for future claims or appeals.</p>
                        </div>
                        <div className="feature-card bg-white p-6 rounded-lg border border-gray-200 border-t-4 border-t-red-500 transition-all duration-300">
                            <h4 className="text-lg font-bold text-[#002458] mb-2">Integrated Calendar & Task Management</h4>
                            <p className="text-gray-600 text-sm">Never miss a deadline or appointment. Keep track of important dates, upcoming tasks, and claim milestones with our built-in calendar and to-do list.</p>
                        </div>
                        <div className="feature-card bg-white p-6 rounded-lg border border-gray-200 border-t-4 border-t-red-500 transition-all duration-300">
                            <h4 className="text-lg font-bold text-[#002458] mb-2">Step-by-Step Filing Guidance</h4>
                            <p className="text-gray-600 text-sm">Access easy-to-follow instructions and tips for every stage of your VA claim process, designed to give you confidence and clarity.</p>
                        </div>
                    </div>
                </div>
            </section>

            {/* FOUNDERS' STORY */}
            <section className="relative py-24 bg-cover bg-center text-white" style={{ backgroundImage: `url('https://i.ibb.co/Kx507tPP/Hero.png')` }}>
                <div className="absolute inset-0 bg-[#002458]/90 backdrop-blur-sm"></div>
                <div className="relative container mx-auto px-6 text-center">
                    <div className="max-w-4xl mx-auto">
                        <h2 className="text-sm font-bold uppercase text-red-400 tracking-widest">A MESSAGE FROM OUR FOUNDERS</h2>
                        <h3 className="text-4xl font-bold text-white mt-2 mb-6">We Built the Tool We Wish We Had.</h3>
                        <p className="text-gray-300 mb-6">"Our journey with VA claims is deeply personal. As a military family, we understand the confusion, frustration, and emotional stress that comes with seeking the benefits you’veearned. With experience as a retired lieutenant colonel and VA law firm legal consultant, and an entrepreneurial spouse skilled in building systems and apps, we combined our expertise to make the process smoother and more accessible for others. Together, we created VA Claims Pro to empower veterans and their families with the support, clarity, and tools we wish we’d had from the beginning. We believe your service should be honored with respect and efficiency—not lost in red tape. Thank you for your service and sacrifice. We’re here to help you get the recognition and benefits you truly deserve."</p>
                        <p className="font-semibold text-gray-100">— The VA Claims Pro Founders</p>
                    </div>
                </div>
            </section>

            {/* SOLUTION (Desire Part 3): Interactive Calculator */}
            <section id="interactive-calculator-section" className="py-24 bg-gray-50">
                <div className="container mx-auto px-6 text-center">
                    <h2 className="text-sm font-bold uppercase text-[#c62727] tracking-widest">SEE THE DIFFERENCE</h2>
                    <h3 className="text-4xl font-bold text-gray-900 mt-2 mb-4">Calculate Your Potential Benefits Instantly</h3>
                    <p className="text-gray-600 max-w-3xl mx-auto mb-10">Get a real-time estimate of your combined rating and monthly compensation. Add your conditions and dependents below to see what you could be eligible for. This is a preview of the powerful tools inside.</p>
                    
                    <div id="interactive-calculator" className="max-w-4xl mx-auto bg-white p-8 rounded-lg shadow-lg border border-gray-200 text-left">
                        {/* Current Calculation */}
                        <div className="bg-white p-6 rounded-lg mb-8">
                            <h4 className="text-2xl font-bold text-gray-800 mb-4">Your Current Calculation</h4>
                            <div className="flex flex-col md:flex-row justify-around items-center text-center">
                                <div className="mb-4 md:mb-0">
                                    <p className="text-gray-600 text-lg">Combined Rating</p>
                                    <p id="combinedRating" className="text-5xl font-black text-[#002458] mt-1">0%</p>
                                </div>
                                <div className="border-t md:border-t-0 md:border-l border-gray-200 w-full md:w-px h-px md:h-24 mx-8"></div>
                                <div>
                                    <p className="text-gray-600 text-lg">Estimated Monthly Compensation</p>
                                    <p id="monthlyCompensation" className="text-5xl font-black text-green-600 mt-1">$0.00</p>
                                </div>
                            </div>
                        </div>

                        {/* Conditions Section */}
                        <div>
                            <h4 className="text-xl font-bold text-gray-800 mb-4">Enter Your Conditions</h4>
                            <div id="disability-list" className="space-y-3">
                                {/* Disability rows will be injected here */}
                            </div>
                            <button id="add-disability-btn" className="mt-4 text-sm font-semibold text-[#002458] hover:text-[#c62727] flex items-center">
                                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-1"><circle cx="12" cy="12" r="10"/><line x1="12" x2="12" y1="8" y2="16"/><line x1="8" x2="16" y1="12" y2="12"/></svg>
                                Add Condition
                            </button>
                        </div>

                        {/* Dependents Section */}
                        <div className="mt-8 pt-8 border-t border-gray-200">
                            <h4 className="text-xl font-bold text-gray-800 mb-4">Enter Dependent Information</h4>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label htmlFor="maritalStatus" className="text-sm font-medium text-gray-700 block mb-1">Marital Status</label>
                                    <select id="maritalStatus" name="maritalStatus" className="w-full p-2 border border-gray-300 rounded-md">
                                        <option value="single">Single</option>
                                        <option value="married">Married</option>
                                    </select>
                                </div>
                                <div>
                                    <label htmlFor="childrenUnder18" className="text-sm font-medium text-gray-700 block mb-1">Children Under 18</label>
                                    <input type="number" id="childrenUnder18" name="childrenUnder18" min="0" defaultValue="0" className="w-full p-2 border border-gray-300 rounded-md" />
                                </div>
                                <div>
                                    <label htmlFor="childrenInSchool" className="text-sm font-medium text-gray-700 block mb-1">Children 18-23 in School</label>
                                    <input type="number" id="childrenInSchool" name="childrenInSchool" min="0" defaultValue="0" className="w-full p-2 border border-gray-300 rounded-md" />
                                </div>
                                <div>
                                    <label htmlFor="dependentParents" className="text-sm font-medium text-gray-700 block mb-1">Dependent Parents</label>
                                    <input type="number" id="dependentParents" name="dependentParents" min="0" defaultValue="0" className="w-full p-2 border border-gray-300 rounded-md" />
                                </div>
                            </div>
                            <div className="mt-4">
                                <div className="flex items-center">
                                    <input type="checkbox" id="spouseAid" name="spouseAid" className="h-4 w-4 text-[#002458] rounded focus:ring-[#002458]" />
                                    <label htmlFor="spouseAid" className="ml-2 text-sm text-gray-700">Spouse requires Aid and Attendance</label>
                                </div>
                            </div>
                        </div>

                        {/* "What If" Section (Initially Hidden) */}
                        <div id="what-if-section" className="mt-8 pt-8 border-t-2 border-dashed border-gray-300" style={{display: 'none'}}>
                            <h3 className="text-3xl font-bold text-gray-900 text-center">But what are you leaving on the table?</h3>
                            <p className="text-center text-gray-600 mt-2 max-w-2xl mx-auto">Our Premium analysis often uncovers secondary and presumptive conditions. Just one additional 10% or 20% rating can make a significant difference.</p>
                            <div className="mt-6 bg-green-50 border border-green-200 p-6 rounded-lg text-center">
                                <p className="text-lg font-semibold text-green-800">For Example: With One More Condition...</p>
                                <div className="flex flex-col md:flex-row justify-around items-center mt-4">
                                    <div>
                                        <p className="text-gray-600">Potential New Rating</p>
                                        <p id="potentialRating" className="text-4xl font-bold text-green-700">0%</p>
                                    </div>
                                    <div>
                                        <p className="text-gray-600">Potential New Monthly Pay</p>
                                        <p id="potentialCompensation" className="text-4xl font-bold text-green-700">$0.00</p>
                                    </div>
                                </div>
                                <div className="mt-6 bg-white p-4 rounded-lg">
                                    <p className="text-gray-600">Potential Annual Increase</p>
                                    <p id="annualIncrease" className="text-5xl font-black text-green-600">$0.00</p>
                                </div>
                            </div>
                            <div className="mt-6 text-center">
                                <a href="#pricing" className="cta-button inline-block bg-[#c62727] text-white font-bold py-3 px-8 rounded-lg text-base shadow-lg">
                                    Unlock Your Full Report with Premium
                                </a>
                            </div>
                        </div>
                        {/* Prompt to add conditions (Initially Visible) */}
                        <div id="what-if-prompt" className="mt-8 pt-8 border-t-2 border-dashed border-gray-300 text-center">
                            <p className="text-gray-500 italic text-lg">Add a condition above to see your potential increase!</p>
                        </div>
                    </div>
                </div>
            </section>

            {/* ACTION: Pricing Section */}
            <section id="pricing" className="py-24 bg-white">
                <div className="container mx-auto px-6">
                    <div className="text-center mb-16">
                        <h2 className="text-sm font-bold uppercase text-[#c62727] tracking-widest">END THE FRUSTRATION</h2>
                        <h3 className="text-4xl font-bold text-gray-900 mt-2">Take Action and Get the Rating You Deserve</h3>
                        <p className="mt-4 text-gray-600 max-w-2xl mx-auto">Start for free to organize your claim, then upgrade to deploy our full AI arsenal. It's time to invest in your future.</p>
                    </div>

                    <div className="flex flex-col lg:flex-row justify-center items-start gap-8">
                        {/* Free Tier */}
                        <div className="pricing-tier w-full max-w-md bg-white p-8 rounded-xl shadow-lg border border-gray-200">
                            <h3 className="text-2xl font-bold text-gray-900">Standard</h3>
                            <p className="mt-2 text-gray-500">The essential AI toolkit to get organized.</p>
                            <p className="mt-6 text-5xl font-extrabold text-gray-900">$0<span className="text-lg font-medium text-gray-500">/forever</span></p>
                            <button onClick={() => setPage('signup')} className="cta-button block w-full mt-8 bg-gray-200 text-gray-800 text-center font-semibold py-3 px-6 rounded-lg">Get Started for Free</button>
                            <ul className="mt-8 space-y-4 text-sm text-gray-700">
                                <li className="flex items-start"><span className="text-green-500 mr-2 mt-1">&#10003;</span><span><span className="font-bold">AI-Powered Calculator</span></span></li>
                                <li className="flex items-start"><span className="text-green-500 mr-2 mt-1">&#10003;</span><span><span className="font-bold">AI Document Reader</span></span></li>
                                <li className="flex items-start"><span className="text-green-500 mr-2 mt-1">&#10003;</span><span><span className="font-bold">Basic AI Analysis</span></span></li>
                                <li className="flex items-start"><span className="text-green-500 mr-2 mt-1">&#10003;</span><span><span className="font-bold">Claim & Symptom Tracker</span></span></li>
                                <li className="flex items-start"><span className="text-green-500 mr-2 mt-1">&#10003;</span><span><span className="font-bold">Appointment Calendar</span></span></li>
                            </ul>
                        </div>

                        {/* Premium Tier */}
                        <div className="pricing-tier w-full max-w-md bg-[#002458] text-white p-8 rounded-xl shadow-2xl relative border-4 border-[#c62727]">
                            <span className="absolute top-0 right-8 -mt-3 bg-[#c62727] text-white text-xs font-bold px-3 py-1 rounded-full">MAXIMIZE YOUR RATING</span>
                            <h3 className="text-2xl font-bold">Premium AI</h3>
                            <p className="mt-2 text-gray-300">Deploy the full AI arsenal.</p>
                            <p className="mt-6 text-5xl font-extrabold">$29<span className="text-lg font-medium text-gray-300">/month</span></p>
                            <a href="https://buy.stripe.com/28EdR90GacOafkj1iA8IU00" className="cta-button block w-full mt-8 bg-[#c62727] text-white text-center font-semibold py-3 px-6 rounded-lg shadow-lg">Upgrade to Premium</a>
                            <ul className="mt-8 space-y-4 text-sm">
                                <li className="flex items-start font-bold"><span className="text-green-400 mr-2 mt-1">&#10003;</span>Everything in Standard, plus:</li>
                                <li className="flex items-start"><span className="text-green-400 mr-2 mt-1">&#10003;</span><span><span className="font-bold">Full Maximization Report</span></span></li>
                                <li className="flex items-start"><span className="text-green-400 mr-2 mt-1">&#10003;</span><span><span className="font-bold">Personalized C&P Prep</span></span></li>
                                <li className="flex items-start"><span className="text-green-400 mr-2 mt-1">&#10003;</span><span><span className="font-bold">Interactive DBQ Explorer</span></span></li>
                                <li className="flex items-start"><span className="text-green-400 mr-2 mt-1">&#10003;</span><span><span className="font-bold">AI Document Generation</span></span></li>
                                <li className="flex items-start"><span className="text-green-400 mr-2 mt-1">&#10003;</span><span><span className="font-bold">Advanced Symptom Analysis</span></span></li>
                            </ul>
                        </div>
                    </div>
                    <div className="text-center mt-12">
                        <p className="text-sm text-gray-500">The Premium plan is backed by a 30-day money-back guarantee. You have nothing to lose.</p>
                    </div>
                </div>
            </section>
            
            {/* Security Section */}
            <section className="py-24 bg-gray-50">
                <div className="container mx-auto px-6">
                    <div className="grid md:grid-cols-2 gap-16 items-center">
                        <div className="text-left">
                            <h2 className="text-sm font-bold uppercase text-[#c62727] tracking-widest">BANK-LEVEL SECURITY</h2>
                            <h3 className="text-4xl font-bold text-gray-900 mt-2 mb-6">Your Privacy is Our Priority.</h3>
                            <p className="text-gray-600 mb-6">We understand the sensitive nature of your information. We utilize industry-best standards to ensure your data is always encrypted, secure, and under your control. We will never sell or share your data.</p>
                             <ul className="space-y-3 text-gray-700">
                                 <li className="flex items-center"><span className="text-green-500 mr-2">✓</span> 256-bit AES Encryption at Rest & In Transit</li>
                                 <li className="flex items-center"><span className="text-green-500 mr-2">✓</span> Secure Cloud Infrastructure</li>
                                 <li className="flex items-center"><span className="text-green-500 mr-2">✓</span> You Own and Control Your Data</li>
                             </ul>
                        </div>
                        <div className="flex justify-center">
                           <img src="https://i.ibb.co/5gqt9Bg0/website-security.png" alt="Secure data lock" className="rounded-lg shadow-2xl max-w-sm md:max-w-md"/>
                        </div>
                    </div>
                </div>
            </section>

            {/* FAQ Section */}
            <section id="faq" className="py-24 bg-white">
                <div className="container mx-auto px-6 max-w-4xl">
                    <div className="text-center mb-16">
                        <h2 className="text-sm font-bold uppercase text-[#c62727] tracking-widest">QUESTIONS?</h2>
                        <h3 className="text-4xl font-bold text-gray-900 mt-2">Frequently Asked Questions</h3>
                    </div>
                    <div className="space-y-8">
                        <div>
                            <h4 className="font-bold text-xl mb-2">Is this legal or medical advice?</h4>
                            <p className="text-gray-600">No. VA Claims Pro is a software tool designed to help you organize and prepare your claim based on publicly available VA regulations (38 CFR). We are not a law firm, medical provider, or accredited agent, and we do not provide legal or medical advice.</p>
                        </div>
                         <div>
                            <h4 className="font-bold text-xl mb-2">How is this different from a VSO or an accredited agent?</h4>
                            <p className="text-gray-600">VSOs and accredited agents are valuable resources who can represent you. VA Claims Pro is a "do-it-yourself" platform that puts the power in your hands. We provide the organizational tools and educational resources for you to build and file your own claim with confidence. Many veterans use our tool to prepare their evidence *before* meeting with a VSO.</p>
                        </div>
                         <div>
                            <h4 className="font-bold text-xl mb-2">Is my data secure?</h4>
                            <p className="text-gray-600">Yes. We take data security very seriously. All your data is encrypted both in transit and at rest. We use secure, modern cloud infrastructure to protect your information. You are the sole owner of your data.</p>
                        </div>
                         <div>
                            <h4 className="font-bold text-xl mb-2">Can I cancel my subscription anytime?</h4>
                            <p className="text-gray-600">Absolutely. You can cancel your Pro subscription at any time from your profile page, no questions asked. You will retain Pro access until the end of your billing period.</p>
                        </div>
                    </div>
                </div>
            </section>

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
                        <button onClick={() => scrollTo('solution')} className="text-gray-300 hover:text-white">Our Solution</button>
                        <button onClick={() => scrollTo('pricing')} className="text-gray-300 hover:text-white">Pricing</button>
                        <button onClick={() => scrollTo('faq')} className="text-gray-300 hover:text-white">FAQ</button>
                        <button onClick={() => setPage('privacy')} className="text-gray-300 hover:text-white">Privacy Policy</button>
                        <button onClick={() => setPage('terms')} className="text-gray-300 hover:text-white">Terms of Use</button>
                        <button onClick={() => setPage('affiliate')} className="text-gray-300 hover:text-white">Affiliates</button>
                    </div>
                    <p className="text-xs text-gray-500">&copy; {new Date().getFullYear()} VA Claims Pro. All Rights Reserved. <br/>This site is not affiliated with the U.S. Department of Veterans Affairs.</p>
                </div>
            </footer>
        </div>
    );
}
