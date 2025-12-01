(function () {
    window.characterReview = window.characterReview || {};
    window.characterReview["후카"] = { name_en: "Fuka Yamagishi", name_jp: "山岸 風花", codename: "FUKA",
        review: `
야마기시 후카는 『오라클 전환』을 통해 아군과 교대할 수 있는 고유 능력을 지닌 해명 괴도다.

기존의 NAVI나 ANGE와 다르게 방어력 감소 메커니즘이 존재하지 않아 아군 구성에 유의해야 한다.


**교체 메커니즘 요약**
- 후카는 전투 시작 전 1명의 후보 캐릭터를 지정하고, 『오라클 전환』으로 교체를 수행한다.
- 『오라클 전환』 시, 현재 캐릭터는 잠시 퇴장하고, 후보 캐릭터가 등장하여 1회 행동 후 퇴장한다. 이후 원래 캐릭터가 복귀해 남은 행동을 이어간다.

<br>

**버프 상호작용**
1. 기존 캐릭터가 후보 캐릭터로 교체될 때, **기존 캐릭터가 부여하지 않은 모든 버프는 후보 캐릭터에게 복사**된다.
   - 후보 캐릭터가 자신에게 부여한 버프나, 기존 캐릭터가 자신에게 준 버프는 복사되지 않는다.
2. 반대로, 후보 캐릭터가 퇴장하고 기존 캐릭터로 복귀할 때는 **아무런 버프도 복사되지 않는다.**
3. 후보 캐릭터가 행동을 마치면, 복사된 버프의 지속 턴 수가 1 감소된다.
  - 예시: 원더가 마유미 버프(2턴) + 리벨리온(3턴)을 받고 있을 때 후카가 아야카로 교체
    - 아야카는 마유미 버프만 복사 (리벨리온은 원더가 자신에게 부여한 버프이므로 복사되지 않음)
    - 아야카가 마유미 HL(2턴)을 사용
    - 후카가 원더로 복귀 → 마유미 HL은 복사되지 않음, 원더는 기존의 리벨리온+마유미 버프를 그대로 유지

<br>

**후보 캐릭터 상호작용**
1. 대부분의 패시브 및 특성은 후방에 있는 동안 발동하지 않음 (사망과 유사하게 취급됨).
2. 후보 캐릭터를 대상으로 한 능력도 작동하지 않음.
   - 예: 미츠루가 후방일 때, '냉혈의 칼날'은 아군이 서리 결정 적을 공격해도 발동되지 않음.
   - 예: 카타야마의 방어력 감소 강화도 후방 이동 시 효과가 중단됨.
3. 다만, 후보 캐릭터의 **디버프 상태를 참조하는 능력**은 정상적으로 작동함.
   - 예: 미츠루의 혹한 결정 상태의 적이 받는 크리티컬 효과 증가는 유지됨.`,
        review_en: `
Fuuka is a Thief with the unique ability to swap party members using [Oracle Shift].

Unlike Oracle or Ange, Fuuka provides no Defense down debuffs or pierce rate buffs, so you must be careful with your team composition.

<br>

**Swap Mechanics Summary**
- After selecting Fuuka in the party menu, you can select 1 character not in the party as her [Backup Character] for [Oracle Shift]
- When using [Oracle Shift], the acting [Current Character] become inactive, the [Backup Character] become active and take 1 action. After this action, the [Backup Character] become inactive, and the [Current Character] become active to continue their turn.

<br>

**Buff Interactions**
1. When a [Current Character] is replaced by the [Backup Character], all buffs except those the [Current Character] applied to themselves are copied to the [Backup Character].
    - Self buffs from the [Current Character] and [Backup Character] are not copied.
2. Similarly, when the [Backup Character] become inactive and the [Current Character] become active, no buffs are copied.
3. When the [Backup Character] end their action, decrease the duration of the copied buff by 1 turn.
  - Example: When Wonder received a buff from Turbo (2 turns) + Rebellion (3 turns), and Fuuka swap Wonder with Chord
    - Chord will only copies Turbo's buffs (Rebellion is not copied because it is a self buff on Wonder)
    - Chord uses Turbo HIGHLIGHT (2 turns)
    - Fuuka swaps Wonder back → Turbo HIGHLIGHT is not copied, Wonder has Turbo buff + Rebellion.

<br>

**Backup Character Interactions**
1. Most passives and Talents are not active when the [Backup Character] is inactive. (treated similarly to faint)
2. Effects that require the [Backup Character] active will also not work.
    - Example: When Mitsuru is inactive, [Cruel Edge] will not activate even if allies attack foes with [Frost].
    - Example: Blitz's Defense down buffs will be disabled when she is inactive.
3. However, **debuff effects that are from the [Backup Character] will work**.
    - Example: The critical damage taken debuff from Mitsuru's Awareness 2 
`,
review_jp: `
山岸 風花は『啓示転換』によって味方と交代できる固有能力を持つ解明系怪盗。

従来のNAVIやANGEと異なり、防御力低下のメカニズムが存在しないため、編成には留意が必要。


**交代メカニズムの概要**
- 風花は戦闘開始時に1人の『候補キャラクター』を指定し、『啓示転換』で交代を行う。
- 『啓示転換』時、現在のキャラクターはいったん退場し、『候補キャラクター』が登場して1回行動した後に退場。元のキャラクターが復帰して残りの行動を続ける。

<br>

**バフ相互作用**
1. 既存キャラクター→『候補キャラクター』への交代時、**既存キャラクターが付与していない全てのバフが候補キャラクターに複製**される。
   - 候補キャラクターが自分に付与したバフ、または既存キャラクターが自分に付与したバフは複製されない。
2. 候補キャラクターが退場して既存キャラクターに戻る際は、**いかなるバフも複製されない。**
3. 候補キャラクターが行動を終えると、複製されたバフの残り持続ターンは1減少する。
  - 例: ワンダーが橋本 麻由美のバフ（2ターン）＋リベリオン（3ターン）を所持中に、風花が坂井 綾香へ交代
    - 綾香は麻由美のバフのみ複製（リベリオンはワンダーが自分に付与したため複製されない）
    - 綾香が麻由美のHIGHLIGHT（2ターン）を使用
    - 風花がワンダーに復帰 → 麻由美のHIGHLIGHTは複製されず、ワンダーは元のリベリオン＋麻由美バフを維持

<br>

**『候補キャラクター』の相互作用**
1. ほとんどのパッシブおよび特性は控えにいる間は発動しない（戦闘不能と同様に扱う）。
2. 候補キャラクターを対象とする能力も機能しない。
   - 例: 桐条 美鶴が控えのとき、『冷血の刃』は味方が『霜結』の敵を攻撃しても発動しない。
   - 例: 片山 久未の防御力低下強化も、控えに移動すると効果が中断される。
3. ただし、候補キャラクターの**デバフ状態を参照する能力**は正常に機能する。
   - 例: 桐条 美鶴の『寒霜結』状態の敵が受けるクリティカル効果上昇は維持される。`,
        dump:``,
        pros: [""],
        pros_en: [""],
        pros_jp: [""],
        cons: [""],
        cons_en: [""],
        cons_jp: [""],
    };
})();


