// 문제 풀이 관련 기능
let currentProblem = null;
let currentProblemIndex = 0;
let filteredProblems = [];

document.addEventListener('DOMContentLoaded', function() {
    const loadBtn = document.getElementById('load-problem-btn');
    const checkBtn = document.getElementById('check-answer-btn');
    const showSolutionBtn = document.getElementById('show-solution-btn');
    const nextBtn = document.getElementById('next-problem-btn');
    const difficultyFilter = document.getElementById('difficulty-filter');
    const topicFilter = document.getElementById('topic-filter');
    
    loadBtn.addEventListener('click', loadRandomProblem);
    checkBtn.addEventListener('click', checkAnswer);
    showSolutionBtn.addEventListener('click', showSolution);
    nextBtn.addEventListener('click', loadRandomProblem);
    
    difficultyFilter.addEventListener('change', filterProblems);
    topicFilter.addEventListener('change', filterProblems);
    
    // 초기 문제 로드
    filterProblems();
});

function filterProblems() {
    const difficulty = document.getElementById('difficulty-filter').value;
    const topic = document.getElementById('topic-filter').value;
    
    filteredProblems = [];
    
    // 모든 과목의 문제를 필터링
    Object.keys(problemData).forEach(subject => {
        if (topic === 'all' || topic === subject) {
            problemData[subject].forEach(problem => {
                if (difficulty === 'all' || problem.difficulty === difficulty) {
                    filteredProblems.push({
                        ...problem,
                        subject: subject
                    });
                }
            });
        }
    });
    
    if (filteredProblems.length > 0) {
        loadRandomProblem();
    } else {
        showNoProblemMessage();
    }
}

function loadRandomProblem() {
    if (filteredProblems.length === 0) {
        showNoProblemMessage();
        return;
    }
    
    // 랜덤하게 문제 선택
    const randomIndex = Math.floor(Math.random() * filteredProblems.length);
    currentProblem = filteredProblems[randomIndex];
    currentProblemIndex = randomIndex;
    
    displayProblem(currentProblem);
    
    // 답안 입력란 초기화
    document.getElementById('answer-input').value = '';
    document.getElementById('solution-display').classList.add('hidden');
}

function displayProblem(problem) {
    const problemText = document.getElementById('problem-text');
    problemText.innerHTML = `
        <div class="problem-meta">
            <span class="difficulty-badge ${problem.difficulty}">${getDifficultyText(problem.difficulty)}</span>
            <span class="topic-badge">${getTopicText(problem.subject)}</span>
        </div>
        <div class="problem-content">
            ${problem.problem}
        </div>
    `;
    
    // MathJax 재렌더링
    if (window.MathJax) {
        MathJax.typesetPromise([problemText]);
    }
}

