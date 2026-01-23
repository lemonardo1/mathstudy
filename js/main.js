// 메인 네비게이션 및 탭 관리
document.addEventListener('DOMContentLoaded', function() {
    // 탭 전환
    const tabButtons = document.querySelectorAll('.tab-btn');
    const tabContents = document.querySelectorAll('.tab-content');
    
    tabButtons.forEach(button => {
        button.addEventListener('click', () => {
            const targetTab = button.getAttribute('data-tab');
            
            // 모든 탭 버튼과 콘텐츠 비활성화
            tabButtons.forEach(btn => btn.classList.remove('active'));
            tabContents.forEach(content => content.classList.remove('active'));
            
            // 선택된 탭 활성화
            button.classList.add('active');
            document.getElementById(`${targetTab}-tab`).classList.add('active');
        });
    });
    
    // 사이드바 네비게이션
    const navItems = document.querySelectorAll('.nav-item');
    const chapterModal = document.getElementById('chapter-modal');
    const modalTitle = document.getElementById('modal-title');
    const chapterList = document.getElementById('chapter-list');
    const closeModal = document.querySelector('.close-modal');
    
    navItems.forEach(item => {
        item.addEventListener('click', () => {
            const subject = item.getAttribute('data-subject');
            
            // 모든 네비게이션 아이템 비활성화
            navItems.forEach(nav => nav.classList.remove('active'));
            item.classList.add('active');
            
            // 개념 학습 탭으로 전환
            tabButtons.forEach(btn => {
                if (btn.getAttribute('data-tab') === 'concept') {
                    btn.click();
                }
            });
            
            // 챕터 선택 모달 표시
            showChapterModal(subject);
        });
    });
    
    function showChapterModal(subject) {
        if (!mathData[subject]) return;
        
        modalTitle.textContent = mathData[subject].title;
        chapterList.innerHTML = '';
        
        mathData[subject].chapters.forEach(chapter => {
            const chapterItem = document.createElement('div');
            chapterItem.className = 'chapter-item';
            chapterItem.textContent = chapter.title;
            chapterItem.addEventListener('click', () => {
                loadConceptContent(subject, chapter.id);
                chapterModal.classList.add('hidden');
            });
            chapterList.appendChild(chapterItem);
        });
        
        chapterModal.classList.remove('hidden');
    }
    
    closeModal.addEventListener('click', () => {
        chapterModal.classList.add('hidden');
    });
    
    window.addEventListener('click', (e) => {
        if (e.target === chapterModal) {
            chapterModal.classList.add('hidden');
        }
    });
    
    // 초기화
    initializeGraphs();
});

// 그래프 초기화 함수
function initializeGraphs() {
    // 함수 그래프 예시
    if (document.getElementById('function-graph-1')) {
        const x = [];
        const y = [];
        for (let i = -5; i <= 5; i += 0.1) {
            x.push(i);
            y.push(i * i); // y = x^2
        }
        
        const trace = {
            x: x,
            y: y,
            type: 'scatter',
            mode: 'lines',
            name: 'y = x²',
            line: { color: '#4a90e2', width: 2 }
        };
        
        Plotly.newPlot('function-graph-1', [trace], {
            title: '함수 y = x²의 그래프',
            xaxis: { title: 'x' },
            yaxis: { title: 'y' },
            margin: { l: 50, r: 50, t: 50, b: 50 }
        });
    }
}

// 개념 콘텐츠 로드 함수 (concept.js에서 사용)
function loadConceptContent(subject, chapterId) {
    console.log('loadConceptContent called:', subject, chapterId);
    
    const subjectData = mathData[subject];
    if (!subjectData) {
        console.error('Subject data not found:', subject);
        return;
    }
    
    const chapter = subjectData.chapters.find(ch => ch.id === chapterId);
    if (!chapter) {
        console.error('Chapter not found:', chapterId);
        return;
    }
    
    console.log('Chapter found:', chapter.title);
    console.log('Content length:', chapter.content ? chapter.content.length : 0);
    
    // 환영 메시지 숨기기
    const welcomeMessage = document.querySelector('.welcome-message');
    if (welcomeMessage) {
        welcomeMessage.style.display = 'none';
    }
    
    const conceptContent = document.getElementById('concept-content');
    if (!conceptContent) {
        console.error('concept-content element not found!');
        return;
    }
    
    // 강제로 표시 설정
    conceptContent.style.display = 'block';
    conceptContent.style.visibility = 'visible';
    conceptContent.style.opacity = '1';
    conceptContent.style.height = 'auto';
    conceptContent.style.overflow = 'visible';
    
    // 콘텐츠를 파싱하여 접을 수 있는 섹션으로 변환
    if (chapter.content && chapter.content.trim()) {
        const processedContent = processConceptContent(chapter.content);
        conceptContent.innerHTML = processedContent;
        
        // 목차 생성
        createTableOfContents(conceptContent);
        
        // 접기/펼치기 이벤트 리스너 추가
        attachCollapseListeners(conceptContent);
        
        console.log('Content processed and set');
    } else {
        console.error('Chapter content is empty!');
        conceptContent.innerHTML = '<div style="padding: 20px; color: red; font-size: 18px;"><h2>⚠️ 내용을 불러올 수 없습니다</h2><p>챕터 내용이 비어있습니다.</p></div>';
    }
    
    // MathJax 재렌더링
    if (window.MathJax) {
        setTimeout(() => {
            MathJax.typesetPromise([conceptContent]).then(() => {
                console.log('MathJax rendering completed');
                // 그래프 생성
                createGraphsForContent(chapterId);
            }).catch(err => {
                console.error('MathJax rendering error:', err);
            });
        }, 100);
    } else {
        console.warn('MathJax not loaded');
    }
}

