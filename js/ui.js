/**
 * FFXIV Squadron Calculator - UI Module
 * Handles all DOM interactions and rendering
 */

const UI = {
    // Current state
    members: [],
    selectedMemberIds: [],
    editingMemberId: null,
    squadRank: 3,

    // DOM element references
    elements: {},

    /**
     * Initialize UI
     */
    init() {
        this.cacheElements();
        this.bindEvents();
        this.loadMembers();
        this.loadSettings();
        this.populateMissionSelector();
        this.render();
    },

    // Currently selected mission ID
    selectedMissionId: null,

    /**
     * Populate mission selector with game data
     */
    populateMissionSelector() {
        const select = this.elements.presetMissions;
        select.innerHTML = '<option value="">-- 選擇任務 --</option>';

        // Add custom input option
        const customGroup = document.createElement('optgroup');
        customGroup.label = '自訂';
        customGroup.innerHTML = '<option value="custom">手動輸入數值...</option>';
        select.appendChild(customGroup);

        // Add unlock missions - 解鎖任務（固定數值）
        const unlockGroup = document.createElement('optgroup');
        unlockGroup.label = '解鎖任務 (固定)';
        GameData.missions.unlock.forEach(m => {
            const opt = document.createElement('option');
            opt.value = `mission:${m.id}`;
            opt.textContent = `${m.name} (${m.physical}/${m.mental}/${m.tactical}) ★`;
            unlockGroup.appendChild(opt);
        });
        select.appendChild(unlockGroup);

        // Add trainee missions - 簡單任務
        const traineeGroup = document.createElement('optgroup');
        traineeGroup.label = '簡單任務 (Lv1-15)';
        GameData.missions.trainee.forEach(m => {
            const opt = document.createElement('option');
            opt.value = `mission:${m.id}`;
            opt.textContent = `${m.name} (Lv${m.level})`;
            traineeGroup.appendChild(opt);
        });
        select.appendChild(traineeGroup);

        // Add routine missions - 普通任務
        const routineGroup = document.createElement('optgroup');
        routineGroup.label = '普通任務 (Lv20-35)';
        GameData.missions.routine.forEach(m => {
            const opt = document.createElement('option');
            opt.value = `mission:${m.id}`;
            opt.textContent = `${m.name} (Lv${m.level})`;
            routineGroup.appendChild(opt);
        });
        select.appendChild(routineGroup);

        // Add priority missions - 特殊任務
        const priorityGroup = document.createElement('optgroup');
        priorityGroup.label = '特殊任務 (Lv40-50)';
        GameData.missions.priority.forEach(m => {
            const opt = document.createElement('option');
            opt.value = `mission:${m.id}`;
            opt.textContent = `${m.name} (Lv${m.level})`;
            priorityGroup.appendChild(opt);
        });
        select.appendChild(priorityGroup);
    },

    /**
     * Handle mission selection change
     */
    onMissionSelect(value) {
        const variantGroup = this.elements.variantGroup;
        const variantSelect = this.elements.missionVariant;

        if (!value || value === 'custom') {
            // Custom input mode - hide variant selector
            if (variantGroup) variantGroup.style.display = 'none';
            this.selectedMissionId = null;
            return;
        }

        // Parse mission ID
        if (value.startsWith('mission:')) {
            const missionId = parseInt(value.replace('mission:', ''));
            this.selectedMissionId = missionId;

            const variants = GameData.getMissionVariants(missionId);
            if (!variants || variants.length === 0) return;

            // If only one variant (fixed mission), hide selector and apply directly
            if (variants.length === 1) {
                if (variantGroup) variantGroup.style.display = 'none';
                this.applyMissionVariant(variants[0]);
                return;
            }

            // Multiple variants - show selector
            if (variantGroup) variantGroup.style.display = 'block';

            // Populate variant options
            variantSelect.innerHTML = variants.map((v, i) =>
                `<option value="${i}">${v.label}</option>`
            ).join('');

            // Apply first variant by default
            this.applyMissionVariant(variants[0]);
        }
    },

    /**
     * Handle variant selection change
     */
    onVariantSelect(variantIndex) {
        if (this.selectedMissionId === null) return;

        const variants = GameData.getMissionVariants(this.selectedMissionId);
        if (!variants || !variants[variantIndex]) return;

        this.applyMissionVariant(variants[variantIndex]);
    },

    /**
     * Apply mission variant to requirement inputs
     */
    applyMissionVariant(variant) {
        if (this.elements.reqPhysical) {
            this.elements.reqPhysical.value = variant.physical;
        }
        if (this.elements.reqMental) {
            this.elements.reqMental.value = variant.mental;
        }
        if (this.elements.reqTactical) {
            this.elements.reqTactical.value = variant.tactical;
        }
    },

    // Current filter state
    currentRaceFilter: '',
    currentJobFilter: '',

    /**
     * Populate recruit grid with visual cards
     */
    populateRecruitGrid() {
        const grid = this.elements.recruitGrid;
        if (!grid) return;

        // Get existing members' recruit IDs to mark as disabled
        const existingRecruitIds = this.members
            .filter(m => m.id !== this.editingMemberId)
            .map(m => m.recruitId);

        // Filter recruits
        let recruits = GameData.getAllRecruits();
        if (this.currentRaceFilter) {
            recruits = recruits.filter(r => r.race === this.currentRaceFilter);
        }
        if (this.currentJobFilter) {
            recruits = recruits.filter(r => r.job === this.currentJobFilter);
        }

        const selectedId = parseInt(this.elements.recruitSelect?.value) || null;

        grid.innerHTML = recruits.map(recruit => {
            const job = GameData.getJob(recruit.job);
            const isDisabled = existingRecruitIds.includes(recruit.id);
            const isSelected = recruit.id === selectedId;
            const imgUrl = GameData.getRecruitImageUrl(recruit);

            return `
                <div class="recruit-card ${isSelected ? 'selected' : ''} ${isDisabled ? 'disabled' : ''}"
                     data-recruit-id="${recruit.id}"
                     title="${recruit.name} (${job?.name || recruit.job})">
                    <img class="recruit-card-img"
                         src="${imgUrl}"
                         alt="${recruit.name}"
                         onerror="this.src='images/recruits/default.png'">
                    <div class="recruit-card-name">${recruit.name}</div>
                    <div class="recruit-card-job">${job?.abbr || '?'}</div>
                </div>
            `;
        }).join('');

        // Bind click events to cards
        grid.querySelectorAll('.recruit-card:not(.disabled)').forEach(card => {
            card.addEventListener('click', () => {
                this.selectRecruit(parseInt(card.dataset.recruitId));
            });
        });
    },

    /**
     * Handle race filter pill click
     */
    onRaceFilterClick(pill) {
        // Update active state
        this.elements.raceFilterPills.querySelectorAll('.filter-pill').forEach(p => {
            p.classList.remove('active');
        });
        pill.classList.add('active');

        this.currentRaceFilter = pill.dataset.race || '';
        this.populateRecruitGrid();
    },

    /**
     * Handle job filter pill click
     */
    onJobFilterClick(pill) {
        // Update active state
        this.elements.jobFilterPills.querySelectorAll('.filter-pill').forEach(p => {
            p.classList.remove('active');
        });
        pill.classList.add('active');

        this.currentJobFilter = pill.dataset.job || '';
        this.populateRecruitGrid();
    },

    /**
     * Select a recruit from the grid
     */
    selectRecruit(recruitId) {
        const recruit = GameData.getRecruit(recruitId);
        if (!recruit) return;

        // Update hidden input
        if (this.elements.recruitSelect) {
            this.elements.recruitSelect.value = recruitId;
        }

        // Update grid selection
        this.elements.recruitGrid?.querySelectorAll('.recruit-card').forEach(card => {
            card.classList.toggle('selected', parseInt(card.dataset.recruitId) === recruitId);
        });

        // Show selected recruit preview
        this.showSelectedRecruitPreview(recruit);

        // Show job selector and set default job
        if (this.elements.jobSelectGroup) {
            this.elements.jobSelectGroup.style.display = 'block';
        }
        if (this.elements.memberJob) {
            this.elements.memberJob.value = recruit.job;
        }

        // Auto-fill stats (only in add mode)
        if (!this.editingMemberId) {
            this.autoFillBaseStats();
        }
    },

    /**
     * Show selected recruit preview
     */
    showSelectedRecruitPreview(recruit) {
        if (!this.elements.selectedRecruitPreview) return;

        this.elements.selectedRecruitPreview.style.display = 'flex';

        const imgUrl = GameData.getRecruitImageUrl(recruit);
        if (this.elements.selectedRecruitImg) {
            this.elements.selectedRecruitImg.src = imgUrl;
            this.elements.selectedRecruitImg.onerror = function() {
                this.src = 'images/recruits/default.png';
            };
        }

        if (this.elements.selectedRecruitName) {
            this.elements.selectedRecruitName.textContent = recruit.name;
        }

        const job = GameData.getJob(recruit.job);
        const race = GameData.races[recruit.race];

        if (this.elements.recruitOriginalJob) {
            this.elements.recruitOriginalJob.textContent = job ? job.name : recruit.job;
        }
        if (this.elements.recruitRace) {
            this.elements.recruitRace.textContent = race ? race.name : recruit.race;
        }
    },

    /**
     * Clear recruit selection
     */
    clearRecruitSelection() {
        if (this.elements.recruitSelect) {
            this.elements.recruitSelect.value = '';
        }

        if (this.elements.selectedRecruitPreview) {
            this.elements.selectedRecruitPreview.style.display = 'none';
        }

        if (this.elements.jobSelectGroup) {
            this.elements.jobSelectGroup.style.display = 'none';
        }

        this.clearStatsInputs();
        this.populateRecruitGrid();
    },

    /**
     * Cache DOM elements
     */
    cacheElements() {
        this.elements = {
            memberList: document.getElementById('memberList'),
            addMemberBtn: document.getElementById('addMemberBtn'),
            trainingBtn: document.getElementById('trainingBtn'),
            importBtn: document.getElementById('importBtn'),
            exportBtn: document.getElementById('exportBtn'),
            calculateBtn: document.getElementById('calculateBtn'),
            resultsContainer: document.getElementById('resultsContainer'),
            squadRank: document.getElementById('squadRank'),

            // Mission requirements
            reqPhysical: document.getElementById('reqPhysical'),
            reqMental: document.getElementById('reqMental'),
            reqTactical: document.getElementById('reqTactical'),
            presetMissions: document.getElementById('presetMissions'),
            variantGroup: document.getElementById('variantGroup'),
            missionVariant: document.getElementById('missionVariant'),

            // Member modal - visual recruit selection
            memberModal: document.getElementById('memberModal'),
            modalTitle: document.getElementById('modalTitle'),
            memberForm: document.getElementById('memberForm'),
            raceFilterPills: document.getElementById('raceFilterPills'),
            jobFilterPills: document.getElementById('jobFilterPills'),
            recruitGrid: document.getElementById('recruitGrid'),
            recruitSelect: document.getElementById('recruitSelect'),
            selectedRecruitPreview: document.getElementById('selectedRecruitPreview'),
            selectedRecruitImg: document.getElementById('selectedRecruitImg'),
            selectedRecruitName: document.getElementById('selectedRecruitName'),
            recruitOriginalJob: document.getElementById('recruitOriginalJob'),
            recruitRace: document.getElementById('recruitRace'),
            clearRecruitBtn: document.getElementById('clearRecruitBtn'),
            jobSelectGroup: document.getElementById('jobSelectGroup'),
            memberJob: document.getElementById('memberJob'),
            memberLevel: document.getElementById('memberLevel'),
            memberPhysical: document.getElementById('memberPhysical'),
            memberMental: document.getElementById('memberMental'),
            memberTactical: document.getElementById('memberTactical'),
            autoFillStats: document.getElementById('autoFillStats'),
            considerJobChange: document.getElementById('considerJobChange'),

            // Import/Export modal
            importExportModal: document.getElementById('importExportModal'),
            importExportTitle: document.getElementById('importExportTitle'),
            importExportData: document.getElementById('importExportData'),
            confirmImport: document.getElementById('confirmImport'),

            // Recruits list modal
            viewRecruitsBtn: document.getElementById('viewRecruitsBtn'),
            recruitsListModal: document.getElementById('recruitsListModal'),
            recruitsTableBody: document.getElementById('recruitsTableBody'),
            recruitsRaceFilter: document.getElementById('recruitsRaceFilter'),
            recruitsChallengeFilter: document.getElementById('recruitsChallengeFilter'),

            // Training pool
            poolPhysical: document.getElementById('poolPhysical'),
            poolMental: document.getElementById('poolMental'),
            poolTactical: document.getElementById('poolTactical'),
            trainingPoolTotal: document.getElementById('trainingPoolTotal'),

            // Chemistry (吉兆)
            hasChemistry: document.getElementById('hasChemistry'),
            chemistrySettings: document.getElementById('chemistrySettings'),
            chemistryCondition: document.getElementById('chemistryCondition'),
            chemistryEffect: document.getElementById('chemistryEffect'),
            chemistryValue: document.getElementById('chemistryValue'),
            chemistryPreview: document.getElementById('chemistryPreview'),

            // Training modals
            trainingModal: document.getElementById('trainingModal'),
            trainingGrid: document.getElementById('trainingGrid'),
            trainingConfirmModal: document.getElementById('trainingConfirmModal'),
            trainingConfirmContent: document.getElementById('trainingConfirmContent'),
            confirmTrainingBtn: document.getElementById('confirmTrainingBtn')
        };
    },

    /**
     * Bind event listeners
     */
    bindEvents() {
        // Add member button
        this.elements.addMemberBtn.addEventListener('click', () => this.openMemberModal());

        // Training button
        if (this.elements.trainingBtn) {
            this.elements.trainingBtn.addEventListener('click', () => this.openTrainingModal());
        }

        // Calculate button
        this.elements.calculateBtn.addEventListener('click', () => this.calculate());

        // Import/Export buttons
        this.elements.importBtn.addEventListener('click', () => this.openImportModal());
        this.elements.exportBtn.addEventListener('click', () => this.exportData());

        // Squad rank change
        if (this.elements.squadRank) {
            this.elements.squadRank.addEventListener('change', (e) => this.onSquadRankChange(e.target.value));
        }

        // Training pool inputs - use 'change' event so user can finish typing before validation
        ['poolPhysical', 'poolMental', 'poolTactical'].forEach(id => {
            if (this.elements[id]) {
                this.elements[id].addEventListener('change', () => this.updateTrainingPoolTotal());
            }
        });

        // Mission selection
        this.elements.presetMissions.addEventListener('change', (e) => this.onMissionSelect(e.target.value));

        // Mission variant selection
        if (this.elements.missionVariant) {
            this.elements.missionVariant.addEventListener('change', (e) => this.onVariantSelect(parseInt(e.target.value)));
        }

        // Member form
        this.elements.memberForm.addEventListener('submit', (e) => this.saveMember(e));

        // Recruit filter pills
        if (this.elements.raceFilterPills) {
            this.elements.raceFilterPills.addEventListener('click', (e) => {
                if (e.target.classList.contains('filter-pill')) {
                    this.onRaceFilterClick(e.target);
                }
            });
        }
        if (this.elements.jobFilterPills) {
            this.elements.jobFilterPills.addEventListener('click', (e) => {
                if (e.target.classList.contains('filter-pill')) {
                    this.onJobFilterClick(e.target);
                }
            });
        }

        // Clear recruit button
        if (this.elements.clearRecruitBtn) {
            this.elements.clearRecruitBtn.addEventListener('click', () => this.clearRecruitSelection());
        }

        // Auto fill stats button
        if (this.elements.autoFillStats) {
            this.elements.autoFillStats.addEventListener('click', () => this.autoFillBaseStats());
        }

        // Job change in modal
        if (this.elements.memberJob) {
            this.elements.memberJob.addEventListener('change', () => {
                this.autoFillBaseStats();
            });
        }

        // Level change in modal - auto update stats
        if (this.elements.memberLevel) {
            this.elements.memberLevel.addEventListener('change', () => {
                this.autoFillBaseStats();
            });
        }

        // Chemistry toggle
        if (this.elements.hasChemistry) {
            this.elements.hasChemistry.addEventListener('change', (e) => {
                this.toggleChemistrySettings(e.target.checked);
            });
        }

        // Chemistry condition change
        if (this.elements.chemistryCondition) {
            this.elements.chemistryCondition.addEventListener('change', () => this.updateChemistryPreview());
        }

        // Chemistry effect change
        if (this.elements.chemistryEffect) {
            this.elements.chemistryEffect.addEventListener('change', () => {
                this.populateChemistryValues();
                this.updateChemistryPreview();
            });
        }

        // Chemistry value change
        if (this.elements.chemistryValue) {
            this.elements.chemistryValue.addEventListener('change', () => this.updateChemistryPreview());
        }

        // Modal close buttons
        document.querySelectorAll('.modal-close, .modal-cancel').forEach(btn => {
            btn.addEventListener('click', () => this.closeModals());
        });

        // Import confirm
        this.elements.confirmImport.addEventListener('click', () => this.confirmImport());

        // View recruits button
        if (this.elements.viewRecruitsBtn) {
            this.elements.viewRecruitsBtn.addEventListener('click', () => this.openRecruitsListModal());
        }

        // Recruits list filters
        if (this.elements.recruitsRaceFilter) {
            this.elements.recruitsRaceFilter.addEventListener('change', () => this.renderRecruitsTable());
        }
        if (this.elements.recruitsChallengeFilter) {
            this.elements.recruitsChallengeFilter.addEventListener('change', () => this.renderRecruitsTable());
        }

        // Confirm training button
        if (this.elements.confirmTrainingBtn) {
            this.elements.confirmTrainingBtn.addEventListener('click', () => this.applyTraining());
        }

        // Close modal on outside click
        document.querySelectorAll('.modal').forEach(modal => {
            modal.addEventListener('click', (e) => {
                if (e.target === modal) this.closeModals();
            });
        });
    },

    /**
     * Load members from storage
     */
    loadMembers() {
        this.members = Storage.loadMembers();
    },

    /**
     * Load settings from storage
     */
    loadSettings() {
        const settings = Storage.loadSettings();
        this.squadRank = settings.squadRank || 3;
        if (this.elements.squadRank) {
            this.elements.squadRank.value = this.squadRank;
        }

        // Load training pool values
        if (settings.trainingPool) {
            if (this.elements.poolPhysical) {
                this.elements.poolPhysical.value = settings.trainingPool.physical || 0;
            }
            if (this.elements.poolMental) {
                this.elements.poolMental.value = settings.trainingPool.mental || 0;
            }
            if (this.elements.poolTactical) {
                this.elements.poolTactical.value = settings.trainingPool.tactical || 0;
            }
        }
        this.updateTrainingPoolTotal(false); // Don't save when loading
    },

    /**
     * Save members to storage
     */
    saveMembers() {
        Storage.saveMembers(this.members);
    },

    /**
     * Save settings to storage
     */
    saveSettings() {
        const trainingPool = {
            physical: parseInt(this.elements.poolPhysical?.value) || 0,
            mental: parseInt(this.elements.poolMental?.value) || 0,
            tactical: parseInt(this.elements.poolTactical?.value) || 0
        };
        Storage.saveSettings({
            squadRank: this.squadRank,
            trainingPool: trainingPool
        });
    },

    /**
     * Handle squad rank change
     */
    onSquadRankChange(value) {
        this.squadRank = parseInt(value) || 3;
        this.saveSettings();
        this.updateTrainingPoolTotal();
    },

    /**
     * Update training pool total display and enforce cap
     * @param {boolean} save - Whether to save to storage (default true)
     */
    updateTrainingPoolTotal(save = true) {
        const cap = GameData.rankCaps[this.squadRank] || 400;

        let physical = parseInt(this.elements.poolPhysical?.value) || 0;
        let mental = parseInt(this.elements.poolMental?.value) || 0;
        let tactical = parseInt(this.elements.poolTactical?.value) || 0;

        // Round to multiples of 20 and ensure non-negative
        physical = Math.max(0, Math.round(physical / 20) * 20);
        mental = Math.max(0, Math.round(mental / 20) * 20);
        tactical = Math.max(0, Math.round(tactical / 20) * 20);

        // Enforce cap - if total exceeds, scale down (keeping multiples of 20)
        const total = physical + mental + tactical;
        if (total > cap) {
            const scale = cap / total;
            physical = Math.floor(physical * scale / 20) * 20;
            mental = Math.floor(mental * scale / 20) * 20;
            tactical = Math.floor(tactical * scale / 20) * 20;

            // Handle remainder - add 20 to largest stat if under cap
            let newTotal = physical + mental + tactical;
            while (newTotal + 20 <= cap) {
                if (physical >= mental && physical >= tactical) {
                    physical += 20;
                } else if (mental >= tactical) {
                    mental += 20;
                } else {
                    tactical += 20;
                }
                newTotal += 20;
            }
        }

        // Always update input values to reflect rounding
        if (this.elements.poolPhysical) this.elements.poolPhysical.value = physical;
        if (this.elements.poolMental) this.elements.poolMental.value = mental;
        if (this.elements.poolTactical) this.elements.poolTactical.value = tactical;

        const finalTotal = physical + mental + tactical;

        if (this.elements.trainingPoolTotal) {
            this.elements.trainingPoolTotal.textContent = `${finalTotal} / ${cap}`;
            this.elements.trainingPoolTotal.classList.remove('over', 'valid');
            if (finalTotal === cap) {
                this.elements.trainingPoolTotal.classList.add('valid');
            }
        }

        // Save to storage
        if (save) {
            this.saveSettings();
        }
    },

    /**
     * Get training pool values
     */
    getTrainingPool() {
        return {
            physical: parseInt(this.elements.poolPhysical?.value) || 0,
            mental: parseInt(this.elements.poolMental?.value) || 0,
            tactical: parseInt(this.elements.poolTactical?.value) || 0
        };
    },

    /**
     * Auto fill base stats based on selected job and level
     */
    autoFillBaseStats() {
        const jobKey = this.elements.memberJob?.value;
        const level = parseInt(this.elements.memberLevel?.value) || 60;

        if (!jobKey) {
            alert('請先選擇職業');
            return;
        }

        const stats = GameData.calculateStatsForLevel(jobKey, level, this.squadRank);
        if (!stats) return;

        if (this.elements.memberPhysical) {
            this.elements.memberPhysical.value = stats.physical;
        }
        if (this.elements.memberMental) {
            this.elements.memberMental.value = stats.mental;
        }
        if (this.elements.memberTactical) {
            this.elements.memberTactical.value = stats.tactical;
        }
    },

    /**
     * Clear stats inputs
     */
    clearStatsInputs() {
        if (this.elements.memberPhysical) {
            this.elements.memberPhysical.value = 0;
        }
        if (this.elements.memberMental) {
            this.elements.memberMental.value = 0;
        }
        if (this.elements.memberTactical) {
            this.elements.memberTactical.value = 0;
        }
    },

    // ==================== Chemistry Functions ====================

    /**
     * Populate chemistry condition dropdown
     */
    populateChemistryConditions() {
        const select = this.elements.chemistryCondition;
        if (!select) return;

        const conditions = GameData.getAllChemistryConditions();
        select.innerHTML = conditions.map(cond =>
            `<option value="${cond.key}">${cond.name}</option>`
        ).join('');
    },

    /**
     * Populate chemistry effect dropdown
     */
    populateChemistryEffects() {
        const select = this.elements.chemistryEffect;
        if (!select) return;

        const effects = GameData.getAllChemistryEffects();
        select.innerHTML = effects.map(eff =>
            `<option value="${eff.key}">${eff.desc}</option>`
        ).join('');
    },

    /**
     * Populate chemistry value dropdown based on selected effect
     */
    populateChemistryValues() {
        const select = this.elements.chemistryValue;
        const effectKey = this.elements.chemistryEffect?.value;
        if (!select || !effectKey) return;

        const effect = GameData.getChemistryEffect(effectKey);
        if (!effect) return;

        select.innerHTML = effect.values.map((val, idx) =>
            `<option value="${idx}">${val}%</option>`
        ).join('');
    },

    /**
     * Toggle chemistry settings visibility
     */
    toggleChemistrySettings(show) {
        if (this.elements.chemistrySettings) {
            this.elements.chemistrySettings.style.display = show ? 'block' : 'none';
        }
        if (show && !this.elements.chemistryCondition?.options.length) {
            this.populateChemistryConditions();
            this.populateChemistryEffects();
            this.populateChemistryValues();
        }
        this.updateChemistryPreview();
    },

    /**
     * Update chemistry preview text
     */
    updateChemistryPreview() {
        const preview = this.elements.chemistryPreview;
        if (!preview) return;

        if (!this.elements.hasChemistry?.checked) {
            preview.textContent = '';
            return;
        }

        const condKey = this.elements.chemistryCondition?.value;
        const effectKey = this.elements.chemistryEffect?.value;
        const valueIdx = parseInt(this.elements.chemistryValue?.value) || 0;

        const chemistry = { condition: condKey, effect: effectKey, value: valueIdx };
        const formatted = GameData.formatChemistry(chemistry);

        preview.textContent = formatted || '';
    },

    /**
     * Get chemistry data from form
     */
    getChemistryFromForm() {
        if (!this.elements.hasChemistry?.checked) return null;

        return {
            condition: this.elements.chemistryCondition?.value || '',
            effect: this.elements.chemistryEffect?.value || '',
            value: parseInt(this.elements.chemistryValue?.value) || 0
        };
    },

    /**
     * Set chemistry data in form
     */
    setChemistryInForm(chemistry) {
        // Ensure dropdowns are populated
        if (!this.elements.chemistryCondition?.options.length) {
            this.populateChemistryConditions();
            this.populateChemistryEffects();
        }

        if (chemistry) {
            this.elements.hasChemistry.checked = true;
            this.elements.chemistrySettings.style.display = 'block';

            if (this.elements.chemistryCondition) {
                this.elements.chemistryCondition.value = chemistry.condition;
            }
            if (this.elements.chemistryEffect) {
                this.elements.chemistryEffect.value = chemistry.effect;
            }
            this.populateChemistryValues();
            if (this.elements.chemistryValue) {
                this.elements.chemistryValue.value = chemistry.value;
            }
        } else {
            this.elements.hasChemistry.checked = false;
            this.elements.chemistrySettings.style.display = 'none';
        }
        this.updateChemistryPreview();
    },

    /**
     * Clear chemistry form
     */
    clearChemistryForm() {
        if (this.elements.hasChemistry) {
            this.elements.hasChemistry.checked = false;
        }
        if (this.elements.chemistrySettings) {
            this.elements.chemistrySettings.style.display = 'none';
        }
        if (this.elements.chemistryPreview) {
            this.elements.chemistryPreview.textContent = '';
        }
    },

    /**
     * Render member list
     */
    render() {
        this.renderMemberList();
    },

    /**
     * Render the member list
     */
    renderMemberList() {
        if (this.members.length === 0) {
            this.elements.memberList.innerHTML = `
                <div class="empty-state">
                    <div class="icon">+</div>
                    <p>尚無隊員</p>
                    <p>點擊「新增隊員」開始</p>
                </div>
            `;
            return;
        }

        this.elements.memberList.innerHTML = this.members.map(member => {
            const job = GameData.getJob(member.job);
            const roleClass = job ? GameData.getRoleClass(job.role) : 'dps';
            const isSelected = this.selectedMemberIds.includes(member.id);

            // Get recruit name and image if available
            let displayName = member.name;
            let recruitImgUrl = 'images/recruits/default.png';
            if (member.recruitId) {
                const recruit = GameData.getRecruit(member.recruitId);
                if (recruit) {
                    displayName = recruit.name;
                    recruitImgUrl = GameData.getRecruitImageUrl(recruit);
                }
            }

            // Check if job was changed from original
            const hasJobChanged = member.originalJob && member.originalJob !== member.job;
            const jobChangedIndicator = hasJobChanged ? '<span class="job-changed-indicator" title="已轉職">*</span>' : '';

            // Chemistry indicator
            const chemistryLabel = member.chemistry ?
                GameData.formatChemistry(member.chemistry) : null;
            const chemistryIndicator = chemistryLabel ?
                `<div class="member-chemistry" title="${this.escapeHtml(chemistryLabel)}">吉兆</div>` : '';

            return `
                <div class="member-card ${isSelected ? 'selected' : ''}" data-id="${member.id}">
                    <div class="member-avatar ${roleClass}">
                        <img src="${recruitImgUrl}" alt="${this.escapeHtml(displayName)}" onerror="this.src='images/recruits/default.png'">
                    </div>
                    <div class="member-info">
                        <div class="name">${this.escapeHtml(displayName)}</div>
                        <div class="job-level">${job ? job.name : '未知'}${jobChangedIndicator} Lv.${member.level}</div>
                        ${chemistryIndicator}
                    </div>
                    <div class="member-stats">
                        <span class="stat-badge physical">${member.physical}</span>
                        <span class="stat-badge mental">${member.mental}</span>
                        <span class="stat-badge tactical">${member.tactical}</span>
                    </div>
                    <div class="member-actions">
                        <button class="btn btn-secondary btn-small edit-btn" data-id="${member.id}">編輯</button>
                        <button class="btn btn-secondary btn-small delete-btn" data-id="${member.id}">刪除</button>
                    </div>
                </div>
            `;
        }).join('');

        // Bind member card events
        this.elements.memberList.querySelectorAll('.member-card').forEach(card => {
            card.addEventListener('click', (e) => {
                // Don't toggle selection if clicking on buttons
                if (e.target.classList.contains('edit-btn') || e.target.classList.contains('delete-btn')) {
                    return;
                }
                this.toggleMemberSelection(card.dataset.id);
            });
        });

        // Bind edit/delete buttons
        this.elements.memberList.querySelectorAll('.edit-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.stopPropagation();
                this.openMemberModal(btn.dataset.id);
            });
        });

        this.elements.memberList.querySelectorAll('.delete-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.stopPropagation();
                this.deleteMember(btn.dataset.id);
            });
        });
    },

    /**
     * Toggle member selection
     */
    toggleMemberSelection(id) {
        const index = this.selectedMemberIds.indexOf(id);
        if (index === -1) {
            this.selectedMemberIds.push(id);
        } else {
            this.selectedMemberIds.splice(index, 1);
        }
        this.renderMemberList();
    },

    /**
     * Open member modal
     */
    openMemberModal(memberId = null) {
        this.editingMemberId = memberId;

        // Reset filters
        this.currentRaceFilter = '';
        this.currentJobFilter = '';

        // Reset filter pills to "all"
        this.elements.raceFilterPills?.querySelectorAll('.filter-pill').forEach(p => {
            p.classList.toggle('active', p.dataset.race === '');
        });
        this.elements.jobFilterPills?.querySelectorAll('.filter-pill').forEach(p => {
            p.classList.toggle('active', p.dataset.job === '');
        });

        if (memberId) {
            // Edit mode
            const member = this.members.find(m => m.id === memberId);
            if (!member) return;

            this.elements.modalTitle.textContent = '編輯隊員';

            // Set selected recruit
            if (this.elements.recruitSelect) {
                this.elements.recruitSelect.value = member.recruitId || '';
            }

            // Populate grid and show selection
            this.populateRecruitGrid();

            // Show recruit preview
            if (member.recruitId) {
                const recruit = GameData.getRecruit(member.recruitId);
                if (recruit) {
                    this.showSelectedRecruitPreview(recruit);
                }
            }

            // Show job selector and set current job
            if (this.elements.jobSelectGroup) {
                this.elements.jobSelectGroup.style.display = member.recruitId ? 'block' : 'none';
            }
            if (this.elements.memberJob) {
                this.elements.memberJob.value = member.job;
            }

            if (this.elements.memberLevel) {
                this.elements.memberLevel.value = member.level;
            }

            // Populate current stats
            if (this.elements.memberPhysical) {
                this.elements.memberPhysical.value = member.physical || 0;
            }
            if (this.elements.memberMental) {
                this.elements.memberMental.value = member.mental || 0;
            }
            if (this.elements.memberTactical) {
                this.elements.memberTactical.value = member.tactical || 0;
            }

            // Load chemistry settings
            this.setChemistryInForm(member.chemistry);

            // Update submit button text
            const submitBtn = this.elements.memberForm.querySelector('button[type="submit"]');
            if (submitBtn) {
                submitBtn.textContent = '更新';
            }
        } else {
            // Add mode
            this.elements.modalTitle.textContent = '新增隊員';

            if (this.elements.recruitSelect) {
                this.elements.recruitSelect.value = '';
            }
            if (this.elements.memberLevel) {
                this.elements.memberLevel.value = 60;
            }
            if (this.elements.selectedRecruitPreview) {
                this.elements.selectedRecruitPreview.style.display = 'none';
            }
            if (this.elements.jobSelectGroup) {
                this.elements.jobSelectGroup.style.display = 'none';
            }
            this.clearStatsInputs();
            this.clearChemistryForm();

            // Populate grid
            this.populateRecruitGrid();

            // Update submit button text
            const submitBtn = this.elements.memberForm.querySelector('button[type="submit"]');
            if (submitBtn) {
                submitBtn.textContent = '新增';
            }
        }

        this.elements.memberModal.classList.add('active');
    },

    /**
     * Save member from form
     */
    saveMember(e) {
        e.preventDefault();

        const recruitId = parseInt(this.elements.recruitSelect?.value);
        if (!recruitId) {
            alert('請選擇隊員');
            return;
        }

        const recruit = GameData.getRecruit(recruitId);
        if (!recruit) {
            alert('找不到隊員資料');
            return;
        }

        const selectedJob = this.elements.memberJob?.value || recruit.job;
        const level = parseInt(this.elements.memberLevel?.value) || 60;

        // Use manually entered stats (user can edit after training)
        const physical = parseInt(this.elements.memberPhysical?.value) || 0;
        const mental = parseInt(this.elements.memberMental?.value) || 0;
        const tactical = parseInt(this.elements.memberTactical?.value) || 0;

        // Get chemistry data
        const chemistry = this.getChemistryFromForm();

        const memberData = {
            recruitId: recruitId,
            name: recruit.name,
            originalJob: recruit.job,  // Keep track of original job
            job: selectedJob,          // Current job (may be different if changed)
            race: recruit.race,
            level: level,
            physical: physical,
            mental: mental,
            tactical: tactical,
            chemistry: chemistry        // 吉兆設定
        };

        if (this.editingMemberId) {
            // Update existing
            const index = this.members.findIndex(m => m.id === this.editingMemberId);
            if (index !== -1) {
                this.members[index] = { ...this.members[index], ...memberData };
            }
        } else {
            // Add new
            if (this.members.length >= 8) {
                alert('最多只能有 8 名隊員');
                return;
            }
            memberData.id = Storage.generateId();
            this.members.push(memberData);
        }

        this.saveMembers();
        this.closeModals();
        this.render();
    },

    /**
     * Delete member
     */
    deleteMember(id) {
        if (!confirm('確定要刪除此隊員？')) return;

        this.members = this.members.filter(m => m.id !== id);
        this.selectedMemberIds = this.selectedMemberIds.filter(sid => sid !== id);
        this.saveMembers();
        this.render();
    },

    /**
     * Close all modals
     */
    closeModals() {
        document.querySelectorAll('.modal').forEach(modal => {
            modal.classList.remove('active');
        });
        this.editingMemberId = null;
    },

    /**
     * Load preset mission requirements
     */
    loadPresetMission(value) {
        if (!value) return;

        const [physical, mental, tactical] = value.split(',').map(Number);
        this.elements.reqPhysical.value = physical;
        this.elements.reqMental.value = mental;
        this.elements.reqTactical.value = tactical;
    },

    /**
     * Get current requirements from inputs
     */
    getRequirements() {
        return {
            physical: parseInt(this.elements.reqPhysical.value) || 0,
            mental: parseInt(this.elements.reqMental.value) || 0,
            tactical: parseInt(this.elements.reqTactical.value) || 0
        };
    },

    /**
     * Calculate optimal combinations
     */
    calculate() {
        if (this.members.length < 4) {
            this.elements.resultsContainer.innerHTML = `
                <p class="placeholder-text">需要至少 4 名隊員才能計算</p>
            `;
            return;
        }

        const requirements = this.getRequirements();

        if (requirements.physical === 0 && requirements.mental === 0 && requirements.tactical === 0) {
            this.elements.resultsContainer.innerHTML = `
                <p class="placeholder-text">請設定任務需求</p>
            `;
            return;
        }

        const considerJobChange = this.elements.considerJobChange?.checked || false;

        // Show loading
        this.elements.resultsContainer.innerHTML = '<div class="loading"></div>';

        // Calculate in next tick to allow UI update
        const trainingPool = this.getTrainingPool();
        // Get mission level for chemistry conditions
        const missionLevel = this.selectedMissionId ?
            (GameData.getMission(this.selectedMissionId)?.level || 1) : 1;

        setTimeout(() => {
            const results = Calculator.getTopResults(this.members, requirements, 5, {
                considerJobChange: considerJobChange,
                squadRank: this.squadRank,
                trainingPool: trainingPool,
                missionLevel: missionLevel
            });
            this.renderResults(results, requirements, considerJobChange);
        }, 50);
    },

    /**
     * Render calculation results
     */
    renderResults(results, requirements, considerJobChange = false) {
        if (results.length === 0) {
            this.elements.resultsContainer.innerHTML = `
                <p class="placeholder-text">沒有可用的組合</p>
            `;
            return;
        }

        this.elements.resultsContainer.innerHTML = results.map((result, index) => {
            const isBest = index === 0;
            const diff = result.difference;

            let statusBadge;
            if (result.meetsRequirements) {
                statusBadge = '<span class="result-badge success">達成</span>';
            } else if (result.trainingSolution) {
                statusBadge = `<span class="result-badge needs-training">需 ${result.trainingSolution.trainings.length} 次訓練</span>`;
            } else {
                statusBadge = '<span class="result-badge" style="background:rgba(231,76,60,0.2);color:#e74c3c">無法達成</span>';
            }

            // Job change suggestions
            let jobChangeHtml = '';
            if (result.jobChanges && result.jobChanges.length > 0) {
                jobChangeHtml = `
                    <div class="result-job-changes">
                        <h4>建議轉職</h4>
                        ${result.jobChanges.map(jc => {
                            const fromJob = GameData.getJob(jc.from);
                            const toJob = GameData.getJob(jc.to);
                            return `
                                <div class="job-change-item">
                                    <span class="member-name">${this.escapeHtml(jc.name)}</span>
                                    <span class="job-arrow">${fromJob?.name || jc.from} → ${toJob?.name || jc.to}</span>
                                </div>
                            `;
                        }).join('')}
                    </div>
                `;
            }

            // Chemistry info
            const chemistryHtml = result.activeChemistries && result.activeChemistries.length > 0 ? `
                <div class="result-chemistry">
                    <h4>吉兆加成</h4>
                    <div class="chemistry-list">
                        ${result.activeChemistries.map(chem => {
                            const statClass = chem.stat;
                            const scopeLabel = chem.scope === 'team' ? '全員' : '自身';
                            const bonus = Math.floor(chem.member[chem.stat] * chem.percentage / 100);
                            return `
                                <div class="chemistry-item">
                                    <span class="chemistry-member">${this.escapeHtml(chem.member.name)}</span>
                                    <span class="chemistry-condition">${chem.condition.name}</span>
                                    <span class="chemistry-effect ${statClass}">${chem.effect.name}+${chem.percentage}%</span>
                                    <span class="chemistry-scope">(${scopeLabel})</span>
                                </div>
                            `;
                        }).join('')}
                    </div>
                    <div class="chemistry-total">
                        總加成：
                        <span class="physical">體能+${result.chemistryBonuses.physical}</span>
                        <span class="mental">心智+${result.chemistryBonuses.mental}</span>
                        <span class="tactical">戰術+${result.chemistryBonuses.tactical}</span>
                    </div>
                </div>
            ` : '';

            const trainingHtml = result.trainingSolution && result.trainingSolution.trainings.length > 0 ? `
                <div class="result-training">
                    <h4>建議訓練</h4>
                    ${result.trainingSolution.trainings.map((t, i) => {
                        const training = GameData.getTraining(t);
                        return `
                            <div class="training-step">
                                <span class="step-num">${i + 1}</span>
                                <img src="${training.icon}" alt="${training.name}" class="training-icon">
                                <span>${training.name}</span>
                            </div>
                        `;
                    }).join('')}
                </div>
            ` : '';

            return `
                <div class="result-card ${isBest ? 'best' : ''}">
                    <div class="result-header">
                        <h3>${isBest ? '最佳組合' : `組合 #${index + 1}`}</h3>
                        ${statusBadge}
                    </div>
                    <div class="result-members">
                        ${result.members.map(m => {
                            const job = GameData.getJob(m.job);
                            const roleClass = job ? GameData.getRoleClass(job.role) : 'dps';
                            // Check if job changed in this result
                            const suggestedJob = result.jobChanges?.find(jc => jc.memberId === m.id);
                            const displayJob = suggestedJob ? GameData.getJob(suggestedJob.to) : job;
                            // Get recruit info
                            let displayName = m.name;
                            let imgUrl = 'images/recruits/default.png';
                            if (m.recruitId) {
                                const recruit = GameData.getRecruit(m.recruitId);
                                if (recruit) {
                                    displayName = recruit.name;
                                    imgUrl = GameData.getRecruitImageUrl(recruit);
                                }
                            }
                            const jobChangedClass = suggestedJob ? 'job-changed' : '';
                            return `
                                <div class="result-member-card ${jobChangedClass}">
                                    <div class="result-member-avatar ${roleClass}">
                                        <img src="${imgUrl}" alt="${this.escapeHtml(displayName)}" onerror="this.src='images/recruits/default.png'">
                                    </div>
                                    <div class="result-member-info">
                                        <span class="result-member-name">${this.escapeHtml(displayName)}</span>
                                        <span class="result-member-job">${displayJob ? displayJob.name : '?'}</span>
                                    </div>
                                </div>
                            `;
                        }).join('')}
                    </div>
                    <div class="result-stats">
                        <div class="result-stat">
                            <span class="label">體能</span>
                            <span class="value physical">${result.currentStats.physical}</span>
                            <span class="diff ${diff.physical >= 0 ? 'positive' : 'negative'}">
                                (${diff.physical >= 0 ? '+' : ''}${diff.physical})
                            </span>
                        </div>
                        <div class="result-stat">
                            <span class="label">心智</span>
                            <span class="value mental">${result.currentStats.mental}</span>
                            <span class="diff ${diff.mental >= 0 ? 'positive' : 'negative'}">
                                (${diff.mental >= 0 ? '+' : ''}${diff.mental})
                            </span>
                        </div>
                        <div class="result-stat">
                            <span class="label">戰術</span>
                            <span class="value tactical">${result.currentStats.tactical}</span>
                            <span class="diff ${diff.tactical >= 0 ? 'positive' : 'negative'}">
                                (${diff.tactical >= 0 ? '+' : ''}${diff.tactical})
                            </span>
                        </div>
                    </div>
                    ${chemistryHtml}
                    ${jobChangeHtml}
                    ${trainingHtml}
                </div>
            `;
        }).join('');
    },

    /**
     * Open import modal
     */
    openImportModal() {
        this.elements.importExportTitle.textContent = '匯入設定';
        this.elements.importExportData.value = '';
        this.elements.importExportData.placeholder = '貼上 JSON 資料...';
        this.elements.confirmImport.style.display = 'inline-flex';
        this.elements.importExportModal.classList.add('active');
    },

    /**
     * Export data
     */
    exportData() {
        const data = Storage.exportData();

        this.elements.importExportTitle.textContent = '匯出設定';
        this.elements.importExportData.value = data;
        this.elements.confirmImport.style.display = 'none';
        this.elements.importExportModal.classList.add('active');

        // Select all text
        this.elements.importExportData.select();
    },

    /**
     * Confirm import
     */
    confirmImport() {
        const data = this.elements.importExportData.value.trim();

        if (!data) {
            alert('請輸入 JSON 資料');
            return;
        }

        if (Storage.importData(data)) {
            this.loadMembers();
            this.selectedMemberIds = [];
            this.render();
            this.closeModals();
            alert('匯入成功！');
        } else {
            alert('匯入失敗，請檢查資料格式');
        }
    },

    /**
     * Open recruits list modal
     */
    openRecruitsListModal() {
        // Reset filters
        if (this.elements.recruitsRaceFilter) {
            this.elements.recruitsRaceFilter.value = '';
        }
        if (this.elements.recruitsChallengeFilter) {
            this.elements.recruitsChallengeFilter.value = '';
        }

        this.renderRecruitsTable();
        this.elements.recruitsListModal.classList.add('active');
    },

    /**
     * Render recruits table
     */
    renderRecruitsTable() {
        const raceFilter = this.elements.recruitsRaceFilter?.value || '';
        const challengeFilter = this.elements.recruitsChallengeFilter?.value || '';

        let recruits = GameData.getAllRecruits();

        // Apply filters
        if (raceFilter) {
            recruits = recruits.filter(r => r.race === raceFilter);
        }
        if (challengeFilter) {
            recruits = recruits.filter(r => r.challengeLog && r.challengeLog.includes(challengeFilter));
        }

        this.elements.recruitsTableBody.innerHTML = recruits.map(recruit => {
            const job = GameData.getJob(recruit.job);
            const race = GameData.races[recruit.race];
            const imgUrl = GameData.getRecruitImageUrl(recruit);
            const genderIcon = recruit.gender === 'M' ? '♂' : '♀';
            const roleClass = job ? GameData.getRoleClass(job.role) : 'dps';

            return `
                <tr>
                    <td class="recruit-img-cell">
                        <img src="${imgUrl}" alt="${this.escapeHtml(recruit.name)}"
                             class="recruit-table-img" onerror="this.src='images/recruits/default.png'">
                    </td>
                    <td>
                        <div class="recruit-name">${this.escapeHtml(recruit.name)}</div>
                        <div class="recruit-name-en">${this.escapeHtml(recruit.nameEn)}</div>
                    </td>
                    <td>${race ? race.name : recruit.race}</td>
                    <td>${genderIcon}</td>
                    <td><span class="job-badge ${roleClass}">${job ? job.name : recruit.job}</span></td>
                    <td class="challenge-log-cell">${this.escapeHtml(recruit.challengeLog || '-')}</td>
                </tr>
            `;
        }).join('');
    },

    /**
     * Escape HTML to prevent XSS
     */
    escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    },

    // ========================================
    // Training Modal Functions
    // ========================================

    /**
     * Pending training type for confirmation
     */
    pendingTrainingType: null,

    /**
     * Open training modal
     */
    openTrainingModal() {
        // Check if there are members
        if (this.members.length === 0) {
            alert('請先新增隊員');
            return;
        }

        // Get all trainings (excluding comprehensive since it has no stat changes)
        const trainings = GameData.getAllTrainings().filter(t => t.key !== 'comprehensive');

        // Render training grid
        this.elements.trainingGrid.innerHTML = trainings.map(training => `
            <button class="training-btn" data-training="${training.key}" onclick="UI.selectTraining('${training.key}')">
                <img src="${training.icon}" alt="${training.name}" class="training-btn-icon">
                <span class="training-btn-name">${training.name}</span>
                <span class="training-btn-desc">${training.desc}</span>
            </button>
        `).join('');

        this.elements.trainingModal.classList.add('active');
    },

    /**
     * Calculate training result with redistribution logic
     * Training adds to target stats and subtracts equally from other stats
     * @param {Object} currentPool - Current pool values
     * @param {Object} training - Training effect
     * @returns {Object} New pool values after training
     */
    calculateTrainingResult(currentPool, training) {
        const cap = GameData.rankCaps[this.squadRank] || 400;

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

        // Check if current pool is at or over cap - if so, redistribute
        const currentTotal = currentPool.physical + currentPool.mental + currentPool.tactical;
        if (currentTotal >= cap && otherStats.length > 0 && totalIncrease > 0) {
            let remaining = totalIncrease;

            // First pass: try to reduce evenly (in multiples of 20)
            const reducePerStat = Math.floor(totalIncrease / otherStats.length / 20) * 20;

            for (const stat of otherStats) {
                const maxReduce = Math.min(reducePerStat, newPool[stat]);
                newPool[stat] -= maxReduce;
                remaining -= maxReduce;
            }

            // Second pass: handle remainder (in steps of 20)
            while (remaining >= 20) {
                let reduced = false;
                for (const stat of otherStats) {
                    if (newPool[stat] >= 20 && remaining >= 20) {
                        newPool[stat] -= 20;
                        remaining -= 20;
                        reduced = true;
                    }
                }
                if (!reduced) break;
            }
        }

        // Ensure no negative values
        newPool.physical = Math.max(0, newPool.physical);
        newPool.mental = Math.max(0, newPool.mental);
        newPool.tactical = Math.max(0, newPool.tactical);

        // Final check: ensure total doesn't exceed cap (round to multiples of 20)
        const finalTotal = newPool.physical + newPool.mental + newPool.tactical;
        if (finalTotal > cap) {
            const scale = cap / finalTotal;
            newPool.physical = Math.floor(newPool.physical * scale / 20) * 20;
            newPool.mental = Math.floor(newPool.mental * scale / 20) * 20;
            newPool.tactical = Math.floor(newPool.tactical * scale / 20) * 20;
        }

        return newPool;
    },

    /**
     * Select a training and show confirmation
     * @param {string} trainingType - Training type key
     */
    selectTraining(trainingType) {
        this.pendingTrainingType = trainingType;
        const training = GameData.getTraining(trainingType);

        if (!training) return;

        // Close training selection modal
        this.elements.trainingModal.classList.remove('active');

        // Get current training pool values and calculate result
        const currentPool = this.getTrainingPool();
        const newPool = this.calculateTrainingResult(currentPool, training);

        // Calculate actual changes
        const changes = {
            physical: newPool.physical - currentPool.physical,
            mental: newPool.mental - currentPool.mental,
            tactical: newPool.tactical - currentPool.tactical
        };

        // Generate preview content showing pool changes
        const formatChange = (value) => {
            if (value === 0) return '<span class="change-diff">(±0)</span>';
            const cls = value > 0 ? 'positive' : 'negative';
            const sign = value > 0 ? '+' : '';
            return `<span class="change-diff ${cls}">(${sign}${value})</span>`;
        };

        const previewHtml = `
            <div class="training-confirm-preview">
                <div class="training-confirm-icon">
                    <img src="${training.icon}" alt="${training.name}">
                </div>
                <div class="training-confirm-info">
                    <h3>${training.name}</h3>
                    <p>${training.desc}</p>
                </div>
            </div>
            <div class="training-confirm-changes">
                <p>訓練屬性池變化：</p>
                <div class="pool-change-list">
                    <div class="pool-change-item">
                        <span class="stat-icon physical"></span>
                        <span>體能：${currentPool.physical} → ${newPool.physical}</span>
                        ${formatChange(changes.physical)}
                    </div>
                    <div class="pool-change-item">
                        <span class="stat-icon mental"></span>
                        <span>心智：${currentPool.mental} → ${newPool.mental}</span>
                        ${formatChange(changes.mental)}
                    </div>
                    <div class="pool-change-item">
                        <span class="stat-icon tactical"></span>
                        <span>戰術：${currentPool.tactical} → ${newPool.tactical}</span>
                        ${formatChange(changes.tactical)}
                    </div>
                </div>
            </div>
        `;

        this.elements.trainingConfirmContent.innerHTML = previewHtml;
        this.elements.trainingConfirmModal.classList.add('active');
    },

    /**
     * Apply the pending training to the training pool
     */
    applyTraining() {
        if (!this.pendingTrainingType) return;

        const training = GameData.getTraining(this.pendingTrainingType);
        if (!training) return;

        // Get current pool and calculate result
        const currentPool = this.getTrainingPool();
        const newPool = this.calculateTrainingResult(currentPool, training);

        // Apply to inputs
        if (this.elements.poolPhysical) {
            this.elements.poolPhysical.value = newPool.physical;
        }
        if (this.elements.poolMental) {
            this.elements.poolMental.value = newPool.mental;
        }
        if (this.elements.poolTactical) {
            this.elements.poolTactical.value = newPool.tactical;
        }

        // Update display and save
        this.updateTrainingPoolTotal();

        // Close modal and reset state
        this.elements.trainingConfirmModal.classList.remove('active');
        this.pendingTrainingType = null;

        // Show success message
        alert(`已套用「${training.name}」訓練！`);
    }
};

// Export for module use
if (typeof module !== 'undefined' && module.exports) {
    module.exports = UI;
}
