const User_ID = "4ef6b7b4-a42d-4856-b5fb-18c57ec6f107";
const base_api_url = "https://futdb.app/api/clubs";
let clubs = [];
let pageCurrent = 1;
const pageSize = 27; 

async function fetchClubs(page) {
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
        clubs = clubs.concat(data.items);
    })
    .catch(error => {
        console.error('There was a problem with fetching the data', error);
    });
}

async function fetchAllClubs() {
    const totalPages = Math.ceil(748 / pageSize); 
    for (let page = 1; page <= totalPages; page++) {
        await fetchClubs(page);
    }

    clubs.sort((a, b) => a.id - b.id);
    displayPage(1);
}

function displayPage(page) {
    const clubsContainer = document.getElementById('clubs');
    clubsContainer.innerHTML = '';

    const start = (page - 1) * pageSize;
    const end = start + pageSize;
    const currentClubs = clubs.slice(start, end);

    currentClubs.filter(club => club.id !== 60).forEach(club => {
        const img_url = `https://futdb.app/api/clubs/${club.id}/image`;

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
            clubsContainer.innerHTML += `
                <article>
                    <img src="${url}" alt="club logo" style="width: 150px; height: 150px;">
                    <p>${club.name}</p>
                </article>
            `;
        })
        .catch(error => {
            console.error(`There was a problem with fetching the image for club ${club.id}`, error);
            clubsContainer.innerHTML += `
                <article>
                    <p>${club.name} (Image not available)</p>
                </article>
            `;
        });
    });


    document.getElementById('current-page').textContent = pageCurrent;
    document.getElementById('prev-page').disabled = pageCurrent === 1;
    document.getElementById('next-page').disabled = pageCurrent === Math.ceil(clubs.length / pageSize);
}

function nextPage() {
    if (pageCurrent < Math.ceil(clubs.length / pageSize)) {
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

fetchAllClubs();
