const User_ID = "4ef6b7b4-a42d-4856-b5fb-18c57ec6f107";
const base_api_url = "https://futdb.app/api/leagues";
let leagues = [];
let pageCurrent = 1;
const pageSize = 18; // number of leagues per page

async function fetchLeagues(page) {
    return fetch(`${base_api_url}?page=${page}`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'X-Auth-Token': User_ID
        },
    })
    .then(response => {
        if (!response.ok) {
            throw new Error(response.statusText);
        }
        return response.json();
    })
    .then(data => {
        leagues = leagues.concat(data.items);
    })
    .catch(error => {
        console.error('There was a problem with fetching the data', error);
    });
}

async function fetchAllLeagues() {
    const totalPages = Math.ceil(27 / pageSize); 
    for (let page = 1; page <= totalPages; page++) {
        await fetchLeagues(page);
    }

    leagues.sort((a, b) => a.id - b.id);
    displayPage(1);
}

function displayPage(page) {
    const leaguesContainer = document.getElementById('leagues');
    leaguesContainer.innerHTML = '';

    const start = (page - 1) * pageSize;
    const end = start + pageSize;
    const currentLeagues = leagues.slice(start, end);

    currentLeagues.filter(league => !league.name.includes('WC')).filter(league => league.id !== 2179).forEach(league => {
        const img_url = `https://futdb.app/api/leagues/${league.id}/image`;

        fetch(img_url, {
            method: 'GET',
            headers: {
                'accept': 'image/png',
                'X-AUTH-TOKEN': User_ID
            }
        })
        .then(response => {
            if (!response.ok) {
                throw new Error(response.statusText);
            }
            return response.blob();
        })
        .then(blob => {
            const url = URL.createObjectURL(blob);
            leaguesContainer.innerHTML += `
                <article>
                    <img src="${url}" alt="league logo" style="width: 150px; height: 150px;">
                    <p>${league.name}</p>
                </article>
            `;
        })
        .catch(error => {
            console.error(`There was a problem with fetching the image for league ${league.id}`, error);
            leaguesContainer.innerHTML += `
                <article>
                    <p>${league.name} (Image not available)</p>
                </article>
            `;
        });
    });


    document.getElementById('current-page').textContent = pageCurrent;
    document.getElementById('prev-page').disabled = pageCurrent === 1;
    document.getElementById('next-page').disabled = pageCurrent === Math.ceil(leagues.length / pageSize);
}

function nextPage() {
    if (pageCurrent < Math.ceil(leagues.length / pageSize)) {
        pageCurrent++;
        displayPage(pageCurrent);
    }
}

function prevPage() {
    if (pageCurrent > 1) {
        pageCurrent--;
        displayPage(pageCurrent);
    }
}

document.getElementById('next-page').addEventListener('click', nextPage);
document.getElementById('prev-page').addEventListener('click', prevPage);

fetchAllLeagues();
