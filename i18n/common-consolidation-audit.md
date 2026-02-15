# i18n Common Consolidation Audit

Date: 2026-02-15
Scope: `i18n/common/{kr,en,jp}.js` + `i18n/pages/*/{kr,en,jp}.js`

## 0) Summary

- Page i18n files: **72**
- Page leaf strings: **4764**
- Common leaf strings per lang: **kr 257 / en 257 / jp 257**
- Page declarations already matching common values (hits): **kr 262 / en 227 / jp 237**
- Repeated page values not found in common (>=3 pages): **124**

## 1) Declarations Immediately Replaceable by Common (value match)

- Rule: page string value exactly equals a string value in common for the same language.
- Note: this is value-based. If one value exists under multiple common keys, semantic review is still required.

| common key | KR (pages/uses) | EN (pages/uses) | JP (pages/uses) | example |
| --- | --- | --- | --- | --- |
| `nav.home` | 20/22 | 20/22 | 20/22 | `astrolabe.home` |
| `labels.total` | 11/12 | 4/4 | 8/9 | `character.filteredCount` |
| `nav.persona` | 5/6 | 7/7 | 7/8 | `character.characterDetailPersona` |
| `gameTerms.persona` | 5/6 | 7/7 | 7/8 | `character.characterDetailPersona` |
| `gameTerms.weapon` | 5/9 | 7/10 | 5/9 | `material-calc.weapon` |
| `home.menuRevelations` | 6/7 | 4/5 | 6/7 | `character.characterDetailRevelation` |
| `nav.revelations` | 6/7 | 4/5 | 6/7 | `character.characterDetailRevelation` |
| `common.reset` | 4/6 | 6/8 | 5/7 | `maps.resetFilter` |
| `common.close` | 5/6 | 5/6 | 5/6 | `astrolabe.close` |
| `gameTerms.pierce` | 6/8 | 3/3 | 6/6 | `character.characterStatsAwakePierceRate` |
| `gameTerms.revelation` | 6/7 | 2/2 | 6/7 | `character.characterDetailRevelation` |
| `home.menuPersona` | 5/6 | 1/1 | 7/8 | `character.characterDetailPersona` |
| `gameTerms.buff` | 4/5 | 4/5 | 4/5 | `character.characterAttrBuff` |
| `elements.buff` | 4/5 | 4/5 | 4/5 | `character.characterAttrBuff` |
| `home.menuCharacter` | 4/4 | 3/3 | 5/5 | `character.navCurrent` |
| `nav.character` | 4/4 | 3/3 | 5/5 | `character.navCurrent` |
| `common.loading` | 4/4 | 4/4 | 4/4 | `gallery.loading` |
| `gameTerms.defReduction` | 5/7 | 3/3 | 3/3 | `character.characterAttrReduceDef` |
| `common.save` | 4/4 | 3/3 | 4/4 | `material-calc.save` |
| `gameTerms.mindscapeCore` | 3/3 | 5/8 | 2/4 | `character.characterInnateCoreTitle` |
| `common.cancel` | 4/5 | 3/4 | 3/4 | `material-calc.cancel` |
| `common.delete` | 4/4 | 2/2 | 4/4 | `material-calc.remove` |
| `gameTerms.common` | 3/3 | 3/3 | 3/3 | `critical-calc.defenseGroupNames.common` |
| `revelation.common` | 3/3 | 3/3 | 3/3 | `critical-calc.defenseGroupNames.common` |
| `common.filter` | 3/3 | 3/3 | 3/3 | `maps.filter` |
| `gameTerms.skill` | 2/3 | 2/2 | 4/5 | `character.characterDetailSkills` |
| `gameTerms.wonder` | 3/4 | 2/2 | 3/4 | `critical-calc.defenseGroupNames.wonder` |
| `gameTerms.aoe` | 0/0 | 0/0 | 8/9 | `character.filteredCount` |
| `revelation.sun` | 4/4 | 2/2 | 2/2 | `astrolabe.days` |
| `gameTerms.naviPowerAlt` | 3/3 | 2/2 | 3/3 | `critical-calc.defenseI18n.explanation_power` |
| `ailments.windswept` | 3/3 | 3/3 | 2/2 | `critical-calc.defenseI18n.windswept` |
| `common.search` | 3/3 | 2/2 | 3/3 | `material-calc.searchPlaceholder` |
| `gameTerms.mindscapeCoreAlt` | 0/0 | 5/8 | 2/4 | `character.characterInnateCoreTitle` |
| `gameTerms.awareness` | 3/3 | 2/2 | 2/3 | `character.characterDetailRitual` |
| `revelation.space` | 3/3 | 1/1 | 3/3 | `character.characterDetailMainLabel` |
| `gameTerms.ailmentAccuracy` | 3/3 | 1/1 | 3/3 | `character.characterStatsAwakeAilmentAccuracy` |
| `home.languageNotice` | 4/5 | 1/1 | 1/1 | `about.languageNotice` |
| `labels.count` | 2/2 | 4/5 | 0/0 | `persona.countUnit` |
| `labels.unitDay` | 4/4 | 0/0 | 2/2 | `astrolabe.days` |
| `gameTerms.nightmareGateway` | 5/5 | 1/1 | 0/0 | `critical-calc.defenseI18n.boss_type_nightmare` |
| `elements.gun` | 1/1 | 2/2 | 3/3 | `tactic-maker.action_gun` |
| `common.showLess` | 0/0 | 0/0 | 5/6 | `astrolabe.close` |
| `gameTerms.naviPower` | 0/0 | 2/2 | 3/3 | `critical-calc.defenseI18n.explanation_power` |
| `common.remove` | 0/0 | 1/1 | 4/4 | `material-calc.remove` |
| `labels.optional` | 4/5 | 0/0 | 0/0 | `critical-calc.thSelect` |
| `gameTerms.exclusiveWeapon` | 0/0 | 1/1 | 3/3 | `character.characterDetailWeapon` |
| `gameTerms.ailmentAccuracyAlt` | 0/0 | 1/1 | 3/3 | `revelation.sub_ailment_accuracy` |
| `gameTerms.gunShot` | 1/1 | 0/0 | 3/3 | `tactic-maker.action_gun` |

