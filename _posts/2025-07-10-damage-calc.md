---
layout: article
title: "페르소나5X 대미지 계산 공식에 대해"
date: 2025-07-10 12:00:00 +0900
categories: [Guide]
tags: [guide]
author: AbsolRoot
thumbnail: /apps/article/asset/damage.gif
translations:
  kr:
    title: "페르소나5X 대미지 계산 공식에 대해"
  en:
    title: "About Persona 5X Damage Calculation"
  jp:
    title: "ペルソナ5X ダメージ計算"
---

<div class="content-kr" markdown="1">

> **⚠️ 주의사항**
> 
> 본 문서는 게임 초기 중국 Q&A 내용을 기반으로 작성되었습니다. 대미지 계산의 방향성과 구조를 이해하는 데 참고하시되, 정확한 수치는 실제 게임과 차이가 발생할 수 있습니다.
> 
> 또한 정확한 대미지 계산을 시도하는 것은 권장하지 않습니다. 대부분의 값과 요소는 서버에 숨겨져 있어 데이터마이닝이 불가능하며, 대미지에 영향을 미치는 스탯만 100가지 이상으로 알려져 있습니다.
> 
> 따라서 본 문서의 대미지 계산 공식은 완벽한 정확도를 추구하기보다는 **참고용**으로 활용하시기 바랍니다. 또한 스킬 대미지의 작동 방식은 캐릭터마다 다르게 적용될 수 있습니다 (예: "+20% 대미지 증가"가 때로는 "×1.2"를 또는 "+20%"를 의미할 수 있음).

페르소나5X는 정말 복합적인 요소의 곱셈을 통해 대미지가 결정된다.

![damage.gif](/apps/article/asset/damage.gif)

이를 모두 이해한다면 기상천외한 딜을 뽑아내는 택틱을 만들 수 있고, 곧 순위 상승으로 이어지게 된다.

긴 말 필요 없이 바로 최종 공식부터 확인해보자.

<br>

# 최종 수치 공식

```markdown
= ⓐ 공격력 계산 × ⓑ 대미지 보너스 계산 × ⓒ 적 방어력 계산 × ⓓ 크리티컬 계산 × ⓔ 스킬 계수
× ⓕ 약점 계수 × ⓖ 최종 대미지 보너스 × ⓗ 기타 계수 × ⓘ 랜덤 범위 계수
```

<br>

좀 더 상세하게 작성한 공식은 아래와 같다.

```markdown
ⓐ {(캐릭터 공격력 값 + 무기 공격력 값) × 공격력 % + 공격력 상수}

× ⓑ {100% + 대미지 보너스 + 속성 대미지 보너스 + 적이 받는 대미지 증가}

× ⓒ 1 - {적 방어 값 × [(100% + 추가 방어 계수) × (100% - 관통) - 방어력 감소] × (100% - 풍습 12%)} 
÷ {적 방어 값 × [(100% + 추가 방어 계수) × (100% - 관통) - 방어력 감소] × (100% - 풍습 12%) + 1400}

× ⓓ {크리티컬 효과 (크리티컬 발생 시) 또는 안정 영역}

× ⓔ 스킬 계수 

× ⓕ 약점 계수 (내성 50% / 일반 100% / 약점 120%)

× ⓖ 최종 대미지 보너스 

× ⓗ 기타 계수 

× ⓘ 랜덤 범위 계수 (0.95~1.05)
```
<br>

대미지를 올리기 위해서는 다음 9가지 요소를 신경써야 한다는 것이고, 
각각에 대해 상세히 작성했으니 이해한다면 보다 점수를 크게 올릴 수 있다.

- ⓐ 공격력 계산
- ⓑ 대미지 보너스 계산
- ⓒ 적 방어력 계산
- ⓓ 크리티컬 계산
- ⓔ 스킬 계수
- ⓕ 약점 계수
- ⓖ 최종 대미지 보너스
- ⓗ 기타 계수
- ⓘ 랜덤 범위 계수


---

### **참고사항 : 같은 그룹 내에 속하는 값은 모두 합 연산으로 계산된다.**

**예시1) 공격력**

- JOKER의 무기와 계시로 인해 공격력 +100%, 공격력 +1000
- LEON의 스킬3으로 인한 버프로 공격력 +19.5%, +1516

→ 공격력 119.5%, 공격력 +2516

<br>

**예시2) 대미지 보너스**

- PANTHER 계시 ‘분쟁’의 화염 대미지 보너스 10%
- Dominion의 ‘응집’ 대미지 보너스 16%

→ PANTHER의 대미지 보너스 = 26%

---

# ⓐ 공격력

> {(캐릭터 공격력 값 + 무기 공격력 값) × 공격력 % + 공격력 상수}

<br>

### ⓐ-**1. 캐릭터 공격력 값**

![awareness6.png](/apps/article/asset/damage2.png)

각 캐릭터는 기본 공격력을 가지고 있고 해당 공격력은 레벨과 의식에 따라 성장률이 결정된다.

| 의식 0 | 의식 1 | 의식 2 | 의식 3 | 의식 4 | 의식 5 | 의식 6 |
| --- | --- | --- | --- | --- | --- | --- |
| 100% | 102% | 105% | 107% | 110% | 112% | 115% |

하지만 성장률이라는 개념에 따라 정확하게 15%가 오르는 것은 아니다.

기본 레벨 0의 스탯에서 레벨업할 때 성장하는 양이 15% 증가했다는 의미로, 

레벨 80 기준 약 10.7%의 차이를 보인다.


| 의식 0 | 의식 1 | 의식 2 | 의식 3 | 의식 4 | 의식 5 | 의식 6 |
| --- | --- | --- | --- | --- | --- | --- |
| 1180  | 1202  | 1222  | 1244  | 1265  | 1286  | 1307  |
|+0% | +1.8% |+3.6% | +5.4% | +7.2% | +8.9% | +10.7%|

해당 공격력 값은 조커에 대한 예시로 캐릭터마다 다르다.

전반적으로 같은 포지션에 있는 캐릭터는 비슷한 수치를 지닌다.

<br>

### ⓐ-**2. 무기 공격력 값**

각 캐릭터는 고유한 무기를 가지고 있고, 무기의 기본 공격력은 희귀도와 레벨에 따라 결정된다.

