(function(){
    'use strict';

    function getLangSafe() {
        try { return (typeof getCurrentLanguage === 'function') ? getCurrentLanguage() : 'kr'; } catch(_) { return 'kr'; }
    }

    function showHelpModal(helpType) {
        const modal = document.getElementById('help-modal');
        const modalTitle = document.getElementById('help-modal-title');
        const modalDescription = document.getElementById('help-modal-description');
        const currentLang = getLangSafe();

        const helpContent = {
            'revelation': {
                'kr': { title: '계시', content: '추천하는 계시 목록, 파티 구성 및 적에 따라 추천 계시는 바뀔 수 있으니 각 계시를 클릭해 효과를 읽고 알맞은 계시를 선택하세요.' },
                'en': { title: 'Revelations', content: 'Recommended revelation list. The recommended revelations may change depending on party composition and enemies, so click on each revelation to read the effects and select the appropriate revelation.' },
                'jp': { title: '啓示', content: '推奨される啓示リスト。パーティ構成や敵によって推奨啓示は変わる可能性があるため、各啓示をクリックして効果を読み、適切な啓示を選択してください。' }
            },
            'main-option': {
                'kr': { title: '주 옵션', content: '각 계시 위치별 추천하는 옵션, 의식(Awareness) 및 무기, 파티 구성에 따라 우선 순위가 바뀔 수 있습니다.' },
                'en': { title: 'Main Options', content: 'Recommended options for each revelation position. Priority may change depending on Awareness and weapons, party composition.' },
                'jp': { title: '主属性', content: '各啓示位置別の推奨オプション。意識や武器, パーティ構成によって優先順位が変わる場合があります。' }
            },
            'sub-option': {
                'kr': { title: '부 옵션', content: `캐릭터 별 계시에서 우선되는 부 옵션을 의미합니다. 부 옵션의 범위는 다음 링크(<a href="../../article/Revelation-Options/?lang=${currentLang}" target="_blank">lufel.net/article/Revelation-Options</a>)를 참고하세요. 의식 및 무기, 파티 구성에 따라 우선 순위가 바뀔 수 있습니다.` },
                'en': { title: 'Sub Options', content: `Refers to the sub-options that are prioritized in revelations for each character. Please refer to the following link for the range of sub-options: <a href="../../article/Revelation-Options/?lang=${currentLang}" target="_blank">lufel.net/article/Revelation-Options</a>. Priority may change depending on Awareness and weapons, party composition.` },
                'jp': { title: '副属性', content: `怪盗別啓示で優先される副属性を意味します。副属性の範囲は次のリンク(<a href="../../article/Revelation-Options/?lang=${currentLang}" target="_blank">lufel.net/article/Revelation-Options</a>)を参考にしてください。意識や武器, パーティ構成によって優先順位が変わる場合があります。` }
            },
            'recommended-stats': {
                'kr': { title: '권장 육성 스탯', content: '캐릭터의 스킬에 스탯의 영향도를 받는 형태가 있을 경우 최대 효과를 보기 위한 스테이터스. 가능하면 충족하는 것을 추천드립니다. (전투 기준)' },
                'en': { title: 'Recommended Training Stats', content: 'Status required to achieve maximum effect when character skills are affected by stats. Recommend meeting these requirements if possible. (Based on during battle)' },
                'jp': { title: '推奨育成ステータス', content: '怪盗のスキルにステータスの影響を受ける形がある場合、最大効果を得るためのステータス。可能であれば満たすことをお勧めします。(戦闘中の基準)' }
            },
            'battle-entry': {
                'kr': { title: '전투 진입 시 +', content: '전투에 진입 시 버프 등으로 권장 육성 스탯에 영향을 주는 요소들입니다.' },
                'en': { title: 'Battle Entry +', content: 'Elements that affect recommended training stats through buffs when entering battle.' },
                'jp': { title: '戦闘進入時 +', content: '戦闘に進入時、バフなどで推奨育成ステータスに影響を与える要素です。' }
            },
            'skill': {
                'kr': { title: '스킬', content: '8레벨은 주요하지 않은 스킬, MAX는 가능하면 최대 레벨, 별표는 주요 스킬입니다.' },
                'en': { title: 'Skills', content: 'Level 8 for non-essential skills, MAX for skills that should be maxed if possible, Star for key skills.' },
                'jp': { title: 'スキル', content: '8レベルは重要でないスキル、MAXは可能であれば最大レベル、星印は主要スキルです。' }
            },
            'mind-lv5': {
                'kr': { title: '심상 (LV 5)', content: '별표는 가능하면 먼저 찍어야할 우선 순위 심상입니다.' },
                'en': { title: 'Mindscape (LV 5)', content: 'Star indicates priority mind images that should be taken first if possible.' },
                'jp': { title: 'イメジャリー (LV 5)', content: '星印は可能であれば先に取るべき優先順位イメジャリーです。' }
            },
            'base-stats': {
                'kr': { title: '기초 스탯', content: '레벨1 기준입니다. 각 캐릭터는 소숫점 스테이터스를 가지고 있습니다. 소숫점 값은 인게임 내에서는 공개되지 않습니다.' },
                'en': { title: 'Base Stats', content: 'These are based on Level 1. Each character internally has fractional stats. These precise values are not exposed in-game.' },
                'jp': { title: '基礎ステータス', content: 'レベル1基準です。各キャラクターは内部的に小数点のステータスを持っています。これらの詳細値はゲーム内では公開されません。' }
            },
            'awake7': {
                'kr': { title: '잠재력 LV7', content: '잠재력이 LV7 일 때(최대 레벨 80) 얻은 보너스 스탯의 최종 합산 값입니다. 예로 크리티컬 확률이 22.4%일 경우 기본 5%에 17.4%를 추가로 얻은 결과입니다.' },
                'en': { title: 'Hidden Ability LV7', content: 'The final total of the bonus stats obtained at Hidden Ability LV7 (character level 80). For example, if CRIT Rate shows 22.4%, it means an additional 17.4% was gained on top of the base 5%.' },
                'jp': { title: '潜在能力 LV7', content: '潜在能力がLV7（キャラLv80）で得られるボーナスステータスの最終合計値です。例えばCRT発生率が22.4%の場合、17.4%が追加で得られた結果です。' }
            },
            'recommended-operation': {
                'kr': { title: '추천 운영', content: '의식(Awareness) 단계 별 기본 운영 예시입니다. 적과 파티에 따라 순서는 변동될 수 있습니다. 상위 의식 사이클이 별도로 적혀있지 않다면 의식 증가에 사이클이 영향을 받지 않습니다.' },
                'en': { title: 'Skill Rotation', content: 'Basic cycle examples for each Awareness stage. The order may vary depending on enemies and party composition. If no separate higher awareness cycle is written, it means there are no additional cycle changes as awareness increases.' },
                'jp': { title: 'スキル利用順', content: '意識(Awareness)段階別基本サイクル例です。敵とパーティによって順序は変動する可能性があります。上位意識サイクルが別途記載されていなければ、別途のサイクル変化は意識増加に伴ってないという話です。' }
            }
        };

        const content = helpContent[helpType] && helpContent[helpType][currentLang] ? helpContent[helpType][currentLang] : helpContent[helpType]?.kr;
        if (content) {
            if (modalTitle) modalTitle.textContent = content.title;
            if (modalDescription) modalDescription.innerHTML = content.content;
        }
        if (modal) {
            modal.classList.add('show');
            document.body.style.overflow = 'hidden';
        }
    }

    function closeHelpModal() {
        const modal = document.getElementById('help-modal');
        if (modal) modal.classList.remove('show');
        document.body.style.overflow = '';
    }

    // 이벤트 바인딩 (클릭/키보드)
    document.addEventListener('click', function(e) {
        if (e.target.closest('.help-close')) {
            closeHelpModal();
            return;
        }
        const modal = document.getElementById('help-modal');
        if (modal && modal.classList.contains('show') && !e.target.closest('.help-modal-content') && !e.target.closest('.help-icon')) {
            closeHelpModal();
        }
    });
    document.addEventListener('keydown', function(e) {
        const modal = document.getElementById('help-modal');
        if (e.key === 'Escape' && modal && modal.classList.contains('show')) {
            closeHelpModal();
        }
    });

    // 전역 노출 (onclick에서 사용)
    window.showHelpModal = showHelpModal;
    window.closeHelpModal = closeHelpModal;
})();

