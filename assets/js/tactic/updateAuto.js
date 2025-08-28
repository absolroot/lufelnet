    /* ========== 자동 액션 업데이트 ========== */
      function updateAutoActions() {
        // 임포트 중에는 자동 액션 업데이트 스킵 (턴 데이터 보존)
        if (window.__IS_APPLYING_IMPORT) {
          return;
        }
        // URL 파라미터에 data가 있는 경우에만 자동 업데이트를 건너뜀
     //   if (new URLSearchParams(window.location.search).has('data')) {
     //     return;
     //   }

        turns.forEach(turn => {
          // 기존 액션들을 유지
          const existingActions = [...turn.actions];
          
          // 현재 파티 멤버들의 순서대로 정렬된 배열 
          const sortedParty = partyMembers
            .filter(pm => pm.name !== "") 
            .sort((a, b) => parseInt(a.order, 10) - parseInt(b.order, 10));

          // 자동 액션 업데이트
          let updatedActions = existingActions.map(action => {  // const를 let으로 변경
            if (action.type === 'manual') {
              return action;
            }
            
            // 자동 액션의 경우, 해당 캐릭터가 현재 파티에 없으면 제거
            if (!sortedParty.some(pm => pm.name === action.character)) {
              return null;
            }
            
            return action;
          }).filter(action => action !== null);

          // 새로운 파티원에 대한 자동 액션은 생성하지 않음
          // (임포트 데이터 보존 및 의식 패턴/사용자 조작에 의해서만 생성되도록 함)

          // 해명괴도의 빈칸 action 삭제
          updatedActions = updatedActions.filter(action => {
            const member = partyMembers.find(pm => pm.name === action.character);
            if (member?.index === 4 && !action.action) {
              return false;
            }
            return true;
          });

          // 자동 액션 순서 재정렬
          const finalActions = [];
          const processedActions = new Set(); // 처리된 액션 처리
          
          // order 0인 자동 액션 먼저 추가
          sortedParty.forEach(member => {
            const pattern = findPatternForLevel(member.name, member.ritual);
            const turnIndex = turns.indexOf(turn);
            if (pattern && pattern[turnIndex]) {
              const hasOrder0 = pattern[turnIndex].some(action => action.order === 0);
              if (hasOrder0) {
                const autoAction = updatedActions.find(
                  action => action.type === 'auto' && action.character === member.name
                );
                if (autoAction && !processedActions.has(autoAction)) {
                  finalActions.unshift(autoAction);
                  processedActions.add(autoAction); // 처리된 액션 기록
                }
              }
            }
          });
          
          // 나머지 자동 액션 추가
          sortedParty.forEach(member => {
            const autoAction = updatedActions.find(
              action => action.type === 'auto' && action.character === member.name
            );
            if (autoAction && !processedActions.has(autoAction)) {
              finalActions.push(autoAction);
              processedActions.add(autoAction); // 처리된 액션 기록
            }
          });
          
          // 수동 액션 추가
          updatedActions
            .filter(action => action.type === 'manual')
            .forEach(action => finalActions.push(action));

          turn.actions = finalActions;
        });
        
        renderTurns();
      }