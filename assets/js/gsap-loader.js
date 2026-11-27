(() => {
    'use strict';

    const source = document.currentScript.dataset.gsapSrc;
    let request;

    window.loadLufelGSAP = function () {
        if (!request) {
            request = new Promise(resolve => {
                const script = document.createElement('script');
                script.src = source;
                script.fetchPriority = 'low';
                script.onload = () => resolve(window.gsap || null);
                script.onerror = () => {
                    script.remove();
                    resolve(null);
                };
                document.head.append(script);
            });
        }
        return request;
    };
})();