무기 공격력이 합산된 상태에서 공격력 % 버프가 들어가는 만큼 옵션 뿐 아니라 스탯 수치도 중요하다.

무기를 중첩해 강화한다고 하여도 기본 공격력은 오르지 않는다.

![damage.png](/apps/article/asset/damage3.png)

<br>

### ⓐ-3. 공격력 %

각종 버프, 계시, 무기 등에서 %로 올라가는 공격력을 말한다. 

아래 사진에서는 2.8%가 이에 해당한다.

![damage.png](/apps/article/asset/damage4-1.png)

<br>

### ⓐ-4. 공격력 상수

각종 버프, 계시, 무기 등에서 일반 정수로 올라가는 공격력을 말한다. 

아래 사진에서는 46이 이에 해당한다. 모든 공격력 계산이 끝난 후에 더해진다.

![damage.png](/apps/article/asset/damage4.png)

---

# ⓑ 대미지 보너스

> {100% + 대미지 보너스 + 속성 대미지 보너스 + 적이 받는 대미지 증가}

<br>

### ⓑ-**1.** 대미지 보너스

우리가 아는 일반적인 대미지 보너스, 대미지 증가라 적힌 전반적인 내용을 포함한다고 보면 된다.

대표적으로 카요의 스킬 3은 대미지 보너스를 올려주는 스킬이다. 

![damage.png](/apps/article/asset/damage5.png)

<br>

### ⓑ-2. 속성 대미지 보너스

특정 속성에 한정 지어서 올라가는 대미지 보너스로 조건부지만 기존 대미지 보너스 풀에 포함되어 계산된다.

![damage.png](/apps/article/asset/damage6.png)

<br>

### ⓑ-3. 받는 대미지 증가

적에게 할당되는 디버프로 적이 받는 대미지가 증가한다.

대표적으로 야오링의 스킬3이 있다. 적에게 종속되므로 적이 죽을 경우 해당 속성은 사라진다.

![damage.png](/apps/article/asset/damage7.png)

---

# ⓒ 적 방어력

> 1 - {적 방어 값 × [방어 계수] × (100% - 풍습 12%)} ÷ {적 방어 값 × [방어 계수] × (100% - 풍습 12%) + 1400}

> ※ 방어 계수 = (100% + 추가 방어 계수) × (100% - 관통) - 방어력 감소
>

<br>
가장 복잡한 메커니즘이자, 앞으로 가장 많이 신경쓰게 될 핵심 요소다.

결론 : **가능하면 보스의 방어 계수를 모두 감소시켜 0으로 만들 수 있다면 하는 게 좋다**.

<br>

### ⓒ-1 적 방어 값 & 추가 방어 계수

적에게는 각각 고유의 방어력 수치가 있고, 보스들에게는 추가 방어 계수가 존재한다. 

놀랍게도 이 수치들은 정말 중요한 수치임에도 불구하고 게임 내 어디에서도 찾아볼 수 없고, 게임 클라이언트를 분석해 역으로 추출해야 한다. (글쓴이 또한 확인 불가능)

| **BOSS** | **추가 방어 계수** | **100% + 추가 방어 계수** |
| --- | --- | --- |
| 마음의 바다 8스타 LV89 | 163.2% | 263.2% |
| 흉몽(길드 보스) LV82 | 158.4% | 258.4% |

위는 일반적인 수치이고, 보스에 따라 추가 방어 계수가 바뀌기도 한다.

<br>

| **흉몽 LV82** | **방어력** | **추가 계수** |
| --- | --- | --- |
| 도미니온 | 363.2 | 158.4% |
| 아타바크 | 1279.9 | 158.4% |
| 비슈누 | 820.7 | 158.4% |
| 비슈누 화신 | 363.2 | 158.4% |
| 야츠후사 | 1279.9 | **205.9%** |

방어력이 높을수록, 추가 방어 계수가 높을 수록 ⓒ의 계산 결과 값은 작아져, 결과적으로 최종 대미지가 감소하게 된다.

<br>

### ⓒ-2 관통

증가한 방어 계수를 % 단위로 감소시킬 수 있는 능력치다.

캐릭터 자체 메커니즘에 포함되지 않는 이상 수급처가 정말 적은 편이고, 대표적으로 계시에서 획득 가능하다.

![damage.png](/apps/article/asset/damage8.png)

관통이 50%이고, 보스가 도미니온일 경우 

```markdown
※ 방어 계수 = (100% + 추가 방어 계수) × (100% - 관통) - 방어력 감소

※ 방어 계수 = (100% + 158.4%) × (100% - 50%) = 258.4% * 0.5 = 129.2%
```

로 비례해서 방어 계수가 줄어들기 때문에 수치 대비 효용성이 상당히 높은 귀중한 능력치다.

당연히 100%를 초과하는 관통은 적용되지 않는다.

<br>

### ⓒ-3 방어력 감소

관통 수치까지 적용된 이후, 방어력 감소 수치가 적용된다.

야노식의 패시브는 적의 방어력을 2턴 간 41.6% 감소시킬 수 있을 뿐 아니라, 라쿤다 스킬을 통해 38.8%를 감소시킬 수 있다. 

관통으로 129.2%를 만든 방어 계수에 야노식의 패시브와 라쿤다가 적용한다면 방어 계수는 다음과 같다.

```markdown
129.2% - 41.6% (야노식 패시브) - 38.8% (라쿤다) = 48.8%
```

![damage.png](/apps/article/asset/damage9.png)

결과를 방어력 계산식ⓒ에 넣게 되면 +48.4%의 대미지 증가가 됨을 알 수 있다.

> 1 - {적 방어 값 × [방어 계수] } ÷ {적 방어 값 × [방어 계수] + 1400}
> 

| **관통** | **방어력 감소** | 적 방어 값 | 방어 계수 | **ⓒ 계산 결과** |
| --- | --- | --- | --- | --- |
| 0% | 0% | 363.2 | 258.4% | 0.598 |
| 50% | 80.4% | 363.2 | 48.8% | 0.887 (+48.4%) |

방어력 감소에 의한 방어 계수는 0 이하로 내려가지 않는다.

<br>

### ⓒ-4 풍습(Windswept)

> 적 방어 값 × [방어 계수] × (100% - 풍습 12%)
> 

