/**
 * 일본어 공통 번역
 * 
 * Japanese translations for common UI elements, navigation, buttons, messages, etc.
 */

export default {
    // ナビゲーション
    nav: {
        home: 'ホーム',
        character: '怪盗',
        persona: 'ペルソナ',
        revelations: '啓示',
        tactic: 'タクティク',
        tier: 'ティア',
        about: 'アバウト'
    },

    // 共通ボタンとアクション
    common: {
        loading: '読み込み中...',
        save: '保存',
        cancel: 'キャンセル',
        confirm: 'OK',
        close: '閉じる',
        delete: '削除',
        edit: '編集',
        add: '追加',
        remove: '削除',
        reset: 'リセット',
        search: '検索',
        filter: 'フィルター',
        sort: 'ソート',
        showMore: 'もっと見る',
        showLess: '閉じる',
        copy: 'コピー',
        share: 'シェア',
        download: 'ダウンロード',
        upload: 'アップロード',
        submit: '送信',
        apply: '適用',
        clear: 'クリア'
    },

    // 日時
    time: {
        today: '本日',
        yesterday: '昨日',
        tomorrow: '明日',
        daysLeft: '日後',
        daysAgo: '日前',
        hours: '時間',
        minutes: '分',
        seconds: '秒'
    },

    // ゲーム用語 (i18n-utils.jsより)
    gameTerms: {
        // 基本ステータス
        hp: 'HP',
        maxHp: '最大HP',
        attack: '攻撃力',
        defense: '防御力',
        speed: '速さ',

        // ダメージ関連
        dmgBonus: '攻撃倍率+',
        critRate: 'CRT発生率',
        critMult: 'CRT倍率',
        pierce: '貫通',
        defReduction: '防御力減少',

        // 効果関連
        ailmentAccuracy: '状態異常命中',
        effectResi: '効果耐性',
        healing: '治療',
        healingEffect: 'HP回復量',
        shieldEffect: 'シールド効果',
        dmgReduction: 'ダメージ減少',

        // その他
        spRecovery: 'SP 回復',
        resonance: '追撃',
        naviPower: 'ステータス強化',
        labor: '職責',
        myPalace: 'マイパレス',

        // 武器と意識
        awareness: '意識',
        exclusiveWeapon: '専用武器',
        weapon: '武器',
        passive: 'パッシブ',

        // ペルソナとスキル
        persona: 'ペルソナ',
        skill: 'スキル',
        level: 'レベル',
        stack: 'スタック',

        // 戦闘
        allOutAttack: '総攻撃',
        counterAttack: '反撃',
        taunt: '挑発',
        down: 'ダウン',
        theurgy: 'テウルギア',

        // 属性
        fire: '火炎',
        ice: '氷結',
        electric: '電撃',

        // 状態異常
        burn: '燃焼',
        freeze: '凍結',
        shock: '感電',
        sleep: '睡眠',
        forget: '忘却',
        curse: '呪怨',
        windswept: '風襲',

        // バフ/デバフ
        buff: 'バフ',
        debuff: 'デバフ',
        blessing: '祝福',
        shield: 'シールド',

        // その他効果
        dot: 'DOT',
        dotRecovery: 'DOT回復',
        revive: '復活',
        transform: '変身',
        charge: 'チャージ',
        additionalTurn: '追加ターン',

        // イメジャリー
        mindscape: 'イメジャリー',
        minds5: 'イメジャリー5',

        // 啓示
        revelation: '啓示',
        wonder: 'ワンダー',

        // ターン
        '1turn': '1ターン',
        '2turns': '2ターン',
        '3turns': '3ターン',
        '4turns': '4ターン',
        '5turns': '5ターン',
        '6turns': '6ターン',

        // 範囲
        aoe: '全体',
        single: '単体',
        self: '自分'
    },

    // 意識レベル
    awarenessLevel: {
        a0: '凸0',
        a1: '凸1',
        a2: '凸2',
        a3: '凸3',
        a4: '凸4',
        a5: '凸5',
        a6: '凸6'
    },

    // 武器強化
    refinement: {
        r0: '武器凸0',
        r1: '武器凸1',
        r2: '武器凸2',
        r3: '武器凸3',
        r4: '武器凸4',
        r5: '武器凸5',
        r6: '武器凸6',
        enhanced: '(強化)'
    },

    // 啓示
    revelation: {
        sun: '旭',
        moon: '月',
        star: '星',
        sky: '天',
        space: '宙',
        sunMoonStarSky: '旭月星天',

        // 啓示タイプ
        common: '共通',
        control: '主権',
        departure: '旅立ち',
        labor: '労働',
        resolve: '決意',
        freedom: '自由',
        triumph: '凱旋',
        hope: '希望',
        desperado: 'タフガイ'
    },

    // エラーメッセージ
    errors: {
        loadFailed: 'データの読み込みに失敗しました。',
        saveFailed: '保存に失敗しました。',
        networkError: 'ネットワークエラーが発生しました。',
        invalidInput: '無効な入力です。',
        notFound: 'データが見つかりません。',
        accessDenied: 'アクセスが拒否されました。',
        unknownError: '不明なエラーが発生しました。'
    },

    // 成功メッセージ
    success: {
        saved: '保存されました。',
        deleted: '削除されました。',
        copied: 'クリップボードにコピーされました。',
        updated: '更新されました。'
    },

    // 確認メッセージ
    confirm: {
        delete: '本当に削除しますか？',
        reset: 'リセットしますか？',
        unsavedChanges: '保存されていない変更があります。続行しますか？'
    },

    // ラベル
    labels: {
        total: '全体',
        count: '個',
        unitPerson: '人',
        unitTime: '回',
        unitDay: '日',
        required: '必須',
        optional: '任意',
        recommended: '推奨',
        new: '新規',
        hot: '人気',
        updated: '更新済み'
    },

    // 속성 번역
    elements: {
        "만능": "万能",
        "물리": "物理",
        "총격": "銃撃",
        "화염": "火炎",
        "빙결": "氷結",
        "전격": "電撃",
        "질풍": "疾風",
        "염동": "念動",
        "핵열": "核熱",
        "축복": "祝福",
        "주원": "呪怨",
        "버프": "バフ",
        "디버프": "デバフ",
        "디버프광역": "デバフ広域"
    },

    // 직업 번역
    positions: {
        "구원": "救済",
        "굴복": "屈服",
        "반항": "反抗",
        "방위": "防衛",
        "우월": "優越",
        "지배": "支配",
        "해명": "解明",
        "자율": "自律"
    }
};
