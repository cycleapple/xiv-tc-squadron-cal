/**
 * FFXIV Squadron Calculator - Main Application Entry
 * Initializes the application when DOM is ready
 */

(function() {
    'use strict';

    /**
     * Application initialization
     */
    function init() {
        console.log('FFXIV Squadron Calculator initializing...');

        // Check for required dependencies
        if (typeof GameData === 'undefined') {
            console.error('GameData not loaded');
            return;
        }
        if (typeof Storage === 'undefined') {
            console.error('Storage not loaded');
            return;
        }
        if (typeof Calculator === 'undefined') {
            console.error('Calculator not loaded');
            return;
        }
        if (typeof Training === 'undefined') {
            console.error('Training not loaded');
            return;
        }
        if (typeof UI === 'undefined') {
            console.error('UI not loaded');
            return;
        }

        // Initialize UI
        UI.init();

        // Add sample data if no members exist (for demo purposes)
        if (UI.members.length === 0) {
            addSampleData();
        }

        console.log('FFXIV Squadron Calculator ready!');
    }

    /**
     * Add sample data for demonstration
     * Uses predefined recruits from GameData
     */
    function addSampleData() {
        // Select 8 diverse recruits covering different roles
        const sampleRecruitIds = [
            1016931, // 艾麗絲 (人族 劍術士 - Tank)
            1016926, // 塞西莉 (人族 幻術士 - Healer)
            1016929, // 赫羅克 (人族 槍術士 - DPS)
            1016927, // 奧琳 (人族 弓術士 - Ranged)
            1016944, // 奴奴魯帕·塔塔魯帕 (拉拉菲爾族 咒術士 - DPS)
            1016964, // 哈斯塔爾烏雅 (魯加族 斧術士 - Tank)
            1016955, // 玖茲·阿·嘉奇亞 (貓魅族 雙劍士 - DPS)
            1016977  // 薩姆嘉 (敖龍族 巴術士 - DPS)
        ];

        const sampleMembers = sampleRecruitIds.map(recruitId => {
            const recruit = GameData.getRecruit(recruitId);
            if (!recruit) return null;

            const stats = GameData.getRecruitStats(recruitId, 60, 3);
            return {
                id: Storage.generateId(),
                recruitId: recruitId,
                name: recruit.name,
                job: recruit.job,
                race: recruit.race,
                level: 60,
                physical: stats.physical,
                mental: stats.mental,
                tactical: stats.tactical
            };
        }).filter(m => m !== null);

        Storage.saveMembers(sampleMembers);
        UI.loadMembers();
        UI.render();
    }

    /**
     * Keyboard shortcuts
     */
    function setupKeyboardShortcuts() {
        document.addEventListener('keydown', (e) => {
            // Escape closes modals
            if (e.key === 'Escape') {
                UI.closeModals();
            }

            // Ctrl/Cmd + Enter triggers calculation
            if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
                UI.calculate();
            }
        });
    }

    // Initialize when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => {
            init();
            setupKeyboardShortcuts();
        });
    } else {
        init();
        setupKeyboardShortcuts();
    }

    // Expose for debugging
    window.SquadronCalc = {
        GameData,
        Storage,
        Calculator,
        Training,
        UI
    };
})();
