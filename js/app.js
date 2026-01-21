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
     * Uses actual Lv60 stats from GameData
     */
    function addSampleData() {
        // Create sample members with actual job stats
        const jobs = ['gladiator', 'conjurer', 'lancer', 'archer', 'thaumaturge', 'marauder', 'rogue', 'arcanist'];
        const names = ['艾琳', '米雅', '賽拉斯', '凱拉', '薇薇安', '葛雷格', '夏德', '艾莉絲'];
        const races = ['hyur', 'lalafell', 'elezen', 'miqote', 'aura', 'roegadyn', 'miqote', 'lalafell'];

        const sampleMembers = jobs.map((job, i) => {
            const stats = GameData.calculateStatsForLevel(job, 60);
            return {
                id: Storage.generateId(),
                name: names[i],
                job: job,
                level: 60,
                race: races[i],
                physical: stats.physical,
                mental: stats.mental,
                tactical: stats.tactical
            };
        });

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
