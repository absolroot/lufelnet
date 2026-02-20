(function () {
    'use strict';

    function createController(deps) {
        const d = deps || {};
        const toCanonicalStatKey = (typeof d.toCanonicalStatKey === 'function')
            ? d.toCanonicalStatKey
            : ((value) => String(value || '').trim());

        let targetSet = new Set();

        function normalizeWhitespace(value) {
            return String(value || '').replace(/\s+/g, ' ').trim();
        }

        function extractStatNameFromToken(token) {
            const normalized = normalizeWhitespace(token);
            if (!normalized) return '';

            const withoutTrailingNumber = normalized.replace(/\s*-?\d+(?:\.\d+)?%?\s*$/u, '').trim();
            return normalizeWhitespace(withoutTrailingNumber || normalized);
        }

        function splitMinimumStatsText(text) {
            return String(text || '')
                .split(/[,，/]/u)
                .map((part) => normalizeWhitespace(part))
                .filter(Boolean);
        }

        function addStatToSet(setRef, rawStatName) {
            const name = normalizeWhitespace(rawStatName);
            if (!name) return;

            const canonical = normalizeWhitespace(toCanonicalStatKey(name));
            function addLinkedStatVariants(baseKey) {
                if (baseKey === 'Attack' || baseKey === 'Attack %') {
                    setRef.add('Attack');
                    setRef.add('Attack %');
                }
                if (baseKey === 'Defense' || baseKey === 'Defense %') {
                    setRef.add('Defense');
                    setRef.add('Defense %');
                }
                if (baseKey === 'HP' || baseKey === 'HP %') {
                    setRef.add('HP');
                    setRef.add('HP %');
                }
            }

            if (canonical) {
                setRef.add(canonical);
                addLinkedStatVariants(canonical);
                return;
            }

            setRef.add(name);
        }

        function buildTargetSet(characterName) {
            const name = normalizeWhitespace(characterName);
            const nextSet = new Set();

            if (!name || !window.characterSetting || !window.characterSetting[name]) {
                targetSet = nextSet;
                return targetSet;
            }

            const minimumStats = window.characterSetting[name].minimum_stats;
            if (!minimumStats || typeof minimumStats !== 'object') {
                targetSet = nextSet;
                return targetSet;
            }

            Object.keys(minimumStats).forEach((levelKey) => {
                const rawValue = minimumStats[levelKey];
                if (rawValue === false || rawValue == null) return;

                const text = normalizeWhitespace(rawValue);
                if (!text) return;

                splitMinimumStatsText(text).forEach((token) => {
                    const statName = extractStatNameFromToken(token);
                    if (!statName) return;
                    addStatToSet(nextSet, statName);
                });
            });

            targetSet = nextSet;
            return targetSet;
        }

        function isTargetStat(statLabel) {
            const name = normalizeWhitespace(statLabel);
            if (!name) return false;

            const canonical = normalizeWhitespace(toCanonicalStatKey(name));
            if (canonical && targetSet.has(canonical)) return true;
            return targetSet.has(name);
        }

        function getTargetSet() {
            return new Set(Array.from(targetSet));
        }

        return {
            buildTargetSet,
            isTargetStat,
            getTargetSet
        };
    }

    window.RevelationSettingMinimumStatsHighlight = {
        createController
    };
})();
