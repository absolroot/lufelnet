
      // 의식 레벨에 맞는 패턴을 찾는 함수
      function findPatternForLevel(characterName, ritualLevel) {
        const characterPatterns = ritualPatterns[characterName];
        if (!characterPatterns) return null;

        const matchingPattern = characterPatterns.find(patternData => {
          if (patternData.level.includes('-')) {
            const [min, max] = patternData.level.split('-').map(Number);
            const level = Number(ritualLevel);
            return level >= min && level <= max;
          } else {
            return patternData.level === ritualLevel;
          }
        });

        return matchingPattern ? matchingPattern.pattern : null;
      }