상태이상으로 방어 계수가 모두 계산된 결과에 88%를 곱하게 된다.

앞서 관통과 방어력 감소를 통해 방어 계수를 0으로 만들 경우 가치가 0이 된다는 특징이 있다.

![damage.png](/apps/article/asset/damage10.png)

 대체로 방어력 감소 효과를 지닌 페르소나가 풍습을 필요로 하는 경우가 많다.

![damage.png](/apps/article/asset/damage11.png)

<br>

### ⓒ 특징

공격력, 대미지 보너스 등의 버프 수치는 양이 많아질 수록 효율이 떨어지지만, 방어력 감소와 관통은 그 수치가 높아질 수록 효율이 올라간다. (방어 계수가 0이 될 때까지)

즉 방어 계수가 0에 가까워질 수록 효율이 올라가는 곡선 그래프를 그리기 때문에 방어력 감소를 고려한 전략이라면 최대한 높은 값을 챙기는 것이 좋다. 

---

# ⓓ 크리티컬

크리티컬 대미지는 크리티컬 발동 시 ‘크리티컬 효과’만큼 대미지를 곱하여 적에게 준다.

기본 크리티컬 확률은 5%, 기본 크리티컬 효과는 150%로 5%의 확률로 1.5배의 대미지를 준다.

대표적으로 디오니소스는 리벨리온을 통해 15.7%의 크리티컬 확률과, 패시브를 통한 30%의 크리티컬 효과를 올려줄 수 있는 페르소나다.

![damage.png](/apps/article/asset/damage12.png)

보스 구간에서는 안정 영역(Stable Domain)으로 크리티컬이 발생하지는 않지만 기댓값을 바탕으로 대미지를 올려주는 형태로 계산된다.

> 크리티컬 확률 × (크리티컬 효과 - 100%)
> 

![damage.png](/apps/article/asset/damage13.png)

크리티컬 확률을 10% 올렸다면, 크리티컬 효과는 2배수인 20%를 올리는 형태가 효율이 가장 좋다.

---

# ⓔ 스킬 계수

말 그대로 스킬에 적혀있는 계수로서, 계수가 그대로 곱셈에 작용하기 때문에 캐릭터의 강함을 판단한다는 중요한 척도가 된다.

![damage.png](/apps/article/asset/damage14.png)

특이사항으로 조커의 3스킬은 추가 턴에는 25%, 디버프가 있는 적을 공격할 때 25%의 대미지가 증가한다고 표현돼 있다.

이는 기존 대미지 보너스 풀에 들어가지 않고, 스킬 계수에 작용한다고 한다. 스킬마다 기준은 알 수 없다.


> 74.2 * (100% + 25% + 25%) = 111.3%
> 

---

# ⓕ 약점 계수

페르소나 시리즈에는 전통적으로 약점이 정말 중요하다. 약점에 따른 계수는 다음과 같다.

- 약점 : 1.2배
- 일반 : 1.0배
- 내성 : 0.5배

![damage.png](/apps/article/asset/damage15.png)

---

# ⓖ 최종 대미지 보너스 / ⓗ 기타 계수

특정 기믹이나 보스전 등에는 조건에 따라 최종 대미지가 증가하거나 감소하는 형태가 있다. 별도로 계산된다.

---

# ⓘ 랜덤 범위 계수

모든 값이 계산되고 난 다음 0.95 ~ 1.05 사이의 값이 랜덤하게 곱해져서 대미지가 결정된다.

---

# 계산 예시


```markdown
ⓐ {(캐릭터 공격력 값 + 무기 공격력 값) × 공격력 % + 공격력 상수}

× ⓑ {100% + 대미지 보너스 + 속성 대미지 보너스 + 적이 받는 대미지 증가}

× ⓒ 1 - {적 방어 값 × [(100% + 추가 방어 계수) × (100% - 관통) - 방어력 감소] × (100% - 풍습 12%)} 
÷ {적 방어 값 × [(100% + 추가 방어 계수) × (100% - 관통) - 방어력 감소] × (100% - 풍습 12%) + 1400}

× ⓓ {크리티컬 효과 (크리티컬 발생 시) 또는 안정 영역}

× ⓔ 스킬 계수 

× ⓕ 약점 계수 (내성 50% / 일반 100% / 약점 120%)

× ⓖ 최종 대미지 보너스 

× ⓗ 기타 계수 

× ⓘ 랜덤 범위 계수 (0.95~1.05)
```

<br>


다음은 각각 합산된 값을 가정한 결과

- ⓐ 캐릭터 공격력 값 : 1200

- ⓐ 무기 공격력 값 : 600

- ⓐ 공격력 % : 50%

- ⓐ 공격력 상수 : 500

- ⓑ 대미지 보너스 : 50%

- ⓑ 주원 대미지 증가 : 20%

- ⓑ 적이 받는 대미지 증가 : 20%

- ⓒ 도미니온 방어력 : 400

- ⓒ 도미니온 추가 방어 계수 : 158.3% 

- ⓒ 관통 : 10%

- ⓒ 방어력 감소 : 80%

- ⓒ 풍습 상태이상 : YES 12%

- ⓓ 크리티컬 확률 : 40%

- ⓓ 크리티컬 효과 : 220%

- ⓔ 스킬 계수 : 120%

- ⓕ 약점 계수 : 120% (약점)

- ⓖ 최종 대미지 보너스 : 40%


```
ⓐ {(1200+600) × 1.5 + 500}

× ⓑ (100% + 50% + 20% + 20%)

× ⓒ 1 - {400 × (258.3% * 0.9 - 80%) × 0.88} ÷ {400 × (258.3% * 0.9 - 80%) × 0.88 + 1400}

× ⓓ (100% + 40% × (220%-100%))

× ⓔ 120%

× ⓕ 120%

× ⓖ 140%

× ⓘ 0.95~1.05

= ⓐ3200 × ⓑ1.9 ×  ⓒ0.7228 × ⓓ1.48 × ⓔ1.2 × ⓕ1.2 × ⓖ1.4 × ⓘ0.95~1.05

= 12456 ~ 13768
```

<br>

</div>

<div class="content-en" markdown="1">

