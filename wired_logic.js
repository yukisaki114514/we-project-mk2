//=====================================
// 1. データストア (コンテンツと設定)
//=====================================
const FILE_DATA = {
    // 01. PROFILE (P)
    '01_profile': { 
        title: 'PROFILE.DAT - SYNCHRONIZED', 
        content: "名前: [ナキサキ]\n年齢: 18\n職業: [大学生]\n\n自己紹介: 私は、自身のやりたいと思ったこと、しなければならないと思ったことに注力し自身の能力を向上していき自身の人生を充実させていきます。" 
    },
    
    // 02. SKILLS (S)
    '02_skills': { 
        title: 'SKILL_SET.TXT - ANALYZED', 
        content: "【コーディング】HTML/CSS/JS (中級)、Python (基礎)\n【言語】日本語\n【特技】他者との交流をすぐに行えること\n\n私は、技術は自身の理想をかなえるための道具であると考えています。" 
    },

    // 03. WORKS (W)
    '03_works': { 
        title: 'PROJECT_LIST - V.02', 
        content: "1. my-Wired-UI (このサイト)\n2. [構想段階中]\n3. [nothing]\n\n詳細は、私に直接お問い合わせください。" 
    },

    // 04. CONTACT (@)
    '04_contact': { 
        title: 'CONTACT_INFO - ENCRYPTED', 
        content: "E-MAIL: そんなものはない\nSNS: @nakisaki5519\n\n注意: リアルタイムでの応答は 保証 されません。情報はネットワーク経由で届きます。" 
    },

    // 05. PROTOCOL (L)
    '05_philosophy': { 
        title: 'LIFE_PROTOCOL - CORE', 
        content: "プロトコル1：無理をしないこと。\nプロトコル2：現実と情報世界のバランスをとること。\nプロトコル3：自身にできることをただやること。" 
    },
    
    // ランダムグリッチ用コンテンツ
    'new_bug': { 
        title: 'GLITCH.BIN', 
        content: "FATAL ERROR: エラー。Local cache integrity compromised。\nID: 1ZWN07G907Ga07K407G207Gb16Sv07G907GW07Cx1ZWN07G907Ga07K407G207Gb1p2L07Gc07Cx07GQ07K807Ge07Gv07Kx07GX07Ky07Ga07G/07Cx2Lea1bi22Lea2Iqb07Ge07Gv07Kx07Gb07Cy\n\n必要なことは書いたはず" 
    },

    // 隠しファイル: 真実
    'secret_file': { 
        title: 'PROTOCOL_09_FINAL', 
        content: "あなたも、私も世界の中で生きる小さな生命の一つでしかない。\n\n誰も一人で生きることはできない。\n\nEmbrace your existence.." 
    }
};

//=====================================
// 2. DOM要素と変数
//=====================================
const windowContainer = document.getElementById('window-container');
const icons = document.querySelectorAll('.icon');
const timeDisplay = document.getElementById('current-time');
const bgm = document.getElementById('bgm');
const clickSound = document.getElementById('click-sound');

let currentZIndex = 100;
let timeBlinkCounter = 0;

// 確率定数 (1 / 4 = 0.25)
const SECRET_FILE_CHANCE = 0.25;

//=====================================
// 3. 音声処理
//=====================================
function playClick() {
    clickSound.currentTime = 0; 
    clickSound.play().catch(e => console.log('Sound playback failed:', e));
}

//=====================================
// 4. 初期化と時間グリッチ処理
//=====================================
function init() {
    updateTime();
    setInterval(updateTime, 1000);
    
    // 初回クリックでBGMを再生開始
    document.addEventListener('mousedown', () => {
        if (bgm.paused) {
            bgm.volume = 0.4; 
            bgm.play().catch(e => console.log('BGM playback failed:', e));
        }
    }, { once: true });

    // アイコンクリックイベントの設定
    icons.forEach(icon => {
        icon.addEventListener('click', () => {
            playClick(); 
            openWindow(icon.getAttribute('data-file-id'));
        });
    });

    // 起動時の自動開示（PROFILEを自動で開く）
    setTimeout(() => {
        openWindow('01_profile');
    }, 1500);
    
    // ランダムグリッチ: 5〜10秒後にランダムなウィンドウを自動で開く
    setTimeout(() => {
        openWindow('new_bug');
    }, Math.random() * 5000 + 5000); 
}

