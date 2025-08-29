// UI相关函数
function toggleSettings(e) {
    // 强化的密码保护校验 - 防止绕过
    try {
        if (window.ensurePasswordProtection) {
            window.ensurePasswordProtection();
        } else {
            // 兼容性检查
            if (window.isPasswordProtected && window.isPasswordVerified) {
                if (window.isPasswordProtected() && !window.isPasswordVerified()) {
                    showPasswordModal && showPasswordModal();
                    return;
                }
            }
        }
    } catch (error) {
        console.warn('Password protection check failed:', error.message);
        return;
    }
    // 阻止事件冒泡，防止触发document的点击事件
    e && e.stopPropagation();
    const panel = document.getElementById('settingsPanel');
    panel.classList.toggle('show');
}

// 改进的Toast显示函数 - 支持队列显示多个Toast
const toastQueue = [];
let isShowingToast = false;

function showToast(message, type = 'error') {
    // 首先确保toast元素存在
    let toast = document.getElementById('toast');
    let toastMessage = document.getElementById('toastMessage');

    // 如果toast元素不存在，创建它
    if (!toast) {
        toast = document.createElement('div');
        toast.id = 'toast';
        toast.className = 'fixed top-4 left-1/2 -translate-x-1/2 px-6 py-3 rounded-lg shadow-lg transform transition-all duration-300 z-50 opacity-0';
        toast.style = 'z-index: 2147483647'
        toastMessage = document.createElement('p');
        toastMessage.id = 'toastMessage';
        toast.appendChild(toastMessage);

        document.body.appendChild(toast);
    }

    // 将新的toast添加到队列
    toastQueue.push({ message, type });

    // 如果当前没有显示中的toast，则开始显示
    if (!isShowingToast) {
        showNextToast();
    }
}

function showNextToast() {
    if (toastQueue.length === 0) {
        isShowingToast = false;
        return;
    }

    isShowingToast = true;
    const { message, type } = toastQueue.shift();

    const toast = document.getElementById('toast');
    const toastMessage = document.getElementById('toastMessage');

    const bgColors = {
        'error': 'bg-red-500',
        'success': 'bg-green-500',
        'info': 'bg-blue-500',
        'warning': 'bg-yellow-500'
    };

    const bgColor = bgColors[type] || bgColors.error;
    toast.className = `fixed top-4 left-1/2 -translate-x-1/2 px-6 py-3 rounded-lg shadow-lg transform transition-all duration-300 ${bgColor} text-white z-50`;
    toastMessage.textContent = message;

    // 显示提示
    toast.style.opacity = '1';
    toast.style.transform = 'translateX(-50%) translateY(0)';

    // 3秒后自动隐藏
    setTimeout(() => {
        toast.style.opacity = '0';
        toast.style.transform = 'translateX(-50%) translateY(-100%)';

        // 等待动画完成后显示下一个toast
        setTimeout(() => {
            showNextToast();
        }, 300);
    }, 3000);
}

// 添加显示/隐藏 loading 的函数
let loadingTimeoutId = null;

function showLoading(message = '加载中...') {
    // 清除任何现有的超时
    if (loadingTimeoutId) {
        clearTimeout(loadingTimeoutId);
    }

    const loading = document.getElementById('loading');
    const messageEl = loading.querySelector('p');
    messageEl.textContent = message;
    loading.style.display = 'flex';

    // 设置30秒后自动关闭loading，防止无限loading
    loadingTimeoutId = setTimeout(() => {
        hideLoading();
        showToast('操作超时，请稍后重试', 'warning');
    }, 30000);
}

function hideLoading() {
    // 清除超时
    if (loadingTimeoutId) {
        clearTimeout(loadingTimeoutId);
        loadingTimeoutId = null;
    }

    const loading = document.getElementById('loading');
    loading.style.display = 'none';
}

function updateSiteStatus(isAvailable) {
    const statusEl = document.getElementById('siteStatus');
    if (isAvailable) {
        statusEl.innerHTML = '<span class="text-green-500">●</span> 可用';
    } else {
        statusEl.innerHTML = '<span class="text-red-500">●</span> 不可用';
    }
}

function closeModal() {
    document.getElementById('modal').classList.add('hidden');
    // 清除 iframe 内容
    document.getElementById('modalContent').innerHTML = '';
}

// 获取搜索历史的增强版本 - 支持新旧格式
function getSearchHistory() {
    try {
        const data = localStorage.getItem(SEARCH_HISTORY_KEY);
        if (!data) return [];

        const parsed = JSON.parse(data);

        // 检查是否是数组
        if (!Array.isArray(parsed)) return [];

        // 支持旧格式（字符串数组）和新格式（对象数组）
        return parsed.map(item => {
            if (typeof item === 'string') {
                return { text: item, timestamp: 0 };
            }
            return item;
        }).filter(item => item && item.text);
    } catch (e) {
        console.error('获取搜索历史出错:', e);
        return [];
    }
}

