(function () {
  window.characterReview = window.characterReview || {};
  window.characterReview["코로마루"] = {
    name_en: "Koromaru", name_jp: "コロマル", codename: "KOROMARU",
    review: `P3의 오리지널 캐릭터로 **화염, 전격, 빙결 속성의 약점을 강화**시키는 디버퍼다.

기존에 출시됐던 후타바와 동일한 메커니즘으로 적의 속성이 **내성(0.5배)인 경우 일반(1.0배)으로, 일반인 경우 약점(1.2배)으로, 약점인 경우에는 약점 강화(1.45배)로 변화**시킨다.

적이 죽고 새로 등장하지 않는 이상 **약점을 강화시키는 효과는 사이클 상 상시 유지**되며, 다운 수치를 1턴에는 2, 2턴에는 4를 감소시키며 2턴마다 적의 다운을 유도할 수 있다. 

<br>

특이한 시스템을 가지고 있는데, 한 명의 『주인』을 선택하고 나면 해당 『주인』의 턴에 함께 행동하고 별도의 본인의 턴이 존재하지 않는다.

코로마루는 『주인』을 선택한 후 더 이상 자신의 턴을 가지지 않지만, 여전히 『주인』의 턴 시작/종료 시점에 자신의 턴 시작/종료 효과를 발동한다.
『주인』이 S.E.E.S. 동료일 때: 『주인』은 지원 기술을 통해 코로마루가 페르소나 스킬을 사용하도록 지휘할 수 있으며, 그 후에도 기존 방식에 따라 다른 지원 기술을 사용할 수 있다.
『주인』이 비 S.E.E.S. 동료일 때: 『주인』의 턴 시작 시 코로마루는 『주인』의 속성에 근거하여 자동으로 페르소나 스킬을 사용한다.

스킬 3개는 화염, 전격, 빙결 대미지 강화 중 무엇을 더 강화할 것인가 외에는 다른 점이 없으며 스킬 하나를 아군의 속성에 맞춰 반복 사용하는 형태로 운영되게 된다.

<br>

효과 명중을 올리면 아군의 공격력이 올라가는 패시브가 있는데 상한이 없으므로 **효과 명중을 최대한 높게 올리는 것이 좋다**.
`,
    review_en: `An original P3 character, Koromaru is a debuffer who **enhances Fire, Elec, and Ice weaknesses**.

Using the same mechanism as Futaba, he changes enemy affinity so that **Resist (0.5x) becomes Normal (1.0x), Normal becomes Weak (1.2x), and Weak becomes Enhanced Weakness (1.45x).**

Unless an enemy dies and a new one appears, the weakness enhancement effect can be **maintained throughout his cycle almost constantly**. He reduces Down Points by 2 on turn 1 and by 4 on turn 2, allowing him to force an enemy Down every 2 turns.

<br>

He has a unique system: after selecting one [Master], he acts during that [Master]'s turn and no longer has a separate personal turn.

The three skills are identical except for which of Fire, Elec, or Ice damage taken they amplify, so in practice he is played by repeatedly using one skill that matches the ally's attribute.

<br>

He also has a passive that increases allies' Attack based on his Ailment Accuracy. Since there is no cap, **it is best to stack as much Ailment Accuracy as possible**.
`,
    review_jp: `P3のオリジナルキャラクターで、**火炎・電撃・氷結属性の弱点を強化**するデバッファー。

既存の双葉と同様のメカニズムで、敵の属性相性を**耐性(0.5倍)なら通常(1.0倍)、通常なら弱点(1.2倍)、弱点なら弱点強化(1.45倍)**へと変化させる。

敵が倒れて新たに出現しない限り、弱点強化効果は**サイクル上ほぼ常時維持**できる。ダウン値を1ターン目に2、2ターン目に4減少させるため、2ターンごとに敵のダウンを狙える。

<br>

特徴的なシステムとして、1人の『主人』を選ぶと、その『主人』のターンに合わせて行動し、自身の独立したターンを持たなくなる。

3つのスキルは、火炎・電撃・氷結ダメージ強化のどれを強めるか以外に差がなく、味方の属性に合わせて1つのスキルを繰り返し使う運用になる。

<br>

効果命中を上げると味方の攻撃力が上がるパッシブを持っており、上限がないため**効果命中をできるだけ高く積むのが望ましい**。
`,
    pros: [
      "화염, 전격, 빙결 속성의 약점을 강화시킨다.",
      "준수한 수치의 광역 방어력 감소 효과를 부여한다."
    ],
    pros_en: [
      "Amplifies Fire, Elec, and Ice weakness damage.",
      "Applies a respectable AoE Defense Down effect."
    ],
    pros_jp: [
      "火炎・電撃・氷結属性の弱点を強化できる。",
      "十分に高い数値の範囲防御力低下を付与できる。"
    ],
    cons: [
      "화염, 전격, 빙결 속성이 아닌 경우 효과가 감축된다."
    ],
    cons_en: [
      "Its effectiveness is reduced when the team is not focused on Fire, Elec, or Ice attributes."
    ],
    cons_jp: [
      "火炎・電撃・氷結属性でない場合、効果が減少する。"
    ],
  };
})();
