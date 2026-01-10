// Korean → English mapping
const mapping_en = {
    // Main revelations
    "탄생": "Nativity",
    "돌파": "Perseverance",
    "희망": "Hope",
    "창조": "Creation",
    "깨달음": "Awareness",
    "여정": "Departure",
    "성장": "Growth",
    "지혜": "Wisdom",
    "전념": "Meditation",
    "신념": "Faith",
    "신뢰": "Trust",
    "조화": "Harmony",
    "결심": "Resolve",
    "수락": "Acceptance",
    "자유": "Freedom",
    "진정성": "Integrity",
    "예리": "Agility",
    // Sub revelations
    "슬픔": "Sorrow",
    "변화": "Transformation",
    "신중": "Prudence",
    "고집": "Fixation",
    "헛수고": "Futility",
    "실망": "Despair",
    "우려": "Worry",
    "화해": "Reconcilation",
    "진리": "Truth",
    "주권": "Control",
    "방해": "Hindrance",
    "풍요": "Prosperity",
    "화려": "Opulence",
    "변환": "Renewal",
    "힘": "Power",
    "억압": "Oppression",
    "환희": "Pleasure",
    "미덕": "Virtue",
    "용맹": "Courage",
    "사랑": "Love",
    "평화": "Peace",
    "승리": "Victory",
    "직책": "Labor",
    "분쟁": "Strife",
    "개선": "Triumph",
    "좌절": "Defeat",
    "풍족": "Satiety",
    "획득": "Obtain"
};

