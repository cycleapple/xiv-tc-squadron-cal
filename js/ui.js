/**
 * FFXIV Squadron Calculator - UI Module
 * Handles all DOM interactions and rendering
 */

const UI = {
    // Current state
    members: [],
    selectedMemberIds: [],
    editingMemberId: null,

    // DOM element references
    elements: {},

    /**
     * Initialize UI
     */
    init() {
        this.cacheElements();
        this.bindEvents();
        this.loadMembers();
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

            // Mission requirements
            reqPhysical: document.getElementById('reqPhysical'),
            reqMental: document.getElementById('reqMental'),
            reqTactical: document.getElementById('reqTactical'),
            presetMissions: document.getElementById('presetMissions'),

            // Member modal
            memberModal: document.getElementById('memberModal'),
            modalTitle: document.getElementById('modalTitle'),
            memberForm: document.getElementById('memberForm'),
            memberName: document.getElementById('memberName'),
            memberJob: document.getElementById('memberJob'),
            memberLevel: document.getElementById('memberLevel'),
            memberRace: document.getElementById('memberRace'),
            memberPhysical: document.getElementById('memberPhysical'),
            memberMental: document.getElementById('memberMental'),
            memberTactical: document.getElementById('memberTactical'),
            autoFillStats: document.getElementById('autoFillStats'),

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

        // Preset missions
        this.elements.presetMissions.addEventListener('change', (e) => this.loadPresetMission(e.target.value));

        // Member form
        this.elements.memberForm.addEventListener('submit', (e) => this.saveMember(e));

        // Auto fill stats
        this.elements.autoFillStats.addEventListener('click', () => this.autoFillJobStats());

        // Job change updates auto fill hint
        this.elements.memberJob.addEventListener('change', () => this.updateAutoFillHint());

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
     * Save members to storage
     */
    saveMembers() {
        Storage.saveMembers(this.members);
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

            return `
                <div class="member-card ${isSelected ? 'selected' : ''}" data-id="${member.id}">
                    <div class="job-icon ${roleClass}">${job ? job.abbr : '?'}</div>
                    <div class="member-info">
                        <div class="name">${this.escapeHtml(member.name)}</div>
                        <div class="job-level">${job ? job.name : '未知'} Lv.${member.level}</div>
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

        if (memberId) {
            // Edit mode
            const member = this.members.find(m => m.id === memberId);
            if (!member) return;

            this.elements.modalTitle.textContent = '編輯隊員';
            this.elements.memberName.value = member.name;
            this.elements.memberJob.value = member.job;
            this.elements.memberLevel.value = member.level;
            this.elements.memberRace.value = member.race;
            this.elements.memberPhysical.value = member.physical;
            this.elements.memberMental.value = member.mental;
            this.elements.memberTactical.value = member.tactical;
        } else {
            // Add mode
            this.elements.modalTitle.textContent = '新增隊員';
            this.elements.memberForm.reset();
            this.elements.memberLevel.value = 60;
        }

        this.elements.memberModal.classList.add('active');
        this.elements.memberName.focus();
    },

    /**
     * Save member from form
     */
    saveMember(e) {
        e.preventDefault();

        const memberData = {
            name: this.elements.memberName.value.trim(),
            job: this.elements.memberJob.value,
            level: parseInt(this.elements.memberLevel.value) || 60,
            race: this.elements.memberRace.value,
            physical: parseInt(this.elements.memberPhysical.value) || 0,
            mental: parseInt(this.elements.memberMental.value) || 0,
            tactical: parseInt(this.elements.memberTactical.value) || 0
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
     * Auto fill job stats based on selected job and level
     */
    autoFillJobStats() {
        const job = this.elements.memberJob.value;
        const level = parseInt(this.elements.memberLevel.value) || 60;

        if (!job) {
            alert('請先選擇職業');
            return;
        }

        const stats = GameData.calculateStatsForLevel(job, level);
        if (stats) {
            this.elements.memberPhysical.value = stats.physical;
            this.elements.memberMental.value = stats.mental;
            this.elements.memberTactical.value = stats.tactical;
        }
    },

    /**
     * Update auto fill hint when job changes
     */
    updateAutoFillHint() {
        const job = this.elements.memberJob.value;
        if (job) {
            const stats = GameData.calculateStatsForLevel(job, 60);
            this.elements.autoFillStats.textContent =
                `自動填入 Lv60 預設值 (${stats.physical}/${stats.mental}/${stats.tactical})`;
        } else {
            this.elements.autoFillStats.textContent = '自動填入 Lv60 預設值';
        }
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

        // Show loading
        this.elements.resultsContainer.innerHTML = '<div class="loading"></div>';

        // Calculate in next tick to allow UI update
        setTimeout(() => {
            const results = Calculator.getTopResults(this.members, requirements, 5);
            this.renderResults(results, requirements);
        }, 50);
    },

    /**
     * Render calculation results
     */
    renderResults(results, requirements) {
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
                            return `<span class="result-member">${this.escapeHtml(m.name)} (${job ? job.name : '?'})</span>`;
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
