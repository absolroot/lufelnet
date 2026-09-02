(function () {
    'use strict';

    const STORAGE_KEY = 'lufel_allowlist_notice_v1';
    const DISMISS_MS = 7 * 24 * 60 * 60 * 1000;
    const LOCAL_HOSTS = new Set(['localhost', '127.0.0.1', '::1', '[::1]']);
    const DESKTOP = '(min-width: 769px)';
    const NETWORK_PROBES = [
        'https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js',
        'https://s.nitropay.com/ads-2620.js'
    ];
    const state = { status: 'unknown', ready: false };
    let resolveReady;
    const ready = new Promise((resolve) => { resolveReady = resolve; });

    const LINKS = {
        ublock: 'https://github.com/gorhill/uBlock/wiki/Quick-guide%3A-popup-user-interface',
        adguard: 'https://adguard.com/en/support/adguard_for_mac/settings_and_configuration/add_website_to_exclusions.html',
        adblock: 'https://helpcenter.getadblock.com/adblock-help-center/allowlisting-in-adblock',
        abp: 'https://help.adblockplus.org/adblock-plus-help-center/add-a-website-to-the-allowlist',
        brave: 'https://support.brave.com/hc/en-us/articles/360022973471-What-is-Shields'
    };
    const ILLUSTRATED_GUIDE = 'https://fundingchoicesmessages.google.com/s/whitelist';
    const GUIDE_IMAGES = {
        adblock: 'https://www.gstatic.com/fundingchoices/allowads/blockers/chrome/browser_ab-2.png',
        abp: 'https://www.gstatic.com/fundingchoices/allowads/blockers/chrome/browser_abp-2.png',
        ublock: 'https://www.gstatic.com/fundingchoices/allowads/blockers/chrome/browser_uo-2.png'
    };

    const COPY = {
        en: {
            eyebrow: 'Ad display settings', title: 'Could you allow ads on LufelNet?',
            body: 'Advertising helps us keep guides and data free.',
            reassurance: 'This will not change your settings on other websites, and you can switch it back at any time.', status: 'Ad requests are currently blocked', guideLabel: 'Allow ads in your blocker', officialGuide: 'Open official help', close: 'Not right now', refresh: 'Refresh after allowing ads',
            learn: 'How to allowlist', banner: 'Finding LufelNet useful? Please consider allowing ads on this site only.',
            steps: {
                ublock: ['Click uBlock Origin in the browser toolbar.', 'Click the large power button to trust lufel.net.', 'Reload this page.'],
                adguard: ['Open AdGuard from the toolbar or app assistant.', 'Turn off protection for this website, or add lufel.net to Allowlist.', 'Reload this page.'],
                adblock: ['Open AdBlock from the browser toolbar.', 'Add lufel.net to its allowlist or pause AdBlock on this site.', 'Reload this page.'],
                abp: ['Open Adblock Plus from the browser toolbar.', 'Open Settings, then Allowlisted websites, and add lufel.net.', 'Reload this page.'],
                brave: ['Open the Shields icon beside the address bar.', 'Turn Shields down for lufel.net.', 'Reload this page.'],
                other: ['Add lufel.net to your blocker’s allowlist or exceptions.', 'If you use DNS blocking, also allow s.nitropay.com.', 'Reload after saving the change.']
            }
        },
        kr: {
            eyebrow: '광고 표시 설정', title: '광고 표시를 허용해 주실 수 있을까요?',
            body: '루페르넷은 광고 수익으로 공략과 데이터를 무료로 제공하고 있습니다.',
            reassurance: '다른 웹사이트의 광고 차단 설정에는 영향을 주지 않으며, 필요하면 언제든 원래대로 되돌릴 수 있습니다.', status: '광고 요청이 현재 차단되어 있습니다', guideLabel: '차단 프로그램에서 광고 허용하기', officialGuide: '공식 도움말 열기', close: '지금은 괜찮아요', refresh: '광고 허용 후 새로고침',
            learn: '예외 처리 방법', banner: '공략이 도움이 되셨나요? lufel.net에서만 광고를 허용해 주세요.',
            steps: {
                ublock: ['브라우저 도구 모음에서 uBlock Origin 아이콘을 누릅니다.', '큰 전원 버튼을 눌러 lufel.net을 신뢰 사이트로 설정합니다.', '이 페이지를 새로고침합니다.'],
                adguard: ['브라우저 도구 모음 또는 앱 도우미에서 AdGuard를 엽니다.', '이 웹사이트의 보호를 끄거나 lufel.net을 Allowlist에 추가합니다.', '이 페이지를 새로고침합니다.'],
                adblock: ['브라우저 도구 모음에서 AdBlock을 엽니다.', 'lufel.net을 allowlist에 추가하거나 이 사이트에서 AdBlock을 일시 중지합니다.', '이 페이지를 새로고침합니다.'],
                abp: ['브라우저 도구 모음에서 Adblock Plus를 엽니다.', '설정의 Allowlisted websites에서 lufel.net을 추가합니다.', '이 페이지를 새로고침합니다.'],
                brave: ['주소창 옆의 Shields 아이콘을 엽니다.', 'lufel.net에서 Shields를 내립니다.', '이 페이지를 새로고침합니다.'],
                other: ['차단 프로그램의 allowlist 또는 예외 목록에 lufel.net을 추가합니다.', 'DNS 차단도 사용 중이면 s.nitropay.com도 허용합니다.', '변경 사항을 저장한 뒤 이 페이지를 새로고침합니다.']
            }
        },
        jp: {
            eyebrow: '広告表示の設定', title: '広告の表示を許可していただけますか？',
            body: 'LufelNet は、広告収益によって攻略情報とデータを無料で提供しています。',
            reassurance: '他のサイトの設定には影響せず、必要になればいつでも元に戻せます。', status: '広告リクエストは現在ブロックされています', guideLabel: 'ブロッカーで広告を許可する', officialGuide: '公式ヘルプを開く', close: '今はしない', refresh: '広告を許可したら再読み込み',
            learn: '許可リストへの追加方法', banner: '攻略が役に立ったら、lufel.net だけ広告を許可してください。',
            steps: {
                ublock: ['ブラウザのツールバーで uBlock Origin のアイコンを開きます。', '大きな電源ボタンを押して lufel.net を信頼済みサイトにします。', 'このページを再読み込みします。'],
                adguard: ['ツールバーまたはアプリのアシスタントから AdGuard を開きます。', 'このサイトの保護をオフにするか、lufel.net を Allowlist に追加します。', 'このページを再読み込みします。'],
                adblock: ['ブラウザのツールバーで AdBlock を開きます。', 'lufel.net を allowlist に追加するか、このサイトで AdBlock を一時停止します。', 'このページを再読み込みします。'],
                abp: ['ブラウザのツールバーで Adblock Plus を開きます。', '設定の Allowlisted websites から lufel.net を追加します。', 'このページを再読み込みします。'],
                brave: ['アドレスバー横の Shields アイコンを開きます。', 'lufel.net で Shields をオフにします。', 'このページを再読み込みします。'],
                other: ['ブロッカーの allowlist または例外に lufel.net を追加します。', 'DNS ブロッカーも使用している場合は s.nitropay.com も許可します。', '保存後にこのページを再読み込みします。']
            }
        },
        cn: {
            eyebrow: '广告展示设置', title: '可以允许显示广告吗？',
            body: 'LufelNet 通过广告收入，持续免费提供攻略和数据。',
            reassurance: '不会影响其他网站的拦截设置，您随时可以恢复原来的设置。', status: '广告请求当前已被拦截', guideLabel: '在拦截器中允许广告', officialGuide: '打开官方帮助', close: '暂时不用', refresh: '允许广告后刷新页面',
            learn: '查看允许方法', banner: '觉得攻略有帮助吗？请考虑仅在 lufel.net 允许广告。',
            steps: {
                ublock: ['点击浏览器工具栏中的 uBlock Origin 图标。', '点击大电源按钮，将 lufel.net 设为受信任网站。', '刷新本页面。'],
                adguard: ['从浏览器工具栏或应用助手中打开 AdGuard。', '关闭此网站的保护，或将 lufel.net 添加到 Allowlist。', '刷新本页面。'],
                adblock: ['从浏览器工具栏中打开 AdBlock。', '将 lufel.net 添加到 allowlist，或暂停此网站上的 AdBlock。', '刷新本页面。'],
                abp: ['从浏览器工具栏中打开 Adblock Plus。', '在设置中的 Allowlisted websites 添加 lufel.net。', '刷新本页面。'],
                brave: ['打开地址栏旁的 Shields 图标。', '在 lufel.net 上关闭 Shields。', '刷新本页面。'],
                other: ['将 lufel.net 添加到拦截器的 allowlist 或例外列表。', '如果也使用 DNS 拦截，请允许 s.nitropay.com。', '保存设置后刷新本页面。']
            }
        }
    };
    const PROVIDERS = [
        ['ublock', 'uBlock Origin'], ['adguard', 'AdGuard'], ['adblock', 'AdBlock'],
        ['abp', 'Adblock Plus'], ['brave', 'Brave'], ['other', 'Other / DNS']
    ];

    function lang() {
        const path = String(location.pathname).split('/')[1].toLowerCase();
        if (COPY[path]) return path;
        const html = document.documentElement.lang || '';
        return html.startsWith('ko') ? 'kr' : html.startsWith('ja') ? 'jp' : html.startsWith('zh') ? 'cn' : 'en';
    }
    function copy() { return COPY[lang()] || COPY.en; }
    function localPreview() {
        if (!LOCAL_HOSTS.has(location.hostname)) return '';
        const mode = new URLSearchParams(location.search).get('allowlist-preview');
        return mode === 'desktop' || mode === 'mobile' ? mode : '';
    }
    function hiddenRecently() {
        try { return Number(localStorage.getItem(STORAGE_KEY)) > Date.now(); } catch (_) { return false; }
    }
    function dismiss() { try { localStorage.setItem(STORAGE_KEY, String(Date.now() + DISMISS_MS)); } catch (_) { } }
    function finish(status) {
        if (state.ready) return;
        state.status = status; state.ready = true; resolveReady({ ...state });
    }
    function networkProbe() {
        if (typeof fetch !== 'function' || !/^https?:$/.test(location.protocol)) return Promise.resolve(false);
        const timeout = new Promise((resolve) => setTimeout(() => resolve(false), 1800));
        const requests = Promise.all(NETWORK_PROBES.map((url) => fetch(url, {
            method: 'HEAD', mode: 'no-cors', cache: 'no-store', credentials: 'omit', referrerPolicy: 'no-referrer'
        }).then(() => false, () => true))).then((results) => results.some(Boolean));
        return Promise.race([requests, timeout]);
    }
    function probe() {
        const bait = document.createElement('div');
        // Standard EasyList / AdBlock bait vocabulary. Different blockers target
        // different patterns, so a single "adsbox" class is not sufficient.
        bait.className = [
            'adsbox', 'ad-banner', 'adsbygoogle', 'ad-placement',
            'pub_300x250', 'pub_300x250m', 'pub_728x90',
            'text-ad', 'textAd', 'text_ad', 'text_ads', 'text-ad-links',
            'carbon-ads'
        ].join(' ');
        bait.setAttribute('aria-hidden', 'true');
        // Cosmetic filters usually hide ad slots with CSS. Do not force display
        // inline, or the probe can mask the signal it is meant to observe.
        bait.style.cssText = 'position:absolute;left:-9999px;top:-9999px;width:2px;height:2px;overflow:hidden;pointer-events:none;';
        document.body.append(bait);
        setTimeout(() => {
            const attached = document.body.contains(bait);
            const style = attached ? getComputedStyle(bait) : null;
            const rect = attached ? bait.getBoundingClientRect() : null;
            const cosmeticBlocked = !attached || !style || style.display === 'none' || style.visibility === 'hidden' || !rect || rect.width === 0 || rect.height === 0;
            if (attached) bait.remove();
            // Network-only blockers do not hide bait elements. These HEAD checks
            // do not execute or duplicate advertising code.
            networkProbe().then((networkBlocked) => finish(cosmeticBlocked || networkBlocked ? 'blocked' : 'clear'));
        }, 120);
    }
    function element(tag, className, text) {
        const node = document.createElement(tag);
        if (className) node.className = className;
        if (text !== undefined) node.textContent = text;
        return node;
    }
    function removeUi() { document.querySelectorAll('.lufel-allowlist-layer,.lufel-allowlist-banner').forEach((node) => node.remove()); }
    function showModal() {
        removeUi();
        const text = copy(); const active = document.activeElement;
        const layer = element('div', 'lufel-allowlist-layer');
        const dialog = element('section', 'lufel-allowlist-dialog');
        dialog.setAttribute('role', 'dialog'); dialog.setAttribute('aria-modal', 'true'); dialog.setAttribute('aria-labelledby', 'lufelAllowlistTitle'); dialog.tabIndex = -1;
        const header = element('header', 'lufel-allowlist-dialog__header');
        const heading = element('div');
        heading.append(element('p', 'lufel-allowlist-dialog__eyebrow', text.eyebrow));
        const title = element('h2', '', text.title); title.id = 'lufelAllowlistTitle'; heading.append(title);
        const x = element('button', 'lufel-allowlist-dialog__close', '×'); x.type = 'button'; x.setAttribute('aria-label', text.close);
        header.append(heading, x);
        const body = element('div', 'lufel-allowlist-dialog__body');
        const status = element('p', 'lufel-allowlist-status', text.status); status.setAttribute('role', 'status');
        body.append(status, element('p', 'lufel-allowlist-dialog__body-copy', text.body), element('p', 'lufel-allowlist-dialog__reassurance', text.reassurance));
        const guide = element('section', 'lufel-allowlist-guide');
        const tabs = element('div', 'lufel-allowlist-tabs'); tabs.setAttribute('role', 'tablist');
        const panel = element('div', 'lufel-allowlist-panel');
        function select(key) {
            tabs.querySelectorAll('button').forEach((button) => button.setAttribute('aria-selected', String(button.dataset.provider === key)));
            panel.replaceChildren();
            const guideTitle = element('h3', 'lufel-allowlist-panel__title', text.guideLabel);
            const steps = element('ol', 'lufel-allowlist-steps');
            text.steps[key].forEach((step) => steps.append(element('li', '', step)));
            const instructions = element('div', 'lufel-allowlist-panel__instructions');
            instructions.append(guideTitle, steps);
            const imageUrl = GUIDE_IMAGES[key];
            if (imageUrl) {
                const media = element('figure', 'lufel-allowlist-panel__media');
                const image = element('img', ''); image.src = imageUrl; image.loading = 'lazy'; image.decoding = 'async'; image.alt = `${PROVIDERS.find(([provider]) => provider === key)[1]} guide`;
                media.append(image); panel.append(media);
            }
            if (LINKS[key]) {
                const link = element('a', 'lufel-allowlist-help-link', text.officialGuide);
                link.href = imageUrl ? ILLUSTRATED_GUIDE : LINKS[key]; link.target = '_blank'; link.rel = 'noopener noreferrer'; instructions.append(link);
            }
            panel.append(instructions);
        }
        PROVIDERS.forEach(([key, label]) => {
            const tab = element('button', '', label); tab.type = 'button'; tab.dataset.provider = key; tab.setAttribute('role', 'tab');
            tab.addEventListener('click', () => select(key)); tabs.append(tab);
        });
        select('ublock'); guide.append(tabs, panel); body.append(guide);
        const footer = element('footer', 'lufel-allowlist-dialog__footer');
        const later = element('button', 'lufel-allowlist-button', text.close); later.type = 'button';
        const refresh = element('button', 'lufel-allowlist-button lufel-allowlist-button--primary', text.refresh); refresh.type = 'button';
        footer.append(later, refresh); dialog.append(header, body, footer); layer.append(dialog); document.body.append(layer);
        function close(save) { if (save) dismiss(); removeUi(); document.removeEventListener('keydown', keydown); if (active?.focus) active.focus(); }
        function keydown(event) {
            if (event.key === 'Escape') close(true);
            if (event.key !== 'Tab') return;
            const focusable = Array.from(dialog.querySelectorAll('button,a[href]')).filter((node) => node.offsetParent !== null);
            if (!focusable.length) return;
            const first = focusable[0]; const last = focusable[focusable.length - 1];
            if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last.focus(); }
            if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first.focus(); }
        }
        x.addEventListener('click', () => close(true)); later.addEventListener('click', () => close(true));
        refresh.addEventListener('click', () => { try { localStorage.removeItem(STORAGE_KEY); } catch (_) { } location.reload(); });
        document.addEventListener('keydown', keydown); dialog.focus();
    }
    function showBanner() {
        removeUi(); const text = copy(); const banner = element('aside', 'lufel-allowlist-banner');
        banner.setAttribute('role', 'status'); banner.setAttribute('aria-live', 'polite');
        const learn = element('button', '', text.learn); learn.type = 'button'; learn.addEventListener('click', showModal);
        const x = element('button', 'lufel-allowlist-banner__close', '×'); x.type = 'button'; x.setAttribute('aria-label', text.close);
        x.addEventListener('click', () => { dismiss(); removeUi(); });
        banner.append(element('p', '', text.banner), learn, x); document.body.append(banner);
    }
    function show(mode) {
        if (state.status !== 'blocked' || (!mode && hiddenRecently())) return;
        if (mode === 'desktop' || (!mode && matchMedia(DESKTOP).matches)) showModal(); else showBanner();
    }
    function init() {
        const start = () => {
            const preview = localPreview();
            if (preview) { finish('blocked'); show(preview); return; }
            probe(); ready.then(() => show(''));
        };
        if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', start, { once: true }); else start();
    }
    window.LufelAllowlistGuide = Object.freeze({
        init, getState: () => ({ ...state }), whenReady: () => ready,
        showPreview: (mode) => { if (LOCAL_HOSTS.has(location.hostname)) { finish('blocked'); show(mode === 'mobile' ? 'mobile' : 'desktop'); } },
        resetForPreview: () => { if (LOCAL_HOSTS.has(location.hostname)) { try { localStorage.removeItem(STORAGE_KEY); } catch (_) { } removeUi(); } }
    });
    init();
})();
