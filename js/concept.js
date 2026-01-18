// 개념 학습 관련 기능
// (main.js에서 loadConceptContent 함수가 이미 구현되어 있음)

// 추가 개념 관련 유틸리티 함수들
function highlightImportantConcepts() {
    // 중요한 개념 강조 표시
    const importantKeywords = ['정의', '정리', '공식', '예제'];
    // 구현 필요시 추가
}

function addBookmark() {
    // 북마크 기능
    const currentChapter = getCurrentChapter();
    if (currentChapter) {
        saveToNotes(currentChapter);
    }
}

function getCurrentChapter() {
    // 현재 보고 있는 챕터 정보 반환
    const activeNav = document.querySelector('.nav-item.active');
    if (!activeNav) return null;
    
    const subject = activeNav.getAttribute('data-subject');
    const content = document.getElementById('concept-content');
    // 챕터 정보 추출 로직
    return { subject, content };
}
