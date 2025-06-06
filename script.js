const navToggle = document.querySelector('.nav-toggle');
const navList = document.querySelector('#main-nav ul');

navToggle.addEventListener('click', () => {
    navList.classList.toggle('open');
});

// close mobile nav after clicking a link
document.querySelectorAll('#main-nav a').forEach(link => {
    link.addEventListener('click', () => {
        if (navList.classList.contains('open')) {
            navList.classList.remove('open');
        }
    });
});

