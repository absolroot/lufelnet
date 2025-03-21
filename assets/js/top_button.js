document.addEventListener('DOMContentLoaded', () => {
    const topButton = document.getElementById('top-button');

    // 스크롤 이벤트 리스너
    window.addEventListener('scroll', () => {
        // 페이지가 200px 이상 스크롤되면 버튼 표시
        if (window.scrollY > 200) {
            topButton.style.display = 'flex';
            topButton.style.alignItems = 'center';
            topButton.style.justifyContent = 'center';
        } else {
            topButton.style.display = 'none';
        }
    });

    // 버튼 클릭 이벤트
    topButton.addEventListener('click', () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth' // 부드러운 스크롤
        });
    });
}); 