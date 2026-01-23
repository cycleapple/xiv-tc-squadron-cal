/**
 * FFXIV Squadron Calculator - Calculator Engine
 * Handles combination enumeration and optimal training calculation
 */

const Calculator = {
    /**
     * Calculate training result with redistribution logic
     * Training adds to target stats and subtracts from other stats when at cap
     * @param {Object} currentPool - Current pool values {physical, mental, tactical}
     * @param {Object} training - Training effect {physical, mental, tactical}
     * @param {number} cap - Pool cap based on squad rank
     * @returns {Object} New pool values after training
     */
    applyTrainingToPool(currentPool, training, cap) {
        // Calculate total increase from training
        const totalIncrease = Math.max(0, training.physical) +
                              Math.max(0, training.mental) +
                              Math.max(0, training.tactical);

        // Find which stats were NOT increased (these will be reduced)
        const otherStats = [];
        if (training.physical <= 0) otherStats.push('physical');
        if (training.mental <= 0) otherStats.push('mental');
        if (training.tactical <= 0) otherStats.push('tactical');

        // Start with training applied
        let newPool = {
            physical: currentPool.physical + training.physical,
            mental: currentPool.mental + training.mental,
            tactical: currentPool.tactical + training.tactical
        };

        // Check if we're at or over cap - if so, redistribute
        const currentTotal = currentPool.physical + currentPool.mental + currentPool.tactical;
        if (currentTotal >= cap && otherStats.length > 0 && totalIncrease > 0) {
            let remaining = totalIncrease;

            // First pass: try to reduce evenly
            const reducePerStat = Math.floor(totalIncrease / otherStats.length);

            for (const stat of otherStats) {
                const maxReduce = Math.min(reducePerStat, newPool[stat]);
                newPool[stat] -= maxReduce;
                remaining -= maxReduce;
            }

            // Second pass: handle remainder
            while (remaining > 0) {
                let reduced = false;
                for (const stat of otherStats) {
                    if (newPool[stat] > 0 && remaining > 0) {
                        newPool[stat]--;
                        remaining--;
                        reduced = true;
                    }
                }
                if (!reduced) break;
            }
        }

        // Ensure no negative values and cap total
        newPool.physical = Math.max(0, newPool.physical);
        newPool.mental = Math.max(0, newPool.mental);
        newPool.tactical = Math.max(0, newPool.tactical);

        // Final check: ensure total doesn't exceed cap
        const finalTotal = newPool.physical + newPool.mental + newPool.tactical;
        if (finalTotal > cap) {
            const scale = cap / finalTotal;
            newPool.physical = Math.floor(newPool.physical * scale);
            newPool.mental = Math.floor(newPool.mental * scale);
            newPool.tactical = Math.floor(newPool.tactical * scale);
        }

        return newPool;
    },

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
     * @param {Object} current - Current total stats (members + pool + chemistry)
     * @param {Object} required - Required stats
     * @param {Object} poolInfo - Training pool info {pool, cap, memberStats} (optional)
     * @param {number} maxTrainings - Maximum trainings to search (default 5)
     * @returns {Object|null} Training solution or null if impossible
     */
    findTrainingSolution(current, required, poolInfo = null, maxTrainings = 5) {
        // Already meets requirements
        if (this.meetsRequirements(current, required)) {
            return { trainings: [], resultStats: { ...current } };
        }

        const trainingTypes = Object.keys(GameData.trainingEffects).filter(t => t !== 'comprehensive');

        // If no pool info provided, use simple calculation (legacy mode)
        if (!poolInfo) {
            return this._findTrainingSolutionSimple(current, required, trainingTypes, maxTrainings);
        }

        const { pool, cap, memberStats } = poolInfo;
        const queue = [{ pool: { ...pool }, trainings: [] }];
        const visited = new Set();

        while (queue.length > 0) {
            const { pool: currentPool, trainings } = queue.shift();

            // Don't search beyond max trainings
            if (trainings.length >= maxTrainings) continue;

            // Try each training type
            for (const trainingType of trainingTypes) {
                const effect = GameData.trainingEffects[trainingType];

                // Apply training with redistribution logic
                const newPool = this.applyTrainingToPool(currentPool, effect, cap);

                // Calculate new total stats
                const newStats = {
                    physical: memberStats.physical + newPool.physical,
                    mental: memberStats.mental + newPool.mental,
                    tactical: memberStats.tactical + newPool.tactical
                };

                const newTrainings = [...trainings, trainingType];

                // Check if this meets requirements
                if (this.meetsRequirements(newStats, required)) {
                    return {
                        trainings: newTrainings,
                        resultStats: newStats,
                        resultPool: newPool
                    };
                }

                // Generate state key for visited check (based on pool state)
                const stateKey = `${newPool.physical},${newPool.mental},${newPool.tactical}`;

                if (!visited.has(stateKey)) {
                    visited.add(stateKey);
                    queue.push({ pool: newPool, trainings: newTrainings });
                }
            }
        }

        return null; // No solution found within max trainings
    },

    /**
     * Simple training solution finder (legacy, without pool redistribution)
     */
    _findTrainingSolutionSimple(current, required, trainingTypes, maxTrainings) {
        const queue = [{ stats: { ...current }, trainings: [] }];
        const visited = new Set();

        while (queue.length > 0) {
            const { stats, trainings } = queue.shift();

            if (trainings.length >= maxTrainings) continue;

            for (const trainingType of trainingTypes) {
                const effect = GameData.trainingEffects[trainingType];
                const newStats = {
                    physical: Math.max(0, stats.physical + effect.physical),
                    mental: Math.max(0, stats.mental + effect.mental),
                    tactical: Math.max(0, stats.tactical + effect.tactical)
                };

                const newTrainings = [...trainings, trainingType];

                if (this.meetsRequirements(newStats, required)) {
                    return {
                        trainings: newTrainings,
                        resultStats: newStats
                    };
                }

                const stateKey = `${newStats.physical},${newStats.mental},${newStats.tactical}`;

                if (!visited.has(stateKey)) {
                    visited.add(stateKey);
                    queue.push({ stats: newStats, trainings: newTrainings });
                }
            }
        }

        return null;
    },

    /**
     * Analyze all combinations and rank by optimal solutions
     * @param {Array} members - Array of all members
     * @param {Object} requirements - Required stats
     * @param {Object} trainingPool - Training pool stats
     * @param {number} missionLevel - Mission level for chemistry conditions
     * @param {number} squadRank - Squad rank for pool cap calculation
     * @returns {Array} Sorted array of results
     */
    analyzeAllCombinations(members, requirements, trainingPool = { physical: 0, mental: 0, tactical: 0 }, missionLevel = 1, squadRank = 3) {
        const combinations = this.getCombinations(members);
        const results = [];
        const poolCap = GameData.rankCaps[squadRank] || 400;

        for (const combo of combinations) {
            // Calculate stats with chemistry bonuses
            const chemistryResult = this.calculateStatsWithChemistry(combo, missionLevel);
            const memberStats = chemistryResult.baseStats;

            // Add training pool and chemistry bonuses
            const currentStats = {
                physical: chemistryResult.totalStats.physical + trainingPool.physical,
                mental: chemistryResult.totalStats.mental + trainingPool.mental,
                tactical: chemistryResult.totalStats.tactical + trainingPool.tactical
            };
            const difference = this.calculateDifference(currentStats, requirements);

            const result = {
                members: combo,
                currentStats,
                memberStats, // Base stats without pool or chemistry
                baseStatsWithChemistry: chemistryResult.totalStats, // Stats with chemistry but without pool
                chemistryBonuses: chemistryResult.chemistryBonuses,
                activeChemistries: chemistryResult.activeChemistries,
                trainingPool,
                difference,
                meetsRequirements: this.meetsRequirements(currentStats, requirements),
                trainingSolution: null,
                score: 0
            };

            // If already meets requirements, score is highest
            if (result.meetsRequirements) {
                result.score = 1000;
            } else {
                // Find training solution with pool redistribution logic
                const poolInfo = {
                    pool: { ...trainingPool },
                    cap: poolCap,
                    memberStats: chemistryResult.totalStats // Stats with chemistry but without pool
                };
                const solution = this.findTrainingSolution(currentStats, requirements, poolInfo);
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
        const { considerJobChange = false, squadRank = 3, trainingPool = { physical: 0, mental: 0, tactical: 0 }, missionLevel = 1 } = options;

        let allResults = this.analyzeAllCombinations(members, requirements, trainingPool, missionLevel, squadRank);

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
     * Calculate stats with chemistry effects for a group
     * @param {Array} members - Array of member objects
     * @param {number} missionLevel - Mission level (for chemistry conditions)
     * @returns {Object} Stats with chemistry bonuses applied
     */
    calculateStatsWithChemistry(members, missionLevel = 1) {
        // Calculate base stats first
        const baseStats = this.calculateGroupStats(members);

        // Calculate chemistry bonuses using GameData helper
        const chemistryResult = GameData.calculateChemistryBonuses(members, missionLevel);

        // Total stats = base stats + chemistry bonuses
        return {
            baseStats,
            chemistryBonuses: chemistryResult.bonuses,
            memberBonuses: chemistryResult.memberBonuses,
            activeChemistries: chemistryResult.activeChemistries,
            totalStats: {
                physical: baseStats.physical + chemistryResult.bonuses.physical,
                mental: baseStats.mental + chemistryResult.bonuses.mental,
                tactical: baseStats.tactical + chemistryResult.bonuses.tactical
            }
        };
    },

    /**
     * Format active chemistry info for display
     * @param {Array} activeChemistries - Array of active chemistry objects
     * @returns {Array} Formatted chemistry info
     */
    formatActiveChemistries(activeChemistries) {
        return activeChemistries.map(chem => ({
            memberName: chem.member.name,
            condition: chem.condition.name,
            effect: `${chem.effect.name}+${chem.percentage}%`,
            scope: chem.scope === 'team' ? '全員' : '自身',
            stat: chem.stat,
            bonus: Math.floor(chem.member[chem.stat] * chem.percentage / 100)
        }));
    }
};

// Export for module use

// Export for module use
if (typeof module !== 'undefined' && module.exports) {
    module.exports = Calculator;
}
