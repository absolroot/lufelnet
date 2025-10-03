const operationData = {
    "원더": {
        basic: [],
        note: []
    },
    "YUI·스텔라": {
        basic: [
            { label: "의식 0", value: "2+1 › 3 › 2+1 › 3 › 2+1 › 3" },
            { label: "의식 6", value: "2+3 › 3 › 2+3 › 3 › 2+3 › 3" },
            { label: "의식 6", value: "3 › 2+3 › 3 › 2+3 › 3 › 2+3" }
        ]
    },
    "카타야마": {
        basic: [
            { label: "의식 0", value: "1 › 3 › 2 › 1 › 3 › 2" }
        ]
    },
    "미유·여름": {
        basic: [
            { label: "의식 0", value: "3 › 2 › 3 › 2 › 3 › 2" },
            { label: "의식 0/1 (ANGE)", value: "3 › 1 › 1 › 1 › 1 › 2" },
            { label: "의식 0/1 (NAVI)", value: "3 › 1 › 2 › 3 › 1 › 2" },
            { label: "의식 6 (ANGE)", value: "1 › 2 › 2 › 2 › 1 › 2" },
        ],
        note: [
            "해명 괴도에 따라 택틱 변화",
        ],
        note_en: [
            "· New character, still adjusting"
        ],
        note_jp: [
            "· 新怪盗で調整中"
        ]
    },
    "미나미·여름": {
        basic: [
            { label: "의식 0", value: "3 › 2 › 1 › 3 › 2 › 1" },
            { label: "의식 2", value: "3 › 1 › 2 › 3 › 1 › 2" },
        ],
        note: [""],
        note_en: [""],
        note_jp: [""],
    },
    "이치고": {
        basic: [
            { label: "의식 0", value: "1 › 2 › 2 › 3 › 3 › 3" },
            { label: "의식 1", value: "1 › 2 › 1 › 3 › 3 › 3" },
            { label: "의식 6", value: "1+1 › 2+2 › 3 › 3 › 3 › 3+3" },
        ],
        note: [
            "· 전용 무기 및 기본 크리티컬 확률이 높아 파티에 따라 크리티컬 확률 조정",
            "· 체력이 낮은 적이 여럿 있을 경우 1스킬 반복으로 사이클 단축"
        ],
        note_en: [
            "· The basic critical rate is high, so adjust the critical rate based on the party",
            "· If there are many enemies with low health, repeat skill 1 to shorten the cycle"
        ],
        note_jp: [
            "· 基本的なクリティカル率が高いので、パーティに応じてクリティカル率を調整する。",
            "· 体力の少ない敵が多い場合は、スキル1を繰り返すとサイクルが短くなる"
        ]
    },
    "사나다": {
        basic: [
            { label: "의식 0", value: "1 › 2 › 3 › 1 › 2 › 3" },
        ],
        note: []
    },

    "유카리": {
        basic: [
            { label: "의식 0", value: "1 › 2 › 3 › 2 › 3 › 2" },
            { label: "의식 1", value: "2 › 3 › 2 › 3 › 2 › 3" },
            { label: "의식 1 v2", value: "3 › 3 › 2 › 3 › 2 › 3" }
        ],
        note: [
            "· 의식 1 v2는 마나카 의식6 + 유키 마코토 사이클"
        ],
        note_en: [
            "· Skill 1 v2 is the cycle of Manaka Skill 6 + Makoto Yuki"
        ],
        note_jp: [
            "· スキル1V2はマナカ・スキル6＋結城誠のサイクル"
        ]
    },
    "유키 마코토": {
        basic: [
            { label: "의식 0", value: "1 › 3 › 1 › 3 › 1 › 3" },
        ],
        note: [
            "· 2돌 이상인 경우 2스킬 레벨 MAX",
        ],
        note_en: [
            "· If there are A2 or more, skill 2 level MAX"
        ],
        note_jp: [
            "· A2以上の場合はスキル2のレベルMAX"
        ]
    },
    "이케나미": {
        basic: [
            { label: "의식 0", value: "1 › 3 › 1 › 3 › 1 › 3" },
        ],
        note: [
            "· 패시브 및 해명의 힘에 의해 전투 시 공격력 상승률이 높으므로 계시 세팅 맞춰 조정",
        ],
        note_en: [
            "· The attack power increase rate is high due to the battle, so adjust the setting based on the party"
        ],
        note_jp: [
            "パッシブおよびステータス強化によって戦闘時の攻撃力上昇率が高いため、啓示セットを調整してください。"
        ]
    },
    "마나카": {
        basic: [
            { label: "의식 0", value: "· › 1 › 3 › 1 › 3 › 1" },
            { label: "의식 1", value: "3 › 1 › 3 › 1 › 3 › 1" }
        ],
        note: []
    },

    "마유미": {
        basic: [
            { label: "의식 0", value: "1 › 2 + 3 › 1 › 3 › 2 + 1 › 3" },
            { label: "의식 0 v2", value: "1 › 2 + 3 › 1 › 3 › 1 › 2 + 3" },
            { label: "의식 1", value: "1 › 2 + 3 › 1 › 2 + 3 › 1 › 2 + 3" }
        ],
        note: [
            "· 아군 괴도가 6턴 전부 추가턴 획득 가능한 경우 의식0도 의식 1 사이클"
        ],
        note_en: [
            "· If the ally's can obtain all additional turns for 6 turns, A0 can be used as A1 cycle"
        ],
        note_jp: [
            "· アライアンスが6ターン全ての追加ターンを獲得可能であれば、A0をA1サイクルとして使用できます。"
        ]
    },
    "아케치": {
        basic: [
            { label: "의식 0", value: "1 / 2 › 3 › 1 / 2 › 3 › 1 / 2 › 3" },
            { label: "의식 1", value: "2 › 3 › 1 › 3 › 2 › 3" }
        ],
        note: [
            "· 스킬 3은 2턴 동안 축적한 대미지를 발동하므로 2턴 마다 사용"
        ],
        note_en: [
            "· Skill 3 is cast for 2 turns, so use it every 2 turns"
        ],
        note_jp: [
            "· スキル3は2ターン分のダメージを蓄積して発動するので、2ターンごとに使用する。"
        ]
    },
    "미오": {
        basic: [
            { label: "의식 0", value: "1 › 3 › 1 › 3 › 1 › 3" },
            { label: "의식 6", value: "1 + 3 › 1 + 3 › 1 + 3 › 1 + 3 › 1 + 3 › 1 + 3" }
        ],
        note: [
            "· 스킬1을 사용할 때 화상 상태의 적이 필수"
        ],
        note_en: [
            "· Skill 1 requires an enemy with a burn state"
        ],
        note_jp: [
            "· スキル1は燃焼状態の敵が必須です。"
        ]
    },
    "레오": {
        basic: [
            { label: "의식 0", value: "3 › 2 › 3 › 2 › 3 › 2" }
        ],
        note: [
            "· 버프를 받는 동료의 생명이 60% 이하일 경우에 최대 효율 적용"
        ],
        note_en: [
            "· The maximum efficiency is applied when the ally's life is 60% or less"
        ],
        note_jp: [
            "· バッフを受ける仲間の体力が60%以下の場合は最大効率を適用します。"
        ]
    },
    "렌": {
        basic: [
            { label: "의식 0", value: "1 › 1 › 1 + 3 › 1 › 1 › 1 + 3" },
            { label: "의식 5", value: "1 › HL + 1 + 3 › 1 + 3 › 1 › 1 › HL + 3 + 3" }
        ],
        note: [
            "· 적의 체력 %에 따라 택틱 변화"
        ],
        note_en : [
            "· Tactic changes based on enemy HP",
            "· Global Version A5 Cycle = A4 Cycle"
        ],
        note_jp: [
            "· 敵の残りHPによって、戦術が変化します",
            "· グローバルバージョンA5サイクル = A4サイクル"
        ]
    },
    "루우나": {
        basic: [
            { label: "의식 0(단일)", value: "2 › 3 › 2 › 3 › 2 › 3" },
            { label: "의식 0(다중)", value: "1 › 3 › 1 › 3 › 1 › 3" },
            { label: "의식 6(단일)", value: "3 › 2 › 1 › 3 › 2 › 1" },
            { label: "의식 6(다중)", value: "3 › 1 › 2 › 3 › 1 › 2" }
        ],
        basic_en: [
            { label: "A0 (Single)", value: "2 › 3 › 2 › 3 › 2 › 3" },
            { label: "A0 (Multi)", value: "1 › 3 › 1 › 3 › 1 › 3" },
            { label: "A6 (Single)", value: "3 › 2 › 1 › 3 › 2 › 1" },
            { label: "A6 (Multi)", value: "3 › 1 › 2 › 3 › 1 › 2" }
        ],
        basic_jp: [
            { label: "意識 0 (単体)", value: "2 › 3 › 2 › 3 › 2 › 3" },
            { label: "意識 0 (複数)", value: "1 › 3 › 1 › 3 › 1 › 3" },
            { label: "意識 6 (単体)", value: "3 › 2 › 1 › 3 › 2 › 1" },
            { label: "意識 6 (複数)", value: "3 › 1 › 2 › 3 › 1 › 2" }
        ],
        note: [
            ""
        ]
    },
    "루페르": {
        basic: [
            { label: "의식 6", value: "3 › 1 › 3 › 1 › 3 › 1" }
        ],
        note: [
            ""
        ]
    },
    "류지": {
        basic: [
            { label: "의식 0", value: "3 › 3 › 3 › 3 › 3 › 3" },
        ],
        note: [
            ""
        ]
    },
    "리코": {
        basic: [
            { label: "의식 0", value: "- › 1 › 3 › - › 1 › 3" },
            { label: "의식 6", value: "- › 1 › 3 › 1 › 3 › 3" }
        ],
        note: [
            "· 스킬 2는 자동 발동 외에는 사용하지 않음"
        ],
        note_en: [
            "· Skill 2 is automatically cast, so do not use it"
        ],
        note_jp: [
            "· スキル2は自動発動なので使用しない。"
        ]
    },
    "리코·매화": {
        basic: [
            { label: "의식 0", value: "3 › 2 › 3 › 2 › 3 › 2" },
            { label: "의식 0 (질풍)", value: "3 › 1 › 3 › 1 › 3 › 1" },
            { label: "의식 1 (단일)", value: "3 › 1 › 3 › 1 › 3 › 1" },
            { label: "의식 1 (다중)", value: "3 › 2 › 3 › 2 › 3 › 2" },
            { label: "의식 6", value: "3 + 1 › 2 › 3 + 1 › 2 › 3 + 1 › 2" },
        ],
        basic_en: [
            { label: "A0 (Gale)", value: "3 › 2 › 3 › 2 › 3 › 2" },
            { label: "A0 (Single)", value: "3 › 1 › 3 › 1 › 3 › 1" },
            { label: "A1 (Single)", value: "3 › 1 › 3 › 1 › 3 › 1" },
            { label: "A1 (Multi)", value: "3 › 2 › 3 › 2 › 3 › 2" },
            { label: "A6", value: "3 + 1 › 2 › 3 + 1 › 2 › 3 + 1 › 2" },
        ],
        basic_jp: [
            { label: "意識 0 (疾風)", value: "3 › 2 › 3 › 2 › 3 › 2" },
            { label: "意識 0 (単体)", value: "3 › 1 › 3 › 1 › 3 › 1" },
            { label: "意識 1 (単体)", value: "3 › 1 › 3 › 1 › 3 › 1" },
            { label: "意識 1 (複数)", value: "3 › 2 › 3 › 2 › 3 › 2" },
            { label: "意識 6", value: "3 + 1 › 2 › 3 + 1 › 2 › 3 + 1 › 2" },
        ],
        note: [
            "· 패시브 만개의 크리티컬 효과 버프 상한 없음",
            "· 질풍 파티가 아닌 경우 의식 0의 운영법은 3-2 고정",
            "· 3-3 사이클을 돌릴 경우 480.1% SP 회복 필요"
        ],
        note_en: [
            "· The buff of the passive critical effect is not limited",
            "· If the party is not a Gale party, the skill 0 cycle is 3-2"
        ],
        note_jp: [
            "· パッシブのCRT倍率バフの上限なし",
            "· 疾風パーティーでない場合の儀式0の運用法は3-2固定"
        ]
    },
    "마사키": {
        basic: [
            { label: "의식 0", value: "3 › 2 › 3 › 2 › 3 › 2" },
        ],
        note: [
            ""
        ]
    },
    "마코토": {
        basic: [
            { label: "의식 0", value: "3 › 변신 + 3 › 3 › 3 › 변신 + 3 › 3" },
            { label: "의식 6", value: "3 › 변신 + 3 + 3 › 3 › 3 › 변신 + 3 + 3 › 3" }
        ],
        basic_en: [
            { label: "A0", value: "3 › Trans + 3 › 3 › 3 › Trans + 3 › 3" },
            { label: "A6", value: "3 › Trans + 3 + 3 › 3 › 3 › Trans + 3 + 3 › 3" }
        ],
        basic_jp: [
            { label: "意識 0", value: "3 › 変身 + 3 › 3 › 3 › 変身 + 3 › 3" },
            { label: "意識 6", value: "3 › 変身 + 3 + 3 › 3 › 3 › 変身 + 3 + 3 › 3" }
        ],
        note: [
            ""
        ]
    },
    "미나미": {
        basic: [
            { label: "의식 0", value: "3 › 2 › 3 › 2 › 3 › 2" },
        ],
        note: [
            ""
        ]
    },
    "미유": {
        basic: [
            { label: "의식 0", value: "1 › 1 › 3" },
        ],
        note: [
            ""
        ]
    },
    "모르가나": {
        basic: [
            { label: "의식 0", value: "1 › 3 › 1 › 3 › 1 › 3" },
            { label: "의식 6", value: "3 › 3 › 3 › 3 › 3 › 3" }
        ],
        note: [
            ""
        ]
    },
    "모토하": {
        basic: [
            { label: "의식 6", value: "1 › 2 › 1 › 2 › 1 › 2" }
        ],
        note: [
            ""
        ]
    },
    "모토하·여름": {
        basic: [
            { label: "의식 0", value: "3 › 1 › 1 › 3 › 1 › 1" },
            { label: "의식 1", value: "3 › 1 › 3 › 1 › 3 › 1" }
        ],
        basic_en: [
            { label: "A0", value: "3 › 3 › 1 › 3 › 3 › 1" },
            { label: "A0", value: "3 › 1 › 3 › 3 › 1 › 3" },
            { label: "A6", value: "3 › 3 › 3 › 3 › 3 › 3" }
        ],
        basic_jp: [
            { label: "意識 0", value: "3 › 3 › 1 › 3 › 3 › 1" },
            { label: "意識 0", value: "3 › 1 › 3 › 3 › 1 › 3" },
            { label: "意識 6", value: "3 › 3 › 3 › 3 › 3 › 3" }
        ],
        note: [
            ""
        ]
    },
    "몽타뉴": {
        basic: [
            { label: "의식 6", value: "2 › 3 › 2 › 3 › 2 › 3" }
        ],
        note: [
            ""
        ]
    },
    "몽타뉴·백조": {
        basic: [
            { label: "의식 0", value: "3 › 1 › 3 › 1 › 3 › 1" },
            { label: "의식 6", value: "3 › 1 › 1 › 3 › 1 › 1" }
        ],
        note: [
            ""
        ]
    },
    "세이지": {
        basic: [
            { label: "의식 6", value: "3 › 3 › 3 › 3 › 3 › 3" }
        ],
        note: [
            ""
        ]
    },
    "슌": {
        basic: [
            { label: "의식 6", value: "총기 › 3 › 2 › 총기 › 3 › 2" }
        ],
        basic_en: [
            { label: "A6", value: "Gun › 3 › 2 › Gun › 3 › 2" }
        ],
        basic_jp: [
            { label: "意識 6", value: "銃 › 3 › 2 › 銃 › 3 › 2" }
        ],
        note: [
            ""
        ]
    },
    "아야카": {
        basic: [
            { label: "의식 0", value: "2 › 1 › 3 › 2 › 1 › 3" },
            { label: "의식 1", value: "1 › 1 › 3 › 2 › 1 › 3" },
            { label: "의식 6", value: "3 › 1 › 3 › 2 › 1 › 3" }
        ],
        basic_en: [
            { label: "A0", value: "2 › 1 › 3 › 2 › 1 › 3" },
            { label: "A1", value: "1 › 1 › 3 › 2 › 1 › 3" },
            { label: "A6", value: "3 › 1 › 3 › 2 › 1 › 3" },
            { label: "A6", value: "3 › 1 › 3 › 2 › 3 › 1" },
            { label: "A6", value: "1 › 3 › 2 › 3 › 2 › 3" }
        ],
        basic_jp: [
            { label: "意識 0", value: "2 › 1 › 3 › 2 › 1 › 3" },
            { label: "意識 1", value: "1 › 1 › 3 › 2 › 1 › 3" },
            { label: "意識 6", value: "3 › 1 › 3 › 2 › 1 › 3" },
            { label: "意識 6", value: "3 › 1 › 3 › 2 › 3 › 1" },
            { label: "意識 6", value: "1 › 3 › 2 › 3 › 2 › 3" }
        ],
        note: [
            "· 전용무기 5개조 이상 + HL 25% 계시 착용 시 전투 시작 HL 100%"
        ],
        note_en: [
            "· Exclusive weapon+5 and are wearing HL 25%, you will start the battle with HL 100%",
            "· The A6 received buffs in GLB, diversifying its cycles."
        ],
        note_jp: [
            "· 専用武器5組以上＋HL25%啓示着用時、戦闘開始HL100%。"
        ]
    },
    "안": {
        basic: [
            { label: "의식 0", value: "3 › 1 › 3 › 1 › 3 › 1" },
        ],
        note: [
            "· 몰두 활성화 순서에 따라 1, 3 순서 변경"
        ],
        note_en: [
            "· Change the order of Lavian Rose activations to 1, 3, and so on"
        ],
        note_jp: [
            "· 『ラビアンローズ』状態に合わせて、スキルの順序を変更してください"
        ]
    },
    "야오링": {
        basic: [
            { label: "의식 0", value: "1 › 3 › 1 › 3 › 1 › 3" },
            { label: "의식 6", value: "3 › 3 › 3 › 3 › 3 › 3" }
        ],
        note: [
            "· 방어력 감소 상황에 따라 택틱 변화"
        ],
        note_en: [
            "· Tactics change based on enemy's defense reduction"
        ],
        note_jp: [
            "· 敵の防御力の減少状況に応じて、戦術が変化します。"
        ]
    },
    "야오링·사자무": {
        basic: [
            { label: "의식 0", value: "1 › 3 + 근접 › 1 › 3 + 근접 › 1 › 3 + 근접" },
            { label: "의식 1", value: "1 › 3 + 근접 › 근접 › 1 › 3 + 근접 › 근접" },
            { label: "의식 1 (3/6턴)", value: "근접 › 3 + 1 › 근접 › 근접 › 3 + 1 › 근접" },
            { label: "의식 6", value: "3 + 1 › 근접 › 근접 › 근접 › 근접 › 근접" }
        ],
        basic_en: [
            { label: "A0", value: "1 › 3 + Melee › 1 › 3 + Melee › 1 › 3 + Melee" },
            { label: "A1", value: "1 › 3 + Melee › Melee › 1 › 3 + Melee › Melee" },
            { label: "A1 (3/6Turn)", value: "Melee › 3 + 1 › Melee › Melee › 3 + 1 › Melee" },
            { label: "A6", value: "3 + 1 › Melee › Melee › Melee › Melee › Melee" }
        ],
        basic_jp: [
            { label: "意識 0", value: "1 › 3 + 接近 › 1 › 3 + 接近 › 1 › 3 + 接近" },
            { label: "意識 1", value: "1 › 3 + 接近 › 接近 › 1 › 3 + 接近 › 接近" },
            { label: "意識 1 (3/6턴Turn)", value: "接近 › 3 + 1 › 接近 › 接近 › 3 + 1 › 接近" },
            { label: "意識 6", value: "3 + 1 › 接近 › 接近 › 接近 › 接近 › 接近" }
        ],
        note: [
            ""
        ]
    },
    "유스케": {
        basic: [
            { label: "의식 0", value: "3 › 2 › 3 › 2 › 3 › 2" },
        ],
        note: [
            "· 전투 순서 1번으로 설정해야 버프 유지시간 최대화"
        ],
        note_en: [
            "· Set the battle order to 1 to maximize the duration of the buff"
        ],
        note_jp: [
            "· 戦闘順序を1番に設定してバフ維持時間最大化"
        ]
    },
    "유우미": {
        basic: [
            { label: "의식 0", value: "- › 3 › 2 › 3 › 1" },
        ],
        note: [
            "· 전투 시작 팀 속성에 따라 칵테일을 제조하므로 원더의 선두 페르소나 활용",
            "· 전용무기 행동 감소 회수 및 파티에 따라 운영 변화"
        ],
        note_en: [
            "· Make cocktails based on the team's attribute at the start of the battle, so use the first persona of Wonder",
            "· The operation changes based on the number of exclusive weapon actions and the party"
        ],
        note_jp: [
            "· 戦闘開始時に『テイクオーダー』の効果でフレーバーを取得する際、ワンダーは先頭のペルソナの属性として扱われます",
            "· 専用武器の行動減少回数とパーティーによって運用が変化します。"
        ]
    },
    "YUI": {
        basic: [
            { label: "의식 0", value: "3 › 1 › 3 › 1 › 3 › 1" },
        ],
        note: [
            ""
        ]
    },
    "유키미": {
        basic: [
            { label: "의식 6", value: "2 › 3 › 2 › 3 › 2 › 3" },
        ],
        note: [
            ""
        ]
    },
    "카스미": {
        basic: [
            { label: "의식 0", value: "2 › 1 + 변신 › 2 + HL › 2 › 1 › 2 + 변신 + HL" },
            { label: "의식 1", value: "2 › 1 + 변신 + HL › 3 › 2 › 1 + 변신 + HL › 3" },
            { label: "의식 6", value: "2 › 3 › 변신 + HL + HL + 3 › 2 › 3 › 변신 + HL + HL + 3" }
        ],
        basic_en: [
            { label: "A0", value: "2 › 1 + Trans › 2 + HL › 2 › 1 › 2 + Trans + HL" },
            { label: "A1", value: "2 › 1 + Trans + HL › 3 › 2 › 1 + Trans + HL › 3" },
            { label: "A6", value: "2 › 3 › Trans + HL + HL + 3 › 2 › 3 › Trans + HL + HL + 3" }
        ],
        basic_jp: [
            { label: "意識 0", value: "2 › 1 + 変身 › 2 + HL › 2 › 1 › 2 + 変身 + HL" },
            { label: "意識 1", value: "2 › 1 + 変身 + HL › 3 › 2 › 1 + 変身 + HL › 3" },
            { label: "意識 6", value: "2 › 3 › 変身 + HL + HL + 3 › 2 › 3 › 変身 + HL + HL + 3" }
        ],
        note: [
            "· 2스킬 + 1스킬 3회 스택 예열 이후 HL 사용"
        ],
        note_en: [
            "· Use HL after 3 stacks of skill 2 + skill 1"
        ],
        note_jp: [
            "· スキル2 + スキル1のスタックを3回予熱してからHLを使用する"
        ]
    },
    "카요": {
        basic: [
            { label: "의식 6", value: "3 › 1 › 3 › 1" }
        ],
        note: [
            ""
        ]
    },
    "키라": {
        basic: [
            { label: "의식 0", value: "1 › 1 › 2 › 2 › 2 › 변신 + 2" },
            { label: "의식 1", value: "1 › 변신 + 1 › 1 › 2 › 변신 + 1 › 변신 + 2" },
            { label: "의식 6", value: "1 › 변신 + 1 › 변신 + 1 › 2 › 변신 + 1 › 변신 + 2"}
        ],
        basic_en: [
            { label: "A0", value: "1 › 1 › 2 › 2 › 2 › 3 + 2" },
            { label: "A1", value: "1 › 3 + 1 › 1 › 2 › 3 + 1 › 3 + 2" },
            { label: "A6", value: "1 › 3 + 1 › 3 + 1 › 2 › 3 + 1 › 3 + 2"}
        ],
        basic_jp: [
            { label: "意識 0", value: "1 › 1 › 2 › 2 › 2 › 変身 + 2" },
            { label: "意識 1", value: "1 › 変身 + 1 › 1 › 2 › 変身 + 1 › 変身 + 2" },
            { label: "意識 6", value: "1 › 変身 + 1 › 変身 + 1 › 2 › 変身 + 1 › 変身 + 2"}
        ],
        note: [
            "· 지속 대미지 기믹에 따라 사냥꾼/집행관 비율 조정",
            "· HL에 유혈 5스택이 포함돼있어 HL 여부에 따라 택틱 크게 변화"
        ],
        note_en: [
            "· Adjust the ratio of hunter/executioner based on the duration of the damage",
            "· The tactic changes greatly based on whether HL is used"
        ],
        note_jp: [
            "· 持続ダメージの基ミックによって狩猟者/執行官の比率を調整",
            "· HLを使用するかどうかによって大いにテクニックが変化します"
        ]
    },
    "키요시": {
        basic: [
            { label: "의식 6", value: "2 › 2 › 2 › 2 › 2 › 2" }
        ],
        note: [
            "· 사전 화상 효과 부여 필요"
        ],
        note_en: [
            "· Pre-apply the burn effect"
        ],
        note_jp: [
            "· 燃焼効果を事前付与する必要がある"
        ]
    },
    "토모코": {
        basic: [
            { label: "의식 6", value: "2 › 3 › 2 › 1 › 2 › 3" }
        ],
        note: [
            ""
        ]
    },
    "토모코·여름": {
        basic: [
            { label: "의식 0", value: "2 › 3 › 2 › 3 › 2 › 3" }
        ],
        note: [
            ""
        ]
    },
    "토시야": {
        basic: [
            { label: "의식 6", value: "1 › 1 › 1 › 1 › 1 › 1" }
        ],
        note: [
            ""
        ]
    },
    "하루": {
        basic: [
            { label: "의식 0", value: "1 › HL + 3 › 총격 › 1 › 3 › HL + 총격" },
        ],
        basic_en: [
            { label: "A0", value: "1 › HL + 3 › Gun › 1 › 3 › HL + Gun" }
        ],
        basic_jp: [
            { label: "意識 0", value: "1 › HL + 3 › 銃 › 1 › 3 › HL + 銃" }
        ],
        note: [
            ""
        ]
    },
    "하루나": {
        basic: [
            { label: "의식 0", value: "1 › 3 › 1 › 3 › 1 › 3" },
        ],
        note: [
            ""
        ]
    },
    "치즈코": {
        basic: [
            { label: "의식 6", value: "1 › 3 › 1 › 3 › 1 › 3" },
        ],
        note: [
            ""
        ]
    },
    "후타바": {
        basic: [
            { label: "의식 0", value: "1 › 3 › 1 › 3" },
        ],
        note: [
            ""
        ]
    }
}; 