// 保存搜索历史的增强版本 - 添加时间戳和最大数量限制，现在缓存2个月
function saveSearchHistory(query) {
    if (!query || !query.trim()) return;

    // 清理输入，防止XSS
    query = query.trim().substring(0, 50).replace(/</g, '&lt;').replace(/>/g, '&gt;');

    let history = getSearchHistory();

    // 获取当前时间
    const now = Date.now();

    // 过滤掉超过2个月的记录（约60天，60*24*60*60*1000 = 5184000000毫秒）
    history = history.filter(item =>
        typeof item === 'object' && item.timestamp && (now - item.timestamp < 5184000000)
    );

    // 删除已存在的相同项
    history = history.filter(item =>
        typeof item === 'object' ? item.text !== query : item !== query
    );

    // 新项添加到开头，包含时间戳
    history.unshift({
        text: query,
        timestamp: now
    });

    // 限制历史记录数量
    if (history.length > MAX_HISTORY_ITEMS) {
        history = history.slice(0, MAX_HISTORY_ITEMS);
    }

    try {
        localStorage.setItem(SEARCH_HISTORY_KEY, JSON.stringify(history));
    } catch (e) {
        console.error('保存搜索历史失败:', e);
        // 如果存储失败（可能是localStorage已满），尝试清理旧数据
        try {
            localStorage.removeItem(SEARCH_HISTORY_KEY);
            localStorage.setItem(SEARCH_HISTORY_KEY, JSON.stringify(history.slice(0, 3)));
        } catch (e2) {
            console.error('再次保存搜索历史失败:', e2);
        }
    }

    renderSearchHistory();
}

// 渲染最近搜索历史的增强版本
function renderSearchHistory() {
    const historyContainer = document.getElementById('recentSearches');
    if (!historyContainer) return;

    const history = getSearchHistory();

    if (history.length === 0) {
        historyContainer.innerHTML = '';
        return;
    }

    // 创建一个包含标题和清除按钮的行
    historyContainer.innerHTML = `
        <div class="flex justify-between items-center w-full mb-2">
            <div class="text-gray-500">最近搜索:</div>
            <button id="clearHistoryBtn" class="text-gray-500 hover:text-white transition-colors"
                    onclick="clearSearchHistory()" aria-label="清除搜索历史">
                清除搜索历史
            </button>
        </div>
    `;

    history.forEach(item => {
        const tag = document.createElement('button');
        tag.className = 'search-tag flex items-center gap-1';
        const textSpan = document.createElement('span');
        textSpan.textContent = item.text;
        tag.appendChild(textSpan);

        // 添加删除按钮
        const deleteButton = document.createElement('span');
        deleteButton.className = 'pl-1 text-gray-500 hover:text-red-500 transition-colors';
        deleteButton.innerHTML = '<svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path></svg>';
        deleteButton.onclick = function(e) {
            // 阻止事件冒泡，避免触发搜索
            e.stopPropagation();
            // 删除对应历史记录
            deleteSingleSearchHistory(item.text);
            // 重新渲染搜索历史
            renderSearchHistory();
        };
        tag.appendChild(deleteButton);

        // 添加时间提示（如果有时间戳）
        if (item.timestamp) {
            const date = new Date(item.timestamp);
            tag.title = `搜索于: ${date.toLocaleString()}`;
        }

        tag.onclick = function() {
            document.getElementById('searchInput').value = item.text;
            search();
        };
        historyContainer.appendChild(tag);
    });
}

// 删除单条搜索历史记录
function deleteSingleSearchHistory(query) {
    // 当url中包含删除的关键词时，页面刷新后会自动加入历史记录，导致误认为删除功能有bug。此问题无需修复，功能无实际影响。
    try {
        let history = getSearchHistory();
        // 过滤掉要删除的记录
        history = history.filter(item => item.text !== query);
        console.log('更新后的搜索历史:', history);
        localStorage.setItem(SEARCH_HISTORY_KEY, JSON.stringify(history));
    } catch (e) {
        console.error('删除单条搜索历史失败:', e);
        showToast('删除单条搜索历史失败', 'error');
    }
}

// 增加清除搜索历史功能
function clearSearchHistory() {
    // 密码保护校验
    if (window.isPasswordProtected && window.isPasswordVerified) {
        if (window.isPasswordProtected() && !window.isPasswordVerified()) {
            showPasswordModal && showPasswordModal();
            return;
        }
    }
    try {
        localStorage.removeItem(SEARCH_HISTORY_KEY);
        renderSearchHistory();
        showToast('搜索历史已清除', 'success');
    } catch (e) {
        console.error('清除搜索历史失败:', e);
        showToast('清除搜索历史失败:', 'error');
    }
}

// 历史面板相关函数
function toggleHistory(e) {
    // 密码保护校验
    if (window.isPasswordProtected && window.isPasswordVerified) {
        if (window.isPasswordProtected() && !window.isPasswordVerified()) {
            showPasswordModal && showPasswordModal();
            return;
        }
    }
    if (e) e.stopPropagation();

    const panel = document.getElementById('historyPanel');
    if (panel) {
        panel.classList.toggle('show');

        // 如果打开了历史记录面板，则加载历史数据
        if (panel.classList.contains('show')) {
            loadViewingHistory();
        }

        // 如果设置面板是打开的，则关闭它
        const settingsPanel = document.getElementById('settingsPanel');
        if (settingsPanel && settingsPanel.classList.contains('show')) {
            settingsPanel.classList.remove('show');
        }
    }
}

