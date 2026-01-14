// item_from.js
// 선물 아이템의 획득처 표시 및 재귀적 조합/씨앗 경로 모달

(function() {
    'use strict';

    const BASE_URL = (typeof window !== 'undefined' && window.BASE_URL) || '';

    // 현재 언어 가져오기
    function getCurrentLanguage() {
        const urlParams = new URLSearchParams(window.location.search);
        const langParam = urlParams.get('lang');
        if (langParam === 'en') return 'en';
        if (langParam === 'jp') return 'jp';
        return 'kr';
    }

    // 번역 함수 (간단한 버전)
    function t(key) {
        const lang = getCurrentLanguage();
        const translations = {
            '작업대': { en: 'Workbench', jp: '作業台' },
            '획득처': { en: 'Source', jp: '入手先' },
            '상점': { en: 'Shop', jp: 'ショップ' },
            '재배': { en: 'Cultivation', jp: '栽培' },
            // 통화 이름
            '현금': { en: 'Money', jp: '所持金' }
        };
        return translations[key]?.[lang] || key;
    }

    // 조합식 텍스트 생성
    function generateCompoundText(item) {
        if (!item.compound || item.compound.length === 0) {
            return null;
        }

        const parts = item.compound.map(comp => {
            const itemName = comp.item?.name || '';
            const count = comp.itemCount || 1;
            return `${count} ${itemName}`;
        });

        return parts.join(' + ');
    }

    // 재귀적으로 아이템 경로 추적 (트리 구조 생성)
    function buildItemTree(item, depth = 0, maxDepth = 10) {
        if (depth > maxDepth) {
            return { type: 'max_depth', name: item.name || '...' };
        }

        const sources = item.source || [];
        const tree = {
            name: item.name || '',
            icon: item.image || item.icon || '',
            type: item.type || '',
            sources: [],
            depth: depth
        };

        // compound가 있으면 조합 경로 추가
        if (sources.includes('compound') && item.compound && item.compound.length > 0) {
            tree.sources.push({
                type: 'compound',
                label: t('작업대'),
                materials: item.compound.map(comp => {
                    const material = comp.item;
                    const count = comp.itemCount || 1;
                    if (!material) return null;
                    const materialTree = buildItemTree(material, depth + 1, maxDepth);
                    materialTree.itemCount = count; // 개수 정보 추가
                    return materialTree;
                }).filter(Boolean)
            });
        }

        // seed가 있으면 씨앗 경로 추가
        if (sources.includes('seed') && item.seed && item.seed.length > 0) {
            item.seed.forEach(seedData => {
                const seed = seedData.seed;
                if (!seed) return;
                
                tree.sources.push({
                    type: 'seed',
                    label: seedData.rate || '100%',
                    consume_ap: seedData.consume_ap || [],
                    material: buildItemTree(seed, depth + 1, maxDepth)
                });
            });
        }

        // shop이 있으면 상점 경로 추가
        if (sources.includes('shop') && item.shop && item.shop.length > 0) {
            tree.sources.push({
                type: 'shop',
                shops: item.shop.map(shop => ({
                    mapName: shop.mapName,
                    shopName: shop.shopName,
                    price: shop.price,
                    discountPrice: shop.discountPrice,
                    moneyName: shop.moneyName,
                    resetType: shop.resetType,
                    maxBuy: shop.maxBuy
                }))
            });
        }

        // 가격 정보 추가 (재귀적으로 계산)
        tree.price = calculateItemPrice(tree);
        tree.content_bg = item.content_bg || null;

        return tree;
    }

    // 재귀적으로 아이템의 현금 가치 계산
    function calculateItemPrice(tree) {
        if (!tree || !tree.sources || tree.sources.length === 0) {
            return null;
        }

        // shop에서 현금 가격 찾기
        const shopSource = tree.sources.find(s => s.type === 'shop');
        if (shopSource && shopSource.shops && shopSource.shops.length > 0) {
            const shop = shopSource.shops[0];
            // 현금인 경우만 가격 반환
            const moneyName = shop.moneyName || '';
            if (moneyName === '현금' || moneyName === 'Money' || moneyName === '所持金') {
                return shop.discountPrice && shop.discountPrice < shop.price 
                    ? shop.discountPrice 
                    : shop.price;
            }
        }

        // compound인 경우 재료들의 가격 합산
        const compoundSource = tree.sources.find(s => s.type === 'compound');
        if (compoundSource && compoundSource.materials && compoundSource.materials.length > 0) {
            let totalPrice = 0;
            let allHavePrice = true;
            
            compoundSource.materials.forEach(material => {
                const materialPrice = calculateItemPrice(material);
                if (materialPrice === null) {
                    allHavePrice = false;
                } else {
                    const count = material.itemCount || 1;
                    totalPrice += materialPrice * count;
                }
            });
            
            return allHavePrice ? totalPrice : null;
        }

        // seed인 경우 확률을 곱해서 계산
        const seedSource = tree.sources.find(s => s.type === 'seed');
        if (seedSource && seedSource.material) {
            const seedPrice = calculateItemPrice(seedSource.material);
            if (seedPrice !== null) {
                // 확률 파싱 (예: "100%" -> 1.0, "70.0%" -> 0.7)
                const rateStr = seedSource.label || '100%';
                const rateMatch = rateStr.match(/(\d+(?:\.\d+)?)/);
                const rate = rateMatch ? parseFloat(rateMatch[1]) / 100 : 1.0;
                return seedPrice * rate;
            }
        }

        return null;
    }

    // 모달 HTML 생성
    function createModalHTML(itemTree) {
        function renderTree(node, depth = 0) {
            if (!node) return '';

            let html = '';
            const marginLeft = depth * 24;

            // 아이템 정보
            const iconPath = node.icon ? `${BASE_URL}/assets/img/synergy/item/${node.icon}` : '';
            
            // 가격 정보 생성 (계산된 가격 사용)
            let priceInfo = '';
            if (node.price !== null && node.price !== undefined) {
                priceInfo = `<span class="item-tree-price">${Math.round(node.price).toLocaleString()} ${t('현금')}</span>`;
            } else if (node.sources) {
                // 계산된 가격이 없으면 shop에서 직접 가져오기
                const shopSource = node.sources.find(s => s.type === 'shop');
                if (shopSource && shopSource.shops && shopSource.shops.length > 0) {
                    const shop = shopSource.shops[0];
                    const moneyName = shop.moneyName || '';
                    // 현금인 경우만 표시
                    if (moneyName === '현금' || moneyName === 'Money' || moneyName === '所持金') {
                        if (shop.discountPrice && shop.discountPrice < shop.price) {
                            priceInfo = `<span class="item-tree-price">${shop.discountPrice.toLocaleString()} ${moneyName}</span>`;
                        } else if (shop.price) {
                            priceInfo = `<span class="item-tree-price">${shop.price.toLocaleString()} ${moneyName}</span>`;
                        }
                    }
                }
            }
            
            // content_bg 정보
            let contentBgInfo = '';
            if (node.content_bg) {
                contentBgInfo = `<div class="item-tree-content-bg">${node.content_bg}</div>`;
            }
            
            html += `
                <div class="item-tree-node" style="margin-left: ${marginLeft}px;">
                    ${iconPath ? `<img src="${iconPath}" alt="${node.name}" class="item-tree-icon" onerror="this.onerror=null; this.style.display='none';">` : ''}
                    <div class="item-tree-info">
                        <div class="item-tree-header">
                            <span class="item-tree-name">${node.name}</span>
                            ${node.type ? `<span class="item-tree-type">(${node.type})</span>` : ''}
                            ${priceInfo}
                        </div>
                        ${contentBgInfo}
                    </div>
                </div>
            `;

            // 각 획득 경로 표시
            if (node.sources && node.sources.length > 0) {
                node.sources.forEach(source => {
                    if (source.type === 'compound') {
                        html += `<div class="item-tree-compound" style="margin-left: ${marginLeft + 28}px;">
                            <span class="item-tree-label">${source.label}:</span>
                        </div>`;
                        source.materials.forEach(material => {
                            // 개수 정보를 이름에 추가
                            const count = material.itemCount || 1;
                            const originalName = material.name;
                            if (count > 1) {
                                material.name = `${count} ${originalName}`;
                            }
                            html += renderTree(material, depth + 1);
                            // 원래 이름 복원 (다른 곳에서 사용할 수 있으므로)
                            if (count > 1) {
                                material.name = originalName;
                            }
                        });
                    } else if (source.type === 'seed') {
                        html += `<div class="item-tree-seed" style="margin-left: ${marginLeft + 28}px;">
                            <span class="item-tree-label">${t('재배')} (${source.label}):</span>
                        </div>`;
                        html += renderTree(source.material, depth + 1);
                    } else if (source.type === 'shop') {
                        html += `<div class="item-tree-shop" style="margin-left: ${marginLeft + 28}px;">
                            <span class="item-tree-label">${t('상점')}:</span>
                            ${source.shops.map(shop => {
                                const shopName = (shop.mapName ? shop.mapName + ' ' : '') + (shop.shopName || '');
                                let shopInfo = shopName;
                                
                                // resetType과 maxBuy 정보 추가
                                const resetTypeText = shop.resetType && window.translateResetType ? window.translateResetType(shop.resetType) : (shop.resetType || '');
                                const maxBuyText = shop.maxBuy !== undefined && shop.maxBuy !== null ? (shop.maxBuy === -1 ? '-' : shop.maxBuy) : '';
                                
                                const additionalInfo = [];
                                if (resetTypeText && resetTypeText !== '-') {
                                    additionalInfo.push(resetTypeText);
                                }
                                if (maxBuyText && maxBuyText !== '') {
                                    additionalInfo.push(maxBuyText);
                                }
                                
                                if (additionalInfo.length > 0) {
                                    shopInfo += ` (${additionalInfo.join(', ')})`;
                                }
                                
                                return `<span class="item-tree-shop-name">${shopInfo}</span>`;
                            }).join(', ')}
                        </div>`;
                    }
                });
            }

            return html;
        }

        return `
            <div class="item-from-modal-overlay" id="itemFromModalOverlay">
                <div class="item-from-modal">
                    <div class="item-from-modal-header">
                        <h3>${t('획득처')}</h3>
                        <button class="item-from-modal-close" id="itemFromModalClose">×</button>
                    </div>
                    <div class="item-from-modal-content">
                        ${renderTree(itemTree, 0)}
                    </div>
                </div>
            </div>
        `;
    }

    // 모달 표시
    function showItemFromModal(item) {
        const itemTree = buildItemTree(item);
        const modalHTML = createModalHTML(itemTree);
        
        // 기존 모달 제거
        const existingModal = document.getElementById('itemFromModalOverlay');
        if (existingModal) {
            existingModal.remove();
        }

        // 모달 추가
        document.body.insertAdjacentHTML('beforeend', modalHTML);

        // 닫기 버튼 이벤트
        const closeBtn = document.getElementById('itemFromModalClose');
        const overlay = document.getElementById('itemFromModalOverlay');
        
        if (closeBtn) {
            closeBtn.addEventListener('click', () => {
                if (overlay) overlay.remove();
            });
        }

        if (overlay) {
            overlay.addEventListener('click', (e) => {
                if (e.target === overlay) {
                    overlay.remove();
                }
            });
        }
    }

    // 획득처 텍스트 생성 (compound 우선)
    function generateSourceText(item) {
        if (!item || !item.source || item.source.length === 0) {
            return '-';
        }

        const sources = item.source;

        // compound가 있으면 조합식 반환
        if (sources.includes('compound')) {
            const compoundText = generateCompoundText(item);
            if (compoundText) {
                return compoundText;
            }
        }

        // seed가 있으면 씨앗 정보 반환
        if (sources.includes('seed') && item.seed && item.seed.length > 0) {
            const seedName = item.seed[0]?.seed?.name || '씨앗';
            return `씨앗: ${seedName}`;
        }

        // shop이 있으면 기존 로직 사용 (synergy.js에서 처리)
        if (sources.includes('shop')) {
            return null; // null 반환 시 synergy.js의 기존 로직 사용
        }

        return '-';
    }

    // 전역 함수로 노출
    window.generateSourceText = generateSourceText;
    window.showItemFromModal = showItemFromModal;
    window.calculateItemPrice = calculateItemPrice;
    window.buildItemTree = buildItemTree;
})();