> **⚠️ Important Notice**
> 
> This document is based on early Chinese Q&A content from the game. While it provides reference for understanding the direction and structure of damage calculation, the exact values may differ from the actual game.
> 
> We do not recommend attempting to calculate accurate damage. Most values and factors are hidden on the server and cannot be datamined. It is known that there are over 100 different stats that affect damage.
> 
> Therefore, the damage calculation formulas in this document should be used **for reference purposes** rather than seeking perfect accuracy. Additionally, how skill damage works varies by each character (e.g., "+20% damage increase" may sometimes mean "×1.2" or "+20%").

Persona 5X determines damage through a complex multiplication of various factors.

![damage.gif](/apps/article/asset/damage.gif)

Understanding all of these will allow you to create extraordinary damage-dealing tactics, leading to rank improvements.

Let's get straight to the final formula without further ado.

<br>

# Final Formula

```markdown
= ⓐ Attack Power Calculation × ⓑ Damage Bonus Calculation × ⓒ Enemy Defense Calculation × ⓓ Critical Calculation × ⓔ Skill Coefficient
× ⓕ Weakness Coefficient × ⓖ Final Damage Bonus × ⓗ Other Coefficients × ⓘ Random Range Coefficient
```

<br>

A more detailed formula is as follows:

```markdown
ⓐ {(Character Attack Value + Weapon Attack Value) × Attack % + Attack Constant}

× ⓑ {100% + Attack Mult. + Elemental Damage Bonus + Increased Damage Taken by Enemy}

× ⓒ 1 - {Enemy Defense Value × [(100% + Additional Defense Coefficient) × (100% - Pierce) - Defense Reduction] × (100% - Windswept 12%)} 
÷ {Enemy Defense Value × [(100% + Additional Defense Coefficient) × (100% - Pierce) - Defense Reduction] × (100% - Windswept 12%) + 1400}

× ⓓ {Critical DMG(Mult) (when Critical occurs) or Stable Domain}

× ⓔ Skill Coefficient 

× ⓕ Weakness Coefficient (Resistance 50% / Normal 100% / Weakness 120%)

× ⓖ Final Damage Bonus 

× ⓗ Other Coefficients 

× ⓘ Random Range Coefficient (0.95~1.05)
```
<br>

To increase damage, you need to consider these 9 elements, and I've detailed each one so you can significantly improve your score if you understand them.

- ⓐ Attack Power Calculation
- ⓑ Damage Bonus Calculation
- ⓒ Enemy Defense Calculation
- ⓓ Critical Calculation
- ⓔ Skill Coefficient
- ⓕ Weakness Coefficient
- ⓖ Final Damage Bonus
- ⓗ Other Coefficients
- ⓘ Random Range Coefficient


---

### **Note: Values within the same group are calculated through addition.**

**Example 1) Attack Power**

- JOKER's weapon and revelation give Attack +100%, Attack +1000
- LEON's Skill 3 buff gives Attack +19.5%, +1516

→ Attack 119.5%, Attack +2516

<br>

**Example 2) Damage Bonus**

- PANTHER's revelation 'Strife' gives Fire damage bonus 10%
- Dominion's 'Cohesion' gives damage bonus 16%

→ PANTHER's damage bonus = 26%

---

# ⓐ Attack Power

> {(Character Attack Value + Weapon Attack Value) × Attack % + Attack Constant}

<br>

### ⓐ-**1. Character Attack Value**

![awareness6.png](/apps/article/asset/damage2.png)

Each character has a base attack power, and its growth rate is determined by level and awareness.

| Awareness 0 | Awareness 1 | Awareness 2 | Awareness 3 | Awareness 4 | Awareness 5 | Awareness 6 |
| --- | --- | --- | --- | --- | --- | --- |
| 100% | 102% | 105% | 107% | 110% | 112% | 115% |

However, due to the growth rate concept, it doesn't exactly increase by 15%.

It means that the amount of growth when leveling up from base level 0 increases by 15%,

At level 80, there's approximately a 10.7% difference.

| Awareness 0 | Awareness 1 | Awareness 2 | Awareness 3 | Awareness 4 | Awareness 5 | Awareness 6 |
| --- | --- | --- | --- | --- | --- | --- |
| 1180  | 1202  | 1222  | 1244  | 1265  | 1286  | 1307  |
|+0% | +1.8% |+3.6% | +5.4% | +7.2% | +8.9% | +10.7%|

The attack power values shown are examples for Joker and differ for each character.

Generally, characters in the same position have similar values.

<br>

### ⓐ-**2. Weapon Attack Value**

Each character has their unique weapon, and the weapon's base attack power is determined by rarity and level.

Since Attack % buffs are applied after the weapon attack power is added, both options and stat values are important.

Even if you enhance weapons through duplication, the base attack power doesn't increase.

![damage.png](/apps/article/asset/damage3.png)

<br>

### ⓐ-3. Attack %

This refers to attack power that increases by % from various buffs, revelations, weapons, etc.

In the image below, 2.8% corresponds to this.

![damage.png](/apps/article/asset/damage4-1.png)

<br>

### ⓐ-4. Attack Constant

This refers to attack power that increases by regular integers from various buffs, revelations, weapons, etc.

In the image below, 46 corresponds to this. It's added after all attack power calculations are complete.

![damage.png](/apps/article/asset/damage4.png)

---

# ⓑ Damage Bonus

> {100% + Attack Mult. + Elemental Damage Bonus + Increased Damage Taken by Enemy}

<br>

### ⓑ-**1.** Damage Bonus

This includes general damage bonuses and overall content marked as damage increase that we know.

For example, Kayo's Skill 3 is a skill that increases damage bonus.

![damage.png](/apps/article/asset/damage5.png)

<br>

### ⓑ-2. Elemental Damage Bonus

This is a damage bonus that only applies to specific elements. While conditional, it's calculated as part of the existing damage bonus pool.

![damage.png](/apps/article/asset/damage6.png)

<br>

### ⓑ-3. Increased Damage Taken

This is a debuff allocated to enemies that increases the damage they take.

A notable example is Yaoring's Skill 3. Since it's tied to the enemy, this attribute disappears if the enemy dies.

![damage.png](/apps/article/asset/damage7.png)

---

# ⓒ Enemy Defense

> 1 - {Enemy Defense Value × [Defense Coefficient] × (100% - Windswept 12%)} ÷ {Enemy Defense Value × [Defense Coefficient] × (100% - Windswept 12%) + 1400}

