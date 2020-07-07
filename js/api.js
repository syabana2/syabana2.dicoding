let base_url = "https://api.football-data.org/";

// Blok kode yang akan di panggil jika fetch berhasil
function status(response) {
    if (response.status !== 200) {
        console.log("Error : " + response.status);
        // Method reject() akan membuat blok catch terpanggil
        return Promise.reject(new Error(response.statusText));
    } else {
        // Mengubah suatu objek agar bisa "di-then-kan"
        return Promise.resolve(response);
    }
}

// Blok kode untuk memparsing json menjadi array di Javascript
function json(response) {
    return response.json();
}

// Blok kode yang menghandle kesalahan dari blok catch
function error(error) {
    // Parameter error berasal dari Promise.reject()
    console.log("Error: " + error);
}

// Blok kode untuk melakukan request data json
function getStandings() {
    if('caches' in window) {
        caches.match(`${base_url}v2/competitions/2021/standings`).then(function(response) {
            if(response) {
                response.json().then(function(data) {
                    let season_date = data.season.startDate.substr(0,4);
                    let update = data.competition.lastUpdated.match(/^.*?(?=T)/g)
                    let season = `
                            Season : ${season_date} <br>
                            LastUpdate : ${update}
                    `;

                    let standingsHtml = "";
                    data.standings[0].table.forEach(function(standing) {
                        standingsHtml += `
                            <tr>
                                <td class="center">${standing.position}</td>
                                <td class="center"><a href="team_detail.html?id=${standing.team.id}"><img src="${standing.team.crestUrl}" alt="Logo Club" class="logo-club"></a></td>
                                <td class="mob-hidden">${standing.team.name}</td>
                                <td>${standing.playedGames}</td>
                                <td>${standing.won}</td>
                                <td>${standing.draw}</td>
                                <td>${standing.lost}</td>
                                <td class="mob-hidden">${standing.goalsFor}</td>
                                <td class="mob-hidden">${standing.goalsAgainst}</td>
                                <td class="mob-hidden">${standing.goalDifference}</td>
                                <td>${standing.points}</td>
                            </tr>
                        `;
                    });
                    // Sisipkan komponen card ke dalam elemen dengan id #content
                    document.getElementById("standings-content").innerHTML = standingsHtml;
                    document.getElementById("season").innerHTML = season;
                })
            }
        })
    }

    fetch(`${base_url}v2/competitions/2021/standings`,
    {
        method: 'GET',
        headers: {
            'X-Auth-Token': '33328562a25842bda176e048371c1d8a'
        }
    })
        .then(status)
        .then(json)
        .then(function(data) {
            console.log(data)
            let season_date = data.season.startDate.substr(0,4);
            let update = data.competition.lastUpdated.match(/^.*?(?=T)/g)
            let season = `
                    Season : ${season_date} <br>
                    LastUpdate : ${update}
            `;

            let standingsHtml = "";
            data.standings[0].table.forEach(function(standing) {
                standingsHtml += `
                    <tr class="position">
                        <td class="center">${standing.position}</td>
                        <td class="center"><a href="team_detail.html?id=${standing.team.id}"><img src="${standing.team.crestUrl}" alt="Logo Club" class="logo-club"></a></td>
                        <td class="mob-hidden">${standing.team.name}</td>
                        <td>${standing.playedGames}</td>
                        <td>${standing.won}</td>
                        <td>${standing.draw}</td>
                        <td>${standing.lost}</td>
                        <td class="mob-hidden">${standing.goalsFor}</td>
                        <td class="mob-hidden">${standing.goalsAgainst}</td>
                        <td class="mob-hidden">${standing.goalDifference}</td>
                        <td>${standing.points}</td>
                    </tr>
                `;
            });
             // Sisipkan komponen card ke dalam elemen dengan id #content
            document.getElementById("standings-content").innerHTML = standingsHtml;
            document.getElementById("season").innerHTML = season;
        })
}

