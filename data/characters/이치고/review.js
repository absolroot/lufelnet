(function () {
    window.characterReview = window.characterReview || {};
    window.characterReview["이치고"] = { name_en: "Ichigo Shikano", name_jp: "鹿野 苺", codename: "BERRY",
        review: `
주원 속성 지속 대미지를 주는『원념』중첩을 적에게 부여하는 강력한 단일 딜러다다.

스킬1과 스킬2를 통해『원념』을 적에게 중첩시키고, 최대 중첩을 완성 한 후 **스킬3으로 『원념』의 지속시간을 갱신하고 강력한 대미지**를 준다.

**HIGHLIGHT는 이치고의 핵심 스킬로 중첩된 『원념』을 결산하고, 지속 대미지가 크리티컬이 가능하도록 바꾼다.**

<br>

이치고는 정말 강력하지만 딜링 메커니즘은 역대 캐릭터 중 가장 복잡한 편이다.

『원념』이 대미지를 주는 방식은 크게 2가지로, **적이 턴을 끝낼 때 받는 대미지와 HL을 통해 강제로 지속 대미지를 결산할 때가 다르다.**

- 각 『원념』은 적에게 부여할 때의 이치고의 버프 상태를 기억(스냅샷)하며, 3스킬을 통해 갱신할 때 해당 시점의 이치고 버프로 덮어씌워진다.

- 크리티컬은 별도로 각 지속 대미지 중첩이 계산되는 시점의 이치고의 크리티컬 확률과 효과를 따라간다. 
이 시점에 이치고의 크리티컬 확률이 100% 보다 낮아 크리티컬이 발동되지 않을 경우 『안정 영역』 메커니즘이 발동되지 않는 버그가 있다.

- 적이 턴을 끝낼 때 받는 지속대미지 결산의 경우 이치고의 관통 버프가 적용되지 않아, 방어력 감소 효과가 다른 캐릭터들보다 유의미하다.

<br>

아래는 이치고의 버프 상태가 적용되는 버프 테이블이다.

| -                         | 공격력 / 대미지보너스 | 크리티컬 확률 / 효과         | 방어력 감소 | 관통 |
|---------------------------|----------------------|-----------------------------|-------------|------|
| 1/2/3스킬                 | O                    | O                           | O           | O    |
| 원념 부여/갱신             | O                    | -                           | O           | -    |
| 원념×2 결산 - HL          | -                    | O (결산 시점 기준)          | -           | -    |
| 지속대미지 결산 - HL      | -                    | O (결산 시점 기준)          | -           | -    |
| 원념 결산 - 턴 종료        | -                    | O (결산 시점 기준)          | -           | -    |
| HIGHLIGHT 기본            | O                    | -                           | O           | O    |

※ 현재 HL의 관통 적용 여부가 확인되지 않았다.

<br>

**지속 대미지 증가**라는 버프가 기존 대미지 증가와는 다르게 별도의 버킷으로 계산된다.

참고로 이치고가 나타나기 전에 출시됐던 '년수'의 지속 대미지 증가는 일반적인 대미지 증가 버킷으로 계산된다.

`,
review_en: `
A powerful single-target DPS that applies stacks of the Curse-element DoT [Resentment] to enemies.  

Applies [Resentment] to enemies through S1 and S2, then after reaching maximum stacks, **refreshes the duration with S3 and deals heavy damage**.  

In addition, **HIGHLIGHT settles the stacked [Resentment] and allows [Resentment]’s DoT to crit**.  


<br>

Ichigo is extremely powerful, but her damage-dealing mechanism is the most complex among all characters to date.  

[Resentment] deals damage in two main ways: damage dealt at the end of the enemy’s turn and forced DoT calculation via HL.  

- **Each [Resentment] stack snapshots Ichigo’s buff state at the time of application, and when refreshed via S3, it overwrites with Ichigo’s buffs at that moment.**

- Criticals are calculated separately, based on Ichigo’s Critical Rate and Critical Damage at the time each DoT stack is calculated.  
  If Ichigo’s Critical Rate is below 100% at this point and a crit does not occur, the Stable Domain mechanic will not activate due to a bug.  

- For end-of-turn DoT settlement, Ichigo’s pierce buffs do not apply, making Defense Reduction effects more significant compared to other characters.  

<br>

Below is the buff table showing which of Ichigo’s buffs apply:  

| -                         | ATK / ATK Mult      | Crit Rate / Crit Mult | DEF Reduction | Pierce |
|---------------------------|----------------------|------------------------------|---------------|--------|
| S1/S2/S3                  | O                    | O                            | O             | O      |
| Resentment Application/Refresh| O                    | -                            | O             | -      |
| Resentment×2 Settlement - HL  | -                    | O (based on settlement time) | -             | -      |
| DoT Settlement - HL       | -                    | O (based on settlement time) | -             | -      |
| Resentment Settlement - Turn End | -                 | O (based on settlement time) | -             | -      |
| HIGHLIGHT Base            | O                    | -                            | O             | O      |  

※ It is currently unclear whether HL is penetrable.

<br>

The **DoT Damage Increase** buff is calculated in a separate bucket from standard damage increases.  

For reference, Nian’s DoT Damage Increase, released before Ichigo, is calculated in the standard damage increase bucket.   
`,
review_jp: `
単体対象に呪怨属性の持続ダメージ[怨念]スタックを付与する強力なアタッカー。  

S1とS2で敵に[怨念]を付与し、最大スタックに到達した後、**S3で持続時間を更新しつつ強力なダメージを与える**。  

さらに、**HIGHLIGHTは蓄積された[怨念]を精算し、[怨念]の持続ダメージがクリティカル可能になる**。   

---

苺は非常に強力だが、ダメージメカニズムはこれまでの怪盗の中で最も複雑である。  

[怨念]がダメージを与える方法は主に2つあり、敵ターン終了時に発生するダメージと、HLによる強制的な持続ダメージ精算である。  

- **各[怨念]は付与時の苺のバフ状態をスナップショットし、S3で更新する際、その時点の苺のバフで上書きされる。**  

- クリティカルは別計算で、各持続ダメージスタックが計算される時点の苺のクリティカル率とCRT倍率に従う。  
  この時点で苺のクリティカル率が100%未満でクリティカルが発生しない場合、Stable Domainのメカニズムが発動しない不具合がある。  

- ターン終了時の持続ダメージ精算では苺の貫通バフが適用されないため、防御力減少効果が他の怪盗に比べて有意義になる。  

<br>

以下は苺のバフ状態が適用されるバフテーブルである：  

| -                         | 攻撃力 / 攻撃倍率+ | クリティカル率 / 効果       | 防御力減少 | 貫通 |
|---------------------------|--------------------------|-----------------------------|------------|------|
| S1/S2/S3                  | O                        | O                           | O          | O    |
| 怨念付与/更新             | O                        | -                           | O          | -    |
| 怨念×2精算 - HL           | -                        | O (精算時点基準)            | -          | -    |
| 持続ダメージ精算 - HL     | -                        | O (精算時点基準)            | -          | -    |
| 怨念精算 - ターン終了     | -                        | O (精算時点基準)            | -          | -    |
| HIGHLIGHT 基本            | O                        | -                           | O          | O    |  

※ 現在、HLの貫通適用の有無は確認されていない。

<br>

**持続ダメージ増加**というバフは、既存のダメージ増加とは異なり、別のバケットで計算される。  

参考までに、苺登場前に実装された年獣の持続ダメージ増加は、通常のダメージ増加バケットで計算される。`,
        pros: ["체력 비례 대미지가 아닌 공격력 기반 지속 대미지로 모든 보스에게 유의미한 대미지를 줄 수 있다.", "3스킬과 HIGHLIGHT가 강력하다."],
        pros_en: [
          "Deals meaningful damage to all bosses thanks to ATK-based DoT instead of HP-based scaling.",
          "Has powerful Skill 3 and HIGHLIGHT."
        ]
        ,
        pros_jp: [
          "HP比例ではなく攻撃力依存の継続ダメージにより、すべてのボスに有効なダメージを与えられる。",
          "スキル3とHIGHLIGHTが強力。"
        ]
        ,
        cons: ["1스킬을 통해 다수의 적을 공격할 수 없는 경우 예열시간이 길어진다."],
        cons_en: [
          "Takes longer to set up when Skill 1 cannot hit multiple enemies."
        ],
        cons_jp: [
          "スキル1で複数の敵を攻撃できない場合、予熱時間が長くなる。"
        ],
    };
})();


