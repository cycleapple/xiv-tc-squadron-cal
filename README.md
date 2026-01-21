# FFXIV 冒險者小隊計算機

Squadron Mission Calculator for Final Fantasy XIV

## 功能特色

- **隊員管理** - 新增、編輯、刪除隊員（最多 8 人）
- **組合計算** - 自動計算 C(n,4) 種 4 人組合
- **訓練規劃** - 找出最少訓練次數達成目標的方案
- **訓練模擬** - 預覽並套用訓練效果
- **資料持久化** - localStorage 自動保存
- **匯入/匯出** - JSON 格式資料備份

## 使用方法

### 1. 新增隊員
點擊「新增隊員」按鈕，填入：
- 名稱
- 職業（9 種基礎職業）
- 等級
- 種族
- 能力值（物理/精神/戰術）

可使用「自動填入」功能根據職業 Lv60 預設值填入。

### 2. 設定任務需求
在「任務設定」區域輸入目標能力值，或從預設任務中選擇。

### 3. 計算最佳組合
點擊「計算最佳組合」，系統將：
1. 列舉所有可能的 4 人組合
2. 計算每組的總能力值
3. 找出達成目標所需的訓練方案
4. 依優先順序排列結果

### 4. 訓練模擬
展開「訓練模擬」面板，可以：
1. 選擇訓練類型
2. 點選要訓練的隊員
3. 預覽訓練效果
4. 套用訓練（會更新儲存的資料）

## 遊戲機制

### 能力值上限
| 小隊階級 | 能力總上限 |
|---------|-----------|
| Rank 1  | 200       |
| Rank 2  | 300       |
| Rank 3  | 400       |

### 訓練類型
| 類型 | 效果 |
|------|------|
| A 型 | 主屬性 +40，其他兩項各 -20 |
| B 型 | 兩項各 +20，一項 -40 |

### 職業能力傾向
| 職業 | 物理 | 精神 | 戰術 |
|------|------|------|------|
| 劍術士 | 79 | 56 | 79 |
| 斧術士 | 102 | 45 | 67 |
| 槍術士 | 90 | 56 | 68 |
| 格鬥士 | 79 | 56 | 79 |
| 弓術士 | 68 | 56 | 90 |
| 雙劍士 | 68 | 68 | 78 |
| 幻術士 | 45 | 102 | 67 |
| 咒術士 | 56 | 90 | 68 |
| 秘術士 | 56 | 90 | 68 |

*數值為 Lv60 基準值*

## 技術架構

- **框架**: Vanilla JavaScript（無依賴）
- **儲存**: localStorage
- **部署**: 靜態網頁，支援 GitHub Pages

## 檔案結構

```
squadron-calc/
├── index.html          # 主頁面
├── css/
│   └── style.css       # 樣式
├── js/
│   ├── app.js          # 主程式入口
│   ├── data.js         # 遊戲資料
│   ├── calculator.js   # 計算引擎
│   ├── training.js     # 訓練模擬
│   ├── ui.js           # UI 互動
│   └── storage.js      # 資料儲存
└── README.md           # 說明文件
```

## 快捷鍵

- `Esc` - 關閉彈窗
- `Ctrl/Cmd + Enter` - 執行計算

## 參考資源

- [FFXIV Wiki - Adventurer Squadrons](https://ffxiv.consolegameswiki.com/wiki/Adventurer_Squadrons)
- [FFXIV Squadron](https://ffxivsquadron.com/)
- [Squadron Recruits Stats](https://ffxiv.consolegameswiki.com/wiki/Squadron_Recruits_Stats)

## 授權

MIT License