> ※ Defense Coefficient = (100% + Additional Defense Coefficient) × (100% - Pierce) - Defense Reduction
>

<br>
This is the most complex mechanism and will be the core element you'll need to pay the most attention to going forward.

Conclusion: **If possible, it's best to reduce the boss's defense coefficient to 0**.

<br>

### ⓒ-1 Enemy Defense Value & Additional Defense Coefficient

Enemies have their unique defense values, and bosses have additional defense coefficients.

Surprisingly, despite being crucial values, these numbers can't be found anywhere in the game and must be extracted by analyzing the game client. (Even the writer can't verify them)

| **BOSS** | **Additional Defense Coefficient** | **100% + Additional Defense Coefficient** |
| --- | --- | --- |
| Sea of Souls 8★ LV89 | 163.2% | 263.2% |
| Nightmare (Guild Boss) LV82 | 158.4% | 258.4% |

These are general values, and the additional defense coefficient can change depending on the boss.

<br>

| **Nightmare (Guild Boss) LV82** | **Defense** | **Additional Defense Coefficient** |
| --- | --- | --- |
| Dominion | 363.2 | 158.4% |
| Atavaka | 1279.9 | 158.4% |
| Vishnu | 820.7 | 158.4% |
| Mini Vishnu | 363.2 | 158.4% |
| Yatsufusa | 1279.9 | **205.9%** |

The higher the defense and additional defense coefficient, the smaller the result of calculation ⓒ becomes, ultimately reducing the final damage.

<br>

### ⓒ-2 Pierce

This is an ability that can reduce the increased defense coefficient by %.

Unless it's included in the character's own mechanism, it's quite rare to obtain, and it's primarily available through revelations.

![damage.png](/apps/article/asset/damage8.png)

If Pierce is 50% and the boss is Dominion:

```markdown
※ Defense Coefficient = (100% + Additional Defense Coefficient) × (100% - Pierce) - Defense Reduction

※ Defense Coefficient = (100% + 158.4%) × (100% - 50%) = 258.4% * 0.5 = 129.2%
```

The defense coefficient decreases proportionally, making it a valuable stat with high efficiency compared to its value.

Of course, Pierce exceeding 100% is not applied.

<br>

### ⓒ-3 Defense Reduction

After the Pierce value is applied, the defense reduction value is applied.

Janosik's talen can reduce enemy defense by 41.6% for 2 turns, and through the Rakunda skill, it can reduce it by 38.8%.

If we apply Janosik's talent and Rakunda to the defense coefficient of 129.2% that we got through Pierce, the defense coefficient becomes:

```markdown
129.2% - 41.6% (Janosik talent) - 38.8% (Rakunda) = 48.8%
```

![damage.png](/apps/article/asset/damage9.png)

When putting this result into the defense calculation formula ⓒ, we can see it results in a +48.4% damage increase.

> 1 - {Enemy Defense Value × [Defense Coefficient] } ÷ {Enemy Defense Value × [Defense Coefficient] + 1400}
> 

| **Pierce** | **Defense Reduction** | Enemy Defense Value | Defense Coefficient | **ⓒ Calculation Result** |
| --- | --- | --- | --- | --- |
| 0% | 0% | 363.2 | 258.4% | 0.598 |
| 50% | 80.4% | 363.2 | 48.8% | 0.887 (+48.4%) |

The defense coefficient from defense reduction cannot go below 0.

<br>

### ⓒ-4 Windswept

> Enemy Defense Value × [Defense Coefficient] × (100% - Windswept 12%)
> 

As a status ailment, it multiplies 88% to the result after all defense coefficients are calculated.

It has the characteristic of becoming worthless if you reduce the defense coefficient to 0 through Pierce and defense reduction.

![damage.png](/apps/article/asset/damage10.png)

Generally, Personas with defense reduction effects often require Windswept.

![damage.png](/apps/article/asset/damage11.png)

<br>

### ⓒ Characteristics

While buff values like attack power and damage bonus become less efficient as they increase, defense reduction and Pierce become more efficient as their values increase (until the defense coefficient reaches 0).

In other words, since it draws a curve graph where efficiency increases as the defense coefficient approaches 0, if you're considering a strategy with defense reduction, it's better to secure as high a value as possible.

---

# ⓓ Critical

Critical damage multiplies damage by the 'Critical DMG(Mult)' amount when critical hits occur.

The base critical rate is 5%, and the base Critical DMG(Mult) is 150%, meaning there's a 5% chance to deal 1.5x damage.

Notably, Dionysus can increase critical rate by 15.7% through Rebellion, and increase Critical DMG(Mult) by 30% through its passive.

![damage.png](/apps/article/asset/damage12.png)

In boss sections, while criticals don't occur due to the Stable Domain, damage is increased based on expected value calculations.

> Critical Rate × (Critical DMG(Mult) - 100%)
> 

![damage.png](/apps/article/asset/damage13.png)

If you increase critical rate by 10%, increasing Critical DMG(Mult) by twice that amount (20%) is most efficient.

---

# ⓔ Skill Coefficient

This is literally the coefficient written on skills, and since it directly affects multiplication, it becomes an important measure in determining a character's strength.

![damage.png](/apps/article/asset/damage14.png)

As a special note, Joker's Skill 3 states that damage increases by 25% on additional turns and 25% when attacking enemies with debuffs.

It's said that this doesn't go into the existing damage bonus pool but affects the skill coefficient. The criteria can vary by skill.


> 74.2 * (100% + 25% + 25%) = 111.3%
> 

---

# ⓕ Weakness Coefficient

Traditionally in the Persona series, weaknesses are really important. The coefficients based on weaknesses are as follows:

- Weakness: 1.2x
- Normal: 1.0x
- Resistance: 0.5x

![damage.png](/apps/article/asset/damage15.png)

---

# ⓖ Final Damage Bonus / ⓗ Other Coefficients

In certain gimmicks or boss battles, there are forms where final damage increases or decreases based on conditions. These are calculated separately.

---

# ⓘ Random Range Coefficient

After all values are calculated, a random value between 0.95 ~ 1.05 is multiplied to determine the final damage.

---

# Calculation Example