// 답안 정규화 함수 (비교를 위해 텍스트를 정규화)
function normalizeAnswer(answer) {
    if (!answer) return '';
    
    let normalized = answer.toString();
    
    // LaTeX 기호를 일반 기호로 변환
    normalized = normalized
        .replace(/\\cup/g, '∪')
        .replace(/\\cap/g, '∩')
        .replace(/\\in/g, '∈')
        .replace(/\\notin/g, '∉')
        .replace(/\\subset/g, '⊂')
        .replace(/\\supset/g, '⊃')
        .replace(/\\subseteq/g, '⊆')
        .replace(/\\supseteq/g, '⊇')
        .replace(/\\emptyset/g, '∅')
        .replace(/\\mathbb\{N\}/g, 'N')
        .replace(/\\mathbb\{Z\}/g, 'Z')
        .replace(/\\mathbb\{Q\}/g, 'Q')
        .replace(/\\mathbb\{R\}/g, 'R')
        .replace(/\\mathbb\{C\}/g, 'C')
        .replace(/\\pi/g, 'π')
        .replace(/\\theta/g, 'θ')
        .replace(/\\alpha/g, 'α')
        .replace(/\\beta/g, 'β')
        .replace(/\\gamma/g, 'γ')
        .replace(/\\lambda/g, 'λ')
        .replace(/\\mu/g, 'μ')
        .replace(/\\sigma/g, 'σ')
        .replace(/\\sin/g, 'sin')
        .replace(/\\cos/g, 'cos')
        .replace(/\\tan/g, 'tan')
        .replace(/\\log/g, 'log')
        .replace(/\\ln/g, 'ln')
        .replace(/\\sqrt\[(\d+)\]\{([^}]+)\}/g, '($2)^(1/$1)')
        .replace(/\\sqrt\{([^}]+)\}/g, '√$1')
        .replace(/\\frac\{([^}]+)\}\{([^}]+)\}/g, '$1/$2')
        .replace(/\\cdot/g, '·')
        .replace(/\\times/g, '×')
        .replace(/\\div/g, '÷')
        .replace(/\\pm/g, '±')
        .replace(/\\leq/g, '≤')
        .replace(/\\geq/g, '≥')
        .replace(/\\neq/g, '≠')
        .replace(/\\approx/g, '≈')
        .replace(/\\equiv/g, '≡')
        .replace(/\\rightarrow/g, '→')
        .replace(/\\leftarrow/g, '←')
        .replace(/\\Rightarrow/g, '⇒')
        .replace(/\\Leftarrow/g, '⇐')
        .replace(/\\Leftrightarrow/g, '⇔')
        .replace(/\\infty/g, '∞')
        .replace(/\\sum/g, 'Σ')
        .replace(/\\prod/g, 'Π')
        .replace(/\\int/g, '∫')
        .replace(/\\partial/g, '∂')
        .replace(/\\nabla/g, '∇')
        .replace(/\\Delta/g, 'Δ')
        .replace(/\\lim/g, 'lim')
        .replace(/\\exp/g, 'exp')
        .replace(/\\det/g, 'det')
        .replace(/\\binom\{([^}]+)\}\{([^}]+)\}/g, 'C($1,$2)')
        .replace(/\\begin\{pmatrix\}([^]*?)\\end\{pmatrix\}/g, '[$1]')
        .replace(/\\begin\{cases\}([^]*?)\\end\{cases\}/g, '{$1}')
        .replace(/\\mid/g, '|')
        .replace(/\\text\{([^}]+)\}/g, '$1')
        .replace(/\\left\\{/g, '{')
        .replace(/\\right\\}/g, '}')
        .replace(/\\left\[/g, '[')
        .replace(/\\right\]/g, ']')
        .replace(/\\left\(/g, '(')
        .replace(/\\right\)/g, ')')
        .replace(/\\left\|/g, '|')
        .replace(/\\right\|/g, '|')
        .replace(/\\left\./g, '')
        .replace(/\\right\./g, '')
        .replace(/\\,/g, '')
        .replace(/\\;/g, ' ')
        .replace(/\\!/g, '')
        .replace(/\\quad/g, ' ')
        .replace(/\\qquad/g, '  ')
        .replace(/\\hspace\{[^}]+\}/g, ' ')
        .replace(/\\vspace\{[^}]+\}/g, ' ')
        .replace(/\\label\{[^}]+\}/g, '')
        .replace(/\\tag\{[^}]+\}/g, '')
        .replace(/\\ref\{[^}]+\}/g, '')
        .replace(/\\cite\{[^}]+\}/g, '')
        .replace(/\\href\{[^}]+\}\{([^}]+)\}/g, '$1')
        .replace(/\\url\{([^}]+)\}/g, '$1')
        .replace(/\\textbf\{([^}]+)\}/g, '$1')
        .replace(/\\textit\{([^}]+)\}/g, '$1')
        .replace(/\\emph\{([^}]+)\}/g, '$1')
        .replace(/\\texttt\{([^}]+)\}/g, '$1')
        .replace(/\\mathrm\{([^}]+)\}/g, '$1')
        .replace(/\\mathit\{([^}]+)\}/g, '$1')
        .replace(/\\mathbf\{([^}]+)\}/g, '$1')
        .replace(/\\mathsf\{([^}]+)\}/g, '$1')
        .replace(/\\mathtt\{([^}]+)\}/g, '$1')
        .replace(/\\mathcal\{([^}]+)\}/g, '$1')
        .replace(/\\mathfrak\{([^}]+)\}/g, '$1')
        .replace(/\\mathscr\{([^}]+)\}/g, '$1')
        .replace(/\\hat\{([^}]+)\}/g, '^$1')
        .replace(/\\check\{([^}]+)\}/g, '$1')
        .replace(/\\breve\{([^}]+)\}/g, '$1')
        .replace(/\\acute\{([^}]+)\}/g, '$1')
        .replace(/\\grave\{([^}]+)\}/g, '$1')
        .replace(/\\tilde\{([^}]+)\}/g, '~$1')
        .replace(/\\bar\{([^}]+)\}/g, '$1')
        .replace(/\\vec\{([^}]+)\}/g, '$1')
        .replace(/\\dot\{([^}]+)\}/g, '$1')
        .replace(/\\ddot\{([^}]+)\}/g, '$1')
        .replace(/\\widehat\{([^}]+)\}/g, '^$1')
        .replace(/\\widetilde\{([^}]+)\}/g, '~$1')
        .replace(/\\overline\{([^}]+)\}/g, '$1')
        .replace(/\\underline\{([^}]+)\}/g, '$1')
        .replace(/\\overbrace\{([^}]+)\}/g, '$1')
        .replace(/\\underbrace\{([^}]+)\}/g, '$1')
        .replace(/\\overset\{([^}]+)\}\{([^}]+)\}/g, '$2^$1')
        .replace(/\\underset\{([^}]+)\}\{([^}]+)\}/g, '$2_$1')
        .replace(/\\stackrel\{([^}]+)\}\{([^}]+)\}/g, '$2^$1')
        .replace(/\\substack\{([^}]+)\}/g, '$1')
        .replace(/\\sideset\{[^}]*\}\{[^}]*\}\{([^}]+)\}/g, '$1')
        .replace(/\\mathop\{([^}]+)\}/g, '$1')
        .replace(/\\operatorname\{([^}]+)\}/g, '$1')
        .replace(/\\operatorname\*\{([^}]+)\}/g, '$1')
        .replace(/\\DeclareMathOperator\{[^}]+\}\{([^}]+)\}/g, '$1')
        .replace(/\\DeclareMathOperator\*\{[^}]+\}\{([^}]+)\}/g, '$1')
        .replace(/\\mathbin\{([^}]+)\}/g, '$1')
        .replace(/\\mathrel\{([^}]+)\}/g, '$1')
        .replace(/\\mathopen\{([^}]+)\}/g, '$1')
        .replace(/\\mathclose\{([^}]+)\}/g, '$1')
        .replace(/\\mathpunct\{([^}]+)\}/g, '$1')
        .replace(/\\mathord\{([^}]+)\}/g, '$1')
        .replace(/\\mathinner\{([^}]+)\}/g, '$1');
    
    // $ 기호 제거 (LaTeX 수식 구분자)
    normalized = normalized.replace(/\$/g, '');
    
    // 중괄호 제거 (LaTeX 명령어 구분자)
    normalized = normalized.replace(/\{/g, '').replace(/\}/g, '');
    
    // 백슬래시 제거
    normalized = normalized.replace(/\\/g, '');
    
    // 공백 정규화 (여러 공백을 하나로, 앞뒤 공백 제거)
    normalized = normalized.replace(/\s+/g, ' ').trim();
    
    // 특수 문자 정규화
    normalized = normalized
        .replace(/，/g, ',')
        .replace(/。/g, '.')
        .replace(/；/g, ';')
        .replace(/：/g, ':')
        .replace(/？/g, '?')
        .replace(/！/g, '!')
        .replace(/（/g, '(')
        .replace(/）/g, ')')
        .replace(/【/g, '[')
        .replace(/】/g, ']')
        .replace(/「/g, '"')
        .replace(/」/g, '"')
        .replace(/『/g, "'")
        .replace(/』/g, "'");
    
    return normalized.toLowerCase();
}

