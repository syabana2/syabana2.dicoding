let dbPromised = idb.open("pl-app", 1, function(upgradeDb) {
    let articleObjectStore = upgradeDb.createObjectStore("teams", {
        keyPath: "id"
    });
    articleObjectStore.createIndex("name", "name", {unique: false});
})

function saveForLater(team) {
    dbPromised
        .then(function(db) {
            let tx = db.transaction("teams", "readwrite");
            let store = tx.objectStore("teams");
            console.log(team);
            store.add(team);
            return tx.complete;
        })
        .then(function() {
            M.toast({ html: `${team.name} berhasil disimpan!` })
            console.log("Team berhasil disimpan!");

            let saved = document.getElementById("save");
            let deleted = document.getElementById("delete");
            let btnSave = document.getElementById(`button-save-${team.id}`);
            let btnDelete = document.getElementById(`button-delete-${team.id}`);

            const title = 'Football App Notifkasi'
            const options = {
                'body': `Team ${team.name}. \Sudah anda Masukan dalam Favorite.`,
                'icon': `../assets/images/${team.id}.svg`,
                'badge': '../assets/images/icon.png'
            }
            if (Notification.permission === 'granted') {
                navigator.serviceWorker.ready.then(function(registration) {
                    registration.showNotification(title, options);
                });
            } else {
                console.error('Fitur notifikasi tidak diijinkan!');
            }

            if (saved) {
                saved.classList.add("hide-button");
            }

            if (deleted) {
                deleted.classList.remove("hide-button");
            }

            if (btnSave) {
                btnSave.classList.add("hide-button");
            }

            if (btnDelete) {
                btnDelete.classList.remove("hide-button");
            }

        })
        .catch(err => {
            M.toast({ html: `${team.name} gagal disimpan!`, classes: 'warn' })
            console.error('Pertandingan gagal disimpan', err);
        });
}

function deleteTeam(team) {
    dbPromised
        .then(function(db) {
            let tx = db.transaction("teams", "readwrite");
            let store = tx.objectStore("teams");
            console.log(team)
            store.delete(team.id);
            return tx.complete;
        })
        .then(function() {
            M.toast({ html: `${team.name} berhasil didelete!` })
            console.log("Team berhasil didelete!");

            let saved = document.getElementById("save");
            let deleted = document.getElementById("delete");
            let btnSave = document.getElementById(`button-save-${team.id}`);
            let btnDelete = document.getElementById(`button-delete-${team.id}`);

            const title = 'Football App Notifkasi'
            const options = {
                'body': `Team ${team.name}. \Sudah anda Delete dalam Favorite.`,
                'icon': `../assets/images/${team.id}.svg`,
                'badge': '../assets/images/icon.png'
            }
            if (Notification.permission === 'granted') {
                navigator.serviceWorker.ready.then(function(registration) {
                    registration.showNotification(title, options);
                });
            } else {
                console.error('Fitur notifikasi tidak diijinkan!');
            }

            if (saved) {
                saved.classList.remove("hide-button");
            }

            if (deleted) {
                deleted.classList.add("hide-button");
            }

            if (btnSave) {
                btnSave.classList.remove("hide-button");
            }

            if (btnDelete) {
                btnDelete.classList.add("hide-button");
            }

        })
}

function checkTeam(team) {
    return new Promise(function(resolve, reject) {
        dbPromised
            .then(function(db) {
                let tx = db.transaction("teams", "readonly");
                let store = tx.objectStore("teams");

                return store.get(team.id);
            })
            .then(function(team) {

                if(team) {
                    console.log('Team ditemukan')

                    let saved = document.getElementById("save");
                    let deleted = document.getElementById("delete");

                    if (saved) {
                        saved.classList.add("hide-button");
                    }

                    if (deleted) {
                        deleted.classList.remove("hide-button");
                    }

                    let result = true
                    resolve(result)
                } else {
                    console.log('Team tidak ditemukan')

                    let saved = document.getElementById("save");
                    let deleted = document.getElementById("delete");

                    if (saved) {
                        saved.classList.remove("hide-button");
                    }

                    if (deleted) {
                        deleted.classList.add("hide-button");
                    }

                    let result = false
                    resolve(result)
                }
            })
    });
}

function saveForLaterId(id) {
    if (navigator.onLine) {
        getTeamByIdForSave(id)
    } else {
        M.toast({ html: `Can't save when offline`, classes: 'warn' })
    }
}

function deleteTeamId(id) {
    if(navigator.onLine) {
        getTeamByIdForDelete(id)
    } else {
        M.toast({ html: `Delete it in saved page when offline`, classes: 'warn' })
    }
}

function deleteTeamIdCache(id) {
    dbPromised
    .then(function(db) {
        let tx = db.transaction("teams", "readwrite");
        let store = tx.objectStore("teams");
        return store.delete(Number(id));
    })
    .then(function() {
        M.toast({ html: `Club berhasil didelete!` })
        console.log("Team berhasil didelete!");

        let cardId = document.getElementById(`card-${id}`)
        if (cardId) {
            cardId.classList.add('card-remove')
        }
    });
}

function getAll() {
    return new Promise(function(resolve, reject) {
        dbPromised
            .then(function(db) {
                let tx = db.transaction("teams", "readonly");
                let store = tx.objectStore("teams");
                return store.getAll();
            })
            .then(function(teams) {
                resolve(teams);
            })
    });
}

function getById(id) {
    return new Promise(function(resolve, reject) {
        dbPromised
            .then(function(db) {
                let tx = db.transaction("teams", "readonly");
                let store = tx.objectStore("teams");
                return store.get(Number(id));
            })
            .then(function(team) {
                resolve(team);
            });
    });
}