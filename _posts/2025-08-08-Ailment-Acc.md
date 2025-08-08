---
layout: article
title: "효과명중 적용 방식"
date: 2025-08-08 00:00:00 +0900
categories: [Guide]
tags: [guide]
author: Root
thumbnail: /apps/article/asset/ailment acc.gif
translations:
  kr:
    title: "효과명중 적용 방식"
  en:
    title: "Ailment Accuracy Mechanism"
  jp:
    title: ""
---

<div class="content-kr" markdown="1">

<img src="/apps/article/asset/ailment acc1.png" >

P5X에는 다양한 효과가 있고 확률을 가지고 있다.

대표적으로 토모코의 스킬3이 예시인데 LV12인 경우 **81.3%**의 기본확률로 적을 수면 상태에 빠뜨리는 확률을 지니고 있다.

그러나 **토모코에게 효과 명중을 계시 카드를 통해 20% 넘게 부여해줘도 적이 100% 수면 상태에 빠지지 않는다**.

효과 명중이 단순 합계산이 아니기 때문에 일어나는 일로 개발사 답변에 따르면 아래와 같은 계산식을 지니게 된다.

---

# 계산식

```markdown
ⓐ 기본 확률 ×  (1 + ⓑ 효과 명중 합) ÷  (1 + ⓒ 적의 효과 저항) 
```

<br>

## ⓐ 기본 확률

<img src="/apps/article/asset/ailment acc2.png" >

기본 확률은 스킬이나 효과에 작성돼 있는 확률이다. 예를 들어 나르키소스의 '현기증' 스킬은 LV6 기준 32.6%의 기본 확률을 가지고 있다.

<br>

## ⓑ 효과 명중 합

<img src="/apps/article/asset/ailment acc3-1.png" >

나르키소스의 경우 기본 패시브로 최대 42.9% (24.9% + 18%)의 효과 명중을 획득 할 수 있고,

<br>

<img src="/apps/article/asset/ailment acc3.png" >

원더는 별도로 기본 80%의 효과 명중을 챙길 수 있다.이 경우는 42.9% + 80% = 122.9%의 효과 명중을 획득한다.

이외에도 각종 패시브나 무기, 스킬 효과 등을 통해 효과 명중을 올릴 수 있으며 이 모든 것의 + 합을 의미한다.

<br>

## ⓒ 적의 효과 저항

각 적마다 고유한 효과 저항 수치를 지니고 있다.

이 수치는 과거 대미지 계산식에서 언급됐던 적의 방어력 수치와 동일하게 **공개되지 않은 수치**다. 

(게임사는 얼른 적의 세부 수치를 인게임 내에서 확인할 수 있도록 하라!)

---

# 계산 예시

만약 적의 효과 저항이 10%라고 가정했을 경우 위 상황에서 나르키소스의 '현기증' 스킬은 다음과 같은 확률로 적에게 부여된다.

- 현기증 기본 확률 32.6%
- 나르키소스 패시브 + 원더 효과 명중 122.9%
- 효과 저항 10%

```markdown
32.6% * (1 + 122.9%) / (1 + 10%) = 32.6% * 2.229 / 1.1 = 66.05%
```

<br>

적의 효과 저항이 없다고 가정했을 경우 현기증 효과를 100% 적에게 명중 시키려면

100% / 32.6% - 1 = 206.7%의 효과 명중이 필요하다.

---

참조 : https://gall.dcinside.com/mgallery/board/view/?id=persona5phantomx&no=86272

<br>

</div>

<div class="content-en" markdown="1">

<img src="/apps/article/asset/ailment acc1.png" >

P5X contains various effects that have chance rates.

A representative example is Tomoko’s Skill 3 — at LV12, it has a **base chancey of 81.3%** to inflict Sleep on the enemy.

However, **even if you grant Tomoko more than +20% Ailment Accuracy through Revelation cards, enemies will not be inflicted with Sleep at 100% chance**.

This happens because Ailment Accuracy is not calculated through simple addition.  
According to the developer’s response, the calculation formula is as follows:

---

# Formula

```
ⓐ Base Chance × (1 + ⓑ Total Ailment Accuracy) ÷ (1 + ⓒ Enemy’s Ailment Resistance)
```

<br>

## ⓐ Base Chance

<img src="/apps/article/asset/ailment acc2.png" >

