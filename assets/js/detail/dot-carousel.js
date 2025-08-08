document.addEventListener('DOMContentLoaded', () => {
    
// 캐러셀 초기화
    const carousel = document.querySelector('.carousel-inner');
    const dots = document.querySelectorAll('.dot');
    let currentSlide = 0;
    let slideWidth = carousel.clientWidth; // 개별 슬라이드 너비(px)
    const slideGap = 200; // CSS gap과 동일하게 유지

    // 도트 클릭 이벤트
    dots.forEach((dot, index) => {
        dot.addEventListener('click', () => {
            moveToSlide(index);
        });
    });

    function moveToSlide(index) {
        currentSlide = index;
        const offsetPx = -index * (slideWidth + slideGap);
        carousel.style.transition = '';
        carousel.style.transform = `translateX(${offsetPx}px)`;
        prevTranslate = offsetPx;
        currentTranslate = offsetPx;
        updateDots();
    }

    function updateDots() {
        dots.forEach((dot, index) => {
            if (index === currentSlide) {
                dot.classList.add('active');
            } else {
                dot.classList.remove('active');
            }
        });
    }

    // 드래그 기능
    let isDragging = false;
    let startPos = 0;
    let currentTranslate = 0;
    let prevTranslate = 0;

    carousel.addEventListener('mousedown', dragStart);
    carousel.addEventListener('touchstart', dragStart);
    window.addEventListener('mousemove', drag);
    window.addEventListener('touchmove', drag);
    window.addEventListener('mouseup', dragEnd);
    window.addEventListener('touchend', dragEnd);
    window.addEventListener('mouseleave', dragEnd);

    function dragStart(e) {
        if (e.type === 'touchstart') {
            // 터치 이벤트일 경우에는 preventDefault 하지 않음
            isDragging = true;
            startPos = e.touches[0].clientX;
        } else {
            // 마우스 이벤트일 경우에만 preventDefault
            e.preventDefault();
            isDragging = true;
            startPos = e.pageX;
        }
        // 드래그 시작: 전환 제거
        carousel.style.transition = 'none';
        prevTranslate = currentTranslate;
    }

    function drag(e) {
        if (!isDragging) return;

        const currentPosition = e.type === 'mousemove' ? e.pageX : e.touches[0].clientX;
        const diff = currentPosition - startPos;

        if (e.type === 'mousemove') {
            e.preventDefault();
        }

        currentTranslate = prevTranslate + diff;
        
        // 이동 제한 (첫 슬라이드 ~ 마지막 슬라이드)
        const maxTranslate = 0;
        const minTranslate = -((slideWidth + slideGap) * 1); // 현재 2장 기준
        currentTranslate = Math.max(Math.min(currentTranslate, maxTranslate), minTranslate);
        
        carousel.style.transform = `translateX(${currentTranslate}px)`;
    }

    function dragEnd() {
        if (!isDragging) return;
        isDragging = false;

        const movedBy = currentTranslate - prevTranslate;
        const threshold = slideWidth * 0.2;

        if (Math.abs(movedBy) > threshold) {
            if (movedBy < 0 && currentSlide < 1) {
                carousel.style.transition = '';
                moveToSlide(1);
            } else if (movedBy > 0 && currentSlide > 0) {
                carousel.style.transition = '';
                moveToSlide(0);
            } else {
                moveToSlide(currentSlide);
            }
        } else {
            moveToSlide(currentSlide);
        }
    }

    // 초기 도트 상태 설정
    updateDots();

    // 리사이즈 대응: 슬라이드 너비 갱신 및 현재 위치 보정
    window.addEventListener('resize', () => {
        const prevSlideWidth = slideWidth;
        slideWidth = carousel.clientWidth;
        // 현재 인덱스 기준 오프셋 재계산
        const offsetPx = -currentSlide * (slideWidth + slideGap);
        carousel.style.transition = 'none';
        carousel.style.transform = `translateX(${offsetPx}px)`;
        prevTranslate = offsetPx;
        currentTranslate = offsetPx;
        // 다음 프레임에 전환 복원
        requestAnimationFrame(() => {
            carousel.style.transition = '';
        });
    });
});