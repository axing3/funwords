const CACHE_NAME = 'funwords-v1.0.0';
const urlsToCache = [
    '/',
    '/index.html',
    '/game.html',
    '/results.html',
    '/practice.html',
    '/settings.html',
    '/audio-test.html',
    '/static-test.html',
    '/direct-test.html',
    '/manifest.json',
    'https://fonts.googleapis.com/css2?family=Press+Start+2P&display=swap'
];

// 安装Service Worker
self.addEventListener('install', event => {
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then(cache => {
                console.log('Opened cache');
                return cache.addAll(urlsToCache);
            })
    );
});

// 激活Service Worker
self.addEventListener('activate', event => {
    event.waitUntil(
        caches.keys().then(cacheNames => {
            return Promise.all(
                cacheNames.map(cacheName => {
                    if (cacheName !== CACHE_NAME) {
                        console.log('Deleting old cache:', cacheName);
                        return caches.delete(cacheName);
                    }
                })
            );
        })
    );
});

// 拦截网络请求
self.addEventListener('fetch', event => {
    event.respondWith(
        caches.match(event.request)
            .then(response => {
                // 如果在缓存中找到响应，则返回缓存的响应
                if (response) {
                    console.log('Found in cache:', event.request.url);
                    return response;
                }
                
                // 否则发起网络请求
                console.log('Not found in cache, fetching:', event.request.url);
                return fetch(event.request).then(
                    response => {
                        // 检查是否是有效的响应
                        if (!response || response.status !== 200 || response.type !== 'basic') {
                            return response;
                        }
                        
                        // 克隆响应，因为响应流只能使用一次
                        const responseToCache = response.clone();
                        
                        // 将新请求添加到缓存
                        caches.open(CACHE_NAME)
                            .then(cache => {
                                cache.put(event.request, responseToCache);
                            });
                        
                        return response;
                    }
                );
            })
    );
});

// 处理消息
self.addEventListener('message', event => {
    if (event.data && event.data.type === 'SKIP_WAITING') {
        self.skipWaiting();
    }
});