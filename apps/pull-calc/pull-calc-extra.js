(function() {
    'use strict';

    class ExtraIncomeManager {
        constructor(options) {
            this.rootEl = options && options.rootEl ? options.rootEl : null;
            this.onChange = options && typeof options.onChange === 'function' ? options.onChange : null;
            this.baseUrl = (options && options.baseUrl != null) ? options.baseUrl : (typeof window.BASE_URL !== 'undefined' ? window.BASE_URL : '');
            this.storageKey = (options && options.storageKey) ? options.storageKey : 'pullCalc_extraIncome';
            this.t = (options && typeof options.t === 'function') ? options.t : (k => k);

            this.rows = [];
            this.load();
            this.render();
        }

        load() {
            try {
                const raw = localStorage.getItem(this.storageKey);
                if (!raw) {
                    // Default rows when nothing exists: 1 weekly + 1 monthly
                    this.rows = [
                        { frequency: 'weekly', ticket: 0, weaponTicket: 0, ember: 0 },
                        { frequency: 'monthly', ticket: 0, weaponTicket: 0, ember: 0 }
                    ];
                    return;
                }
                const parsed = JSON.parse(raw);
                if (!Array.isArray(parsed)) {
                    this.rows = [
                        { frequency: 'weekly', ticket: 0, weaponTicket: 0, ember: 0 },
                        { frequency: 'monthly', ticket: 0, weaponTicket: 0, ember: 0 }
                    ];
                    return;
                }
                this.rows = parsed
                    .map(r => ({
                        frequency: (r && r.frequency) ? String(r.frequency) : 'weekly',
                        ticket: Number.isFinite(Number(r && r.ticket)) ? Number(r.ticket) : 0,
                        weaponTicket: Number.isFinite(Number(r && r.weaponTicket)) ? Number(r.weaponTicket) : 0,
                        ember: Number.isFinite(Number(r && r.ember)) ? Number(r.ember) : 0
                    }))
                    .filter(r => ['daily', 'weekly', 'monthly', 'version', 'once'].includes(r.frequency));

                if (this.rows.length === 0) {
                    this.rows = [
                        { frequency: 'weekly', ticket: 0, weaponTicket: 0, ember: 0 },
                        { frequency: 'monthly', ticket: 0, weaponTicket: 0, ember: 0 }
                    ];
                }
            } catch (e) {
                this.rows = [
                    { frequency: 'weekly', ticket: 0, weaponTicket: 0, ember: 0 },
                    { frequency: 'monthly', ticket: 0, weaponTicket: 0, ember: 0 }
                ];
            }
        }

        save() {
            try {
                localStorage.setItem(this.storageKey, JSON.stringify(this.rows));
            } catch (e) {
            }
        }

        notifyChange() {
            this.save();
            if (this.onChange) {
                this.onChange();
            }
        }

        addRow() {
            this.rows.push({ frequency: 'weekly', ticket: 0, weaponTicket: 0, ember: 0 });
            this.render();
            this.notifyChange();
        }

        deleteRow(index) {
            if (index < 0 || index >= this.rows.length) return;
            this.rows.splice(index, 1);
            this.render();
            this.notifyChange();
        }

        updateRow(index, patch) {
            if (index < 0 || index >= this.rows.length) return;
            this.rows[index] = { ...this.rows[index], ...patch };
            this.notifyChange();
        }

        getRows() {
            return this.rows.map(r => ({ ...r }));
        }

        normalizeDate(d) {
            const nd = new Date(d);
            nd.setHours(0, 0, 0, 0);
            return nd;
        }

        parseDate(input) {
            if (!input) return null;
            if (input instanceof Date) return this.normalizeDate(input);
            const d = new Date(String(input));
            if (!Number.isFinite(d.getTime())) return null;
            return this.normalizeDate(d);
        }

        diffDaysExclusive(startDate, endDate) {
            const start = this.parseDate(startDate);
            const end = this.parseDate(endDate);
            if (!start || !end) return 0;
            const ms = end.getTime() - start.getTime();
            const days = Math.round(ms / (1000 * 60 * 60 * 24));
            return Math.max(0, days);
        }

        countMondays(startDate, endDate) {
            const start = this.parseDate(startDate);
            const end = this.parseDate(endDate);
            if (!start || !end || end <= start) return 0;

            let count = 0;
            const cur = new Date(start);
            while (cur < end) {
                if (cur.getDay() === 1) count++;
                cur.setDate(cur.getDate() + 1);
            }
            return count;
        }

        countMonthFirstDays(startDate, endDate) {
            const start = this.parseDate(startDate);
            const end = this.parseDate(endDate);
            if (!start || !end || end <= start) return 0;

            let count = 0;
            const cur = new Date(start);
            while (cur < end) {
                if (cur.getDate() === 1) count++;
                cur.setDate(cur.getDate() + 1);
            }
            return count;
        }

        calculateIntervalIncome(arg1, arg2, arg3) {
            // Backward-compatible overload:
            // - old: (daysDiff:number, isNewVersion:boolean)
            // - new: (startDate:string|Date, endDate:string|Date, opts:{isNewVersion:boolean,isOnceTarget:boolean})
            let startDate = null;
            let endDate = null;
            let opts = {};

            if (typeof arg1 === 'number') {
                const safeDays = Math.max(0, Number(arg1) || 0);
                startDate = new Date();
                endDate = new Date();
                endDate.setDate(endDate.getDate() + safeDays);
                opts = { isNewVersion: !!arg2, isOnceTarget: false };
            } else {
                startDate = arg1;
                endDate = arg2;
                opts = arg3 && typeof arg3 === 'object' ? arg3 : {};
            }

            const dayCount = this.diffDaysExclusive(startDate, endDate);
            const mondayCount = this.countMondays(startDate, endDate);
            const monthFirstCount = this.countMonthFirstDays(startDate, endDate);
            const isNewVersion = !!opts.isNewVersion;
            const isOnceTarget = !!opts.isOnceTarget;

            let ticket = 0;
            let weaponTicket = 0;
            let ember = 0;

            this.rows.forEach(r => {
                const t = Number(r.ticket) || 0;
                const w = Number(r.weaponTicket) || 0;
                const e = Number(r.ember) || 0;

                if (r.frequency === 'daily') {
                    ticket += t * dayCount;
                    weaponTicket += w * dayCount;
                    ember += e * dayCount;
                    return;
                }

                if (r.frequency === 'weekly') {
                    ticket += t * mondayCount;
                    weaponTicket += w * mondayCount;
                    ember += e * mondayCount;
                    return;
                }

                if (r.frequency === 'monthly') {
                    ticket += t * monthFirstCount;
                    weaponTicket += w * monthFirstCount;
                    ember += e * monthFirstCount;
                    return;
                }

                if (r.frequency === 'version') {
                    if (isNewVersion) {
                        ticket += t;
                        weaponTicket += w;
                        ember += e;
                    }
                    return;
                }

                if (r.frequency === 'once') {
                    if (isOnceTarget) {
                        ticket += t;
                        weaponTicket += w;
                        ember += e;
                    }
                }
            });

            return { ticket, weaponTicket, ember };
        }

        createIconInput(iconPath, value, onInput) {
            const wrap = document.createElement('div');
            wrap.className = 'extra-income-resource';

            const img = document.createElement('img');
            img.src = iconPath;
            img.alt = '';
            img.className = 'extra-income-icon';

            const input = document.createElement('input');
            input.type = 'number';
            input.min = '0';
            input.value = String(value || 0);
            input.addEventListener('input', () => {
                const v = parseInt(input.value, 10);
                onInput(Number.isFinite(v) ? v : 0);
            });
            input.addEventListener('change', () => {
                const v = parseInt(input.value, 10);
                onInput(Number.isFinite(v) ? v : 0);
            });

            wrap.appendChild(img);
            wrap.appendChild(input);

            return wrap;
        }

        render() {
            if (!this.rootEl) {
                this.rootEl = document.getElementById('extraIncomeRoot');
            }
            if (!this.rootEl) return;

            this.rootEl.innerHTML = '';

            const rowsEl = document.createElement('div');
            rowsEl.className = 'extra-income-rows';

            const icons = {
                ticket: `${this.baseUrl}/assets/img/pay/정해진 운명.png`,
                weaponTicket: `${this.baseUrl}/assets/img/pay/정해진 코인.png`,
                ember: `${this.baseUrl}/assets/img/pay/이계 엠버.png`
            };

            this.rows.forEach((row, idx) => {
                const rowEl = document.createElement('div');
                rowEl.className = 'extra-income-row';

                const freqSelect = document.createElement('select');
                freqSelect.className = 'extra-income-frequency';

                const freqOptions = [
                    { value: 'daily', label: this.t('freqDaily') },
                    { value: 'weekly', label: this.t('freqWeekly') },
                    { value: 'monthly', label: this.t('freqMonthly') },
                    { value: 'version', label: this.t('freqVersion') },
                    { value: 'once', label: this.t('freqOnce') }
                ];

                freqOptions.forEach(opt => {
                    const o = document.createElement('option');
                    o.value = opt.value;
                    o.textContent = opt.label;
                    if (row.frequency === opt.value) o.selected = true;
                    freqSelect.appendChild(o);
                });

                freqSelect.addEventListener('change', () => {
                    this.updateRow(idx, { frequency: freqSelect.value });
                });

                const resourcesEl = document.createElement('div');
                resourcesEl.className = 'extra-income-resources';

                resourcesEl.appendChild(this.createIconInput(icons.ember, row.ember, (v) => this.updateRow(idx, { ember: v })));
                resourcesEl.appendChild(this.createIconInput(icons.ticket, row.ticket, (v) => this.updateRow(idx, { ticket: v })));
                resourcesEl.appendChild(this.createIconInput(icons.weaponTicket, row.weaponTicket, (v) => this.updateRow(idx, { weaponTicket: v })));

                const delBtn = document.createElement('button');
                delBtn.type = 'button';
                delBtn.className = 'extra-income-delete';
                delBtn.textContent = '×';
                delBtn.addEventListener('click', () => this.deleteRow(idx));

                rowEl.appendChild(freqSelect);
                rowEl.appendChild(resourcesEl);
                rowEl.appendChild(delBtn);

                rowsEl.appendChild(rowEl);
            });

            this.rootEl.appendChild(rowsEl);
        }
    }

    window.ExtraIncomeManager = ExtraIncomeManager;
})();
