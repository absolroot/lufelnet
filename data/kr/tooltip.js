const tooltip = {
    //원소이상
    "동결" : "원소 이상, 2턴 동안 공격력이 12% 감소한다.",
    "감전" : "원소 이상, 2턴 동안 받는 크리티컬 확률이 10% 증가한다.",
    "풍습" : "원소 이상, 2턴 동안 방어력이 12% 감소한다.",
    "화상" : "원소 이상, 2턴 동안 턴마다 생명 5%를 잃는다.",

    //상태이상
    "축복" : "2턴 동안 턴마다 최대 생명의 1%를 회복한다.",
    "주원" : "2턴 동안 턴마다 최대 생명 1%에 상당하는 대미지를 받는다.",

    //정신이상
    "정신 이상":"현기증, 망각, 수면, 광노, 절망, 공포, 혼란, 세뇌 위 8가지 상태는 정신 이상에 속한다.",
    "망각" : "정신 이상, 스킬을 사용할 수 없다.",
    "수면" : "정신 이상, 행동할 수 없고 턴마다 생명 5%와 SP 5%를 회복한다. 대미지를 받은 후 제거된다.",
    "절망" : "정신 이상, 행동이 불가하다. 턴마다 일정한 SP가 차감되고 몇 턴 후 사망한다.",
    "광노" : "정신 이상, 공격력이 증가하고, 방어력이 감소한다. 근접 공격만 사용할 수 있고, 임의의 목표를 공격한다.",
    "현기증" : "정신 이상, 행동할 수 없다.",
    "세뇌" : "정신 이상으로 행동이 불가능하며, 동료를 공격한다.",

    //기타
    "추가 효과": "특정 조건을 만족하면 발동 가능하다.",

    //레오
    "활성" : "임의의 동료의 생명이 75% 이하일 시 『활성』을 획득하고, 공격력이 증가한다.",

    // 렌
    "살기" : "자신의 턴 종료 시 생명이 60% 미만인 적이 1명 있을 때마다 『살기』를 1개 획득하며, 적 한 명당 조커에게 『살기』를 1개만 줄 수 있다. 세 개를 모으면 추가 턴 1개를 획득한다.",

    // 루페르
    "별의 불꽃 III": "공격력이 루페르 공격력 8%만큼 상승하고, 화염 대미지가 20% 증가하며 받는 치료효과가 10% 증가한다. 1턴간 지속된다.",
    "별의 불꽃 II": "공격력이 루페르 공격력 8%(최대 320)만큼 상승 1턴간 지속되고, 효과가 종료되면 [별의 불꽃 III]로 변환된다.",
    "별의 불꽃 I":"공격력이 루페르 공격력 4%(최대 160)만큼 상승한다. 1턴간 지속되고, 효과가 종료되면 [별의 불꽃 II]로 변환된다.",
    "별의 불꽃" : "루페르의 스킬로 해당 상태를 부여해 1턴 동안 동료에게 속성을 제공한다. 『별의 불꽃Ⅰ』 효과 종료 시 『별의 불꽃Ⅱ』로 레벨업한다. 의식 레벨업 후 『별의 불꽃Ⅱ』 효과 종료 시 『별의 불꽃Ⅲ』으로 레벨업한다. 『별의 불꽃Ⅱ』, 『별의 불꽃Ⅲ』은 더 강력한 속성 증가 효과를 보유한다.",
    "타오르는 불길": "루페르의 스킬1",
    "희망의 빔": "루페르의 스킬2",
    "천사의 연민": "루페르의 스킬3",

    //루우나
    "열렬한 환영": "루우나의 스킬1 『뜨거운 악수』를 사용하고 난 후 획득한다.",
    "집요한 추격": "루우나의 스킬2 『악당에 대한 경고』를 사용하고 난 후 획득한다.",
    "GOGO 멍멍!": "루우나의 스킬3, 『열렬한 환영』 또는 『집요한 추격』을 보유 시 해제된다.",
    "대악당" : "적 진영의 임의의 목표가 추격 스킬 또는 화염 속성 스킬을 받으면 1중첩이 소모되며, 2턴 동안 대미지가 증가한다",

    // 류지
    "리바운드":"자신의 턴 종료 시 자신의 생명이 75% 미만일 경우 해당 효과를 획득하고 다음 스킬로 인한 대미지가 증가한다.",

    // 리코
    "허점":"받는 대미지가 6% 증가하며 1회 공격을 받으면 격파된다. 격파될 때 리코는 『정보』를 2개 획득한다. 목표가 약점 대미지/일반 대미지를 받은 경우, 다운 수치가 추가로 1포인트 감소한다. 다운 수치가 1포인트 추가로 감소할 때마다 리코는 『정보』를 1개 추가로 획득한다.",
    "정보":"『허점』격파 시 획득하는 자원 (최대 8회 중첩 가능). 타네무라 리코가 『은은한 이슬비』를 시전하면 『정보』를 모두 소모하고, 모든 동료의 공격력으로 주는 대미지가 증가한다.",

    // 리코·매화
    "낙화":"질풍 속성 대미지를 받을 경우, 해당 대미지의 공격력이 증가한다.",
    "개화":"잠재력 『만개」가 제공하는 버프 상태다. 타네무라 리코 · 매화가 『매화의 잔향』을 사용한 후, 스킬 메인 목표가 2턴 동안 지속되는 『꽃망울』 상태를 획득한다.스킬 대미지를 1회 줄 때마다 『개화』 1중첩을 획득하고, 3턴동안 공격력이 증가한다(10회 중첩 가능). 『개화』가 5중첩 도달 시 타네무라 리코 · 매화의 크리티컬 효과를 기반으로 공격력이 추가 증가한다. 『개화』가 10중첩 도달 시 타네무라 리코 · 매화의 크리티컬 효과를 기반으로 크리티컬 효과가 추가 증가한다.",

    // 마사키
    "성결의 가호": "3턴 동안 일정 대미지를 막을 수 있는 실드이며, 중첩할 수 없다. 대미지를 받았을 때, 방패의 실드량을 우선 소모한다.",
    "정직의 성인": "일정 대미지를 막을 수 있는 실드이며 3턴 동안 지속된다.",
    "정의 선언": "다음에 시전하는 『연민의 축복』또는 『명예 수호』가 추가 효과를 획득한다.",

    // 마코토
    "강인" : "공격력이 6% 증가하고, 방어력이 2% 증가한다.",
    "철의 의지": "공격력이 40% 증가하고 방어력이 20% 증가한다. 『핵열 치명타』가 『핵융합 과부하』로 진화된다.",
    "방사선" : "적이 받는 대미지가 15% 증가하고, 원소 이상 1종으로 간주한다.",

    //미나미
    "암리타": "중첩마다 미야시타 미나미에게 15%의 최대 생명 증가를 제공하고 모든 『암리타』 중첩수를 소모해서 『봄의 은혜』의 스킬 효과를 강화할 수 있다.",

    //미유
    "바다의 수호": "받는 실드 효과가 증가하고 『바다의 수호』중첩 횟수에 따라 추가 버프가 발동된다. (6회 중첩 가능)",

    // 모르가나
    "직감" : "동료가 적을 공격할 때, 임의의 동료의 생명이 70% 미만이면 모르가나가 광역 치료 효과를 1회 시전한다.",

    // 모토하·여름
    "한여름" : "자신의 크리티컬 확률, 대미지, 스킬 효과가 증가한다.",

    // 몽타뉴
    "얼음 결정": "코토네 몽타뉴 고유의 특수 전투 자원인 『얼음 결정』이 일정 수량에 도달한 후 자신의 턴 종료 시 『칼끝의 댄서』가 발동된다.",
    "칼끝의 댄서": "코토네 몽타뉴의 『얼음 결정』이 일정 수량에 도달하면 빙결 속성 공격이 1회 발동되며, 해당 공격은 추가 효과로 간주된다.",
    "차가운 칼날": "코토네 몽타뉴의 액티브 스킬, 『얼음 결정』이 일정 중첩수에 도달하면 해당 스킬에 목표가 잃은 생명에 해당하는 추가 보너스가 부여된다.",

    // 몽타뉴·백조
    "아침 이슬 결정": "코토네 몽타뉴·백조 고유의 특수 전투 자원, 최대 5개까지 획득할 수 있다. 『아침 이슬 결정』수량이 많을수록 『봄의 결계』종료 시 주는 추가 효과의 대미지가 증가한다.",
    "겨울 서리 결정": "코토네 몽타뉴·백조 고유의 특수 전투 자원, 최대 5개까지 획득할 수 있다. 『겨울 서리 결정』수량이 많을수록 『겨울밤의 결계』종료 시 주는 추가 효과의 대미지가 증가한다.",
    "풍상" : "코토네가 해당 유닛 공격 시 크리티컬 효과가 증가하며 2턴 동안 지속된다.",
    "동파" : "2턴 동안 받는 빙결 대미지가 증가한다.",
    "얼음봉인" : "행동 불가",

    //세이지
    "격려":"시라토리 세이지가 스킬을 시전하면 일정 확률로 획득한다. 시라토리 세이지의 공격력과 속도가 일정량 증가한다.",

    //슌
    "황야의 구세주":"카노 슌이 공격을 받은 후 획득한다. 자신의 턴 종료 시 『황야의 구세주』를 소모해 자신의 생명을 일정량 회복한다.",

    //아야카
    "열성 관객":"사카이 아야카 공격력에 따라 공격력 증가를 획득한다. 『즉흥 독주』스킬 사용에 따라 1명의 동료를 선택할 수 있다.",

    //안
    "몰두":"적이 화염 속성 대미지를 받을 시 카운트를 진행한다. 카운트가 4회에 도달하면 타카마키 안이 『몰두』상태에 진입하고, 타카마키 안이 속성 증가와 스킬 강화를 획득한다.",

    //야오링
    "맹파탕": "다음에 시전하는 액티브 스킬에 일정 확률로 망각 효과가 추가되고, 일부 스킬이 강화된다.",
    "추억": "『추억』이 40포인트 도달 시 『맹파탕』을 획득한다.",

    //야오링·사자무
    "불꽃놀이 유성": "『철꽃의 춤』 상태에서 시전할 수 있으며, 모든 적에게 공격력 기반의 화염 속성 대미지를 주고, 화염 속성 TECHNICAL을 준다. 화상 상태인 적에게 TECHNICAL을 주면 TECHNICAL 효과가 증가한다.",
    "화염 속성 TECHNICAL" : "일부 화염 속성 스킬이 특정 상태의 적에게 추가 효과를 준다.\n화염 속성 스킬이 화상 상태인 적에게 TECHNICAL을 주면 『폭발 연소』를 발동해 스킬 대미지가 2% 증가한다.\n화염 속성 스킬이 동결 상태인 적에게 TECHNICAL을 주면 『얼음의 불길』을 발동해 2턴 동안 50%의 기본 확률로 목표가 받는 화염/빙결 속성 대미지가 5% 증가한다.\n화염 속성 스킬이 풍습 상태의 적에게 TECHNICAL을 주면 『화염 돌풍』을 발동해 추가로 목표의 최대 생명 1%에 해당하는 화염 속성 대미지를 1회 준다.",
    "폭발 연소":"화염 속성 스킬이 화상 상태인 적에게 TECHNICAL을 주면 『폭발 연소』를 발동해 스킬 대미지가 2% 증가한다.",
    "세월의 불꽃":"매턴마다 리 야오링・사자무 공격력 기반의 화염 속성 대미지를 받으며 2턴 동안 지속된다(4회 중첩 가능).",
    "철꽃의 춤":"주는 대미지가 증가하고, 기간 동안 근접 공격이 『불꽃놀이 유성』으로 강화되며 효과는 1턴 동안 또는 『불꽃놀이 유성』을 시전할 때까지 지속된다.",

    //유스케
    "유룡전포": "대미지를 받으면 키타가와 유스케가 일정 확률로 적에게 반격해 빙결 속성 대미지를 준다.",
    "용의 포효": "키타가와 유스케의 반격 확률이 100%로 상승하며, 반격 공격이 광역 공격으로 변하고, 위력이 증가한다.",
    "조롱": "자신을 적의 공격 목표로 만든다.",

    //유우미
    "믹스·DELUXE/믹스/러프": "믹스·DELUXE: 3개의 동일 속성의 『풍미』로 제조되어 품질이 뛰어나다. 시이나 유우미의 스킬 효과를 최대 효과로 강화시켜 준다.\n믹스: 2개의 동일 속성의 『풍미』로 제조되어 품질이 좋다. 시이나 유우미의 스킬 효과를 비교적 높게 강화시켜 준다.\n러프: 3개의 동일 속성의 『풍미』로 제조되어 품질이 비교적 좋다. 시이나 유우미의 스킬 효과를 강화시켜 준다.",
    "믹스·DELUXE": "3개의 동일 속성의 『풍미』로 제조되어 품질이 뛰어나다. 시이나 유우미의 스킬 효과를 최대 효과로 강화시켜 준다.",
    "믹스・DELUXE": "3개의 동일 속성의 『풍미』로 제조되어 품질이 뛰어나다. 시이나 유우미의 스킬 효과를 최대 효과로 강화시켜 준다.",
    "믹스": "2개의 동일 속성의 『풍미』로 제조되어 품질이 좋다. 시이나 유우미의 스킬 효과를 비교적 높게 강화시켜 준다.",
    "러프": "3개의 동일 속성의 『풍미』로 제조되어 품질이 비교적 좋다. 시이나 유우미의 스킬 효과를 강화시켜 준다.",
    "칵테일": "시이나 유우미의 특수 전투 자원으로 『믹스·DELUXE』,『믹스』,『러프』 3종류가 포함되어 있다. 시이나 유우미는 스킬 시전 시, 『칵테일』을 소모해 스킬 효과를 강화한다.",

    //유이
    "추격" : "임의의 괴도가 페르소나 스킬을 시전해 대미지를 주면, YUI가 35%의 고정 확률로 즉시 스킬의 메인 목표를 추격해 공격력 80%의 전격 속성 대미지를 준다",

    //유키미
    "에너지 충전": "후지카와 유키미, 그리고 『맹세』상태인 동료가 축복 효과를 획득할 시 『에너지 충전』을 획득하며, 『절대 심판』스킬로 주는 대미지가 증가한다.",
    "맹세": "후지카와 유키미 턴 시작 시 임의의 동료와 『맹세』하고, 유키미의 턴 종료 시 『맹세』상태인 동료가 실드를 획득한다.",

    //카스미
    "춤사위":"요시자와 카스미의 스킬로 『브레이브 스텝』과 『스위프트 스텝』 두 가지 춤사위 효과를 획득할 수 있다. 2중첩 도달 시 변신하여 가면무도회 상태에 진입한다.",
    "가면무도회":"가면무도회 상태에서 HIGHLIGHT를 1회 사용할 수 있다. 해당 효과는 요시자와 카스미가 『가면무도회』 상태로 두 번째 턴이 시작할 때까지 지속된다.",

    //카요
    "열렬한 가무":"『리듬』수량이 4개가 되면 『열렬한 가무』를 시전해 모든 동료의 공격력, 방어력, 효과 명중이 증가한다.",
    "리듬":"스킬 사용 후 토미야마 카요가 다양한 수량의 『리듬』을 획득한다. 『리듬』수량이 4개가 되면 『열렬한 가무』를 시전해 모든 동료의 공격력, 방어력, 효과 명중이 증가한다.』",

    //키라
    "사냥꾼":"키타자토 키라의 기본 상태, 적에게 『유혈』 상태를 추가, 결산, 갱신할 수 있다.",
    "유혈":"키타자토 키라가 『사냥꾼』 상태일 때 적에게 추가되며, 턴마다 자신의 최대 생명에 기반한 만능 속성 대미지와 키타자토 키라 공격력의 물리 속성 대미지를 받는다.",
    "집행관":"키타자토 키라가 『밤의 장막』을 사용하면 『집행관』 상태로 전환하여 스킬 모드가 변한다. 적의 『유혈』 중첩수를 제거하고 추가로 『절개』 대미지를 준다.",
    "절개":"키타자토 키라가 『집행관』 상태에서 스킬을 사용하면, 목표에게 『유혈』 3중첩이 있을 때마다 키타자토 키라가 목표에게 추가로 『절개』 대미지를 1회 준다.",
    "절단 기법/죄악의 게임": "키타자토 키라의 스킬1",
    "치명적 쾌감/커튼콜": "키타자토 키라의 스킬2",
    "밤의 장막": "키타자토 키라의 스킬3",
    "죄악의 게임": "키타자토 키라의 『집행관』상태에서의 스킬1",

    //키요시
    "헌제자":"쿠로타니 키요시가 스킬 시전 시 『헌제자』 상태를 획득한다. 중첩마다 모든 동료가 주는 화염 대미지가 증가하지만, 쿠로타니 키요시가 스킬을 시전할 때 현재 생명의 일정량을 잃는다(최대 5회 중첩 가능).",
    "성화":"턴 시작 시 쿠로타니 키요시 최대 생명에 따른 화염 속성의 대미지를 주며 2턴 동안 지속된다.",

    //토모코
    "푸른 잎":"노게 토모코의 특수 자원, 스킬 시전에 사용한다.",

    //토모코·여름
    "화려한 불꽃":"임의 동료가 스킬을 사용한 후 동시에 적의 전체 『불꽃』 수가 3에 도달하면 노게 토모코・여름이 『화려한 불꽃』을 발동한다. 모든 적의 『불꽃』 3중첩을 제거하고 모든 적에게 염동 속성 대미지를 주며, 적이 주는 대미지를 감소시킨다. 동시에 모든 동료가 일정량의 생명을 획득한다.",
    "불꽃":"노게 토모코・여름 스킬은 적에게 『불꽃』을 추가한다. 적이 사망한 경우, 해당 『불꽃』은 다른 적에게 임의로 분배된다. 임의 동료가 스킬을 사용한 후 동시에 적의 총 『불꽃』 수가 3에 도달하면 노게 토모코・여름은 『화려한 불꽃』을 발동한다.",

    //토시야
    "시" : "『시』 14개를 수집하면 『운명의 십사행시』를 발동해 1명의 적에게 주원 속성 대미지를 줄 수 있다.",
    "운명의 십사행시" : "임의의 14개 『시』를 획득해 챕터를 완료하면, 현재 공격을 받은 메인 목표에게 단일 주원 대미지 추가 효과를 준다.",
    "증오 시": "특수 『시』, 『운명의 십사행시』에 주원 효과를 추가한다.",
    "치유 시": "특수 『시』, 『운명의 십사행시』에 치료 효과를 추가한다.",
    "열정 시": "특수 『시』, 『운명의 십사행시』에 만능 대미지를 추가한다.",

    //하루
    "조준점": "오쿠무라 하루에게『조준점』이 있을 경우, 스킬 시전 시 추가 효과가 발생합니다. 오쿠무라 하루의 총격 후 제거됩니다. 최대 3턴 동안 지속되며 최대 5회 중첩할 수 있습니다. (중첩마다 독립 계산).",

    //하루나
    "동심": "니시모리 하루나가 스킬 사용 시 모든 『동심』을 소모해 모든 동료의 공격력을 증가시킨다.",
    "총애": "『총애』상태인 동료가 스킬을 사용해 대미지를 주면 니시모리 하루나가 『동심』을 획득한다.",


    //페르소나
    "조준" : "2턴 동안 적의 방어력이 29.6% 감소한다.",
    "호령" : "페르소나 스킬을 시전해 대미지를 줄 시, 『호령』을 1중첩 소모해 1턴 동안 주는 대미지가 15%, 공격력이 6.4% 증가한다.",

    //미오
    "스킬 마스터" : "TECHNICAL로 주는 추가 효과 강도에 영향을 주며, 스킬 마스터가 100포인트 증가할 때마다 (100포인트 미만인 부분은 같은 비율로 증가): \n『폭발 연소』의 스킬 대미지 증가 효과가 10% 증가한다.\n『서늘한 번개』의 스킬 대미지 증가 효과가 10% 증가한다.\n『얼음의 불길』의 화염/빙결 속성 허약 효과가 5% 증가한다.\n『화염 돌풍』이 주는 추가 대미지가 6% 증가한다.\n『얼음 봉인』의 기본 확률이 2.5% 증가한다.",
    "빙결 속성 TECHNICAL" : "일부 빙결 속성 스킬은 특정 상태의 적에게 추가 효과를 준다.\n- 빙결 속성 스킬이 감전 상태인 적에게 TECHNICAL을 주면 『서늘한 번개』를 발동해 스킬 대미지가 2% 증가한다.\n- 빙결 속성 스킬이 화상 상태인 적에게 TECHNICAL을 주면 『얼음의 불길』을 발동해 일정 턴 동안 목표가 받는 화염/빙결 속성 대미지가 5% 증가한다.\n- 빙결 속성 스킬이 동결 상태인 적에게 TECHNICAL을 주면 『얼음 봉인』을 발동해 일정 턴 동안 2%의 기본 확률로 목표를 얼음 봉인 상태에 빠뜨린다.",
    "얼음 봉인": "1턴 동안 행동 불가가 적용된다.",
    "얼음의 불길": "화염 속성 스킬이 동결 상태인 적에게 TECHNICAL을 주거나 빙결 속성 스킬이 화상 상태인 적에게 TECHNICAL을 주면 『얼음의 불길』을 발동해 2턴 동안 50%의 기본 확률로 목표가 받는 화염/빙결 속성 대미지가 5% 증가한다.",
    "서늘한 번개": "빙결 속성 스킬이 감전 상태인 적에게 TECHNICAL을 주면 『서늘한 번개』를 발동해 스킬 대미지가 2% 증가한다.",
    "TECH 이상" : "TECHNICAL로 발동한 이상 상태에는 『얼음의 불길』, 『얼음 봉인』등이 포함된다.",

    //사나다
    "다운 특수 공격" : "다운 상태인 적 공격 시 총 대미지가 증가하며, 해당 효과는 별도의 보너스입니다.",
    "반드시 크리티컬을 발동" : "크리티컬 기본 확률이 5%에서 임시로 100%까지 증가한다.",

    //이치고
    "원념" : "4턴 동안 턴마다 시카노 이치고의 공격력 18%의 주원 속성 대미지를 받는다 (10회 중첩 가능). 『원념』을 가진 적이 사망하면 체력이 가장 많은 적에게 전이된다 (주원 속성이 무,흡,반인 적에게는 전이되지 않음).",

}

