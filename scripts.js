const webview = document.getElementById('webview');
const urlInput = document.getElementById('url');
const bookmarkList = document.getElementById('bookmark-list');
const historyList = document.getElementById('history-list');
const downloadList = document.getElementById('download-list');
const homePageInput = document.getElementById('home-page-url');
const userAgentInput = document.getElementById('user-agent');
const downloadPathInput = document.getElementById('download-path');
const settingsModal = document.getElementById('settings-modal');

let homePage = localStorage.getItem('homePage') || 'https://www.example.com';
let userAgent = localStorage.getItem('userAgent') || navigator.userAgent;
let downloadPath = localStorage.getItem('downloadPath') || 'C:/Downloads';
let incognitoMode = false;

function navigate() {
    let url = urlInput.value;
    if (!url.startsWith('http://') && !url.startsWith('https://') && !url.includes('.')) {
        url = `https://www.google.com/search?q=${url}`;
    } else if (!url.startsWith('http://') && !url.startsWith('https://')) {
        url = `http://${url}`;
    }
    webview.src = url;
}

function reloadPage() {
    webview.contentWindow.location.reload();
}

function stopLoading() {
    webview.contentWindow.stop();
}

function goBack() {
    webview.contentWindow.history.back();
}

function goForward() {
    webview.contentWindow.history.forward();
}

function goHome() {
    webview.src = homePage;
}

function addBookmark() {
    const url = webview.contentWindow.location.href;
    const listItem = createBookmarkItem(url);
    bookmarkList.appendChild(listItem);
    saveBookmark(url);
}

function addToHistory(url) {
    if (!incognitoMode) {
        const listItem = createHistoryItem(url);
        historyList.appendChild(listItem);
    }
}

function formatURL(url) {
    return url.startsWith('http://') || url.startsWith('https://') ? url : `http://${url}`;
}

function openSettings() {
    homePageInput.value = homePage;
    userAgentInput.value = userAgent;
    downloadPathInput.value = downloadPath;
    settingsModal.style.display = 'block';
}

function closeSettings() {
    settingsModal.style.display = 'none';
}

function saveHomePage() {
    homePage = homePageInput.value;
    localStorage.setItem('homePage', homePage);
    closeSettings();
}

function saveUserAgent() {
    userAgent = userAgentInput.value;
    localStorage.setItem('userAgent', userAgent);
    closeSettings();
}

function saveDownloadPath() {
    downloadPath = downloadPathInput.value;
    localStorage.setItem('downloadPath', downloadPath);
    closeSettings();
}

function clearHistory() {
    historyList.innerHTML = '';
}

function clearBookmarks() {
    bookmarkList.innerHTML = '';
    localStorage.removeItem('bookmarks');
}

function saveBookmark(url) {
    let bookmarks = JSON.parse(localStorage.getItem('bookmarks')) || [];
    bookmarks.push(url);
    localStorage.setItem('bookmarks', JSON.stringify(bookmarks));
}

function loadBookmarks() {
    let bookmarks = JSON.parse(localStorage.getItem('bookmarks')) || [];
    bookmarks.forEach(url => {
        const listItem = createBookmarkItem(url);
        bookmarkList.appendChild(listItem);
    });
}

function createBookmarkItem(url) {
    const listItem = document.createElement('li');
    const link = document.createElement('a');
    link.href = url;
    link.innerText = url;
    link.onclick = (event) => {
        event.preventDefault();
        webview.src = url;
    };
    listItem.appendChild(link);
    return listItem;
}

function createHistoryItem(url) {
    const listItem = document.createElement('li');
    const link = document.createElement('a');
    link.href = url;
    link.innerText = url;
    link.onclick = (event) => {
        event.preventDefault();
        webview.src = url;
    };
    listItem.appendChild(link);
    return listItem;
}

function toggleIncognito() {
    incognitoMode = !incognitoMode;
    if (incognitoMode) {
        webview.src = 'about:blank';
        historyList.innerHTML = '';
    } else {
        loadHistory();
    }
}

function downloadFile(url) {
    const listItem = document.createElement('li');
    const link = document.createElement('a');
    link.href = url;
    link.innerText = `Download: ${url}`;
    link.download = '';
    listItem.appendChild(link);
    downloadList.appendChild(listItem);
    alert(`File will be saved to: ${downloadPath}`);
}

webview.addEventListener('load', () => {
    urlInput.value = webview.contentWindow.location.href;
    addToHistory(webview.contentWindow.location.href);
});

// Load initial bookmarks
loadBookmarks();

// Close settings modal when clicking outside of it
window.onclick = (event) => {
    if (event.target === settingsModal) {
        closeSettings();
    }
};