// 답안 비교 함수 (정규화된 답안을 비교)
function compareAnswers(userAnswer, correctAnswer) {
    const normalizedUser = normalizeAnswer(userAnswer);
    const normalizedCorrect = normalizeAnswer(correctAnswer);
    
    // 정확히 일치하는 경우
    if (normalizedUser === normalizedCorrect) {
        return true;
    }
    
    // 부분 일치 확인 (정답이 여러 부분으로 구성된 경우)
    // 예: "$A \\cup B = \\{1, 2, 3\\}$, $A \\cap B = \\{2\\}$"
    const correctParts = normalizedCorrect.split(',').map(part => part.trim());
    const userParts = normalizedUser.split(',').map(part => part.trim());
    
    // 모든 정답 부분이 사용자 답안에 포함되어 있는지 확인
    if (correctParts.length > 1 && correctParts.every(part => 
        normalizedUser.includes(part) || userParts.some(up => up.includes(part) || part.includes(up))
    )) {
        return true;
    }
    
    // 사용자 답안의 모든 부분이 정답에 포함되어 있는지 확인
    if (userParts.length > 1 && userParts.every(part => 
        normalizedCorrect.includes(part) || correctParts.some(cp => cp.includes(part) || part.includes(cp))
    )) {
        return true;
    }
    
    // 집합 표현 정규화 비교
    const normalizeSet = (str) => {
        return str
            .replace(/\{/g, '')
            .replace(/\}/g, '')
            .replace(/\s+/g, '')
            .split(',')
            .map(x => x.trim())
            .filter(x => x)
            .sort()
            .join(',');
    };
    
    // 집합 표현이 있는 경우 비교
    const userSetMatch = normalizedUser.match(/\{([^}]+)\}/g);
    const correctSetMatch = normalizedCorrect.match(/\{([^}]+)\}/g);
    
    if (userSetMatch && correctSetMatch && userSetMatch.length === correctSetMatch.length) {
        const userSets = userSetMatch.map(normalizeSet);
        const correctSets = correctSetMatch.map(normalizeSet);
        
        if (userSets.every((us, i) => 
            correctSets.some(cs => cs === us) || 
            userSets.some((us2, j) => j !== i && cs === us2)
        )) {
            // 집합 부분이 일치하면 나머지 부분도 확인
            const userWithoutSets = normalizedUser.replace(/\{[^}]+\}/g, '').trim();
            const correctWithoutSets = normalizedCorrect.replace(/\{[^}]+\}/g, '').trim();
            
            if (userWithoutSets === correctWithoutSets || 
                userWithoutSets.includes(correctWithoutSets) ||
                correctWithoutSets.includes(userWithoutSets)) {
                return true;
            }
        }
    }
    
    return false;
}

