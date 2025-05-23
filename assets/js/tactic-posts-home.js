const helloConfig = {
    a: `*; \u001d2J(\u000e?#3)#$K0\u0001\";\u0002\u0014*$ZZW\u001f?\u0001\u0007*\u000er \u0001`,
    b: `\u001d\u000f\r\u000f\u001d]\u0004\u001cZ\u0007\u001b\u0011\u000f\u000bH\u0016\u000f\u0012\u0019\u0000H\r\u0018\\`,
    c: `\u001d\u000f\r\u000f\u001d]\u0004\u001c`,
    d: `\u001d\u000f\r\u000f\u001d]\u0004\u001cZ\u0007\u001b\u0011\u000f\u000bH\u0016\u000f\f\u0015\u0001\u0011K\n[\u001b`,
    e: `UB_]Z\u0018]QB]F`,
    f: `ZO_RU\u0016XSGXCWVVL\u0004\u0002NTF\u0000S\u0007H[QAU\u001cP\rU\u0018]]\u001e\u0006LQW`,
    g: ` XWW%w\"3A5\"T`
}
const domain_ = "lufel.net";
const hello2 = (str, st) => {
return str.split('').map(char => {
    const code = char.charCodeAt(0); if (code >= 65 && code <= 90) return String.fromCharCode(((code - 65 - st + 26) % 26) + 65); if (code >= 97 && code <= 122) return String.fromCharCode(((code - 97 - st + 26) % 26) + 97); if (code >= 48 && code <= 57) return String.fromCharCode(((code - 48 - st + 10) % 10) + 48); return char;
}).join('');
};
const num2Config = {};
for (const key in helloConfig) {if (helloConfig.hasOwnProperty(key)) {num2Config[key] = shakeit(helloConfig[key], domain_);}}

const eB1ilzya1uivb = "KGZ1bmN0aW9uKCkgeyBjb25zdCBDMWRlM2wxemR2Ym5FSWxJMWZyID0geyBhcGlLZXk6IGhlbGxvMihudW0yQ29uZmlnLmEsIDUpLCBhdXRoRG9tYWluOiBoZWxsbzIobnVtMkNvbmZpZy5iLCA1KSwgcHJvamVjdElkOiBoZWxsbzIobnVtMkNvbmZpZy5jLCA1KSwgc3RvcmFnZUJ1Y2tldDogaGVsbG8yKG51bTJDb25maWcuZCwgNSksIG1lc3NhZ2luZ1NlbmRlcklkOiBoZWxsbzIobnVtMkNvbmZpZy5lLCA1KSwgYXBwSWQ6IGhlbGxvMihudW0yQ29uZmlnLmYsIDUpLCBtZWFzdXJlbWVudElkOiBoZWxsbzIobnVtMkNvbmZpZy5nLCA1KX07IHdpbmRvdy5DMWRlM2wxemR2Ym5FSWxJMWZyID0gQzFkZTNsMXpkdmJuRUlsSTFmcjt9KSgpOw==";

eval(atob(eB1ilzya1uivb));

firebase.initializeApp(window.C1de3l1zdvbnEIlI1fr);
const db = firebase.firestore();

