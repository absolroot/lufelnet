(function () {
    'use strict';

    function resolveStorageKeyOptions(options) {
        const opts = (options && typeof options === 'object') ? options : {};
        return {
            storagePrefixV1: String(opts.storagePrefixV1 || ''),
            storagePrefixV2: String(opts.storagePrefixV2 || ''),
            storagePrefixModifiedFallback: String(opts.storagePrefixModifiedFallback || ''),
            storagePrefixModifiedLegacy: String(opts.storagePrefixModifiedLegacy || ''),
            modifiedHelper: opts.modifiedHelper || null
        };
    }

    function isStorageKey(key, options) {
        const text = String(key || '');
        const opts = resolveStorageKeyOptions(options);

        const isModifiedKey = opts.modifiedHelper && typeof opts.modifiedHelper.isModifiedKey === 'function'
            ? !!opts.modifiedHelper.isModifiedKey(text)
            : (text.indexOf(opts.storagePrefixModifiedFallback) === 0 || text.indexOf(opts.storagePrefixModifiedLegacy) === 0);

        return text.indexOf(opts.storagePrefixV1) === 0
            || text.indexOf(opts.storagePrefixV2) === 0
            || isModifiedKey;
    }

    function collectEntries(options) {
        const opts = (options && typeof options === 'object') ? options : {};
        const storage = opts.storage || null;
        const isStorageKeyFn = typeof opts.isStorageKeyFn === 'function'
            ? opts.isStorageKeyFn
            : (key) => isStorageKey(key, opts);
        const out = {};

        if (!storage) return out;

        for (let i = 0; i < storage.length; i += 1) {
            const key = storage.key(i);
            if (!isStorageKeyFn(key)) continue;
            out[key] = String(storage.getItem(key) || '');
        }
        return out;
    }

    function clearEntries(options) {
        const opts = (options && typeof options === 'object') ? options : {};
        const storage = opts.storage || null;
        const isStorageKeyFn = typeof opts.isStorageKeyFn === 'function'
            ? opts.isStorageKeyFn
            : (key) => isStorageKey(key, opts);

        if (!storage) return 0;

        const removeKeys = [];
        for (let i = 0; i < storage.length; i += 1) {
            const key = storage.key(i);
            if (!isStorageKeyFn(key)) continue;
            removeKeys.push(key);
        }

        removeKeys.forEach((key) => {
            storage.removeItem(key);
        });

        return removeKeys.length;
    }

    function normalizeBackupEntries(payload, options) {
        if (!payload || typeof payload !== 'object') return null;
        if (String(payload.format || '') !== 'revelation-setting-backup') return null;
        if (!payload.entries || typeof payload.entries !== 'object') return null;

        const opts = (options && typeof options === 'object') ? options : {};
        const isStorageKeyFn = typeof opts.isStorageKeyFn === 'function'
            ? opts.isStorageKeyFn
            : (key) => isStorageKey(key, opts);

        const out = {};
        Object.keys(payload.entries).forEach((key) => {
            if (!isStorageKeyFn(key)) return;
            const value = payload.entries[key];
            if (typeof value !== 'string') return;
            out[key] = value;
        });
        return out;
    }

    window.RevelationSettingStorageUtils = {
        isStorageKey,
        collectEntries,
        clearEntries,
        normalizeBackupEntries
    };
})();
