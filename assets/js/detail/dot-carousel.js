document.addEventListener('DOMContentLoaded', () => {
    
// 캐러셀 초기화
    const carousel = document.querySelector('.carousel-inner');
    const dots = document.querySelectorAll('.dot');
    let currentSlide = 0;

    // 도트 클릭 이벤트
    dots.forEach((dot, index) => {
        dot.addEventListener('click', () => {
            moveToSlide(index);
        });
    });

    function moveToSlide(index) {
        currentSlide = index;
        const offset = -index * 100;
        carousel.style.transform = `translateX(${offset}%)`;
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
        
        // 이동 제한 (-100% ~ 0%)
        currentTranslate = Math.max(Math.min(currentTranslate, 0), -carousel.clientWidth);
        
        carousel.style.transform = `translateX(${currentTranslate}px)`;
    }

    function dragEnd() {
        if (!isDragging) return;
        isDragging = false;

        const movedBy = currentTranslate - prevTranslate;
        const threshold = carousel.clientWidth * 0.2;

        if (Math.abs(movedBy) > threshold) {
            if (movedBy < 0 && currentSlide < 1) {
                moveToSlide(1);
            } else if (movedBy > 0 && currentSlide > 0) {
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
});