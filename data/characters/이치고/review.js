(function () {
  window.characterReview = window.characterReview || {};
  window.characterReview["이치고"] = {
    name_en: "Ichigo Shikano", name_jp: "鹿野 苺", codename: "BERRY",
    review: `
주원 속성 지속 대미지를 주는『원념』중첩을 적에게 부여하는 강력한 단일 딜러다.

스킬1과 스킬2를 통해『원념』을 적에게 중첩시키고, 최대 중첩을 완성한 후 **스킬3으로 『원념』의 지속시간을 갱신하고 강력한 대미지**를 준다.

**HIGHLIGHT는 이치고의 핵심 스킬로 중첩된 『원념』을 결산하고, 크리티컬이 가능하도록 바꾼다.**

<br>

이치고는 정말 강력하지만 딜링 메커니즘은 역대 캐릭터 중 가장 복잡한 편이다.

『원념』이 대미지를 주는 방식은 크게 2가지로, **적이 턴을 끝낼 때 받는 대미지와 HL을 통해 강제로 지속 대미지를 결산할 때가 다르다.**

- 각 『원념』은 적에게 부여할 때의 이치고의 버프 상태를 기억(스냅샷)하며, 3스킬을 통해 갱신할 때 해당 시점의 이치고 버프로 덮어씌워진다.

- 지속 대미지는 페르소나 스킬 및 추가 효과가 아니기 때문에 『안정 영역』 메커니즘의 영향을 받지 않고, 크리티컬이 발생해야 크리티컬 효과가 적용된다.

- 적이 턴을 끝낼 때 받는 지속대미지 결산의 경우 이치고의 관통 버프가 적용되지 않아, 방어력 감소 효과가 다른 캐릭터들보다 유의미하다.

<br>

아래는 이치고의 버프 상태가 적용되는 버프 테이블이다.

| -                         | 공격력 / 대미지보너스 | 크리티컬 확률 / 효과         | 방어력 감소 | 관통 |
|---------------------------|----------------------|-----------------------------|-------------|------|
| 1/2/3스킬                 | O                    | O                           | O           | O    |
| 원념 부여/갱신             | O                    | -                           | O           | -    |
| 원념×2 결산 - HL          | -                    | O (결산 시점 기준)          | -           | -    |
| 지속대미지 결산 - HL      | -                    | -                           | -           | -    |
| 원념 결산 - 턴 종료        | -                    | O (결산 시점 기준)          | -           | -    |
| HIGHLIGHT 기본            | O                    | -                           | O           | O    |

※ 현재 HL에 의한 결산 관통 적용 여부가 확인되지 않았다.

<br>

**지속 대미지 증가**라는 버프가 기존 대미지 증가와는 다르게 별도의 버킷으로 계산된다.

참고로 이치고가 나타나기 전에 출시됐던 '년수'의 지속 대미지 증가는 일반적인 대미지 증가 버킷으로 계산된다.

`,
    review_en: `
A powerful single-target DPS that applies stacks of the Curse-element DoT Lovesick to enemies.

Applies Lovesick to enemies through S1 and S2, then after reaching maximum stacks, **refreshes the duration with S3 and deals heavy damage**.

**Highlight is Ichigo's core skill, activating stacked Lovesick effects and allowing Lovesick to crit.**


<br>

Ichigo is extremely powerful, but her damage-dealing mechanism is the most complex among all characters to date.  

Lovesick deals damage in two main ways: damage dealt at the end of the enemy’s turn and forced DoT activation via Highlight.

- **Each Lovesick stack snapshots Ichigo’s buff state at the time of application, and when refreshed via S3, it overwrites with Ichigo’s buffs at that moment.**

- DoT counts as neither a Persona skill nor a Resonance, so it is unaffected by Stable Domain; Crit Mult is applied only when a critical hit occurs.

- For end-of-turn DoT settlement, Ichigo’s pierce buffs do not apply, making Defense Reduction effects more significant compared to other characters.  

<br>

Below is the buff table showing which of Ichigo’s buffs apply:  

| -                         | ATK / Damage Mult      | Crit Rate / Crit Mult | DEF Reduction | Pierce |
|---------------------------|----------------------|------------------------------|---------------|--------|
| S1/S2/S3                  | O                    | O                            | O             | O      |
| Lovesick Application/Refresh | O                  | -                            | O             | -      |
| Lovesick×2 Activation - Highlight | -             | O (based on activation time) | -             | -      |
| DoT Activation - Highlight   | -                    | -                            | -             | -      |
| Lovesick Activation - Turn End | -                 | O (based on activation time) | -             | -      |
| Highlight Base            | O                    | -                            | O             | O      |

※ It is currently unconfirmed whether pierce rate applies to DoT activations triggered by Highlight.

<br>

The **DoT Damage Increase** buff is calculated in a separate bucket from standard damage increases.  

For reference, Nian’s DoT Damage Increase, released before Ichigo, is calculated in the standard damage increase bucket.   
`,
    review_jp: `
単体対象に呪怨属性の持続ダメージ『愛執』を付与する強力なアタッカー。

S1とS2で敵に『愛執』を付与し、最大スタックに到達した後、**S3で持続時間を更新しつつ強力なダメージを与える**。

**ハイライトは苺の中核スキルで、蓄積された『愛執』を発動し、『愛執』でクリティカルが発生するようになる。**

---

苺は非常に強力だが、ダメージメカニズムはこれまでの怪盗の中で最も複雑である。  

『愛執』がダメージを与える方法は主に2つあり、敵ターン終了時に発生するダメージと、ハイライトによる強制的な持続ダメージ発動である。

- **各『愛執』は付与時の苺のバフ状態をスナップショットし、S3で更新する際、その時点の苺のバフで上書きされる。**

- 持続ダメージはペルソナスキルにも意識奏功にも該当しないため、『安定領域』の影響を受けず、クリティカルが発生した場合にのみCRT倍率が適用される。

- ターン終了時の持続ダメージ精算では苺の貫通バフが適用されないため、防御力減少効果が他の怪盗に比べて有意義になる。  

<br>

以下は苺のバフ状態が適用されるバフテーブルである：  

| -                         | 攻撃力 / 攻撃倍率+ | クリティカル率 / 効果       | 防御力減少 | 貫通 |
|---------------------------|--------------------------|-----------------------------|------------|------|
| S1/S2/S3                  | O                        | O                           | O          | O    |
| 愛執付与/更新             | O                        | -                           | O          | -    |
| 愛執×2発動 - ハイライト   | -                        | O (発動時点基準)            | -          | -    |
| 持続ダメージ発動 - ハイライト | -                    | -                           | -          | -    |
| 愛執発動 - ターン終了     | -                        | O (発動時点基準)            | -          | -    |
| ハイライト 基本           | O                        | -                           | O          | O    |

※ 現在、ハイライトによる持続ダメージ発動に貫通が適用されるかは確認されていない。

<br>

**持続ダメージ増加**というバフは、既存のダメージ増加とは異なり、別のバケットで計算される。  

参考までに、苺登場前に実装された年獣の持続ダメージ増加は、通常のダメージ増加バケットで計算される。`,
    review_cn: `
能够给敌人叠加咒怨属性持续伤害『怨念』的强力单体输出。

她会通过技能1和技能2给敌人叠加『怨念』，叠满后再用**技能3刷新『怨念』持续时间并打出高额伤害**。

**HIGHLIGHT是鹿野莓的核心技能，会结算已叠加的『怨念』，并使『怨念』可触发暴击。**

<br>

鹿野莓的强度非常高，但输出机制也是历代角色里最复杂的一档。

『怨念』的伤害方式大致分成两类，**一类是敌人回合结束时受到的持续伤害，另一类是通过HL强制结算持续伤害。**

- 每一层『怨念』都会记录施加当下鹿野莓的增益状态（快照），而通过技能3刷新时，也会被刷新当下的增益状态重新覆盖。

- 持续伤害既不属于人格面具技能，也不属于追加效果，因此不受『稳定领域』影响，只有触发暴击时，暴击效果才会生效。

- 在敌人回合结束时触发的持续伤害结算中，鹿野莓的穿透增益不会生效，因此和其他角色相比，防御力降低效果会显得更有价值。

<br>

下面是鹿野莓不同增益状态的适用表。

| -                         | 攻击力 / 伤害加成 | 暴击率 / 暴击效果           | 防御力降低 | 穿透 |
|---------------------------|------------------|-----------------------------|------------|------|
| 1/2/3技能                 | O                | O                           | O          | O    |
| 怨念附加/刷新             | O                | -                           | O          | -    |
| 怨念×2结算 - HL           | -                | O（按结算时点）             | -          | -    |
| 持续伤害结算 - HL         | -                | -                           | -          | -    |
| 怨念结算 - 回合结束       | -                | O（按结算时点）             | -          | -    |
| HIGHLIGHT基础伤害         | O                | -                           | O          | O    |

※ 目前尚未确认由HIGHLIGHT触发的持续伤害结算是否适用穿透。

<br>

**持续伤害提升**这个增益与常规伤害提升不同，会被算进单独的乘区。

顺带一提，在鹿野莓之前登场的“年兽”所拥有的持续伤害提升，仍然会被算进普通伤害提升乘区。
`,
    pros: ["체력 비례 대미지가 아닌 공격력 기반 지속 대미지로 모든 보스에게 유의미한 대미지를 줄 수 있다.", "3스킬과 HIGHLIGHT가 강력하다."],
    pros_en: [
      "Deals meaningful damage to all bosses thanks to ATK-based DoT instead of HP-based scaling.",
      "Has powerful Skill 3 and Highlight."
    ]
    ,
    pros_jp: [
      "HP比例ではなく攻撃力依存の継続ダメージにより、すべてのボスに有効なダメージを与えられる。",
      "スキル3とハイライトが強力。"
    ]
    ,
    pros_cn: ["她的持续伤害基于攻击力而不是敌方生命值，因此面对所有首领都能打出有效伤害。", "技能3与HIGHLIGHT都非常强。"],
    cons: ["1스킬을 통해 다수의 적을 공격할 수 없는 경우 예열시간이 길어진다."],
    cons_en: [
      "Takes longer to set up when Skill 1 cannot hit multiple enemies."
    ],
    cons_jp: [
      "スキル1で複数の敵を攻撃できない場合、予熱時間が長くなる。"
    ],
    cons_cn: ["如果无法通过技能1同时命中多个敌人，启动时间会明显变长。"],
  };
})();


