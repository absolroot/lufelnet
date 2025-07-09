const enCharacterSkillsData = {
    "원더": {
        "name": "Wonder"
    },
    "미나미": {
        "name": "Minami Miyashita",
        "skill1": {
            "name": "Nurse's Light",
            "element": "축복",
            "type":"단일피해",
            "sp": 20,
            "cool": 0,
            "description": "Deal Bless damage to 1 foe equal to 56.9%/62.7%/60.4%/66.2% of Minami's max HP, and grant 1 Blessing stack to party. Also gain 1 Diagnosis stack."
        },
        "skill2": {
            "name": "Healing Grace",
            "element": "치료",
            "type":"제거",
            "sp": 25,
            "cool": 0,
            "description": "Restore HP equal to 17.4%/17.4%/18.5%/18.5% of Minami's max HP + 1488/1810/1829/2151 to the ally with the lowest HP and 1 selected ally, and cure 2 debuffs.\nGrant 1 Blessing stack to allies healed, and grant Minami 1 Diagnosis stack.\nAt the start of each turn for 2 turns, restore HP of allies healed by this skill equal to 13.9%/13.9%/14.8%/14.8% of Minami's max HP + 1190/1446/1463/1719."
        },
        "skill3": {
            "name": "Compassionate Cure",
            "element": "치료광역",
            "type":"광역치료",
            "sp": 32,
            "cool": 0,
            "description": "Spend all Diagnosis stacks, and restore HP to selected ally equal to 15.8%/15.8%/16.8%/16.8% of Minami's max HP + 1347/1665/1656/1974.\nAlso restore HP of the ally with the lowest HP with this effect 2 times.\nFor each Diagnosis stack, activate this effect 1 more time.\nFor each Diagnosis stack spent, increase the max HP of allies (other than Minami) by 7.5% of Minami's max HP for 2 turns (up to 1057/1057/1226/1226)."
        },
        "skill_highlight": {
            "element": "치료광역",
            "type":"광역치료",
            "description": "Restore party's HP by 17.6%/17.6%/18.6%/18.6% of Minami's max HP + 1500/1824/1844/2168, and cure 1 debuff.\nIncrease party's max HP by 16.5% of Minami's max HP (up to 2326/2326/2697/2697) for 2 turns. At the end of an action, restore HP equal to 6.5%/6.5%/6.9%/6.9% of Minami's max HP + 556/676/683/803 for 1 turn."
        },
        "passive1": {
            "name": "Health Comes First",
            "element": "패시브",
            "description": "After Minami heals an ally, increase that ally's damage by 15.0% + (3.0% × target ally's Blessing stacks) for 1 turn (up to 30%)."
        },
        "passive2": {
            "name": "Peace of Mind",
            "element": "패시브",
            "description": "At the start of battle, increase party's max HP by 10.0% of Minami's max HP (up to 1500)."
        }
    },

    "유이 YUI": {
        "name": "YUI",
        "skill1": {
            "name": "Electric Bomb",
            "element": "전격",
            "type":"단일피해",
            "sp": 20,
            "cool": 0,
            "description": "Deal Electric damage to 1 foe equal to 185.4%/204.4%/196.8%/215.8%of Attack. If the foe is not Shocked, there is a 68.3%/68.3%/72.5%/72.5% chance to inflict Shock for 2 turns. If the foe is already Shocked, increase damage by 30%."
        },
        "skill2": {
            "name": "Meta Dynamite",
            "element": "전격광역",
            "type":"광역피해",
            "sp": 20,
            "cool": 0,
            "description": "Deal Electric damage to all foes equal to 59.6%/65.7%/63.3%/69.4% of Attack. Increase damage to the main target by 25%."
        },
        "skill3": {
            "name": "Sparky Surprise",
            "element": "버프",
            "type":"버프",
            "sp": 25,
            "cool": 1,
            "description": "Grant Player 2 to 1 ally for 2 turns, and increase Yui's Attack by 39.0%/43.0%/41.4%/45.4%.\nFor 2 turns, when an ally with Player 2 deals damage to a foe with a skill, perform a follow-up attack, dealing Electric damage equal to 132.9%/137.2%/141.1%/145.4% of Attack (max 2 times).\nIncrease chance to activate Jolly Cooperation by 10% for 2 turns."
        },
        "skill_highlight": {
            "element": "버프",
            "type":"버프",
            "description": "Increase Attack by 34.2%/37.7%/36.3%/39.8% and increase follow-up attack damage by 24.4%/25.9%/25.9%/27.4%  of Attack for 2 turns.\nActivate follow-up attacks after allies deal damage with skills for 2 turns."
        },
        "passive1": {
            "name": "Virtual Landowner",
            "element": "패시브",
            "description": "Increase follow-up damage to Shocked foes by 36.0%."
        },
        "passive2": {
            "name": "Let's Go Together",
            "element": "패시브",
            "description": "When an ally has Player 2, increase that ally and Yui's critical rate by 12.0% and Attack by 12.0%."
        }
    },

    "미나미": {
        "name": "",
    },
    "렌": {
        "name": "Ren Amamiya",
        "skill1": {
            "name": "Trickster's Plunder",
            "element": "주원광역",
            "type": "광역피해",
            "sp": 19,
            "cool": 0,
            "description": "Deal Curse damage to all foes equal to 83.0%/91.5%/88.1%/96.6% of Attack. 20% chance to inflict Curse. Also gain 1 Will of Rebellion stack."
        },
        "skill2": {
            "name": "Phantom Omen",
            "element": "주원",
            "type": "단일피해",
            "sp": 19,
            "cool": 0,
            "description": "Deal Curse damage to 1 foe equal to 97.7%/107.8%/103.8%/113.6% of Attack. When only 1 foe is present, gain 2 Will of Rebellion stacks."
        },
        "skill3": {
            "name": "Arsène's Chains",
            "element": "주원광역",
            "type": "광역피해",
            "sp": 22,
            "cool": 0,
            "description": "Deal Curse damage to all foes equal to 74.2%/81.8%/78.8%/86.3% of Attack. When used on an Extra Action, increase damage by 25%. When attacking foes with debuffs, increase damage by 25% more."
        },
        "skill_highlight": {
            "name": "Highlight",
            "element": "주원광역",
            "type": "광역피해",
            "sp": 0,
            "cool": 0,
            "description": "Deal Curse damage to all foes equal to 205.2%/226.2%/217.1%/238.6% of Attack, and gain 1 Will of Rebellion stack."
        },
        "passive1": {
            "name": "Resistance",
            "element": "패시브",
            "description": "Increase Attack by 18.0% for each Will of Rebellion stack."
        },
        "passive2": {
            "name": "Adverse Resolve",
            "element": "패시브",
            "description": "Increase damage on Extra Actions by 72.0%."
        }
    },
    "류지": {
        "name": "Ryuji Sakamoto",
        "skill1": {
            "name": "Pirate Tactics",
            "element": "물리",
            "type": "단일피해",
            "hp": 8,
            "cool": 0,
            "description": "Deal Physical damage to 1 foe equal to 64.7%/71.3%/68.7%/75.3% of Attack (3 times). When Ryuji doesn't have Rebound, spend 20% of max HP to increase damage dealt by 30% and increase critical rate by 30%."
        },
        "skill2": {
            "name": "Thunderbolt",
            "element": "전격광역",
            "type": "광역피해",
            "sp": 26,
            "cool": 0,
            "description": "Deal Electric damage to all foes equal to 67.1%/73.8%/71.3%/78.0% of Attack, with a 29.3%/29.3%/31.1%/31.1% chance to inflict Shock. When Ryuji has Rebound, increase chance to inflict Shock by 58.6%/58.6%/62.2%/62.2%."
        },
        "skill3": {
            "name": "God Hand Burst",
            "element": "물리",
            "type": "단일피해",
            "hp": 20,
            "cool": 0,
            "description": "Select 1 foe, and enter the Changing Gears state. On the next action, deal Physical damage to the target equal to 341.6%/376.6%/362.6%/397.6% of Attack. When Ryuji has Rebound, guarantee a critical hit. If the main target is defeated while in Changing Gears, randomly select another foe."
        },
        "skill_highlight": {
            "name": "Highlight",
            "element": "물리",
            "type": "단일피해",
            "sp": 0,
            "cool": 0,
            "description": "Deal Physical damage to 1 foe equal to 405.0%/446.5%/429.9%/471.4% of Attack, and increase damage of next skill by 58.6%/58.6%/62.2%/62.2%."
        },
        "passive1": {
            "name": "Adrenaline",
            "element": "패시브",
            "description": "If the target's remaining HP is higher than Ryuji's, increase Attack by 45.0%."
        },
        "passive2": {
            "name": "Rebellious Spirit",
            "element": "패시브",
            "description": "When Ryuji has Rebound and uses Pirate Tactics, Thunderbolt, or God Hand Burst, restore HP equal to 30.0% of his Attack."
        }
    },
    "모르가나": {
        "name": "Morgana",
        "skill1": {
            "name": "Missile Whirlwind",
            "element": "질풍",
            "type": "단일피해",
            "sp": 22,
            "cool": 0,
            "description": "Deal Wind damage to 1 foe equal to 146.4%/161.4%/155.4%/170.4% of Attack. Inflict Windswept on target for 2 turns. Chance to gain 1 Chivalry stack (chance is equal to current critical rate)."
        },
        "skill2": {
            "name": "Healing Breeze",
            "element": "치료광역",
            "type": "광역치료",
            "sp": 33,
            "cool": 0,
            "description": "Restore party's HP by 37.6%/37.6%/39.9%/39.9% of Morgana's Attack + 1069/1300/1315/1546, and heal 1 elemental ailment. When healing an elemental ailment, gain 1 Chivalry stack."
        },
        "skill3": {
            "name": "Gentle Fist",
            "element": "물리",
            "type": "단일피해",
            "hp": 12,
            "cool": 0,
            "description": "Decrease this skill's accuracy by 20%, increase critical rate by 30%, and deal Physical damage to 1 foe equal to 128.9%/142.1%/136.9%/150.1% of Attack. On a critical hit, gain 1 Chivalry stack."
        },
        "skill_highlight": {
            "name": "Highlight",
            "element": "질풍",
            "type": "치료단일",
            "sp": 0,
            "cool": 0,
            "description": "Deal Wind damage to 1 foe equal to 227.8%/251.1%/241.8%/265.1% of Attack, and revive KO'd allies with 20% HP."
        },
        "passive1": {
            "name": "Masked Gentleman",
            "element": "패시브",
            "description": "When healing with Chivalry, increase critical rate by 30.0%. When inflicting a critical hit, increase Chivalry's healing effect by 24.0% of Morgana's Attack + 720."
        },
        "passive2": {
            "name": "Morgana's Method",
            "element": "패시브",
            "description": "Decrease party's healing skill SP cost by 15.0%."
        }
    },
    "안": {
        "name": "Ann Takamaki",
        "skill1": {
            "name": "Crimson Rose",
            "element": "화염광역",
            "type": "광역피해",
            "sp": 20,
            "cool": 0,
            "description": "Deal Fire damage to all foes equal to 94.8%/102.6%/100.6%/108.4% of Attack, and increase Ann's Attack by 20% for 2 turns. When Ann has La Vie en Rose, for 2 turns, decrease foes' Attack by 8% of Ann's Attack and increase her Attack by the same amount."
        },
        "skill2": {
            "name": "Trifire",
            "element": "화염",
            "type": "단일피해",
            "sp": 20,
            "cool": 0,
            "description": "Deal Fire damage to 1 foe equal to 134.2%/147.9%/142.5%/156.2% of Attack, with 75% chance to inflict Burn. When Ann has La Vie en Rose, and the foe's HP is below 50%, deal 30% bonus damage."
        },
        "skill3": {
            "name": "Falling Sun",
            "element": "화염광역",
            "type": "광역피해",
            "sp": 22,
            "cool": 0,
            "description": "Deal Fire damage to all foes equal to 96.3%/106.1%/102.3%/112.1% of Attack, with 30% chance to inflict Burn. When Ann has La Vie en Rose, deal 30% more damage."
        },
        "skill_highlight": {
            "name": "Highlight",
            "element": "화염광역",
            "type": "광역피해",
            "sp": 0,
            "cool": 0,
            "description": "Deal Fire damage to all foes equal to 195.2%/215.2%/207.2%/227.2% of Attack. Increase damage of Ann's Fire skills by 78.1%/86.1%/82.9%/90.9% for 1 turn."
        },
        "passive1": {
            "name": "Rising Tension",
            "element": "패시브",
            "description": "Activate a Fire technical when using a skill or Highlight. When Fireburn activates, increase that skill or Highlight's damage by 30.0%."
        },
        "passive2": {
            "name": "Carrot and Stick",
            "element": "패시브",
            "description": "When La Vie en Rose ends, restore HP to the ally with the lowest remaining HP by 45.0% of Ann's Attack."
        }
    },
    "야오링": {
        "name": "Li Yaoling",
        "skill1": {
            "name": "Underworld Ferry",
            "element": "주원광역",
            "type": "디버프 중첩",
            "sp": 20,
            "cool": 0,
            "description": "Deal Curse damage to all foes equal to 73.2%/80.7%/77.7%/85.2% of Attack. Decrease foes' Defense by 3% for every 10 points of Yaoling's Speed for 2 turns (up to 49.7%/54.8%/53.5%/58.6%). Also gain 4 Memory stacks for each foe attacked."
        },
        "skill2": {
            "name": "Flowers of Naihe",
            "element": "주원",
            "type": "제어",
            "sp": 22,
            "cool": 0,
            "description": "Deal Curse damage to 1 foe equal to 97.6%/107.6%/103.6%/113.6% of Attack. If foe has a debuff, increase damage by 20%. When spending Meng Po Soup, inflict Forget on target for 2 turns. If foe is inflicted with Forget or another spiritual ailment, increase their damage taken by 2% for every 10 points of Yaoling's Speed (up to 32.3%/32.3%/34.3%/34.3%) for 1 turn."
        },
        "skill3": {
            "name": "Lion Dance of Oblivion",
            "element": "주원광역",
            "type": "디버프",
            "sp": 24,
            "cool": 0,
            "description": "Deal Curse damage to all foes equal to 78.1%/86.1%/82.9%/90.9% of Attack, and inflict Red Spider Lily for 2 turns. When spending Meng Po Soup, the damage increase effect of Red Spider Lily is doubled. Red Spider Lily: Increase damage taken by foes by 3% for every 10 points of Yaoling's Speed (up to 48.5%/53.5%/52.3%/57.3%). Lasts for 2 turns, or until damage is taken 2 times."
        },
        "skill_highlight": {
            "name": "Highlight",
            "element": "주원광역",
            "type": "디버프",
            "sp": 0,
            "cool": 0,
            "description": "Deal Curse damage to all foes equal to 146.4%/161.4%/155.4%/170.4% of Attack, and increase target's damage taken by 48.8%/53.8%/51.8%/56.8%. 30% chance to inflict Forget on foes for 2 turns."
        },
        "passive1": {
            "name": "Kung Fu Mastery",
            "element": "패시브",
            "description": "Increase Attack by 1% for every 2 points of Yaoling's Speed (up to 90.0%)."
        },
        "passive2": {
            "name": "Up to Chance",
            "element": "패시브",
            "description": "When attacking a foe with more than 50% HP, increase foe's Curse damage taken by 30.0%."
        }
    },
    "하루나": {
        "name": "Haruna Nishimori",
        "skill1": {
            "name": "Surprise Squad",
            "element": "염동",
            "type": "단일 피해",
            "sp": 20,
            "cool": 0,
            "description": "Deal Psychokinesis damage to 1 foe equal to 146.4%/161.4%/155.4%/170.4% of Attack, and grant Affection to party for 1 turn. Affection: When dealing damage with a skill, Haruna gains 1 Childish Heart stack."
        },
        "skill2": {
            "name": "Ready for Adventure",
            "element": "버프광역",
            "type": "버프",
            "sp": 22,
            "cool": 0,
            "description": "Increase party's healing received and shield received by 17.6%/19.4%/18.7%/20.5%, and Defense by 34.2%/37.7%/36.3%/39.8% for 2 turns. If Haruna does not have Childish Heart, gain 2 Childish Heart stacks."
        },
        "skill3": {
            "name": "Courageous Campaign",
            "element": "버프광역",
            "type": "버프",
            "sp": 24,
            "cool": 0,
            "description": "This skill requires Childish Heart. When used with Childish Heart, increase party's Attack by 10% for 2 turns. At 2 or more stacks of Childish Heart, also increase party's damage dealt by 1% for every 100 of Haruna's Attack, up to 48.8%/53.8%/51.8%/56.8%."
        },
        "skill_highlight": {
            "name": "Highlight",
            "element": "염동",
            "type": "버프",
            "sp": 0,
            "cool": 0,
            "description": "When Haruna gains Childish Heart, gain 1 Mystery stack for 2 turns (stacks up to 5 times). Deal Psychokinesis damage to 1 foe equal to 336.0%/373.5%/388.5%/426.0% of Attack and increase party's damage for 1 turn by 7.8%/8.6%/8.3%/9.1% for each stack of Mystery."
        },
        "passive1": {
            "name": "Let's Hold Hands",
            "element": "패시브",
            "description": "Each time an ally with Affection deals damage, 40.0% chance to gain 1 Childish Heart stack."
        },
        "passive2": {
            "name": "Safety in Numbers",
            "element": "패시브",
            "description": "When spending 3 or more Childish Heart stacks at once, further increase effects of Off to Treasure Hunt by 24.0%."
        }
    },
    "루페르": {
        "name": "Lufel",
        "skill1": {
            "name": "Owl Fire",
            "element": "화염",
            "type": "단일피해",
            "sp": 22,
            "cool": 0,
            "description": "Deal Fire damage to 1 foe equal to 113.2%/124.7%/117.9%/129.4% of Attack, inflict Burn for 2 turns, and decrease healing received by 30%."
        },
        "skill2": {
            "name": "Owl Green",
            "element": "치료",
            "type": "단일치료",
            "sp": 24,
            "cool": 0,
            "description": "Restore 1 ally's HP by 67.4%/67.4%/70.2%/70.2% of Lufel's Attack + 1920/2335/2209/2624. If target's HP is below 50%, increase healing effect by 11.0%/12.0%/19.0%/20.0%."
        },
        "skill3": {
            "name": "Healing Satellite",
            "element": "치료광역",
            "type": "광역치료",
            "sp": 31,
            "cool": 0,
            "description": "Restore party's HP by 42.1%/42.1%/43.8%/43.8% of Lufel's Attack + 1191/1449/1378/1636. Increase healing effect on the main target by 16.0%/17.0%/24.0%/25.0%."
        },
        "skill_highlight": {
            "name": "Highlight",
            "element": "치료광역",
            "type": "광역치료",
            "sp": 0,
            "cool": 0,
            "description": "Restore HP to party by 59.7%/59.7%/62.2%/62.2% of Lufel's Attack + 1700/2067/1956/2323. Increase party's Attack by 21.8%/23.1%/33.2%/34.5% for 1 turn."
        },
        "passive1": {
            "name": "Forest Sage",
            "element": "패시브",
            "description": "After attacking with a skill, grant Starfire to up to 3 allies."
        },
        "passive2": {
            "name": "Sparks of Support",
            "element": "패시브",
            "description": "Increase healing effect based on Lufel's max HP. The effect is maximized at 12000 HP, and healing effect will increase by 42.0%."
        }
    },
    "레오": {
        "name": "Leon Kamiyama",
        "skill1": {
            "name": "Atomic Smash",
            "element": "핵열",
            "type": "단일피해",
            "sp": 20,
            "cool": 0,
            "description": "Deal Nuclear damage to 1 foe equal to 170.8%/188.3%/177.8%/195.3% of Attack. For each stack of Power of Friendship the party has, increase damage by 10%."
        },
        "skill2": {
            "name": "Justice Barrier",
            "element": "치료",
            "type": "버프",
            "sp": 20,
            "cool": 0,
            "description": "Spend 30% of 1 other ally's remaining HP to grant them a shield equal to 80% of HP spent + 31.6%/31.6%/32.9%/32.9% of Kamiyama's Attack + 900/1095/1035/1230 for 2 turns. Also grant 1 Power of Friendship stack."
        },
        "skill3": {
            "name": "Ultima Booster",
            "element": "버프",
            "type": "버프",
            "sp": 24,
            "cool": 0,
            "description": "Increase 1 ally's Attack by 19.5%/19.5%/20.3%/20.3% for 2 turns. For each stack of Power of Friendship the target has, increase Attack by 20% of Kamiyama's Attack more (up to 1516.7/1672.1/1578.9/1734.3)."
        },
        "skill_highlight": {
            "element": "버프",
            "type": "버프",
            "description": "Grant the maximum number of Power of Friendship stacks to 1 ally for 2 turns. If the target's HP is below 60%, restore HP up to 60% (up to 200% of Kamiyama's Attack). Also, increase Attack by 15% of Kamiyama's Attack (up to 585.6/645.6/609.6/669.6) for 2 turns."
        },
        "passive1": {
            "name": "Energy Recharge",
            "element": "패시브",
            "description": "When Justice Barrier ends, restore HP equal to 100.0% of remaining shield."
        },
        "passive2": {
            "name": "Full Power: Start!",
            "element": "패시브",
            "description": "Increase allies' critical damage by 45.0% when they have 2 Power of Friendship stacks."
        }
    },
    "모토하": {
        "name": "Motoha Arai",
        "skill1": {
            "name": "Wrathful Thunder",
            "element": "전격광역",
            "type": "광역피해",
            "sp": 20,
            "cool": 0,
            "description": "Deal Electric damage to random foes equal to 76.7%/84.5%/79.9%/87.7% of Attack (4 hits), and inflict Shock on main target for 2 turns. Prioritizes targeting different foes, and repeated hits on same foe deal 10% decreased damage."
        },
        "skill2": {
            "name": "Blitz Mine",
            "element": "전격",
            "type": "단일피해",
            "sp": 18,
            "cool": 0,
            "description": "Deal Electric damage to 1 foe equal to 157.1%/173.2%/163.6%/179.7% of Attack. Increase party's Electric damage by 11.7%/11.7%/12.2%/12.2% for 2 turns."
        },
        "skill3": {
            "name": "Electroshark",
            "element": "전격광역",
            "type": "광역피해",
            "sp": 24,
            "cool": 0,
            "description": "Deal Electric damage to all foes equal to 79.3%/87.4%/82.5%/90.6% of Attack. If a foe is Shocked, activate a Technical and deal bonus Electric damage equal to 42.8%/47.2%/44.5%/48.9% of Attack."
        },
        "skill_highlight": {
            "element": "전격",
            "type": "광역피해",
            "description": "Deal Electric damage to all foes equal to 162.4%/179.0%/169.1%/185.7% of Attack, inflict Shock on the main target for 2 turns, and increase Electric damage taken by 10% for 2 turns."
        },
        "passive1": {
            "name": "Extra Inning",
            "element": "패시브",
            "description": "When foes are Shocked, 66.0% chance to extend effect duration by 1 turn."
        },
        "passive2": {
            "name": "Line Drive to Pitcher",
            "element": "패시브",
            "description": "Increase Electric damage taken by main target of a skill by 20.0% for 2 turns. Stacks up to 2 times."
        }
    },
    "몽타뉴": {
        "name": "Kotone Montagne",
        "skill1": {
            "name": "Frost Lily",
            "element": "빙결광역",
            "type": "광역피해",
            "sp": 20,
            "cool": 0,
            "description": "Deal Ice damage to all foes equal to 87.1%/96.1%/90.6%/99.6% of Attack. 29.3%/29.3%/31.1%/31.1% chance to inflict Freeze."
        },
        "skill2": {
            "name": "Winter Storm",
            "element": "빙결",
            "type": "단일피해",
            "sp": 20,
            "cool": 0,
            "description": "Deal Ice damage to 1 foe equal to 160.4%/176.9%/166.9%/183.4% of Attack. Gain 4 Ice Crystal stacks."
        },
        "skill3": {
            "name": "Durandal of Ice",
            "element": "빙결",
            "type": "단일피해",
            "sp": 24,
            "cool": 0,
            "description": "Deal Ice damage to 1 foe equal to 179.7%/198.1%/187.1%/205.5% of Attack. When Kotone has Parhelion or 10+ Ice Crystal stacks, increase damage based on foe's missing HP (up to 29.3%/29.3%/30.5%/30.5%). When Blade Dancer is activated, increase follow-up damage dealt based on foe's missing HP (up to 29.3%/29.3%/30.5%/30.5%)."
        },
        "skill_highlight": {
            "name": "Highlight",
            "element": "빙결",
            "type": "단일피해",
            "sp": 0,
            "cool": 0,
            "description": "Deal Ice damage to 1 foe equal to 292.8%/322.8%/304.8%/334.8% of Attack. Increase damage based on foe's missing HP. When foe's HP is below 20%, increase by a maximum of 30%."
        },
        "passive1": {
            "name": "Frozen in Time",
            "element": "패시브",
            "description": "When damaging foes with Blade Dancer, 100.0% chance to inflict Freeze."
        },
        "passive2": {
            "name": "State of Selflessness",
            "element": "패시브",
            "description": "When Kotone defeats a foe, gain 4 Ice Crystal stacks."
        }
    },
    "슌": {
        "name": "Shun Kano",
        "skill1": {
            "name": "Icicle Hatchet",
            "element": "빙결",
            "type": "단일피해",
            "sp": 20,
            "cool": 0,
            "description": "Deal Ice damage to 1 foe equal to 55.6%/61.3%/57.9%/63.6% of Shun's max HP. 70% chance to inflict Freeze."
        },
        "skill2": {
            "name": "Smash Hit",
            "element": "물리",
            "type": "단일피해",
            "hp": 6,
            "cool": 0,
            "description": "Deal Physical damage to 1 foe equal to 56.9%/62.8%/59.2%/65.1% of Shun's max HP. Decrease Defense by 30.0%/30.0%/31.2%/31.2% for 2 turns. When Desperado is active, increase effect to 59.9%/59.9%/62.4%/62.4%."
        },
        "skill3": {
            "name": "Icy Defense",
            "element": "버프",
            "type": "생존",
            "sp": 24,
            "cool": 1,
            "description": "Increase party's max HP by 15% of Shun's max HP (up to 14100/14100/15600/15600) for 2 turns and greatly increase Shun's chance of being targeted by attacks. Also, restore party's HP by 16.5%/18.2%/17.2%/18.9% of Shun's max HP.\nCooldown: 1 turn."
        },
        "skill_highlight": {
            "element": "빙결",
            "type": "생존",
            "description": "Increase party's max HP by 10.3% of Shun's max HP (up to 14100/14100/15600/15600) and restore party's HP by 10.1%/11.1%/10.5%/11.5% of Shun's max HP. Deal Ice damage to 1 foe equal to 75.4%/83.2%/78.4%/86.2% of Shun's max HP."
        },
        "passive1": {
            "name": "Daunting Firepower",
            "element": "패시브",
            "description": "Increase ammo for ranged attacks by 18. When attacking foes with ranged attacks, 10.0% chance to deal bonus damage equal to 9% of Shun's max HP, and decrease foe's Defense by 35% for 3 turns. Consecutive ranged attacks against the same foe will deal decreased damage."
        },
        "passive2": {
            "name": "For Your Benefit",
            "element": "패시브",
            "description": "When Shun is attacked while Icy Defense is active, 30.0% chance to activate Desperado's healing effect for 2 turns."
        }
    },
    "세이지": {
        "name": "Seiji Shiratori",
        "skill1": {
            "name": "Blustering Épée",
            "element": "질풍",
            "type": "단일피해",
            "sp": 16,
            "cool": 0,
            "description": "Deal Wind damage to 1 foe equal to 42.9%/47.3%/44.7%/49.1% of Attack (4 hits). 19.2%/19.2%/20.4%/20.4% chance to inflict Windswept for 2 turns."
        },
        "skill2": {
            "name": "Graceful Gale",
            "element": "질풍광역",
            "type": "광역피해",
            "sp": 19,
            "cool": 0,
            "description": "Deal Wind damage to all foes equal to 24.2%/26.6%/25.2%/27.6% of Attack (3 hits). Gain 1 Right to Strike stack with a chance equal to the number of foes present when using the skill × 48.8%/48.8%/50.8%/50.8%."
        },
        "skill3": {
            "name": "Saber Surge",
            "element": "질풍",
            "type": "단일피해",
            "sp": 18,
            "cool": 0,
            "description": "Deal Wind damage to 1 foe equal to 53.2%/58.6%/55.4%/60.8% of Attack (3 hits). When Right to Strike is at 3 or more stacks, deal 1 additional hit and increase critical rate by 20%."
        },
        "skill_highlight": {
            "name": "Highlight",
            "element": "질풍",
            "type": "단일피해",
            "sp": 0,
            "cool": 0,
            "description": "Deal Wind damage to 1 foe equal to 58.6%/64.6%/61.0%/67.0% of Attack (4 hits). When Right to Strike is at 3 or more stacks, increase hits by 1."
        },
        "passive1": {
            "name": "Chivalrous Spirit",
            "element": "패시브",
            "description": "When attacking a Windswept foe with Saber Surge, 100.0% chance to deal 1 additional hit."
        },
        "passive2": {
            "name": "Coup Droit",
            "element": "패시브",
            "description": "At the end of turn, 60.0% chance to gain 1 Right to Strike stack."
        }
    },
    "유키미": {
        "name": "Fujikawa Yukimi",
        "skill1": {
            "name": "Sword of Condemnation",
            "element": "축복광역",
            "type": "광역피해",
            "sp": 19,
            "cool": 0,
            "description": "Deal Bless damage to all foes equal to 88.0%/97.1%/91.6%/100.7% of Yukimi's Defense. Grant 1 Blessing stack to Yukimi and allies with Oath."
        },
        "skill2": {
            "name": "Sacral Glow",
            "element": "버프",
            "type": "실드",
            "sp": 20,
            "cool": 0,
            "description": "Grant a shield to 1 other ally equal to 47.2%/47.2%/49.2%/49.2% of Yukimi's Defense + 1344/1635/1547/1838, and increase target's Defense by 35% of Yukimi's Defense (up to 1112/1226/1158/1272). Also, decrease target's damage taken by 20% once. Lasts for 2 turns. Grant 2 Blessing stacks, and grant target Oath for 2 turns."
        },
        "skill3": {
            "name": "Absolute Judgment",
            "element": "축복",
            "type": "단일피해",
            "sp": 25,
            "cool": 0,
            "description": "When Yukimi gains Blessing stacks, gain 1 Gavel stack. When this skill is used after Gavel reaches 2 stacks, spend all Gavel stacks to deal Bless damage to 1 foe equal to 117.1%/129.1%/121.9%/133.9% of Defense. For each Gavel stack spent, increase party's damage by 4.9%/5.4%/5.1%/5.6% for 1 turn, and grant a shield to party equal to 14.9%/16.5%/15.5%/17.1% of Yukimi's Defense for 2 turns.\nWhen an ally with Oath gains Blessing stacks, Yukimi gains 1 additional Gavel stack."
        },
        "skill_highlight": {
            "name": "Highlight",
            "element": "축복",
            "type": "단일피해",
            "sp": 0,
            "cool": 0,
            "description": "Deal Bless damage to 1 foe equal to 284.1%/313.2%/295.8%/324.9% of Yukimi's Defense. Also increase party's Defense by 20% of Yukimi's Defense (up to 657/725/684/752) for 2 turns."
        },
        "passive1": {
            "name": "Cross-Examination",
            "element": "패시브",
            "description": "When an ally has Oath, increase their damage by 7% for every 1500 of Yukimi's Defense (up to 21.0%). (If Defense is less than 1500, increase damage by a percentage)."
        },
        "passive2": {
            "name": "Urgent Matter",
            "element": "패시브",
            "description": "At the end of turn, grant a shield equal to 69.0% of Yukimi's Defense to allies below 30% HP, and grant 1 Blessing stack. Blessing lasts 2 turns. This effect activates once per battle."
        }
    },
    "키요시": {
        "name": "Kurotani Kiyoshi",
        "skill1": {
            "name": "Ring of Fire",
            "element": "화염",
            "type": "화상",
            "sp": 20,
            "cool": 0,
            "description": "Deal Fire damage to 1 foe equal to 26.2%/28.9%/27.2%/29.9% of Kurotani's max HP, and inflict Burn. If the target is Burning, gain 1 Chosen One stack, change target to all foes and decrease damage by half, with a chance to inflict Burn."
        },
        "skill2": {
            "name": "Crimson Summon",
            "element": "화염광역",
            "type": "광역피해",
            "sp": 20,
            "cool": 0,
            "description": "Deal Fire damage to all foes equal to 20.2%/22.3%/21.0%/23.1% of Kurotani's max HP. When foes are Burning, gain 2 Chosen One stacks and inflict Sacred Flame on Burning foes, and this skill activates a Fire Technical.\nSacred Flame: At the start of turn, deal Fire damage equal to 24.8%/27.3%/25.8%/28.3% of Kurotani's max HP for 2 turns."
        },
        "skill3": {
            "name": "Cleansing Flame",
            "element": "화염",
            "type": "단일피해",
            "sp": 24,
            "cool": 0,
            "description": "Deal Fire damage to 1 foe equal to 58.6%/64.6%/61.0%/67.0% of Kurotani's max HP and activate Fire Technical. When target has Sacred Flame, activate an additional Technical and increase damage by 30%."
        },
        "skill_highlight": {
            "element": "화염광역",
            "type": "광역피해",
            "description": "Increase all foes' Fire damage taken by 30.1%/33.2%/31.3%/34.4%, and deal Fire damage equal to 41.5%/45.7%/43.2%/47.4% of Kurotani's max HP. Also, inflict Burn for 2 turns."
        },
        "passive1": {
            "name": "Uplifting Embers",
            "element": "패시브",
            "description": "Increase Fire damage and elemental ailment damage dealt to foes with Sacred Flame by 6.0%, based on the number of Chosen One stacks."
        },
        "passive2": {
            "name": "Hot to the Touch",
            "element": "패시브",
            "description": "Increase Fire damage based on max HP. Increase by 1% for every 300 HP (up to 9000)."
        }
    },
    "토모코": {
        "name": "Tomoko Noge",
        "skill1": {
            "name": "Psyche Melody",
            "element": "염동광역",
            "type": "광역피해",
            "sp": 20,
            "cool": 0,
            "description": "Deal Psychokinesis damage to all foes equal to 91.5%/100.9%/95.3%/104.7% of Attack, and gain 2 Greenleaf stacks."
        },
        "skill2": {
            "name": "Cheering You On",
            "element": "버프",
            "type": "버프",
            "sp": 22,
            "cool": 0,
            "description": "Grant Cheer Song to 1 ally. Increase Attack by 30% + 30% of Tomoko's Attack (up to 1171/1291/1219/1339). Also increase ailment accuracy by 15% for 2 turns. This skill consumes 2 Greenleaf stacks."
        },
        "skill3": {
            "name": "Spirit's Lullaby",
            "element": "디버프",
            "type": "제어",
            "sp": 24,
            "cool": 0,
            "description": "78.1%/86.1%/81.3%/89.3% chance to inflict Sleep on 1 foe for 1 turn. On success, increase target's next damage taken by 29.3%/32.3%/30.5%/33.5%. On failure, increase by 14.6%/16.1%/15.2%/16.7%. This skill consumes 2 Greenleaf stacks."
        },
        "skill_highlight": {
            "name": "Highlight",
            "element": "디버프",
            "type": "제어",
            "sp": 0,
            "cool": 0,
            "description": "100% chance to inflict Sleep on 1 foe for 1 turn, and increase next damage taken by 32.8%/36.2%/34.1%/37.5% for 1 turn."
        },
        "passive1": {
            "name": "Esprit de Corps",
            "element": "패시브",
            "description": "After using a skill on an ally, increase target's damage by 6.0% for 2 turns."
        },
        "passive2": {
            "name": "Insult to Injury",
            "element": "패시브",
            "description": "Increase party's damage to foes with spiritual ailments by 36.0%."
        }
    },
    "토시야": {
        "name": "Sumi Toshiya",
        "skill1": {
            "name": "Unexpected Tragedy",
            "element": "주원",
            "type": "단일피해",
            "sp": 22,
            "cool": 0,
            "description": "Deal Curse damage to 1 foe equal to 58.6%/64.6%/61.0%/67.0% of Attack (3 hits), and gain 3 Verse of Hate stacks.\nWhen next gaining Verse stacks, 25% chance to change to Verse of Hate stacks (max 2).\nWhen spending Verse of Hate stacks to deal damage with Sonnet of Fate, 30% chance to inflict Curse for each Verse of Hate spent."
        },
        "skill2": {
            "name": "Absurd Comedy",
            "element": "주원광역",
            "type": "광역피해",
            "sp": 20,
            "cool": 0,
            "description": "Deal Curse damage to all foes equal to 35.7%/39.3%/37.2%/40.8% of Attack (2 hits), and gain 2 Verse of Healing stacks.\nWhen next gaining Verse stacks, 25% chance to change to Verse of Healing stacks (max 2).\nWhen spending Verse of Healing stacks to deal damage with Sonnet of Fate, restore HP to the ally with the lowest remaining HP by 7.5% of Attack per Verse of Healing spent."
        },
        "skill3": {
            "name": "Tragicomedy of Love",
            "element": "주원",
            "type": "단일피해",
            "sp": 24,
            "cool": 0,
            "description": "Deal Curse damage to 1 foe equal to 41.5%/45.7%/43.2%/47.4% of Attack (5 hits), and gain 5 Verse of Passion stacks.\nWhen next gaining Verse stacks, 25% chance to change to Verse of Passion stacks (max 2).\nWhen spending Verse of Passion stacks to deal damage with Sonnet of Fate, deal bonus Almighty damage equal to 7% of Attack per Verse of Passion spent."
        },
        "skill_highlight": {
            "name": "Highlight",
            "element": "주원",
            "type": "단일피해",
            "sp": 0,
            "cool": 0,
            "description": "Deal Curse damage to 1 foe equal to 96.8%/106.7%/100.8%/110.7% of Attack (3 hits). The next 2 times Sonnet of Fate is activated, increase its damage by 50.6%/55.8%/52.6%/57.8%."
        },
        "passive1": {
            "name": "The Other Prison",
            "element": "패시브",
            "description": "Increase damage of Sonnet of Fate on foes with Curse ailment by 50.0%."
        },
        "passive2": {
            "name": "This Beautiful Woman",
            "element": "패시브",
            "description": "For each special Verse stack present, increase damage of Sonnet of Fate by 10.0%."
        }
    },
    "미유": {
        "name": "Miyu Sahara",
        "skill1": {
            "name": "Little Mermaid's Song",
            "element": "버프광역",
            "type": "실드",
            "cool": 8,
            "description": "Grant a shield to party equal to 29.3%/29.3%/31.6%/31.6% of Miyu's Defense + 1110/1330/1437/1657 for 2 turns, and restore 4 SP. When an ally's shield is broken, decrease cooldown by 1 action."
        },
        "skill2": {
            "name": "Poseidon's Blessing",
            "element": "버프",
            "type": "실드",
            "cool": 8,
            "description": "Grant a shield to 1 ally equal to 67.2%/67.2%/72.6%/72.6% of Miyu's Defense + 2542/3042/3290/3790 for 2 turns, and decrease weakness damage taken by 20%. Grant 2 Down Points and 2 Seashell stacks."
        },
        "skill3": {
            "name": "Tide of Dreams",
            "element": "버프광역",
            "type": "버프",
            "cool": 12,
            "description": "Grant a shield to all allies equal to 33.2%/33.2%/35.9%/35.9% of Miyu's Defense + 1259/1409/1629/1779 + number of Seashell stacks on party × (6.9%/6.9%/7.5%/7.5% of Miyu's Defense + 260/260/336/336) for 3 turns. Also, if an ally has 4 or more Seashell stacks, increase damage by 2.0%/2.0%/2.2%/2.2% for each stack for 3 turns. The damage increase effect lasts for 3 turns or until shield is broken, and then lose 2 Seashell stacks."
        },
        "skill_highlight": {
            "name": "Attribute Boost",
            "element": "패시브",
            "type": "패시브",
            "description": "Increase all allies' corresponding attribute stats by 15% of Phantom Thief's respective attributes."
        },
        "passive1": {
            "name": "Whispering Waves",
            "element": "패시브",
            "description": "Increase shield effect by number of party's Seashell stacks × 1.0%."
        },
        "passive2": {
            "name": "I'll Protect You!",
            "element": "패시브",
            "description": "Increase ally's Defense by 3.6% for each Seashell stack."
        }
    },
    "카요": {
        "name": "Tomiyama Kayo",
        "skill1": {
            "name": "Club Okyann",
            "element": "버프광역",
            "type": "버프광역",
            "cool": 4,
            "description": "Increase party's Attack by 12% of Tomiyama's Attack for 1 turn (up to 4500/4950/5400/5850 of Attack), increase ailment accuracy by 35.0%/38.5%/37.8%/41.3%, and gain 1 Beat stack."
        },
        "skill2": {
            "name": "Intermission",
            "element": "버프광역",
            "type": "버프광역",
            "cool": 8,
            "description": "Restore party's SP by 22/27/26/31, and grant 3 Beat stacks."
        },
        "skill3": {
            "name": "Retro Dance Number",
            "element": "버프광역",
            "type": "버프광역",
            "cool": 8,
            "description": "Increase party's damage by 10.0%/11.0%/10.8%/11.8% for 3 turns. Increase damage by 1% for every 225 of Tomiyama's Attack (up to 4500/4950/5400/5850 of Attack). Also increase damage dealt to foes with an elemental ailment by 1.5 times and gain 2 Beat stacks."
        },
        "skill_highlight": {
            "name": "Attribute Boost",
            "element": "패시브",
            "type": "패시브",
            "description": "Increase all allies' corresponding attribute stats by 15% of Phantom Thief's respective attributes."
        },
        "passive1": {
            "name": "Toe-Tapping",
            "element": "패시브",
            "description": "For every 4 Beat stacks gained, inflict 1 random elemental ailment on the foe with the highest remaining HP."
        },
        "passive2": {
            "name": "Outdated Slang",
            "element": "패시브",
            "description": "When an ally inflicts an elemental ailment on a foe, increase that ally's damage by 15.0% for 2 turns. Also, 21.0% chance to grant 1 Beat stack."
        }
    }
};

// window 객체에 할당
window.enCharacterSkillsData = enCharacterSkillsData;

// Export for use in other files
if (typeof module !== 'undefined' && module.exports) {
    module.exports = characterSkillsData;
} 