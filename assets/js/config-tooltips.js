(function (root) {
    'use strict';

    function compact(text) {
        return text.normalize('NFKC').replace(/\s+/gu, '');
    }

    function signature(text) {
        const normalized = compact(text)
            .replace(/\^%s\^|%s/gu, '')
            .replace(/[\p{N}\p{P}%]+/gu, '');
        let left = 2166136261;
        let right = 0;
        for (let i = 0; i < normalized.length; i++) {
            const code = normalized.charCodeAt(i);
            left = Math.imul(left ^ code, 16777619);
            right = Math.imul(right, 31) + code | 0;
        }
        return normalized ? `${(left >>> 0).toString(36)}.${(right >>> 0).toString(36)}` : '';
    }

    function occurrences(text, phrase) {
        const starts = [];
        if (!phrase) return starts;
        for (let i = text.indexOf(phrase); i !== -1; i = text.indexOf(phrase, i + phrase.length)) {
            starts.push(i);
        }
        return starts;
    }

    const escapeHtml = text => text.replace(/[&<>"']/g, value => ({
        '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;'
    })[value]);

    function add(element, pack, legacy, lang, bind) {
        const document = element.ownerDocument;
        const nodes = document.createTreeWalker(element, 4);
        const positions = [];
        let text = '';
        for (let node = nodes.nextNode(); node; node = nodes.nextNode()) {
            for (let index = 0; index < node.length;) {
                const char = String.fromCodePoint(node.data.codePointAt(index));
                const normalized = compact(char);
                text += normalized;
                for (let j = 0; j < normalized.length; j++) {
                    positions.push([node, index, index + char.length]);
                }
                index += char.length;
            }
        }

        const links = pack?.fields[signature(text)];
        const spans = [];
        for (const [id, phrase, ordinal, total] of links || []) {
            const starts = occurrences(text, phrase);
            if (starts.length === total && pack.tips[id]) {
                spans.push([starts[ordinal], phrase.length, pack.tips[id], true, pack.provisional?.includes(id)]);
            }
        }
        // A known Config field is authoritative, including when it contains no links.
        if (!links && legacy) {
            const brackets = lang === 'en' ? /\[([^\[\]]+)\]/gu : /『([^『』]+)』/gu;
            for (const match of text.matchAll(brackets)) {
                const key = Object.keys(legacy).find(term => compact(term) === match[1]);
                if (key) spans.push([match.index + 1, match[1].length, legacy[key], false]);
            }
        }

        let nextStart = text.length;
        for (const [start, length, description, official, provisional] of spans.sort((a, b) => b[0] - a[0])) {
            if (!positions[start] || start + length > nextStart) continue;
            const [first, offset] = positions[start];
            const [last, , end] = positions[start + length - 1];
            if (first.parentElement.closest('[data-tooltip]') || last.parentElement.closest('[data-tooltip]')) continue;
            const range = document.createRange();
            range.setStart(first, offset);
            range.setEnd(last, end);
            const span = document.createElement('span');
            span.className = 'tooltip-text';
            span.dataset.skillTooltip = official ? 'config' : 'status';
            const label = provisional ? (lang === 'jp' ? '暫定訳' : 'Provisional translation') : '';
            span.dataset.tooltip = (label ? `<strong>${label}</strong><br>` : '')
                + escapeHtml(description).replace(/\r?\n/g, '<br>');
            span.append(range.extractContents());
            range.insertNode(span);
            bind(span);
            nextStart = start;
        }
    }

    const packs = new Map();
    function load(lang) {
        const url = root.__CONFIG_TOOLTIP_URLS__?.[lang];
        if (!url) return Promise.resolve(null);
        if (!packs.has(url)) {
            packs.set(url, root.fetch(url)
                .then(response => {
                    if (!response.ok) throw new Error(`Tooltip data: ${response.status}`);
                    return response.json();
                })
                .catch(() => {
                    packs.delete(url);
                    return null;
                }));
        }
        return packs.get(url);
    }

    const api = { compact, signature, occurrences, add, load };
    if (typeof module !== 'undefined' && module.exports) module.exports = api;
    else root.ConfigTooltips = api;
})(globalThis);
