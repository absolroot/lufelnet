// 다국어 번역 로더 시스템
class TranslationLoader {
    static translationCache = {};
    
    // 번역 데이터 로드
    static async loadTranslations(category, lang) {
        if (lang === 'kr') return null; // 한국어는 원본 데이터 사용
        
        const cacheKey = `${category}_${lang}`;
        if (this.translationCache[cacheKey]) {
            return this.translationCache[cacheKey];
        }
        
        try {
            const response = await fetch(`${BASE_URL}/data/translations/${category}/${lang}.js?v=${APP_VERSION}`);
            if (!response.ok) throw new Error('Translation file not found');
            
            const translationText = await response.text();
            
            // 더 안전한 방법으로 JavaScript 실행
            const uniqueVarName = `tempTranslations_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
            
            // characterTranslations를 찾아서 고유한 변수명으로 교체
            const modifiedScript = translationText.replace(
                /const\s+characterTranslations\s*=/g, 
                `window.${uniqueVarName} =`
            );
            
            try {
                // Function 생성자를 사용하여 안전하게 실행
                new Function(modifiedScript)();
                
                // 임시 변수에서 데이터 가져오기
                const translations = window[uniqueVarName];
                
                // 정리
                delete window[uniqueVarName];
                
                if (!translations) {
                    throw new Error('Failed to extract translation data');
                }
                
                // console.log(`Translation loaded for ${category}/${lang}:`, translations);
                
                this.translationCache[cacheKey] = translations;
                return translations;
                
            } catch (execError) {
                console.error('Failed to execute translation script:', execError);
                throw execError;
            }
        } catch (error) {
            console.warn(`Translation not found: ${category}/${lang}`, error);
            return null;
        }
    }
    
    // 캐릭터 데이터 번역
    static translateCharacterData(originalData, translations, lang) {
        if (!translations || lang === 'kr') return originalData;
        
        const translatedData = {};
        
        for (const [characterKey, characterInfo] of Object.entries(originalData)) {
            const translatedCharacter = { ...characterInfo };
            
            // 캐릭터 이름 번역
            if (translations.names && translations.names[characterKey]) {
                translatedCharacter.name = translations.names[characterKey];
            }
            
            // 스킬/속성 번역
            if (translations.elements && translations.elements[characterInfo.element]) {
                translatedCharacter.elementTranslated = translations.elements[characterInfo.element];
            }
            
            if (translations.positions && translations.positions[characterInfo.position]) {
                translatedCharacter.positionTranslated = translations.positions[characterInfo.position];
            }
            
            // 설명 번역
            if (translations.descriptions && translations.descriptions[characterKey]) {
                translatedCharacter.description = translations.descriptions[characterKey];
            }
            
            // 태그 번역
            if (translations.tags && characterInfo.tag) {
                translatedCharacter.tagTranslated = this.translateTags(characterInfo.tag, translations.tags);
            }
            
            // 계시 번역
            if (translations.revelations) {
                if (characterInfo.main_revelation) {
                    translatedCharacter.main_revelation_translated = characterInfo.main_revelation.map(
                        rev => translations.revelations[rev] || rev
                    );
                }
                if (characterInfo.sub_revelation) {
                    translatedCharacter.sub_revelation_translated = characterInfo.sub_revelation.map(
                        rev => translations.revelations[rev] || rev
                    );
                }
            }
            
            // 스탯 옵션 번역
            if (translations.stats) {
                ['sub_revel2', 'sub_revel3', 'sub_revel4', 'sub_option1', 'sub_option2', 'sub_option3'].forEach(field => {
                    if (characterInfo[field]) {
                        translatedCharacter[field + '_translated'] = characterInfo[field].map(
                            stat => translations.stats[stat] || stat
                        );
                    }
                });
            }
            
            // 심상 스킬 번역
            if (translations.mindSkills) {
                if (characterInfo.mind_stats1) {
                    translatedCharacter.mind_stats1_translated = this.translateMindStat(characterInfo.mind_stats1, translations.mindSkills);
                }
                if (characterInfo.mind_stats2) {
                    translatedCharacter.mind_stats2_translated = this.translateMindStat(characterInfo.mind_stats2, translations.mindSkills);
                }
            }
            
            translatedData[characterKey] = translatedCharacter;
        }
        
        return translatedData;
    }
    
    // 페르소나 데이터 번역
    static translatePersonaData(originalData, translations, lang) {
        if (!translations || lang === 'kr') return originalData;
        
        const translatedData = {};
        
        for (const [personaKey, personaInfo] of Object.entries(originalData)) {
            const translatedPersona = { ...personaInfo };
            
            // 페르소나 이름 번역
            if (translations.names && translations.names[personaKey]) {
                translatedPersona.nameTranslated = translations.names[personaKey];
            }
            
            // 본능 번역
            if (translations.instincts && personaInfo.instinct) {
                if (translations.instincts[personaInfo.instinct.name]) {
                    translatedPersona.instinct = {
                        ...personaInfo.instinct,
                        nameTranslated: translations.instincts[personaInfo.instinct.name].name,
                        effectsTranslated: translations.instincts[personaInfo.instinct.name].effects || personaInfo.instinct.effects
                    };
                }
            }
            
            // 고유 스킬 번역
            if (translations.skills && personaInfo.uniqueSkill) {
                if (translations.skills[personaInfo.uniqueSkill.name]) {
                    translatedPersona.uniqueSkill = {
                        ...personaInfo.uniqueSkill,
                        nameTranslated: translations.skills[personaInfo.uniqueSkill.name].name,
                        effectTranslated: translations.skills[personaInfo.uniqueSkill.name].effect || personaInfo.uniqueSkill.effect
                    };
                }
            }
            
            // 하이라이트 번역
            if (translations.highlights && personaInfo.highlight) {
                translatedPersona.highlight = {
                    ...personaInfo.highlight,
                    effectTranslated: translations.highlights[personaKey] || personaInfo.highlight.effect
                };
            }
            
            translatedData[personaKey] = translatedPersona;
        }
        
        return translatedData;
    }
    
    // 계시 데이터 번역
    static translateRevelationData(originalData, translations, lang) {
        if (!translations || lang === 'kr') return originalData;
        
        const translatedData = { ...originalData };
        
        // 주 성위 번역
        if (translations.main && originalData.main) {
            translatedData.mainTranslated = {};
            for (const [key, value] of Object.entries(originalData.main)) {
                translatedData.mainTranslated[key] = translations.main[key] || key;
            }
        }
        
        // 일월성진 번역
        if (translations.sub && originalData.sub) {
            translatedData.subTranslated = {};
            for (const [key, value] of Object.entries(originalData.sub)) {
                translatedData.subTranslated[key] = translations.sub[key] || key;
            }
        }
        
        // 효과 번역
        if (translations.effects && originalData.sub_effects) {
            translatedData.sub_effects_translated = {};
            for (const [key, effects] of Object.entries(originalData.sub_effects)) {
                translatedData.sub_effects_translated[key] = {
                    ...effects,
                    typeTranslated: effects.type.map(type => translations.effects[type] || type)
                };
            }
        }
        
        return translatedData;
    }
    
    // 태그 번역 헬퍼 함수
    static translateTags(tagString, tagTranslations) {
        if (!tagString || !tagTranslations) return tagString;
        
        return tagString.split(',').map(tag => {
            const trimmedTag = tag.trim();
            return tagTranslations[trimmedTag] || trimmedTag;
        }).join(', ');
    }
    
    // 심상 스킬 번역 헬퍼 함수 (숫자와 기호는 유지)
    static translateMindStat(statString, mindSkillTranslations) {
        if (!statString || !mindSkillTranslations) return statString;
        
        // "공격력 20%" -> "ATK 20%" 형태로 번역
        for (const [korean, english] of Object.entries(mindSkillTranslations)) {
            if (statString.includes(korean)) {
                return statString.replace(korean, english);
            }
        }
        
        return statString;
    }
    
    // 텍스트 번역 헬퍼 함수 (폴백 지원)
    static getTranslatedText(key, translations, fallback, category = null) {
        if (!translations) return fallback || key;
        
        if (category && translations[category] && translations[category][key]) {
            return translations[category][key];
        }
        
        return translations[key] || fallback || key;
    }
    
    // UI 텍스트 번역 (기존 i18n 시스템과 연동)
    static translateUIText(elementId, translationKey, lang) {
        const element = document.getElementById(elementId);
        if (!element) return;
        
        // 기존 i18n 데이터에서 가져오기
        if (window.i18nData && window.i18nData[lang] && window.i18nData[lang][translationKey]) {
            element.textContent = window.i18nData[lang][translationKey];
        }
    }
}

// 전역에서 사용할 수 있도록 export
window.TranslationLoader = TranslationLoader; 