const tooltip_en = {
//Common
    "Resonance" : "An effect that will be activated when specific conditions are met.",
    "Technical" : "[Skill] Some skills will activate effects if certain conditions are met.",
    "inflict Curse" : "[Status] Lose 1% HP for 2 turns.",
    "Blessing" : "[Status] Recover 1% HP for 2 turns.",
    "Taunt" : "[Status] Enemies will prioritize targeting the user.",
    "Elemental Ailment" : "Burn, Freeze, Shock, and Windswept are classified as elemental ailments.",
    "Windswept" : "[Elemental Ailment] Decrease Defense by 12% for 2 turns.",
    "Burning" : "[Elemental Ailment] Lose 5% HP for 2 turns.",
    "Burn" : "[Elemental Ailment] Lose 5% HP for 2 turns.",
    "Freeze" : "[Elemental Ailment] Decrease Attack by 12% for 2 turns.",
    "Shocked" : "[Elemental Ailment] Increase critical taken rate by 10% for 2 turns.",
    "Shock": "[Elemental Ailment] Increase critical taken rate by 10% for 2 turns.",
    "Fire Technical" : "Some fire skills have other effects on foes in certain states.",
    "Fireburn" : "After activating, increase damage dealt to target by 2%.",
    "Spiritual Ailments" : "Dizzy, Forget, Sleep, Rage, Despair, Confuse, Fear, and Brainwash are classified as spiritual ailments.",
    "Sleep" : "[Spiritual Ailment] Unable to act. Recover 5% HP and SP every turn. Removed after taking damage from an attack.",
    "Forget" : "[Spiritual Ailment] Cannot use skills.",

    //Leon
    "Power of Friendship" : "[Count] Increase allies' Attack when granted.",

    //Fleuret
    "Right to Strike" : "[Count] Increase Seiji's Attack and Speed.",

    //Yuki
    "Oath" : "[Status] At the end of Yukimi's action, grant a shield to the selected ally.",
    "Gavel" : "[Count] When spent, deal Bless damage to 1 foe, increase party's Attack, and grant shield.",

    //Puppet
    "Seashell" : "[Count] Increase ally shield and various stats based on number of stacks.",

    //Mont
    "Ice Crystal" : "[Count] When a certain amount is spent, activates Blade Dancer.",
    "Blade Dancer" : "[Resonance] After using a skill, if at a certain number of Ice Crystal stacks or higher, deal Ice damage to foes as a follow up. This effect counts as a Resonance.",
    "Durandal of Ice" : "[Skill] Deal Ice damage to 1 foe. When Kotone has a set number of Ice Crystal attacks and Parhelion is active, increase damage based on foe's missing HP.",

    //Sepia
    "Verse of Hate" : "[Count] When spent to activate Sonnet of Fate, chance to inflict Curse on foe.",
    "Verse of Healing" : "[Count] When spent to activate Sonnet of Fate, restore HP of ally with the lowest remaining HP.",
    "Verse of Passion" : "[Count] When spent to activate Sonnet of Fate, deal bonus Almighty damage to foe.",
    "Sonnet of Fate" : "[Resonance] With a certain number of Verse stacks, when an ally acts, deal follow-up Curse damage to 1 foe.",
    "Verse of Zenith" : "[Count] Gain the effects of all Verses at once.",
    "Verse" : "[Count] With a certain number of stacks, when an ally acts, deal follow-up Curse damage to 1 foe.",
    
    //Key
    "Chosen One" : "[Count] Increase party's fire damage. When using a skill, take damage.",
    "Sacred Flame" : "[Status] When target foe takes action, deal Fire damage (2 turns).",

    //Okyann
    "Beat" : "[Count] When spending a certain number of stacks, activate Pulsating Rhythm for all allies.",
    "Pulsating Rhythm" : "[Count] Increase party's Attack, Defense, and Status Ailment Accuracy.",

    //Moko
    "Greenleaf" : "[Count] Spent when Tomoko uses certain skills.",

    //Soy	
    "Desperado" : "[Status] At the end of an action, recover HP.",

    //Cattle
    "Starfire III" : "[Status] Allies healed using skills gain Starfire, increasing Attack for 1 turn.",
    "Starfire II" : "[Status] Allies healed using skills gain Starfire, increasing Attack for 1 turn.",
    "Starfire I" : "[Status] Allies healed using skills gain Starfire, increasing Attack for 1 turn.",
    "Starfire" : "[Status] Allies healed using skills gain Starfire, increasing Attack for 1 turn.",

    //Vino
    "Radiation" : "[Elemental Ailment] Increase Nuclear damage by 15% for 2 turns.",

    //Ann
    "La Vie en Rose" : "[Status] When dealing Fire damage to foes, gain 1 Passion stack. With 4 Passion stacks, gain this status at start of action and increase Attack.",

    //Mona
    "Chivalry" : "[Count] Spend stacks to heal the party's HP.",

    //Skull
    "Rebound" : "[Condition] Next skill used deals increased damage.",

    //Riddle
    "Affection" : "[Status] When allies granted this status deal damage with a skill, Haruna gains Childish Heart and Mystery.",
    "Childish Heart" : "[Count] When spent, increase party's Attack.",

    //Rin
    "Memory" : "[Count] After spending a certain number of stacks, gain Meng Po Soup.",
    "Meng Po Soup" : "[Count] Spend all when using a skill. Chance to inflict Forget and increase the effect of certain skills.",
    "Waters of Oblivion" : "[Count] Foes take increased damage based on Speed.",

    //Joker	
    "Will of Rebellion" : "[Count] At 3 stacks, able to take an extra action. Spend 3 stacks after the extra action is taken.",

    //Marian
    "Diagnosis" : "[Count] Increase Minami's max HP by 15% for each stack. When using certain skills, spend all stacks to strengthen those skills' effects.",

    //Fox
    "Inspiration" : "[Status] After taking damage from enemy skills, random chance to counterattack and deal Ice damage.",
    "Imagination" : "[Status] 100% chance to counterattack. Change to multi-target and increase damage.",
    "Vision & Emotion" : "[Status] Change counterattacks to deal 2 consecutive hits with pierce effect.",
    "Creation" : "[Status] 100% chance to counterattack. Change to multi-target, increase damage, and deal 2 consecutive hits with pierce effect.",
    
    //Queen
    "Tenacity" : "[Count] Increase Makoto's Attack by 6% and Defense by 2%.",
    "Crash Out" : "[Effect] Increase Makoto's Attack by 40% and Defense by 20% for 2 turns, and Nuclear Fury evolves to Thermonuclear Fury.",

    //Phoebe
    "Cocktail" : "[Count] Created when Phoebe gains Mixers. There are 3 levels of quality: Tailor-Made, Standard, and Basic. When using skills, spend a Cocktail to increase various effects.",
    "Cocktails" : "[Count] Created when Phoebe gains Mixers. There are 3 levels of quality: Tailor-Made, Standard, and Basic. When using skills, spend a Cocktail to increase various effects.",
    "Tailor-Made" : "[Effect] A cocktail created with 3 Mixers of the same attribute.",
    "Standard" : "[Effect] A cocktail created with 2 Mixers of the same attribute.",
    "Basic" : "[Effect] A cocktail created with 3 Mixers of the different attributes.",
    "Mixer" : "[Count] Gain 1 Mixer when allies deal damage to foes with skills, Resonances, or Highlights. After reaching 3 stacks, create a Cocktail based on the types of Mixers.",
}