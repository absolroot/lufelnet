// Maps SEO - URL 파라미터 및 메타 태그 동적 업데이트
(function() {
    'use strict';

    window.MapsSEO = {
        // 현재 언어 가져오기
        getCurrentLang() {
            if (window.MapsI18n && window.MapsI18n.getCurrentLanguage) {
                return window.MapsI18n.getCurrentLanguage();
            }

            const pathMatch = window.location.pathname.match(/^\/(kr|en|jp)(\/|$)/i);
            if (pathMatch) {
                return pathMatch[1].toLowerCase();
            }

            const urlParams = new URLSearchParams(window.location.search);
            const urlLang = String(urlParams.get('lang') || '').toLowerCase();
            if (['kr', 'en', 'jp'].includes(urlLang)) {
                return urlLang;
            }
            return 'kr';
        },

        // URL에서 맵 ID 읽기
        getMapIdFromURL() {
            const urlParams = new URLSearchParams(window.location.search);
            return urlParams.get('map') || null;
        },

        // URL 업데이트 (히스토리 pushState)
        updateURL(mapId, categoryId = null) {
            const url = new URL(window.location.href);

            if (mapId) {
                url.searchParams.set('map', mapId);
            } else {
                url.searchParams.delete('map');
            }

            if (categoryId) {
                url.searchParams.set('category', categoryId);
            }

            // URL 변경 (페이지 새로고침 없이)
            window.history.pushState({ mapId, categoryId }, '', url.toString());
        },

        // maps_list.json에서 맵 정보 찾기 (재귀)
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

        // submaps에서 재귀적으로 찾기
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

        // 맵 이름 가져오기 (언어별)
        getMapName(mapInfo, lang) {
            if (!mapInfo) return null;

            const langKey = lang === 'kr' ? 'name' : `name_${lang}`;
            return mapInfo[langKey] || mapInfo.name || null;
        },

        // 전체 경로 이름 생성 (카테고리 > 서브맵)
        getFullMapPath(mapInfo, lang) {
            if (!mapInfo) return null;

            const parts = [];

            // 부모 맵 (팰리스/메멘토스)
            if (mapInfo.parentMap) {
                const mapName = this.getMapName(mapInfo.parentMap, lang);
                if (mapName) parts.push(mapName);
            }

            // 카테고리
            if (mapInfo.parentCategory) {
                const categoryName = this.getMapName(mapInfo.parentCategory, lang);
                if (categoryName) parts.push(categoryName);
            }

            // 부모 서브맵
            if (mapInfo.parentSubmap) {
                const parentSubmapName = this.getMapName(mapInfo.parentSubmap, lang);
                if (parentSubmapName) parts.push(parentSubmapName);
            }

            // 현재 맵
            const currentName = this.getMapName(mapInfo, lang);
            if (currentName) parts.push(currentName);

            return parts;
        },

        // 페이지 제목 업데이트
        updateTitle(mapInfo) {
            const lang = this.getCurrentLang();
            const titleFromPack = (window.MapsI18n && window.MapsI18n.getText)
                ? window.MapsI18n.getText(lang, 'seoDefaultTitle')
                : '';
            const defaultTitle = (titleFromPack && titleFromPack !== 'seoDefaultTitle')
                ? titleFromPack
                : 'P5X 맵스 - 루페르넷';

            let title = defaultTitle;

            if (mapInfo) {
                const pathParts = this.getFullMapPath(mapInfo, lang);
                if (pathParts && pathParts.length > 0) {
                    // 카테고리 + 맵 이름 형식 (예: "시모츠나 팰리스 > 개미굴·정문 앞")
                    // pathParts: [parentMap, category, parentSubmap?, currentMap]
                    // 카테고리(index 1)와 현재 맵(마지막)을 표시
                    const mapName = pathParts[pathParts.length - 1];
                    const categoryName = pathParts.length > 1 ? pathParts[1] : null;

                    if (categoryName && categoryName !== mapName) {
                        title = `${categoryName} > ${mapName} - ${defaultTitle}`;
                    } else {
                        title = `${mapName} - ${defaultTitle}`;
                    }
                }
            }

            document.title = title;

            // OG/Twitter 태그도 업데이트
            const ogTitle = document.getElementById('og-title');
            const twitterTitle = document.getElementById('twitter-title');
            if (ogTitle) ogTitle.setAttribute('content', title);
            if (twitterTitle) twitterTitle.setAttribute('content', title);
        },

        // 메타 설명 업데이트
        updateDescription(mapInfo) {
            const lang = this.getCurrentLang();
            const descFromPack = (window.MapsI18n && window.MapsI18n.getText)
                ? window.MapsI18n.getText(lang, 'seoDefaultDescription')
                : '';
            const defaultDesc = (descFromPack && descFromPack !== 'seoDefaultDescription')
                ? descFromPack
                : 'P5X 맵 뷰어. 팰리스와 메멘토스의 모든 맵을 확인하세요.';

            let description = defaultDesc;

            if (mapInfo) {
                const pathParts = this.getFullMapPath(mapInfo, lang);
                if (pathParts && pathParts.length > 0) {
                    const pathStr = pathParts.join(' > ');
                    const templateFromPack = (window.MapsI18n && window.MapsI18n.getText)
                        ? window.MapsI18n.getText(lang, 'seoMapDescriptionTemplate')
                        : '{path} 맵 정보. P5X 팰리스와 메멘토스의 상세 맵을 확인하세요.';
                    const template = (templateFromPack && templateFromPack !== 'seoMapDescriptionTemplate')
                        ? templateFromPack
                        : '{path} 맵 정보. P5X 팰리스와 메멘토스의 상세 맵을 확인하세요.';
                    description = String(template).replace('{path}', pathStr) || defaultDesc;
                }
            }

            const metaDesc = document.getElementById('meta-description');
            const ogDesc = document.getElementById('og-description');
            const twitterDesc = document.getElementById('twitter-description');

            if (metaDesc) metaDesc.setAttribute('content', description);
            if (ogDesc) ogDesc.setAttribute('content', description);
            if (twitterDesc) twitterDesc.setAttribute('content', description);
        },

        // OG URL 업데이트
        updateOGUrl() {
            const ogUrl = document.getElementById('og-url');
            if (ogUrl) {
                ogUrl.setAttribute('content', window.location.href);
            }
        },

        // 맵 선택 시 호출 (외부에서 호출)
        onMapSelected(mapId, categoryId = null) {
            // URL 업데이트
            this.updateURL(mapId, categoryId);

            // maps_list.json에서 맵 정보 찾기
            const mapsListData = window.MapsCore?.getMapsListData();
            if (mapsListData) {
                const mapInfo = this.findMapById(mapsListData, mapId);
                this.updateTitle(mapInfo);
                this.updateDescription(mapInfo);
                this.updateOGUrl();
            }
        },

        // URL 파라미터에서 맵 로드 (페이지 로드 시)
        async loadMapFromURL() {
            const mapId = this.getMapIdFromURL();
            if (!mapId) return false;

            // maps_list.json 로드 대기
            let attempts = 0;
            while (!window.MapsCore?.getMapsListData() && attempts < 50) {
                await new Promise(resolve => setTimeout(resolve, 100));
                attempts++;
            }

            const mapsListData = window.MapsCore?.getMapsListData();
            if (!mapsListData) return false;

            const mapInfo = this.findMapById(mapsListData, mapId);
            if (!mapInfo) return false;

            // 제목/설명 업데이트
            this.updateTitle(mapInfo);
            this.updateDescription(mapInfo);

            // 맵 파일이 있으면 로드
            if (mapInfo.file && mapInfo.file.length > 0) {
                // MapSelectPanel을 통해 맵 선택 (UI 동기화를 위해)
                if (window.MapSelectPanel) {
                    // 카테고리 설정
                    if (mapInfo.parentCategory) {
                        // TODO: MapSelectPanel에서 카테고리/맵 선택 메서드 호출
                    }
                }

                // 맵 로드
                if (window.MapsCore) {
                    await window.MapsCore.loadMap(mapInfo.file);
                }
                return true;
            }

            return false;
        },

        // 초기화
        init() {
            // popstate 이벤트 (브라우저 뒤로/앞으로)
            window.addEventListener('popstate', (event) => {
                if (event.state && event.state.mapId) {
                    this.loadMapFromURL();
                }
            });

            // 페이지 로드 시 URL에서 맵 로드
            // (main.js에서 호출하도록 함)
        }
    };

    // 자동 초기화
    window.MapsSEO.init();
})();
