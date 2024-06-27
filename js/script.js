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
const api_url = "https://futdb.app/api/leagues";
const data = {};

fetch(`https://futdb.app/api/leagues/${league.id}/image`, {
    method: 'GET',
    headers: {
        'accept': 'image/png',
        'X-AUTH-TOKEN': User_ID
    }
})


fetch(api_url, {
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
    console.log(data.items);
    const leagues = document.getElementById('leagues');
    data.items.forEach(league => {
        const imageUrl = `https://futdb.app/api/leagues/${league.id}/image`;
        leagues.innerHTML += `
            <article>
                <img src="${imageUrl}" alt="${league.name}" />
                <p>${league.name}</p>
            </article>
        `;
    });
})
.catch(error => {
    console.error(`There was a problem with fetching the data` ,error);
});