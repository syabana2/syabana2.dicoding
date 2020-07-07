// REGISTER SERVICE WORKER
if ("serviceWorker" in navigator) {
    window.addEventListener("load", function() {
        navigator.serviceWorker
            .register("/service-worker.js")
            .then(function() {
                console.log("Pendaftaran service worker berhasil");
            })
            .catch(function() {
                console.log("Pendaftaran service worker gagal");
            });
    })
} else {
    console.log("Service worker belum didukung di browser ini.")
}

document.addEventListener("DOMContentLoaded", function() {
    let urlParams = new URLSearchParams(window.location.search);
    let isFromSaved = urlParams.get("saved");

    let btnSave = document.getElementById("save");
    let btnDelete = document.getElementById("delete");

    let url1 = document.getElementById("link-back-1");
    let url2 = document.getElementById("link-back-2");

    if (isFromSaved) {
        // Hide fab jika dimuat dari index db
        btnSave.style.display = 'none';
        url1.href="./index.html#saved";
        url2.href="./index.html#saved";

        // ambil artikel lalu tampilkan
        getSavedTeamById();

        } else {
            let item = getTeamById();

            item.then(function(team) {
                checkTeam(team);
            })

            btnSave.onclick = function() {
                console.log("save ditekan!");
                item.then(function(team) {
                    saveForLater(team);
                })
            }

            btnDelete.onclick = function() {
                console.log("delete ditekan!");
                item.then(function(team) {
                    deleteTeam(team);
                })
            }
    }
});