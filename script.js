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

const sections = document.querySelectorAll('main section');
const navLinks = document.querySelectorAll('#main-nav a');

const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            const id = entry.target.getAttribute('id');
            navLinks.forEach(link => {
                if (link.getAttribute('href').includes(id)) {
                    link.classList.add('active');
                } else {
                    link.classList.remove('active');
                }
            });
            entry.target.classList.add('visible');
        }
    });
}, { threshold: 0.5 });

sections.forEach(sec => {
    if (sec.classList.contains('fade-in')) {
        sec.classList.add('fade-in');
    }
    observer.observe(sec);
});

