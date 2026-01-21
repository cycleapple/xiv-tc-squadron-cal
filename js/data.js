/**
 * FFXIV Squadron Calculator - Game Data
 * 名詞來源：https://github.com/miaki3457/ffxiv-datamining-tc
 *          https://github.com/xivapi/ffxiv-datamining
 */

const GameData = {
    // Squad rank stat caps
    rankCaps: {
        1: 200,
        2: 300,
        3: 400
    },

    // Training effects - 訓練效果
    // 名稱來源: GcArmyTraining.csv
    trainingEffects: {
        'physical-a': {
            physical: 40, mental: -20, tactical: -20,
            name: '基礎訓練：體能',
            nameEn: 'Basic Training: Physical',
            desc: '綜合體能 +40，綜合心智 -20，綜合戰術 -20',
            exp: 2000
        },
        'mental-a': {
            physical: -20, mental: 40, tactical: -20,
            name: '基礎訓練：心智',
            nameEn: 'Basic Training: Mental',
            desc: '綜合體能 -20，綜合心智 +40，綜合戰術 -20',
            exp: 2000
        },
        'tactical-a': {
            physical: -20, mental: -20, tactical: 40,
            name: '基礎訓練：戰術',
            nameEn: 'Basic Training: Tactical',
            desc: '綜合體能 -20，綜合心智 -20，綜合戰術 +40',
            exp: 2000
        },
        'physical-mental': {
            physical: 20, mental: 20, tactical: -40,
            name: '組合訓練：體能＆心智',
            nameEn: 'Combined Training: Physical & Mental',
            desc: '綜合體能 +20，綜合心智 +20，綜合戰術 -40',
            exp: 2000
        },
        'physical-tactical': {
            physical: 20, mental: -40, tactical: 20,
            name: '組合訓練：體能＆戰術',
            nameEn: 'Combined Training: Physical & Tactical',
            desc: '綜合體能 +20，綜合心智 -40，綜合戰術 +20',
            exp: 2000
        },
        'mental-tactical': {
            physical: -40, mental: 20, tactical: 20,
            name: '組合訓練：心智＆戰術',
            nameEn: 'Combined Training: Mental & Tactical',
            desc: '綜合體能 -40，綜合心智 +20，綜合戰術 +20',
            exp: 2000
        }
    },

    // Stat names - 能力值名稱
    statNames: {
        physical: { name: '體能', nameEn: 'Physical' },
        mental: { name: '心智', nameEn: 'Mental' },
        tactical: { name: '戰術', nameEn: 'Tactical' }
    },

    // Job data - 職業資料
    // 名稱來源: ClassJob.csv
    // ID 對應: 1=劍術士, 2=格鬥士, 3=斧術士, 4=槍術士, 5=弓術士, 6=幻術士, 7=咒術士, 26=巴術士, 29=雙劍士
    jobs: {
        gladiator: {
            id: 1,
            name: '劍術士',
            nameEn: 'Gladiator',
            role: 'tank',
            abbr: 'GLA',
            baseStats: { physical: 99, mental: 26, tactical: 57 },
            description: '坦克，體能專精'
        },
        marauder: {
            id: 3,
            name: '斧術士',
            nameEn: 'Marauder',
            role: 'tank',
            abbr: 'MRD',
            baseStats: { physical: 60, mental: 28, tactical: 104 },
            description: '坦克，戰術專精'
        },
        lancer: {
            id: 4,
            name: '槍術士',
            nameEn: 'Lancer',
            role: 'dps',
            abbr: 'LNC',
            baseStats: { physical: 50, mental: 20, tactical: 80 },
            description: '近戰 DPS'
        },
        pugilist: {
            id: 2,
            name: '格鬥士',
            nameEn: 'Pugilist',
            role: 'dps',
            abbr: 'PGL',
            baseStats: { physical: 54, mental: 32, tactical: 64 },
            description: '近戰 DPS，平衡型'
        },
        archer: {
            id: 5,
            name: '弓術士',
            nameEn: 'Archer',
            role: 'ranged',
            abbr: 'ARC',
            baseStats: { physical: 30, mental: 20, tactical: 100 },
            description: '遠程 DPS，戰術專精'
        },
        rogue: {
            id: 29,
            name: '雙劍士',
            nameEn: 'Rogue',
            role: 'dps',
            abbr: 'ROG',
            baseStats: { physical: 36, mental: 20, tactical: 94 },
            description: '近戰 DPS，戰術專精'
        },
        conjurer: {
            id: 6,
            name: '幻術士',
            nameEn: 'Conjurer',
            role: 'healer',
            abbr: 'CNJ',
            baseStats: { physical: 20, mental: 104, tactical: 26 },
            description: '治療，心智專精'
        },
        thaumaturge: {
            id: 7,
            name: '咒術士',
            nameEn: 'Thaumaturge',
            role: 'dps',
            abbr: 'THM',
            baseStats: { physical: 20, mental: 88, tactical: 42 },
            description: '法系 DPS，心智專精'
        },
        arcanist: {
            id: 26,
            name: '巴術士',
            nameEn: 'Arcanist',
            role: 'dps',
            abbr: 'ACN',
            baseStats: { physical: 20, mental: 76, tactical: 54 },
            description: '法系 DPS'
        }
    },

    // Race data - 種族資料
    // 名稱來源: Race.csv
    races: {
        hyur: { id: 1, name: '人族', nameEn: 'Hyur' },
        elezen: { id: 2, name: '精靈族', nameEn: 'Elezen' },
        lalafell: { id: 3, name: '拉拉菲爾族', nameEn: 'Lalafell' },
        miqote: { id: 4, name: '貓魅族', nameEn: "Miqo'te" },
        roegadyn: { id: 5, name: '魯加族', nameEn: 'Roegadyn' },
        aura: { id: 6, name: '敖龍族', nameEn: 'Au Ra' }
    },

    // Mission data - 任務資料
    // 名稱來源: GcArmyExpedition.csv
    // 類型來源: GcArmyExpeditionType.csv (簡單任務/普通任務/特殊任務)
    missions: {
        // 簡單任務 (Lv 1-20)
        trainee: [
            { id: 1, name: '巡邏城內', nameEn: 'City Patrol', level: 1, physical: 145, mental: 140, tactical: 140, flagged: false },
            { id: 2, name: '向附近據點傳令', nameEn: 'Military Courier', level: 1, physical: 165, mental: 160, tactical: 160, flagged: false },
            { id: 3, name: '巡邏城市周邊道路', nameEn: 'Outskirts Patrol', level: 1, physical: 245, mental: 255, tactical: 200, flagged: false },
            { id: 4, name: '偵察蠻族部隊', nameEn: 'Beastmen Recon', level: 5, physical: 245, mental: 255, tactical: 250, flagged: false },
            { id: 5, name: '護衛補給部隊', nameEn: 'Supply Wagon Escort', level: 10, physical: 305, mental: 320, tactical: 310, flagged: false },
            { id: 6, name: '驅除魔物', nameEn: 'Pest Eradication', level: 15, physical: 320, mental: 335, tactical: 325, flagged: false },
            { id: 7, name: '重要任務：消滅低級妖異', nameEn: 'Flagged Mission: Voidsent Elimination', level: 20, physical: 225, mental: 205, tactical: 230, flagged: true }
        ],
        // 普通任務 (Lv 20-40)
        routine: [
            { id: 8, name: '支援前線部隊', nameEn: 'Frontline Support', level: 20, physical: 410, mental: 435, tactical: 420, flagged: false },
            { id: 9, name: '護衛同盟軍軍官', nameEn: 'Officer Escort', level: 20, physical: 415, mental: 440, tactical: 425, flagged: false },
            { id: 10, name: '巡邏郊外道路', nameEn: 'Border Patrol', level: 25, physical: 425, mental: 450, tactical: 435, flagged: false },
            { id: 11, name: '偵察蠻族據點', nameEn: 'Stronghold Recon', level: 30, physical: 440, mental: 465, tactical: 450, flagged: false },
            { id: 12, name: '搜索失蹤人員', nameEn: 'Search and Rescue', level: 35, physical: 455, mental: 480, tactical: 465, flagged: false },
            { id: 13, name: '與同盟軍的聯合演習', nameEn: 'Allied Maneuvers', level: 35, physical: 455, mental: 480, tactical: 465, flagged: false },
            { id: 14, name: '重要任務：奪取水晶', nameEn: 'Flagged Mission: Crystal Recovery', level: 40, physical: 315, mental: 325, tactical: 340, flagged: true },
            { id: 34, name: '重要任務：殲滅帝國軍特殊部隊', nameEn: 'Flagged Mission: Sapper Strike', level: 50, physical: 370, mental: 355, tactical: 345, flagged: true }
        ],
        // 特殊任務 (Lv 40-50)
        priority: [
            { id: 16, name: '強襲蠻族據點', nameEn: 'Stronghold Assault', level: 40, physical: 530, mental: 560, tactical: 540, flagged: false },
            { id: 17, name: '取締違法武器交易', nameEn: 'Black Market Crackdown', level: 40, physical: 385, mental: 265, tactical: 540, flagged: false },
            { id: 18, name: '偵察帝國軍據點', nameEn: 'Imperial Recon', level: 40, physical: 530, mental: 385, tactical: 275, flagged: false },
            { id: 19, name: '追蹤帝國軍逃兵', nameEn: 'Imperial Pursuit', level: 40, physical: 245, mental: 560, tactical: 385, flagged: false },
            { id: 20, name: '發動對帝國軍的牽制攻擊', nameEn: 'Imperial Feint', level: 40, physical: 265, mental: 385, tactical: 540, flagged: false },
            { id: 21, name: '切斷蠻族補給線作戰', nameEn: 'Supply Line Disruption', level: 40, physical: 530, mental: 275, tactical: 385, flagged: false },
            { id: 22, name: '追蹤通緝犯', nameEn: 'Criminal Pursuit', level: 40, physical: 245, mental: 560, tactical: 385, flagged: false },
            { id: 23, name: '殲滅帝國軍補給部隊', nameEn: 'Supply Wagon Destruction', level: 40, physical: 265, mental: 385, tactical: 540, flagged: false },
            { id: 24, name: '消滅合成生物', nameEn: 'Chimerical Elimination', level: 40, physical: 530, mental: 275, tactical: 385, flagged: false },
            { id: 25, name: '與拂曉的共同作戰', nameEn: 'Primal Recon', level: 40, physical: 275, mental: 620, tactical: 430, flagged: false },
            { id: 26, name: '開發反魔導兵器戰術', nameEn: 'Counter-magitek Exercises', level: 50, physical: 590, mental: 305, tactical: 430, flagged: false },
            { id: 27, name: '市民救出作戰', nameEn: 'Infiltrate and Rescue', level: 50, physical: 295, mental: 430, tactical: 600, flagged: false },
            { id: 28, name: '消滅武裝集團', nameEn: 'Outlaw Subjugation', level: 50, physical: 275, mental: 620, tactical: 430, flagged: false },
            { id: 29, name: '取締違法邪教教團', nameEn: 'Cult Crackdown', level: 50, physical: 590, mental: 305, tactical: 430, flagged: false },
            { id: 30, name: '消滅非法召喚的妖異', nameEn: 'Voidsent Elimination', level: 50, physical: 295, mental: 430, tactical: 600, flagged: false },
            { id: 31, name: '擊破帝國軍廢棄兵器', nameEn: 'Armor Annihilation', level: 50, physical: 430, mental: 620, tactical: 275, flagged: false },
            { id: 32, name: '排除哥布林族集團', nameEn: 'Invasive Testing', level: 50, physical: 590, mental: 430, tactical: 305, flagged: false },
            { id: 33, name: '揭發偽牙軍曹', nameEn: 'Imposter Alert', level: 50, physical: 430, mental: 295, tactical: 600, flagged: false }
        ]
    },

    // Get job info by key
    getJob(jobKey) {
        return this.jobs[jobKey] || null;
    },

    // Get all jobs as array
    getAllJobs() {
        return Object.entries(this.jobs).map(([key, job]) => ({
            key,
            ...job
        }));
    },

    // Get all races as array
    getAllRaces() {
        return Object.entries(this.races).map(([key, race]) => ({
            key,
            ...race
        }));
    },

    // Get training effect by type
    getTraining(type) {
        return this.trainingEffects[type] || null;
    },

    // Get all training types
    getAllTrainings() {
        return Object.entries(this.trainingEffects).map(([key, training]) => ({
            key,
            ...training
        }));
    },

    // Get all missions as flat array
    getAllMissions() {
        return [
            ...this.missions.trainee.map(m => ({ ...m, tier: 'trainee', tierName: '簡單任務' })),
            ...this.missions.routine.map(m => ({ ...m, tier: 'routine', tierName: '普通任務' })),
            ...this.missions.priority.map(m => ({ ...m, tier: 'priority', tierName: '特殊任務' }))
        ];
    },

    // Get missions by tier
    getMissionsByTier(tier) {
        return this.missions[tier] || [];
    },

    // Calculate level-adjusted stats
    calculateStatsForLevel(jobKey, level) {
        const job = this.jobs[jobKey];
        if (!job) return null;

        const ratio = level / 60;
        return {
            physical: Math.round(job.baseStats.physical * ratio),
            mental: Math.round(job.baseStats.mental * ratio),
            tactical: Math.round(job.baseStats.tactical * ratio)
        };
    },

    // Get role icon class
    getRoleClass(role) {
        const roleClasses = {
            tank: 'tank',
            healer: 'healer',
            dps: 'dps',
            ranged: 'ranged'
        };
        return roleClasses[role] || 'dps';
    },

    // Calculate total stats for a group
    calculateGroupTotal(members) {
        return members.reduce((total, member) => ({
            physical: total.physical + (member.physical || 0),
            mental: total.mental + (member.mental || 0),
            tactical: total.tactical + (member.tactical || 0)
        }), { physical: 0, mental: 0, tactical: 0 });
    },

    // Get stat display name
    getStatName(stat) {
        return this.statNames[stat]?.name || stat;
    }
};

// Export for module use
if (typeof module !== 'undefined' && module.exports) {
    module.exports = GameData;
}
