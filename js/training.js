/**
 * FFXIV Squadron Calculator - Training Module
 * Handles training simulation and preview
 */

const Training = {
    // Currently selected training type
    selectedType: null,

    // Selected members for training
    selectedMembers: [],

    /**
     * Set selected training type
     * @param {string} type - Training type key
     */
    setTrainingType(type) {
        this.selectedType = type;
    },

    /**
     * Get current training type
     * @returns {string|null} Training type or null
     */
    getTrainingType() {
        return this.selectedType;
    },

    /**
     * Set selected members
     * @param {Array} members - Array of member objects
     */
    setSelectedMembers(members) {
        this.selectedMembers = members;
    },

    /**
     * Preview training effects on selected members
     * @param {string} trainingType - Training type key
     * @param {Array} members - Members to preview (optional, uses selectedMembers if not provided)
     * @returns {Object} Preview data
     */
    previewTraining(trainingType, members = null) {
        const targetMembers = members || this.selectedMembers;
        const effect = GameData.getTraining(trainingType);

        if (!effect || targetMembers.length === 0) {
            return null;
        }

        const currentTotal = Calculator.calculateGroupStats(targetMembers);
        const afterTotal = {
            physical: currentTotal.physical + effect.physical,
            mental: currentTotal.mental + effect.mental,
            tactical: currentTotal.tactical + effect.tactical
        };

        // Calculate individual member changes
        const memberChanges = targetMembers.map(member => ({
            id: member.id,
            name: member.name,
            before: {
                physical: member.physical,
                mental: member.mental,
                tactical: member.tactical
            },
            after: {
                physical: Math.max(0, member.physical + effect.physical),
                mental: Math.max(0, member.mental + effect.mental),
                tactical: Math.max(0, member.tactical + effect.tactical)
            },
            change: { ...effect }
        }));

        return {
            trainingType,
            trainingName: effect.name,
            effect: { ...effect },
            currentTotal,
            afterTotal,
            totalChange: {
                physical: effect.physical,
                mental: effect.mental,
                tactical: effect.tactical
            },
            memberChanges
        };
    },

    /**
     * Apply training to members and save to storage
     * @param {string} trainingType - Training type key
     * @param {Array} members - Members to train (modifies in place and saves)
     * @returns {boolean} Success status
     */
    applyTraining(trainingType, members) {
        const effect = GameData.getTraining(trainingType);

        if (!effect || members.length === 0) {
            return false;
        }

        // Apply to each member and save
        for (const member of members) {
            const newStats = {
                physical: Math.max(0, member.physical + effect.physical),
                mental: Math.max(0, member.mental + effect.mental),
                tactical: Math.max(0, member.tactical + effect.tactical)
            };

            // Update member object
            member.physical = newStats.physical;
            member.mental = newStats.mental;
            member.tactical = newStats.tactical;

            // Save to storage
            Storage.updateMember(member.id, newStats);
        }

        return true;
    },

    /**
     * Generate training recommendation based on current stats and target
     * @param {Object} current - Current total stats
     * @param {Object} target - Target stats
     * @returns {Array} Recommended trainings
     */
    recommendTrainings(current, target) {
        const diff = {
            physical: target.physical - current.physical,
            mental: target.mental - current.mental,
            tactical: target.tactical - current.tactical
        };

        const recommendations = [];

        // Find trainings that help meet the deficit
        for (const [key, training] of Object.entries(GameData.trainingEffects)) {
            let score = 0;

            // Score based on how much it helps with deficits
            if (diff.physical > 0 && training.physical > 0) {
                score += Math.min(diff.physical, training.physical);
            }
            if (diff.mental > 0 && training.mental > 0) {
                score += Math.min(diff.mental, training.mental);
            }
            if (diff.tactical > 0 && training.tactical > 0) {
                score += Math.min(diff.tactical, training.tactical);
            }

            // Penalize for reducing stats we need
            if (diff.physical > 0 && training.physical < 0) {
                score -= Math.min(diff.physical, Math.abs(training.physical)) * 0.5;
            }
            if (diff.mental > 0 && training.mental < 0) {
                score -= Math.min(diff.mental, Math.abs(training.mental)) * 0.5;
            }
            if (diff.tactical > 0 && training.tactical < 0) {
                score -= Math.min(diff.tactical, Math.abs(training.tactical)) * 0.5;
            }

            if (score > 0) {
                recommendations.push({
                    key,
                    training,
                    score
                });
            }
        }

        // Sort by score descending
        recommendations.sort((a, b) => b.score - a.score);

        return recommendations;
    },

    /**
     * Calculate how many trainings needed to reach target
     * @param {Object} current - Current stats
     * @param {Object} target - Target stats
     * @returns {Object} Training count estimate
     */
    estimateTrainingsNeeded(current, target) {
        const solution = Calculator.findTrainingSolution(current, target, 10);

        if (!solution) {
            return {
                possible: false,
                count: null,
                message: '無法在 10 次訓練內達成目標'
            };
        }

        if (solution.trainings.length === 0) {
            return {
                possible: true,
                count: 0,
                message: '目前能力值已達成目標'
            };
        }

        return {
            possible: true,
            count: solution.trainings.length,
            trainings: solution.trainings,
            message: `需要 ${solution.trainings.length} 次訓練`
        };
    },

    /**
     * Format training effect for display
     * @param {Object} effect - Training effect object
     * @returns {string} Formatted string
     */
    formatEffect(effect) {
        const parts = [];

        if (effect.physical !== 0) {
            const sign = effect.physical > 0 ? '+' : '';
            parts.push(`物理 ${sign}${effect.physical}`);
        }
        if (effect.mental !== 0) {
            const sign = effect.mental > 0 ? '+' : '';
            parts.push(`精神 ${sign}${effect.mental}`);
        }
        if (effect.tactical !== 0) {
            const sign = effect.tactical > 0 ? '+' : '';
            parts.push(`戰術 ${sign}${effect.tactical}`);
        }

        return parts.join(', ');
    },

    /**
     * Get training type display info
     * @param {string} type - Training type key
     * @returns {Object} Display info
     */
    getTrainingDisplayInfo(type) {
        const effect = GameData.getTraining(type);
        if (!effect) return null;

        // Determine which stat is the focus
        let focusStat = 'physical';
        let focusType = 'a';

        if (type.includes('mental')) focusStat = 'mental';
        else if (type.includes('tactical')) focusStat = 'tactical';

        if (type.includes('-b')) focusType = 'b';

        const focusStatName = {
            physical: '物理',
            mental: '精神',
            tactical: '戰術'
        }[focusStat];

        return {
            name: effect.name,
            description: effect.desc,
            focusStat,
            focusType,
            focusStatName,
            effect
        };
    }
};

// Export for module use
if (typeof module !== 'undefined' && module.exports) {
    module.exports = Training;
}