// 콘텐츠를 접을 수 있는 섹션으로 변환
function processConceptContent(content) {
    // h2 제목 추출
    const h2Match = content.match(/<h2[^>]*>.*?<\/h2>/is);
    const mainTitle = h2Match ? h2Match[0] : '';
    
    // h3 태그로 섹션 분리 - 더 정확한 정규식 사용
    // h3 태그를 모두 찾기 (여러 줄에 걸쳐 있을 수 있으므로 [\s\S] 사용)
    const h3Pattern = /<h3[^>]*>([\s\S]*?)<\/h3>/gi;
    const h3Matches = [];
    let match;
    
    // 모든 h3 태그 찾기
    while ((match = h3Pattern.exec(content)) !== null) {
        h3Matches.push({
            title: match[1].replace(/<[^>]+>/g, '').trim(), // HTML 태그 제거
            startIndex: match.index,
            endIndex: match.index + match[0].length,
            fullMatch: match[0]
        });
    }
    
    if (h3Matches.length === 0) {
        // h3가 없으면 원본 내용 그대로 사용
        return content;
    }
    
    const sections = [];
    
    // 각 섹션의 내용 추출
    h3Matches.forEach((h3Match, idx) => {
        const sectionId = `section-${idx}`;
        const sectionTitle = h3Match.title;
        
        // 현재 h3 다음부터 다음 h3 전까지의 내용 추출
        const contentStart = h3Match.endIndex;
        const contentEnd = idx < h3Matches.length - 1 
            ? h3Matches[idx + 1].startIndex 
            : content.length;
        
        // 내용 추출 (앞뒤 공백 제거)
        let sectionContent = content.substring(contentStart, contentEnd).trim();
        
        // 디버깅: 고차방정식 섹션 확인
        if (sectionTitle.includes('고차방정식')) {
            console.log('고차방정식 섹션 내용 길이:', sectionContent.length);
            console.log('고차방정식 섹션 내용 처음 500자:', sectionContent.substring(0, 500));
            console.log('고차방정식 섹션에 삼차방정식 포함:', sectionContent.includes('삼차방정식'));
            console.log('고차방정식 섹션에 사차방정식 포함:', sectionContent.includes('사차방정식'));
        }
        
        sections.push({
            id: sectionId,
            title: sectionTitle,
            content: sectionContent
        });
    });
    
    console.log('총 섹션 개수:', sections.length);
    console.log('섹션 제목들:', sections.map(s => s.title));
    
    // 접을 수 있는 섹션으로 재구성
    let processedHTML = mainTitle;
    
    sections.forEach((section) => {
        processedHTML += `
            <div class="concept-section-collapsible">
                <button class="section-toggle" data-section="${section.id}">
                    <i class="fas fa-chevron-up"></i>
                    <span>${section.title}</span>
                </button>
                <div class="section-content" id="${section.id}">
                    ${section.content}
                </div>
            </div>
        `;
    });
    
    return processedHTML;
}