function getTeams() {
    if('caches' in window) {
        caches.match(`${base_url}v2/competitions/2021/teams`).then(function(response) {
            if(response) {
                response.json().then(function(data) {
                    let teamsHtml = "";
                    let count = 1;
                    data.teams.forEach(function(team) {
                        let check = checkTeam(team)
                        check.then(function(result) {
                            if (result === true) {
                                teamsHtml += `
                                    <div class="card-team">
                                        <a href="./team_detail.html?id=${team.id}">
                                            <div class="card-team-image">
                                                <img src="${team.crestUrl}" alt="Logo Club">
                                            </div>
                                        </a>
                                        <div class="container-team">
                                            <p><b>${team.name}</b></p>
                                        </div>
                                        <button class="button-delete" id="button-delete-${team.id}" onclick="deleteTeamId(${team.id})">- Delete</button>
                                        <button class="button-save hide-button" id="button-save-${team.id}" onclick="saveForLaterId(${team.id})">+ Save</button>
                                    </div>
                                `;

                            } else {
                                teamsHtml += `
                                    <div class="card-team">
                                        <a href="./team_detail.html?id=${team.id}">
                                            <div class="card-team-image">
                                                <img src="${team.crestUrl}" alt="Logo Club">
                                            </div>
                                        </a>
                                        <div class="container-team">
                                            <p><b>${team.name}</b></p>
                                        </div>
                                        <button class="button-delete hide-button" id="button-delete-${team.id}" onclick="deleteTeamId(${team.id})">- Delete</button>
                                        <button class="button-save" id="button-save-${team.id}" onclick="saveForLaterId(${team.id})">+ Save</button>
                                    </div>
                                    `;

                                // Sisipkan komponen card ke dalam elemen dengan id #content
                            }

                            if (count == data.count) {
                                document.getElementById("team-content").innerHTML += teamsHtml;
                            }

                            count = count + 1;
                        })
                    });
                })
            }
        })
    }

    fetch(`${base_url}v2/competitions/2021/teams`,
    {
        method: 'GET',
        headers: {
            'X-Auth-Token': '33328562a25842bda176e048371c1d8a'
        }
    })
        .then(status)
        .then(json)
        .then(function(data) {
            let teamsHtml = "";
            let count = 1;
            data.teams.forEach(function(team) {
                let check = checkTeam(team)
                check.then(function(result) {
                    if (result === true) {
                        teamsHtml += `
                            <div class="card-team">
                                <a href="./team_detail.html?id=${team.id}">
                                    <div class="card-team-image">
                                        <img src="${team.crestUrl}" alt="Logo Club">
                                    </div>
                                </a>
                                <div class="container-team">
                                    <p><b>${team.name}</b></p>
                                </div>
                                <button class="button-delete" id="button-delete-${team.id}" onclick="deleteTeamId(${team.id})">- Delete</button>
                                <button class="button-save hide-button" id="button-save-${team.id}" onclick="saveForLaterId(${team.id})">+ Save</button>
                            </div>
                        `;

                    } else {
                        teamsHtml += `
                            <div class="card-team">
                                <a href="./team_detail.html?id=${team.id}">
                                    <div class="card-team-image">
                                        <img src="${team.crestUrl}" alt="Logo Club">
                                    </div>
                                </a>
                                <div class="container-team">
                                    <p><b>${team.name}</b></p>
                                </div>
                                <button class="button-delete hide-button" id="button-delete-${team.id}" onclick="deleteTeamId(${team.id})">- Delete</button>
                                <button class="button-save" id="button-save-${team.id}" onclick="saveForLaterId(${team.id})">+ Save</button>
                            </div>
                            `;

                        // Sisipkan komponen card ke dalam elemen dengan id #content
                    }

                    if (count == data.count) {
                        document.getElementById("team-content").innerHTML += teamsHtml;
                    }

                    count = count + 1;
                })
            });
        })
}

