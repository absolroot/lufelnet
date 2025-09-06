// 공통 I18N/번역 유틸 - 페이지 전역에서 재사용
// 전역 의존: window.getCurrentLanguage (language-router.js), APP_VERSION, BASE_URL

(function(){
    'use strict';

    const I18NUtils = {
        getCurrentLanguageSafe() {
            try { return (typeof getCurrentLanguage === 'function') ? getCurrentLanguage() : 'kr'; } catch(_) { return 'kr'; }
        },
        

        // 스탯 단어 번역 테이블 (UI 전역 적용)
        statTranslations: {
            kr: {
                '생명': '생명',
                '생명력': '생명',
                '대미지보너스': '대미지 보너스',
                '크리티컬확률': '크리티컬 확률',
                '크리티컬효과': '크리티컬 효과',
                '효과 명중': '효과 명중',
                '치료 효과':'치료효과'
            },
                
            en: {
                '최대 생명 증가': 'Max HP Up',
                '최대 생명':'Max HP',
                '생명':'HP',
                '생명력':'HP',
                '공격력':'Attack',
                '대미지 보너스':'DMG Bonus(ATK Mult)',
                '대미지보너스':'DMG Bonus(ATK Mult)',
                '크리티컬 확률':'Crit Rate',
                '크리티컬확률':'Crit Rate',
                '크리티컬 효과':'Crit Mult',
                '크리티컬효과':'Crit Mult',
                '관통':'Pierce Rate',
                '방어력 감소':'Defense Reduction',
                '방어력':'Defense',
                '방어':'Defense',
                '효과 명중':'Ailment Accuracy',
                '효과명중':'Ailment Accuracy',
                '속도':'Speed',
                '치료효과':'Healing Effect',
                '치료':'Healing',
                '추격':'Follow-up',
                '효과 저항':'Effect Resi',
                '효과저항':'Effect Resi',
                'SP 회복':'SP Recovery',
                'SP회복':'SP Recovery',
                '해명의힘':'Navi Power',
                '해명의 힘':'Navi Power',
                '직책':'Labor',
                '마이팰리스 평점':'My Palace Rating',
                '마이팰리스':'My Palace',
                '실드 효과':'Shield Effect',
                '대미지감면':'Damage Reduction',
                '총기':'Gun Shot',
                '총격':'Gun Shot',
                '의식0': 'A0',
                '의식1': 'A1',
                '의식2': 'A2',
                '의식3': 'A3',
                '의식4': 'A4',
                '의식5': 'A5',
                '의식6': 'A6',
                '의식':'Awareness',
                '전용무기':'Exclusive Weapon',
                '4성 무기':'4 Star Weapon',
                '패시브':'Passive',
                '실드효과':'Shield Effect',
                '추가효과':'Follow-up',
                '추가 효과':'Follow-up',
                '반격':'CounterAttack',
                '받는 대미지 증가':'Damage Taken',
                '수면':'Sleep',
                '원소 이상':'Element Alignment',
                '실드':'Shield',
                '주원':'Curse',
                '지속 대미지':'DOT',
                '화상':'Burn',
                '화염 속성':'Fire',
                '축복':'Blessing',
                '풍습':'Windswept',
                '동결':'Freeze',
                '감전':'Shock',
                '공격받을 확률 증가':'Taunt',
                '전격':'Electric',
                '망각':'Forget',
                '감소':'Decrease',
                '제거':'Remove',
                '크리티컬':'Critical',
                '차지':'Charge',
                '추가 턴':'Additional Turn',
                '디버프':'Debuff',
                '지속 회복':'DOT Recovery',
                '부활':'Revive',
                '변신':'Transform',
                '약점 변경':'Weakness Change',
                '폼 체인지':'Form Change',
                '스킬마스터':'Skill Master',
                '빙결 속성':'Ice',
                '대미지 축적':'Damage Accumulation',
                '다운':'Down',
                '테우르기아 충전':'Theurgy Charge',
                '테우르기아':'Theurgy',
                '아이템':'Item',
                '미정':'TBD',
                '1턴':'1 Turn',
                '2턴':'2 Turns',
                '3턴':'3 Turns',
                '4턴':'4 Turns',
                '5턴':'5 Turns',
                '6턴':'6 Turns',
                '개조': 'R',
                '스킬': 'Skill',
                '레벨': 'Level',
                '중첩': 'Stack',
                '스택': 'Stack',
                '광역': 'AOE',
                '단일': 'Single',
                '자신': 'Self',
                '심상5': 'Minds 5',
                '심상': 'Mindscape',
                '원더': 'Wonder',
                '계시': 'Revelation',
                '공통': 'Common',
                '페르소나': 'Persona',
                '주권': 'Control',
                '여정': 'Departure',
                '직책': 'Labor',
                '결심': 'Resolve',
                '자유': 'Freedom',
                '개선': 'Success',
                '희망': 'Hope'
            },
                
            jp: {
                '최대 생명 증가':'最大HP上昇',
                '최대 생명':'最大HP',
                '생명':'HP',
                '생명력':'HP',
                '공격력':'攻撃力',
                '대미지 보너스':'攻撃倍率+',
                '대미지보너스':'攻撃倍率+',
                '크리티컬 확률':'CRT発生率',
                '크리티컬확률':'CRT発生率',
                '크리티컬 효과':'CRT倍率',
                '크리티컬효과':'CRT倍率',
                '관통':'貫通',
                '방어력 감소':'防御力減少',
                '방어력':'防御力',
                '방어':'防御力',
                '효과 명중':'状態異常命中',
                '효과명중':'状態異常命中',
                '속도':'速さ',
                '치료효과':'HP回復量',
                '치료':'治療',
                '추격':'追撃',
                '효과 저항':'効果耐性',
                '효과저항':'効果耐性',
                'SP 회복':'SP 回復',
                'SP회복':'SP 回復',
                '해명의힘':'ステータス強化',
                '해명의 힘':'ステータス強化',
                '직책':'職責',
                '마이팰리스 평점':'マイパレス評価',
                '마이팰리스':'マイパレス',
                '실드 효과':'シールド効果',
                '대미지감면':'ダメージ減少',
                '총기':'銃撃',
                '총격':'銃撃',
                '의식':'意識',
                '전용무기':'専用武器',
                '4성 무기':'4星武器',
                '패시브':'パッシブ',
                '실드효과':'シールド効果',
                '추가효과':'意識奏功',
                '추가 효과':'意識奏功',
                '반격':'反撃',
                '받는 대미지 증가':'ダメージ受け',
                '수면':'睡眠',
                '원소 이상':'元素異常',
                '실드':'シールド',
                '주원':'呪怨',
                '지속 대미지':'DOT',
                '화상':'燃焼',
                '화염 속성':'火炎',
                '축복':'祝福',
                '풍습':'風襲',
                '동결':'凍結',
                '공격받을 확률 증가':'挑発',
                '감전':'感電',
                '전격':'電撃',
                '망각':'忘却',
                '감소':'減少',
                '제거':'除去',
                '크리티컬':'クリティカル',
                '차지':'チャージ',
                '추가 턴':'追加ターン',
                '디버프':'デバフ',
                '지속 회복':'DOT回復',
                '부활':'復活',
                '변신':'変身',
                '약점 변경':'弱点変更',
                '폼 체인지':'フォームチェンジ',
                '스킬마스터':'スキルマスター',
                '빙결 속성':'氷結',
                '대미지 축적':'ダメージ蓄積',
                '다운':'ダウン',
                '테우르기아 충전':'テウルギアャージ',
                '테우르기아':'テウルギア',
                '아이템':'アイテム',
                '미정':'未定',
                '가드':'ダウン値',
                '벨벳 룸의 시련':'ベルベットルームの試練',
                '1턴':'1ターン',
                '2턴':'2ターン',
                '3턴':'3ターン',
                '4턴':'4ターン',
                '5턴':'5ターン',
                '6턴':'6ターン',
                '의식0': '凸0',
                '의식1': '凸1',
                '의식2': '凸2',
                '의식3': '凸3',
                '의식4': '凸4',
                '의식5': '凸5',
                '의식6': '凸6',
                '스킬': 'スキル',
                '레벨': 'レベル',
                '중첩': 'スタック',
                '스택': 'スタック',
                '개조0': '武器凸0',
                '개조0&1': '武器凸0&1',
                '개조1&2': '武器凸1&2',
                '개조2&3': '武器凸2&3',
                '개조3&4': '武器凸3&4',
                '개조4&5': '武器凸4&5',
                '개조5&6': '武器凸5&6',
                '개조6': '武器凸6',
                '광역': '全体',
                '단일': '単体',
                '자신': '自分',
                '심상5': 'イメジャリー5',
                '심상': 'イメジャリー',
                '원더': 'ワンダー',
                '계시': '啓示',
                '공통': '共通',
                '페르소나': 'ペルソナ'
            }
        },

        // 요소 내 텍스트의 스탯 단어 번역
        translateStatTexts(root=document){
            const lang = this.getCurrentLanguageSafe();
            const dict = this.statTranslations[lang] || {};
            const all = root.querySelectorAll('*');
            all.forEach(el => {
                if (el.children.length === 0) {
                    let text = el.textContent;
                    if (!text) return;
                    let changed = false;
                    Object.keys(dict).forEach(ko => {
                        const tr = dict[ko];
                        if (ko !== tr && text.includes(ko)) {
                            text = text.replace(new RegExp(ko,'g'), tr);
                            changed = true;
                        }
                    });
                    if (changed) el.textContent = text;
                }
            });
            // 특정 클래스들 빠르게 재적용
            document.querySelectorAll('.stat-label, .value, .option-row .value').forEach(el => {
                let text = el.textContent || '';
                let changed = false;
                Object.keys(dict).forEach(ko => {
                    const tr = dict[ko];
                    if (ko !== tr && text.includes(ko)) {
                        text = text.replace(new RegExp(ko,'g'), tr);
                        changed = true;
                    }
                });
                if (changed) el.textContent = text;
            });
        },
        

        // 배틀 진입 텍스트 내 심상5 언어치환
        replaceMindText(text){
            const lang = this.getCurrentLanguageSafe();
            const map = { kr: '심상5', en: 'Mindscape5', jp: 'イメジャリー5' };
            return text.replace(/심상\s?5/g, map[lang] || '심상5');
        }
    };

    // 전역 노출
    window.I18NUtils = I18NUtils;
})();


