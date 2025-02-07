class YouTubeTrending {
    constructor() {
        this.container = document.getElementById('videoContainer');
        // Replace with your Cloudflare Worker URL
        this.workerUrl = 'https://your-worker-name.your-name.workers.dev';
    }

    async init() {
        try {
            const cached = this.getCache();
            if (cached) {
                this.renderVideos(cached);
                return;
            }

            const response = await fetch(this.workerUrl);
            if (!response.ok) throw new Error('Network response was not ok');
            
            const data = await response.json();
            if (data.error) throw new Error(data.error);

            this.setCache(data);
            this.renderVideos(data);
        } catch (error) {
            console.error('Error:', error);
            this.showError('Failed to load trending videos');
        }
    }

    renderVideos(data) {
        this.container.innerHTML = '';
        
        Object.entries(data).forEach(([region, video]) => {
            const card = this.createVideoCard(video);
            this.container.appendChild(card);
        });
    }

    createVideoCard(video) {
        const card = document.createElement('div');
        card.className = 'video-card';
        card.innerHTML = `
            <div class="thumbnail-container">
                <a href="https://www.youtube.com/watch?v=${video.id}" target="_blank">
                    <img class="thumbnail" 
                         src="https://img.youtube.com/vi/${video.id}/maxresdefault.jpg" 
                         alt="Thumbnail"
                         loading="lazy">
                </a>
            </div>
            <div class="info">
                <span class="region-tag">${video.region}</span>
                <h2>
                    <a href="https://www.youtube.com/watch?v=${video.id}" target="_blank">
                        ${video.title}
                    </a>
                </h2>
                <p>Channel: ${video.channel}</p>
                <p>Views: ${parseInt(video.views).toLocaleString()}</p>
                <p>Likes: ${parseInt(video.likes).toLocaleString()}</p>
            </div>
        `;
        return card;
    }

    getCache() {
        const cached = localStorage.getItem('youtube33rd');
        if (!cached) return null;

        const { timestamp, data } = JSON.parse(cached);
        // Cache for 1 hour
        if (Date.now() - timestamp > 3600000) {
            localStorage.removeItem('youtube33rd');
            return null;
        }

        return data;
    }

    setCache(data) {
        localStorage.setItem('youtube33rd', JSON.stringify({
            timestamp: Date.now(),
            data
        }));
    }

    showError(message) {
        this.container.innerHTML = `
            <div class="error">
                ${message}
                <button onclick="window.location.reload()">Try Again</button>
            </div>
        `;
    }
}

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    const trending = new YouTubeTrending();
    trending.init();
});

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    const trending = new YouTubeTrending();
    trending.init();
});
