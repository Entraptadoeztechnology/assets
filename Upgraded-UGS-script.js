
const targetUser = 'entraptadoeztech';
        const targetRepo = 'Wii';
        const targetBranch = 'main';
        const githackBaseUrl = `https://raw.githack.com/${targetUser}/${targetRepo}/${targetBranch}/`;

        // Hardcoded categorizations mapping back to your personal uploaded files
        const nintendoGames = [
            "Zelda2.html", "smashbros.html", "tennis.html", "pacman.html",
            "supermarioworld2.html", "Zeldalinktopast.html", "pokemonemerald.html"
        ];

        const playstationGames = [
            "1942.html", "mortalkombat.html", "winterolympics.html",
            "tonyhawk2.html", "streetfighter2.html"
        ];

        // Sort structures cleanly ahead of injection execution
        nintendoGames.sort((a, b) => a.localeCompare(b, undefined, { numeric: true, sensitivity: 'base' }));
        playstationGames.sort((a, b) => a.localeCompare(b, undefined, { numeric: true, sensitivity: 'base' }));

        function launchGame(fileName) {
            const gameUrl = githackBaseUrl + fileName;
            addToRecents(fileName);

            const win = window.open('about:blank', '_blank');
            if (!win) {
                alert('Pop-up blocked! Please allow pop-ups to run your games.');
                return;
            }

            win.document.body.style.margin = '0';
            win.document.body.style.height = '100vh';
            win.document.body.style.overflow = 'hidden';
            win.document.body.style.backgroundColor = '#000000';

            const iframe = win.document.createElement('iframe');
            iframe.style.border = 'none';
            iframe.style.width = '100%';
            iframe.style.height = '100%';
            iframe.style.margin = '0';
            iframe.src = gameUrl;

            win.document.body.appendChild(iframe);
        }

        function createGameRowElement(file) {
            const row = document.createElement('div');
            row.className = 'game-row';
            row.setAttribute('data-filename', file);

            const btn = document.createElement('button');
            btn.className = 'game-btn';
            btn.textContent = file.replace('.html', '').toUpperCase();
            btn.onclick = () => launchGame(file);

            const star = document.createElement('button');
            star.className = 'star-btn';
            star.innerHTML = '★';

            let favs = JSON.parse(localStorage.getItem('favGames')) || [];
            if (favs.includes(file)) {
                star.classList.add('fav-active');
            }

            star.onclick = (e) => {
                e.stopPropagation();
                toggleFavorite(file, star);
            };

            row.appendChild(btn);
            row.appendChild(star);
            return row;
        }

        function toggleFavorite(file, starElement) {
            let favs = JSON.parse(localStorage.getItem('favGames')) || [];
            if (favs.includes(file)) {
                favs = favs.filter(item => item !== file);
                starElement.classList.remove('fav-active');
            } else {
                favs.push(file);
                starElement.classList.add('fav-active');
            }
            localStorage.setItem('favGames', JSON.stringify(favs));
            
            renderFavoritesList();
            updateGlobalStarStates();
        }

        function updateGlobalStarStates() {
            let favs = JSON.parse(localStorage.getItem('favGames')) || [];
            document.querySelectorAll('.game-row').forEach(row => {
                const file = row.getAttribute('data-filename');
                const star = row.querySelector('.star-btn');
                if (star && file) {
                    if (favs.includes(file)) {
                        star.classList.add('fav-active');
                    } else {
                        star.classList.remove('fav-active');
                    }
                }
            });
        }

        function renderFavoritesList() {
            const container = document.getElementById('favorites-list');
            const favs = JSON.parse(localStorage.getItem('favGames')) || [];
            container.innerHTML = '';

            if (favs.length === 0) {
                container.innerHTML = '<div class="empty-message">Star an emulator game item to list it here!</div>';
                return;
            }
            favs.forEach(file => container.appendChild(createGameRowElement(file)));
        }

        function addToRecents(file) {
            let recents = JSON.parse(localStorage.getItem('recentGames')) || [];
            recents = recents.filter(item => item !== file);
            recents.unshift(file);
            if (recents.length > 3) recents.pop();

            localStorage.setItem('recentGames', JSON.stringify(recents));
            renderRecentsList();
        }

        function renderRecentsList() {
            const container = document.getElementById('recent-list');
            const recents = JSON.parse(localStorage.getItem('recentGames')) || [];
            container.innerHTML = '';

            if (recents.length === 0) {
                container.innerHTML = '<div class="empty-message">No emulation nodes targeted recently.</div>';
                return;
            }
            recents.forEach(file => container.appendChild(createGameRowElement(file)));
        }

        function filterGames() {
            const query = document.getElementById('search-input').value.toUpperCase();
            document.querySelectorAll('#sections-container .game-row').forEach(row => {
                const text = row.querySelector('.game-btn').textContent;
                row.style.display = text.includes(query) ? "" : "none";
            });
        }

        // Programmatic section buildout injection 
        function buildConsoleCategorySection(headingTitle, filesArray) {
            const mainBox = document.getElementById('sections-container');
            
            const section = document.createElement('div');
            section.className = 'letter-section';
            
            const header = document.createElement('div');
            header.className = 'letter-header';
            header.textContent = headingTitle;
            
            const container = document.createElement('div');
            container.className = 'buttons-container';

            filesArray.forEach(file => container.appendChild(createGameRowElement(file)));
            
            section.appendChild(header);
            section.appendChild(container);
            mainBox.appendChild(section);
        }

        // Render sections systematically
        buildConsoleCategorySection("Nintendo Systems", nintendoGames);
        buildConsoleCategorySection("PlayStation Systems", playstationGames);

        // Core initialization renders
        renderFavoritesList();
        renderRecentsList();
