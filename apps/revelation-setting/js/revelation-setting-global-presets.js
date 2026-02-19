(function () {
    'use strict';

    function extractGlobalPresetMapFromBackupEntries(entries, options) {
        const out = {};
        if (!entries || typeof entries !== 'object') return out;

        const opts = (options && typeof options === 'object') ? options : {};
        const keyword = String(opts.keyword || '').trim().toLowerCase();
        if (!keyword) return out;

        const storagePrefixV2 = String(opts.storagePrefixV2 || '');
        const defaultPresetId = String(opts.defaultPresetId || 'default');
        const presetAddAction = String(opts.presetAddAction || '__add_preset__');
        const decodeStoragePayload = typeof opts.decodeStoragePayload === 'function'
            ? opts.decodeStoragePayload
            : () => null;
        const normalizePresetStorePayload = typeof opts.normalizePresetStorePayload === 'function'
            ? opts.normalizePresetStorePayload
            : () => null;
        const sanitizePresetName = typeof opts.sanitizePresetName === 'function'
            ? opts.sanitizePresetName
            : (value) => String(value || '').trim();
        const clonePackedBuild = typeof opts.clonePackedBuild === 'function'
            ? opts.clonePackedBuild
            : (value) => value;
        const buildGlobalPresetId = typeof opts.buildGlobalPresetId === 'function'
            ? opts.buildGlobalPresetId
            : (presetId) => String(presetId || '').trim();
        const isGlobalPresetId = typeof opts.isGlobalPresetId === 'function'
            ? opts.isGlobalPresetId
            : () => false;

        function normalizePresetNameKey(value) {
            return String(value || '').trim().toLowerCase();
        }

        Object.keys(entries).forEach((storageKey) => {
            const key = String(storageKey || '');
            if (!storagePrefixV2 || key.indexOf(storagePrefixV2) !== 0) return;

            const encodedCharacterName = key.slice(storagePrefixV2.length);
            let characterName = '';
            try {
                characterName = decodeURIComponent(encodedCharacterName);
            } catch (_) {
                characterName = encodedCharacterName;
            }
            characterName = String(characterName || '').trim();
            if (!characterName) return;

            const decodedPayload = decodeStoragePayload(entries[key]);
            const normalized = normalizePresetStorePayload(decodedPayload);
            if (!normalized) return;

            const list = [];
            const seenIds = new Set();
            const seenNames = new Set();

            normalized.order.forEach((sourcePresetId) => {
                const sourceId = String(sourcePresetId || '').trim();
                if (!sourceId || sourceId === defaultPresetId || sourceId === presetAddAction) return;
                if (isGlobalPresetId(sourceId)) return;

                const presetName = sanitizePresetName((normalized.names || {})[sourceId]);
                if (!presetName) return;
                if (presetName.toLowerCase().indexOf(keyword) === -1) return;
                const presetNameKey = normalizePresetNameKey(presetName);
                if (!presetNameKey || seenNames.has(presetNameKey)) return;

                const globalId = buildGlobalPresetId(sourceId);
                if (!globalId || seenIds.has(globalId)) return;

                const build = normalized.map[sourceId];
                if (!build) return;

                seenIds.add(globalId);
                seenNames.add(presetNameKey);
                list.push({
                    id: globalId,
                    name: presetName,
                    build: clonePackedBuild(build)
                });
            });

            if (list.length > 0) {
                out[characterName] = list;
            }
        });

        return out;
    }

    async function loadGlobalPresetMap(options) {
        const opts = (options && typeof options === 'object') ? options : {};
        const fetchImpl = typeof opts.fetchImpl === 'function'
            ? opts.fetchImpl
            : (typeof window !== 'undefined' && typeof window.fetch === 'function'
                ? window.fetch.bind(window)
                : null);
        if (!fetchImpl) return {};

        const requestUrl = `${opts.baseUrl || ''}${opts.sourcePath || ''}${opts.version || ''}`;

        try {
            const response = await fetchImpl(requestUrl, { cache: 'no-cache' });
            if (!response || !response.ok) {
                if (typeof opts.onStatus === 'function') {
                    opts.onStatus(response ? response.status : 0);
                }
                return {};
            }

            const payload = await response.json();
            const normalizeBackupEntries = typeof opts.normalizeBackupEntries === 'function'
                ? opts.normalizeBackupEntries
                : null;
            if (!normalizeBackupEntries) return {};

            const entries = normalizeBackupEntries(payload);
            if (!entries) return {};

            return extractGlobalPresetMapFromBackupEntries(entries, opts);
        } catch (error) {
            if (typeof opts.onError === 'function') {
                opts.onError(error);
            }
            return {};
        }
    }

    window.RevelationSettingGlobalPresets = {
        extractGlobalPresetMapFromBackupEntries,
        loadGlobalPresetMap
    };
})();
