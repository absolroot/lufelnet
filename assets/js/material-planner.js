/* eslint-disable */
(function(){
    const LANG = (typeof getCurrentLanguage === 'function') ? getCurrentLanguage() : 'kr';
    const STATE = {
        plans: [], // {id, name, rarity, image, inputs:{...}, materials:{id,count}}
        totals: {},
        lang: LANG,
        spoiler: false,
        characterData: null,
        characterList: null,
        // 정렬 키 (localStorage로 유지). release/name + asc/desc
        sortKey: 'release_desc',
        inventory: { // 사용자 보유 수량
            lv_exp1: 0, lv_exp2: 0, lv_exp3: 0,
            lv_limit1: 0, lv_limit2: 0, lv_limit3: 0,
            wp_exp1: 0, wp_exp2: 0, wp_exp3: 0,
            wp_limit1: 0, wp_limit2: 0, wp_limit3: 0,
            skill_lv_1: 0, skill_lv_2: 0, skill_lv_3: 0, skill_rose: 0,
            skill_item1: 0, skill_item2: 0, skill_item3: 0, skill_item4: 0, skill_item5: 0
        }
    };

    // 레벨 돌파 요구량은 material_costs.js 의 level 섹션을 사용합니다.

    // 이미지 매핑 (요약 카드용) — 페이지 가이드에서 사용하는 키 기본값
    const MATERIAL_ICONS = {
        money: '/apps/article/asset/growth_material/item-1.png',
        // EXP items (custom icons provided by user)
        lv_exp1: '/apps/material-calc/img/cha_lv_1.png', // +200
        lv_exp2: '/apps/material-calc/img/cha_lv_2.png', // +1000
        lv_exp3: '/apps/material-calc/img/cha_lv_3.png', // +4000
        // Future: level limit items (icons reserved)
        lv_limit1: '/apps/material-calc/img/cha_lv_limit_1.png',
        lv_limit2: '/apps/material-calc/img/cha_lv_limit_2.png',
        lv_limit3: '/apps/material-calc/img/cha_lv_limit_3.png',
        // Weapon EXP & limit
        wp_exp1: '/apps/material-calc/img/weapon_lv_1.png',
        wp_exp2: '/apps/material-calc/img/weapon_lv_2.png',
        wp_exp3: '/apps/material-calc/img/weapon_lv_3.png',
        wp_limit1: '/apps/material-calc/img/weapon_lv_limit_1.png',
        wp_limit2: '/apps/material-calc/img/weapon_lv_limit_2.png',
        wp_limit3: '/apps/material-calc/img/weapon_lv_limit_3.png',
        md_mercury: '/apps/material-calc/img/mind_base.png',
        md_stat1: '/apps/material-calc/img/mind_stat1.png',
        md_stat2: '/apps/material-calc/img/mind_stat2.png',
        md_skill1: '/apps/material-calc/img/mind_skill1.png',
        md_skill2: '/apps/material-calc/img/mind_skill2.png',
        md_bell: '/apps/material-calc/img/mind_lv.png',
        konpaku_gem: '/apps/material-calc/img/konpaku_gem.png',
        // skills icons
        skill_lv_1: '/apps/material-calc/img/skill_lv_1.png',
        skill_lv_2: '/apps/material-calc/img/skill_lv_2.png',
        skill_lv_3: '/apps/material-calc/img/skill_lv_3.png',
        skill_rose: '/apps/material-calc/img/skill_rose.png',
        skill_item1: '/apps/material-calc/img/skill_item1.png',
        skill_item2: '/apps/material-calc/img/skill_item2.png',
        skill_item3: '/apps/material-calc/img/skill_item3.png',
        skill_item4: '/apps/material-calc/img/skill_item4.png',
        skill_item5: '/apps/material-calc/img/skill_item5.png'
    };

    // 다국어 텍스트
    const I18N = {
        kr: {
            pageTitle: '육성 계산기', addCharacter: '캐릭터 추가', selectCharacter: '캐릭터 선택',
            materialSummary: '재료 합산', showSpoiler: '스포일러 포함 (KR 전체 목록 사용)',
            level: '레벨', current: '괴도', current2: '현재', target: '목표', weapon: '무기', skills: '스킬',
            mind: '심상', enableAll: '12개 전체 활성화', mindBase: '심상', mindStat1: '심상 스탯 1', mindStat2: '심상 스탯 2',
            mindSkill1: '심상 스킬 1', mindSkill2: '심상 스킬 2', mindAttr: '속성 강화', cancel: '취소', save: '저장',
            remove: '삭제', details: '상세', home: '홈', viewDetails: '상세', edit: '수정',
            confirm: '확인', deleteConfirmTitle: '삭제 확인', deleteConfirmMessage: '이 캐릭터의 플랜을 삭제합니다. 이 작업은 되돌릴 수 없습니다. 계속하시겠습니까?',
            helpText: '개인 브라우저에 저장되며 인터넷 기록을 모두 삭제할 경우 데이터는 삭제됩니다.\nP5X는 계정 정보 연동을 지원하지 않습니다. 보유 중인 재료는 수동으로 입력해주세요.',
            reset: '초기화', resetConfirmTitle: '초기화 확인', resetConfirmMessage: '모든 플랜을 초기화합니다. 이 작업은 되돌릴 수 없습니다. 계속하시겠습니까?',
            // filter / sort UI
            filter: '필터', sort: '정렬',
            'sort.releaseAsc': '출시 순 ↑', 'sort.releaseDesc': '출시 순 ↓',
            'sort.nameAsc': '이름 순 ↑', 'sort.nameDesc': '이름 순 ↓',
            'filterGroup.element': '속성', 'filterGroup.position': '직업', 'filterGroup.rarity': '등급',
            includeInSummary: '합산 포함'
        },
        en: {
            pageTitle: 'Progression Calculator', addCharacter: 'Add Character', selectCharacter: 'Select Character',
            materialSummary: 'Material Summary', showSpoiler: 'Show spoiler (use KR full list)',
            level: 'Level', current: 'Character', current2: 'Current', target: 'Target', weapon: 'Weapon', skills: 'Skills',
            mind: 'Mindscape', enableAll: 'Enable all 12', mindBase: 'Mind Base', mindStat1: 'Mind Stat 1', mindStat2: 'Mind Stat 2',
            mindSkill1: 'Mind Skill 1', mindSkill2: 'Mind Skill 2', mindAttr: 'Mind Attribute', cancel: 'Cancel', save: 'Save',
            remove: 'Remove', details: 'Details', home: 'Home', viewDetails: 'View Details', edit: 'Edit',
            confirm: 'Confirm', deleteConfirmTitle: 'Delete Plan', deleteConfirmMessage: 'This character plan will be deleted. This action cannot be undone. Continue?',
            helpText: 'Data is saved in your browser and will be deleted if you clear your browser data.\nP5X does not support account information linking. Please enter your owned materials manually.',
            reset: 'Reset', resetConfirmTitle: 'Reset Confirm', resetConfirmMessage: 'All plans will be reset. This action cannot be undone. Continue?',
            // filter / sort UI
            filter: 'Filter', sort: 'Sort',
            'sort.releaseAsc': 'Release ↑', 'sort.releaseDesc': 'Release ↓',
            'sort.nameAsc': 'Name ↑', 'sort.nameDesc': 'Name ↓',
            'filterGroup.element': 'Element', 'filterGroup.position': 'Role', 'filterGroup.rarity': 'Rarity',
            includeInSummary: 'Include in Material Summary'
        },
        jp: {
            pageTitle: '育成計算機', addCharacter: 'キャラ追加', selectCharacter: 'キャラを選択',
            materialSummary: '素材サマリー', showSpoiler: 'ネタバレ含む（KR全リスト）',
            level: 'レベル', current: '怪盗', current2: '現在', target: '目標', weapon: '武器', skills: 'スキル',
            mind: 'イメジャリー', enableAll: '12個 全て有効', mindBase: 'イメジャリー 基本', mindStat1: 'ステ1', mindStat2: 'ステ2',
            mindSkill1: 'スキル1', mindSkill2: 'スキル2', mindAttr: '属性強化', cancel: 'キャンセル', save: '保存',
            remove: '削除', details: '詳細', home: 'ホーム', viewDetails: '詳細', edit: '編集',
            confirm: '確認', deleteConfirmTitle: '削除の確認', deleteConfirmMessage: 'このキャラクターのプランを削除します。元に戻すことはできません。続行しますか?',
            helpText: 'データはブラウザに保存され、ブラウザの履歴をクリアすると削除されます。\nP5Xはアカウント情報の連携に対応していません。所持している素材は手動で入力してください。',
            reset: 'リセット', resetConfirmTitle: 'リセットの確認', resetConfirmMessage: 'すべてのプランをリセットします。この操作は元に戻すことができません。続行しますか?',
            // filter / sort UI
            filter: 'フィルター', sort: 'ソート',
            'sort.releaseAsc': '実装順 ↑', 'sort.releaseDesc': '実装順 ↓',
            'sort.nameAsc': '名前 ↑', 'sort.nameDesc': '名前 ↓',
            'filterGroup.element': '属性', 'filterGroup.position': '役割', 'filterGroup.rarity': 'レアリティ',
            includeInSummary: 'サマリーに含める'
        }
    };

    function t(key){
        const pack = I18N[STATE.lang] || I18N.kr;
        return pack[key] || key;
    }
    
    // help text 콘텐츠 다국어로 바꾸기
    function updateHelpText(){
        const helpText = document.querySelector('.help-text');
        if(helpText){
            // \n이 있을 경우 줄바꿈
            helpText.innerHTML = t('helpText').replace(/\n/g, '<br>');
        }
    }

    // 데이터 로드 (언어별 목록 + 스포일러 처리)
    async function loadCharacterData(){
        const lang = STATE.lang;
        const useKrFull = (lang !== 'kr' && STATE.spoiler);
        const listPath = useKrFull ? '/data/kr/characters/characters.js' : `/data/${lang}/characters/characters.js`;
        const [res, krRes] = await Promise.all([
            fetch(`${BASE_URL}${listPath}?v=${APP_VERSION}`).then(r=>r.text()),
            fetch(`${BASE_URL}/data/kr/characters/characters.js?v=${APP_VERSION}`).then(r=>r.text()).catch(()=>''),
        ]);
        const tmp = {};
        new Function('out', `${res}; out.characterList = (typeof characterList!=='undefined')?characterList:[]; out.characterData = typeof characterData!=='undefined'?characterData:{};`)(tmp);
        const krBox = {};
        if(krRes) new Function('out', `${krRes}; out.characterList = (typeof characterList!=='undefined')?characterList:[]; out.characterData = typeof characterData!=='undefined'?characterData:{};`)(krBox);
        STATE.characterList = tmp.characterList || [];
        // 캐릭터 메타 병합: 키별로 KR 메타가 우선(특히 name_en/name_jp), 언어별 메타의 필드가 있으면 보조로 유지
        const merged = { ...(tmp.characterData||{}) };
        const krMap = krBox.characterData || {};
        for(const k in krMap){
            if(!Object.prototype.hasOwnProperty.call(merged, k)) merged[k] = {};
            merged[k] = { ...(merged[k]||{}), ...(krMap[k]||{}) };
        }
        STATE.characterData = merged;
        // KR 전용 캐릭터 리스트(특히 support_party)를 보관
        STATE.krCharacterList = krBox.characterList || null;
    }

    // 모달 유틸
    function openModal(id){
        document.getElementById(id).setAttribute('aria-hidden','false');
    }
    function closeModal(id){
        document.getElementById(id).setAttribute('aria-hidden','true');
    }

    // 보조: 캐릭터 키 정규화 (KR 키로 정규화)
    function resolveCharacterKey(name){
        if(!STATE.characterData) return name;
        if(STATE.characterData[name]) return name;
        const lower = String(name).toLowerCase();
        for(const [kr, meta] of Object.entries(STATE.characterData)){
            if(String(meta.name_en||'').toLowerCase() === lower) return kr;
            if(String(meta.name_jp||'').toLowerCase() === lower) return kr;
            if(String(meta.codename||'').toLowerCase() === lower) return kr;
        }
        return name;
    }
    function displayNameByLang(krKey){
        const meta = STATE.characterData?.[krKey] || {};
        // name_en/name_jp는 KR 데이터에만 존재하므로, EN/JP에서도 KR 메타를 참조하도록 병합을 이미 수행함
        if(STATE.lang==='en' && meta.name_en) return meta.name_en;
        if(STATE.lang==='jp' && meta.name_jp) return meta.name_jp;
        return krKey;
    }

    // 캐릭터 선택 모달 렌더링
    function renderCharacterSelect(){
        const grid = document.getElementById('characterGrid');
        if(!grid||!STATE.characterList) return;
        const allRaw = [...(STATE.characterList.mainParty||[]), ...(STATE.characterList.supportParty||[])];
        // EN/JP에서 리스트가 다른 문자열을 가질 수 있어 정규화
        const all = allRaw.map(resolveCharacterKey);
        // tactics의 정렬 규칙 유사 적용: release_order desc, exclude '원더'
        let names = all.filter(n=>n!=='원더').sort((a,b)=>{
            const ra = (STATE.characterData?.[a]?.release_order ?? -Infinity);
            const rb = (STATE.characterData?.[b]?.release_order ?? -Infinity);
            return rb - ra;
        });
        // 이미 추가한 캐릭터 숨기기
        const planned = new Set(STATE.plans.map(p=>p.name));
        names = names.filter(n=> !planned.has(n));
        // 검색 필터: KR/EN/JP/코드네임(codename) 모두 검색
        const q = (document.getElementById('characterSearch')?.value || '').trim().toLowerCase();
        if(q){ names = names.filter(n=>{
            const meta = STATE.characterData?.[n] || {};
            const en = (meta.name_en||'').toLowerCase();
            const jp = (meta.name_jp||'').toLowerCase();
            const code = (meta.codename||'').toLowerCase();
            return n.toLowerCase().includes(q) || en.includes(q) || jp.includes(q) || code.includes(q);
        }); }
        const seen = new Set();
        const unique = names.filter(n=>!seen.has(n) && seen.add(n));
        const frag = document.createDocumentFragment();
        unique.forEach(name=>{
            const meta = STATE.characterData?.[name] || {};
            const wrap = document.createElement('div'); wrap.style.display='flex'; wrap.style.flexDirection='column'; wrap.style.alignItems='center'; wrap.style.cursor='pointer';
            const img = document.createElement('img');
            img.src = `${BASE_URL}/assets/img/tier/${name}.webp`;
            img.alt = name; img.title = name;
            const label = document.createElement('div');
            label.style.marginTop='4px'; label.style.fontSize='11px'; label.style.opacity='0.9'; label.style.textAlign='center';
            label.textContent = displayNameByLang(name);
            wrap.appendChild(img); wrap.appendChild(label);
            wrap.addEventListener('click',()=>{ closeModal('characterSelectModal'); startSetupFor(name); });
            frag.appendChild(wrap);
        });
        grid.innerHTML=''; grid.appendChild(frag);
        const search = document.getElementById('characterSearch');
        if(search && !search._bound){ search._bound = true; search.addEventListener('input', ()=> renderCharacterSelect()); }

        // 모달 내 spoiler 토글 배치 (EN/JP에서만 표시)
        const filterWrap = document.querySelector('.character-filter');
        if(filterWrap && (STATE.lang==='en' || STATE.lang==='jp')){
            let holder = document.getElementById('modalSpoilerToggle');
            if(!holder){
                holder = document.createElement('label');
                holder.id = 'modalSpoilerToggle';
                holder.style.display='flex'; holder.style.alignItems='center'; holder.style.gap='8px'; holder.style.marginTop='16px'; holder.style.marginLeft='2px';
                const cb = document.createElement('input'); cb.type='checkbox'; cb.id='modalSpoilerCB';
                const span = document.createElement('span'); span.textContent = t('showSpoiler');
                holder.appendChild(cb); holder.appendChild(span);
                filterWrap.appendChild(holder);
                cb.onchange = async ()=>{ STATE.spoiler = cb.checked; await loadCharacterData(); renderCharacterSelect(); };
            }
            const cb = document.getElementById('modalSpoilerCB'); if(cb) cb.checked = !!STATE.spoiler;
        }
    }

    // 설정 모달 시작
    function startSetupFor(name, editingId){
        const title = document.getElementById('setupModalTitle');

        const modalHeader = document.querySelector('#characterSetupModal .modal-header');
        //이전 아바타 제거
        const prevAvatar = modalHeader.querySelector('.setup-avatar');
        if(prevAvatar) prevAvatar.remove();

        const avatar = document.createElement('img');
        avatar.src = `${BASE_URL}/assets/img/tier/${name}.webp`;
        avatar.alt = name; avatar.className = 'setup-avatar';
        // 가장 앞에 추가
        modalHeader.insertBefore(avatar, modalHeader.firstChild);
        //console.log(avatar);
        
        let displayName = name;
        const cd = STATE.characterData?.[name];
        if(STATE.lang==='en' && cd?.name_en) displayName = cd.name_en;
        else if(STATE.lang==='jp' && cd?.name_jp) displayName = cd.name_jp;

        title.textContent = `${displayName}`;
        // 초기화 값 유지(기본 채움)
        openModal('characterSetupModal');
        // 지원 파티 여부 판단 및 현재 모달 상태 플래그 저장 (KR 리스트의 support_party 기준)
        const isSupport = (()=>{
            const sp = (STATE.krCharacterList?.supportParty||[]).map(resolveCharacterKey);
            return sp.includes(name);
        })();
        STATE._currentIsSupport = !!isSupport;
        // 저장 핸들러 바인딩
        const saveBtn = document.getElementById('savePlanBtn');
        saveBtn.onclick = ()=>{
            const inputs = collectInputs();
            // 지원 파티는 S4를 1로 고정
            if(STATE._currentIsSupport){
                inputs.s4From = 1;
                inputs.s4To = 1;
            }
            const materials = estimateMaterials(inputs, name); // 임시 계산 (백데이터 기반)
            if(editingId){
                // 기존 플랜 업데이트
                const idx = STATE.plans.findIndex(pl=>pl.id===editingId);
                if(idx!==-1){
                    STATE.plans[idx] = {
                        ...STATE.plans[idx],
                        inputs,
                        materials
                    };
                    recalcTotals(); renderPlans(); renderSummary(); saveState();
                }
            }else{
                addPlan({ name, rarity: STATE.characterData?.[name]?.rarity || 5, inputs, materials });
                saveState();
            }
            closeModal('characterSetupModal');
        };
        // mind base 12 셀 렌더 (현재/목표 분리)
        renderMindBaseGrid();
        // 편집 시 기존 값으로 프리필
        if (editingId){
            const plan = STATE.plans.find(pl=>pl.id===editingId);
            if(plan){
                // 숫자 입력 세팅
                const setVal=(id,v)=>{const el=document.getElementById(id); if(el) el.value=String(v);};
                const i=plan.inputs;
                setVal('lvFrom',i.lvFrom); setVal('lvTo',i.lvTo);
                setVal('wpFrom',i.wpFrom); setVal('wpTo',i.wpTo);
                setVal('s1From',i.s1From); setVal('s1To',i.s1To);
                setVal('s2From',i.s2From); setVal('s2To',i.s2To);
                setVal('s3From',i.s3From); setVal('s3To',i.s3To);
                // 지원 파티일 경우 S4는 1로 강제
                if(STATE._currentIsSupport){
                    setVal('s4From',1); setVal('s4To',1);
                }else{
                    setVal('s4From',i.s4From); setVal('s4To',i.s4To);
                }
                setVal('mindStat1From',i.mindStat1From); setVal('mindStat1To',i.mindStat1To);
                setVal('mindStat2From',i.mindStat2From); setVal('mindStat2To',i.mindStat2To);
                setVal('mindSkill1From',i.mindSkill1From); setVal('mindSkill1To',i.mindSkill1To);
                setVal('mindSkill2From',i.mindSkill2From); setVal('mindSkill2To',i.mindSkill2To);
                setVal('mindAttrFrom',i.mindAttrFrom); setVal('mindAttrTo',i.mindAttrTo);
                // 심상 현재/목표 값 프리필 (과거 저장 호환: mindBase만 있을 수 있음)
                const curCount = Array.isArray(i.mindBaseCurrent) ? i.mindBaseCurrent.filter(Boolean).length : 0;
                const tarCount = Array.isArray(i.mindBaseTarget) ? i.mindBaseTarget.filter(Boolean).length
                                 : (Array.isArray(i.mindBase) ? i.mindBase.filter(Boolean).length : 12);
                setMindBaseCounts(curCount, Math.max(curCount, tarCount));
            }
        }
        // 슬라이더 부착
        attachSliders();
        // 지원 파티일 경우 S4 입력/슬라이더를 잠금 및 1로 고정, 아니면 정상화
        if(STATE._currentIsSupport){
            const f = document.getElementById('s4From');
            const t = document.getElementById('s4To');
            if(f) { f.value = '1'; f.setAttribute('max','1'); f.setAttribute('min','1'); f.disabled = true; }
            if(t) { t.value = '1'; t.setAttribute('max','1'); t.setAttribute('min','1'); t.disabled = true; }
            const row = f ? f.closest('.setting-row') : null;
            if(row){
                const sliders = row.querySelectorAll('.dual-slider-row input[type="range"]');
                sliders.forEach(sl=>{ sl.min='1'; sl.max='1'; sl.value='1'; sl.disabled=true; });
            }
            //skill-list 클래스의 마지막 setting-row는 display none으로 숨김
            const hlRow = document.querySelector('.skill-list .setting-row:last-child');
            if(hlRow){ hlRow.style.display = 'none'; }
        }else{
            // 일반 파티: S4 입력과 슬라이더를 기본(1~10)으로 활성화
            // 이전에 지원 파티 편집에서 숨겨졌을 수 있으므로 다시 표시
            const hlRow = document.querySelector('.skill-list .setting-row:last-child');
            if(hlRow){ hlRow.style.display = ''; }
            const f = document.getElementById('s4From');
            const t = document.getElementById('s4To');
            if(f) { f.removeAttribute('disabled'); f.setAttribute('min','1'); f.setAttribute('max','10'); }
            if(t) { t.removeAttribute('disabled'); t.setAttribute('min','1'); t.setAttribute('max','10'); }
            const row = f ? f.closest('.setting-row') : null;
            if(row){
                const sliders = row.querySelectorAll('.dual-slider-row input[type="range"]');
                sliders.forEach((sl, idx)=>{
                    sl.disabled=false; sl.min='1'; sl.max='10';
                    // 왼쪽/오른쪽 슬라이더 값을 현재 input 값과 동기화
                    if(idx === 0 && f) sl.value = String(f.value);
                    if(idx === 1 && t) sl.value = String(t.value);
                });
            }
        }
    }

    function renderMindBaseGrid(){
        const host = document.getElementById('mindBaseGrid');
        if(!host) return;
        // The HTML sets class="mind-grid" on #mindBaseGrid which turns the container itself into a grid (single row).
        // Remove that class so our two rows can stack vertically.
        if(host.classList.contains('mind-grid')){
            host.classList.remove('mind-grid');
            host.classList.add('mind-base-container'); // neutral wrapper class (no special layout required)
        }
        // helper to build a row: Title -> Grid -> Slider (full width)
        const buildRow = (idPrefix, titleText)=>{
            const row = document.createElement('div');
            row.className = 'setting-row align-center';
            // title
            const title = document.createElement('div'); title.className='row-title'; title.textContent=titleText; row.appendChild(title);
            // grid (icons)
            const grid = document.createElement('div'); grid.className='mind-grid'; grid.id = idPrefix==='cur' ? 'mindBaseCurrentGrid' : 'mindBaseTargetGrid';
            const frag = document.createDocumentFragment();
            for(let i=1;i<=12;i++){
                const wrapperCell = document.createElement('div'); wrapperCell.className='mind-cell';
                const bg = document.createElement('div');
                bg.style.position='relative'; bg.style.width='36px'; bg.style.height='36px'; bg.style.backgroundSize='cover';
                const groupIdx = ((i-1)%3)+1; const icon = document.createElement('img');
                icon.src = `${BASE_URL}/apps/material-calc/img/mind_base_${groupIdx}.png`;
                icon.style.width='100%'; icon.style.height='100%'; icon.style.objectFit='contain'; icon.style.opacity='1';
                const hidden = document.createElement('input'); hidden.type='checkbox'; hidden.dataset.index=String(i); hidden.style.display='none';
                const seq = document.createElement('div'); seq.className='mind-num'; seq.textContent=String(i);
                bg.appendChild(seq); bg.appendChild(icon);
                wrapperCell.appendChild(bg); wrapperCell.appendChild(hidden); frag.appendChild(wrapperCell);
                // click behavior (sequential rule)
                bg.onclick = ()=>{
                    const idx = i;
                    const isCur = (idPrefix==='cur');
                    const cur = getMindBaseCount('cur');
                    const tar = getMindBaseCount('tar');
                    if(isCur){ setMindBaseCounts(idx, Math.max(idx, tar)); }
                    else { setMindBaseCounts(cur, Math.max(idx, cur)); }
                };
            }
            grid.appendChild(frag);
            row.appendChild(grid);
            // full-width slider row
            const sliderRow = document.createElement('div'); sliderRow.className='single-slider-row';
            const slider = document.createElement('input'); slider.type='range'; slider.min = idPrefix==='cur'? '0':'0'; slider.max='12'; slider.step='1';
            slider.id = idPrefix==='cur' ? 'mindBaseCurSlider' : 'mindBaseTarSlider'; slider.value = idPrefix==='cur'? '0':'12';
            sliderRow.appendChild(slider);
            // optional value label (hidden via CSS per user's preference)
            const valueLabel = document.createElement('div'); valueLabel.id = idPrefix==='cur' ? 'mindBaseCurCount' : 'mindBaseTarCount'; valueLabel.textContent = slider.value;
            sliderRow.appendChild(valueLabel);
            row.appendChild(sliderRow);
            return row;
        };

        host.innerHTML='';
        host.appendChild(buildRow('cur', t('current2')));
        host.appendChild(buildRow('tar', t('target')));

        // initial paint according to defaults
        setMindBaseCounts(0, 12);

        // slider bindings
        const curSl = document.getElementById('mindBaseCurSlider');
        const tarSl = document.getElementById('mindBaseTarSlider');
        curSl.addEventListener('input', ()=>{
            const c = Number(curSl.value); const tval = Math.max(c, Number(tarSl.value));
            setMindBaseCounts(c, tval);
        });
        tarSl.addEventListener('input', ()=>{
            const c = Number(curSl.value); let tval = Number(tarSl.value); if(tval < 0) tval = 0; if(tval < c) tval = c;
            setMindBaseCounts(c, tval);
        });
    }

    function paintMindGrid(gridId, count){
        const grid = document.getElementById(gridId); if(!grid) return;
        const cells = grid.querySelectorAll('input[type="checkbox"]');
        cells.forEach((cb, idx)=>{
            const on = (idx < count);
            cb.checked = on;
            const bg = cb.previousSibling; if(bg && bg.style){
                bg.style.backgroundImage = `url(${BASE_URL}/apps/material-calc/img/${on?'mind_bg_active':'mind_bg_incactive'}.png)`;
                const ic = bg.querySelector('img'); if(ic) ic.style.opacity = '1';
            }
        });
    }

    function getMindBaseCount(prefix){
        const gridId = prefix==='cur' ? 'mindBaseCurrentGrid' : 'mindBaseTargetGrid';
        const grid = document.getElementById(gridId); if(!grid) return 0;
        const checked = Array.from(grid.querySelectorAll('input[type="checkbox"]')).filter(c=>c.checked).length;
        return checked;
    }

    function setMindBaseCounts(curCount, tarCount){
        // enforce bounds
        curCount = Math.max(0, Math.min(12, curCount|0));
        tarCount = Math.max(0, Math.min(12, tarCount|0));
        if(tarCount < curCount) tarCount = curCount;
        paintMindGrid('mindBaseCurrentGrid', curCount);
        paintMindGrid('mindBaseTargetGrid', tarCount);
        const curSl = document.getElementById('mindBaseCurSlider'); if(curSl) curSl.value = String(curCount);
        const tarSl = document.getElementById('mindBaseTarSlider'); if(tarSl) tarSl.value = String(tarCount);
        const curLb = document.getElementById('mindBaseCurCount'); if(curLb) curLb.textContent = String(curCount);
        const tarLb = document.getElementById('mindBaseTarCount'); if(tarLb) tarLb.textContent = String(tarCount);
    }

    // 설정 슬라이더(듀얼 레이아웃: 라벨 / 숫자입력 / 슬라이더)
    function attachSliders(){
        const getRowByInput=(id)=>{ const el=document.getElementById(id); return el? el.closest('.setting-row'): null; };
        const makeDual=(row, fromId, toId, min, max)=>{
            if(!row) return;
            const from=document.getElementById(fromId); const to=document.getElementById(toId);
            if(!from || !to) return;

            // 이미 부착된 경우: 슬라이더와 입력값 동기화만 수행 (버그 수정 포인트)
            if(row.dataset.dualAttached){
                const sliderRow = row.querySelector('.dual-slider-row');
                if(sliderRow){
                    const sliders = sliderRow.querySelectorAll('input[type="range"]');
                    const slL = sliders[0];
                    const slR = sliders[1];
                    if(slL && slR){
                        slL.min=String(min); slL.max=String(max); slL.step='1'; slL.value=from.value;
                        slR.min=String(min); slR.max=String(max); slR.step='1'; slR.value=to.value;
                    }
                }
                return;
            }

            row.dataset.dualAttached='1';
            const existingLabel = row.querySelector('label');
            const labelText = existingLabel ? existingLabel.textContent : '';

            // 컨테이너
            const wrapper=document.createElement('div'); wrapper.className='dual-wrapper';
            const title=document.createElement('div'); title.className='row-title'; title.textContent=labelText; wrapper.appendChild(title);

            // 숫자 입력 행: 기존 input을 이동하여 유지
            const numberRow=document.createElement('div'); numberRow.className='dual-number-row';
            const arrow1=document.createElement('div'); arrow1.className='arrow big'; arrow1.textContent='→';
            numberRow.appendChild(from);
            numberRow.appendChild(arrow1);
            numberRow.appendChild(to);

            // 슬라이더 행
            const sliderRow=document.createElement('div'); sliderRow.className='dual-slider-row';
            const slL=document.createElement('input'); slL.type='range'; slL.min=String(min); slL.max=String(max); slL.step='1'; slL.value=from.value;
            const slR=document.createElement('input'); slR.type='range'; slR.min=String(min); slR.max=String(max); slR.step='1'; slR.value=to.value;
            sliderRow.appendChild(slL); sliderRow.appendChild(slR);

            // 동기화
            const normalize = ()=>{
                const fv = Number(from.value);
                let tv = Number(to.value);
                if(tv < fv){ tv = fv; to.value = String(tv); slR.value = String(tv); }
            };
            slL.addEventListener('input',()=>{ from.value=slL.value; normalize(); });
            slR.addEventListener('input',()=>{ to.value=slR.value; normalize(); });
            from.addEventListener('input',()=>{ slL.value=from.value; normalize(); });
            from.addEventListener('change',()=>{ slL.value=from.value; normalize(); });
            to.addEventListener('input',()=>{ slR.value=to.value; normalize(); });
            to.addEventListener('change',()=>{ slR.value=to.value; normalize(); });

            // 기존 행 정리: 라벨 제거, 새 구조 삽입
            row.innerHTML='';
            wrapper.appendChild(numberRow);
            wrapper.appendChild(sliderRow);
            row.appendChild(wrapper);
        };
        makeDual(getRowByInput('lvFrom'), 'lvFrom','lvTo', 1, 80);
        makeDual(getRowByInput('wpFrom'), 'wpFrom','wpTo', 1, 80);
        makeDual(getRowByInput('s1From'), 's1From','s1To', 1, 10);
        makeDual(getRowByInput('s2From'), 's2From','s2To', 1, 10);
        makeDual(getRowByInput('s3From'), 's3From','s3To', 1, 10);
        // S4: 지원 파티면 최대 1로 제한
        const s4Max = STATE._currentIsSupport ? 1 : 10;
        makeDual(getRowByInput('s4From'), 's4From','s4To', 1, s4Max);
        // 심상 행들
        makeDual(getRowByInput('mindStat1From'), 'mindStat1From','mindStat1To', 0, 5);
        makeDual(getRowByInput('mindStat2From'), 'mindStat2From','mindStat2To', 0, 5);
        makeDual(getRowByInput('mindSkill1From'), 'mindSkill1From','mindSkill1To', 0, 5);
        makeDual(getRowByInput('mindSkill2From'), 'mindSkill2From','mindSkill2To', 0, 5);
        makeDual(getRowByInput('mindAttrFrom'), 'mindAttrFrom','mindAttrTo', 0, 12);
    }

    // 입력값 수집
    function val(id,min,max){
        const v = Number(document.getElementById(id).value||0);
        return Math.max(min, Math.min(max, v));
    }
    function collectInputs(){
        const inputs = {
            lvFrom: val('lvFrom',1,80), lvTo: val('lvTo',1,80),
            wpFrom: val('wpFrom',1,80), wpTo: val('wpTo',1,80),
            s1From: val('s1From',1,10), s1To: val('s1To',1,10),
            s2From: val('s2From',1,10), s2To: val('s2To',1,10),
            s3From: val('s3From',1,10), s3To: val('s3To',1,10),
            s4From: val('s4From',1,10), s4To: val('s4To',1,10),
            // mind base: current/target 각각 별도 배열 생성
            mindBaseCurrent: (()=>{
                const grid = document.getElementById('mindBaseCurrentGrid');
                return grid? Array.from(grid.querySelectorAll('input[type="checkbox"]')).map(c=>c.checked) : Array(12).fill(false);
            })(),
            mindBaseTarget: (()=>{
                const grid = document.getElementById('mindBaseTargetGrid');
                return grid? Array.from(grid.querySelectorAll('input[type="checkbox"]')).map(c=>c.checked) : Array(12).fill(true);
            })(),
            mindStat1From: val('mindStat1From',0,5), mindStat1To: val('mindStat1To',0,5),
            mindStat2From: val('mindStat2From',0,5), mindStat2To: val('mindStat2To',0,5),
            mindSkill1From: val('mindSkill1From',0,5), mindSkill1To: val('mindSkill1To',0,5),
            mindSkill2From: val('mindSkill2From',0,5), mindSkill2To: val('mindSkill2To',0,5),
            mindAttrFrom: val('mindAttrFrom',0,12), mindAttrTo: val('mindAttrTo',0,12)
        };
        // 범위 보정
        if(inputs.lvTo<inputs.lvFrom) inputs.lvTo = inputs.lvFrom;
        if(inputs.wpTo<inputs.wpFrom) inputs.wpTo = inputs.wpFrom;
        ['s1','s2','s3','s4'].forEach(k=>{ if(inputs[`${k}To`] < inputs[`${k}From`]) inputs[`${k}To`] = inputs[`${k}From`]; });
        if(inputs.mindStat1To<inputs.mindStat1From) inputs.mindStat1To = inputs.mindStat1From;
        if(inputs.mindStat2To<inputs.mindStat2From) inputs.mindStat2To = inputs.mindStat2From;
        if(inputs.mindSkill1To<inputs.mindSkill1From) inputs.mindSkill1To = inputs.mindSkill1From;
        if(inputs.mindSkill2To<inputs.mindSkill2From) inputs.mindSkill2To = inputs.mindSkill2From;
        if(inputs.mindAttrTo<inputs.mindAttrFrom) inputs.mindAttrTo = inputs.mindAttrFrom;
        return inputs;
    }

    // 계산 로직 (백데이터 기반). 실제 수치는 apps/material-calc/data/material_costs.js에서 로드
    let COSTS = null;
    // 재료 설명 데이터 (이름/설명 다국어)
    let MATERIAL_INFO_DATA = null;
    // 스킬 기본 비용 테이블 (목표 레벨별 추가 소모)

    async function ensureCosts(){
        if(COSTS) return COSTS;
        try{
            const baseUrl = `${BASE_URL}/apps/material-calc/data`;
            const [text, expText, wexpText] = await Promise.all([
                fetch(`${baseUrl}/material_costs.js?v=${APP_VERSION}`).then(r=>r.text()),
                fetch(`${baseUrl}/level_exp.js?v=${APP_VERSION}`).then(r=>r.text()),
                fetch(`${baseUrl}/weapon_level_exp.js?v=${APP_VERSION}`).then(r=>r.text())
            ]);
            const box = {};
            new Function('out', `${text}; out.COSTS = MATERIAL_COSTS;`)(box);
            new Function('out', `${expText}; out.LEVEL_EXP = LEVEL_EXP_TO_NEXT;`)(box);
            new Function('out', `${wexpText}; out.WEAPON_LEVEL_EXP = WEAPON_LEVEL_EXP_TO_NEXT;`)(box);
            COSTS = box.COSTS;
            COSTS.__LEVEL_EXP = box.LEVEL_EXP;
            COSTS.__WEAPON_LEVEL_EXP = box.WEAPON_LEVEL_EXP || {};
            //COSTS.__LEVEL_GEM = box.LEVEL_GEM || {};
            //COSTS.__WEAPON_LEVEL_GEM = box.WEAPON_LEVEL_GEM || {};
        }catch(err){
            console.warn('Load MATERIAL_COSTS failed. Using zeros', err);
            COSTS = { level:{}, weapon:{}, skills:{}, mind:{}, __LEVEL_EXP:{} };
        }
        return COSTS;
    }

    async function ensureMaterialInfo(){
        if(MATERIAL_INFO_DATA) return MATERIAL_INFO_DATA;
        try{
            const baseUrl = `${BASE_URL}/apps/material-calc/data`;
            const text = await fetch(`${baseUrl}/material_info.js?v=${APP_VERSION}`).then(r=>r.text());
            const box = {};
            new Function('out', `${text}; out.INFO = MATERIAL_INFO;`)(box);
            MATERIAL_INFO_DATA = box.INFO || {};
        }catch(_){
            MATERIAL_INFO_DATA = {};
        }
        return MATERIAL_INFO_DATA;
    }

    function materialInfoFor(key, fallbackLabel){
        const info = MATERIAL_INFO_DATA?.[key];
        if(!info) return { name: fallbackLabel||key, desc: '' };
        const lang = STATE.lang || 'en';
        const name = (info.name?.[lang] || info.name?.en || fallbackLabel || key);
        const desc = (info.desc?.[lang] || info.desc?.en || '');
        return { name, desc };
    }

    function addCount(dict,key,delta){ dict[key] = (dict[key]||0) + delta; }

    function estimateMaterials(inputs, characterName){
        // 간이 계산: 각 구간별 합계를 백데이터 테이블에서 누적
        const mats = {};
        if(!COSTS){ /* 비동기 로딩 전에 저장 호출 가능 */ }
        const costs = COSTS || { level:{}, weapon:{}, skills:{}, mind:{}, __LEVEL_EXP:{} };
        // LEVEL: 경험치 아이템/한계돌파 동시 계산
        // 1) 경험치 합산 → 그리디로 4000/1000/200 단위로 분해
        let expSum = 0;
        for(let lv=inputs.lvFrom; lv<inputs.lvTo; lv++){
            expSum += (costs.__LEVEL_EXP?.[lv] || 0);
        }
        if(expSum>0){
            let expSumForGem = expSum;
            // greedy: 4000, 1000, 200
            const unit3 = 4000, unit2 = 1000, unit1 = 200;
            const c3 = Math.floor(expSum / unit3); expSum -= c3*unit3; if(c3>0) addCount(mats,'lv_exp3', c3);
            const c2 = Math.floor(expSum / unit2); expSum -= c2*unit2; if(c2>0) addCount(mats,'lv_exp2', c2);
            // 남은 값이 0이 아니면 200 단위로 올림 처리
            let c1 = Math.ceil(expSum / unit1); if(c1>0) addCount(mats,'lv_exp1', c1);

            // 레벨업 잼 소모량
            // c3 * 20 * 30 + c2 * 5 * 30 + c1 * 1 * 30
            if(inputs.lvTo!==80){
                const gemCount = (c3 * 20 * 30) + (c2 * 5 * 30) + (c1 * 1 * 30);
                if(gemCount > 0) addCount(mats,'konpaku_gem', gemCount);
            }
            else{
                //console.log('expSumForGem', expSumForGem);
                const gemCount = Math.floor(expSumForGem * 0.15);
                if(gemCount > 0) addCount(mats,'konpaku_gem', gemCount);
            }
        }

        
        // 캐릭터 레벨업 구간 gem 합산
        /*
        for(let lv=inputs.lvFrom; lv<inputs.lvTo; lv++){
            const g = costs.__LEVEL_GEM?.[lv] || 0; if(g) addCount(mats,'konpaku_gem', g);
        }*/
        // 2) 레벨 한계돌파 아이템 (10,20,30...80 목표 구간 진입 시 필요 수량 적용)
        for(let lv=inputs.lvFrom+1; lv<=inputs.lvTo; lv++){
            const row = costs.level[lv];
            if(!row) continue;
            Object.entries(row).forEach(([k,v])=> addCount(mats,k, v||0));

        }
        // WEAPON: 경험치/한계돌파 (현재는 캐릭터 LV와 동일 규칙 가정)
        let wpExpSum = 0;
        for(let lv=inputs.wpFrom; lv<inputs.wpTo; lv++){
            wpExpSum += (costs.__WEAPON_LEVEL_EXP?.[lv] || 0);
        }
        //console.log('wpExpSum', wpExpSum);
        if(wpExpSum>0){
            let wpExpSumForGem = wpExpSum;
            const unit3 = 2000, unit2 = 500, unit1 = 100;
            const c3 = Math.floor(wpExpSum / unit3); wpExpSum -= c3*unit3; if(c3>0) addCount(mats,'wp_exp3', c3);
            const c2 = Math.floor(wpExpSum / unit2); wpExpSum -= c2*unit2; if(c2>0) addCount(mats,'wp_exp2', c2);
            let c1 = Math.ceil(wpExpSum / unit1); if(c1>0) addCount(mats,'wp_exp1', c1);
            if(inputs.wpTo!==80){
                const gemCount = (c3 * 20 * 25) + (c2 * 5 * 25) + (c1 * 1 * 25);
                if(gemCount > 0) addCount(mats,'konpaku_gem', gemCount);
            }
            else{
                //console.log('wpExpSumForGem', wpExpSumForGem);
                const gemCount = Math.floor(wpExpSumForGem * 0.25);
                if(gemCount > 0) addCount(mats,'konpaku_gem', gemCount);
            }
        }
        /*
        for(let lv=inputs.wpFrom; lv<inputs.wpTo; lv++){
            const g = costs.__WEAPON_LEVEL_GEM?.[lv] || 0; if(g) addCount(mats,'konpaku_gem', g);
        }*/
        // WEAPON 레벨 돌파
        for(let lv=inputs.wpFrom+1; lv<=inputs.wpTo; lv++){
            const row = costs.weapon[lv]; if(!row) continue;
            Object.entries(row).forEach(([k,v])=> addCount(mats,k, v||0));
        }
        // SKILLS (각 스킬별)
        const resolvedKey = resolveCharacterKey(characterName || (inputs && inputs.name) || '');
        const charMeta = (STATE.characterData?.[resolvedKey]) || {};
        const skillItemIndex = Math.max(1, Math.min(5, Number(charMeta.skill_item || 1)));
        ['s1','s2','s3','s4'].forEach((sk)=>{
            for(let lv=inputs[`${sk}From`]+1; lv<=inputs[`${sk}To`]; lv++){
                let row = costs.skills?.[lv];
                if(!row) row = SKILL_LEVEL_COSTS[lv];
                if(!row) continue;
                Object.entries(row).forEach(([k,v])=>{
                    if(!v) return;
                    if(k==='skill_item') addCount(mats, `skill_item${skillItemIndex}`, v);
                    else addCount(mats, k, v);
                });
            }
        });
        // MIND BASE: 현재→목표 구간만 비용 합산 (과거 호환: mindBase만 있을 수 있음)
        let curBase = 0, tarBase = 0;
        if(Array.isArray(inputs.mindBaseCurrent) || Array.isArray(inputs.mindBaseTarget)){
            curBase = Array.isArray(inputs.mindBaseCurrent) ? inputs.mindBaseCurrent.filter(Boolean).length : 0;
            tarBase = Array.isArray(inputs.mindBaseTarget) ? inputs.mindBaseTarget.filter(Boolean).length : 0;
            if(tarBase < curBase) tarBase = curBase; // 안전장치
        } else if (Array.isArray(inputs.mindBase)){
            // 기존 데이터는 현재=0, 목표=enabled로 간주
            curBase = 0; tarBase = inputs.mindBase.filter(Boolean).length;
        }
        for(let lv=curBase+1; lv<=tarBase; lv++){
            const row = (costs.mind.base && costs.mind.base[lv]) || null;
            if(row) Object.entries(row).forEach(([k,v])=> addCount(mats,k, v||0));
        }
        // Mind Stat: 각 트랙(stat1, stat2)은 독립 진행이지만, 레벨업 액션당 두 재료가 합산되어 소모
        for(let lv=inputs.mindStat1From+1; lv<=inputs.mindStat1To; lv++){
            const row1 = costs.mind.stat1?.[lv]; if(row1) Object.entries(row1).forEach(([k,v])=> addCount(mats,k, v||0));
            const row2 = costs.mind.stat2?.[lv]; if(row2) Object.entries(row2).forEach(([k,v])=> addCount(mats,k, v||0));
        }
        for(let lv=inputs.mindStat2From+1; lv<=inputs.mindStat2To; lv++){
            const row1 = costs.mind.stat1?.[lv]; if(row1) Object.entries(row1).forEach(([k,v])=> addCount(mats,k, v||0));
            const row2 = costs.mind.stat2?.[lv]; if(row2) Object.entries(row2).forEach(([k,v])=> addCount(mats,k, v||0));
        }
        // Mind Skill: 각 트랙(skill1, skill2)도 동일 규칙
        for(let lv=inputs.mindSkill1From+1; lv<=inputs.mindSkill1To; lv++){
            const row1 = costs.mind.skill1?.[lv]; if(row1) Object.entries(row1).forEach(([k,v])=> addCount(mats,k, v||0));
            const row2 = costs.mind.skill2?.[lv]; if(row2) Object.entries(row2).forEach(([k,v])=> addCount(mats,k, v||0));
        }
        for(let lv=inputs.mindSkill2From+1; lv<=inputs.mindSkill2To; lv++){
            const row1 = costs.mind.skill1?.[lv]; if(row1) Object.entries(row1).forEach(([k,v])=> addCount(mats,k, v||0));
            const row2 = costs.mind.skill2?.[lv]; if(row2) Object.entries(row2).forEach(([k,v])=> addCount(mats,k, v||0));
        }
        for(let lv=inputs.mindAttrFrom+1; lv<=inputs.mindAttrTo; lv++){
            const row = costs.mind.attr?.[lv]; if(row) Object.entries(row).forEach(([k,v])=> addCount(mats,k, v||0));
        }
        return mats;
    }

    function addPlan({name, rarity, inputs, materials}){
        const id = Date.now()+ '_' + Math.random().toString(36).slice(2,7);
        const plan = { id, name, rarity, image: `${BASE_URL}/assets/img/tier/${name}.webp`, inputs, materials, include: true };
        STATE.plans.push(plan);
        recalcTotals();
        renderPlans();
        renderSummary();
    }

    function removePlan(id){
        STATE.plans = STATE.plans.filter(p=>p.id!==id);
        recalcTotals();
        renderPlans();
        renderSummary();
    }

    function recalcTotals(){
        const totals = {};
        STATE.plans.forEach(p=>{
            if(p.include === false) return; // excluded from summary
            Object.entries(p.materials||{}).forEach(([k,v])=> addCount(totals,k, v||0));
        });
        STATE.totals = totals;
    }

    // 렌더: 요약
    function renderSummary(){
        const grid = document.getElementById('summaryGrid');
        if(!grid) return;
        const frag = document.createDocumentFragment();
        const entries = Object.entries(STATE.totals).sort((a,b)=>{
            const aa = materialSortOrder(a[0]);
            const bb = materialSortOrder(b[0]);
            if(aa!==bb) return aa-bb;
            return a[0] > b[0] ? 1 : -1;
        });

        // 그룹형 시뮬레이션(돌파/EXP)
        const n1 = STATE.totals['lv_limit1']|0, n2 = STATE.totals['lv_limit2']|0, n3 = STATE.totals['lv_limit3']|0;
        const limitSummary = computeLimitSummary({ n1, n2, n3 }, STATE.inventory);
        const e1 = STATE.totals['lv_exp1']|0, e2 = STATE.totals['lv_exp2']|0, e3 = STATE.totals['lv_exp3']|0;
        const expSummary = computeExpVisual({ n1:e1, n2:e2, n3:e3 }, STATE.inventory);
        // skills 상향(3:1, 2:1) 시뮬레이션: lv1/2/3만 대상
        const s1 = STATE.totals['skill_lv_1']|0, s2 = STATE.totals['skill_lv_2']|0, s3 = STATE.totals['skill_lv_3']|0;
        const skillSummary = computeLimitSummary({ n1:s1, n2:s2, n3:s3 }, { lv_limit1:STATE.inventory.skill_lv_1|0, lv_limit2:STATE.inventory.skill_lv_2|0, lv_limit3:STATE.inventory.skill_lv_3|0 });
        // weapon 그룹도 별도 계산 (STATE.inventory의 wp_*를 임시 맵으로 매핑)
        const wn1 = STATE.totals['wp_limit1']|0, wn2 = STATE.totals['wp_limit2']|0, wn3 = STATE.totals['wp_limit3']|0;
        const winvLimit = { lv_limit1: STATE.inventory.wp_limit1|0, lv_limit2: STATE.inventory.wp_limit2|0, lv_limit3: STATE.inventory.wp_limit3|0 };
        const wpLimitSummary = computeLimitSummary({ n1:wn1, n2:wn2, n3:wn3 }, winvLimit);
        const we1 = STATE.totals['wp_exp1']|0, we2 = STATE.totals['wp_exp2']|0, we3 = STATE.totals['wp_exp3']|0;
        const winvExp = { lv_exp1: STATE.inventory.wp_exp1|0, lv_exp2: STATE.inventory.wp_exp2|0, lv_exp3: STATE.inventory.wp_exp3|0 };
        const wpExpSummary = computeExpVisual({ n1:we1, n2:we2, n3:we3 }, winvExp, true);

        entries.forEach(([key,cnt])=>{
            const div = document.createElement('div');
            div.className='material-chip ' + chipLevelClass(key);
            const img = document.createElement('img');
            img.src = MATERIAL_ICONS[key] || MATERIAL_ICONS.money; // 폴백
            let owned = STATE.inventory[key] || 0;
            if(key.startsWith('lv_limit')){
                owned = limitSummary.visual[key] ?? 0;
            } else if(key.startsWith('lv_exp')){
                owned = expSummary[key] ?? 0;
            } else if(key.startsWith('wp_limit')){
                const mapKey = key.replace('wp_','lv_');
                owned = wpLimitSummary.visual[mapKey] ?? 0;
            } else if(key.startsWith('wp_exp')){
                const mapKey = key.replace('wp_','lv_');
                owned = wpExpSummary[mapKey] ?? 0;
            } else if(key==='skill_lv_1'){
                owned = skillSummary.visual.lv_limit1 ?? Math.min(cnt, STATE.inventory[key]||0);
            } else if(key==='skill_lv_2'){
                owned = skillSummary.visual.lv_limit2 ?? Math.min(cnt, STATE.inventory[key]||0);
            } else if(key==='skill_lv_3'){
                owned = skillSummary.visual.lv_limit3 ?? Math.min(cnt, STATE.inventory[key]||0);
            } else {
                owned = Math.min(cnt, STATE.inventory[key]||0);
            }
            const p = document.createElement('div'); p.className='cnt';
            const ownSpan = document.createElement('span'); ownSpan.className='own';
            ownSpan.textContent = (key==='konpaku_gem') ? formatK(owned|0) : String(owned|0);
            if((owned|0) < (cnt|0)) ownSpan.classList.add('bad');
            const sep = document.createTextNode('/');
            const needSpan = document.createElement('span'); needSpan.className='need'; needSpan.textContent = (key==='konpaku_gem') ? formatK(cnt|0) : String(cnt|0);
            p.appendChild(ownSpan); p.appendChild(sep); p.appendChild(needSpan);
            div.title = `${owned|0} / ${cnt|0}`;
            if(key==='lv_limit3' && limitSummary.badge3>0){
                const badge = document.createElement('div'); badge.className='craft-badge';
                const icon=document.createElement('img'); icon.src = `${BASE_URL}/apps/material-calc/img/exchange.png`; icon.style.width='12px'; icon.style.height='12px';
                const span=document.createElement('span'); span.textContent=String(limitSummary.badge3);
                badge.appendChild(icon); badge.appendChild(span); div.appendChild(badge);
            }
            if(key==='lv_limit2' && limitSummary.badge2>0){
                const badge2 = document.createElement('div'); badge2.className='craft-badge';
                const icon2=document.createElement('img'); icon2.src = `${BASE_URL}/apps/material-calc/img/exchange.png`; icon2.style.width='12px'; icon2.style.height='12px';
                const span2=document.createElement('span'); span2.textContent=String(limitSummary.badge2);
                badge2.appendChild(icon2); badge2.appendChild(span2); div.appendChild(badge2);
            }
            if(key==='skill_lv_3' && skillSummary.badge3>0){
                const badge = document.createElement('div'); badge.className='craft-badge';
                const icon=document.createElement('img'); icon.src = `${BASE_URL}/apps/material-calc/img/exchange.png`; icon.style.width='12px'; icon.style.height='12px';
                const span=document.createElement('span'); span.textContent=String(skillSummary.badge3);
                badge.appendChild(icon); badge.appendChild(span); div.appendChild(badge);
            }
            if(key==='skill_lv_2' && skillSummary.badge2>0){
                const badge2 = document.createElement('div'); badge2.className='craft-badge';
                const icon2=document.createElement('img'); icon2.src = `${BASE_URL}/apps/material-calc/img/exchange.png`; icon2.style.width='12px'; icon2.style.height='12px';
                const span2=document.createElement('span'); span2.textContent=String(skillSummary.badge2);
                badge2.appendChild(icon2); badge2.appendChild(span2); div.appendChild(badge2);
            }
            if(key==='wp_limit3' && wpLimitSummary.badge3>0){
                const badge = document.createElement('div'); badge.className='craft-badge';
                const icon=document.createElement('img'); icon.src = `${BASE_URL}/apps/material-calc/img/exchange.png`; icon.style.width='12px'; icon.style.height='12px';
                const span=document.createElement('span'); span.textContent=String(wpLimitSummary.badge3);
                badge.appendChild(icon); badge.appendChild(span); div.appendChild(badge);
            }
            if(key==='wp_limit2' && wpLimitSummary.badge2>0){
                const badge2 = document.createElement('div'); badge2.className='craft-badge';
                const icon2=document.createElement('img'); icon2.src = `${BASE_URL}/apps/material-calc/img/exchange.png`; icon2.style.width='12px'; icon2.style.height='12px';
                const span2=document.createElement('span'); span2.textContent=String(wpLimitSummary.badge2);
                badge2.appendChild(icon2); badge2.appendChild(span2); div.appendChild(badge2);
            }
            // 클릭 시 그룹별 보유량 편집
            div.addEventListener('click', ()=>{
                if(key.startsWith('lv_exp')) openInventoryModal('lv_exp', key);
                else if(key.startsWith('lv_limit')) openInventoryModal('lv_limit', key);
                else if(key.startsWith('wp_exp')) openInventoryModal('wp_exp', key);
                else if(key.startsWith('wp_limit')) openInventoryModal('wp_limit', key);
                else if(key.startsWith('skill_')) openInventoryModal('skill', key);
                else if(key==='konpaku_gem') openInventoryModal('gem', key);
                else if(key.startsWith('md_')) openInventoryModal('mind', key);
            });
            div.appendChild(img); div.appendChild(p); frag.appendChild(div);
        });
        grid.innerHTML=''; grid.appendChild(frag);
    }

    // 렌더: 계획 카드들
    function renderPlans(){
        const root = document.getElementById('plansContainer');
        if(!root) return;
        const frag = document.createDocumentFragment();
        // 활성 필터 읽기
        const getChecked = (name)=> Array.from(document.querySelectorAll(`input[name="${name}"]:checked`)).map(el=>el.value);
        const fElement = getChecked('element');
        const fPosition = getChecked('position');
        const fRarity = getChecked('rarity'); // values: '4','5'
        // 필터 적용
        const filtered = STATE.plans.filter(p=>{
            const meta = STATE.characterData?.[resolveCharacterKey(p.name)] || {};
            if(fElement.length && !fElement.includes(meta.element)) return false;
            if(fPosition.length && !fPosition.includes(meta.position)) return false;
            if(fRarity.length && !fRarity.includes(String(meta.rarity))) return false;
            return true;
        });

        // 정렬 적용
        const toName = (anyName)=>{
            const krKey = resolveCharacterKey(anyName);
            const meta = STATE.characterData?.[krKey] || {};
            if(STATE.lang==='en' && meta.name_en) return meta.name_en;
            if(STATE.lang==='jp' && meta.name_jp) return meta.name_jp;
            return krKey;
        };
        const getRelease = (anyName)=>{
            const krKey = resolveCharacterKey(anyName);
            const meta = STATE.characterData?.[krKey] || {};
            const v = (typeof meta.release_order === 'number') ? meta.release_order
                  : (typeof meta.release === 'number') ? meta.release
                  : (typeof meta.order === 'number') ? meta.order
                  : (typeof meta.index === 'number') ? meta.index
                  : null;
            // 미정/없음은 매우 큰 값으로 하여 항상 뒤로 밀기
            return (v==null) ? Number.MAX_SAFE_INTEGER : v;
        };
        const sorted = [...filtered].sort((a,b)=>{
            const k = STATE.sortKey;
            if(k==='name_asc' || k==='name_desc'){
                const na = toName(a.name) || '';
                const nb = toName(b.name) || '';
                if(na===nb) return 0;
                const res = na > nb ? 1 : -1;
                return k==='name_asc' ? res : -res;
            }else{
                // release
                const ra = getRelease(a.name);
                const rb = getRelease(b.name);
                if(ra===rb){
                    // tie-breaker: name asc
                    const na = toName(a.name) || '';
                    const nb = toName(b.name) || '';
                    if(na===nb) return 0;
                    return na > nb ? 1 : -1;
                }
                const res = ra - rb;
                return (k==='release_asc') ? res : -res;
            }
        });
        sorted.forEach(p=>{
            const card = document.createElement('div'); card.className='plan-card';
            const header = document.createElement('div'); header.className='plan-header'; header.style.position='relative';
            const title = document.createElement('div'); title.className='plan-title';
            const starImg = (p.rarity>=5)? `${BASE_URL}/assets/img/character-detail/star5.png` : `${BASE_URL}/assets/img/character-detail/star4.png`;
            const starCount = Math.max(1, Math.min(5, p.rarity||5));
            // 다국어 캐릭터명
            let displayName = p.name;
            const cd = STATE.characterData?.[p.name];
            if(STATE.lang==='en' && cd?.name_en) displayName = cd.name_en;
            else if(STATE.lang==='jp' && cd?.name_jp) displayName = cd.name_jp;

            // 좌측 아바타
            const avatar = document.createElement('img');
            avatar.src = p.image; avatar.alt = displayName; avatar.className = 'plan-avatar';
            title.appendChild(avatar);
            // 우측 2행 박스
            const right = document.createElement('div'); right.className = 'plan-title-right';
            const nameRow = document.createElement('div'); nameRow.className = 'name-row'; nameRow.textContent = displayName;
            // include toggle checkbox
            nameRow.style.display = 'flex'; nameRow.style.alignItems='center'; nameRow.style.gap='8px';
            const includeWrap = document.createElement('label'); includeWrap.style.marginLeft='auto'; includeWrap.style.display='flex'; includeWrap.style.alignItems='center';
            const includeCb = document.createElement('input'); includeCb.type='checkbox'; includeCb.checked = (p.include !== false); includeCb.title = t('includeInSummary'); includeCb.setAttribute('aria-label', t('includeInSummary'));
            includeWrap.appendChild(includeCb);
            nameRow.appendChild(includeWrap);
            const metaRow = document.createElement('div'); metaRow.className = 'meta-row';
            // 속성, 직업 아이콘
            try{ if(cd?.element){ const elI = document.createElement('img'); elI.src = `${BASE_URL}/assets/img/character-cards/속성_${cd.element}.png`; elI.alt = cd.element; elI.className='meta-icon'; metaRow.appendChild(elI); } }catch(_){ }
            try{ if(cd?.position){ const poI = document.createElement('img'); poI.src = `${BASE_URL}/assets/img/character-cards/직업_${cd.position}.png`; poI.alt = cd.position; poI.className='meta-icon'; metaRow.appendChild(poI); } }catch(_){ }
            // 별 아이콘
            const starWrap = document.createElement('span'); starWrap.className = 'star-wrap';
            for(let i=0;i<starCount;i++){ const s=document.createElement('img'); s.src=starImg; s.alt='star'; s.style.width='14px'; s.style.height='14px'; s.style.objectFit='contain'; starWrap.appendChild(s);}            
            metaRow.appendChild(starWrap);
            right.appendChild(nameRow); right.appendChild(metaRow);
            title.appendChild(right);
            const actions = document.createElement('div'); actions.className='plan-actions';
            const menuBtn = document.createElement('button'); menuBtn.className='menu-btn'; menuBtn.innerHTML='<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="5" r="1"/><circle cx="12" cy="12" r="1"/><circle cx="12" cy="19" r="1"/></svg>';
            const menu = document.createElement('div'); menu.className='menu';
            const editBtn = document.createElement('button'); editBtn.textContent=t('edit');
            const deleteBtn = document.createElement('button'); deleteBtn.textContent=t('remove'); deleteBtn.style.color='tomato';
            menu.appendChild(editBtn); menu.appendChild(deleteBtn);
            actions.appendChild(menuBtn);
            header.appendChild(title); header.appendChild(actions); header.appendChild(menu); card.appendChild(header);
            // 메뉴 토글 + 바깥 클릭 시 닫기
            menu.addEventListener('click', (e)=> e.stopPropagation());
            menuBtn.onclick = (e)=>{
                e.stopPropagation();
                const opened = menu.classList.toggle('show');
                if(opened){
                    const onDocClick = (ev)=>{
                        if(!menu.contains(ev.target) && ev.target!==menuBtn){
                            menu.classList.remove('show');
                            document.removeEventListener('click', onDocClick);
                        }
                    };
                    // 다음 틱에 등록해 현재 클릭으로 바로 닫히지 않게 함
                    setTimeout(()=> document.addEventListener('click', onDocClick), 0);
                }
            };
            deleteBtn.onclick = ()=>{
                const title = t('deleteConfirmTitle');
                const msg = t('deleteConfirmMessage');
                // 기본 confirm 사용 (각 언어 메시지 지원)
                // 필요 시 커스텀 모달로 교체 가능
                if(window.confirm(`${title}\n\n${msg}`)){
                    removePlan(p.id);
                    saveState();
                }
            };
            editBtn.onclick = ()=>{ startSetupFor(p.name, p.id); };

            // initial visual dim if excluded
            if(p.include === false){ card.style.opacity = '0.6'; }
            includeCb.onchange = ()=>{
                p.include = includeCb.checked;
                card.style.opacity = p.include === false ? '0.6' : '';
                recalcTotals();
                renderSummary();
                saveState();
            };

            const matGrid = document.createElement('div'); matGrid.className='material-grid';
            // 그룹별 실제 충당(자동 변환) 계산
            const needL1 = p.materials['lv_limit1']|0, needL2 = p.materials['lv_limit2']|0, needL3 = p.materials['lv_limit3']|0;
            const limitSummary = computeLimitSummary({ n1:needL1, n2:needL2, n3:needL3 }, STATE.inventory);
            const needE1 = p.materials['lv_exp1']|0, needE2 = p.materials['lv_exp2']|0, needE3 = p.materials['lv_exp3']|0;
            const visualExp = computeExpVisual({ n1:needE1, n2:needE2, n3:needE3 }, STATE.inventory);

            // 무기 그룹(돌파/EXP) 시뮬레이션
            const wNeedL1 = p.materials['wp_limit1']|0, wNeedL2 = p.materials['wp_limit2']|0, wNeedL3 = p.materials['wp_limit3']|0;
            const winvLimit = { lv_limit1: STATE.inventory.wp_limit1|0, lv_limit2: STATE.inventory.wp_limit2|0, lv_limit3: STATE.inventory.wp_limit3|0 };
            const wpLimitSummary = computeLimitSummary({ n1:wNeedL1, n2:wNeedL2, n3:wNeedL3 }, winvLimit);
            const wNeedE1 = p.materials['wp_exp1']|0, wNeedE2 = p.materials['wp_exp2']|0, wNeedE3 = p.materials['wp_exp3']|0;
            const winvExp = { lv_exp1: STATE.inventory.wp_exp1|0, lv_exp2: STATE.inventory.wp_exp2|0, lv_exp3: STATE.inventory.wp_exp3|0 };
            const visualWpExp = computeExpVisual({ n1:wNeedE1, n2:wNeedE2, n3:wNeedE3 }, winvExp, true);

            // 스킬 변환 시뮬레이션 준비
            const needS1 = p.materials['skill_lv_1']|0, needS2 = p.materials['skill_lv_2']|0, needS3 = p.materials['skill_lv_3']|0;
            const sinv = { lv_limit1: STATE.inventory.skill_lv_1|0, lv_limit2: STATE.inventory.skill_lv_2|0, lv_limit3: STATE.inventory.skill_lv_3|0 };
            const skillSummary = computeLimitSummary({ n1:needS1, n2:needS2, n3:needS3 }, sinv);

            Object.entries(Object.fromEntries(Object.entries(p.materials||{}).sort((a,b)=>{
                const aa = materialSortOrder(a[0]);
                const bb = materialSortOrder(b[0]);
                if(aa!==bb) return aa-bb;
                return a[0] > b[0] ? 1 : -1;
            }))).forEach(([k,c])=>{
                const div = document.createElement('div'); div.className='material-chip ' + chipLevelClass(k);
                const img = document.createElement('img'); img.src = MATERIAL_ICONS[k] || MATERIAL_ICONS.money;
                // 자동 충당(변환 적용)된 보이는 보유/필요 계산 (그룹 처리)
                let visual = STATE.inventory[k]||0;
                if(k.startsWith('lv_limit')){
                    visual = limitSummary.visual[k] ?? 0;
                } else if(k.startsWith('lv_exp')){
                    visual = visualExp[k] ?? 0;
                } else if(k.startsWith('wp_limit')){
                    const mapKey = k.replace('wp_','lv_');
                    visual = wpLimitSummary.visual[mapKey] ?? 0;
                } else if(k.startsWith('wp_exp')){
                    const mapKey = k.replace('wp_','lv_');
                    visual = visualWpExp[mapKey] ?? 0;
                } else if(k==='skill_lv_1'){
                    visual = skillSummary.visual.lv_limit1 ?? Math.min(c, STATE.inventory[k]||0);
                } else if(k==='skill_lv_2'){
                    visual = skillSummary.visual.lv_limit2 ?? Math.min(c, STATE.inventory[k]||0);
                } else if(k==='skill_lv_3'){
                    visual = skillSummary.visual.lv_limit3 ?? Math.min(c, STATE.inventory[k]||0);
                } else {
                    visual = Math.min(c, STATE.inventory[k]||0);
                }
                const txt = document.createElement('div'); txt.className='cnt';
                const ownSpan2 = document.createElement('span'); ownSpan2.className='own'; ownSpan2.textContent = (k==='konpaku_gem') ? formatK(visual|0) : String(visual|0);
                if((visual|0) < (c|0)) ownSpan2.classList.add('bad');
                const sep2 = document.createTextNode('/');
                const needSpan2 = document.createElement('span'); needSpan2.className='need'; needSpan2.textContent = (k==='konpaku_gem') ? formatK(c|0) : String(c|0);
                txt.appendChild(ownSpan2); txt.appendChild(sep2); txt.appendChild(needSpan2);
                // 돌파3 배지: 실제 상향 제작 수 표시
                if(k==='lv_limit3' && limitSummary.badge3>0){
                    const badge = document.createElement('div'); badge.className='craft-badge';
                    const icon=document.createElement('img'); icon.src = `${BASE_URL}/apps/material-calc/img/exchange.png`; icon.style.width='12px'; icon.style.height='12px';
                    const span=document.createElement('span'); span.textContent=String(limitSummary.badge3);
                    badge.appendChild(icon); badge.appendChild(span); div.appendChild(badge);
                }
                if(k==='lv_limit2' && limitSummary.badge2>0){
                    const badge2 = document.createElement('div'); badge2.className='craft-badge';
                    const icon2=document.createElement('img'); icon2.src = `${BASE_URL}/apps/material-calc/img/exchange.png`; icon2.style.width='12px'; icon2.style.height='12px';
                    const span2=document.createElement('span'); span2.textContent=String(limitSummary.badge2);
                    badge2.appendChild(icon2); badge2.appendChild(span2); div.appendChild(badge2);
                }
                if(k==='wp_limit3' && wpLimitSummary.badge3>0){
                    const badge = document.createElement('div'); badge.className='craft-badge';
                    const icon=document.createElement('img'); icon.src = `${BASE_URL}/apps/material-calc/img/exchange.png`; icon.style.width='12px'; icon.style.height='12px';
                    const span=document.createElement('span'); span.textContent=String(wpLimitSummary.badge3);
                    badge.appendChild(icon); badge.appendChild(span); div.appendChild(badge);
                }
                if(k==='wp_limit2' && wpLimitSummary.badge2>0){
                    const badge2 = document.createElement('div'); badge2.className='craft-badge';
                    const icon2=document.createElement('img'); icon2.src = `${BASE_URL}/apps/material-calc/img/exchange.png`; icon2.style.width='12px'; icon2.style.height='12px';
                    const span2=document.createElement('span'); span2.textContent=String(wpLimitSummary.badge2);
                    badge2.appendChild(icon2); badge2.appendChild(span2); div.appendChild(badge2);
                }
                if(k==='skill_lv_3' && skillSummary.badge3>0){
                    const badge = document.createElement('div'); badge.className='craft-badge';
                    const icon=document.createElement('img'); icon.src = `${BASE_URL}/apps/material-calc/img/exchange.png`; icon.style.width='12px'; icon.style.height='12px';
                    const span=document.createElement('span'); span.textContent=String(skillSummary.badge3);
                    badge.appendChild(icon); badge.appendChild(span); div.appendChild(badge);
                }
                if(k==='skill_lv_2' && skillSummary.badge2>0){
                    const badge = document.createElement('div'); badge.className='craft-badge';
                    const icon=document.createElement('img'); icon.src = `${BASE_URL}/apps/material-calc/img/exchange.png`; icon.style.width='12px'; icon.style.height='12px';
                    const span=document.createElement('span'); span.textContent=String(skillSummary.badge2);
                    badge.appendChild(icon); badge.appendChild(span); div.appendChild(badge);
                }
                div.title = `${visual|0} / ${c|0}`;
                div.addEventListener('click', ()=>{
                    if(k.startsWith('lv_exp')) openInventoryModal('lv_exp', k);
                    else if(k.startsWith('lv_limit')) openInventoryModal('lv_limit', k);
                    else if(k.startsWith('wp_exp')) openInventoryModal('wp_exp', k);
                    else if(k.startsWith('wp_limit')) openInventoryModal('wp_limit', k);
                    else if(k.startsWith('skill_')) openInventoryModal('skill', k);
                    else if(k==='konpaku_gem') openInventoryModal('gem', k);
                    else if(k.startsWith('md_')) openInventoryModal('mind', k);
                });
                div.appendChild(img); div.appendChild(txt); matGrid.appendChild(div);
            });
            // details toggle
            const detailBtn = document.createElement('button'); detailBtn.className='mini-btn'; detailBtn.textContent=t('viewDetails');
            actions.insertBefore(detailBtn, menuBtn);
            const details = document.createElement('div'); details.className='plan-details'; details.style.display='none';
            const mindBaseHtml = (()=>{
                const arr = (p.inputs.mindBase||[]).slice(0,12);
                const items = arr.map((on,idx)=>{
                    const gi = ((idx)%3)+1;
                    const op = on? '1' : '0.35';
                    return `<img src="${BASE_URL}/apps/material-calc/img/mind_base_${gi}.png" style="width:16px;height:16px;object-fit:contain;opacity:${op};margin-right:2px;">`;
                }).join('');
                return `<div class="mind-seq">${items}</div>`;
            })();
            details.innerHTML = `
                <div class="row"><label>${t('level')}</label><div>${p.inputs.lvFrom}</div><div>→</div><div>${p.inputs.lvTo}</div></div>
                <div class="row"><label>${t('weapon')}</label><div>${p.inputs.wpFrom}</div><div>→</div><div>${p.inputs.wpTo}</div></div>
                <div class="row"><label>${t('skills')}1</label><div>${p.inputs.s1From}</div><div>→</div><div>${p.inputs.s1To}</div></div>
                <div class="row"><label>${t('skills')}2</label><div>${p.inputs.s2From}</div><div>→</div><div>${p.inputs.s2To}</div></div>
                <div class="row"><label>${t('skills')}3</label><div>${p.inputs.s3From}</div><div>→</div><div>${p.inputs.s3To}</div></div>
                <div class="row"><label>HL/TH</label><div>${p.inputs.s4From}</div><div>→</div><div>${p.inputs.s4To}</div></div>
                <div class="row"><label>${t('mindBase')}</label><div style="grid-column: span 3; display:flex; align-items:center;">${mindBaseHtml}</div></div>
                <div class="row"><label>${t('mindStat1')}</label><div>${p.inputs.mindStat1From}</div><div>→</div><div>${p.inputs.mindStat1To}</div></div>
                <div class="row"><label>${t('mindStat2')}</label><div>${p.inputs.mindStat2From}</div><div>→</div><div>${p.inputs.mindStat2To}</div></div>
                <div class="row"><label>${t('mindSkill1')}</label><div>${p.inputs.mindSkill1From}</div><div>→</div><div>${p.inputs.mindSkill1To}</div></div>
                <div class="row"><label>${t('mindSkill2')}</label><div>${p.inputs.mindSkill2From}</div><div>→</div><div>${p.inputs.mindSkill2To}</div></div>
                <div class="row"><label>${t('mindAttr')}</label><div>${p.inputs.mindAttrFrom}</div><div>→</div><div>${p.inputs.mindAttrTo}</div></div>
            `;
            detailBtn.onclick = ()=>{
                // 모든 카드 상세를 동시에 토글
                const all = document.querySelectorAll('.plan-details');
                const show = details.style.display==='none';
                const display = show ? 'block':'none';
                all.forEach(d=> d.style.display = display);
            };

            card.appendChild(matGrid);
            card.appendChild(details);
            frag.appendChild(card);
        });
        root.innerHTML=''; root.appendChild(frag);

        // 필터 리셋 버튼 표시 여부 갱신
        const filterResetBtn = document.getElementById('plannerFilterReset');
        if(filterResetBtn){
            const anyOn = (fElement.length + fPosition.length + fRarity.length) > 0;
            filterResetBtn.style.display = anyOn ? '' : 'none';
        }
    }

    // 이벤트/초기화
    async function boot(){
        // 다국어 문구 적용
        STATE.lang = (typeof getCurrentLanguage==='function'?getCurrentLanguage():'kr') || 'kr';
        document.querySelectorAll('[data-lang-key]').forEach(el=>{
            const key = el.getAttribute('data-lang-key');
            el.textContent = t(key);
        });
        const ttl = document.getElementById('plannerTitle'); if(ttl) ttl.textContent = t('pageTitle');

        // spoiler 토글 (EN/JP만 표시)
        const spoilerWrap = document.getElementById('spoilerContainer');
        if(spoilerWrap) spoilerWrap.style.display = (STATE.lang==='en' || STATE.lang==='jp') ? 'flex' : 'none';
        const spoilerToggle = document.getElementById('spoilerToggle');
        if(spoilerToggle){ spoilerToggle.onchange = async () => { STATE.spoiler = spoilerToggle.checked; await loadCharacterData(); renderCharacterSelect(); }; }

        // 데이터 로드
        await loadCharacterData();
        await ensureCosts();

        updateHelpText();

        // 버튼 바인딩
        document.getElementById('addCharacterBtn').onclick = ()=>{ openModal('characterSelectModal'); renderCharacterSelect(); };

        const resetBtn = document.getElementById('resetBtn');
        if(resetBtn){
            resetBtn.textContent=t('reset');
        }
        resetBtn.onclick = ()=>{
            const title = t('resetConfirmTitle');
            const msg = t('resetConfirmMessage');
            // 기본 confirm 사용 (각 언어 메시지 지원)
            // 필요 시 커스텀 모달로 교체 가능
            if(window.confirm(`${title}\n\n${msg}`)){
                STATE.plans = [];
                STATE.inventory = {};
                saveState();
                window.location.reload();
                renderPlans();
            }
        };

        document.querySelectorAll('[data-close]').forEach(btn=> btn.addEventListener('click', e=>{
            const modal = e.target.closest('.modal'); if(modal) modal.setAttribute('aria-hidden','true');
        }));
        const collapse = document.getElementById('collapseSummary');
        const summaryHeader = document.querySelector('.summary-header');
        if(collapse){
            summaryHeader.onclick = ()=>{
                const grid = document.getElementById('summaryGrid');
                const open = collapse.getAttribute('aria-expanded') === 'true';
                collapse.setAttribute('aria-expanded', String(!open));
                grid.style.display = open ? 'none' : 'grid';
                collapse.textContent = open ? '▸' : '▾';
            };
        }
        // 필터 토글 버튼 (#plannerFilterToggle)과 내용 영역 (#plannerFilterContent)
        const filterToggleBtn = document.getElementById('plannerFilterToggle');
        const filterContent = document.getElementById('plannerFilterContent');
        if(filterToggleBtn && filterContent){
            filterToggleBtn.setAttribute('aria-expanded', String(false));
            filterContent.style.display = 'none';
            filterToggleBtn.onclick = ()=>{
                const open = filterContent.style.display !== 'none';
                const next = open ? 'none' : 'block';
                filterContent.style.display = next;
                filterToggleBtn.setAttribute('aria-expanded', String(next==='block'));
            };
        }

        // 정렬 드롭다운 유지/변경 처리
        const sortSelect = document.getElementById('plannerSortSelect');
        if(sortSelect){
            const saved = localStorage.getItem('material_planner_sort');
            if(saved) sortSelect.value = saved;
            sortSelect.onchange = ()=>{
                STATE.sortKey = sortSelect.value || 'release_desc';
                localStorage.setItem('material_planner_sort', STATE.sortKey);
                renderPlans();
            };
        }

        // 필터 변경 이벤트 바인딩 (element/position/rarity)
        const filterInputs = document.querySelectorAll('#plannerFilterContent input[type="checkbox"][name="element"], #plannerFilterContent input[type="checkbox"][name="position"], #plannerFilterContent input[type="checkbox"][name="rarity"]');
        filterInputs.forEach(el=> el.addEventListener('change', ()=>{ renderPlans(); }));
        // 필터 리셋 버튼
        const filterResetBtn = document.getElementById('plannerFilterReset');
        if(filterResetBtn){
            filterResetBtn.addEventListener('click', ()=>{
                document.querySelectorAll('#plannerFilterContent input[type="checkbox"]:checked').forEach(cb=>{ cb.checked = false; });
                renderPlans();
            });
        }

        // 저장 데이터 불러오기
        loadState();
        recalcTotals();
        renderSummary();
        renderPlans();

        // plan 길이가 0이고 ,인벤토리의 모든 값이 0인 경우 캐릭터 선택 모달 띄우기
        if(STATE.plans.length === 0 && Object.values(STATE.inventory).every(v => v === 0)){
            openModal('characterSelectModal'); renderCharacterSelect();
        }
    }

    window.MaterialPlanner = {
        init: boot,
        // 외부 백업/복구용 최소 공개 API
        exportState: function(){
            try{
                return {
                    lang: STATE.lang,
                    inventory: { ...STATE.inventory },
                    plans: STATE.plans.map(p=>({ name:p.name, rarity:p.rarity, inputs:p.inputs, include:(p.include!==false) }))
                };
            }catch(_){ return null; }
        },
        // 전체 상태 백업 (언어, 정렬, 스포일러, 인벤토리, 플랜)
        exportFullState: function(){
            try{
                return {
                    lang: STATE.lang,
                    sortKey: STATE.sortKey,
                    spoiler: !!STATE.spoiler,
                    inventory: { ...STATE.inventory },
                    plans: STATE.plans.map(p=>({ name:p.name, rarity:p.rarity, inputs:p.inputs, include:(p.include!==false) }))
                };
            }catch(_){ return null; }
        },
        importInventory: function(inv){
            if(!inv || typeof inv !== 'object') return false;
            // 허용된 키만 복사
            const allowed = Object.keys(STATE.inventory);
            for(const k of allowed){
                if(Object.prototype.hasOwnProperty.call(inv, k)){
                    const v = Number(inv[k] ?? 0);
                    STATE.inventory[k] = isNaN(v) ? 0 : v;
                }
            }
            // 재계산 및 저장
            recalcTotals();
            renderSummary();
            renderPlans();
            saveState();
            return true;
        },
        // 전체 상태 복원
        importFullState: function(full){
            try{
                if(!full || typeof full !== 'object') return false;
                // 언어
                if(typeof full.lang === 'string') STATE.lang = full.lang;
                // 정렬/스포일러
                if(typeof full.sortKey === 'string') STATE.sortKey = full.sortKey;
                if(typeof full.spoiler === 'boolean') STATE.spoiler = full.spoiler;
                // 인벤토리
                if(full.inventory && typeof full.inventory === 'object'){
                    const allowed = Object.keys(STATE.inventory);
                    for(const k of allowed){
                        if(Object.prototype.hasOwnProperty.call(full.inventory, k)){
                            const v = Number(full.inventory[k] ?? 0);
                            STATE.inventory[k] = isNaN(v) ? 0 : v;
                        }
                    }
                }
                // 플랜
                if(Array.isArray(full.plans)){
                    // characterData가 필요한 정규화/희귀도 보정을 위해 사전 로드 보장
                    // (boot 단계에서 이미 한 번 로드하지만, 안전하게 재시도)
                    // 동기 컨텍스트이므로 await는 사용하지 않음. 이미 로드된 데이터로 진행.
                    STATE.plans = full.plans
                        .filter(p=>p && typeof p.name==='string' && p.inputs)
                        .map(sp=>{
                            const nameKr = (typeof resolveCharacterKey==='function') ? resolveCharacterKey(sp.name) : sp.name;
                            const rarity = (sp.rarity || STATE.characterData?.[nameKr]?.rarity || 5);
                            const materials = estimateMaterials(sp.inputs, nameKr);
                            return {
                                id: Date.now()+ '_' + Math.random().toString(36).slice(2,7),
                                name: nameKr,
                                rarity,
                                image: `${BASE_URL}/assets/img/tier/${nameKr}.webp`,
                                inputs: sp.inputs,
                                materials,
                                include: (sp.include !== false)
                            };
                        });
                }
                // 재계산 및 렌더
                recalcTotals();
                renderSummary();
                renderPlans();
                // 저장 (로컬키는 기존 구조 유지)
                saveState();
                return true;
            }catch(_){ return false; }
        },
        getLang: function(){ return STATE.lang; }
    };
    
    // ===== 재고(보유량) 모달 =====
    async function openInventoryModal(type, focusKey){
        const form = document.getElementById('inventoryForm');
        const title = document.getElementById('inventoryModalTitle');
        const hint = document.getElementById('inventoryHint');
        if(!form) return;
        form.innerHTML = '';
        await ensureMaterialInfo();
        let rows = [];
        if(type==='lv_exp'){
            title.textContent = 'Character EXP'; hint.textContent='';
            rows = [
                { key:'lv_exp3', label:materialInfoFor('lv_exp3').name, icon:MATERIAL_ICONS.lv_exp3 },
                { key:'lv_exp2', label:materialInfoFor('lv_exp2').name, icon:MATERIAL_ICONS.lv_exp2 },
                { key:'lv_exp1', label:materialInfoFor('lv_exp1').name, icon:MATERIAL_ICONS.lv_exp1 }
            ];
        } else if(type==='lv_limit'){
            title.textContent = 'Character Level Break'; hint.textContent='';
            rows = [
                { key:'lv_limit3', label:materialInfoFor('lv_limit3').name, icon:MATERIAL_ICONS.lv_limit3 },
                { key:'lv_limit2', label:materialInfoFor('lv_limit2').name, icon:MATERIAL_ICONS.lv_limit2 },
                { key:'lv_limit1', label:materialInfoFor('lv_limit1').name, icon:MATERIAL_ICONS.lv_limit1 }
            ];
        } else if(type==='wp_exp'){
            title.textContent = 'Weapon EXP'; hint.textContent='';
            rows = [
                { key:'wp_exp3', label:materialInfoFor('wp_exp3').name, icon:MATERIAL_ICONS.wp_exp3 },
                { key:'wp_exp2', label:materialInfoFor('wp_exp2').name, icon:MATERIAL_ICONS.wp_exp2 },
                { key:'wp_exp1', label:materialInfoFor('wp_exp1').name, icon:MATERIAL_ICONS.wp_exp1 }
            ];
        } else if(type==='wp_limit'){
            title.textContent = 'Weapon Level Break'; hint.textContent='';
            rows = [
                { key:'wp_limit3', label:materialInfoFor('wp_limit3').name, icon:MATERIAL_ICONS.wp_limit3 },
                { key:'wp_limit2', label:materialInfoFor('wp_limit2').name, icon:MATERIAL_ICONS.wp_limit2 },
                { key:'wp_limit1', label:materialInfoFor('wp_limit1').name, icon:MATERIAL_ICONS.wp_limit1 }
            ];
        } else if(type==='skill'){
            title.textContent = 'Skills'; hint.textContent='';
            rows = [
                { key:'skill_lv_3', label:materialInfoFor('skill_lv_3').name, icon:MATERIAL_ICONS.skill_lv_3 },
                { key:'skill_lv_2', label:materialInfoFor('skill_lv_2').name, icon:MATERIAL_ICONS.skill_lv_2 },
                { key:'skill_lv_1', label:materialInfoFor('skill_lv_1').name, icon:MATERIAL_ICONS.skill_lv_1 },
                { key:'skill_rose', label:materialInfoFor('skill_rose').name, icon:MATERIAL_ICONS.skill_rose },
                { key:'skill_item1', label:materialInfoFor('skill_item1').name, icon:MATERIAL_ICONS.skill_item1 },
                { key:'skill_item2', label:materialInfoFor('skill_item2').name, icon:MATERIAL_ICONS.skill_item2 },
                { key:'skill_item3', label:materialInfoFor('skill_item3').name, icon:MATERIAL_ICONS.skill_item3 },
                { key:'skill_item4', label:materialInfoFor('skill_item4').name, icon:MATERIAL_ICONS.skill_item4 },
                { key:'skill_item5', label:materialInfoFor('skill_item5').name, icon:MATERIAL_ICONS.skill_item5 }
            ];
        } else if(type==='gem'){
            title.textContent = 'Konpaku Gem'; hint.textContent='';
            rows = [ { key:'konpaku_gem', label:'Gem', icon:MATERIAL_ICONS.konpaku_gem } ];
        } else if(type==='mind'){
            title.textContent = t('mind'); hint.textContent='';
            rows = [
                { key:'md_mercury', label:materialInfoFor('md_mercury').name, icon:MATERIAL_ICONS.md_mercury },
                { key:'md_bell', label:materialInfoFor('md_bell').name, icon:MATERIAL_ICONS.md_bell },
                { key:'md_stat1', label:materialInfoFor('md_stat1').name, icon:MATERIAL_ICONS.md_stat1 },
                { key:'md_stat2', label:materialInfoFor('md_stat2').name, icon:MATERIAL_ICONS.md_stat2 },
                { key:'md_skill1', label:materialInfoFor('md_skill1').name, icon:MATERIAL_ICONS.md_skill1 },
                { key:'md_skill2', label:materialInfoFor('md_skill2').name, icon:MATERIAL_ICONS.md_skill2 }
            ];
        }
        const frag = document.createDocumentFragment();
        // 헤더: 선택한 재료의 큰 아이콘 + 이름/설명 (가능하면)
        if(focusKey){
            const header=document.createElement('div'); header.className='inv-header';
            const icon=document.createElement('img'); icon.className='inv-header-icon'; icon.src = MATERIAL_ICONS[focusKey] || MATERIAL_ICONS.money;
            const textBox=document.createElement('div'); textBox.className='inv-header-text';
            const firstRow = rows.find(r=>r.key===focusKey) || rows[0];
            const info = materialInfoFor(focusKey, firstRow?.label || focusKey);
            const nm=document.createElement('div'); nm.className='inv-header-name'; nm.textContent = info.name;
            const ds=document.createElement('div'); ds.className='inv-header-desc'; ds.textContent = info.desc || '';
            textBox.appendChild(nm); textBox.appendChild(ds);
            header.appendChild(icon); header.appendChild(textBox);
            frag.appendChild(header);
        }
        rows.forEach(r=>{
            const row = document.createElement('div'); row.className='row inv-row';
            const img = document.createElement('img'); img.src = r.icon; img.style.width='28px'; img.style.height='28px';
            const lab = document.createElement('label'); lab.textContent = r.label; lab.style.minWidth='80px';
            const input = document.createElement('input'); input.type='number'; input.min='0'; input.step='1'; input.value = String(STATE.inventory[r.key]||0); input.dataset.key=r.key;
            row.appendChild(img); row.appendChild(lab); row.appendChild(document.createTextNode(': ')); row.appendChild(input);
            // slider (single) under the row
            const slider = document.createElement('input'); slider.type='range'; slider.min='0';
            const defaultMax = (r.key==='konpaku_gem') ? 9999999 : 9999;
            slider.max=String(Math.max( input.value|0, defaultMax )); slider.step='1'; slider.value = input.value;
            slider.className = 'inventory-slider';
            slider.addEventListener('input', ()=>{ input.value = slider.value; });
            input.addEventListener('change', ()=>{ slider.value = input.value; });
            const wrap = document.createElement('div'); wrap.className='inv-wrap'; wrap.appendChild(row); wrap.appendChild(slider);
            frag.appendChild(wrap);
        });
        form.appendChild(frag);
        const saveBtn = document.getElementById('saveInventoryBtn');
        saveBtn.onclick = ()=>{
            // 입력값 저장
            form.querySelectorAll('input[type="number"]').forEach(el=>{
                const k = el.dataset.key; const v = Math.max(0, Math.floor(Number(el.value||0)));
                STATE.inventory[k] = v;
            });
            closeModal('inventoryModal');
            saveState();
            renderSummary(); renderPlans();
        };
        openModal('inventoryModal');
    }

    // 시각용 보유수량(자동 충당 변환 적용) 계산
    function computeVisualOwned(key, need, inv){
        // 로컬 복사해 변환 시뮬레이션 (입력 원본은 불변)
        const e1=inv.lv_exp1|0, e2=inv.lv_exp2|0, e3=inv.lv_exp3|0;
        const l1=inv.lv_limit1|0, l2=inv.lv_limit2|0, l3=inv.lv_limit3|0;
        let exp = { e1, e2, e3 };
        let lim = { l1, l2, l3 };

        // 먼저 돌파: 상향만 (1→2, 2→3) 3:1
        // 3의 필요치 충족을 위해 2 초과분을 상향, 2 필요치 충족 위해 1 초과분 상향
        function consumeLimit(k, n){ // k: 'l1'/'l2'/'l3'
            if(n<=0) return 0;
            if(k==='l3'){
                return Math.min(n, lim.l3);
            } else if(k==='l2'){
                let own = lim.l2;
                let take = Math.min(n, own);
                own -= take; n -= take; lim.l2 = own;
                if(n>0){
                    // 상향 제작
                    const craft = Math.min(Math.floor(lim.l1/3), n);
                    lim.l1 -= craft*3; take += craft; n -= craft;
                }
                return take;
            } else {
                // l1은 하향 대상 없음, 자체 소비만
                let take = Math.min(n, lim.l1);
                lim.l1 -= take; return take;
            }
        }

        function visualForLimit(targetKey, required){
            if(targetKey==='lv_limit3'){
                // 직접 보유 우선
                const direct = Math.min(required, lim.l3);
                let remain = required - direct;
                if(remain<=0) return direct;
                // 2와 1을 상향해 3을 제작 (3:1, 1은 먼저 2로 3:1)
                const totalL2Avail = lim.l2 + Math.floor(lim.l1/3);
                const craftable = Math.floor(totalL2Avail / 3);
                const craft = Math.min(remain, craftable);
                return direct + craft;
            }
            if(targetKey==='lv_limit2'){
                const direct = Math.min(required, lim.l2);
                let remain = required - direct;
                if(remain<=0) return direct;
                const craftFromL1 = Math.min(remain, Math.floor(lim.l1/3));
                return direct + craftFromL1;
            }
            if(targetKey==='lv_limit1'){
                return Math.min(required, lim.l1);
            }
            return 0;
        }

        function visualForExp(targetKey, need){
            // 우선 동일단계 직접 사용, 부족하면 상위에서 하향 분해(1000→200×5, 4000→1000×4)
            if(targetKey==='lv_exp3'){
                const direct = Math.min(need, exp.e3); exp.e3 -= direct; return direct;
            }
            if(targetKey==='lv_exp2'){
                let got = Math.min(need, exp.e2); exp.e2 -= got; let rem = need - got;
                if(rem>0){ // 상위에서 하향: 4000→1000 (1:4)
                    const craft = Math.min(exp.e3*4, rem); // e3 한 개당 4개 생산
                    const useE3 = Math.ceil(craft/4);
                    exp.e3 -= useE3; got += craft;
                }
                return got;
            }
            if(targetKey==='lv_exp1'){
                let got = Math.min(need, exp.e1); exp.e1 -= got; let rem = need - got;
                if(rem>0){ // 1000→200 (1:5)
                    const craftFromE2 = Math.min(exp.e2*5, rem);
                    const useE2 = Math.ceil(craftFromE2/5);
                    exp.e2 -= useE2; got += craftFromE2; rem -= craftFromE2;
                }
                if(rem>0){ // 4000→1000→200 (1:20)
                    const craftFromE3 = Math.min(exp.e3*20, rem);
                    const useE3 = Math.ceil(craftFromE3/20);
                    exp.e3 -= useE3; got += craftFromE3; rem -= craftFromE3;
                }
                return got;
            }
            return 0;
        }

        if(key.startsWith('lv_limit')){
            const needCount = need|0; // 각 칩의 필요한 수량
            if(key==='lv_limit3'){
                // 먼저 직접 보유 사용
                let take = Math.min(needCount, lim.l3); lim.l3 -= take; let rem = needCount - take;
                if(rem>0){ // 2에서 상향
                    const fromL2 = Math.min(rem, lim.l2 + Math.floor(lim.l1/3));
                    // consume in visual model
                    const crafted = visualForLimit('lv_limit2', rem);
                    return take + crafted;
                }
                return take;
            }
            if(key==='lv_limit2') return visualForLimit('lv_limit2', needCount);
            if(key==='lv_limit1') return visualForLimit('lv_limit1', needCount);
        }
        if(key.startsWith('lv_exp')){
            const needCount = need|0;
            if(key==='lv_exp3') return visualForExp('lv_exp3', needCount);
            if(key==='lv_exp2') return visualForExp('lv_exp2', needCount);
            if(key==='lv_exp1') return visualForExp('lv_exp1', needCount);
        }
        // 기본은 원본 보유
        return inv[key]||0;
    }

    // 그룹형 시각 보유치(돌파) 계산: 1→2→3 상향 변환만 허용
    function computeLimitVisual(need, inv){
        let l1 = inv.lv_limit1|0, l2 = inv.lv_limit2|0, l3 = inv.lv_limit3|0;
        const n1 = need.n1|0, n2 = need.n2|0, n3 = need.n3|0;

        // 0) 모두 충분하면 변환 없음
        if (l1 >= n1 && l2 >= n2 && l3 >= n3) {
            return { lv_limit1: n1, lv_limit2: n2, lv_limit3: n3 };
        }

        // 1) 1 충족(직접만)
        const visual1 = Math.min(n1, l1);
        const surplus1 = Math.max(0, l1 - n1);

        // 2) 1의 초과분을 2로 상향 (3:1)
        const addTo2 = Math.floor(surplus1 / 3);
        const eff2 = l2 + addTo2;

        // 3) 2가 목표치보다 3개 이상 초과하지 않으면 스톱
        if (eff2 <= n2 + 2) {
            const visual2 = Math.min(eff2, n2);
            const visual3 = Math.min(l3, n3);
            return { lv_limit1: visual1, lv_limit2: visual2, lv_limit3: visual3 };
        }

        // 4) 2의 초과분을 3으로 상향 (3:1)
        const surplus2 = eff2 - n2; // >= 3
        let convertTo3 = Math.floor(surplus2 / 3);

        // 5) 3 필요 초과 시 초과분을 2에게 *3으로 되돌림
        const maxNeedFrom2 = Math.max(0, n3 - l3);
        if (convertTo3 > maxNeedFrom2) {
            convertTo3 = maxNeedFrom2; // 되돌림은 시각 보유치에선 2를 n2로 보장하면 충분
        }

        const visual3 = Math.min(n3, l3 + convertTo3);
        const visual2 = Math.min(eff2, n2); // 2는 항상 목표 충족으로 표시
        return { lv_limit1: visual1, lv_limit2: visual2, lv_limit3: visual3 };
    }

    // 그룹형 시각 보유치(EXP) 계산: 하향/상향 모두 허용해 부족분 충당
    function computeExpVisual(need, inv, wp=false){
        const W1 = wp? 100: 200, W2 = wp? 500: 1000, W3 = wp? 2000: 4000;
        const e1 = inv.lv_exp1|0, e2 = inv.lv_exp2|0, e3 = inv.lv_exp3|0;
        const n1 = need.n1|0, n2 = need.n2|0, n3 = need.n3|0;

        let A = e3*W3 + e2*W2 + e1*W1;
        const R = n3*W3 + n2*W2 + n1*W1;

        if (A >= R) {
            return { lv_exp1: n1, lv_exp2: n2, lv_exp3: n3 };
        }

        // 부족한 경우, 총량 A로 상위부터 그리디로 채움 → 나머지로 2, 1 채우기
        let v3 = Math.min(n3, Math.floor(A / W3));
        A -= v3 * W3;
        let v2 = Math.min(n2, Math.floor(A / W2));
        A -= v2 * W2;
        let v1 = Math.min(n1, Math.floor(A / W1));

        return { lv_exp1: v1, lv_exp2: v2, lv_exp3: v3 };
    }
    function chipLevelClass(key){
        if(key==='lv_limit1' || key==='lv_exp1' || key==='wp_limit1' || key==='wp_exp1' || key==='skill_lv_1' || key==='md_stat1' || key==='md_skill1') return 'lv1';
        if(key==='lv_limit2' || key==='lv_exp2' || key==='wp_limit2' || key==='wp_exp2' || key==='skill_lv_2' || key==='md_skill2' || key==='md_stat2') return 'lv2';
        if(key==='lv_limit3' || key==='lv_exp3' || key==='wp_limit3' || key==='wp_exp3' || key==='skill_lv_3') return 'lv3';
        return 'default';
    }
    // 재료 정렬 우선순위 (요청 순서 적용)
    function materialSortOrder(key){
        // character exp (높은 등급 우선: 3→2→1)
        if(key==='lv_exp3') return 201;
        if(key==='lv_exp2') return 202;
        if(key==='lv_exp1') return 203;
        // character limit (3→2→1)
        if(key==='lv_limit3') return 301;
        if(key==='lv_limit2') return 302;
        if(key==='lv_limit1') return 303;
        // weapon exp (3→2→1)
        if(key==='wp_exp3') return 801;
        if(key==='wp_exp2') return 802;
        if(key==='wp_exp1') return 803;
        // weapon limit (3→2→1)
        if(key==='wp_limit3') return 901;
        if(key==='wp_limit2') return 902;
        if(key==='wp_limit1') return 903;
        // skills (무기와 mind 사이에 위치)
        if(key==='skill_lv_3') return 501;
        if(key==='skill_lv_2') return 502;
        if(key==='skill_lv_1') return 503;
        if(key==='skill_item1') return 402;
        if(key==='skill_item2') return 403;
        if(key==='skill_item3') return 404;
        if(key==='skill_item4') return 405;
        if(key==='skill_item5') return 406;
        if(key==='skill_rose') return 401;
        // mind base / lv / stat / skill
        if(key==='md_mercury') return 106; // mind base(기초 재화)
        if(key==='md_bell') return 105;   // mind lv(속성 강화)
        if(key==='md_stat1') return 101;
        if(key==='md_stat2') return 102;
        if(key==='md_skill1') return 103;
        if(key==='md_skill2') return 104;
        if(key==='konpaku_gem') return 50; // 통화는 항상 상단에 가까이 노출
        return 9999;
    }
    // 합산용: 돌파 변환 배지(3에 표시할 제작 수) 포함한 결과
    function computeLimitSummary(need, inv){
        let l1 = inv.lv_limit1|0, l2 = inv.lv_limit2|0, l3 = inv.lv_limit3|0;
        const n1 = need.n1|0, n2 = need.n2|0, n3 = need.n3|0;
        // 모두 충분 → 변환 없음
        if(l1>=n1 && l2>=n2 && l3>=n3){
            return { visual:{ lv_limit1:n1, lv_limit2:n2, lv_limit3:n3 }, badge3:0, badge2:0 };
        }
        const visual1 = Math.min(n1, l1);
        const surplus1 = Math.max(0, l1 - n1);
        const addTo2 = Math.floor(surplus1/3);
        const eff2 = l2 + addTo2;
        const deficit2 = Math.max(0, n2 - l2);
        const used2 = Math.min(addTo2, deficit2);
        if(eff2 <= n2 + 2){
            return { visual:{ lv_limit1:visual1, lv_limit2:Math.min(eff2,n2), lv_limit3:Math.min(l3,n3) }, badge3:0, badge2:used2 };
        }
        const surplus2 = eff2 - n2;
        let convertTo3 = Math.floor(surplus2/3);
        const maxNeedFrom2 = Math.max(0, n3 - l3);
        let badge3 = convertTo3;
        if(convertTo3 > maxNeedFrom2){
            badge3 = maxNeedFrom2;
        }
        const visual3 = Math.min(n3, l3 + badge3);
        const visual2 = n2;
        return { visual:{ lv_limit1:visual1, lv_limit2:visual2, lv_limit3:visual3 }, badge3, badge2:used2 };
    }

    // 포맷: 1000 -> 1k, 12050 -> 12.1k 1000000 -> 1m
    function formatK(n){
        if(!Number.isFinite(n)) return String(n||0);
        if(Math.abs(n) < 1000) return String(n);
        if(n < 1000000){
            const v = n/1000;
            const s = (v>=100)? v.toFixed(0) : v.toFixed(1);
            return s + 'k';
        }
        const v = n/1000000;
        const s = (v>=100)? v.toFixed(0) : v.toFixed(1);
        return s + 'm';
    }
    // 로컬 저장/복구
    function saveState(){
        try{
            const data = {
                inventory: STATE.inventory,
                plans: STATE.plans.map(p=>({ name:p.name, rarity:p.rarity, inputs:p.inputs, include: (p.include !== false) }))
            };
            localStorage.setItem('materialPlannerStateV1', JSON.stringify(data));
        }catch(_){/* ignore */}
    }
    function loadState(){
        try{
            const raw = localStorage.getItem('materialPlannerStateV1');
            if(!raw) return;
            const data = JSON.parse(raw);
            if(data.inventory) STATE.inventory = { ...STATE.inventory, ...data.inventory };
            if(Array.isArray(data.plans)){
                STATE.plans = data.plans.map(sp=>{
                    const materials = estimateMaterials(sp.inputs, sp.name);
                    return {
                        id: Date.now()+ '_' + Math.random().toString(36).slice(2,7),
                        name: sp.name,
                        rarity: sp.rarity,
                        image: `${BASE_URL}/assets/img/tier/${sp.name}.webp`,
                        inputs: sp.inputs,
                        materials,
                        include: (sp.include !== false)
                    };
                });
            }
        }catch(_){/* ignore */}
    }
})();


