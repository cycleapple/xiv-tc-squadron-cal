/**
 * FFXIV Squadron Calculator - Calculator Engine
 * Handles combination enumeration and optimal training calculation
 */

const Calculator = {
    /**
     * Calculate all possible 4-member combinations
     * @param {Array} members - Array of member objects (max 8)
     * @returns {Array} Array of combination arrays
     */
    getCombinations(members) {
        const combinations = [];
        const n = members.length;

        if (n < 4) return combinations;

        // Generate all C(n, 4) combinations
        for (let i = 0; i < n - 3; i++) {
            for (let j = i + 1; j < n - 2; j++) {
                for (let k = j + 1; k < n - 1; k++) {
                    for (let l = k + 1; l < n; l++) {
                        combinations.push([
                            members[i],
                            members[j],
                            members[k],
                            members[l]
                        ]);
                    }
                }
            }
        }

        return combinations;
    },

    /**
     * Calculate total stats for a group of members
     * @param {Array} members - Array of member objects
     * @returns {Object} Total stats object
     */
    calculateGroupStats(members) {
        return members.reduce((total, member) => ({
            physical: total.physical + (member.physical || 0),
            mental: total.mental + (member.mental || 0),
            tactical: total.tactical + (member.tactical || 0)
        }), { physical: 0, mental: 0, tactical: 0 });
    },

    /**
     * Calculate the difference between current stats and requirements
     * @param {Object} current - Current stats
     * @param {Object} required - Required stats
     * @returns {Object} Difference object (positive means surplus)
     */
    calculateDifference(current, required) {
        return {
            physical: current.physical - required.physical,
            mental: current.mental - required.mental,
            tactical: current.tactical - required.tactical
        };
    },

    /**
     * Check if current stats meet requirements
     * @param {Object} current - Current stats
     * @param {Object} required - Required stats
     * @returns {boolean} True if requirements met
     */
    meetsRequirements(current, required) {
        return current.physical >= required.physical &&
               current.mental >= required.mental &&
               current.tactical >= required.tactical;
    },

    /**
     * Find minimum training sequence to meet requirements
     * Uses BFS to find shortest path
     * @param {Object} current - Current stats
     * @param {Object} required - Required stats
     * @param {number} maxTrainings - Maximum trainings to search (default 5)
     * @returns {Object|null} Training solution or null if impossible
     */
    findTrainingSolution(current, required, maxTrainings = 5) {
        // Already meets requirements
        if (this.meetsRequirements(current, required)) {
            return { trainings: [], resultStats: { ...current } };
        }

        const trainingTypes = Object.keys(GameData.trainingEffects);
        const queue = [{ stats: { ...current }, trainings: [] }];
        const visited = new Set();

        while (queue.length > 0) {
            const { stats, trainings } = queue.shift();

            // Don't search beyond max trainings
            if (trainings.length >= maxTrainings) continue;

            // Try each training type
            for (const trainingType of trainingTypes) {
                const effect = GameData.trainingEffects[trainingType];
                const newStats = {
                    physical: Math.max(0, stats.physical + effect.physical),
                    mental: Math.max(0, stats.mental + effect.mental),
                    tactical: Math.max(0, stats.tactical + effect.tactical)
                };

                const newTrainings = [...trainings, trainingType];

                // Check if this meets requirements
                if (this.meetsRequirements(newStats, required)) {
                    return {
                        trainings: newTrainings,
                        resultStats: newStats
                    };
                }

                // Generate state key for visited check
                const stateKey = `${newStats.physical},${newStats.mental},${newStats.tactical}`;

                if (!visited.has(stateKey)) {
                    visited.add(stateKey);
                    queue.push({ stats: newStats, trainings: newTrainings });
                }
            }
        }

        return null; // No solution found within max trainings
    },

    /**
     * Analyze all combinations and rank by optimal solutions
     * @param {Array} members - Array of all members
     * @param {Object} requirements - Required stats
     * @returns {Array} Sorted array of results
     */
    analyzeAllCombinations(members, requirements) {
        const combinations = this.getCombinations(members);
        const results = [];

        for (const combo of combinations) {
            const currentStats = this.calculateGroupStats(combo);
            const difference = this.calculateDifference(currentStats, requirements);

            const result = {
                members: combo,
                currentStats,
                difference,
                meetsRequirements: this.meetsRequirements(currentStats, requirements),
                trainingSolution: null,
                score: 0
            };

            // If already meets requirements, score is highest
            if (result.meetsRequirements) {
                result.score = 1000;
            } else {
                // Find training solution
                const solution = this.findTrainingSolution(currentStats, requirements);
                result.trainingSolution = solution;

                if (solution) {
                    // Score based on training count (fewer is better)
                    result.score = 100 - (solution.trainings.length * 10);
                } else {
                    // No solution - calculate how close they are
                    const deficit = Math.abs(Math.min(0, difference.physical)) +
                                   Math.abs(Math.min(0, difference.mental)) +
                                   Math.abs(Math.min(0, difference.tactical));
                    result.score = -deficit;
                }
            }

            results.push(result);
        }

        // Sort by score (highest first)
        results.sort((a, b) => b.score - a.score);

        return results;
    },

    /**
     * Get top N results
     * @param {Array} members - Array of all members
     * @param {Object} requirements - Required stats
     * @param {number} limit - Maximum results to return
     * @param {Object} options - Additional options
     * @returns {Array} Top results
     */
    getTopResults(members, requirements, limit = 5, options = {}) {
        const { considerJobChange = false, squadRank = 3 } = options;

        let allResults = this.analyzeAllCombinations(members, requirements);

        // If considering job changes, find additional solutions with job changes
        if (considerJobChange) {
            allResults = this.analyzeWithJobChanges(members, requirements, allResults, squadRank);
        }

        return allResults.slice(0, limit);
    },

    /**
     * Analyze combinations with potential job changes
     * @param {Array} members - All members
     * @param {Object} requirements - Required stats
     * @param {Array} baseResults - Results without job changes
     * @param {number} squadRank - Squad rank for stat calculation
     * @returns {Array} Results including job change suggestions
     */
    analyzeWithJobChanges(members, requirements, baseResults, squadRank) {
        const results = [...baseResults];
        const jobKeys = Object.keys(GameData.jobs);

        // For combinations that don't meet requirements and have no training solution,
        // try to find job change suggestions
        for (const result of results) {
            if (result.meetsRequirements) continue;

            // Find best job change suggestions for this combination
            const jobChangeSuggestions = this.findBestJobChanges(
                result.members,
                requirements,
                squadRank
            );

            if (jobChangeSuggestions) {
                result.jobChanges = jobChangeSuggestions.changes;
                result.statsAfterJobChange = jobChangeSuggestions.newStats;

                // Update score if job change helps meet requirements
                if (this.meetsRequirements(jobChangeSuggestions.newStats, requirements)) {
                    // Job change can meet requirements
                    result.score = 90 - jobChangeSuggestions.changes.length * 5;
                }
            }
        }

        // Re-sort by score
        results.sort((a, b) => b.score - a.score);

        return results;
    },

    /**
     * Find best job changes for a group to meet requirements
     * @param {Array} groupMembers - The 4 members in the group
     * @param {Object} requirements - Required stats
     * @param {number} squadRank - Squad rank
     * @returns {Object|null} Job change suggestions
     */
    findBestJobChanges(groupMembers, requirements, squadRank) {
        const jobKeys = Object.keys(GameData.jobs);
        let bestSolution = null;
        let bestScore = -Infinity;

        // Try changing one member's job at a time (simpler approach)
        for (let i = 0; i < groupMembers.length; i++) {
            const member = groupMembers[i];

            for (const newJob of jobKeys) {
                if (newJob === member.job) continue;

                // Calculate new stats for this member with new job
                const newMemberStats = GameData.calculateStatsForLevel(newJob, member.level, squadRank);

                // Create modified group
                const modifiedMembers = groupMembers.map((m, idx) => {
                    if (idx === i) {
                        return { ...m, ...newMemberStats, job: newJob };
                    }
                    return m;
                });

                const newGroupStats = this.calculateGroupStats(modifiedMembers);

                if (this.meetsRequirements(newGroupStats, requirements)) {
                    const score = 100; // Met requirements with 1 job change
                    if (score > bestScore) {
                        bestScore = score;
                        bestSolution = {
                            changes: [{
                                memberId: member.id,
                                name: member.name,
                                from: member.job,
                                to: newJob
                            }],
                            newStats: newGroupStats
                        };
                    }
                }
            }
        }

        // If single job change doesn't work, try two job changes
        if (!bestSolution) {
            for (let i = 0; i < groupMembers.length - 1; i++) {
                for (let j = i + 1; j < groupMembers.length; j++) {
                    for (const newJob1 of jobKeys) {
                        if (newJob1 === groupMembers[i].job) continue;

                        for (const newJob2 of jobKeys) {
                            if (newJob2 === groupMembers[j].job) continue;

                            const newStats1 = GameData.calculateStatsForLevel(newJob1, groupMembers[i].level, squadRank);
                            const newStats2 = GameData.calculateStatsForLevel(newJob2, groupMembers[j].level, squadRank);

                            const modifiedMembers = groupMembers.map((m, idx) => {
                                if (idx === i) return { ...m, ...newStats1, job: newJob1 };
                                if (idx === j) return { ...m, ...newStats2, job: newJob2 };
                                return m;
                            });

                            const newGroupStats = this.calculateGroupStats(modifiedMembers);

                            if (this.meetsRequirements(newGroupStats, requirements)) {
                                const score = 80; // Met requirements with 2 job changes
                                if (score > bestScore) {
                                    bestScore = score;
                                    bestSolution = {
                                        changes: [
                                            {
                                                memberId: groupMembers[i].id,
                                                name: groupMembers[i].name,
                                                from: groupMembers[i].job,
                                                to: newJob1
                                            },
                                            {
                                                memberId: groupMembers[j].id,
                                                name: groupMembers[j].name,
                                                from: groupMembers[j].job,
                                                to: newJob2
                                            }
                                        ],
                                        newStats: newGroupStats
                                    };
                                }
                            }
                        }
                    }
                }
            }
        }

        return bestSolution;
    },

    /**
     * Simulate applying training to members
     * Training affects ALL members equally
     * @param {Array} members - Array of member objects
     * @param {string} trainingType - Training type key
     * @returns {Array} New member array with updated stats
     */
    applyTraining(members, trainingType) {
        const effect = GameData.trainingEffects[trainingType];
        if (!effect) return members;

        return members.map(member => ({
            ...member,
            physical: Math.max(0, member.physical + effect.physical),
            mental: Math.max(0, member.mental + effect.mental),
            tactical: Math.max(0, member.tactical + effect.tactical)
        }));
    },

    /**
     * Analyze job change potential
     * @param {Object} member - Current member
     * @param {Object} requirements - Required stats to meet
     * @param {Array} otherMembers - Other members in the group
     * @returns {Array} Array of job change suggestions
     */
    analyzeJobChange(member, requirements, otherMembers) {
        const suggestions = [];
        const currentOtherStats = this.calculateGroupStats(otherMembers);

        // Calculate how much this member contributes
        const neededFromMember = {
            physical: requirements.physical - currentOtherStats.physical,
            mental: requirements.mental - currentOtherStats.mental,
            tactical: requirements.tactical - currentOtherStats.tactical
        };

        // Check each possible job
        for (const [jobKey, job] of Object.entries(GameData.jobs)) {
            if (jobKey === member.job) continue;

            const newStats = GameData.calculateStatsForLevel(jobKey, member.level);
            const meetsNeeds =
                newStats.physical >= neededFromMember.physical &&
                newStats.mental >= neededFromMember.mental &&
                newStats.tactical >= neededFromMember.tactical;

            if (meetsNeeds) {
                suggestions.push({
                    job: jobKey,
                    jobName: job.name,
                    newStats,
                    improvement: {
                        physical: newStats.physical - member.physical,
                        mental: newStats.mental - member.mental,
                        tactical: newStats.tactical - member.tactical
                    }
                });
            }
        }

        // Sort by total improvement
        suggestions.sort((a, b) => {
            const totalA = a.improvement.physical + a.improvement.mental + a.improvement.tactical;
            const totalB = b.improvement.physical + b.improvement.mental + b.improvement.tactical;
            return totalB - totalA;
        });

        return suggestions;
    },

    /**
     * Calculate chemistry bonus for a group
     * @param {Array} members - Array of member objects
     * @returns {Object} Bonus information
     */
    calculateChemistryBonus(members) {
        const races = members.map(m => m.race);
        const jobs = members.map(m => m.job);

        const bonuses = [];

        // Check for same race bonus
        const raceCounts = {};
        races.forEach(r => { raceCounts[r] = (raceCounts[r] || 0) + 1; });
        const maxSameRace = Math.max(...Object.values(raceCounts));

        if (maxSameRace >= 2) {
            bonuses.push({
                type: 'sameRace',
                value: GameData.chemistryBonuses.sameRace,
                description: `${maxSameRace} 名相同種族 +${GameData.chemistryBonuses.sameRace}%`
            });
        }

        // Check for same job bonus
        const jobCounts = {};
        jobs.forEach(j => { jobCounts[j] = (jobCounts[j] || 0) + 1; });
        const maxSameJob = Math.max(...Object.values(jobCounts));

        if (maxSameJob >= 2) {
            bonuses.push({
                type: 'sameJob',
                value: GameData.chemistryBonuses.sameJob,
                description: `${maxSameJob} 名相同職業 +${GameData.chemistryBonuses.sameJob}%`
            });
        }

        // Check for all different races
        const uniqueRaces = new Set(races).size;
        if (uniqueRaces === 4) {
            bonuses.push({
                type: 'mixedRace',
                value: GameData.chemistryBonuses.mixedRace,
                description: `4 種不同種族 +${GameData.chemistryBonuses.mixedRace}%`
            });
        }

        return {
            bonuses,
            totalBonus: bonuses.reduce((sum, b) => sum + b.value, 0)
        };
    }
};

// Export for module use
if (typeof module !== 'undefined' && module.exports) {
    module.exports = Calculator;
}
