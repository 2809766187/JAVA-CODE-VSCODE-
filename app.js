const DEFAULT_USER = {
    username: "nba_king",
    password: "Hoops2026",
    gold: 1000,
    diamonds: 100,
    players: [],
    lineup: [null, null, null, null, null],
    tactic: "平衡进攻",
};

const players = [
    {
        id: "p1",
        name: "詹姆斯",
        position: "前锋",
        price: 450,
        upgradeCost: 40,
        offense: 90,
        defense: 85,
        speed: 88,
        rating: 94,
        description: "球场统治力极强，攻防兼备的超级巨星。",
    },
    {
        id: "p2",
        name: "库里",
        position: "后卫",
        price: 420,
        upgradeCost: 35,
        offense: 92,
        defense: 75,
        speed: 90,
        rating: 93,
        description: "外线三分王，能够快速打开对手防线。",
    },
    {
        id: "p3",
        name: "杜兰特",
        position: "前锋",
        price: 430,
        upgradeCost: 38,
        offense: 91,
        defense: 80,
        speed: 87,
        rating: 93,
        description: "高效得分手，拥有稳定的中远投能力。",
    },
    {
        id: "p4",
        name: "东契奇",
        position: "控卫",
        price: 380,
        upgradeCost: 33,
        offense: 88,
        defense: 72,
        speed: 86,
        rating: 90,
        description: "全能控卫，传球与得分兼备。",
    },
    {
        id: "p5",
        name: "亚历山大",
        position: "后卫",
        price: 360,
        upgradeCost: 32,
        offense: 86,
        defense: 78,
        speed: 89,
        rating: 89,
        description: "突破与投射兼备，适合构建快速进攻。",
    },
];

const state = {
    currentUser: null,
    selectedPlayer: null,
};

const dom = {
    userInfo: document.getElementById("userInfo"),
    goldValue: document.getElementById("goldValue"),
    diamondValue: document.getElementById("diamondValue"),
    playerCount: document.getElementById("playerCount"),
    shopList: document.getElementById("shopList"),
    playerLibrary: document.getElementById("playerLibrary"),
    detailCard: document.getElementById("detailCard"),
    lineUpSlots: document.getElementById("lineupSlots"),
    currentTactic: document.getElementById("currentTactic"),
};

const authOverlay = document.getElementById("authOverlay");
const loginBtn = document.getElementById("loginBtn");
const logoutBtn = document.getElementById("logoutBtn");
const closeAuth = document.getElementById("closeAuth");
const tabLogin = document.getElementById("tabLogin");
const tabRegister = document.getElementById("tabRegister");
const loginForm = document.getElementById("loginForm");
const registerForm = document.getElementById("registerForm");

const navButtons = Array.from(document.querySelectorAll(".nav-button"));
const pageSections = Array.from(document.querySelectorAll(".page-section"));

function getUsers() {
    return JSON.parse(localStorage.getItem("nbaGameUsers") || "[]");
}

function saveUsers(users) {
    localStorage.setItem("nbaGameUsers", JSON.stringify(users));
}

function getCurrentUser() {
    const username = localStorage.getItem("nbaCurrentUser");
    if (!username) return null;
    return getUsers().find((user) => user.username === username) || null;
}

function saveCurrentUser(username) {
    if (username) {
        localStorage.setItem("nbaCurrentUser", username);
    } else {
        localStorage.removeItem("nbaCurrentUser");
    }
}

function initDefaultAccount() {
    const users = getUsers();
    const exists = users.some((user) => user.username === DEFAULT_USER.username);
    if (!exists) {
        users.push(DEFAULT_USER);
        saveUsers(users);
    }
}

function showSection(sectionId) {
    pageSections.forEach((section) => {
        section.classList.toggle("active", section.id === sectionId);
    });
    navButtons.forEach((button) => {
        button.classList.toggle("active", button.dataset.section === sectionId);
    });
}

function updateAuthDisplay() {
    if (state.currentUser) {
        dom.userInfo.textContent = `${state.currentUser.username} | 金币 ${state.currentUser.gold} | 钻石 ${state.currentUser.diamonds}`;
        loginBtn.classList.add("hidden");
        logoutBtn.classList.remove("hidden");
    } else {
        dom.userInfo.textContent = "未登录";
        loginBtn.classList.remove("hidden");
        logoutBtn.classList.add("hidden");
    }
    renderHomeStats();
}

