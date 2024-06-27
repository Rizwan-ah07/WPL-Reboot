// Hamburger menu
document.addEventListener('DOMContentLoaded', function () {
    var hamburger = document.getElementById('hamburger');
    var navMenu = document.getElementById('nav-menu');

    hamburger.addEventListener('click', function () {
        // Check if the menu is open
        if (navMenu.style.width == '350px') {
            navMenu.style.width = '0';
        } else {
            navMenu.style.width = '350px';
        }
    });
});

const User_ID = "4ef6b7b4-a42d-4856-b5fb-18c57ec6f107";
const base_api_url = "https://futdb.app/api/leagues";
let leagues = [];
let pageCurrent = 1;
const pageTotal = 4; // total number of pages

function fetchLeagues(page) {
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
    for (let page = 1; page <= pageTotal; page++) {
        await fetchLeagues(page);
    }

    const leaguesContainer = document.getElementById('leagues');
    leagues.filter(league => !league.name.includes('WC')).filter(league => league.id !== 2179).forEach(league => {
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
}

fetchAllLeagues();