function getMatches() {
    if('caches' in window) {
        caches.match(`${base_url}v2/competitions/2021/matches?matchday=30`).then(function(response) {
            if(response) {
                response.json().then(function(data) {
                    let matchesHtml = "";
                    data.matches.forEach(function(matches) {
                        let utcDate = matches.utcDate.match(/^.*?(?=T)/g)
                        matchesHtml += `
                            <div class="card-matches">
                                <table>
                                    <tbody>
                                        <tr>
                                            <td><img src="../assets/images/${matches.awayTeam.id}.svg"></td>
                                            <td class="mob-hidden">${matches.awayTeam.name}</td>
                                            <td>${matches.score.fullTime.awayTeam}</td>
                                            <td class="b-left">|</td>
                                            <td><b>FT</b></td>
                                        </tr>
                                        <tr>
                                            <td><img src="../assets/images/${matches.homeTeam.id}.svg"></td>
                                            <td class="mob-hidden">${matches.homeTeam.name}</td>
                                            <td>${matches.score.fullTime.homeTeam}</td>
                                            <td class="b-left">|</td>
                                            <td>${utcDate}</td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>
                        `;
                    });
                    // Sisipkan komponen card ke dalam elemen dengan id #content
                    document.getElementById("matches-content").innerHTML = matchesHtml;
                })
            }
        })
    }

    fetch(`${base_url}v2/competitions/2021/matches?matchday=30`,
    {
        method: 'GET',
        headers: {
            'X-Auth-Token': '33328562a25842bda176e048371c1d8a'
        }
    })
        .then(status)
        .then(json)
        .then(function(data) {
            console.log(data)
            let matchesHtml = "";
            data.matches.forEach(function(matches) {
                let utcDate = matches.utcDate.match(/^.*?(?=T)/g)
                matchesHtml += `
                    <div class="card-matches">
                        <table>
                            <tbody>
                                <tr>
                                    <td><img src="../assets/images/${matches.awayTeam.id}.svg"></td>
                                    <td class="mob-hidden">${matches.awayTeam.name}</td>
                                    <td>${matches.score.fullTime.awayTeam}</td>
                                    <td class="b-left">|</td>
                                    <td><b>FT</b></td>
                                </tr>
                                <tr>
                                    <td><img src="../assets/images/${matches.homeTeam.id}.svg"></td>
                                    <td class="mob-hidden">${matches.homeTeam.name}</td>
                                    <td>${matches.score.fullTime.homeTeam}</td>
                                    <td class="b-left">|</td>
                                    <td>${utcDate}</td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                `;
            });
             // Sisipkan komponen card ke dalam elemen dengan id #content
            document.getElementById("matches-content").innerHTML = matchesHtml;
        })
}

function getTeamById() {
    return new Promise(function(resolve, reject) {
        // Ambil nilai query parameter (?id=)
        let urlParams = new URLSearchParams(window.location.search);
        let idParam = urlParams.get("id");

        if ("caches" in window) {
            caches.match(`${base_url}v2/teams/${idParam}`).then(function(response) {
                if (response) {
                    response.json().then(function(data) {
                        // Objek JS dari response.json() masuk lewat variable data
                        console.log(data);
                        // Menyusun komponen card artikel secara dinamis
                        let teamHtml = `
                                <div class="card-image waves-effect waves-block waves-light">
                                    <img src="${data.crestUrl}" alt="Cover" />
                                </div>
                                <div class="card-content team-detail">
                                    <h5>Information</h5>
                                    <table>
                                        <tbody>
                                            <tr>
                                                <td>Name</td>
                                                <td>: ${data.name}</td>
                                            </tr>
                                            <tr>
                                                <td>Website</td>
                                                <td>: ${data.website}</td>
                                            </tr>
                                            <tr>
                                                <td>Address</td>
                                                <td>: ${data.address}</td>
                                            </tr>
                                            <tr>
                                                <td>Email</td>
                                                <td>: ${data.email}</td>
                                            </tr>
                                        </tbody>
                                    </table>
                                    <h5>Squads</h5>
                                    <table>
                                        <thead>
                                            <th>#</th>
                                            <th>Name</th>
                                            <th>Pos</th>
                                            <th>Nat</th>
                                        </thead>
                                        <tbody id="squads">

                                        </tbody>
                                    </table>
                                </div>
                        `;

                        document.getElementById('body-content').innerHTML = teamHtml;

                        let squadHtml = '';
                        data.squad.forEach(function(squad) {
                            squadHtml += `
                                <tr>
                                    <td>${squad.shirtNumber}</td>
                                    <td>${squad.name}</td>
                                    <td>${squad.position}</td>
                                    <td>${squad.nationality}</td>
                                </tr>
                            `;
                        })

                        document.getElementById('squads').innerHTML = squadHtml;
                        // Kirim objek data hasil parsing json agar bisa disimpan ke indexed db
                        resolve(data)
                    });
                }
            });
        }

        fetch(`${base_url}v2/teams/${idParam}`, {
            method: 'GET',
            headers: {
                'X-Auth-Token': '33328562a25842bda176e048371c1d8a'
            }
        })
            .then(status)
            .then(json)
            .then(function(data) {
                // Objek JS dari response.json() masuk lewat variable data
                console.log(data);
                // Menyusun komponen card artikel secara dinamis
                let teamHtml = `
                        <div class="card-image waves-effect waves-block waves-light">
                            <img src="${data.crestUrl}" alt="Cover" />
                        </div>
                        <div class="card-content team-detail">
                            <h5>Information</h5>
                            <table>
                                <tbody>
                                    <tr>
                                        <td>Name</td>
                                        <td>: ${data.name}</td>
                                    </tr>
                                    <tr>
                                        <td>Website</td>
                                        <td>: ${data.website}</td>
                                    </tr>
                                    <tr>
                                        <td>Address</td>
                                        <td>: ${data.address}</td>
                                    </tr>
                                    <tr>
                                        <td>Email</td>
                                        <td>: ${data.email}</td>
                                    </tr>
                                </tbody>
                            </table>
                            <h5>Squads</h5>
                            <table>
                                <thead>
                                    <th>#</th>
                                    <th>Name</th>
                                    <th>Pos</th>
                                    <th>Nat</th>
                                </thead>
                                <tbody id="squads">

                                </tbody>
                            </table>
                        </div>
                `;

                document.getElementById('body-content').innerHTML = teamHtml;

                let squadHtml = '';
                data.squad.forEach(function(squad) {
                    squadHtml += `
                        <tr>
                            <td>${squad.shirtNumber}</td>
                            <td>${squad.name}</td>
                            <td>${squad.position}</td>
                            <td>${squad.nationality}</td>
                        </tr>
                    `;
                })

                document.getElementById('squads').innerHTML = squadHtml;
                // Sisipkan komponen card ke dalam elemen dengan id #content
                // kirim objek hasil parsing json agar bisa disimpan ke index db
                resolve(data);
            });
    });
}

