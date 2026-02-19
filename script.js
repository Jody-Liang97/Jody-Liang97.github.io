//--------------------暗黑模式---------------------
// 获取按钮和 body 元素
const toggleBtn = document.getElementById('darkModeToggle');
const body = document.body;

// 1. 从本地存储读取用户之前的选择
const savedMode = localStorage.getItem('darkMode');

// 2. 如果之前保存的是 'enabled'，则给 body 添加 dark-mode 类（启用暗黑模式）
if (savedMode === 'enabled') {
    body.classList.add('dark-mode');
}

// 3. 根据当前是否有 dark-mode 类，设置按钮的初始文字
//    因为上一步可能已经添加了类，也可能没有
if (body.classList.contains('dark-mode')) {
    toggleBtn.textContent = '☀️ 白天模式';
} else {
    toggleBtn.textContent = '🌙 暗黑模式';
}

// 4. 给按钮添加点击事件监听（无论什么情况都要添加）
toggleBtn.addEventListener('click', function() {
    // 切换 dark-mode 类
    body.classList.toggle('dark-mode');

    // 根据切换后的状态，更新按钮文字和本地存储
    if (body.classList.contains('dark-mode')) {
        // 现在是暗黑模式
        toggleBtn.textContent = '☀️ 白天模式';
        localStorage.setItem('darkMode', 'enabled');
    } else {
        // 现在是普通模式
        toggleBtn.textContent = '🌙 暗黑模式';
        localStorage.setItem('darkMode', 'disabled');
    }
});

//---------------------返回顶部按钮----------------------------
// 获取返回顶部按钮
const backToTopBtn = document.getElementById('backToTop');

// 监听页面滚动事件
window.addEventListener('scroll', function() {
    // 如果页面滚动距离大于 300px，则显示按钮，否则隐藏
    if (window.scrollY > 300) {
        backToTopBtn.classList.add('show');
    } else {
        backToTopBtn.classList.remove('show');
    }
});

// 点击按钮返回顶部
backToTopBtn.addEventListener('click', function() {
    window.scrollTo({
        top: 0,               // 滚动到页面顶部
        behavior: 'smooth'    // 平滑滚动
    });
});

//--------------------导航栏滚动吸顶------------------------

const navBar = document.querySelector('.nav-bar');
const navPlaceholder = document.querySelector('.nav-placeholder');
let navBarTop; // 导航栏距离页面顶部的初始距离

// 定义函数，获取导航栏的初始偏移量（需要考虑 header 可能的上边距）
function updateNavBarTop() {
    navBarTop = navBar.offsetTop;
}

// 初始化时计算（调用函数）
updateNavBarTop();

// 监听窗口大小改变时重新计算（因为响应式可能导致高度变化）
window.addEventListener('resize', updateNavBarTop);

// 监听滚动事件
window.addEventListener('scroll', function() {
    if (window.scrollY >= navBarTop) {
        // 滚动超过导航栏原始位置，添加 sticky 类
        if (!navBar.classList.contains('sticky')) {
            navBar.classList.add('sticky');
            // 设置占位符高度为导航栏当前高度
            navPlaceholder.style.height = navBar.offsetHeight + 'px';
        }
    } else {
        // 滚回上方，移除 sticky 类
        if (navBar.classList.contains('sticky')) {
            navBar.classList.remove('sticky');
            navPlaceholder.style.height = '0';
        }
    }
});

//--------------------技能进度条动画--------------------
// 技能数据：名称和百分比（可根据实际情况修改）
const skillsData = [
    { name: 'C语言', percent: 80 },
    { name: 'HTML', percent: 70 },
    { name: 'CSS', percent: 70 },
    { name: 'JavaScript', percent: 60},
    { name: '前端开发基础', percent: 40 },
    { name: '算法与数据结构', percent: 30 },
];

// 获取技能网格容器
const skillsGrid = document.getElementById('skillsGrid');

// 动态生成技能项
skillsData.forEach(skill => {
    // 创建外层 div
    const skillItem = document.createElement('div');
    skillItem.className = 'skill-item';

    // 创建技能头部（名称 + 百分比）
    const header = document.createElement('div');
    header.className = 'skill-header';

    const nameSpan = document.createElement('span');
    nameSpan.className = 'skill-name';
    nameSpan.textContent = skill.name;

    const percentSpan = document.createElement('span');
    percentSpan.className = 'skill-percent';
    percentSpan.textContent = skill.percent + '%';

    header.appendChild(nameSpan);
    header.appendChild(percentSpan);

    // 创建进度条
    const progressBar = document.createElement('div');
    progressBar.className = 'progress-bar';

    const progressFill = document.createElement('div');
    progressFill.className = 'progress-fill';
    // 将目标百分比存储在 data 属性中，以便动画使用
    progressFill.dataset.targetPercent = skill.percent;

    progressBar.appendChild(progressFill);

    // 组装
    skillItem.appendChild(header);
    skillItem.appendChild(progressBar);
    skillsGrid.appendChild(skillItem);
});

// 触发进度条动画：使用 Intersection Observer 当技能区域进入视口时启动动画
// 这样可以避免一进入页面就全部动画，提升体验
const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            // 当技能区域可见时，找到所有进度填充条，设置宽度为目标值
            const fills = document.querySelectorAll('.progress-fill');
            fills.forEach(fill => {
                const targetPercent = fill.dataset.targetPercent;
                // 直接设置宽度，CSS transition 会自动产生动画
                fill.style.width = targetPercent + '%';
            });
            // 停止观察（只需触发一次）
            observer.unobserve(entry.target);
        }
    });
}, { threshold: 0.3 }); // 当 30% 进入视口时触发

// 观察技能网格容器
observer.observe(skillsGrid);