function updateTime() {
    timeBlinkCounter++;
    const now = new Date();
    const realTime = now.toLocaleTimeString('en-US', { hour12: false });

    // 10回に1回、時間軸を崩壊させる
    if (timeBlinkCounter % 10 === 0) {
        const randomizer = Math.random();
        if (randomizer < 0.3) {
            timeDisplay.textContent = '2006/12/19'; // 変更後の日付
        } else if (randomizer < 0.6) {
            timeDisplay.textContent = '01101010'; 
        } else {
            timeDisplay.textContent = realTime;
        }
    } else {
        timeDisplay.textContent = realTime;
    }
}

//=====================================
// 5. ウィンドウ操作ロジック
//=====================================
function openWindow(fileId) {
    const data = FILE_DATA[fileId];
    if (!data) return;

    const existingWin = document.getElementById(`window-${fileId}`);
    if (existingWin) {
        bringToFront(existingWin);
        return;
    }

    playClick(); 

    const win = document.createElement('div');
    win.className = 'window';
    win.id = `window-${fileId}`;
    win.style.zIndex = ++currentZIndex;
    
    const randX = Math.floor(Math.random() * 250) + 100;
    const randY = Math.floor(Math.random() * 150) + 50;
    win.style.left = randX + 'px';
    win.style.top = randY + 'px';

    win.innerHTML = `
        <div class="window-title-bar">
            <span>${data.title}</span>
            <span class="close-btn">×</span>
        </div>
        <div class="window-content">${processContent(data.content)}</div>
    `;

    // イベント設定
    win.querySelector('.close-btn').addEventListener('click', () => win.remove());
    win.addEventListener('mousedown', () => bringToFront(win));

    const titleBar = win.querySelector('.window-title-bar');
    makeDraggable(win, titleBar);

    // リンクのイベント (確率で隠しファイルを開く)
    win.querySelectorAll('.nonlinear-link').forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            playClick();
            
            // ⭐ 隠しファイルが開く確率を判定 (4分の1 = 0.25)
            if (Math.random() < SECRET_FILE_CHANCE) {
                triggerFlash(); 
                openWindow('secret_file');
            }
        });
    });

    windowContainer.appendChild(win);
}

function bringToFront(element) {
    element.style.zIndex = ++currentZIndex;
}

function triggerFlash() {
    const flash = document.createElement('div');
    flash.className = 'flash-effect';
    document.body.appendChild(flash);
    
    setTimeout(() => {
        flash.remove();
    }, 100); 
}

function processContent(text) {
    // リンク化するキーワード：「他者」
    return text.replace(/(他者)/g, match => {
        return `<a href="#" class="nonlinear-link" data-target-file="secret_file">${match}</a>`;
    });
}

// ドラッグ処理 (前回と同じ)
function makeDraggable(element, handle) {
    let pos1 = 0, pos2 = 0, pos3 = 0, pos4 = 0;
    handle.onmousedown = dragMouseDown;
    function dragMouseDown(e) {
        e = e || window.event;
        e.preventDefault();
        element.style.zIndex = ++currentZIndex; 
        pos3 = e.clientX; pos4 = e.clientY;
        document.onmouseup = closeDragElement;
        document.onmousemove = elementDrag;
    }
    function elementDrag(e) {
        e = e || window.event;
        e.preventDefault();
        pos1 = pos3 - e.clientX; pos2 = pos4 - e.clientY;
        pos3 = e.clientX; pos4 = e.clientY;
        element.style.top = (element.offsetTop - pos2) + "px";
        element.style.left = (element.offsetLeft - pos1) + "px";
    }
    function closeDragElement() {
        document.onmouseup = null;
        document.onmousemove = null;
    }
}

init();