const penetrateData = {
  "계시": [
    {
      "id": 1,
      "type": "계시",
      "target": "광역",
      "skillIcon": "/assets/img/revelation/희망.webp",
      "skillName": "희망 + 직책",
      "skillName_en": "Hope + Labor",
      "skillName_jp": "希望 + 作業",
      "options": [],
      "value": 5,
      "duration": "1턴",
      "note": "",
      "skillName_cn": "希望 + 职责",
      "note_cn": "",
      "type_cn": "启示",
      "target_cn": "群体",
      "duration_cn": "1回合",
      "options_cn": []
    },
    {
      "id": 2,
      "type": "계시",
      "target": "자신",
      "skillIcon": "/assets/img/revelation/자유.webp",
      "skillName": "자유 + 개선",
      "skillName_en": "Freedom + Triumph",
      "skillName_jp": "自由 + 改善",
      "options": [],
      "value": 16,
      "duration": "-",
      "note": "영광 2중첩 추가효과 발동 시",
      "note_en": "2중첩 추가효과",
      "note_jp": "2중첩 추가효과",
      "skillName_cn": "自由 + 凯旋",
      "note_cn": "荣耀 2层 追加效果 发动时",
      "type_cn": "启示",
      "target_cn": "自身",
      "duration_cn": "-",
      "options_cn": []
    }
  ],
  "J&C": [
    {
      "id": "jc1",
      "type": "스킬2",
      "target": "단일",
      "skillIcon": "/assets/img/skill-element/염동핵열.png",
      "skillName": "부조리와 비합리의 페르소나",
      "options": [
        "LV10",
        "LV10+심상5",
        "LV13",
        "LV13+심상5"
      ],
      "values": {
        "LV10": 9.8,
        "LV10+심상5": 10.8,
        "LV13": 10.4,
        "LV13+심상5": 11.4
      },
      "defaultOption": "LV13+심상5",
      "value": 11.4,
      "duration": "3턴",
      "note": "우월/방위/반항",
      "note_en": "Mask of Absurdity & Nonsense",
      "note_jp": "不条理と非合理の仮面",
      "skillName_cn": "荒谬与悖理的面具",
      "note_cn": "优越/防护/反抗",
      "type_cn": "技能2",
      "target_cn": "单体",
      "duration_cn": "3回合",
      "options_cn": [
        "LV10",
        "LV10+意识5",
        "LV13",
        "LV13+意识5"
      ]
    },
    {
      "id": "jc3",
      "type": "패시브",
      "target": "광역",
      "skillIcon": "/assets/img/skill-element/패시브.png",
      "skillName": "집행",
      "skillName_en": "Mindscape Core (ASIA only)",
      "skillName_jp": "イメジャリー・コア (ASIA only)",
      "options": [
        "LV1",
        "LV2"
      ],
      "values": {
        "LV1": 5,
        "LV2": 10
      },
      "defaultOption": "LV2",
      "value": 10,
      "duration": "-",
      "note": "심상 코어 - 구원/방위",
      "note_en": "Medic/Defense",
      "note_jp": "救済/防御",
      "skillName_cn": "执行",
      "note_cn": "意识核心 - 救援/防护",
      "type_cn": "被动",
      "target_cn": "群体",
      "duration_cn": "-",
      "options_cn": [
        "LV1",
        "LV2"
      ]
    }
  ],
  "마나카": [
    {
      "id": "manaka1",
      "type": "스킬3",
      "target": "광역",
      "skillIcon": "/assets/img/skill-element/버프.png",
      "skillName": "시공의 윤회",
      "options": [
        "LV10",
        "LV10+심상5",
        "LV13",
        "LV13+심상5",
        "LV13(14스택)",
        "LV13+심상5(14스택)"
      ],
      "values": {
        "LV10": 12,
        "LV10+심상5": 13.2,
        "LV13": 15.6,
        "LV13+심상5": 16.8,
        "LV13(14스택)": 18.2,
        "LV13+심상5(14스택)": 19.6
      },
      "defaultOption": "LV13+심상5(14스택)",
      "value": 19.6,
      "duration": "2턴",
      "note": "",
      "skillName_cn": "贯穿时空的轮转",
      "note_cn": "",
      "type_cn": "技能3",
      "target_cn": "群体",
      "duration_cn": "2回合",
      "options_cn": [
        "LV10",
        "LV10+意识5",
        "LV13",
        "LV13+意识5",
        "LV13(14层)",
        "LV13+意识5(14层)"
      ]
    },
    {
      "id": "manaka2",
      "type": "패시브",
      "target": "광역",
      "skillIcon": "/assets/img/skill-element/패시브.png",
      "skillName": "결심",
      "value": 12,
      "duration": "-",
      "note": "성가 스택 * 1%",
      "note_en": "스택 * 1%",
      "note_jp": "스택 * 1%",
      "skillName_cn": "韧心",
      "note_cn": "圣歌层数*1%",
      "type_cn": "被动",
      "target_cn": "群体",
      "duration_cn": "-"
    }
  ],
  "유카리": [
    {
      "id": "yukari1",
      "type": "의식1",
      "target": "단일",
      "skillIcon": "/assets/img/character-detail/ritual1.png",
      "skillName": "당겨진 활시위",
      "options": [],
      "value": 20,
      "duration": "2턴",
      "note": "스킬 메인 목표",
      "note_en": "Skill Main Target",
      "note_jp": "スキル メイン ターゲット",
      "skillName_cn": "扣动的扳机",
      "note_cn": "技能主目标",
      "type_cn": "意识1",
      "target_cn": "单体",
      "duration_cn": "2回合",
      "options_cn": []
    }
  ],
  "마유미": [
    {
      "id": "mayumi1",
      "type": "스킬3",
      "target": "광역",
      "skillIcon": "/assets/img/skill-element/버프.png",
      "skillName": "엔진 굉음",
      "options": [
        "LV10",
        "LV10+심상5",
        "LV13",
        "LV13+심상5"
      ],
      "values": {
        "LV10": 4.9,
        "LV10+심상5": 5.4,
        "LV13": 5.1,
        "LV13+심상5": 5.6
      },
      "defaultOption": "LV13+심상5",
      "value": 5.6,
      "duration": "2턴",
      "note": "",
      "skillName_cn": "引擎轰鸣不止",
      "note_cn": "",
      "type_cn": "技能3",
      "target_cn": "群体",
      "duration_cn": "2回合",
      "options_cn": [
        "LV10",
        "LV10+意识5",
        "LV13",
        "LV13+意识5"
      ]
    },
    {
      "id": "mayumi2",
      "type": "스킬3",
      "target": "단일",
      "skillIcon": "/assets/img/skill-element/버프.png",
      "skillName": "엔진 굉음 (메인목표)",
      "options": [
        "LV10",
        "LV10+심상5",
        "LV13",
        "LV13+심상5"
      ],
      "values": {
        "LV10": 9.8,
        "LV10+심상5": 10.8,
        "LV13": 10.4,
        "LV13+심상5": 11.4
      },
      "defaultOption": "LV13+심상5",
      "value": 11.4,
      "duration": "1턴",
      "note": "스킬3 추가턴 메인 목표",
      "note_en": "Skill 3 Additional Turn Main Target",
      "note_jp": "スキル3 追加ターン メイン ターゲット",
      "skillName_cn": "引擎轰鸣不止 (主目标)",
      "note_cn": "技能3额外回合主目标",
      "type_cn": "技能3",
      "target_cn": "单体",
      "duration_cn": "1回合",
      "options_cn": [
        "LV10",
        "LV10+意识5",
        "LV13",
        "LV13+意识5"
      ]
    },
    {
      "id": "mayumi0",
      "type": "의식0",
      "target": "광역",
      "skillIcon": "/assets/img/character-detail/ritual0.png",
      "skillName": "급속 상승",
      "options": [
        "1레벨",
        "2레벨",
        "3레벨"
      ],
      "values": {
        "1레벨": 5,
        "2레벨": 10,
        "3레벨": 15
      },
      "defaultOption": "3레벨",
      "value": 15,
      "duration": "-",
      "note": "",
      "skillName_cn": "极速攀升",
      "note_cn": "",
      "type_cn": "意识0",
      "target_cn": "群体",
      "duration_cn": "-",
      "options_cn": [
        "1级",
        "2级",
        "3级"
      ]
    },
    {
      "id": "mayumi3",
      "type": "의식1",
      "target": "단일",
      "skillIcon": "/assets/img/character-detail/ritual1.png",
      "skillName": "풀악셀",
      "options": [],
      "value": 10,
      "duration": "1턴",
      "note": "스킬3 추가턴 메인 목표",
      "note_en": "Skill 3 Additional Turn Main Target",
      "note_jp": "スキル3 追加ターン メイン ターゲット",
      "skillName_cn": "将油门踩到底",
      "note_cn": "技能3额外回合主目标",
      "type_cn": "意识1",
      "target_cn": "单体",
      "duration_cn": "1回合",
      "options_cn": []
    }
  ],
  "쇼키": [
    {
      "id": "ikenami0",
      "type": "스킬3",
      "target": "단일",
      "skillIcon": "/assets/img/skill-element/버프.png",
      "skillName": "별들의 공연",
      "options": [
        "LV10",
        "LV10+심상5",
        "LV12",
        "LV12+심상5"
      ],
      "values": {
        "LV10": 12,
        "LV10+심상5": 13.2,
        "LV12": 12.5,
        "LV12+심상5": 13.7
      },
      "defaultOption": "LV12+심상5",
      "value": 13.7,
      "duration": "2턴",
      "note": "즉흥 교감(풍습) 상태 시",
      "note_en": "풍습 State",
      "note_jp": "풍습 状態",
      "skillName_cn": "繁星共演",
      "note_cn": "处于『即兴交感（风袭）』状态时",
      "type_cn": "技能3",
      "target_cn": "单体",
      "duration_cn": "2回合",
      "options_cn": [
        "LV10",
        "LV10+意识5",
        "LV12",
        "LV12+意识5"
      ]
    }
  ],
  "미나미": [
    {
      "id": "minmami1",
      "type": "의식1",
      "target": "광역",
      "skillIcon": "/assets/img/character-detail/ritual1.png",
      "skillName": "통증 관리",
      "options": [],
      "value": 20,
      "duration": "2턴",
      "note": "치료량 초과 시",
      "note_en": "Overheal",
      "note_jp": "オーバーヒール",
      "skillName_cn": "疼痛管理",
      "note_cn": "治疗量溢出时",
      "type_cn": "意识1",
      "target_cn": "群体",
      "duration_cn": "2回合",
      "options_cn": []
    }
  ],
  "마사키": [
    {
      "id": "masaki1",
      "type": "의식1",
      "target": "광역",
      "skillIcon": "/assets/img/character-detail/ritual1.png",
      "skillName": "적을 두려워하지 마라",
      "options": [],
      "value": 15,
      "duration": "-",
      "note": "",
      "skillName_cn": "所经之战，莫畏强敌",
      "note_cn": "",
      "type_cn": "意识1",
      "target_cn": "群体",
      "duration_cn": "-",
      "options_cn": []
    },
    {
      "id": "masaki2",
      "type": "의식1",
      "target": "광역",
      "skillIcon": "/assets/img/character-detail/ritual1.png",
      "skillName": "적을 두려워하지 마라(GLB)",
      "skillName_en": "(GLB only)",
      "skillName_jp": "(JPのみ)",
      "options": [],
      "value": 20,
      "duration": "-",
      "note": "",
      "skillName_cn": "所经之战，莫畏强敌 (GLB)",
      "note_cn": "",
      "type_cn": "意识1",
      "target_cn": "群体",
      "duration_cn": "-",
      "options_cn": []
    }
  ],
  "유우미": [
    {
      "id": "yuumi1",
      "type": "심상코어",
      "target": "광역",
      "skillIcon": "/assets/img/character-detail/innate/core.png",
      "skillName": "타기",
      "options": [
        "LV1:2",
        "LV2:2",
        "LV3:2",
        "LV1:3",
        "LV2:3",
        "LV3:3"
      ],
      "values": [
        4,
        6,
        8,
        10,
        15,
        20
      ],
      "defaultOption": "LV3:3",
      "value": 20,
      "duration": "-",
      "note": "",
      "skillName_cn": "兑和",
      "note_cn": "",
      "type_cn": "意识核心",
      "target_cn": "群体",
      "duration_cn": "-",
      "options_cn": [
        "LV1:2",
        "LV2:2",
        "LV3:2",
        "LV1:3",
        "LV2:3",
        "LV3:3"
      ]
    }
  ],
  "치즈코": [
    {
      "id": "chizko1",
      "type": "의식6",
      "target": "광역",
      "skillIcon": "/assets/img/character-detail/ritual6.png",
      "skillName": "BOOM! BOOM!",
      "options": [],
      "value": 8,
      "duration": "-",
      "note": "방사선 보유 적 원소 이상 3개 이상",
      "note_en": "Radiation + 원소 이상 3",
      "note_jp": "極熱 + 원소 이상 3",
      "skillName_cn": "BOOM！BOOM！",
      "note_cn": "持有『辐射』的敌人拥有3种及以上元素异常时",
      "type_cn": "意识6",
      "target_cn": "群体",
      "duration_cn": "-",
      "options_cn": []
    }
  ],
  "모토하·청광": [
    {
      "id": "motoha-sunny-passive1",
      "type": "패시브",
      "target": "자신",
      "skillIcon": "/assets/img/skill-element/패시브.png",
      "skillName": "유금",
      "options": [],
      "value": 15,
      "duration": "2턴",
      "note": "스킬3",
      "note_en": "S3",
      "note_jp": "スキル3",
      "skillName_cn": "鎏金",
      "note_cn": "技能3",
      "type_cn": "被动",
      "target_cn": "自身",
      "duration_cn": "2回合",
      "options_cn": []
    }
  ],
  "쇼키·암야": [
    {
      "id": "showki-notte1",
      "type": "패시브",
      "target": "자신",
      "skillIcon": "/assets/img/skill-element/패시브.png",
      "skillName": "열반",
      "options": [],
      "value": 15,
      "duration": "-",
      "note": "HP 40%",
      "note_en": "HP 40%",
      "note_jp": "HP 40%",
      "skillName_cn": "涅槃",
      "note_cn": "HP 40%",
      "type_cn": "被动",
      "target_cn": "自身",
      "duration_cn": "-",
      "options_cn": []
    }
  ],
  "이치고": [
    {
      "id": "ichigo1",
      "type": "심상",
      "target": "자신",
      "skillIcon": "/assets/img/character-detail/item-mind_stat2.png",
      "skillName": "진급강화",
      "options": [],
      "value": 7.5,
      "duration": "-",
      "note": "",
      "skillName_cn": "进阶强化",
      "note_cn": "",
      "type_cn": "意识",
      "target_cn": "自身",
      "duration_cn": "-",
      "options_cn": []
    }
  ],
  "사나다": [
    {
      "id": "sanada1",
      "type": "의식0",
      "target": "자신",
      "skillIcon": "/assets/img/character-detail/ritual0.png",
      "skillName": "전투의 이유",
      "options": [
        "의식0",
        "의식6"
      ],
      "values": {
        "의식0": 12,
        "의식6": 16
      },
      "defaultOption": "의식0",
      "value": 12,
      "duration": "-",
      "note": "투지 중첩 당 4%",
      "note_en": "Fortitude 4%",
      "note_jp": "意志 4%",
      "skillName_cn": "战斗的理由",
      "note_cn": "每1层『斗志』提升4%",
      "type_cn": "意识0",
      "target_cn": "自身",
      "duration_cn": "-",
      "options_cn": [
        "意识0",
        "意识6"
      ]
    }
  ],
  "유키 마코토": [
    {
      "id": "yukimakoto1",
      "type": "스킬3",
      "target": "자신",
      "skillIcon": "/assets/img/skill-element/화염.png",
      "skillName": "홍련·맹화의 탐식",
      "options": [
        "LV10",
        "LV10+심상5",
        "LV13",
        "LV13+심상5"
      ],
      "values": {
        "LV10": 11.7,
        "LV10+심상5": 12.9,
        "LV13": 12.4,
        "LV13+심상5": 13.6
      },
      "defaultOption": "LV13+심상5",
      "value": 13.6,
      "duration": "-",
      "note": "월상 4중첩",
      "note_en": "Moon 4stack",
      "note_jp": "月相4重",
      "skillName_cn": "红莲·豪炎吞噬",
      "note_cn": "月相 4层",
      "type_cn": "技能3",
      "target_cn": "自身",
      "duration_cn": "-",
      "options_cn": [
        "LV10",
        "LV10+意识5",
        "LV13",
        "LV13+意识5"
      ]
    },
    {
      "id": "yukimakoto2",
      "type": "의식0",
      "target": "자신",
      "skillIcon": "/assets/img/character-detail/ritual0.png",
      "skillName": "위대한 결단",
      "options": [],
      "value": 12,
      "duration": "-",
      "note": "월상 보유 시",
      "note_en": "Moon",
      "note_jp": "月相",
      "skillName_cn": "伟大的指引",
      "note_cn": "月相 持有时",
      "type_cn": "意识0",
      "target_cn": "自身",
      "duration_cn": "-",
      "options_cn": []
    },
    {
      "id": "yukimakoto3",
      "type": "의식1",
      "target": "자신",
      "skillIcon": "/assets/img/character-detail/ritual1.png",
      "skillName": "우연한 인연",
      "options": [],
      "value": 10,
      "duration": "2턴",
      "note": "스킬2",
      "skillName_cn": "因偶然而生",
      "note_cn": "技能2",
      "type_cn": "意识1",
      "target_cn": "自身",
      "duration_cn": "2回合",
      "options_cn": []
    },
    {
      "id": "yukimakoto4",
      "type": "심상",
      "target": "자신",
      "skillIcon": "/assets/img/character-detail/item-mind_stat2.png",
      "skillName": "진급강화",
      "options": [],
      "value": 7.5,
      "duration": "-",
      "note": "",
      "skillName_cn": "进阶强化",
      "note_cn": "",
      "type_cn": "意识",
      "target_cn": "自身",
      "duration_cn": "-",
      "options_cn": []
    }
  ],
  "키라": [
    {
      "id": "kira1",
      "type": "패시브",
      "target": "자신",
      "skillIcon": "/assets/img/skill-element/패시브.png",
      "skillName": "부패",
      "options": [],
      "value": 21,
      "duration": "-",
      "note": "집행관 상태",
      "note_en": "Trans State",
      "note_jp": "変身 状態",
      "skillName_cn": "溃烂",
      "note_cn": "执法官状态",
      "type_cn": "被动",
      "target_cn": "自身",
      "duration_cn": "-",
      "options_cn": []
    },
    {
      "id": "kira2",
      "type": "심상",
      "target": "자신",
      "skillIcon": "/assets/img/character-detail/item-mind_stat2.png",
      "skillName": "진급강화",
      "options": [],
      "value": 7.5,
      "duration": "-",
      "note": "",
      "skillName_cn": "进阶强化",
      "note_cn": "",
      "type_cn": "意识",
      "target_cn": "自身",
      "duration_cn": "-",
      "options_cn": []
    },
    {
      "id": "kira3",
      "type": "전용무기",
      "target": "자신",
      "skillIcon": "/assets/img/character-weapon/키라-5-01.png",
      "skillName": "블러드 위브",
      "options": [
        "개조0",
        "개조1&2",
        "개조3&4",
        "개조5&6"
      ],
      "values": {
        "개조0": 25,
        "개조1&2": 32.5,
        "개조3&4": 40,
        "개조5&6": 47.5
      },
      "defaultOption": "개조5&6",
      "value": 47.5,
      "duration": "-",
      "note": "절개 대미지 한정",
      "note_en": "Cutting Damage",
      "note_jp": "カット ダメージ",
      "skillName_cn": "血色编织",
      "note_cn": "仅限切割伤害",
      "type_cn": "专属武器",
      "target_cn": "自身",
      "duration_cn": "-",
      "options_cn": [
        "改造0",
        "改造1&2",
        "改造3&4",
        "改造5&6"
      ]
    }
  ],
  "유스케": [
    {
      "id": "yusuke1",
      "type": "패시브",
      "target": "자신",
      "skillIcon": "/assets/img/skill-element/패시브.png",
      "skillName": "조각",
      "options": [],
      "value": 20,
      "duration": "1턴",
      "note": "3스킬",
      "skillName_cn": "雕琢",
      "note_cn": "技能3",
      "type_cn": "被动",
      "target_cn": "自身",
      "duration_cn": "1回合",
      "options_cn": []
    },
    {
      "id": "yusuke2",
      "type": "의식6",
      "target": "자신",
      "skillIcon": "/assets/img/character-detail/ritual6.png",
      "skillName": "생생한 붓놀림",
      "options": [],
      "value": 30,
      "duration": "-",
      "note": "반격",
      "skillName_cn": "笔落如生",
      "note_cn": "反击",
      "type_cn": "意识6",
      "target_cn": "自身",
      "duration_cn": "-",
      "options_cn": []
    }
  ],
  "마코토": [
    {
      "id": "makoto1",
      "type": "의식3",
      "target": "자신",
      "skillIcon": "/assets/img/character-detail/ritual3.png",
      "skillName": "후발 선제",
      "options": [
        "1중첩",
        "2중첩",
        "3중첩",
        "4중첩",
        "5중첩"
      ],
      "values": {
        "1중첩": 6,
        "2중첩": 12,
        "3중첩": 18,
        "4중첩": 24,
        "5중첩": 30
      },
      "defaultOption": "5중첩",
      "value": 30,
      "duration": "-",
      "note": "철의 의지 상태 원소 이상 수",
      "note_en": "Crash Out 원소 이상",
      "note_jp": "ブチ切れ 원소 이상",
      "skillName_cn": "后发·先制",
      "note_cn": "『铁血意志』状态下的元素异常数量",
      "type_cn": "意识3",
      "target_cn": "自身",
      "duration_cn": "-",
      "options_cn": [
        "1层",
        "2层",
        "3层",
        "4层",
        "5层"
      ]
    }
  ],
  "하루": [
    {
      "id": "haru1",
      "type": "의식6",
      "target": "자신",
      "skillIcon": "/assets/img/character-detail/ritual6.png",
      "skillName": "악몽의 랩소디",
      "options": [],
      "value": 12,
      "duration": "-",
      "note": "스킬2",
      "note_en": "Skill2",
      "note_jp": "スキル2",
      "skillName_cn": "噩梦狂想曲",
      "note_cn": "技能2",
      "type_cn": "意识6",
      "target_cn": "自身",
      "duration_cn": "-",
      "options_cn": []
    }
  ],
  "몽타뉴·백조": [
    {
      "id": "mont5-1",
      "type": "의식6",
      "target": "자신",
      "skillIcon": "/assets/img/character-detail/ritual6.png",
      "skillName": "운명에 굴하지 않는 영혼",
      "options": [
        "1중첩",
        "2중첩",
        "3중첩",
        "4중첩",
        "5중첩"
      ],
      "values": {
        "1중첩": 4,
        "2중첩": 8,
        "3중첩": 12,
        "4중첩": 16,
        "5중첩": 20
      },
      "defaultOption": "5중첩",
      "value": 20,
      "duration": "-",
      "note": "결정 1개 당",
      "note_en": "Shard",
      "note_jp": "結晶",
      "skillName_cn": "不屈于宿命的灵魂",
      "note_cn": "每1个结晶",
      "type_cn": "意识6",
      "target_cn": "自身",
      "duration_cn": "-",
      "options_cn": [
        "1层",
        "2层",
        "3层",
        "4层",
        "5层"
      ]
    }
  ],
  "류지": [
    {
      "id": "ryuji1",
      "type": "의식3",
      "target": "자신",
      "skillIcon": "/assets/img/character-detail/ritual3.png",
      "skillName": "쾌도난마",
      "options": [],
      "value": 35,
      "duration": "-",
      "note": "크리티컬 발생 시",
      "note_en": "Critical",
      "note_jp": "クリティカル",
      "skillName_cn": "快刀斩乱麻",
      "note_cn": "暴击时",
      "type_cn": "意识3",
      "target_cn": "自身",
      "duration_cn": "-",
      "options_cn": []
    }
  ]
};

