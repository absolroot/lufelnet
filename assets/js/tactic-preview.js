class TacticPreview {
    constructor() {
        this.previewContainer = document.createElement('div');
        this.previewContainer.className = 'tactic-preview-container';
    }

    // URL에서 택틱 데이터를 가져와서 프리뷰 생성
    async createPreview(tacticUrl) {
        try {
            // URL에서 data 파라미터 추출
            const url = new URL(tacticUrl);
            const sharedData = url.searchParams.get('data');
            if (!sharedData) return null;

            // 데이터 파싱
            const tacticData = processSharedData(sharedData);
            if (!tacticData) return null;

            // 프리뷰 컨테이너 생성
            const previewDiv = document.createElement('div');
            previewDiv.className = 'tactic-preview';

            // 파티 이미지 컨테이너
            const partyImagesContainer = document.createElement('div');
            partyImagesContainer.className = 'party-images-container';

            // 파티 이미지 div
            const partyImagesDiv = document.createElement('div');
            partyImagesDiv.className = 'party-images';

            // 파티원 정렬 및 이미지 생성
            const orderedParty = tacticData.p
                .filter(pm => pm.name !== "")
                .sort((a, b) => {
                    if (a.order === "-") return 1;
                    if (b.order === "-") return -1;
                    return parseInt(a.order, 10) - parseInt(b.order, 10);
                });

            orderedParty.forEach(member => {
                // 원더인 경우 건너뛰기
                if (member.name === "원더") return;
                
                const container = document.createElement('div');
                if (characterData[member.name]) {
                    container.className = 'character-container';

                    const charImg = document.createElement('img');
                    charImg.className = 'character-img';
                    charImg.src = `/assets/img/character-half/${member.name}.webp`;
                    charImg.alt = member.name;
                    charImg.title = member.name;
                    container.appendChild(charImg);
                }

                // 순서 이미지
                /*
                if (["1", "2", "3", "4"].includes(member.order)) {
                    const orderImg = document.createElement('img');
                    orderImg.className = 'order-img';
                    orderImg.src = `/assets/img/ui/num0${member.order}.png`;
                    orderImg.alt = `순서 ${member.order}`;
                    container.appendChild(orderImg);
                }*/

                // 의식 이미지
                const ritualLevel = parseInt(member.ritual);
                if (ritualLevel >= 1 && ritualLevel <= 6) {
                    const ritualImg = document.createElement('img');
                    ritualImg.className = 'ritual-img';
                    ritualImg.src = `/assets/img/ritual/num${ritualLevel}.png`;
                    ritualImg.alt = `의식 ${ritualLevel}`;
                    container.appendChild(ritualImg);
                }

                // 계시 이미지
                /*
                if (member.mainRev && member.subRev) {
                    const revelationsContainer = document.createElement('div');
                    revelationsContainer.className = 'revelations-container';

                    const mainRevImg = document.createElement('img');
                    mainRevImg.className = 'revelation-img main-rev';
                    mainRevImg.src = `/assets/img/tactic-revelation/${member.mainRev}.webp`;
                    mainRevImg.alt = member.mainRev;
                    revelationsContainer.appendChild(mainRevImg);

                    const subRevImg = document.createElement('img');
                    subRevImg.className = 'revelation-img sub-rev';
                    subRevImg.src = `/assets/img/tactic-revelation/${member.subRev}.webp`;
                    subRevImg.alt = member.subRev;
                    revelationsContainer.appendChild(subRevImg);

                    container.appendChild(revelationsContainer);
                }*/

                partyImagesDiv.appendChild(container);
            });

            partyImagesContainer.appendChild(partyImagesDiv);

            // 원더 페르소나 이미지 추가
            /*
            if (tacticData.w.some(persona => persona !== "")) {
                const personaImagesDiv = document.createElement('div');
                personaImagesDiv.className = 'persona-images';

                tacticData.w.forEach(persona => {
                    if (persona) {
                        const container = document.createElement('div');
                        container.className = 'persona-container';

                        const personaImg = document.createElement('img');
                        personaImg.className = 'persona-img';
                        personaImg.src = `/assets/img/tactic-persona/${persona}.webp`;
                        personaImg.alt = persona;
                        personaImg.title = `${persona}\n본능: ${personaData[persona]?.instinct?.name || ""}\n\n${personaData[persona]?.instinct?.effects?.join("\n") || ""}`;
                        
                        container.appendChild(personaImg);
                        personaImagesDiv.appendChild(container);
                    }
                });

                partyImagesContainer.appendChild(personaImagesDiv);
            }*/

            previewDiv.appendChild(partyImagesContainer);
            return previewDiv;

        } catch (error) {
            console.error('택틱 프리뷰 생성 실패:', error);
            return null;
        }
    }

    // TacticShare 클래스의 renderPosts 메서드에서 호출할 수 있는 메서드
    async addPreviewToPost(postElement, tacticUrl) {
        const preview = await this.createPreview(tacticUrl);
        if (preview) {
            const previewContainer = postElement.querySelector('.tactic-preview-container');
            if (previewContainer) {
                previewContainer.replaceWith(preview);
            } else {
                const linkElement = postElement.querySelector('a');
                if (linkElement) {
                    linkElement.after(preview);
                }
            }
        }
    }
}

// 스타일은 tactic.css에 이미 정의되어 있으므로 추가 스타일은 필요하지 않습니다. 