function renderHomeStats() {
    const totalPlayers = state.currentUser ? state.currentUser.players.length : 0;
    dom.goldValue.textContent = state.currentUser ? state.currentUser.gold : 0;
    dom.diamondValue.textContent = state.currentUser ? state.currentUser.diamonds : 0;
    dom.playerCount.textContent = totalPlayers;
}

function renderShop() {
    dom.shopList.innerHTML = "";
    players.forEach((player) => {
        const card = document.createElement("article");
        card.className = "player-card";
        card.innerHTML = `
            <h3>${player.name}</h3>
            <p><strong>位置：</strong>${player.position}</p>
            <p><strong>评分：</strong>${player.rating}</p>
            <p><strong>价格：</strong>金币 ${player.price}</p>
            <p>${player.description}</p>
            <div class="player-actions">
                <button class="player-action" data-action="buy" data-id="${player.id}">购买</button>
                <button class="player-action" data-action="detail" data-id="${player.id}">查看详情</button>
            </div>
        `;
        dom.shopList.appendChild(card);
    });
}

function renderLibrary() {
    dom.playerLibrary.innerHTML = "";
    if (!state.currentUser || state.currentUser.players.length === 0) {
        dom.playerLibrary.innerHTML = `<div class="player-card"><h3>你还没有球员</h3><p>先去商城购买球员，开始你的球队之旅。</p></div>`;
        return;
    }
    state.currentUser.players.forEach((player) => {
        const card = document.createElement("article");
        card.className = "player-card";
        card.innerHTML = `
            <h3>${player.name}</h3>
            <p><strong>位置：</strong>${player.position}</p>
            <p><strong>评分：</strong>${player.rating}</p>
            <p><strong>攻击：</strong>${player.offense}  防守：${player.defense}  速度：${player.speed}</p>
            <div class="player-actions">
                <button class="player-action" data-action="upgrade" data-id="${player.id}">升级 (${player.upgradeCost} 钻石)</button>
                <button class="player-action" data-action="detail" data-id="${player.id}">查看详情</button>
                <button class="player-action" data-action="lineup" data-id="${player.id}">加入阵容</button>
            </div>
        `;
        dom.playerLibrary.appendChild(card);
    });
}

function renderLineup() {
    dom.lineUpSlots.innerHTML = "";
    for (let index = 0; index < 5; index += 1) {
        const playerId = state.currentUser?.lineup[index];
        const slot = document.createElement("div");
        slot.className = "lineup-slot";
        if (playerId) {
            const player = state.currentUser.players.find((item) => item.id === playerId);
            slot.innerHTML = `<div><strong>${getLineupName(index)}</strong><br><span>${player ? player.name : "已弃用"}</span></div><button data-action="remove-lineup" data-index="${index}">移除</button>`;
        } else {
            slot.innerHTML = `<div><strong>${getLineupName(index)}</strong><br><span>空位</span></div><button data-action="set-lineup" data-index="${index}">设置</button>`;
        }
        dom.lineUpSlots.appendChild(slot);
    }
}

function getLineupName(index) {
    const names = ["控球后卫", "得分后卫", "小前锋", "大前锋", "中锋"];
    return names[index] || `位置 ${index + 1}`;
}

function renderDetail(player) {
    if (!player) {
        dom.detailCard.classList.add("hidden");
        return;
    }
    dom.detailCard.classList.remove("hidden");
    dom.detailCard.innerHTML = `
        <h3>${player.name} - ${player.position}</h3>
        <p>${player.description}</p>
        <div class="detail-list">
            <div class="detail-item"><span>评分</span><strong>${player.rating}</strong></div>
            <div class="detail-item"><span>攻击</span><strong>${player.offense}</strong></div>
            <div class="detail-item"><span>防守</span><strong>${player.defense}</strong></div>
            <div class="detail-item"><span>速度</span><strong>${player.speed}</strong></div>
            <div class="detail-item"><span>商城价格</span><strong>金币 ${player.price}</strong></div>
            <div class="detail-item"><span>升级消耗</span><strong>钻石 ${player.upgradeCost}</strong></div>
        </div>
    `;
}

