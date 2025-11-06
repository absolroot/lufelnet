const characterReview = {
    "원더": { name_en: "Wonder", name_jp: "主人公", codename: "WONDER",
        review: ``
    },
"후카": { name_en: "Fuka Yamagishi", name_jp: "山岸 風花", codename: "FUKA",
        review: `
야마기시 후카는 『계시 전환』을 통해 아군과 교대할 수 있는 고유 능력을 지닌 해명 괴도다.

기존의 NAVI나 ANGE와 다르게 방어력 감소 메커니즘이 존재하지 않아 아군 구성에 유의해야 한다.


**교체 메커니즘 요약**
- 후카는 전투 시작 시 1명의 후보 캐릭터를 지정하고, 『계시 전환』으로 교체를 수행한다.
- 『계시 전환』 시, 현재 캐릭터는 잠시 퇴장하고, 후보 캐릭터가 등장하여 1회 행동 후 퇴장한다. 이후 원래 캐릭터가 복귀해 남은 행동을 이어간다.

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
   - 예: 미츠루가 후방일 때, '냉혈의 칼날'은 아군이 서리 결속 적을 공격해도 발동되지 않음.
   - 예: 카타야마의 방어력 감소 강화도 후방 이동 시 효과가 중단됨.
3. 다만, 후보 캐릭터의 **디버프 상태를 참조하는 능력**은 정상적으로 작동함.
   - 예: 고로의 탐정 파트너는 후방 상태에서도 디버프 기반 피해 기록을 지속함.`,
        review_en: `Page will be filled after the character is released on the Korean server.`,
        review_jp: `韓国サーバーでキャラクターがリリースされた後、ページが埋まります。`,
        dump:``
    },
    
"미츠루": { name_en: "Kirijo Mitsuru", name_jp: "桐条 美鶴", codename: "MITSURU",
        review: `
포지션은 '반항'이지만 **'서포터'**의 역할이 강한 P3 콜라보 캐릭터로 기존에 지배 포지션이었지만 아군의 서포트를 담당했던 아케치의 개선된 반항 버전이다.

- **스킬2**로 방어력 감소와 받는 대미지 증가를 적 1명에게 영구 지속시키고, **스킬1**로 **『서리 결속』3스택**과 함께 방어력 감소를 부여한다.

- **스킬3**은 일정 수치(3%)의 해명 괴도의 속성 증가를 포함하고 있으며, 높은 수치의 빙결 속성 대미지를 준다. 

- **핵심은 테우르기아**로 높은 수치의 빙결 속성 대미지와 함께 **2턴** 동안 아군이 페르소나 스킬을 사용해 피해를 주면 해당 **아군의 속성과 스테이터스를 그대로 복제한 추가 피해**를 미츠루가 준다.\n**스킬 계수 증가 버프**로 이해하는 것이 편하다. 해당 피해 계수는 『서리 결속』의 중첩 수 × 20.0%/22.0%/22.4%/24.4%다.

<br>

**『서리 결속』의 중첩 수**는 **의식0/1/6**에 각각 **5/7/8**개를 유지할 수 있다.

의식6에는 추가 피해 대미지가 2배가 한 번 더 더해지므로 아군이 공격할 때 **스킬 계수**에 **110%/154%/585.6%**를 더하는 형태로 의식 6의 계수 격차가 현저히 높다. 

반항 괴도가 450%의 스킬 계수로 공격한다고 기준 삼을 경우 24.4%/34.2%/130.1%의 증가 효율을 얻는다. 

다만 동료의 스탯의 복사 범위가 명확하지 않아 해당 동료가 보유한 독립 버킷 버프의 적용 유무는 상황에 따라 다를 수 있다.

<table border="1">
  <thead>
    <tr>
      <th>의식 레벨</th>
      <th>S1 S2 방어력 감소</th>
      <th>P2 받는 대미지 증가</th>
      <th>스킬 계수 증가</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>의식0 (LV10+5) - 5스택</td>
      <td>107.6%</td>
      <td>24.0%</td>
      <td>110.0%</td>
    </tr>
    <tr>
      <td>의식1 (LV10+5) - 7스택</td>
      <td>133.4%</td>
      <td>33.6%</td>
      <td>154.0%</td>
    </tr>
    <tr>
      <td>의식6 (LV13+5) - 8스택</td>
      <td>154.5%</td>
      <td>38.4%</td>
      <td>585.6%</td>
    </tr>
  </tbody>
</table>

**방어력 감소 수치가 상당히 높은 편**으로 남은 한 자리를 우월 괴도로 채울 수 있다.

---
계시 선택지가 상당히 자유로운 편이다. 상황에 맞게 선택하면 된다. 

- 미츠루의 대미지와 아군 버프의 밸런스를 고려할 경우에는 [진정성]+[고집]

- 미츠루의 대미지에 집중할 경우에는 [결심]+[신중]

- 아군의 버프에 집중할 경우에는 [창조]+[화해]

- (옵션) 방어력 감소 수치가 부족할 경우에는 [주권]+[여정] 

        `,
review_en: `Translation in progress...
`,
review_jp: `翻訳中...`,
dump:``
    },


"YUI·스텔라": { name_en: "YUI·PRISM", name_jp: "YUI·PRISM", codename: "YUI·PRISM",
        review: `
**총공격 수치**를 메인 딜 계수로서 활용하는 핵열 단일 딜러다.

설명은 상당히 복잡하지만 실제로 운영 방식은 단순한 편으로 설명을 신경쓰지 않고 사이클 순서대로 진행하면 무리없게 구성됐다.

- 매 턴 시작 시 자동으로 기사 1명 & 스킬2(쿨다운 1T) 사용 시 기사 1명을 소환한다.
  - **가지 → 감자 → 버섯 → 아스파라거스**

- 스킬3 사용 시 감자 기사가 2명 이상일 경우 추가 감자 기사를 소모하여 대미지가 상승한다. (최소 1기의 감자 기사는 남는다.)

- 『원동력』은 7스택이 쌓이면 패시브가 발동해 3스킬을 자동 사용한다.

- 『베지나이츠·출격』은 추가 효과 대미지로 적의 **다운 수치를 감소** 시킨다는 특징을 지니고 있다.

`,
review_en: `
Although the explanation may seem complicated, the actual gameplay cycle is simple. If you just follow the rotation order without worrying too much about the details, it works smoothly.

- At the start of each turn, 1 Knight is automatically summoned, and using Skill 2 (1T cooldown) also summons 1 Knight.
  - Eggplant → Potato → Mushroom → Asparagus

- When using Skill 3, if you have 2 or more Potato Knights, additional Potato Knights will be consumed to increase damage. (At least 1 Potato Knight will remain.)

- 『Mobilize Energy』: When 7 stacks are accumulated, the passive is triggered, automatically casting Skill 3.
`,
review_jp: `
説明は複雑に見えるかもしれませんが、実際の運用はシンプルです。細かい説明を気にせず、サイクル順に進めれば問題なく構成されています。

- 各ターン開始時に自動で騎士を1体召喚し、スキル2（クールダウン1T）を使用するとさらに騎士を1体召喚します。
  - ナス → ジャガイモ → キノコ → アスパラガス

- スキル3使用時、ジャガイモ騎士が2体以上いる場合、追加のジャガイモ騎士を消費してダメージが上昇します。（最低でもジャガイモ騎士1体は残ります。）

- 『動力』：7スタックが溜まるとパッシブが発動し、自動的にスキル3を使用します。
`
    },
"카타야마":{ name_en: "Kumi Katayama", name_jp: "片山 久未", codename: "BLITZ",
      review: `
다운 수치를 크게 깎아 **다운**을 유도하고, 다운된 적이 받는 대미지를 늘리는 디버퍼.

1) **1스킬**로 적에게 [방어력 감소]와 [받는 대미지 증가]를 2턴 부여하고, 3스킬을 해금한다.

2) **3스킬**은 **다운 수치 5 감소** + 1턴 동안 **『다운 특수 공격』**과 [받는 대미지 증가]를 강화하며, **다음 2스킬을 강화**하는 흐름이다.

3) **강화된 2스킬**로 **다운 수치 4 감소** + 1스킬/3스킬과 동일한 디버프를 1턴 부여한다. 상황에 따라 2스킬 대신 1스킬을 연계해도 된다.

<br>

다운을 빠르게 만들고 **독립 버킷인『다운 특수 공격』**을 강화하지만, **TURBO(마유미)**와 많은 부분에서 비교된다.

- **광역 보스**는 기본 **다운 수치가 5**라서 **의식1** 미만이면 2스킬의 다운이 확정되지 않는다. **단일 보스**는 다운치가 더 높아 효용이 더 낮다.
- 카타야마는 자체 버프(패시브/스킬)가 여럿이지만, **적 턴 종료 시 다수 디버프가 사라져** 정작 본인이 그 효과를 활용하기 어렵다.
- 방어력 감소가 HL에 묶여 **HL 강제**가 발생한다. 빠른 효율을 위해 2턴에 HL을 쓰면, 일반적인 2·6턴 2회 HL 기회를 포기하게 된다.
- 전용/4성 무기는 적을 다운시 발동한다. 의식1 미만이면 효율이 급감하므로 **3성 무기**가 대안이 될 수 있다.
      `,
      review_en: `
A debuffer that sharply reduces **Down Value** to force a **Down**, then makes the target **take more damage** while Down.

1) **Skill 1** applies [DEF Down] and [DMG Taken Up] for 2 turns and unlocks Skill 3.

2) **Skill 3** **reduces Down Value by 5**, strengthens **[Downed Damage Taken]** and [DMG Taken Up] for 1 turn, and **empowers your next Skill 2**.

3) The **empowered Skill 2** **reduces Down Value by 4** and applies the same debuffs as Skills 1/3 for 1 turn. Depending on the situation, you can chain back into Skill 1 instead of using Skill 2.

<br>

It enables fast Downs and buffs the **independent bucket: [Downed Damage Taken]**, at release it’s often compared to **TURBO (Mayumi)**.

- **AoE bosses** typically start with **5 Down Value**, so without **A1**, Skill 2 won’t guarantee a Down. **Single-target bosses** often have even higher Down Value, lowering effectiveness further.
- Katayama has multiple self-buffs (passives/skills), but **most of her applied debuffs expire at the end of the enemy’s turn**, so **she can’t fully exploit them herself**.
- Since DEF Down is tied to HL, you’re effectively **forced to use HL**. To see results early you’d use HL on turn 2, which sacrifices the usual HL windows (turns 2 & 6).
- Her 5★/4★ weapons **trigger only when she causes a Down**. Below A1 the efficiency drops sharply, so a **3★ weapon** can be a viable alternative.
      `,
      review_jp: `
**ダウン値**を大きく削って**ダウン**を取り、ダウン中の敵が**より多くのダメージ**を受けるようにするデバッファーです。

1) **スキル1**で[防御力低下]と[被ダメージ増加]を2ターン付与し、スキル3を解放します。

2) **スキル3**は**ダウン値を5削減**し、1ターンのあいだ**『ダウン特効』**と[被ダメージ増加]を強化、さらに**次のスキル2を強化**します。

3) **強化されたスキル2**で**ダウン値を4削減**し、スキル1/3と同じデバフを1ターン付与します。状況次第では、スキル2ではなくスキル1へつなぐ選択も可。

<br>

素早くダウンを取り、**独立バケットの『ダウン特効』**を強化できますが, **TURBO（マユミ）**とよく比較されます。

- **全体ボス**は初期ダウン値が**5**のため、**意識1**（A1）未満ではスキル2のダウンが確定しません。**単体ボス**はさらにダウン値が高く、効果が薄れます。
- 久未は自己強化（パッシブ/スキル）を複数持ちますが、**敵ターンの終了で大半のデバフが切れる**ため、**本人が十分に活かしにくい**側面があります。
- 防御力低下がHLに紐づくため、実質的に**HLを強要**されます。早期に効果を出すには2ターン目にHLを使う必要があり、その場合は通常のHL機会（2・6ターン）を手放すことになります。
- 専用/4★武器は**ダウンを取ったときのみ発動**。**意識1未満**では効率が大きく下がるため、**★3武器**が代替案になり得ます。
      `
    },
"미유·여름": { name_en: "Miyu Sahara Summer", name_jp: "佐原 海夕 夏", codename: "PUPPET·Summer",
        review: `
바다의 영역 속에서 아군의 턴 종료마다 **공격할 때마다 강해지는 추가 효과**로 적을 지속적으로 공격한다.

추가 효과를 반복할 수록 SP 소모량이 늘어나기 때문에 **스킬2를 통해 강력한 대미지를 주고 중첩을 초기화하는 구조**를 지니고 있다.

**아군의 턴 시작 시에 SP를 15 회복**하며 **자신의 턴 시작에 SP를 10 회복**한다. 두 수치는 SP회복 수치가 적용되며 이를 활용해 최대한 많은 추가 효과를 발동시키는 것이 중요하다. 

<br>

SP회복에 큰 영향을 받는 캐릭터지만 **기본 188.5%** SP회복과 계시 카드 진의 **SP 회복 주 옵션 90.4%**, 마이팰리스 5%만 추가하더라도 **283.9%의 SP 회복**을 쉽게 확보할 수 있다.

의식이 6에 도달할 경우 추가 SP를 250을 주므로, 별도의 SP회복이 필요 없어진다. (SP 280%까지는 패시브에 의해 변환되므로 공격력 손해가 없다.)

추천 운영 사이클에 따른 필요 SP 회복량은 다음과 같다. 마나카(ANGE)의 추가 턴은 고려되지 않은 횟수이다.

- 후타바 : 3 › 1 › 2 › 3 › 1 › 2  

- 마나카 : 3 › 1 › 1 › 1 › 1 › 2

<table>
  <tr>
    <th>의식</th>
    <th>파티원</th>
    <th>SP 회복 필요량</th>
    <th>+ 리코·매화</th>
    <th>추가 효과 횟수 (6턴)</th>
  </tr>
  <tr>
    <td rowspan="6">0</td>
    <td>후타바</td>
    <td>266.7%</td>
    <td>260.1%</td>
    <td>12</td>
  </tr>
  <tr>
    <td>후타바</td>
    <td>333.4%</td>
    <td>330.1%</td>
    <td>14</td>
  </tr>
  <tr style="color:rgb(255, 240, 131);">
    <td><b>후타바 마유미</b></td>
    <td><b>290.1%</b></td>
    <td><b>286.7%</b></td>
    <td><b>14</b></td>
  </tr>
  <tr>
    <td>마나카</td>
    <td>286.7%</td>
    <td>-</td>
    <td>14</td>
  </tr>
  <tr>
    <td>마나카</td>
    <td>337.6%</td>
    <td>-</td>
    <td>15</td>
  </tr>
  <tr style="color:rgb(255, 240, 131);">
    <td><b>마나카 마유미</b></td>
    <td><b>290.1%</b></td>
    <td>-</td>
    <td><b>15</b></td>
  </tr>

  <tr>
    <td rowspan="7">1</td>
    <td>후타바</td>
    <td>240.1%</td>
    <td>235.1%</td>
    <td>14</td>
  </tr>
  <tr>
    <td>후타바</td>
    <td>300.1%</td>
    <td>293.4%</td>
    <td>16</td>
  </tr>
  <tr style="color:rgb(255, 240, 131);">
    <td><b>후타바 마유미</b></td>
    <td><b>293.4%</b></td>
    <td><b>280.1%</b></td>
    <td><b>16</b></td>
  </tr>
  <tr>
    <td>마나카</td>
    <td>265.1%</td>
    <td>-</td>
    <td>16</td>
  </tr>
  <tr>
    <td>마나카</td>
    <td>300.1%</td>
    <td>-</td>
    <td>17</td>
  </tr>
  <tr>
    <td>마나카 마유미</td>
    <td>293.4%</td>
    <td>-</td>
    <td>18</td>
  </tr>
  <tr style="color:rgb(255, 240, 131);">
    <td><b>마나카 마유미</b></td>
    <td><b>320.1%</b></td>
    <td>-</td>
    <td><b>19</b></td>
  </tr>

  <tr style="color:rgb(255, 240, 131);">
    <td rowspan="2">6</td>
    <td>후타바</td>
    <td>188.5%</td>
    <td>-</td>
    <td>30</td>
  </tr>
  <tr style="color:rgb(255, 240, 131);">
    <td>마나카</td>
    <td>188.5%</td>
    <td>-</td>
    <td>30</td>
  </tr>
</table>

---

- 추가효과 중첩 당 5% 대미지 증가 계산 방식 : 스킬 계수 × (100% + 5% × 중첩 개수)

- 스킬2 중첩 당 대미지 증가 계산 방식 : 스킬 계수 × (100% + 10% × 중첩 개수)`,
review_en: `
Within [Sea’s Domain], the character continuously attacks enemies with a **Follow-up that grows stronger with each attack** at the end of each ally’s turn.  

Since the SP cost increases the more the Follow-up is repeated, the kit is designed to **deal heavy damage with Skill 2 and reset the stacks**.  

**Recovers SP at the start of an ally’s turn**, and it is important to use the SP as much as possible to trigger as many additional effects as possible.

<br>

Although greatly influenced by SP recovery, the character can easily reach **283.9% SP recovery** even with just the base **188.5%** SP recovery, the **SP Recovery main stat of Revelation Card Planet (90.4%)**, and My Palace’s 5%.  

Recommended SP recovery requirements based on the suggested operation cycle are as follows. Extra turns are not included in the count.  

- NAVI : 3 › 1 › 2 › 3 › 1 › 2  
- ANGE : 3 › 1 › 1 › 1 › 1 › 2  

<table>
  <tr>
    <th>Awareness</th>
    <th>Party Member</th>
    <th>Required SP Recovery</th>
    <th>+ RIKO 5★</th>
    <th>Follow-up Count (6 turns)</th>
  </tr>
  <tr>
    <td rowspan="6">0</td>
    <td>NAVI</td>
    <td>266.7%</td>
    <td>260.1%</td>
    <td>12</td>
  </tr>
  <tr>
    <td>NAVI</td>
    <td>333.4%</td>
    <td>330.1%</td>
    <td>14</td>
  </tr>
  <tr style="color:rgb(255, 240, 131);">
    <td><b>NAVI TURBO</b></td>
    <td><b>290.1%</b></td>
    <td><b>286.7%</b></td>
    <td><b>14</b></td>
  </tr>
  <tr>
    <td>ANGE</td>
    <td>286.7%</td>
    <td>-</td>
    <td>14</td>
  </tr>
  <tr>
    <td>ANGE</td>
    <td>337.6%</td>
    <td>-</td>
    <td>15</td>
  </tr>
  <tr style="color:rgb(255, 240, 131);">
    <td><b>ANGE TURBO</b></td>
    <td><b>290.1%</b></td>
    <td>-</td>
    <td><b>15</b></td>
  </tr>

  <tr>
    <td rowspan="7">1</td>
    <td>NAVI</td>
    <td>240.1%</td>
    <td>235.1%</td>
    <td>14</td>
  </tr>
  <tr>
    <td>NAVI</td>
    <td>300.1%</td>
    <td>293.4%</td>
    <td>16</td>
  </tr>
  <tr style="color:rgb(255, 240, 131);">
    <td><b>NAVI TURBO</b></td>
    <td><b>293.4%</b></td>
    <td><b>280.1%</b></td>
    <td><b>16</b></td>
  </tr>
  <tr>
    <td>ANGE</td>
    <td>265.1%</td>
    <td>-</td>
    <td>16</td>
  </tr>
  <tr>
    <td>ANGE</td>
    <td>300.1%</td>
    <td>-</td>
    <td>17</td>
  </tr>
  <tr>
    <td>ANGE TURBO</td>
    <td>293.4%</td>
    <td>-</td>
    <td>18</td>
  </tr>
  <tr style="color:rgb(255, 240, 131);">
    <td><b>ANGE TURBO</b></td>
    <td><b>320.1%</b></td>
    <td>-</td>
    <td><b>19</b></td>
  </tr>

  <tr>
    <td rowspan="2">6</td>
    <td>NAVI</td>
    <td>188.5%</td>
    <td>-</td>
    <td>30</td>
  </tr>
  <tr>
    <td>ANGE</td>
    <td>188.5%</td>
    <td>-</td>
    <td>30</td>
  </tr>
</table>

---

- Follow-up stack DMG increase calculation: Skill coefficient × (100% + 5% × stack count)  
- Skill 2 stack DMG increase calculation: Skill coefficient × (100% + 10% × stack count)  `,
review_jp: `
『海の領域』の中で、味方ターン終了時に**攻撃するたびに強化される意識奏功**で敵を継続的に攻撃する。  

意識奏功を繰り返すほどSP消費が増えるため、**スキル2で強力なダメージを与えてスタックをリセットする構造**を持っている。  

**味方ターン開始時にSPを回復**し、これを活用して最大限の意識奏功を発動させることが重要です。

<br>

SP回復の影響を大きく受ける怪盗だが、**基礎188.5%**のSP回復に加え、啓示カード「プラネット」の**SP回復メイン効果90.4%**、マイパレスの5%だけでも、**283.9%のSP回復**を容易に確保できる。  

推奨運用サイクルに基づく必要SP回復量は以下の通りです。追加ターンは回数に含まれていません。  

- NAVI : 3 › 1 › 2 › 3 › 1 › 2  
- ANGE : 3 › 1 › 1 › 1 › 1 › 2  

<table>
  <tr>
    <th>意識</th>
    <th>パーティーメンバー</th>
    <th>必要SP回復量</th>
    <th>+ 多祢村 5★</th>
    <th>追加効果回数 (6ターン)</th>
  </tr>
  <tr>
    <td rowspan="6">0</td>
    <td>NAVI</td>
    <td>266.7%</td>
    <td>260.1%</td>
    <td>12</td>
  </tr>
  <tr>
    <td>NAVI</td>
    <td>333.4%</td>
    <td>330.1%</td>
    <td>14</td>
  </tr>
  <tr style="color:rgb(255, 240, 131);">
    <td><b>NAVI TURBO</b></td>
    <td><b>290.1%</b></td>
    <td><b>286.7%</b></td>
    <td><b>14</b></td>
  </tr>
  <tr>
    <td>ANGE</td>
    <td>286.7%</td>
    <td>-</td>
    <td>14</td>
  </tr>
  <tr>
    <td>ANGE</td>
    <td>337.6%</td>
    <td>-</td>
    <td>15</td>
  </tr>
  <tr style="color:rgb(255, 240, 131);">
    <td><b>ANGE TURBO</b></td>
    <td><b>290.1%</b></td>
    <td>-</td>
    <td><b>15</b></td>
  </tr>

  <tr>
    <td rowspan="7">1</td>
    <td>NAVI</td>
    <td>240.1%</td>
    <td>235.1%</td>
    <td>14</td>
  </tr>
  <tr>
    <td>NAVI</td>
    <td>300.1%</td>
    <td>293.4%</td>
    <td>16</td>
  </tr>
  <tr style="color:rgb(255, 240, 131);">
    <td><b>NAVI TURBO</b></td>
    <td><b>293.4%</b></td>
    <td><b>280.1%</b></td>
    <td><b>16</b></td>
  </tr>
  <tr>
    <td>ANGE</td>
    <td>265.1%</td>
    <td>-</td>
    <td>16</td>
  </tr>
  <tr>
    <td>ANGE</td>
    <td>300.1%</td>
    <td>-</td>
    <td>17</td>
  </tr>
  <tr>
    <td>ANGE TURBO</td>
    <td>293.4%</td>
    <td>-</td>
    <td>18</td>
  </tr>
  <tr style="color:rgb(255, 240, 131);">
    <td><b>ANGE TURBO</b></td>
    <td><b>320.1%</b></td>
    <td>-</td>
    <td><b>19</b></td>
  </tr>

  <tr>
    <td rowspan="2">6</td>
    <td>NAVI</td>
    <td>188.5%</td>
    <td>-</td>
    <td>30</td>
  </tr>
  <tr>
    <td>ANGE</td>
    <td>188.5%</td>
    <td>-</td>
    <td>30</td>
  </tr>
</table>

---

- 意識奏功スタックごとのダメージ増加計算式：スキル係数 × (100% + 5% × スタック数)  
- スキル2スタックごとのダメージ増加計算式：スキル係数 × (100% + 10% × スタック数)  `
    },
"미나미·여름": { name_en: "Minami Miyashita Summer", name_jp: "宮下 美波 夏", codename: "MARIAN·Summer",
        review: `
대미지를 높이는 수치에 대한 거의 모든 버프를 보유하고 있고 수치 또한 높은 편으로 **모든 주력 딜러를 보조 가능**한 서포터.

첫 3가지의 약품은 무제한으로 사용 할 수 있고, 나머지 **아이템은 구매해야 하지만 모두 독립적인 대미지 버킷으로 계산**된다. 따라서 **약품 효과 증가**의 가치가 높다.

스킬3을 사용한 후 자신의 턴에 버프를 소모해 행동을 소모하지 않고 아이템을 사용할 수 있고, 해당 버프를 통해 사용된 아이템은 지속시간이 1턴 늘어난다.

<br>


**아이템 목록**
- 1턴 동안 동료 1명의 공격력을 30% 증가 (무제한)
- 1턴 동안 동료 1명의 방어력을 45% 증가 (무제한)
- 1턴 동안 동료 1명의 주는 대미지를 25% 증가 (무제한)
- 1턴 동안 동료 1명의 지속 대미지 효과가 10% 증가 
- 1턴 동안 동료 1명의 추가 효과 대미지 증폭이 10% 증가 
- 1턴 동안 동료 1명의 ONE MORE / 총공격 대미지 증폭이 10% 증가
- 1턴 동안 동료 1명의 HIGHLIHGT / 테우르기아 대미지 증폭이 10% 증가
- 1턴 동안 동료 1명의 스킬 마스터가 600 증가
`,
        review_en: 
`This supporter holds nearly all buffs that increase damage values and their magnitudes are high, making them **capable of supporting any primary damage dealer**.

The first three drugs can be used without limit, while the remaining **items must be purchased, but are each calculated in separate damage buckets**. Therefore, the value of **boosting drug effects** is high.

After using Skill 3, the user can consume a buff during their own turn to use an item without consuming an action, and the item used through this buff has its duration extended by 1 turn.

<br>

**Item List**
- Increases 1 ally's ATK by 30% for 1 turn (unlimited)
- Increases 1 ally's DEF by 45% for 1 turn (unlimited)
- Increases 1 ally's damage dealt by 25% for 1 turn (unlimited)
- Increases 1 ally's DoT effect by 10% for 1 turn
- Increases 1 ally's Additional Effect DMG by 10% for 1 turn
- Increases 1 ally's ONE MORE / All-Out Attack DMG by 10% for 1 turn
- Increases 1 ally's HIGHLIGHT / Theurgy DMG by 10% for 1 turn
- Increases 1 ally's Skill Mastery by 600 for 1 turn
`,
        review_jp: 
`ダメージを高めるあらゆるバフを所持しており、その数値も高いため、**すべての主力アタッカーを支援可能**なサポーターです。

最初の3つの薬品は無制限に使用でき、それ以外の**アイテムは購入が必要ですが、すべて独立したダメージバケットとして計算**されます。そのため、**薬品効果アップ**の価値が高くなります。

スキル3使用後、自身のターンにバフを消費することで行動を消費せずにアイテムを使用でき、そのバフを通じて使用したアイテムの持続時間は1ターン延長されます。

<br>

**アイテム一覧**
- 味方単体の攻撃力を1ターンの間30%上昇（無制限）
- 味方単体の防御力を1ターンの間45%上昇（無制限）
- 味方単体の与ダメージを1ターンの間25%上昇（無制限）
- 味方単体の継続ダメージ効果を1ターンの間10%上昇
- 味方単体の追加効果ダメージを1ターンの間10%上昇
- 味方単体のONE MORE／総攻撃ダメージを1ターンの間10%上昇
- 味方単体のHIGHLIGHT／テウルギアダメージを1ターンの間10%上昇
- 味方単体のスキルマスターを1ターンの間600上昇
`
    },
"이치고": { name_en: "Ichigo Shikano", name_jp: "鹿野 苺", codename: "BERRY",
        review: `
주원 속성 지속 대미지『원념』중첩을 적에게 부여하는 강력한 단일 딜러.

**스킬1과 스킬2를 통해 『원념』을 적에게 부여**하고, 최대 중첩을 완성 한 후 **스킬3으로 『원념』의 지속시간을 갱신하고 강력한 대미지**를 준다.

그리고 **HIGHLIGHT는 중첩된 『원념』을 결산**하고, **『원념』지속 대미지가 크리티컬이 가능**하도록 바뀐다.

HIGHLIGHT와 스킬1에 영향을 받는 『집착』중첩은 전체적으로 대미지를 올려주는 자체 버프를 획득한다.

---

이치고는 정말 강력하지만 딜링 메커니즘은 역대 캐릭터 중 가장 복잡한 편이다.

『원념』이 대미지를 주는 방식은 크게 2가지로, **적이 턴을 끝낼 때 받는 대미지**와 **HL을 통해 강제로 지속 대미지**를 계산할 때가 다르다.

- 각 『원념』은 적에게 부여할 때의 이치고의 버프 상태를 기억(스냅샷)하며, **3스킬을 통해 갱신할 때 해당 시점의 이치고 버프**로 덮어씌워진다.

- 크리티컬은 별도로 각 **지속 대미지 중첩이 계산되는 시점의 이치고의 크리티컬 확률과 효과**를 따라간다. 
이 시점에 이치고의 크리티컬 확률이 100% 보다 낮아 크리티컬이 발동되지 않을 경우 『안정 영역』 메커니즘이 발동되지 않는 버그가 있다.

- 적이 턴을 끝낼 때 받는 지속대미지 결산의 경우 이치고의 관통 버프가 적용되지 않아, 방어력 감소 효과가 다른 캐릭터들보다 유의미하다.

---

아래는 이치고의 버프 상태가 적용되는 버프 테이블이다.

| -                         | 공격력 / 대미지보너스 | 크리티컬 확률 / 효과         | 방어력 감소 | 관통 |
|---------------------------|----------------------|-----------------------------|-------------|------|
| 1/2/3스킬                 | O                    | O                           | O           | O    |
| 원념 부여/갱신             | O                    | -                           | O           | -    |
| 원념×2 결산 - HL          | -                    | O (결산 시점 기준)          | -           | -    |
| 지속대미지 결산 - HL      | -                    | O (결산 시점 기준)          | -           | -    |
| 원념 결산 - 턴 종료        | -                    | O (결산 시점 기준)          | -           | -    |
| HIGHLIGHT 기본            | O                    | -                           | O           | O    |

※ 현재 HL의 관통 적용 여부가 확인되지 않았다.

<br>

**지속 대미지 증가**라는 버프가 기존 대미지 증가와는 다르게 별도의 버킷으로 계산된다.

참고로 이치고가 나타나기 전에 출시됐던 '년수'의 지속 대미지 증가는 일반적인 대미지 증가 버킷으로 계산된다.

`,
review_en: `
A powerful single-target DPS that applies stacks of the Curse-element DoT [Resentment] to enemies.  

**Applies [Resentment] to enemies through S1 and S2**, then after reaching maximum stacks, **refreshes the duration with S3 and deals heavy damage**.  

In addition, **HIGHLIGHT settles the stacked [Resentment]** and allows **[Resentment]’s DoT to crit**.  

The [Obsessive Love] stacks affected by HIGHLIGHT and S1 grant a self-buff that increases overall damage.  

---

Ichigo is extremely powerful, but her damage-dealing mechanism is the most complex among all characters to date.  

[Resentment] deals damage in two main ways: **damage dealt at the end of the enemy’s turn** and **forced DoT calculation via HL**.  

- Each [Resentment] stack snapshots Ichigo’s buff state at the time of application, and **when refreshed via S3, it overwrites with Ichigo’s buffs** at that moment.  

- Criticals are calculated separately, based on **Ichigo’s Critical Rate and Critical Damage at the time each DoT stack is calculated**.  
  If Ichigo’s Critical Rate is below 100% at this point and a crit does not occur, the Stable Domain mechanic will not activate due to a bug.  

- For end-of-turn DoT settlement, Ichigo’s pierce buffs do not apply, making Defense Reduction effects more significant compared to other characters.  

---

Below is the buff table showing which of Ichigo’s buffs apply:  

| -                         | ATK / ATK Mult      | Crit Rate / Crit Mult | DEF Reduction | Pierce |
|---------------------------|----------------------|------------------------------|---------------|--------|
| S1/S2/S3                  | O                    | O                            | O             | O      |
| Resentment Application/Refresh| O                    | -                            | O             | -      |
| Resentment×2 Settlement - HL  | -                    | O (based on settlement time) | -             | -      |
| DoT Settlement - HL       | -                    | O (based on settlement time) | -             | -      |
| Resentment Settlement - Turn End | -                 | O (based on settlement time) | -             | -      |
| HIGHLIGHT Base            | O                    | -                            | O             | O      |  

※ It is currently unclear whether HL is penetrable.

<br>

The **DoT Damage Increase** buff is calculated in a separate bucket from standard damage increases.  

For reference, Nian’s DoT Damage Increase, released before Ichigo, is calculated in the standard damage increase bucket.   
`,
review_jp: `
単体対象に呪怨属性の持続ダメージ[怨念]スタックを付与する強力なアタッカー。  

**S1とS2で敵に[怨念]を付与**し、最大スタックに到達した後、**S3で持続時間を更新しつつ強力なダメージを与える**。  

さらに、**HIGHLIGHTは蓄積された[怨念]を精算し、[怨念]の持続ダメージがクリティカル可能になる**。  

HIGHLIGHTおよびS1の影響を受ける[執着]スタックは、全体的なダメージを上昇させる自己バフを付与する。  

---

苺は非常に強力だが、ダメージメカニズムはこれまでの怪盗の中で最も複雑である。  

[怨念]がダメージを与える方法は主に2つあり、**敵ターン終了時に発生するダメージ**と、**HLによる強制的な持続ダメージ精算**である。  

- 各[怨念]は付与時の苺のバフ状態をスナップショットし、**S3で更新する際、その時点の苺のバフで上書きされる**。  

- クリティカルは別計算で、**各持続ダメージスタックが計算される時点の苺のクリティカル率とCRT倍率**に従う。  
  この時点で苺のクリティカル率が100%未満でクリティカルが発生しない場合、Stable Domainのメカニズムが発動しない不具合がある。  

- ターン終了時の持続ダメージ精算では苺の貫通バフが適用されないため、防御力減少効果が他の怪盗に比べて有意義になる。  

---

以下は苺のバフ状態が適用されるバフテーブルである：  

| -                         | 攻撃力 / 攻撃倍率+ | クリティカル率 / 効果       | 防御力減少 | 貫通 |
|---------------------------|--------------------------|-----------------------------|------------|------|
| S1/S2/S3                  | O                        | O                           | O          | O    |
| 怨念付与/更新             | O                        | -                           | O          | -    |
| 怨念×2精算 - HL           | -                        | O (精算時点基準)            | -          | -    |
| 持続ダメージ精算 - HL     | -                        | O (精算時点基準)            | -          | -    |
| 怨念精算 - ターン終了     | -                        | O (精算時点基準)            | -          | -    |
| HIGHLIGHT 基本            | O                        | -                           | O          | O    |  

※ 現在、HLの貫通適用の有無は確認されていない。

<br>

**持続ダメージ増加**というバフは、既存のダメージ増加とは異なり、別のバケットで計算される。  

参考までに、苺登場前に実装された年獣の持続ダメージ増加は、通常のダメージ増加バケットで計算される。`
    },
    "사나다": { name_en: "Akihiko Sanada", name_jp: "真田 明彦", codename: "SANADA",
        review: ``
    },
"유카리": { name_en: "Yukari Takeba", name_jp: "岳羽 ゆかり", codename: "YUKARI",
        review: `
**테우르기아 에너지 충전**이 핵심 기능인 힐러.

버퍼로서의 관점을 본다면 P3 파티에 한정적이지만, 힐러로서 바라본다면 생존 환경에서 충분히 뛰어난 활약을 할 수 있다.

적에게 스택을 부여하고, 부여된 적에게 피해를 입히면 치료와 테우르기아 게이지를 회복시킬 수 있는 스택을 얻는다. 

해당 **추가 치료는 "YUKARI의 행동 시작 전"까지 1회만 발동**한다. 
`,
review_en: 
`A healer whose core function is **Theurgy energy charging**.

From a buffer perspective, she is limited to P3 party setups, but as a healer, she performs excellently in survival-focused environments.

She applies stacks to enemies, and when attacking stacked enemies, she gains stacks that restore healing and Theurgy gauge.

This **additional healing activates only once "before YUKARI's action begins"**.
`,
review_jp: `
**テウルギアエネルギーのチャージ**が主な役割のヒーラーです。

バッファーとして見ればP3パーティに限定されますが、ヒーラーとして見れば生存環境で十分に活躍できます。

敵にスタックを付与し、スタックされた敵にダメージを与えることで、回復とテウルギアゲージを回復するスタックを獲得します。

この**追加回復は「YUKARIの行動開始前」までに1回のみ発動**します。
`
    },
    "유키 마코토": { name_en: "Makoto Yuki", name_jp: "結城 理", codename: "MAKOTO",
        review: ``
    },
    "이케나미": { name_en: "Shoki Ikenami", name_jp: "池波 星輝", codename: "LUCE",
        review: ``
    },
    "마나카": { name_en: "Manaka Nagao", name_jp: "長尾 愛歌", codename: "ANGE",
        review: ``
    },
    "마유미": { name_en: "Mayumi Hashimoto", name_jp: "橋本 麻由美", codename: "TURBO",
        review: ``
    },
    "아케치": { name_en: "Goro Akechi", name_jp: "明智 吾郎", codename: "CROW",
        review: ``
    },
    "미오": { name_en: "Mio Natsukawa", name_jp: "夏川 澪", codename: "MATOI",
        review: ``
    },
"레오": { name_en: "Leo Kamiyama", name_jp: "神山 嶺央", codename: "LEON",
        review: `
단일 목표의 공격력 수치와 크리티컬 효과를 크게 올려주는 버퍼.

2500이 넘는 공격력, 최대 100%가 넘는 크리티컬 효과를 부여 가능해 **4성이지만 압도적인 버프 성능**을 지니고 있다.

2스킬이 체력의 30%를 제외하지만 **동료의 생명이 60% 이하일 경우 버프 최대 효율을 얻게 되므로 버프 대상이 적에게 공격을 받을 필요**가 있다.`,
review_en: `
A buffer that greatly boosts the ATK stat and CRIT DMG of a single target.  

With over 2500 ATK and the ability to grant more than 100% CRIT DMG, it delivers **overwhelming performance despite being a 4★ unit.**  

Skill 2 consumes 30% of HP, but since **the buff reaches maximum efficiency when the ally’s HP is 60% or lower, the buff target needs to take enemy attacks.**  `,
review_jp: `
単体の攻撃力数値とCRT倍率を大幅に強化するバファー。  

攻撃力2500超え、CRT倍率100%以上付与可能で、**★4ながら圧倒的な性能を誇る。**  

スキル2はHPを30%消費するが、**味方のHPが60%以下の時にバフが最大効率となるため、バフ対象は敵からの攻撃を受ける必要がある。**  `
    },
    "렌": { name_en: "Ren Amamiya", name_jp: "雨宮 蓮", codename: "JOKER",
        review: ``
    },
    "루우나": { name_en: "Runa Dogenzaka", name_jp: "道玄坂 琉七", codename: "HOWLER",
        review: ``
    },
    "루페르": { name_en: "Lufel", name_jp: "ルフェル", codename: "CATTLE",
        review: ``
    },
    "류지": { name_en: "Ryuji Sakamoto", name_jp: "坂本 竜司", codename: "SKULL",
        review: ``
    },
"리코": { name_en: "Riko Tanemura", name_jp: "多祢村 理子", codename: "WIND",
        review: `
2.0에서 등장한 **괴도단 멤버로 스토리를 진행하면 획득**할 수 있으며, 캐릭터 계약에서는 해금과 관계없이 바로 획득할 수 있다.

적에게 **표식**을 남겨 **일반 또는 약점 공격을 통해 표식을 제거**할 경우, **가드 수치를 추가로 떨어뜨려 DOWN을 발생**시킨다.

**약점이 아닌 공격으로도 DOWN을 유발**할 수 있다는 점에서 ONE MORE와 총공격을 적극 활용할 수 있다.

패시브 또한 **ONE MORE와 총공격을 강화**하는 형태로 구성돼있어 벨벳 룸의 미션을 클리어하는데 큰 도움을 준다.

이외에도 스킬1을 통한 디버프, 스킬3을 통한 아군 회복 및 대미지 버프, 자동으로 발동되는 스킬 2 모두 준수한 성능을 지니고 있다.
`,
review_en: `
Introduced in version 2.0, Riko is a **Phantom Thief member obtainable through the story**, and can also be acquired immediately via character contracts regardless of unlock progression.

She can apply a **Mark** on enemies, and when the mark is removed through a normal or weakness attack, it **further reduces Guard and triggers DOWN**.

Because **DOWN can be triggered even without a weakness hit**, she enables more frequent use of **ONE MORE and All-Out Attacks**.

Her passives are also designed to **enhance ONE MORE and All-Out Attacks**, making her a great asset for clearing Velvet Room missions.

Additionally, she has solid utility through her kit: a debuff from Skill 1, ally healing and damage buff from Skill 3, and an automatically triggered Skill 2.
`,
    review_jp: `
Ver2.0で登場した理子は、ストーリーを進めることで加入する怪盗団メンバーですが、怪ドル契約からはストーリーの進行状況に関係なく取得できます。

敵に**マーク**を付与し、通常攻撃または弱点攻撃でマークを解除すると、**ダウン値を追加で減少させてDOWNを発生**させることができます。

**弱点以外の攻撃でもDOWNを誘発できる**ため、**ONE MOREや総攻撃**を積極的に活用できます。

パッシブも**ONE MOREと総攻撃を強化**する構成となっており、ベルベットルームの試練攻略に大きく貢献します。

さらに、スキル1によるデバフ、スキル3による味方回復とダメージバフ、自動発動するスキル2と、いずれも優秀な性能を持っています。
`
    },
    "리코·매화": { name_en: "Riko Tanemura·Vast", name_jp: "多祢村 理子・花見", codename: "WIND·Vast",
        review: ``
    },
    "마사키": { name_en: "Masaki Ashiya", name_jp: "蘆谷 真咲", codename: "CHERISH",
        review: ``
    },
"마코토": { name_en: "Makoto Niijima", name_jp: "新島 真", codename: "QUEEN",
        review: `
강력한 단일 타겟 딜러로, **핵열 속성이 P5부터 등장했다는 점을 고려할 때 속성 면에서 이득**을 가지고 가는 캐릭터.

의식6에서 추가 턴을 가질 수 있게 됨으로서 초반 단일 타겟 딜러로서는 최강의 자리를 가지게 된다.

원소 이상에 큰 영향을 받는 만큼 **치즈코와의 파티 구성은 필수적**이다.

TECHNICAL을 지니고 있지만, 이후 추가된 수치인 스킬 마스터 효과에는 현재 영향을 받지 않는다.`,
review_en: `
As a powerful single-target damage dealer, this character benefits from the introduction of the Nuclear attribute starting from P5, giving her a **distinct elemental advantage**.

With an extra turn gained at A6, she becomes the strongest early-game single-target DPS.

Since she is heavily reliant on elemental ailments, forming a **party with VINO is essential**.

Although the character possesses TECHNICAL, they are currently not affected by the later-added SKILL MASTER effect.`,
review_jp: `
強力な単体ターゲットアタッカーであり、P5から登場した核熱属性を活かせるため、属性面で有利な怪盗です。

意識6で追加ターンを獲得できるようになり、序盤の単体アタッカーとして最強の地位を確立します。

属性異常の影響を大きく受けるため、**VINOとの編成は必須**です。

TECHNICALを所持していますが、後から追加された数値であるSKILL MASTER効果の影響は現時点では受けていません。`
    },
    "미나미": { name_en: "Minami Miyashita", name_jp: "宮下 美波", codename: "MARIAN",
        review: ``
    },
    "미유": { name_en: "Miyu Sahara", name_jp: "佐原 海夕", codename: "PUPPET",
        review: ``
    },
    "모르가나": { name_en: "Morgana", name_jp: "モルガナ", codename: "MONA",
        review: ``
    },
    "모토하": { name_en: "Motoha Arai", name_jp: "新井 素羽", codename: "CLOSER",
        review: ``
    },
"모토하·여름": { name_en: "Motoha Arai·Summer", name_jp: "新井 素羽・夏", codename: "CLOSER·Summer",
        review: `
최초의 **축복 속성 딜러**다.

스킬을 사용할 때 자신의 HP를 소모하며, 특히 **핵심 스킬인 3스킬**은 **모토하가 HP를 회복할 때마다 쿨타임이 줄어드는 효과**가 있다. 덕분에 미나미나 토모코·여름 같은 **힐러와 함께 조합**하는 경우가 많다.  

**생명력이 높을수록 계시를 통한 대미지 보너스**와 **패시브를 통한 공격력**이 올라간다.

다만 **생명력이 16000**을 초과할 경우 얻는 메리트는 없기에 파티원의 버프를 고려해 적절히 구성하고 **이외 스탯은 공격적인 요소에 투자**하는 것이 좋다.

생명력이 중요한 캐릭터 특성 상 생존성이 매우 좋고, 사이클도 단순한 편이라 **오토로 플레이하기에 적절**하다.`,
review_en: `
The first **Bless-type DPS**.

She consumes her own HP to use skills, and her **core Skill 3** can remove its cooldown through stacks Motoha gains by **restoring HP**, which naturally pairs her with healers such as **Minami Miyashita** or **Tomoko Noge·Summer**.

The higher her **HP**, the greater her **DMG Bonus (ATK Mult)** and **ATK** gained through passives and revelation cards.

However, there’s no benefit beyond **16,000 HP**, so after accounting for party buffs, it’s best to stop stacking HP there and invest remaining stats into offensive options.
`,
review_jp: `
初の**祝福属性アタッカー**。

自身のHPを消費してスキルを使用し、**核心となるスキル3**は、モトハがHPを回復して獲得するスタックを通じてクールタイムを解除できる。**宮下 美波**や**野毛 朋子・夏**といったヒーラーとの編成が前提となる。

**HPが高いほど攻撃倍率+やパッシブによる攻撃力**が上昇する。

ただし**HPが16000**を超えてもメリットはないため、味方のバフを考慮して適度に確保し、**残りのステータスは攻撃的な要素に投資**するのが望ましい。
`
    },
    "몽타뉴": { name_en: "Montagne Kotone", name_jp: "琴音 モンターニュ", codename: "MONT",
        review: ``
    },
    "몽타뉴·백조": { name_en: "Montagne Kotone·Swan", name_jp: "琴音 モンターニュ・スワン", codename: "MONT·Swan",
        review: ``
    },
    "세이지": { name_en: "Seiji Shiratori", name_jp: "白鳥 誠司", codename: "FLEURET",
        review: ``
    },
    "슌": { name_en: "Shun Kano", name_jp: "加納 駿", codename: "SOY",
        review: ``
    },
"아야카": { name_en: "Ayaka Sakai", name_jp: "坂井 綾香", codename: "CHORD",
        review: `
아야카는 HIGHLIGHT(이하 HL)를 컨트롤하는 **P5X에서 압도적인 위치를 유지하는 버퍼**다.

모든 캐릭터는 HL을 재사용하는데 쿨다운에 의해 4번의 행동이 필요하고, 보스와 싸우는 일반적인 6턴의 경우 2턴과 6턴에 1번씩 총 2번만 사용 가능하다.

그러나 아야카의 **스킬3은 쿨다운에 관계없이 강화된 HL을 강제로 발동 가능한 스킬**로 **6턴 동안 최대 5번의 HL**을 사용 가능하게 만든다.

<br>

스킬2를 통해 동료의 공격력을 올릴 수 있고, **의식1**로 업그레이드 할 경우 **크리티컬 확률을 15%** 올려주는 버프를 제공한다.

아야카의 HL은 아군에게 버프를 제공하면서 일정 시간 HL 충전량을 올려 보다 압축된 HL 사이클을 만들어내는 등 전체적인 대미지를 크게 상승시킨다.

**HL에 대미지를 의존하는 파티라면 무조건적으로 채용**되며, 그렇지 않더라도 **어디에나 함께 사용 가능한 범용 서포터**이다.

---

**전용 무기** 또한 기존 메커니즘을 파괴하는 형태로 등장한다. 

**전투 시작 시 HL 게이지를 채워주는 효과**를 가지고 있어 다른 파티보다도 빠르게 HL를 사용할 수 있다.

<br>

**무기를 5재까지 강화**할 경우, HL 게이지를 76% 제공한다. 이를 25%의 게이지를 제공하는 계시 세트와 함께 착용할 경우 **전투에 진입하자마자 HL을 사용**할 수 있다.

해당 이유 때문에 **1돌5재**라는 괴상한 캐릭터 형태가 효율이 뛰어난 캐릭터 강화 요소로 인정받고 있다.
`,
review_en: `
Ayaka is a **top-tier buffer in P5X** thanks to her unique mechanic of controlling the HIGHLIGHT (HL).

Normally, all characters must wait for cooldown to reuse HL, requiring 4 actions. 

In a standard 6-turn boss fight, this means HL can only be used twice — once on turn 2 and once on turn 6.

However, Ayaka’s **Skill 3 forcibly triggers an enhanced HL regardless of cooldown**, allowing up to **5 HL activations within 6 turns**.

<br>

Through Skill 2 she can increase allies’ ATK, and with **A1** upgrade she provides a buff that raises **Crit Rate by 15%**.

Ayaka’s HL not only buffs allies but also increases HL charge for a period, creating a compressed HL cycle that greatly boosts overall damage output.

**Any party that relies on HL damage will always include her**, and even outside of that, she remains a **universal supporter that fits anywhere**.

---

Her **exclusive weapon** also breaks existing mechanics.  

It has an effect that **fills the HL gauge at the start of battle**, allowing her party to use HL faster than others.

<br>

When the weapon is upgraded to **R5**, it grants 76% HL gauge. 

Combined with a Revelation that provides 25% gauge, this enables **HL activation immediately at battle start**.

For this reason, the unusual setup known as **A1R5** is considered a highly efficient form of character enhancement.

---

Since Skill 1 received a buff that added an **Shock** effect, you might also consider **Ailment Accuracy** as a sub-options.

`,
    review_jp: `
HL（HIGHLIGHT）をコントロールする独自のメカニズムによって、**P5Xにおいて圧倒的な位置を占めるバッファー**です。

通常、すべてのキャラクターはHLを再使用するためにクールダウンを待つ必要があり、4回の行動が必要です。一般的な6ターンのボス戦では、2ターン目と6ターン目に1回ずつ、合計2回しか使用できません。

しかし、綾香の**スキル3はクールダウンに関係なく強化HLを強制的に発動できるスキル**であり、**6ターンの間に最大5回のHL**を使用可能にします。

<br>

スキル2によって味方の攻撃力を上昇させ、さらに**意識1**にアップグレードすると**CRT発生率を15%**上昇させるバフを付与します。

綾香のHLは味方にバフを与えるだけでなく、一定時間HLゲージの充填量を増加させ、より圧縮されたHLサイクルを作り出し、全体的なダメージを大幅に向上させます。

**HLダメージに依存するパーティであれば必ず採用され**、そうでなくても**どこでも活躍できる汎用サポーター**です。

---

**専用武器**もまた既存のメカニズムを覆す存在です。  

**戦闘開始時にHLゲージを充填する効果**を持ち、他のパーティよりも早くHLを使用できます。

<br>

武器を**R5まで強化**するとHLゲージを76%提供します。25%のゲージを提供する啓示セットと組み合わせれば、**戦闘開始直後にHLを使用可能**となります。

このため、**A1R5**という特異な形態が、効率的なキャラクター強化手段として評価されています。

---

**スキル1**がバフを受けて**感電**が追加されたため、サブステータスとして**状態異常命中**を考慮することもできる。
`
    },
    "안": { name_en: "Ann Takamaki", name_jp: "高巻 杏", codename: "PANTHER",
        review: ``
    },
    "야오링": { name_en: "Yaoling Li", name_jp: "李瑤鈴", codename: "RIN",
        review: ``
    },
    "야오링·사자무": { name_en: "Yaoling Li·Lion Dance", name_jp: "李瑤鈴·獅子舞", codename: "RIN",
        review: ``
    },
"유스케": { name_en: "Yusuke Kitagawa", name_jp: "喜多川 祐介", codename: "FOX",
        review: `**방어력**을 기반으로 하는 **반격형 딜러**로 설계돼 **버티거나 오토 플레이에 뛰어난 딜러**이다.

**65%의 반격확률**이라는 불안정한 요소가 있어 스킬3의 100% 반격이나 하이라이트를 사용하지 않는 경우, 최고 점수를 위해 반복 플레이가 필요할 수 있다.

캐릭터들의 절대 다수가 공격력의 영향을 받는 만큼 버퍼 다수가 공격력을 올려주기에 **함께 쓸 수 있는 버프가 제한적**이다.

반격형 딜러라는 특성 때문에 마지막에 순서를 배정하는 다른 딜러와 달리 **첫번째 순서로 배치**하는 것이 버프 유지 관점에서 효율적이다.

패시브와 의식6에서 관통을 주지만, 정작 FOX를 위한 수르트와 잭오랜턴은 기본 방어력 수치가 낮아 극적인 효과를 보기 어렵다.`,
review_en: `Designed as a **counter-type damage dealer** based on **Defense**, this character excels as a **durable or auto-play optimized dealer**.

Due to the unstable **65% counter rate**, unless Skill 3 guaranteed 100% counter or the Highlight is used, repeated runs may be necessary to achieve the highest score.

Since most characters scale with ATK and many buffers boost ATK, **available buff options are limited**.

Because it is a **counter-type dealer**, unlike other dealers who are placed last in the turn order, it is more effective to **assign them to the first slot** in terms of maintaining buffs.

Though Penetration is granted through passives and Awareness 6, Surt and Jack-o-Lantern, intended for FOX, have low base Defense, making it difficult to see dramatic results.`,
review_jp:`**防御力**を基にした**反撃型アタッカー**として設計されており、**耐久やオートプレイに優れたアタッカー**です。

<b>反撃確率65%</b>という不安定な要素があるため、スキル3の100%反撃やハイライトを使用しない限り、最高スコアを狙うには周回が必要になることがあります。

怪盗の大多数が攻撃力に依存し、多くのバッファーも攻撃力を上げるため、**一緒に使えるバフが限られています**。

**反撃型アタッカー**という特性上、他のアタッカーのように最後ではなく、**最初の順番に配置**する方がバフ維持の面で効率的です。

パッシブや意識6 で貫通を得られますが、FOX向けのスルトやジャックランタンは基礎防御力が低いため、大きな効果は得にくいです。`

    },
"유우미": { name_en: "Yumi Shiina", name_jp: "椎名 悠美", codename: "PHOEBE",
        review: `
유우미(PHOEBE)는 강력한 속성 대미지 보너스를 부여하는 해명 괴도로 동일 속성의 아군이 많을수록 가치가 높아진다.

아군이 속성 공격을 할 때마다 중첩이 1개씩 쌓이게 되고 **중첩이 3개가 되면 칵테일을 제조**한다. **동일 속성의 중첩을 모을수록 높은 품질의 칵테일을 생성**한다.

만약 품질이 낮은 칵테일을 생성하더라도 1개는 스킬2를 통해 최고 등급의 칵테일로 변환할 수 있고, **스킬3을 통해 특정 속성의 대미지를 크게 증가**시킬 수 있다.

<br>

요구 공격력이 높은 편이라 계시 카드 세팅을 신경써줘야하고, 전용 무기가 공격력을 올려줄 뿐 아니라 행동 턴 수를 변화시킬 수 있는 요소가 있어 전용 무기를 신경 쓰는 편이 좋다.

최초의 5성 해명 괴도로서 기존 15%씩 스탯을 아군에게 나눠주던 4성과 달리, **아군에게 스탯의 20%를 나눠줌으로서 해명 괴도의 스탯을 보다 신경써야 한다.**

칵테일에 의존하는 캐릭터로 의식6에 칵테일의 상한이 3잔에서 4잔으로 늘어나는 영향도가 높다.
`,
review_en: `
Phoebe is an Elucidator Phantom Thief who provides a powerful elemental damage bonus, making her more valuable the more allies share her element.  

Each time an ally performs an elemental attack, she gains 1 stack, and **when 3 stacks are reached, she mixes a cocktail**. **The more stacks of the same element gathered, the higher the quality of the cocktail produced**.  

Even if a low-quality cocktail is created, one can be upgraded to the highest tier via Skill 2, and **Skill 3 can greatly boost the damage of a specific element**.  

<br>

Her exclusive weapon not only increases ATK but also has an effect that can alter turn order, so it’s worth investing in.  

As the first 5★ Elucidator Phantom Thief, unlike 4★ units who shared 15% of their stats with allies, **she shares 20% of her stats with allies, making her own stats even more important**.  

Being a cocktail-dependent character, at Awareness 6, the cocktail limit increases from 3 to 4 glasses, which has a significant impact.`,
review_jp: `
椎名 悠美（PHOEBE）は強力な属性攻撃倍率+を付与する解明怪盗で、同属性の味方が多いほど価値が高まる。  

味方が属性攻撃を行うたびに1スタックを獲得し、**3スタックに達するとカクテルを作成**する。**同じ属性のスタックを集めるほど、より高品質なカクテルを生成**できる。  

低品質のカクテルが生成されても、スキル2で1つを最高ランクのカクテルに変換可能で、**スキル3で特定属性のダメージを大幅に強化**できる。  

<br>

専用武器は攻撃力を上げるだけでなく行動順を変化させる効果もあるため、専用武器に投資する価値がある。  

初の★5解明怪盗として、従来の★4が味方にステータスを15%分配していたのに対し、**味方にステータスの20%を分配するため、自身のステータスをより重視する必要がある**。  

カクテルに依存する怪盗であり、意識6ではカクテルの上限が3杯から4杯に増えるため、その影響は大きい。  `
    },
    "YUI": { name_en: "YUI", name_jp: "ユイ", codename: "BUI",
        review: 
``
    },
    "유키미": { name_en: "Yukimi Fujikawa", name_jp: "藤川 雪実", codename: "YUKI",
        review: ``
    },
"치즈코": { name_en: "Chizuko Nagao", name_jp: "長尾 チヅ子", codename: "VINO",
        review: `
4성임에도 불구하고 **방어력 감소 수치가 높아 준 5성에 달하는 디버퍼**이다.

5성 무기를 활용하고 계시(주권여정) 카드를 세팅한다면 **최대 124.8%의 방어력 감소**가 가능하다.

원소 이상을 다수 부여하므로 QUEEN 파티에 무조건적으로 채용되는 캐릭터이며, 이후에도 더 뛰어난 디버퍼를 얻기 전에는 주기적으로 활용된다.`,
review_en: `
Despite being a 4★, this character is a **debuffer with DEF reduction values rivaling that of a 5★**.

If you equip a 5★ weapon and Revelation cards (Departure&Control), **up to 124.8% DEF reduction** is achievable.

By inflicting multiple elemental ailments, she becomes a must-pick for QUEEN teams and will continue to see usage regularly until a stronger debuffer is released.`,
review_jp: `
4★でありながら、**5★に匹敵する防御力減少値を持つデバッファー**です。

5★武器を装備し、啓示カードをセットすれば、**最大124.8%の防御力減少**が可能です。

複数の属性異常を付与できるため、QUEENパーティには必須キャラであり、より優れたデバッファーが登場するまでは定期的に活用されます。`
    },
    "카스미": { name_en: "Kasumi Yoshizawa", name_jp: "芳澤 かすみ", codename: "VIOLET",
        review: ``
    },
    "카요": { name_en: "Kayo Tomiyama", name_jp: "富山 佳代", codename: "OKYANN",
        review: ``
    },
    "키라": { name_en: "Kira Kitazato", name_jp: "北里 基良", codename: "MESSA",
        review: ``
    },
    "키요시": { name_en: "Kiyoshi Kurotani", name_jp: "黒谷清", codename: "KEY",
        review: ``
    },
    "토모코": { name_en: "Tomoko Noge", name_jp: "野毛 朋子", codename: "MOKO",
        review: ``
    },
    "토모코·여름": { name_en: "Seaside Tomoko", name_jp: "朋子・ピーチサマー", codename: "MOKO·Summer",
        review: `
아군 딜러에게는 **효과명중**과 **공격력**을 올려주고, 적은 **받는 대미지**를 증가시키는 힐러다.

공격과 힐, 버프가 모두 가능하지만 최상의 값은 아닌 **밸런스형**으로 스킬 셋이 구성돼있다.

스킬 사이클은 **S2-S3**의 반복으로 간단한 편이며 효과 명중을 올려주는 만큼 관련 스탯에 영향을 받는 딜러들과 잘 어울린다. 

**스킬 1**은 별도로 사용되지 않지만 패시브가 있으므로 적당한 재화 투자는 필요하다.

<br>

**[조화]-[승리]** 계시 카드 세트의 경우, **[화려한 불꽃]**이 다단 히트를 수행하므로 **세트 효과 발동이 비교적 쉬운 편**이라 **[창조]-[화해]** 세트의 등장 전까지는 우선 선택된다.

필수적으로 세팅해야할 스탯 값이 없기 때문에 비교적 **카드 세팅이 편한 편**이다.
`,
review_en: `
A healer who increases **Ailment Accuracy** and **Attack** for allied dealers, while also increasing **damage taken** by enemies.

Although she can attack, heal, and buff, her skill set is built as a **balanced type** rather than focusing on one strength.

Her skill cycle is simple, mainly repeating **S2–S3**, and she pairs well with dealers who benefit from stats affected by increased **Ailment Accuracy**.

While **Skill 1** is not used directly, it has a passive effect, so a moderate investment is recommended.

<br>

For the **[Harmony - Victory]** Revelation Card Set, since **[Summer Reminiscence]** performs multi-hit attacks, the **set effect is easier to trigger**, making it the preferred choice until the **[Creation - Reconciliation]** set is released.

Because there are no mandatory stat requirements, **card setup is relatively easy**.
`,

review_jp: `
味方のアタッカーに**状態異常命中**と**攻撃力**を上昇させ、敵には**被ダメージ増加**を付与するヒーラー。

攻撃・回復・バフのすべてが可能だが、突出した性能というより**バランス型**のスキル構成になっている。

スキルサイクルは**S2→S3**の繰り返しでシンプルであり、**状態異常命中**に影響を受けるアタッカーと非常に相性が良い。

**スキル1**は直接使用しないが、パッシブ効果があるため、ある程度の投資は必要。

<br>

**[調和 - 勝利]**の啓示カードセットでは、**[ひと夏の思い出]**が多段ヒットを行うため、**セット効果の発動が比較的容易**であり、**[創造 - 和解]**セットが登場するまでは優先的に選ばれる。

必須ステータスの指定がないため、**カード構成が比較的簡単**なのも特徴。
`
    },
"토시야": { name_en: "Toshiya Sumi", name_jp: "須見 俊也", codename: "SEPIA",
        review:`
주원 효과를 기반으로 적에게 % 대미지를 주는 딜러이다.

**주원 효과는 적의 체력에 비례한 대미지를 주며, 주원이 아닌 만능 속성 대미지에 영향**을 받는다.

따라서 만능 속성 대미지를 올릴 수 있도록 원더의 무기 메커니컬 심판자를 활용하거나, **대미지 보너스를 올리는 형태로 버프가 구성**돼야 한다.

스킬1이 부여하는 [증오 시]는 30%의 확률로 적에게 주원 효과를 부여하고, 30%는 효과 명중 수치에 따라 증가할 수 있다.

스킬1을 반복해 최대한 많은 주원 효과를 적에게 부여하고, 페르소나 **파즈스**의 패시브를 통해 주원 효과를 결산시키면 큰 대미지를 적에게 부여할 수 있다.

참고사항으로 절대 다수의 **경쟁 콘텐츠 보스는 체력 비례 대미지 대폭 감소 패시브를 지니고 있다.**
`,
        review_en: `
A damage dealer that uses Curse Effects to deal % damage to enemies.

**Curse Effects deal damage based on the enemy's HP and are affected by Almighty damage, not Curse itself.**

Therefore, buffs should be structured to **increase Damage Bonus(Atk Mult)** or use Wonder’s weapon “Ex Machina” to boost Almighty damage.

**[Verse of Hate]** applied by Skill 1 has a 30% chance to inflict Curse Effects on the enemy, and this 30% can increase depending on Ailment Accuracy Rate.

By repeating Skill 1 to inflict as many Curse Effects as possible, and using Persona **Pazuzu**’s passive to finalize those effects, you can deal great damage to enemies.

As a side note, **most competitive content bosses have passives that greatly reduce HP-percentage-based damage.**
`,
review_jp: `
呪怨効果を基に敵に％ダメージを与えるアタッカーです。

**呪怨効果は敵のHPに比例したダメージを与え、呪怨ではなく万能属性ダメージの影響を受けます。**

そのため、ワンダーの武器「機械の裁き」を活用して万能ダメージを上げるか、**攻撃倍率+を上げる形でバフを構成**する必要があります。

スキル1で付与される憎文は30%の確率で敵に呪怨効果を付与し、この30%は状態異常命中により上昇する可能性があります。

スキル1を繰り返してできるだけ多くの敵に呪怨効果を付与し、ペルソナ**パズズ**のパッシブでこれを清算することで、大きなダメージを与えることができます。

参考までに、**ほとんどの競争コンテンツのボスはHP比例ダメージを大きく軽減するパッシブを持っています。**
`
    },
    "하루": { name_en: "Haru Okumura", name_jp: "奥村 春", codename: "NOIR",
        review: ``
    },
    "하루나": { name_en: "Haruna Nishimori", name_jp: "西森 陽菜", codename: "RIDDLE",
        review: ``
    },
    "후타바": { name_en: "Futaba Sakura", name_jp: "佐倉 双葉", codename: "NAVI",
        review: ``
    }
  };
  