(function () {
    window.characterReview = window.characterReview || {};
    window.characterReview["카타야마"] = { name_en: "Kumi Katayama", name_jp: "片山 久未", codename: "BLITZ",
      review: `
**적의 약점과 무관하게 다운 수치를 크게 깎고, 다운된 적이 받는 대미지를 늘리는 디버퍼**다.

- 스킬1 : 적에게 [방어력 감소]와 [받는 대미지 증가]를 2턴 부여하고, 3스킬을 해금한다.

- 스킬3 : **다운 수치 5 감소** + 1턴 동안 **『다운 특수 공격』**과 [받는 대미지 증가]를 강화하며, **다음 스킬2을 강화**하는 흐름이다.

- 스킬2 : 강화된 상태에서 다운 수치를 4 감소시키고 디버프를 1턴 부여한다. 

<br>

다운을 빠르게 만들고 **독립 버킷인『다운 특수 공격』**을 강화한다 해당 버프는 별도로 곱해지기 때문에 언제나 일정 이상의 대미지 강화를 기대할 수 있다.

그러나 아래와 같은 일부 제한 사항들이 존재하므로 참조하여 운영을 진행하는 것이 좋다.

- 광역 보스의 기본 다운 수치는 5라서 의식1 미만이면 2스킬의 다운을 확정시킬 수 없다. 단일 보스는 다운치가 더 높아 효용성이 더 떨어진다.
- 카타야마는 자체 버프(패시브/스킬)가 여럿이지만, 적 턴 종료 시에 다운에서 일어나기 때문에 디버프가 사라져 본인이 그 효과를 활용하기 어렵다.
- 방어력 감소가 HL에 묶여 **HL 강제 사용**이 필요한 상황이 생긴다.
- 4성 무기는 적을 다운시 발동한다. 의식1 미만이면 효율이 급감하므로 **3성 무기**가 대안이 될 수 있다.
      `,
      review_en: `Debuffer who can **greatly reduce Down Points regardless of enemy weaknesses and increase the damage taken by Downed enemies**.

- Skill 1: Applies [DEF Down] and [Damage Taken Up] for 2 turns, and unlocks Skill 3.
- Skill 3: **Reduces Down Points by 5**, strengthens “Down Special Attack” and [Damage Taken Up] for 1 turn, and also **enhances the next Skill 2**.
- Skill 2: When enhanced, reduces Down Points by 4 and applies a 1-turn debuff.

<br>

Quickly builds up Down and enhances the **independent bucket 『Down Special Attack』**. Since this buff stacks separately, you can always expect a certain level of damage enhancement.

However, some limitations exist as listed below, so it's advisable to refer to them when operating.

- AoE bosses have a base Down value of 5, making Skill 2 unable to guarantee Down before A1. Single-target bosses have even higher Down values, lowering her effectiveness further.  
- Although she has multiple self-buffs (passives/skills), enemies stand up at the end of their turn, removing the debuffs—making it difficult for her to benefit from them.  
- DEF Down is tied to HL, causing **forced HL usage**.  
- Her 4★ weapon activates when enemies are Downed, but without A1 the efficiency drops sharply—making the **3★ weapon** a reasonable alternative.

      `,
      review_jp: `敵の弱点に依存せずダウン値を大きく削り、ダウン中の敵が受けるダメージを増加させるデバッファー。

- スキル1：［防御力ダウン］と［被ダメージ増加］を2ターン付与し、スキル3を解放する。
- スキル3：**ダウン値5減少**、1ターンのあいだ『ダウン特殊攻撃』と［被ダメ増加］を強化し、**次のスキル2を強化**する。
- スキル2：強化状態でダウン値を4減少させ、1ターンのデバフを付与。

<br>

ダウンを素早く発生させ、**独立バケットである『ダウン特殊攻撃』**を強化する。このバフは別途乗算されるため、常に一定以上のダメージ強化が期待できる。

ただし、以下のような一部制限事項が存在するため、参照しながら運用を進めることが望ましい。

- 全体ボスの基本ダウン値は5のため、A1未満ではスキル2で確定ダウンを取れない。単体ボスはさらにダウン値が高く、効率がさらに低下する。  
- 自己バフ（パッシブ／スキル）は多いものの、敵はターン終了時にダウンから立ち上がるためデバフが消え、効果を活かしにくい。  
- 防御力ダウンがHLに紐づくため、**HLの強制発動**が起こりやすい。  
- ★4武器は敵がダウンした際に発動するが、A1未満では発動率が低くなるため、**★3武器**が代替となる場合がある。
      `,
      pros: ["적의 약점에 무관하게 다운 시킬 수 있다.", "다운 약화 효과를 강화시킨다."],
      pros_en: ["Can down enemies regardless of their weaknesses.", "Enhances the DOWN debuff."],
      pros_jp: ["弱点に関係なく敵をDOWNさせることができます。", "DOWN弱体効果を強化します。"],
      cons: ["적이 다운되지 않으면 효율이 급감한다.", "자신을 강화시키는 효과에 무관하게 자체 대미지는 약하다."],
      cons_en: ["The efficiency drops sharply if the enemy doesn't get Down.", "The damage is too weak to be meaningful regardless of self-buffing."],
      cons_jp: ["敵がDOWNしないと効率が大きく下がります。", "自分を強化する効果に関係なく、ダメージが弱すぎます。"],
    };
})();


