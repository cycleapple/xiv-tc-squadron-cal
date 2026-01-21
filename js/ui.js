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
    selectedTrainingType: null,

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

        // Add trainee missions - 簡單任務
        const traineeGroup = document.createElement('optgroup');
        traineeGroup.label = '簡單任務 (Lv1-20)';
        GameData.missions.trainee.forEach(m => {
            const opt = document.createElement('option');
            opt.value = `${m.physical},${m.mental},${m.tactical}`;
            opt.textContent = `${m.name} (${m.physical}/${m.mental}/${m.tactical})${m.flagged ? ' ★' : ''}`;
            traineeGroup.appendChild(opt);
        });
        select.appendChild(traineeGroup);

        // Add routine missions - 普通任務
        const routineGroup = document.createElement('optgroup');
        routineGroup.label = '普通任務 (Lv20-40)';
        GameData.missions.routine.forEach(m => {
            const opt = document.createElement('option');
            opt.value = `${m.physical},${m.mental},${m.tactical}`;
            opt.textContent = `${m.name} (${m.physical}/${m.mental}/${m.tactical})${m.flagged ? ' ★' : ''}`;
            routineGroup.appendChild(opt);
        });
        select.appendChild(routineGroup);

        // Add priority missions - 特殊任務
        const priorityGroup = document.createElement('optgroup');
        priorityGroup.label = '特殊任務 (Lv40-50)';
        GameData.missions.priority.forEach(m => {
            const opt = document.createElement('option');
            opt.value = `${m.physical},${m.mental},${m.tactical}`;
            opt.textContent = `${m.name} (${m.physical}/${m.mental}/${m.tactical})`;
            priorityGroup.appendChild(opt);
        });
        select.appendChild(priorityGroup);
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
                         onerror="this.src='https://xivapi.com/i/061000/061812.png'">
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
                this.src = 'https://xivapi.com/i/061000/061812.png';
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

            // Training panel
            toggleTraining: document.getElementById('toggleTraining'),
            trainingContent: document.getElementById('trainingContent'),
            trainingPreview: document.getElementById('trainingPreview'),
            applyTraining: document.getElementById('applyTraining')
        };
    },

    /**
     * Bind event listeners
     */
    bindEvents() {
        // Add member button
        this.elements.addMemberBtn.addEventListener('click', () => this.openMemberModal());

        // Calculate button
        this.elements.calculateBtn.addEventListener('click', () => this.calculate());

        // Import/Export buttons
        this.elements.importBtn.addEventListener('click', () => this.openImportModal());
        this.elements.exportBtn.addEventListener('click', () => this.exportData());

        // Squad rank change
        if (this.elements.squadRank) {
            this.elements.squadRank.addEventListener('change', (e) => this.onSquadRankChange(e.target.value));
        }

        // Preset missions
        this.elements.presetMissions.addEventListener('change', (e) => this.loadPresetMission(e.target.value));

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
                // Optionally auto-fill stats when job changes (only if adding new member)
                if (!this.editingMemberId) {
                    this.autoFillBaseStats();
                }
            });
        }

        // Modal close buttons
        document.querySelectorAll('.modal-close, .modal-cancel').forEach(btn => {
            btn.addEventListener('click', () => this.closeModals());
        });

        // Import confirm
        this.elements.confirmImport.addEventListener('click', () => this.confirmImport());

        // Training panel toggle
        this.elements.toggleTraining.addEventListener('click', () => this.toggleTrainingPanel());

        // Training type buttons
        document.querySelectorAll('.training-type-btn').forEach(btn => {
            btn.addEventListener('click', (e) => this.selectTrainingType(e.target.dataset.type));
        });

        // Apply training button
        this.elements.applyTraining.addEventListener('click', () => this.applyTraining());

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
        Storage.saveSettings({ squadRank: this.squadRank });
    },

    /**
     * Handle squad rank change
     */
    onSquadRankChange(value) {
        this.squadRank = parseInt(value) || 3;
        this.saveSettings();
        // Note: We don't auto-recalculate stats because users input their actual stats
        // The rank is saved for reference when using "填入基礎值" button
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

            // Get recruit name if available
            let displayName = member.name;
            if (member.recruitId) {
                const recruit = GameData.getRecruit(member.recruitId);
                if (recruit) {
                    displayName = recruit.name;
                }
            }

            // Check if job was changed from original
            const hasJobChanged = member.originalJob && member.originalJob !== member.job;
            const jobChangedIndicator = hasJobChanged ? '<span class="job-changed-indicator" title="已轉職">*</span>' : '';

            return `
                <div class="member-card ${isSelected ? 'selected' : ''}" data-id="${member.id}">
                    <div class="job-icon ${roleClass}">${job ? job.abbr : '?'}</div>
                    <div class="member-info">
                        <div class="name">${this.escapeHtml(displayName)}</div>
                        <div class="job-level">${job ? job.name : '未知'}${jobChangedIndicator} Lv.${member.level}</div>
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
        this.updateTrainingPreview();
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

        const memberData = {
            recruitId: recruitId,
            name: recruit.name,
            originalJob: recruit.job,  // Keep track of original job
            job: selectedJob,          // Current job (may be different if changed)
            race: recruit.race,
            level: level,
            physical: physical,
            mental: mental,
            tactical: tactical
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
        setTimeout(() => {
            const results = Calculator.getTopResults(this.members, requirements, 5, {
                considerJobChange: considerJobChange,
                squadRank: this.squadRank
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

            const trainingHtml = result.trainingSolution && result.trainingSolution.trainings.length > 0 ? `
                <div class="result-training">
                    <h4>建議訓練</h4>
                    ${result.trainingSolution.trainings.map((t, i) => {
                        const training = GameData.getTraining(t);
                        return `
                            <div class="training-step">
                                <span class="step-num">${i + 1}</span>
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
                            // Check if job changed in this result
                            const suggestedJob = result.jobChanges?.find(jc => jc.memberId === m.id);
                            const displayJob = suggestedJob ? GameData.getJob(suggestedJob.to) : job;
                            // Get recruit name if available
                            let displayName = m.name;
                            if (m.recruitId) {
                                const recruit = GameData.getRecruit(m.recruitId);
                                if (recruit) {
                                    displayName = recruit.name;
                                }
                            }
                            const jobChangedClass = suggestedJob ? 'job-changed' : '';
                            return `<span class="result-member ${jobChangedClass}">${this.escapeHtml(displayName)} (${displayJob ? displayJob.name : '?'})</span>`;
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
                    ${jobChangeHtml}
                    ${trainingHtml}
                </div>
            `;
        }).join('');
    },

    /**
     * Toggle training panel
     */
    toggleTrainingPanel() {
        const content = this.elements.trainingContent;
        const isExpanded = content.classList.contains('expanded');

        if (isExpanded) {
            content.classList.remove('expanded');
            this.elements.toggleTraining.textContent = '▼';
        } else {
            content.classList.add('expanded');
            this.elements.toggleTraining.textContent = '▲';
        }
    },

    /**
     * Select training type
     */
    selectTrainingType(type) {
        // Update button states
        document.querySelectorAll('.training-type-btn').forEach(btn => {
            btn.classList.toggle('selected', btn.dataset.type === type);
        });

        this.selectedTrainingType = type;
        Training.setTrainingType(type);
        this.updateTrainingPreview();
    },

    /**
     * Update training preview
     */
    updateTrainingPreview() {
        const type = Training.getTrainingType();
        const selectedMembers = this.members.filter(m => this.selectedMemberIds.includes(m.id));

        Training.setSelectedMembers(selectedMembers);

        if (!type || selectedMembers.length === 0) {
            this.elements.trainingPreview.innerHTML = `
                <p class="placeholder-text">
                    ${!type ? '選擇訓練類型' : '選擇要訓練的隊員'}
                </p>
            `;
            this.elements.applyTraining.disabled = true;
            return;
        }

        const preview = Training.previewTraining(type);
        if (!preview) {
            this.elements.applyTraining.disabled = true;
            return;
        }

        const formatChange = (val) => {
            const sign = val > 0 ? '+' : '';
            const className = val > 0 ? 'positive' : val < 0 ? 'negative' : '';
            return `<span class="change ${className}">${sign}${val}</span>`;
        };

        this.elements.trainingPreview.innerHTML = `
            <div class="preview-stats">
                <div class="preview-stat">
                    <span class="label">體能</span>
                    ${formatChange(preview.effect.physical)}
                </div>
                <div class="preview-stat">
                    <span class="label">心智</span>
                    ${formatChange(preview.effect.mental)}
                </div>
                <div class="preview-stat">
                    <span class="label">戰術</span>
                    ${formatChange(preview.effect.tactical)}
                </div>
            </div>
            <p style="margin-top:10px;font-size:0.8rem;color:var(--text-muted)">
                訓練會影響全體 8 名隊員
            </p>
        `;

        this.elements.applyTraining.disabled = false;
    },

    /**
     * Apply training to selected members
     */
    applyTraining() {
        const type = Training.getTrainingType();
        const selectedMembers = this.members.filter(m => this.selectedMemberIds.includes(m.id));

        if (!type || selectedMembers.length === 0) return;

        if (!confirm(`確定要對 ${selectedMembers.length} 名隊員進行「${GameData.getTraining(type).name}」訓練？`)) {
            return;
        }

        Training.applyTraining(type, selectedMembers);

        // Reload members from storage to get updated values
        this.loadMembers();
        this.render();
        this.updateTrainingPreview();
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
     * Escape HTML to prevent XSS
     */
    escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }
};

// Export for module use
if (typeof module !== 'undefined' && module.exports) {
    module.exports = UI;
}