async function getTeamByIdForSave(id) {
    fetch(`${base_url}/v2/teams/${id}`,
    {
        method: 'GET',
        headers: {
            'X-Auth-Token': '33328562a25842bda176e048371c1d8a'
        }
    })
        .then(status)
        .then(json)
        .then(function(team){
            saveForLater(team)
        })
}

async function getTeamByIdForDelete(id) {
    fetch(`${base_url}/v2/teams/${id}`,
    {
        method: 'GET',
        headers: {
            'X-Auth-Token': '33328562a25842bda176e048371c1d8a'
        }
    })
        .then(status)
        .then(json)
        .then(function(team){
            deleteTeam(team)
        })
}

function getSavedTeams() {
    getAll().then(function(teams) {
        console.log(teams);
        // Menyusun komponen card article secara dinamis
        let articleHTML =  "";
        teams.forEach(function(team) {
            articleHTML += `
                <div class="card-team" id="card-${team.id}">
                    <a href="./team_detail.html?id=${team.id}&saved=true">
                        <div class="card-team-image">
                            <img src="${team.crestUrl}" alt="Logo Club">
                        </div>
                    </a>
                    <div class="container-team">
                        <p><b>${team.name}</b></p>
                    </div>
                    <button class="button-delete" id="button-delete-${team.id}" onclick="deleteTeamIdCache(${team.id})">- Delete</button>
                </div>
            `;
        });
        if(!articleHTML) {
            // Sisipkan komponen card ke dalam elemen dengan id #body-content
            document.getElementById("saved-content").innerHTML = `<p style="text-align:center;color:grey;">Belum menambahkan Data</p>`;
        } else {
            // Sisipkan komponen card ke dalam elemen dengan id #body-content
            document.getElementById("saved-content").innerHTML = articleHTML;
        }
    })
}

function getSavedTeamById() {
    let urlParams = new URLSearchParams(window.location.search);
    let id = urlParams.get("id");

    getById(id).then(function(team) {
        console.log(team)
        let teamHtml = `
            <div class="card-image waves-effect waves-block waves-light">
                <img src="${team.crestUrl}" alt="Cover" />
            </div>
            <div class="card-content team-detail">
                <h5>Information</h5>
                <table>
                    <tbody>
                        <tr>
                            <td>Name</td>
                            <td>: ${team.name}</td>
                        </tr>
                        <tr>
                            <td>Website</td>
                            <td>: ${team.website}</td>
                        </tr>
                        <tr>
                            <td>Address</td>
                            <td>: ${team.address}</td>
                        </tr>
                        <tr>
                            <td>Email</td>
                            <td>: ${team.email}</td>
                        </tr>
                    </tbody>
                </table>
                <h5>Squads</h5>
                <table>
                    <thead>
                        <th>#</th>
                        <th>Name</th>
                        <th>Pos</th>
                        <th>Nat</th>
                    </thead>
                    <tbody id="squads">

                    </tbody>
                </table>
            </div>
        `;

        document.getElementById('body-content').innerHTML = teamHtml;

        let squadHtml = '';
        team.squad.forEach(function(squad) {
            squadHtml += `
                <tr>
                    <td>${squad.shirtNumber}</td>
                    <td>${squad.name}</td>
                    <td>${squad.position}</td>
                    <td>${squad.nationality}</td>
                </tr>
            `;
        })

        // Sisipkan komponen card ke dalam elemen dengan id #content
        document.getElementById('squads').innerHTML = squadHtml;
    })
}
