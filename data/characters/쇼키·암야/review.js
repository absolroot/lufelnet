(function () {
    function stellatoChart(lang) {
        const copy = {
            kr: {
                title: '편성별 암야의 계약 획득량',
                intro: '슌·프론티어가 HP 소모를 대신 부담하면 스킬2를 더 사용할 수 있습니다.',
                shoki: '쇼키·암야', solo: '단독', shun0: '+ 의식0 슌', shun1: '+ 의식1 이상 슌',
                tiers: ['의식0', '의식2', '의식6'], own: '자체', support: '슌 지원',
                condition: '쇼키 HP 100% 시작 · 슌의 보호 효과 잔여량 100% · 대신 부담할 슌의 HP가 충분한 경우',
                bonus: '의식1: 일회성 상한 초과',
                note: '스킬2로 불멸의 별빛을 소모한 턴에는 획득하는 계약 2중첩이 상한을 넘을 수 있습니다. 위 표에는 이 효과와 추가 회복을 포함하지 않았습니다.'
            },
            en: {
                title: 'Stellato stacks by team',
                intro: 'Gunslinger Shun absorbs HP costs, allowing more uses of Steadfast Vow.',
                shoki: 'Tenebre Shoki', solo: 'Solo', shun0: '+ A0 Shun', shun1: '+ A1+ Shun',
                tiers: ['A0', 'A2', 'A6'], own: 'Own', support: 'Shun',
                condition: "Starts at 100% HP · Deputy’s Badge fully available · Shun has enough HP to absorb the costs",
                bonus: 'A1: one-time stack limit overflow',
                note: 'On the turn Steadfast Vow spends Undying Starlight, 2 Stellato stacks gained can exceed the stack limit. This effect and additional healing are excluded above.'
            },
            jp: {
                title: '編成別ステッラート獲得数',
                intro: '駿・生命欲の暴走がHP消費を肩代わりすることで、星の盾を追加で使用できます。',
                shoki: '星輝・生命欲の暴走', solo: '単独', shun0: '+ 意識0の駿', shun1: '+ 意識1以上の駿',
                tiers: ['意識0', '意識2', '意識6'], own: '自身', support: '駿の支援',
                condition: '星輝のHP100%で開始・生命欲の守護が未消費・駿に肩代わりできるHPが十分にある場合',
                bonus: '意識1：一度限りの上限超過',
                note: '星の盾で超新星を消費したターンは、獲得するステッラート2つが上限を超えることができます。上の表には、この効果と追加のHP回復を含めていません。'
            },
            cn: {
                title: '不同配队的暗夜契约获取层数',
                intro: '加纳骏·拓荒代为承担生命值消耗后，可以额外释放坚守的誓言。',
                shoki: '池波星辉·永夜', solo: '单独', shun0: '+ 0意识骏', shun1: '+ 1意识及以上骏',
                tiers: ['0意识', '2意识', '6意识'], own: '自身', support: '骏的支援',
                condition: '星辉以100%生命值开始 · 锡星徽记可承担量未消耗 · 骏有足够生命值承担消耗',
                bonus: '1意识：一次性的层数上限突破',
                note: '通过坚守的誓言消耗不灭星辉后，当回合获得的后续2层暗夜契约可突破上限。上表不包含此效果及额外治疗。'
            }
        }[lang];
        const labels = {
            kr: { own: '자체 획득', shun0: '슌 의식0 추가', shun1: '슌 의식1 추가', upgrade: '슌 의식0 대비 추가분', total: '총', bonus: '쇼키 의식1 · 일회성' },
            en: { own: 'Own stacks', shun0: 'Shun A0 adds', shun1: 'Shun A1 adds', upgrade: 'Extra over Shun A0', total: 'Total', bonus: 'Shoki A1 · once per battle' },
            jp: { own: '自身の獲得数', shun0: '駿の意識0で追加', shun1: '駿の意識1で追加', upgrade: '駿の意識0からの追加分', total: '合計', bonus: '星輝の意識1・一度限り' },
            cn: { own: '自身获取', shun0: '骏0意识追加', shun1: '骏1意识追加', upgrade: '相较骏0意识的追加量', total: '合计', bonus: '星辉1意识・每场一次' }
        }[lang];
        const counts = [[2, 4, 6], [3, 5, 8], [6, 8, 11]];
        const headings = [copy.solo, copy.shun0, copy.shun1];
        const icon = '<img src="/data/characters/쇼키·암야/stellato.webp" width="32" height="32" alt="" loading="lazy" decoding="async">';
        return `<section class="shoki-stellato-chart" aria-label="${copy.title}">
<h3>${copy.title}</h3>
<p class="shoki-stellato-intro">${copy.intro}</p>
<table>
<thead><tr><th scope="col">${copy.shoki}</th><th scope="col">${labels.own}</th><th scope="col">${labels.shun0}</th><th scope="col">${labels.shun1}<small>${labels.upgrade}</small></th></tr></thead>
<tbody>${counts.map((row, i) => `<tr><th scope="row">${copy.tiers[i]}</th>${row.map((n, j) => {
            const added = j ? n - row[j - 1] : n;
            return `<td data-label="${headings[j]}"><span class="shoki-stellato-icons" aria-label="${j ? '+' : ''}${added}">${j ? '<span class="shoki-stellato-plus">+</span>' : ''}${icon.repeat(added)}</span><span class="shoki-stellato-stage">${labels.total} <strong>${n}</strong></span><span class="shoki-stellato-mobile">${copy.own} ${row[0]}${j ? ` + ${copy.support} ${n - row[0]}` : ''}<strong>= ${n}</strong></span></td>`;
        }).join('')}</tr>`).join('')}</tbody>
</table>
<p class="shoki-stellato-condition">${copy.condition}</p>
<div class="shoki-stellato-note"><div class="shoki-stellato-bonus">${icon}${icon}<strong>${labels.bonus}</strong></div><p>${copy.note}</p></div>
</section>`;
    }

    window.characterReview = window.characterReview || {};
    window.characterReview["쇼키·암야"] = { name_en: "Tenebre Shoki", name_jp: "星輝・生命欲の暴走", codename: "LUCE·Tenebre",
        review: `
저체력 유지 기반의 고화력 광역 축복 딜러다.

스킬1과 스킬2를 통해 스킬3를 강화하고, **해당 강화가 최대치에 달하는 턴에 폭발적인 대미지**를 줄 수 있다.

스킬2는 턴을 소모하지 않고 반복 사용 가능하며 자체적으로 체력을 감소시키고, 실드를 획득한다. 

**체력을 40% 이하로 유지해야 최고의 성능을 유지**할 수 있기 때문에 스킬2를 최대치로 사용하는 것이 좋다.

${stellatoChart('kr')}

`,
        review_en: `He is a high-damage AoE dealer whose performance relies on maintaining low HP.

Skill 1 and Skill 2 enhance Skill 3, and **when these enhancements reach their maximum, he can unleash explosive damage** in that turn.

Through Skill 2, he can consume his own HP without consuming a turn, and **keep his HP below 40% to achieve optimal performance**.

Because of this, receiving healing at an unexpected timing can disrupt his damage cycle.

${stellatoChart('en')}

`,
        review_jp: `低HP維持を前提とした高火力の全体アタッカーである。

スキル1とスキル2でスキル3を強化し、その強化が**最大に達したターンに爆発的なダメージ**を与えることができる。

また、スキル2で自身のHPを消費せずに使用でき、**HPを40％以下に保つことで最高の性能を発揮**する。

${stellatoChart('jp')}

`,
        review_cn: `
以维持低血量为前提的高火力群体祝福输出。

他会通过技能1和技能2不断强化技能3，**并在强化达到最大值的那个回合打出爆发性伤害**。

技能2可以在不消耗回合的情况下反复使用，同时会主动压低自身生命值并获得护盾。

**只有把生命值维持在40%以下，才能稳定打出最高性能**，因此通常建议尽量把技能2的层数拉满。

${stellatoChart('cn')}

`,
        pros: [
          "의식 0 자체만으로도 완성형에 가깝다",
          "짧은 사이클 내 폭발적인 대미지 구현이 가능하다"
        ],
        pros_en: [
          "The character itself is almost complete on A0",
          "It is possible to unleash explosive damage within a short cycle"
        ],
        pros_jp: [
          "A0のキャラクター自体はほぼ完成している",
          "短いサイクル内で爆発的なダメージを発生させることができる"
        ],
        pros_cn: [
          "0意识本体就已经接近完全体。",
          "可以在很短的循环内打出爆发伤害。"
        ],
        cons: [
          "특정 파티원이 없으면 최대 스택을 달성할 수 없다"
        ],
        cons_en: [
          "If a specific party member is not present, it is not possible to achieve the maximum stack"
        ],
        cons_jp: [
          "特定のパーティーメンバーが不在の場合、最大スタックを達成できない",
        ],
        cons_cn: [
          "若缺少特定队友，就无法稳定达到最大层数。"
        ],
    };
})();


