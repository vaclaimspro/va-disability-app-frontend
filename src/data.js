// This object now categorizes presumptive conditions and assigns a "chance" to secondary conditions.
export const VA_KNOWLEDGE_BASE = {
    secondaryConditionsMap: {
        'tinnitus': [
            { name: 'Anxiety', chance: 'High' },
            { name: 'Depression', chance: 'High' },
            { name: 'Migraines', chance: 'Medium' },
            { name: 'Sleep Apnea', chance: 'Medium' },
            { name: 'Insomnia', chance: 'High' },
            { name: 'Meniere\'s Disease', chance: 'Low' },
            { name: 'Somatic Symptom Disorder', chance: 'Medium' },
            { name: 'Hyperacusis', chance: 'Low' }
        ],
        'radiculopathy': [
            { name: 'Sciatica', chance: 'High' },
            { name: 'Foot Drop', chance: 'Medium' },
            { name: 'Gait Abnormalities', chance: 'Medium' },
            { name: 'Bladder Dysfunction', chance: 'Low' },
            { name: 'Bowel Dysfunction', chance: 'Low' },
            { name: 'Erectile Dysfunction', chance: 'Medium' },
            { name: 'Depression', chance: 'High' },
            { name: 'Chronic Pain Syndrome', chance: 'High' },
            { name: 'Peripheral Neuropathy', chance: 'Medium' }
        ],
        'ptsd': [
            { name: 'Sleep Apnea', chance: 'High' },
            { name: 'Gastroesophageal Reflux Disease (GERD)', chance: 'Medium' },
            { name: 'Migraines', chance: 'High' },
            { name: 'Erectile Dysfunction', chance: 'Medium' },
            { name: 'Anxiety', chance: 'High' },
            { name: 'Depression', chance: 'High' },
            { name: 'Irritable Bowel Syndrome (IBS)', chance: 'Medium' },
            { name: 'Bruxism (Teeth Grinding)', chance: 'Medium' },
            { name: 'Dry Mouth', chance: 'Low' },
        ],
        'migraines': [
            { name: 'Anxiety', chance: 'High' },
            { name: 'Depression', chance: 'High' },
            { name: 'Allergic Rhinitis', chance: 'Low' },
            { name: 'Tinnitus', chance: 'Low' },
            { name: 'Photophobia', chance: 'High' },
            { name: 'Blurred Vision', chance: 'Medium' },
        ],
        'sleep apnea': [
            { name: 'Hypertension', chance: 'High' },
            { name: 'Gastroesophageal Reflux Disease (GERD)', chance: 'Medium' },
            { name: 'Asthma', chance: 'Low' },
            { name: 'Depression', chance: 'High' },
            { name: 'Nocturia', chance: 'Medium' }
        ],
        'back condition': [
            { name: 'Radiculopathy', chance: 'High' },
            { name: 'Sciatica', chance: 'High' },
            { name: 'Hip Pain', chance: 'Medium' },
            { name: 'Knee Pain', chance: 'Medium' },
            { name: 'Ankle Instability', 'chance': 'Low' },
            { name: 'Depression', chance: 'High' },
            { name: 'Anxiety', chance: 'High' },
            { name: 'Erectile Dysfunction', chance: 'Medium' },
            { name: 'Urinary Incontinence', chance: 'Low' },
            { name: 'Plantar Fasciitis', chance: 'Medium' },
            { name: 'Flat Feet', chance: 'Low' },
            { name: 'Arthritis', chance: 'High' },
        ],
        'hypertension': [
            { name: 'Stroke', chance: 'Medium' },
            { name: 'Kidney Disease', chance: 'High' },
            { name: 'Heart Disease', chance: 'High' },
            { name: 'Erectile Dysfunction', chance: 'Medium' }
        ],
        'diabetes mellitus': [
            { name: 'Peripheral Neuropathy', chance: 'High' },
            { name: 'Retinopathy', chance: 'High' },
            { name: 'Nephropathy (Kidney Disease)', chance: 'High' },
            { name: 'Erectile Dysfunction', chance: 'High' },
            { name: 'Heart Disease', chance: 'Medium' },
            { name: 'Blurred Vision', chance: 'High' },
            { name: 'Frequent Urination', chance: 'High' },
            { name: 'Gout', chance: 'Medium' },
        ],
        'traumatic brain injury (tbi)': [
            { name: 'Migraines', chance: 'High' },
            { name: 'Seizures', chance: 'Medium' },
            { name: 'Depression', chance: 'High' },
            { name: 'Anxiety', chance: 'High' },
            { name: 'Cognitive Impairment', chance: 'High' },
            { name: 'Parkinson\'s Disease', chance: 'Low' },
            { name: 'Photophobia', chance: 'High' },
        ],
        'chronic sinusitis': [
            { name: 'Obstructive Sleep Apnea', chance: 'Medium' },
            { name: 'Anosmia (Loss of Smell)', chance: 'High' }
        ],
        'allergic rhinitis': [
            { name: 'Obstructive Sleep Apnea', chance: 'Medium' },
            { name: 'Chronic Sinusitis', chance: 'High' }
        ],
        'chronic pain': [
            { name: 'Depression', chance: 'High' },
            { name: 'Anxiety', chance: 'High' },
            { name: 'Insomnia', chance: 'High' },
            { name: 'Erectile Dysfunction', chance: 'Medium' },
            { name: 'Ulcers', chance: 'Medium' },
        ],
    },
    presumptiveCategories: {
        pactAct: {
            label: "PACT Act: Burn Pit & Toxic Exposure Presumptives",
            shortLabel: "PACT Act",
            conditions: [
                'Asthma (diagnosed after service)', 'Chronic Bronchitis', 'Chronic Obstructive Pulmonary Disease (COPD)', 'Chronic Rhinitis', 'Chronic Sinusitis',
                'Head Cancer', 'Neck Cancer', 'Respiratory Cancer', 'Gastrointestinal Cancer', 'Kidney Cancer', 'Brain Cancer', 'Melanoma',
                'Glioblastoma', 'Granulomatous Disease', 'Interstitial Lung Disease (ILD)', 'Pleuritis', 'Pulmonary Fibrosis', 'Sarcoidosis'
            ],
            dateRanges: [{ start: new Date('1990-08-02'), end: new Date() }]
        },
        agentOrange: {
            label: "Agent Orange Presumptive Conditions",
            shortLabel: "Agent Orange",
            conditions: ['Type 2 Diabetes', 'Ischemic Heart Disease', 'Parkinson’s Disease', 'Hodgkin’s Disease', 'Prostate Cancer', 'AL Amyloidosis', 'Chloracne', 'Chronic B-cell Leukemias', 'Multiple Myeloma', 'Non-Hodgkin’s Lymphoma', 'Peripheral Neuropathy, Early-Onset', 'Porphyria Cutanea Tarda', 'Respiratory Cancers', 'Soft Tissue Sarcomas'],
            dateRanges: [{ start: new Date('1962-01-09'), end: new Date('1975-05-07') }]
        },
        blueWaterNavy: {
            label: "Blue Water Navy Presumptives",
            shortLabel: "Blue Water Navy",
            conditions: ['Type 2 Diabetes', 'Ischemic Heart Disease', 'Parkinson’s Disease', 'Hodgkin’s Disease', 'Prostate Cancer', 'AL Amyloidosis', 'Chloracne', 'Chronic B-cell Leukemias', 'Multiple Myeloma', 'Non-Hodgkin’s Lymphoma', 'Peripheral Neuropathy, Early-Onset', 'Porphyria Cutanea Tarda', 'Respiratory Cancers', 'Soft Tissue Sarcomas'],
            dateRanges: [{ start: new Date('1962-01-09'), end: new Date('1975-05-07') }]
        },
        gulfWar: {
            label: "Gulf War & Southwest Asia Conditions",
            shortLabel: "Gulf War",
            conditions: ['Chronic Fatigue Syndrome', 'Irritable Bowel Syndrome (IBS)', 'Fibromyalgia', 'Undiagnosed Illnesses'],
            dateRanges: [{ start: new Date('1990-08-02'), end: new Date() }]
        },
        campLejeune: {
            label: "Camp Lejeune Contaminated Water Exposure",
            shortLabel: "Camp Lejeune",
            conditions: ['Adult leukemia', 'Aplastic anemia and other myelodysplastic syndromes', 'Bladder cancer', 'Kidney cancer', 'Liver cancer', 'Multiple myeloma', 'Non-Hodgkin’s lymphoma', 'Parkinson’s disease'],
            dateRanges: [{ start: new Date('1953-08-01'), end: new Date('1987-12-31') }]
        },
        reca: {
            label: "Radiation Exposure Presumptives",
            shortLabel: "Radiation Exposure",
            conditions: ['Leukemia (other than chronic lymphocytic leukemia)', 'Cancer of the thyroid', 'Cancer of the breast', 'Cancer of the pharynx', 'Cancer of the esophagus', 'Cancer of the stomach', 'Cancer of the small intestine', 'Cancer of the pancreas', 'Multiple myeloma', 'Lymphomas (except Hodgkin’s disease)', 'Cancer of the bile ducts', 'Cancer of the gall bladder', 'Primary liver cancer', 'Cancer of the salivary gland', 'Cancer of the urinary tract'],
            dateRanges: [{ start: new Date('1945-07-16'), end: new Date('1962-12-31') }]
        }
    }
};
export const COMPENSATION_RATES_FULL = { 10: { alone: 175.51 }, 20: { alone: 346.95 }, 30: { alone: 537.42, spouse: 601.42, child1: 579.42, spouse_child1: 648.42, parent1: 588.42, spouse_parent1: 652.42, child1_parent1: 630.42, spouse_child1_parent1: 699.42 }, 40: { alone: 774.16, spouse: 859.16, child1: 831.16, spouse_child1: 922.16, parent1: 842.16, spouse_parent1: 927.16, child1_parent1: 899.16, spouse_child1_parent1: 990.16 }, 50: { alone: 1102.04, spouse: 1208.04, child1: 1173.04, spouse_child1: 1287.04, parent1: 1187.04, spouse_parent1: 1293.04, child1_parent1: 1258.04, spouse_child1_parent1: 1372.04 }, 60: { alone: 1395.93, spouse: 1523.93, child1: 1480.93, spouse_child1: 1617.93, parent1: 1497.93, spouse_parent1: 1625.93, child1_parent1: 1582.93, spouse_child1_parent1: 1719.93 }, 70: { alone: 1759.19, spouse: 1908.19, child1: 1858.19, spouse_child1: 2018.19, parent1: 1879.19, spouse_parent1: 2028.19, child1_parent1: 1978.19, spouse_child1_parent1: 2138.19 }, 80: { alone: 2044.89, spouse: 2214.89, child1: 2158.89, spouse_child1: 2340.89, parent1: 2181.89, spouse_parent1: 2351.89, child1_parent1: 2295.89, spouse_child1_parent1: 2477.89 }, 90: { alone: 2297.96, spouse: 2489.96, child1: 2425.96, spouse_child1: 2630.96, parent1: 2451.96, spouse_parent1: 2643.96, child1_parent1: 2579.96, spouse_child1_parent1: 2784.96 }, 100: { alone: 3831.30, spouse: 4044.91, child1: 3974.15, spouse_child1: 4201.35, parent1: 4002.74, spouse_parent1: 4216.35, child1_parent1: 4145.59, spouse_child1_parent1: 4372.79 }};
export const ADDITIONAL_DEPENDENT_AMOUNTS = { child_under_18_each_additional: { 30: 31, 40: 42, 50: 53, 60: 63, 70: 74, 80: 84, 90: 95, 100: 106.14 }, child_over_18_school_each: { 30: 102, 40: 137, 50: 171, 60: 205, 70: 239, 80: 274, 90: 308, 100: 342.85 }, parent_each_additional: { 30: 51, 40: 68, 50: 85, 60: 102, 70: 120, 80: 137, 90: 154, 100: 171.44 }, spouse_a_a_fixed: { 30: 58, 40: 78, 50: 98, 60: 117, 70: 137, 80: 157, 90: 176, 100: 195.92 }, smc_k_fixed: 136.06 };
