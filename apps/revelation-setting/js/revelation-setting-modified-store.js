(function () {
    'use strict';

    const PREFIX = 'revelation-setting:modified:v2:';
    const LEGACY_PREFIX = 'revelation-setting:modified:';

    function normalizeName(characterName) {
        return String(characterName || '').trim();
    }

    function buildKey(characterName) {
        return PREFIX + encodeURIComponent(normalizeName(characterName));
    }

    function buildLegacyKey(characterName) {
        return LEGACY_PREFIX + encodeURIComponent(normalizeName(characterName));
    }

    function canUseStorage() {
        return typeof window !== 'undefined' && typeof window.localStorage !== 'undefined';
    }

    function getFlag(characterName) {
        const name = normalizeName(characterName);
        if (!name || !canUseStorage()) return false;

        try {
            return window.localStorage.getItem(buildKey(name)) === '1';
        } catch (_) {
            return false;
        }
    }

    function setFlag(characterName, modified) {
        const name = normalizeName(characterName);
        if (!name || !canUseStorage()) return;

        const next = !!modified;
        try {
            if (next) {
                window.localStorage.setItem(buildKey(name), '1');
            } else {
                window.localStorage.removeItem(buildKey(name));
            }

            // Cleanup old flag format.
            window.localStorage.removeItem(buildLegacyKey(name));
        } catch (_) { }
    }

    function isModifiedKey(storageKey) {
        const key = String(storageKey || '');
        return key.indexOf(PREFIX) === 0 || key.indexOf(LEGACY_PREFIX) === 0;
    }

    function clearAllFlags() {
        if (!canUseStorage()) return;
        const removeKeys = [];
        try {
            for (let i = 0; i < window.localStorage.length; i += 1) {
                const key = window.localStorage.key(i);
                if (isModifiedKey(key)) {
                    removeKeys.push(key);
                }
            }
            removeKeys.forEach((key) => {
                window.localStorage.removeItem(key);
            });
        } catch (_) { }
    }

    window.RevelationSettingModifiedStore = {
        PREFIX,
        LEGACY_PREFIX,
        buildKey,
        getFlag,
        setFlag,
        isModifiedKey,
        clearAllFlags
    };
})();

