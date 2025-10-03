const enCharacterSkillsData = {
    "원더": {
        "name": "Wonder"
    },
    "YUI·스텔라": {
        "name": "YUI·Chromatic",
        "skill1": {
            "name": "Cosmic Clash!",
            "element": "핵열",
            "type":"단일피해",
            "sp": 22,
            "cool": 0,
            "description": "Deal Nuke DMG equal to 100.7%/111.0%/106.9%/117.2% ATK to 1 foe, and gain 3 [Originium Force].\nAdditionally, enter [Chaotic Clash] for 2 turns.\n[Chaotic Clash]: When BUI - Chromatic’s turn ends, cast the Follow-Up Action [Veggie Knights, Attack!], rallying all [Veggie Knights] to deal Nuke DMG equal to 93.5%/103.1%/99.2%/108.8% ATK to a random foe, and activate the following effect based on BUI - Chromatic’s current color:\nUnder [<span style='color:rgb(184, 33, 214);'>Earthy Eggplants</span>], gain 1 [Originium Force];\nUnder [<span style='color:#C7BE5A;'>Primrose Potatoes</span>], gain [Spud Power], increasing All-Out Attacks DMG by 14.6%/16.1%/15.5%/17.0% for 3 turns.\nUnder [Magenta Mushrooms], inflict the foes hit with [Spore], increasing their DMG Taken by 19.5%/21.5%/20.7%/22.7% for 2 turns.\nUnder [Aquamarine Asparagus], recover HP equal to 976/1076/1036/1136 of the DMG Dealt to the ally with the lowest HP.\nIf BUI - Chromatic possesses [<span style='color:#C7BE5A;'>Potato Knight</span>]s when casting the skill, she will automatically switch to [<span style='color:#C7BE5A;'>Primrose Potatoes</span>] at the end of her turn."
        },
        "skill2": {
            "name": "Veggie Knights, Assemble!",
            "element": "버프",
            "type":"버프",
            "sp": 0,
            "cool": 1,
            "description": "Increase ATK by 19.5%/21.5%/20.7%/22.7% and CRIT Rate by 11.7%/12.9%/12.4%/13.6 for 2 turns, and summon 1 [Veggie Knight] based on the set sequence. This skill is not considered a Persona Skill, and BUI - Chromatic can still cast other skills in her turn after casting this skill.\nPassive: When BUI - Chromatic’s turn starts, automatically summon a [Veggie Knight] based on the set sequence.\nThere may be only 1 [Eggplant Knight], [Mushroom Knight], and [Asparagus Knight] on the field. BUI - Chromatic can summon multiple [Potato Knight]s, up to 4."
        },
        "skill3": {
            "name": "Veggie Knights, Full Out!",
            "element": "핵열",
            "type":"단일피해",
            "sp": 23,
            "cool": 0,
            "description": "Deal Nuke DMG equal to 104.3%/115.0%/110.7%/121.4% ATK to 1 foe. For every [Veggie Knight] present, additionally deal Nuke DMG equal to 29.3%/32.3%/31.1%/34.1% ATK once. When holding 2 or more [<span style='color:#C7BE5A;'>Potato Knight</span>]s, BUI - Chromatic will consume the extra [<span style='color:#C7BE5A;'>Potato Knight</span>]. Each [<span style='color:#C7BE5A;'>Potato Knight</span>] consumed will additionally deal Nuke DMG equal to 24.4%/26.9%/25.9%/28.4%% ATK. This Skill DMG is considered All-Out Attacks DMG. When casting this skill manually, gain 2 [Originium Force].\nPassive: When [Originium Force] reaches 7, consume all [Originium Force] to cast [Veggie Knights, Full Out!] to foes. This attack’s DMG is evenly spread out against all foes.\nIf BUI - Chromatic possesses [<span style='color:rgb(184, 33, 214);'>Eggplant Knight</span>] when casting the skill, she will automatically switch to [<span style='color:rgb(184, 33, 214);'>Earthy Eggplants</span>] at the end of her turn."
        },
        "skill_highlight": {
            "element": "핵열",
            "type":"단일피해",
            "description": "Increase Deal Nuke DMG equal to 439.2%/484.2%/466.2%/511.2% ATK to 1 foe and cast [Veggie Knights, Attack!] to that foe 1 time.\n[Veggie Knights, Attack!]: Follow-Up Action. Deal Nuke DMG equal to 93.5%/103.1%/99.2%/108.8% ATK to 1 foe."
        },
        "passive1": {
            "name": "Companion Star",
            "element": "패시브",
            "description": "In Battle, increase BUI - Chromatic’s DMG Dealt by 8.1% for each [Veggie Knight] held, up to 4 [Veggie Knight]s."
        },
        "passive2": {
            "name": "Glittering",
            "element": "패시브",
            "description": "All-Out Attack DMG is increased by 15%.\nWhen participating in All-Out Attacks, increase the DMG additionally based on the amount of [Veggie Knights] held by BUI - Chromatic."
        }
    },
    "카타야마": {
        "name": "Kumi Katayama",
        "skill1": {
            "name": "Revolving Passionblade",
            "element": "전격광역",
            "type": "AoE DMG",
            "sp": 22,
            "cool": 0,
            "description": "Deal Elec DMG equal to 101.7%/112.1%/108.0%/118.4% ATK to all foes, and inflict them with [Cripple]: DEF is decreased by 9.8%/10.8%/10.4%/11.4% (For every 10 SPD, additionally decrease DEF by 2.22%, up to 39.0%/43.0%/41.4%/45.4%), and DMG Taken is increased by 7.8%/8.6%/8.3%/9.1% (For every 10 SPD, additionally decrease DMG Taken by 1.78%, up to 31.2%/34.4%/33.2%/36.4%) for 2 turns.\nWhen possessing [Transcending Limit], increase the Skill DMG by 30%.\nUnlocks [Killing Blow: Flarefeet]."
      },
        "skill2": {
            "name": "Lightning Arbitrement",
            "element": "전격광역",
            "type": "AoE DMG",
            "sp": 20,
            "cool": 0,
            "description": "Deal Elec DMG equal to 135.5%/149.3%/143.8%/157.7%  ATK to all foes, and decrease 1 Down Gauge regardless of affinity if the skill had done DMG. \nInflict foes hit with [Cripple]: DEF is decreased by 9.8%/10.8%/10.4%/11.4% (For every 10 SPD, additionally decrease DEF by 2.22%, up to 39.0%/43.0%/41.4%/45.4%), and DMG Taken is increased by 7.8%/8.6%/8.3%/9.1% (For every 10 SPD, additionally decrease DMG Taken by 1.78%, up to 31.2%/34.4%/33.2%/36.4%) for 2 turns.\nWhen possessing [Transcending Limit], decrease Down Gauge by 3, and inflict the foes hit with [Rupture]: Downed DMG Taken is increased by 0.56% for every 10 SPD, up to 9.8%/10.8%/10.4%/11.4%, and DMG Taken is increased by 5.9% (For every 10 SPD, additionally increase DMG Taken by 1.33%, up to 23.4%/25.8%/24.9%/27.3%) for 1 turn."
        },
        "skill3": {
            "name": "Killing Blow: Flarefeet",
            "element": "전격광역",
            "type": "AoE DMG",
            "sp": 25,
            "cool": 0,
            "description": "Deal Elec DMG equal to 141.9%/156.5%/150.6%/165.2% ATK to all foes, and decrease Down Gauge by 5 regardless of affinity, and inflict foes hit with [Rupture]: Downed DMG Taken is increased by 0.56% for every 10 SPD, up to 9.8%/10.8%/10.4%/11.4%, and DMG Taken is increased by 5.9% (For every 10 SPD, additionally increase DMG Taken by 1.33%, up to 23.4%/25.8%/24.9%/27.3%) for 1 turn.\nIf the skill Downs any foe, gain [Transcending Limit] for 2 turns.\n[Transcending Limit]: Boost the effect of the next [Revolving Passionblade] and [Lightning Arbitrement]."
        },
        "skill_highlight": {
            "name": "HIGHLIGHT",
            "element": "전격광역",
            "type": "AoE DMG",
            "sp": 0,
            "cool": 0,
            "description": "Deal Elec DMG equal to 317.6%/350.1%/337.1%/369.7%  ATK to all foes, with a 50% base chance of inflicting them with Dizzy for 1 turn. \nDecrease the foes' DEF permanently by 29.3%/32.3%/31.1%/34.1% the next time you Down them after casting HIGHLIGHT. This effect cannot stack."
        },
        "passive1": {
            "name": "Reprimand",
            "element": "패시브",
            "description": "Increase ATK by 30% for all allies when they are attacking Downed foes."
        },
        "passive2": {
            "name": "Ardor",
            "element": "패시브",
            "description": "Increase ATK by 24 for every SPD exceeding 100 in battle, up to 1920."
        }
    },

    "미유·여름": {
        "name": "Miyu Sahara Summer",
        "skill1": {
            "name": "Jellyfish Reverie",
            "element": "빙결광역",
            "type": "AoE DMG",
            "sp": 0,
            "cool": 0,
            "description": "Deal Ice DMG equal to 100.7%/111.0%/106.9%/117.2% ATK to all foes, with a 100% base chance of inflicting Freeze to them for 2 turns. Recover 40 SP (This effect is affected by SP Recovery), and SP obtained through this way is able to exceed the maximum SP limit (up to SP equal to the SP cap)."
        },
        "skill2": {
            "name": "Cerulean Concerto",
            "element": "빙결광역",
            "type": "AoE DMG",
            "sp": 0,
            "cool": 0,
            "description": "Deal Ice DMG equal to 178.7%/197.0%/189.7%/208.0% ATK to all foes. Inside [Ocean's Domain], increases Skill DMG by 10% for every stack of [Thousandfold Waves]. After casting the skill, exit [Ocean's Domain] and resets [Thousandfold Waves] count to 0. This skill is considered as a Follow Up Action."
        },
        "skill3": {
            "name": "Leaping Onto Sunlit Waves",
            "element": "버프",
            "type": "Enhance",
            "sp": 60,
            "cool": 0,
            "description": "Puppet rides her surfboard, cleanses all Mental Ailments on herself and opens [Ocean's Domain]: Grant Null Down and Null Mental/Control Ailment. In this state, she cannot use Sword, Gun, or items. When gaining any effect, extend that effect's duration by 1 turn. After any ally's turn ends, consume SP to cast [Surging Tides, Tilting Clouds].\n[Surging Tides, Tilting Clouds]: Consume 30 SP, and deal Ice DMG equal to 50.2%/55.3%/53.3%/58.4% ATK to all foes and gain 1 stack of [Thousandfold Waves]. Each stack of [Thousandfold Waves] increases [Surging Tides, Tilting Clouds]'s Skill DMG by 5% and SP consumed by 30, up to 4 stacks. [Surging Tides, Tilting Clouds] is seen as a Follow-Up Action, and cannot deplete Down Gauge.\nCasting the skill again will cause Puppet to exit [Ocean's Domain] and reset [Thousandfold Waves] to 0. Other skills can still be cast, but [Ocean's Domain] cannot be opened again during the turn."
        },
        "skill_highlight": {
            "name": "",
            "element": "빙결광역",
            "type": "AoE DMG",
            "sp": 0,
            "cool": 0,
            "description": "Deal Ice DMG equal to 219.6%/242.1%/233.1%/255.6% ATK to all foes, and additionally deal Ice DMG equal to 146.4%/161.4%/155.4%/170.4% ATK to all foes if Puppet is in [Ocean's Domain]."
        },
        "passive1": {
            "name": "Finesse",
            "element": "패시브",
            "description": "In battle, increase ATK based on SP Recovery, up to 98% ATK at 280% SP Recovery."
        },
        "passive2": {
            "name": "Wit",
            "element": "패시브",
            "description": "Increase DMG Dealt by 30% when Puppet is in [Ocean's Domain]."
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
            "description": "Deal Bless DMG to all foes equal to 64.4%/71.0%/68.4%/75.0% Max HP, and inflict [Candied] for 3 turns.\n[Candied]: When any ally attacks a Candied foe, increase ATK by 9.8%/10.8%/10.4%/11.4%.(For every 1200 Max HP Summer Marian has, additionally increase ATK by 4% more, up to 11712/12912/12432/13632)."
        },
        "skill2": {
            "name": "Midsummer Flowerfield",
            "element": "버프",
            "type": "버프",
            "sp": 22,
            "cool": 0,
            "description": "Increase all allies' DMG Dealt by 7.8%/8.6%/8.3%/9.1% (For every 1200 Max HP Summer Marian has, additionally increase DMG Dealt by 3.2%, up to 11712/12912/12432/13632) for 3 turns. Additionally, give 1 stack of Blessing to all allies, and cleanse 1 Negative Status."
        },
        "skill3": {
            "name": "Bouquet Beyond the Horizon",
            "element": "버프",
            "type": "버프",
            "sp": 25,
            "cool": 2,
            "description": "Increase an ally's (Except Summer Marian) CRIT Rate by 15.6%/17.2%/16.6%/18.2%, and increase their CRIT DMG by 33.33% of Summer Marian's CRIT DMG that exceeds 100%, up to 213.4%/229.9%/229.9%/246.4% for 3 turns.\nDuring the duration, every time Summer Marian uses an item on that ally, additionally increase their CRIT DMG by 16.66% of Summer Marian's CRIT DMG that exceeds 100%, up to 213.4%/229.9%/229.9%/246.4% for 1 turn."
        },
        "skill_highlight": {
            "element": "버프",
            "type": "버프",
            "sp": 0,
            "cool": 0,
            "description": "Increase an ally's (Except Summer Marian) DMG Dealt by 24.4%/26.9%/25.9%/28.4% and CRIT DMG by 16.66% of Summer Marian's CRIT DMG that exceeds 100%, up to 213.4%/229.9%/229.9%/246.4% for 2 turns. Additionally, the next time she uses an item, increase that item effect by 9.8%/10.8%/10.4%/11.4%."
        },
        "passive1": {
            "name": "Prayers",
            "element": "패시브",
            "description": "Every time Summer Marian uses a Persona skill on allies, give 1 stack of Blessing to them. When Summer Marian is on the field, increase DMG Dealt of allies by 6% for each stack of Blessing, up to 36%."
        },
        "passive2": {
            "name": "Care",
            "element": "패시브",
            "description": "When Summer Marian is on the field, increase all allies' ATK by 12%. For each buffing item effect on allies, additionally increase their ATK by 15%."
        }
    },
	"이치고": {
        "name": "Ichigo Shikano",
        "skill1": {
            "name": "Neckbreaking Crimson",
            "element": "주원",
            "type": "단일피해",
            "sp": 20,
            "cool": 1,
            "description": "Deal Curse DMG to 1 foe equal to 129.0%/142.2%/137.0%/150.2% of ATK, and inflict 2 [Hatred] stacks on the target. When the target is above 70% current HP, heavily increase skill damage by 200%. If this skill kills the target, activate this skill again (is able to chain activation).\n[Hatred]: Take Curse DMG equal to Ichigo's 6%/12%/18% ATK (at level 1/50/70) for 4 turns, up to 10 stacks. When the foe with [Hatred] dies, transfer its [Hatred] to the highest HP foe."
        },
        "skill2": {
            "name": "Bloodrose Kiss",
            "element": "주원",
            "type": "단일피해",
            "sp": 20,
            "cool": 0,
            "description": "Deal Curse DMG to 1 foe equal to 92.9%/102.4%/98.6%/108.1% of ATK, and inflict 4 [Hatred] stacks on the target."
        },
        "skill3": {
            "name": "Shhh…Execution Time Is Now!",
            "element": "주원",
            "type": "단일피해",
            "sp": 22,
            "cool": 0,
            "description": "Deal Curse DMG to 1 foe equal to 221.6%/244.3%/235.2%/257.9% of ATK + [Hatred] stacks x 11.7%/12.9%/12.4%/13.6% of ATK, when [Hatred] stacks reach 10, additionally deal Curse DMG to 1 foe equal to 103.3%/113.8%/109.6%/120.2% of ATK; Then, refresh the duration of [Hatred]."
        },
        "skill_highlight": {
            "element": "주원",
            "type": "단일피해",
            "cool": 0,
            "description": "Deal Curse DMG to 1 foe equal to 457.1%/503.9%/485.2%/532.0% of ATK, and make [Hatred] able to deal CRITICAL for 3 turns. Immediately triggers all instances of DoT on the target, dealing DoT DMG and additionally deal [Hatred] damage twice."
        },
        "passive1": {
            "name": "Covet",
            "element": "패시브",
            "description": "Increase ATK by 15% for each [Covet] stack."
        },
        "passive2": {
            "name": "Attachment",
            "element": "패시브",
            "description": "When Ichigo is on the field, increase all allies’ DoT DMG Effect by 15%."
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
            "description": "Gain 1 stack of [Fighting Spirit], and deal 122.8%/135.4%/130.3%/142.9% ATK as Elec DMG to all enemies. Increase CRIT DMG by 11.7%/12.9%/12.4%/13.6% for 3 turns."
        },
        "skill2": {
            "name": "Electric Blast",
            "element": "전격광역",
            "type": "광역피해",
            "sp": 20,
            "cool": 0,
            "description": "Gain 1 stack of [Fighting Spirit], and deal 92.1%/101.6%/97.8%/107.2% ATK as Elec DMG to all enemies. Additionally, gain 2 stacks of [Persistence]."
        },
        "skill3": {
            "name": "Thunderstrike Flash",
            "element": "전격광역",
            "type": "광역피해",
            "sp": 24,
            "cool": 2,
            "description": "Deal 136.4%/150.4%/144.8%/158.8% ATK as Elec DMG to all enemies. If Akihiko has 2 or more stack of [Fighting Spirit], consume all [Fighting Spirit] and increase the skill multiplier by 40.9%/45.1%/43.1%/47.6% for every [Fighting Spirit] consumed."
        },
        "skill_highlight": {
            "name": "Theurgy - Lightning Spike",
            "element": "전격광역",
            "type": "광역피해",
            "sp": 0,
            "cool": 0,
            "description": "Theurgy Use Condition: 140 Theurgy Energy.\nDeals 261.7%/287.9%/293.1%/319.3% ATK as Elec DMG to all enemies. This skill is guaranteed to CRIT, with a fixed CRIT DMG of 200%."
        },
        "skill_support": {
            "name": "Assist Skill",
            "element": "패시브",
            "type": "버프",
            "description": "Increases 1 ally's CRIT DMG by 20% for 1 turn."
        },
        "passive1": {
            "name": "Hot-Blooded",
            "element": "패시브",
            "description": "Increase DMG Dealt by 30% to Downed enemies."
        },
        "passive2": {
            "name": "Persistence",
            "element": "패시브",
            "description": "Increase ATK by 13.5% after landing a CRIT for 3 turns, up to 3 stacks."
        }
    },
	"유카리": {
        "name": "Yukari Takeba",
        "skill1": {
            "name": "Gale Blast",
            "element": "질풍",
            "type": "단일 피해",
            "sp": 23,
            "cool": 0,
            "description": "Deals 200.1%/220.6%/212.4%/232.9% ATK as Wind DMG to 1 foe, with 100% chance to inflict Winded for 2 turns. Additionally, inflict the enemy with [Wind Erosion] for 2 turns. There can only be 1 Enemy with [Wind Erosion] on the field. When a foe with [Wind Erosion] is defeated, transfer their [Wind Erosion] to the foe with the highest HP.\nWhen allies attack, if any of the foes attacked are inflicted with [Wind Erosion], increase the ATK of that skill by 8.8%/9.7%/9.3%/10.2% (For Each 100 ATK, additionally increase ATK by 0.72%, up to 29.3%/32.3%/31.1%/34.1%)."
        },
        "skill2": {
            "name": "Windchaser’s Breath",
            "element": "버프광역",
            "type": "",
            "sp": 25,
            "cool": 0,
            "description": "Decrease all allies' DMG Taken by 29.3%/32.3%/31.1%/34.1% for 3 turns. Increase the ATK of the main target by 7.8%/8.6%/8.3%/9.1% (For every 100 ATK, additionally increase DMG Dealt by 0.78%, up to a maximum of 31.2%), and DMG Dealt for the main target by 0.24% for each 100 ATK, up to 9.8%/10.8%/10.4%/11.4% for 2 turns."
        },
        "skill3": {
            "name": "Arrow of Rebirth",
            "element": "치료광역",
            "type": "",
            "sp": 27,
            "cool": 0,
            "description": "Restore all allies' HP by 39.1%/43.1%/41.5%/45.6% ATK + 2507/3158/3081/3773 and depletes all [Wind's Whisper].\nFor every [Wind's Whisper] depleted, regenerates 17.5 Theurgy Energy for the main target (Overcapping Theurgy Energy will be stored temporarily, and will be returned after the target uses their [Theurgy]. The maximum amount of storage is based on the maximum Theurgy Energy of the target, and the storage lasts for 2 turns.).\nAdditionally, increase the ATK of the main target after they use Theurgy by 29.3%/32.3%/31.1%/34.1% for 2 turns and up to 2 stacks. If the main target is not a S.E.E.S. member, the effect is changed so that their next [HIGHLIGHT]'s Total DMG is increased by 9.8%/10.8%/10.4%/11.4% for each stack of [Wind's Whisper] consumed."
        },
        "skill_highlight": {
            "name": "Theurgy - Cyclone Arrow",
            "element": "질풍",
            "type": "",
            "description": "Theurgy Use Condition: 70 Theurgy Energy.\nDeals 416.0%/457.6%/465.9%/507.5% ATK as Wind DMG to 1 enemy, and increase the DMG Dealt of all allies by 0.48% for each 100 ATK, up to 20.0%/22.0%/22.4%/24.4%. There is a 100% chance to inflict the enemy with Winded, and the enemy will be inflicted with [Wind Erosion] for 2 turns."
        },
        "skill_support": {
            "name": "Assist Skill",
            "element": "패시브",
            "type": "",
            "description": "Cleanse 1 Negative Status from an ally."
        },
        "passive1": {
            "name": "Tacit Teamwork",
            "element": "패시브",
            "description": "When Yukari is on the field, increase all allies' HIGHLIGHT/Theurgy DMG Dealt by 45%."
        },
        "passive2": {
            "name": "Cheerfulness",
            "element": "패시브",
            "description": "In Battle, increase Max HP by 100 for each 60 of ATK, up to a maximum of 2700 ATK."
        }
    },
	"유키 마코토": {
        "name": "Makoto Yuki",
        "skill1": {
            "name": "Melodic Blaze",
            "element": "화염",
            "type": "단일피해",
            "sp": 20,
            "cool": 0,
            "description": "Deals 59.8%/66.0%/63.2%/69.6% ATK as Fire DMG to 1 enemy 3 times, gains 2 stacks of [Moon Phase] for 2 turns, up to 4 stacks.\nWhen Makoto Yuki consumes [Moon Phase] to deal DMG with [Scarlet-Devouring Blaze], increases the skill multiplier by 32.5%/35.8%/34.5%/37.8% for 2 turns."
        },
        "skill2": {
            "name": "Moonlit Hymn",
            "element": "버프광역",
            "type": "버프",
            "sp": 20,
            "cool": 0,
            "description": "Increases all allies CRIT DMG by 23.4%/25.8%/24.9%/27.3% and own’s ATK by 19.5%/21.5%/20.7%/22.7% for 2 turns. Gains 2 stacks of [Moon Phase] for 2 turns, up to 4 stacks."
        },
        "skill3": {
            "name": "Scarlet-Devouring Blaze",
            "element": "화염",
            "type": "단일피해",
            "sp": 24,
            "cool": 0,
            "description": "Use Condition: When Makoto has at least 2 stacks of [Moon Phase.\nConsumes all [Moon Phase], for each stack of [Moon Phase] consumed, deals 1 hit of 76.2%/84.0%/80.9%/88.7% ATK as Fire DMG to 1 enemy.\nAfterwards, consumes all [Special Moon Phase], for each stack of [Special Moon Phase] consumed, additionally deals 1 hit of 134.6%/148.4%/142.9%/156.7% ATK as Fire DMG to 1 enemy.\nIf you have 4 stacks of [Moon Phase], increases own’s PEN by 11.7%/12.9%/12.4%/13.6% and DMG Dealt by 24.4%/26.9%/25.9%/28.4% when using this skill."
        },
        "skill_highlight": {
            "name": "Theurgy - Ardhanari",
            "element": "화염",
            "type": "",
            "description": "Theurgy Use Condition: 100 Theurgy Energy\nDeals 151.1%/162.6%/160.5%/171.6% ATK Fire DMG to 1 enemy 4 times. Gains 1 stack of [Special Moon Phase] for 2 turns, up to 4 stacks."
        },
        "skill_highlight2": {
            "name": "Theurgy - Cadenza",
            "element": "버프",
            "type": "버프",
            "description": "Theurgy Use Condition: 100 Theurgy Energy\nIncreases all allies ATK by 25.0%/26.9%/26.5%/28.4% and DMG Dealt by 20.0%/21.5%/21.2%/22.7% for 2 turns. Gains 1 stack of [Special Moon Phase] for 2 turns, up to 4 stacks."
        },
        "skill_support": {
            "name": "Assist Skill",
            "element": "패시브",
            "type": "버프",
            "description": "Increase an ally's ATK by 20% for 1 turn."
        },
        "passive1": {
            "name": "Leader",
            "element": "패시브",
            "description": "After using [Theurgy], increase all allies' ATK by 40%, additionally increases SEES allies' ATK by 20% for 2 turns."
        },
        "passive2": {
            "name": "Trust",
            "element": "패시브",
            "description": "When receiving buffs/healing/shield from allies, increases own CRIT DMG by 7.2% for 2 turns, up to 21.6%."
        }
    },
	"이케나미": {
        "name": "Shoki Ikenami",
        "skill1": {
            "name": "Spotlight Soliloquy",
            "element": "축복",
            "type": "단일피해",
            "sp": 20,
            "cool": 0,
            "description": "Deals 151.8%/161.1%/158.0%/167.3% ATK as Bless DMG to 1 enemy, gives all allies 2 stacks of Blessing, and increases all allies' DMG Dealt (For every 100 ATK, increases DMG Dealt by 0.8%, up to 35.1%/37.2%/36.6%/38.7%) for 2 turns."
        },
        "skill2": {
            "name": "Brechtian Divide",
            "element": "버프",
            "type": "버프",
            "sp": 24,
            "cool": 2,
            "description": "Increases 1 other ally's DEF (For every 100 ATK, increases DEF by 0.83%, up to 36.6%/38.9%/38.1%/40.4%), and gives them immunity to certain Mental Ailments (Dizzy, Sleep, Confuse, Forget) for 2 turns."
        },
        "skill3": {
            "name": "Ensemble of Stars",
            "element": "버프광역",
            "type": "버프",
            "sp": 24,
            "cool": 0,
            "description": "Increases all allies' ATK (Based on 15% own ATK, up to 569/617/592/650) for 2 turns.\nBased on your current [Improv], gives the main target additional effects:\n- [Improv·Osmosis]: Increases the main target's DoT DMG Effect by 14.0%/15.5%/14.5%/16.0% and EHR by 30% for 2 turns.\n- [Improv·Subversion]: Increases the main target's TECHNICAL Mastery by 655/722/682/749 and ATK when dealing TECHNICAL by 20% for 2 turns.\n- [Improv·Empathy]: Increases the main target's CRIT DMG by 24.4%/26.9%/25.4%/27.9% for 2 turns.\n- [Improv·Resonance]: Increases the main target's PEN by 12.0%/13.2%/12.5%/13.7% for 2 turns."
        },
        "skill_highlight": {
            "element": "버프광역",
            "type": "버프",
            "description": "Increases all allies' ATK (Based on 6.5% of own ATK, up to 284/302/296/314) and Effect RES by 82.0%/87.1%/85.3%/90.4% for 2 turns, then gives all allies 1 stack of Blessing."
        },
        "passive1": {
            "name": "Nature",
            "element": "패시브",
            "description": "For each stack of Blessing on an ally, increase their DMG Dealt by 5%, up to 25.0%."
        },
        "passive2": {
            "name": "Reverse",
            "element": "패시브",
            "description": "For every 1% EHR, increase ATK by 0.72%, up to 72.0%."
        }
    },
	"마나카": {
        "name": "Manaka Nagao",
        "skill1": {
            "name": "Choir of Doves",
            "element": "버프광역",
            "type": "버프",
            "cool": 4,
            "description": "Increases all allies' DMG Dealt by 7.0%/7.7%/7.8%/8.5% + (For every 164 ATK, additionally increases DMG Dealt by 1%, up to 28.0%/31.8%/31.4%/34.2%) for 2 turns. Ange gains 4 stacks of [Holy Song]."
        },
        "skill2": {
            "name": "Poems of Radiance",
            "element": "치료광역",
            "type": "치료",
            "cool": 8,
            "description": "Restores 10.0%/10.0%/11.2%/11.2% ATK + 681/816/989/1124 HP to all allies, and dispels 1 debuff from all allies. When Ange has [Holy Song], consumes 1 stack of [Holy Song] to decrease the skill cooldown by 1 action, up to 4 actions. When Ange manually use this skill, additionally increases healing by 50%.\nAfter Ange gains 12 stacks of [Holy Song], automatically trigger the healing from this skill once."
        },
        "skill3": {
            "name": "Wheel of Time",
            "element": "버프광역",
            "type": "버프",
            "cool": 4,
            "description": "Increases all allies' ATK based on 11% + 128/141/143/156 ATK. Consumes all [Holy Song], for every stack of [Holy Song] consumed, additionally increases all allies' PEN (Increases PEN by 0.1% for every 460 ATK, up to 4600/5060/5980/6440 ATK) and ATK (Increases ATK by 0.2% for every 460 ATK, up to 4600/5060/5980/6440 ATK) for 2 turns."
        },
        "skill_highlight": {
            "name": "Attribute Improvement",
            "element": "패시브",
            "description": "Increase all allies' stats by 20% of Ange's stats."
        },
        "passive1": {
            "name": "Grace",
            "element": "패시브",
            "description": "Increase the ATK for allies under [Myriad Song] by 37.5%."
        },
        "passive2": {
            "name": "Resilience",
            "element": "패시브",
            "description": "Increase all allies' PEN by 1.0% after gaining 1 stack of [Holy Song], up to 12 stacks."
        }
    },
	"마유미": {
        "name": "Mayumi Hashimoto",
        "skill1": {
            "name": "Vortex Suppression",
            "element": "물리광역",
            "type": "광역피해",
            "hp": 8,
            "cool": 0,
            "description": "Deals 134.2%/148.0%/142.5%/156.2% ATK as Phys DMG to all enemies, and increases all allies' DMG Bonus by 8.8%/9.7%/9.3%/10.2% (For every 10 SPD, additionally increases DMG Bonus by 2%, up to 35.1%/38.7%/37.3%/40.9%) for 2 turns;\nDuring Extra Turn: Increases skill DMG by 50%, will Always CRIT on the main target."
        },
        "skill2": {
            "name": "Overload Acceleration",
            "element": "버프광역",
            "type": "버프",
            "sp": 22,
            "cool": 0,
            "description": "Increases all allies' ATK by 8.8%/9.7%/9.3%/10.2% (For every 10 SPD, additionally increases ATK by 2%, up to 35.1%/38.7%/37.3%/40.9%), DEF by 9.8%/10.9%/10.4%/11.4% (For every 10 SPD, additionally increases DEF by 2.22%, up to 39.0%/43.0%/41.4%/45.4%) for 2 turns;\nDuring Extra Turn: Gives all allies 1 stack of 1964/2114/2054/2204 Shield for 2 turns."
        },
        "skill3": {
            "name": "Roaring Engine",
            "element": "버프광역",
            "type": "버프",
            "sp": 25,
            "cool": 0,
            "description": "Increases all allies PEN by 1.0%/1.1%/1.0%/1.1% (For every 10 SPD, additionally increases PEN by 0.22%, up to 3.9%/4.3%/4.1%/4.5%), ATK by 12.7% (For every 10 SPD, additionally increases ATK by 2.89%, up to 50.8%/56.0%/53.9%/59.1%) for 2 turns;\nDuring Extra Turn: Increases the main target PEN by 2.0%/2.2%/2.1%/2.3% (For every 10 SPD, additionally increases PEN by 0.44%, up to 7.8%/8.6%/8.3%/9.1%) for 1 turn."
        },
        "skill_highlight": {
            "element": "버프광역",
            "type": "버프",
            "description": "Increases all allies' ATK by 5.9%/6.5%/6.2%/6.8% (For every 10 SPD, additionally increases ATK by 1.33%, up to 23.4%/25.8%/24.9%/27.3%) and DMG Bonus (For every 10 SPD, additionally increases DMG Bonus by 1.33%, up to 23.4%/25.8%/24.9%/27.3%) for 2 turns.\nWhen the main target deals DMG to enemies, additionally decreases the main target's Down Gauge by 1."
        },
        "passive1": {
            "name": "Lead",
            "element": "패시브",
            "description": "When Turbo is present, increase all allies' DMG Dealt during Extra Turn by 30.0%."
        },
        "passive2": {
            "name": "Supercharge",
            "element": "패시브",
            "description": "When Turbo is present, increase all allies' DMG Dealt to Downed enemies by 24.0%. Turbo will deal an additional 48.0% ATK as Phys DMG to the main target when she Downs an enemy."
        }
    },
	"아케치": {
        "name": "Goro Akechi",
        "skill1": {
            "name": "Vow of Justice",
            "element": "축복광역",
            "type":"광역피해",
            "sp": 20,
            "cool": 0,
            "description": "Deals 93.2%/102.8%/98.9%/108.5% ATK as Bless DMG to all enemies, and restore 1561/1561/1657/1657 HP to all allies, then gives all allies 1 stack of Blessing. Crow gains [Truth], then gain [Clarity] for 2 turns. Under [Clarity], increase all allies' DMG Dealt by 19.5%/21.5%/20.7%/22.7%."
        },
        "skill2": {
            "name": "Unjust Hunting Ground",
            "element": "주원광역",
            "type":"광역피해",
            "sp": 20,
            "cool": 0,
            "description": "Deals 116.5%/128.5%/123.7%/135.6% ATK as Curse DMG to all enemies, Crow gains [Truth], then gain [Chaos] for 2 turns. Under [Chaos], decrease all enemies' DEF by 25.4%/28.0%/26.9%/29.5%, adds 1 more shot to [Arrow of Chaos] and increase its DMG Dealt by 19.5%/21.5%/20.7%/22.7%."
        },
        "skill3": {
            "name": "Golden Arrow Rain - Annihilate",
            "element": "만능광역",
            "type":"광역피해",
            "sp": 24,
            "cool": 0,
            "description": "Unlock condition: When Crow has [Truth].\nConsumes all [Arrow of Clarity], deals 19.5%/21.5%/20.7%/22.7% of the recorded damage from [Arrow of Clarity] as fixed Almighty DMG (can't CRIT) to all enemies. Then randomly shoots 4 [Arrow of Chaos], each dealing 77.4%/85.3%/82.2%/90.1% ATK as Almighty DMG, prioritizing enemies that have not been attacked yet. Crow will only deal 15% DMG to the same target."
        },
        "skill_highlight": {
            "element": "만능",
            "type":"광역피해",
            "description": "Deals 103.5%/114.1%/109.8%/120.4% ATK as Bless DMG and 103.5%/114.1%/109.8%/120.4% ATK as Curse DMG to all enemies, adds 2 more shots to [Arrow of Chaos] for 4 turns."
        },
        "passive1": {
            "name": "Law",
            "element": "패시브",
            "description": "When Crow is in the team, he can trigger Desire Sonata for any element. At the start of battle, increase DMG Dealt by 15.0% for every triggered Desire Sonata."
        },
        "passive2": {
            "name": "Desire",
            "element": "패시브",
            "description": "When dealing Almighty DMG, for every 1% DEF Down on the target, increase DMG Dealt by 0.5%. (Up to 120.0%)"
        }    
    },
	"미오": {
        "name": "Mio Natsukawa",
        "skill1": {
            "name": "Echoing Tides",
            "element": "빙결광역",
            "type":"디버프", 
            "sp": 20,
            "cool": 0,
            "description": "Gain 1 stack of [Extinguishing Power] and deals 97.6%/107.6%/103.6%/113.6% ATK as Ice DMG to all enemies, with a 50% base chance to inflict Freeze and decreases their DEF by 7.8%/8.6%/8.3%/9.1% (For every 5.47% EHR, additionally decreases DEF by 1%, up to 31.2%/34.4%/33.2%/36.4%) for 3 turns. When any Thieves attack foes with this effect, increase their TECHNICAL Mastery by 195/195/207/207. \nIf the target is inflicted with Burn, dispels their Burn then inflicts all enemies with [Fading Flame] ([Fading Flame] cannot trigger this effect). \n[Fading Flame]: Increases all Thieves's TECHNICAL Mastery by 976/1076/1036/1136 when attacking enemies with this effect. This effect is considered as Burn and lasts for 3 turns."
        },
        "skill2": {
            "name": "Binding Waves",
            "element": "빙결",      
            "type":"제어",
            "sp": 20,
            "cool": 0,
            "description": "Deals 195.2%/215.2%/207.2%/227.2% ATK as Ice DMG to 1 enemy. Deals Ice TECHNICAL, then increases the base chance when triggering [Ice Seal] to 43.9%/48.4%/46.6%/51.1%."
        },      
        "skill3": {
            "name": "Bursting Waterfall",
            "element": "빙결광역",
            "type":"디버프",
            "sp": 20,
            "cool": 0,
            "description": "Unlocks when Matoi has 2 stacks of [Extinguishing Power];\nConsumes 2 stacks of [Extinguishing Power], deals 109.8%/121.1%/116.5%/127.8% ATK as Ice DMG to all enemies and decreases their DEF by 7.3%/8.1%/7.7%/8.5% (For every 5.83% EHR, additionally decreases DEF by 1%, up to 29.3%/32.3%/31.1%/34.1%) for 2 turns. Deals Ice TECHNICAL, and when triggering [Ice Burn], upgrades to [Cold Shine].\n[Cold Shine]: Increase all enemies' DMG Taken by 9.8%/10.8%/10.4%/11.4% (For every 4.38% EHR, additionally increases DMG Taken by 1%, up to 39.0%/43.0%/41.4%/45.4%).\nWhen you have 4 stacks of [Extinguishing Power], upgrade this skill to [Bursting Waterfall·Tornado];\n[Bursting Waterfall·Tornado]: Consumes 4 stacks of [Extinguishing Power], deals 131.8%/145.3%/139.9%/153.4% ATK as Ice DMG to all enemies and decreases their DEF by 8.8%/9.7%/9.3%/10.2% (For every 4.86% EHR, additionally decreases DEF by 1%, up to 35.1%/38.7%/37.3%/40.9%) for 2 turns. Deals Ice TECHNICAL, and when triggering [Ice Burn], upgrades to [Cold Shine].\n[Cold Shine]: Increase all DMG Taken by 11.7%/12.9%/12.4%/13.6% (For every 3.65% EHR, additionally increases DMG Taken by 1%, up to 46.8%/51.6%/49.7%/54.5%)."
        },
        "skill_highlight": {
            "element": "빙결광역",
            "type":"디버프",
            "description": "Deals 39.0%/43.0%/41.4%/45.4% ATK as Ice DMG to all enemies and increases their DMG Taken (For every 5.83% EHR, increases DMG Taken by 1%, up to 29.3%/32.3%/31.1%/34.1%) for 2 turns. Deals Ice TECHNICAL, then increases the base chance when triggering [Ice Seal] to 28%, enemies with [Ice Seal] additionally increases DMG Taken (For every 17.5%, additionally increases DMG Taken by 1% up to 9.8%/10.8%/10.4%/11.4%). Then, deals 117.1%/129.1%/124.3%/136.3% ATK as Ice DMG to all enemies."
        },
        "passive1": {
            "name": "Shelter",
            "element": "패시브",
            "description": "When dealing TECHNICAL, give all Thieves 1 stack of 1050 Shield for 2 turns."
        },
        "passive2": {
            "name": "Pressure",
            "element": "패시브",
            "description": "When you are present, enemies with Freeze increase DMG Taken by 27.0%."
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
            "description": "Deals 73.2%/80.7%/77.7%/85.2% ATK as Fire DMG to all enemies, decreases the target's DEF based on 15.4% own EHR, up to 26.4%/29.2%/27.9%/30.7% for 2 turns, additionally decreases DEF by 26.4% when taking Fire DMG. There is a 50% base chance to inflict Burn. Howler gains [Warm Welcome]. (Cannot stack the DEF Down effect with [Intimidate Baddie].)"
        },
        "skill2": {
            "name": "Intimidate Baddie",
            "element": "화염",
            "type":"디버프",
            "sp": 22,
            "cool": 0,
            "description": "Deals 170.8%/188.3%/181.3%/198.8% ATK as Fire DMG to 1 enemy, decreases the target's DEF by 14.6%/14.6%/15.5%/15.5% + 31.4% of own EHR (up to 53.7%/59.3%/56.9%/62.5% DEF Down) for 2 turns. You gain [Furious Pursue]. (Cannot stack the DEF Down effect with [Fiery Handshake].)"
        },
        "skill3": {
            "name": "GOGO WOOF WOOF RU!",
            "element": "화염광역",
            "type":"디버프",
            "sp": 24,
            "cool": 0,
            "description": "Requirement: You have [Warm Welcome] or [Furious Pursue]. When you have [Warm Welcome] or [Furious Pursue], triggers their corresponding effect. Only one effect can be triggered.\n- [Warm Welcome]: Deals 109.8%/109.8%/116.6%/116.6% ATK as Fire DMG to all enemies, increases the target's DMG Taken based on 24% of own EHR, up to 41.0%/45.2%/43.5%/47.7%, increases their Fire DMG Taken by 20.5%/22.7%/21.7%/23.9% for 2 turns.\n- [Furious Pursue]: Deals 219.6%/219.6%/233.1%/233.1% ATK as Fire DMG to 1 enemy, increases the target's DMG Taken based on 34.3% of own EHR, up to 58.6%/64.7%/62.1%/68.2%, increases their Follow Up DMG Taken by 29.3%/31.6%/31.8%/34.1% for 2 turns."
        },
        "skill_highlight": {
            "element": "화염광역",
            "type":"디버프",
            "description": "Deals 214.7%/236.7%/227.9%/249.9% ATK as Fire DMG to all enemies, inflicts all enemies with 2 stacks of [Big Bad]: Consumes 1 stack when any enemy take Follow Up DMG or Fire DMG to increase that damage based on 22.9% own EHR, up to 39.0%/43.0%/41.4%/45.4% for 2 turns."
        },
        "passive1": {
            "name": "Loyalty",
            "element": "패시브",
            "description": "Increase ATK by 60% of your EHR."
        },
        "passive2": {
            "name": "Passion",
            "element": "패시브",
            "description": "After using skills to inflict debuffs, increase own ATK by 33.0%, allies gain the same amount of ATK when they deal Fire DMG or Follow Up DMG for 1 turn."
        }
    },
    "리코": {
        "name": "Riko Tanemura",
        "skill1": {
            "name": "Scattered Plum Blossoms",
            "element": "버프광역",
            "type":"디버프",
            "cool": 4,
            "description": "Decrease all foes' Defense by 10.0%/10.0%/10.8%/10.8% for 2 turns.\nWhen Riko's Speed is at 100 or more, decrease Defense by 4.9% for every 10 points of Speed over 100, up to 29.4%/32.3%/31.8%/34.7%.\nAlso inflict Insight on the main target."
        },
        "skill2": {
            "name": "Dreams in the Mist ",
            "element": "버프광역",
            "type":"디버프",
            "cool": 8,
            "description": "Increase all foes' damage taken by 10.5%/11.6%/11.3%/12.4% for 2 turns.\nWhen an ally lowers a foe's Down Points or knocks down a foe, decrease cooldown time by 1. When cooldown time reaches 0, activate this skill."
        },
        "skill3": {
            "name": "Verngale Petals",
            "element": "버프광역",
            "type":"버프",
            "cool": 8,
            "unlock": "『Intel』 stacks ≥ 5",
            "description": "Spend all Intel stacks to grant Fair Winds to party for 1 turn and restore targeted ally's HP by 12.7%/12.7%/13.7%/13.7%.\nFair Winds: Increase damage to foes by 12.6%/13.9%/13.6%/14.9%. Increase more based on Riko's Speed and the number of Intel stacks spent. If Riko's Speed is above 100, increase damage by 1.05% for every 10 points of Speed over 100, up to 6.3%/6.9%/6.8%/7.4%."
        },
        "skill_highlight": {
            "name": "Attribute Boost",
            "element": "패시브",
            "type":"패시브",
            "description": "Increases all allies' corresponding attribute stats by 15% of the Revealed Phantom Thief's attributes."
        },
        "passive1": {
            "name": "Springtime Tempest",
            "element": "패시브",
            "description": "At the start of battle, if Riko's Speed is above 100, increase party's HP by 6, Attack by 2, and Defense by 2 for every 1 point of Speed above 100.\nIncrease HP up to 360, Attack up to 120, and Defense up to 120."
        },
        "passive2": {
            "name": "Plum Blossom Glory",
            "element": "패시브",
            "description": "Increase 1 More and All-Out Attack damage by 60.0%."
        }
    },
    "리코·매화": {
        "name": "Riko Tanemura·Vast",
        "skill1": {
            "name": "Wind of Vitality",
            "element": "질풍",
            "type":"단일피해",
            "cool": 0,
            "description": "Deals 183.0%/201.7%/194.3%/213.0% ATK as Wind DMG to 1 enemy, with a 100% base chance to inflict Winded for 2 turns. Inflicts the target with [Wither]: When taking Wind DMG, increase that damage's ATK based on 18.3% of own CRIT DMG that's over 100%, up to 388.0%/418.0%/418.0%/448.0% CRIT DMG for 2 turns. Restores 16 SP to self."
        },
        "skill2": {
            "name": "Under the Umbrella",
            "element": "버프광역",
            "type":"버프",
            "cool": 0,
            "description": "Increases all allies' ATK based on 12.8% own CRIT DMG that's over 100%, up to 388.0%/418.0%/418.0%/448.0% of own CRIT DMG for 2 turns, and restores 4 SP. During this effect when any ally deals damage with Persona Skill/Follow Up/[HIGHLIGHT], restores 12 SP to self once."
        },
        "skill3": {
            "name": "Fragrance of Time",
            "element": "버프",
            "type":"버프",
            "sp": "50 - 200",
            "cool": 0,
            "description": "Consumes all SP, increases 1 other ally's CRIT Rate by 16.0%/17.0%/17.0%/18.0%.\nFor every 2 SP consumed, additionally triggers the following effects by 1% for 2 turns, up to 388.0%/418.0%/418.0%/448.0% of own CRIT DMG:\n- Consumes 50 SP: Increases ATK by 2.4 for every 1% CRIT DMG that's over 100%;\n- Consumes 100 SP: Increases CRIT DMG for every 12% CRIT DMG that's over 100%;\n- Consumes 150 SP: Additionally increases CRIT DMG for every 6% CRIT DMG that's over 100%."
        },
        "skill_highlight": {
            "element": "버프",
            "type":"버프",
            "description": "Increases 1 other ally's ATK by 2.5 ATK for every 1% CRIT DMG that's over 100%, up to 388.0%/418.0%/418.0%/448.0% CRIT DMG. Increases their CRIT DMG by 24.4%/26.9%/25.9%/28.4% for 2 turns. Restores 20 SP to all other allies."
        },
        "passive1": {
            "name": "Bloom",
            "element": "패시브",
            "description": "After you use [Fragrance of Time], give the main target 2 turns of [Budding]: Gain 1 stack of [Blossom] when dealing 1 hit of skill damage: Increase ATK by 30 for 3 turns, up to 10 stacks. \n- When reaching 5 stacks of [Blossom], additionally increase their ATK based on 8% own CRIT DMG that's over 100%, increase their CRIT DMG based on 5% own CRIT DMG that's over 100%;\n- When reaching 10 stacks of [Blossom], additionally increase their CRIT DMG based on 5% own CRIT DMG that's over 100%."
        },
        "passive2": {
            "name": "Abundant",
            "element": "패시브",
            "description": "In battle, increase CRIT DMG based on SP Recovery, up to 450% SP Recovery for 84% CRIT DMG."
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
            "description": "Deals 149.2%/164.2%/158.4%/173.4% DEF as Ice DMG to the main target and 44.8%/50.3%/47.6%/53.1% DEF as Ice DMG to all other targets, with a 97.6% base chance to inflict Freeze to the main target; Restores 2 [Valour]. If you are in [Justice Oath], additionally increases the main target's DMG Taken by (1% for every 600 DEF you have, up to 9.8%/10.8%/10.4%/11.4%) for 2 turns; However, decreases [Valour] recovery to 1."
        },
        "skill2": {
            "name": "Honor Protection",
            "element": "버프",
            "type":"실드",
            "sp": 26,
            "cool": 0,
            "description": "Gives 1 ally 1 stack of 22.8%/22.8%/24.2%/24.2% DEF + 650/790/799/939 Shield as [Upright Mark], then increases their DEF equal to 20% own DEF (Up to 1220/1345/1295/1420) for 2 turns; When gaining this effect, increases that ally's chance of attacked by 50% if their HP is above 60%; At the start of your next turn, gives that ally 1 stack of [Upright Mark]. If you are in [Justice Oath], increase the Shield from [Upright Mark] by 25%."
        },
        "skill3": {
            "name": "Prayers of Spirituality",
            "element": "버프광역",
            "type":"실드",
            "sp": 30,
            "cool": 1,
            "description": "Gives all allies 1 stack of 12% DEF + 120/240/360 (At level 1, 50, 70) Shield as [Upright Mark] and 1 stack of 49.2%/49.2%/52.2%/52.2% DEF + 1400/1705/1721/2026 Shield as [Holy Protection], gives all allies 1 Down Gauge and increases their DMG Bonus by 1% (for every 300 DEF you have, up to 19.5%/21.5%/20.7%/22.7%) for 2 turns."
        },
        "skill_highlight": {
            "element": "버프광역",
            "type":"실드",
            "description": "Immediately gives all allies 1 stack of 59.0%/59.0%/62.7%/62.7% DEF + 1681/2044/2066/2429 Shield as [Holy Protection], decreases all allies' DMG Taken by 31.9%/35.1%/33.9%/37.1% for 2 turns."
        },
        "passive1": {
            "name": "Sacrifice",
            "element": "패시브",
            "description": "Allies Shielded by Cherish have their DEF increased by 24.0%."
        },
        "passive2": {
            "name": "Humility",
            "element": "패시브",
            "description": "Allies Shielded by Cherish have their Effect RES increased by 48.0%."
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
        "name": "Tropical Motoha",
        "skill1": {
            "name": "Blue Sunrise",
            "element": "축복광역",
            "type":"광역피해",
            "sp": 20,
            "cool": 0,
            "description": "Deal Bless damage to all foes equal to 87.8%/96.8%/93.2%/102.2% of Attack. If Summer Hype is active, spend 10% of Motoha's max HP to deal bonus Bless damage to all foes equal to 29.3%/32.3%/31.1%/34.1% of Attack."
        },
        "skill2": {
            "name": "Summer 'Splosion",
            "element": "축복",
            "type":"단일피해",
            "sp": 20,
            "cool": 0,
            "description": "Deal Bless damage to 1 foe equal to 136.6%/150.6%/145.0%/159.0% of Attack, and restore 20% of Motoha's max HP. If Summer Hype is active, deal bonus Bless damage to 1 foe equal to 34.2%/37.7%/36.3%/39.8% of Attack."
        },
        "skill3": {
            "name": "Surf 'n' Shine",
            "element": "축복광역",
            "type":"광역피해",
            "sp": 24,
            "cool": 1,
            "description": "Immediately enter the Summer Hype state, which lasts until the end of Tropical Motoha's next turn.\nSpend 15% of her max HP to deal Bless damage to all foes equal to 159.7%/176.0%/169.5%/185.8% of Attack.\nSummer Hype: Increase critical rate by 9.8%/9.8%/10.4%/10.4% and damage by 29.3%/29.3%/31.1%/31.1%."
        },
        "skill_highlight": {
            "element": "축복광역",
            "type":"광역피해",
            "description": "Deal Bless damage to all foes equal to 195.2%/215.2%/207.2%/227.2% of Attack, and restore 20% of Motoha's max HP.\nIf her HP is above 50%, increase Highlight damage by 25%."
        },
        "passive1": {
            "name": "Energy Overload!",
            "element": "패시브",
            "description": "When Tropical Motoha receives healing, increase damage by 30.0% for 2 turns."
        },
        "passive2": {
            "name": "Outshine the Sun!",
            "element": "패시브",
            "description": "During battle, increase Motoha's Attack by 24 points for every 100 points of max HP above 8000, up to 1920."
        }
    },
    "몽타뉴·백조": {
        "name": "Montagne Kotone·Swan",
        "skill1": {
            "name": "Storm Prelude/Piercing Chill",
            "element": "질풍빙결",
            "type":"단일피해",
            "sp": 24,
            "cool": 0,
            "description": "[Mid-Spring Form]: Deals 65.9%/72.7%/69.9%/76.7% ATK as Wind DMG to 1 enemy 3 times, with a 30% base chance to inflict Winded; If you are in [Mid-Spring Domain], additionally inflict [Wind Injury] for 2 turns. Increase your CRIT DMG by 29.3%/29.3%/31.1%/31.1% when attacking enemies with [Wind Injury].\n\n[Winter Night Form]: Deals 122.2%/134.7%/129.7%/142.2% ATK as Ice DMG to 1 enemy, with a 97.6%/97.6%/103.6%/103.6% base chance to inflict Freeze. If they are already inflicted with Freeze, inflict [Frostbite] for 2 turns. Enemies with [Frostbite] have their Ice DMG Taken increased by 13.7%/13.7%/14.5%/14.5% ."
        },
        "skill2": {
            "name": "Sweeping Wind/Falling Snowfield",
            "element": "질풍빙결광역",
            "type":"광역피해",
            "sp": 24,
            "cool": 0,
            "description": "[Mid-Spring Form]: Deals 31.3%/34.5%/33.3%/36.5% ATK as Wind DMG to all enemies 3 times; If you are in [Mid-Spring Domain], additionally gain 1 [Morning Dew Crystal].\n\n[Winter Night Form]: Deals 83.8%/92.4%/89.0%/97.6% ATK as Ice DMG to all enemies, with a 43.8% base chance to inflict Freeze. If Mont - Figure Skater is in [Winter Night Domain], increase the damage of this attack by 20%."
        },
        "skill3": {
            "name": "Approaching Spring/Cold Night Song",
            "element": "질풍빙결",
            "type":"단일피해",
            "sp": 28,
            "cool": 0,
            "description": "[Mid-Spring Form]: Opens [Mid-Spring Domain] for 1 turn, then deals 82.9%/91.5%/87.9%/96.5% ATK as Wind DMG to 1 enemy 3 times. When [Mid-Spring Domain] is active, all allies when dealing Wind DMG with Persona skill, HIGHLIGHT, or Follow Up, you will deal 20% ATK as Wind DMG to the main target and gain 1 [Morning Dew Crystal]. When [Mid-Spring Domain] ends, consumes all [Morning Dew Crystal] and deals (3+[Morning Dew Crystal])*34.2%/37.7%/36.3%/39.8% ATK as Wind DMG to the main target, this damage is seen as a Follow-Up Action.\n\n[Winter Night Form]: Opens [Winter Night Domain] for 1 turn, then deals 183.2%/201.9%/194.5%/213.2% ATK as Ice DMG to 1 enemy. When [Winter Night Domain] is active, all allies gain [Condensed Shield] when attacked which gives 1301/1301/1381/1381 Shield, up to 2 times. When any ally deals Ice DMG with a Persona skill, HIGHLIGHT, or Follow Up, Mont - Figure Skater will gain 1 [Frost Crystal]. When [Winter Night Domain] ends, consume all [Frost Crystal] and deal (3+[Frost Crystal])*27.9%/30.8%/29.6%/32.5% ATK as Ice DMG to the main target. This damage is seen as a Follow-Up Action."
        },
        "skill_highlight": {
            "element": "질풍빙결",
            "type":"단일피해",
            "description": "[Mid-Spring Form]: Deals 149.6% ATK to 1 enemy 3 times; If you are in [Mid-Spring Domain], additionally gain 1 [Morning Dew Crystal] that can exceed the cap. Otherwise deal 1 additional hit of Wind DMG to the target. 149.6%/165.0%/158.8%/174.2%.\n\n[Winter Night Form]: Deals 380.6%/419.6%/404.0%/443.0% ATK as Ice DMG to 1 enemy, with a 68.3%/68.3%/72.5%/72.5% base chance to inflict [Ice Seal] for 1 turn. If Mont - Figure Skater is in [Winter Night Domain], increase the base chance of [Ice Seal] by 29.3%/29.3%/31.1%/31.1%. Otherwise, the damage dealt by this attack is increased by 20%."
        },
        "passive1": {
            "name": "Cherish",
            "element": "패시브",
            "description": "Increase your Ice DMG by 33.0% when your team has other Ice Thieves.\nIncrease your Wind DMG by 33.0% when your team has other Wind Thieves."
        },
        "passive2": {
            "name": "Longing",
            "element": "패시브",
            "description": "[Mid-Spring Form]: When allies deal 1 hit of Wind DMG, increase the ATK for all allies by 8.1% for 2 turns, up to 5 stacks. [Winter Night Form]: When Mont - Figure Skater gains Shield, increase the DEF for all allies by 9.0% for 2 turns, up to 4 stacks."
        }
    },
    "아야카": {
        "name": "Ayaka Sakai",
        "skill1": {
            "name": "Distortion",
            "element": "전격광역",
            "type":"광역피해",
            "sp": 20,
            "cool": 0,
            "description": "Deal Electric damage to all foes equal to 85.4%/94.2%/90.6%/99.4% of Attack. 80% chance to inflict Shock on the main target for 2 turns.\nIf an ally has Costar, deal bonus Electric damage to the main target equal to 83.3%/91.8%/88.4%/96.9% of that ally's Attack (1 hit)."
        },
        "skill2": {
            "name": "Unison Notes",
            "element": "버프",
            "type":"버프",
            "sp": 20,
            "cool": 0,
            "description": "Grant Costar to 1 ally, and increase their Attack by 24% of Ayaka's Attack (up to 1220/1345/1295/1420) for 3 turns.\nOnly 1 ally can be a Costar at a time."
        },
        "skill3": {
            "name": "Catchy Hook",
            "element": "버프",
            "type":"버프",
            "sp": 25,
            "cool": 1,
            "description": "Immediately activate an ally's Highlight, and increase its damage by 78.1%/86.1%/82.9%/90.9%.\nThis skill does not affect the target's Highlight cooldown time, even if it activates a Highlight."
        },
        "skill_highlight": {
            "element": "버프광역",
            "type":"버프",
            "description": "For 4 ally actions, increase party's damage by 45.5%/50.1%/48.3%/52.9%.\nWhile active, fill Highlight gauge by 10% after each ally action (up to 40%)."
        },
        "passive1": {
            "name": "Backing Track",
            "element": "패시브",
            "description": "When an ally uses a Highlight, increase target's Attack by 24.0% for 1 turn.\nWhen the target has Costar, increase effects by 1.5 times."
        },
        "passive2": {
            "name": "Chorus Effect",
            "element": "패시브",
            "description": "After an ally uses a Highlight, the ally with the lowest HP recovers HP equal to 15.0% of Ayaka's Attack + 1350."
        }
    },
    "야오링·사자무": {
        "name": "Yaoling Li·Lion Dance",
        "skill1": {
            "name": "Abundant World",
            "element": "화염광역",
            "type":"광역피해",
            "sp": 20,
            "cool": 0,
            "description": "Deals 120.4%/132.8%/127.8%/140.2% ATK as Fire DMG to all enemies and increases own CRIT Rate by 10% for 2 turns.\n[Fiery Shooting Star] Effect Boost: Additionally deals 72.8%/80.2%/77.3%/84.7% ATK as Fire DMG, effect boost lasts for 1 turn."
        },
        "skill2": {
            "name": "Crackling Firecrackers",
            "element": "화염광역",
            "type":"광역피해",
            "sp": 20,
            "cool": 0,
            "description": "Deals 73.8%/81.4%/78.3%/85.9%  ATK as Fire DMG to all enemies, with a 75% chance to inflict Burn and [Year Fire] for 2 turns.\n[Fiery Shooting Star] Effect Boost: Inflicts the target with [Year Fire], effect boost lasts for 1 turn.\n[Year Fire]: Take Fire DMG based on 63.4%/69.9%/67.3%/73.8% ATK for 2 turns, up to 4 stacks."
        },
        "skill3": {
            "name": "Shooting Star Greetings",
            "element": "버프",
            "type":"버프",
            "sp": 24,
            "cool": 1,
            "description": "Enchants Rin's sword with flame, enters [Iron Flower Dance]: Increase DMG Dealt by 34.3%/37.8%/36.4%/39.9%, upgrade Rin's Melee Attack to [Fiery Shooting Star] for 1 turn or until you use [Fiery Shooting Star].\n[Fiery Shooting Star]: Deals 127.4%/140.4%/135.2%/148.2% ATK as Fire DMG to all enemies and triggers Fire TECHNICAL, when triggering [Backdraft], increases the effects of TECHNICAL by 20%.\nStarts with a 1 turn cooldown. Rin can still use other skills after using this skill. This skill is not seen as a Persona skill."
        },
        "skill_highlight": {
            "element": "화염광역",
            "type":"광역피해",
            "description": "Deals 205.9%/227.0%/218.6%/239.7% ATK as Fire DMG to all enemies, increases own ATK by 19.5%/21.5%/20.7%/22.7% and [Fiery Shooting Star] DMG Dealt by 19.5%/21.5%/20.7%/22.7% for 2 turns."
        },
        "passive1": {
            "name": "Auspicious",
            "element": "패시브",
            "description": "Increase DMG Dealt to enemies inflicted with Burn by 36.0%."
        },
        "passive2": {
            "name": "Pleasantness",
            "element": "패시브",
            "description": "At the start of battle, increase own ATK by 30.0% for 2 turns; When any allies trigger TECHNICAL, refresh this duration and boost the effect to 45.0%."
        }
    },
    "유우미": {
        "name": "Yumi Shiina",
        "skill1": {
            "name": "Tempting Build",
            "element": "버프광역",
            "type":"버프",
            "cool": 6,
            "description": "Increase party's Attack by 8.7% of Yumi's Attack for 3 turns (up to 4600/5060/5980/6440of Attack).\nWhen an ally uses a skill, spend 1 Cocktail to strengthen that skill's effects.\nHigher quality Cocktails will be used first. [Tailor-Made], [Standard], and [Basic] Cocktails will increase skill effects by 120%, 100%, and 50% respectively.\nCooldown Time: 6 ally actions."
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
            "description": "Spend all Cocktails to increase party's attribute damage based on the targeted ally's attribute for 2 turns.\nIncrease damage by 1% for every 230 of Yumi's Attack (up to 4600/5060/5980/6440of Attack). [Tailor-Made], [Standard], and [Basic] Cocktails will increase damage by an additional 120%, 100%, and 50% respectively.\nIncrease effects on targeted ally by 1.2 times. If 2 or more [Standard] or better Cocktails are spent, increase targeted ally's critical damage by 20.0%/22.0%/22.4%/24.4%."
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
            "name": "Glimmer of Night",
            "element": "축복",
            "type":"단일피해",
            "sp": 23,
            "cool": 0,
            "description": "When you manually use this skill, deals 186.9%/206.1%/198.4%/217.5% ATK as Bless DMG to 1 enemy, and gains [Brave Step], up to a 3 stacks. When [Dance Partner] triggers this skill, deals 121.6%/134.1%/129.1%/141.5% ATK as Bless DMG to 1 enemy, and gains [Brave Step], up to 3 stacks."
        },
        "skill2": {
            "name": "Dancing in Hand",
            "element": "버프",
            "type":"버프",
            "sp": 22,
            "cool": 0,
            "description": "Selects 1 ally to become the [Dance Partner] for 3 turn. Increases own and [Dance Partner]'s ATK by 32.4%/35.7%/34.4%/37.7% for 3 turns. Gains [Agile Step], up to 1 stack. After [Dance Partner] use a Persona skill, immediately use [Glimmer of Night] on 1 random enemy (If [Dance Partner] used a skill that target an enemy, change the main target of [Glimmer of Night] to that enemy). There can only be 1 [Dance Partner]."
        },
        "skill3": {
            "name": "Blooming Heart",
            "element": "축복",
            "type":"단일피해",
            "sp": 27,
            "cool": 0,
            "description": "Deals 214.7%/236.7%/227.9%/249.9% ATK as Bless DMG to 1 enemy. If you are in [Masquerade], additionally increases skill damage by 30% and CRIT DMG by 29.3%/29.3%/31.1%/31.1%."
        },
        "skill_highlight": {
            "element": "축복",
            "type":"단일피해",
            "unlock":"자신이 『가면무도회』 상태.",
            "description": "[HIGHLIGHT] use condition: When you are in [Masquerade].\nDeals 243.8%/268.8%/258.8%/283.8% ATK as Bless DMG to 1 enemy. Based on own [Posture], gains the corresponding effects:\n- [Brave Step]: Each stack increases HIGHLIGHT skill damage by 15%. \n- [Agile Step]: Increases HIGHLIGHT CRIT Rate by 10% and CRIT DMG by 20%."
        },
        "passive1": {
            "name": "Faith",
            "element": "패시브",
            "description": "For every 1 stack of [Posture], increase Bless DMG by 10.0%, up to 30%."
        },
        "passive2": {
            "name": "Determination",
            "element": "패시브",
            "description": "After other allies use HIGHLIGHT, increase own ATK by 45.0% for 2 turns, up to 2 stacks."
        }
    },
    "키라": {
        "name": "Kira Kitazato",
        "skill1": {
            "name": "Incision Technique / Sinful Game",
            "element": "물리",
            "type":"단일피해",
            "sp": 21,
            "cool": 0,
            "description": "[Hunter] Form: Deal 47.3%/52.2%/50.2%/55.1% ATK as Phys DMG to 1 enemy 4 times, inflicts 1 stack of [Bleed].\n[Executioner] Form: Deal 201.4%/222.1%/213.7%/234.4% ATK as Phys DMG to 1 enemy, removes 2 stacks of [Bleed] after this skill. (Can trigger the effect of [Laceration])."
        },
        "skill2": {
            "name": "Lethal Pleasure / Curtain Call",
            "element": "물리",
            "type":"단일피해",
            "sp": 21,
            "cool": 0,
            "description": "[Hunter] Form: Deal 84.2%/92.8%/89.4%/98.0% ATK as Phys DMG to 1 enemy 2 times. Immediately triggers [Bleed] DMG and refreshes the duration of [Bleed].\n[Executioner] Form: Deal 201.3%/222.0%/213.7%/234.4% ATK as Phys DMG to 1 enemy, for every 1 stack of [Bleed] on the target, increases the skill damage and [Laceration] damage by 2%, remove all stacks of [Bleed] after this skill. (Can trigger the effect of [Laceration])."
        },
        "skill3": {
            "name": "Night’s Arrival",
            "element": "버프",
            "type":"전환",
            "sp": 15,
            "cool": 0,
            "description": "Unlocks when any enemy have ≥ 7 stacks of [Bleed].\nTransforms into [Executioner], changes skill and gains this effect: When using skills, for every 3 stacks of [Bleed], deals 1 additional hit of [Laceration]: deal 66.7%/73.5%/70.8%/77.6% ATK as Phys DMG. You can still use other skills after using this skill, automatically transforms back into [Hunter] at the end of the turn."
        },
        "skill_highlight": {
            "element": "물리",
            "type":"단일피해",
            "description": "Transforms into [Hunter], immediately inflicts 5 stacks of [Bleed] to 1 enemy. Afterwards immediately transform into [Executioner] and deal 328.5%/362.2%/348.7%/382.4% ATK as Phys DMG (Can Trigger the effect of [Laceration])."
        },
        "passive1": {
            "name": "Infect",
            "element": "패시브",
            "description": "For every 30% EHR, increase the Phys DMG from [Bleed] by 4% of own ATK, up to 90% EHR."
        },
        "passive2": {
            "name": "Fester",
            "element": "패시브",
            "description": "Increase EHR by 36% as [Hunter].\nIncrease PEN by 21% as [Executioner]."
        }
    },
    "토모코·여름": {
        "name": "Tomoko Noge·Summer",
        "skill1": {
            "name": "Come Order a Drink",
            "element": "염동광역",
            "type":"광역피해",
            "sp": 23,
            "cool": 0,
            "description": "Deals 77.6%/85.5%/82.4%/90.3% ATK as Psy DMG to all enemies 4 times, prioritizing enemies that have not been attacked yet, inflicts 1 stack of [Spark] per hit of damage. Attacks on the same target will only deal 30% damage.\nPassive: Increase the damage/healing multiplier of [Gorgeous Fireworks] by 51.7%/51.7%/59.9%/59.9%."
        },
        "skill2": {
            "name": "Please Enjoy",
            "element": "치료",
            "type":"치료",
            "sp": 27,
            "cool": 0,
            "description": "Restores 22.4%/22.4%/23.8%/23.8% ATK + 1438/1749/1767/2078 HP to 1 ally, increases their ATK by 14.6%/14.6%/15.5%/15.5%, EHR by 58.6%/58.6%/62.2%/62.2%, and damage dealt by 30%. They can now inflict 1 stack of [Spark] after each hit of damage for 2 turns, up to 5 stacks."
        },
        "skill3": {
            "name": "Midnight Memory",
            "element": "염동광역",
            "type":"광역피해",
            "sp": 25,
            "cool": 0,
            "description": "Deals 61.0%/67.2%/64.8%/71.0% ATK as Psy DMG to all enemies and increases their DMG Taken by 19.5%/19.5%/20.7%/20.7%. Inflict 1 stack of [Spark] to each enemy after each hit of damage for 1 turns, counts down at the start of your turn. When this effect is active, Summer Moko can inflict up to 5 stacks of [Spark] (That damage cannot trigger the effect of this skill)."
        },
        "skill_highlight": {
            "element": "염동",
            "type":"광역피해",
            "description": "Deals 82.4%/90.9%/87.4%/95.9% ATK as Psy DMG to all enemies randomly 3 times, prioritizing enemies that have not been attacked yet. Each hit of damage will inflicts 1 stack of [Spark]. Attacks on the same target will only deal 30% damage."
        },
        "passive1": {
            "name": "Dazzling",
            "element": "패시브",
            "description": "During Battle, increase Psy DMG and Max HP based on own Healing Effect. Up to 42.0% Healing Effect for 70.0% Psy DMG and 2100 Max HP."
        },
        "passive2": {
            "name": "Eye-Catching",
            "element": "패시브",
            "description": "When using [Please Enjoy], Increase the main target's Max HP by 1800 for 2 turns, then restore 60% skill healing to the lowest HP ally."
        }
    },
    "하루": {
        "name": "Haru Okumura",
        "skill1": {
            "name": "Fusion Aiming",
            "element": "염동광역",
            "type":"광역피해",
            "sp": 20,
            "cool": 0,
            "description": "Deals 68.8%/75.9%/73.0%/80.1% ATK as Psy DMG to all enemies 2 times, there is a 97.6%/97.6%/103.6%/103.6% base chance to inflict the main target with [Sight] and a 53.7%/53.7%/57.0%/57.0% base chance to inflict all other enemies with [Sight]. Noir then converts all enemies' [Sight] into own [Sight] for 3 turns.\nGains [Thermal Customization]: When using Gun Attack, if you have [Sight], increases skill damage by 29.3%/32.3%/31.1%/34.1%, removes all own [Sight] after Gun Attack."
        },
        "skill2": {
            "name": "Suppressing Fire",
            "element": "총격",
            "type":"단일피해",
            "hp": 12,
            "cool": 0,
            "description": "Deals 151.6%/167.1%/160.9%/176.4% ATK as Gun DMG to 1 enemy. Increases PEN by 19.5%/19.5%/20.7%/20.7% when Noir has [Sight]. \nGains [Piercing Customization]: Deals an additional 39.0%/43.0%/41.4%/45.4% ATK as Psy DMG to the main target when using Gun Attack. This can triggers the skill damage boosting effect of [Thermal Customization]."
        },
        "skill3": {
            "name": "Full Metal Explosion",
            "element": "염동광역",
            "type":"광역피해",
            "sp": 24,
            "cool": 0,
            "description": "Deals 129.2%/142.5%/137.2%/150.4% ATK as Psy DMG to all enemies, increases CRIT Rate by 19.5%/19.5%/20.7%/20.7% when Noir has [Sight].\nGains [Spreading Customization]: Deals an additional 29.3%/32.3%/31.1%/34.1% ATK as Psy DMG to all enemies. This can trigger the skill damage boosting effect of [Thermal Customization]."
        },
        "skill_highlight": {
            "element": "염동광역",
            "type":"광역피해",
            "description": "Deals 206.9%/228.1%/219.6%/240.8% ATK as Psy DMG to all enemies. \nGains [Overload Customization] if [Customization] is not full or if Noir doesn't have [Overload Customization]. \n[Overload Customization]: Increases Gun Attack CRIT Rate by 14.6%/14.6%/15.5%/15.5%. Otherwise, increases this attack’s skill damage by 14.6%/14.6%/15.5%/15.5%."
        },
        "passive1": {
            "name": "Launch",
            "element": "패시브",
            "description": "In battle, for every 1.45% EHR, increase ATK by 1%, up to 165% ATK. For every 50% EHR, additionally gain 1 stack of 20% CRIT DMG, up to 3 stacks."
        },
        "passive2": {
            "name": "Instigate",
            "element": "패시브",
            "description": "Everytime you gain 1 [Customization], permanently gain 1 stack of [Barrel Heat]. Increase own stats when [Barrel Heat] reach certain stacks:\n- 1 stack: Increase EHR by 18.0%, Effect RES by 18.0%;\n- 2 stacks: Increase ATK by 18.0%, DEF by 18.0%;\n- 3 stacks: Increase CRIT DMG by 18.0%."
        }
    },
    "후타바": {
        "name": "Futaba Sakura",
        "skill1": {
            "name": "Silent Hacking",
            "element": "버프광역",
            "type":"디버프",
            "cool": 4,
            "description": "Decrease all enemies' DEF by 6% + (An additional 0.53% for every 100 ATK, up to 4600/5060/5980/6440 ATK) for 3 turns. During this duration, double this debuff when enemies take Weak damage. Give all allies [Hack Complete] if you are at 100% Analysis Progress for 2 turns."
        },
        "skill2": {
            "name": "Data Crack",
            "element": "버프",
            "type":"디버프",
            "cool": 4,
            "description": "Increase the DMG Taken of 1 enemy by 6% + (An additional 0.38% for every 100 ATK, up to 4600/5060/5980/6440 ATK) for 3 turns. During this duration, gain 15% Analysis Progress after allies deal damage with Persona skill/Follow Up/[HIGHLIGHT]. Give all allies [Hack Complete] if you are at 100% Analysis Progress for 2 turns."
        },
        "skill3": {
            "name": "In the Name of Featherman",
            "element": "버프",
            "type":"버프",
            "cool": 8,
            "unlock": "Ally must have 『Hack Complete』.",
            "description": "Increase 1 ally's ATK by 270+(An additional 21.7 for every 100 ATK, up to 4600/5060/5980/6440 ATK) for 2 turns. Inflicts [Disruption Virus] based on the target's element to all enemies for 1 turn. \n[Disruption Virus]: Change the target's resistance: Turn to Resist if they have Null, Repel, Absorb; Turn to Neutral if they have Resist; Turn to Weak if they have Neutral. Increase Weak DMG Taken by 25% if they have Weak."
        },
        "skill_highlight": {
            "name": "Attribute Improvement",
            "element": "패시브",
            "description": "Increase all allies' stats by 20% of Oracle's stats."
        },
        "passive1": {
            "name": "Playfulness",
            "element": "패시브",
            "description": "At the start of battle, gain 100% Analysis Progress."
        },
        "passive2": {
            "name": "Cleanup",
            "element": "패시브",
            "description": "Give all allies 30% ATK Shield for 3 turns when they are in [Hack Complete]."
        }
    },

    "유스케": {
        "name": "Yusuke Kitagawa",
        "skill1": {
            "name": "Frozen Presence",
            "element": "빙결광역",
            "type": "광역피해",
            "sp": 20,
            "cool": 0,
            "description": "Deal Ice damage to all foes equal to 72.1%/79.5%/76.6%/84.0% of Yusuke's Defense. Inflict Freeze on main target for 2 turns with a 100% base chance."
        },
        "skill2": {
            "name": "Bone-Chilling Cold",
            "element": "빙결광역",
            "type": "광역피해",
            "sp": 20,
            "cool": 0,
            "description": "Deal Ice damage to random foes equal to 92.9%/102.4%/98.6%/108.1% of Yusuke's Defense (5 hits). Prioritize new targets for each hit. If Yusuke has a shield, increase skill damage by 30%. For repeated hits on the same target, decrease damage by 60% each time, up to a minimum of 20% damage."
        },
        "skill3": {
            "name": "Keen Eye",
            "element": "버프",
            "type": "버프",
            "sp": 24,
            "cool": 1,
            "description": "Change the next activated [Inspiration] to [Imagination].\n[Imagination]: Counterattack chance becomes 100%, damage increases by 78.1%/86.1%/82.9%/90.9% of Defense, and changes to an AoE attack. If not activated by the start of Yusuke's next action, it will activate automatically.\nFor 2 turns, gain a shield equal to 19.5%/19.5%/20.7%/20.7% + 555/555/683/683 of Defense, temporarily change Yusuke's weakness to base attribute, and nullify all spiritual ailments. Also, inflict Taunt on all foes for 2 turns."
        },
        "skill_highlight": {
            "element": "빙결광역",
            "type": "광역피해",
            "description": "Deal Ice damage to all foes equal to 178.1%/196.4%/189.1%/207.3% of Yusuke's Defense. Increase [Inspiration] counterattack activation chance by 35% for 3 turns."
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

    "YUI": {
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
        "name": "Yaoling Li",
        "skill1": {
            "name": "Underworld Ferry",
            "element": "주원광역",
            "type": "디버프 중첩",
            "sp": 20,
            "cool": 0,
            "description": "Deal Curse damage to all foes equal to 73.2%/80.7%/77.7%/85.2% of Attack. Decrease foes' Defense by 3% for every 10 points of Yaoling's Speed for 2 turns (up to 49.7%/54.8%/53.5%/58.6%). Also gain 4 [Memory] stacks for each foe attacked."
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
            "description": "Deal Psychokinesis damage to 1 foe equal to 146.4%/161.4%/155.4%/170.4% of Attack, and grant [Affection] to party for 1 turn. [Affection]: When dealing damage with a skill, Haruna gains 1 Childish Heart stack."
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
            "description": "Each time an ally with [Affection] deals damage, 40.0% chance to gain 1 Childish Heart stack."
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
        "name": "Leo Kamiyama",
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
        "name": "Montagne Kotone",
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
        "name": "Yukimi Fujikawa",
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
        "name": "Kiyoshi Kurotani",
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
        "name": "Toshiya Sumi",
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
        "name": "Kayo Tomiyama",
        "skill1": {
            "name": "Club Okyann",
            "element": "버프광역",
            "type": "버프광역",
            "cool": 4,
            "description": "Increase party's Attack by 12% of Tomiyama's Attack for 1 turn (up to 4500/4950/5400/5850 of Attack), increase ailment accuracy by 35.0%/38.5%/37.8%/41.3%, and gain 1 [Beat] stack."
        },
        "skill2": {
            "name": "Intermission",
            "element": "버프광역",
            "type": "버프광역",
            "cool": 8,
            "description": "Restore party's SP by 22/27/26/31, and grant 3 [Beat] stacks."
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
            "description": "For every 4 [Beat] stacks gained, inflict 1 random elemental ailment on the foe with the highest remaining HP."
        },
        "passive2": {
            "name": "Outdated Slang",
            "element": "패시브",
            "description": "When an ally inflicts an elemental ailment on a foe, increase that ally's damage by 15.0% for 2 turns. Also, 21.0% chance to grant 1 [Beat] stack."
        }
    }
};

// window 객체에 할당
window.enCharacterSkillsData = enCharacterSkillsData;

// Export for use in other files
if (typeof module !== 'undefined' && module.exports) {
    module.exports = characterSkillsData;
}