## 2) Missing Common Candidates (not in common + repeated across >=3 pages)

- Rule: same language value appears in 3+ distinct pages and does not exist in that language common file.
- Sort: page count desc, then language, then value.

| lang | repeated value | page count | example paths (max 3) |
| --- | --- | --- | --- |
| en | `All` | 9 | `character.characterDetailEnhancementAll`<br>`gallery.filterAll`<br>`guides.filterAll` |
| jp | `属性` | 7 | `character.filterElement`<br>`maps.enemyElementFallback`<br>`material-calc.filterGroupElement` |
| kr | `속성` | 7 | `character.filterElement`<br>`maps.enemyElementFallback`<br>`material-calc.filterGroupElement` |
| en | `Element` | 6 | `character.filterElement`<br>`maps.enemyElementFallback`<br>`material-calc.filterGroupElement` |
| en | `en_US` | 6 | `critical-calc.seoOgLocale`<br>`defense-calc.seoOgLocale`<br>`material-calc.seoOgLocale` |
| en | `Name` | 6 | `critical-calc.thName`<br>`critical-calc.defenseI18n.th_name`<br>`defense-calc.defenseI18n.th_name` |
| en | `Show Spoilers` | 6 | `character.showSpoilers`<br>`critical-calc.spoiler`<br>`critical-calc.defenseI18n.show_spoiler` |
| jp | `ja_JP` | 6 | `critical-calc.seoOgLocale`<br>`defense-calc.seoOgLocale`<br>`material-calc.seoOgLocale` |
| kr | `ko_KR` | 6 | `critical-calc.seoOgLocale`<br>`defense-calc.seoOgLocale`<br>`material-calc.seoOgLocale` |
| en | `Type` | 5 | `character.filterType`<br>`critical-calc.defenseI18n.th_type`<br>`defense-calc.defenseI18n.th_type` |
| jp | `ネタバレ表示` | 5 | `character.showSpoilers`<br>`critical-calc.spoiler`<br>`synergy.labelShowSpoiler` |
| kr | `바다` | 5 | `critical-calc.defenseI18n.boss_type_sea`<br>`defense-calc.defenseI18n.boss_type_sea`<br>`tactic-maker.needStatBossSea` |
| kr | `직업` | 5 | `character.filterPosition`<br>`material-calc.filterGroupPosition`<br>`persona.filterPosition` |
| kr | `Show Spoilers` | 5 | `character.showSpoilers`<br>`critical-calc.spoiler`<br>`critical-calc.defenseI18n.show_spoiler` |
| en | `Character` | 4 | `home.quick_character`<br>`material-calc.current`<br>`pull-tracker.individual.overview.section.character` |
| en | `Monthly` | 4 | `pull-calc.incomeMonthly`<br>`pull-calc.freqMonthly`<br>`synergy.resetMonthly` |
| en | `Next` | 4 | `gallery.modalNext`<br>`home.carousel_nav_next_aria`<br>`tactic-share.next_page` |
| en | `Note` | 4 | `critical-calc.thNote`<br>`critical-calc.defenseI18n.th_note`<br>`defense-calc.defenseI18n.th_note` |
| en | `NTMR` | 4 | `critical-calc.defenseI18n.boss_type_nightmare`<br>`defense-calc.defenseI18n.boss_type_nightmare`<br>`tactic-upload.nightmare` |
| en | `Res` | 4 | `astrolabe.adaptLabels.Resistant.text`<br>`character.characterElementBadgeRes`<br>`home.adapt_resistant` |
| en | `SoS` | 4 | `critical-calc.defenseI18n.boss_type_sea`<br>`defense-calc.defenseI18n.boss_type_sea`<br>`tactic-upload.sea` |
| en | `Target` | 4 | `critical-calc.thTarget`<br>`critical-calc.defenseI18n.th_target`<br>`critical-calc.defenseI18n.stat_target` |
| en | `Weekly` | 4 | `pull-calc.incomeWeekly`<br>`pull-calc.freqWeekly`<br>`synergy.resetWeekly` |
| en | `Wk` | 4 | `astrolabe.adaptLabels.Weak.text`<br>`character.characterElementBadgeWeak`<br>`home.adapt_weak` |
| jp | `耐` | 4 | `astrolabe.adaptLabels.Resistant.text`<br>`character.characterElementBadgeRes`<br>`home.adapt_resistant` |
| jp | `名前` | 4 | `critical-calc.thName`<br>`critical-calc.defenseI18n.th_name`<br>`defense-calc.defenseI18n.th_name` |
| jp | `目標` | 4 | `critical-calc.thTarget`<br>`critical-calc.defenseI18n.stat_target`<br>`defense-calc.defenseI18n.stat_target` |
| jp | `選択` | 4 | `critical-calc.thSelect`<br>`critical-calc.defenseI18n.th_select`<br>`defense-calc.defenseI18n.th_select` |
| jp | `心の海` | 4 | `critical-calc.defenseI18n.boss_type_sea`<br>`defense-calc.defenseI18n.boss_type_sea`<br>`tactic-upload.sea` |
| jp | `閼兇夢` | 4 | `critical-calc.defenseI18n.boss_type_nightmare`<br>`defense-calc.defenseI18n.boss_type_nightmare`<br>`tactic-upload.nightmare` |
| jp | `弱` | 4 | `astrolabe.adaptLabels.Weak.text`<br>`character.characterElementBadgeWeak`<br>`home.adapt_weak` |
| jp | `月間` | 4 | `pull-calc.incomeMonthly`<br>`pull-calc.freqMonthly`<br>`synergy.resetMonthly` |
| jp | `週間` | 4 | `pull-calc.incomeWeekly`<br>`pull-calc.freqWeekly`<br>`synergy.resetWeekly` |
| jp | `職業` | 4 | `character.filterPosition`<br>`persona.filterPosition`<br>`tactic-maker.job` |
| jp | `タイプ` | 4 | `character.filterType`<br>`persona.filterRarity`<br>`revelation.filter_effect` |
| kr | `목표` | 4 | `critical-calc.thTarget`<br>`critical-calc.defenseI18n.th_target`<br>`critical-calc.defenseI18n.stat_target` |
| kr | `월간` | 4 | `pull-calc.incomeMonthly`<br>`pull-calc.freqMonthly`<br>`synergy.resetMonthly` |
| kr | `이름` | 4 | `critical-calc.thName`<br>`critical-calc.defenseI18n.th_name`<br>`defense-calc.defenseI18n.th_name` |
| kr | `주간` | 4 | `pull-calc.incomeWeekly`<br>`pull-calc.freqWeekly`<br>`synergy.resetWeekly` |
| en | `A` | 3 | `character.characterOperationAwarenessPrefixEn`<br>`tactic.labelRitual`<br>`tactic-maker.ritualLabel` |
| en | `Abs` | 3 | `astrolabe.adaptLabels.Absorb.text`<br>`home.adapt_absorb`<br>`maps.adaptLabels.Absorb.text` |
| en | `Awakening {value}` | 3 | `home.tactic_ritual_alt`<br>`tactic-upload.ritual_alt`<br>`tactics.ritual_alt` |
| en | `Comment` | 3 | `persona.comment`<br>`tactic-share.comment_label`<br>`tactic-upload.comment` |
| en | `Defense Calc` | 3 | `critical-calc.defenseI18n.nav_current`<br>`defense-calc.defenseI18n.nav_current`<br>`home.quick_defense_calc` |
| en | `Export` | 3 | `pull-tracker.io.export.label`<br>`tactic.buttonExport`<br>`tactic-maker.export` |
| en | `Highlight` | 3 | `character.characterDetailSkillHighlight`<br>`critical-calc.defenseTypeMap.하이라이트`<br>`defense-calc.defenseTypeMap.하이라이트` |
| en | `Import` | 3 | `pull-tracker.io.import.label`<br>`tactic.buttonImport`<br>`tactic-maker.import` |
| en | `Like` | 3 | `home.tactic_like_alt`<br>`tactic-share.like_alt`<br>`tactics.like_alt` |
| en | `Login` | 3 | `login.title`<br>`pull-tracker.individual.auth.login`<br>`tactic-upload.login` |
| en | `Logout` | 3 | `pull-tracker.individual.auth.logout`<br>`tactic-upload.logout`<br>`tactics.logout` |
| en | `No results found` | 3 | `guides.noResults`<br>`synergy.noResults`<br>`wonder-weapon.noResults` |
| en | `Nul` | 3 | `astrolabe.adaptLabels.Nullify.text`<br>`home.adapt_nullify`<br>`maps.adaptLabels.Nullify.text` |
| en | `Option` | 3 | `critical-calc.thOption`<br>`critical-calc.defenseI18n.th_option`<br>`defense-calc.defenseI18n.th_option` |
| en | `Pierce` | 3 | `critical-calc.defenseI18n.penetrate_total`<br>`critical-calc.defenseI18n.tab_pierce`<br>`defense-calc.defenseI18n.penetrate_total` |
| en | `Position` | 3 | `character.filterPosition`<br>`persona.filterPosition`<br>`tier.filterPosition` |
| en | `Rarity` | 3 | `material-calc.filterGroupRarity`<br>`persona.filterRarity`<br>`persona.sortRarity` |
| en | `Rpl` | 3 | `astrolabe.adaptLabels.Reflect.text`<br>`home.adapt_reflect`<br>`maps.adaptLabels.Reflect.text` |
| en | `Search...` | 3 | `gallery.searchPlaceholder`<br>`guides.searchPlaceholder`<br>`pull-tracker.manualEditor.search` |
| en | `Select` | 3 | `critical-calc.thSelect`<br>`critical-calc.defenseI18n.th_select`<br>`defense-calc.defenseI18n.th_select` |
| en | `Select Character` | 3 | `material-calc.selectCharacter`<br>`pull-tracker.manualEditor.selectCharacter`<br>`tactic.portalTitleCharacter` |
| en | `Skill 2` | 3 | `character.characterDetailSkill2`<br>`tactic.placeholderSkill2`<br>`tactic-maker.action_skill2` |
| en | `Skill 3` | 3 | `character.characterDetailSkill3`<br>`tactic.placeholderSkill3`<br>`tactic-maker.action_skill3` |
| en | `Unique Skill` | 3 | `persona.uniqueSkill`<br>`tactic.placeholderUniqueSkill`<br>`tactic-maker.action_unique` |
| en | `View Tactic` | 3 | `tactic-share.view_tactic`<br>`tactic-upload.view_tactic`<br>`tactics.view_tactic` |
| jp | `{value}分前` | 3 | `guides.dateMinutesAgo`<br>`home.relative_minutes`<br>`tactics.relative_minutes` |
| jp | `{value}時間前` | 3 | `guides.dateHoursAgo`<br>`home.relative_hours`<br>`tactics.relative_hours` |
| jp | `{value}日前` | 3 | `guides.dateDaysAgo`<br>`home.relative_days`<br>`tactics.relative_days` |
| jp | `固有スキル` | 3 | `persona.uniqueSkill`<br>`tactic.placeholderUniqueSkill`<br>`tactic-maker.uniqueSkill` |
| jp | `無` | 3 | `astrolabe.adaptLabels.Nullify.text`<br>`home.adapt_nullify`<br>`maps.adaptLabels.Nullify.text` |
| jp | `反` | 3 | `astrolabe.adaptLabels.Reflect.text`<br>`home.adapt_reflect`<br>`maps.adaptLabels.Reflect.text` |
| jp | `防御力減少計算機` | 3 | `critical-calc.defenseI18n.page_title`<br>`defense-calc.defenseI18n.page_title`<br>`home.quick_defense_calc` |
| jp | `分類` | 3 | `critical-calc.defenseI18n.th_type`<br>`defense-calc.defenseI18n.th_type`<br>`revelation.filter_type` |
| jp | `備考` | 3 | `critical-calc.thNote`<br>`critical-calc.defenseI18n.th_note`<br>`defense-calc.defenseI18n.th_note` |
| jp | `詳細` | 3 | `material-calc.viewDetails`<br>`persona.acquisitionDetail`<br>`tactic.uiDetails` |
| jp | `意識 {value}` | 3 | `home.tactic_ritual_alt`<br>`tactic-upload.ritual_alt`<br>`tactics.ritual_alt` |
| jp | `前へ` | 3 | `gallery.modalPrevious`<br>`tactic-share.prev_page`<br>`tactics.prev_page` |
| jp | `次へ` | 3 | `gallery.modalNext`<br>`tactic-share.next_page`<br>`tactics.next_page` |
| jp | `合計` | 3 | `critical-calc.defenseI18n.stat_sum`<br>`defense-calc.defenseI18n.stat_sum`<br>`pull-tracker.individual.table.count` |
| jp | `現在` | 3 | `material-calc.current2`<br>`schedule.filterCurrent`<br>`schedule.current` |
| jp | `吸` | 3 | `astrolabe.adaptLabels.Absorb.text`<br>`home.adapt_absorb`<br>`maps.adaptLabels.Absorb.text` |
| jp | `検索...` | 3 | `gallery.searchPlaceholder`<br>`guides.searchPlaceholder`<br>`pull-tracker.manualEditor.search` |
| jp | `いいね` | 3 | `home.tactic_like_alt`<br>`tactic-share.like_alt`<br>`tactics.like_alt` |
| jp | `インポート` | 3 | `pull-tracker.io.import.label`<br>`tactic.buttonImport`<br>`tactic-maker.import` |
| jp | `エクスポート` | 3 | `pull-tracker.io.export.label`<br>`tactic.buttonExport`<br>`tactic-maker.export` |
| jp | `オプション` | 3 | `critical-calc.thOption`<br>`critical-calc.defenseI18n.th_option`<br>`defense-calc.defenseI18n.th_option` |
| jp | `コメント` | 3 | `persona.comment`<br>`tactic-share.comment_label`<br>`tactic-upload.comment` |
| jp | `すべて` | 3 | `gallery.filterAll`<br>`guides.filterAll`<br>`schedule.filterAll` |
| jp | `スポイラー表示` | 3 | `critical-calc.defenseI18n.show_spoiler`<br>`defense-calc.defenseI18n.show_spoiler`<br>`tier.showSpoilers` |
| jp | `ハイライト` | 3 | `character.characterDetailSkillHighlight`<br>`critical-calc.defenseTypeMap.하이라이트`<br>`defense-calc.defenseTypeMap.하이라이트` |
| jp | `ログアウト` | 3 | `pull-tracker.individual.auth.logout`<br>`tactic-upload.logout`<br>`tactics.logout` |
| jp | `ログイン` | 3 | `login.title`<br>`pull-tracker.individual.auth.login`<br>`tactic-upload.login` |
| kr | `{value}분 전` | 3 | `guides.dateMinutesAgo`<br>`home.relative_minutes`<br>`tactics.relative_minutes` |
| kr | `{value}시간 전` | 3 | `guides.dateHoursAgo`<br>`home.relative_hours`<br>`tactics.relative_hours` |
| kr | `{value}일 전` | 3 | `guides.dateDaysAgo`<br>`home.relative_days`<br>`tactics.relative_days` |
| kr | `2세트` | 3 | `revelation.set_effect_2`<br>`schedule.revelationSet2`<br>`tactic-maker.revelationSet2Label` |
| kr | `4세트` | 3 | `revelation.set_effect_4`<br>`schedule.revelationSet4`<br>`tactic-maker.revelationSet4Label` |
| kr | `가져오기` | 3 | `pull-tracker.individual.buttons.start`<br>`pull-tracker.io.import.label`<br>`tactic.buttonImport` |
| kr | `검색...` | 3 | `gallery.searchPlaceholder`<br>`guides.searchPlaceholder`<br>`pull-tracker.manualEditor.search` |
| kr | `계시 합계` | 3 | `critical-calc.defenseI18n.revelation_sum`<br>`defense-calc.defenseI18n.revelation_sum`<br>`tactic-maker.revelationSum` |
| kr | `내` | 3 | `astrolabe.adaptLabels.Resistant.text`<br>`home.adapt_resistant`<br>`maps.adaptLabels.Resistant.text` |
| kr | `내보내기` | 3 | `pull-tracker.io.export.label`<br>`tactic.buttonExport`<br>`tactic-maker.export` |
| kr | `다음` | 3 | `gallery.modalNext`<br>`tactic-share.next_page`<br>`tactics.next_page` |
| kr | `등급` | 3 | `material-calc.filterGroupRarity`<br>`persona.filterGrade`<br>`pull-tracker.manualEditor.grade` |
| kr | `로그아웃` | 3 | `pull-tracker.individual.auth.logout`<br>`tactic-upload.logout`<br>`tactics.logout` |
| kr | `로그인:` | 3 | `pull-tracker.individual.auth.signedIn`<br>`tactic-upload.signed_in_as`<br>`tactics.signed_in_as` |
| kr | `무` | 3 | `astrolabe.adaptLabels.Nullify.text`<br>`home.adapt_nullify`<br>`maps.adaptLabels.Nullify.text` |
| kr | `반` | 3 | `astrolabe.adaptLabels.Reflect.text`<br>`home.adapt_reflect`<br>`maps.adaptLabels.Reflect.text` |
| kr | `분류` | 3 | `critical-calc.defenseI18n.th_type`<br>`defense-calc.defenseI18n.th_type`<br>`revelation.filter_type` |
| kr | `비고` | 3 | `critical-calc.thNote`<br>`critical-calc.defenseI18n.th_note`<br>`defense-calc.defenseI18n.th_note` |
| kr | `스킬 2` | 3 | `character.characterDetailSkill2`<br>`tactic.placeholderSkill2`<br>`tactic-maker.action_skill2` |
| kr | `스킬 3` | 3 | `character.characterDetailSkill3`<br>`tactic.placeholderSkill3`<br>`tactic-maker.action_skill3` |
| kr | `약` | 3 | `astrolabe.adaptLabels.Weak.text`<br>`home.adapt_weak`<br>`maps.adaptLabels.Weak.text` |
| kr | `옵션` | 3 | `critical-calc.thOption`<br>`critical-calc.defenseI18n.th_option`<br>`defense-calc.defenseI18n.th_option` |
| kr | `의식 {value}` | 3 | `home.tactic_ritual_alt`<br>`tactic-upload.ritual_alt`<br>`tactics.ritual_alt` |
| kr | `이전` | 3 | `gallery.modalPrevious`<br>`tactic-share.prev_page`<br>`tactics.prev_page` |
| kr | `좋아요` | 3 | `home.tactic_like_alt`<br>`tactic-share.like_alt`<br>`tactics.like_alt` |
| kr | `캐릭터` | 3 | `home.quick_character`<br>`pull-tracker.individual.overview.section.character`<br>`pull-tracker.manualEditor.character` |
| kr | `캐릭터 선택` | 3 | `material-calc.selectCharacter`<br>`pull-tracker.manualEditor.selectCharacter`<br>`tactic.portalTitleCharacter` |
| kr | `코멘트` | 3 | `persona.comment`<br>`tactic-share.comment_label`<br>`tactic-upload.comment` |
| kr | `택틱 보기` | 3 | `tactic-share.view_tactic`<br>`tactic-upload.view_tactic`<br>`tactics.view_tactic` |
| kr | `합계` | 3 | `critical-calc.defenseI18n.stat_sum`<br>`defense-calc.defenseI18n.stat_sum`<br>`pull-tracker.individual.table.count` |
| kr | `현재` | 3 | `material-calc.current2`<br>`schedule.filterCurrent`<br>`schedule.current` |
| kr | `획득처` | 3 | `persona.sourcesLabel`<br>`persona.acquisitionLabel`<br>`synergy.labelSource` |
| kr | `흡` | 3 | `astrolabe.adaptLabels.Absorb.text`<br>`home.adapt_absorb`<br>`maps.adaptLabels.Absorb.text` |

## 3) Suggested Order

1. Replace nav duplicates first: `nav.home`, `nav.character`, `nav.persona`, `nav.revelations`.
2. Replace action/button duplicates: `common.reset/save/cancel/delete/close/loading/search/filter`.
3. Promote high-frequency missing candidates: `Element/??/??`, `Position/??/??`, `Show Spoilers`, `Name/??/??`, `Target/??/??`.
4. Decide whether `seoOgLocale` (`ko_KR`, `en_US`, `ja_JP`) should be centralized under SEO-only common keys.

## 4) Notes

- This document is generated from automated value-level analysis.
- Proper nouns and domain terms should be reviewed in page context before mass replacement.