class TacticShare {
constructor(options = {}) {
    this.currentPage = 1;
    this.postsPerPage = options.postsPerPage || 10;
    this.lastDoc = null;
    this.firstDoc = null;
    this.userIP = '';
    this.likeDebounceMap = new Map(); // 좋아요 디바운스 맵
    this.likeCooldown = 10000; // 좋아요 쿨다운 10초
    this.dailyPostLimit = 5;
    this.POSTS_PER_CHUNK = 1000; // 청크당 게시물 수를 1000개로 증가
    this.currentView = 'all'; // 현재 보기 모드
    this.searchKeyword = ''; // 검색어
    this.badWords = []; // 비속어 목록을 저장할 배열
    this.currentRankingPeriod = 'weekly';
    this.cachedPosts = null;  // 전체 포스트 캐시
    this.lastCacheUpdate = null;  // 마지막 캐시 업데이트 시간
    this.cacheDuration = 5 * 60 * 1000;  // 캐시 유효 시간 (5분)
    
    this.getUserIP();
    this.loadPosts();
    this.initTabs();
}

async handleLike(postId) {
    // postId 검증
    if (!/^[A-Za-z0-9-_]+$/.test(postId)) {
        console.error('잘못된 게시물 ID');
        return;
    }

    // 쿨다운 체크
    if (this.likeDebounceMap.has(postId)) {
        const lastLikeTime = this.likeDebounceMap.get(postId);
        const timeDiff = Date.now() - lastLikeTime;
        if (timeDiff < this.likeCooldown) {
            console.log('좋아요는 10초에 한 번만 가능합니다.');
            return;
        }
    }

    try {
        this.likeDebounceMap.set(postId, Date.now());
        const chunkNumber = Math.floor(parseInt(postId) / this.POSTS_PER_CHUNK);
        const chunkRef = db.collection('post_chunks').doc(`chunk_${chunkNumber}`);

        await db.runTransaction(async (transaction) => {
            const chunkDoc = await transaction.get(chunkRef);
            if (!chunkDoc.exists || !chunkDoc.data().posts[postId]) {
                throw new Error('게시물을 찾을 수 없습니다.');
            }

            const post = chunkDoc.data().posts[postId];
            const likes = post.likes || { count: 0, recentIPs: [] };

            if (likes.recentIPs.includes(this.userIP)) {
                throw new Error('이미 좋아요를 누르셨습니다!');
            }

            if (likes.recentIPs.length >= 1000) {
                likes.recentIPs = likes.recentIPs.slice(-900);
            }

            likes.count++;
            likes.recentIPs.push(this.userIP);

            transaction.update(chunkRef, {
                [`posts.${postId}.likes`]: likes
            });

            this.updateLikesDisplay(postId, likes);

            // 캐시 업데이트
            if (this.cachedPosts && this.cachedPosts[postId]) {
                this.cachedPosts[postId].likes = likes;
                this.loadRanking(); // 랭킹 즉시 업데이트
            }
        });

        } catch (error) {
        console.error('좋아요 실패:', error);
        if (error.message === '이미 좋아요를 누르셨습니다!') {
            const post = document.querySelector(`.post-item[data-post-id="${postId}"]`);
            if (post) {
                const likeButton = post.querySelector('.like-button');
                if (likeButton) {
                    likeButton.classList.add('liked');
                    likeButton.disabled = true;
                }
            }
        }
        alert(error.message || '좋아요 처리 중 오류가 발생했습니다.');
    }
}

async loadPosts(direction = 'next') {
    try {
        if (!this.tacticPreview) {
            this.tacticPreview = new TacticPreview();
        }

        // 현재 청크 번호 계산 (1000개 단위로)
        const currentChunk = Math.floor((this.currentPage - 1) / this.POSTS_PER_CHUNK);
        const chunkRef = db.collection('post_chunks').doc(`chunk_${currentChunk}`);
        
        const doc = await chunkRef.get();
        if (!doc.exists) {
            console.log('청크가 존재하지 않습니다.');
            this.renderPosts([]);
            return;
        }

        const chunkData = doc.data();
        console.log('청크 데이터:', chunkData); // 디버깅용

        const posts = Object.values(chunkData.posts || {})
            .filter(post => {
                // 검색어 필터링
                const matchesSearch = !this.searchKeyword || 
                    post.title.toLowerCase().includes(this.searchKeyword);
                
                // 베스트 필터링
                const matchesView = this.currentView === 'all' || 
                    (this.currentView === 'best' && post.likes?.count >= 10);
                
                return matchesSearch && matchesView;
            })
            .sort((a, b) => {
                // 베스트 뷰에서는 좋아요 순으로 정렬
                if (this.currentView === 'best') {
                    const likesA = a.likes?.count || 0;
                    const likesB = b.likes?.count || 0;
                    if (likesB !== likesA) return likesB - likesA;
                }
                // 기본적으로는 시간순 정렬
                const aTime = a.createdAt?.seconds || 0;
                const bTime = b.createdAt?.seconds || 0;
                return bTime - aTime;
            })
            .slice(
                ((this.currentPage - 1) % this.POSTS_PER_CHUNK) * this.postsPerPage, 
                (((this.currentPage - 1) % this.POSTS_PER_CHUNK) + 1) * this.postsPerPage
            )
            .map(post => ({
                ...post,
                likes: post.likes?.count || 0,
                isLiked: post.likes?.recentIPs?.includes(this.userIP) || false
            }));

        console.log('처리된 게시물:', posts); // 디버깅용
            this.renderPosts(posts);
        
        // 페이지네이션 상태 업데이트
        const totalPosts = Object.keys(chunkData.posts || {}).length;
        const currentChunkPosition = ((this.currentPage - 1) % this.POSTS_PER_CHUNK) * this.postsPerPage;
        const hasNextPage = currentChunkPosition + this.postsPerPage < totalPosts || 
                          (await this.checkNextChunkExists(currentChunk));
        const hasPrevPage = this.currentPage > 1;
        
        this.updatePaginationButtons(hasNextPage, hasPrevPage);

    } catch (error) {
        console.error('게시물 로딩 실패:', error);
    }
}

renderPosts(posts) {
    const container = document.getElementById('postsList');
    if (!posts || posts.length === 0) {
        container.innerHTML = `
            <div class="post-item" style="text-align: center;">
                <p>아직 공유된 택틱이 없습니다.</p>
                <p>첫 번째 택틱을 공유해보세요!</p>
            </div>
        `;
        return;
    }

    container.innerHTML = posts.map(post => `
        <div class="post-item ${post.likes >= 10 ? 'best' : ''}" data-post-id="${escapeHtml(post.id)}">
            <div class="post-header">
                <h3>
                    <a href="${escapeHtml(post.query)}" target="_blank" rel="noopener noreferrer" class="post-title">
                        ${escapeHtml(post.title)}
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M8.59 16.59L13.17 12L8.59 7.41L10 6L16 12L10 18L8.59 16.59Z" fill="rgba(255, 255, 255, 0.6)"/>
                        </svg>
                    </a>
                </h3>
                <div class="post-meta">
                    <span class="post-author">${escapeHtml(post.author)}</span>
                    <span class="separator">|</span>
                    <span class="post-date">${this.formatDate(post.createdAt)}</span>
                </div>
                ${post.comment ? `<div class="post-comment">${escapeHtml(post.comment)}</div>` : ''}
            </div>
            
            <div class="post-content">
                <div class="post-link">
                    <a href="${escapeHtml(post.query)}" target="_blank" rel="noopener noreferrer">택틱 보기</a>
                </div>
                <div class="tactic-preview-container"></div>
            </div>

            <div class="post-footer">
                <div class="likes-section">
                    <button 
                        onclick="tacticShare.handleLike('${post.id}')"
                        class="like-button ${post.isLiked ? 'liked' : ''}"
                        ${post.isLiked ? 'disabled' : ''}
                    >
                        <img src="${BASE_URL}/assets/img/tactic-share/like.png" alt="좋아요" />
                    </button>
                    <div class="likes-count-wrapper">
                        <span class="likes-count">${post.likes}</span>
                    </div>
                </div>
            </div>
        </div>
    `).join('');

    // 각 게시물에 프리뷰 추가
    posts.forEach(post => {
        const postElement = container.querySelector(`[data-post-id="${post.id}"]`);
        if (postElement) {
            this.tacticPreview.addPreviewToPost(postElement, post.query);
        }
    });
}

formatDate(timestamp) {
    if (!timestamp) return '';
    const seconds = timestamp.seconds || timestamp;
    const date = new Date(seconds * 1000);
    const year = date.getFullYear().toString().slice(2); // 연도에서 앞 2자리 제거
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const day = date.getDate().toString().padStart(2, '0');
    return `${year}.${month}.${day}`;
}

updatePaginationButtons(hasNextPage, hasPrevPage) {
    const prevButton = document.getElementById('prevPage');
    const nextButton = document.getElementById('nextPage');
    
    if (prevButton) {
        prevButton.disabled = !hasPrevPage;
        prevButton.onclick = () => {
            if (this.currentPage > 1) {
                this.currentPage--;
                this.loadPosts('prev');
            }
        };
    }
    
    if (nextButton) {
        nextButton.disabled = !hasNextPage;
        nextButton.onclick = () => {
            if (hasNextPage) {
                this.currentPage++;
                this.loadPosts('next');
            }
        };
    }
}

async checkLikeStatus(postId) {
    try {
        const statsDoc = await db.collection('post_stats').doc(postId).get();
        if (!statsDoc.exists) return false;

        const data = statsDoc.data();
        return data.likedIPs?.includes(this.userIP) || false;
    } catch (error) {
        console.error('좋아요 상태 확인 실패:', error);
        return false;
    }
}

async getUserIP() {
    try {
        const response = await fetch('https://api.ipify.org?format=json');
        const data = await response.json();
        this.userIP = data.ip;
    } catch (error) {
        console.error('IP Load Error:', error);
        this.userIP = 'unknown';
    }
}

// URL 검증 함수 수정
async validateTacticUrl(url) {
    const validPrefixes = [
        'lufelnet/tactic/?data=',
        'http://lufel.net/tactic/?data=',
        'https://lufel.net/tactic/?data=',
        'https://www.lufel.net/tactic/?data=',
        'http://www.lufel.net/tactic/?data='
    ];

    if (!validPrefixes.some(prefix => url.startsWith(prefix))) {
        throw new Error('올바른 택틱 URL 형식이 아니에요. 택틱 메이커에서 공유하기 기능을 통해 생성된 URL만 가능해요.');
    }

    // URL에서 data 파라미터 추출
    let sharedData;
    if (url.startsWith('@')) {
        url = url.substring(1);
    }
    
    try {
        const urlObj = new URL(url);
        sharedData = urlObj.searchParams.get('data');
    } catch (e) {
        const dataIndex = url.indexOf('data=');
        if (dataIndex !== -1) {
            sharedData = url.substring(dataIndex + 5);
        }
    }

    if (!sharedData) {
        throw new Error('택틱 데이터를 찾을 수 없습니다.');
    }

    try {
        // 데이터 구조 검증
        const decompressedData = LZString.decompressFromEncodedURIComponent(sharedData);
        if (!decompressedData) {
            throw new Error('택틱 데이터 압축 해제에 실패했습니다.');
        }

        const tacticData = JSON.parse(
            decompressedData
            .replace(/¶/g, 'm":1,"')
            .replace(/§6/g, '{"n":6,"a":[{"')
            .replace(/§5/g, '{"n":5,"a":[{"')
            .replace(/§4/g, '{"n":4,"a":[{"')
            .replace(/§3/g, '{"n":3,"a":[{"')
            .replace(/§2/g, '{"n":2,"a":[{"')
            .replace(/§1/g, '{"n":1,"a":[{"')
            .replace(/\$/g, '":"')
            .replace(/@/g, '","')
            .replace(/¤/g, '"},{"')
        );

        // 필수 데이터 구조 검증
        if (!tacticData.p || !Array.isArray(tacticData.p)) {
            throw new Error('잘못된 택틱 데이터 구조입니다.');
        }

        return true;
    } catch (error) {
        throw new Error('택틱 데이터 검증에 실패했습니다: ' + error.message);
    }
}

async checkDailyPostLimit() {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    try {
        const chunks = await db.collection('post_chunks').get();
        let todayPosts = 0;
        
        for (const chunk of chunks.docs) {
            const posts = chunk.data().posts || {};
            todayPosts += Object.values(posts).filter(post => 
                post.authorIP === this.userIP && 
                post.createdAt?.seconds >= today.getTime() / 1000
            ).length;
            
            if (todayPosts >= this.dailyPostLimit) {
                return true;
            }
        }
        
        return false;
    } catch (error) {
        console.error('일일 게시물 수 확인 실패:', error);
        return false;
    }
}


async getNextPostId() {
    const counterRef = db.collection('counters').doc('posts');
    const res = await counterRef.update({
        count: firebase.firestore.FieldValue.increment(1)
    });
    const doc = await counterRef.get();
    return doc.data().count;
}

updateLikesDisplay(postId, likes) {
    const post = document.querySelector(`.post-item[data-post-id="${postId}"]`);
    if (post && likes) {
        const likesCount = post.querySelector('.likes-count');
        const likeButton = post.querySelector('.like-button');
        if (likesCount) {
            likesCount.textContent = `${likes.count}`;
        }
        if (likeButton && likes.recentIPs?.includes(this.userIP)) {
            likeButton.classList.add('liked');
            likeButton.disabled = true;
        }
    }
}

addNewPostToUI(postData) {
    const container = document.getElementById('postsList');
    const newPostHtml = `
        <div class="post-item ${postData.likes >= 10 ? 'best' : ''}" data-post-id="${escapeHtml(postData.id)}">
            <div class="post-header">
                <h3>
                    <a href="${escapeHtml(postData.query)}" target="_blank" rel="noopener noreferrer" class="post-title">
                        ${escapeHtml(postData.title)}
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M8.59 16.59L13.17 12L8.59 7.41L10 6L16 12L10 18L8.59 16.59Z" fill="rgba(255, 255, 255, 0.6)"/>
                        </svg>
                    </a>
                </h3>
                <div class="post-meta">
                    <span class="post-author">${escapeHtml(postData.author)}</span>
                    <span class="separator">|</span>
                    <span class="post-date">${this.formatDate(postData.createdAt)}</span>
                </div>
                ${postData.comment ? `<div class="post-comment">${escapeHtml(postData.comment)}</div>` : ''}
            </div>
            
            <div class="post-content">
                <div class="post-link">
                    <a href="${escapeHtml(postData.query)}" target="_blank" rel="noopener noreferrer">택틱 보기</a>
                </div>
                <div class="tactic-preview-container"></div>
            </div>

            <div class="post-footer">
                <div class="likes-section">
                    <button 
                        onclick="tacticShare.handleLike('${postData.id}')"
                        class="like-button"
                    >
                        <img src="${BASE_URL}/assets/img/tactic-share/like.png" alt="좋아요" />
                    </button>
                    <div class="likes-count-wrapper">
                        <span class="likes-count">0</span>
                    </div>
                </div>
            </div>
        </div>
    `;

    if (!container.querySelector('.post-item')?.textContent.includes('아직 공유된 택틱이 없습니다')) {
        container.insertAdjacentHTML('afterbegin', newPostHtml);
    } else {
        container.innerHTML = newPostHtml;
    }

    // 프리뷰 추가
    const postElement = container.querySelector(`[data-post-id="${postData.id}"]`);
    if (postElement) {
        this.tacticPreview.addPreviewToPost(postElement, postData.query);
    }

    // 캐시 업데이트
    if (this.cachedPosts) {
        this.cachedPosts[postData.id] = postData;
        this.loadRanking(); // 랭킹 즉시 업데이트
    }
}

// 다음 청크 존재 여부 확인을 위한 새로운 메서드
async checkNextChunkExists(currentChunk) {
    try {
        const nextChunkRef = db.collection('post_chunks').doc(`chunk_${currentChunk + 1}`);
        const nextChunkDoc = await nextChunkRef.get();
        return nextChunkDoc.exists;
    } catch (error) {
        console.error('다음 청크 확인 실패:', error);
        return false;
    }
}

// 탭 초기화
initTabs() {
    document.querySelectorAll('.tab-button').forEach(button => {
        button.addEventListener('click', () => {
            document.querySelectorAll('.tab-button').forEach(b => b.classList.remove('active'));
            button.classList.add('active');
            this.currentView = button.dataset.view;
            this.currentPage = 1; // 페이지 초기화
            this.loadPosts();
        });
    });
}



}

// 텍스트 이스케이프 함수 추가
function escapeHtml(text) {
const div = document.createElement('div');
div.textContent = text;
return div.innerHTML;
}

function shakeit(input, key) {
let output = "";
for (let i = 0; i < input.length; i++) {
  output += String.fromCharCode(input.charCodeAt(i) ^ key.charCodeAt(i % key.length));
}
return output;
}