// REGISTER SERVICE WORKER
if ("serviceWorker" in navigator) {
    window.addEventListener("load", function() {
        navigator.serviceWorker
            .register("/service-worker.js")
            .then(function() {
                console.log("Pendaftaran service worker berhasil");
                setTimeout(function() {
                    requestPermission();
                }, 2000)
            })
            .catch(function() {
                console.log("Pendaftaran service worker gagal");
            });
    })
} else {
    console.log("Service worker belum didukung di browser ini.")
}

// REQUEST UNTUK PERTAMA KALI
document.addEventListener("DOMContentLoaded", function() {
    let urlParams = window.location.href;
    if (urlParams == 'http://localhost:8887/') {
        getStandings();
    }
})

function requestPermission() {

    if (navigator.onLine) {
        const firebaseConfig = {
            apiKey: "AIzaSyC6LiWp0_apeH9XCP7nVJ5hrKpYTRX-yws",
            authDomain: "push-notification---football.firebaseapp.com",
            databaseURL: "https://push-notification---football.firebaseio.com",
            projectId: "push-notification---football",
            storageBucket: "push-notification---football.appspot.com",
            messagingSenderId: "1043660361020",
            appId: "1:1043660361020:web:24062cf193e878aab8a239"
        };
          // Initialize Firebase
        firebase.initializeApp(firebaseConfig);
    }

    if('Notification' in window) {
        Notification.requestPermission().then(function(result) {
            if(result === 'denied') {
                console.log("Fitur notifikasi tidak diijinkan!");
                return;
            } else if(result === 'default') {
                console.log("Pengguna menutup kotak dialog permintaan.")
                return;
            }

            if(("PushManager" in window)) {
                navigator.serviceWorker.getRegistration().then(function(registration) {
                    registration.pushManager.subscribe({
                        userVisibleOnly: true,
                        applicationServerKey: urlBase64ToUnit8Array("BBWGP2kLkrie8YNnJFVcBYrN_R-YTx9Mg7IrRWMMQgWL41xtPaAFAaF5yxSj__TPqv04sCecF_8nnuzEHcVUgq4")
                    }).then(function(subscribe) {
                            console.log('Berhasil melakukan subscribe dengan endpoint: ', subscribe.endpoint);
                            console.log('Berhasil melakukan subscribe dengan p256dh key: ', btoa(String.fromCharCode.apply(
                                null, new Uint8Array(subscribe.getKey('p256dh')))));
                            console.log('Berhasil melakukan subscribe dengan auth key: ', btoa(String.fromCharCode.apply(
                                null, new Uint8Array(subscribe.getKey('auth')))));
                            if (navigator.onLine) {
                                firebase.database().ref("key-FCM").set({
                                    endpoint: subscribe.endpoint,
                                    p256dh: btoa(String.fromCharCode.apply(null, new Uint8Array(subscribe.getKey('p256dh')))),
                                    auth: btoa(String.fromCharCode.apply(null, new Uint8Array(subscribe.getKey('auth'))))
                                })
                            }
                        }).catch(function(e) {
                            console.error('Tidak dapat melakukan subscribe ', e.message);
                        });
                })
            }
        });
    }
}

function urlBase64ToUnit8Array(base64String) {
    const padding = '='.repeat((4 - base64String.length % 4) % 4);
    const base64 = (base64String + padding)
        .replace(/-/g, '+')
        .replace(/_/g, '/');
    const rawData = window.atob(base64);
    const outputArray = new Uint8Array(rawData.length);
    for(let i = 0; i < rawData.length; ++i) {
        outputArray[i] = rawData.charCodeAt(i);
    }

    return outputArray;
}