```markdown
ⓐ {(Character Attack Value + Weapon Attack Value) × Attack % + Attack Constant}

× ⓑ {100% + Attack Mult. + Elemental Damage Bonus + Increased Damage Taken by Enemy}

× ⓒ 1 - {Enemy Defense Value × [(100% + Additional Defense Coefficient) × (100% - Pierce) - Defense Reduction] × (100% - Windswept 12%)} 
÷ {Enemy Defense Value × [(100% + Additional Defense Coefficient) × (100% - Pierce) - Defense Reduction] × (100% - Windswept 12%) + 1400}

× ⓓ {Critical DMG(Mult) (when Critical occurs) or Stable Domain}

× ⓔ Skill Coefficient 

× ⓕ Weakness Coefficient (Resistance 50% / Normal 100% / Weakness 120%)

× ⓖ Final Damage Bonus 

× ⓗ Other Coefficients 

× ⓘ Random Range Coefficient (0.95~1.05)
```

<br>

The following are the results assuming each summed value:

- ⓐ Character Attack Value: 1200
- ⓐ Weapon Attack Value: 600
- ⓐ Attack %: 50%
- ⓐ Attack Constant: 500
- ⓑ Damage Bonus (Attack Mult.): 50%
- ⓑ Fire Damage Increase: 20%
- ⓑ Increased Damage Taken by Enemy: 20%
- ⓒ Dominion Defense: 400
- ⓒ Dominion Additional Defense Coefficient: 158.3%
- ⓒ Pierce: 10%
- ⓒ Defense Reduction: 80%
- ⓒ Windswept Status: YES 12%
- ⓓ Critical Rate: 40%
- ⓓ Critical DMG(Mult): 220%
- ⓔ Skill Coefficient: 120%
- ⓕ Weakness Coefficient: 120% (Weakness)
- ⓖ Final Damage Bonus: 40%

```
ⓐ {(1200+600) × 1.5 + 500}

× ⓑ (100% + 50% + 20% + 20%)

× ⓒ 1 - {400 × (258.3% * 0.9 - 80%) × 0.88} ÷ {400 × (258.3% * 0.9 - 80%) × 0.88 + 1400}

× ⓓ (100% + 40% × (220%-100%))

× ⓔ 120%

× ⓕ 120%

× ⓖ 140%

× ⓘ 0.95~1.05

= ⓐ3200 × ⓑ1.9 ×  ⓒ0.7228 × ⓓ1.48 × ⓔ1.2 × ⓕ1.2 × ⓖ1.4 × ⓘ0.95~1.05

= 12456 ~ 13768
```

<br>

</div>

<div class="content-jp" markdown="1">

> **⚠️ 注意事項**
> 
> 本ドキュメントは、ゲーム初期の中国Q&Aの内容に基づいて作成されました。ダメージ計算の方向性と構造を理解するための参考としてご利用ください。正確な数値は実際のゲームと差異が生じる可能性があります。
> 
> また、正確なダメージ計算を試みることは推奨されません。ほとんどの値と要素はサーバーに隠されており、データマイニングが不可能です。ダメージに影響を与えるステータスだけでも100種類以上あることが知られています。
> 
> したがって、本ドキュメントのダメージ計算式は完璧な正確さを追求するのではなく、**参考用**としてご活用ください。また、スキルダメージの動作方法はキャラクターごとに異なる場合があります（例：「+20%ダメージ増加」が時には「×1.2」または「+20%」を意味する場合があります）。

ペルソナ5Xは、複雑な要素の乗算によってダメージが決定されます。

![damage.gif](/apps/article/asset/damage.gif)

これらをすべて理解することで、驚異的なダメージを出すタクティクスを作成でき、ランクの上昇につながります。

長い説明は省いて、まずは最終計算式から確認しましょう。

<br>

# 最終計算式

```markdown
= ⓐ 攻撃力計算 × ⓑ 攻撃倍率+計算 × ⓒ 敵防御力計算 × ⓓ クリティカル計算 × ⓔ スキル係数
× ⓕ 弱点係数 × ⓖ 最終攻撃倍率+ × ⓗ その他係数 × ⓘ ランダム範囲係数
```

<br>

より詳細な計算式は以下の通りです：

```markdown
ⓐ {(怪盗攻撃力値 + 武器攻撃力値) × 攻撃力% + 攻撃力定数}

× ⓑ {100% + 攻撃倍率+ + 属性攻撃倍率+ + 敵が受けるダメージ増加}

× ⓒ 1 - {敵防御力値 × [(100% + 追加防御係数) × (100% - 貫通) - 防御力減少] × (100% - 風襲 12%)} 
÷ {敵防御力値 × [(100% + 追加防御係数) × (100% - 貫通) - 防御力減少] × (100% - 風襲 12%) + 1400}

× ⓓ {CRT倍率 (クリティカル発生時) または安定領域}

× ⓔ スキル係数 

× ⓕ 弱点係数 (耐性 50% / 通常 100% / 弱点 120%)

× ⓖ 最終攻撃倍率+ 

× ⓗ その他係数 

× ⓘ ランダム範囲係数 (0.95~1.05)
```
<br>

ダメージを上げるためには、以下の9つの要素を考慮する必要があり、
それぞれについて詳しく説明しましたので、理解すればスコアを大きく向上させることができます。

- ⓐ 攻撃力計算
- ⓑ 攻撃倍率+計算
- ⓒ 敵防御力計算
- ⓓ クリティカル計算
- ⓔ スキル係数
- ⓕ 弱点係数
- ⓖ 最終攻撃倍率+
- ⓗ その他係数
- ⓘ ランダム範囲係数


---

### **注意：同じグループ内の値はすべて加算で計算されます。**

**例1) 攻撃力**

- JOKERの武器と啓示により攻撃力 +100%、攻撃力 +1000
- LEONのスキル3によるバフで攻撃力 +19.5%、+1516

→ 攻撃力 119.5%、攻撃力 +2516

<br>

**例2) 攻撃倍率+**

- PANTHERの啓示「争い」の火炎攻撃倍率+ 10%
- Dominionの「凝集」攻撃倍率+ 16%

→ PANTHERの攻撃倍率+ = 26%

---

# ⓐ 攻撃力

> {(怪盗攻撃力値 + 武器攻撃力値) × 攻撃力% + 攻撃力定数}

