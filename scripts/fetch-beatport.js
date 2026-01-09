/**
 * Beatport Release Scraper
 * 
 * This script fetches the latest releases from a Beatport artist page
 * and updates the data/releases.json file.
 * 
 * Run: node scripts/fetch-beatport.js
 */

const fs = require('fs');
const path = require('path');

// Configuration
const ARTIST_ID = process.env.ARTIST_ID || '1033866';
const ARTIST_URL = `https://www.beatport.com/artist/gino-colombi/${ARTIST_ID}/tracks`;
const RELEASES_FILE = path.join(__dirname, '..', 'data', 'releases.json');

// Beatport uses dynamic rendering, so we'll use their API pattern
// The track listing is available via their API endpoint
const API_BASE = 'https://api.beatport.com/v4';

async function fetchBeatportReleases() {
    console.log('🎵 Fetching Beatport releases for artist:', ARTIST_ID);

    try {
        // Beatport's public API for artist releases
        const response = await fetch(
            `${API_BASE}/catalog/releases/?artist_id=${ARTIST_ID}&per_page=50&order_by=-publish_date`,
            {
                headers: {
                    'Accept': 'application/json',
                    'User-Agent': 'Mozilla/5.0 (compatible; GinoColombiBot/1.0)'
                }
            }
        );

        if (!response.ok) {
            // If API fails, try alternative approach
            console.log('⚠️ Beatport API not accessible, using fallback method');
            return await fetchFromHtml();
        }

        const data = await response.json();
        return processApiResponse(data);

    } catch (error) {
        console.error('Error fetching from Beatport API:', error.message);
        console.log('📋 Using existing data as fallback');
        return null;
    }
}

function processApiResponse(data) {
    if (!data.results || !Array.isArray(data.results)) {
        console.log('⚠️ No releases found in API response');
        return null;
    }

    return data.results.map(release => ({
        id: `bp-${release.id}`,
        title: release.name,
        type: release.type?.name?.toLowerCase() || 'single',
        releaseDate: release.publish_date || release.new_release_date,
        artwork: release.image?.uri || getArtworkUrl(release.id),
        label: release.label?.name || '',
        links: {
            beatport: `https://www.beatport.com/release/${release.slug}/${release.id}`,
            spotify: null,
            soundcloud: null
        }
    }));
}

async function fetchFromHtml() {
    // Fallback: Parse the artist page HTML directly
    // This is a simplified version - Beatport heavily uses JS rendering
    console.log('📄 Attempting HTML fallback (may have limited results)');

    try {
        const cheerio = require('cheerio');
        const response = await fetch(ARTIST_URL, {
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
            }
        });

        if (!response.ok) {
            throw new Error(`HTTP ${response.status}`);
        }

        const html = await response.text();
        const $ = cheerio.load(html);

        // Look for any embedded JSON data
        const scripts = $('script').toArray();
        for (const script of scripts) {
            const content = $(script).html() || '';
            if (content.includes('"releases"') || content.includes('"tracks"')) {
                try {
                    // Try to extract JSON from script tags
                    const match = content.match(/\{[\s\S]*"releases"[\s\S]*\}/);
                    if (match) {
                        const data = JSON.parse(match[0]);
                        if (data.releases) {
                            return processApiResponse({ results: data.releases });
                        }
                    }
                } catch (e) {
                    // Continue trying other scripts
                }
            }
        }

        console.log('⚠️ Could not extract release data from HTML');
        return null;

    } catch (error) {
        console.error('HTML fallback failed:', error.message);
        return null;
    }
}

function getArtworkUrl(releaseId) {
    // Generate Beatport artwork URL based on release ID
    return `https://geo-media.beatport.com/image_size/500x500/${releaseId}.jpg`;
}

async function updateReleasesFile(newReleases) {
    // Read existing data
    let existingData = {
        lastUpdated: new Date().toISOString(),
        artist: {
            name: 'Gino Colombi',
            spotifyId: '6HaKvR8UvKwViIaIpUPVJA',
            beatportId: ARTIST_ID
        },
        releases: []
    };

    if (fs.existsSync(RELEASES_FILE)) {
        try {
            existingData = JSON.parse(fs.readFileSync(RELEASES_FILE, 'utf8'));
        } catch (error) {
            console.warn('⚠️ Could not parse existing releases file');
        }
    }

    if (!newReleases || newReleases.length === 0) {
        console.log('ℹ️ No new releases fetched, keeping existing data');
        return existingData;
    }

    // Merge releases (avoid duplicates by ID)
    const existingIds = new Set(existingData.releases.map(r => r.id));
    const mergedReleases = [...existingData.releases];

    for (const release of newReleases) {
        if (!existingIds.has(release.id)) {
            mergedReleases.push(release);
            console.log(`✅ Added new release: ${release.title}`);
        }
    }

    // Sort by release date (newest first)
    mergedReleases.sort((a, b) => new Date(b.releaseDate) - new Date(a.releaseDate));

    // Update the data object
    existingData.lastUpdated = new Date().toISOString();
    existingData.releases = mergedReleases;

    // Write to file
    fs.writeFileSync(RELEASES_FILE, JSON.stringify(existingData, null, 2));
    console.log(`📁 Updated ${RELEASES_FILE}`);
    console.log(`📊 Total releases: ${mergedReleases.length}`);

    return existingData;
}

// Main execution
async function main() {
    console.log('🚀 Starting Beatport release update...\n');

    const releases = await fetchBeatportReleases();
    await updateReleasesFile(releases);

    console.log('\n✨ Done!');
}

main().catch(error => {
    console.error('❌ Fatal error:', error);
    process.exit(1);
});