// English revelation data
const enRevelationData = {
    // Mapping for image paths (Korean -> English)
    "mapping_en": mapping_en,
    // Korean -> English translation mapping
    "mainTranslated": {
        "탄생": "Nativity",
        "돌파": "Perseverance",
        "희망": "Hope",
        "창조": "Creation",
        "깨달음": "Awareness",
        "여정": "Departure",
        "성장": "Growth",
        "지혜": "Wisdom",
        "전념": "Meditation",
        "신념": "Faith",
        "신뢰": "Trust",
        "조화": "Harmony",
        "결심": "Resolve",
        "수락": "Acceptance",
        "자유": "Freedom",
        "진정성": "Integrity",
        "예리": "Agility"
    },
    "subTranslated": {
        "슬픔": "Sorrow",
        "변화": "Transformation",
        "신중": "Prudence",
        "고집": "Fixation",
        "헛수고": "Futility",
        "실망": "Despair",
        "우려": "Worry",
        "화해": "Reconcilation",
        "진리": "Truth",
        "주권": "Control",
        "방해": "Hindrance",
        "풍요": "Prosperity",
        "화려": "Opulence",
        "변환": "Renewal",
        "힘": "Power",
        "억압": "Oppression",
        "환희": "Pleasure",
        "미덕": "Virtue",
        "용맹": "Courage",
        "사랑": "Love",
        "평화": "Peace",
        "승리": "Victory",
        "직책": "Labor",
        "분쟁": "Strife",
        "개선": "Triumph",
        "좌절": "Defeat",
        "풍족": "Satiety",
        "획득": "Obtain"
    },
    "main": {
        "Nativity": ["Power"], // 탄생
        "Agility": ["Satiety"], // 예리
        "Perseverance": ["Sorrow", "Transformation", "Obtain"], //돌파
        "Hope": ["Labor", "Fixation", "Transformation"], // 희망
        "Creation": ["Worry", "Reconcilation"], // 창조 
        "Integrity": ["Pleasure", "Labor", "Fixation"], // 진정성
        "Resolve": ["Virtue", "Labor", "Prudence"], // 결심
        "Awareness": ["Truth", "Control", "Hindrance"], // 깨달음
        "Departure": ["Control", "Prosperity", "Hindrance"], // 여정
        "Growth": ["Opulence", "Renewal", "Power"], // 성장
        "Wisdom": ["Oppression", "Pleasure", "Virtue"], // 지혜
        "Meditation": ["Opulence", "Courage", "Love"], // 전념
        "Faith": ["Peace", "Love", "Futility"], // 신념
        "Trust": ["Renewal", "Power", "Prosperity"], // 신뢰
        "Harmony": ["Victory", "Power", "Truth"], // 조화
        "Acceptance": ["Peace", "Strife", "Love"], // 수락
        "Freedom": ["Triumph", "Defeat", "Despair"], // 자유
    },
    "sub": {
        
        "Satiety": ["Agility"], // 풍족
        "Obtain": ["Perseverance"], // 획득
        "Sorrow": ["Perseverance"], // 슬픔
        "Transformation": ["Perseverance", "Hope"], // 변화
        "Prudence": ["Resolve"], // 신중
        "Fixation": ["Integrity", "Hope"], // 고집
        "Futility": ["Faith"], // 헛수고
        "Despair": ["Freedom"], // 실망
        "Triumph": ["Freedom"], // 개선
        "Defeat": ["Freedom"], // 좌절
        "Worry": ["Creation"], // 우려
        "Reconcilation": ["Creation"], // 화해
        "Virtue": ["Wisdom", "Resolve"], // 미덕
        "Oppression": ["Wisdom"], // 억압
        "Pleasure": ["Wisdom", "Integrity"], // 환희
        "Labor": ["Resolve", "Integrity", "Hope"], // 직책
        "Peace": ["Faith", "Acceptance"], // 평화
        "Hindrance": ["Awareness", "Departure"], // 방해
        "Control": ["Awareness", "Departure"], // 주권
        "Renewal": ["Growth", "Trust"], // 변환
        "Courage": ["Meditation"], // 용맹
        "Strife": ["Acceptance"], // 분쟁
        "Love": ["Meditation", "Faith", "Acceptance"], // 사랑
        "Opulence": ["Growth", "Meditation"], // 화려
        "Power": ["Growth", "Trust", "Harmony", "Nativity"], // 힘
        "Victory": ["Harmony"], // 승리
        "Truth": ["Awareness", "Harmony"], // 진리
        "Prosperity": ["Departure", "Trust"], // 풍요
    },
    "sub_effects": {
        "Control": { // 주권
            "set2": "HP increased by 12%.",
            "set4": "When using skills to attack an enemy, it will cause additional damage of 8% of its own health to the main target.",
            "type": ["화염"]
        },
        "Prosperity": { // 풍요
            "set2": "Reduces incoming DMG by 8%.",
            "set4": "When entering battle immediately recovers 25% of HIGHLIGHT charge, doesn't stack.",
            "type": ["HL 25%", "버프"]
        },
        "Power": { // 힘
            "set2": "Own attack increased by 12%.",
            "set4": "Increase own attack by 10% every 6 turns (Enemies and allies turn count for this effect), can be stacked 3 times.",
            "type": ["버프"]
        },
        "Reconcilation": { // 화해
            "set2": "Increases Speed by 6.",
            "set4": "During combat your HP, ATK, DEF increase by 15%.",
            "type": ["버프"]
        },
        "Labor": { // 직책
            "set2": "Increase HP by 12%.",
            "set4": "When equipped by Navigator Thieves: Increase all allies' HP, ATK and DEF by 8%.",
            "type": ["버프"]
        },
        "Peace": { // 평화
            "set2": "Defense increased by 20%.",
            "set4": "Shield effect increased by 18%.",
            "type": ["빙결"]
        },
        "Victory": { // 승리
            "set2": "Wind damage increased by 10%.",
            "set4": "Each attack has a 25% fixed probability of causing additional damage equal to 20% of your own attack.",
            "type": ["질풍", "디버프"]
        },
        "Worry": { // 우려
            "set2": "Increases SP Recovery by 80%.",
            "set4": "When entering battle immediately recovers 25% of HIGHLIGHT charge, doesn't stack.",
            "type": ["HL 25%"]
        },
        "Defeat": { // 좌절
            "set2": "Increases Ailment Accuracy Rate by 15%.",
            "set4": "Increases fire damage to enemies affected by ailments by 20%.",
            "type": ["화염", "디버프"]
        },
        "Opulence": { // 화려
            "set2": "Ice DMG increased by 10%.",
            "set4": "Resonance attack damage is increased by 40%.",
            "type": ["빙결", "추가 효과"]
        },
        "Triumph": { // 개선
            "set2": "Increases Crit Rate by 7.5%.",
            "set4": "Resonance Attack Damage is increased by 40%.",
            "type": ["추가 효과"]
        },
        "Oppression": { // 억압
            "set2": "Increase Physical DMG by 10%.",
            "set4": "Gain [Resentment] after every hit of skill damage: Increase ATK by 5% for 2 turn up to 6 stacks.",
            "type": ["물리"]
        },
        "Courage": { // 용맹
            "set2": "Physical damage increased by 10%.",
            "set4": "Crit DMG is increased by 30%, lasting for 2 rounds; the same effect will be obtained again after causing a critical hit.",
            "type": ["물리", "전격"]
        },
        "Virtue": { // 미덕
            "set2": "Increase Bless DMG by 10%.",
            "set4": "Increase Bless skill CRIT by 12% when your HP% is not less than 50%.",
            "type": ["축복"]
        },
        "Hindrance": { // 방해
            "set2": "Curse damage increased by 10%.",
            "set4": "Increase skill damage to enemies with debuffs by 20%.",
            "type": ["주원"]
        },
        "Renewal": { // 변환
            "set2": "Electric damage increased by 10%.",
            "set4": "After any party member uses electric skills, the user's own electric damage will be increased by 9%, up to 3 stacks.",
            "type": ["전격"]
        },
        "Truth": { // 진리
            "set2": "Increase Nuke DMG by 10%.",
            "set4": "Deal 30% ATK damage to the main target if the enemy is inflicted with Elemental Ailments.",
            "type": ["핵열"]
        },
        "Pleasure": { // 환희
            "set2": "Increase Psy DMG by 10%.",
            "set4": "Increase ATK by 15% when dealing Psy damage. Additionally increase ATK by 15%.",
            "type": ["염동"]
        },
        "Strife": { // 분쟁
            "set2": "Fire damage increased by 10%.",
            "set4": "Attack increased by 15%. If the enemy is weak to fire, the attack will be increased by an additional 15%.",
            "type": ["화염"]
        },
        "Love": { // 사랑
            "set2": "The healing effect is increased by 9%.",
            "set4": "When treating a party member whose health value is not higher than 50%, the healing effect will be increased by 23%.",
            "type": ["치료"]
        },
        "Futility": { // 헛수고
            "set2": "Increase ATK by 12%.",
            "set4": "Increase Ailment Accuracy by 30% for 2 turns; Gain this effect again when you deal TECHNICAL.",
            "type": ["TECHNICAL", "미출시"]
        },
        "Despair": { // 실망
            "set2": "Increase ATK by 12%.",
            "set4": "When dealing Persona skill damage, increase the current Persona skill damage by 25% if your last Persona skill damage was a different element.",
            "type": ["만능", "미출시"]
        },
        "Prudence": { // 신중
            "set2": "Decrease SPD by 3, Increase ATK by 18%.",
            "set4": "Increase DMG Dealt by 16%.",
            "type": ["버프", "미출시"]
        },
        "Fixation": { // 고집
            "set2": "Increase ATK by 12%.",
            "set4": "Increase ATK by 25% for 3 turns; Gain this effect again when you use Theurgy.",
            "type": ["버프", "미출시"]
        },
        "Transformation": { // 변화
            "set2": "Electric damage increased by 10%.",
            "set4": "Increase ATK by 25% for 2 turns; Gain this effect again when you cause a critical hit.",
            "type": ["전격", "미출시"]
        },
        "Sorrow": { // 슬픔
            "set2": "Increase ATK by 12%.",
            "set4": "Increase DMG by 20% for 3 turns; Gain this effect again when you use HIGHLIGHT.",
            "type": ["주원", "미출시"]
        },
        "Satiety": { // 풍족
            "set2": "Increase ATK by 12%.",
            "set4": "Increase DMG by 20% for 2 turns; Gain this effect again when using a Follow Up Skill.",
            "type": ["추가 효과", "미출시"]
        },
        "Obtain": { // 획득
            "set2": "Increase ATK by 12%.",
            "set4": "When cast a skill that reduces health, increase damage by 12% for 2 turns, up to 2 stacks.",
            "type": ["미출시"]
        }
    },
    "set_effects": {
        "Perseverance": {
            "Transformation": "Each enemy on field increases your electric damage by 8%, up to 32%.",
            "Sorrow": "Increase damage over time by 16%.",
            "Obtain": "Increase ATK based on your HP%, when HP% is 40%, increase ATK by 40%.",
            "type": ["미출시"]
        },
        "Hope": {
            "Labor": "When equipped by Elucidate Thieves: When using a skill on allies, increase the skill target's PEN by 5% for 1 turn.",
            "Fixation": "When dealing 1 hit of skill damage, increase own Fire DMG by 3% for 3 turns, up to 8 stacks; When reaching 8 stacks, additionally increase own CRIT Rate by 6%.",
            "Transformation": "Increase the DMG Dealt to enemies with Down status by 12%, doesn't stack.",
            "type": ["미출시"]
        },
        "Departure": {
            "Control": "Decrease main target's DEF by 23% for 2 turns after attacking them with a skill.",
            "Prosperity": "Increase all allies' DMG Dealt by 8% for 1 turn when attacking enemies.",
            "Hindrance": "Increase ATK by 30% for 3 turns after defeating an enemy."
        },
        "Awareness": {
            "Control": "Increase all allies' Fire DMG by 6% for 2 turns when you inflict Burn.",
            "Hindrance": "Increase ATK by 9% after every hit of damage to enemy with debuffs for 1 turn, up to 3 stacks.",
            "Truth": "Increase DMG Dealt by 12% when attacking enemies inflicted with Elemental Ailments, up to 2 stacks."
        },
        "Trust": {
            "Prosperity": "When using skills on allies, the damage of all party members will be increased by 8% for 2 rounds.",
            "Power": "When the battle starts, increase the attack of other party members by 10% and cannot be triggered repeatedly.",
            "Renewal": "Increase all allies' Electric DMG by 12% when the Electric DMG buff effect reached 3 stacks, can't be triggered again."
        },
        "Harmony": {
            "Truth": "Increase all allies' Nuke DMG by 5% for 2 turns when inflicting Elemental Ailments, each stack is counted independently.",
            "Power": "Increase DMG Bonus by 10% for all allies with the same element, can't be triggered again.",
            "Victory": "Increase the target's DMG Taken by 12% for 2 turns when triggering the effect of the Revelation's buff."
        },
        "Growth": {
            "Opulence": "Increase Ice DMG Bonus by 10% for 2 turns when triggering Follow Up, up to 3 stacks.",
            "Renewal": "Increase Follow Up CRIT DMG by 50%.",
            "Power": "Increase the cap of the ATK buff up to 5 stacks."
        },
        "Creation": {
            "Reconcilation": "At the start of battle, increases the DMG Dealt of the ally with the lowest SPD by 12%, doesn't stack.",
            "Worry": "Increases CRIT DMG by 15%/ 30%/ 45% when you have 100%/ 150%/ 200% SP Recovery.",
            //"type": ["미출시"]
        },
        "Integrity": { // 진정성
            "Labor": "When equipped by Navigator Thieves: Increase all allies' HP, ATK and DEF by an additional 2% with each ally with the same element.",
            "Pleasure": "Increase DMG Bonus up to 30% based on 80% of your Healing Bonus.",
            "Fixation": "After using Theurgy, increase all Thieves' DMG Dealt by 10% for 3 turns.",
            //"type": ["미출시"]
        },
        "Resolve": { // 결심 
            "Virtue": "Increase DMG Bonus by 10%/20%/30% when you reached 6000/9000/12000 HP.",
            "Labor": "When equipped by Navigator Thieves: Decrease the main target's DEF by 10% for 2 turns when inflicting debuffs.",
            "Prudence": "At the start of battle, if your SPD is at the 3rd/4th slot, then additionally increase own ATK by 24%/30%.",
            //"type": ["미출시"]
        },
        "Acceptance": {
            "Peace": "Increase DEF by 40% for 2 turns when attacked.",
            "Strife": "Each enemy on field increases your attack by 8%, up to 40%.",
            "Love": "Increase ATK by 25% when using Healing skills."
        },
        "Faith": {
            "Love": "Increase Healing Effect by 1% for every 800 HP you have, up to 20%.",
            "Peace": "After granting Shield, increase the target's DEF by 7% for 2 turns up to 3 stacks.",
            "Futility": "Increase all Thieves' DMG Dealt to enemies under TECHNICAL Ailment by 10%, can't be triggered again."
        },
        "Freedom": { // 자유
            "Defeat": "Increases all allies' DMG Dealt to enemies with debuffs by 8%, doesn't stack.",
            "Triumph": "Gain 1 [Glory] when using a persona skill, up to 2 stacks. When triggering a Follow Up, consumes all [Glory] to increase that Follow Up's PEN by 8% per stack.",
            "Despair": "When dealing Almighty damage, increase ATK by 35% and CRIT Rate by 12%.",
            //"type": ["미출시"]
        },
        "Meditation": {
            "Opulence": "Increase Follow Up CRIT DMG by 50%.",
            "Courage": "Increase Physical and Electric DMG by 12%. Increase the effect to 24% when there's only 1 enemy.",
            "Love": "Increase Healing Effect by 28% for 2 turns after landing a Crit."
        },
        "Wisdom": { // 지혜
            "Oppression": "Increase Physical DMG and Ailment Accuracy Rate by 20% when [Resentment] is not less than 5 stacks.",
            "Virtue": "When using HIGHLIGHT, increases ATK by 30% and DMG Dealt by 25%.",
            "Pleasure": "Increase DMG Bonus up to 30% based on 50% of your Ailment Accuracy Rate.",
            // "type": ["미출시"]
        },
        "Agility": {
            "Satiety": "Increase All-Out Attack DMG by 16%.",
            "type": ["미출시"]
        },
        "Nativity": { // 탄생
            "Power": "When equipped by Justine & Caroline: Increase Desire Level by  5.0%."
        }
    }
};