<br>

### ⓐ-**1. 怪盗攻撃力値**

![awareness6.png](/apps/article/asset/damage2.png)

各怪盗は基本攻撃力を持っており、その成長率はレベルと覚醒によって決定されます。

| 覚醒 0 | 覚醒 1 | 覚醒 2 | 覚醒 3 | 覚醒 4 | 覚醒 5 | 覚醒 6 |
| --- | --- | --- | --- | --- | --- | --- |
| 100% | 102% | 105% | 107% | 110% | 112% | 115% |

ただし、成長率の概念により、正確に15%上昇するわけではありません。

基本レベル0のステータスからレベルアップ時に成長する量が15%増加するという意味で、

レベル80基準で約10.7%の差があります。

| 覚醒 0 | 覚醒 1 | 覚醒 2 | 覚醒 3 | 覚醒 4 | 覚醒 5 | 覚醒 6 |
| --- | --- | --- | --- | --- | --- | --- |
| 1180  | 1202  | 1222  | 1244  | 1265  | 1286  | 1307  |
|+0% | +1.8% |+3.6% | +5.4% | +7.2% | +8.9% | +10.7%|

この攻撃力値はジョーカーの例で、怪盗ごとに異なります。

全体的に同じポジションの怪盗は似た数値を持ちます。

<br>

### ⓐ-**2. 武器攻撃力値**

各怪盗は固有の武器を持っており、武器の基本攻撃力はレアリティとレベルによって決定されます。

武器攻撃力が合算された状態で攻撃力%バフが入るため、オプションだけでなくステータス数値も重要です。

武器を重ねて強化しても、基本攻撃力は上昇しません。

![damage.png](/apps/article/asset/damage3.png)

<br>

### ⓐ-3. 攻撃力%

各種バフ、啓示、武器などから%で上昇する攻撃力を指します。

下の画像では2.8%がこれに該当します。

![damage.png](/apps/article/asset/damage4-1.png)

<br>

### ⓐ-4. 攻撃力定数

各種バフ、啓示、武器などから通常の整数で上昇する攻撃力を指します。

下の画像では46がこれに該当します。すべての攻撃力計算が終わった後に加算されます。

![damage.png](/apps/article/asset/damage4.png)

---

# ⓑ 攻撃倍率+

> {100% + 攻撃倍率+ + 属性攻撃倍率+ + 敵が受けるダメージ増加}

<br>

### ⓑ-**1.** 攻撃倍率+

私たちが知っている一般的な攻撃倍率+、ダメージ増加と書かれている全般的な内容を含みます。

代表的な例として、カヨのスキル3は攻撃倍率+を上げるスキルです。

![damage.png](/apps/article/asset/damage5.png)

<br>

### ⓑ-2. 属性攻撃倍率+

特定の属性に限定して上昇する攻撃倍率+で、条件付きですが既存の攻撃倍率+プールに含まれて計算されます。

![damage.png](/apps/article/asset/damage6.png)

<br>

### ⓑ-3. 受けるダメージ増加

敵に付与されるデバフで、敵が受けるダメージが増加します。

代表的な例として、ヤオリンのスキル3があります。敵に依存するため、敵が死亡した場合、この属性は消失します。

![damage.png](/apps/article/asset/damage7.png)

---

# ⓒ 敵防御力

> 1 - {敵防御力値 × [(100% + 追加防御係数) × (100% - 貫通) - 防御力減少] × (100% - 風襲 12%)} 
÷ {敵防御力値 × [(100% + 追加防御係数) × (100% - 貫通) - 防御力減少] × (100% - 風襲 12%) + 1400}

> ※ 防御係数 = (100% + 追加防御係数) × (100% - 貫通) - 防御力減少
>

<br>
最も複雑なメカニズムであり、今後最も注意を払う必要がある核心的な要素です。

結論：**可能であれば、ボスの防御係数をすべて減少させて0にできるならば、そうするのが良いでしょう**。

<br>

### ⓒ-1 敵防御力値 & 追加防御係数

敵にはそれぞれ固有の防御力数値があり、ボスには追加防御係数が存在します。

驚くべきことに、これらの数値は非常に重要な数値にもかかわらず、ゲーム内のどこにも見つけることができず、ゲームクライアントを分析して逆算する必要があります。（筆者も確認不可能）

| **BOSS** | **追加防御係数** | **100% + 追加防御係数** |
| --- | --- | --- |
| 心の海 8★ LV89 | 163.2% | 263.2% |
| 悪夢（ギルドボス） LV82 | 158.4% | 258.4% |

これは一般的な数値で、ボスによって追加防御係数が変わることもあります。

<br>

| **悪夢（ギルドボス） LV82** | **防御力** | **追加防御係数** |
| --- | --- | --- |
| ドミニオン | 363.2 | 158.4% |
| アタバク | 1279.9 | 158.4% |
| ヴィシュヌ | 820.7 | 158.4% |
| ミニ ヴィシュヌ | 363.2 | 158.4% |
| ヤツフサ | 1279.9 | **205.9%** |

防御力が高いほど、追加防御係数が高いほど、ⓒの計算結果値は小さくなり、結果として最終ダメージが減少します。

<br>

### ⓒ-2 貫通

増加した防御係数を%単位で減少させることができる能力値です。

怪盗自体のメカニズムに含まれない限り、入手先が本当に少なく、代表的に啓示から獲得可能です。

![damage.png](/apps/article/asset/damage8.png)

貫通が50%で、ボスがドミニオンの場合：

```markdown
※ 防御係数 = (100% + 追加防御係数) × (100% - 貫通) - 防御力減少

※ 防御係数 = (100% + 158.4%) × (100% - 50%) = 258.4% * 0.5 = 129.2%
```

防御係数が比例して減少するため、数値対比で効用性が非常に高い貴重な能力値です。

当然、100%を超える貫通は適用されません。

<br>

### ⓒ-3 防御力減少

貫通数値が適用された後、防御力減少数値が適用されます。

ヤノシクのパッシブは敵の防御力を2ターンの間41.6%減少させることができ、さらにラクンダスキルで38.8%減少させることができます。

貫通で129.2%にした防御係数にヤノシクのパッシブとラクンダを適用すると、防御係数は次のようになります：

