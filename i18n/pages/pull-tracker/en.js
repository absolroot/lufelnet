window.I18N_PAGE_PULL_TRACKER_EN = {
  seo: {
    individual: {
      title: 'Pull Tracker - Persona 5: The Phantom X',
      description: 'P5X Gacha Pull Tracker',
      ogLocale: 'en_US'
    },
    global: {
      title: 'Global Stats - Persona 5: The Phantom X',
      description: 'View P5X global gacha statistics and daily trends.',
      ogLocale: 'en_US'
    },
    guide: {
      title: 'Pull Tracker URL Guide',
      description: 'How to get your gacha history URL',
      ogLocale: 'en_US'
    }
  },
  individual: {
    nav: {
      home: 'Home',
      current: 'Pull Tracker'
    },
    pageTitle: 'Pull Tracker (beta)',
    cardsTitle: 'Stats (Last 90 Days)',
    inputLabel: 'How to get URL',
    placeholder: 'Paste the link here...',
    labels: {
      debugExample: 'DEBUG Example:'
    },
    buttons: {
      start: 'Get Data',
      clear: 'Clear',
      hideUnder4: 'Hide under 4★',
      exampleApply: 'Apply Example'
    },
    info: {
      ready: 'Paste your gacha records URL and press Fetch.',
      notice: 'Only the last 90 days of records can be fetched. Older records are not provided by game servers.\nIf you have many pulls, loading may take 5+ minutes. Each URL has an expiration date and must be refetched when it expires.\n※ Adding new records is currently unstable. Please export data to preserve it before submitting additional URLs.',
      helpText: '·  Local data is stored in your browser and will be deleted if you clear browsing data.\n·  By signing in with Google Drive, you can save and sync your data in your Google Drive.\n·  Data submitted via URL does not include account information; it may be used for statistics (iant.kr/gacha).\n·  Special Thanks To : Iant / TheROoNCo'
    },
    auth: {
      signedIn: 'Signed in:',
      login: 'Login',
      logout: 'Logout',
      scopeNote: '※ lufel.net can only read/write files created by this site.',
      driveLabel: 'Google Drive'
    },
    loading: {
      title: 'Fetching records from the server...',
      detail: 'Depending on network and server load, it can take some time.',
      noticeLong: 'If you have many pulls in the last 90 days, it may take 10+ minutes. Please keep the browser open during processing.',
      elapsed: 'Elapsed: {m}m {s}s'
    },
    status: {
      sending: 'Sending request...',
      waiting: 'Waiting for server response...',
      tryGet: 'Processing...',
      invalidUrl: 'Please enter a valid URL.',
      done: 'Done (response bytes: {bytes})',
      failed: 'Something went wrong. Please try again later.',
      complete: '✅ Complete',
      savedLocal: 'Saved locally.',
      loadedLocal: 'Loaded from local cache.',
      loadedDrive: 'Loaded from Drive.',
      savedDrive: 'Saved to Drive.',
      deletedDrive: 'Deleted from Drive.',
      deleteDriveFailed: 'Failed to delete from Drive.',
      allDeleted: 'All browser-stored data has been deleted.',
      driveForbidden: 'Google Drive access forbidden (403). Please review permissions/settings.',
      driveNeedConsent: 'Drive permission is required. Click Login to grant access.',
      driveNoData: 'No saved data found on Drive.',
      noData: 'No saved data.',
      driveQuotaExceeded: 'Google Drive storage quota exceeded. Please free up space.',
      exampleApplyFailed: 'Failed to apply example.',
      recordAdded: 'Record added.',
      recordUpdated: 'Record updated.',
      recordDeleted: 'Record deleted.',
      adjustmentSaved: 'Adjustment saved.'
    },
    confirm: {
      reset: 'Are you sure you want to reset?\nThis will delete all gacha data stored in this browser (including last URL/response).\n※ Google Drive backups are not affected.'
    },
    overview: {
      pullsUnit: 'pulls',
      limited5: '5★ Limited',
      section: {
        character: 'Character',
        weapon: 'Weapon',
        standard: 'Standard'
      }
    },
    manual: {
      tag: 'Manual'
    },
    lower: {
      andBelow: 'and below'
    },
    merge: {
      fileTitle: 'Import from file',
      driveTitle: 'Load from Drive',
      message: 'How do you want to apply the new data?\n\nMerge: Combine with existing records\nOverwrite: Replace current records with new data',
      cancel: 'Cancel',
      merge: 'Merge',
      overwrite: 'Overwrite'
    },
    bannerNames: {
      gold: 'Gold',
      fortune: 'Chance',
      weapon: 'Weapon',
      weapon_confirmed: 'Weapon Confirmed',
      confirmed: 'Target',
      newcomer: 'Newcomer'
    },
    table: {
      total: 'Total Pulls',
      totalInProgress: 'Total / In Progress',
      count: 'Count',
      rate: 'Rate',
      avg: 'Avg Pulls',
      win: 'Win',
      rule: 'Guarantee',
      fiveStarHistory: '5★ History',
      timesSuffix: 'pulls',
      tooltip_confirmed: 'Confirmed: 5★ at 110, 4★ at 10.\n5★ Rates are calculated using (Total - In Progress).',
      tooltip_fortune: 'Fortune: 5★ at 80, 4★ at 10 (50:50 rule).\n5★Rates and 50:50 use (Total - In Progress).\n50:50 success is not provided by the game server; we infer it using featured/limited status, so accuracy may be reduced in some situations.\n\nIf it loses 50% of the time, the next time it will always win, so the expectation is 66.6% as the number of times increases.',
      tooltip_gold: 'Standard: 5★ at 80, 4★ at 10.\n5★ Rates use (Total - In Progress).',
      tooltip_weapon: 'Weapon: 5★ at 70, 4★ at 10 (50:50 rule).\n5★ Rates and 50:50 use (Total - In Progress).\n50:50 success is not provided by the game server; we infer it using featured/limited status, so accuracy may be reduced in some situations.\n\nIf it loses 50% of the time, the next time it will always win, so the expectation is 66.6% as the number of times increases.',
      tooltip_weapon_confirmed: 'Weapon Confirmed: 5★ at 95, 4★ at 10.\n5★ Rates are calculated using (Total - In Progress).',
      tooltip_newcomer: 'Newcomer: 5★ at 50, 4★ at 10.\n5★ Rates use (Total - In Progress).',
      fiveTotal: '5★ Count',
      fivePityRate: '5★ Rate',
      fiveAvg: '5★ Avg Pulls',
      win5050Count: 'Limited (Count)',
      win5050Rate: 'Limited (Rate)',
      fourTotal: '4★ Count',
      fourPityRate: '4★ Rate',
      fourAvg: '4★ Avg Pulls'
    }
  },
  global: {
    nav: {
      home: 'Home',
      current: 'Global Stats'
    },
    pageTitle: 'Global Stats',
    note: 'Based on submissions from lufel.net/iant.kr users.\n※ P5X server do not provide 50:50 Win data. Currently treat [Limited] characters as wins. Therefore, like PHOEBE or MARIAN are not included as wins, which may make the success avg appear higher/lower.',
    labels: {
      avg: 'Avg',
      count: '5★ Count',
      loseRate: 'Lose 50:50 %',
      pullsByDay: '5★ Pulls By Day',
      charAvg: 'Character 5★ Avg',
      charLimitedAvg: 'Char Limited 5★ Avg',
      charCnt: 'Character 5★ Count',
      weapAvg: 'Weapon 5★ Avg',
      weapLimitedAvg: 'Weapon Limited 5★ Avg',
      weapCnt: 'Weapon 5★ Count'
    },
    words: {
      unitTimes: 'pulls',
      unitCount: '',
      obtained: 'obtained',
      pickupSuccess: 'Limited'
    },
    names: {
      Confirmed: 'Target',
      Fortune: 'Chance',
      Gold: 'Gold',
      Weapon: 'Weapon',
      Weapon_Confirmed: 'Weapon Confirmed',
      Newcomer: 'Newcomer'
    },
    list: {
      header: {
        name: 'Name',
        total: 'Total',
        percent: '%'
      },
      more: 'More',
      titles: {
        limited: '5★ Limited List',
        standard: '5★ Standard List',
        weapon: '5★ Weapon List'
      }
    },
    tabs: {
      all: 'All',
      w3: '3 Weeks',
      w6: '6 Weeks',
      w9: '9 Weeks'
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
      avgSuffix: ''
    }
  },
  guide: {
    nav: {
      home: 'Home',
      back: 'Pull Tracker',
      current: 'URL Guide'
    },
    pageTitle: 'URL Guide',
    introWindows: 'Windows, iOS, and Linux/Steam Deck methods are available.',
    s1: 'Check the FAQ.',
    s2: 'Choose your OS. (Android steps welcome)',
    s3: 'Choose a method. Use the program / Direct URL extraction',
    m1s1: 'Run P5X on your PC.',
    m1s2: 'Download P5X_Gacha_Tools from the link, unzip, and run.',
    m1s3: 'Open the gacha history in P5X. Errors are expected.',
    m1s4: 'Select region → [Try Find URL] → Copy the URL.',
    m1s5: 'Close the program.',
    m1s6: 'Enter the copied URL via the link below.',
    m2s1: 'See method 2 at the link below.',
    m2s2: 'Enter the copied URL via the link below.',
    programTitle: 'About the Program',
    troubleshootButton: 'Troubleshooting',
    downloadLabel: 'Program Link',
    sourceCode: 'source code',
    goBack: 'Go Back',
    os: {
      win: 'Windows',
      ios: 'iOS',
      linux: 'Linux / Steam Deck'
    },
    ios1: 'Install the Stream app from the App Store.',
    ios2: 'In Stream, tap Sniff Now and allow/install/trust the VPN/CA.',
    ios3: 'Open P5X → Gacha → History.',
    ios4: 'Back to Stream → Sniff History, find a request that contains the URL for your server below and long-press to copy the entire link.\n(KR) nsywl-krcard.wmupd.com\n(CN) nsywl-gfcard.wmupd.com\n(TW) wwwidcweb.p5x.com.tw\n(JP) web.p5xjpupd.com\n(EN) euweb.p5xjpupd.com\n(SEA) web.p5x-sea.com',
    ios5: 'Enter the copied URL via the link below.',
    linuxHttptapLink: 'httptap GitHub',
    linux1: 'Install httptap. On Steam Deck, switch to Desktop Mode first.',
    linux2: 'Open a terminal and run the install command below.',
    linuxInstallCmd: 'curl -L https://github.com/monasticacademy/httptap/releases/latest/download/httptap_linux_$(uname -m).tar.gz | tar xzf -',
    linux3: 'Close Steam if it is running, then run the command below.',
    linuxRunCmd: './httptap -- steam 2>/dev/null | grep "X"',
    linux4: 'Replace the "X" in grep with your server domain (keep the quotes).\n(KR) nsywl-krcard.wmupd.com\n(CN) nsywl-gfcard.wmupd.com\n(TW) wwwidcweb.p5x.com.tw\n(JP) web.p5xjpupd.com\n(EN) euweb.p5xjpupd.com\n(SEA) web.p5x-sea.com',
    linux5: 'Steam starts with SSL certificate warnings. You can ignore these warnings.',
    linux6: 'Open P5X and go to Gacha History.',
    linux7: 'Return to the terminal. The gacha history URL appears there (usually twice). Copy one full URL.',
    linux8: 'Enter the copied URL via the link below.',
    linuxExplain: 'Command breakdown:\n./httptap -- steam: Launches Steam under httptap so HTTP requests from Steam/P5X are shown.\n2>/dev/null: Hides Steam debug logs.\n| grep "X": Filters output to lines containing your server domain.',
    linuxCredit: 'Instructions provided by Dinjoralo.',
    videoLabel: 'Video Help',
    videoNote: '(Same workflow; only the URL domain differs.)',
    streamOpen: 'Open Stream Install Page',
    modal: {
      faqTitle: 'FAQ',
      programTitle: 'About the Program',
      troubleshootTitle: 'Troubleshooting',
      close: 'Close'
    },
    faq: {
      text1: `Q. How does it work?
A. P5X records are retrieved via web URLs. When you view your records in-game, a temporary key is provided. This site uses that key to communicate with the P5X server and fetch your gacha history.

Q. Is it safe? Will I get banned?
A. It works the same way as when P5X itself shows you your records. No game files or memory are modified in any way, so it can be considered safe. However, responsibility for using this feature lies with you.

Q. Could my information be hacked?
A. lufel.net never stores your in-game UID or related keys. This project is open source. For details on the URL extraction tool, see the explanation at iant.kr/gacha. If you feel uneasy about using the tool, you can also manually extract the URL yourself (Method 2).

Q. I saw the network flow—why not send requests directly to the P5X server instead of going through another server?
A. Due to CORS restrictions, direct requests to the P5X server API are not possible. That’s why the request data is relayed through the iant.kr server before execution.

Q. Then what information is stored?
A. Apart from your gacha history, no other information is stored. The records themselves do not include which player they belong to and are used solely for statistical purposes.

Q. Why can’t I see all of my records?
A. P5X only provides records from the last 90 days. Unless you have backed up your data, unfortunately, older records cannot be retrieved. (I wish I could see mine too!)`,
      text2: `Q. How does this program work?
A. The program temporarily modifies the hosts file to redirect the connection for the gacha information page to the user’s local computer (127.0.0.1).
If it fails to reach the gacha information page, a temporary key will briefly appear in the user log. The program then automatically extracts and copies this key.
When the program is closed, the hosts file is restored to its original state. For further details, please refer to the explanation at the following link: iant.kr/gacha`
    },
    troubleshoot: {
      title: 'Troubleshooting',
      button: 'Troubleshooting',
      body: `1. An error occurs when the program starts.
Please run as Administrator.

2. No window appears when I run the program.
.NET 8.0 must be installed on your PC. If not installed, please download and install it from the link below.
https://dotnet.microsoft.com/ko-kr/download

3. After obtaining the URL, each time you open the in-game history you see a notice that it cannot be loaded.
Run the program again and close it. If the same error persists, open 
C:\\Windows\\System32\\drivers\\etc\\hosts and delete the following entries, then save.

127.0.0.1 nsywl-krcard.wmupd.com
127.0.0.1 nsywl-gfcard.wmupd.com
127.0.0.1 wwwidcweb.p5x.com.tw
127.0.0.1 web.p5xjpupd.com
127.0.0.1 euweb.p5xjpupd.com
127.0.0.1 web.p5x-sea.com`
    }
  },
  manualEditor: {
    addRecord: 'Add Record',
    editRecord: 'Edit Record',
    get5Star: 'Add 5★',
    get4Star: 'Add 4★',
    character: 'Character',
    weapon: 'Weapon',
    dateTime: 'Date/Time',
    atPity: 'At pity',
    atPityUnit: 'pulls',
    grade: 'Grade',
    save: 'Save',
    cancel: 'Cancel',
    delete: 'Delete',
    close: 'Close',
    search: 'Search...',
    maxPity: 'max',
    originalReadonly: 'Auto-imported data can only be deleted',
    confirmDelete: 'Delete this record?',
    selectCharacter: 'Select Character',
    selectWeapon: 'Select Weapon',
    noResults: 'No results',
    historyTitle: 'History',
    manualTag: 'Manual',
    autoTag: 'Auto'
  },
  adjustModal: {
    title: 'Adjust Counts',
    originalTotal: 'Original Total',
    additionalPulls: 'Additional Pulls',
    displayTotal: 'Displayed Total',
    originalProgress: 'Original In Progress',
    progressAdjust: 'Progress Adjust',
    displayProgress: 'Displayed Progress',
    note: '※ Original data is preserved; only display is adjusted.',
    reset: 'Reset'
  },
  io: {
    export: {
      label: 'Export',
      noData: 'No data to export.',
      failed: 'Export failed.'
    },
    import: {
      label: 'Import',
      imported: 'Imported from file.',
      failed: 'Import failed.'
    },
    drive: {
      saveLabel: 'Save to Drive',
      loadLabel: 'Load from Drive',
      saved: 'Saved to Drive.',
      loadedOk: 'Loaded from Drive.',
      loadedNone: 'No data on Drive.',
      noLocal: 'No local data to save.',
      needLogin: 'Please login to Google Drive first.',
      failed: 'Operation failed. Please try again later.'
    }
  }
};
