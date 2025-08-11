// src/utils.js

/**
 * Dynamically loads an external script and returns a promise.
 * @param {string} src - The source URL of the script to load.
 * @returns {Promise<void>} A promise that resolves when the script is loaded.
 */
export const loadScript = (src) => {
    return new Promise((resolve, reject) => {
        if (document.querySelector(`script[src="${src}"]`)) {
            return resolve();
        }
        const script = document.createElement('script');
        script.src = src;
        script.onload = () => resolve();
        script.onerror = (err) => reject(new Error(`Failed to load script: ${src}\n${err.message}`));
        document.head.appendChild(script);
    });
};

/**
 * Rounds a percentage to the nearest ten.
 * @param {number} percentage - The percentage to round.
 * @returns {number} The rounded percentage.
 */
export const roundToNearestTen = (percentage) => Math.round(percentage / 10) * 10;

/**
 * Calculates the combined VA rating from a list of individual ratings.
 * @param {number[]} ratings - An array of individual disability ratings.
 * @returns {number} The calculated combined rating (pre-rounding).
 */
export const calculateVACombinedRating = (ratings) => {
    const activeRatings = ratings.filter(r => r > 0).sort((a, b) => b - a);
    if (activeRatings.length === 0) return 0;
    let remainingEfficiency = 100;
    activeRatings.forEach(rating => {
        remainingEfficiency *= (1 - rating / 100);
    });
    return 100 - remainingEfficiency;
};
