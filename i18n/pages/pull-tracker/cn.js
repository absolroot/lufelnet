window.I18N_PAGE_PULL_TRACKER_CN = {
    "seo": {
        "individual": {
            "title": "契约记录 - 女神异闻录5: 夜幕魅影",
            "description": "记录 P5X 契约抽取信息并查看统计数据。",
            "ogLocale": "zh_CN"
        },
        "global": {
            "title": "全服统计 - 女神异闻录5: 夜幕魅影",
            "description": "查看 P5X 契约全服统计与每日趋势。",
            "ogLocale": "zh_CN"
        },
        "guide": {
            "title": "契约记录 URL 指南",
            "description": "获取抽卡记录 URL 的方法说明",
            "ogLocale": "zh_CN"
        }
    },
    "individual": {
        "nav": {
            "home": "首页",
            "current": "契约记录"
        },
        "pageTitle": "契约记录 (beta)",
        "pageDescription": "记录 P5X 契约抽卡记录并查看统计数据。",
        "cardsTitle": "统计卡片（最近 90 天）",
        "inputLabel": "URL 获取方法",
        "placeholder": "请在此粘贴链接...",
        "labels": {
            "debugExample": "DEBUG 示例:"
        },
        "buttons": {
            "start": "获取记录",
            "clear": "重置",
            "hideUnder4": "隐藏 4★ 及以下",
            "exampleApply": "应用示例"
        },
        "info": {
            "ready": "请输入抽卡记录 URL，然后点击“获取记录”。",
            "notice": "只能获取最近 90 天内的记录，更早的记录不会由游戏服务器提供。\n如果你的抽数较多，加载可能需要 5 分钟以上。每个 URL 都有有效期，过期后需要重新获取。\n※ 当前追加更新记录的流程仍不稳定。提交新的 URL 之前，请先导出数据以保留现有记录。",
            "helpText": "·  本地数据会保存在当前浏览器中；如果清除浏览器记录，数据也会一并删除。\n·  登录 Google Drive 后，可以将数据保存到你自己的 Google Drive 并进行同步。\n·  通过 URL 提交的数据不包含账号信息或其他可识别用户身份的内容，数据可能会用于统计（iant.kr/gacha）。\n·  Special Thanks To : Iant / TheROoNCo"
        },
        "auth": {
            "signedIn": "已登录:",
            "login": "登录",
            "logout": "退出登录",
            "scopeNote": "※ 只能读取和写入本网站创建的文件。",
            "driveLabel": "Google Drive"
        },
        "loading": {
            "title": "正在从服务器查询记录...",
            "detail": "根据网络状态和服务器负载，可能需要一些时间。",
            "noticeLong": "根据最近 90 天的抽卡次数，处理时间可能超过 10 分钟。处理中请不要关闭浏览器窗口。",
            "elapsed": "已耗时：{m}分 {s}秒"
        },
        "status": {
            "sending": "正在发送请求...",
            "waiting": "正在等待服务器响应...",
            "tryGet": "处理中...",
            "invalidUrl": "请输入有效的 URL。",
            "done": "完成（响应字节：{bytes}）",
            "failed": "请求时发生错误，请稍后重试。",
            "complete": "✅ 完成",
            "savedLocal": "已保存到本地浏览器。",
            "loadedLocal": "已从本地浏览器读取。",
            "loadedDrive": "已从云端（Drive）读取。",
            "savedDrive": "已保存到云端（Drive）。",
            "deletedDrive": "已从云端（Drive）删除。",
            "deleteDriveFailed": "从云端（Drive）删除失败。",
            "allDeleted": "已删除浏览器中保存的数据。",
            "driveForbidden": "Google Drive 访问被拒绝。(403) 请检查权限或设置。",
            "driveNeedConsent": "需要 Google Drive 访问权限。请点击上方登录按钮完成授权。",
            "driveNoData": "Drive 中没有已保存的数据。",
            "noData": "没有已保存的数据。",
            "driveQuotaExceeded": "Google Drive 存储空间已满，请先释放空间。",
            "exampleApplyFailed": "应用示例失败",
            "recordAdded": "记录已添加。",
            "recordUpdated": "记录已修改。",
            "recordDeleted": "记录已删除。",
            "adjustmentSaved": "修正值已保存。"
        },
        "confirm": {
            "reset": "确定要重置吗？\n这会删除当前浏览器中保存的全部抽卡数据（包括最后一次 URL / 响应）。\n※ Google Drive 备份不受影响。"
        },
        "overview": {
            "pullsUnit": "抽",
            "limited5": "限定 5★",
            "section": {
                "character": "怪盗",
                "weapon": "武器",
                "standard": "普通"
            }
        },
        "manual": {
            "tag": "手动"
        },
        "lower": {
            "andBelow": "及以下"
        },
        "merge": {
            "fileTitle": "从文件导入",
            "driveTitle": "从 Drive 读取",
            "message": "请选择应用新数据的方式：\n\n合并：将新数据并入现有记录\n覆盖：用新数据替换当前记录",
            "cancel": "取消",
            "merge": "合并",
            "overwrite": "覆盖"
        },
        "bannerNames": {
            "gold": "普通契约",
            "fortune": "命运契约",
            "weapon": "武器补给",
            "weapon_confirmed": "武器必中",
            "confirmed": "必中契约",
            "newcomer": "新手契约"
        },
        "table": {
            "total": "总抽数",
            "totalInProgress": "总抽数 / 当前垫池",
            "count": "总计",
            "rate": "概率",
            "avg": "平均抽数",
            "win": "成功",
            "rule": "保底规则",
            "fiveStarHistory": "5★ 详细记录",
            "timesSuffix": "抽",
            "tooltip_confirmed": "必中契约：5★ 110 抽保底，4★ 10 抽保底。\n5★ 概率按（总抽数 - 当前垫池）计算。",
            "tooltip_fortune": "命运契约：5★ 80 抽保底，4★ 10 抽保底（50:50 规则）。\n5★ 概率按（总抽数 - 当前垫池）计算。\n\n当前游戏服务器不提供 50:50 的结果，因此这里通过是否获得限定怪盗来判断成功与否，部分情况下会有误差。\n\n若 50:50 失败，则下一次必定成功，因此样本足够大时，期望值约为 66.6%。",
            "tooltip_gold": "普通契约：5★ 80 抽保底，4★ 10 抽保底。\n5★ 概率按（总抽数 - 当前垫池）计算。",
            "tooltip_weapon": "武器补给：5★ 70 抽保底，4★ 10 抽保底（50:50 规则）。\n5★ 概率按（总抽数 - 当前垫池）计算。\n\n当前游戏服务器不提供 50:50 的结果，因此这里通过是否获得 UP 武器来判断成功与否，部分情况下会有误差。\n\n若 50:50 失败，则下一次必定成功，因此样本足够大时，期望值约为 66.6%。",
            "tooltip_weapon_confirmed": "武器必中：5★ 95 抽保底，4★ 10 抽保底。\n5★ 概率按（总抽数 - 当前垫池）计算。",
            "tooltip_newcomer": "新手契约：5★ 50 抽保底，4★ 10 抽保底。\n5★ 概率按（总抽数 - 当前垫池）计算。",
            "fiveTotal": "5★ 总次数",
            "fivePityRate": "5★ 概率",
            "fiveAvg": "5★ 平均抽数",
            "win5050Count": "限定（次数）",
            "win5050Rate": "限定（概率）",
            "fourTotal": "4★ 总次数",
            "fourPityRate": "4★ 概率",
            "fourAvg": "4★ 平均抽数"
        }
    },
    "global": {
        "nav": {
            "home": "首页",
            "current": "全服统计"
        },
        "pageTitle": "全服统计",
        "note": "基于 lufel.net / iant.kr 用户提交的数据计算。\n※ 由于 P5X 服务器记录不提供 50:50 结果（Win）信息，当前会将限定怪盗视为成功。因此像桥本麻由美、道玄坂琉七这类不计入限定成功判定的角色，结果可能会偏高或偏低。",
        "labels": {
            "avg": "平均",
            "count": "5★ 总数",
            "loseRate": "50:50 失败率",
            "pullsByDay": "每日 5★ 次数",
            "charAvg": "怪盗 5★ 平均抽数",
            "charLimitedAvg": "限定怪盗 5★ 平均抽数",
            "charCnt": "怪盗 5★ 获取数",
            "weapAvg": "武器 5★ 平均抽数",
            "weapLimitedAvg": "限定武器 5★ 平均抽数",
            "weapCnt": "武器 5★ 获取数"
        },
        "words": {
            "unitTimes": "抽",
            "unitCount": "次",
            "obtained": "获得",
            "pickupSuccess": "限定占比"
        },
        "names": {
            "Confirmed": "必中契约",
            "Fortune": "命运契约",
            "Gold": "普通契约",
            "Weapon": "武器补给",
            "Weapon_Confirmed": "武器必中",
            "Newcomer": "新手契约"
        },
        "list": {
            "header": {
                "name": "名称",
                "total": "总计",
                "percent": "%"
            },
            "more": "查看更多",
            "titles": {
                "limited": "5★ 限定列表",
                "standard": "5★ 普通列表",
                "weapon": "5★ 武器列表"
            }
        },
        "tabs": {
            "all": "全部",
            "w3": "3周",
            "w6": "6周",
            "w9": "9周"
        },
        "pity": {
            "legendChance": "概率 %",
            "legendTotal5": "累计 5★ 抽数"
        },
        "hover": {
            "daily": "{date}\n5★ 总数：{count}",
            "pity": "保底 {pity}\n概率%：{chance}\n累计 5★ 抽数：{count}"
        },
        "status": {
            "loadFailed": "加载失败"
        },
        "units": {
            "avgSuffix": " 抽"
        }
    },
    "guide": {
        "nav": {
            "home": "首页",
            "back": "契约记录",
            "current": "URL 指南"
        },
        "pageTitle": "URL 指南",
        "introWindows": "目前提供 PC Windows 与 iOS 的方法。",
        "s1": "请先查看 FAQ。",
        "s2": "请选择你正在使用的操作系统。（欢迎补充 Android 方法）",
        "s3": "请选择你想使用的方法：使用现成程序 / 手动提取 URL",
        "m1s1": "请先在 PC 上启动 P5X。",
        "m1s2": "请通过下方链接下载 P5X_Gacha_Tools，解压后运行。",
        "m1s3": "在 P5X 中打开契约记录。※ 出现报错属于正常现象。",
        "m1s4": "选择地区后点击 [Try Find URL]，再点击 Copy 获取 URL。",
        "m1s5": "随后请关闭程序。",
        "m1s6": "将复制好的 URL 粘贴到下方链接页面中。",
        "m2s1": "请通过下方链接查看操作方法。",
        "m2s2": "将复制好的 URL 粘贴到下方链接页面中。",
        "programTitle": "关于程序",
        "troubleshootButton": "故障排查",
        "downloadLabel": "程序下载链接",
        "sourceCode": "源代码",
        "goBack": "返回",
        "os": {
            "win": "Windows",
            "ios": "iOS",
            "linux": "Linux / Steam Deck"
        },
        "ios1": "请在 App Store 安装 Stream 应用。",
        "ios2": "在 Stream 中点击 Sniff Now，完成 VPN/CA 安装与信任。",
        "ios3": "在 P5X 中打开抽卡记录界面。",
        "ios4": "在 Stream → Sniff History 中，找到包含下方对应服务器 URL 的请求，长按后复制完整链接。\n(KR) nsywl-krcard.wmupd.com\n(CN) nsywl-gfcard.wmupd.com\n(TW) wwwidcweb.p5x.com.tw\n(JP) web.p5xjpupd.com\n(EN) euweb.p5xjpupd.com\n(SEA) web.p5x-sea.com",
        "ios5": "将复制好的 URL 粘贴到下方链接页面中。",
        "videoLabel": "视频说明",
        "videoNote": "（视频中的流程与步骤相同，仅 URL 域名不同。）",
        "streamOpen": "Stream 应用安装页面",
        "linuxHttptapLink": "httptap GitHub",
        "linux1": "请先安装 httptap。使用 Steam Deck 时，需要先切换到桌面模式。",
        "linux2": "打开终端并执行下面的安装命令。",
        "linuxInstallCmd": "curl -L https://github.com/monasticacademy/httptap/releases/latest/download/httptap_linux_$(uname -m).tar.gz | tar xzf -",
        "linux3": "如果 Steam 正在运行，请先关闭，然后执行下面的命令。",
        "linuxRunCmd": "./httptap -- steam 2>/dev/null | grep \"X\"",
        "linux4": "请将 grep 中的 \"X\" 替换成你所在服务器的域名，并保留引号。\n(KR) nsywl-krcard.wmupd.com\n(CN) nsywl-gfcard.wmupd.com\n(TW) wwwidcweb.p5x.com.tw\n(JP) web.p5xjpupd.com\n(EN) euweb.p5xjpupd.com\n(SEA) web.p5x-sea.com",
        "linux5": "启动 Steam 时可能会出现 SSL certificate 警告，可以直接忽略。",
        "linux6": "启动 P5X 并进入抽卡记录页面。",
        "linux7": "返回终端后会看到抽卡记录 URL（通常会输出两次），复制其中一条完整链接。",
        "linux8": "通过下方链接输入复制好的 URL。",
        "linuxExplain": "命令说明:\n./httptap -- steam: 通过 httptap 启动 Steam，从而显示 Steam/P5X 发出的 HTTP 请求。\n2>/dev/null: 隐藏 Steam 的调试日志输出。\n| grep \"X\": 仅筛选出包含你服务器域名(X)的行。",
        "linuxCredit": "该流程由 Dinjoralo 提供。",
        "modal": {
            "faqTitle": "FAQ",
            "programTitle": "关于程序",
            "troubleshootTitle": "故障排查",
            "close": "关闭"
        },
        "faq": {
            "text1": "Q. 这是通过什么原理工作的？\nA. P5X 的记录本质上是通过网页 URL 获取的。当你在游戏里打开记录时，会生成一个可访问的临时 key；本网站会利用这个 key 与 P5X 服务器通信，从而读取你的抽卡记录。\n\nQ. 这样安全吗？会被封号吗？\nA. 这里使用的方式与 P5X 在游戏内展示记录时相同，也不会修改游戏文件或内存，因此可以认为是相对安全的。不过，是否使用该功能仍需你自行判断并承担责任。\n\nQ. 会不会泄露我的账号信息？\nA. lufel.net 不会保存你的游戏 UID 或相关 key。本项目也是开源的；关于获取 URL 的工具，请参考 iant.kr/gacha 的说明。如果你对工具方式不放心，也可以使用方法 2 手动提取 URL。\n\nQ. 我看了网络流程，为什么不是直接请求 P5X 服务器，而是经过别的服务器？\nA. 因为浏览器存在 CORS 限制，网页无法直接请求 P5X 服务器 API，所以请求会先转发到 iant.kr 服务器后再执行。\n\nQ. 那你们会保存哪些信息？\nA. 除了抽卡记录本身外，不会额外保存其他信息。记录里也不会留下可识别具体玩家身份的内容，因此只会用于简单统计。\n\nQ. 为什么看不到全部记录？\nA. P5X 目前只提供最近 90 天内的记录。如果没有你自己提前备份的历史数据，就无法再查看更早的记录。",
            "text2": "Q. 这个程序具体是怎么工作的？\nA. 程序会临时修改 hosts，将获取抽卡信息页面的连接暂时重定向到当前用户电脑（127.0.0.1）。当页面因无法直接访问而在日志中输出临时 key 时，程序会自动提取并复制该 key 对应的 URL。程序关闭后会将 hosts 恢复原状。更多说明请参考该链接（iant.kr/gacha）。"
        },
        "troubleshoot": {
            "title": "故障排查",
            "button": "故障排查",
            "body": "1. 程序启动后立即报错\n请以管理员权限运行。\n\n2. 运行程序后没有任何窗口弹出。\n电脑需要先安装 .NET 8.0。如未安装，请通过下方链接下载安装。\nhttps://dotnet.microsoft.com/download/dotnet/8.0\n\n3. 获取 URL 后，游戏内每次查看抽卡记录都会提示无法读取记录。\n请重新运行一次程序并正常退出。若仍然出现相同问题，请手动打开\nC:\\Windows\\System32\\drivers\\etc\\hosts\n文件，删除下列内容后保存。\n\n127.0.0.1 nsywl-krcard.wmupd.com\n127.0.0.1 nsywl-gfcard.wmupd.com\n127.0.0.1 wwwidcweb.p5x.com.tw\n127.0.0.1 web.p5xjpupd.com\n127.0.0.1 euweb.p5xjpupd.com\n127.0.0.1 web.p5x-sea.com"
        }
    },
    "manualEditor": {
        "addRecord": "添加记录",
        "editRecord": "编辑记录",
        "get5Star": "添加 5★",
        "get4Star": "添加 4★",
        "character": "怪盗",
        "weapon": "武器",
        "dateTime": "日期/时间",
        "atPity": "垫池位置",
        "atPityUnit": "抽",
        "grade": "星级",
        "save": "保存",
        "cancel": "取消",
        "delete": "删除",
        "close": "关闭",
        "search": "搜索...",
        "maxPity": "最大保底",
        "originalReadonly": "自动获取的数据只能删除",
        "confirmDelete": "确定要删除这条记录吗？",
        "selectCharacter": "选择怪盗",
        "selectWeapon": "选择武器",
        "noResults": "没有搜索结果",
        "historyTitle": "获取记录",
        "manualTag": "手动",
        "autoTag": "自动"
    },
    "adjustModal": {
        "title": "抽数修正",
        "originalTotal": "原始总抽数",
        "additionalPulls": "追加抽数",
        "displayTotal": "显示总抽数",
        "originalProgress": "原始垫池",
        "progressAdjust": "垫池修正",
        "displayProgress": "显示垫池",
        "note": "※ 原始数据会保留，仅调整显示结果。",
        "reset": "重置"
    },
    "io": {
        "export": {
            "label": "导出",
            "noData": "没有可导出的数据。",
            "failed": "导出失败。"
        },
        "import": {
            "label": "导入",
            "imported": "已从文件导入。",
            "failed": "导入失败。"
        },
        "drive": {
            "saveLabel": "保存到 Drive",
            "loadLabel": "从 Drive 读取",
            "saved": "已保存到 Drive。",
            "loadedOk": "已从 Drive 读取。",
            "loadedNone": "Drive 中没有已保存的数据。",
            "noLocal": "没有可保存的本地数据。",
            "needLogin": "请先点击顶部登录按钮登录 Google Drive。",
            "failed": "操作失败，请稍后再试。"
        }
    }
};
