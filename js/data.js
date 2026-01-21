/**
 * FFXIV Squadron Calculator - Game Data
 * 名詞來源：https://github.com/miaki3457/ffxiv-datamining-tc
 *          https://github.com/xivapi/ffxiv-datamining
 * 隊員資料來源：ENpcResident.csv
 */

const GameData = {
    // Squad rank stat caps - 小隊階級能力上限
    rankCaps: {
        1: 200,
        2: 300,
        3: 400
    },

    // Squad rank names
    rankNames: {
        1: { name: '一級', nameEn: 'Rank 1' },
        2: { name: '二級', nameEn: 'Rank 2' },
        3: { name: '三級', nameEn: 'Rank 3' }
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
    jobs: {
        gladiator: {
            id: 1, name: '劍術士', nameEn: 'Gladiator', role: 'tank', abbr: 'GLA',
            baseStats: { physical: 99, mental: 26, tactical: 57 }
        },
        marauder: {
            id: 3, name: '斧術士', nameEn: 'Marauder', role: 'tank', abbr: 'MRD',
            baseStats: { physical: 60, mental: 28, tactical: 104 }
        },
        lancer: {
            id: 4, name: '槍術士', nameEn: 'Lancer', role: 'dps', abbr: 'LNC',
            baseStats: { physical: 50, mental: 20, tactical: 80 }
        },
        pugilist: {
            id: 2, name: '格鬥士', nameEn: 'Pugilist', role: 'dps', abbr: 'PGL',
            baseStats: { physical: 54, mental: 32, tactical: 64 }
        },
        archer: {
            id: 5, name: '弓術士', nameEn: 'Archer', role: 'ranged', abbr: 'ARC',
            baseStats: { physical: 30, mental: 20, tactical: 100 }
        },
        rogue: {
            id: 29, name: '雙劍士', nameEn: 'Rogue', role: 'dps', abbr: 'ROG',
            baseStats: { physical: 36, mental: 20, tactical: 94 }
        },
        conjurer: {
            id: 6, name: '幻術士', nameEn: 'Conjurer', role: 'healer', abbr: 'CNJ',
            baseStats: { physical: 20, mental: 104, tactical: 26 }
        },
        thaumaturge: {
            id: 7, name: '咒術士', nameEn: 'Thaumaturge', role: 'dps', abbr: 'THM',
            baseStats: { physical: 20, mental: 88, tactical: 42 }
        },
        arcanist: {
            id: 26, name: '巴術士', nameEn: 'Arcanist', role: 'dps', abbr: 'ACN',
            baseStats: { physical: 20, mental: 76, tactical: 54 }
        }
    },

    // Race data - 種族資料
    races: {
        hyur: { id: 1, name: '人族', nameEn: 'Hyur' },
        elezen: { id: 2, name: '精靈族', nameEn: 'Elezen' },
        lalafell: { id: 3, name: '拉拉菲爾族', nameEn: 'Lalafell' },
        miqote: { id: 4, name: '貓魅族', nameEn: "Miqo'te" },
        roegadyn: { id: 5, name: '魯加族', nameEn: 'Roegadyn' },
        aura: { id: 6, name: '敖龍族', nameEn: 'Au Ra' }
    },

    // Squadron Recruits - 小隊隊員
    // 名稱來源: ENpcResident.csv (ID 1016926-1016985)
    // 職業對應來源: https://ffxiv.consolegameswiki.com/wiki/Squadron_Recruits
    // 圖片來源: https://ffxiv.consolegameswiki.com/wiki/Special:FilePath/
    recruits: [
        // 人族 Hyur
        { id: 1016926, name: '塞西莉', nameEn: 'Cecily', race: 'hyur', gender: 'F', job: 'conjurer', img: 'HyurfCecily.jpg' },
        { id: 1016927, name: '奧琳', nameEn: 'Auelin', race: 'hyur', gender: 'F', job: 'archer', img: 'HyurfAuelin.jpg' },
        { id: 1016928, name: '莫賴爾', nameEn: 'Morel', race: 'hyur', gender: 'M', job: 'arcanist', img: 'HyurmMorel.jpg' },
        { id: 1016929, name: '赫羅克', nameEn: 'Hroch', race: 'hyur', gender: 'M', job: 'lancer', img: 'HyurmHroch.jpg' },
        { id: 1016930, name: '克里莎貝爾', nameEn: 'Chrysabel', race: 'hyur', gender: 'F', job: 'pugilist', img: 'HyurfChrysabel.jpg' },
        { id: 1016931, name: '艾麗絲', nameEn: 'Ellice', race: 'hyur', gender: 'F', job: 'gladiator', img: 'HyurfEllice.jpg' },
        { id: 1016932, name: '多爾芬', nameEn: 'Dolfin', race: 'hyur', gender: 'M', job: 'thaumaturge', img: 'Hyurmdolfin.png' },
        { id: 1016933, name: '西莉亞', nameEn: 'Cilia', race: 'hyur', gender: 'F', job: 'thaumaturge', img: 'HyurfCilia.png' },
        { id: 1016984, name: '休巴爾德', nameEn: 'Huebald', race: 'hyur', gender: 'M', job: 'marauder', img: 'HyurmHuebald.png' },
        { id: 1016985, name: '阿里馬烏斯', nameEn: 'Alimahus', race: 'hyur', gender: 'M', job: 'rogue', img: 'HyurmAlimahus.png' },
        // 精靈族 Elezen
        { id: 1016934, name: '帕尼爾', nameEn: 'Pagneul', race: 'elezen', gender: 'M', job: 'lancer', img: 'ElezenmPagneul.jpg' },
        { id: 1016935, name: '德爾布瓦斯', nameEn: 'Delboisse', race: 'elezen', gender: 'M', job: 'gladiator', img: 'ElezenmDelboisse.jpg' },
        { id: 1016936, name: '索莉', nameEn: 'Ceaulie', race: 'elezen', gender: 'F', job: 'archer', img: 'ElezenfCeaulie.jpg' },
        { id: 1016937, name: '里威恩娜', nameEn: 'Rivienne', race: 'elezen', gender: 'F', job: 'conjurer', img: 'ElezenfRivienne.jpg' },
        { id: 1016938, name: '拉邦里', nameEn: 'Labonrit', race: 'elezen', gender: 'M', job: 'thaumaturge', img: 'ElezenmLabonrit.jpg' },
        { id: 1016939, name: '特勒扎克', nameEn: 'Teulzacq', race: 'elezen', gender: 'M', job: 'pugilist', img: 'ElezenmTeulzacq.jpg' },
        { id: 1016940, name: '若萊娜', nameEn: 'Jolaine', race: 'elezen', gender: 'F', job: 'marauder', img: 'ElezenfJolaine.jpg' },
        { id: 1016941, name: '索菲娜', nameEn: 'Sofine', race: 'elezen', gender: 'F', job: 'arcanist', img: 'ElezenfSofine.jpg' },
        { id: 1016942, name: '默力艾爾', nameEn: 'Meuliaire', race: 'elezen', gender: 'M', job: 'rogue', img: 'ElezenmMeuliaire.png' },
        { id: 1016943, name: '克利爾朵', nameEn: 'Crilde', race: 'elezen', gender: 'F', job: 'rogue', img: 'Crilde.png' },
        // 拉拉菲爾族 Lalafell
        { id: 1016944, name: '奴奴魯帕·塔塔魯帕', nameEn: 'Nunulupa Tatalupa', race: 'lalafell', gender: 'M', job: 'thaumaturge', img: 'LalafellmNunulupaTatalupa.jpg' },
        { id: 1016945, name: '納納索米', nameEn: 'Nanasomi', race: 'lalafell', gender: 'M', job: 'archer', img: 'LalafellmNanasomi.jpg' },
        { id: 1016946, name: '莉莉芭', nameEn: 'Liliba', race: 'lalafell', gender: 'F', job: 'conjurer', img: 'LalafellfLiliba.jpg' },
        { id: 1016947, name: '薩薩修', nameEn: 'Sasashu', race: 'lalafell', gender: 'F', job: 'lancer', img: 'LalafellfSasashu.jpg' },
        { id: 1016948, name: '姆吉恩·珀拉吉恩', nameEn: 'Mujen Polajen', race: 'lalafell', gender: 'M', job: 'rogue', img: 'LalafellmMujenPolajen.jpg' },
        { id: 1016949, name: '穆穆塔諾', nameEn: 'Mumutano', race: 'lalafell', gender: 'M', job: 'gladiator', img: 'LalafellmMumutano.jpg' },
        { id: 1016950, name: '特瓦瓦', nameEn: 'Tewawa', race: 'lalafell', gender: 'F', job: 'arcanist', img: 'LalafellfTewawa.jpg' },
        { id: 1016951, name: '托托蒂', nameEn: 'Totodi', race: 'lalafell', gender: 'F', job: 'pugilist', img: 'LalafellfTotodi.jpg' },
        { id: 1016952, name: '克魯莫莫', nameEn: 'Kelmomo', race: 'lalafell', gender: 'F', job: 'marauder', img: 'LalafellfKelmomo.png' },
        { id: 1016953, name: '塞塞力庫', nameEn: 'Seserikku', race: 'lalafell', gender: 'M', job: 'marauder', img: 'LalafellmSeserikku.png' },
        // 貓魅族 Miqo'te
        { id: 1016954, name: '碧·貝納·提亞', nameEn: "B'benha Tia", race: 'miqote', gender: 'M', job: 'lancer', img: 'MiqstemBbenhaTia.jpg' },
        { id: 1016955, name: '玖茲·阿·嘉奇亞', nameEn: "Ziuz'a Jakkya", race: 'miqote', gender: 'M', job: 'rogue', img: 'MiqstemZiuzaJakkya.jpg' },
        { id: 1016956, name: '維·恩波蘿', nameEn: "V'nbolo", race: 'miqote', gender: 'F', job: 'archer', img: 'MiqstefVnbolo.jpg' },
        { id: 1016957, name: '奧雅·奈爾赫', nameEn: 'Oah Nelhah', race: 'miqote', gender: 'F', job: 'pugilist', img: 'MiqstefOahNelhah.jpg' },
        { id: 1016958, name: '德·福爾·提亞', nameEn: "D'fhul Tia", race: 'miqote', gender: 'M', job: 'conjurer', img: 'MiqstemDfhulTia.jpg' },
        { id: 1016959, name: '格塔·阿·帕尼帕爾', nameEn: "Gota'a Panipahr", race: 'miqote', gender: 'M', job: 'thaumaturge', img: 'MiqstemGotaaPanipahr.jpg' },
        { id: 1016960, name: '嘉·魯達巴', nameEn: "J'ludaba", race: 'miqote', gender: 'F', job: 'arcanist', img: 'MiqstefJludaba.jpg' },
        { id: 1016961, name: '伊恩·雅瑪里約', nameEn: 'Yehn Amariyo', race: 'miqote', gender: 'F', job: 'gladiator', img: 'MiqstefYehnAmariyo.jpg' },
        { id: 1016962, name: '艾·派特爾密', nameEn: "E'ptolmi", race: 'miqote', gender: 'F', job: 'archer', img: 'MiqstefEptolmi.jpg' },
        { id: 1016963, name: '凱達·托·莫伊', nameEn: "Kehda'to Moui", race: 'miqote', gender: 'M', job: 'archer', img: 'MiqstemKehdatoMoui.jpg' },
        // 魯加族 Roegadyn
        { id: 1016964, name: '哈斯塔爾烏雅', nameEn: 'Hastaloeya', race: 'roegadyn', gender: 'M', job: 'marauder', img: 'RoegadynmHastaloeya.jpg' },
        { id: 1016965, name: '納因·戈特', nameEn: 'Gnawing Goat', race: 'roegadyn', gender: 'M', job: 'conjurer', img: 'RoegadynmGnawingGoat.jpg' },
        { id: 1016966, name: '庫恩布瑞達', nameEn: 'Koenbryda', race: 'roegadyn', gender: 'F', job: 'gladiator', img: 'RoegadynfKoenbryda.jpg' },
        { id: 1016967, name: '科爾蕾絲·威斯帕', nameEn: 'Careless Whisper', race: 'roegadyn', gender: 'F', job: 'rogue', img: 'RoegadynfCarelessWhisper.jpg' },
        { id: 1016968, name: '里爾哈厄', nameEn: 'Rhylharr', race: 'roegadyn', gender: 'M', job: 'pugilist', img: 'RoegadynmRhylharr.jpg' },
        { id: 1016969, name: '卡拉斯·斯泰德', nameEn: 'Callous Steed', race: 'roegadyn', gender: 'M', job: 'thaumaturge', img: 'RoegadynmCallousSteed.jpg' },
        { id: 1016970, name: '因格希爾希斯', nameEn: 'Inghilswys', race: 'roegadyn', gender: 'F', job: 'lancer', img: 'RoegadynfInghilswys.jpg' },
        { id: 1016971, name: '菲爾萊絲·馮', nameEn: 'Fearless Fawn', race: 'roegadyn', gender: 'F', job: 'archer', img: 'RoegadynfFearlessFawn.jpg' },
        { id: 1016972, name: '雷爾托塔', nameEn: 'Raelthota', race: 'roegadyn', gender: 'F', job: 'arcanist', img: 'RoegadynfRaelthota.jpg' },
        { id: 1016973, name: '瑞京·奧克斯', nameEn: 'Raging Ox', race: 'roegadyn', gender: 'M', job: 'arcanist', img: 'RoegadynmRagingOx.jpg' },
        // 敖龍族 Au Ra
        { id: 1016974, name: '彩雲', nameEn: 'Saiun', race: 'aura', gender: 'M', job: 'marauder', img: 'AuramSaiun.jpg' },
        { id: 1016975, name: '艾爾齊', nameEn: 'Elchi', race: 'aura', gender: 'M', job: 'lancer', img: 'AuramElchi.jpg' },
        { id: 1016976, name: '淡雪', nameEn: 'Awayuki', race: 'aura', gender: 'F', job: 'conjurer', img: 'AurafAwayuki.jpg' },
        { id: 1016977, name: '薩姆嘉', nameEn: 'Samga', race: 'aura', gender: 'F', job: 'arcanist', img: 'AurafSamga.jpg' },
        { id: 1016978, name: '梅園', nameEn: 'Baien', race: 'aura', gender: 'M', job: 'thaumaturge', img: 'AuramBaien.jpg' },
        { id: 1016979, name: '貝科特爾', nameEn: 'Begter', race: 'aura', gender: 'M', job: 'rogue', img: 'AuramBegter.jpg' },
        { id: 1016980, name: '雲切', nameEn: 'Kumokiri', race: 'aura', gender: 'F', job: 'gladiator', img: 'AurafKumokiri.jpg' },
        { id: 1016981, name: '朵拉嘉娜', nameEn: 'Toragana', race: 'aura', gender: 'F', job: 'archer', img: 'AurafToragana.jpg' },
        { id: 1016982, name: '雷電', nameEn: 'Raiden', race: 'aura', gender: 'M', job: 'pugilist', img: 'AuramRaiden.jpg' },
        { id: 1016983, name: '科爾琪', nameEn: 'Khorchi', race: 'aura', gender: 'F', job: 'pugilist', img: 'AurafKhorchi.jpg' }
    ],

    // Image base URL (local)
    imageBaseUrl: 'images/recruits/',

    // Get recruit image URL
    getRecruitImageUrl(recruit) {
        if (!recruit || !recruit.img) return 'images/recruits/default.png';
        return this.imageBaseUrl + recruit.img;
    },

    // Mission data - 任務資料
    missions: {
        trainee: [
            { id: 1, name: '巡邏城內', nameEn: 'City Patrol', level: 1, physical: 145, mental: 140, tactical: 140, flagged: false },
            { id: 2, name: '向附近據點傳令', nameEn: 'Military Courier', level: 1, physical: 165, mental: 160, tactical: 160, flagged: false },
            { id: 3, name: '巡邏城市周邊道路', nameEn: 'Outskirts Patrol', level: 1, physical: 245, mental: 255, tactical: 200, flagged: false },
            { id: 4, name: '偵察蠻族部隊', nameEn: 'Beastmen Recon', level: 5, physical: 245, mental: 255, tactical: 250, flagged: false },
            { id: 5, name: '護衛補給部隊', nameEn: 'Supply Wagon Escort', level: 10, physical: 305, mental: 320, tactical: 310, flagged: false },
            { id: 6, name: '驅除魔物', nameEn: 'Pest Eradication', level: 15, physical: 320, mental: 335, tactical: 325, flagged: false },
            { id: 7, name: '重要任務：消滅低級妖異', nameEn: 'Flagged Mission: Voidsent Elimination', level: 20, physical: 225, mental: 205, tactical: 230, flagged: true }
        ],
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

    // Get recruit by ID
    getRecruit(id) {
        return this.recruits.find(r => r.id === id) || null;
    },

    // Get all recruits
    getAllRecruits() {
        return this.recruits;
    },

    // Get recruits by race
    getRecruitsByRace(race) {
        return this.recruits.filter(r => r.race === race);
    },

    // Get recruits by job
    getRecruitsByJob(job) {
        return this.recruits.filter(r => r.job === job);
    },

    // Get job info
    getJob(jobKey) {
        return this.jobs[jobKey] || null;
    },

    // Get all jobs as array
    getAllJobs() {
        return Object.entries(this.jobs).map(([key, job]) => ({ key, ...job }));
    },

    // Get all races as array
    getAllRaces() {
        return Object.entries(this.races).map(([key, race]) => ({ key, ...race }));
    },

    // Get training effect
    getTraining(type) {
        return this.trainingEffects[type] || null;
    },

    // Get all trainings
    getAllTrainings() {
        return Object.entries(this.trainingEffects).map(([key, training]) => ({ key, ...training }));
    },

    // Get all missions
    getAllMissions() {
        return [
            ...this.missions.trainee.map(m => ({ ...m, tier: 'trainee', tierName: '簡單任務' })),
            ...this.missions.routine.map(m => ({ ...m, tier: 'routine', tierName: '普通任務' })),
            ...this.missions.priority.map(m => ({ ...m, tier: 'priority', tierName: '特殊任務' }))
        ];
    },

    // Calculate stats for level with rank cap
    calculateStatsForLevel(jobKey, level, rank = 3) {
        const job = this.jobs[jobKey];
        if (!job) return null;

        const cap = this.rankCaps[rank] || 400;
        const ratio = level / 60;

        return {
            physical: Math.min(Math.round(job.baseStats.physical * ratio), cap),
            mental: Math.min(Math.round(job.baseStats.mental * ratio), cap),
            tactical: Math.min(Math.round(job.baseStats.tactical * ratio), cap)
        };
    },

    // Get recruit stats at level with rank
    getRecruitStats(recruitId, level = 60, rank = 3) {
        const recruit = this.getRecruit(recruitId);
        if (!recruit) return null;

        return this.calculateStatsForLevel(recruit.job, level, rank);
    },

    // Get role class
    getRoleClass(role) {
        const roleClasses = { tank: 'tank', healer: 'healer', dps: 'dps', ranged: 'ranged' };
        return roleClasses[role] || 'dps';
    },

    // Calculate group total
    calculateGroupTotal(members) {
        return members.reduce((total, member) => ({
            physical: total.physical + (member.physical || 0),
            mental: total.mental + (member.mental || 0),
            tactical: total.tactical + (member.tactical || 0)
        }), { physical: 0, mental: 0, tactical: 0 });
    },

    // Get stat name
    getStatName(stat) {
        return this.statNames[stat]?.name || stat;
    }
};

// Export for module use
if (typeof module !== 'undefined' && module.exports) {
    module.exports = GameData;
}