// 格式化时间戳为友好的日期时间格式
function formatTimestamp(timestamp) {
    const date = new Date(timestamp);
    const now = new Date();
    const diff = now - date;

    // 小于1小时，显示"X分钟前"
    if (diff < 3600000) {
        const minutes = Math.floor(diff / 60000);
        return minutes <= 0 ? '刚刚' : `${minutes}分钟前`;
    }

    // 小于24小时，显示"X小时前"
    if (diff < 86400000) {
        const hours = Math.floor(diff / 3600000);
        return `${hours}小时前`;
    }

    // 小于7天，显示"X天前"
    if (diff < 604800000) {
        const days = Math.floor(diff / 86400000);
        return `${days}天前`;
    }

    // 其他情况，显示完整日期
    const year = date.getFullYear();
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const day = date.getDate().toString().padStart(2, '0');
    const hour = date.getHours().toString().padStart(2, '0');
    const minute = date.getMinutes().toString().padStart(2, '0');

    return `${year}-${month}-${day} ${hour}:${minute}`;
}

// 获取观看历史记录
function getViewingHistory() {
    try {
        const data = localStorage.getItem('viewingHistory');
        return data ? JSON.parse(data) : [];
    } catch (e) {
        console.error('获取观看历史失败:', e);
        return [];
    }
}

