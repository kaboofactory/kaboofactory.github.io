document.addEventListener('DOMContentLoaded', () => {
    const appGrid = document.getElementById('app-grid');

    function loadApps() {
        if (window.APP_LIST) {
            renderApps(window.APP_LIST);
        } else {
            console.error('APP_LIST not found');
            appGrid.innerHTML = `
                <div class="error-state">
                    <h3>Unable to load applications</h3>
                    <p>Please ensure apps_data.js exists and is valid.</p>
                    <p>Run <code>node scan_apps.js</code> to generate the list.</p>
                </div>
            `;
        }
    }

    function renderApps(apps) {
        if (apps.length === 0) {
            appGrid.innerHTML = '<div class="loading-state">No applications found.</div>';
            return;
        }

        appGrid.innerHTML = apps.map(app => createAppCard(app)).join('');
    }

    function createAppCard(app) {
        let iconHtml;

        if (app.icon) {
            iconHtml = `<img src="${app.icon}" alt="${escapeHtml(app.name)} icon" class="app-icon-img">`;
        } else {
            // Generate initials for the icon
            const initials = app.name
                .split(' ')
                .map(word => word[0])
                .join('')
                .substring(0, 2)
                .toUpperCase();
            iconHtml = `<div class="app-icon">${initials}</div>`;
        }

        return `
            <a href="${app.path}" class="app-card">
                ${iconHtml}
                <h2 class="app-name">${escapeHtml(app.name)}</h2>
                <p class="app-description">${escapeHtml(app.description)}</p>
            </a>
        `;
    }

    function escapeHtml(unsafe) {
        return unsafe
            .replace(/&/g, "&amp;")
            .replace(/</g, "&lt;")
            .replace(/>/g, "&gt;")
            .replace(/"/g, "&quot;")
            .replace(/'/g, "&#039;");
    }

    loadApps();
});
