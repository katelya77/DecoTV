// 静态版本显示（不发起任何网络请求）
(function () {
    const VERSION = 'v0.2.0';

    function renderVersion() {
        const p = document.createElement('p');
        p.className = 'text-gray-500 text-sm mt-1 text-center md:text-left';
        
        const link = document.createElement('a');
        link.href = 'https://github.com/katelya77/DecoTV';
        link.target = '_blank';
        link.rel = 'noopener noreferrer';
        link.className = 'text-gray-500 hover:text-cyan-400 transition-colors duration-300';
        link.textContent = `版本: ${VERSION}`;
        
        p.appendChild(link);

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