// 목차 생성
function createTableOfContents(container) {
    const sections = container.querySelectorAll('.concept-section-collapsible');
    if (sections.length === 0) return;
    
    const toc = document.createElement('div');
    toc.className = 'table-of-contents';
    toc.innerHTML = `
        <div class="toc-header">
            <h3><i class="fas fa-list"></i> 목차</h3>
            <button class="toc-toggle-all" data-action="expand">
                <i class="fas fa-expand"></i> 모두 펼치기
            </button>
        </div>
        <ul class="toc-list">
            ${Array.from(sections).map((section, index) => {
                const button = section.querySelector('.section-toggle');
                const title = button.querySelector('span').textContent;
                const sectionId = button.getAttribute('data-section');
                return `<li><a href="#${sectionId}" class="toc-link" data-section="${sectionId}">${title}</a></li>`;
            }).join('')}
        </ul>
    `;
    
    container.insertBefore(toc, container.firstChild);
    
    // 목차 링크 클릭 이벤트
    toc.querySelectorAll('.toc-link').forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const sectionId = link.getAttribute('data-section');
            const section = container.querySelector(`#${sectionId}`);
            if (section) {
                // 섹션 펼치기
                expandSection(section);
                // 스크롤 이동
                section.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
        });
    });
    
    // 모두 펼치기/접기 버튼
    const toggleAllBtn = toc.querySelector('.toc-toggle-all');
    toggleAllBtn.addEventListener('click', () => {
        const action = toggleAllBtn.getAttribute('data-action');
        if (action === 'expand') {
            sections.forEach(section => {
                const content = section.querySelector('.section-content');
                expandSection(content);
            });
            toggleAllBtn.setAttribute('data-action', 'collapse');
            toggleAllBtn.innerHTML = '<i class="fas fa-compress"></i> 모두 접기';
        } else {
            sections.forEach(section => {
                const content = section.querySelector('.section-content');
                collapseSection(content);
            });
            toggleAllBtn.setAttribute('data-action', 'expand');
            toggleAllBtn.innerHTML = '<i class="fas fa-expand"></i> 모두 펼치기';
        }
    });
}

// 접기/펼치기 이벤트 리스너 추가
function attachCollapseListeners(container) {
    const toggleButtons = container.querySelectorAll('.section-toggle');
    
    toggleButtons.forEach(button => {
        button.addEventListener('click', () => {
            const sectionId = button.getAttribute('data-section');
            const section = container.querySelector(`#${sectionId}`);
            const icon = button.querySelector('i');
            
            if (section.classList.contains('collapsed')) {
                expandSection(section);
                icon.classList.remove('fa-chevron-down');
                icon.classList.add('fa-chevron-up');
            } else {
                collapseSection(section);
                icon.classList.remove('fa-chevron-up');
                icon.classList.add('fa-chevron-down');
            }
        });
    });
}

// 섹션 펼치기
function expandSection(section) {
    section.classList.remove('collapsed');
    // 실제 높이를 계산하여 설정
    const height = section.scrollHeight;
    section.style.maxHeight = height + 'px';
    
    // 애니메이션 완료 후 자동 높이로 변경
    setTimeout(() => {
        if (!section.classList.contains('collapsed')) {
            section.style.maxHeight = 'none';
        }
    }, 300);
}

// 섹션 접기
function collapseSection(section) {
    // 현재 높이를 저장
    const height = section.scrollHeight;
    section.style.maxHeight = height + 'px';
    
    // 강제 리플로우
    section.offsetHeight;
    
    // 접기 애니메이션
    section.classList.add('collapsed');
    section.style.maxHeight = '0';
}

// 챕터별 그래프 생성
function createGraphsForContent(chapterId) {
    // 등차수열 그래프
    if (chapterId === 'sequence-limit') {
        createArithmeticSequenceGraph();
    }
    
    // 이차함수 그래프
    if (chapterId === 'equation-inequality') {
        createQuadraticGraph();
    }
    
    // 극한 그래프
    if (chapterId === 'limit-continuity') {
        createLimitGraph();
    }
    
    // 미분 그래프
    if (chapterId === 'derivative') {
        createDerivativeGraph();
    }
    
    // 적분 그래프
    if (chapterId === 'integral') {
        createIntegralGraph();
    }
    
    // 확률 그래프
    if (chapterId === 'probability-basic' || chapterId === 'probability-distribution') {
        createProbabilityGraph();
    }
    
    // 지수함수 그래프
    if (chapterId === 'exponential-logarithm') {
        createExponentialGraph();
    }
    
    // 삼각함수 그래프
    if (chapterId === 'trigonometric-function') {
        createTrigonometricGraph();
    }
}

