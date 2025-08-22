// Shows the film loader by setting its display to 'flex'
export function showFilmLoader() {
    const loader = document.getElementById('film-loader');
    if (loader) loader.style.display = 'flex';
}

// Hides the film loader by setting its display to 'none'
export function hideFilmLoader() {
    const loader = document.getElementById('film-loader');
    if (loader) loader.style.display = 'none';
}

(function loadFilmLoader() {
    const loaderHTML = `
    <style>
        .film-loader-backdrop {
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(10, 10, 10, 0.85);
            display: flex;
            justify-content: center;
            align-items: center;
            z-index: 9999;
        }
        
        .film-loader {
            display: flex;
            flex-direction: column;
            align-items: center;
            color: #fff;
        }
        
        .film-strip {
            display: flex;
            gap: 12px;
            animation: move-strip 1.5s linear infinite;
        }
        
        .frame {
            width: 25px;
            height: 45px;
            background: #ddd;
            border: 2px solid #555;
            box-shadow: 0 0 6px #fff;
            border-radius: 3px;
        }
        
        .loading-text {
            margin-top: 18px;
            font-size: 1.2rem;
            font-family: 'Courier New', Courier, monospace;
            animation: pulse 1.5s infinite;
        }
        
        @keyframes move-strip {
            0% { transform: translateX(0); }
            100% { transform: translateX(-30px); }
        }
        
        @keyframes pulse {
            0%, 100% { opacity: 1; }
            50% { opacity: 0.6; }
        }
    </style>
    <div id="film-loader" class="film-loader-backdrop" style="display: none;">
        <div class="film-loader">
            <div class="film-strip">
                <div class="frame"></div>
                <div class="frame"></div>
                <div class="frame"></div>
                <div class="frame"></div>
            </div>
            <p class="loading-text">Loading in progress...</p>
        </div>
    </div>`;

    document.body.insertAdjacentHTML('beforeend', loaderHTML);
})();