const defenseCalcData = {
  "계시": [
    {
      "id": 1,
      "type": "계시",
      "target": "단일",
      "skillIcon": "/assets/img/revelation/여정.webp",
      "skillName": "주권 + 여정",
      "skillName_en": "Control + Departure",
      "skillName_jp": "支配 + 旅立",
      "options": [],
      "value": 23,
      "duration": "2턴",
      "note": "",
      "skillName_cn": "主权 + 启程",
      "note_cn": "",
      "type_cn": "启示",
      "target_cn": "单体",
      "duration_cn": "2回合",
      "options_cn": []
    },
    {
      "id": 15,
      "type": "계시",
      "target": "단일",
      "skillIcon": "/assets/img/revelation/결심.webp",
      "skillName": "직책 + 결심",
      "skillName_en": "Labor + Resolve",
      "skillName_jp": "作業 + 決心",
      "options": [],
      "value": 10,
      "duration": "2턴",
      "note": "",
      "skillName_cn": "职责 + 决心",
      "note_cn": "",
      "type_cn": "启示",
      "target_cn": "单体",
      "duration_cn": "2回合",
      "options_cn": []
    }
  ],
  "원더": [
    {
      "id": 2,
      "type": "전용무기",
      "target": "광역",
      "skillIcon": "/assets/img/wonder-weapon/천상의 별.webp",
      "skillName": "천상의 별",
      "options": [],
      "value": 22,
      "duration": "-",
      "note": "",
      "skillName_cn": "天象星仪",
      "note_cn": "",
      "type_cn": "专属武器",
      "target_cn": "群体",
      "duration_cn": "-",
      "options_cn": []
    },
    {
      "id": "wonder-weapon1",
      "type": "전용무기",
      "target": "광역",
      "skillIcon": "/assets/img/wonder-weapon/망령의 저주.webp",
      "skillName": "망령의 저주",
      "options": [],
      "value": 25,
      "duration": "3턴",
      "note": "",
      "skillName_cn": "恶灵咒刃",
      "note_cn": "",
      "type_cn": "专属武器",
      "target_cn": "群体",
      "duration_cn": "3回合",
      "options_cn": []
    },
    {
      "id": 3,
      "type": "전용무기",
      "target": "단일/광역",
      "skillIcon": "/assets/img/wonder-weapon/태고의 역장.webp",
      "skillName": "태고의 역장",
      "options": [
        "1중첩",
        "2중첩",
        "3중첩",
        "4중첩"
      ],
      "values": {
        "1중첩": 9,
        "2중첩": 18,
        "3중첩": 27,
        "4중첩": 36
      },
      "defaultOption": "4중첩",
      "value": 36,
      "duration": "2턴",
      "note": "원소이상 2종 이하일 경우 매 턴 원더의 공격 필수",
      "note_en": "원소 이상 Required",
      "note_jp": "원소 이상 必須",
      "skillName_cn": "远古力场",
      "note_cn": "当元素异常种类不超过2种时，每回合都需要WONDER进行攻击",
      "type_cn": "专属武器",
      "target_cn": "单体/群体",
      "duration_cn": "2回合",
      "options_cn": [
        "1层",
        "2层",
        "3层",
        "4层"
      ]
    },
    {
      "id": "wonder-weapon-death",
      "type": "전용무기",
      "target": "단일/광역",
      "skillIcon": "/assets/img/wonder-weapon/망자의 눈.webp",
      "skillName": "망자의 눈",
      "options": [
        "1중첩",
        "2중첩"
      ],
      "values": {
        "1중첩": 10,
        "2중첩": 20
      },
      "defaultOption": "2중첩",
      "value": 20,
      "duration": "2턴",
      "note": "적에게 상태이상 부여 시",
      "note_en": "Debuff applied to enemy",
      "note_jp": "敵にデバフ適用",
      "skillName_cn": "葬送之眼",
      "note_cn": "对敌人附加异常效果时",
      "type_cn": "专属武器",
      "target_cn": "单体/群体",
      "duration_cn": "2回合",
      "options_cn": [
        "1层",
        "2层"
      ]
    },
    {
      "id": 4,
      "type": "스킬",
      "target": "단일",
      "skillIcon": "/assets/img/skill-element/디버프.png",
      "skillName": "라쿤다",
      "options": [
        "LV6",
        "LV7",
        "LV8"
      ],
      "values": {
        "LV6": 38.8,
        "LV7": 40.7,
        "LV8": 42.7
      },
      "defaultOption": "LV8",
      "value": 42.7,
      "duration": "3턴",
      "note": "",
      "skillName_cn": "拉昆达",
      "note_cn": "",
      "type_cn": "技能",
      "target_cn": "单体",
      "duration_cn": "3回合",
      "options_cn": [
        "LV6",
        "LV7",
        "LV8"
      ]
    },
    {
      "id": 5,
      "type": "스킬",
      "target": "광역",
      "skillIcon": "/assets/img/skill-element/디버프광역.png",
      "skillName": "음률의 침입",
      "options": [
        "LV6",
        "LV7",
        "LV8"
      ],
      "values": {
        "LV6": 32,
        "LV7": 33.6,
        "LV8": 35.2
      },
      "defaultOption": "LV8",
      "value": 35.2,
      "duration": "3턴",
      "note": "",
      "note_en": "[KR] Payment Event Only",
      "note_jp": "[KR] 支払いイベントのみ",
      "skillName_cn": "音律侵入",
      "note_cn": "",
      "type_cn": "技能",
      "target_cn": "群体",
      "duration_cn": "3回合",
      "options_cn": [
        "LV6",
        "LV7",
        "LV8"
      ]
    },
    {
      "id": 6,
      "type": "스킬",
      "target": "광역",
      "skillIcon": "/assets/img/skill-element/디버프광역.png",
      "skillName": "마하라쿤다",
      "options": [
        "LV6",
        "LV7",
        "LV8"
      ],
      "values": {
        "LV6": 27.1,
        "LV7": 28.5,
        "LV8": 29.8
      },
      "defaultOption": "LV8",
      "value": 29.8,
      "duration": "3턴",
      "note": "",
      "skillName_cn": "玛哈拉昆达",
      "note_cn": "",
      "type_cn": "技能",
      "target_cn": "群体",
      "duration_cn": "3回合",
      "options_cn": [
        "LV6",
        "LV7",
        "LV8"
      ]
    },
    {
      "id": 7,
      "type": "페르소나",
      "target": "단일/광역",
      "skillIcon": "/assets/img/tactic-persona/비슈누.webp",
      "skillName": "비슈누",
      "options": [],
      "value": 48,
      "duration": "2턴",
      "note": "풍습 부여 시",
      "note_en": "풍습",
      "note_jp": "풍습 成功",
      "skillName_cn": "毗湿奴",
      "note_cn": "附加风袭时",
      "type_cn": "人格面具",
      "target_cn": "单体/群体",
      "duration_cn": "2回合",
      "options_cn": []
    },
    {
      "id": 8,
      "type": "페르소나",
      "target": "단일/광역",
      "skillIcon": "/assets/img/tactic-persona/노른.webp",
      "skillName": "노른",
      "options": [],
      "value": 31.5,
      "duration": "2턴",
      "note": "풍습 부여 시",
      "note_en": "풍습",
      "note_jp": "풍습 成功",
      "skillName_cn": "诺伦",
      "note_cn": "附加风袭时",
      "type_cn": "人格面具",
      "target_cn": "单体/群体",
      "duration_cn": "2回合",
      "options_cn": []
    },
    {
      "id": 9,
      "type": "페르소나",
      "target": "단일",
      "skillIcon": "/assets/img/tactic-persona/야노식.webp",
      "skillName": "야노식",
      "options": [
        "LV6",
        "LV7",
        "LV8"
      ],
      "values": {
        "LV6": 41.6,
        "LV7": 44.3,
        "LV8": 46.9
      },
      "defaultOption": "LV8",
      "value": 46.9,
      "duration": "2턴",
      "note": "[조준]",
      "note_en": "Marked",
      "note_jp": "標的",
      "skillName_cn": "亚诺希克",
      "note_cn": "[瞄准]",
      "type_cn": "人格面具",
      "target_cn": "单体",
      "duration_cn": "2回合",
      "options_cn": [
        "LV6",
        "LV7",
        "LV8"
      ]
    },
    {
      "id": 10,
      "type": "페르소나",
      "target": "단일",
      "skillIcon": "/assets/img/tactic-persona/체르노보그.webp",
      "skillName": "체르노보그 - 고유스킬",
      "options": [
        "1중첩",
        "2중첩",
        "3중첩"
      ],
      "values": {
        "1중첩": 10,
        "2중첩": 20,
        "3중첩": 30
      },
      "defaultOption": "3중첩",
      "value": 30,
      "duration": "2턴",
      "note": "악몽 1중첩 당",
      "note_en": "Nightmare per stack",
      "note_jp": "悪夢 1重ごと",
      "skillName_cn": "切尔诺伯格 - 固有技能",
      "note_cn": "每1层『梦魇』",
      "type_cn": "人格面具",
      "target_cn": "单体",
      "duration_cn": "2回合",
      "options_cn": [
        "1层",
        "2层",
        "3层"
      ]
    },
    {
      "id": 11,
      "type": "페르소나",
      "target": "광역",
      "skillIcon": "/assets/img/tactic-persona/년수.webp",
      "skillName": "년수 - 고유스킬",
      "options": [
        "LV6",
        "LV7",
        "LV8"
      ],
      "values": {
        "LV6": 10,
        "LV7": 10.5,
        "LV8": 11
      },
      "defaultOption": "LV8",
      "value": 11,
      "duration": "2턴",
      "note": "",
      "skillName_cn": "年兽 - 固有技能",
      "note_cn": "",
      "type_cn": "人格面具",
      "target_cn": "群体",
      "duration_cn": "2回合",
      "options_cn": [
        "LV6",
        "LV7",
        "LV8"
      ]
    },
    {
      "id": 12,
      "type": "페르소나",
      "target": "광역",
      "skillIcon": "/assets/img/tactic-persona/시바.webp",
      "skillName": "시바 - 고유스킬",
      "options": [],
      "value": 45,
      "duration": "1턴",
      "note": "2턴마다 방어력 감소 효과 발동 가능",
      "note_en": "2턴 CD",
      "note_jp": "2ターン CD",
      "skillName_cn": "湿婆 - 固有技能",
      "note_cn": "每2回合可触发防御降低效果",
      "type_cn": "人格面具",
      "target_cn": "群体",
      "duration_cn": "1回合",
      "options_cn": []
    },
    {
      "id": 13,
      "type": "페르소나",
      "target": "단일",
      "skillIcon": "/assets/img/tactic-persona/스라오샤.webp",
      "skillName": "스라오샤 - 고유스킬",
      "options": [],
      "value": 25,
      "duration": "2턴",
      "note": "축복 속성 한정",
      "note_en": "Bless",
      "note_jp": "祝福",
      "skillName_cn": "斯拉欧加 - 固有技能",
      "note_cn": "仅限祝福属性",
      "type_cn": "人格面具",
      "target_cn": "单体",
      "duration_cn": "2回合",
      "options_cn": []
    },
    {
      "id": "persona-mental-ailment",
      "type": "페르소나",
      "target": "광역",
      "skillIcon": "/assets/img/tactic-persona/트럼페터.webp",
      "skillName": "트럼페터",
      "options": [],
      "value": 12,
      "duration": "2턴",
      "note": "정신 이상",
      "note_en": "Mental Ailment",
      "note_jp": "精神異常",
      "skillName_cn": "吹号者",
      "note_cn": "精神异常",
      "type_cn": "人格面具",
      "target_cn": "群体",
      "duration_cn": "2回合",
      "options_cn": []
    },
    {
      "id": "persona-healing",
      "type": "페르소나",
      "target": "단일",
      "skillIcon": "/assets/img/tactic-persona/티타니아.webp",
      "skillName": "티타니아",
      "options": [],
      "value": 9,
      "duration": "2턴",
      "note": "치료",
      "note_en": "Healing",
      "note_jp": "治療",
      "skillName_cn": "缇坦妮雅",
      "note_cn": "治疗",
      "type_cn": "人格面具",
      "target_cn": "单体",
      "duration_cn": "2回合",
      "options_cn": []
    }
  ],
  "아란": [
    {
      "id": "aran-sinful-act",
      "type": "스킬1",
      "target": "단일/광역",
      "skillIcon": "/assets/img/skill-element/주원.png",
      "skillName": "금전의 식흔",
      "options": [
        "LV10 4중첩",
        "LV10 6중첩(의식2)",
        "LV10+5 4중첩",
        "LV10+5 6중첩(의식2)",
        "LV12 4중첩",
        "LV12 6중첩(의식2)",
        "LV12+5 4중첩",
        "LV12+5 6중첩(의식2)"
      ],
      "values": {
        "LV10 4중첩": 62.4,
        "LV10 6중첩(의식2)": 93.6,
        "LV10+5 4중첩": 68.8,
        "LV10+5 6중첩(의식2)": 103.2,
        "LV12 4중첩": 65.2,
        "LV12 6중첩(의식2)": 97.8,
        "LV12+5 4중첩": 71.6,
        "LV12+5 6중첩(의식2)": 107.4
      },
      "defaultOption": "LV12+5 6중첩(의식2)",
      "value": 107.4,
      "duration": "2턴",
      "note": "스킬1/스킬2",
      "skillName_cn": "禁典蚀痕",
      "note_cn": "技能1/技能2",
      "type_cn": "技能1",
      "target_cn": "单体/群体",
      "duration_cn": "2回合",
      "options_cn": [
        "LV10 4层",
        "LV10 6层(意识2)",
        "LV10+5 4层",
        "LV10+5 6层(意识2)",
        "LV12 4层",
        "LV12 6层(意识2)",
        "LV12+5 4层",
        "LV12+5 6层(意识2)"
      ]
    }
  ],
  "코로마루": [
    {
      "id": "koromaru1",
      "type": "테우르기아",
      "target": "광역",
      "skillIcon": "/assets/img/skill-element/주원광역.png",
      "skillName": "블랙 하운드",
      "options": [
        "LV10",
        "LV10+심상5",
        "LV13",
        "LV13+심상5"
      ],
      "values": {
        "LV10": 77.94,
        "LV10+심상5": 85.92,
        "LV13": 82.77,
        "LV13+심상5": 90.76
      },
      "defaultOption": "LV13+심상5",
      "value": 90.76,
      "duration": "2턴",
      "note": "",
      "note_en": "",
      "note_jp": "",
      "skillName_cn": "黑色猎犬",
      "note_cn": "",
      "type_cn": "神通法",
      "target_cn": "群体",
      "duration_cn": "2回合",
      "options_cn": [
        "LV10",
        "LV10+意识5",
        "LV13",
        "LV13+意识5"
      ]
    },
    {
      "id": "koromaru2",
      "type": "지원기술",
      "target": "광역",
      "skillIcon": "/assets/img/skill-element/디버프광역.png",
      "skillName": "지원기술",
      "skillName_en": "Assist Skill",
      "skillName_jp": "サポートスキル",
      "value": 30,
      "duration": "",
      "note": "",
      "note_en": "",
      "note_jp": "",
      "skillName_cn": "援助技能",
      "note_cn": "",
      "type_cn": "援助技能",
      "target_cn": "群体",
      "duration_cn": ""
    }
  ],
  "준페이": [
    {
      "id": "junpei1",
      "type": "스킬1",
      "target": "광역",
      "skillIcon": "/assets/img/skill-element/화염.png",
      "skillName": "황천격",
      "options": [
        "LV10",
        "LV10+심상5",
        "LV13",
        "LV13+심상5"
      ],
      "values": {
        "LV10": 39,
        "LV10+심상5": 43,
        "LV13": 41.5,
        "LV13+심상5": 45.5
      },
      "defaultOption": "LV13+심상5",
      "value": 45.5,
      "duration": "2턴",
      "note": "",
      "note_en": "",
      "note_jp": "",
      "skillName_cn": "煌天击",
      "note_cn": "",
      "type_cn": "技能1",
      "target_cn": "群体",
      "duration_cn": "2回合",
      "options_cn": [
        "LV10",
        "LV10+意识5",
        "LV13",
        "LV13+意识5"
      ]
    },
    {
      "id": "junpei2",
      "type": "스킬2",
      "target": "단일",
      "skillIcon": "/assets/img/skill-element/물리.png",
      "skillName": "익파격",
      "options": [
        "LV10",
        "LV10+심상5",
        "LV13",
        "LV13+심상5"
      ],
      "values": {
        "LV10": 39,
        "LV10+심상5": 43,
        "LV13": 41.5,
        "LV13+심상5": 45.5
      },
      "defaultOption": "LV13+심상5",
      "value": 45.5,
      "duration": "2턴",
      "note": "",
      "note_en": "",
      "note_jp": "",
      "skillName_cn": "翼破击",
      "note_cn": "",
      "type_cn": "技能2",
      "target_cn": "单体",
      "duration_cn": "2回合",
      "options_cn": [
        "LV10",
        "LV10+意识5",
        "LV13",
        "LV13+意识5"
      ]
    }
  ],
  "J&C": [
    {
      "id": "jc2",
      "type": "스킬3",
      "target": "광역",
      "skillIcon": "/assets/img/skill-element/만능.png",
      "skillName": "둘이 하나 되는 페르소나",
      "options": [
        "LV10",
        "LV10+심상5",
        "LV13",
        "LV13+심상5"
      ],
      "values": {
        "LV10": 50.8,
        "LV10+심상5": 56,
        "LV13": 53.8,
        "LV13+심상5": 59
      },
      "defaultOption": "LV13+심상5",
      "value": 59,
      "duration": "2턴",
      "note": "굴복『가르침』+『인과』",
      "note_en": "Saboteur/Service & Admonition + Luck & Loss",
      "note_jp": "屈服",
      "skillName_cn": "二元合一的面具",
      "note_cn": "屈从『教诲』+『因果』",
      "type_cn": "技能3",
      "target_cn": "群体",
      "duration_cn": "2回合",
      "options_cn": [
        "LV10",
        "LV10+意识5",
        "LV13",
        "LV13+意识5"
      ]
    }
  ],
  "슌·프론티어": [
    {
      "id": "shun-frontier-1",
      "type": "의식0",
      "target": "광역",
      "skillIcon": "/assets/img/character-detail/ritual0.png",
      "skillName": "총격",
      "options": [
        "1중첩",
        "2중첩"
      ],
      "values": {
        "1중첩": 40,
        "2중첩": 80
      },
      "defaultOption": "2중첩",
      "value": 80,
      "duration": "-",
      "note": "생명 20000 기준",
      "note_en": "20000 Max HP",
      "note_jp": "20000 Max HP",
      "note_cn": "以生命值20000为基准",
      "skillName_cn": "枪击",
      "type_cn": "意识0",
      "target_cn": "群体",
      "duration_cn": "-",
      "options_cn": [
        "1层",
        "2层"
      ]
    },
    {
      "id": "shun-frontier-2",
      "type": "전용무기",
      "target": "광역",
      "skillIcon": "/assets/img/character-weapon/슌·프론티어-5-01.png",
      "skillName": "성마각 신표",
      "options": [
        "개조0",
        "개조1&2",
        "개조3&4",
        "개조5&6"
      ],
      "values": {
        "개조0": 15.8,
        "개조1&2": 20.6,
        "개조3&4": 25.4,
        "개조5&6": 30.2
      },
      "defaultOption": "개조5&6",
      "value": 30.2,
      "duration": "2턴",
      "note": "",
      "skillName_cn": "圣马角信标",
      "note_cn": "",
      "type_cn": "专属武器",
      "target_cn": "群体",
      "duration_cn": "2回合",
      "options_cn": [
        "改造0",
        "改造1&2",
        "改造3&4",
        "改造5&6"
      ]
    }
  ],
  "미츠루": [
    {
      "id": "mitsuru1",
      "type": "스킬1",
      "target": "단일",
      "skillIcon": "/assets/img/skill-element/빙결.png",
      "skillName": "화려한 얼음꽃",
      "options": [
        "LV10",
        "LV10+심상5",
        "LV10+심상5(의식1)",
        "LV13+심상5",
        "LV13+심상5(의식6)"
      ],
      "values": {
        "LV10": 58.56,
        "LV10+심상5": 64.56,
        "LV10+심상5(의식1)": 90.38,
        "LV13": 87.02,
        "LV13+심상5": 95.42,
        "LV13+심상5(의식6)": 109.06
      },
      "defaultOption": "LV13+심상5(의식6)",
      "value": 109.06,
      "duration": "-",
      "note": "",
      "note_en": "",
      "note_jp": "",
      "skillName_cn": "绚烂冰华",
      "note_cn": "",
      "type_cn": "技能1",
      "target_cn": "单体",
      "duration_cn": "-",
      "options_cn": [
        "LV10",
        "LV10+意识5",
        "LV10+意识5(意识1)",
        "LV13+意识5",
        "LV13+意识5(意识6)"
      ]
    },
    {
      "id": "mitsuru2",
      "type": "스킬2",
      "target": "단일",
      "skillIcon": "/assets/img/skill-element/디버프.png",
      "skillName": "극한의 폭풍",
      "options": [
        "LV10",
        "LV10+심상5",
        "LV10+심상5(의식1)",
        "LV13+심상5",
        "LV13+심상5(의식6)"
      ],
      "values": {
        "LV10": 39.03,
        "LV10+심상5": 43.03,
        "LV13": 41.45,
        "LV13+심상5": 45.45
      },
      "defaultOption": "LV13+심상5",
      "value": 45.45,
      "duration": "-",
      "note": "",
      "note_en": "",
      "note_jp": "",
      "skillName_cn": "极寒风暴",
      "note_cn": "",
      "type_cn": "技能2",
      "target_cn": "单体",
      "duration_cn": "-",
      "options_cn": [
        "LV10",
        "LV10+意识5",
        "LV10+意识5(意识1)",
        "LV13+意识5",
        "LV13+意识5(意识6)"
      ]
    }
  ],
  "카타야마": [
    {
      "id": "katayama1",
      "type": "스킬1",
      "target": "광역",
      "skillIcon": "/assets/img/skill-element/전격광역.png",
      "skillName": "회전 칼날",
      "options": [
        "LV10",
        "LV10+심상5",
        "LV13",
        "LV13+심상5"
      ],
      "values": {
        "LV10": 48.8,
        "LV10+심상5": 53.8,
        "LV13": 51.8,
        "LV13+심상5": 56.8
      },
      "defaultOption": "LV13+심상5",
      "value": 56.8,
      "duration": "3턴",
      "note": "스킬2와 중복 불가",
      "note_en": "Skill 2 overlap not allowed",
      "note_jp": "スキル2と重複不可",
      "skillName_cn": "激情回旋刃",
      "note_cn": "不可与技能2重复",
      "type_cn": "技能1",
      "target_cn": "群体",
      "duration_cn": "3回合",
      "options_cn": [
        "LV10",
        "LV10+意识5",
        "LV13",
        "LV13+意识5"
      ]
    },
    {
      "id": "katayama2",
      "type": "스킬2",
      "target": "광역",
      "skillIcon": "/assets/img/skill-element/전격광역.png",
      "skillName": "선생님의 심판",
      "options": [
        "LV10",
        "LV10+심상5",
        "LV13",
        "LV13+심상5"
      ],
      "values": {
        "LV10": 48.8,
        "LV10+심상5": 53.8,
        "LV13": 51.8,
        "LV13+심상5": 56.8
      },
      "defaultOption": "LV13+심상5",
      "value": 56.8,
      "duration": "1턴",
      "note": "스킬1과 중복 불가",
      "note_en": "Skill 1 and overlap not allowed",
      "note_jp": "スキル1と重複不可",
      "skillName_cn": "裁决雷击",
      "note_cn": "不可与技能1重复",
      "type_cn": "技能2",
      "target_cn": "群体",
      "duration_cn": "1回合",
      "options_cn": [
        "LV10",
        "LV10+意识5",
        "LV13",
        "LV13+意识5"
      ]
    },
    {
      "id": "katayama3",
      "type": "HIGHLIGHT",
      "target": "광역",
      "skillIcon": "/assets/img/skill-element/전격광역.png",
      "skillName": "HIGHLIGHT",
      "options": [
        "LV10",
        "LV10+심상5",
        "LV13",
        "LV13+심상5"
      ],
      "values": {
        "LV10": 29.3,
        "LV10+심상5": 32.3,
        "LV13": 31.1,
        "LV13+심상5": 34.1
      },
      "defaultOption": "LV13+심상5",
      "value": 34.1,
      "duration": "-",
      "note": "",
      "note_en": "",
      "note_jp": "",
      "skillName_cn": "HIGHLIGHT",
      "note_cn": "",
      "type_cn": "HIGHLIGHT",
      "target_cn": "群体",
      "duration_cn": "-",
      "options_cn": [
        "LV10",
        "LV10+意识5",
        "LV13",
        "LV13+意识5"
      ]
    },
    {
      "id": "katayama4",
      "type": "의식0",
      "target": "광역",
      "skillIcon": "/assets/img/character-detail/ritual0.png",
      "skillName": "고효율 지휘",
      "options": [],
      "value": 50,
      "duration": "",
      "note": "중상",
      "note_en": "-",
      "note_jp": "-",
      "skillName_cn": "高效指导",
      "note_cn": "重伤",
      "type_cn": "意识0",
      "target_cn": "群体",
      "duration_cn": "",
      "options_cn": []
    }
  ],
  "미나미·여름": [
    {
      "id": "minami_sum1",
      "type": "의식2",
      "target": "광역",
      "skillIcon": "/assets/img/character-detail/ritual2.png",
      "skillName": "바람에 흔들리는 꽃",
      "options": [],
      "values": {},
      "defaultOption": "",
      "value": 25,
      "duration": "3턴",
      "note": "스킬1",
      "skillName_cn": "被风吹拂的花",
      "note_cn": "技能1",
      "type_cn": "意识2",
      "target_cn": "群体",
      "duration_cn": "3回合",
      "options_cn": []
    }
  ],
  "이치고": [
    {
      "id": "ichigo2",
      "type": "의식1",
      "target": "단일",
      "skillIcon": "/assets/img/character-detail/ritual1.png",
      "skillName": "부서진다면",
      "options": [
        "의식1",
        "의식6"
      ],
      "values": {
        "의식1": 30,
        "의식6": 45
      },
      "defaultOption": "의식6",
      "value": 45,
      "duration": "",
      "note": "원념 중첩 당 3%",
      "note_en": "Per Stack 3%",
      "note_jp": "1スタック 3%",
      "skillName_cn": "如果坏掉的话",
      "note_cn": "每1层『怨念』提升3%",
      "type_cn": "意识1",
      "target_cn": "单体",
      "duration_cn": "",
      "options_cn": [
        "意识1",
        "意识6"
      ]
    }
  ],
  "미오": [
    {
      "id": "mio1",
      "type": "스킬1",
      "target": "광역",
      "skillIcon": "/assets/img/skill-element/빙결광역.png",
      "skillName": "파도의 메아리",
      "options": [
        "LV10",
        "LV10+심상5",
        "LV13",
        "LV13+심상5"
      ],
      "values": {
        "LV10": 39,
        "LV10+심상5": 43,
        "LV13": 41.5,
        "LV13+심상5": 45.5
      },
      "defaultOption": "LV13+심상5",
      "value": 45.5,
      "duration": "3턴",
      "note": "",
      "skillName_cn": "迴波潮聚",
      "note_cn": "",
      "type_cn": "技能1",
      "target_cn": "群体",
      "duration_cn": "3回合",
      "options_cn": [
        "LV10",
        "LV10+意识5",
        "LV13",
        "LV13+意识5"
      ]
    },
    {
      "id": "mio2",
      "type": "스킬3",
      "target": "광역",
      "skillIcon": "/assets/img/skill-element/빙결광역.png",
      "skillName": "흐름의 폭발",
      "options": [
        "LV10",
        "LV10+심상5",
        "LV13",
        "LV13+심상5"
      ],
      "values": {
        "LV10": 36.6,
        "LV10+심상5": 40.4,
        "LV13": 38.8,
        "LV13+심상5": 42.6
      },
      "defaultOption": "LV13+심상5",
      "value": 42.6,
      "duration": "2턴",
      "note": "스킬3(강화) 중복 불가",
      "note_en": "Skill 3(Enhance) overlap not allowed",
      "note_jp": "スキル3(強化)と重複不可",
      "skillName_cn": "断流瀑裂",
      "note_cn": "不可与技能3(强化)重复",
      "type_cn": "技能3",
      "target_cn": "群体",
      "duration_cn": "2回合",
      "options_cn": [
        "LV10",
        "LV10+意识5",
        "LV13",
        "LV13+意识5"
      ]
    },
    {
      "id": "mio3",
      "type": "스킬3(강화)",
      "target": "광역",
      "skillIcon": "/assets/img/skill-element/빙결광역.png",
      "skillName": "폭발의 용오름",
      "options": [
        "LV10",
        "LV10+심상5",
        "LV13",
        "LV13+심상5"
      ],
      "values": {
        "LV10": 43.9,
        "LV10+심상5": 48.4,
        "LV13": 46.6,
        "LV13+심상5": 51.1
      },
      "defaultOption": "LV13+심상5",
      "value": 51.1,
      "duration": "2턴",
      "note": "",
      "skillName_cn": "断流瀑裂·水龙卷",
      "note_cn": "",
      "type_cn": "技能3(强化)",
      "target_cn": "群体",
      "duration_cn": "2回合",
      "options_cn": [
        "LV10",
        "LV10+意识5",
        "LV13",
        "LV13+意识5"
      ]
    },
    {
      "id": "mio4",
      "type": "전용무기",
      "target": "광역",
      "skillIcon": "/assets/img/character-weapon/미오-5-01.png",
      "skillName": "서리빛 스텔라",
      "options": [
        "개조0",
        "개조1&2",
        "개조3&4",
        "개조5&6"
      ],
      "values": {
        "개조0": 23.3,
        "개조1&2": 30.3,
        "개조3&4": 37.3,
        "개조5&6": 44.3
      },
      "defaultOption": "개조5&6",
      "value": 44.3,
      "duration": "2턴",
      "note": "",
      "skillName_cn": "镇炎璃叉",
      "note_cn": "",
      "type_cn": "专属武器",
      "target_cn": "群体",
      "duration_cn": "2回合",
      "options_cn": [
        "改造0",
        "改造1&2",
        "改造3&4",
        "改造5&6"
      ]
    }
  ],
  "후타바": [
    {
      "id": 14,
      "type": "스킬1",
      "target": "광역",
      "skillIcon": "/assets/img/skill-element/버프.png",
      "skillName": "소리없는 침습 (약점)",
      "skillName_en": "Skill1 (Weakness)",
      "skillName_jp": "スキル1 (弱体)",
      "options": [
        "LV10",
        "LV10+심상5",
        "LV13",
        "LV13+심상5",
        "LV13(의식5)",
        "LV13(의식5)+심상5"
      ],
      "options_en": [
        "LV10",
        "LV10+심상5",
        "LV13",
        "LV13+심상5",
        "LV13(의식4)",
        "LV13(의식4)+심상5"
      ],
      "options_jp": [
        "LV10",
        "LV10+심상5",
        "LV13",
        "LV13+심상5",
        "LV13(의식4)",
        "LV13(의식4)+심상5"
      ],
      "values": {
        "LV10": 60.8,
        "LV10+심상5": 65.7,
        "LV13": 75.4,
        "LV13+심상5": 80.26,
        "LV13(의식5)": 87.5,
        "LV13(의식5)+심상5": 93.1
      },
      "values_en": {
        "LV10": 60.8,
        "LV10+심상5": 65.7,
        "LV13": 75.4,
        "LV13+심상5": 80.26,
        "LV13(의식4)": 87.5,
        "LV13(의식4)+심상5": 93.1
      },
      "values_jp": {
        "LV10": 60.8,
        "LV10+심상5": 65.7,
        "LV13": 75.4,
        "LV13+심상5": 80.26,
        "LV13(의식4)": 87.5,
        "LV13(의식4)+심상5": 93.1
      },
      "defaultOption": "LV13(의식5)+심상5",
      "defaultOption_en": "LV13(의식4)+심상5",
      "defaultOption_jp": "LV13(의식4)+심상5",
      "value": 93.1,
      "duration": "3턴",
      "note": "",
      "skillName_cn": "无声侵袭 (弱点)",
      "note_cn": "",
      "type_cn": "技能1",
      "target_cn": "群体",
      "duration_cn": "3回合",
      "options_cn": [
        "LV10",
        "LV10+意识5",
        "LV13",
        "LV13+意识5",
        "LV13(意识5)",
        "LV13(意识5)+意识5"
      ]
    },
    {
      "id": "14-2",
      "charName": "",
      "charImage": "",
      "type": "스킬1",
      "target": "광역",
      "skillIcon": "/assets/img/skill-element/버프.png",
      "skillName": "소리없는 침습",
      "options": [
        "LV10",
        "LV10+심상5",
        "LV13",
        "LV13+심상5",
        "LV13(의식5)",
        "LV13(의식5)+심상5"
      ],
      "options_en": [
        "LV10",
        "LV10+심상5",
        "LV13",
        "LV13+심상5",
        "LV13(의식4)",
        "LV13(의식4)+심상5"
      ],
      "options_jp": [
        "LV10",
        "LV10+심상5",
        "LV13",
        "LV13+심상5",
        "LV13(의식4)",
        "LV13(의식4)+심상5"
      ],
      "values": {
        "LV10": 30.4,
        "LV10+심상5": 32.8,
        "LV13": 37.7,
        "LV13+심상5": 40.13,
        "LV13(의식5)": 43.7,
        "LV13(의식5)+심상5": 46.55
      },
      "values_en": {
        "LV10": 30.4,
        "LV10+심상5": 32.8,
        "LV13": 37.7,
        "LV13+심상5": 40.13,
        "LV13(의식4)": 43.7,
        "LV13(의식4)+심상5": 46.55
      },
      "values_jp": {
        "LV10": 30.4,
        "LV10+심상5": 32.8,
        "LV13": 37.7,
        "LV13+심상5": 40.13,
        "LV13(의식4)": 43.7,
        "LV13(의식4)+심상5": 46.55
      },
      "defaultOption": "LV13(의식5)+심상5",
      "defaultOption_en": "LV13(의식4)+심상5",
      "defaultOption_jp": "LV13(의식4)+심상5",
      "value": 46.55,
      "duration": "3턴",
      "note": "",
      "skillName_cn": "无声侵袭",
      "note_cn": "",
      "type_cn": "技能1",
      "target_cn": "群体",
      "duration_cn": "3回合",
      "options_cn": [
        "LV10",
        "LV10+意识5",
        "LV13",
        "LV13+意识5",
        "LV13(意识5)",
        "LV13(意识5)+意识5"
      ]
    }
  ],
  "아케치": [
    {
      "id": "akechi",
      "type": "스킬2",
      "target": "광역",
      "skillIcon": "/assets/img/skill-element/주원광역.png",
      "skillName": "기울어진 사냥터",
      "options": [
        "LV10",
        "LV10+심상5",
        "LV13",
        "LV13+심상5"
      ],
      "values": {
        "LV10": 25.4,
        "LV10+심상5": 28,
        "LV13": 26.9,
        "LV13+심상5": 29.5
      },
      "defaultOption": "LV13+심상5",
      "value": 29.5,
      "duration": "2턴/4턴",
      "note": "의식1 → 4턴",
      "skillName_cn": "不公的狩猎场",
      "note_cn": "意识1 → 4回合",
      "type_cn": "技能2",
      "target_cn": "群体",
      "duration_cn": "2回合/4回合",
      "options_cn": [
        "LV10",
        "LV10+意识5",
        "LV13",
        "LV13+意识5"
      ]
    }
  ],
  "몽타뉴·백조": [
    {
      "id": "mont_swan1",
      "type": "의식2",
      "target": "광역",
      "skillIcon": "/assets/img/character-detail/ritual2.png",
      "skillName": "세월의 시와 바람의 탄식",
      "options": [],
      "values": {},
      "defaultOption": "",
      "value": 40,
      "duration": "3턴",
      "note": "봄 형태",
      "note_en": "Spring",
      "note_jp": "春",
      "skillName_cn": "时光的诗与风的叹息",
      "note_cn": "春形态",
      "type_cn": "意识2",
      "target_cn": "群体",
      "duration_cn": "3回合",
      "options_cn": []
    }
  ],
  "토모코·여름": [
    {
      "id": "tomoko1",
      "type": "의식1",
      "target": "광역",
      "skillIcon": "/assets/img/character-detail/ritual1.png",
      "skillName": "어김없는 빛",
      "options": [
        "1중첩",
        "2중첩",
        "3중첩"
      ],
      "values": {
        "1중첩": 15,
        "2중첩": 30,
        "3중첩": 45
      },
      "defaultOption": "3중첩",
      "value": 45,
      "duration": "3턴",
      "note": "화려한 불꽃 발동 시 1중첩",
      "note_en": "추가 효과",
      "note_jp": "추가 효과",
      "skillName_cn": "光芒如约而至",
      "note_cn": "『绚烂烟火』发动时获得1层",
      "type_cn": "意识1",
      "target_cn": "群体",
      "duration_cn": "3回合",
      "options_cn": [
        "1层",
        "2层",
        "3层"
      ]
    },
    {
      "id": "tomoko2",
      "type": "전용무기",
      "target": "광역",
      "skillIcon": "/assets/img/character-weapon/토모코·여름-5-01.png",
      "skillName": "오션구슬 완드",
      "skillName_en": "",
      "skillName_jp": "",
      "options": [],
      "value": 12,
      "duration": "3턴",
      "note": "",
      "note_en": "-",
      "note_jp": "-",
      "skillName_cn": "波子宝贝",
      "note_cn": "",
      "type_cn": "专属武器",
      "target_cn": "群体",
      "duration_cn": "3回合",
      "options_cn": []
    }
  ],
  "루우나": [
    {
      "id": 16,
      "type": "전용무기",
      "target": "광역",
      "skillIcon": "/assets/img/character-weapon/루우나-5-01.png",
      "skillName": "바이트 클로우 (스킬1 스택)",
      "options": [
        "개조0",
        "개조1&2",
        "개조3&4",
        "개조5&6"
      ],
      "values": {
        "개조0": 16.7,
        "개조1&2": 21.7,
        "개조3&4": 26.7,
        "개조5&6": 31.7
      },
      "defaultOption": "개조5&6",
      "value": 31.7,
      "duration": "3턴",
      "note": "",
      "skillName_cn": "家宅恶犬 (技能1 层)",
      "note_cn": "",
      "type_cn": "专属武器",
      "target_cn": "群体",
      "duration_cn": "3回合",
      "options_cn": [
        "改造0",
        "改造1&2",
        "改造3&4",
        "改造5&6"
      ]
    },
    {
      "id": 17,
      "type": "전용무기",
      "target": "단일",
      "skillIcon": "/assets/img/character-weapon/루우나-5-01.png",
      "skillName": "바이트 클로우 (스킬2 스택)",
      "options": [
        "개조0",
        "개조1&2",
        "개조3&4",
        "개조5&6"
      ],
      "values": {
        "개조0": 33.3,
        "개조1&2": 43.3,
        "개조3&4": 53.3,
        "개조5&6": 63.3
      },
      "defaultOption": "개조5&6",
      "value": 63.3,
      "duration": "3턴",
      "note": "",
      "skillName_cn": "家宅恶犬 (技能2 层)",
      "note_cn": "",
      "type_cn": "专属武器",
      "target_cn": "单体",
      "duration_cn": "3回合",
      "options_cn": [
        "改造0",
        "改造1&2",
        "改造3&4",
        "改造5&6"
      ]
    },
    {
      "id": 18,
      "type": "의식0",
      "target": "광역",
      "skillIcon": "/assets/img/character-detail/ritual0.png",
      "skillName": "모든 포옹과 따뜻함 (스킬3)",
      "options": [],
      "value": 18,
      "duration": "2턴",
      "note": "기본확률 60%",
      "note_en": "60% Chance",
      "note_jp": "60% 確率",
      "skillName_cn": "每个拥抱与温暖 (技能3)",
      "note_cn": "基础概率60%",
      "type_cn": "意识0",
      "target_cn": "群体",
      "duration_cn": "2回合",
      "options_cn": []
    },
    {
      "id": "19-1",
      "type": "스킬1",
      "target": "광역",
      "skillIcon": "/assets/img/skill-element/화염광역.png",
      "skillName": "뜨거운 악수 (화염)",
      "skillName_en": "Skill1 (Fire/Ice/Wind/Elec)",
      "skillName_jp": "スキル1 (火/氷/風/電)",
      "options": [
        "LV10",
        "LV10+심상5",
        "LV13",
        "LV13+심상5"
      ],
      "values": {
        "LV10": 52.8,
        "LV10+심상5": 55.6,
        "LV13": 56.2,
        "LV13+심상5": 58.7
      },
      "defaultOption": "LV13+심상5",
      "value": 58.7,
      "duration": "2턴",
      "note": "의식6 → 3턴",
      "note_en": "A6 → 3T / Elemental",
      "skillName_cn": "炽热握手礼 (火焰)",
      "note_cn": "意识6 → 3回合",
      "type_cn": "技能1",
      "target_cn": "群体",
      "duration_cn": "2回合",
      "options_cn": [
        "LV10",
        "LV10+意识5",
        "LV13",
        "LV13+意识5"
      ]
    },
    {
      "id": "19-2",
      "type": "스킬1",
      "target": "광역",
      "skillIcon": "/assets/img/skill-element/화염광역.png",
      "skillName": "뜨거운 악수",
      "options": [
        "LV10",
        "LV10+심상5",
        "LV13",
        "LV13+심상5"
      ],
      "values": {
        "LV10": 26.4,
        "LV10+심상5": 29.2,
        "LV13": 27.9,
        "LV13+심상5": 30.7
      },
      "defaultOption": "LV13+심상5",
      "value": 30.7,
      "duration": "2턴",
      "note": "의식6 → 3턴",
      "note_en": "A6 → 3T",
      "skillName_cn": "炽热握手礼",
      "note_cn": "意识6 → 3回合",
      "type_cn": "技能1",
      "target_cn": "群体",
      "duration_cn": "2回合",
      "options_cn": [
        "LV10",
        "LV10+意识5",
        "LV13",
        "LV13+意识5"
      ]
    },
    {
      "id": 20,
      "type": "스킬2",
      "target": "단일",
      "skillIcon": "/assets/img/skill-element/화염.png",
      "skillName": "악당에 대한 경고",
      "options": [
        "LV10",
        "LV10+심상5",
        "LV13",
        "LV13+심상5"
      ],
      "values": {
        "LV10": 68.3,
        "LV10+심상5": 73.9,
        "LV13": 72.5,
        "LV13+심상5": 78
      },
      "defaultOption": "LV13+심상5",
      "value": 78,
      "duration": "2턴",
      "note": "의식6 → 3턴",
      "note_en": "A6 → 3T",
      "skillName_cn": "对破坏者的威吓",
      "note_cn": "意识6 → 3回合",
      "type_cn": "技能2",
      "target_cn": "单体",
      "duration_cn": "2回合",
      "options_cn": [
        "LV10",
        "LV10+意识5",
        "LV13",
        "LV13+意识5"
      ]
    }
  ],
  "치즈코": [
    {
      "id": 21,
      "type": "전용무기",
      "target": "단일",
      "skillIcon": "/assets/img/character-weapon/치즈코-5-01.png",
      "skillName": "오버클럭 펄스",
      "options": [
        "개조0",
        "개조1&2",
        "개조3&4",
        "개조5&6"
      ],
      "values": {
        "개조0": 33,
        "개조1&2": 43,
        "개조3&4": 53,
        "개조5&6": 63
      },
      "defaultOption": "개조5&6",
      "value": 63,
      "duration": "2턴",
      "note": "",
      "skillName_cn": "超频脉冲",
      "note_cn": "",
      "type_cn": "专属武器",
      "target_cn": "单体",
      "duration_cn": "2回合",
      "options_cn": [
        "改造0",
        "改造1&2",
        "改造3&4",
        "改造5&6"
      ]
    },
    {
      "id": "21-2",
      "type": "4성무기",
      "type_en": "4-star Weapon",
      "type_jp": "4星武器",
      "target": "단일",
      "skillIcon": "/assets/img/character-weapon/치즈코-4-01.png",
      "skillName": "그래비티 소드",
      "options": [
        "개조0",
        "개조1&2",
        "개조3&4",
        "개조5&6"
      ],
      "values": {
        "개조0": 19.2,
        "개조1&2": 24.8,
        "개조3&4": 30.4,
        "개조5&6": 36
      },
      "defaultOption": "개조5&6",
      "value": 36,
      "duration": "",
      "note": "",
      "skillName_cn": "航域引力",
      "note_cn": "",
      "type_cn": "四星武器",
      "target_cn": "单体",
      "duration_cn": "",
      "options_cn": [
        "改造0",
        "改造1&2",
        "改造3&4",
        "改造5&6"
      ]
    },
    {
      "id": 22,
      "type": "스킬1",
      "target": "단일",
      "skillIcon": "/assets/img/skill-element/핵열.png",
      "skillName": "시그널 폭탄",
      "options": [
        "LV10",
        "LV10+심상5",
        "LV12",
        "LV12+심상5"
      ],
      "values": {
        "LV10": 37.3,
        "LV10+심상5": 37.3,
        "LV12": 38.8,
        "LV12+심상5": 38.8
      },
      "defaultOption": "LV12+심상5",
      "value": 38.8,
      "duration": "2턴",
      "note": "",
      "skillName_cn": "标志炸弹",
      "note_cn": "",
      "type_cn": "技能1",
      "target_cn": "单体",
      "duration_cn": "2回合",
      "options_cn": [
        "LV10",
        "LV10+意识5",
        "LV12",
        "LV12+意识5"
      ]
    }
  ],
  "리코": [
    {
      "id": "rico1",
      "type": "스킬1",
      "target": "광역",
      "skillIcon": "/assets/img/skill-element/버프광역.png",
      "skillName": "노을 그림자술",
      "options": [
        "LV10",
        "LV10+심상5",
        "LV12",
        "LV12+심상5"
      ],
      "values": {
        "LV10": 39.4,
        "LV10+심상5": 42.3,
        "LV12": 42.6,
        "LV12+심상5": 45.5
      },
      "defaultOption": "LV12+심상5",
      "value": 45.5,
      "duration": "2턴",
      "note": "",
      "skillName_cn": "霞影之术",
      "note_cn": "",
      "type_cn": "技能1",
      "target_cn": "群体",
      "duration_cn": "2回合",
      "options_cn": [
        "LV10",
        "LV10+意识5",
        "LV12",
        "LV12+意识5"
      ]
    }
  ],
  "야오링": [
    {
      "id": 23,
      "type": "스킬1",
      "target": "광역",
      "skillIcon": "/assets/img/skill-element/주원광역.png",
      "skillName": "나룻배 사공",
      "options": [
        "LV10",
        "LV10+심상5",
        "LV13",
        "LV13+심상5"
      ],
      "values": {
        "LV10": 49.7,
        "LV10+심상5": 54.8,
        "LV13": 53.5,
        "LV13+심상5": 58.6
      },
      "defaultOption": "LV13+심상5",
      "value": 58.6,
      "duration": "2턴",
      "note": "",
      "skillName_cn": "摆渡者",
      "note_cn": "",
      "type_cn": "技能1",
      "target_cn": "群体",
      "duration_cn": "2回合",
      "options_cn": [
        "LV10",
        "LV10+意识5",
        "LV13",
        "LV13+意识5"
      ]
    }
  ],
  "슌": [
    {
      "id": 24,
      "type": "전용무기",
      "target": "단일/광역",
      "skillIcon": "/assets/img/character-weapon/슌-5-01.png",
      "skillName": "선구자의 얼음도끼",
      "options": [
        "개조0",
        "개조1&2",
        "개조3&4",
        "개조5&6"
      ],
      "values": {
        "개조0": 30,
        "개조1&2": 39,
        "개조3&4": 48,
        "개조5&6": 57
      },
      "defaultOption": "개조5&6",
      "value": 57,
      "duration": "1턴",
      "note": "공격 받을 시 발동",
      "note_en": "Triggered when attacked",
      "note_jp": "攻撃を受けると発動",
      "skillName_cn": "始祖冰河",
      "note_cn": "受到攻击时触发",
      "type_cn": "专属武器",
      "target_cn": "单体/群体",
      "duration_cn": "1回合",
      "options_cn": [
        "改造0",
        "改造1&2",
        "改造3&4",
        "改造5&6"
      ]
    },
    {
      "id": 25,
      "type": "스킬2",
      "target": "단일",
      "skillIcon": "/assets/img/skill-element/물리.png",
      "skillName": "선봉 돌격",
      "options": [
        "LV10",
        "LV10(황야의 구세주)",
        "LV12",
        "LV12(황야의 구세주)"
      ],
      "options_en": [
        "LV10",
        "LV10(Desperado)",
        "LV12",
        "LV12(Desperado)"
      ],
      "options_jp": [
        "LV10",
        "LV10(タフガイ)",
        "LV12",
        "LV12(タフガイ)"
      ],
      "values": {
        "LV10": 30,
        "LV10(황야의 구세주)": 59.9,
        "LV12": 31.2,
        "LV12(황야의 구세주)": 62.4
      },
      "defaultOption": "LV12(황야의 구세주)",
      "defaultOption_en": "LV12(Desperado)",
      "defaultOption_jp": "LV12(タフガイ)",
      "value": 62.4,
      "duration": "2턴",
      "note": "",
      "skillName_cn": "先锋突击",
      "note_cn": "",
      "type_cn": "技能2",
      "target_cn": "单体",
      "duration_cn": "2回合",
      "options_cn": [
        "LV10",
        "LV10(荒野救星)",
        "LV12",
        "LV12(荒野救星)"
      ]
    },
    {
      "id": 26,
      "type": "총기",
      "target": "단일/광역",
      "skillIcon": "/assets/img/skill-element/총격.png",
      "skillName": "총격",
      "options": [],
      "value": 35,
      "duration": "3턴",
      "note": "10.0% 고정확률, 총기 42발 (리필 24)",
      "note_en": "10.0%, 42 bullets (24 refill)",
      "note_jp": "10.0%, 42発 (24リフィル)",
      "skillName_cn": "枪击",
      "note_cn": "10.0%固定概率，子弹42发（补充24发）",
      "type_cn": "枪击",
      "target_cn": "单体/群体",
      "duration_cn": "3回合",
      "options_cn": []
    }
  ]
};