function showMessage(message) {
    alert(message);
}

function saveUserState() {
    const users = getUsers().map((user) => (user.username === state.currentUser.username ? state.currentUser : user));
    saveUsers(users);
}

function handleBuy(playerId) {
    if (!state.currentUser) {
        showMessage("请先登录，再购买球员。");
        return;
    }
    const player = players.find((item) => item.id === playerId);
    if (!player) return;
    if (state.currentUser.players.some((item) => item.id === playerId)) {
        showMessage("你已经拥有这名球员了。请在球员库中查看。");
        return;
    }
    if (state.currentUser.gold < player.price) {
        showMessage("金币不足，无法购买此球员。");
        return;
    }
    state.currentUser.gold -= player.price;
    state.currentUser.players.push({ ...player });
    saveCurrentUser(state.currentUser.username);
    saveUserState();
    updateAuthDisplay();
    renderLibrary();
    showSection("library");
    showMessage(`成功购买 ${player.name}！`);
}

function handleUpgrade(playerId) {
    if (!state.currentUser) return;
    const player = state.currentUser.players.find((item) => item.id === playerId);
    if (!player) return;
    if (state.currentUser.diamonds < player.upgradeCost) {
        showMessage("钻石不足，无法升级球员。");
        return;
    }
    state.currentUser.diamonds -= player.upgradeCost;
    player.offense = Math.min(99, player.offense + 3);
    player.defense = Math.min(99, player.defense + 2);
    player.speed = Math.min(99, player.speed + 2);
    player.rating = Math.min(99, player.rating + 2);
    saveCurrentUser(state.currentUser.username);
    saveUserState();
    updateAuthDisplay();
    renderLibrary();
    showMessage(`已升级 ${player.name}，属性得到提升！`);
}

function handleLineup(playerId) {
    if (!state.currentUser) return;
    const availableIndex = state.currentUser.lineup.findIndex((slot) => slot === null);
    if (availableIndex < 0) {
        showMessage("首发阵容已满。请先移除一个位置。" );
        return;
    }
    if (!state.currentUser.players.some((item) => item.id === playerId)) {
        showMessage("你还未拥有该球员，无法加入阵容。");
        return;
    }
    if (state.currentUser.lineup.includes(playerId)) {
        showMessage("该球员已在首发阵容中。" );
        return;
    }
    state.currentUser.lineup[availableIndex] = playerId;
    saveCurrentUser(state.currentUser.username);
    saveUserState();
    renderLineup();
    showMessage("球员已加入当前首发阵容。" );
}

function handleRemoveLineup(index) {
    if (!state.currentUser) return;
    state.currentUser.lineup[index] = null;
    saveCurrentUser(state.currentUser.username);
    saveUserState();
    renderLineup();
}

function setTactic(tactic) {
    if (!state.currentUser) return;
    state.currentUser.tactic = tactic;
    saveCurrentUser(state.currentUser.username);
    saveUserState();
    dom.currentTactic.textContent = tactic;
    showMessage(`已设定战术：${tactic}`);
}

function handleAuthClicks(event) {
    const action = event.target.dataset.action;
    const id = event.target.dataset.id;
    if (action === "buy") {
        handleBuy(id);
    } else if (action === "detail") {
        const player = players.find((item) => item.id === id) || (state.currentUser && state.currentUser.players.find((item) => item.id === id));
        renderDetail(player);
        showSection("details");
    } else if (action === "upgrade") {
        handleUpgrade(id);
    } else if (action === "lineup") {
        handleLineup(id);
    } else if (action === "set-lineup") {
        const index = Number(event.target.dataset.index);
        const availablePlayer = state.currentUser.players.find(
            (item) => !state.currentUser.lineup.includes(item.id)
        );
        if (!availablePlayer) {
            showMessage("你当前没有可加入阵容的球员。" );
            return;
        }
        state.currentUser.lineup[index] = availablePlayer.id;
        saveCurrentUser(state.currentUser.username);
        saveUserState();
        renderLineup();
        showMessage(`${availablePlayer.name} 已加入阵容。`);
    } else if (action === "remove-lineup") {
        handleRemoveLineup(Number(event.target.dataset.index));
    }
}

