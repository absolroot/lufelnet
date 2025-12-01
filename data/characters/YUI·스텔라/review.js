(function () {
    window.characterReview = window.characterReview || {};
    window.characterReview["YUI·스텔라"] = { name_en: "YUI·PRISM", name_jp: "YUI·PRISM", codename: "YUI·PRISM",
        review: `
**총공격 수치**를 메인 딜 계수로서 활용하는 핵열 단일 딜러다.

설명은 상당히 복잡하지만 실제로 운영 방식은 단순한 편으로 설명을 신경쓰지 않고 사이클 순서대로 진행하면 무리없게 구성됐다.

- 매 턴 시작 시 자동으로 기사 1명 & 스킬2(쿨다운 1T) 사용 시 기사 1명을 소환한다.
  - **가지 → 감자 → 버섯 → 아스파라거스**

- 스킬3 사용 시 감자 기사가 2명 이상일 경우 추가 감자 기사를 소모하여 대미지가 상승한다. (최소 1기의 감자 기사는 남는다.)

- 『원동력』은 7스택이 쌓이면 패시브가 발동해 3스킬을 자동 사용한다.

`,
review_en: `
Although the explanation may seem complicated, the actual gameplay cycle is simple. If you just follow the rotation order without worrying too much about the details, it works smoothly.

- At the start of each turn, 1 Knight is automatically summoned, and using Skill 2 (1T cooldown) also summons 1 Knight.
  - Eggplant → Potato → Mushroom → Asparagus

- When using Skill 3, if you have 2 or more Potato Knights, additional Potato Knights will be consumed to increase damage. (At least 1 Potato Knight will remain.)

- 『Mobilize Energy』: When 7 stacks are accumulated, the passive is triggered, automatically casting Skill 3.
`,
review_jp: `
説明は複雑に見えるかもしれませんが、実際の運用はシンプルです。細かい説明を気にせず、サイクル順に進めれば問題なく構成されています。

- 各ターン開始時に自動で騎士を1体召喚し、スキル2（クールダウン1T）を使用するとさらに騎士を1体召喚します。
  - ナス → ジャガイモ → キノコ → アスパラガス

- スキル3使用時、ジャガイモ騎士が2体以上いる場合、追加のジャガイモ騎士を消費してダメージが上昇します。（最低でもジャガイモ騎士1体は残ります。）

- 『動力』：7スタックが溜まるとパッシブが発動し、自動的にスキル3を使用します。
`,
        pros: ["단일 딜러지만 총공격을 통해 광역 대미지를 줄 수 있다.", "추가 효과로 적의 다운 수치를 감소시킬 수 있다."],
        pros_en: ["As a single damage dealer, you can deal wide-area damage through the All-Out Attack.","Can reduce the down status of enemies through the Resonance."],
        pros_jp: ["単体ダメージディーラーだが、総攻撃を通して広域ダメージを与えることができます。","追加効果の意識奏功で敵のダウン数値を減少させることができます。"],
        cons: ["총공격 발동 타이밍을 별도로 취소하거나 조절해야 최대 대미지를 얻을 수 있다."],
        cons_en: ["You need to cancel the timing of the All-Out Attack or adjust it to get the maximum damage."],
        cons_jp: ["総攻撃の発動タイミングを別途キャンセルするなど調整が必要です。"],
    };
})();


