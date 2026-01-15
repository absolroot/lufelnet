// ==== BEGIN STATIC CRITICAL DATA (ORDER PRESERVED) ====
const criticalBuffData = {
    "공통": [
              { id: "default", type: "기본값", type_en: "Default", type_jp: "基本", target: "-", skillIcon: "/assets/img/skill-element/패시브.png", skillName: "기본 크리티컬 확률", skillName_en: "Default Critical Rate", skillName_jp: "基本CRT発生率", options: [], value: 5, duration: "-", note: "" },
              { id: "myPalace", type: "마이팰리스", type_en: "Thieves Den", type_jp: "マイパレス", target: "광역", skillIcon: "/assets/img/etc/MyPalace-level-10.webp", skillName: "마이팰리스", skillName_en: "Thieves Den", skillName_jp: "マイパレス", options: [], value: 1, duration: "-", note: "" },
              { id: "elec", type: "원소이상", type_en: "Elemental Exceed", type_jp: "元素超凡", target: "단일/광역", skillIcon: "/assets/img/skill-element/전격광역.png", skillName: "감전", skillName_en: "Shock", skillName_jp: "感電", options: [], value: 10, duration: "-", note: "" }
    ],
    "원더": [
              { id: "wonder1", type: "스킬", type_en: "Skill", type_jp: "スキル", target: "단일", target_en: "Single", target_jp: "単体", skillIcon: "/assets/img/skill-element/버프.png", skillName: "리벨리온", skillName_en: "Rebellion", skillName_jp: "リベリオン", options: ["LV6","LV7","LV8"], values: { "LV6": 15.7, "LV7": 16.5, "LV8": 17.2}, defaultOption: "LV8", value: 17.2, duration: "3턴", note: "원더 크리티컬 확률 40% 이상", note_en: "Wonder critical rate 40% or above", note_jp: "ワンダーCRT発生率40%以上" },
              { id: "wonder2", type: "스킬", type_en: "Skill", type_jp: "スキル", target: "광역", target_en: "Multi", target_jp: "複数対象", skillIcon: "/assets/img/skill-element/버프광역.png", skillName: "레볼루션", skillName_en: "Revolution", skillName_jp: "レボリューション", options: ["LV6","LV7","LV8"], values: { "LV6": 10.9, "LV7": 11.4, "LV8": 12.0}, defaultOption: "LV8", value: 12.0, duration: "3턴", note: "원더 크리티컬 확률 40% 이상", note_en: "Wonder critical rate 40% or above", note_jp: "ワンダーCRT発生率40%以上" },
              { id: "wonder3", type: "페르소나", type_en: "Persona", type_jp: "ペルソナ", target: "단일", target_en: "Single", target_jp: "単体", skillIcon: "/assets/img/tactic-persona/광목천.webp", skillName: "광목천 - 본능", skillName_en: "Koumokuten - Talent", skillName_jp: "コウモクテン - 本能", options: [], value: 6, duration: "3턴", note: "전투 시작 시", note_en: "start of the battle", note_jp: "戦闘開始時" },
              { id: "wonder4", type: "페르소나", type_en: "Persona", type_jp: "ペルソナ", target: "광역", target_en: "Multi", target_jp: "複数対象", skillIcon: "/assets/img/tactic-persona/아메노우즈메.webp", skillName: "아메노우즈메 - 본능", skillName_en: "Ame-no-Uzume - Talent", skillName_jp: "アメノウズメ - 本能", options: [], value: 10, duration: "2턴", note: "감전 효과 부여 시", note_en: "When shocked", note_jp: "感電効果付与時" },
              { id: "wonder5", type: "페르소나", type_en: "Persona", type_jp: "ペルソナ", target: "단일", target_en: "Single", target_jp: "単体", skillIcon: "/assets/img/tactic-persona/서큐버스.webp", skillName: "서큐버스 - 본능", skillName_en: "Succubus - Talent", skillName_jp: "サキュバス - 本能", options: [], value: 11.7, duration: "1턴", note: "동료를 목표로 스킬 시전 시", note_en: "targeting an ally", note_jp: "仲間を対象にする時" },
              { id: "wonder6", type: "페르소나", type_en: "Persona", type_jp: "ペルソナ", target: "광역", target_en: "Multi", target_jp: "複数対象", skillIcon: "/assets/img/tactic-persona/시바.webp", skillName: "시바 - 본능", skillName_en: "Shiva - Talent", skillName_jp: "シヴァ - 本能", options: [], value: 18, duration: "1턴", note: "3중첩 / 목표가 염동 대미지를 받을 때", note_en: "3 hits / target takes PSY damage", note_jp: "3重 / 目標が念動ダメージを受けた時" },
              { id: "wonder7", type: "페르소나", type_en: "Persona", type_jp: "ペルソナ", target: "광역", target_en: "Multi", target_jp: "複数対象", skillIcon: "/assets/img/tactic-persona/야노식.webp", skillName: "야노식 - 본능", skillName_en: "anosik - Talent", skillName_jp: "ヤノシーク - 本能", options: [], value: 4.5, duration: "2턴", note: "본능4", note_en: "Unique Passive LV4", note_jp: "本能 LV4" },
              { id: "wonder8", type: "페르소나", type_en: "Persona", type_jp: "ペルソナ", target: "광역", target_en: "Multi", target_jp: "複数対象", skillIcon: "/assets/img/tactic-persona/마카브르.webp", skillName: "마카브르 - 고유 스킬", skillName_en: "Macabre - Unique Skill", skillName_jp: "マカーブル - 特殊スキル", options: ["LV6","LV7","LV8"], values: { "LV6": 10, "LV7": 10.5, "LV8": 11.0}, defaultOption: "LV8", value: 11.0, duration: "3턴", note: "지배", note_en: "Sweeper", note_jp: "支配" }

    ],

    "후카": [
              { id: "fuka1", type: "의식1", target: "광역", target_en: "Multi", target_jp: "複数対象", skillIcon: "/assets/img/character-detail/ritual1.png", skillName: "내가 있을 곳", skillName_en: "", skillName_jp: "", options: [], value: 12, duration: "2턴", note: "2중첩", note_en: "2Stack", note_jp: "2重" }
    ],
    "미츠루": [
              { id: "mitsuru1", type: "의식1", target: "광역", target_en: "Multi", target_jp: "複数対象", skillIcon: "/assets/img/character-detail/ritual1.png", skillName: "Brilliant！", skillName_en: "A1", skillName_jp: "意識1", options: [], value: 10, duration: "-", note: "『혹한 결속』", note_en: " ", note_jp: " " }
    ],
    "미나미·여름": [
              { id: "minami-summer", type: "스킬3", target: "단일", target_en: "Single", target_jp: "単体", skillIcon: "/assets/img/skill-element/버프.png", skillName: "너를 위한 꽃", skillName_en: "Skill 3", skillName_jp: "スキル3", options: ["LV10", "LV10+심상5", "LV13", "LV13+심상5"], values: { "LV10": 15.6, "LV10+심상5": 17.2, "LV13": 16.6, "LV13+심상5": 18.2 }, defaultOption: "LV13+심상5", value: 18.2, duration: "3턴", note: "" }
    ],
    "마나카": [
              { id: "manaka1", type: "의식1", target: "광역", target_en: "Multi", target_jp: "複数対象", skillIcon: "/assets/img/character-detail/ritual1.png", skillName: "시작의 멜로디", skillName_en: "A1", skillName_jp: "意識1", options: [], value: 12, duration: "2턴", note: "『시공의 윤회』사용 시", note_en: "When using Skill3", note_jp: "スキル3使用時" }
    ],
    "리코·매화": [
              { id: "rico-flower", type: "스킬3", target: "단일/광역", target_en: "Single/Multi", target_jp: "単体/複数対象", skillIcon: "/assets/img/skill-element/버프.png", skillName: "매화의 잔향", skillName_en: "Skill 3", skillName_jp: "スキル3", options: ["LV10", "LV10+심상5", "LV13", "LV13+심상5"], values: { "LV10": 16, "LV10+심상5": 17, "LV13": 17, "LV13+심상5": 18 }, defaultOption: "LV13+심상5", value: 18, duration: "2턴", note: "의식6 → 광역으로 변경", note_en: "A6 → Multi", note_jp: "凸6→複数対象" }
    ],
    "카스미": [
      { id: "kasmi2", type: "의식1", target: "단일/자신", target_en: "Single/Self", target_jp: "単体/自分", skillIcon: "/assets/img/character-detail/ritual1.png", skillName: "찢어진 치마와 그녀의 그림자", skillName_en: "A1", skillName_jp: "意識1", options: [], values: {}, value: 15, duration: "3턴", note: "『함께 추는 춤』스킬 2 사용 시", note_en: "Skill2", note_jp: "スキル2" },
    ]
    ,
    "아야카": [
              { id: "ayaka", type: "의식1", target: "단일", target_en: "Single", target_jp: "単体", skillIcon: "/assets/img/character-detail/ritual1.png", skillName: "♩새벽 맞이♪", skillName_en: "A1", skillName_jp: "意識1", options: [], values: {}, value: 15, duration: "2턴", note: "『열성 관객』", note_en: "Skill2", note_jp: "スキル2" }
    ],
    "후타바": [
              { id: "futaba", type: "의식1", target: "광역", target_en: "Multi", target_jp: "複数対象", skillIcon: "/assets/img/character-detail/ritual1.png", skillName: "스캔 분석", skillName_en: "A1", skillName_jp: "意識1", options: [], values: {}, value: 12, duration: "2/3턴", note: "『분석 진도』100% /『해킹 완료』", note_en: "100% / Hacked", note_jp: "100% / ハッキング完了" }
    ],
    "유우미": [
              { id: "yuwoomi", type: "전용무기", type_en: "Exclusive Weapon", type_jp: "専用武器", target: "광역", target_en: "Multi", target_jp: "複数対象", skillIcon: "/assets/img/character-weapon/유우미-5-01.png", skillName: "월하의 깃털", skillName_en: "Exclusive Weapon", skillName_jp: "武器", options: ["개조0", "개조1&2", "개조3&4", "개조5&6"], values: { "개조0": 4, "개조1&2": 5.2, "개조3&4": 6.4, "개조5&6": 7.6 }, defaultOption: "개조5&6", value: 7.6, duration: "2턴", note: "" }
    ],
    "YUI": [
              { id: "yui", type: "스킬3", target: "단일", target_en: "Single", target_jp: "単体", skillIcon: "/assets/img/skill-element/버프.png", skillName: "초희귀 보상", skillName_en: "Skill 3", skillName_jp: "スキル3", options: [], values: {}, value: 12, duration: "2턴", note: "『놀이친구』", note_en: " ", note_jp: " " }
    ],
    "마사키": [
              { id: "masaki", type: "의식6", target: "광역", target_en: "Multi", target_jp: "複数対象", skillIcon: "/assets/img/character-detail/ritual6.png", skillName: "진실한 사랑과 변치 않는 믿음", skillName_en: "A6", skillName_jp: "意識6", options: [], values: {}, value: 15, duration: "2턴", note: "" }
    ]
  };
  
  const criticalSelfData = {
    "계시": [
              { id: "미덕", type: "계시", type_en: "Revelation", type_jp: "啓示", target: "자신", target_en: "Self", target_jp: "自分", skillIcon: "/assets/img/revelation/미덕.webp", skillName: "미덕", skillName_en: "Virtue", skillName_jp: "美徳", options: [], value: 12, duration: "-", note: "생명 백분율 50% 이상", note_en: "Health percentage 50% or above", note_jp: "HP 50%以上" },
              { id: "개선", type: "계시", type_en: "Revelation", type_jp: "啓示", target: "자신", target_en: "Self", target_jp: "自分", skillIcon: "/assets/img/revelation/개선.webp", skillName: "개선", skillName_en: "Triumph", skillName_jp: "改善", options: [], value: 7.5, duration: "-", note: "" },
              { id: "자유", type: "계시", type_en: "Revelation", type_jp: "啓示", target: "자신", target_en: "Self", target_jp: "自分", skillIcon: "/assets/img/revelation/자유.webp", skillName: "자유-실망", skillName_en: "Freedom-Despair", skillName_jp: "自由-失望", options: [], value: 12, duration: "-", note: "만능 속성 한정", note_en: "Only Allmighty", note_jp: "万能属性" },
              { id: "희망", type: "계시", type_en: "Revelation", type_jp: "啓示", target: "자신", target_en: "Self", target_jp: "自分", skillIcon: "/assets/img/revelation/희망.webp", skillName: "희망-고집", skillName_en: "Hope-Fixation", skillName_jp: "希望-固執", options: [], value: 6, duration: "3턴", note: "스킬로 대미지 8회 중첩 시 효력 발생", note_en: "Skill damage 8 consecutive hits", note_jp: "スキルで8回連続ダメージ" }
    ],

    "J&C": [
      { id: "jc1", type: "스킬2", target: "자신", target_en: "자신", target_jp: "自分", skillIcon: "/assets/img/skill-element/축복주원.png", skillName: "복과와 화근의 페르소나", skillName_en: "Skill 2", skillName_jp: "スキル2", options: ["LV10", "LV10+심상5", "LV13", "LV13+심상5"], values: { "LV10": 9.8, "LV10+심상5": 10.8, "LV13": 10.4, "LV13+심상5": 11.4 }, defaultOption: "LV13+심상5", value: 11.4, duration: "3턴", note: "지배/굴복/반항", note_en: "Mask of Luck & Loss", note_jp: "福果と禍因の仮面" },
      { id: "jc2", type: "패시브", target: "자신", target_en: "자신", target_jp: "自分", skillIcon: "/assets/img/skill-element/패시브.png", skillName: "모순", skillName_en: "", skillName_jp: "", options: [], value: 15.0, duration: "", note: "지배", note_en: "Sweeper", note_jp: "支配" }
    ],

    "쇼키·암야": [
        { id: "shoki-darkest1", type: "전용무기", type_en: "Exclusive Weapon", type_jp: "専用武器", target: "자신", target_en: "Self", target_jp: "自分", skillIcon: "/assets/img/character-weapon/쇼키·암야-5-01.png", skillName: "신들의 왕정", skillName_en: "Exclusive Weapon", skillName_jp: "専用武器", options: ["개조0", "개조1&2", "개조3&4", "개조5&6"], values: { "개조0": 16.4, "개조1&2": 21.4, "개조3&4": 26.4, "개조5&6": 31.4 }, defaultOption: "개조5&6", value: 31.4, duration: "", note: "" },
        { id: "shoki-darkest2", type: "의식1", target: "자신", target_en: "Self", target_jp: "自分", skillIcon: "/assets/img/character-detail/ritual1.png", skillName: "유성의 인도", skillName_en: "A1", skillName_jp: "意識1", options: [], values: {}, value: 15, duration: "2턴", note: "5중첩", note_en: "5 Stack", note_jp: "5 重" }
    ],

    "미츠루": [
              { id: "mitsuru2", type: "전용무기", type_en: "Exclusive Weapon", type_jp: "専用武器", target: "자신", target_en: "Self", target_jp: "自分", skillIcon: "/assets/img/character-weapon/미츠루-5-01.png", skillName: "성창 롱기누스", skillName_en: "Exclusive Weapon", skillName_jp: "専用武器", options: ["개조0&1", "개조2&3", "개조4&5", "개조6"], values: { "개조0&1": 18.1, "개조2&3": 23.5, "개조4&5": 28.9, "개조6": 34.3 }, defaultOption: "개조6", value: 34.3, duration: "", note: "" },
              { id: "mitsuru3", type: "스킬3", target: "자신", target_en: "Self", target_jp: "自分", skillIcon: "/assets/img/skill-element/빙결.png", skillName: "얼음의 무도", skillName_en: "Skill 3", skillName_jp: "スキル3", options: [], values: {}, value: 15, duration: "2턴", note: "『서리 결정』 5중첩", note_en: "5 Stack", note_jp: "5 重" }
    ],
    "YUI·스텔라": [
              { id: "yui-stella1", type: "스킬2", type_en: "S1", type_jp: "スキル2", target: "자신", target_en: "Self", target_jp: "自分", skillIcon: "/assets/img/skill-element/버프.png", skillName: "베지나이츠·집합", skillName_en: "S2", skillName_jp: "スキル2", options: ["LV10", "LV10+심상5", "LV13", "LV13+심상5"], values: { "LV10": 11.7, "LV10+심상5": 12.9, "LV13": 12.4, "LV13+심상5": 13.6 }, defaultOption: "LV13+심상5", value: 13.6, duration: "2턴", note: "" },
              { id: "yui-stella2", type: "전용무기", type_en: "Exclusive Weapon", type_jp: "専用武器", target: "자신", target_en: "Self", target_jp: "自分", skillIcon: "/assets/img/character-weapon/YUI·스텔라-5-01.png", skillName: "심우주 횡단선", skillName_en: "Exclusive Weapon", skillName_jp: "専用武器", options: ["개조0&1", "개조2&3", "개조4&5", "개조6"], values: { "개조0&1": 18.1, "개조2&3": 23.5, "개조4&5": 28.9, "개조6": 34.3 }, defaultOption: "개조6", value: 34.3, duration: "", note: "" }
    ],
    "카타야마": [
              { id: "katayama1", type: "의식6", target: "자신", target_en: "Self", target_jp: "自分", skillIcon: "/assets/img/character-detail/ritual6.png", skillName: "불멸 교사혼", skillName_en: "A6", skillName_jp: "意識6", options: [], value: 10, duration: "1턴", note: "" },
              { id: "katayama2", type: "전용무기", type_en: "Exclusive Weapon", type_jp: "専用武器", target: "자신", target_en: "Self", target_jp: "自分", skillIcon: "/assets/img/character-weapon/카타야마-5-01.png", skillName: "철의 맹세 늑대기병", skillName_en: "Exclusive Weapon", skillName_jp: "専用武器", options: ["개조0", "개조1&2", "개조3&4", "개조5&6"], values: { "개조0": 9, "개조1&2": 11.7, "개조3&4": 14.3, "개조5&6": 17 }, defaultOption: "개조5&6", value: 17, duration: "2턴", note: "스킬3" },
              { id: "katayama3", type: "심상", target: "자신", target_en: "Self", target_jp: "自分", skillIcon: "/assets/img/character-detail/item-mind_stat2.png", skillName: "진급강화", skillName_en: "Mindscape", skillName_jp: "イメジャリー", options: [], value: 12, duration: "-", note: "", note_en: "", note_jp: "" }
    ],
    "미유·여름": [
              { id: "miyu-summer1", type: "의식0", type_en: "A0", type_jp: "意識0", target: "자신", target_en: "Self", target_jp: "自分", skillIcon: "/assets/img/character-detail/ritual0.png", skillName: "바다의 부름", skillName_en: "A0", skillName_jp: "意識0", options: [], values: {}, value: 12, duration: "", note: "SP회복량 300", note_en: "", note_jp: "" },
              { id: "miyu-summer2", type: "전용무기", type_en: "Exclusive Weapon", type_jp: "専用武器", target: "자신", target_en: "Self", target_jp: "自分", skillIcon: "/assets/img/character-weapon/미유·여름-5-01.png", skillName: "꿈 속의 인어공주", skillName_en: "Exclusive Weapon", skillName_jp: "専用武器", options: ["개조0", "개조1&2", "개조3&4", "개조5&6"], values: { "개조0": 16.4, "개조1&2": 21.4, "개조3&4": 26.4, "개조5&6": 31.4 }, defaultOption: "개조5&6", value: 31.4, duration: "", note: "추가 효과" },
              { id: "miyu-summer3", type: "심상", target: "자신", target_en: "Self", target_jp: "自分", skillIcon: "/assets/img/character-detail/item-mind_stat2.png", skillName: "진급강화", skillName_en: "Mindscape", skillName_jp: "イメジャリー", options: [], value: 12, duration: "-", note: "" }
    ],
    "이치고": [
              { id: "ichigo1", type: "의식0", type_en: "A0", type_jp: "意識0", target: "자신", target_en: "Self", target_jp: "自分", skillIcon: "/assets/img/character-detail/ritual0.png", skillName: "중독된 사랑", skillName_en: "A0", skillName_jp: "意識0", options: [], values: {}, value: 15, duration: "", note: "『집착』 2중첩", note_en: "2중첩", note_jp: "2중첩" },
              { id: "ichigo2", type: "전용무기", type_en: "Exclusive Weapon", type_jp: "専用武器", target: "자신", target_en: "Self", target_jp: "自分", skillIcon: "/assets/img/character-weapon/이치고-5-01.png", skillName: "죽음의 인형극", skillName_en: "Exclusive Weapon", skillName_jp: "専用武器", options: ["개조0", "개조1&2", "개조3&4", "개조5&6"], values: { "개조0": 18.1, "개조1&2": 23.5, "개조3&4": 28.9, "개조5&6": 34.3 }, defaultOption: "개조5&6", value: 34.3, duration: "", note: "" }
    ],
    "사나다": [
              { id: "sanada1", type: "의식1", target: "자신", target_en: "Self", target_jp: "自分", skillIcon: "/assets/img/character-detail/ritual1.png", skillName: "복싱부 주장", skillName_en: "A1", skillName_jp: "意識1", options: [], values: {}, value: 20, duration: "-", note: "" },
              { id: "sanada2", type: "전용무기", type_en: "Exclusive Weapon", type_jp: "専用武器", target: "자신", target_en: "Self", target_jp: "自分", skillIcon: "/assets/img/character-weapon/사나다-5-01.png", skillName: "사바지오스", skillName_en: "Exclusive Weapon", skillName_jp: "専用武器", options: ["개조0", "개조1&2", "개조3&4", "개조5&6"], values: { "개조0": 16.4, "개조1&2": 21.4, "개조3&4": 26.4, "개조5&6": 31.4 }, defaultOption: "개조5&6", value: 31.4, duration: "2턴", note: "집념 2중첩", note_en: "2중첩", note_jp: "2중첩" },
              { 
                id: "sanada5",
                type: "잠재력", type_en: "Status", type_jp: "",
                target: "자신",
                skillIcon: "/assets/img/tier/사나다.webp",
                skillName: "LV80", skillName_en:"Default LV80", skillName_jp:"LV80",
                value: 22.4, duration: "-", note: ""
              }
    ],
    "유키 마코토": [
              { id: "yukimakoto1", type: "의식1", target: "자신", target_en: "Self", target_jp: "自分", skillIcon: "/assets/img/character-detail/ritual1.png", skillName: "우연한 인연", skillName_en: "A1", skillName_jp: "意識1", options: [], value: 16, duration: "-", note: "월상 4중첩", note_en: "Moon 4stack", note_jp: "月相4重" },
              { id: "yukimakoto2", type: "전용무기", type_en: "Exclusive Weapon", type_jp: "専用武器", target: "자신", target_en: "Self", target_jp: "自分", skillIcon: "/assets/img/character-weapon/유키 마코토-5-01.png", skillName: "데오스사이포스", skillName_en: "Exclusive Weapon", skillName_jp: "専用武器", options: ["개조0", "개조1&2", "개조3&4", "개조5&6"], values: { "개조0": 16.3, "개조1&2": 21.2, "개조3&4": 26.1, "개조5&6": 31 }, defaultOption: "개조5&6", value: 31, duration: "2턴", note: "월상 3중첩", note_en: "Moon 3stack", note_jp: "月相3重" }
    ],
    "마유미": [
              { id: "mayumi1", type: "의식6", target: "자신", target_en: "Self", target_jp: "自分", skillIcon: "/assets/img/character-detail/ritual6.png", skillName: "질주에 대한 갈망", skillName_en: "A6", skillName_jp: "意識6", options: [], values: {}, value: 20, duration: "-", note: "고급 강화 효과『소용돌이 억압』", note_en: "Accelerate skill1", note_jp: "スキル1加速" },
              { id: "mayumi2", type: "심상", target: "자신", target_en: "Self", target_jp: "自分", skillIcon: "/assets/img/character-detail/item-mind_stat2.png", skillName: "진급강화", skillName_en: "Mindscape", skillName_jp: "イメジャリー", options: [], value: 12, duration: "-", note: "" }
    ],
    "아케치": [
              { id: "akechi1", type: "의식1", target: "자신", target_en: "Self", target_jp: "自分", skillIcon: "/assets/img/character-detail/ritual1.png", skillName: "혐의 조사", skillName_en: "A1", skillName_jp: "意識1", options: [], values: {}, value: 16, duration: "-", note: "『정확』 상태와 『혼돈』 상태가 공존 시", note_en: "Accurate and Chaos", note_jp: "正確と混乱が同時に存在する時" },
              { id: "akechi2", type: "의식6", target: "자신", target_en: "Self", target_jp: "自分", skillIcon: "/assets/img/character-detail/ritual6.png", skillName: "일단락", skillName_en: "A6", skillName_jp: "意識6", options: [], values: {}, value: 20, duration: "-", note: "아군 괴도 크리티컬 확률 합산 50% 이상", note_en: "All allies critical rate 50% or more", note_jp: "全味方のCRT発生率50%以上" },
              { id: "akechi3", type: "심상", target: "자신", target_en: "Self", target_jp: "自分", skillIcon: "/assets/img/character-detail/item-mind_stat2.png", skillName: "진급강화", skillName_en: "Mindscape", skillName_jp: "イメジャリー", options: [], value: 12, duration: "-", note: "" }
    ],
    "야오링·사자무": [
              { id: "yaoling-sajamu1", type: "의식2", type_en: "A2", type_jp: "意識2", target: "자신", target_en: "Self", target_jp: "自分", skillIcon: "/assets/img/character-detail/ritual2.png", skillName: "등불 속 기쁨", skillName_en: "A2", skillName_jp: "意識2", options: ["화상 1명", "화상 2명", "화상 3명"], values: { "화상 1명": 10, "화상 2명": 13, "화상 3명": 16 }, defaultOption: "화상 3명", value: 16, duration: "-", note: "" },
              { id: "yaoling-sajamu2", type: "스킬1", target: "자신", target_en: "Self", target_jp: "自分", skillIcon: "/assets/img/skill-element/화염광역.png", skillName: "새해의 축복", skillName_en: "Skill 1", skillName_jp: "スキル1", options: [], values: {}, value: 10, duration: "2턴", note: "의식6 이상 지속시간 영구", note_en: "A6 Infinite", note_jp: "意識6 永久" },
              { id: "yaoling-sajamu3", type: "전용무기", type_en: "Exclusive Weapon", type_jp: "専用武器", target: "자신", target_en: "Self", target_jp: "自分", skillIcon: "/assets/img/character-weapon/야오링·사자무-5-01.png", skillName: "따뜻한 봄별", skillName_en: "Exclusive Weapon", skillName_jp: "専用武器", options: ["개조0", "개조1&2", "개조3&4", "개조5&6"], values: { "개조0": 16, "개조1&2": 21, "개조3&4": 26, "개조5&6": 31 }, defaultOption: "개조5&6", value: 31, duration: "-", note: "『철꽃의 춤』 상태", note_en: "Transform state", note_jp: "鋼花の状態" }
    ],
    "카스미": [
              { id: "kasmi4", type: "HIGHLIGHT", type_en: "HIGHLIGHT", type_jp: "ハイライト", target: "자신", target_en: "Self", target_jp: "自分", skillIcon: "/assets/img/skill-element/버프.png", skillName: "HIGHLIGHT", skillName_en: "HIGHLIGHT", skillName_jp: "ハイライト", options: [], values: {}, value: 10, duration: "-", note: "『스위프트 스텝』 보유 시 하이라이트 한정", note_en: "HIGHLIGHT", note_jp: "ハイライト" },
              { id: "kasmi1", type: "의식0", type_en: "A0", type_jp: "意識0", target: "자신", target_en: "Self", target_jp: "自分", skillIcon: "/assets/img/character-detail/ritual0.png", skillName: "12시의 종소리", skillName_en: "A0", skillName_jp: "意識0", options: ["1중첩", "2중첩", "3중첩", "4중첩"], values: { "1중첩": 3, "2중첩": 6, "3중첩": 9, "4중첩": 12 }, defaultOption: "4중첩", value: 12, duration: "-", note: "『춤사위』", note_en: " ", note_jp: " " },
              { id: "kasmi3", type: "심상", target: "자신", target_en: "Self", target_jp: "自分", skillIcon: "/assets/img/character-detail/item-mind_stat2.png", skillName: "진급강화", skillName_en: "Mindscape", skillName_jp: "イメジャリー", options: [], value: 12, duration: "-", note: "" }
    ],
    "몽타뉴·백조": [
              { id: "mongtanew-baekso", type: "전용무기", type_en: "Exclusive Weapon", type_jp: "専用武器", target: "자신", target_en: "Self", target_jp: "自分", skillIcon: "/assets/img/character-weapon/몽타뉴·백조-5-01.png", skillName: "백조의 꿈", skillName_en: "Exclusive Weapon", skillName_jp: "専用武器", options: ["개조0", "개조1&2", "개조3&4", "개조5&6"], values: { "개조0": 16.2, "개조1&2": 21, "개조3&4": 25.8, "개조5&6": 30.6 }, defaultOption: "개조5&6", value: 30.6, duration: "2턴", note: "결정 3중첩 획득 기준", note_en: "3stack", note_jp: "3重" },
              { id: "mongtanew-baekso2", type: "심상", target: "자신", target_en: "Self", target_jp: "自分", skillIcon: "/assets/img/character-detail/item-mind_stat2.png", skillName: "진급강화", skillName_en: "Mindscape", skillName_jp: "イメジャリー", options: [], value: 12, duration: "-", note: "" }
    ],
    "하루": [
              { id: "haru3", type: "스킬3", target: "자신", target_en: "Self", target_jp: "自分", skillIcon: "/assets/img/skill-element/염동광역.png", skillName: "아이언 버스트", skillName_en: "Skill 3", skillName_jp: "スキル3", options: ["10레벨", "10레벨+5심상", "13레벨", "13레벨+5심상"], values: { "10레벨": 19.5, "10레벨+5심상": 19.5, "13레벨": 20.7, "13레벨+5심상": 20.7 }, defaultOption: "13레벨+5심상", value: 20.7, duration: "-", note: "『조준점』을 보유한 적 공격 시, 스킬3 한정", note_en: "Skill3", note_jp: "スキル3" },
              { id: "haru4", type: "HIGHLIGHT", type_en: "HIGHLIGHT", type_jp: "ハイライト", target: "자신", target_en: "Self", target_jp: "自分", skillIcon: "/assets/img/skill-element/염동광역.png", skillName: "HIGHLIGHT", skillName_en: "HIGHLIGHT", skillName_jp: "ハイライト", options: ["10레벨", "10레벨+5심상", "13레벨", "13레벨+5심상"], values: { "10레벨": 14.6, "10레벨+5심상": 14.6, "13레벨": 15.5, "13레벨+5심상": 15.5 }, defaultOption: "13레벨+5심상", value: 15.5, duration: "-", note: "『오버클럭 개조』획득, 총격 한정", note_en: "Gun Shot", note_jp: "銃撃" },
              { id: "haru1", type: "의식1", target: "자신", target_en: "Self", target_jp: "自分", skillIcon: "/assets/img/character-detail/ritual1.png", skillName: "부서진 치마", skillName_en: "A1", skillName_jp: "意識1", options: ["1중첩", "2중첩", "3중첩"], values: { "1중첩": 6, "2중첩": 12, "3중첩": 18 }, defaultOption: "3중첩", value: 18, duration: "-", note: "『조준점』 1개 당 6%", note_en: " ", note_jp: " " },
              { id: "haru2", type: "의식6", target: "자신", target_en: "Self", target_jp: "自分", skillIcon: "/assets/img/character-detail/ritual6.png", skillName: "악몽의 랩소디", skillName_en: "A6", skillName_jp: "意識6", options: [], values: {}, value: 20, duration: "-", note: "『개조』 2개 이상 중첩, 『확산 개조』및 『조준점』보유", note_en: " ", note_jp: " " }
    ],
    "모토하·여름": [
              { id: "motoha2", type: "스킬3", target: "자신", target_en: "Self", target_jp: "自分", skillIcon: "/assets/img/skill-element/축복광역.png", skillName: "파도 추격자", skillName_en: "Skill 3", skillName_jp: "スキル3", options: ["10레벨", "10레벨+5심상", "13레벨", "13레벨+5심상"], values: { "10레벨": 9.8, "10레벨+5심상": 9.8, "13레벨": 10.4, "13레벨+5심상": 10.4 }, defaultOption: "13레벨+5심상", value: 10.4, duration: "-", note: "『한여름』 상태", note_en: "Transform state", note_jp: "寒夏の状態" },
              { id: "motoha1", type: "의식1", target: "자신", target_en: "Self", target_jp: "自分", skillIcon: "/assets/img/character-detail/ritual1.png", skillName: "발끝에 닿는 파도", skillName_en: "A1", skillName_jp: "意識1", options: [], values: {}, value: 10, duration: "-", note: "『한여름』 상태", note_en: "Transform state", note_jp: "寒夏の状態" }
    ],
    "토모코·여름": [
              { id: "tomoko1", type: "의식6", target: "자신", target_en: "Self", target_jp: "自分", skillIcon: "/assets/img/character-detail/ritual6.png", skillName: "사랑의 마음이 이어지길", skillName_en: "A6", skillName_jp: "意識6", options: [], values: {}, value: 35, duration: "-", note: "『찬란한 불꽃놀이』 효과 한정", note_en: "Summer Reminiscence", note_jp: "『ひと夏の思い出』" }
    ],
    "마코토": [
              { id: "makoto2", type: "심상", target: "자신", target_en: "Self", target_jp: "自分", skillIcon: "/assets/img/character-detail/item-mind_stat2.png", skillName: "진급강화", skillName_en: "Mindscape", skillName_jp: "イメジャリー", options: [], value: 12, duration: "-", note: "" }
    ],
    "유스케": [
              { id: "yuske1", type: "심상", target: "자신", target_en: "Self", target_jp: "自分", skillIcon: "/assets/img/character-detail/item-mind_stat2.png", skillName: "진급강화", skillName_en: "Mindscape", skillName_jp: "イメジャリー", options: [], value: 12, duration: "-", note: "" }
    ],
    "YUI": [
              { id: "YUI2", type: "패시브", type_en: "Passive", type_jp: "パッシブ", target: "자신", target_en: "Self", target_jp: "自分", skillIcon: "/assets/img/skill-element/패시브.png", skillName: "반짝", skillName_en: "Passive", skillName_jp: "パッシブ", options: [], values: {}, value: 12, duration: "-", note: "『놀이 친구』가 있을 때", note_en: " ", note_jp: " " },
              { id: "YUI1", type: "의식1", target: "자신", target_en: "Self", target_jp: "自分", skillIcon: "/assets/img/character-detail/ritual1.png", skillName: "★ 파종하는 날 ★", skillName_en: "A1", skillName_jp: "意識1", options: ["감전 없음", "감전"], values: { "감전 없음": 20, "감전": 30 }, defaultOption: "감전", value: 30, duration: "-", note: "『추격』한정", note_en: "Follow-up", note_jp: "追撃" },
              { id: "YUI3", type: "4성무기", type_en: "4-star Weapon", type_jp: "4星武器", target: "자신", target_en: "Self", target_jp: "自分", skillIcon: "/assets/img/character-weapon/YUI-4-01.png", skillName: "미래의 계시", skillName_en: "4-star Weapon", skillName_jp: "4星武器", options: ["개조0&1", "개조2&3", "개조4&5", "개조6"], values: { "개조0&1": 7.3, "개조2&3": 9.5, "개조4&5": 11.7, "개조6": 13.9 }, defaultOption: "개조6", value: 13.9, duration: "-", note: "" },
              { id: "YUI4", type: "전용무기", type_en: "Exclusive Weapon", type_jp: "専用武器", target: "자신", target_en: "Self", target_jp: "自分", skillIcon: "/assets/img/character-weapon/YUI-5-01.png", skillName: "버츄얼 디스럽터", skillName_en: "Exclusive Weapon", skillName_jp: "専用武器", options: ["개조0&1", "개조2&3", "개조4&5", "개조6"], values: { "개조0&1": 18.1, "개조2&3": 23.5, "개조4&5": 29, "개조6": 34.5 }, defaultOption: "개조6", value: 34.5, duration: "-", note: "" },
              { 
                id: "YUI5",
                type: "잠재력", type_en: "Status", type_jp: "",
                target: "자신",
                skillIcon: "/assets/img/tier/YUI.webp",
                skillName: "LV80", skillName_en:"Default LV80", skillName_jp:"LV80",
                value: 22.4, duration: "-", note: ""
              }
    ],
    "렌": [
              { id: "jocker1", type: "심상", target: "자신", target_en: "Self", target_jp: "自分", skillIcon: "/assets/img/character-detail/item-mind_stat2.png", skillName: "진급강화", skillName_en: "Mindscape", skillName_jp: "イメジャリー", options: [], value: 12, duration: "-", note: "" }
    ],
    "모르가나": [
              { id: "morgana1", type: "스킬3", target: "자신", target_en: "Self", target_jp: "自分", skillIcon: "/assets/img/skill-element/물리.png", skillName: "럭키 펀치", skillName_en: "Skill 3", skillName_jp: "スキル3", options: [], values: {}, value: 30, duration: "-", note: "스킬3 한정", note_en: "Skill3", note_jp: "スキル3" },
              { id: "morgana2", type: "패시브", type_en: "Passive", type_jp: "パッシブ", target: "자신", target_en: "Self", target_jp: "自分", skillIcon: "/assets/img/skill-element/패시브.png", skillName: "자신", skillName_en: "Passive", skillName_jp: "パッシブ", options: [], values: {}, value: 30, duration: "-", note: "『직감』치료 효과 한정", note_en: "Healing", note_jp: "治療" },
              { id: "morgana3", type: "4성무기", type_en: "4-star Weapon", type_jp: "4星武器", target: "자신", target_en: "Self", target_jp: "自分", skillIcon: "/assets/img/character-weapon/모르가나-4-01.png", skillName: "사냥꾼의 주걱", skillName_en: "4-star Weapon", skillName_jp: "4星武器", options: ["개조0&1", "개조2&3", "개조4&5", "개조6"], values: { "개조0&1": 5.9, "개조2&3": 7.6, "개조4&5": 9.3, "개조6": 11 }, defaultOption: "개조6", value: 11, duration: "-", note: "" },
              { id: "morgana4", type: "전용무기", type_en: "Exclusive Weapon", type_jp: "専用武器", target: "자신", target_en: "Self", target_jp: "自分", skillIcon: "/assets/img/character-weapon/모르가나-5-01.png", skillName: "골든 스포일", skillName_en: "Exclusive Weapon", skillName_jp: "専用武器", options: ["개조0&1", "개조2&3", "개조4&5", "개조6"], values: { "개조0&1": 18, "개조2&3": 23.4, "개조4&5": 28.8, "개조6": 34.2 }, defaultOption: "개조6", value: 34.2, duration: "-", note: "" },
              { 
                id: "morgana5",
                type: "잠재력", type_en: "Status", type_jp: "",
                target: "자신",
                skillIcon: "/assets/img/tier/모르가나.webp",
                skillName: "LV80", skillName_en:"Default LV80", skillName_jp:"LV80",
                value: 22.4, duration: "-", note: ""
              }
    ],
    "안": [
              { id: "ann1", type: "심상", target: "자신", target_en: "Self", target_jp: "自分", skillIcon: "/assets/img/character-detail/item-mind_stat2.png", skillName: "진급강화", skillName_en: "Mindscape", skillName_jp: "イメジャリー", options: [], value: 12, duration: "-", note: "" }
    ],
    "류지": [
              { id: "ryuji2", type: "스킬1", target: "자신", target_en: "Self", target_jp: "自分", skillIcon: "/assets/img/skill-element/물리.png", skillName: "폭발 충돌", skillName_en: "Skill 1", skillName_jp: "スキル1", options: [], values: {}, value: 30, duration: "-", note: "『리바운드』가 없는 경우 스킬 1 한정", note_en: " ", note_jp: " " },
              { id: "ryuji1", type: "의식0", type_en: "A0", type_jp: "意識0", target: "자신", target_en: "Self", target_jp: "自分", skillIcon: "/assets/img/character-detail/ritual0.png", skillName: "오장폭발권", skillName_en: "A0", skillName_jp: "意識0", options: [], values: {}, value: 30, duration: "-", note: "『리바운드』상태", note_en: " ", note_jp: " " },
              { id: "ryuji3", type: "4성무기", type_en: "4-star Weapon", type_jp: "4星武器", target: "자신", target_en: "Self", target_jp: "自分", skillIcon: "/assets/img/character-weapon/류지-4-01.png", skillName: "가이아 프레서", skillName_en: "4-star Weapon", skillName_jp: "4星武器", options: ["개조0&1", "개조2&3", "개조4&5", "개조6"], values: { "개조0&1": 7.3, "개조2&3": 9.5, "개조4&5": 11.7, "개조6": 13.9 }, defaultOption: "개조6", value: 13.9, duration: "-", note: "" }
    ],
    "세이지": [
              { id: "seige2", type: "스킬3", target: "자신", target_en: "Self", target_jp: "自分", skillIcon: "/assets/img/skill-element/질풍.png", skillName: "무영의 찌르기", skillName_en: "Skill 3", skillName_jp: "スキル3", options: [], values: {}, value: 20, duration: "-", note: "『격려』 3중첩 이상 보유, 스킬3 한정", note_en: " ", note_jp: " " },
              { id: "seige1", type: "의식1", target: "자신", target_en: "Self", target_jp: "自分", skillIcon: "/assets/img/character-detail/ritual1.png", skillName: "검의 반격", skillName_en: "A1", skillName_jp: "意識1", options: ["1중첩", "2중첩", "3중첩", "4중첩", "5중첩"], values: { "1중첩": 4, "2중첩": 8, "3중첩": 12, "4중첩": 16, "5중첩": 20 }, defaultOption: "5중첩", value: 20, duration: "-", note: "『격려』 1중첩 당 4%", note_en: " ", note_jp: " " },
              { id: "seige3", type: "전용무기", type_en: "Exclusive Weapon", type_jp: "専用武器", target: "자신", target_en: "Self", target_jp: "自分", skillIcon: "/assets/img/character-weapon/세이지-5-01.png", skillName: "계몽의 별", skillName_en: "Exclusive Weapon", skillName_jp: "専用武器", options: ["개조0&1", "개조2&3", "개조4&5", "개조6"], values: { "개조0&1": 18, "개조2&3": 23.5, "개조4&5": 29, "개조6": 34.5 }, defaultOption: "개조6", value: 34.5, duration: "-", note: "" },
              { id: "seige4", type: "심상", target: "자신", target_en: "Self", target_jp: "自分", skillIcon: "/assets/img/character-detail/item-mind_stat2.png", skillName: "진급강화", skillName_en: "Mindscape", skillName_jp: "イメジャリー", options: [], value: 12, duration: "-", note: "" },
              { 
                id: "seigea5",
                type: "잠재력", type_en: "Status", type_jp: "",
                target: "자신",
                skillIcon: "/assets/img/tier/세이지.webp",
                skillName: "LV80", skillName_en:"Default LV80", skillName_jp:"LV80",
                value: 13.0, duration: "-", note: ""
              }
    ]
  };
  // ==== END STATIC CRITICAL DATA ====