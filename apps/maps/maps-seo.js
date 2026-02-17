// Maps SEO bridge: pass only dynamic map path tokens to SeoEngine.
(function () {
    'use strict';

    function applyMapsSeoHint(partialHint) {
        const hint = Object.assign({ domain: 'maps' }, partialHint || {});

        if (window.SeoEngine && typeof window.SeoEngine.setContextHint === 'function') {
            window.SeoEngine.setContextHint(hint, { rerun: true });
            return;
        }

        window.__SEO_CONTEXT_HINT__ = Object.assign({}, window.__SEO_CONTEXT_HINT__ || {}, hint);
        if (window.SeoEngine && typeof window.SeoEngine.run === 'function') {
            window.SeoEngine.run({ hint: hint });
        }
    }

    window.MapsSEO = {
        getCurrentLang() {
            if (window.MapsI18n && window.MapsI18n.getCurrentLanguage) {
                return window.MapsI18n.getCurrentLanguage();
            }

            const pathMatch = window.location.pathname.match(/^\/(kr|en|jp)(\/|$)/i);
            if (pathMatch) return pathMatch[1].toLowerCase();

            const urlParams = new URLSearchParams(window.location.search);
            const urlLang = String(urlParams.get('lang') || '').toLowerCase();
            if (['kr', 'en', 'jp'].includes(urlLang)) return urlLang;
            return 'kr';
        },

        getMapIdFromURL() {
            const urlParams = new URLSearchParams(window.location.search);
            return urlParams.get('map') || null;
        },

        updateURL(mapId, categoryId = null) {
            const url = new URL(window.location.href);

            if (mapId) {
                url.searchParams.set('map', mapId);
            } else {
                url.searchParams.delete('map');
            }

            if (categoryId) {
                url.searchParams.set('category', categoryId);
            } else {
                url.searchParams.delete('category');
            }

            window.history.pushState({ mapId, categoryId }, '', url.toString());
        },

        findMapById(data, mapId) {
            if (!data || !data.maps) return null;

            for (const map of data.maps) {
                if (map.id === mapId) return { ...map, parentType: 'map' };

                if (map.categories) {
                    for (const category of map.categories) {
                        if (category.id === mapId) {
                            return { ...category, parentMap: map, parentType: 'category' };
                        }

                        const found = this.findInSubmaps(category.submaps, mapId, map, category);
                        if (found) return found;
                    }
                }
            }
            return null;
        },

        findInSubmaps(submaps, mapId, parentMap, parentCategory, parentSubmap = null) {
            if (!submaps) return null;

            for (const submap of submaps) {
                if (submap.id === mapId) {
                    return {
                        ...submap,
                        parentMap,
                        parentCategory,
                        parentSubmap,
                        parentType: 'submap'
                    };
                }

                if (submap.submaps) {
                    const found = this.findInSubmaps(submap.submaps, mapId, parentMap, parentCategory, submap);
                    if (found) return found;
                }
            }
            return null;
        },

        getMapName(mapInfo, lang) {
            if (!mapInfo) return null;
            const langKey = lang === 'kr' ? 'name' : `name_${lang}`;
            return mapInfo[langKey] || mapInfo.name || null;
        },

        getFullMapPath(mapInfo, lang) {
            if (!mapInfo) return [];

            const parts = [];

            if (mapInfo.parentMap) {
                const mapName = this.getMapName(mapInfo.parentMap, lang);
                if (mapName) parts.push(mapName);
            }

            if (mapInfo.parentCategory) {
                const categoryName = this.getMapName(mapInfo.parentCategory, lang);
                if (categoryName) parts.push(categoryName);
            }

            if (mapInfo.parentSubmap) {
                const parentSubmapName = this.getMapName(mapInfo.parentSubmap, lang);
                if (parentSubmapName) parts.push(parentSubmapName);
            }

            const currentName = this.getMapName(mapInfo, lang);
            if (currentName) parts.push(currentName);

            return parts;
        },

        buildPathString(mapInfo) {
            const lang = this.getCurrentLang();
            const rawParts = this.getFullMapPath(mapInfo, lang);
            const normalized = [];

            rawParts.forEach((part) => {
                const value = String(part || '').trim();
                if (!value) return;
                if (normalized.length > 0 && normalized[normalized.length - 1] === value) return;
                normalized.push(value);
            });

            return normalized.join(' > ');
        },

        syncSeo(mapInfo, mapId) {
            const path = this.buildPathString(mapInfo);
            if (path) {
                applyMapsSeoHint({
                    mode: 'detail',
                    entityKey: String(mapId || ''),
                    templateVars: { path: path }
                });
                return;
            }

            applyMapsSeoHint({
                mode: 'list',
                entityKey: '',
                templateVars: null
            });
        },

        onMapSelected(mapId, categoryId = null) {
            this.updateURL(mapId, categoryId);

            const mapsListData = window.MapsCore?.getMapsListData();
            if (!mapsListData) {
                this.syncSeo(null, '');
                return;
            }

            const mapInfo = this.findMapById(mapsListData, mapId);
            this.syncSeo(mapInfo, mapId);
        },

        async loadMapFromURL() {
            const mapId = this.getMapIdFromURL();
            if (!mapId) {
                this.syncSeo(null, '');
                return false;
            }

            let attempts = 0;
            while (!window.MapsCore?.getMapsListData() && attempts < 50) {
                await new Promise((resolve) => setTimeout(resolve, 100));
                attempts++;
            }

            const mapsListData = window.MapsCore?.getMapsListData();
            if (!mapsListData) {
                this.syncSeo(null, '');
                return false;
            }

            const mapInfo = this.findMapById(mapsListData, mapId);
            if (!mapInfo) {
                this.syncSeo(null, '');
                return false;
            }

            this.syncSeo(mapInfo, mapId);

            if (mapInfo.file && mapInfo.file.length > 0 && window.MapsCore) {
                await window.MapsCore.loadMap(mapInfo.file);
                return true;
            }

            return false;
        },

        init() {
            window.addEventListener('popstate', () => {
                this.loadMapFromURL();
            });

            this.syncSeo(null, '');
        }
    };

    window.MapsSEO.init();
})();
