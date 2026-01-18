// 질문하기 기능
let questions = [];

document.addEventListener('DOMContentLoaded', function() {
    loadQuestions();
    
    const submitBtn = document.getElementById('submit-question-btn');
    submitBtn.addEventListener('click', submitQuestion);
    
    const questionInput = document.getElementById('question-input');
    questionInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter' && e.ctrlKey) {
            submitQuestion();
        }
    });
});

function loadQuestions() {
    const savedQuestions = localStorage.getItem('mathQuestions');
    if (savedQuestions) {
        questions = JSON.parse(savedQuestions);
        displayQuestions();
    } else {
        questions = [];
    }
}

function saveQuestions() {
    localStorage.setItem('mathQuestions', JSON.stringify(questions));
}

function submitQuestion() {
    const questionInput = document.getElementById('question-input');
    const questionText = questionInput.value.trim();
    
    if (questionText === '') {
        alert('질문을 입력하세요.');
        return;
    }
    
    const question = {
        id: Date.now(),
        text: questionText,
        date: new Date().toISOString(),
        answers: []
    };
    
    questions.unshift(question); // 최신 질문이 위에 오도록
    saveQuestions();
    displayQuestions();
    
    questionInput.value = '';
    
    // 간단한 응답 (실제로는 AI나 교사가 답변)
    setTimeout(() => {
        addAnswer(question.id, '질문이 등록되었습니다. 답변을 기다려주세요.');
    }, 1000);
}

function addAnswer(questionId, answerText) {
    const question = questions.find(q => q.id === questionId);
    if (question) {
        question.answers.push({
            text: answerText,
            date: new Date().toISOString()
        });
        saveQuestions();
        displayQuestions();
    }
}

function displayQuestions() {
    const questionsList = document.getElementById('questions-list');
    
    if (questions.length === 0) {
        questionsList.innerHTML = '<p class="empty-message">아직 질문이 없습니다. 첫 질문을 남겨보세요!</p>';
        return;
    }
    
    questionsList.innerHTML = '';
    
    questions.forEach(question => {
        const questionElement = document.createElement('div');
        questionElement.className = 'question-item';
        
        const date = new Date(question.date).toLocaleDateString('ko-KR', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
        
        let answersHtml = '';
        if (question.answers.length > 0) {
            answersHtml = '<div class="answers-section"><h5>답변:</h5>';
            question.answers.forEach(answer => {
                const answerDate = new Date(answer.date).toLocaleDateString('ko-KR');
                answersHtml += `
                    <div class="answer-item">
                        <p>${answer.text}</p>
                        <small>${answerDate}</small>
                    </div>
                `;
            });
            answersHtml += '</div>';
        }
        
        questionElement.innerHTML = `
            <div class="question-header">
                <h4>질문</h4>
                <small>${date}</small>
            </div>
            <div class="question-text">${question.text}</div>
            ${answersHtml}
        `;
        
        questionsList.appendChild(questionElement);
    });
    
    // MathJax 재렌더링
    if (window.MathJax) {
        MathJax.typesetPromise([questionsList]);
    }
}