The base chancey is the chance written in the skill or effect description. For example, Narcissus’s “Vertigo” (paraphrase) skill has a base chancey of 32.6% at LV6.

<br>

## ⓑ Total Ailment Accuracy

<img src="/apps/article/asset/ailment acc3-1.png" >

Narcissus can gain up to 42.9% (24.9% + 18%) Ailment Accuracy through their innate passive.

<br>

<img src="/apps/article/asset/ailment acc3.png" >

Wonder separately can have a base 80% Ailment Accuracy.  
In this case, it would be 42.9% + 80% = 122.9% Ailment Accuracy.

In addition, you can increase Ailment Accuracy through various passives, weapons, and skill effects. This refers to the **total sum** of all such bonuses.

<br>

## ⓒ Enemy’s Ailment Resistance

Each enemy has its own unique Ailment Resistance value.

Like the enemy DEF stat mentioned in the past damage formula, **this value is not publicly displayed**.

(Game company, please let us check detailed enemy stats in-game soon!)

---

# Example Calculation

If we assume the enemy’s Ailment Resistance is 10%, Narcissus’s “Vertigo” skill in the above situation would have the following chance to inflict it:

- Vertigo Base Chance: 32.6%  
- Narcissus passive + Wonder Ailment Accuracy: 122.9%  
- Ailment Resistance: 10%

```
32.6% * (1 + 122.9%) / (1 + 10%) = 32.6% * 2.229 / 1.1 = 66.05%
```

<br>

If we assume the enemy has no Ailment Resistance, to inflict Vertigo with 100% certainty:

100% / 32.6% - 1 = 206.7% Ailment Accuracy is required.

---

Reference: https://gall.dcinside.com/mgallery/board/view/?id=persona5phantomx&no=86272

</div>

<div class="content-jp" markdown="1">

<img src="/apps/article/asset/ailment acc1.png" >

P5Xには、確率を持つさまざまな効果が存在します。

代表的な例としては朋子のスキル3があり、LV12の場合、**基礎確率81.3%**で敵を睡眠状態にする確率を持っています。

しかし、**朋子に啓示カードで20%以上の状態異常命中率（Ailment Accuracy）を付与しても、敵を100%睡眠状態にすることはできません**。

これは、状態異常命中率が単純な加算計算ではないために起こる現象です。  
開発側の回答によると、計算式は以下の通りです。

---

# 計算式

```
ⓐ 基礎確率 × (1 + ⓑ 状態異常命中率合計) ÷ (1 + ⓒ 敵の状態異常耐性)
```

<br>

## ⓐ 基礎確率

<img src="/apps/article/asset/ailment acc2.png" >

基礎確率とは、スキルや効果に記載されている確率です。  
例えば、ナルキッソスの「めまい」(義役)スキルはLV6時点で基礎確率32.6%を持っています。

<br>

## ⓑ 状態異常命中率合計

<img src="/apps/article/asset/ailment acc3-1.png" >

ナルキッソスは固有パッシブにより最大42.9%（24.9% + 18%）の状態異常命中率を獲得できます。

<br>

<img src="/apps/article/asset/ailment acc3.png" >

ワンダーは別途、基礎で80%の状態異常命中率を持つことができます。  
この場合、42.9% + 80% = 122.9%の状態異常命中率となります。

このほかにも、さまざまなパッシブや武器、スキル効果によって状態異常命中率を上げることができ、これらすべての**合計値**を指します。

<br>

## ⓒ 敵の状態異常耐性

敵ごとに固有の状態異常耐性値を持っています。

過去のダメージ計算式で触れた敵の防御力数値と同様に、**この値は公開されていません**。

（運営さん、早くゲーム内で敵の詳細ステータスを確認できるようにしてください！）

---

# 計算例

敵の状態異常耐性が10%だと仮定した場合、上記状況でナルキッソスの「めまい」スキルが付与される確率は次の通りです。

- めまい基礎確率：32.6%  
- ナルキッソスのパッシブ + ワンダーの状態異常命中率：122.9%  
- 状態異常耐性：10%

```
32.6% * (1 + 122.9%) / (1 + 10%) = 32.6% * 2.229 / 1.1 = 66.05%
```

<br>

敵の状態異常耐性がないと仮定した場合、めまいを100%の確率で付与するには：

100% / 32.6% - 1 = 206.7%の状態異常命中率が必要です。

---

参照: https://gall.dcinside.com/mgallery/board/view/?id=persona5phantomx&no=86272

</div>