function createArithmeticSequenceGraph() {
    const container = document.getElementById('arithmetic-sequence-graph');
    if (!container) return;
    
    const n = [];
    const a_n = [];
    const a = 2, d = 3;
    
    for (let i = 1; i <= 10; i++) {
        n.push(i);
        a_n.push(a + (i - 1) * d);
    }
    
    const trace = {
        x: n,
        y: a_n,
        type: 'scatter',
        mode: 'lines+markers',
        name: `a_n = ${a} + (n-1) × ${d}`,
        marker: { size: 8, color: '#7b68ee' },
        line: { color: '#7b68ee', width: 2 }
    };
    
    Plotly.newPlot(container, [trace], {
        title: '등차수열 그래프',
        xaxis: { title: 'n' },
        yaxis: { title: 'a_n' },
        margin: { l: 50, r: 50, t: 50, b: 50 }
    });
}

function createQuadraticGraph() {
    const container = document.getElementById('quadratic-graph');
    if (!container) return;
    
    const x = [];
    const y1 = [];
    const y2 = [];
    
    for (let i = -5; i <= 5; i += 0.1) {
        x.push(i);
        y1.push(i * i - 4); // y = x^2 - 4
        y2.push(-i * i + 4); // y = -x^2 + 4
    }
    
    const trace1 = {
        x: x,
        y: y1,
        type: 'scatter',
        mode: 'lines',
        name: 'y = x² - 4',
        line: { color: '#4a90e2', width: 2 }
    };
    
    const trace2 = {
        x: x,
        y: y2,
        type: 'scatter',
        mode: 'lines',
        name: 'y = -x² + 4',
        line: { color: '#50c878', width: 2 }
    };
    
    Plotly.newPlot(container, [trace1, trace2], {
        title: '이차함수의 그래프',
        xaxis: { title: 'x' },
        yaxis: { title: 'y' },
        margin: { l: 50, r: 50, t: 50, b: 50 }
    });
}

function createLimitGraph() {
    const container = document.getElementById('limit-graph');
    if (!container) return;
    
    const x1 = [];
    const y1 = [];
    const x2 = [];
    const y2 = [];
    
    // 연속함수: y = x^2
    for (let i = -3; i <= 3; i += 0.1) {
        x1.push(i);
        y1.push(i * i);
    }
    
    // 불연속함수: y = 1/x (x ≠ 0)
    for (let i = -3; i <= -0.1; i += 0.1) {
        x2.push(i);
        y2.push(1 / i);
    }
    for (let i = 0.1; i <= 3; i += 0.1) {
        x2.push(i);
        y2.push(1 / i);
    }
    
    const trace1 = {
        x: x1,
        y: y1,
        type: 'scatter',
        mode: 'lines',
        name: '연속함수: y = x²',
        line: { color: '#4a90e2', width: 2 }
    };
    
    const trace2 = {
        x: x2,
        y: y2,
        type: 'scatter',
        mode: 'lines',
        name: '불연속함수: y = 1/x',
        line: { color: '#e74c3c', width: 2 }
    };
    
    Plotly.newPlot(container, [trace1, trace2], {
        title: '함수의 극한과 연속성',
        xaxis: { title: 'x' },
        yaxis: { title: 'y' },
        margin: { l: 50, r: 50, t: 50, b: 50 }
    });
}

function createDerivativeGraph() {
    const container = document.getElementById('derivative-graph');
    if (!container) return;
    
    const x = [];
    const y = [];
    const dy = [];
    
    // 함수: y = x^3 - 3x
    for (let i = -3; i <= 3; i += 0.1) {
        x.push(i);
        y.push(i * i * i - 3 * i);
        dy.push(3 * i * i - 3); // 도함수: y' = 3x^2 - 3
    }
    
    const trace1 = {
        x: x,
        y: y,
        type: 'scatter',
        mode: 'lines',
        name: 'f(x) = x³ - 3x',
        line: { color: '#4a90e2', width: 2 }
    };
    
    const trace2 = {
        x: x,
        y: dy,
        type: 'scatter',
        mode: 'lines',
        name: "f'(x) = 3x² - 3",
        line: { color: '#50c878', width: 2, dash: 'dash' }
    };
    
    Plotly.newPlot(container, [trace1, trace2], {
        title: '함수와 그 도함수',
        xaxis: { title: 'x' },
        yaxis: { title: 'y' },
        margin: { l: 50, r: 50, t: 50, b: 50 }
    });
}

