/**
 * Dynamic Content Loader for Gino Colombi's DJ Website
 * Handles fetching and rendering releases from JSON data
 */

class DynamicContent {
    constructor() {
        this.releasesData = null;
        this.instagramData = null;
    }

    /**
     * Initialize dynamic content on page load
     */
    async init() {
        // Load releases if we're on a page with releases
        const releasesContainer = document.getElementById('releases-container');
        if (releasesContainer) {
            await this.loadReleases(releasesContainer);
        }

        // Load latest release spotlight if container exists
        const latestReleaseContainer = document.getElementById('latest-release');
        if (latestReleaseContainer) {
            await this.loadLatestRelease(latestReleaseContainer);
        }

        // Initialize filter buttons if they exist
        this.initFilters();
    }

    /**
     * Fetch releases from JSON data
     */
    async fetchReleases() {
        if (this.releasesData) return this.releasesData;

        try {
            const response = await fetch('./data/releases.json');
            if (!response.ok) throw new Error('Failed to load releases');
            this.releasesData = await response.json();
            return this.releasesData;
        } catch (error) {
            console.error('Error loading releases:', error);
            return null;
        }
    }

    /**
     * Render skeleton loading cards
     */
    renderSkeletons(container, count = 6) {
        container.innerHTML = '';
        for (let i = 0; i < count; i++) {
            const skeleton = document.createElement('div');
            skeleton.className = 'release-card skeleton';
            skeleton.innerHTML = `
                <div style="aspect-ratio: 1; background: var(--bg-elevated);"></div>
                <h3></h3>
            `;
            container.appendChild(skeleton);
        }
    }

    /**
     * Load and render releases
     */
    async loadReleases(container) {
        // Show loading skeletons
        this.renderSkeletons(container, 6);

        // Fetch data
        const data = await this.fetchReleases();

        if (!data || !data.releases) {
            container.innerHTML = '<p class="error">Unable to load releases. Please try again later.</p>';
            return;
        }

        // Sort by release date (newest first)
        const releases = [...data.releases].sort((a, b) =>
            new Date(b.releaseDate) - new Date(a.releaseDate)
        );

        // Render releases
        container.innerHTML = '';
        releases.forEach((release, index) => {
            const card = this.createReleaseCard(release, index);
            container.appendChild(card);
        });
    }

    /**
     * Load and render latest release spotlight
     */
    async loadLatestRelease(container) {
        const data = await this.fetchReleases();

        if (!data || !data.releases || data.releases.length === 0) {
            container.style.display = 'none';
            return;
        }

        // Get the latest release
        const latest = [...data.releases].sort((a, b) =>
            new Date(b.releaseDate) - new Date(a.releaseDate)
        )[0];

        // Format release date
        const releaseDate = new Date(latest.releaseDate);
        const formattedDate = releaseDate.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });

        // Build links HTML
        let linksHtml = '';
        if (latest.links.beatport) {
            linksHtml += `<a href="${latest.links.beatport}" target="_blank" rel="noopener">Beatport</a>`;
        }
        if (latest.links.spotify) {
            linksHtml += `<a href="${latest.links.spotify}" target="_blank" rel="noopener">Spotify</a>`;
        }
        if (latest.links.soundcloud) {
            linksHtml += `<a href="${latest.links.soundcloud}" target="_blank" rel="noopener">SoundCloud</a>`;
        }

        container.innerHTML = `
            <img src="${latest.artwork}" alt="${latest.title} cover art" loading="lazy">
            <div class="latest-release-info">
                <span class="badge">${latest.type === 'ep' ? 'EP' : latest.type === 'album' ? 'Album' : 'Single'}</span>
                <h3>${latest.title}</h3>
                <p>Released ${formattedDate}${latest.label ? ` on ${latest.label}` : ''}</p>
                <div class="latest-release-links">
                    ${linksHtml}
                </div>
            </div>
        `;
    }

    /**
     * Create a release card element
     */
    createReleaseCard(release, index) {
        const card = document.createElement('a');
        card.className = 'release-card';
        card.href = release.links.beatport || release.links.spotify || '#';
        card.target = '_blank';
        card.rel = 'noopener noreferrer';
        card.style.animationDelay = `${0.1 + (index * 0.05)}s`;

        // Add data attributes for filtering
        card.dataset.type = release.type;
        card.dataset.platforms = Object.keys(release.links)
            .filter(key => release.links[key])
            .join(',');

        card.innerHTML = `
            <img src="${release.artwork}" alt="${release.title} cover art" loading="lazy">
            <h3>${release.title}</h3>
        `;

        return card;
    }

    /**
     * Initialize filter buttons
     */
    initFilters() {
        const filterButtons = document.querySelectorAll('[data-filter]');
        if (!filterButtons.length) return;

        filterButtons.forEach(button => {
            button.addEventListener('click', () => {
                const filter = button.dataset.filter;
                this.filterReleases(filter);

                // Update active state
                filterButtons.forEach(btn => btn.classList.remove('active'));
                button.classList.add('active');
            });
        });
    }

    /**
     * Filter releases by type or platform
     */
    filterReleases(filter) {
        const cards = document.querySelectorAll('.release-card');

        cards.forEach(card => {
            if (filter === 'all') {
                card.style.display = '';
                return;
            }

            const type = card.dataset.type;
            const platforms = card.dataset.platforms?.split(',') || [];

            const matchesType = type === filter;
            const matchesPlatform = platforms.includes(filter);

            card.style.display = (matchesType || matchesPlatform) ? '' : 'none';
        });
    }
}

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    const dynamicContent = new DynamicContent();
    dynamicContent.init();
});

// Export for use in other scripts
window.DynamicContent = DynamicContent;
