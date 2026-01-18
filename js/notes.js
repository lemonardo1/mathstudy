// 복습 노트 관련 기능
let notes = [];

document.addEventListener('DOMContentLoaded', function() {
    loadNotes();
    
    const clearBtn = document.getElementById('clear-notes-btn');
    clearBtn.addEventListener('click', clearNotes);
    
    // 문제 해설에서 노트 저장 기능 추가
    setupNoteSaving();
});

function loadNotes() {
    const savedNotes = localStorage.getItem('mathNotes');
    if (savedNotes) {
        notes = JSON.parse(savedNotes);
        displayNotes();
    } else {
        notes = [];
        showEmptyMessage();
    }
}

function saveNotes() {
    localStorage.setItem('mathNotes', JSON.stringify(notes));
}

function displayNotes() {
    const notesContent = document.getElementById('notes-content');
    
    if (notes.length === 0) {
        showEmptyMessage();
        return;
    }
    
    notesContent.innerHTML = '';
    
    notes.forEach((note, index) => {
        const noteElement = document.createElement('div');
        noteElement.className = 'note-item';
        noteElement.innerHTML = `
            <div class="note-header">
                <h4>${note.title}</h4>
                <button class="delete-note-btn" data-index="${index}">
                    <i class="fas fa-trash"></i>
                </button>
            </div>
            <div class="note-content">${note.content}</div>
            <div class="note-meta">
                <small>저장일: ${new Date(note.date).toLocaleDateString('ko-KR')}</small>
            </div>
        `;
        
        notesContent.appendChild(noteElement);
    });
    
    // 삭제 버튼 이벤트 리스너 추가
    document.querySelectorAll('.delete-note-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const index = parseInt(e.target.closest('.delete-note-btn').getAttribute('data-index'));
            deleteNote(index);
        });
    });
    
    // MathJax 재렌더링
    if (window.MathJax) {
        MathJax.typesetPromise([notesContent]);
    }
}

function showEmptyMessage() {
    const notesContent = document.getElementById('notes-content');
    notesContent.innerHTML = '<p class="empty-message">아직 복습 노트가 없습니다. 문제를 풀면서 중요한 내용을 저장하세요!</p>';
}

function addNote(title, content) {
    const note = {
        title: title,
        content: content,
        date: new Date().toISOString()
    };
    
    notes.push(note);
    saveNotes();
    displayNotes();
}

function deleteNote(index) {
    if (confirm('이 노트를 삭제하시겠습니까?')) {
        notes.splice(index, 1);
        saveNotes();
        displayNotes();
    }
}

function clearNotes() {
    if (confirm('모든 노트를 삭제하시겠습니까? 이 작업은 되돌릴 수 없습니다.')) {
        notes = [];
        saveNotes();
        showEmptyMessage();
    }
}

function setupNoteSaving() {
    // 문제 해설에서 노트 저장 버튼 추가
    // 실제 구현은 문제 표시 시 동적으로 버튼 추가
}

// 개념 학습 페이지에서 노트 저장
function saveToNotes(chapterInfo) {
    if (!chapterInfo) return;
    
    const title = `복습 노트: ${chapterInfo.title || '제목 없음'}`;
    const content = chapterInfo.content || '';
    
    addNote(title, content);
    alert('노트에 저장되었습니다!');
}

// 전역 함수로 노트 저장 기능 제공
window.saveToNotes = saveToNotes;