```markdown
129.2% - 41.6% (ヤノシクパッシブ) - 38.8% (ラクンダ) = 48.8%
```

![damage.png](/apps/article/asset/damage9.png)

この結果を防御力計算式ⓒに入れると、+48.4%のダメージ増加になることがわかります。

> 1 - {敵防御力値 × [防御係数] } ÷ {敵防御力値 × [防御係数] + 1400}
> 

| **貫通** | **防御力減少** | 敵防御力値 | 防御係数 | **ⓒ 計算結果** |
| --- | --- | --- | --- | --- |
| 0% | 0% | 363.2 | 258.4% | 0.598 |
| 50% | 80.4% | 363.2 | 48.8% | 0.887 (+48.4%) |

防御力減少による防御係数は0以下にはなりません。

<br>

### ⓒ-4 風襲

> 敵防御力値 × [防御係数] × (100% - 風襲 12%)
> 

状態異常として、防御係数がすべて計算された結果に88%を掛けることになります。

前述の貫通と防御力減少で防御係数を0にした場合、価値が0になるという特徴があります。

![damage.png](/apps/article/asset/damage10.png)

一般的に、防御力減少効果を持つペルソナは風襲を必要とすることが多いです。

![damage.png](/apps/article/asset/damage11.png)

<br>

### ⓒ 特徴

攻撃力、攻撃倍率+などのバフ数値は量が多くなるほど効率が下がりますが、防御力減少と貫通はその数値が高くなるほど効率が上がります（防御係数が0になるまで）。

つまり、防御係数が0に近づくほど効率が上がる曲線グラフを描くため、防御力減少を考慮した戦略であれば、できるだけ高い値を確保するのが良いでしょう。

---

# ⓓ クリティカル

クリティカルダメージは、クリティカル発動時に「CRT倍率」分だけダメージを乗算して敵に与えます。

基本CRT発生率は5%、基本CRT倍率は150%で、5%の確率で1.5倍のダメージを与えます。

代表的な例として、ディオニュソスはリベリオンで15.7%のCRT発生率と、パッシブを通じて30%のCRT倍率を上げることができるペルソナです。

![damage.png](/apps/article/asset/damage12.png)

ボス区間では安定領域によってクリティカルは発生しませんが、期待値をもとにダメージを上げる形で計算されます。

> CRT発生率 × (CRT倍率 - 100%)
> 

![damage.png](/apps/article/asset/damage13.png)

CRT発生率を10%上げた場合、CRT倍率は2倍の20%を上げる形が最も効率が良いです。

---

# ⓔ スキル係数

文字通りスキルに書かれている係数で、係数がそのまま乗算に作用するため、怪盗の強さを判断する重要な指標となります。

![damage.png](/apps/article/asset/damage14.png)

特記事項として、ジョーカーの3スキルは追加ターンには25%、デバフがある敵を攻撃する時に25%のダメージが増加すると表現されています。

これは既存の攻撃倍率+プールには入らず、スキル係数に作用すると言われています。スキルごとに基準は不明です。


> 74.2 * (100% + 25% + 25%) = 111.3%
> 

---

# ⓕ 弱点係数

ペルソナシリーズには伝統的に弱点が本当に重要です。弱点による係数は以下の通りです：

- 弱点：1.2倍
- 通常：1.0倍
- 耐性：0.5倍

![damage.png](/apps/article/asset/damage15.png)

---

# ⓖ 最終攻撃倍率+ / ⓗ その他係数

特定のギミックやボス戦などでは、条件に応じて最終ダメージが増加または減少する形があります。別途計算されます。

---

# ⓘ ランダム範囲係数

すべての値が計算された後、0.95 ~ 1.05の間の値がランダムに乗算されてダメージが決定されます。

---

# 計算例

```markdown
ⓐ {(怪盗攻撃力値 + 武器攻撃力値) × 攻撃力% + 攻撃力定数}

× ⓑ {100% + 攻撃倍率+ + 属性攻撃倍率+ + 敵が受けるダメージ増加}

× ⓒ 1 - {敵防御力値 × [(100% + 追加防御係数) × (100% - 貫通) - 防御力減少] × (100% - 風襲 12%)} 
÷ {敵防御力値 × [(100% + 追加防御係数) × (100% - 貫通) - 防御力減少] × (100% - 風襲 12%) + 1400}

× ⓓ {CRT倍率 (クリティカル発生時) または安定領域}

× ⓔ スキル係数 

× ⓕ 弱点係数 (耐性 50% / 通常 100% / 弱点 120%)

× ⓖ 最終攻撃倍率+ 

× ⓗ その他係数 

× ⓘ ランダム範囲係数 (0.95~1.05)
```

<br>

以下は各値を合算した仮定の結果：

- ⓐ 怪盗攻撃力値: 1200
- ⓐ 武器攻撃力値: 600
- ⓐ 攻撃力%: 50%
- ⓐ 攻撃力定数: 500
- ⓑ 攻撃倍率+: 50%
- ⓑ 火炎ダメージ増加: 20%
- ⓑ 敵が受けるダメージ増加: 20%
- ⓒ ドミニオン防御力: 400
- ⓒ ドミニオン追加防御係数: 158.3%
- ⓒ 貫通: 10%
- ⓒ 防御力減少: 80%
- ⓒ 風襲状態異常: YES 12%
- ⓓ CRT発生率: 40%
- ⓓ CRT倍率: 220%
- ⓔ スキル係数: 120%
- ⓕ 弱点係数: 120% (弱点)
- ⓖ 最終攻撃倍率+: 40%

```
ⓐ {(1200+600) × 1.5 + 500}

× ⓑ (100% + 50% + 20% + 20%)

× ⓒ 1 - {400 × (258.3% * 0.9 - 80%) × 0.88} ÷ {400 × (258.3% * 0.9 - 80%) × 0.88 + 1400}

× ⓓ (100% + 40% × (220%-100%))

× ⓔ 120%

× ⓕ 120%

× ⓖ 140%

× ⓘ 0.95~1.05

= ⓐ3200 × ⓑ1.9 ×  ⓒ0.7228 × ⓓ1.48 × ⓔ1.2 × ⓕ1.2 × ⓖ1.4 × ⓘ0.95~1.05

= 12456 ~ 13768
```

<br>

</div> 