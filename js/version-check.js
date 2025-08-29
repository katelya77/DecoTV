// 静态版本显示（不发起任何网络请求）
(function () {
    const VERSION = 'v0.1.0';

    function renderVersion() {
        const p = document.createElement('p');
        p.className = 'text-gray-500 text-sm mt-1 text-center md:text-left';
        p.textContent = `版本: ${VERSION}`;

        const footerText = document.querySelector('.footer p.text-gray-500.text-sm');
        if (footerText && footerText.parentElement) {
            footerText.parentElement.appendChild(p);
            return;
        }
        const footer = document.querySelector('.footer .container');
        if (footer) footer.appendChild(p);
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', renderVersion);
    } else {
        renderVersion();
    }
})();