function attemptLogin(event) {
    event.preventDefault();
    const username = document.getElementById("loginUsername").value.trim();
    const password = document.getElementById("loginPassword").value.trim();
    if (!username || !password) {
        showMessage("请输入用户名和密码。");
        return;
    }
    const user = getUsers().find((item) => item.username === username && item.password === password);
    if (!user) {
        showMessage("用户名或密码错误，请重试。");
        return;
    }
    state.currentUser = JSON.parse(JSON.stringify(user));
    saveCurrentUser(user.username);
    updateAuthDisplay();
    renderLibrary();
    renderLineup();
    dom.currentTactic.textContent = state.currentUser.tactic;
    closeAuthOverlay();
    showMessage("登录成功！欢迎回来。" );
}

function attemptRegister(event) {
    event.preventDefault();
    const username = document.getElementById("registerUsername").value.trim();
    const password = document.getElementById("registerPassword").value.trim();
    const confirm = document.getElementById("registerConfirm").value.trim();
    if (!username || !password || !confirm) {
        showMessage("请填写完整注册信息。");
        return;
    }
    if (password !== confirm) {
        showMessage("两次输入的密码不一致。");
        return;
    }
    const users = getUsers();
    if (users.some((item) => item.username === username)) {
        showMessage("用户名已被占用，请更换一个。" );
        return;
    }
    const newUser = {
        username,
        password,
        gold: 800,
        diamonds: 50,
        players: [],
        lineup: [null, null, null, null, null],
        tactic: "平衡进攻",
    };
    users.push(newUser);
    saveUsers(users);
    saveCurrentUser(username);
    state.currentUser = JSON.parse(JSON.stringify(newUser));
    updateAuthDisplay();
    renderLibrary();
    renderLineup();
    dom.currentTactic.textContent = newUser.tactic;
    closeAuthOverlay();
    showMessage(`注册成功！你的账号：${username}。`);
}

function openAuthOverlay() {
    authOverlay.classList.remove("hidden");
}

function closeAuthOverlay() {
    authOverlay.classList.add("hidden");
}

function switchTab(tab) {
    const loginActive = tab === "login";
    tabLogin.classList.toggle("active", loginActive);
    tabRegister.classList.toggle("active", !loginActive);
    loginForm.classList.toggle("active", loginActive);
    registerForm.classList.toggle("active", !loginActive);
}

function handleLogout() {
    saveCurrentUser(null);
    state.currentUser = null;
    updateAuthDisplay();
    renderLibrary();
    renderLineup();
    renderDetail(null);
    showMessage("已退出登录。");
}

function setupEventListeners() {
    loginBtn.addEventListener("click", openAuthOverlay);
    closeAuth.addEventListener("click", closeAuthOverlay);
    authOverlay.addEventListener("click", (event) => {
        if (event.target === authOverlay) closeAuthOverlay();
    });
    tabLogin.addEventListener("click", () => switchTab("login"));
    tabRegister.addEventListener("click", () => switchTab("register"));
    loginForm.addEventListener("submit", attemptLogin);
    registerForm.addEventListener("submit", attemptRegister);
    logoutBtn.addEventListener("click", handleLogout);
    dom.shopList.addEventListener("click", handleAuthClicks);
    dom.playerLibrary.addEventListener("click", handleAuthClicks);
    dom.lineUpSlots.addEventListener("click", handleAuthClicks);
    document.querySelectorAll(".tactic").forEach((button) => {
        button.addEventListener("click", () => setTactic(button.dataset.tactic));
    });
    navButtons.forEach((button) => {
        button.addEventListener("click", () => showSection(button.dataset.section));
    });
}

function init() {
    initDefaultAccount();
    state.currentUser = getCurrentUser();
    if (state.currentUser) {
        state.currentUser = JSON.parse(JSON.stringify(state.currentUser));
    }
    updateAuthDisplay();
    renderShop();
    renderLibrary();
    renderLineup();
    if (state.currentUser) dom.currentTactic.textContent = state.currentUser.tactic;
    setupEventListeners();
}

init();
