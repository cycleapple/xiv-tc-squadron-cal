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
        2: 280,
        3: 400
    },

    // 職業等級對應三圍數據 [體能, 心智, 戰術]
    // 來源: https://ronaldzzzzz.github.io/ffxiv-toolbox/Squadron/
    classLevelStats: {
        marauder: {
            1: [60, 12, 24], 2: [61, 12, 25], 3: [63, 12, 25], 4: [64, 12, 26], 5: [65, 13, 26],
            6: [66, 13, 27], 7: [66, 14, 28], 8: [68, 14, 28], 9: [70, 14, 28], 10: [72, 14, 28],
            11: [73, 15, 28], 12: [74, 15, 29], 13: [74, 16, 30], 14: [75, 16, 31], 15: [77, 16, 31],
            16: [78, 16, 32], 17: [79, 17, 32], 18: [80, 17, 33], 19: [80, 18, 34], 20: [82, 18, 34],
            21: [84, 18, 34], 22: [86, 18, 34], 23: [87, 19, 34], 24: [88, 19, 35], 25: [88, 20, 36],
            26: [89, 20, 37], 27: [91, 20, 37], 28: [92, 20, 38], 29: [93, 21, 38], 30: [94, 21, 39],
            31: [94, 22, 40], 32: [96, 22, 40], 33: [98, 22, 40], 34: [100, 22, 40], 35: [101, 23, 40],
            36: [102, 23, 41], 37: [102, 24, 42], 38: [103, 24, 43], 39: [105, 24, 43], 40: [106, 24, 44],
            41: [107, 25, 44], 42: [108, 25, 45], 43: [108, 26, 46], 44: [110, 26, 46], 45: [112, 26, 46],
            46: [114, 26, 46], 47: [115, 27, 46], 48: [116, 27, 47], 49: [116, 28, 48], 50: [117, 28, 49],
            51: [119, 28, 49], 52: [120, 28, 50], 53: [121, 29, 50], 54: [122, 29, 51], 55: [122, 30, 52],
            56: [124, 30, 52], 57: [126, 30, 52], 58: [128, 30, 52], 59: [129, 31, 52], 60: [130, 31, 53]
        },
        gladiator: {
            1: [48, 12, 36], 2: [50, 12, 36], 3: [52, 12, 36], 4: [54, 12, 36], 5: [55, 13, 36],
            6: [56, 13, 37], 7: [56, 14, 38], 8: [57, 14, 39], 9: [59, 14, 39], 10: [60, 14, 40],
            11: [61, 15, 40], 12: [62, 15, 41], 13: [62, 16, 42], 14: [64, 16, 42], 15: [66, 16, 42],
            16: [68, 16, 42], 17: [69, 17, 42], 18: [70, 17, 43], 19: [70, 18, 44], 20: [71, 18, 45],
            21: [73, 18, 45], 22: [74, 18, 46], 23: [75, 19, 46], 24: [76, 19, 47], 25: [76, 20, 48],
            26: [78, 20, 48], 27: [80, 20, 48], 28: [82, 20, 48], 29: [83, 21, 48], 30: [84, 21, 49],
            31: [84, 22, 50], 32: [85, 22, 51], 33: [87, 22, 51], 34: [88, 22, 52], 35: [89, 23, 52],
            36: [90, 23, 53], 37: [90, 24, 54], 38: [92, 24, 54], 39: [94, 24, 54], 40: [96, 24, 54],
            41: [97, 25, 54], 42: [98, 25, 55], 43: [98, 26, 56], 44: [99, 26, 57], 45: [101, 26, 57],
            46: [102, 26, 58], 47: [103, 27, 58], 48: [104, 27, 59], 49: [104, 28, 60], 50: [106, 28, 60],
            51: [108, 28, 60], 52: [110, 28, 60], 53: [111, 29, 60], 54: [112, 29, 61], 55: [112, 30, 62],
            56: [113, 30, 63], 57: [115, 30, 63], 58: [116, 30, 64], 59: [117, 31, 64], 60: [118, 31, 65]
        },
        archer: {
            1: [12, 12, 72], 2: [13, 12, 73], 3: [13, 12, 75], 4: [14, 12, 76], 5: [14, 13, 77],
            6: [15, 13, 78], 7: [16, 14, 78], 8: [17, 14, 79], 9: [17, 14, 81], 10: [18, 14, 82],
            11: [18, 15, 83], 12: [19, 15, 84], 13: [20, 16, 84], 14: [21, 16, 85], 15: [21, 16, 87],
            16: [22, 16, 88], 17: [22, 17, 89], 18: [23, 17, 90], 19: [24, 18, 90], 20: [25, 18, 91],
            21: [25, 18, 93], 22: [26, 18, 94], 23: [26, 19, 95], 24: [27, 19, 96], 25: [28, 20, 96],
            26: [29, 20, 97], 27: [29, 20, 99], 28: [30, 20, 100], 29: [30, 21, 101], 30: [31, 21, 102],
            31: [32, 22, 102], 32: [33, 22, 103], 33: [33, 22, 105], 34: [34, 22, 106], 35: [34, 23, 107],
            36: [35, 23, 108], 37: [36, 24, 108], 38: [37, 24, 109], 39: [37, 24, 111], 40: [38, 24, 112],
            41: [38, 25, 113], 42: [39, 25, 114], 43: [40, 26, 114], 44: [41, 26, 115], 45: [41, 26, 117],
            46: [42, 26, 118], 47: [42, 27, 119], 48: [43, 27, 120], 49: [44, 28, 120], 50: [45, 28, 121],
            51: [45, 28, 123], 52: [46, 28, 124], 53: [46, 29, 125], 54: [47, 29, 126], 55: [48, 30, 126],
            56: [49, 30, 127], 57: [49, 30, 129], 58: [50, 30, 130], 59: [50, 31, 131], 60: [51, 31, 132]
        },
        rogue: {
            1: [24, 12, 60], 2: [24, 12, 62], 3: [24, 12, 64], 4: [24, 12, 66], 5: [24, 13, 67],
            6: [25, 13, 68], 7: [26, 14, 68], 8: [27, 14, 69], 9: [27, 14, 71], 10: [28, 14, 72],
            11: [28, 15, 73], 12: [29, 15, 74], 13: [30, 16, 74], 14: [30, 16, 76], 15: [30, 16, 78],
            16: [30, 16, 80], 17: [30, 17, 81], 18: [31, 17, 82], 19: [32, 18, 82], 20: [33, 18, 83],
            21: [33, 18, 85], 22: [34, 18, 86], 23: [34, 19, 87], 24: [35, 19, 88], 25: [36, 20, 88],
            26: [36, 20, 90], 27: [36, 20, 92], 28: [36, 20, 94], 29: [36, 21, 95], 30: [37, 21, 96],
            31: [38, 22, 96], 32: [39, 22, 97], 33: [39, 22, 99], 34: [40, 22, 100], 35: [40, 23, 101],
            36: [41, 23, 102], 37: [42, 24, 102], 38: [42, 24, 104], 39: [42, 24, 106], 40: [42, 24, 108],
            41: [42, 25, 109], 42: [43, 25, 110], 43: [44, 26, 110], 44: [45, 26, 111], 45: [45, 26, 113],
            46: [46, 26, 114], 47: [46, 27, 115], 48: [47, 27, 116], 49: [48, 28, 116], 50: [48, 28, 118],
            51: [48, 28, 120], 52: [48, 28, 122], 53: [48, 29, 123], 54: [49, 29, 124], 55: [50, 30, 124],
            56: [51, 30, 125], 57: [51, 30, 127], 58: [52, 30, 128], 59: [52, 31, 129], 60: [53, 31, 130]
        },
        lancer: {
            1: [36, 12, 48], 2: [37, 12, 49], 3: [37, 12, 51], 4: [38, 12, 52], 5: [38, 13, 53],
            6: [39, 13, 54], 7: [40, 14, 54], 8: [40, 14, 56], 9: [40, 14, 58], 10: [40, 14, 60],
            11: [40, 15, 61], 12: [41, 15, 62], 13: [42, 16, 62], 14: [43, 16, 63], 15: [43, 16, 65],
            16: [44, 16, 66], 17: [44, 17, 67], 18: [45, 17, 68], 19: [46, 18, 68], 20: [46, 18, 70],
            21: [46, 18, 72], 22: [46, 18, 74], 23: [46, 19, 75], 24: [47, 19, 76], 25: [48, 20, 76],
            26: [49, 20, 77], 27: [49, 20, 79], 28: [50, 20, 80], 29: [50, 21, 81], 30: [51, 21, 82],
            31: [52, 22, 82], 32: [52, 22, 84], 33: [52, 22, 86], 34: [52, 22, 88], 35: [52, 23, 89],
            36: [53, 23, 90], 37: [54, 24, 90], 38: [55, 24, 91], 39: [55, 24, 93], 40: [56, 24, 94],
            41: [56, 25, 95], 42: [57, 25, 96], 43: [58, 26, 96], 44: [58, 26, 98], 45: [58, 26, 100],
            46: [58, 26, 102], 47: [58, 27, 103], 48: [59, 27, 104], 49: [60, 28, 104], 50: [61, 28, 105],
            51: [61, 28, 107], 52: [62, 28, 108], 53: [62, 29, 109], 54: [63, 29, 110], 55: [64, 30, 110],
            56: [64, 30, 112], 57: [64, 30, 114], 58: [64, 30, 116], 59: [64, 31, 117], 60: [65, 31, 118]
        },
        pugilist: {
            1: [36, 24, 36], 2: [37, 24, 37], 3: [37, 24, 39], 4: [38, 24, 40], 5: [38, 25, 41],
            6: [39, 25, 42], 7: [40, 26, 42], 8: [41, 26, 43], 9: [41, 26, 45], 10: [42, 26, 46],
            11: [42, 27, 47], 12: [43, 27, 48], 13: [44, 28, 48], 14: [45, 28, 49], 15: [45, 28, 51],
            16: [46, 28, 52], 17: [46, 29, 53], 18: [47, 29, 54], 19: [48, 30, 54], 20: [49, 30, 55],
            21: [49, 30, 57], 22: [50, 30, 58], 23: [50, 31, 59], 24: [51, 31, 60], 25: [52, 32, 60],
            26: [53, 32, 61], 27: [53, 32, 63], 28: [54, 32, 64], 29: [54, 33, 65], 30: [55, 33, 66],
            31: [56, 34, 66], 32: [57, 34, 67], 33: [57, 34, 69], 34: [58, 34, 70], 35: [58, 35, 71],
            36: [59, 35, 72], 37: [60, 36, 72], 38: [61, 36, 73], 39: [61, 36, 75], 40: [62, 36, 76],
            41: [62, 37, 77], 42: [63, 37, 78], 43: [64, 38, 78], 44: [65, 38, 79], 45: [65, 38, 81],
            46: [66, 38, 82], 47: [66, 39, 83], 48: [67, 39, 84], 49: [68, 40, 84], 50: [69, 40, 85],
            51: [69, 40, 87], 52: [70, 40, 88], 53: [70, 41, 89], 54: [71, 41, 90], 55: [72, 42, 90],
            56: [73, 42, 91], 57: [73, 42, 93], 58: [74, 42, 94], 59: [74, 43, 95], 60: [75, 43, 96]
        },
        conjurer: {
            1: [12, 72, 12], 2: [12, 73, 13], 3: [12, 75, 13], 4: [12, 76, 14], 5: [13, 77, 14],
            6: [13, 78, 15], 7: [14, 78, 16], 8: [14, 80, 16], 9: [14, 82, 16], 10: [14, 84, 16],
            11: [15, 85, 16], 12: [15, 86, 17], 13: [16, 86, 18], 14: [16, 87, 19], 15: [16, 89, 19],
            16: [16, 90, 20], 17: [17, 91, 20], 18: [17, 92, 21], 19: [18, 92, 22], 20: [18, 94, 22],
            21: [18, 96, 22], 22: [18, 98, 22], 23: [19, 99, 22], 24: [19, 100, 23], 25: [20, 100, 24],
            26: [20, 101, 25], 27: [20, 103, 25], 28: [20, 104, 26], 29: [21, 105, 26], 30: [21, 106, 27],
            31: [22, 106, 28], 32: [22, 108, 28], 33: [22, 110, 28], 34: [22, 112, 28], 35: [23, 113, 28],
            36: [23, 114, 29], 37: [24, 114, 30], 38: [24, 115, 31], 39: [24, 117, 31], 40: [24, 118, 32],
            41: [25, 119, 32], 42: [25, 120, 33], 43: [26, 120, 34], 44: [26, 122, 34], 45: [26, 124, 34],
            46: [26, 126, 34], 47: [27, 127, 34], 48: [27, 128, 35], 49: [28, 128, 36], 50: [28, 129, 37],
            51: [28, 131, 37], 52: [28, 132, 38], 53: [29, 133, 38], 54: [29, 134, 39], 55: [30, 134, 40],
            56: [30, 136, 40], 57: [30, 138, 40], 58: [30, 140, 40], 59: [31, 141, 40], 60: [31, 142, 41]
        },
        thaumaturge: {
            1: [12, 60, 24], 2: [12, 61, 25], 3: [12, 63, 25], 4: [12, 64, 26], 5: [13, 65, 26],
            6: [13, 66, 27], 7: [14, 66, 28], 8: [14, 67, 29], 9: [14, 69, 29], 10: [14, 70, 30],
            11: [15, 71, 30], 12: [15, 72, 31], 13: [16, 72, 32], 14: [16, 73, 33], 15: [16, 75, 33],
            16: [16, 76, 34], 17: [17, 77, 34], 18: [17, 78, 35], 19: [18, 78, 36], 20: [18, 79, 37],
            21: [18, 81, 37], 22: [18, 82, 38], 23: [19, 83, 38], 24: [19, 84, 39], 25: [20, 84, 40],
            26: [20, 85, 41], 27: [20, 87, 41], 28: [20, 88, 42], 29: [21, 89, 42], 30: [21, 90, 43],
            31: [22, 90, 44], 32: [22, 91, 45], 33: [22, 93, 45], 34: [22, 94, 46], 35: [23, 95, 46],
            36: [23, 96, 47], 37: [24, 96, 48], 38: [24, 97, 49], 39: [24, 99, 49], 40: [24, 100, 50],
            41: [25, 101, 50], 42: [25, 102, 51], 43: [26, 102, 52], 44: [26, 103, 53], 45: [26, 105, 53],
            46: [26, 106, 54], 47: [27, 107, 54], 48: [27, 108, 55], 49: [28, 108, 56], 50: [28, 109, 57],
            51: [28, 111, 57], 52: [28, 112, 58], 53: [29, 113, 58], 54: [29, 114, 59], 55: [30, 114, 60],
            56: [30, 115, 61], 57: [30, 117, 61], 58: [30, 118, 62], 59: [31, 119, 62], 60: [31, 120, 63]
        },
        arcanist: {
            1: [12, 48, 36], 2: [12, 49, 37], 3: [12, 51, 37], 4: [12, 52, 38], 5: [13, 53, 38],
            6: [13, 54, 39], 7: [14, 54, 40], 8: [14, 55, 41], 9: [14, 57, 41], 10: [14, 58, 42],
            11: [15, 59, 42], 12: [15, 60, 43], 13: [16, 60, 44], 14: [16, 61, 45], 15: [16, 63, 45],
            16: [16, 64, 46], 17: [17, 65, 46], 18: [17, 66, 47], 19: [18, 66, 48], 20: [18, 67, 49],
            21: [18, 69, 49], 22: [18, 70, 50], 23: [19, 71, 50], 24: [19, 72, 51], 25: [20, 72, 52],
            26: [20, 73, 53], 27: [20, 75, 53], 28: [20, 76, 54], 29: [21, 77, 54], 30: [21, 78, 55],
            31: [22, 78, 56], 32: [22, 79, 57], 33: [22, 81, 57], 34: [22, 82, 58], 35: [23, 83, 58],
            36: [23, 84, 59], 37: [24, 84, 60], 38: [24, 85, 61], 39: [24, 87, 61], 40: [24, 88, 62],
            41: [25, 89, 62], 42: [25, 90, 63], 43: [26, 90, 64], 44: [26, 91, 65], 45: [26, 93, 65],
            46: [26, 94, 66], 47: [27, 95, 66], 48: [27, 96, 67], 49: [28, 96, 68], 50: [28, 97, 69],
            51: [28, 99, 69], 52: [28, 100, 70], 53: [29, 101, 70], 54: [29, 102, 71], 55: [30, 102, 72],
            56: [30, 103, 73], 57: [30, 105, 73], 58: [30, 106, 74], 59: [31, 107, 74], 60: [31, 108, 75]
        }
    },

    // Squad rank names
    rankNames: {
        1: { name: '一級', nameEn: 'Rank 1' },
        2: { name: '二級', nameEn: 'Rank 2' },
        3: { name: '三級', nameEn: 'Rank 3' }
    },

    // Training effects - 訓練效果
    // 名稱來源: GcArmyTraining.csv
    // 數據來源: https://ff14.huijiwiki.com/wiki/冒险者分队
    // 注意：訓練只有加成，沒有負值。只有當綜合能力總值達到上限時，
    //      再增加某項能力才會導致其他能力下降（這是上限溢出機制，不是訓練效果本身）
    trainingEffects: {
        'physical-a': {
            physical: 40, mental: 0, tactical: 0,
            name: '基礎訓練：體能',
            nameEn: 'Basic Training: Physical',
            desc: '綜合體能 +40',
            exp: 2000
        },
        'mental-a': {
            physical: 0, mental: 40, tactical: 0,
            name: '基礎訓練：心智',
            nameEn: 'Basic Training: Mental',
            desc: '綜合心智 +40',
            exp: 2000
        },
        'tactical-a': {
            physical: 0, mental: 0, tactical: 40,
            name: '基礎訓練：戰術',
            nameEn: 'Basic Training: Tactical',
            desc: '綜合戰術 +40',
            exp: 2000
        },
        'physical-mental': {
            physical: 20, mental: 20, tactical: 0,
            name: '組合訓練：體能＆心智',
            nameEn: 'Combined Training: Physical & Mental',
            desc: '綜合體能 +20，綜合心智 +20',
            exp: 2000
        },
        'physical-tactical': {
            physical: 20, mental: 0, tactical: 20,
            name: '組合訓練：體能＆戰術',
            nameEn: 'Combined Training: Physical & Tactical',
            desc: '綜合體能 +20，綜合戰術 +20',
            exp: 2000
        },
        'mental-tactical': {
            physical: 0, mental: 20, tactical: 20,
            name: '組合訓練：心智＆戰術',
            nameEn: 'Combined Training: Mental & Tactical',
            desc: '綜合心智 +20，綜合戰術 +20',
            exp: 2000
        },
        'comprehensive': {
            physical: 0, mental: 0, tactical: 0,
            name: '綜合訓練',
            nameEn: 'Comprehensive Training',
            desc: '只獲得經驗值（無能力變化）',
            exp: 3000
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
        { id: 1016926, name: '塞西莉', nameEn: 'Cecily', race: 'hyur', gender: 'F', job: 'conjurer', img: 'HyurfCecily.jpg', challengeLog: '行會令、危命任務、軍隊' },
        { id: 1016927, name: '奧琳', nameEn: 'Auelin', race: 'hyur', gender: 'F', job: 'archer', img: 'HyurfAuelin.jpg', challengeLog: '迷宮挑戰、金碟遊樂場' },
        { id: 1016928, name: '莫賴爾', nameEn: 'Morel', race: 'hyur', gender: 'M', job: 'arcanist', img: 'HyurmMorel.jpg', challengeLog: '危命任務、金碟遊樂場' },
        { id: 1016929, name: '赫羅克', nameEn: 'Hroch', race: 'hyur', gender: 'M', job: 'lancer', img: 'HyurmHroch.jpg', challengeLog: '行會令、危命任務、軍隊' },
        { id: 1016930, name: '克里莎貝爾', nameEn: 'Chrysabel', race: 'hyur', gender: 'F', job: 'pugilist', img: 'HyurfChrysabel.jpg', challengeLog: '迷宮挑戰、金碟遊樂場' },
        { id: 1016931, name: '艾麗絲', nameEn: 'Ellice', race: 'hyur', gender: 'F', job: 'gladiator', img: 'HyurfEllice.jpg', challengeLog: '行會令、危命任務、軍隊' },
        { id: 1016932, name: '多爾芬', nameEn: 'Dolfin', race: 'hyur', gender: 'M', job: 'thaumaturge', img: 'Hyurmdolfin.png', challengeLog: '迷宮挑戰、金碟遊樂場' },
        { id: 1016933, name: '西莉亞', nameEn: 'Cilia', race: 'hyur', gender: 'F', job: 'thaumaturge', img: 'HyurfCilia.png', challengeLog: '大地使者、尋寶' },
        { id: 1016984, name: '休巴爾德', nameEn: 'Huebald', race: 'hyur', gender: 'M', job: 'marauder', img: 'HyurmHuebald.png', challengeLog: '大地使者、雇員探險' },
        { id: 1016985, name: '阿里馬烏斯', nameEn: 'Alimahus', race: 'hyur', gender: 'M', job: 'rogue', img: 'HyurmAlimahus.jpg', challengeLog: '大地使者、尋寶、金碟遊樂場' },
        // 精靈族 Elezen
        { id: 1016934, name: '帕尼爾', nameEn: 'Pagneul', race: 'elezen', gender: 'M', job: 'lancer', img: 'ElezenmPagneul.jpg', challengeLog: '行會令、危命任務、軍隊' },
        { id: 1016935, name: '德爾布瓦斯', nameEn: 'Delboisse', race: 'elezen', gender: 'M', job: 'gladiator', img: 'ElezenmDelboisse.jpg', challengeLog: '行會令、危命任務、軍隊' },
        { id: 1016936, name: '索莉', nameEn: 'Ceaulie', race: 'elezen', gender: 'F', job: 'archer', img: 'ElezenfCeaulie.jpg', challengeLog: '迷宮挑戰、金碟遊樂場' },
        { id: 1016937, name: '里威恩娜', nameEn: 'Rivienne', race: 'elezen', gender: 'F', job: 'conjurer', img: 'ElezenfRivienne.jpg', challengeLog: '迷宮挑戰、金碟遊樂場' },
        { id: 1016938, name: '拉邦里', nameEn: 'Labonrit', race: 'elezen', gender: 'M', job: 'thaumaturge', img: 'ElezenmLabonrit.jpg', challengeLog: '危命任務、金碟遊樂場' },
        { id: 1016939, name: '特勒扎克', nameEn: 'Teulzacq', race: 'elezen', gender: 'M', job: 'pugilist', img: 'ElezenmTeulzacq.jpg', challengeLog: '行會令、危命任務、軍隊' },
        { id: 1016940, name: '若萊娜', nameEn: 'Jolaine', race: 'elezen', gender: 'F', job: 'marauder', img: 'ElezenfJolaine.jpg', challengeLog: '大地使者、尋寶、金碟遊樂場' },
        { id: 1016941, name: '索菲娜', nameEn: 'Sofine', race: 'elezen', gender: 'F', job: 'arcanist', img: 'ElezenfSofine.jpg', challengeLog: '大地使者、雇員探險' },
        { id: 1016942, name: '默力艾爾', nameEn: 'Meuliaire', race: 'elezen', gender: 'M', job: 'rogue', img: 'ElezenmMeuliaire.png', challengeLog: '大地使者、雇員探險' },
        { id: 1016943, name: '克利爾朵', nameEn: 'Crilde', race: 'elezen', gender: 'F', job: 'rogue', img: 'Crilde.png', challengeLog: '大地使者、尋寶' },
        // 拉拉菲爾族 Lalafell
        { id: 1016944, name: '奴奴魯帕·塔塔魯帕', nameEn: 'Nunulupa Tatalupa', race: 'lalafell', gender: 'M', job: 'thaumaturge', img: 'Nunulupa_Tatalupa.png', challengeLog: '行會令、危命任務、軍隊' },
        { id: 1016945, name: '納納索米', nameEn: 'Nanasomi', race: 'lalafell', gender: 'M', job: 'archer', img: 'LalamNanasomi.jpg', challengeLog: '迷宮挑戰、金碟遊樂場' },
        { id: 1016946, name: '莉莉芭', nameEn: 'Liliba', race: 'lalafell', gender: 'F', job: 'conjurer', img: 'LalafellfLiliba.png', challengeLog: '危命任務、金碟遊樂場' },
        { id: 1016947, name: '薩薩修', nameEn: 'Sasashu', race: 'lalafell', gender: 'F', job: 'lancer', img: 'LalafSasashu.jpg', challengeLog: '行會令、危命任務、軍隊' },
        { id: 1016948, name: '姆吉恩·珀拉吉恩', nameEn: 'Mujen Polajen', race: 'lalafell', gender: 'M', job: 'rogue', img: 'Ffxiv_01042017_153909.png', challengeLog: '迷宮挑戰、金碟遊樂場' },
        { id: 1016949, name: '穆穆塔諾', nameEn: 'Mumutano', race: 'lalafell', gender: 'M', job: 'gladiator', img: 'LalamMumutano.jpg', challengeLog: '迷宮挑戰、金碟遊樂場' },
        { id: 1016950, name: '特瓦瓦', nameEn: 'Tewawa', race: 'lalafell', gender: 'F', job: 'arcanist', img: 'LalafTewawa.jpg', challengeLog: '大地使者、尋寶、金碟遊樂場' },
        { id: 1016951, name: '托托蒂', nameEn: 'Totodi', race: 'lalafell', gender: 'F', job: 'pugilist', img: 'LalafTotodi.jpg', challengeLog: '大地使者、尋寶' },
        { id: 1016952, name: '克魯莫莫', nameEn: 'Kelmomo', race: 'lalafell', gender: 'F', job: 'marauder', img: 'LalafKelmomo.png', challengeLog: '大地使者、尋寶' },
        { id: 1016953, name: '塞塞力庫', nameEn: 'Seserikku', race: 'lalafell', gender: 'M', job: 'marauder', img: 'LalamSeserikku.jpg', challengeLog: '大地使者、雇員探險' },
        // 貓魅族 Miqo'te
        { id: 1016954, name: '碧·貝納·提亞', nameEn: "B'benha Tia", race: 'miqote', gender: 'M', job: 'lancer', img: 'MiqotemBbenha.jpg', challengeLog: '行會令、危命任務、軍隊' },
        { id: 1016955, name: '玖茲·阿·嘉奇亞', nameEn: "Ziuz'a Jakkya", race: 'miqote', gender: 'M', job: 'rogue', img: 'MiqotemZiuza.jpg', challengeLog: '迷宮挑戰、金碟遊樂場' },
        { id: 1016956, name: '維·恩波蘿', nameEn: "V'nbolo", race: 'miqote', gender: 'F', job: 'archer', img: 'MiqotefVnbolo.jpg', challengeLog: '危命任務、金碟遊樂場' },
        { id: 1016957, name: '奧雅·奈爾赫', nameEn: 'Oah Nelhah', race: 'miqote', gender: 'F', job: 'pugilist', img: 'MiqotefOah.jpg', challengeLog: '行會令、危命任務、軍隊' },
        { id: 1016958, name: '德·福爾·提亞', nameEn: "D'fhul Tia", race: 'miqote', gender: 'M', job: 'conjurer', img: 'MiqotemDfhul.jpg', challengeLog: '迷宮挑戰、金碟遊樂場' },
        { id: 1016959, name: '格塔·阿·帕尼帕爾', nameEn: "Gota'a Panipahr", race: 'miqote', gender: 'M', job: 'thaumaturge', img: 'MiqotemGotaa.jpg', challengeLog: '大地使者、尋寶、金碟遊樂場' },
        { id: 1016960, name: '嘉·魯達巴', nameEn: "J'ludaba", race: 'miqote', gender: 'F', job: 'arcanist', img: 'MiqotefJludaba.jpg', challengeLog: '大地使者、尋寶' },
        { id: 1016961, name: '伊恩·雅瑪里約', nameEn: 'Yehn Amariyo', race: 'miqote', gender: 'F', job: 'gladiator', img: 'MiqotefYehn.jpg', challengeLog: '大地使者、雇員探險' },
        { id: 1016962, name: '艾·派特爾密', nameEn: "E'ptolmi", race: 'miqote', gender: 'F', job: 'archer', img: 'MiqotefEptolmi.jpg', challengeLog: '大地使者、雇員探險' },
        { id: 1016963, name: '凱達·托·莫伊', nameEn: "Kehda'to Moui", race: 'miqote', gender: 'M', job: 'archer', img: 'MiqotemKehdato.jpg', challengeLog: '大地使者、尋寶' },
        // 魯加族 Roegadyn
        { id: 1016964, name: '哈斯塔爾烏雅', nameEn: 'Hastaloeya', race: 'roegadyn', gender: 'M', job: 'marauder', img: 'RoegmHastaloeya.jpg', challengeLog: '行會令、危命任務、軍隊' },
        { id: 1016965, name: '納因·戈特', nameEn: 'Gnawing Goat', race: 'roegadyn', gender: 'M', job: 'conjurer', img: 'RoegmGnawing.jpg', challengeLog: '迷宮挑戰、金碟遊樂場' },
        { id: 1016966, name: '庫恩布瑞達', nameEn: 'Koenbryda', race: 'roegadyn', gender: 'F', job: 'gladiator', img: 'RoegfKoenbryda.jpg', challengeLog: '危命任務、金碟遊樂場' },
        { id: 1016967, name: '科爾蕾絲·威斯帕', nameEn: 'Careless Whisper', race: 'roegadyn', gender: 'F', job: 'rogue', img: 'RoegfCareless.jpg', challengeLog: '行會令、危命任務、軍隊' },
        { id: 1016968, name: '里爾哈厄', nameEn: 'Rhylharr', race: 'roegadyn', gender: 'M', job: 'pugilist', img: 'RoegmRhylharr.jpg', challengeLog: '迷宮挑戰、金碟遊樂場' },
        { id: 1016969, name: '卡拉斯·斯泰德', nameEn: 'Callous Steed', race: 'roegadyn', gender: 'M', job: 'thaumaturge', img: 'RoegmCallous.jpg', challengeLog: '大地使者、尋寶、金碟遊樂場' },
        { id: 1016970, name: '因格希爾希斯', nameEn: 'Inghilswys', race: 'roegadyn', gender: 'F', job: 'lancer', img: 'RoegfInghilswys.jpg', challengeLog: '大地使者、尋寶' },
        { id: 1016971, name: '菲爾萊絲·馮', nameEn: 'Fearless Fawn', race: 'roegadyn', gender: 'F', job: 'archer', img: 'Roegf_fearless.jpg', challengeLog: '大地使者、雇員探險' },
        { id: 1016972, name: '雷爾托塔', nameEn: 'Raelthota', race: 'roegadyn', gender: 'F', job: 'arcanist', img: 'RoegfRaelthota.jpg', challengeLog: '大地使者、雇員探險' },
        { id: 1016973, name: '瑞京·奧克斯', nameEn: 'Raging Ox', race: 'roegadyn', gender: 'M', job: 'arcanist', img: 'RoegmRaging.jpg', challengeLog: '大地使者、尋寶' },
        // 敖龍族 Au Ra
        { id: 1016974, name: '彩雲', nameEn: 'Saiun', race: 'aura', gender: 'M', job: 'marauder', img: 'AuramSaiun.jpg', challengeLog: '迷宮挑戰、金碟遊樂場' },
        { id: 1016975, name: '艾爾齊', nameEn: 'Elchi', race: 'aura', gender: 'M', job: 'lancer', img: 'AuramElchi.jpg', challengeLog: '危命任務、金碟遊樂場' },
        { id: 1016976, name: '淡雪', nameEn: 'Awayuki', race: 'aura', gender: 'F', job: 'conjurer', img: 'AurafAwayuki.jpg', challengeLog: '行會令、危命任務、軍隊' },
        { id: 1016977, name: '薩姆嘉', nameEn: 'Samga', race: 'aura', gender: 'F', job: 'arcanist', img: 'Samga.jpg', challengeLog: '危命任務、金碟遊樂場' },
        { id: 1016978, name: '梅園', nameEn: 'Baien', race: 'aura', gender: 'M', job: 'thaumaturge', img: 'AuramBaien.jpg', challengeLog: '行會令、危命任務、軍隊' },
        { id: 1016979, name: '貝科特爾', nameEn: 'Begter', race: 'aura', gender: 'M', job: 'rogue', img: 'AuramBegter.jpg', challengeLog: '大地使者、尋寶、金碟遊樂場' },
        { id: 1016980, name: '雲切', nameEn: 'Kumokiri', race: 'aura', gender: 'F', job: 'gladiator', img: 'AurafKumokiri.jpg', challengeLog: '行會令、危命任務、軍隊' },
        { id: 1016981, name: '朵拉嘉娜', nameEn: 'Toragana', race: 'aura', gender: 'F', job: 'archer', img: 'AurafToragana.jpg', challengeLog: '迷宮挑戰、金碟遊樂場' },
        { id: 1016982, name: '雷電', nameEn: 'Raiden', race: 'aura', gender: 'M', job: 'pugilist', img: 'AuramRaiden.jpg', challengeLog: '大地使者、雇員探險' },
        { id: 1016983, name: '科爾琪', nameEn: 'Khorchi', race: 'aura', gender: 'F', job: 'pugilist', img: 'AurafKhorchi.jpg', challengeLog: '金碟遊樂場' }
    ],

    // Image base URL (local)
    imageBaseUrl: 'images/recruits/',

    // Get recruit image URL
    getRecruitImageUrl(recruit) {
        if (!recruit || !recruit.img) return 'images/recruits/default.png';
        return this.imageBaseUrl + recruit.img;
    },

    // Mission data - 任務資料
    // 數據來源: https://ff14.huijiwiki.com/wiki/冒险者分队
    // 解鎖任務為固定數值，普通任務有多種配置（每週輪換）
    missions: {
        // 解鎖任務 - 固定數值
        unlock: [
            { id: 1, name: '巡邏城內', nameEn: 'City Patrol', level: 1, physical: 145, mental: 140, tactical: 140, flagged: true, unlocks: '開啟簡單任務' },
            { id: 7, name: '重要任務：消滅低級妖異', nameEn: 'Flagged Mission: Voidsent Elimination', level: 20, physical: 235, mental: 245, tactical: 255, flagged: true, unlocks: '開啟普通任務' },
            { id: 14, name: '重要任務：奪取水晶', nameEn: 'Flagged Mission: Crystal Recovery', level: 40, physical: 315, mental: 325, tactical: 340, flagged: true, unlocks: '開啟特殊任務' },
            { id: 34, name: '重要任務：殲滅帝國軍特殊部隊', nameEn: 'Flagged Mission: Sapper Strike', level: 50, physical: 370, mental: 355, tactical: 345, flagged: true, unlocks: '軍銜升至正X尉' }
        ],
        // 簡單任務 - 多配置
        trainee: [
            { id: 2, name: '向附近據點傳令', nameEn: 'Military Courier', level: 1, flagged: false,
              variants: [[165,160,160], [165,170,150], [150,170,165], [160,150,175], [150,160,175]] },
            { id: 3, name: '巡邏城市周邊道路', nameEn: 'Outskirts Patrol', level: 1, flagged: false,
              variants: [[245,200,155], [150,255,195], [195,255,150], [155,195,250], [195,155,250]] },
            { id: 4, name: '偵察蠻族部隊', nameEn: 'Beastmen Recon', level: 5, flagged: false,
              variants: [[195,155,250], [155,195,250], [245,200,155], [245,155,200], [195,255,150]] },
            { id: 5, name: '護衛補給部隊', nameEn: 'Supply Wagon Escort', level: 10, flagged: false,
              variants: [[125,210,310], [305,210,130], [305,130,210], [210,320,115], [115,320,210]] },
            { id: 6, name: '驅除魔物', nameEn: 'Pest Eradication', level: 15, flagged: false,
              variants: [[225,140,325], [320,145,225], [320,225,145], [130,335,225], [225,335,130]] }
        ],
        // 普通任務 - 多配置
        routine: [
            { id: 8, name: '支援前線部隊', nameEn: 'Frontline Support', level: 20, flagged: false,
              variants: [[410,145,270], [265,435,125], [140,265,420], [410,270,145], [125,435,265]] },
            { id: 9, name: '護衛同盟軍軍官', nameEn: 'Officer Escort', level: 20, flagged: false,
              variants: [[130,440,270], [270,145,425], [145,270,425], [415,275,150], [415,150,275]] },
            { id: 10, name: '巡邏郊外道路', nameEn: 'Border Patrol', level: 25, flagged: false,
              variants: [[425,285,160], [140,450,280], [280,155,435], [425,160,285], [280,450,140], [155,280,435]] },
            { id: 11, name: '偵察蠻族據點', nameEn: 'Stronghold Recon', level: 30, flagged: false,
              variants: [[170,295,450], [440,300,175], [440,175,300], [295,465,155], [155,465,295], [295,170,450]] },
            { id: 12, name: '搜索失蹤人員', nameEn: 'Search and Rescue', level: 35, flagged: false,
              variants: [[310,480,170], [185,310,465], [455,315,190], [170,480,310], [310,185,465], [455,190,315]] },
            { id: 13, name: '與同盟軍的聯合演習', nameEn: 'Allied Maneuvers', level: 35, flagged: false,
              variants: [[455,190,315], [310,480,170], [170,480,310], [310,185,465], [185,310,465], [455,315,190]] }
        ],
        // 特殊任務 - 多配置
        priority: [
            { id: 16, name: '強襲蠻族據點', nameEn: 'Stronghold Assault', level: 40, flagged: false,
              variants: [[530,385,275], [530,275,385], [385,560,245], [245,560,385], [385,265,540], [265,385,540]] },
            { id: 17, name: '取締違法武器交易', nameEn: 'Black Market Crackdown', level: 40, flagged: false,
              variants: [[385,560,245], [245,560,385], [385,265,540], [265,385,540], [530,385,275], [530,275,385]] },
            { id: 18, name: '偵察帝國軍據點', nameEn: 'Imperial Recon', level: 40, flagged: false,
              variants: [[385,265,540], [265,385,540], [530,385,275], [530,275,385], [385,560,245], [245,560,385]] },
            { id: 19, name: '追蹤帝國軍逃兵', nameEn: 'Imperial Pursuit', level: 40, flagged: false,
              variants: [[530,275,385], [385,560,245], [245,560,385], [385,265,540], [265,385,540], [530,385,275]] },
            { id: 20, name: '發動對帝國軍的牽制攻擊', nameEn: 'Imperial Feint', level: 40, flagged: false,
              variants: [[245,560,385], [385,265,540], [265,385,540], [530,385,275], [530,275,385], [385,560,245]] },
            { id: 21, name: '切斷蠻族補給線作戰', nameEn: 'Supply Line Disruption', level: 40, flagged: false,
              variants: [[265,385,540], [530,385,275], [530,275,385], [385,560,245], [245,560,385], [385,265,540]] },
            { id: 22, name: '追蹤通緝犯', nameEn: 'Criminal Pursuit', level: 40, flagged: false,
              variants: [[530,275,385], [530,385,275], [245,560,385], [385,560,245], [265,385,540], [385,265,540]] },
            { id: 23, name: '殲滅帝國軍補給部隊', nameEn: 'Supply Wagon Destruction', level: 40, flagged: false,
              variants: [[245,560,385], [385,560,245], [265,385,540], [385,265,540], [530,275,385], [530,385,275]] },
            { id: 24, name: '消滅合成生物', nameEn: 'Chimerical Elimination', level: 40, flagged: false,
              variants: [[265,385,540], [385,265,540], [530,275,385], [530,385,275], [245,560,385], [385,560,245]] },
            { id: 25, name: '與拂曉的共同作戰', nameEn: 'Primal Recon', level: 50, flagged: false,
              variants: [[430,620,275], [275,620,430], [295,430,600], [430,295,600], [590,305,430], [590,430,305]] },
            { id: 26, name: '開發反魔導兵器戰術', nameEn: 'Counter-magitek Exercises', level: 50, flagged: false,
              variants: [[590,430,305], [275,620,430], [295,430,600], [430,295,600], [430,620,275], [590,305,430]] },
            { id: 27, name: '市民救出作戰', nameEn: 'Infiltrate and Rescue', level: 50, flagged: false,
              variants: [[430,295,600], [275,620,430], [295,430,600], [430,620,275], [590,305,430], [590,430,305]] },
            { id: 28, name: '消滅武裝集團', nameEn: 'Outlaw Subjugation', level: 50, flagged: false,
              variants: [[430,295,600], [275,620,430], [295,430,600], [430,620,275], [590,305,430], [590,430,305]] },
            { id: 29, name: '取締違法邪教教團', nameEn: 'Cult Crackdown', level: 50, flagged: false,
              variants: [[430,620,275], [275,620,430], [295,430,600], [430,295,600], [590,305,430], [590,430,305]] },
            { id: 30, name: '消滅非法召喚的妖異', nameEn: 'Voidsent Elimination', level: 50, flagged: false,
              variants: [[590,430,305], [275,620,430], [295,430,600], [430,295,600], [430,620,275], [590,305,430]] },
            { id: 31, name: '擊破帝國軍廢棄兵器', nameEn: 'Armor Annihilation', level: 50, flagged: false,
              variants: [[275,620,430], [295,430,600], [430,295,600], [430,620,275], [590,305,430], [590,430,305]] },
            { id: 32, name: '排除哥布林族集團', nameEn: 'Invasive Testing', level: 50, flagged: false,
              variants: [[590,305,430], [275,620,430], [295,430,600], [430,295,600], [430,620,275], [590,430,305]] },
            { id: 33, name: '揭發偽牙軍曹', nameEn: 'Imposter Alert', level: 50, flagged: false,
              variants: [[295,430,600], [275,620,430], [430,295,600], [430,620,275], [590,305,430], [590,430,305]] }
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

    // Get all missions (flat list with default variant)
    getAllMissions() {
        const formatMission = (m, tier, tierName) => {
            if (m.variants) {
                // 有多配置的任務，使用第一個配置作為預設
                const [physical, mental, tactical] = m.variants[0];
                return { ...m, physical, mental, tactical, tier, tierName, hasVariants: true };
            }
            // 固定數值的任務
            return { ...m, tier, tierName, hasVariants: false };
        };

        return [
            ...this.missions.unlock.map(m => formatMission(m, 'unlock', '解鎖任務')),
            ...this.missions.trainee.map(m => formatMission(m, 'trainee', '簡單任務')),
            ...this.missions.routine.map(m => formatMission(m, 'routine', '普通任務')),
            ...this.missions.priority.map(m => formatMission(m, 'priority', '特殊任務'))
        ];
    },

    // Get mission by ID
    getMission(id) {
        const allCategories = ['unlock', 'trainee', 'routine', 'priority'];
        for (const cat of allCategories) {
            const mission = this.missions[cat].find(m => m.id === id);
            if (mission) return mission;
        }
        return null;
    },

    // Get mission variants as formatted objects
    getMissionVariants(missionId) {
        const mission = this.getMission(missionId);
        if (!mission) return null;

        if (!mission.variants) {
            // 固定數值的任務
            return [{
                index: 0,
                physical: mission.physical,
                mental: mission.mental,
                tactical: mission.tactical,
                label: `${mission.physical}/${mission.mental}/${mission.tactical}`
            }];
        }

        // 多配置任務
        return mission.variants.map((v, i) => ({
            index: i,
            physical: v[0],
            mental: v[1],
            tactical: v[2],
            label: `${v[0]}/${v[1]}/${v[2]}`
        }));
    },

    // Get mission with specific variant
    getMissionWithVariant(missionId, variantIndex = 0) {
        const mission = this.getMission(missionId);
        if (!mission) return null;

        if (!mission.variants) {
            return { ...mission };
        }

        const variant = mission.variants[variantIndex] || mission.variants[0];
        return {
            ...mission,
            physical: variant[0],
            mental: variant[1],
            tactical: variant[2],
            selectedVariant: variantIndex
        };
    },

    // Calculate stats for level with rank cap
    calculateStatsForLevel(jobKey, level, rank = 3) {
        const levelStats = this.classLevelStats[jobKey];
        if (!levelStats) return null;

        // Clamp level to valid range
        const clampedLevel = Math.max(1, Math.min(60, level));
        const stats = levelStats[clampedLevel];
        if (!stats) return null;

        return {
            physical: stats[0],
            mental: stats[1],
            tactical: stats[2]
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
