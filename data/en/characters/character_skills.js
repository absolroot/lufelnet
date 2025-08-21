const enCharacterSkillsData = {
    "원더": {
        "name": "Wonder"
    },
    "미유·여름": {
        "name": "Miyu Sahara Summer",
        "skill1": {
            "name": "Jellyfish's Dream",
            "element": "빙결광역",
            "type": "AoE DMG",
            "sp": 0,
            "cool": 0,
            "description": "Deals 100.7%/111.0%/106.9%/117.2% ATK as Ice DMG to all foes and has a 100% base chance to Freeze them for 2 turns.\nRestores 40 SP to self (this effect is affected by SP recovery traits).\nSP gained this way can exceed the maximum SP limit (up to additional SP equal to the max SP)."
        },
        "skill2": {
            "name": "Blue Concerto",
            "element": "빙결광역",
            "type": "AoE DMG",
            "sp": 0,
            "cool": 0,
            "description": "Deals 178.7%/197.0%/189.7%/208.0% ATK as Ice DMG to all foes.\nWhile in [Sea's Domain], this skill's damage increases by 10% for each stack of [Overlapping Waves]. After using this skill, you leave [Sea's Domain] and reset [Overlapping Waves]. This skill is considered an additional effect."
        },
        "skill3": {
            "name": "Riding the Light Over Blue Waves",
            "element": "버프",
            "type": "Enhance",
            "sp": 60,
            "cool": 0,
            "description": "Mount your surfboard to immediately cleanse yourself of mental ailments and deploy [Sea's Domain].\nDuring this period, you are immune to Down, mental ailments, and control effects, and cannot perform melee attacks, gun attacks, or use items.\nWhenever you gain any ailment or buff, the duration is extended by 1 turn.\nAt the end of an ally's turn during this period, if you have enough SP, automatically consume a set amount of SP to activate [Waves and Clouds].\n\n[Waves and Clouds]: Consumes 30 SP to deal 50.2%/55.3%/53.3%/58.4% ATK as Ice DMG to all foes and grants yourself 1 stack of [Overlapping Waves].\nEach stack of [Overlapping Waves] increases [Waves and Clouds] DMG by 5% and SP cost by 30, stacking up to 4 times.\n[Waves and Clouds] is considered an additional effect and does not inflict Down gauge.\nUsing this skill again removes [Sea's Domain] and resets [Overlapping Waves]. You may use other skills that turn, but cannot redeploy [Sea's Domain]."
        },
        "skill_highlight": {
            "name": "",
            "element": "빙결광역",
            "type": "AoE DMG",
            "sp": 0,
            "cool": 0,
            "description": "Deals 219.6%/242.1%/233.1%/255.6% ATK as Ice DMG to all foes.\nIf in [Sea's Domain], deals an additional 146.4%/161.4%/155.4%/170.4% ATK as Ice DMG."
        },
        "passive1": {
            "name": "Exchange",
            "element": "패시브",
            "description": "During battle, your ATK increases proportionally to your SP recovery amount, up to a 98.0% ATK increase at 280.0% SP recovery."
        },
        "passive2": {
            "name": "Cleverness",
            "element": "패시브",
            "description": "While in [Sea's Domain], DMG dealt is increased by 30%."
        }
    },
    "미나미·여름": {
        "name": "Minami Miyashita Summer",
        "skill1": {
            "name": "Summer Gift Basket",
            "element": "축복광역",
            "type": "광역피해",
            "sp": 20,
            "cool": 0,
            "description": "Deal 64.4%/71.0%/68.4%/75.0% of Max HP as Bless damage to all enemies and inflict 'Candied' state: When attacked, damage dealt increases by 9.8%/10.8%/10.4%/11.4%. (For every 1200 Max HP of Miyashita Minami Summer, damage increases by an additional 4%, up to a maximum of 11712/12912/12432/13632 HP considered.) Duration: 3 turns."
        },
        "skill2": {
            "name": "Midsummer Flower Field",
            "element": "버프",
            "type": "버프",
            "sp": 22,
            "cool": 0,
            "description": "Increase all allies' damage by 7.8%/8.6%/8.3%/9.1%. (For every 1200 Max HP of Miyashita Minami Summer, damage increases by an additional 3.2%, up to 11712/12912/12432/13632 HP considered.) Duration: 3 turns. Also grants all allies 1 stack of Bless effect and removes 1 debuff."
        },
        "skill3": {
            "name": "Bouquet Beyond the Horizon",
            "element": "버프",
            "type": "버프",
            "sp": 25,
            "cool": 2,
            "description": "Increase one ally's Critical Rate by 15.6%/17.2%/16.6%/18.2% (excluding self) and increase Critical Damage. (The increase equals 33.33% of Miyashita Minami Summer's Critical Damage beyond 100%, up to 213.4%/229.9%/229.9%/246.4% Critical Damage considered.) Duration: 3 turns.\nDuring this time, when Miyashita Minami Summer uses a medicine on that ally, additionally increase their Critical Damage. (The increase equals 16.66% of Miyashita Minami Summer's Critical Damage beyond 100%, up to 213.4%/229.9%/229.9%/246.4% Critical Damage considered.) Duration: 1 turn."
        },
        "skill_highlight": {
            "element": "버프",
            "type": "버프",
            "sp": 0,
            "cool": 0,
            "description": "Increase one ally's damage by 24.4%/26.9%/25.9%/28.4% (excluding self) and increase Critical Damage. (The increase equals 16.66% of Miyashita Minami Summer's Critical Damage beyond 100%, up to 213.4%/229.9%/229.9%/246.4% Critical Damage considered.) Duration: 2 turns. Additionally, the next medicine used by self is 9.8%/10.8%/10.4%/11.4% more effective."
        },
        "passive1": {
            "name": "Prayer",
            "element": "패시브",
            "description": "Whenever a Persona skill is used on an ally, grant them 1 stack of Bless effect. If Miyashita Minami Summer is in battle, damage dealt increases by 6.0% per Bless stack on allies, up to a maximum of 36.0%."
        },
        "passive2": {
            "name": "Care",
            "element": "패시브",
            "description": "If Miyashita Minami Summer is in battle, allies' Attack increases by 12.0%, and for each additional type of buff medicine effect, Attack increases by an additional 15.0%."
        }
    },
	"이치고": {
        "name": "Shikano Ichigo",
        "skill1": {
            "name": "Crimson Butterfly",
            "element": "주원",
            "type": "단일피해",
            "sp": 20,
            "cool": 1,
            "description": "Deal 129.0%/142.2%/137.0%/150.2% of Attack as Curse damage to 1 enemy and add 2 stacks of 『Hatred』. If the target's current HP is above 70%, this skill's damage is increased by 200%. When this skill defeats the target, it triggers its effect once more (can chain)."
        },
        "skill2": {
            "name": "Kiss of the Crimson Rose",
            "element": "주원",
            "type": "단일피해",
            "sp": 20,
            "cool": 0,
            "description": "Deal 92.9%/102.4%/98.6%/108.1% of Attack as Curse damage to 1 enemy and add 4 stacks of 『Hatred』."
        },
        "skill3": {
            "name": "Shh! Execution Time",
            "element": "주원",
            "type": "단일피해",
            "sp": 22,
            "cool": 0,
            "description": "Deal 221.6%/244.3%/235.2%/257.9% + (number of 『Hatred』 stacks × 11.7%/12.9%/12.4%/13.6%) of Attack as Curse damage to 1 enemy. If 『Hatred』 reaches 10 stacks, deal an additional 103.3%/113.8%/109.6%/120.2% of Attack as Curse damage. 『Hatred』 duration is then reset."
        },
        "skill_highlight": {
            "element": "주원",
            "type": "단일피해",
            "cool": 0,
            "description": "Deal 457.1%/503.9%/485.2%/532.0% of Attack as Curse damage to 1 enemy, and for 3 turns, 『Hatred』 can trigger critical hits. Instantly resolve all types of DoT effects on the target once, and resolve 『Hatred』 effects 2 additional times."
        },
        "passive1": {
            "name": "Covet",
            "element": "패시브",
            "description": "For each stack of 『Covet』, increase own Attack by 15.0%."
        },
        "passive2": {
            "name": "Attachment",
            "element": "패시브",
            "description": "When Ichigo Shikano is on the field, all allies' DoT effects are increased by 15.0%."
        }
    },
	"사나다": {
        "name": "Akihiko Sanada",
        "skill1": {
            "name": "Lightning Field",
            "element": "전격광역",
            "type": "광역피해",
            "sp": 20,
            "cool": 0,
            "description": "Gain 1 stack of 『Fighting Spirit』 and deal 122.8%/135.4%/130.3%/142.9% of Attack as Electric damage to all enemies, increasing Akihiko Sanada's Critical Damage by 11.7%/12.9%/12.4%/13.6% for 3 turns."
        },
        "skill2": {
            "name": "Thunder Crash",
            "element": "전격광역",
            "type": "광역피해",
            "sp": 20,
            "cool": 0,
            "description": "Gain 1 stack of 『Fighting Spirit』 and deal 92.1%/101.6%/97.8%/107.2% of Attack as Electric damage to all enemies, then gain 2 stacks of 『Determination』."
        },
        "skill3": {
            "name": "Spark Fist",
            "element": "전격광역",
            "type": "광역피해",
            "sp": 24,
            "cool": 2,
            "description": "Deal 136.4%/150.4%/144.8%/158.8% of Attack as Electric damage to all enemies. If Akihiko Sanada has 2 or more stacks of 『Fighting Spirit』, consume all of them, increasing this skill's multiplier by 40.9%/45.1%/43.1%/47.6% for each stack consumed."
        },
        "skill_highlight": {
            "name": "Theurgy - Lightning Spear",
            "element": "전격광역",
            "type": "광역피해",
            "sp": 0,
            "cool": 0,
            "description": "Activation Condition: Theurgy Energy 140\nDeal 261.7%/287.9%/293.1%/319.3% of Attack as Electric damage to all enemies. This skill will 『always critically hit』, with Critical Damage fixed at 200%."
        },
        "skill_support": {
            "name": "Support Skill",
            "element": "패시브",
            "type": "버프",
            "description": "Increase 1 ally's Critical Damage by 20% for 1 turn."
        },
        "passive1": {
            "name": "Hot-Blooded",
            "element": "패시브",
            "description": "When dealing damage to a downed enemy, Akihiko Sanada's damage increases by 30.0%."
        },
        "passive2": {
            "name": "Persistence",
            "element": "패시브",
            "description": "Each time Akihiko Sanada lands a Critical Hit, increase his Attack by 13.5% for 3 turns (up to 3 stacks)."
        }
    },
	"유카리": {
        "name": "Yukari Takeba",
        "skill1": {
            "name": "Wind Storm",
            "element": "질풍",
            "type": "단일 피해",
            "sp": 23,
            "cool": 0,
            "description": "Deal 200.1%/220.6%/212.4%/232.9% of Attack as Wind damage to 1 enemy, with a 100% base chance to inflict Windswept and apply 『Trace of Wind』 for 2 turns. Only 1 『Trace of Wind』 can exist on the field at a time. When an enemy with 『Trace of Wind』 dies, the effect transfers to the enemy with the highest HP.\n\nPassive: When an ally uses a skill on a target with 『Trace of Wind』, that skill's damage increases by 8.8%/9.7%/9.3%/10.2%, plus 0.72% for every 100 Attack Yukari Takeba has, up to 29.3%/32.3%/31.1%/34.1%."
        },
        "skill2": {
            "name": "Chaser of the Wind",
            "element": "버프광역",
            "type": "",
            "sp": 25,
            "cool": 0,
            "description": "Reduce all allies' damage taken by 29.3%/32.3%/31.1%/34.1% for 3 turns. Also increase the main target's Attack by 7.8%/8.6%/8.3%/9.1%, plus 0.78% per 100 Attack Yukari Takeba has (up to 31.2%/34.4%/33.2%/36.4%). Additionally, increase damage by 0.24% per 100 Attack (up to 9.8%/10.8%/10.4%/11.4%) for 2 turns."
        },
        "skill3": {
            "name": "Revive Arrow",
            "element": "치료광역",
            "type": "",
            "sp": 27,
            "cool": 0,
            "description": "Heal all allies for 39.1%/43.1%/41.5%/45.6% of Yukari Takeba's Attack + 2507/3158/3081/3773 HP. Consume all 『Words of Wind』 stacks, restoring 17.5 Theurgy Energy per stack to the main target. After using Theurgy, that target's Attack increases by 29.3%/32.3%/31.1%/34.1% for 2 turns (up to 2 stacks). If the Theurgy Energy restored exceeds the limit, the excess is temporarily stored and returned after Theurgy is used, up to the target's maximum Theurgy Energy and lasting for 2 turns. If the main target is not a S.E.E.S. member, each 『Words of Wind』 stack consumed increases their next HIGHLIGHT total damage by 9.8%/10.8%/10.4%/11.4%."
        },
        "skill_highlight": {
            "name": "Theurgy - Cyclone Arrow",
            "element": "질풍",
            "type": "",
            "description": "Activation Condition: Theurgy Energy 70\nDeal 416.0%/457.6%/465.9%/507.5% of Attack as Wind damage to 1 enemy, and for every 100 Attack Yukari Takeba has, increase all allies' damage by 0.48% (up to 20.0%/22.0%/22.4%/24.4%). Remove 2 buffs from the target, inflict Windswept with 100% base chance, and apply 『Trace of Wind』 for 2 turns."
        },
        "skill_support": {
            "name": "Support Skill",
            "element": "패시브",
            "type": "",
            "description": "Remove 1 status ailment from 1 ally."
        },
        "passive1": {
            "name": "Resonance",
            "element": "패시브",
            "description": "When Yukari Takeba is on the field, all allies' HIGHLIGHT and Theurgy damage increases by 45.0%."
        },
        "passive2": {
            "name": "Competitive Spirit",
            "element": "패시브",
            "description": "During battle, Yukari Takeba's Max HP increases by 60 for every 100 Attack, up to 2700."
        }
    },
	"유키 마코토": {
        "name": "Makoto Yuki",
        "skill1": {
            "name": "Flame of Melody",
            "element": "화염",
            "type": "단일피해",
            "sp": 20,
            "cool": 0,
            "description": "Deal 59.8%/66.0%/63.2%/69.6% of Attack as Fire damage 3 times to 1 enemy and gain 2 stacks of 『Moon Phase』 for 2 turns (up to 4 stacks). When Makoto Yuki uses 『Crimson Devouring Blaze』 to consume 『Moon Phase』 stacks to deal damage, the skill multiplier increases by 32.5%/35.8%/34.5%/37.8% for 2 turns."
        },
        "skill2": {
            "name": "Battle Song Under the Moon",
            "element": "버프광역",
            "type": "버프",
            "sp": 20,
            "cool": 0,
            "description": "Increase all allies' Critical Damage by 23.4%/25.8%/24.9%/27.3% and Makoto Yuki's Attack by 19.5%/21.5%/20.7%/22.7% for 2 turns. Gain 2 stacks of 『Moon Phase』 for 2 turns (up to 4 stacks)."
        },
        "skill3": {
            "name": "Crimson Devouring Blaze",
            "element": "화염",
            "type": "단일피해",
            "sp": 24,
            "cool": 0,
            "description": "Activation Condition: Have at least 2 stacks of 『Moon Phase』\nConsume all 『Moon Phase』 stacks, dealing 76.2%/84.0%/80.9%/88.7% of Attack as Fire damage per stack to 1 enemy.\nThen consume all 『Special Moon Phase』 stacks, dealing 134.6%/148.4%/142.9%/156.7% of Attack as Fire damage per stack to 1 enemy. When 『Moon Phase』 reaches 4 stacks, using this skill increases Makoto Yuki's Penetration by 11.7%/12.9%/12.4%/13.6% and damage dealt by 24.4%/26.9%/25.9%/28.4%."
        },
        "skill_highlight": {
            "name": "Theurgy - Aldana",
            "element": "화염",
            "type": "",
            "description": "Activation Condition: Theurgy Energy 100\nDeal 151.1%/162.6%/160.5%/171.6% of Attack as Fire damage 4 times to 1 enemy. Gain 1 stack of 『Special Moon Phase』 for 2 turns (up to 4 stacks)."
        },
        "skill_highlight2": {
            "name": "Theurgy - Cadenza",
            "element": "버프",
            "type": "버프",
            "description": "Activation Condition: Theurgy Energy 100\nIncrease all allies' Attack by 25.0%/26.9%/26.5%/28.4% and damage dealt by 20.0%/21.5%/21.2%/22.7% for 2 turns. Gain 1 stack of 『Special Moon Phase』 for 2 turns (up to 4 stacks)."
        },
        "skill_support": {
            "name": "Support Skill",
            "element": "패시브",
            "type": "버프",
            "description": "Increase 1 ally's Attack by 20% for 1 turn."
        },
        "passive1": {
            "name": "Lead",
            "element": "패시브",
            "description": "After using Theurgy, increase all allies' Attack by 40.0%, and S.E.E.S. allies' Attack increases by an additional 20.0%. Effect lasts 2 turns."
        },
        "passive2": {
            "name": "Trust",
            "element": "패시브",
            "description": "When Makoto Yuki gains a buff/heal/shield effect from an ally's skill, increase his Critical Damage by 7.2% for 2 turns (up to 3 stacks)."
        }
    },
	"이케나미": {
        "name": "Shoki Ikenami",
        "skill1": {
            "name": "Shining Monologue",
            "element": "축복",
            "type": "단일피해",
            "sp": 20,
            "cool": 0,
            "description": "Deal 151.8%/161.1%/158.0%/167.3% of Attack as Bless damage to 1 enemy, and all allies gain 2 stacks of Blessing. Additionally, all allies' damage increases (by 0.8% per 100 Attack of Shoki Ikenami, up to 35.1%/37.2%/36.6%/38.7%) for 2 turns."
        },
        "skill2": {
            "name": "Unfamiliar Space",
            "element": "버프",
            "type": "버프",
            "sp": 24,
            "cool": 2,
            "description": "Increase the Defense of 1 ally (excluding self) (by 0.83% per 100 Attack of Shoki Ikenami, up to 36.6%/38.9%/38.1%/40.4%), and grant immunity to certain mental ailments (Dizzy, Sleep, Confusion, Forget) for 2 turns."
        },
        "skill3": {
            "name": "Performance of the Stars",
            "element": "버프광역",
            "type": "버프",
            "sp": 24,
            "cool": 0,
            "description": "Increase all allies' Attack (by 15% of own Attack, up to 569/617/592/650) for 2 turns.\nDepending on the current 『Improvisation』 state, the main target gains additional effects.\n『Improvisation: Penetration』: For 2 turns, the main target's DoT effects increase by 14.0%/15.5%/14.5%/16.0% and Ailment Accuracy Rate increases by 30%.\n『Improvisation: Overturn』: For 2 turns, the main target's Skill Mastery increases by 655/722/682/749, and when applying TECHNICAL, Attack increases by 20%.\n『Improvisation: Empathy』: For 2 turns, the main target's Critical Damage increases by 24.4%/26.9%/25.4%/27.9%.\n『Improvisation: Resonance』: For 2 turns, the main target's Penetration increases by 12.0%/13.2%/12.5%/13.7%."
        },
        "skill_highlight": {
            "element": "버프광역",
            "type": "버프",
            "description": "Increase all allies' Attack (by 6.5% of own Attack, up to 284/302/296/314) and Effect Resistance by 82.0%/87.1%/85.3%/90.4% for 2 turns. Additionally, all allies gain 1 stack of Blessing."
        },
        "passive1": {
            "name": "True Colors",
            "element": "패시브",
            "description": "For allies with Blessing effects, damage increases by 5% per Blessing stack, up to 25.0%."
        },
        "passive2": {
            "name": "Reversal",
            "element": "패시브",
            "description": "For every 1% of Ailment Accuracy Rate, increase Attack by 0.72%, up to 72.0%."
        }
    },
	"마나카": {
        "name": "Manaka Nagao",
        "skill1": {
            "name": "Song of the Sky",
            "element": "버프광역",
            "type": "버프",
            "cool": 4,
            "description": "Increase all allies' damage by 7.0%/7.7%/7.8%/8.5% + (additional 1% damage bonus for every 164 Attack of Manaka Nagao, up to an additional 28.0%/31.8%/31.4%/34.2%) for 2 turns. Gain 4 stacks of 『Chant』."
        },
        "skill2": {
            "name": "Healing Light Song",
            "element": "치료광역",
            "type": "치료",
            "cool": 8,
            "description": "Heal all allies for 10.0%/10.0%/11.2%/11.2% of Attack + 681/816/989/1124 HP and remove 1 debuff from all allies. If 『Chant』 is present, consume 1 stack of 『Chant』 to reduce this skill’s preparation time by 1 action. Preparation time can be reduced by up to 4 actions this way. When manually cast, healing is increased by 50%.\nPassive: When Manaka Nagao accumulates 12 stacks of 『Chant』 during battle, this healing effect is automatically triggered once."
        },
        "skill3": {
            "name": "Reincarnation of Time and Space",
            "element": "버프광역",
            "type": "버프",
            "cool": 4,
            "description": "Increase all allies' Attack by 11% of Manaka Nagao's Attack + 128/141/143/156. Consume all stacks of 『Chant』, and for each stack consumed, increase all allies' Penetration (by 0.1% for every 460 Attack of Manaka Nagao) and Attack (by 0.1% for every 460 Attack of Manaka Nagao) for 2 turns. (This skill calculates up to 4600/5060/5980/6440 Attack of Manaka Nagao.)"
        },
        "skill_highlight": {
            "name": "Element Boost",
            "element": "패시브",
            "description": "Increase the corresponding attribute of all deployed allies by 20% of each Decipher Phantom Thief's attribute."
        },
        "passive1": {
            "name": "Wingbeat",
            "element": "패시브",
            "description": "Increase the Attack of allies under 『Heavenly Melody』 by 37.5%."
        },
        "passive2": {
            "name": "Determination",
            "element": "패시브",
            "description": "For every accumulated stack of 『Chant』, increase all allies' Penetration by 1.0% (up to 12 stacks)."
        }
    },
	"마유미": {
        "name": "Mayumi Hashimoto",
        "skill1": {
            "name": "Swirling Suppression",
            "element": "물리광역",
            "type": "광역피해",
            "hp": 8,
            "cool": 0,
            "description": "Deal 134.2%/148.0%/142.5%/156.2% of Attack as Physical damage to all enemies, and increase all allies' damage by 8.8%/9.7%/9.3%/10.2% for 2 turns (damage increases by an additional 2% for every 10 Speed, up to a maximum of 35.1%/38.7%/37.3%/40.9%).\nOn Extra Turn: Skill damage increases by 50% and guarantees a critical hit on the main target."
        },
        "skill2": {
            "name": "Overload Acceleration",
            "element": "버프광역",
            "type": "버프",
            "sp": 22,
            "cool": 0,
            "description": "Increase all allies' Attack by 8.8%/9.7%/9.3%/10.2% for 2 turns (Attack increases by an additional 2% for every 10 Speed, up to a maximum of 35.1%/38.7%/37.3%/40.9%), and increase Defense by 9.8%/10.9%/10.4%/11.4% (Defense increases by 2.22% for every 10 Speed, up to a maximum of 39.0%/43.0%/41.4%/45.4%).\nOn Extra Turn: Grant all allies a shield that blocks 1964/2114/2054/2204 damage for 2 turns."
        },
        "skill3": {
            "name": "Engine Roar",
            "element": "버프광역",
            "type": "버프",
            "sp": 25,
            "cool": 0,
            "description": "Increase all allies' Penetration by 1.0%/1.1%/1.0%/1.1% for 2 turns (Penetration increases by 0.22% for every 10 Speed, up to a maximum of 3.9%/4.3%/4.1%/4.5%), and increase Attack by 12.7%/14.0%/13.5%/14.8% (Attack increases by 2.89% for every 10 Speed, up to a maximum of 50.8%/56.0%/53.9%/59.1%).\nOn Extra Turn: Increase the main target's Penetration by 2.0%/2.2%/2.1%/2.3% for 1 turn (Penetration increases by 0.44% for every 10 Speed, up to a maximum of 7.8%/8.6%/8.3%/9.1%)."
        },
        "skill_highlight": {
            "element": "버프광역",
            "type": "버프",
            "description": "Increase all allies' Attack by 5.9%/6.5%/6.2%/6.8% for 2 turns (Attack increases by 1.33% for every 10 Speed, up to a maximum of 23.4%/25.8%/24.9%/27.3%), and increase damage by 5.9%/6.5%/6.2%/6.8% (damage increases by 1.33% for every 10 Speed, up to a maximum of 23.4%/25.8%/24.9%/27.3%). Additionally, when the main target deals damage to an enemy, the enemy's Down Gauge is further reduced by 1 point."
        },
        "passive1": {
            "name": "Vanguard",
            "element": "패시브",
            "description": "When Mayumi Hashimoto is on the field, Extra Turn damage dealt by all allies increases by 30.0%."
        },
        "passive2": {
            "name": "Pressurization",
            "element": "패시브",
            "description": "When Mayumi Hashimoto is on the field, all allies deal 24.0% more damage to Downed targets. If Mayumi knocks down a target, she deals an additional 48.0% Attack as Physical damage to that target."
        }
    },
	"아케치": {
        "name": "Goro Akechi",
        "skill1": {
            "name": "Promise of Justice",
            "element": "축복광역",
            "type":"광역피해",
            "sp": 20,
            "cool": 0,
            "description": "Deal 93.2%/102.8%/98.9%/108.5% of Attack as Bless damage to all enemies, heal all allies for 1561/1561/1657/1657 HP, and grant all allies 1 stack of Blessing. Gain 『Truth』 and enter the 『Accuracy』 state for 2 turns. In the 『Accuracy』 state, all allies' damage dealt increases by 19.5%/21.5%/20.7%/22.7%."
        },
        "skill2": {
            "name": "Tilted Hunting Ground",
            "element": "주원광역",
            "type":"광역피해",
            "sp": 20,
            "cool": 0,
            "description": "Deal 116.5%/128.5%/123.7%/135.6% of Attack as Curse damage to all enemies. Gain 『Truth』 and enter the 『Chaos』 state for 2 turns. In the 『Chaos』 state, all enemies' Defense decreases by 25.4%/28.0%/26.9%/29.5%, 『Chaos Arrows』 activation count increases by 1, and damage dealt increases by 19.5%/21.5%/20.7%/22.7%."
        },
        "skill3": {
            "name": "Golden Arrow Rain · Ruin",
            "element": "만능광역",
            "type":"광역피해",
            "sp": 24,
            "cool": 0,
            "description": "Activation Condition: Possess 『Truth』\nConsume all 『Accurate Arrows』 to deal fixed Almighty damage equal to 『Accurate Arrows』 recorded damage × 19.5%/21.5%/20.7%/22.7% to all enemies. Then, fire 『Chaos Arrows』 4 times at random enemies, each dealing 77.4%/85.3%/82.2%/90.1% of Attack as Almighty damage. Prioritizes enemies not yet hit, and if the same target is hit multiple times, subsequent hits deal 15% of the damage."
        },
        "skill_highlight": {
            "element": "만능",
            "type":"광역피해",
            "description": "Deal 103.5%/114.1%/109.8%/120.4% of Attack as Bless damage once, and 103.5%/114.1%/109.8%/120.4% as Curse damage once to all enemies. Increase 『Chaos Arrows』 activation count by 2, lasting for 4 turns."
        },
        "passive1": {
            "name": "Doctrine",
            "element": "패시브",
            "description": "When Goro Akechi joins the team, he can trigger a Desire Sonata of any element. At the start of battle, damage dealt increases by 15.0% for each Desire Sonata activated."
        },
        "passive2": {
            "name": "Craving",
            "element": "패시브",
            "description": "When dealing Almighty damage, for every 1% Defense Reduction effect on the target, Akechi's damage increases by 0.5% (up to 120.0%)."
        }    
    },
	"미오": {
        "name": "Mio Natsukawa",
        "skill1": {
            "name": "Echo of Waves",
            "element": "빙결광역",
            "type":"디버프", 
            "sp": 20,
            "cool": 0,
            "description": "Gain 1 stack of 『Flame Suppression』. Deal 97.6%/107.6%/103.6%/113.6% of Attack as Ice damage to all enemies, with a 50% base chance to inflict Freeze. Also reduce Defense by 7.8%/8.6%/8.3%/9.1% (Defense decreases by an additional 1% per 5.47% Ailment Accuracy, up to 31.2%/34.4%/33.2%/36.4%), and increase Skill Mastery by 195/195/207/207 points when attacking this unit, lasting 3 turns. If there are enemies with Burn, remove Burn and inflict all enemies with 『Blazing Breath』 (『Blazing Breath』 cannot trigger this effect).\n『Blazing Breath』: Treated as Burn for 3 turns. All Phantom Thieves gain 976/1076/1036/1136 Skill Mastery when attacking units with this state."
        },
        "skill2": {
            "name": "Binding Waves",
            "element": "빙결",      
            "type":"제어",
            "sp": 20,
            "cool": 0,
            "description": "Deal 195.2%/215.2%/207.2%/227.2% of Attack as Ice damage to a single enemy and apply an Ice TECHNICAL. When 『Ice Seal』 triggers, its base chance increases to 43.9%/48.4%/46.6%/51.1%."
        },      
        "skill3": {
            "name": "Burst of the Current",
            "element": "빙결광역",
            "type":"디버프",
            "sp": 20,
            "cool": 0,
            "description": "Can be cast upon reaching 2 stacks of 『Flame Suppression』.\nConsume 2 stacks of 『Flame Suppression』 to deal 109.8%/121.1%/116.5%/127.8% of Attack as Ice damage to all enemies and reduce Defense by 7.3%/8.1%/7.7%/8.5% (Defense decreases by an additional 1% per 5.83% Ailment Accuracy, up to 29.3%/32.3%/31.1%/34.1%), lasting 2 turns. Also applies Ice TECHNICAL, and when 『Ice Flame』 triggers, it always hits and the effect upgrades to 『Lightbringer』.\n『Lightbringer』: Increases all damage received by 9.8%/10.8%/10.4%/11.4% (increases by 1% per 4.38% Ailment Accuracy, up to 39.0%/43.0%/41.4%/45.4%).\n\nUpon reaching 4 stacks of 『Flame Suppression』, this skill upgrades to 『Dragon Surge Explosion』.\n『Dragon Surge Explosion』: Consume 4 stacks of 『Flame Suppression』 to deal 131.8%/145.3%/139.9%/153.4% of Attack as Ice damage to all enemies and reduce Defense by 8.8%/9.7%/9.3%/10.2% (Defense decreases by an additional 1% per 4.86% Ailment Accuracy, up to 35.1%/38.7%/37.3%/40.9%), lasting 2 turns. Also applies Ice TECHNICAL, and when 『Ice Flame』 triggers, it always hits and upgrades to 『Lightbringer』.\n『Lightbringer』: Increases all damage received by 11.7%/12.9%/12.4%/13.6% (increases by 1% per 3.65% Ailment Accuracy, up to 46.8%/51.6%/49.7%/54.5%)."
        },
        "skill_highlight": {
            "element": "빙결광역",
            "type":"디버프",
            "description": "Deal 39.0%/43.0%/41.4%/45.4% of Attack as Ice damage to all enemies and increase their damage taken for 2 turns (1% increase per 5.83% Ailment Accuracy, up to 29.3%/32.3%/31.1%/34.1%). Also apply Ice TECHNICAL to the target, increasing 『Ice Seal』 base chance to 28%, and enemies under Ice Seal take increased damage (1% increase per 17.5% Ailment Accuracy, up to 9.8%/10.8%/10.4%/11.4%). Then deal 117.1%/129.1%/124.3%/136.3% of Attack as Ice damage to all enemies."
        },
        "passive1": {
            "name": "Protection",
            "element": "패시브",
            "description": "Whenever Mio Natsukawa applies TECHNICAL, all Phantom Thieves gain a shield blocking 1050 damage for 2 turns."
        },
        "passive2": {
            "name": "Threat",
            "element": "패시브",
            "description": "While Mio Natsukawa is on the field, enemies affected by Freeze take 27.0% more damage."
        }
    },
    "루우나": {
        "name": "Runa Dogenzaka",
        "skill1": {
            "name": "Fiery Handshake",
            "element": "화염광역",
            "type":"디버프",
            "sp": 22,
            "cool": 0,
            "description": "Deals 73.2%/80.7%/77.7%/85.2% of Attack as Fire damage to all enemies. Reduces the target's Defense (by 15.4% of her Ailment Accuracy Rate, up to 26.4%/29.2%/27.9%/30.7%), and when hit by Fire skills, their Defense is further reduced by 26.4%/26.4%/28.0%/28.0% for 2 turns. Also has a 50% base chance to inflict Burn. Runa gains 『Heated Welcome』 (if both this and 『Warning to Villains』 apply, the highest Defense reduction value is used)."
        },
        "skill2": {
            "name": "Warning to Villains",
            "element": "화염",
            "type":"디버프",
            "sp": 22,
            "cool": 0,
            "description": "Deals 170.8%/188.3%/181.3%/198.8% of Attack as Fire damage to 1 enemy, and reduces their Defense by 14.6%/14.6%/15.5%/15.5% + (31.4% of her Ailment Accuracy Rate, up to 53.7%/59.3%/56.9%/62.5%) for 2 turns. Runa gains 『Relentless Pursuit』 (if both this and 『Fiery Handshake』 apply, the highest Defense reduction value is used)."
        },
        "skill3": {
            "name": "GOGO Woof!",
            "element": "화염광역",
            "type":"디버프",
            "sp": 24,
            "cool": 0,
            "description": "Depending on whether she has 『Heated Welcome』 or 『Relentless Pursuit』, this skill will trigger a different effect, but only one can activate at a time.\n『Heated Welcome』: Deals 109.8%/109.8%/116.6%/116.6% of Attack as Fire damage to all enemies, and for 2 turns, increases damage they take (by 24% of her Ailment Accuracy Rate, up to 41.0%/45.2%/43.5%/47.7%) and Fire damage taken by 20.5%/22.7%/21.7%/23.9%.\n『Relentless Pursuit』: Deals 219.6%/219.6%/233.1%/233.1% of Attack as Fire damage to 1 enemy, and for 2 turns, increases damage they take (by 34.3% of her Ailment Accuracy Rate, up to 58.6%/64.7%/62.1%/68.2%) and additional effect damage by 29.3%/31.6%/31.8%/34.1%."
        },
        "skill_highlight": {
            "element": "화염광역",
            "type":"디버프",
            "description": "Deals 214.7%/236.7%/227.9%/249.9% of Attack as Fire damage to all enemies, and the enemy team gains 2 stacks of 『Super Villain』.\n『Super Villain』: When any enemy is hit by a Chase (additional effect) skill or Fire skill, 1 stack is consumed, and for 2 turns, they take increased damage (by 22.9% of her Ailment Accuracy Rate, up to 39.0%/43.0%/41.4%/45.4%)."
        },
        "passive1": {
            "name": "Loyalty",
            "element": "패시브",
            "description": "During battle, she gains an Attack bonus equal to 60.0% of her Ailment Accuracy Rate."
        },
        "passive2": {
            "name": "Passion",
            "element": "패시브",
            "description": "After applying a debuff to an enemy with a skill, her Attack increases by 33.0%. When allies deal Fire or additional effect damage, she gains the same Attack increase effect for 1 turn."
        }
    },
    "리코": {
        "name": "Riko Tanemura",
        "skill1": {
            "name": "Crimson Shadow Arts",
            "element": "버프광역",
            "type":"디버프",
            "cool": 4,
            "description": "Reduces all enemies' Defense by 10.0%/10.0%/10.8%/10.8%. If Riko's Speed is over 100, every additional 10 points reduces Defense by an extra 4.9%, up to 29.4%/32.3%/31.8%/34.7%. Lasts for 2 turns. At the same time, the main target's 『Weak Point』 is exposed."
        },
        "skill2": {
            "name": "Illusion of Plum Blossoms",
            "element": "버프광역",
            "type":"디버프",
            "cool": 8,
            "description": "Increases damage taken by all enemies by 10.5%/11.6%/11.3%/12.4% for 2 turns. When an allied Phantom Thief reduces down gauge or knocks an enemy down, the cooldown of this skill is reduced by 1 action. When the cooldown reaches 0 actions, this skill automatically activates once."
        },
        "skill3": {
            "name": "Gentle Drizzle",
            "element": "버프광역",
            "type":"버프",
            "cool": 8,
            "unlock": "『Intel』 stacks ≥ 5",
            "description": "Activation Condition: 『Intel』 stacks ≥ 5\nConsumes all 『Intel』 to grant all allies 『Arrogance』 and heal the main target by 12.7%/12.7%/13.7%/13.7% of HP.\n『Arrogance』: Increases damage dealt by 12.6%/13.8%/13.6%/14.8%, with additional damage bonuses for each 『Intel』 consumed (if Riko's Speed is over 100, every additional 10 points increases damage by 1.05%, up to 6.3%/6.9%/6.8%/7.4%). Lasts for 1 turn."
        },
        "skill_highlight": {
            "name": "Attribute Boost",
            "element": "패시브",
            "type":"패시브",
            "description": "Increases all allies' corresponding attribute stats by 15% of the Revealed Phantom Thief's attributes."
        },
        "passive1": {
            "name": "Butterfly's Dream",
            "element": "패시브",
            "description": "At battle start, if Riko's Speed exceeds 100, for each point above 100, all Phantom Thieves gain +6 HP, +2 ATK, and +2 DEF, up to a maximum of +360 HP, +120 ATK, and +120 DEF."
        },
        "passive2": {
            "name": "Song of the Crane",
            "element": "패시브",
            "description": "All enemies take 60.0% more damage from ONEMORE and All-Out Attacks."
        }
    },
    "리코·매화": {
        "name": "Riko Tanemura·Vast",
        "skill1": {
            "name": "Scattering Plum Blossoms",
            "element": "질풍",
            "type":"단일피해",
            "cool": 0,
            "description": "Deals 183.0%/201.7%/194.3%/213.0% of Riko Tanemura·Vast's ATK as Wind damage to 1 enemy and inflicts Windswept with a 100% base chance for 2 turns. Also inflicts 『Falling Petals』, causing Wind damage dealt to increase by 18.3% of the portion exceeding Riko Tanemura·Vast's Crit Mult over 100% (up to 388.0%/418.0%/418.0%/448.0% Crit Mult), lasting 2 turns.\nRiko Tanemura·Vast recovers 16 SP."
        },
        "skill2": {
            "name": "Plum Under the Umbrella",
            "element": "버프광역",
            "type":"버프",
            "cool": 0,
            "description": "Increases all allies' ATK by 12.8% of the portion exceeding Riko Tanemura·Vast's Crit Mult over 100% (up to 388.0%/418.0%/418.0%/448.0% Crit Mult) for 2 turns and restores 4 SP.\nDuring this time, when any ally deals Persona Skill/Additional Effect/HIGHLIGHT damage, Riko Tanemura·Vast recovers 12 SP (triggers once per turn)."
        },
        "skill3": {
            "name": "Lingering Plum Scent",
            "element": "버프",
            "type":"버프",
            "sp": "50 - 200",
            "cool": 0,
            "description": "Consumes all SP to increase 1 ally's Critical Rate (excluding self) by 16.0%/17.0%/17.0%/18.0%, and for every 2 SP spent, the following effects are enhanced by 1% strength for 2 turns (applies up to 388.0%/418.0%/418.0%/448.0% Crit Mult of Riko Tanemura·Vast).\n\n· 50+ SP spent: ATK increase, +2.4 ATK for every 1% exceeding Riko Tanemura·Vast's Crit Mult over 100%.\n· 100+ SP spent: Crit Mult increase, +12% of the portion exceeding Riko Tanemura·Vast's Crit Mult over 100%.\n· 150+ SP spent: Additional Crit Mult increase, +6% of the portion exceeding Riko Tanemura·Vast's Crit Mult over 100%."
        },
        "skill_highlight": {
            "element": "버프",
            "type":"버프",
            "description": "Increases 1 ally's ATK (excluding self) for 2 turns (ATK +2.5 for every 1% exceeding Riko Tanemura·Vast's Crit Mult over 100%, up to 388.0%/418.0%/418.0%/448.0% Crit Mult) and Crit Mult by 24.4%/26.9%/25.9%/28.4%.\nRestores 20 SP to all other allies."
        },
        "passive1": {
            "name": "Full Bloom",
            "element": "패시브",
            "description": "After using 『Lingering Plum Scent』, the skill's main target gains 『Flower Bud』 for 2 turns.\nEach time the target deals skill damage, gains 1 stack of 『Bloom』 increasing ATK by 30 for 3 turns (up to 10 stacks).\nAt 5 stacks of 『Bloom』, ATK increases by 8.0% of the portion exceeding Riko Tanemura·Vast's Crit Mult over 100%, and Crit Mult increases by 5.0% of the portion exceeding 100%.\nAt 10 stacks, Crit Mult further increases by 5.0% of the portion exceeding Riko Tanemura·Vast's Crit Mult over 100%."
        },
        "passive2": {
            "name": "Vigor",
            "element": "패시브",
            "description": "During battle, Riko Tanemura·Vast's Crit Mult increases according to SP recovered, up to +84.0% Crit Mult for 450.0% SP recovered."
        }
    },
    "마사키": {
        "name": "Masaki Ashiya",
        "skill1": {
            "name": "Blessing of Compassion",
            "element": "빙결",
            "type":"단일피해",
            "sp": 24,
            "cool": 0,
            "description": "Deals 149.2%/164.2%/158.4%/173.4% of Masaki Ashiya's DEF as Ice damage to 1 designated enemy and 44.8%/50.3%/47.6%/53.1% of DEF as Ice damage to other enemies, with a 97.6%/97.6%/103.6%/103.6% base chance to Freeze the main target. Masaki Ashiya restores 2 『Valor』. If Masaki Ashiya is under 『Declaration of Justice』, the main target takes additional damage for 2 turns (1% extra damage per 600 DEF, up to 9.8%/10.8%/10.4%/11.4%). However, 『Valor』 recovery is reduced to 1 point."
        },
        "skill2": {
            "name": "Guardian of Honor",
            "element": "버프",
            "type":"실드",
            "sp": 26,
            "cool": 0,
            "description": "Grants 1 stack of 『Saint of Honesty』 to 1 ally, blocking 22.8%/22.8%/24.2%/24.2% of DEF + 650/790/799/939 damage, and increases DEF by 20% of Masaki Ashiya's DEF (up to 1220/1345/1295/1420) for 2 turns. If the ally’s HP is above 60% when applied, their chance of being targeted increases by 50%. At the start of Masaki Ashiya's next turn, that ally gains 1 additional stack of 『Saint of Honesty』. If under 『Declaration of Justice』, the shield amount of 『Saint of Honesty』 is increased by 25% for 2 turns."
        },
        "skill3": {
            "name": "Prayer of the Soul",
            "element": "버프광역",
            "type":"실드",
            "sp": 30,
            "cool": 1,
            "description": "Grants all allies 1 stack of 『Saint of Honesty』 blocking DEF ×12% +360 damage and 1 stack of 『Blessing of Purity』 blocking 49.2%/49.2%/52.2%/52.2% of DEF +1400/1705/1721/2026 damage. All allies gain 1 down gauge reduction and a damage increase (1% per 300 DEF, up to 19.5%/21.5%/20.7%/22.7%) for 2 turns."
        },
        "skill_highlight": {
            "element": "버프광역",
            "type":"실드",
            "description": "Grants all allies 1 stack of 『Blessing of Purity』 blocking 59.0%/59.0%/62.7%/62.7% of DEF +1681/2044/2066/2429 damage. All allies take 31.9%/35.1%/33.9%/37.1% less damage for 2 turns."
        },
        "passive1": {
            "name": "Sacrifice",
            "element": "패시브",
            "description": "All allies protected by Masaki Ashiya's shield gain 24.0% increased DEF."
        },
        "passive2": {
            "name": "Humility",
            "element": "패시브",
            "description": "All allies protected by Masaki Ashiya's shield gain 48.0% increased Effect RES."
        }
    },
    "마코토": {
        "name": "Makoto Niijima",
        "skill1": {
            "name": "Sanctioned Drift",
            "element": "핵열광역",
            "type":"광역피해",
            "sp": 20,
            "cool": 0,
            "description": "Deal Nuclear damage to foes equal to 83.0%/91.5%/88.1%/96.6% of Attack (5 hits). From the second hit, prioritze new targets and change damage to 20% for hits on the same target. Also inflict a random elemental ailment on the target of each hit, prioritizing inflicting ones the target doesn't have.\nIf the target has an elemental ailment, activate a Techincal and deal bonus Nuclear damage equal to 29.3%/29.3%/31.1%/31.1% of Attack.\nInflict Radiation on the main target for 2 turns."
        },
        "skill2": {
            "name": "President's Prowess",
            "element": "치료",
            "type":"단일치료",
            "sp": 22,
            "cool": 0,
            "description": "Restore HP to 1 ally equal to 52.7%/52.7%/55.9%/55.9% of Makoto's Attack + 1500/1824/1844/2168, and increase Makoto's Attack by 48.8%/53.8%/51.8%/56.8% for 2 turns.\nAlso gain 3 Tenacity stacks, and gain additional Tenacity stacks for each elemental ailment on foes."
        },
        "skill3": {
            "name": "Nuclear Fury",
            "element": "핵열",
            "type":"단일피해",
            "sp": 21,
            "cool": 0,
            "description": "Deal Nuclear damage to 1 foe equal to 210.6%/232.2%/223.6%/245.1% of Attack, and gain 2 Tenacity stacks.\nIf the main target has an elemental ailment, activate a Technical, dealing bonus Nuclear damage equal to 39.0%/43.0%/41.4%/45.4% of Attack.\nWhen Crash Out is active, evolve this skill to Thermonuclear Fury.\nThermonuclear Fury: Deal Nuclear damage to 1 foe equal to 243.6%/268.6%/258.6%/283.5% of Attack. For each different elemental ailment the foe has, activate a Technical, dealing bonus Nuclear damage equal to 34.2%/37.7%/36.3%/39.8% of Attack (up to 3 hits)."
        },
        "skill_highlight": {
            "element": "핵열",
            "type":"단일피해",
            "description": "Deal Nuclear damage to 1 foe equal to 468.5%/516.5%/497.3%/545.3% of Attack, gain 2 Frenzied Voltage stacks, and activate the following effects.\nSpend 1 Frenzied Voltage stack to inflict 1 random elemental ailment on foes, continuing until foes have 2 elemental ailments. Spend all remaining Frenzied Voltage stacks to increase the damage of this skill by 20% per stack."
        },
        "passive1": {
            "name": "Chief Strategist",
            "element": "패시브",
            "description": "During battle, for each different type of elemental ailment on foes, increase Attack by 15.0%."
        },
        "passive2": {
            "name": "Unshakable Will",
            "element": "패시브",
            "description": "At the start of battle, increase damage reduction rate by 6.0%, and when Crash Out is active, increase damage reduction rate by 6.0% more (up to 18.0%)."
        }
    },
    "모토하·여름": {
        "name": "Motoha Arai·Summer",
        "skill1": {
            "name": "Summer Magic",
            "element": "축복광역",
            "type":"광역피해",
            "sp": 20,
            "cool": 0,
            "description": "Deals 87.8%/96.8%/93.2%/102.2% of Motoha Arai·Summer's ATK as Bless damage to all enemies. If she is in the 『Midsummer』 state, consumes 10% of her max HP to deal an additional 29.3%/32.3%/31.1%/34.1% of Bless damage to all enemies once."
        },
        "skill2": {
            "name": "Leisurely Vacation",
            "element": "축복",
            "type":"단일피해",
            "sp": 20,
            "cool": 0,
            "description": "Deals 136.6%/150.6%/145.0%/159.0% of Motoha Arai·Summer's ATK as Bless damage to 1 enemy and restores 20% of her max HP. If she is in the 『Midsummer』 state, deals an additional 34.2%/37.7%/36.3%/39.8% of Bless damage to the target once."
        },
        "skill3": {
            "name": "Wave Chaser",
            "element": "축복광역",
            "type":"광역피해",
            "sp": 24,
            "cool": 5,
            "description": "Immediately enters 『Midsummer』 state, lasting until the end of the next turn. Consumes 15% of her max HP to deal 159.7%/176.0%/169.5%/185.8% of Bless damage to all enemies. While in 『Midsummer』, her Critical Rate increases by 9.8%/9.8%/10.4%/10.4%, and her damage increases by 29.3%/29.3%/31.1%/31.1%."
        },
        "skill_highlight": {
            "element": "축복광역",
            "type":"광역피해",
            "description": "Deals 195.2%/215.2%/207.2%/227.2% of Motoha Arai·Summer's ATK as Bless damage to all enemies and restores 20% of her max HP. If her HP is above 50%, the HIGHLIGHT skill damage increases by an additional 25%."
        },
        "passive1": {
            "name": "Shade",
            "element": "패시브",
            "description": "When Motoha Arai·Summer receives overhealing, her damage increases by 30.0% for 2 turns."
        },
        "passive2": {
            "name": "Heatwave",
            "element": "패시브",
            "description": "If Motoha Arai·Summer's max HP exceeds 8000 during battle, she gains an additional 24 ATK for every extra 100 max HP, up to a maximum of 1920."
        }
    },
    "몽타뉴·백조": {
        "name": "Kotone Montagne·Swan",
        "skill1": {
            "name": "Prelude of the Storm/Chilling Wind",
            "element": "질풍빙결",
            "type":"단일피해",
            "sp": 24,
            "cool": 0,
            "description": "『Spring Form』: Deals 65.9%/72.7%/69.9%/76.7% of Kotone Montagne·Swan's ATK as Wind damage to 1 enemy 3 times and has a 30% base chance to inflict Gust. If Kotone Montagne·Swan is within 『Spring Barrier』, additionally inflicts 『Wind Wound』 for 2 turns. Attacking enemies under 『Wind Wound』 increases Crit Mult by 29.3%/29.3%/31.1%/31.1%.\n\n『Winter Form』: Deals 122.2%/134.7%/129.7%/142.2% of Kotone Montagne·Swan's ATK as Ice damage to 1 enemy, with a 97.6%/97.6%/103.6%/103.6% base chance to Freeze. If the target is already Frozen, inflicts 『Frostbite』 for 2 turns. Enemies with 『Frostbite』 take 13.7%/13.7%/14.5%/14.5% more Ice damage."
        },
        "skill2": {
            "name": "Drifting Clouds/Snowfall Plains",
            "element": "질풍빙결광역",
            "type":"광역피해",
            "sp": 24,
            "cool": 0,
            "description": "『Spring Form』: Deals 31.3%/34.5%/33.3%/36.5% of Kotone Montagne·Swan's ATK as Wind damage to all enemies 3 times. If within 『Spring Barrier』, additionally gains 1 『Morning Dew Crystal』.\n\n『Winter Form』: Deals 83.8%/92.4%/89.0%/97.6% of Kotone Montagne·Swan's ATK as Ice damage to all enemies, with a 48.8%/48.8%/51.8%/51.8% base chance to Freeze. If within 『Winter Barrier』, this attack's damage is increased by 20%."
        },
        "skill3": {
            "name": "Approaching Spring/Winter Night Waltz",
            "element": "질풍빙결",
            "type":"단일피해",
            "sp": 28,
            "cool": 0,
            "description": "『Spring Form』: Casts 『Spring Barrier』 lasting 1 turn, dealing 82.9%/91.5%/87.9%/96.5% of Kotone Montagne·Swan's ATK as Wind damage to 1 enemy 3 times. While 『Spring Barrier』 is active, when any Phantom Thief deals Wind damage via Persona Skills, HIGHLIGHT, or Extra Effects, deals additional Wind damage equal to 20% of Kotone Montagne·Swan's ATK to the main target and grants 1 『Morning Dew Crystal』 to Kotone Montagne·Swan. When 『Spring Barrier』 ends, consumes all 『Morning Dew Crystals』 to deal (3 + number of crystals) * 34.2%/37.7%/36.3%/39.8% of Kotone Montagne·Swan's ATK as Wind damage to the current main target. This damage counts as Extra Damage.\n\n『Winter Form』: Casts 『Winter Night Barrier』 lasting 1 turn, dealing 183.2%/201.9%/194.5%/213.2% of Kotone Montagne·Swan's ATK as Ice damage to 1 enemy. While 『Winter Night Barrier』 is active, after any Phantom Thief is attacked, all allies gain a 『Snowball Shield』 that blocks 1301/1301/1381/1381 damage. This effect triggers up to 2 times. When any Phantom Thief deals Ice damage via Persona Skills, HIGHLIGHT, or Extra Effects, Kotone Montagne·Swan gains 1 『Winter Frost Crystal』. When 『Winter Night Barrier』 ends, consumes all 『Winter Frost Crystals』 to deal (3 + number of crystals) * 27.9%/30.8%/29.6%/32.5% of Kotone Montagne·Swan's ATK as Ice damage to the current main target. This damage counts as Extra Damage."
        },
        "skill_highlight": {
            "element": "질풍빙결",
            "type":"단일피해",
            "description": "『Spring Form』: Deals 149.6%/165.0%/158.8%/174.2% of Kotone Montagne·Swan's ATK as Wind damage to 1 enemy 3 times. If within 『Spring Barrier』, gains an extra 『Morning Dew Crystal』 exceeding the normal limit. Otherwise, deals an additional Wind damage hit to the target.\n\n『Winter Form』: Deals 380.6%/419.6%/404.0%/443.0% of Kotone Montagne·Swan's ATK as Ice damage to 1 enemy, with a 68.3%/68.3%/72.5%/72.5% base chance to inflict 『Ice Seal』 for 1 turn. If within 『Winter Night Barrier』, the base chance of 『Ice Seal』 increases by 29.3%/29.3%/31.1%/31.1%. Otherwise, this attack's damage is increased by 20%."
        },
        "passive1": {
            "name": "Cherishment",
            "element": "패시브",
            "description": "If another Wind Phantom Thief is in the team, Kotone Montagne·Swan's Wind damage increases by 33.0%. If another Ice Phantom Thief is in the team, Kotone Montagne·Swan's Ice damage increases by 33.0%."
        },
        "passive2": {
            "name": "Yearning",
            "element": "패시브",
            "description": "『Spring Form』: Each time a Phantom Thief deals Wind damage, all Phantom Thieves' ATK increases by 8.1% for 2 turns (stacks up to 5 times). 『Winter Night Form』: Each time Kotone Montagne·Swan gains a shield, all Phantom Thieves' DEF increases by 9.0% for 2 turns (stacks up to 4 times)."
        }
    },
    "아야카": {
        "name": "Ayaka Sakai",
        "skill1": {
            "name": "Passionate Sonata",
            "element": "전격광역",
            "type":"광역피해",
            "sp": 20,
            "cool": 0,
            "description": "Deals 85.4%/94.1%/90.7%/99.4% of Ayaka Sakai's ATK as Elec damage to all enemies. If there is an 『Enthusiastic Audience』, they deal an additional 83.3%/91.8%/88.4%/96.9% of their ATK as Elec damage to the main target once."
        },
        "skill2": {
            "name": "Improvised Solo",
            "element": "버프",
            "type":"버프",
            "sp": 20,
            "cool": 0,
            "description": "Selects 1 ally to become an 『Enthusiastic Audience』, increasing their ATK by 24% of Ayaka Sakai's ATK for 3 turns (up to 976/1076/1036/1136). Only one 『Enthusiastic Audience』 can exist at a time."
        },
        "skill3": {
            "name": "Finale: Resonance Activation",
            "element": "버프",
            "type":"버프",
            "sp": 25,
            "cool": 1,
            "description": "Selects 1 ally to immediately cast their HIGHLIGHT skill. The damage of this HIGHLIGHT is increased by 78.1%/86.1%/82.9%/90.9%. HIGHLIGHTs triggered this way do not count towards the character’s HIGHLIGHT cooldown. If the target is an S.E.E.S. member, the effect changes to a 20.7% boost to their next Theurgy final damage."
        },
        "skill_highlight": {
            "element": "버프광역",
            "type":"버프",
            "description": "For 4 Phantom Thief actions, all allies receive a 45.5%/50.1%/48.3%/52.9% damage bonus. During this period, allies recover 10% HIGHLIGHT energy after each action, up to 40% total."
        },
        "passive1": {
            "name": "Accent",
            "element": "패시브",
            "description": "When an ally Phantom Thief uses HIGHLIGHT/Theurgy, that Phantom Thief’s ATK is immediately increased by 24.0% for 1 turn. If that ally is the Enthusiastic Audience, the effect is increased by 1.5x."
        },
        "passive2": {
            "name": "Stroke",
            "element": "패시브",
            "description": "After an ally Phantom Thief uses HIGHLIGHT/Theurgy, Ayaka Sakai instantly restores 15.0% of her ATK + 1350 HP to the ally with the lowest HP ratio."
        }
    },
    "야오링·사자무": {
        "name": "Yaoling Li·Lion Dance",
        "skill1": {
            "name": "New Year's Blessing",
            "element": "화염광역",
            "type":"광역피해",
            "sp": 20,
            "cool": 0,
            "description": "Deals 120.4%/132.8%/127.8%/140.2% of Yaoling Li·Lion Dance's ATK as Fire damage to all enemies and increases her Critical Rate by 10% for 2 turns. 『Firework Meteor』 is enhanced, dealing an additional 72.8%/80.2%/77.3%/84.7% of her ATK as Fire damage for 1 turn."
        },
        "skill2": {
            "name": "Song of Fireworks",
            "element": "화염광역",
            "type":"광역피해",
            "sp": 20,
            "cool": 0,
            "description": "Deals 73.8%/81.4%/78.3%/85.9% of Yaoling Li·Lion Dance's ATK as Fire damage to all enemies, with a 75% base chance to inflict Burn and 『Flames of Time』 for 2 turns. 『Firework Meteor』 is enhanced to have a 75% base chance to inflict 『Flames of Time』 for 1 turn.\n『Flames of Time』: Deals 63.4%/69.9%/67.3%/73.8% of Yaoling Li·Lion Dance's ATK as Fire damage each turn, lasting 2 turns (up to 4 stacks)."
        },
        "skill3": {
            "name": "Meteor Fire",
            "element": "버프",
            "type":"버프",
            "sp": 24,
            "cool": 1,
            "description": "Ignites her blade and enters 『Dance of Iron Flowers』 state, increasing damage dealt by 34.3%/37.8%/36.4%/39.9%. During this time, her melee attack is enhanced into 『Firework Meteor』. Lasts 1 turn or until 『Firework Meteor』 is cast.\n『Firework Meteor』: Deals 127.4%/140.4%/135.2%/148.2% of her ATK as Fire damage to all enemies and inflicts Fire TECHNICAL. When 『Explosive Combustion』 is triggered, TECHNICAL effect is increased by up to 20%.\nStarts with a 1-turn cooldown. After casting this skill, other skills can still be used in the same turn. This skill is not considered a Persona skill."
        },
        "skill_highlight": {
            "element": "화염광역",
            "type":"광역피해",
            "description": "Deals 205.9%/227.0%/218.6%/239.7% of Yaoling Li·Lion Dance's ATK as Fire damage to all enemies. Increases her ATK by 19.5%/21.5%/20.7%/22.7% and increases 『Firework Meteor』's damage by 19.5%/21.5%/20.7%/22.7% for 2 turns."
        },
        "passive1": {
            "name": "Auspice",
            "element": "패시브",
            "description": "Increases damage dealt to Burned enemies by 36.0%."
        },
        "passive2": {
            "name": "Harmony",
            "element": "패시브",
            "description": "At the start of battle, increases her ATK by 30.0% for 2 turns. When she or allies inflict TECHNICAL, the duration of this effect resets and its effect increases up to 45.0%."
        }
    },
    "유우미": {
        "name": "Yumi Shiina",
        "skill1": {
            "name": "Tempting Build",
            "element": "버프광역",
            "type":"버프",
            "cool": 6,
            "description": "Increase party's Attack by 8.7% of Yumi's Attack for 3 turns (up to 4600/5060/5980/6440of Attack).\nWhen an ally uses a skill, spend 1 Cocktail to strengthen that skill's effects.\nHigher quality Cocktails will be used first. Tailor-Made, Standard, and Basic Cocktails will increase skill effects by 120%, 100%, and 50% respectively.\nCooldown Time: 6 ally actions."
        },
        "skill2": {
            "name": "Charming Gaze",
            "element": "버프",
            "type":"버프",
            "cool": 4,
            "description": "Increase 1 ally's damage by 1% for every 230 of Yumi's Attack (up to 4600/5060/5980/6440of Attack) and their max HP by 13.0%/13.0%/14.6%/14.6% for 2 turns. When the target deals damage to a foe, restore the target's HP by 2% of damage dealt for 1 turn.\nWhen activating a skill, spend 1 Basic or Standard Cocktail to gain 1 Tailor-Made Cocktail."
        },
        "skill3": {
            "name": "Fragrant Wine",
            "element": "버프광역",
            "type":"버프",
            "cool": 8,
            "unlock": "This skill requires Cocktails.",
            "description": "Spend all Cocktails to increase party's attribute damage based on the targeted ally's attribute for 2 turns.\nIncrease damage by 1% for every 230 of Yumi's Attack (up to 4600/5060/5980/6440of Attack). Tailor-Made, Standard, and Basic Cocktails will increase damage by an additional 120%, 100%, and 50% respectively.\nIncrease effects on targeted ally by 1.2 times. If 2 or more Standard or better Cocktails are spent, increase targeted ally's critical damage by 20.0%/22.0%/22.4%/24.4%."
        },
        "skill_highlight": {
            "name": "Attribute Boost",
            "element": "패시브",
            "type":"패시브",
            "description": "Increases the corresponding attribute values of all deployed allies by 20% of the Phantom Thieves’ respective attributes."
        },
        "passive1": {
            "name": "Cocktail Party",
            "element": "패시브",
            "description": "Increase party's attribute damage by 4% based on main attributes of party members."
        },
        "passive2": {
            "name": "Taking Orders",
            "element": "패시브",
            "description": "At the start of the battle, gain Mixers based on the most common main attibute of party members participating in the battle."
        }
    },
    "치즈코": {
        "name": "Chizuko Nagao",
        "skill1": {
            "name": "Diving Ray",
            "element": "핵열",
            "type":"단일피해",
            "sp": 20,
            "cool": 0,
            "description": "Deal Nuclear damage to 1 foe equal to 170.8%/188.3%/177.8%/195.3% of Attack.\nFor 2 turns, decrease the target's Defense by 22.5% of Chizuko's ailment accuracy (up to 37.3%/37.3%/38.8%/38.8%) and inflict a random elemental ailment that the target does not already have."
        },
        "skill2": {
            "name": "Blunt Edge",
            "element": "핵열광역",
            "type":"광역피해",
            "sp": 22,
            "cool": 0,
            "description": "Deal Nuclear damage to all foes equal to 91.5%/100.9%/95.2%/104.6% of Attack. Has a 40% chance to inflict a random elemental ailment that the foe does not already have."
        },
        "skill3": {
            "name": "Bullseye Bomber",
            "element": "핵열",
            "type":"단일피해",
            "sp": 24,
            "cool": 1,
            "description": "Deal Nuclear damage to 1 foe equal to 195.2%/215.2%/203.2%/223.2% of Attack.\nIncrease the target's damage taken by 11.3% of Chizuko's ailment accuracy (up to 18.7%/20.7%/19.5%/21.4%) for 2 turns, based on the number of unique elemental ailments they have."
        },
        "skill_highlight": {
            "element": "핵열",
            "type":"단일피해",
            "description": "Deal Nuclear damage to 1 foe equal to 324.5%/357.8%/337.8%/371.1% of Attack. Has a 75% chance to inflict 2 random elemental ailments that the foe does not already have."
        },
        "passive1": {
            "name": "Eagle Eye",
            "element": "패시브",
            "description": "Increase Nuclear damage taken by foes with Radiation by 15.0%. Lasts for 2 turns."
        },
        "passive2": {
            "name": "Perfect Timing",
            "element": "패시브",
            "description": "During battle, Increase Attack by 45.0% of ailment accuracy."
        }
    },
    "카스미": {
        "name": "Kasumi Yoshizawa",
        "skill1": {
            "name": "Light in the Darkness",
            "element": "축복",
            "type":"단일피해",
            "sp": 23,
            "cool": 0,
            "description": "When actively used, deals 186.9%/206.1%/198.4%/217.5% Bless damage to 1 enemy, and Kasumi Yoshizawa gains 『Dance Move』 『Brave Step』 (stacks up to 3 times). When the Dance Partner uses this skill, it deals 121.6%/134.1%/129.1%/141.5% Bless damage to 1 enemy, and Kasumi Yoshizawa gains 『Dance Move』 『Brave Step』 (stacks up to 3 times)."
        },
        "skill2": {
            "name": "Dancing Together",
            "element": "버프",
            "type":"버프",
            "sp": 22,
            "cool": 0,
            "description": "Selects 1 ally as the 『Dance Partner』 for 1 turn. Increases ATK of both Kasumi Yoshizawa and the 『Dance Partner』 by 32.4%/35.7%/34.4%/37.7% for 3 turns. Kasumi Yoshizawa gains 『Dance Move』 『Swift Step』 (1 stack max). When the 『Dance Partner』 uses a Persona skill, Kasumi Yoshizawa immediately casts 『Light in the Darkness』 on a random enemy (or on the same main target if the partner’s skill targets an enemy). Only 1 『Dance Partner』 can exist at a time."
        },
        "skill3": {
            "name": "Blooming Heart",
            "element": "축복",
            "type":"단일피해",
            "sp": 27,
            "cool": 0,
            "description": "Deals 214.7%/236.7%/227.9%/249.9% Bless damage to 1 enemy. If Kasumi Yoshizawa is in the 『Masquerade』 state, this skill’s damage increases by 30% and her Crit Mult increases by 29.3%/29.3%/31.1%/31.1%."
        },
        "skill_highlight": {
            "element": "축복",
            "type":"단일피해",
            "unlock":"자신이 『가면무도회』 상태.",
            "description": "Condition: Kasumi Yoshizawa is in the 『Masquerade』 state.\nDeals 243.8%/268.8%/258.8%/283.8% Bless damage to 1 enemy. If she has 『Dance Move』, she gains the following effects:\n『Brave Step』: Each stack increases HIGHLIGHT skill damage by 15%.\n『Swift Step』: HIGHLIGHT Critical Rate increases by 10%, and Crit Mult increases by 20%."
        },
        "passive1": {
            "name": "Faith",
            "element": "패시브",
            "description": "Bless damage increases by 10.0% for each 『Dance Move』 stack Kasumi Yoshizawa has, up to 30.0%."
        },
        "passive2": {
            "name": "Determination",
            "element": "패시브",
            "description": "When an ally triggers a HIGHLIGHT effect, Kasumi Yoshizawa’s ATK increases by 45.0% for 2 turns."
        }
    },
    "키라": {
        "name": "Kira Kitazato",
        "skill1": {
            "name": "Severing Technique / Sinful Game",
            "element": "물리",
            "type":"단일피해",
            "sp": 21,
            "cool": 0,
            "description": "『Hunter』 State: Deals 47.3%/52.2%/50.2%/55.1% Physical damage to 1 enemy 4 times and adds 1 stack of 『Bleed』.\n『Executioner』 State: Deals 201.4%/222.1%/213.7%/234.4% Physical damage to 1 enemy, and after the skill ends, removes 2 stacks of 『Bleed』 from the enemy (can trigger 『Incision』 effect)."
        },
        "skill2": {
            "name": "Fatal Pleasure / Curtain Call",
            "element": "물리",
            "type":"단일피해",
            "sp": 21,
            "cool": 0,
            "description": "『Hunter』 State: Deals 84.2%/92.8%/89.4%/98.0% Physical damage to 1 enemy 2 times, instantly settles 『Bleed』 damage once, and resets the duration of 『Bleed』.\n『Executioner』 State: Deals 201.3%/222.0%/213.7%/234.4% Physical damage to 1 enemy. For each stack of 『Bleed』 on the target, this skill's damage and 『Incision』 damage increase by 2%. After the skill ends, removes all 『Bleed』 stacks from the enemy (can trigger 『Incision』 effect)."
        },
        "skill3": {
            "name": "Veil of Night",
            "element": "버프",
            "type":"전환",
            "sp": 15,
            "cool": 0,
            "description": "Unlocks when any enemy’s 『Bleed』 stacks ≥ 7.\nSwitches to 『Executioner』 State, changing skill mode and gaining the following effect: When using skills, for every 3 stacks of 『Bleed』 on the target, Kira Kitazato applies 『Incision』 once, dealing 66.7%/73.5%/70.8%/77.6% Physical damage. After using this skill, other skills can still be used this turn, and it automatically switches back to 『Hunter』 State at the end of the turn."
        },
        "skill_highlight": {
            "element": "물리",
            "type":"단일피해",
            "description": "Switches to 『Hunter』 State and immediately adds 5 stacks of 『Bleed』 to 1 enemy. Then switches to 『Executioner』 State and deals 328.5%/362.2%/348.7%/382.4% Physical damage to that enemy (can trigger 『Incision』 effect)."
        },
        "passive1": {
            "name": "Infection",
            "element": "패시브",
            "description": "For every 30% Ailment Accuracy Rate, the Physical damage of 『Bleed』 increases by 4% of Kira Kitazato’s ATK. Up to 90% Ailment Accuracy Rate is counted."
        },
        "passive2": {
            "name": "Corruption",
            "element": "패시브",
            "description": "While in 『Hunter』 State, Ailment Accuracy Rate increases by 36%.\nWhile in 『Executioner』 State, Penetration increases by 21%."
        }
    },
    "토모코·여름": {
        "name": "Noge Tomoko·Summer",
        "skill1": {
            "name": "A Glass of Summer Drink",
            "element": "염동광역",
            "type":"광역피해",
            "sp": 23,
            "cool": 0,
            "description": "Deals 77.6%/85.5%/82.4%/90.3% Psi damage to random enemies 4 times, prioritizing targets that have not yet been hit. Each hit adds 1 stack of 『Flame』. Subsequent hits on the same target deal only 30% damage.\nPassive: The skill damage multiplier/healing amount of 『Brilliant Flame』 increases by 51.7%/51.7%/59.9%/59.9%."
        },
        "skill2": {
            "name": "Please Enjoy",
            "element": "치료",
            "type":"치료",
            "sp": 27,
            "cool": 0,
            "description": "Heals 1 ally for 22.4%/22.4%/23.8%/23.8% of ATK +1438/1749/1767/2078 HP, increases their ATK by 14.6%/14.6%/15.5%/15.5%, Ailment Accuracy Rate by 58.6%/58.6%/62.2%/62.2%, and damage dealt by 30%. Whenever that ally deals skill damage, 1 stack of 『Flame』 is added and lasts 2 turns (up to 5 additional stacks of 『Flame』 during the duration)."
        },
        "skill3": {
            "name": "Midnight Thrill",
            "element": "염동광역",
            "type":"광역피해",
            "sp": 25,
            "cool": 0,
            "description": "Deals 61.0%/67.2%/64.8%/71.0% Psi damage to all enemies and increases their damage taken by 19.5%/19.5%/20.7%/20.7%. Also, each time enemies take skill damage, 1 stack of 『Flame』 is added and lasts 2 turns. At the start of Noge Tomoko·Summer's turn, the duration decreases by 1 turn. 『Flame』 can be added up to 5 times during this effect (this damage does not trigger additional 『Flame』 effects from existing skills)."
        },
        "skill_highlight": {
            "element": "염동",
            "type":"광역피해",
            "description": "Deals 82.4%/90.9%/87.4%/95.9% Psi damage to random enemies 3 times, prioritizing targets that have not yet been hit. Each hit adds 1 stack of 『Flame』. Subsequent hits on the same target deal only 30% damage."
        },
        "passive1": {
            "name": "Sparkling",
            "element": "패시브",
            "description": "During battle, her Psi damage and Max HP increase based on her Healing Effect. At 42.0% Healing Effect, Psi damage increases by 70.0% and Max HP increases by 2100."
        },
        "passive2": {
            "name": "Radiance",
            "element": "패시브",
            "description": "When 『Please Enjoy』 is activated, the Max HP of the skill’s main target increases by 1800 for 2 turns. Additionally, the ally with the lowest HP recovers HP equal to 60% of the skill’s healing amount."
        }
    },
    "하루": {
        "name": "Haru Okumura",
        "skill1": {
            "name": "Focused Aim",
            "element": "염동광역",
            "type":"광역피해",
            "sp": 20,
            "cool": 0,
            "description": "Deals 68.8%/75.9%/73.0%/80.1% Psi damage to all enemies twice. Has a 97.6%/97.6%/103.6%/103.6% base chance to apply 『Crosshair』 to the main target, and a 53.7%/53.7%/57.0%/57.0% base chance to apply it to other targets. Converts enemy 『Crosshair』 stacks to Haru’s 『Crosshair』 (stacks count). Lasts for 3 turns. Gains 『Thermal Energy Mod』, which increases skill damage by 29.3%/32.3%/31.1%/34.1% when Haru has 『Crosshair』 during gunfire, and removes all 『Crosshair』 after gunfire ends."
        },
        "skill2": {
            "name": "Suppressive Fire",
            "element": "총격",
            "type":"단일피해",
            "hp": 12,
            "cool": 0,
            "description": "Deals 151.6%/167.1%/160.9%/176.4% Gun damage to 1 enemy. When attacking an enemy with 『Crosshair』, increases Penetration by 19.5%/19.5%/20.7%/20.7%. Gains 『Armor Removal Mod』, causing gunfire to additionally deal 39.0%/43.0%/41.4%/45.4% Psi damage to the main target, and triggers the skill damage bonus effect of 『Thermal Energy Mod』."
        },
        "skill3": {
            "name": "Iron Burst",
            "element": "염동광역",
            "type":"광역피해",
            "sp": 24,
            "cool": 0,
            "description": "Deals 129.2%/142.5%/137.2%/150.4% Psi damage to all enemies. When attacking enemies with 『Crosshair』, Critical Rate increases by 19.5%/19.5%/20.7%/20.7%. Gains 『Spread Mod』, causing gunfire to additionally deal 29.3%/32.3%/31.1%/34.1% Psi damage to all enemies, and triggers the skill damage bonus effect of 『Thermal Energy Mod』."
        },
        "skill_highlight": {
            "element": "염동광역",
            "type":"광역피해",
            "description": "Deals 206.9%/228.1%/219.6%/240.8% Psi damage to all enemies. If modification is not at max and 『Overclock Mod』 is not present, gains 『Overclock Mod』, increasing Critical Rate during gunfire by 14.6%/14.6%/15.5%/15.5%. Otherwise, this attack’s skill damage increases by 14.6%/16.1%/15.5%/17.0%."
        },
        "passive1": {
            "name": "Bullet Casting",
            "element": "패시브",
            "description": "For every 1.45% Ailment Accuracy Rate, gains 1% ATK bonus (up to 165.0%). For every 50% Ailment Accuracy Rate, gains 1 stack of Crit Mult +20%, up to 3 stacks."
        },
        "passive2": {
            "name": "Tactics",
            "element": "패시브",
            "description": "Each modification used permanently adds 1 stack of 『Gun Barrel Heating』. When 『Gun Barrel Heating』 reaches certain stacks, Haru gains attribute bonuses:\n1 stack: +18.0% Ailment Accuracy Rate, +18.0% Effect Resistance\n2 stacks: +18.0% ATK, +18.0% DEF\n3 stacks: +18.0% Crit Mult"
        }
    },
    "후타바": {
        "name": "Sakura Futaba",
        "skill1": {
            "name": "Silent Infiltration",
            "element": "버프광역",
            "type":"디버프",
            "cool": 4,
            "description": "Reduces all enemies' DEF by 6% + (0.53% per 100 ATK of Sakura Futaba, up to 4600/5060/5980/6440 ATK) for 3 turns. During this period, if enemies take Weakness damage, this effect is doubled. When her Analysis Progress reaches 100%, grants all allies 『Hack Complete』 for 2 turns."
        },
        "skill2": {
            "name": "Data Decryption",
            "element": "버프",
            "type":"디버프",
            "cool": 4,
            "description": "Increases damage taken by 1 enemy by 6% + (0.38% per 100 ATK of Sakura Futaba, up to 4600/5060/5980/6440 ATK) for 3 turns. When an ally deals damage to the target using a Persona Skill/Additional Effect/HIGHLIGHT, Sakura Futaba gains 15% Analysis Progress. When her Analysis Progress reaches 100%, grants all allies 『Hack Complete』 for 2 turns."
        },
        "skill3": {
            "name": "In the Name of the Phoenix",
            "element": "버프",
            "type":"버프",
            "cool": 8,
            "unlock": "Ally must have 『Hack Complete』.",
            "description": "Activation Condition: An ally must have 『Hack Complete』.\nIncreases 1 ally Phantom Thief's ATK by 270/297/302/329 + (21.7 per 100 ATK of Sakura Futaba, up to 4600/5060/5980/6440 ATK) for 2 turns. Applies a 『Disruption Virus』 of the ally's affinity to all enemies for 1 turn.\n『Disruption Virus』: Alters the target's affinity. Null, Repel, and Drain become Resist, Resist becomes Normal, Normal becomes Weak. If Weak, the target takes 25% more Weakness damage."
        },
        "skill_highlight": {
            "name": "Stat Boost",
            "element": "패시브",
            "description": "Increases corresponding attributes of all deployed allies by 20% of each Phantom Thief's attribute."
        },
        "passive1": {
            "name": "Playfulness",
            "element": "패시브",
            "description": "Starts battle with 100% Analysis Progress."
        },
        "passive2": {
            "name": "Cleanup",
            "element": "패시브",
            "description": "While in 『Hack Complete』 state, all Phantom Thieves gain a shield equal to 30.0% of Sakura Futaba's ATK for 3 turns."
        }
    },

    "유스케": {
        "name": "Yusuke Kitagawa",
        "skill1": {
            "name": "Frozen Presence",
            "element": "빙결",
            "type": "광역피해",
            "sp": 20,
            "cool": 0,
            "description": "Deal Ice damage to all foes equal to 72.1%/79.5%/76.6%/84.0% of Yusuke's Defense. Inflict Freeze on main target for 2 turns with a 100% base chance."
        },
        "skill2": {
            "name": "Bone-Chilling Cold",
            "element": "빙결",
            "type": "광역피해",
            "sp": 20,
            "cool": 0,
            "description": "Deal Ice damage to random foes equal to 92.9%/102.4%/98.6%/108.1% of Yusuke's Defense (5 hits). Prioritize new targets for each hit. If Yusuke has a shield, increase skill damage by 30%. For repeated hits on the same target, decrease damage by 60% each time, up to a minimum of 20% damage."
        },
        "skill3": {
            "name": "Keen Eye",
            "element": "물리",
            "type": "버프",
            "sp": 24,
            "cool": 1,
            "description": "Change the next activated Inspiration to Imagination.\nImagination: Counterattack chance becomes 100%, damage increases by 78.1%/86.1%/82.9%/90.9% of Defense, and changes to an AoE attack. If not activated by the start of Yusuke's next action, it will activate automatically.\nFor 2 turns, gain a shield equal to 19.5%/19.5%/20.7%/20.7% + 555/555/683/683 of Defense, temporarily change Yusuke's weakness to base attribute, and nullify all spiritual ailments. Also, inflict Taunt on all foes for 2 turns."
        },
        "skill_highlight": {
            "element": "빙결",
            "type": "광역피해",
            "description": "Deal Ice damage to all foes equal to 178.1%/196.4%/189.1%/207.3% of Yusuke's Defense. Increase Inspiration counterattack activation chance by 35% for 3 turns."
        },
        "passive1": {
            "name": "Painter's Focus",
            "element": "패시브",
            "description": "Each time a shield is gained, increase damage dealt to foes by 7.5% for 2 turns (stacks up to 6 times)."
        },
        "passive2": {
            "name": "Artist's Intuition",
            "element": "패시브",
            "description": "Each time a shield is gained with Yusuke's skills, increase Yusuke's pierce rate by 20.0% for 1 turn."
        }
    },
    
    "미나미": {
        "name": "Miyashita Minami",
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
            "description": `After Minami heals an ally, increase that ally's damage by 15.0% + (3.0% × target ally's Blessing stacks) for 1 turn (up to 30%).`
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
            "description": "Grant Player 2 to 1 ally for 2 turns, and increase YUI's Attack by 39.0%/43.0%/41.4%/45.4%.\nFor 2 turns, when an ally with Player 2 deals damage to a foe with a skill, perform a follow-up attack, dealing Electric damage equal to 132.9%/137.2%/141.1%/145.4% of Attack (max 2 times).\nIncrease chance to activate Jolly Cooperation by 10% for 2 turns."
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
            "description": "When an ally has Player 2, increase that ally and YUI's critical rate by 12.0% and Attack by 12.0%."
        }
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
            "description": "Deal Nuke damage to 1 foe equal to 170.8%/188.3%/177.8%/195.3% of Attack. For each stack of Power of Friendship the party has, increase damage by 10%."
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