/**
 * Mesmer Tigrinya - Progress Tracking System
 * Handles quiz completion data storage and retrieval
 */

class ProgressTracker {
    constructor() {
        this.storageKey = 'mesmer_tigrinya_progress';
        this.isLocalStorageAvailable = this.checkLocalStorageAvailability();
    }

    /**
     * Check if localStorage is available and accessible
     */
    checkLocalStorageAvailability() {
        try {
            const test = '__storage_test__';
            localStorage.setItem(test, test);
            localStorage.removeItem(test);
            return true;
        } catch (e) {
            console.warn('localStorage not available:', e);
            return false;
        }
    }

    /**
     * Get all progress data from localStorage
     */
    getAllProgress() {
        if (!this.isLocalStorageAvailable) {
            return {};
        }

        try {
            const data = localStorage.getItem(this.storageKey);
            return data ? JSON.parse(data) : {};
        } catch (e) {
            console.warn('Error reading progress data:', e);
            return {};
        }
    }

    /**
     * Save progress data to localStorage
     */
    saveProgress(progressData) {
        if (!this.isLocalStorageAvailable) {
            console.warn('Cannot save progress: localStorage not available');
            return false;
        }

        try {
            localStorage.setItem(this.storageKey, JSON.stringify(progressData));
            return true;
        } catch (e) {
            console.warn('Error saving progress data:', e);
            return false;
        }
    }

    /**
     * Update progress for a specific quiz
     * @param {string} quizId - Unique identifier for the quiz
     * @param {number} score - Number of correct answers
     * @param {number} total - Total number of questions
     * @param {number} percentage - Score percentage (0-100)
     * @param {object} timeTaken - Time taken object with minutes, seconds, total
     * @param {object} metadata - Additional quiz metadata (optional)
     */
    updateQuizProgress(quizId, score, total, percentage, timeTaken, metadata = {}) {
        const progressData = this.getAllProgress();

        // Initialize quiz progress if it doesn't exist
        if (!progressData[quizId]) {
            progressData[quizId] = {
                completed: false,
                attempts: [],
                bestScore: 0,
                lastAttempt: null
            };
        }

        const quizProgress = progressData[quizId];
        const attempt = {
            score,
            total,
            percentage,
            timeTaken,
            date: new Date().toISOString(),
            metadata
        };

        // Add to attempts history
        quizProgress.attempts.push(attempt);

        // Update best score
        if (percentage > quizProgress.bestScore) {
            quizProgress.bestScore = percentage;
        }

        // Mark as completed if score >= 70%
        quizProgress.completed = percentage >= 70;

        // Update last attempt
        quizProgress.lastAttempt = attempt;

        // Keep only last 10 attempts to prevent storage bloat
        if (quizProgress.attempts.length > 10) {
            quizProgress.attempts = quizProgress.attempts.slice(-10);
        }

        return this.saveProgress(progressData);
    }

    /**
     * Get progress for a specific quiz
     * @param {string} quizId - Unique identifier for the quiz
     */
    getQuizProgress(quizId) {
        const progressData = this.getAllProgress();
        return progressData[quizId] || {
            completed: false,
            attempts: [],
            bestScore: 0,
            lastAttempt: null
        };
    }

    /**
     * Check if a quiz is completed
     * @param {string} quizId - Unique identifier for the quiz
     */
    isQuizCompleted(quizId) {
        const quizProgress = this.getQuizProgress(quizId);
        return quizProgress.completed;
    }

    /**
     * Get overall progress across all quizzes
     */
    getOverallProgress() {
        const progressData = this.getAllProgress();
        const quizIds = Object.keys(progressData);

        if (quizIds.length === 0) {
            return {
                totalQuizzes: 0,
                completedQuizzes: 0,
                overallPercentage: 0,
                totalScore: 0,
                maxScore: 0
            };
        }

        let completedQuizzes = 0;
        let totalScore = 0;
        let maxScore = 0;

        quizIds.forEach(quizId => {
            const quizProgress = progressData[quizId];
            if (quizProgress.completed) {
                completedQuizzes++;
            }
            totalScore += quizProgress.bestScore;
            maxScore += 100; // Each quiz contributes up to 100%
        });

        const overallPercentage = maxScore > 0 ? Math.round((totalScore / maxScore) * 100) : 0;

        return {
            totalQuizzes: quizIds.length,
            completedQuizzes,
            overallPercentage,
            totalScore,
            maxScore,
            completionRate: Math.round((completedQuizzes / quizIds.length) * 100)
        };
    }

    /**
     * Clear all progress data
     */
    clearAllProgress() {
        if (!this.isLocalStorageAvailable) {
            return false;
        }

        try {
            localStorage.removeItem(this.storageKey);
            return true;
        } catch (e) {
            console.warn('Error clearing progress data:', e);
            return false;
        }
    }

    /**
     * Export progress data as JSON string
     */
    exportProgress() {
        return JSON.stringify(this.getAllProgress(), null, 2);
    }

    /**
     * Import progress data from JSON string
     * @param {string} jsonData - JSON string containing progress data
     */
    importProgress(jsonData) {
        try {
            const progressData = JSON.parse(jsonData);
            return this.saveProgress(progressData);
        } catch (e) {
            console.warn('Error importing progress data:', e);
            return false;
        }
    }

    /**
     * Get quiz statistics for a specific quiz
     * @param {string} quizId - Unique identifier for the quiz
     */
    getQuizStatistics(quizId) {
        const quizProgress = this.getQuizProgress(quizId);

        if (quizProgress.attempts.length === 0) {
            return {
                attempts: 0,
                bestScore: 0,
                averageScore: 0,
                lastAttempt: null,
                completed: false
            };
        }

        const scores = quizProgress.attempts.map(attempt => attempt.percentage);
        const averageScore = Math.round(scores.reduce((a, b) => a + b, 0) / scores.length);

        return {
            attempts: quizProgress.attempts.length,
            bestScore: quizProgress.bestScore,
            averageScore,
            lastAttempt: quizProgress.lastAttempt,
            completed: quizProgress.completed
        };
    }
}

// Create a global instance
window.progressTracker = new ProgressTracker();