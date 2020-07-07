importScripts('https://storage.googleapis.com/workbox-cdn/releases/3.6.3/workbox-sw.js')

if (workbox) {
    console.log('Workbox berhasil dipasang');
} else {
    console.log('Workbox tidak didukung!');
}

workbox.precaching.precacheAndRoute([
    { url: "/", revision: "1"},
    { url: "/manifest.json", revision: "1"},
    { url: "/index.html", revision: "1"},
    { url: "/team_detail.html", revision: "1"},
    { url: "/nav.html", revision: "1"},
    { url: "/favicon.ico", revision: "1"},
    { url: "/build.js", revision: "1"},
    { url: "/js/nav.js", revision: "1"},
    { url: "/js/api.js", revision: "1"},
    { url: "/js/db.js", revision: "1"},
    { url: "/js/idb.js", revision: "1"},
    { url: "/js/script.js", revision: "1"},
    { url: "/js/team.js", revision: "1"}
], {
    ignoreUrlParametersMatching: [/.*/]
});

workbox.routing.registerRoute(
    new RegExp('/pages/'),
    workbox.strategies.staleWhileRevalidate({
        cacheName: 'cache-pages'
    })
);

workbox.routing.registerRoute(
    new RegExp('.(png|svg|jpg|jpeg)$'),
    workbox.strategies.cacheFirst({
        cacheName: 'cache-images',
        plugin: [
            new workbox.expiration.Plugin({
                maxAgeSeconds: 60 * 60 * 24 * 7,
                maxEntries: 60,
                purgeOnQuotaError: true
            })
        ]
    })
);

workbox.routing.registerRoute(
    new RegExp('https://api.football-data.org/v2/'),
    workbox.strategies.staleWhileRevalidate({
        cacheName: 'cache-fetch-url',
        cacheExpiration: {
            maxAgeSeconds: 60 * 60
        }
    })
)

self.addEventListener('push', function(event) {
    let body;
    if(event.data) {
        body = event.data.text();
    } else {
        body = 'Push message no payload!';
    }

    let options = {
        body: body,
        icon: '/assets/images/icon.png',
        vibrate: [100, 50, 100],
        data: {
            dateOfArrival: Date.now(),
            primaryKey: 1
        }
    };

    event.waitUntil(
        self.registration.showNotification('Push Notification', options)
    );
});