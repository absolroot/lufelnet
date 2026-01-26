// 스킬 목록
const skillList = ["스킬1", "스킬2", "스킬3", "HIGHLIGHT", "테우르기아", "총격", "근접", "방어", "특수 스킬", "ONE MORE", "아이템"];
const skillList_en = ["Skill1", "Skill2", "Skill3", "HIGHLIGHT", "Theurgy", "Gunshot", "Melee", "Defense", "Special Skill", "ONE MORE", "Item"];
const skillList_jp = ["スキル1", "スキル2", "スキル3", "HIGHLIGHT", "テウルギア", "銃撃", "近接攻撃", "ガード", "スペシャルスキル", "1more", "アイテム"];


// 페르소나 액티브 스킬 리스트
// "아기" : 1명의 적에게 공격력 106.2%의 화염 속성 대미지를 주고, 59.0%의 기본 확률로 적을 2턴 동안 화상 상태에 빠뜨린다.
// "아기라오" : 1명의 적에게 공격력 114.0%의 화염 속성 대미지를 주고, 63.3%의 기본 확률로 적을 2턴 동안 화상 상태에 빠뜨린다.


const personaSkillList = {
    "아기": {
        "name_jp": "アギ",
        "name_en": "Agi",
        "description": "1명의 적에게 공격력 106.2%/111.5%/116.8%의 화염 속성 대미지를 주고, 59.0%/62.0%/64.9%의 기본 확률로 적을 2턴 동안 화상 상태에 빠뜨린다.",
        "description_jp": "敵単体に攻撃力106.2%/111.5%/116.8%の火炎属性ダメージを与える。59.0%/62.0%/64.9%の確率で敵を２ターンの間、炎上状態にする。",
        "description_en": "Deal Fire damage to 1 foe equal to 106.2%/111.5%/116.8% of Attack. 59.0%/62.0%/64.9% chance to inflict Burn for 2 turns.",
        "type": "공격",
        "target": "단일",
        "icon": "화염"
    },
    "아기라오": {
        "name_jp": "アギラオ",
        "name_en": "Agilao",
        "description": "1명의 적에게 공격력 114.0%/119.7%/125.4%의 화염 속성 대미지를 주고, 63.3%/66.5%/69.6%의 기본 확률로 적을 2턴 동안 화상 상태에 빠뜨린다.",
        "description_jp": "敵単体に攻撃力114.0%/119.7%/125.4%の火炎属性ダメージを与える。63.3%/66.5%/69.6%の確率で敵を２ターンの間、炎上状態にする。",
        "description_en": "Deal Fire damage to 1 foe equal to 114.0%/119.7%/125.4% of Attack. 63.3%/66.5%/69.6% chance to inflict Burn for 2 turns.",
        "type": "공격",
        "target": "단일",
        "icon": "화염"
    },
    "아기다인": {
        "name_jp": "アギダイン",
        "name_en": "Agidyne",
        "description": "1명의 적에게 공격력 121.7%/127.8%/133.9%의 화염 속성 대미지를 주고, 67.6%/71.0%/74.4%의 기본 확률로 적을 2턴 동안 화상 상태에 빠뜨린다.",
        "description_jp": "敵単体に攻撃力121.7%/127.8%/133.9%の火炎属性ダメージを与える。67.6%/71.0%/74.4%の確率で敵を２ターンの間、炎上状態にする。",
        "description_en": "Deal Fire damage to 1 foe equal to 121.7%/127.8%/133.9% of Attack. 67.6%/71.0%/74.4% chance to inflict Burn for 2 turns.",
        "type": "공격",
        "target": "단일",
        "icon": "화염"
    },
    "마하라기": {
        "name_jp": "マハラギ",
        "name_en": "Maragi",
        "description": "모든 적에게 공격력 53.1%/55.8%/58.4%의 화염 속성 대미지를 주고, 29.5%/31.0%/32.4%의 기본 확률로 적을 2턴 동안 화상 상태에 빠뜨린다.",
        "description_jp": "敵全体に攻撃力53.1%/55.8%/58.4%の火炎属性ダメージを与える。29.5%/31.0%/32.4%の確率で敵を２ターンの間、炎上状態にする。",
        "description_en": "Deal Fire damage to all foes equal to 53.1%/55.8%/58.4% of Attack. 29.5%/31.0%/32.4% chance to inflict Burn for 2 turns.",
        "type": "공격",
        "target": "전체",
        "icon": "화염광역"
    },
    "마하라기온": {
        "name_jp": "マハラギオン",
        "name_en": "Maragion",
        "description": "모든 적에게 공격력 57.0%/59.8%/62.7%의 화염 속성 대미지를 주고, 31.7%/33.3%/34.9%의 기본 확률로 적을 2턴 동안 화상 상태에 빠뜨린다.",
        "description_jp": "敵全体に攻撃力57.0%/59.8%/62.7%の火炎属性ダメージを与える。31.7%/33.3%/34.9%の確率で敵を２ターンの間、炎上状態にする。",
        "description_en": "Deal Fire damage to all foes equal to 57.0%/59.8%/62.7% of Attack. 31.7%/33.3%/34.9% chance to inflict Burn for 2 turns.",
        "type": "공격",
        "target": "전체",
        "icon": "화염광역"
    },
    "마하라기다인": {
        "name_jp": "マハラギダイン",
        "name_en": "Maragidyne",
        "description": "모든 적에게 공격력 60.8%/63.8%/66.9%의 화염 속성 대미지를 주고, 33.8%/35.5%/37.2%의 기본 확률로 적을 2턴 동안 화상 상태에 빠뜨린다.",
        "description_jp": "敵全体に攻撃力60.8%/63.8%/66.9%の火炎属性ダメージを与える。33.8%/35.5%/37.2%の確率で敵を２ターンの間、炎上状態にする。",
        "description_en": "Deal Fire damage to all foes equal to 60.8%/63.8%/66.9% of Attack. 33.8%/35.5%/37.2% chance to inflict Burn for 2 turns.",
        "type": "공격",
        "target": "전체",
        "icon": "화염광역"
    },
    "부흐": {
        "name_jp": "ブフ",
        "name_en": "Bufu",
        "description": "1명의 적에게 공격력 106.2%/111.5%/116.8%의 빙결 속성 대미지를 주고, 59.0%/62.0%/64.9%의 기본 확률로 적을 2턴 동안 동결 상태에 빠뜨린다.",
        "description_jp": "敵単体に攻撃力106.2%/111.5%/116.8%の氷結属性ダメージを与える。59.0%/62.0%/64.9%の確率で敵を２ターンの間、凍結状態にする。",
        "description_en": "Deal Ice damage to 1 foe equal to 106.2%/111.5%/116.8% of Attack. 59.0%/62.0%/64.9% chance to inflict Freeze for 2 turns.",
        "type": "공격",
        "target": "단일",
        "icon": "빙결"
    },
    "부흐라": {
        "name_jp": "ブフーラ",
        "name_en": "Bufula",
        "description": "1명의 적에게 공격력 114.0%/119.7%/125.4%의 빙결 속성 대미지를 주고, 63.3%/66.5%/69.6%의 기본 확률로 적을 2턴 동안 동결 상태에 빠뜨린다.",
        "description_jp": "敵単体に攻撃力114.0%/119.7%/125.4%の氷結属性ダメージを与える。63.3%/66.5%/69.6%の確率で敵を２ターンの間、凍結状態にする。",
        "description_en": "Deal Ice damage to 1 foe equal to 114.0%/119.7%/125.4% of Attack. 63.3%/66.5%/69.6% chance to inflict Freeze for 2 turns.",
        "type": "공격",
        "target": "단일",
        "icon": "빙결"
    },
    "부흐다인": {
        "name_jp": "ブフダイン",
        "name_en": "Bufudyne",
        "description": "1명의 적에게 공격력 121.7%/127.8%/133.9%의 빙결 속성 대미지를 주고, 67.6%/71.0%/74.4%의 기본 확률로 적을 2턴 동안 동결 상태에 빠뜨린다.",
        "description_jp": "敵単体に攻撃力121.7%/127.8%/133.9%の氷結属性ダメージを与える。67.6%/71.0%/74.4%の確率で敵を２ターンの間、凍結状態にする。",
        "description_en": "Deal Ice damage to 1 foe equal to 121.7%/127.8%/133.9% of Attack. 67.6%/71.0%/74.4% chance to inflict Freeze for 2 turns.",
        "type": "공격",
        "target": "단일",
        "icon": "빙결"
    },
    "다이아의 별": {
        "name_jp": "ダイアモンドダスト",
        "name_en": "Diamond Dust",
        "description": "1명의 적에게 공격력 129.5%/136.0%/142.5%의 빙결 속성 대미지를 주고, 72.0%/75.6%/79.2%의 기본 확률로 적을 2턴 동안 동결 상태에 빠뜨린다.",
        "description_jp": "敵単体に攻撃力129.5%/136.0%/142.5%の氷結属性ダメージを与える。72.0%/75.6%/79.2%の確率で敵を２ターンの間、凍結状態にする。",
        "description_en": "Deal Ice damage to 1 foe equal to 129.5%/136.0%/142.5% of Attack. 72.0%/75.6%/79.2% chance to inflict Freeze for 2 turns.",
        "type": "공격",
        "target": "단일",
        "icon": "빙결"
    },
    "마하부흐": {
        "name_jp": "マハブフ",
        "name_en": "Mabufu",
        "description": "모든 적에게 공격력 53.1%/55.8%/58.4%의 빙결 속성 대미지를 주고, 29.5%/31.0%/32.4%의 기본 확률로 적을 2턴 동안 동결 상태에 빠뜨린다.",
        "description_jp": "敵全体に攻撃力53.1%/55.8%/58.4%の氷結属性ダメージを与える。29.5%/31.0%/32.4%の確率で敵を２ターンの間、凍結状態にする。",
        "description_en": "Deal Ice damage to all foes equal to 53.1%/55.8%/58.4% of Attack. 29.5%/31.0%/32.4% chance to inflict Freeze for 2 turns.",
        "type": "공격",
        "target": "전체",
        "icon": "빙결광역"
    },
    "마하부흐라": {
        "name_jp": "マハブフーラ",
        "name_en": "Mabufula",
        "description": "모든 적에게 공격력 57.0%/59.8%/62.7%의 빙결 속성 대미지를 주고, 31.7%/33.3%/34.9%의 기본 확률로 적을 2턴 동안 동결 상태에 빠뜨린다.",
        "description_jp": "敵全体に攻撃力57.0%/59.8%/62.7%の氷結属性ダメージを与える。31.7%/33.3%/34.9%の確率で敵を２ターンの間、凍結状態にする。",
        "description_en": "Deal Ice damage to all foes equal to 57.0%/59.8%/62.7% of Attack. 31.7%/33.3%/34.9% chance to inflict Freeze for 2 turns.",
        "type": "공격",
        "target": "전체",
        "icon": "빙결광역"
    },
    "마하부흐다인": {
        "name_jp": "マハブフダイン",
        "name_en": "Mabufudyne",
        "description": "모든 적에게 공격력 60.8%/63.8%/66.9%의 빙결 속성 대미지를 주고, 33.8%/35.5%/37.2%의 기본 확률로 적을 2턴 동안 동결 상태에 빠뜨린다.",
        "description_jp": "敵全体に攻撃力60.8%/63.8%/66.9%の氷結属性ダメージを与える。33.8%/35.5%/37.2%の確率で敵を２ターンの間、凍結状態にする。",
        "description_en": "Deal Ice damage to all foes equal to 60.8%/63.8%/66.9% of Attack. 33.8%/35.5%/37.2% chance to inflict Freeze for 2 turns.",
        "type": "공격",
        "target": "전체",
        "icon": "빙결광역"
    },
    "지오": {
        "name_jp": "ジオ",
        "name_en": "Zio",
        "description": "1명의 적에게 공격력 106.2%/111.5%/116.8%의 전격 속성 대미지를 주고, 59.0%/62.0%/64.9%의 기본 확률로 적을 2턴 동안 감전 상태에 빠뜨린다.",
        "description_jp": "敵単体に攻撃力106.2%/111.5%/116.8%の電撃属性ダメージを与える。59.0%/62.0%/64.9%の確率で敵を２ターンの間、感電状態にする。",
        "description_en": "Deal Electric damage to 1 foe equal to 106.2%/111.5%/116.8% of Attack. 59.0%/62.0%/64.9% chance to inflict Shock for 2 turns.",
        "type": "공격",
        "target": "단일",
        "icon": "전격"
    },
    "지온가": {
        "name_jp": "ジオンガ",
        "name_en": "Zionga",
        "description": "1명의 적에게 공격력 114.0%/119.7%/125.4%의 전격 속성 대미지를 주고, 63.3%/66.5%/69.6%의 기본 확률로 적을 2턴 동안 감전 상태에 빠뜨린다.",
        "description_jp": "敵単体に攻撃力114.0%/119.7%/125.4%の電撃属性ダメージを与える。63.3%/66.5%/69.6%の確率で敵を２ターンの間、感電状態にする。",
        "description_en": "Deal Electric damage to 1 foe equal to 114.0%/119.7%/125.4% of Attack. 63.3%/66.5%/69.6% chance to inflict Shock for 2 turns.",
        "type": "공격",
        "target": "단일",
        "icon": "전격"
    },
    "지오다인": {
        "name_jp": "ジオダイン",
        "name_en": "Ziodyne",
        "description": "1명의 적에게 공격력 121.7%/127.8%/133.9%의 전격 속성 대미지를 주고, 67.6%/71.0%/74.4%의 기본 확률로 적을 2턴 동안 감전 상태에 빠뜨린다.",
        "description_jp": "敵単体に攻撃力121.7%/127.8%/133.9%の電撃属性ダメージを与える。67.6%/71.0%/74.4%の確率で敵を２ターンの間、感電状態にする。",
        "description_en": "Deal Electric damage to 1 foe equal to 121.7%/127.8%/133.9% of Attack. 67.6%/71.0%/74.4% chance to inflict Shock for 2 turns.",
        "type": "공격",
        "target": "단일",
        "icon": "전격"
    },
    "마하지온가": {
        "name_jp": "マハジオンガ",
        "name_en": "Mazionga",
        "description": "모든 적에게 공격력 57.0%/59.8%/62.7%의 전격 속성 대미지를 주고, 31.7%/33.3%/34.9%의 기본 확률로 적을 2턴 동안 감전 상태에 빠뜨린다.",
        "description_jp": "敵全体に攻撃力57.0%/59.8%/62.7%の電撃属性ダメージを与える。31.7%/33.3%/34.9%の確率で敵を２ターンの間、感電状態にする。",
        "description_en": "Deal Electric damage to all foes equal to 57.0%/59.8%/62.7% of Attack. 31.7%/33.3%/34.9% chance to inflict Shock for 2 turns.",
        "type": "공격",
        "target": "전체",
        "icon": "전격광역"
    },
    "마하지오다인": {
        "name_jp": "マハジオダイン",
        "name_en": "Maziodyne",
        "description": "모든 적에게 공격력 60.8%/63.8%/66.9%의 전격 속성 대미지를 주고, 33.8%/35.5%/37.2%의 기본 확률로 적을 2턴 동안 감전 상태에 빠뜨린다.",
        "description_jp": "敵全体に攻撃力60.8%/63.8%/66.9%の電撃属性ダメージを与える。33.8%/35.5%/37.2%の確率で敵を２ターンの間、感電状態にする。",
        "description_en": "Deal Electric damage to all foes equal to 60.8%/63.8%/66.9% of Attack. 33.8%/35.5%/37.2% chance to inflict Shock for 2 turns.",
        "type": "공격",
        "target": "전체",
        "icon": "전격광역"
    },
    "엘 지하드": {
        "name_jp": "エル・ジハード",
        "name_en": "Wild Thunder",
        "description": "모든 적에게 공격력 64.8%/68.0%/71.3%의 전격 속성 대미지를 주고, 36.0%/37.8%/39.6%의 기본 확률로 적을 2턴 동안 감전 상태에 빠뜨린다.",
        "description_jp": "敵全体に攻撃力64.8%/68.0%/71.3%の電撃属性ダメージを与える。36.0%/37.8%/39.6%の確率で敵を２ターンの間、感電状態にする。",
        "description_en": "Deal Electric damage to all foes equal to 64.8%/68.0%/71.3% of Attack. 36.0%/37.8%/39.6% chance to inflict Shock for 2 turns.",
        "type": "공격",
        "target": "전체",
        "icon": "전격광역"
    },
    "갈": {
        "name_jp": "ガル",
        "name_en": "Garu",
        "description": "1명의 적에게 공격력 106.2%/111.5%/116.8%의 질풍 속성 대미지를 주고, 59.0%/62.0%/64.9%의 기본 확률로 적을 2턴 동안 풍습 상태에 빠뜨린다.",
        "description_jp": "敵単体に攻撃力106.2%/111.5%/116.8%の疾風属性ダメージを与える。59.0%/62.0%/64.9%の確率で敵を２ターンの間、風襲状態にする。",
        "description_en": "Deal Wind damage to 1 foe equal to 106.2%/111.5%/116.8% of Attack. 59.0%/62.0%/64.9% chance to inflict Windswept for 2 turns.",
        "type": "공격",
        "target": "단일",
        "icon": "질풍"
    },
    "갈라": {
        "name_jp": "ガルーラ",
        "name_en": "Garula",
        "description": "1명의 적에게 공격력 114.0%/119.7%/125.4%의 질풍 속성 대미지를 주고, 63.3%/66.5%/69.6%의 기본 확률로 적을 2턴 동안 풍습 상태에 빠뜨린다.",
        "description_jp": "敵単体に攻撃力114.0%/119.7%/125.4%の疾風属性ダメージを与える。63.3%/66.5%/69.6%の確率で敵を２ターンの間、風襲状態にする。",
        "description_en": "Deal Wind damage to 1 foe equal to 114.0%/119.7%/125.4% of Attack. 63.3%/66.5%/69.6% chance to inflict Windswept for 2 turns.",
        "type": "공격",
        "target": "단일",
        "icon": "질풍"
    },
    "갈다인": {
        "name_jp": "ガルダイン",
        "name_en": "Garudyne",
        "description": "1명의 적에게 공격력 121.7%/127.8%/133.9%의 질풍 속성 대미지를 주고, 67.6%/71.0%/74.4%의 기본 확률로 적을 2턴 동안 풍습 상태에 빠뜨린다.",
        "description_jp": "敵単体に攻撃力121.7%/127.8%/133.9%の疾風属性ダメージを与える。67.6%/71.0%/74.4%の確率で敵を２ターンの間、風襲状態にする。",
        "description_en": "Deal Wind damage to 1 foe equal to 121.7%/127.8%/133.9% of Attack. 67.6%/71.0%/74.4% chance to inflict Windswept for 2 turns.",
        "type": "공격",
        "target": "단일",
        "icon": "질풍"
    },
    "마하갈라": {
        "name_jp": "マハガルーラ",
        "name_en": "Magarula",
        "description": "모든 적에게 공격력 57.0%/59.8%/62.7%의 질풍 속성 대미지를 주고, 31.7%/33.3%/34.9%의 기본 확률로 적을 풍습 상태에 빠뜨린다. 2턴 동안 지속된다.",
        "description_jp": "敵全体に攻撃力57.0%/59.8%/62.7%の疾風属性ダメージを与える。31.7%/33.3%/34.9%の確率で敵を２ターンの間、風襲状態にする。",
        "description_en": "Deal Wind damage to all foes equal to 57.0%/59.8%/62.7% of Attack. 31.7%/33.3%/34.9% chance to inflict Windswept for 2 turns.",
        "type": "공격",
        "target": "전체",
        "icon": "질풍광역"
    },
    "마하갈다인": {
        "name_jp": "マハガルダイン",
        "name_en": "Magarudyne",
        "description": "모든 적에게 공격력 60.8%/63.8%/66.9%의 질풍 속성 대미지를 주고, 33.8%/35.5%/37.2%의 기본 확률로 적을 풍습 상태에 빠뜨린다. 2턴 동안 지속된다.",
        "description_jp": "敵全体に攻撃力60.8%/63.8%/66.9%の疾風属性ダメージを与える。33.8%/35.5%/37.2%の確率で敵を２ターンの間、風襲状態にする。",
        "description_en": "Deal Wind damage to all foes equal to 60.8%/63.8%/66.9% of Attack. 33.8%/35.5%/37.2% chance to inflict Windswept for 2 turns.",
        "type": "공격",
        "target": "전체",
        "icon": "질풍광역"
    },
    "사이오": {
        "name_jp": "サイオ",
        "name_en": "Psio",
        "description": "1명의 적에게 공격력 122.0%/126.9%/131.8%의 염동 속성 대미지를 주고, 정신 이상 상태의 적에게 TECHNICAL을 준다. 스킬 대미지는 40% 증가한다.",
        "description_jp": "敵単体に攻撃力122.0%/126.9%/131.8%の念動属性ダメージを与える。行動異常の敵に対してテクニカルが発生しダメージが４０%上昇する。",
        "description_en": "Deal Psy damage to 1 foe equal to 122.0%/126.9%/131.8% of Attack. Deal a Technical and increase damage by 40% for foes with a spiritual ailment.",
        "type": "공격",
        "target": "단일",
        "icon": "염동"
    },
    "사이다인": {
        "name_jp": "サイダイン",
        "name_en": "Psiodyne",
        "description": "1명의 적에게 공격력 130.5%/136.4%/142.3%의 염동 속성 대미지를 주고, 정신 이상 상태의 적에게 TECHNICAL을 준다. 스킬 대미지는 45% 증가한다.",
        "description_jp": "敵単体に攻撃力130.5%/136.4%/142.3%の念動属性ダメージを与える。行動異常の敵に対してテクニカルが発生しダメージが４５%上昇する。",
        "description_en": "Deal Psy damage to 1 foe equal to 130.5%/136.4%/142.3% of Attack. Deal a Technical and increase damage by 45% for foes with a spiritual ailment.",
        "type": "공격",
        "target": "단일",
        "icon": "염동"
    },
    "사이코키네시스": {
        "name_jp": "サイコキネシス",
        "name_en": "Psychokinesis",
        "description": "1명의 적에게 공격력 138.9%/145.9%/152.9%의 염동 속성 대미지를 주고, 정신 이상 상태의 적에게 TECHNICAL을 준다. 스킬 대미지는 50% 증가한다.",
        "description_jp": "敵単体に攻撃力138.9%/145.9%/152.9%の念動属性ダメージを与える。行動異常の敵に対してテクニカルが発生しダメージが５０%上昇する。",
        "description_en": "Deal Psy damage to 1 foe equal to 138.9%/145.9%/152.9% of Attack. Deal a Technical and increase damage by 50% for foes with a spiritual ailment.",
        "type": "공격",
        "target": "단일",
        "icon": "염동"
    },
    "마하사이": {
        "name_jp": "マハサイ",
        "name_en": "Mapsi",
        "description": "모든 적에게 공격력 61.4%/63.4%/65.4%의 염동 속성 대미지를 주고, 정신 이상 상태의 적에게 TECHNICAL을 준다. 스킬 대미지는 35% 증가한다.",
        "description_jp": "敵全体に攻撃力61.4%/63.4%/65.4%の念動属性ダメージを与える。行動異常の敵に対してテクニカルが発生しダメージが３５%上昇する。",
        "description_en": "Deal Psy damage to all foes equal to 61.4%/63.4%/65.4% of Attack. Deal a Technical and increase damage by 35% for foes with a spiritual ailment.",
        "type": "공격",
        "target": "전체",
        "icon": "염동광역"
    },
    "마하사이오": {
        "name_jp": "マハサイオ",
        "name_en": "Mapsio",
        "description": "모든 적에게 공격력 66.4%/68.8%/71.2%의 염동 속성 대미지를 주고, 정신 이상 상태의 적에게 TECHNICAL을 준다. 스킬 대미지는 40% 증가한다.",
        "description_jp": "敵全体に攻撃力66.4%/68.8%/71.2%の念動属性ダメージを与える。行動異常の敵に対してテクニカルが発生しダメージが４０%上昇する。",
        "description_en": "Deal Psy damage to all foes equal to 66.4%/68.8%/71.2% of Attack. Deal a Technical and increase damage by 40% for foes with a spiritual ailment.",
        "type": "공격",
        "target": "전체",
        "icon": "염동광역"
    },
    "마하사이다인": {
        "name_jp": "マハサイダイン",
        "name_en": "Mapsiodyne",
        "description": "모든 적에게 공격력 72.3%/75.3%/78.3%의 염동 속성 대미지를 주고, 정신 이상 상태의 적에게 TECHNICAL을 준다. 스킬 대미지는 45% 증가한다.",
        "description_jp": "敵全体に攻撃力72.3%/75.3%/78.3%の念動属性ダメージを与える。行動異常の敵に対してテクニカルが発生しダメージが４５%上昇する。",
        "description_en": "Deal Psy damage to all foes equal to 72.3%/75.3%/78.3% of Attack. Deal a Technical and increase damage by 45% for foes with a spiritual ailment.",
        "type": "공격",
        "target": "전체",
        "icon": "염동광역"
    },
    "사이코 포스": {
        "name_jp": "サイコフォース",
        "name_en": "Psycho Force",
        "description": "모든 적에게 공격력 77.1%/80.6%/84.1%의 염동 속성 대미지를 주고, 정신 이상 상태의 적에게 TECHNICAL을 준다. 스킬 대미지는 50% 증가한다.",
        "description_jp": "敵全体に攻撃力77.1%/80.6%/84.1%の念動属性ダメージを与える。行動異常の敵に対してテクニカルが発生しダメージが５０%上昇する。",
        "description_en": "Deal Psy damage to all foes equal to 77.1%/80.6%/84.1% of Attack. Deal a Technical and increase damage by 50% for foes with a spiritual ailment.",
        "type": "공격",
        "target": "전체",
        "icon": "염동광역"
    },
    "프레이": {
        "name_jp": "フレイ",
        "name_en": "Frei",
        "description": "1명의 적에게 공격력 114.8%/118.7%/122.6%의 핵열 속성 대미지를 주고, 원소 이상 상태의 적에게 TECHNICAL을 준다. 스킬 대미지는 16% 증가한다.",
        "description_jp": "敵単体に攻撃力114.8%/118.7%/122.6%の核熱属性ダメージを与える。属性異常の敵に対してテクニカルが発生しダメージが１６%上昇する。",
        "description_en": "Deal Nuclear damage to 1 foe equal to 114.8%/118.7%/122.6% of Attack. Deal a Technical and increase damage by 16% for foes with an elemental ailment.",
        "type": "공격",
        "target": "단일",
        "icon": "핵열"
    },
    "프레이라": {
        "name_jp": "フレイラ",
        "name_en": "Freila",
        "description": "1명의 적에게 공격력 124.2%/129.1%/134.0%의 핵열 속성 대미지를 주고, 원소 이상 상태의 적에게 TECHNICAL을 준다. 스킬 대미지는 18% 증가한다.",
        "description_jp": "敵単体に攻撃力124.2%/129.1%/134.0%の核熱属性ダメージを与える。属性異常の敵に対してテクニカルが発生しダメージが１８%上昇する。",
        "description_en": "Deal Nuclear damage to 1 foe equal to 124.2%/129.1%/134.0% of Attack. Deal a Technical and increase damage by 18% for foes with an elemental ailment.",
        "type": "공격",
        "target": "단일",
        "icon": "핵열"
    },
    "마하프레이라": {
        "name_jp": "マハフレイラ",
        "name_en": "Mafreila",
        "description": "모든 적에게 공격력 61.8%/64.2%/66.6%의 핵열 속성 대미지를 주고, 원소 이상 상태의 적에게 TECHNICAL을 준다. 스킬 대미지는 18% 증가한다.",
        "description_jp": "敵全体に攻撃力61.8%/64.2%/66.6%の核熱属性ダメージを与える。属性異常の敵に対してテクニカルが発生しダメージが１８%上昇する。",
        "description_en": "Deal Nuclear damage to all foes equal to 61.8%/64.2%/66.6% of Attack. Deal a Technical and increase damage by 18% for foes with an elemental ailment.",
        "type": "공격",
        "target": "전체",
        "icon": "핵열광역"
    },
    "코즈믹 플레어": {
        "name_jp": "コズミックフレア",
        "name_en": "Cosmic Flare",
        "description": "모든 적에게 공격력 71.1%/74.6%/78.1%의 핵열 속성 대미지를 주고, 원소 이상 상태의 적에게 TECHNICAL을 준다. 스킬 대미지는 22% 증가한다.",
        "description_jp": "敵全体に攻撃力71.1%/74.6%/78.1%の核熱属性ダメージを与える。属性異常の敵に対してテクニカルが発生しダメージが２２%上昇する。",
        "description_en": "Deal Nuclear damage to all foes equal to 71.1%/74.6%/78.1% of Attack. Deal a Technical and increase damage by 22% for foes with an elemental ailment.",
        "type": "공격",
        "target": "전체",
        "icon": "핵열광역"
    },
    "코우가": {
        "name_jp": "コウガ",
        "name_en": "Kouga",
        "description": "1명의 적에게 공격력 123.2%/130.7%/138.2%의 축복 속성 대미지를 주고, 자신은 축복 효과 1~2개를 획득한다.",
        "description_jp": "敵単体に攻撃力123.2%/130.7%/138.2%の祝福属性ダメージを与える。自身に１～２つの祝印を獲得する。",
        "description_en": "Deal Bless damage to 1 foe equal to 123.2%/130.7%/138.2% of Attack. Gain 1 to 2 Blessing stacks.",
        "type": "공격",
        "target": "단일",
        "icon": "축복"
    },
    "코우가온": {
        "name_jp": "コウガオン",
        "name_en": "Kougaon",
        "description": "1명의 적에게 공격력 130.8%/139.1%/147.4%의 축복 속성 대미지를 주고, 자신은 축복 효과 1~2개를 획득한다.",
        "description_jp": "敵単体に攻撃力130.8%/139.1%/147.4%の祝福属性ダメージを与える。自身に１～２つの祝印を獲得する。",
        "description_en": "Deal Bless damage to 1 foe equal to 130.8%/139.1%/147.4% of Attack. Gain 1 to 2 Blessing stacks.",
        "type": "공격",
        "target": "단일",
        "icon": "축복"
    },
    "신의 심판": {
        "name_jp": "神の審判",
        "name_en": "Divine Judgment",
        "description": "1명의 적에게 공격력 140.0%/149.3%/158.6%의 축복 속성 대미지를 주고, 자신은 축복 효과 2개를 획득한다.",
        "description_jp": "敵単体に攻撃力140.0%/149.3%/158.6%の祝福属性ダメージを与える。自身に２つの祝印を獲得する。",
        "description_en": "Deal Bless damage to 1 foe equal to 140.0%/149.3%/158.6% of Attack. Gain 2 Blessing stacks.",
        "type": "공격",
        "target": "단일",
        "icon": "축복"
    },
    "마하코우하": {
        "name_jp": "マハコウハ",
        "name_en": "Makouga",
        "description": "모든 적에게 공격력 57.6%/60.9%/64.2%의 축복 속성 대미지를 주고, 자신은 축복 효과 0~1개를 획득한다.",
        "description_jp": "敵全体に攻撃力57.6%/60.9%/64.2%の祝福属性ダメージを与える。自身に０～１つの祝印を獲得する。",
        "description_en": "Deal Bless damage to all foes equal to 57.6%/60.9%/64.2% of Attack. Gain 0 to 1 Blessing stacks.",
        "type": "공격",
        "target": "전체",
        "icon": "축복광역"
    },
    "마하코우가": {
        "name_jp": "マハコウガ",
        "name_en": "Makouga",
        "description": "모든 적에게 공격력 61.3%/65.0%/68.7%의 축복 속성 대미지를 주고, 자신은 축복 효과 1~2개를 획득한다.",
        "description_jp": "敵全体に攻撃力61.3%/65.0%/68.7%の祝福属性ダメージを与える。自身に１～２つの祝印を獲得する。",
        "description_en": "Deal Bless damage to all foes equal to 61.3%/65.0%/68.7% of Attack. Gain 1 to 2 Blessing stacks.",
        "type": "공격",
        "target": "전체",
        "icon": "축복광역"
    },
    "마하코우가온": {
        "name_jp": "マハコウガオン",
        "name_en": "Makougaon",
        "description": "모든 적에게 공격력 65.8%/70.0%/74.2%의 축복 속성 대미지를 주고, 자신은 축복 효과 1~2개를 획득한다.",
        "description_jp": "敵全体に攻撃力65.8%/70.0%/74.2%の祝福属性ダメージを与える。自身に１～２つの祝印を獲得する。",
        "description_en": "Deal Bless damage to all foes equal to 65.8%/70.0%/74.2% of Attack. Gain 1 to 2 Blessing stacks.",
        "type": "공격",
        "target": "전체",
        "icon": "축복광역"
    },
    "흑백무계": {
        "name_jp": "生命欲の輝弾",
        "name_en": "Seize the Day",
        "description": "모든 적에게 공격력 78.8%/85.9%/93.0%의 축복 속성 대미지를 주고, 생명이 가장 낮은 동료 1명이 공격력 15.8%/17.2%/18.6%+478/614/765의 생명을 회복한다.",
        "description_jp": "敵全体に攻撃力78.8%/85.9%/93.0%の祝福属性ダメージを与える。残りのＨＰが一番低い味方のＨＰを攻撃力15.8%/17.2%/18.6%＋478/614/765回復する。",
        "description_en": "Deal Bless damage to all foes equal to 78.8%/85.9%/93.0% of Attack. Restore HP of the ally with the lowest remaining HP, equal to 15.8%/17.2%/18.6% of Attack + 478/614/765.",
        "type": "공격",
        "target": "전체",
        "icon": "축복광역"
    },
    "하마온": {
        "name_en": "Hamaon",
        "name_jp": "ハマオン",
        "description": "1명의 적에게 공격력 90.6%/99.3%/108.0%의 축복 속성 대미지를 주고, 생명이 50% 이하인 적에게 낮은 확률의 축복 속성 즉사 효과를 추가하며 생명이 낮을수록 확률이 높아진다.",
        "description_en": "Deal Bless damage to 1 foe equal to 90.6%/99.3%/108.0% of Attack. Low chance to deal a Bless insta-kill effect to foes with 50% or less HP. Increase chance based on foe's missing HP.",
        "description_jp": "敵単体に攻撃力90.6%/99.3%/108.0%の祝福属性ダメージを与える。ＨＰ５０%以下の敵に低確率で祝福属性の即死効果を与える。敵のＨＰが低いほど確率が上がる。",
        "type": "공격",
        "target": "단일",
        "icon": "축복"
    },
    "마한마": {
        "name_en": "Mahama",
        "name_jp": "マハンマ",
        "description": "모든 적에게 공격력 39.9%/44.0%/48.1%의 축복 속성 대미지를 주고, 생명이 50% 이하인 적에게 낮은 확률로 축복 속성 즉사 효과를 추가하며 생명이 낮을수록 확률이 높아진다.",
        "description_en": "Deal Bless damage to all foes equal to 39.9%/44.0%/48.1% of Attack. Low chance to deal a Bless insta-kill effect to foes with 50% or less HP. Increase chance based on foe's missing HP.",
        "description_jp": "敵全体に攻撃力39.9%/44.0%/48.1%の祝福属性ダメージを与える。ＨＰ５０%以下の敵に低確率で祝福属性の即死効果を与える。敵のＨＰが低いほど確率が上がる。",
        "type": "공격",
        "target": "전체",
        "icon": "축복광역"
    },
    "마한마온": {
        "name_en": "Mahamaon",
        "name_jp": "マハンマオン",
        "description": "모든 적에게 45.0%의 축복 속성 대미지를 주고, 생명이 50% 이하인 적에게 낮은 확률로 축복 속성 즉사 효과를 부여하며 생명이 낮을수록 확률이 높아진다.",
        "description_en": "Deals 45.0% ATK Bless damage to all foes with a chance of Instant Death to foes under 50% HP. The lower the HP, the higher the chance.",
        "description_jp": "敵全体に攻撃力45.0%の祝福属性ダメージを与える。HP 50%以下の敵に低確率で祝福属性の即死効果を与える。敵のHPが低いほど確率が上がる。",
        "type": "공격",
        "target": "전체",
        "icon": "축복광역"
    },
    "에이가온": {
        "name_jp": "エイガオン",
        "name_en": "Eigaon",
        "description": "1명의 적에게 공격력 132.5%/140.8%/149.1%의 주원 속성 대미지를 주고, 적이 주원 효과 1~2개를 획득한다.",
        "description_jp": "敵単体に攻撃力132.5%/140.8%/149.1%の呪怨属性ダメージを与える。敵に１～２つの呪印を付与する。",
        "description_en": "Deal Curse damage to 1 foe equal to 132.5%/140.8%/149.1% of Attack. Inflict 1 to 2 Curse stacks on the foe.",
        "type": "공격",
        "target": "단일",
        "icon": "주원"
    },
    "악마의 심판": {
        "name_jp": "悪魔の審判",
        "name_en": "Demonic Decree",
        "description": "1명의 적에게 공격력 142.5%/151.8%/161.1%의 주원 속성 대미지를 주고, 적이 주원 효과 2개를 획득한다.",
        "description_jp": "敵単体に攻撃力142.5%/151.8%/161.1%の呪怨属性ダメージを与える。敵に２つの呪印を付与する。",
        "description_en": "Deal Curse damage to 1 foe equal to 142.5%/151.8%/161.1% of Attack. Inflict 2 Curse stacks on the foe.",
        "type": "공격",
        "target": "단일",
        "icon": "주원"
    },
    "마하에이가": {
        "name_jp": "マハエイガ",
        "name_en": "Maeiga",
        "description": "모든 적에게 공격력 61.8%/65.5%/69.2%의 주원 속성 대미지를 주고, 일정 확률로 적에게 주원 효과 1개를 추가한다.",
        "description_jp": "敵全体に攻撃力61.8%/65.5%/69.2%の呪怨属性ダメージを与える。一定の確率で敵に１つの呪印を付与する。",
        "description_en": "Deal Curse damage to all foes equal to 61.8%/65.5%/69.2% of Attack. Chance to inflict 1 Curse stack on foes.",
        "type": "공격",
        "target": "전체",
        "icon": "주원광역"
    },
    "마하에이가온": {
        "name_jp": "マハエイガオン",
        "name_en": "Maeigaon",
        "description": "모든 적에게 공격력 66.5%/70.7%/74.9%의 주원 속성 대미지를 주고, 일정 확률로 적이 주원 효과 1개를 획득한다.",
        "description_jp": "敵全体に攻撃力66.5%/70.7%/74.9%の呪怨属性ダメージを与える。一定の確率で敵に１つの呪印を付与する。",
        "description_en": "Deal Curse damage to all foes equal to 66.5%/70.7%/74.9% of Attack. Chance to inflict 1 Curse stack on foes.",
        "type": "공격",
        "target": "전체",
        "icon": "주원광역"
    },
    "연옥의 날개": {
        "name_jp": "煉獄の翼",
        "name_en": "Abyssal Wings",
        "description": "모든 적에게 공격력 71.0%/75.6%/80.2%의 주원 속성 대미지를 주고, 적이 주원 효과 1개를 획득한다.",
        "description_jp": "敵全体に攻撃力66.5%/70.7%/74.9%の呪怨属性ダメージを与える。一定の確率で敵に１つの呪印を付与する。",
        "description_en": "Deal Curse damage to all foes equal to 66.5%/70.7%/74.9% of Attack. Chance to inflict 1 Curse stack on foes.",
        "type": "공격",
        "target": "전체",
        "icon": "주원광역"
    },
    "무드": {
        "name_jp": "ムド",
        "name_en": "Mudo",
        "description": "1명의 적에게 공격력 79.2%/87.3%/95.4%의 주원 속성 대미지를 주고, 생명이 50% 이하인 적에게 낮은 확률로 주원 속성 즉사 효과를 추가하며 생명이 낮을수록 확률이 높아진다.",
        "description_en": "Deal Curse damage to 1 foe equal to 79.2%/87.3%/95.4% of Attack. Low chance to deal Curse insta-kill effect to foes with 50% or less HP. Increase chance based on foe's missing HP.",
        "description_jp": "敵単体に攻撃力79.2%/87.3%/95.4%の呪怨属性ダメージを与える。ＨＰ５０%以下の敵に低確率で呪怨属性の即死効果を与える。敵のＨＰが低いほど確率が上がる。",
        "type": "공격",
        "target": "단일",
        "icon": "주원"
    },
    "무드온": {
        "name_jp": "ムドオン",
        "name_en": "Mudoon",
        "description": "1명의 적에게 공격력 90.6%/99.3%/108.0%의 주원 속성 대미지를 주고, 생명이 50% 이하인 적에게 낮은 확률로 주원 속성 즉사 효과를 추가하며 생명이 낮을수록 확률이 높아진다.",
        "description_en": "Deal Curse damage to 1 foe equal to 90.6%/99.3%/108.0% of Attack. Low chance to deal Curse insta-kill effect to foes with 50% or less HP. Increase chance based on foe's missing HP.",
        "description_jp": "敵単体に攻撃力90.6%/99.3%/108.0%の呪怨属性ダメージを与える。ＨＰ５０%以下の敵に低確率で呪怨属性の即死効果を与える。敵のＨＰが低いほど確率が上がる。",
        "type": "공격",
        "target": "단일",
        "icon": "주원"
    },
    "마하무드": {
        "name_jp": "マハムド",
        "name_en": "Mamudo",
        "description": "모든 적에게 공격력 39.9%/44.0%/48.1%의 주원 속성 대미지를 주고, 생명이 50% 이하인 적에게 낮은 확률의 주원 속성 즉사 효과를 추가하며 생명이 낮을수록 확률이 높아진다.",
        "description_en": "Deal Curse damage to all foes equal to 39.9%/44.0%/48.1% of Attack. Low chance to deal Curse insta-kill effect to foes with 50% or less HP. Increase chance based on foe's missing HP.",
        "description_jp": "敵全体に攻撃力39.9%/44.0%/48.1%の呪怨属性ダメージを与える。ＨＰ５０%以下の敵に低確率で呪怨属性の即死効果を与える。敵のＨＰが低いほど確率が上がる。",
        "type": "공격",
        "target": "전체",
        "icon": "주원광역"
    },
    "마하무드온": {
        "name_jp": "マハムドオン",
        "name_en": "Mamudoon",
        "description": "모든 적에게 공격력 44.4%/49.5%/54.6%의 주원 속성 대미지를 주고, 생명이 50% 이하인 적에게 낮은 확률의 주원 속성 즉사 효과를 추가하며 생명이 낮을수록 확률이 높아진다.",
        "description_en": "Deal Curse damage to all foes equal to 44.4%/49.5%/54.6% of Attack. Low chance to deal Curse insta-kill effect to foes with 50% or less HP. Increase chance based on foe's missing HP.",
        "description_jp": "敵全体に攻撃力44.4%/49.5%/54.6%の呪怨属性ダメージを与える。ＨＰ５０%以下の敵に低確率で呪怨属性の即死効果を与える。敵のＨＰが低いほど確率が上がる。",
        "type": "공격",
        "target": "전체",
        "icon": "주원광역"
    },
    "메기도": {
        "name_jp": "メギド",
        "name_en": "Megido",
        "description": "1명의 적에게 공격력 81.4%/85.5%/89.5%의 만능 속성 대미지를 주고, 적의 방어력을 무시한다.",
        "description_en": "Deal Almighty damage to 1 foe equal to 81.4%/85.5%/89.5% of Attack, ignoring their Defense.",
        "description_jp": "敵単体に防御力無視の攻撃力81.4%/85.5%/89.5%の万能属性ダメージを与える。",
        "type": "공격",
        "target": "단일",
        "icon": "만능"
    },
    "마하메기도": {
        "name_jp": "マハメギド",
        "name_en": "Mamegido",
        "description": "모든 적에게 공격력 40.7%/42.7%/44.8%의 만능 속성 대미지를 주고, 적의 방어력을 무시한다.",
        "description_en": "Deal Almighty damage to all foes equal to 40.7%/42.7%/44.8% of Attack, ignoring their defense.",
        "description_jp": "敵全体に防御力無視の攻撃力40.7%/42.7%/44.8%の万能属性ダメージを与える。",
        "type": "공격",
        "target": "전체",
        "icon": "만능광역"
    },
    "메기도라온": {
        "name_jp": "メギドラオン",
        "name_en": "Megidolaon",
        "description": "모든 적에게 공격력 43.5%/45.7%/47.8%의 만능 속성 대미지를 주고, 적의 방어력을 무시한다.",
        "description_en": "Deal Almighty damage to all foes equal to 43.5%/45.7%/47.8% of Attack, ignoring their defense.",
        "description_jp": "敵全体に防御力無視の攻撃力43.5%/45.7%/47.8%の万能属性ダメージを与える。",
        "type": "공격",
        "target": "전체",
        "icon": "만능광역"
    },
    "흡혈": {
        "name_jp": "吸血",
        "name_en": "Life Drain",
        "description": "1명의 적에게 공격력 41.4%/43.5%/45.5%의 만능 대미지를 주고 방어력을 무시하며, 자신은 생명을 공격력 41.4%/43.5%/45.5%만큼 회복한다.",
        "description_en": "Deal Almighty damage to 1 foe equal to 41.4%/43.5%/45.5% of Attack, ignoring their Defense. Restore user's HP equal to 41.4%/43.5%/45.5% of Attack.",
        "description_jp": "敵単体に防御力無視の攻撃力41.4%/43.5%/45.5%の万能属性ダメージを与える。さらに自身は攻撃力41.4%/43.5%/45.5%のＨＰを回復する。",
        "type": "공격",
        "target": "단일",
        "icon": "만능"
    },
    "흡마": {
        "name_jp": "吸魔",
        "name_en": "Spirit Drain",
        "description": "적 1명의 SP 25/26/27포인트를 흡수한다.",
        "description_en": "Drain 25/26/27 SP from 1 foe.",
        "description_jp": "敵単体から25/26/27のＳＰを吸収する。",
        "type": "지원",
        "target": "단일",
        "icon": "만능"
    },
    "돌격": {
        "name_jp": "突撃",
        "name_en": "Lunge",
        "description": "1명의 적에게 공격력 116.4%/122.2%/128.0%의 물리 속성 대미지를 준다.",
        "description_en": "Deal Physical damage to 1 foe equal to 116.4%/122.2%/128.0% of Attack.",
        "description_jp": "敵単体に攻撃力116.4%/122.2%/128.0%の物理属性ダメージを与える。",
        "type": "공격",
        "target": "단일",
        "icon": "물리"
    },
    "참격": {
        "name_jp": "斬撃",
        "name_en": "Cleave",
        "description": "1명의 적에게 공격력 116.4%/122.2%/128.0%의 물리 속성 대미지를 준다.",
        "description_en": "Deal Physical damage to 1 foe equal to 116.4%/122.2%/128.0% of Attack.",
        "description_jp": "敵単体に攻撃力116.4%/122.2%/128.0%の物理属性ダメージを与える。",
        "type": "공격",
        "target": "단일",
        "icon": "물리"
    },
    "빅 슬라이스": {
        "name_jp": "ビッグスライス",
        "name_en": "Giant Slice",
        "description": "1명의 적에게 공격력 129.1%/135.6%/142.0%의 물리 속성 대미지를 준다.",
        "description_en": "Deal Physical damage to 1 foe equal to 129.1%/135.6%/142.0% of Attack.",
        "description_jp": "敵単体に攻撃力129.1%/135.6%/142.0%の物理属性ダメージを与える。",
        "type": "공격",
        "target": "단일",
        "icon": "물리"
    },
    "궁서아": {
        "name_jp": "弓射",
        "name_en": "Cornered Fang",
        "description": "1명의 적에게 공격력 129.1%/135.6%/142.0%의 물리 속성 대미지를 준다.",
        "description_en": "Deal Physical damage to 1 foe equal to 129.1%/135.6%/142.0% of Attack.",
        "description_jp": "敵単体に攻撃力129.1%/135.6%/142.0%の物理属性ダメージを与える。",
        "type": "공격",
        "target": "단일",
        "icon": "물리"
    },
    "이연아": {
        "name_jp": "二連矢",
        "name_en": "Double Fang",
        "description": "1명의 적에게 공격력 58.2%/61.1%/64.0%의 물리 속성 대미지를 2회 준다.",
        "description_en": "Deal Physical damage to 1 foe equal to 58.2%/61.1%/64.0% of Attack (2 hits).",
        "description_jp": "敵単体に攻撃力58.2%/61.1%/64.0%の物理属性ダメージを２回与える。",
        "type": "공격",
        "target": "단일",
        "icon": "물리"
    },
    "어설트 다이브": {
        "name_jp": "アサルトダイブ",
        "name_en": "Assault Dive",
        "description": "1명의 적에게 공격력 141.8%/148.9%/156.0%의 물리 속성 대미지를 준다.",
        "description_en": "Deal Physical damage to 1 foe equal to 141.8%/148.9%/156.0% of Attack.",
        "description_jp": "敵単体に攻撃力141.8%/148.9%/156.0%の物理属性ダメージを与える。",
        "type": "공격",
        "target": "단일",
        "icon": "물리"
    },
    "럭키 펀치": {
        "name_jp": "ラッキーパンチ",
        "name_en": "Lucky Punch",
        "description": "1명의 적에게 공격력 108.3%/113.7%/119.1%의 물리 속성 대미지를 주고, 크리티컬 확률이 20% 증가하며 명중률은 20% 감소한다.",
        "description_en": "Deal Physical damage to 1 foe equal to 108.3%/113.7%/119.1%  of Attack. Increase critical rate by 20%, and decrease accuracy by 20%.",
        "description_jp": "敵単体に攻撃力108.3%/113.7%/119.1%の物理属性ダメージを与える。クリティカル率が２０%上昇し、命中率が２０%低下する。",
        "type": "공격",
        "target": "단일",
        "icon": "물리"
    },
    "장대비 베기": {
        "name_jp": "五月雨斬り",
        "name_en": "Tempest Slash",
        "description": "1명의 적에게 공격력 36.9%/38.7%/40.6%의 물리 속성 대미지를 3~5회 준다.",
        "description_en": "Deal Physical damage to 1 foe equal to 36.9%/38.7%/40.6% of Attack (3 to 5 hits).",
        "description_jp": "敵単体に攻撃力36.9%/38.7%/40.6%の物理属性ダメージを３～５回与える。",
        "type": "공격",
        "target": "단일",
        "icon": "물리"
    },
    "메가톤 레이드": {
        "name_jp": "メガトンレイド",
        "name_en": "Megaton Raid",
        "description": "1명의 적에게 공격력 154.5%/162.2%/170.0%의 물리 속성 대미지를 준다.",
        "description_en": "Deal Physical damage to 1 foe equal to 154.5%/162.2%/170.0% of Attack.",
        "description_jp": "敵単体に攻撃力154.5%/162.2%/170.0%の物理属性ダメージを与える。",
        "type": "공격",
        "target": "단일",
        "icon": "물리"
    },
    "검의 춤": {
        "name_jp": "剣の舞",
        "name_en": "Sword Dance",
        "description": "1명의 적에게 공격력 154.5%/162.2%/170.0%의 물리 속성 대미지를 준다.",
        "description_en": "Deal Physical damage to 1 foe equal to 154.5%/162.2%/170.0% of Attack.",
        "description_jp": "敵単体に攻撃力154.5%/162.2%/170.0%の物理属性ダメージを与える。",
        "type": "공격",
        "target": "단일",
        "icon": "물리"
    },
    "브레이브 재퍼": {
        "name_jp": "ブレイブザッパー",
        "name_en": "Brave Blade",
        "description": "1명의 적에게 공격력 154.5%/162.2%/170.0%의 물리 속성 대미지를 준다.",
        "description_en": "Deal Physical damage to 1 foe equal to 154.5%/162.2%/170.0% of Attack.",
        "description_jp": "敵単体に攻撃力154.5%/162.2%/170.0%の物理属性ダメージを与える。",
        "type": "공격",
        "target": "단일",
        "icon": "물리"
    },
    "사망유희": {
        "name_jp": "死亡遊戯",
        "name_en": "Deadly Fury",
        "description": "1명의 적에게 공격력 154.5%/162.2%/170.0%의 물리 속성 대미지를 준다.",
        "description_en": "Deal Physical damage to 1 foe equal to 154.5%/162.2%/170.0% of Attack.",
        "description_jp": "敵単体に攻撃力154.5%/162.2%/170.0%の物理属性ダメージを与える。",
        "type": "공격",
        "target": "단일",
        "icon": "물리"
    },
    "젠틀 펀치": {
        "name_jp": "ラッキーパンチ",
        "name_en": "Lucky Punch",
        "description": "1명의 적에게 공격력 108.3%/113.7%/119.1%의 물리 속성 대미지를 주고, 크리티컬 확률이 20% 증가하며 명중률은 20% 감소한다.",
        "description_en": "Deal Physical damage to 1 foe equal to 108.3%/113.7%/119.1%  of Attack. Increase critical rate by 20%, and decrease accuracy by 20%.",
        "description_jp": "敵単体に攻撃力108.3%/113.7%/119.1%の物理属性ダメージを与える。クリティカル率が２０%上昇し、命中率が２０%低下する。",
        "type": "공격",
        "target": "단일",
        "icon": "물리"
    },
    "전광석화": {
        "name_jp": "電光石火",
        "name_en": "Swift Strike",
        "description": "모든 적에게 공격력 15.2%/16.0%/16.7%의 물리 속성 대미지를 3~4회 준다.",
        "description_en": "Deal Physical damage to all foes equal to 15.2%/16.0%/16.7% of Attack (3 to 4 hits).",
        "description_jp": "敵全体に攻撃力15.2%/16.0%/16.7%の物理属性ダメージを３～４回与える。",
        "type": "공격",
        "target": "전체",
        "icon": "물리광역"
    },
    "난동 부리기": {
        "name_jp": "暴れまくり",
        "name_en": "Rampage",
        "description": "모든 적에게 공격력 30.0%/31.5%/33.0%의 물리 속성 대미지를 1~3회 준다.",
        "description_en": "Deal Physical damage to all foes equal to 30.0%/31.5%/33.0% of Attack (1 to 3 hits).",
        "description_jp": "敵全体に攻撃力30.0%/31.5%/33.0%の物理属性ダメージを１～３回与える。",
        "type": "공격",
        "target": "전체",
        "icon": "물리광역"
    },
    "히트 웨이브": {
        "name_jp": "ヒートウェイブ",
        "name_en": "Heat Wave",
        "description": "모든 적에게 공격력 60.8%/63.8%/66.9%의 물리 속성 대미지를 준다.",
        "description_en": "Deal Physical damage to all foes equal to 60.8%/63.8%/66.9% of Attack.",
        "description_jp": "敵全体に攻撃力60.8%/63.8%/66.9%の物理属性ダメージを与える。",
        "type": "공격",
        "target": "전체",
        "icon": "물리광역"
    },
    "데스바운드": {
        "name_jp": "デスバウンド",
        "name_en": "Deathbound",
        "description": "모든 적에게 공격력 40.6%/42.6%/44.7%의 물리 속성 대미지를 1~2회 준다.",
        "description_en": "Deal Physical damage to all foes equal to 40.6%/42.6%/44.7% of Attack (1 to 2 hits).",
        "description_jp": "敵全体に攻撃力40.6%/42.6%/44.7%の物理属性ダメージを１～２回与える。",
        "type": "공격",
        "target": "전체",
        "icon": "물리광역"
    },
    "폴 다운": {
        "name_jp": "脳天落とし",
        "name_en": "Skull Cracker",
        "description": "1명의 적에게 공격력 82.4%/86.5%/90.6%의 물리 속성 대미지를 주고, 2턴 동안 9.3%/9.8%/10.2%의 기본 확률로 적을 혼란 상태에 빠뜨린다.",
        "description_en": "Deal Physical damage to 1 foe equal to 82.4%/86.5%/90.6% of Attack. 9.3%/9.8%/10.2% chance to inflict Confuse for 2 turns.",
        "description_jp": "敵単体に攻撃力82.4%/86.5%/90.6%の物理属性ダメージを与える。9.3%/9.8%/10.2%の確率で敵を２ターンの間、混乱状態にする。",
        "type": "공격",
        "target": "단일",
        "icon": "물리"
    },
    "몽향침": {
        "name_jp": "夢想針",
        "name_en": "Dream Needle",
        "description": "1명의 적에게 공격력 82.4%/86.5%/90.6%의 물리 속성 대미지를 주고, 2턴 동안 12.5%/13.1%/13.8%의 기본 확률로 적을 수면 상태에 빠뜨린다.",
        "description_en": "Deal Physical damage to 1 foe equal to 82.4%/86.5%/90.6% of Attack. 12.5%/13.1%/13.8% chance to inflict Sleep for 2 turns.",
        "description_jp": "敵単体に攻撃力82.4%/86.5%/90.6%の物理属性ダメージを与える。12.5%/13.1%/13.8%の確率で敵を２ターンの間、睡眠状態にする。",
        "type": "공격",
        "target": "단일",
        "icon": "물리"
    },
    "망살 러시": {
        "name_jp": "忘殺ラッシュ",
        "name_en": "Memory Blow",
        "description": "모든 적에게 공격력 40.8%/42.8%/44.9%의 물리 속성 대미지를 주고, 2턴 동안 6.7%/7.0%/7.4%의 기본 확률로 적을 망각 상태에 빠뜨린다.",
        "description_en": "Deal Physical damage to all foes equal to 40.8%/42.8%/44.9% of Attack. 6.7%/7.0%/7.4% chance to inflict Forget for 2 turns.",
        "description_jp": "敵全体に攻撃力40.8%/42.8%/44.9%の物理属性ダメージを与える。6.7%/7.0%/7.4%の確率で敵を２ターンの間、忘却状態にする。",
        "type": "공격",
        "target": "전체",
        "icon": "물리광역"
    },
    "피의 축제": {
        "name_jp": "血祭り",
        "name_en": "Bloodbath",
        "description": "모든 적에게 공격력 40.8%/42.8%/44.9%의 물리 속성 대미지를 주고, 3턴 동안 2.6%/2.7%/2.9%의 기본 확률로 적을 공포 상태에 빠뜨린다.",
        "description_en": "Deal Physical damage to all foes equal to 40.8%/42.8%/44.9% of Attack. 2.6%/2.7%/2.9% chance to inflict Fear for 3 turns.",
        "description_jp": "敵全体に攻撃力40.8%/42.8%/44.9%の物理属性ダメージを与える。2.6%/2.7%/2.9%の確率で敵を３ターンの間、恐怖状態にする。",
        "type": "공격",
        "target": "전체",
        "icon": "물리광역"
    },
    "마인드 슬라이스": {
        "name_jp": "マインドスライス",
        "name_en": "Mind Slice",
        "description": "모든 적에게 공격력 40.8%/42.8%/44.9%의 물리 속성 대미지를 주고, 2턴 동안 3.4%/3.6%/3.7%의 기본 확률로 적을 혼란 상태에 빠뜨린다.",
        "description_en": "Deal Physical damage to all foes equal to 40.8%/42.8%/44.9% of Attack. 3.4%/3.6%/3.7% chance to inflict Confuse for 2 turns.",
        "description_jp": "敵全体に攻撃力40.8%/42.8%/44.9%の物理属性ダメージを与える。3.4%/3.6%/3.7%の確率で敵を２ターンの間、混乱状態にする。",
        "type": "공격",
        "target": "전체",
        "icon": "물리광역"
    },
    "도르민 러시": {
        "name_jp": "ドルミンラッシュ",
        "name_en": "Dormin Rush",
        "description": "모든 적에게 공격력 40.8%/42.8%/44.9%의 물리 속성 대미지를 주고, 2턴 동안 4.5%/4.7%/5.0%의 기본 확률로 적을 수면 상태에 빠뜨린다.",
        "description_en": "Deal Physical damage to all foes equal to 40.8%/42.8%/44.9% of Attack. 4.5%/4.7%/5.0% chance to inflict Sleep for 2 turns.",
        "description_jp": "敵全体に攻撃力40.8%/42.8%/44.9%の物理属性ダメージを与える。4.5%/4.7%/5.0%の確率で敵を２ターンの間、睡眠状態にする。",
        "type": "공격",
        "target": "전체",
        "icon": "물리광역"
    },
    "박치기": {
        "name_jp": "頭突き",
        "name_en": "Headbutt",
        "description": "1명의 적에게 공격력 82.4%/86.5%/90.6%의 물리 속성 대미지를 주고, 2턴 동안 18.7%/19.6%/20.6%의 기본 확률로 적을 망각 상태에 빠뜨린다.",
        "description_en": "Deal Physical damage to 1 foe equal to 82.4%/86.5%/90.6% of Attack. 18.7%/19.6%/20.6% chance to inflict Forget for 2 turns.",
        "description_jp": "敵単体に攻撃力82.4%/86.5%/90.6%の物理属性ダメージを与える。18.7%/19.6%/20.6%の確率で敵を２ターンの間、忘却状態にする。",
        "type": "공격",
        "target": "단일",
        "icon": "물리"
    },
    "브레인 버스터": {
        "name_jp": "ブレインバスター",
        "name_en": "Brain Buster",
        "description": "모든 적에게 공격력 40.8%/42.8%/44.9%의 물리 속성 대미지를 주고, 2턴 동안 1.7%/1.8%/1.9%의 기본 확률로 적을 세뇌 상태에 빠뜨린다.",
        "description_en": "Deal Physical damage to all foes equal to 40.8%/42.8%/44.9% of Attack. 1.7%/1.8%/1.9% chance to inflict Brainwash for 2 turns.",
        "description_jp": "敵全体に攻撃力40.8%/42.8%/44.9%の物理属性ダメージを与える。1.7%/1.8%/1.9%の確率で敵を２ターンの間、洗脳状態にする。",
        "type": "공격",
        "target": "전체",
        "icon": "물리광역"
    },
    "지탄": {
        "name_jp": "狙撃",
        "name_en": "Snap",
        "description": "1명의 적에게 공격력 92.2%/96.8%/101.4%의 총격 속성 대미지를 주고, 크리티컬 확률이 16% 증가한다.",
        "description_en": "Increase this skill's critical rate by 16%, and deal Gun damage to 1 foe equal to 92.2%/96.8%/101.4% of Attack.",
        "description_jp": "このスキルのクリティカル率を１６%上昇させ、敵単体に攻撃力92.2%/96.8%/101.4%の銃撃属性ダメージを与える。",
        "type": "공격",
        "target": "단일",
        "icon": "총격"
    },
    "원 샷 킬": {
        "name_jp": "ワンショットキル",
        "name_en": "One-Shot Kill",
        "description": "1명의 적에게 공격 포인트 107.5%/112.9%/118.3%의 총격 속성 대미지를 주고, 크리티컬 확률이 20% 증가한다.",
        "description_en": "Increase this skill's critical rate by 20%, and deal Gun damage to 1 foe equal to 107.5%/112.9%/118.3% of Attack.",
        "description_jp": "このスキルのクリティカル率を２０%上昇させ、敵単体に攻撃力107.5%/112.9%/118.3%の銃撃属性ダメージを与える。",
        "type": "공격",
        "target": "단일",
        "icon": "총격"
    },
    "트리플 다운": {
        "name_jp": "トリプルダウン",
        "name_en": "Triple Down",
        "description": "모든 적에게 공격력 14.9%/15.6%/16.4%의 총격 속성 대미지를 3회 입히고, 크리티컬 확률이 16% 증가하며 명중률은 15% 감소한다.",
        "description_en": "Decrease this skill's accuracy by 15%, increase critical rate by 16%, and deal Gun damage to all foes equal to 14.9%/15.6%/16.4% of Attack (3 hits).",
        "description_jp": "このスキルの命中率を１５%下げ、クリティカル率を１６%上昇させ、敵全体に攻撃力14.9%/15.6%/16.4%の銃撃属性ダメージを３回与える。",
        "type": "공격",
        "target": "전체",
        "icon": "총격광역"
    },
    "불렛 타임": {
        "name_jp": "バレットタイム",
        "name_en": "Bullet Time",
        "description": "모든 적에게 공격력 23.4%/25.5%/27.7%의 3단 총격 속성 대미지를 주고, 『조준』을 보유한 적이 있을 경우 해당 스킬의 공격력이 30.0%/32.7%/35.4%, 크리티컬 효과가 36.0%/39.2%/42.5% 증가한다.",
        "description_en": "Deal Gun damage to all foes equal to 23.4%/25.5%/27.7% of Attack (3 hits). If a foe is Marked, increase damage by 30.0%/32.7%/35.4% and critical damage by 36.0%/39.2%/42.5%.",
        "description_jp": "敵全体に攻撃力23.4%/25.5%/27.7%の銃撃属性ダメージを３回与える。『標的』状態の敵がいる時、与ダメージが30.0%/32.7%/35.4%、クリティカルダメージが36.0%/39.2%/42.5%上昇する。",
        "type": "공격",
        "target": "전체",
        "icon": "총격광역",
        "cost": "체력 8.0%"
    },
    "디아": {
        "name_jp": "ディア",
        "name_en": "Dia",
        "description": "동료 1명이 공격력 33.1%/34.8%/36.4%+1001/1239/1495의 생명을 회복한다.",
        "description_en": "Restore 1 ally's HP by 33.1%/34.8%/36.4% of Attack + 1001/1239/1495.",
        "description_jp": "味方単体のＨＰを攻撃力の33.1%/34.8%/36.4%＋1001/1239/1495回復する。",
        "type": "회복",
        "target": "단일",
        "icon": "치료"
    },
    "디아라마": {
        "name_jp": "ディアラマ",
        "name_en": "Diarama",
        "description": "동료 1명이 공격력 35.6%/37.4%/39.2%+1077/1333/1608의 생명을 회복한다.",
        "description_en": "Restore 1 ally's HP by 35.6%/37.4%/39.2% of Attack + 1077/1333/1608.",
        "description_jp": "味方単体のＨＰを攻撃力の35.6%/37.4%/39.2%＋1077/1333/1608回復する。",
        "type": "회복",
        "target": "단일",
        "icon": "치료"
    },
    "메디아": {
        "name_jp": "メディア",
        "name_en": "Media",
        "description": "모든 동료가 공격력 16.6%/17.4%/18.3%+502/621/749의 생명을 회복한다.",
        "description_en": "Restore party's HP by 16.6%/17.4%/18.3% of Attack + 502/621/749.",
        "description_jp": "味方全体のＨＰを攻撃力の16.6%/17.4%/18.3%＋502/621/749回復する。",
        "type": "회복",
        "target": "전체",
        "icon": "치료광역"
    },
    "메디라마": {
        "name_jp": "メディラマ",
        "name_en": "Mediarama",
        "description": "모든 동료가 공격력 17.8%/18.7%/19.6%+538/666/804의 생명을 회복한다.",
        "description_en": "Restore party's HP by 17.8%/18.7%/19.6% of Attack + 538/666/804.",
        "description_jp": "味方全体のＨＰを攻撃力の17.8%/18.7%/19.6%＋538/666/804回復する。",
        "type": "회복",
        "target": "전체",
        "icon": "치료광역"
    },
    "메디아라한": {
        "name_jp": "メディアラハン",
        "name_en": "Mediarahan",
        "description": "모든 동료가 공격력 19.0%/20.0%/20.9%+575/711/858의 생명을 회복한다.",
        "description_en": "Restore party's HP by 19.0%/20.0%/20.9% of Attack + 575/711/858.",
        "description_jp": "味方全体のＨＰを攻撃力の19.0%/20.0%/20.9%＋575/711/858回復する。",
        "type": "회복",
        "target": "전체",
        "icon": "치료광역"
    },
    "우로스": {
        "name_jp": "ウロス",
        "name_en": "Elemental Conversion",
        "description": "동료 1명이 공격력 25.7%/27.0%/28.3%+777/962/1161의 생명을 회복하고, 원소 이상 효과 1개를 제거한다.",
        "description_en": "Restore 1 ally's HP by 25.7%/27.0%/28.3% of Attack + 777/962/1161. Cure 1 elemental ailment.",
        "description_jp": "味方単体のＨＰを攻撃力25.7%/27.0%/28.3%＋777/962/1161回復する。さらに属性異常を１つ治療する。",
        "type": "회복",
        "target": "단일",
        "icon": "치료"
    },
    "파트라": {
        "name_jp": "パトラ",
        "name_en": "Patra",
        "description": "동료 1명의 현기증, 수면, 망각 효과를 제거한다.",
        "description_en": "Cure Dizzy, Sleep, or Forget on 1 ally.",
        "description_jp": "味方単体の目眩、睡眠、忘却を治療する。",
        "type": "지원",
        "target": "단일",
        "icon": "치료"
    },
    "바이스디": {
        "name_jp": "バイスディ",
        "name_en": "Baisudi",
        "description": "동료 1명의 화상, 동결, 감전, 풍습 효과를 제거한다.",
        "description_en": "Cure Burn, Freeze, Shock, or Windswept on 1 ally.",
        "description_jp": "味方単体の炎上、凍結、感電、風襲を治療する。",
        "type": "지원",
        "target": "단일",
        "icon": "치료"
    },
    "에너지 드롭": {
        "name_jp": "エナジードロップ",
        "name_en": "Energy Drop",
        "description": "동료 1명의 혼란, 공포, 절망, 광노, 세뇌 효과를 제거한다.",
        "description_en": "Cure Confuse, Fear, Despair, Rage, or Brainwash on 1 ally.",
        "description_jp": "味方単体の混乱、恐怖、絶望、激怒、洗脳を治療する。",
        "type": "지원",
        "target": "단일",
        "icon": "치료"
    },
    "타루카쟈": {
        "name_jp": "タルカジャ",
        "name_en": "Tarukaja",
        "description": "동료 1명의 공격력이 15.5%/16.3%/17.0% 증가하고, 자신의 공격력 500포인트마다 1.3%/1.4%/1.4% 추가 증가한다. 상한은 10.4%/10.9%/11.4%이며, 효과는 3턴 동안 지속된다.",
        "description_en": "Increase 1 ally's Attack by 15.5%/16.3%/17.0%. For every 500 of the user's Attack, increase the target's Attack by 1.3%/1.4%/1.4% more, up to 10.4%/10.9%/11.4%. Lasts for 3 turns.",
        "description_jp": "３ターンの間、味方単体の攻撃力が15.5%/16.3%/17.0%上昇する。自身の攻撃力が５００ごとに、味方の攻撃力がさらに1.3%/1.4%/1.4%上昇する（最大10.4%/10.9%/11.4%まで）。",
        "type": "지원",
        "target": "단일",
        "icon": "버프"
    },
    "마하타루카쟈": {
        "name_jp": "マハタルカジャ",
        "name_en": "Matarukaja",
        "description": "모든 동료의 공격력이 10.9%/11.4%/12.0% 증가하고, 자신의 공격력 500포인트마다 0.9%/0.9%/1.0% 추가 증가한다. 상한은 7.2%/7.6%/7.9%이며, 효과는 3턴 동안 지속된다.",
        "description_en": "Increase party's Attack by 10.9%/11.4%/12.0%. For every 500 of the user's Attack, increase party's Attack by 0.9%/0.9%/1.0% more, up to 7.2%/7.6%/7.9%. Lasts for 3 turns.",
        "description_jp": "３ターンの間、味方全体の攻撃力が10.9%/11.4%/12.0%上昇する。自身の攻撃力が５００ごとに、味方の攻撃力がさらに0.9%/0.9%/1.0%上昇する（最大7.2%/7.6%/7.9%まで）。",
        "type": "지원",
        "target": "전체",
        "icon": "버프광역"
    },
    "라쿠카쟈": {
        "name_jp": "ラクカジャ",
        "name_en": "Rakukaja",
        "description": "동료 1명의 방어력이 23.3%/24.5%/25.6% 증가하고, 자신의 방어력 500마다 3.9%/4.1%/4.3% 추가 증가한다. 상한은 15.6%/16.4%/17.2%이며, 효과는 3턴 동안 지속된다.",
        "description_en": "Increase 1 ally's Defense by 23.3%/24.5%/25.6%. For every 500 of the user's Defense, increase the target's Defense by 3.9%/4.1%/4.3% more, up to 15.6%/16.4%/17.2%. Lasts for 3 turns.",
        "description_jp": "３ターンの間、味方単体の防御力が23.3%/24.5%/25.6%上昇する。自身の防御力が５００ごとに、味方の防御力がさらに3.9%/4.1%/4.3%上昇する（最大15.6%/16.4%/17.2%まで）。",
        "type": "지원",
        "target": "단일",
        "icon": "버프"
    },
    "마하라쿠카쟈": {
        "name_jp": "マハラクカジャ",
        "name_en": "Marakukaja",
        "description": "모든 동료의 방어력이 16.3%/17.1%/17.9% 증가하고, 자신의 방어력 500마다 2.7%/2.8%/3.0% 추가 증가한다. 상한은 10.8%/11.3%/11.9%이며, 효과는 3턴 동안 지속된다.",
        "description_en": "Increase party's Defense by 16.3%/17.1%/17.9%. For every 500 of the user's Defense, increase party's Defense by 2.7%/2.8%/3.0% more, up to 10.8%/11.3%/11.9%. Lasts for 3 turns.",
        "description_jp": "３ターンの間、味方全体の防御力が16.3%/17.1%/17.9%上昇する。自身の防御力が５００ごとに、味方の防御力がさらに2.7%/2.8%/3.0%上昇する（最大10.8%/11.3%/11.9%まで）。",
        "type": "지원",
        "target": "전체",
        "icon": "버프광역"
    },
    "스쿠카쟈": {
        "name_jp": "スクカジャ",
        "name_en": "Sukukaja",
        "description": "동료 1명의 효과 명중, 효과 저항이 9.3%/9.8%/10.2% 증가하고, 자신의 효과 명중 25%마다 1.6%/1.7%/1.8% 추가 증가한다. 상한은 6.4%/6.7%/7.0%이며, 효과는 3턴 동안 지속된다.",
        "description_en": "Increase 1 ally's ailment accuracy and ailment resistance by 9.3%/9.8%/10.2%, and Speed by 5. For every 25% of the user's ailment accuracy, increase the target's ailment accuracy by 1.6%/1.7%/1.8% more, up to 6.4%/6.7%/7.0%. Lasts for 3 turns.",
        "description_jp": "３ターンの間、味方単体の状態異常命中、状態異常抵抗が9.3%/9.8%/10.2%上昇し、速さが５上昇する。自身の状態異常命中が２５%ごとに、味方の状態異常命中がさらに1.6%/1.7%/1.8%上昇する（最大6.4%/6.7%/7.0%まで）。",
        "type": "지원",
        "target": "단일",
        "icon": "버프"
    },
    "마하스쿠카쟈": {
        "name_jp": "マハスクカジャ",
        "name_en": "Masukukaja",
        "description": "모든 동료의 효과 명중, 효과 저항이 6.5%/6.8%/7.2% 증가하고, 자신의 효과 명중 25%마다 1.1%/1.2%/1.2% 추가 증가한다. 상한은 4.4%/4.6%/4.8%이며, 효과는 3턴 동안 지속된다.",
        "description_en": "Increase party's ailment accuracy and ailment resistance by 6.5%/6.8%/7.2%, and Speed by 3 for 3 turns. For every 25% of the user's ailment accuracy, increase party's ailment accuracy by 1.1%/1.2%/1.2% more, up to 4.4%/4.6%/4.8%.",
        "description_jp": "３ターンの間、味方全体の状態異常命中、状態異常抵抗が6.5%/6.8%/7.2%上昇し、速さが３上昇する。自身の状態異常命中が２５%ごとに、味方の状態異常命中がさらに1.1%/1.2%/1.2%上昇する（最大4.4%/4.6%/4.8%まで）。",
        "type": "지원",
        "target": "전체",
        "icon": "버프광역"
    },
    "리벨리온": {
        "name_jp": "リベリオン",
        "name_en": "Rebellion",
        "description": "동료 1명의 크리티컬 확률이 9.3%/9.8%/10.2% 증가하고, 자신의 크리티컬 확률 10%마다 1.6%/1.7%/1.8% 추가 증가한다. 상한은 6.4%/6.7%/7.0%이며, 효과는 3턴 동안 지속된다.",
        "description_en": "Increase 1 ally's critical rate by 9.3%/9.8%/10.2%. For every 10% of the user's critical rate, increase the target's critical rate by 1.6%/1.7%/1.8% more, up to 6.4%/6.7%/7.0%. Lasts for 3 turns.",
        "description_jp": "３ターンの間、味方単体のクリティカル率が9.3%/9.8%/10.2%上昇する。自身のクリティカル率が１０%ごとに、味方のクリティカル率がさらに1.6%/1.7%/1.8%上昇する（最大6.4%/6.7%/7.0%まで）。",
        "type": "지원",
        "target": "단일",
        "icon": "버프"
    },
    "레볼루션": {
        "name_jp": "レボリューション",
        "name_en": "Revolution",
        "description": "모든 동료의 크리티컬 확률이 6.5%/6.8%/7.2% 증가하고, 자신의 크리티컬 확률 10%마다 추가로1.1%/1.2%/1.2%가 증가한다. 상한은 4.4%/4.6%/4.8%이며, 효과는 3턴 동안 지속된다.",
        "description_en": "Increase party's critical rate by 6.5%/6.8%/7.2%. For every 10% of the user's critical rate, increase party's critical rate by 1.1%/1.2%/1.2% more, up to 4.4%/4.6%/4.8%. Lasts for 3 turns.",
        "description_jp": "３ターンの間、味方全体のクリティカル率が6.5%/6.8%/7.2%上昇する。自身のクリティカル率が１０%ごとに、味方のクリティカル率がさらに1.1%/1.2%/1.2%上昇する（最大4.4%/4.6%/4.8%まで）。",
        "type": "지원",
        "target": "전체",
        "icon": "버프광역"
    },
    "무한 알고리즘": {
        "name_jp": "無限アルゴリズム",
        "name_en": "Infinite Algorithm",
        "description": "2턴 동안 모든 아군 캐릭터의 공격력이 30.0%/31.5%/33.0% 증가하고, 메인 목표의 대미지가 추가로 20.0%/21.0%/22.0% 증가한다.",
        "description_en": "Increase all allies' ATK by 30.0%/31.5%/33.0% and damage to main target by 20.0%/21.0%/22.0% for 2 turns.",
        "description_jp": "2ターンの間、味方全体の攻撃力が30.0%/31.5%/33.0%上昇し、メインターゲットへのダメージがさらに20.0%/21.0%/22.0%増加する。",
        "type": "지원",
        "target": "전체",
        "icon": "버프광역"
    },
    "응집": {
        "name_jp": "凝結",
        "name_en": "Cohesion",
        "description": "모든 동료의 공격력이 15.0%/15.8%/16.5% 증가하고, 자신의 공격력 500포인트마다 1.25%/1.31%/1.38%가 추가 증가한다. 상한은 10%이며 효과는 2턴 동안 지속된다. 또한 스킬의 메인 목표가 주는 대미지가 8.0%/8.4%/8.8% 추가 증가하고, 자신의 공격력 500포인트마다 1.0%/1.05%/1.1%가 추가 증가한다. 상한은 8%이며 효과는 1턴 동안 지속된다.",
        "description_en": "Increase party's Attack by 15.0%/15.8%/16.5% for 2 turns. For every 500 of the user's Attack, increase party's Attack by 1.25%/1.31%/1.38% more (up to 10%). Increase main target's damage by 8.0%/8.4%/8.8% and increase damage by 1.0%/1.05%/1.1% more for every 500 of the user's Attack (up to 8%) for 1 turn.",
        "description_jp": "２ターンの間、味方全体の攻撃力が15.0%/15.8%/16.5%上昇し、自身の攻撃力５００ごとに追加で攻撃力が1.25%/1.31%/1.38%上昇する（最大１０%）。さらに１ターンの間、選択した対象の与ダメージが8.0%/8.4%/8.8%上昇し、自身の攻撃力５００ごとに追加で与ダメージが1.0%/1.05%/1.1%上昇する（最大８%）。",
        "type": "지원",
        "target": "전체",
        "icon": "버프광역"
    },
    "데카쟈": {
        "name_jp": "デカジャ",
        "name_en": "Dekaja",
        "description": "모든 적의 속성 증가 효과 1개를 제거한다.",
        "description_en": "Remove 1 stat buff from all foes.",
        "description_jp": "敵全体のステータス上昇効果を１つ打ち消す。",
        "type": "지원",
        "target": "전체",
        "icon": "버프광역"
    },
    "데쿤다": {
        "name_jp": "デクンダ",
        "name_en": "Dekunda",
        "description": "모든 동료의 속성 감소 효과 1개를 제거한다.",
        "description_en": "Remove 1 stat debuff from all allies.",
        "description_jp": "味方全体のステータス低下効果を１つ打ち消す。",
        "type": "지원",
        "target": "전체",
        "icon": "버프"
    },
    "컨센트레이트": {
        "name_jp": "コンセントレイト",
        "name_en": "Concentrate",
        "description": "자신의 다음 마법 속성 대미지가 52.1%/54.7%/57.3% 증가하며 1턴 동안 지속된다.",
        "description_en": "Increase next magic damage by 52.1%/54.7%/57.3%. Lasts for 1 turn.",
        "description_jp": "１ターンの間、自身が次に与える魔法属性ダメージが52.1%/54.7%/57.3%上昇する。",
        "type": "지원",
        "target": "자신",
        "icon": "버프"
    },
    "차지": {
        "name_jp": "チャージ",
        "name_en": "Charge",
        "description": "자신의 다음 물리 속성 대미지가 52.1% 증가하며 1턴 동안 지속된다.",
        "description_en": "Increase Wonder's next Physical attack damage by 52.1% for 1 turn.",
        "description_jp": "1ターンの間、自身が次に与える物理属性ダメージが52.1%上昇する。",
        "type": "지원",
        "target": "자신",
        "icon": "버프"
    },
    "라쿤다": {
        "name_jp": "ラクンダ",
        "name_en": "Rakunda",
        "description": "3턴 동안 적 1명의 방어력이 38.8%/40.7%/42.7% 감소한다.",
        "description_en": "Decrease 1 foe's Defense by 38.8%/40.7%/42.7% for 3 turns.",
        "description_jp": "３ターンの間、敵単体の防御力が38.8%/40.7%/42.7%低下する。",
        "type": "지원",
        "target": "단일",
        "icon": "디버프",
        "icon_gl": "버프"
    },
    "해체 역장": {
        "name_jp": "解体フィールド",
        "name_en": "Abyssal Field",
        "description": "3턴 동안 1명의 적이 받는 대미지가 24%/25.2%/26.4% 증가하고, 받는 크리티컬 효과가 18%/18.9%/19.8% 증가한다.",
        "description_en": "Increase 1 foe's DMG taken by 24%/25.2%/26.4% and CRIT DMG taken by 18%/18.9%/19.8% for 3 turns.",
        "description_jp": "3ターンの間、敵1体が受けるダメージが24%/25.2%/26.4%増加し、受けるCRT倍率が18%/18.9%/19.8%増加する。",
        "type": "지원",
        "target": "단일",
        "icon": "디버프",
        "icon_gl": "버프"
    },
    "마하라쿤다": {
        "name_jp": "マハラクンダ",
        "name_en": "Marakunda",
        "description": "3턴 동안 모든 적의 방어력이 27.1%/28.5%/29.8% 감소한다.",
        "description_en": "Decrease all foes' Defense by 27.1%/28.5%/29.8% for 3 turns.",
        "description_jp": "３ターンの間、敵全体の防御力を27.1%/28.5%/29.8%低下させる。",
        "type": "지원",
        "target": "전체",
        "icon": "디버프광역",
        "icon_gl": "버프광역"
    },
    "음률의 침입": {
        "name_jp": "音律の侵入",
        "name_en": "Melodic Infiltration",
        "description": "3턴 동안 모든 적의 방어력이 32.0%/33.6%/35.2% 감소하고, 받는 대미지를 10%/10.5%/11.0% 증가시킨다.",
        "description_en": "Decrease all foes' DEF by 32.0%/33.6%/35.2% and increase damage taken by 10.0%/10.5%/11.0% for 3 turns.",
        "description_jp": "3ターンの間、敵全体の防御力を32.0%/33.6%/35.2%低下させ、受けるダメージを10.0%/10.5%/11.0%増加させる。",
        "type": "지원",
        "target": "전체",
        "icon": "디버프광역",
        "icon_gl": "버프광역"
    },
    "타룬다": {
        "name_jp": "タルンダ",
        "name_en": "Tarunda",
        "description": "3턴 동안 적 1명의 공격력이 25.8%/27.1%/28.4% 감소한다.",
        "description_en": "Decrease 1 foe's Attack by 25.8%/27.1%/28.4% for 3 turns.",
        "description_jp": "３ターンの間、敵単体の攻撃力が25.8%/27.1%/28.4%低下する。",
        "type": "지원",
        "target": "단일",
        "icon": "디버프",
        "icon_gl": "버프"
    },
    "전의 공명": {
        "name_jp": "戦意の共鳴",
        "name_en": "Spirit Harmony",
        "description": "자신이 적에게 페르소나 스킬 시전 시 3턴 동안 공격력이 가장 높은 아군 동료(지배/반항 우선 선택)의 공격력이 10%, 크리티컬 효과가 10% 증가한다. 해당 효과는 2턴의 쿨타임이 있다.",
        "description_en": "Increase the ATK of the ally with the highest ATK among allies (Sweeper/Assassin priority) by 10% and CRIT DMG by 10% for 3 turns. This effect has a 2 turn cooldown.",
        "description_jp": "自身が敵にペルソナスキルを使用した時、3ターンの間、味方の攻撃力が最も高い味方（支配/反抗 優先）の攻撃力が10%上昇し、クリティカルダメージが10%上昇する。この効果には2ターンのクールタイムがある。",
        "type": "지원",
        "target": "단일",
        "icon": "패시브",
        "icon_gl": "패시브"
    },
    "공격 강화 I": {
        "name_jp": "アタックブースタⅠ",
        "name_en": "Attack Boost I",
        "description": "공격력이 5.8% 증가한다.",
        "description_jp": "攻撃力が5.8%上昇する。",
        "description_en": "Increases ATK by 5.8% .",
        "type": "패시브",
        "target": "자신",
        "icon": "패시브"
    },
    "공격 강화 II": {
        "name_jp": "アタックブースタⅡ",
        "name_en": "Attack Boost II",
        "description": "공격력이 8.3% 증가한다.",
        "description_jp": "攻撃力が8.3%上昇する。",
        "description_en": "Increases ATK by 8.3% .",
        "type": "패시브",
        "target": "자신",
        "icon": "패시브"
    },
    "공격 강화 III": {
        "name_jp": "アタックブースタⅢ",
        "name_en": "Attack Boost III",
        "description": "공격력이 10.8% 증가한다.",
        "description_jp": "攻撃力が10.8%上昇する。",
        "description_en": "Increase ATK by 10.8% .",
        "type": "패시브",
        "target": "자신",
        "icon": "패시브"
    },
    "공격 강화 IV": {
        "name_jp": "アタックブースタⅣ",
        "name_en": "Attack Boost IV",
        "description": "공격력이 13.5% 증가한다.",
        "description_jp": "攻撃力が13.5%上昇する。",
        "description_en": "Increase ATK by 13.5% .",
        "type": "패시브",
        "target": "자신",
        "icon": "패시브"
    },
    "공격 강화 V": {
        "name_jp": "アタックブースタⅤ",
        "name_en": "Attack Boost V",
        "description": "공격력이 16.2% 증가한다.",
        "description_en": "Increase ATK by 16.2% .",
        "description_jp": "攻撃力が16.2%上昇する。",
        "type": "패시브",
        "target": "자신",
        "icon": "패시브"
    },
    "공격 강화": {
        "name_jp": "アタックブースタ",
        "name_en": "Attack Boost",
        "description": "공격력이 5.8%/8.3%/10.8%/13.5%/16.2% 증가한다.",
        "description_en": "Increase ATK by 5.8%/8.3%/10.8%/13.5%/16.2% .",
        "description_jp": "攻撃力が5.8%/8.3%/10.8%/13.5%/16.2%上昇する。",
        "type": "패시브",
        "icon": "패시브"
    },
    "공격의 마음가짐 I": {
        "name_jp": "攻撃の心得Ⅰ",
        "name_en": "Attack Master I",
        "description": "전투 시작 시 2턴 동안 공격력이 8.5% 증가한다.",
        "description_en": "Increase ATK by 8.5% at the start of battle for 2 turns or until persona change.",
        "description_jp": "戦闘開始時、2ターンの間、自身の攻撃力が8.5%上昇する。",
        "type": "패시브",
        "target": "자신",
        "icon": "패시브"
    },
    "공격의 마음가짐 II": {
        "name_jp": "攻撃の心得Ⅱ",
        "name_en": "Attack Master II",
        "description": "전투 시작 시 2턴 동안 공격력이 12.1% 증가한다.",
        "description_en": "Increase ATK by 12.1% at the start of battle for 2 turns or until persona change.",
        "description_jp": "戦闘開始時、2ターンの間、自身の攻撃力が12.1%上昇する。",
        "type": "패시브",
        "target": "자신",
        "icon": "패시브"
    },
    "공격의 마음가짐 III": {
        "name_jp": "攻撃の心得Ⅲ",
        "name_en": "Attack Master III",
        "description": "전투 시작 시 2턴 동안 공격력이 15.7% 증가한다.",
        "description_en": "Increase ATK by 15.7% at the start of battle for 2 turns or until persona change.",
        "description_jp": "戦闘開始時、2ターンの間、自身の攻撃力が15.7%上昇する。",
        "type": "패시브",
        "target": "자신",
        "icon": "패시브"
    },
    "공격의 마음가짐 IV": {
        "name_jp": "攻撃の心得Ⅳ",
        "name_en": "Attack Master IV",
        "description": "전투 시작 시 2턴 동안 공격력이 19.6% 증가한다.",
        "description_en": "Increase ATK by 19.6% at the start of battle for 2 turns or until persona change.",
        "description_jp": "戦闘開始時、2ターンの間、自身の攻撃力が19.6%上昇する。",
        "type": "패시브",
        "target": "자신",
        "icon": "패시브"
    },
    "공격의 마음가짐": {
        "name_jp": "攻撃の心得",
        "name_en": "Attack Master",
        "description": "전투 시작 시 2턴 동안 공격력이 8.5%/12.1%/15.7%/19.6% 증가한다.",
        "description_en": "Increase ATK by 8.5%/12.1%/15.7%/19.6% at the start of battle for 2 turns or until persona change.",
        "description_jp": "戦闘開始時、2ターンの間、自身の攻撃力が8.5%/12.1%/15.7%/19.6%上昇する。",
        "type": "패시브",
        "icon": "패시브"
    },
    "방어의 마음가짐 I": {
        "name_jp": "防御の心得Ⅰ",
        "name_en": "Defense Master I",
        "description": "전투 시작 시 2턴 동안 방어력이 12.7% 증가한다.",
        "description_en": "Increases DEF by 12.7% at the start of battle for 2 turns or until persona change.",
        "description_jp": "戦闘開始時、2ターンの間、自身の防御力が12.7%上昇する。",
        "type": "패시브",
        "target": "자신",
        "icon": "패시브"
    },
    "방어의 마음가짐 II": {
        "name_jp": "防御の心得Ⅱ",
        "name_en": "Defense Master II",
        "description": "전투 시작 시 2턴 동안 방어력이 18.1% 증가한다.",
        "description_en": "Increase DEF by 18.1% at the start of battle for 2 turns or until persona change.",
        "description_jp": "戦闘開始時、2ターンの間、自身の防御力が18.1%上昇する。",
        "type": "패시브",
        "target": "자신",
        "icon": "패시브"
    },
    "방어의 마음가짐 III": {
        "name_jp": "防御の心得Ⅲ",
        "name_en": "Defense Master III",
        "description": "전투 시작 시 2턴 동안 방어력이 23.6% 증가한다.",
        "description_en": "Increase DEF by 23.6% for 2 turns at the start of battle.",
        "description_jp": "戦闘開始時、2ターンの間、自身の防御力が23.6%上昇する。",
        "type": "패시브",
        "target": "자신",
        "icon": "패시브"
    },
    "방어의 마음가짐 IV": {
        "name_jp": "防御の心得Ⅳ",
        "name_en": "Defense Master IV",
        "description": "전투 시작 시 2턴 동안 방어력이 29.4% 증가한다.",
        "description_en": "Increase DEF by 29.4% for 2 turns at the start of battle.",
        "description_jp": "戦闘開始時、2ターンの間、自身の防御力が29.4%上昇する。",
        "type": "패시브",
        "target": "자신",
        "icon": "패시브"
    },
    "방어의 마음가짐": {
        "name_jp": "防御の心得",
        "name_en": "Defense Master",
        "description": "전투 시작 시 2턴 동안 방어력이 12.7%/18.1%/23.6%/29.4% 증가한다.",
        "description_en": "Increase DEF by 12.7%/18.1%/23.6%/29.4% for 2 turns at the start of battle.",
        "description_jp": "戦闘開始時、2ターンの間、自身の防御力が12.7%/18.1%/23.6%/29.4%上昇する。",
        "type": "패시브",
        "icon": "패시브"
    },
    "마하타루카 오토 I": {
        "name_jp": "マハタルカオートⅠ",
        "name_en": "Auto-Mataru I",
        "description": "전투 시작 시 전원의 공격력이 4.2% 증가하며, 이 효과는 2턴 동안 또는 페르소나를 전환할 때까지 지속된다.",
        "description_en": "Increase ATK for all allies by 4.2% at the start of battle for 2 turns or until persona change.",
        "description_jp": "戦闘開始時、2ターンもしくはペルソナを切り替えるまでの間、味方全体の攻撃力が4.2%上昇する。",
        "type": "패시브",
        "target": "전체",
        "icon": "패시브"
    },
    "마하타루카 오토 II": {
        "name_jp": "マハタルカオートⅡ",
        "name_en": "Auto-Mataru II",
        "description": "전투 시작 시 전원의 공격력이 6.0% 증가하며, 이 효과는 2턴 동안 또는 페르소나를 전환할 때까지 지속된다.",
        "description_en": "Increase ATK for all allies by 6% at the start of battle for 2 turns or until persona change.",
        "description_jp": "戦闘開始時、2ターンもしくはペルソナを切り替えるまでの間、味方全体の攻撃力が6.0%上昇する。",
        "type": "패시브",
        "target": "전체",
        "icon": "패시브"
    },
    "마하타루카 오토 III": {
        "name_jp": "マハタルカオートⅢ",
        "name_en": "Auto-Mataru III",
        "description": "전투 시작 시 전원의 공격력이 7.9% 증가하며, 이 효과는 2턴 동안 또는 페르소나를 전환할 때까지 지속된다.",
        "description_en": "Increase ATK for all allies by 7.9% at the start of battle for 2 turns or until persona change.",
        "description_jp": "戦闘開始時、2ターンもしくはペルソナを切り替えるまでの間、味方全体の攻撃力が7.9%上昇する。",
        "type": "패시브",
        "target": "전체",
        "icon": "패시브"
    },
    "마하타루카 오토 IV": {
        "name_jp": "マハタルカオートⅣ",
        "name_en": "Auto-Mataru IV",
        "description": "전투 시작 시 전원의 공격력이 9.8% 증가하며, 이 효과는 2턴 동안 또는 페르소나를 전환할 때까지 지속된다.",
        "description_en": "Increase ATK for all allies by 9.8% at the start of battle for 2 turns or until persona change.",
        "description_jp": "戦闘開始時、2ターンもしくはペルソナを切り替えるまでの間、味方全体の攻撃力が9.8%上昇する。",
        "type": "패시브",
        "target": "전체",
        "icon": "패시브"
    },
    "마하타루카 오토": {
        "name_jp": "マハタルカオート",
        "name_en": "Auto-Mataru",
        "description": "전투 시작 시 전원의 공격력이 4.2%/6.0%/7.9%/9.8% 증가하며, 이 효과는 2턴 동안 또는 페르소나를 전환할 때까지 지속된다.",
        "description_en": "Increase ATK for all allies by 4.2%/6.0%/7.9%/9.8% at the start of battle for 2 turns or until persona change.",
        "description_jp": "戦闘開始時、2ターンもしくはペルソナを切り替えるまでの間、味方全体の攻撃力が4.2%/6.0%/7.9%/9.8%上昇する。",
        "type": "패시브",
        "icon": "패시브"
    },
    "마하라쿠카 오토 I": {
        "name_jp": "マハラクカオートⅠ",
        "name_en": "Auto-Maraku I",
        "description": "전투 시작 시 전원의 방어력이 6.3% 증가하며, 이 효과는 2턴 동안 또는 페르소나를 전환할 때까지 지속된다.",
        "description_en": "Increase DEF for all allies by 6.3% at the start of battle for 2 turns or until persona change.",
        "description_jp": "戦闘開始時、2ターンもしくはペルソナを切り替えるまでの間、味方全体の防御力が6.3%上昇する。",
        "type": "패시브",
        "target": "전체",
        "icon": "패시브"
    },
    "마하라쿠카 오토 II": {
        "name_jp": "マハラクカオートⅡ",
        "name_en": "Auto-Maraku II",
        "description": "전투 시작 시 전원의 방어력이 9.1% 증가하며, 이 효과는 2턴 동안 또는 페르소나를 전환할 때까지 지속된다.",
        "description_en": "Increase DEF for all allies by 9.1% at the start of battle for 2 turns or until persona change.",
        "description_jp": "戦闘開始時、2ターンもしくはペルソナを切り替えるまでの間、味方全体の防御力が9.1%上昇する。",
        "type": "패시브",
        "target": "전체",
        "icon": "패시브"
    },
    "마하라쿠카 오토 III": {
        "name_jp": "マハラクカオートⅢ",
        "name_en": "Auto-Maraku III",
        "description": "전투 시작 시 전원의 방어력이 11.8% 증가하며, 이 효과는 2턴 동안 또는 페르소나를 전환할 때까지 지속된다.",
        "description_en": "Increase DEF for all allies by 11.8% at the start of battle for 2 turns or until persona change.",
        "description_jp": "戦闘開始時、2ターンもしくはペルソナを切り替えるまでの間、味方全体の防御力が11.8%上昇する。",
        "type": "패시브",
        "target": "전체",
        "icon": "패시브"
    },
    "마하라쿠카 오토 IV": {
        "name_jp": "マハラクカオートⅣ",
        "name_en": "Auto-Maraku IV",
        "description": "전투 시작 시 전원의 방어력이 14.7% 증가하며, 이 효과는 2턴 동안 또는 페르소나를 전환할 때까지 지속된다.",
        "description_en": "Increase DEF for all allies by 14.7% at the start of battle for 2 turns or until persona change",
        "description_jp": "戦闘開始時、2ターンもしくはペルソナを切り替えるまでの間、味方全体の防御力が14.7%上昇する。",
        "type": "패시브",
        "target": "전체",
        "icon": "패시브"
    },
    "마하라쿠카 오토": {
        "name_jp": "マハラクカオート",
        "name_en": "Auto-Maraku",
        "description": "전투 시작 시 전원의 방어력이 6.3%/9.1%/11.8%/14.7% 증가하며, 이 효과는 2턴 동안 또는 페르소나를 전환할 때까지 지속된다.",
        "description_en": "Increase DEF for all allies by 6.3%/9.1%/11.8%/14.7% at the start of battle for 2 turns or until persona change.",
        "description_jp": "戦闘開始時、2ターンもしくはペルソナを切り替えるまでの間、味方全体の防御力が6.3%/9.1%/11.8%/14.7%上昇する。",
        "type": "패시브",
        "icon": "패시브"
    },
    "어드바이스 I": {
        "name_jp": "アドバイスⅠ",
        "name_en": "Apt Pupil I",
        "description": "크리티컬 확률이 3.5% 증가한다.",
        "description_en": "Increases Critical Rate by 3.5% .",
        "description_jp": "クリティカル率が3.5%上昇する。",
        "type": "패시브",
        "target": "자신",
        "icon": "패시브"
    },
    "어드바이스 II": {
        "name_jp": "アドバイスⅡ",
        "name_en": "Apt Pupil II",
        "description": "크리티컬 확률이 5.0% 증가한다.",
        "description_en": "Increase Critical Rate by 5% .",
        "description_jp": "クリティカル率が5.0%上昇する。",
        "type": "패시브",
        "target": "자신",
        "icon": "패시브"
    },
    "어드바이스 III": {
        "name_jp": "アドバイスⅢ",
        "name_en": "Apt Pupil III",
        "description": "크리티컬 확률이 6.5% 증가한다.",
        "description_en": "Increases Critical Rate by 6.5%.",
        "description_jp": "クリティカル率が6.5%上昇する。",
        "type": "패시브",
        "target": "자신",
        "icon": "패시브"
    },
    "어드바이스 IV": {
        "name_jp": "アドバイスⅣ",
        "name_en": "Apt Pupil IV",
        "description": "크리티컬 확률이 8.1% 증가한다.",
        "description_en": "Increases Critical Rate by 8.1% .",
        "description_jp": "クリティカル率が8.1%上昇する。",
        "type": "패시브",
        "target": "자신",
        "icon": "패시브"
    },
    "어드바이스": {
        "name_jp": "アドバイス",
        "name_en": "Apt Pupil",
        "description": "크리티컬 확률이 3.5%/5.0%/6.5%/8.1% 증가한다.",
        "description_en": "Increases Critical Rate by 3.5%/5.0%/6.5%/8.1% .",
        "description_jp": "クリティカル率が3.5%/5.0%/6.5%/8.1%上昇する。",
        "type": "패시브",
        "icon": "패시브"
    },
    "총탄의 열광 II": {
        "name_jp": "トリガーハッピーⅡ",
        "name_en": "Trigger Happy II",
        "description": "총기 공격 크리티컬 확률이 5.5% 증가한다.",
        "description_en": "Increase Critical Rate of Gun skills by 5.5% .",
        "description_jp": "銃撃属性のクリティカル率が5.5%上昇する。",
        "type": "패시브",
        "target": "자신",
        "icon": "패시브"
    },
    "총탄의 열광 III": {
        "name_jp": "トリガーハッピーⅢ",
        "name_en": "Trigger Happy III",
        "description": "총기 공격 크리티컬 확률이 7.2% 증가한다.",
        "description_en": "Increase Critical Rate of Gun skills by 7.2% .",
        "description_jp": "銃撃属性のクリティカル率が7.2%上昇する。",
        "type": "패시브",
        "target": "자신",
        "icon": "패시브"
    },
    "총탄의 열광": {
        "name_jp": "トリガーハッピー",
        "name_en": "Trigger Happy",
        "description": "총기 공격 크리티컬 확률이 5.5%/7.2% 증가한다.",
        "description_en": "Increase Critical Rate of Gun skills by 5.5%/7.2% .",
        "description_jp": "銃撃属性のクリティカル率が5.5%/7.2%上昇する。",
        "type": "패시브",
        "icon": "패시브"
    },
    "고압 전류 I": {
        "name_jp": "高圧電流Ⅰ",
        "name_en": "Fortified Moxy I",
        "description": "선제 공격 시 크리티컬 확률이 4.2% 증가한다.",
        "description_en": "Increase Critical Rate by 4.2% when ambushing.",
        "description_jp": "先制攻撃時のクリティカル率が4.2%上昇する。",
        "type": "패시브",
        "target": "자신",
        "icon": "패시브"
    },
    "고압 전류 II": {
        "name_jp": "高圧電流Ⅱ",
        "name_en": "Fortified Moxy II",
        "description": "선제 공격 시 크리티컬 확률이 6.0% 증가한다.",
        "description_en": "Increase Critical Rate by 6% when ambushing",
        "description_jp": "先制攻撃時のクリティカル率が6.0%上昇する。",
        "type": "패시브",
        "target": "자신",
        "icon": "패시브"
    },
    "고압 전류 III": {
        "name_jp": "高圧電流Ⅲ",
        "name_en": "Fortified Moxy III",
        "description": "선제 공격 시 크리티컬 확률이 7.8% 증가한다.",
        "description_en": "Increase Critical Rate by 7.8% when ambushing.",
        "description_jp": "先制攻撃時のクリティカル率が7.8%上昇する。",
        "type": "패시브",
        "target": "자신",
        "icon": "패시브"
    },
    "고압 전류 IV": {
        "name_jp": "高圧電流Ⅳ",
        "name_en": "Fortified Moxy IV",
        "description": "선제 공격 시 크리티컬 확률이 9.7% 증가한다.",
        "description_en": "Increase Critical Rate by 9.7% when ambushing.",
        "description_jp": "先制攻撃時のクリティカル率が9.7%上昇する。",
        "type": "패시브",
        "target": "자신",
        "icon": "패시브"
    },
    "고압 전류": {
        "name_jp": "高圧電流",
        "name_en": "Fortified Moxy",
        "description": "선제 공격 시 크리티컬 확률이 4.2%/6.0%/7.8%/9.7% 증가한다.",
        "description_en": "Increase Critical Rate by 4.2%/6.0%/7.8%/9.7% when ambushing.",
        "description_jp": "先制攻撃時のクリティカル率が4.2%/6.0%/7.8%/9.7%上昇する。",
        "type": "패시브",
        "icon": "패시브"
    },
    "역경의 각오 I": {
        "name_jp": "逆境の覚悟Ⅰ",
        "name_en": "Adverse Resolve I",
        "description": "적에게 포위 시 크리티컬 확률이 4.6% 증가한다.",
        "description_en": "Increases CRIT by 4.6% when surrounded.",
        "description_jp": "ピンチエンカウント時のクリティカル率が4.6%上昇する。",
        "type": "패시브",
        "target": "자신",
        "icon": "패시브"
    },
    "역경의 각오 II": {
        "name_jp": "逆境の覚悟Ⅱ",
        "name_en": "Adverse Resolve II",
        "description": "적에게 포위 시 크리티컬 확률이 6.5% 증가한다.",
        "description_en": "Increases CRIT by 6.5% when surrounded.",
        "description_jp": "ピンチエンカウント時のクリティカル率が6.5%上昇する。",
        "type": "패시브",
        "target": "자신",
        "icon": "패시브"
    },
    "역경의 각오 III": {
        "name_jp": "逆境の覚悟Ⅲ",
        "name_en": "Adverse Resolve III",
        "description": "적에게 포위 시 크리티컬 확률이 8.5% 증가한다.",
        "description_en": "Increase Critical Rate by 8.5% when surrounded.",
        "description_jp": "ピンチエンカウント時のクリティカル率が8.5％上昇する。",
        "type": "패시브",
        "target": "자신",
        "icon": "패시브"
    },
    "역경의 각오 IV": {
        "name_jp": "逆境の覚悟Ⅳ",
        "name_en": "Adverse Resolve IV",
        "description": "적에게 포위 시 크리티컬 확률이 10.5% 증가한다.",
        "description_en": "Increase Critical Rate by 10.5% when surrounded.",
        "description_jp": "ピンチエンカウント時のクリティカル率が10.5％上昇する。",
        "type": "패시브",
        "target": "자신",
        "icon": "패시브"
    },
    "역경의 각오": {
        "name_jp": "逆境の覚悟",
        "name_en": "Adverse Resolve",
        "description": "적에게 포위 시 크리티컬 확률이 4.6%/6.5%/8.5%/10.5% 증가한다.",
        "description_en": "Increase Critical Rate by 4.6%/6.5%/8.5%/10.5% when surrounded.",
        "description_jp": "ピンチエンカウント時のクリティカル率が4.6%/6.5%/8.5%/10.5%上昇する。",
        "type": "패시브",
        "icon": "패시브"
    },
    "정교한 타격 I": {
        "name_jp": "ピンポイントⅠ",
        "name_en": "Pinpoint I",
        "description": "크리티컬 효과가 7% 증가한다.",
        "description_en": "Increases critical damage by 7% .",
        "description_jp": "クリティカルダメージが7%上昇する。",
        "type": "패시브",
        "target": "자신",
        "icon": "패시브"
    },
    "정교한 타격 II": {
        "name_jp": "ピンポイントⅡ",
        "name_en": "Pintpoint II",
        "description": "크리티컬 효과가 10% 증가한다.",
        "description_en": "Increases critical damage by 10% .",
        "description_jp": "クリティカルダメージが10%上昇する。",
        "type": "패시브",
        "target": "자신",
        "icon": "패시브"
    },
    "정교한 타격 III": {
        "name_jp": "ピンポイントⅢ",
        "name_en": "Pinpoint III",
        "description": "크리티컬 효과가 13% 증가한다.",
        "description_en": "Increases critical damage by 13% .",
        "description_jp": "クリティカルダメージが13%上昇する。",
        "type": "패시브",
        "target": "자신",
        "icon": "패시브"
    },
    "정교한 타격 IV": {
        "name_jp": "ピンポイントⅣ",
        "name_en": "Pinpoint IV",
        "description": "크리티컬 효과가 16.2% 증가한다.",
        "description_en": "Increases critical damage by 16.2% .",
        "description_jp": "クリティカルダメージが16.2％上昇する。",
        "type": "패시브",
        "target": "자신",
        "icon": "패시브"
    },
    "정교한 타격": {
        "name_jp": "ピンポイント",
        "name_en": "Pinpoint",
        "description": "크리티컬 효과가 7%/10%/13%/16.2% 증가한다.",
        "description_en": "Increases critical damage by 7%/10%/13%/16.2% .",
        "description_jp": "クリティカルダメージが7%/10%/13%/16.2%上昇する。",
        "type": "패시브",
        "icon": "패시브"
    },
    "마도의 재능 I": {
        "name_jp": "戦闘の才覚Ⅰ",
        "name_en": "Battle Acumen I",
        "description": "주는 대미지가 4.7% 증가한다.",
        "description_en": "Increase damage by 4.7% .",
        "description_jp": "与ダメージが4.7%上昇する。",
        "type": "패시브",
        "target": "자신",
        "icon": "패시브"
    },
    "마도의 재능 II": {
        "name_jp": "戦闘の才覚Ⅱ",
        "name_en": "Battle Acumen II",
        "description": "주는 대미지가 6.7% 증가한다.",
        "description_en": "Increase damage by 6.7% .",
        "description_jp": "与ダメージが6.7%上昇する。",
        "type": "패시브",
        "target": "자신",
        "icon": "패시브"
    },
    "마도의 재능 III": {
        "name_jp": "戦闘の才覚Ⅲ",
        "name_en": "Battle Acumen III",
        "description": "주는 대미지가 8.7% 증가한다.",
        "description_en": "Increase damage by 8.7% .",
        "description_jp": "与ダメージが8.7%上昇する。",
        "type": "패시브",
        "target": "자신",
        "icon": "패시브"
    },
    "마도의 재능 IV": {
        "name_jp": "戦闘の才覚Ⅳ",
        "name_en": "Battle Acumen IV",
        "description": "주는 대미지가 10.8% 증가한다.",
        "description_en": "Increase damage by 10.8% .",
        "description_jp": "与ダメージが10.8%上昇する。",
        "type": "패시브",
        "target": "자신",
        "icon": "패시브"
    },
    "마도의 재능 V": {
        "name_jp": "戦闘の才覚Ⅴ",
        "name_en": "Battle Acumen V",
        "description": "주는 대미지가 13.0% 증가한다.",
        "description_en": "Increase damage by 13.0% .",
        "description_jp": "与ダメージが13.0%上昇する。",
        "type": "패시브",
        "target": "자신",
        "icon": "패시브"
    },
    "마도의 재능": {
        "name_jp": "戦闘の才覚",
        "name_en": "Battle Acumen",
        "description": "주는 대미지가 4.7%/6.7%/8.7%/10.8%/13.0% 증가한다.",
        "description_en": "Increase damage by 4.7%/6.7%/8.7%/10.8%/13.0% .",
        "description_jp": "与ダメージが4.7%/6.7%/8.7%/10.8%/13.0%上昇する。",
        "type": "패시브",
        "icon": "패시브"
    },
    "물리 강화 I": {
        "name_jp": "物理ブースタⅠ",
        "name_en": "Phys Boost I",
        "description": "물리 속성 대미지가 4.7% 증가한다.",
        "description_en": "Increase Physical damage by 4.7% .",
        "description_jp": "物理属性の与ダメージが4.7%上昇する。",
        "type": "패시브",
        "target": "자신",
        "icon": "패시브"
    },
    "물리 강화 II": {
        "name_jp": "物理ブースタⅡ",
        "name_en": "Phys Boost II",
        "description": "물리 속성 대미지가 6.7% 증가한다.",
        "description_en": "Increase Physical damage by 6.7% .",
        "description_jp": "物理属性の与ダメージが6.7%上昇する。",
        "type": "패시브",
        "target": "자신",
        "icon": "패시브"
    },
    "물리 강화 III": {
        "name_jp": "物理ブースタⅢ",
        "name_en": "Phys Boost III",
        "description": "물리 속성 대미지가 8.7% 증가한다.",
        "description_en": "Increase Physical damage by 8.7% .",
        "description_jp": "物理属性の与ダメージが8.7%上昇する。",
        "type": "패시브",
        "target": "자신",
        "icon": "패시브"
    },
    "물리 강화 IV": {
        "name_jp": "物理ブースタⅣ",
        "name_en": "Phys Boost IV",
        "description": "물리 속성 대미지가 10.8% 증가한다.",
        "description_en": "Increase Physical damage by 10.8% .",
        "description_jp": "物理属性の与ダメージが10.8%上昇する。",
        "type": "패시브",
        "target": "자신",
        "icon": "패시브"
    },
    "물리 강화 V": {
        "name_jp": "物理ブースタⅤ",
        "name_en": "Phys Boost V",
        "description": "물리 속성 대미지가 13.0% 증가한다.",
        "description_en": "Increase Physical damage by 13.0% .",
        "description_jp": "物理属性の与ダメージが13.0%上昇する。",
        "type": "패시브",
        "target": "자신",
        "icon": "패시브"
    },
    "물리 강화": {
        "name_jp": "物理ブースタ",
        "name_en": "Phys Boost",
        "description": "물리 속성 대미지가 4.7%/6.7%/8.7%/10.8%/13.0% 증가한다.",
        "description_en": "Increase Physical damage by 4.7%/6.7%/8.7%/10.8%/13.0% .",
        "description_jp": "物理属性の与ダメージが4.7%/6.7%/8.7%/10.8%/13.0%上昇する。",
        "type": "패시브",
        "icon": "패시브"
    },
    "정밀한 사격 I": {
        "name_jp": "銃撃ブースタⅠ",
        "name_en": "Gun Boost I",
        "description": "총기 대미지가 4.7% 증가한다.",
        "description_en": "Increases Gun damage by 4.7% .",
        "description_jp": "銃撃属性の与ダメージが4.7%上昇する。",
        "type": "패시브",
        "target": "자신",
        "icon": "패시브"
    },
    "정밀한 사격 III": {
        "name_jp": "銃撃ブースタⅢ",
        "name_en": "Gun Boost III",
        "description": "총기 대미지가 8.7% 증가한다.",
        "description_en": "Increases Gun damage by 8.7% .",
        "description_jp": "銃撃属性の与ダメージが8.7%上昇する。",
        "type": "패시브",
        "target": "자신",
        "icon": "패시브"
    },
    "정밀한 사격": {
        "name_jp": "銃撃ブースタ",
        "name_en": "Gun Boost",
        "description": "총기 대미지가 4.7%/6.7%/8.7% 증가한다.",
        "description_en": "Increases Gun damage by 4.7%/6.7%/8.7% .",
        "description_jp": "銃撃属性の与ダメージが4.7%/6.7%/8.7%上昇する。",
        "type": "패시브",
        "icon": "패시브"
    },
    "화염 강화 I": {
        "name_jp": "火炎ブースタⅠ",
        "name_en": "Fire Boost I",
        "description": "화염 속성 대미지가 4.7% 증가한다.",
        "description_en": "Increases Fire damage by 4.7% .",
        "description_jp": "火炎属性の与ダメージが4.7%上昇する。",
        "type": "패시브",
        "target": "자신",
        "icon": "패시브"
    },
    "화염 강화 II": {
        "name_jp": "火炎ブースタⅡ",
        "name_en": "Fire Boost II",
        "description": "화염 속성 대미지가 6.7% 증가한다.",
        "description_en": "Increases Fire damage by 6.7% .",
        "description_jp": "火炎属性の与ダメージが6.7%上昇する。",
        "type": "패시브",
        "target": "자신",
        "icon": "패시브"
    },
    "화염 강화 III": {
        "name_jp": "火炎ブースタⅢ",
        "name_en": "Fire Boost III",
        "description": "화염 속성 대미지가 8.7% 증가한다.",
        "description_en": "Increases Fire damage by 8.7% .",
        "description_jp": "火炎属性の与ダメージが8.7%上昇する。",
        "type": "패시브",
        "target": "자신",
        "icon": "패시브"
    },
    "화염 강화": {
        "name_jp": "火炎ブースタ",
        "name_en": "Fire Boost",
        "description": "화염 속성 대미지가 4.7%/6.7%/8.7% 증가한다.",
        "description_en": "Increases Fire damage by 4.7%/6.7%/8.7% .",
        "description_jp": "火炎属性の与ダメージが4.7%/6.7%/8.7%上昇する。",
        "type": "패시브",
        "icon": "패시브"
    },
    "빙결 강화 I": {
        "name_jp": "氷結ブースタⅠ",
        "name_en": "Ice Boost I",
        "description": "빙결 속성 대미지가 4.7% 증가한다.",
        "description_en": "Increases Ice damage by 4.7% .",
        "description_jp": "氷結属性の与ダメージが4.7%上昇する。",
        "type": "패시브",
        "target": "자신",
        "icon": "패시브"
    },
    "빙결 강화 II": {
        "name_jp": "氷結ブースタⅡ",
        "name_en": "Ice Boost II",
        "description": "빙결 속성 대미지가 6.7% 증가한다.",
        "description_en": "Increases Ice damage by 6.7% .",
        "description_jp": "氷結属性の与ダメージが6.7%上昇する。",
        "type": "패시브",
        "target": "자신",
        "icon": "패시브"
    },
    "빙결 강화 III": {
        "name_jp": "氷結ブースタⅢ",
        "name_en": "Ice Boost III",
        "description": "빙결 속성 대미지가 8.7% 증가한다.",
        "description_en": "Increases Ice damage by 8.7% .",
        "description_jp": "氷結属性の与ダメージが8.7%上昇する。",
        "type": "패시브",
        "target": "자신",
        "icon": "패시브"
    },
    "빙결 강화 IV": {
        "name_jp": "氷結ブースタⅣ",
        "name_en": "Ice Boost IV",
        "description": "빙결 속성 대미지가 10.8% 증가한다.",
        "description_en": "Increases Ice damage by 10.8% .",
        "description_jp": "氷結속성の与ダメージが10.8%上昇する。",
        "type": "패시브",
        "target": "자신",
        "icon": "패시브"
    },
    "빙결 강화": {
        "name_jp": "氷結ブースタ",
        "name_en": "Ice Boost",
        "description": "빙결 속성 대미지가 4.7%/6.7%/8.7%/10.8% 증가한다.",
        "description_en": "Increases Ice damage by 4.7%/6.7%/8.7%/10.8% .",
        "description_jp": "氷結属性の与ダメージが4.7%/6.7%/8.7%/10.8%上昇する。",
        "type": "패시브",
        "icon": "패시브"
    },
    "전격 강화 I": {
        "name_jp": "電撃ブースタⅠ",
        "name_en": "Elec Boost I",
        "description": "전격 속성 대미지가 4.7% 증가한다.",
        "description_jp": "電撃属性の与ダメージが4.7%上昇する。",
        "description_en": "Increases Electric damage by 4.7% .",
        "type": "패시브",
        "target": "자신",
        "icon": "패시브"
    },
    "전격 강화 II": {
        "name_jp": "電撃ブースタⅡ",
        "name_en": "Elec Boost II",
        "description": "전격 속성 대미지가 6.7% 증가한다.",
        "description_jp": "電撃属性の与ダメージが6.7%上昇する。",
        "description_en": "Increases Electric damage by 6.7% .",
        "type": "패시브",
        "target": "자신",
        "icon": "패시브"
    },
    "전격 강화 III": {
        "name_jp": "電撃ブースタⅢ",
        "name_en": "Elec Boost III",
        "description": "전격 속성 대미지가 8.7% 증가한다.",
        "description_jp": "電撃属性の与ダメージが8.7%上昇する。",
        "description_en": "Increases Electric damage by 8.7% .",
        "type": "패시브",
        "target": "자신",
        "icon": "패시브"
    },
    "전격 강화 IV": {
        "name_jp": "電撃ブースタⅣ",
        "name_en": "Elec Boost IV",
        "description": "전격 속성 대미지가 10.8% 증가한다.",
        "description_jp": "電撃属性の与ダメージが10.8％上昇する。",
        "description_en": "Increases Electric damage by 10.8% .",
        "type": "패시브",
        "target": "자신",
        "icon": "패시브"
    },
    "전격 강화": {
        "name_jp": "電撃ブースタ",
        "name_en": "Elec Boost",
        "description": "전격 속성 대미지가 4.7%/6.7%/8.7%/10.8% 증가한다.",
        "description_jp": "電撃属性の与ダメージが4.7%/6.7%/8.7%/10.8%上昇する。",
        "description_en": "Increases Electric damage by 4.7%/6.7%/8.7%/10.8% .",
        "type": "패시브",
        "icon": "패시브"
    },
    "질풍 강화 I": {
        "name_jp": "疾風ブースタⅠ",
        "name_en": "Wind Boost I",
        "description": "질풍 속성 대미지가 4.7% 증가한다.",
        "description_jp": "疾風属性の与ダメージが4.7%上昇する。",
        "description_en": "Increases Wind damage by 4.7% .",
        "type": "패시브",
        "target": "자신",
        "icon": "패시브"
    },
    "질풍 강화 II": {
        "name_jp": "疾風ブースタⅡ",
        "name_en": "Wind Boost II",
        "description": "질풍 속성 대미지가 6.7% 증가한다.",
        "description_jp": "疾風属性の与ダメージが6.7%上昇する。",
        "description_en": "Increases Wind damage by 6.7% .",
        "type": "패시브",
        "target": "자신",
        "icon": "패시브"
    },
    "질풍 강화 III": {
        "name_jp": "疾風ブースタⅢ",
        "name_en": "Wind Boost III",
        "description": "질풍 속성 대미지가 8.7% 증가한다.",
        "description_jp": "疾風属性の与ダメージが8.7%上昇する。",
        "description_en": "Increases Wind damage by 8.7% .",
        "type": "패시브",
        "target": "자신",
        "icon": "패시브"
    },
    "질풍 강화 IV": {
        "name_jp": "疾風ブースタⅣ",
        "name_en": "Wind Boost IV",
        "description": "질풍 속성 대미지가 10.8% 증가한다.",
        "description_jp": "疾風属性の与ダメージが10.8%上昇する。",
        "description_en": "Increases Wind damage by 10.8% .",
        "type": "패시브",
        "target": "자신",
        "icon": "패시브"
    },
    "질풍 강화": {
        "name_jp": "疾風ブースタ",
        "name_en": "Wind Boost",
        "description": "질풍 속성 대미지가 4.7%/6.7%/8.7%/10.8% 증가한다.",
        "description_jp": "疾風属性の与ダメージが4.7%/6.7%/8.7%/10.8%上昇する。",
        "description_en": "Increases Wind damage by 4.7%/6.7%/8.7%/10.8% .",
        "type": "패시브",
        "icon": "패시브"
    },
    "핵열 강화 I": {
        "name_jp": "核熱ブースタⅠ",
        "name_en": "Nuke Boost I",
        "description": "핵열 속성 대미지가 4.7% 증가한다.",
        "description_jp": "核熱属性の与ダメージが4.7%上昇する。",
        "description_en": "Increases Nuclear damage by 4.7% .",
        "type": "패시브",
        "target": "자신",
        "icon": "패시브"
    },
    "핵열 강화 II": {
        "name_jp": "核熱ブースタⅡ",
        "name_en": "Nuke Boost II",
        "description": "핵열 속성 대미지가 6.7% 증가한다.",
        "description_jp": "核熱属性の与ダメージが6.7%上昇する。",
        "description_en": "Increases Nuclear damage by 6.7% .",
        "type": "패시브",
        "target": "자신",
        "icon": "패시브"
    },
    "핵열 강화 III": {
        "name_jp": "核熱ブースタⅢ",
        "name_en": "Nuke Boost III",
        "description": "핵열 속성 대미지가 8.7% 증가한다.",
        "description_jp": "核熱属性の与ダメージが8.7%上昇する。",
        "description_en": "Increases Nuclear damage by 8.7% .",
        "type": "패시브",
        "target": "자신",
        "icon": "패시브"
    },
    "핵열 강화 IV": {
        "name_jp": "核熱ブースタⅣ",
        "name_en": "Nuke Boost IV",
        "description": "핵열 속성 대미지가 10.8% 증가한다.",
        "description_jp": "核熱属性の与ダメージが10.8％上昇する。",
        "description_en": "Increases Nuclear damage by 10.8% .",
        "type": "패시브",
        "target": "자신",
        "icon": "패시브"
    },
    "핵열 강화": {
        "name_jp": "核熱ブースタ",
        "name_en": "Nuke Boost",
        "description": "핵열 속성 대미지가 4.7%/6.7%/8.7%/10.8% 증가한다.",
        "description_jp": "核熱属性の与ダメージが4.7%/6.7%/8.7%/10.8%上昇する。",
        "description_en": "Increases Nuclear damage by 4.7%/6.7%/8.7%/10.8% .",
        "type": "패시브",
        "icon": "패시브"
    },
    "염동 강화 I": {
        "name_jp": "念動ブースタⅠ",
        "name_en": "Psy Boost I",
        "description": "염동 속성 대미지가 4.7% 증가한다.",
        "description_jp": "念動属性の与ダメージが4.7%上昇する。",
        "description_en": "Increases Psy damage by 4.7% .",
        "type": "패시브",
        "target": "자신",
        "icon": "패시브"
    },
    "염동 강화 II": {
        "name_jp": "念動ブースタⅡ",
        "name_en": "Psy Boost II",
        "description": "염동 속성 대미지가 6.7% 증가한다.",
        "description_jp": "念動属性の与ダメージが6.7%上昇する。",
        "description_en": "Increases Psy damage by 6.7% .",
        "type": "패시브",
        "target": "자신",
        "icon": "패시브"
    },
    "염동 강화 III": {
        "name_jp": "念動ブースタⅢ",
        "name_en": "Psy Boost III",
        "description": "염동 속성 대미지가 8.7% 증가한다.",
        "description_jp": "念動属性の与ダメージが8.7%上昇する。",
        "description_en": "Increases Psy damage by 8.7% .",
        "type": "패시브",
        "target": "자신",
        "icon": "패시브"
    },
    "염동 강화 IV": {
        "name_jp": "念動ブースタⅣ",
        "name_en": "Psy Boost IV",
        "description": "염동 속성 대미지가 10.8% 증가한다.",
        "description_jp": "念動属性の与ダメージが10.8％上昇する。",
        "description_en": "Increases Psy damage by 10.8% .",
        "type": "패시브",
        "target": "자신",
        "icon": "패시브"
    },
    "염동 강화": {
        "name_jp": "念動ブースタ",
        "name_en": "Psy Boost",
        "description": "염동 속성 대미지가 4.7%/6.7%/8.7%/10.8% 증가한다.",
        "description_jp": "念動属性の与ダメージが4.7%/6.7%/8.7%/10.8%上昇する。",
        "description_en": "Increases Psy damage by 4.7%/6.7%/8.7%/10.8% .",
        "type": "패시브",
        "icon": "패시브"
    },
    "축복 강화 I": {
        "name_jp": "祝福ブースタⅠ",
        "name_en": "Bless Boost I",
        "description": "축복 속성 대미지가 4.7% 증가한다.",
        "description_jp": "祝福属性の与ダメージが4.7%上昇する。",
        "description_en": "Increases Bless damage by 4.7% .",
        "type": "패시브",
        "target": "자신",
        "icon": "패시브"
    },
    "축복 강화 II": {
        "name_jp": "祝福ブースタⅡ",
        "name_en": "Bless Boost II",
        "description": "축복 속성 대미지가 6.7% 증가한다.",
        "description_jp": "祝福属性の与ダメージが6.7%上昇する。",
        "description_en": "Increases Bless damage by 6.7% .",
        "type": "패시브",
        "target": "자신",
        "icon": "패시브"
    },
    "축복 강화 III": {
        "name_jp": "祝福ブースタⅢ",
        "name_en": "Bless Boost III",
        "description": "축복 속성 대미지가 8.7% 증가한다.",
        "description_jp": "祝福属性の与ダメージが8.7%上昇する。",
        "description_en": "Increases Bless damage by 8.7% .",
        "type": "패시브",
        "target": "자신",
        "icon": "패시브"
    },
    "축복 강화": {
        "name_jp": "祝福ブースタ",
        "name_en": "Bless Boost",
        "description": "축복 속성 대미지가 4.7%/6.7%/8.7% 증가한다.",
        "description_jp": "祝福属性の与ダメージが4.7%/6.7%/8.7%上昇する。",
        "description_en": "Increases Bless damage by 4.7%/6.7%/8.7% .",
        "type": "패시브",
        "icon": "패시브"
    },
    "주원 강화 I": {
        "name_jp": "呪怨ブースタⅠ",
        "name_en": "Curse Boost I",
        "description": "주원 속성 대미지가 4.7% 증가한다.",
        "description_jp": "呪怨属性の与ダメージが4.7%上昇する。",
        "description_en": "Increases Curse damage by 4.7% .",
        "type": "패시브",
        "target": "자신",
        "icon": "패시브"
    },
    "주원 강화 II": {
        "name_jp": "呪怨ブースタⅡ",
        "name_en": "Curse Boost II",
        "description": "주원 속성 대미지가 6.7% 증가한다.",
        "description_jp": "呪怨属性の与ダメージが6.7%上昇する。",
        "description_en": "Increases Curse damage by 6.7% .",
        "type": "패시브",
        "target": "자신",
        "icon": "패시브"
    },
    "주원 강화 III": {
        "name_jp": "呪怨ブースタⅢ",
        "name_en": "Curse Boost III",
        "description": "주원 속성 대미지가 8.7% 증가한다.",
        "description_jp": "呪怨属性の与ダメージが8.7%上昇する。",
        "description_en": "Increases Curse damage by 8.7% .",
        "type": "패시브",
        "target": "자신",
        "icon": "패시브"
    },
    "주원 강화 IV": {
        "name_jp": "呪怨ブースタⅣ",
        "name_en": "Curse Boost IV",
        "description": "주원 속성 대미지가 10.8% 증가한다.",
        "description_jp": "呪怨属性の与ダメージが10.8%上昇する。",
        "description_en": "Increases Curse damage by 10.8% .",
        "type": "패시브",
        "target": "자신",
        "icon": "패시브"
    },
    "주원 강화": {
        "name_jp": "呪怨ブースタ",
        "name_en": "Curse Boost",
        "description": "주원 속성 대미지가 4.7%/6.7%/8.7%/10.8% 증가한다.",
        "description_jp": "呪怨属性の与ダメージが4.7%/6.7%/8.7%/10.8%上昇する。",
        "description_en": "Increases Curse damage by 4.7%/6.7%/8.7%/10.8% .",
        "type": "패시브",
        "icon": "패시브"
    },
    "만능 강화 III": {
        "name_jp": "万能ブースタⅢ",
        "name_en": "Almighty Boost III",
        "description": "만능 속성 대미지가 8.7% 증가한다.",
        "description_jp": "万能属性の与ダメージが8.7%上昇する。",
        "description_en": "Increases Almighty damage by 8.7% .",
        "type": "패시브",
        "target": "자신",
        "icon": "패시브"
    },
    "치료 강화 I": {
        "name_jp": "治療ブースタⅠ",
        "name_en": "Healing Boost I",
        "description": "주는 치료 효과가 4.2% 증가한다.",
        "description_jp": "回復量が4.2%上昇する。",
        "description_en": "Increases Healing Effect by 4.2% .",
        "type": "패시브",
        "target": "자신",
        "icon": "패시브"
    },
    "치료 강화 II": {
        "name_jp": "治療ブースタⅡ",
        "name_en": "Healing Boost II",
        "description": "주는 치료 효과가 6.0% 증가한다.",
        "description_jp": "回復量が6.0%上昇する。",
        "description_en": "Increases Healing Effect by 6% .",
        "type": "패시브",
        "target": "자신",
        "icon": "패시브"
    },
    "치료 강화 III": {
        "name_jp": "治療ブースタⅢ",
        "name_en": "Healing Boost III",
        "description": "주는 치료 효과가 7.8% 증가한다.",
        "description_jp": "回復量が7.8%上昇する。",
        "description_en": "Increase Healing Effect by 7.8% .",
        "type": "패시브",
        "target": "자신",
        "icon": "패시브"
    },
    "치료 강화 IV": {
        "name_jp": "治療ブースタⅣ",
        "name_en": "Healing Boost IV",
        "description": "주는 치료 효과가 9.7% 증가한다.",
        "description_jp": "回復量が9.7%上昇する。",
        "description_en": "Increase Healing Effect by 9.7% .",
        "type": "패시브",
        "target": "자신",
        "icon": "패시브"
    },
    "치료 강화": {
        "name_jp": "治療ブースタ",
        "name_en": "Healing Boost",
        "description": "주는 치료 효과가 4.2%/6.0%/7.8%/9.7% 증가한다.",
        "description_jp": "回復量が4.2%/6.0%/7.8%/9.7%上昇する。",
        "description_en": "Increases Healing Effect by 4.2%/6.0%/7.8%/9.7% .",
        "type": "패시브",
        "icon": "패시브"
    },
    "생명 강화 I": {
        "name_jp": "分の活泉Ⅰ",
        "name_en": "Life Boost I",
        "description": "생명이 5.1% 증가한다.",
        "description_jp": "体力が5.1%増える。",
        "description_en": "Increases HP by 5.1% .",
        "type": "패시브",
        "target": "자신",
        "icon": "패시브"
    },
    "생명 강화 II": {
        "name_jp": "分の活泉Ⅱ",
        "name_en": "Life Boost II",
        "description": "생명이 8.3% 증가한다.",
        "description_jp": "体力が8.3%増える。",
        "description_en": "Increase HP by 8.3% .",
        "type": "패시브",
        "target": "자신",
        "icon": "패시브"
    },
    "생명 강화 III": {
        "name_jp": "分の活泉Ⅲ",
        "name_en": "Life Boost III",
        "description": "생명이 10.8% 증가한다.",
        "description_jp": "体力が10.8%増える。",
        "description_en": "Increase HP by 10.8% .",
        "type": "패시브",
        "target": "자신",
        "icon": "패시브"
    },
    "생명 강화 IV": {
        "name_jp": "分の活泉Ⅳ",
        "name_en": "Life Boost IV",
        "description": "생명이 13.5% 증가한다.",
        "description_jp": "体力が13.5%増える。",
        "description_en": "Increase HP by 13.5% .",
        "type": "패시브",
        "target": "자신",
        "icon": "패시브"
    },
    "생명 강화": {
        "name_jp": "分の活泉",
        "name_en": "Life Boost",
        "description": "생명이 5.1%/8.3%/10.8%/13.5% 증가한다.",
        "description_jp": "体力が5.1%/8.3%/10.8%/13.5%増える。",
        "description_en": "Increase HP by 5.1%/8.3%/10.8%/13.5% .",
        "type": "패시브",
        "icon": "패시브"
    },
    "방어 강화 I": {
        "name_jp": "プロテクブースタⅠ",
        "name_en": "Protect Boost I",
        "description": "방어력이 8.8% 증가한다.",
        "description_jp": "防御力が8.8%上昇する。",
        "description_en": "Increases DEF by 8.8% .",
        "type": "패시브",
        "target": "자신",
        "icon": "패시브"
    },
    "방어 강화 II": {
        "name_jp": "プロテクブースタⅡ",
        "name_en": "Protect Boost II",
        "description": "방어력이 12.5% 증가한다.",
        "description_jp": "防御力が12.5%上昇する。",
        "description_en": "Increases DEF by 12.5% .",
        "type": "패시브",
        "target": "자신",
        "icon": "패시브"
    },
    "방어 강화 III": {
        "name_jp": "プロテクブースタⅢ",
        "name_en": "Protect Boost III",
        "description": "방어력이 16.3% 증가한다.",
        "description_jp": "防御力が16.3%上昇する。",
        "description_en": "Increase DEF by 16.3% .",
        "type": "패시브",
        "target": "자신",
        "icon": "패시브"
    },
    "방어 강화": {
        "name_jp": "プロテクブースタ",
        "name_en": "Protect Boost",
        "description": "방어력이 8.8%/12.5%/16.3% 증가한다.",
        "description_jp": "防御力が8.8%/12.5%/16.3%上昇する。",
        "description_en": "Increases DEF by 8.8%/12.5%/16.3% .",
        "type": "패시브",
        "icon": "패시브"
    },
    "대미지 면역 I": {
        "name_jp": "レデュースブースタⅠ",
        "name_en": "Reduction Boost I",
        "description": "받는 대미지가 4.7% 감소한다.",
        "description_jp": "受けるダメージが4.7%軽減される。",
        "description_en": "Decreases damage taken by 4.7% .",
        "type": "패시브",
        "target": "자신",
        "icon": "패시브"
    },
    "대미지 면역 II": {
        "name_jp": "レデュースブースタⅡ",
        "name_en": "Reduction Boost II",
        "description": "받는 대미지가 6.7% 감소한다.",
        "description_jp": "受けるダメージが6.7%軽減される。",
        "description_en": "Decrease damage taken by 6.7% .",
        "type": "패시브",
        "target": "자신",
        "icon": "패시브"
    },
    "대미지 면역 III": {
        "name_jp": "レデュースブースタⅢ",
        "name_en": "Reduction Boost III",
        "description": "받는 대미지가 8.7% 감소한다.",
        "description_jp": "受けるダメージが8.7%軽減される。",
        "description_en": "Decrease damage taken by 8.7% .",
        "type": "패시브",
        "target": "자신",
        "icon": "패시브"
    },
    "대미지 면역 IV": {
        "name_jp": "レデュースブースタⅣ",
        "name_en": "Reduction Boost IV",
        "description": "받는 대미지가 10.8% 감소한다.",
        "description_jp": "受けるダメージが10.8%軽減される。",
        "description_en": "Decrease damage taken by 10.8% .",
        "type": "패시브",
        "target": "자신",
        "icon": "패시브"
    },
    "대미지 면역": {
        "name_jp": "レデュースブースタ",
        "name_en": "Reduction Boost",
        "description": "받는 대미지가 4.7%/6.7%/8.7%/10.8% 감소한다.",
        "description_jp": "受けるダメージが4.7%/6.7%/8.7%/10.8%軽減される。",
        "description_en": "Decrease damage taken by 4.7%/6.7%/8.7%/10.8% .",
        "type": "패시브",
        "icon": "패시브"
    },
    "치료 촉진 I": {
        "name_jp": "治療促進Ⅰ",
        "name_en": "Regenerate I",
        "description": "턴 시작 시 최대 생명 1.9%를 회복한다.",
        "description_jp": "ターン開始時に最大HPの1.9%を回復する。",
        "description_en": "Restores 1.9% of Max HP at the start of each turn.",
        "type": "패시브",
        "target": "자신",
        "icon": "패시브"
    },
    "치료 촉진 II": {
        "name_jp": "治療促進Ⅱ",
        "name_en": "Regenerate II",
        "description": "턴 시작 시 최대 생명 2.7%를 회복한다.",
        "description_jp": "ターン開始時に最大HPの2.7%を回復する。",
        "description_en": "Restores 2.7% of Max HP at the start of each turn.",
        "type": "패시브",
        "target": "자신",
        "icon": "패시브"
    },
    "치료 촉진 III": {
        "name_jp": "治療促進Ⅲ",
        "name_en": "Regenerate III",
        "description": "턴 시작 시 최대 생명 3.5%를 회복한다.",
        "description_jp": "ターン開始時に最大HPの3.5%を回復する。",
        "description_en": "Restore 3.5% of Max HP at the start of each turn.",
        "type": "패시브",
        "target": "자신",
        "icon": "패시브"
    },
    "치료 촉진": {
        "name_jp": "治療促進",
        "name_en": "Regenerate",
        "description": "턴 시작 시 최대 생명 1.9%/2.7%/3.5%를 회복한다.",
        "description_jp": "ターン開始時に最大HPの1.9%/2.7%/3.5%を回復する。",
        "description_en": "Restores 1.9%/2.7%/3.5% of Max HP at the start of each turn.",
        "type": "패시브",
        "icon": "패시브"
    },
    "명중 강화 I": {
        "name_jp": "異常命中ブースタⅠ",
        "name_en": "Accuracy Boost I",
        "description": "효과 명중이 7% 증가한다.",
        "description_jp": "状態異常命中が7%上昇する。",
        "description_en": "Increase ailment accuracy by 7%.",
        "type": "패시브",
        "target": "자신",
        "icon": "패시브"
    },
    "명중 강화 II": {
        "name_jp": "異常命中ブースタⅡ",
        "name_en": "Accuracy Boost II",
        "description": "효과 명중이 10% 증가한다.",
        "description_jp": "状態異常命中が10%上昇する。",
        "description_en": "Increase ailment accuracy by 10% .",
        "type": "패시브",
        "target": "자신",
        "icon": "패시브"
    },
    "명중 강화 III": {
        "name_jp": "異常命中ブースタⅢ",
        "name_en": "Accuracy Boost III",
        "description": "효과 명중이 13% 증가한다.",
        "description_jp": "状態異常命中が13%上昇する。",
        "description_en": "Increase ailment accuracy by 13% .",
        "type": "패시브",
        "target": "자신",
        "icon": "패시브"
    },
    "명중 강화 IV": {
        "name_jp": "異常命中ブースタⅣ",
        "name_en": "Accuracy Boost IV",
        "description": "효과 명중이 16.2% 증가한다.",
        "description_jp": "状態異常命中が16.2%上昇する。",
        "description_en": "Increase ailment accuracy by 16.2% .",
        "type": "패시브",
        "target": "자신",
        "icon": "패시브"
    },
    "명중 강화 V": {
        "name_jp": "異常命中ブースタⅤ",
        "name_en": "Accuracy Boost V",
        "description": "효과 명중이 19.4% 증가한다.",
        "description_jp": "状態異常命中が19.4%上昇する。",
        "description_en": "Increase ailment accuracy by 19.4% .",
        "type": "패시브",
        "target": "자신",
        "icon": "패시브"
    },
    "명중 강화": {
        "name_jp": "異常命中ブースタ",
        "name_en": "Accuracy Boost",
        "description": "효과 명중이 7%/10%/13%/16.2%/19.4% 증가한다.",
        "description_jp": "状態異常命中が7%/10%/13%/16.2%/19.4%上昇する。",
        "description_en": "Increase ailment accuracy by 7%/10%/13%/16.2%/19.4% .",
        "type": "패시브",
        "icon": "패시브"
    },
    "화상률 UP I": {
        "name_jp": "炎上率UPⅠ",
        "name_en": "Burn Boost I",
        "description": "화상 효과 부여 시 효과 명중이 8.8% 증가한다.",
        "description_jp": "炎上の命中率が8.8%上昇する。",
        "description_en": "Increases Burn accuracy by 8.8% .",
        "type": "패시브",
        "target": "자신",
        "icon": "패시브"
    },
    "화상률 UP II": {
        "name_jp": "炎上率UPⅡ",
        "name_en": "Burn Boost II",
        "description": "화상 효과 부여 시 효과 명중이 12.5% 증가한다.",
        "description_jp": "炎上の命中率が12.5%上昇する。",
        "description_en": "Increases Burn accuracy by 12.5% .",
        "type": "패시브",
        "target": "자신",
        "icon": "패시브"
    },
    "화상률 UP III": {
        "name_jp": "炎上率UPⅢ",
        "name_en": "Burn Boost III",
        "description": "화상 효과 부여 시 효과 명중이 16.3% 증가한다.",
        "description_jp": "炎上の命中率が16.3%上昇する。",
        "description_en": "Increase Burn accuracy by 16.3% .",
        "type": "패시브",
        "target": "자신",
        "icon": "패시브"
    },
    "화상률 UP": {
        "name_jp": "炎上率UP",
        "name_en": "Burn Boost",
        "description": "화상 효과 부여 시 효과 명중이 8.8%/12.5%/16.3% 증가한다.",
        "description_jp": "炎上の命中率が8.8%/12.5%/16.3%上昇する。",
        "description_en": "Increases Burn accuracy by 8.8%/12.5%/16.3% .",
        "type": "패시브",
        "icon": "패시브"
    },
    "빙결률 UP I": {
        "name_jp": "凍結率UPⅠ",
        "name_en": "Freeze Boost I",
        "description": "빙결 효과 부여 시 효과 명중이 8.8% 증가한다.",
        "description_jp": "凍結の命中率が8.8%上昇する。",
        "description_en": "Increases Freeze accuracy by 8.8% .",
        "type": "패시브",
        "target": "자신",
        "icon": "패시브"
    },
    "빙결률 UP II": {
        "name_jp": "凍結率UPⅡ",
        "name_en": "Freeze Boost II",
        "description": "빙결 효과 부여 시 효과 명중이 12.5% 증가한다.",
        "description_jp": "凍結の命중率が12.5%上昇する。",
        "description_en": "Increase Freeze accuracy by 12.5% .",
        "type": "패시브",
        "target": "자신",
        "icon": "패시브"
    },
    "빙결률 UP III": {
        "name_jp": "凍結率UPⅢ",
        "name_en": "Freeze Boost III",
        "description": "빙결 효과 부여 시 효과 명중이 16.3% 증가한다.",
        "description_jp": "凍結の命중率が16.3%上昇する。",
        "description_en": "Increase Freeze accuracy by 16.3% .",
        "type": "패시브",
        "target": "자신",
        "icon": "패시브"
    },
    "빙결률 UP": {
        "name_jp": "凍結率UP",
        "name_en": "Freeze Boost",
        "description": "빙결 효과 부여 시 효과 명중이 8.8%/12.5%/16.3% 증가한다.",
        "description_jp": "凍結の命中率が8.8%/12.5%/16.3%上昇する。",
        "description_en": "Increases Freeze accuracy by 8.8%/12.5%/16.3% .",
        "type": "패시브",
        "icon": "패시브"
    },
    "감전율 UP I": {
        "name_jp": "感電率UPⅠ",
        "name_en": "Shock Boost I",
        "description": "감전 효과 부여 시 효과 명중이 8.8% 증가한다.",
        "description_jp": "感電の命中率が8.8%上昇する。",
        "description_en": "Increase Shock accuracy by 8.8% .",
        "type": "패시브",
        "target": "자신",
        "icon": "패시브"
    },
    "감전율 UP II": {
        "name_jp": "感電率UPⅡ",
        "name_en": "Shock Boost II",
        "description": "감전 효과 부여 시 효과 명중이 12.5% 증가한다.",
        "description_jp": "感電の命中率が12.5%上昇する。",
        "description_en": "Increase Shock Accuracy by 12.5% .",
        "type": "패시브",
        "target": "자신",
        "icon": "패시브"
    },
    "감전율 UP III": {
        "name_jp": "感電率UPⅢ",
        "name_en": "Shock Boost III",
        "description": "감전 효과 부여 시 효과 명중이 16.3% 증가한다.",
        "description_jp": "感電の命中率が16.3%上昇する。",
        "description_en": "Increase Shock accuracy by 16.3% .",
        "type": "패시브",
        "target": "자신",
        "icon": "패시브"
    },
    "감전율 UP IV": {
        "name_jp": "感電率UPⅣ",
        "name_en": "Shock Boost IV",
        "description": "감전 효과 부여 시 효과 명중이 20.3% 증가한다.",
        "description_jp": "感電の命中率が20.3％上昇する。",
        "description_en": "Increase Shock accuracy by 20.3% .",
        "type": "패시브",
        "target": "자신",
        "icon": "패시브"
    },
    "감전율 UP": {
        "name_jp": "感電率UP",
        "name_en": "Shock Boost",
        "description": "감전 효과 부여 시 효과 명중이 8.8%/12.5%/16.3%/20.3% 증가한다.",
        "description_jp": "感電の命中率が8.8%/12.5%/16.3%/20.3%上昇する。",
        "description_en": "Increase Shock accuracy by 8.8%/12.5%/16.3%/20.3% .",
        "type": "패시브",
        "icon": "패시브"
    },
    "질풍률 UP I": {
        "name_jp": "風襲率UPⅠ",
        "name_en": "Windswept Boost I",
        "description": "풍습 효과 부여 시 효과 명중이 8.8% 증가한다.",
        "description_jp": "風襲の命中率が8.8%上昇する。",
        "description_en": "Increase Windswept accuracy by 8.8% .",
        "type": "패시브",
        "target": "자신",
        "icon": "패시브"
    },
    "질풍률 UP II": {
        "name_jp": "風襲率UPⅡ",
        "name_en": "Windswept Boost II",
        "description": "풍습 효과 부여 시 효과 명중이 12.5% 증가한다.",
        "description_jp": "風襲の命中率が12.5%上昇する。",
        "description_en": "Increase Windswept accuracy by 12.5% .",
        "type": "패시브",
        "target": "자신",
        "icon": "패시브"
    },
    "질풍률 UP III": {
        "name_jp": "風襲率UPⅢ",
        "name_en": "Windswept Boost III",
        "description": "풍습 효과 부여 시 효과 명중이 16.3% 증가한다.",
        "description_jp": "風襲の命中率が16.3%上昇する。",
        "description_en": "Increases Windswept accuracy by 16.3% .",
        "type": "패시브",
        "target": "자신",
        "icon": "패시브"
    },
    "질풍률 UP": {
        "name_jp": "風襲率UP",
        "name_en": "Windswept Boost",
        "description": "풍습 효과 부여 시 효과 명중이 8.8%/12.5%/16.3% 증가한다.",
        "description_jp": "風襲の命中率が8.8%/12.5%/16.3%上昇する。",
        "description_en": "Increases Windswept accuracy by 8.8%/12.5%/16.3% .",
        "type": "패시브",
        "icon": "패시브"
    },
    "우중충한 하늘 I": {
        "name_jp": "浮かない空Ⅰ",
        "name_en": "Ambient Aid I",
        "description": "비가 내릴 때 이상 효과 부여 시 효과 명중이 9.1% 증가한다.",
        "description_jp": "雨・雪・注意報が出ている時、状態異常攻撃の付着率が9.1%上昇する。",
        "description_en": "Increase ailment accuracy by 9.1% when it rains.",
        "type": "패시브",
        "target": "자신",
        "icon": "패시브"
    },
    "우중충한 하늘 II": {
        "name_jp": "浮かない空Ⅱ",
        "name_en": "Ambient Aid II",
        "description": "비가 내릴 때 이상 효과 부여 시 효과 명중이 13% 증가한다.",
        "description_jp": "雨・雪・注意報が出ている時、状態異常攻撃の付着率が13%上昇する。",
        "description_en": "Increase ailment accuracy by 13% when it rains.",
        "type": "패시브",
        "target": "자신",
        "icon": "패시브"
    },
    "우중충한 하늘 III": {
        "name_jp": "浮かない空Ⅲ",
        "name_en": "Ambient Aid III",
        "description": "비가 내릴 때 이상 효과 부여 시 효과 명중이 16.9% 증가한다.",
        "description_jp": "雨・雪・注意報が出ている時、状態異常攻撃の付着率が16.9%上昇する。",
        "description_en": "Increase ailment accuracy by 16.9% when it rains.",
        "type": "패시브",
        "target": "자신",
        "icon": "패시브"
    },
    "우중충한 하늘": {
        "name_jp": "浮かない空",
        "name_en": "Ambient Aid",
        "description": "비가 내릴 때 이상 효과 부여 시 효과 명중이 9.1%/13%/16.9% 증가한다.",
        "description_jp": "雨・雪・注意報が出ている時、状態異常攻撃の付着率が9.1%/13%/16.9%上昇する。",
        "description_en": "Increase ailment accuracy by 9.1%/13%/16.9% when it rains.",
        "type": "패시브",
        "icon": "패시브"
    },
    "민첩의 마음가짐 I": {
        "name_jp": "敏捷の心得Ⅰ",
        "name_en": "Agility Master I",
        "description": "속도가 6포인트 증가하고, 방어력이 0% 감소한다.",
        "description_jp": "速さが6上昇し、防御力が0%低下する。",
        "description_en": "Increases SPD by 6 .",
        "type": "패시브",
        "target": "자신",
        "icon": "패시브"
    },
    "민첩의 마음가짐 II": {
        "name_jp": "敏捷の心得Ⅱ",
        "name_en": "Agility Master II",
        "description": "속도가 9포인트 증가하고, 방어력이 4% 감소한다.",
        "description_jp": "速さが9上昇し、防御力が4%低下する。",
        "description_en": "Increases SPD by 9 and decreases DEF by 4% .",
        "type": "패시브",
        "target": "자신",
        "icon": "패시브"
    },
    "민첩의 마음가짐 III": {
        "name_jp": "敏捷の心得Ⅲ",
        "name_en": "Agility Master III",
        "description": "속도가 12포인트 증가하고, 방어력이 8% 감소한다.",
        "description_jp": "速さが12上昇し、防御力が8%低下する。",
        "description_en": "Increases SPD by 12 and decreases DEF by 8% .",
        "type": "패시브",
        "target": "자신",
        "icon": "패시브"
    },
    "민첩의 마음가짐 IV": {
        "name_jp": "敏捷の心得Ⅳ",
        "name_en": "Agility Master IV",
        "description": "속도가 15포인트 증가하고, 방어력이 12% 감소한다.",
        "description_jp": "速さが15上昇し、防御力が12%低下する。",
        "description_en": "Increases SPD by 15 and decreases DEF by 12% .",
        "type": "패시브",
        "target": "자신",
        "icon": "패시브"
    },
    "민첩의 마음가짐": {
        "name_jp": "敏捷の心得",
        "name_en": "Agility Master",
        "description": "속도가 6/9/12/15포인트 증가하고, 방어력이 0%/4%/8%/12% 감소한다.",
        "description_jp": "速さが6/9/12/15上昇し、防御力が0%/4%/8%/12%低下する。",
        "description_en": "Increases SPD by 6/9/12/15 and decreases DEF by 0%/4%/8%/12% .",
        "type": "패시브",
        "icon": "패시브"
    },
    "실드 강화": {
        "name_jp": "シールドブースタ",
        "name_en": "Shield Boost",
        "description": "실드 효과가 4.2%/-/7.8%/9.7% 증가한다.",
        "description_jp": "シールド効果が4.2%/-/7.8%/9.7%上昇する。",
        "description_en": "Increase Shield Effect by 4.2%/-/7.8%/9.7% .",
        "type": "패시브",
        "icon": "패시브"
    }
};