function checkAnswer() {
    if (!currentProblem) {
        alert('먼저 문제를 불러오세요.');
        return;
    }
    
    const userAnswer = document.getElementById('answer-input').value.trim();
    const correctAnswer = currentProblem.answer;
    
    if (userAnswer === '') {
        alert('답안을 입력하세요.');
        return;
    }
    
    // 정규화된 답안 비교
    const isCorrect = compareAnswers(userAnswer, correctAnswer);
    
    // 답안 확인 결과 표시
    const result = document.createElement('div');
    result.className = 'answer-result';
    result.innerHTML = `
        <h4>${isCorrect ? '정답입니다! ✅' : '틀렸습니다. 다시 생각해보세요. ❌'}</h4>
        <p><strong>정답:</strong> ${correctAnswer}</p>
        ${!isCorrect ? `<p><strong>입력한 답:</strong> ${userAnswer}</p>` : ''}
    `;
    
    const solutionDisplay = document.getElementById('solution-display');
    solutionDisplay.innerHTML = '';
    solutionDisplay.appendChild(result);
    solutionDisplay.classList.remove('hidden');
    
    // MathJax 재렌더링
    if (window.MathJax) {
        MathJax.typesetPromise([solutionDisplay]);
    }
}

function showSolution() {
    if (!currentProblem) {
        alert('먼저 문제를 불러오세요.');
        return;
    }
    
    const solutionDisplay = document.getElementById('solution-display');
    solutionDisplay.innerHTML = `
        <h4>해설</h4>
        <div class="solution-content">
            <p><strong>정답:</strong> ${currentProblem.answer}</p>
            <p><strong>해설:</strong> ${currentProblem.solution}</p>
        </div>
    `;
    
    solutionDisplay.classList.remove('hidden');
    
    // MathJax 재렌더링
    if (window.MathJax) {
        MathJax.typesetPromise([solutionDisplay]);
    }
}

function showNoProblemMessage() {
    const problemText = document.getElementById('problem-text');
    problemText.innerHTML = '<p>선택한 조건에 맞는 문제가 없습니다. 필터를 변경해보세요.</p>';
}

function getDifficultyText(difficulty) {
    const difficultyMap = {
        'easy': '쉬움',
        'medium': '보통',
        'hard': '어려움'
    };
    return difficultyMap[difficulty] || difficulty;
}

function getTopicText(subject) {
    const topicMap = {
        'math-high-1': '수학 상',
        'math-high-2': '수학 하',
        'math-1': '수학 1',
        'math-2': '수학 2',
        'calculus': '미적분',
        'geometry': '기하',
        'probability': '확률과 통계',
        'linear-algebra': '선형대수학',
        'multivariable-calculus': '다변수 미적분학'
    };
    return topicMap[subject] || subject;
}
