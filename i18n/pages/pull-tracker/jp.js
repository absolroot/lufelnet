window.I18N_PAGE_PULL_TRACKER_JP = {
  seo: {
    individual: {
      title: 'ガチャ履歴 - ペルソナ5 ザ・ファントムX',
      description: 'P5Xガチャの契約情報を記録し、統計を確認してください。',
      ogLocale: 'ja_JP'
    },
    global: {
      title: '全体統計 - ペルソナ5 ザ・ファントムX',
      description: 'P5Xガチャの全体統計と日別推移を確認できます。',
      ogLocale: 'ja_JP'
    },
    guide: {
      title: 'Pull Tracker URL ガイド',
      description: 'ガチャ履歴URL取得方法の案内',
      ogLocale: 'ja_JP'
    }
  },
  individual: {
    nav: {
      home: 'ホーム',
      current: 'ガチャ履歴'
    },
    pageTitle: 'ガチャ履歴 (beta)',
    cardsTitle: '統計（直近90日）',
    inputLabel: 'URL取得方法',
    placeholder: 'ここにリンクを貼り付けてください...',
    labels: {
      debugExample: 'DEBUG サンプル:'
    },
    buttons: {
      start: '取得',
      clear: 'クリア',
      hideUnder4: '4★ 以下を隠す',
      exampleApply: 'サンプル適用'
    },
    info: {
      ready: '契約履歴のURLを貼り付けて、"取得"ボタンを押してください。',
      notice: '直近90日の履歴のみ取得できます。それ以前の履歴は、ゲームサーバーから取得できません。\n契約回数が多い場合、読込に5分以上かかる可能性があります。各URLには有効期限があるため、期限が切れた場合は再取得が必要です。',
      helpText: '·  ローカルデータはお使いのブラウザに保存され、閲覧データをすべて削除すると消去されます。\n·  Google ドライブにログインすると、ご自身の Google Drive に保存・同期できます。\n·  URL で送信される情報にアカウント情報は含まれません。データは統計（iant.kr/gacha）に利用される場合があります。\n·  Special Thanks To : Iant / TheROoNCo'
    },
    auth: {
      signedIn: 'ログイン:',
      login: 'ログイン',
      logout: 'ログアウト',
      scopeNote: '※ このサイトで作成したファイルのみ読み書きできます。',
      driveLabel: 'Google Drive'
    },
    loading: {
      title: 'サーバーから履歴を取得しています...',
      detail: 'ネットワーク状況やサーバー負荷により時間がかかる場合があります。',
      noticeLong: '直近90日のガチャ数によっては10分以上かかる場合があります。処理中はブラウザを閉じないでください。',
      elapsed: '経過時間: {m}分 {s}秒'
    },
    status: {
      sending: 'リクエスト送信中...',
      waiting: 'サーバーの応答を待機中...',
      tryGet: '処理中...',
      invalidUrl: '有効なURLを入力してください。',
      done: '完了（応答バイト数: {bytes}）',
      failed: 'エラーが発生しました。時間をおいて再度お試しください。',
      complete: '✅ Complete',
      savedLocal: 'ローカルに保存しました。',
      loadedLocal: 'ローカルから読み込みました。',
      loadedDrive: 'Drive から読み込みました。',
      savedDrive: 'Drive に保存しました。',
      deletedDrive: 'Drive から削除しました。',
      deleteDriveFailed: 'Drive の削除に失敗しました。',
      allDeleted: 'ブラウザに保存されたすべてのデータを削除しました。',
      driveForbidden: 'Google Drive へのアクセスが拒否されました（403）。権限や設定をご確認ください。',
      driveNeedConsent: 'Drive へのアクセス許可が必要です。上部のログインを押して許可してください。',
      driveNoData: 'Drive に保存されたデータがありません。',
      noData: '保存されたデータはありません。',
      driveQuotaExceeded: 'Google ドライブの保存容量が上限に達しました。空き容量を確保してください。',
      exampleApplyFailed: 'サンプル適用に失敗しました。',
      recordAdded: '記録を追加しました。',
      recordUpdated: '記録を更新しました。',
      recordDeleted: '記録を削除しました。',
      adjustmentSaved: '補正を保存しました。'
    },
    confirm: {
      reset: '本当に初期化しますか？\nこの操作により、このブラウザに保存されたガチャデータ(最後のURL/レスポンスを含む)がすべて削除されます。\n※ Google Drive のバックアップには影響しません。'
    },
    overview: {
      pullsUnit: '回',
      limited5: '★5 限定',
      section: {
        character: 'キャラクター',
        weapon: '武器',
        standard: '通常'
      }
    },
    manual: {
      tag: '手動'
    },
    lower: {
      andBelow: '以下'
    },
    merge: {
      fileTitle: 'ファイルから読み込み',
      driveTitle: 'Drive から読み込み',
      message: '新しいデータをどのように適用しますか？\n\nマージ: 既存の記録と結合\n上書き: 現在の記録を新しいデータで置き換え',
      cancel: 'キャンセル',
      merge: 'マージ',
      overwrite: '上書き'
    },
    bannerNames: {
      gold: 'ゴールド',
      fortune: 'フォーチュン',
      weapon: '武器',
      weapon_confirmed: '武器確定',
      confirmed: '確定',
      newcomer: '新米怪盗サポート'
    },
    table: {
      total: '総ガチャ数',
      totalInProgress: '総数 / 進行中',
      count: '合計',
      rate: '割合',
      avg: '平均回数',
      win: '勝利',
      rule: '保証',
      fiveStarHistory: '5★ 詳細',
      timesSuffix: '回',
      tooltip_confirmed: '確定: 5★ 110回, 4★ 10回。\n5★確率および50%勝利は(総数 - 進行中)で計算します。',
      tooltip_fortune: 'フォーチュン: 5★ 80回, 4★ 10回 (50% ルール)。\n5★確率および50%勝利は(総数 - 進行中)で計算。\n50%勝利の可否はゲームサーバーが提供していないため、限定キャラクターかどうかで推定しています。状況によっては正確性が低下する場合があります。\n\n50%に失敗した場合、次は無条件で成功するので、回数が増えると期待値は66.6%になります。',
      tooltip_gold: '通常: 5★ 80回, 4★ 10回。\n5★確率は(総数 - 進行中)で計算。',
      tooltip_weapon: '武器: 5★ 70回, 4★ 10回 (50% ルール)。\n5★確率および50%勝利は(総数 - 進行中)で計算。\n50%勝利の可否はゲームサーバーが提供していないため、限定キャラクターかどうかで推定しています。状況によっては正確性が低下する場合があります。\n\n50%に失敗した場合、次は無条件で成功するので、回数が増えると期待値は66.6%になります。',
      tooltip_weapon_confirmed: '武器確定: 5★ 95回, 4★ 10回。\n5★確率は(総数 - 進行中)で計算します。',
      tooltip_newcomer: '新米怪盗サポート: 5★ 50回, 4★ 10回。\n5★確率は(総数 - 進行中)で計算。',
      fiveTotal: '5★ 回数',
      fivePityRate: '5★ 率',
      fiveAvg: '5★ 平均回数',
      win5050Count: '50% 勝利(回数)',
      win5050Rate: '50% 勝利(率)',
      fourTotal: '4★ 回数',
      fourPityRate: '4★ 率',
      fourAvg: '4★ 平均回数'
    }
  },
  global: {
    nav: {
      home: 'ホーム',
      current: '全体統計'
    },
    pageTitle: '全体統計',
    note: 'lufel.net/iant.krのユーザーからの投稿データに基づきます。\n※ P5Xサーバーの記録は50:50勝利の情報を提供していません。現在は限定キャラを勝利として計算しています。そのため、PHOEBEやMARIANなどは勝利基準に含まれず、数値が高く/低く見える場合があります。',
    labels: {
      avg: '平均',
      count: '★5 合計',
      loseRate: '50:50 敗北率',
      pullsByDay: '★5 日別回数',
      charAvg: 'キャラ ★5 平均',
      charLimitedAvg: 'キャラ限定 ★5 平均',
      charCnt: 'キャラ ★5 獲得数',
      weapAvg: '武器 ★5 平均',
      weapLimitedAvg: '武器限定 ★5 平均',
      weapCnt: '武器 ★5 獲得数'
    },
    words: {
      unitTimes: '回',
      unitCount: '回',
      obtained: '獲得',
      pickupSuccess: '成功'
    },
    names: {
      Confirmed: 'TARGET',
      Fortune: 'CHANCE',
      Gold: '通常',
      Weapon: '武器',
      Weapon_Confirmed: '武器確定',
      Newcomer: '新米怪盗サポート'
    },
    list: {
      header: {
        name: '名前',
        total: '合計',
        percent: '%'
      },
      more: 'もっと見る',
      titles: {
        limited: '★5 限定リスト',
        standard: '★5 通常リスト',
        weapon: '★5 武器リスト'
      }
    },
    tabs: {
      all: '全体',
      w3: '3週',
      w6: '6週',
      w9: '9週'
    },
    pity: {
      legendChance: 'Chance %',
      legendTotal5: 'Total Pull 5★'
    },
    hover: {
      daily: '{date}\nTotal 5★: {count}',
      pity: 'Pity {pity}\nChance%: {chance}\nTotal Pull 5★: {count}'
    },
    status: {
      loadFailed: 'Load failed'
    },
    units: {
      avgSuffix: ' 回'
    }
  },
  guide: {
    nav: {
      home: 'ホーム',
      back: 'ガチャ履歴',
      current: 'URL ガイド'
    },
    pageTitle: 'URL ガイド',
    introWindows: '現在は PC Windows 向けの方法のみ提供しています。',
    s1: 'FAQ を確認してください。',
    s2: 'ご利用のOSを選択してください。（Android の方法の情報を募集しています）',
    s3: '次の2つからURL取得方法を選択: 専用プログラム / 直接抽出',
    m1s1: 'PC で P5X を起動します。',
    m1s2: 'リンクから P5X_Gacha_Tools をダウンロード/解凍して起動。',
    m1s3: 'P5X でガチャ履歴を開きます。エラー表示は想定内です。',
    m1s4: '地域選択 → [Try Find URL] → Copy で URL を取得。',
    m1s5: 'プログラムを終了します。',
    m1s6: '下のリンクからコピーした URL を入力してください。',
    m2s1: '方法2は以下のリンクを参照。',
    m2s2: '下のリンクからコピーした URL を入力してください。',
    programTitle: 'プログラムについて',
    troubleshootButton: 'トラブルシューティング',
    downloadLabel: 'プログラムをダウンロード',
    sourceCode: 'source code',
    goBack: 'Go Back',
    os: {
      win: 'Windows',
      ios: 'iOS'
    },
    ios1: 'App Store から Stream アプリをインストール。',
    ios2: 'Stream の「Sniff Now」を押して VPN/CA を許可・インストール・信頼します。',
    ios3: 'P5X でガチャ履歴を開きます。',
    ios4: 'Stream → Sniff History に戻り、下記のサーバーに合った URL を含むリクエストを見つけ、長押ししてリンク全体をコピーします。\n(KR) nsywl-krcard.wmupd.com\n(CN) nsywl-gfcard.wmupd.com\n(TW) wwwidcweb.p5x.com.tw\n(JP) web.p5xjpupd.com\n(EN) euweb.p5xjpupd.com\n(SEA) web.p5x-sea.com',
    ios5: '下のリンクからコピーした URL を入力してください。',
    videoLabel: '動画ヘルプ',
    videoNote: '（手順は同じで、ドメインのみ地域により異なります。）',
    streamOpen: 'Stream インストールページを開く',
    modal: {
      faqTitle: 'FAQ',
      programTitle: 'プログラムについて',
      troubleshootTitle: 'トラブルシューティング',
      close: '閉じる'
    },
    faq: {
      text1: `Q. どのように動作するのですか？
A. P5Xの記録は基本的にWeb URLを通じて取得されます。ゲーム内で記録を表示すると一時的なキーが発行され、このサイトはそのキーを使ってP5Xサーバーと通信し、ガチャ履歴を取得します。

Q. 安全ですか？BANされることはありませんか？
A. P5Xが公式に記録を表示する方法と同じ仕組みを利用しています。ゲームファイルやメモリを改ざんすることは一切ないため、安全だと言えます。ただし、この機能の利用に関する責任は利用者ご自身にあります。

Q. 情報がハッキングされることはありませんか？
A. lufel.netはゲーム内のUIDや関連キーを一切保存しません。このプロジェクトはオープンソースです。URLを取得するツールについてはiant.kr/gachaの説明を参照してください。もしツールの利用が不安であれば、方法2を用いて自分でURLを抽出することもできます。

Q. ネットワークの流れを見ましたが、なぜ直接P5Xサーバーにリクエストを送らず、別のサーバーを経由するのですか？
A. CORSの制限により、直接P5XサーバーAPIにリクエストを送ることはできません。そのため、リクエスト情報はいったんiant.krサーバーに転送され、そこで処理されます。

Q. ではどのような情報が保存されますか？
A. ガチャ記録以外の情報は一切保存されません。また、その記録はどのプレイヤーのものかは残らず、純粋に統計目的でのみ使用されます。

Q. すべての記録が表示されないのはなぜですか？
A. P5Xでは直近90日以内の記録しか提供されません。バックアップがない限り、残念ながらそれ以前の記録は確認できません。（私も自分のを見たいです…）`,
      text2: `Q. このプログラムはどのように動作しますか？
A. 本プログラムは一時的に hosts ファイルを修正し、ガチャ情報取得ページへの接続をユーザーのコンピュータ（127.0.0.1）にリダイレクトします。ガチャ情報取得ページに到達できない場合、ユーザーログに一時的なキーが表示され、それをプログラムが自動的に抽出してコピーします。プログラムを終了すると、hosts ファイルは元の状態に復元されます。詳しくは以下のリンクの説明をご参照ください：iant.kr/gacha`
    },
    troubleshoot: {
      title: 'トラブルシューティング',
      button: 'トラブルシューティング',
      body: `1. プログラムを起動するとエラーが発生します。
管理者権限で実行してください。

2. プログラムを実行してもウィンドウが表示されません。
PC に .NET 8.0 がインストールされている必要があります。未インストールの場合は、以下のリンクからダウンロードしてインストールしてください。
https://dotnet.microsoft.com/ko-kr/download

3. URL 取得後、ゲーム内でガチャ履歴を開くたびに「読み込みできません」と表示されます。
プログラムを再起動して終了してください。それでも同じエラーが続く場合は、
C:\\Windows\\System32\\drivers\\etc\\hosts を開き、以下の内容を削除して保存してください。

127.0.0.1 nsywl-krcard.wmupd.com
127.0.0.1 nsywl-gfcard.wmupd.com
127.0.0.1 wwwidcweb.p5x.com.tw
127.0.0.1 web.p5xjpupd.com
127.0.0.1 euweb.p5xjpupd.com
127.0.0.1 web.p5x-sea.com`
    }
  },
  manualEditor: {
    addRecord: '記録追加',
    editRecord: '記録編集',
    get5Star: '5★ 追加',
    get4Star: '4★ 追加',
    character: 'キャラクター',
    weapon: '武器',
    dateTime: '日時',
    atPity: '天井',
    atPityUnit: '回',
    grade: 'レア度',
    save: '保存',
    cancel: 'キャンセル',
    delete: '削除',
    close: '閉じる',
    search: '検索...',
    maxPity: '最大',
    originalReadonly: '自動取得データは削除のみ可能です',
    confirmDelete: 'この記録を削除しますか？',
    selectCharacter: 'キャラクター選択',
    selectWeapon: '武器選択',
    noResults: '結果なし',
    historyTitle: '獲得履歴',
    manualTag: '手動',
    autoTag: '自動'
  },
  adjustModal: {
    title: '回数補正',
    originalTotal: '元の総数',
    additionalPulls: '追加回数',
    displayTotal: '表示される総数',
    originalProgress: '元の進行中',
    progressAdjust: '進行中調整',
    displayProgress: '表示される進行中',
    note: '※ 元データは保持され、表示のみ調整されます。',
    reset: 'リセット'
  },
  io: {
    export: {
      label: 'エクスポート',
      noData: 'エクスポートするデータがありません。',
      failed: 'エクスポートに失敗しました。'
    },
    import: {
      label: 'インポート',
      imported: 'ファイルから読み込みました。',
      failed: 'インポートに失敗しました。'
    },
    drive: {
      saveLabel: 'Drive 保存',
      loadLabel: 'Drive 読み込み',
      saved: 'Drive に保存しました。',
      loadedOk: 'Drive から読み込みました。',
      loadedNone: 'Drive に保存されたデータがありません。',
      noLocal: '保存するローカルデータがありません。',
      needLogin: 'まず上部のログインボタンから Google Drive にログインしてください。',
      failed: '操作に失敗しました。時間をおいて再度お試しください。'
    }
  }
};
