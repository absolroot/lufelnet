(function () {
    window.characterReview = window.characterReview || {};
    window.characterReview["키라"] = { name_en: "Kira Kitazato", name_jp: "北里 基良", codename: "MESSA",
        review: `
단일 대상에 특화된 물리 딜러로, **『사냥꾼』 ↔ 『집행관』** 상태를 전환하며 『유혈』 중첩을 쌓고 『절개』로 폭발시키는 구조를 가진다.

A0~A1에서는 『유혈』을 누적하고 유지하는 “출혈형”, A6에서는 『절개』를 연쇄로 터뜨리는 “폭발형”으로 운용 방식이 달라진다. 

<br>

**A0~A1 (출혈형)**  
  『사냥꾼』 폼을 위주로 『유혈』 누적 및 갱신.  
  - S1 → HL로 5중첩 확보 → S2로 결산 및 유지 → 마지막 턴 종료 시 단기『집행관』 진입.  

<br>

**A6 (폭발형)**  
  『집행관』 폼을 위주로 『절개』를 반복.  
  - 출혈 13스택 누적 이후 『밤의 장막』 진입 → S1/S2 연계로 『절개』발동.`,
review_en: `
A single-target Physical attacker who switches between **Hunter** and **Executioner** forms, stacking **Bleed** and detonating it through **Rend** damage.

From **Awareness 0–1**, Kira focuses on building and maintaining Bleed stacks as a “Bleed-type”;  
from **Awareness 6**, he transitions into a “Burst-type” that repeatedly triggers **Rend**.  
Burst-oriented play becomes viable starting from Awareness 1.

<br>

**A0–A1 (Bleed-type)**  
  Focus on stacking and refreshing **Bleed** in **Hunter Form**.  
  - Use S1 → HL to apply 5 stacks → maintain with S2 → enter **Executioner Form** briefly at the end of turn.  

<br>

**A6 (Burst-type)**  
  Focus on repeatedly triggering **Rend** in **Executioner Form**.  
  - After reaching 13 **Bleed** stacks, activate **Night Veil** → chain S1/S2 to trigger **Rend** bursts.

`,
 
review_jp: `
単体特化の物理アタッカーで、**『狩人』↔『執行官』** フォームを切り替えながら **『ユーレット』（出血）** を蓄積し、**『裂傷』（レンディング）** で爆発させる構造を持つ。

**覚醒A0〜A1**では『ユーレット』を蓄積・維持する「出血型」、  
**A6**では『裂傷』を連鎖的に発動する「爆発型」として運用が変化する。  
A1からでも「爆発型」の運用は十分可能。

<br>

**A0〜A1（出血型）**  
  『狩人』フォームを中心に『ユーレット』を蓄積・更新。  
  - S1 → HLで5スタック確保 → S2で決算と維持 → ターン終了時に短時間『執行官』化。  

<br>
  
**A6（爆発型）**  
  『執行官』フォームを主体に『裂傷』を連続発動。  
  - 『ユーレット』を13スタックまで貯めた後、『夜の帳』を発動 → S1/S2連携で『裂傷』を誘発。

`,
        pros: ["체력 비례 대미지를 통해 스토리 모드를 효율적으로 클리어할 수 있다."],
        pros_en: ["It can efficiently clear story mode through HP-scaling damage."],
        pros_jp: ["HP割合ダメージを活用してストーリーモードを効率的にクリアできます。"],
        cons: ["대부분의 보스가 체력 비례 대미지 감소 효과를 가지고 있어 키라의 도트 대미지의 효율이 급감한다."],
        cons_en: ["Most bosses have HP-scaling damage reduction effects, which drastically decreases the effectiveness of Kira's Bleed damage."],
        cons_jp: ["大多数のボスはHP割合ダメージ軽減効果を持っており、そのためキラの持続ダメージ（ドット）効率は大幅に低下します。"],
    };
})();