// 加载观看历史并渲染
function loadViewingHistory() {
    const historyList = document.getElementById('historyList');
    if (!historyList) return;

    const history = getViewingHistory();

    if (history.length === 0) {
        historyList.innerHTML = `<div class="text-center text-gray-500 py-8">暂无观看记录</div>`;
        return;
    }

    // 渲染历史记录
    historyList.innerHTML = history.map(item => {
        // 防止XSS
        const safeTitle = item.title
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;')
            .replace(/"/g, '&quot;');

        const safeSource = item.sourceName ?
            item.sourceName.replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;') :
            '未知来源';

        const episodeText = item.episodeIndex !== undefined ?
            `第${item.episodeIndex + 1}集` : '';

        // 格式化剧集信息
        let episodeInfoHtml = '';
        if (item.episodes && Array.isArray(item.episodes) && item.episodes.length > 0) {
            const totalEpisodes = item.episodes.length;
            const syncStatus = item.lastSyncTime ?
                `<span class="text-green-400 text-xs" title="剧集列表已同步">✓</span>` :
                `<span class="text-yellow-400 text-xs" title="使用缓存数据">⚠</span>`;
            episodeInfoHtml = `<span class="text-xs text-gray-400">共${totalEpisodes}集 ${syncStatus}</span>`;
        }

        // 格式化进度信息
        let progressHtml = '';
        if (item.playbackPosition && item.duration && item.playbackPosition > 10 && item.playbackPosition < item.duration * 0.95) {
            const percent = Math.round((item.playbackPosition / item.duration) * 100);
            const formattedTime = formatPlaybackTime(item.playbackPosition);
            const formattedDuration = formatPlaybackTime(item.duration);

            progressHtml = `
                <div class="history-progress">
                    <div class="progress-bar">
                        <div class="progress-filled" style="width:${percent}%"></div>
                    </div>
                    <div class="progress-text">${formattedTime} / ${formattedDuration}</div>
                </div>
            `;
        }

        // 为防止XSS，使用encodeURIComponent编码URL
        const safeURL = encodeURIComponent(item.url);

        // 构建历史记录项HTML，添加删除按钮，需要放在position:relative的容器中
        return `
            <div class="history-item cursor-pointer relative group" onclick="playFromHistory('${item.url}', '${safeTitle}', ${item.episodeIndex || 0}, ${item.playbackPosition || 0})">
                <button onclick="event.stopPropagation(); deleteHistoryItem('${safeURL}')"
                        class="absolute right-2 top-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200 text-gray-400 hover:text-red-400 p-1 rounded-full hover:bg-gray-800 z-10"
                        title="删除记录">
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
                    </svg>
                </button>
                <div class="history-info">
                    <div class="history-title">${safeTitle}</div>
                    <div class="history-meta">
                        <span class="history-episode">${episodeText}</span>
                        ${episodeText ? '<span class="history-separator mx-1">·</span>' : ''}
                        <span class="history-source">${safeSource}</span>
                        ${episodeInfoHtml ? '<span class="history-separator mx-1">·</span>' : ''}
                        ${episodeInfoHtml}
                    </div>
                    ${progressHtml}
                    <div class="history-time">${formatTimestamp(item.timestamp)}</div>
                </div>
            </div>
        `;
    }).join('');

    // 检查是否存在较多历史记录，添加底部边距确保底部按钮不会挡住内容
    if (history.length > 5) {
        historyList.classList.add('pb-4');
    }
}

// 格式化播放时间为 mm:ss 格式
function formatPlaybackTime(seconds) {
    if (!seconds || isNaN(seconds)) return '00:00';

    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.floor(seconds % 60);

    return `${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
}

// 删除单个历史记录项
function deleteHistoryItem(encodedUrl) {
    try {
        // 解码URL
        const url = decodeURIComponent(encodedUrl);

        // 获取当前历史记录
        const history = getViewingHistory();

        // 过滤掉要删除的项
        const newHistory = history.filter(item => item.url !== url);

        // 保存回localStorage
        localStorage.setItem('viewingHistory', JSON.stringify(newHistory));

        // 重新加载历史记录显示
        loadViewingHistory();

        // 显示成功提示
        showToast('已删除该记录', 'success');
    } catch (e) {
        console.error('删除历史记录项失败:', e);
        showToast('删除记录失败', 'error');
    }
}

// 从历史记录播放
async function playFromHistory(url, title, episodeIndex, playbackPosition = 0) {
    // console.log('[playFromHistory in ui.js] Called with:', { url, title, episodeIndex, playbackPosition }); // Log 1
    try {
        let episodesList = [];
        let historyItem = null; // To store the full history item
        let syncSuccessful = false;

        // 检查viewingHistory，查找匹配的项
        const historyRaw = localStorage.getItem('viewingHistory');
        if (historyRaw) {
            const history = JSON.parse(historyRaw);
            historyItem = history.find(item => item.url === url);
            // console.log('[playFromHistory in ui.js] Found historyItem:', historyItem ? JSON.parse(JSON.stringify(historyItem)) : null); // Log 2 (stringify/parse for deep copy)
            if (historyItem) {
                // console.log('[playFromHistory in ui.js] historyItem.vod_id:', historyItem.vod_id, 'historyItem.sourceName:', historyItem.sourceName); // Log 3
            }

            if (historyItem && historyItem.episodes && Array.isArray(historyItem.episodes)) {
                episodesList = historyItem.episodes; // Default to stored episodes
                // console.log(`从历史记录找到视频 "${title}" 的集数数据 (默认):`, episodesList.length);
            }
        }

        // Always attempt to fetch fresh episode list if we have the necessary info
        if (historyItem && historyItem.vod_id && historyItem.sourceName) {
            // Show loading toast to indicate syncing
            showToast('正在同步最新剧集列表...', 'info');

            // console.log(`[playFromHistory in ui.js] Attempting to fetch details for vod_id: ${historyItem.vod_id}, sourceName: ${historyItem.sourceName}`); // Log 4
            try {
                // Construct the API URL for detail fetching
                // historyItem.sourceName is used as the sourceCode here
                // Add a cache buster timestamp
                const timestamp = new Date().getTime();
                const apiUrl = `/api/detail?id=${encodeURIComponent(historyItem.vod_id)}&source=${encodeURIComponent(historyItem.sourceName)}&_t=${timestamp}`;

                // Add timeout to the fetch request
                const controller = new AbortController();
                const timeoutId = setTimeout(() => controller.abort(), 10000); // 10 second timeout

                const response = await fetch(apiUrl, {
                    signal: controller.signal
                });
                clearTimeout(timeoutId);

                if (!response.ok) {
                    throw new Error(`API request failed with status ${response.status}`);
                }
                const videoDetails = await response.json();

                if (videoDetails && videoDetails.episodes && videoDetails.episodes.length > 0) {
                    const oldEpisodeCount = episodesList.length;
                    episodesList = videoDetails.episodes;
                    syncSuccessful = true;

                    // Show success message with episode count info
                    const newEpisodeCount = episodesList.length;
                    if (newEpisodeCount > oldEpisodeCount) {
                        showToast(`已同步最新剧集列表 (${newEpisodeCount}集，新增${newEpisodeCount - oldEpisodeCount}集)`, 'success');
                    } else if (newEpisodeCount === oldEpisodeCount) {
                        showToast(`剧集列表已是最新 (${newEpisodeCount}集)`, 'success');
                    } else {
                        showToast(`已同步最新剧集列表 (${newEpisodeCount}集)`, 'success');
                    }

                    // console.log(`成功获取 "${title}" 最新剧集列表:`, episodesList.length, "集");
                    // Update the history item in localStorage with the fresh episodes
                    if (historyItem) {
                        historyItem.episodes = [...episodesList]; // Deep copy
                        historyItem.lastSyncTime = Date.now(); // Add sync timestamp
                        const history = JSON.parse(historyRaw); // Re-parse to ensure we have the latest version
                        const idx = history.findIndex(item => item.url === url);
                        if (idx !== -1) {
                            history[idx] = { ...history[idx], ...historyItem }; // Merge, ensuring other properties are kept
                            localStorage.setItem('viewingHistory', JSON.stringify(history));
                            // console.log("观看历史中的剧集列表已更新。");
                        }
                    }
                } else {
                    // console.log(`未能获取 "${title}" 的最新剧集列表，或列表为空。将使用已存储的剧集。`);
                    showToast('未获取到最新剧集信息，使用缓存数据', 'warning');
                }
            } catch (fetchError) {
                // console.error(`获取 "${title}" 最新剧集列表失败:`, fetchError, "将使用已存储的剧集。");
                if (fetchError.name === 'AbortError') {
                    showToast('同步剧集列表超时，使用缓存数据', 'warning');
                } else {
                    showToast('同步剧集列表失败，使用缓存数据', 'warning');
                }
            }
        } else if (historyItem) {
            // console.log(`历史记录项 "${title}" 缺少 vod_id 或 sourceName，无法刷新剧集列表。将使用已存储的剧集。`);
            showToast('无法同步剧集列表，使用缓存数据', 'info');
        }


        // 如果在历史记录中没找到，尝试使用上一个会话的集数数据
        if (episodesList.length === 0) {
            try {
                const storedEpisodes = JSON.parse(localStorage.getItem('currentEpisodes') || '[]');
                if (storedEpisodes.length > 0) {
                    episodesList = storedEpisodes;
                    // console.log(`使用localStorage中的集数数据:`, episodesList.length);
                }
            } catch (e) {
                // console.error('解析currentEpisodes失败:', e);
            }
        }

        // 将剧集列表保存到localStorage，播放器页面会读取它
        if (episodesList.length > 0) {
            localStorage.setItem('currentEpisodes', JSON.stringify(episodesList));
            // console.log(`已将剧集列表保存到localStorage，共 ${episodesList.length} 集`);
        }

        // 保存当前页面URL作为返回地址
        let currentPath;
        if (window.location.pathname.startsWith('/player.html') || window.location.pathname.startsWith('/watch.html')) {
            currentPath = localStorage.getItem('lastPageUrl') || '/';
        } else {
            currentPath = window.location.origin + window.location.pathname + window.location.search;
        }
        localStorage.setItem('lastPageUrl', currentPath);

        // 构造播放器URL
        let playerUrl;
        const sourceNameForUrl = historyItem ? historyItem.sourceName : (new URLSearchParams(new URL(url, window.location.origin).search)).get('source');
        const sourceCodeForUrl = historyItem ? historyItem.sourceCode || historyItem.sourceName : (new URLSearchParams(new URL(url, window.location.origin).search)).get('source_code');
        const idForUrl = historyItem ? historyItem.vod_id : '';


        if (url.includes('player.html') || url.includes('watch.html')) {
            // console.log('检测到嵌套播放链接，解析真实URL');
            try {
                const nestedUrl = new URL(url, window.location.origin);
                const nestedParams = nestedUrl.searchParams;
                const realVideoUrl = nestedParams.get('url') || url;

                playerUrl = `player.html?url=${encodeURIComponent(realVideoUrl)}&title=${encodeURIComponent(title)}&index=${episodeIndex}&position=${Math.floor(playbackPosition || 0)}&returnUrl=${encodeURIComponent(currentPath)}`;
                if (sourceNameForUrl) playerUrl += `&source=${encodeURIComponent(sourceNameForUrl)}`;
                if (sourceCodeForUrl) playerUrl += `&source_code=${encodeURIComponent(sourceCodeForUrl)}`;
                if (idForUrl) playerUrl += `&id=${encodeURIComponent(idForUrl)}`;


            } catch (e) {
                // console.error('解析嵌套URL出错:', e);
                playerUrl = `player.html?url=${encodeURIComponent(url)}&title=${encodeURIComponent(title)}&index=${episodeIndex}&position=${Math.floor(playbackPosition || 0)}&returnUrl=${encodeURIComponent(currentPath)}`;
                if (sourceNameForUrl) playerUrl += `&source=${encodeURIComponent(sourceNameForUrl)}`;
                if (sourceCodeForUrl) playerUrl += `&source_code=${encodeURIComponent(sourceCodeForUrl)}`;
                if (idForUrl) playerUrl += `&id=${encodeURIComponent(idForUrl)}`;
            }
        } else {
             // This case should ideally not happen if 'url' is always a player.html link from history
            // console.warn("Playing from history with a non-player.html URL structure. This might be an issue.");
            const playUrl = new URL(url, window.location.origin);
            if (!playUrl.searchParams.has('index') && episodeIndex > 0) {
                playUrl.searchParams.set('index', episodeIndex);
            }
            playUrl.searchParams.set('position', Math.floor(playbackPosition || 0).toString());
            playUrl.searchParams.set('returnUrl', encodeURIComponent(currentPath));
            if (sourceNameForUrl) playUrl.searchParams.set('source', sourceNameForUrl);
            if (sourceCodeForUrl) playUrl.searchParams.set('source_code', sourceCodeForUrl);
            if (idForUrl) playUrl.searchParams.set('id', idForUrl);
            playerUrl = playUrl.toString();
        }

        showVideoPlayer(playerUrl);
    } catch (e) {
        // console.error('从历史记录播放失败:', e);
        const simpleUrl = `player.html?url=${encodeURIComponent(url)}&title=${encodeURIComponent(title)}&index=${episodeIndex}`;
        showVideoPlayer(simpleUrl);
    }
}

// 添加观看历史 - 确保每个视频标题只有一条记录
// IMPORTANT: videoInfo passed to this function should include a 'showIdentifier' property
// (ideally `${sourceName}_${vod_id}`), 'sourceName', and 'vod_id'.
function addToViewingHistory(videoInfo) {
    // 密码保护校验
    if (window.isPasswordProtected && window.isPasswordVerified) {
        if (window.isPasswordProtected() && !window.isPasswordVerified()) {
            showPasswordModal && showPasswordModal();
            return;
        }
    }
    try {
        const history = getViewingHistory();

        // Ensure videoInfo has a showIdentifier
        if (!videoInfo.showIdentifier) {
            if (videoInfo.sourceName && videoInfo.vod_id) {
                videoInfo.showIdentifier = `${videoInfo.sourceName}_${videoInfo.vod_id}`;
            } else {
                // Fallback if critical IDs are missing for the preferred identifier
                videoInfo.showIdentifier = (videoInfo.episodes && videoInfo.episodes.length > 0) ? videoInfo.episodes[0] : videoInfo.directVideoUrl;
                // console.warn(`addToViewingHistory: videoInfo for "${videoInfo.title}" was missing sourceName or vod_id for preferred showIdentifier. Generated fallback: ${videoInfo.showIdentifier}`);
            }
        }

        const existingIndex = history.findIndex(item =>
            item.title === videoInfo.title &&
            item.sourceName === videoInfo.sourceName &&
            item.showIdentifier === videoInfo.showIdentifier // Strict check using the determined showIdentifier
        );

        if (existingIndex !== -1) {
            // Exact match with showIdentifier: Update existing series entry
            const existingItem = history[existingIndex];
            existingItem.episodeIndex = videoInfo.episodeIndex;
            existingItem.timestamp = Date.now();
            existingItem.sourceName = videoInfo.sourceName || existingItem.sourceName;
            existingItem.sourceCode = videoInfo.sourceCode || existingItem.sourceCode;
            existingItem.vod_id = videoInfo.vod_id || existingItem.vod_id;
            existingItem.directVideoUrl = videoInfo.directVideoUrl || existingItem.directVideoUrl;
            existingItem.url = videoInfo.url || existingItem.url;
            existingItem.playbackPosition = videoInfo.playbackPosition > 10 ? videoInfo.playbackPosition : (existingItem.playbackPosition || 0);
            existingItem.duration = videoInfo.duration || existingItem.duration;

            if (videoInfo.episodes && Array.isArray(videoInfo.episodes) && videoInfo.episodes.length > 0) {
                if (!existingItem.episodes ||
                    !Array.isArray(existingItem.episodes) ||
                    existingItem.episodes.length !== videoInfo.episodes.length ||
                    !videoInfo.episodes.every((ep, i) => ep === existingItem.episodes[i])) {
                    existingItem.episodes = [...videoInfo.episodes];
                    // console.log(`更新 (addToViewingHistory) "${videoInfo.title}" 的剧集数据: ${videoInfo.episodes.length}集`);
                }
            }

            history.splice(existingIndex, 1);
            history.unshift(existingItem);
            // console.log(`更新历史记录 (addToViewingHistory): "${videoInfo.title}", 第 ${videoInfo.episodeIndex !== undefined ? videoInfo.episodeIndex + 1 : 'N/A'} 集`);
        } else {
            // No exact match: Add as a new entry
            const newItem = {
                ...videoInfo, // Includes the showIdentifier we ensured is present
                timestamp: Date.now()
            };

            if (videoInfo.episodes && Array.isArray(videoInfo.episodes)) {
                newItem.episodes = [...videoInfo.episodes];
            } else {
                newItem.episodes = [];
            }

            history.unshift(newItem);
            // console.log(`创建新的历史记录 (addToViewingHistory): "${videoInfo.title}", Episode: ${videoInfo.episodeIndex !== undefined ? videoInfo.episodeIndex + 1 : 'N/A'}`);
        }

        // 限制历史记录数量为50条
        const maxHistoryItems = 50;
        if (history.length > maxHistoryItems) {
            history.splice(maxHistoryItems);
        }

        // 保存到本地存储
        localStorage.setItem('viewingHistory', JSON.stringify(history));
    } catch (e) {
        // console.error('保存观看历史失败:', e);
    }
}

// 清空观看历史
function clearViewingHistory() {
    try {
        localStorage.removeItem('viewingHistory');
        loadViewingHistory(); // 重新加载空的历史记录
        showToast('观看历史已清空', 'success');
    } catch (e) {
        // console.error('清除观看历史失败:', e);
        showToast('清除观看历史失败', 'error');
    }
}

// 更新toggleSettings函数以处理历史面板互动
const originalToggleSettings = toggleSettings;
toggleSettings = function(e) {
    if (e) e.stopPropagation();

    // 原始设置面板切换逻辑
    originalToggleSettings(e);

    // 如果历史记录面板是打开的，则关闭它
    const historyPanel = document.getElementById('historyPanel');
    if (historyPanel && historyPanel.classList.contains('show')) {
        historyPanel.classList.remove('show');
    }
};

// 点击外部关闭历史面板
document.addEventListener('DOMContentLoaded', function() {
    document.addEventListener('click', function(e) {
        const historyPanel = document.getElementById('historyPanel');
        const historyButton = document.querySelector('button[onclick="toggleHistory(event)"]');

        if (historyPanel && historyButton &&
            !historyPanel.contains(e.target) &&
            !historyButton.contains(e.target) &&
            historyPanel.classList.contains('show')) {
            historyPanel.classList.remove('show');
        }
    });
});

// 清除本地存储缓存并刷新页面
function clearLocalStorage() {
    // 确保模态框在页面上只有一个实例
    let modal = document.getElementById('messageBoxModal');
    if (modal) {
        document.body.removeChild(modal);
    }

    // 创建模态框元素
    modal = document.createElement('div');
    modal.id = 'messageBoxModal';
    modal.className = 'fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-40';

    modal.innerHTML = `
        <div class="bg-[#191919] rounded-lg p-6 max-w-md w-full max-h-[90vh] overflow-y-auto relative">
            <button id="closeBoxModal" class="absolute top-4 right-4 text-gray-400 hover:text-white text-xl">&times;</button>

            <h3 class="text-xl font-bold text-red-500 mb-4">警告</h3>

            <div class="mb-0">
                <div class="text-sm font-medium text-gray-300">确定要清除页面缓存吗？</div>
                <div class="text-sm font-medium text-gray-300 mb-4">此功能会删除你的观看记录、自定义 API 接口和 Cookie，<scan class="text-red-500 font-bold">此操作不可恢复！</scan></div>
                <div class="flex justify-end space-x-2">
                    <button id="confirmBoxModal" class="ml-2 bg-gray-600 hover:bg-gray-700 text-white px-4 py-1 rounded">确定</button>
                    <button id="cancelBoxModal" class="ml-2 bg-pink-600 hover:bg-pink-700 text-white px-4 py-1 rounded">取消</button>
                </div>
            </div>
        </div>`;

    // 添加模态框到页面
    document.body.appendChild(modal);

    // 添加事件监听器 - 关闭按钮
    document.getElementById('closeBoxModal').addEventListener('click', function () {
        document.body.removeChild(modal);
    });

    // 添加事件监听器 - 确定按钮
    document.getElementById('confirmBoxModal').addEventListener('click', function () {
        // 清除所有localStorage数据
        localStorage.clear();

        // 清除所有cookie
        const cookies = document.cookie.split(";");
        for (let i = 0; i < cookies.length; i++) {
            const cookie = cookies[i];
            const eqPos = cookie.indexOf("=");
            const name = eqPos > -1 ? cookie.substr(0, eqPos).trim() : cookie.trim();
            document.cookie = name + "=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/";
        }

        modal.innerHTML = `
            <div class="bg-[#191919] rounded-lg p-6 max-w-md w-full max-h-[90vh] overflow-y-auto relative">
                <button id="closeBoxModal" class="absolute top-4 right-4 text-gray-400 hover:text-white text-xl">&times;</button>

                <h3 class="text-xl font-bold text-white mb-4">提示</h3>

                <div class="mb-4">
                    <div class="text-sm font-medium text-gray-300 mb-4">页面缓存和Cookie已清除，<span id="countdown">3</span> 秒后自动刷新本页面。</div>
                </div>
            </div>`;

        let countdown = 3;
        const countdownElement = document.getElementById('countdown');

        const countdownInterval = setInterval(() => {
            countdown--;
            if (countdown >= 0) {
                countdownElement.textContent = countdown;
            } else {
                clearInterval(countdownInterval);
                window.location.reload();
            }
        }, 1000);
    });

    // 添加事件监听器 - 取消按钮
    document.getElementById('cancelBoxModal').addEventListener('click', function () {
        document.body.removeChild(modal);
    });

    // 添加事件监听器 - 点击模态框外部关闭
    modal.addEventListener('click', function (e) {
        if (e.target === modal) {
            document.body.removeChild(modal);
        }
    });
}

// 显示配置文件导入页面
function showImportBox(fun) {
    // 确保模态框在页面上只有一个实例
    let modal = document.getElementById('showImportBoxModal');
    if (modal) {
        document.body.removeChild(modal);
    }

    // 创建模态框元素
    modal = document.createElement('div');
    modal.id = 'showImportBoxModal';
    modal.className = 'fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-40';

    modal.innerHTML = `
        <div class="bg-[#191919] rounded-lg p-6 max-w-md w-full max-h-[90vh] overflow-y-auto relative">
            <button id="closeBoxModal" class="absolute top-4 right-4 text-gray-400 hover:text-white text-xl">&times;</button>

            <div class="m-4">
                <div id="dropZone" class="w-full py-9 bg-[#111] rounded-2xl border border-gray-300 gap-3 grid border-dashed">
                    <div class="grid gap-1">
                        <svg class="mx-auto" width="40" height="40" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <g id="File">
                                <path id="icon" d="M31.6497 10.6056L32.2476 10.0741L31.6497 10.6056ZM28.6559 7.23757L28.058 7.76907L28.058 7.76907L28.6559 7.23757ZM26.5356 5.29253L26.2079 6.02233L26.2079 6.02233L26.5356 5.29253ZM33.1161 12.5827L32.3683 12.867V12.867L33.1161 12.5827ZM31.8692 33.5355L32.4349 34.1012L31.8692 33.5355ZM24.231 11.4836L25.0157 11.3276L24.231 11.4836ZM26.85 14.1026L26.694 14.8872L26.85 14.1026ZM11.667 20.8667C11.2252 20.8667 10.867 21.2248 10.867 21.6667C10.867 22.1085 11.2252 22.4667 11.667 22.4667V20.8667ZM25.0003 22.4667C25.4422 22.4667 25.8003 22.1085 25.8003 21.6667C25.8003 21.2248 25.4422 20.8667 25.0003 20.8667V22.4667ZM11.667 25.8667C11.2252 25.8667 10.867 26.2248 10.867 26.6667C10.867 27.1085 11.2252 27.4667 11.667 27.4667V25.8667ZM20.0003 27.4667C20.4422 27.4667 20.8003 27.1085 20.8003 26.6667C20.8003 26.2248 20.4422 25.8667 20.0003 25.8667V27.4667ZM23.3337 34.2H16.667V35.8H23.3337V34.2ZM7.46699 25V15H5.86699V25H7.46699ZM32.5337 15.0347V25H34.1337V15.0347H32.5337ZM16.667 5.8H23.6732V4.2H16.667V5.8ZM23.6732 5.8C25.2185 5.8 25.7493 5.81639 26.2079 6.02233L26.8633 4.56274C26.0191 4.18361 25.0759 4.2 23.6732 4.2V5.8ZM29.2539 6.70608C28.322 5.65771 27.7076 4.94187 26.8633 4.56274L26.2079 6.02233C26.6665 6.22826 27.0314 6.6141 28.058 7.76907L29.2539 6.70608ZM34.1337 15.0347C34.1337 13.8411 34.1458 13.0399 33.8638 12.2984L32.3683 12.867C32.5216 13.2702 32.5337 13.7221 32.5337 15.0347H34.1337ZM31.0518 11.1371C31.9238 12.1181 32.215 12.4639 32.3683 12.867L33.8638 12.2984C33.5819 11.5569 33.0406 10.9662 32.2476 10.0741L31.0518 11.1371ZM16.667 34.2C14.2874 34.2 12.5831 34.1983 11.2872 34.0241C10.0144 33.8529 9.25596 33.5287 8.69714 32.9698L7.56577 34.1012C8.47142 35.0069 9.62375 35.4148 11.074 35.6098C12.5013 35.8017 14.3326 35.8 16.667 35.8V34.2ZM5.86699 25C5.86699 27.3344 5.86529 29.1657 6.05718 30.593C6.25217 32.0432 6.66012 33.1956 7.56577 34.1012L8.69714 32.9698C8.13833 32.411 7.81405 31.6526 7.64292 30.3798C7.46869 29.0839 7.46699 27.3796 7.46699 25H5.86699ZM23.3337 35.8C25.6681 35.8 27.4993 35.8017 28.9266 35.6098C30.3769 35.4148 31.5292 35.0069 32.4349 34.1012L31.3035 32.9698C30.7447 33.5287 29.9863 33.8529 28.7134 34.0241C27.4175 34.1983 25.7133 34.2 23.3337 34.2V35.8ZM32.5337 25C32.5337 27.3796 32.532 29.0839 32.3577 30.3798C32.1866 31.6526 31.8623 32.411 31.3035 32.9698L32.4349 34.1012C33.3405 33.1956 33.7485 32.0432 33.9435 30.593C34.1354 29.1657 34.1337 27.3344 34.1337 25H32.5337ZM7.46699 15C7.46699 12.6204 7.46869 10.9161 7.64292 9.62024C7.81405 8.34738 8.13833 7.58897 8.69714 7.03015L7.56577 5.89878C6.66012 6.80443 6.25217 7.95676 6.05718 9.40704C5.86529 10.8343 5.86699 12.6656 5.86699 15H7.46699ZM16.667 4.2C14.3326 4.2 12.5013 4.1983 11.074 4.39019C9.62375 4.58518 8.47142 4.99313 7.56577 5.89878L8.69714 7.03015C9.25596 6.47133 10.0144 6.14706 11.2872 5.97592C12.5831 5.8017 14.2874 5.8 16.667 5.8V4.2ZM23.367 5V10H24.967V5H23.367ZM28.3337 14.9667H33.3337V13.3667H28.3337V14.9667ZM23.367 10C23.367 10.7361 23.3631 11.221 23.4464 11.6397L25.0157 11.3276C24.9709 11.1023 24.967 10.8128 24.967 10H23.367ZM28.3337 13.3667C27.5209 13.3667 27.2313 13.3628 27.0061 13.318L26.694 14.8872C27.1127 14.9705 27.5976 14.9667 28.3337 14.9667V13.3667ZM23.4464 11.6397C23.7726 13.2794 25.0543 14.5611 26.694 14.8872L27.0061 13.318C26.0011 13.1181 25.2156 12.3325 25.0157 11.3276L23.4464 11.6397ZM11.667 22.4667H25.0003V20.8667H11.667V22.4667ZM11.667 27.4667H20.0003V25.8667H11.667V27.4667ZM32.2476 10.0741L29.2539 6.70608L28.058 7.76907L31.0518 11.1371L32.2476 10.0741Z" fill="#DB2777" />
                            </g>
                        </svg>
                    </div>
                    <div class="grid gap-2">
                        <h4 class="text-center text-white-900 text-sm font-medium leading-snug">将配置文件拖到此处，或手动选择文件</h4>
                    <div class="flex items-center justify-center gap-2">
                        <label>
                            <input type="file" id="ChooseFile" hidden />
                            <div class="flex w-28 h-9 px-2 flex-col bg-pink-600 rounded-full shadow text-white text-xs font-semibold leading-4 items-center justify-center cursor-pointer focus:outline-none">选择文件</div>
                        </label>
                        <button onclick="importConfigFromUrl()" class="flex w-28 h-9 px-2 flex-col bg-blue-600 rounded-full shadow text-white text-xs font-semibold leading-4 items-center justify-center cursor-pointer focus:outline-none">从URL导入</button>
                    </div>
                    </div>
                </div>
            </div>
        </div>`;

    // 添加模态框到页面
    document.body.appendChild(modal);

    // 添加事件监听器 - 关闭按钮
    document.getElementById('closeBoxModal').addEventListener('click', function () {
        document.body.removeChild(modal);
    });

    // 添加事件监听器 - 点击模态框外部关闭
    modal.addEventListener('click', function (e) {
        if (e.target === modal) {
            document.body.removeChild(modal);
        }
    });

    // 添加事件监听器 - 拖拽文件
    const dropZone = document.getElementById('dropZone');
    const fileInput = document.getElementById('ChooseFile');

    dropZone.addEventListener('dragover', (e) => {
        e.preventDefault();
        dropZone.classList.add('border-blue-500');
    });

    dropZone.addEventListener('dragleave', () => {
        dropZone.classList.remove('border-blue-500');
    });

    dropZone.addEventListener('drop', (e) => {
        e.preventDefault();
        fun(e.dataTransfer.files[0]);
    });

    fileInput.addEventListener('change', (e) => {
        fun(fileInput.files[0]);
    });
}
