/**
 * FFXIV Squadron Calculator - Storage Module
 * Handles localStorage operations for saving/loading member data
 */

const Storage = {
    STORAGE_KEY: 'ffxiv_squadron_members',
    SETTINGS_KEY: 'ffxiv_squadron_settings',

    /**
     * Save members to localStorage
     * @param {Array} members - Array of member objects
     */
    saveMembers(members) {
        try {
            localStorage.setItem(this.STORAGE_KEY, JSON.stringify(members));
            return true;
        } catch (e) {
            console.error('Failed to save members:', e);
            return false;
        }
    },

    /**
     * Load members from localStorage
     * @returns {Array} Array of member objects
     */
    loadMembers() {
        try {
            const data = localStorage.getItem(this.STORAGE_KEY);
            if (!data) return [];
            return JSON.parse(data);
        } catch (e) {
            console.error('Failed to load members:', e);
            return [];
        }
    },

    /**
     * Add a new member
     * @param {Object} member - Member object
     * @returns {boolean} Success status
     */
    addMember(member) {
        const members = this.loadMembers();
        if (members.length >= 8) {
            console.warn('Maximum of 8 members allowed');
            return false;
        }

        // Generate unique ID
        member.id = this.generateId();
        members.push(member);
        return this.saveMembers(members);
    },

    /**
     * Update an existing member
     * @param {string} id - Member ID
     * @param {Object} updates - Object with updates
     * @returns {boolean} Success status
     */
    updateMember(id, updates) {
        const members = this.loadMembers();
        const index = members.findIndex(m => m.id === id);

        if (index === -1) {
            console.warn('Member not found:', id);
            return false;
        }

        members[index] = { ...members[index], ...updates };
        return this.saveMembers(members);
    },

    /**
     * Delete a member
     * @param {string} id - Member ID
     * @returns {boolean} Success status
     */
    deleteMember(id) {
        const members = this.loadMembers();
        const filtered = members.filter(m => m.id !== id);

        if (filtered.length === members.length) {
            console.warn('Member not found:', id);
            return false;
        }

        return this.saveMembers(filtered);
    },

    /**
     * Get a single member by ID
     * @param {string} id - Member ID
     * @returns {Object|null} Member object or null
     */
    getMember(id) {
        const members = this.loadMembers();
        return members.find(m => m.id === id) || null;
    },

    /**
     * Clear all members
     * @returns {boolean} Success status
     */
    clearMembers() {
        try {
            localStorage.removeItem(this.STORAGE_KEY);
            return true;
        } catch (e) {
            console.error('Failed to clear members:', e);
            return false;
        }
    },

    /**
     * Export members as JSON string
     * @returns {string} JSON string
     */
    exportData() {
        const members = this.loadMembers();
        return JSON.stringify(members, null, 2);
    },

    /**
     * Import members from JSON string
     * @param {string} jsonString - JSON string
     * @returns {boolean} Success status
     */
    importData(jsonString) {
        try {
            const data = JSON.parse(jsonString);

            // Validate data structure
            if (!Array.isArray(data)) {
                throw new Error('Invalid data format: expected array');
            }

            // Validate each member - support both old format (name/job) and new format (recruitId)
            const validMembers = data.filter(member => {
                // New format with recruitId
                if (member.recruitId) {
                    return typeof member.recruitId === 'number';
                }
                // Old format with name and job
                return member.name &&
                       member.job &&
                       typeof member.physical === 'number' &&
                       typeof member.mental === 'number' &&
                       typeof member.tactical === 'number';
            }).map(member => {
                const base = {
                    id: member.id || this.generateId(),
                    level: member.level || 60
                };

                // New format with recruitId
                if (member.recruitId && typeof GameData !== 'undefined') {
                    const recruit = GameData.getRecruit(member.recruitId);
                    if (recruit) {
                        const stats = GameData.getRecruitStats(member.recruitId, base.level, 3);
                        return {
                            ...base,
                            recruitId: member.recruitId,
                            name: recruit.name,
                            job: recruit.job,
                            race: recruit.race,
                            physical: stats?.physical || 0,
                            mental: stats?.mental || 0,
                            tactical: stats?.tactical || 0
                        };
                    }
                }

                // Old format or fallback
                return {
                    ...base,
                    recruitId: member.recruitId || null,
                    name: member.name,
                    job: member.job,
                    race: member.race || 'hyur',
                    physical: member.physical || 0,
                    mental: member.mental || 0,
                    tactical: member.tactical || 0
                };
            });

            if (validMembers.length === 0) {
                throw new Error('No valid members found in data');
            }

            // Limit to 8 members
            const limitedMembers = validMembers.slice(0, 8);

            return this.saveMembers(limitedMembers);
        } catch (e) {
            console.error('Failed to import data:', e);
            return false;
        }
    },

    /**
     * Save settings
     * @param {Object} settings - Settings object
     */
    saveSettings(settings) {
        try {
            localStorage.setItem(this.SETTINGS_KEY, JSON.stringify(settings));
            return true;
        } catch (e) {
            console.error('Failed to save settings:', e);
            return false;
        }
    },

    /**
     * Load settings
     * @returns {Object} Settings object
     */
    loadSettings() {
        try {
            const data = localStorage.getItem(this.SETTINGS_KEY);
            if (!data) return {};
            return JSON.parse(data);
        } catch (e) {
            console.error('Failed to load settings:', e);
            return {};
        }
    },

    /**
     * Generate unique ID
     * @returns {string} Unique ID
     */
    generateId() {
        return 'member_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
    }
};

// Export for module use
if (typeof module !== 'undefined' && module.exports) {
    module.exports = Storage;
}