function createIntegralGraph() {
    const container = document.getElementById('integral-graph');
    if (!container) return;
    
    const x = [];
    const y = [];
    const x_fill = [];
    const y_fill = [];
    
    // 함수: y = x^2
    for (let i = 0; i <= 3; i += 0.1) {
        x.push(i);
        y.push(i * i);
        if (i >= 1 && i <= 2) {
            x_fill.push(i);
            y_fill.push(i * i);
        }
    }
    
    const trace1 = {
        x: x,
        y: y,
        type: 'scatter',
        mode: 'lines',
        name: 'y = x²',
        line: { color: '#4a90e2', width: 2 },
        fill: 'none'
    };
    
    const trace2 = {
        x: [1, 1, 2, 2, 1],
        y: [0, 1, 4, 0, 0],
        type: 'scatter',
        mode: 'lines',
        name: '정적분 영역',
        fill: 'tozeroy',
        fillcolor: 'rgba(74, 144, 226, 0.3)',
        line: { color: '#4a90e2', width: 2 }
    };
    
    Plotly.newPlot(container, [trace1, trace2], {
        title: '정적분 ∫₁² x² dx의 기하학적 의미',
        xaxis: { title: 'x', range: [0, 3] },
        yaxis: { title: 'y', range: [0, 9] },
        margin: { l: 50, r: 50, t: 50, b: 50 }
    });
}

function createProbabilityGraph() {
    const container = document.getElementById('probability-graph');
    if (!container) return;
    
    // 이항분포 예시: n=10, p=0.5
    const x = [];
    const y = [];
    
    for (let k = 0; k <= 10; k++) {
        x.push(k);
        // 이항분포 확률: C(10,k) * 0.5^10
        const prob = binomialCoefficient(10, k) * Math.pow(0.5, 10);
        y.push(prob);
    }
    
    const trace = {
        x: x,
        y: y,
        type: 'bar',
        name: '이항분포 (n=10, p=0.5)',
        marker: { color: '#7b68ee' }
    };
    
    Plotly.newPlot(container, [trace], {
        title: '이항분포 확률분포',
        xaxis: { title: '성공 횟수 (k)' },
        yaxis: { title: '확률 P(X=k)' },
        margin: { l: 50, r: 50, t: 50, b: 50 }
    });
}

function binomialCoefficient(n, k) {
    if (k > n) return 0;
    if (k === 0 || k === n) return 1;
    
    let result = 1;
    for (let i = 0; i < k; i++) {
        result = result * (n - i) / (i + 1);
    }
    return result;
}

function createExponentialGraph() {
    const container = document.getElementById('exponential-graph');
    if (!container) return;
    
    const x = [];
    const y1 = [];
    const y2 = [];
    
    for (let i = -3; i <= 3; i += 0.1) {
        x.push(i);
        y1.push(Math.pow(2, i)); // y = 2^x
        y2.push(Math.pow(0.5, i)); // y = (1/2)^x
    }
    
    const trace1 = {
        x: x,
        y: y1,
        type: 'scatter',
        mode: 'lines',
        name: 'y = 2^x',
        line: { color: '#4a90e2', width: 2 }
    };
    
    const trace2 = {
        x: x,
        y: y2,
        type: 'scatter',
        mode: 'lines',
        name: 'y = (1/2)^x',
        line: { color: '#50c878', width: 2 }
    };
    
    Plotly.newPlot(container, [trace1, trace2], {
        title: '지수함수의 그래프',
        xaxis: { title: 'x' },
        yaxis: { title: 'y', type: 'log' },
        margin: { l: 50, r: 50, t: 50, b: 50 }
    });
}

function createTrigonometricGraph() {
    const container = document.getElementById('trigonometric-graph');
    if (!container) return;
    
    const x = [];
    const y_sin = [];
    const y_cos = [];
    const y_tan = [];
    
    for (let i = -2 * Math.PI; i <= 2 * Math.PI; i += 0.1) {
        x.push(i);
        y_sin.push(Math.sin(i));
        y_cos.push(Math.cos(i));
        // tan은 특정 값에서 무한대가 되므로 제한
        if (Math.abs(Math.cos(i)) > 0.01) {
            y_tan.push(Math.tan(i));
        } else {
            y_tan.push(null);
        }
    }
    
    const trace1 = {
        x: x,
        y: y_sin,
        type: 'scatter',
        mode: 'lines',
        name: 'y = sin(x)',
        line: { color: '#4a90e2', width: 2 }
    };
    
    const trace2 = {
        x: x,
        y: y_cos,
        type: 'scatter',
        mode: 'lines',
        name: 'y = cos(x)',
        line: { color: '#50c878', width: 2 }
    };
    
    const trace3 = {
        x: x,
        y: y_tan,
        type: 'scatter',
        mode: 'lines',
        name: 'y = tan(x)',
        line: { color: '#e74c3c', width: 2 }
    };
    
    Plotly.newPlot(container, [trace1, trace2, trace3], {
        title: '삼각함수의 그래프',
        xaxis: { title: 'x (라디안)' },
        yaxis: { title: 'y', range: [-3, 3] },
        margin: { l: 50, r: 50, t: 50, b: 50 }
    });
}
