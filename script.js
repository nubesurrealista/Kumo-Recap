function renderRecap() {
  const fileInput = document.getElementById('json-input');
  const fileNameDisplay = document.getElementById('file-name');
  const recap = document.getElementById('recap');
  const statsContent = document.getElementById('stats-content');
  const mangasContent = document.getElementById('mangas-content');
  const authorsContent = document.getElementById('authors-content');
  const genresContent = document.getElementById('genres-content');

  if (!fileInput.files.length) {
    recap.classList.remove('hidden');
    statsContent.innerHTML = '<p class="error">Please select a JSON file.</p>';
    mangasContent.innerHTML = '';
    authorsContent.innerHTML = '';
    genresContent.innerHTML = '';
    return;
  }

  const file = fileInput.files[0];
  fileNameDisplay.textContent = file.name;

  if (!file.name.endsWith('.json')) {
    recap.classList.remove('hidden');
    statsContent.innerHTML = '<p class="error">Please select a valid JSON file.</p>';
    mangasContent.innerHTML = '';
    authorsContent.innerHTML = '';
    genresContent.innerHTML = '';
    return;
  }

  const reader = new FileReader();
  reader.onload = function(event) {
    try {
      const data = JSON.parse(event.target.result);

      statsContent.innerHTML = '';
      mangasContent.innerHTML = '';
      authorsContent.innerHTML = '';
      genresContent.innerHTML = '';

      recap.classList.remove('hidden');

      const year = 2025;
      const startOfYear = new Date(year, 0, 1).getTime();
      const endOfYear = new Date(year + 1, 0, 1).getTime();

      let totalChaptersRead = 0;
      const mangasRead = new Set();
      const monthCounts = Array(12).fill(0);
      const genreCounts = {};
      const authorCounts = {};
      const mangaCounts = {};

      if (data.backupManga && Array.isArray(data.backupManga)) {
        data.backupManga.forEach(manga => {
          let chaptersReadThisYear = 0;
          if (manga.chapters && Array.isArray(manga.chapters)) {
            manga.chapters.forEach(chapter => {
              if (chapter.read) {
                const lastRead = manga.history?.find(h => h.url === chapter.url)?.lastRead || chapter.dateFetch;
                if (lastRead >= startOfYear && lastRead < endOfYear) {
                  chaptersReadThisYear++;
                  totalChaptersRead++;
                  mangasRead.add(manga.title);
                  const date = new Date(lastRead);
                  monthCounts[date.getMonth()]++;
                }
              }
            });
          }

          if (chaptersReadThisYear > 0) {
            mangaCounts[manga.title] = {
              title: manga.title,
              thumbnailUrl: manga.thumbnailUrl,
              author: manga.author,
              genres: manga.genre,
              chaptersRead: chaptersReadThisYear
            };
          }

          if (manga.genre && Array.isArray(manga.genre)) {
            manga.genre.forEach(genre => {
              if (genre && genre !== '.') {
                genreCounts[genre] = (genreCounts[genre] || 0) + chaptersReadThisYear;
              }
            });
          }

          if (manga.author) {
            authorCounts[manga.author] = (authorCounts[manga.author] || 0) + chaptersReadThisYear;
          }
        });
      }

      const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
      const mostActiveMonthIndex = monthCounts.indexOf(Math.max(...monthCounts));
      const mostActiveMonth = months[mostActiveMonthIndex] || 'N/A';
      const topGenre = Object.entries(genreCounts).sort((a, b) => b[1] - a[1])[0]?.[0] || 'N/A';

      statsContent.innerHTML = `
        <div class="stat-item"><strong>Total Chapters Read:</strong> ${totalChaptersRead}</div>
        <div class="stat-item"><strong>Total Mangas Read:</strong> ${mangasRead.size}</div>
        <div class="stat-item"><strong>Most Active Month:</strong> ${mostActiveMonth}</div>
        <div class="stat-item"><strong>Top Genre:</strong> ${topGenre}</div>
      `;

      const topMangas = Object.values(mangaCounts)
        .sort((a, b) => b.chaptersRead - a.chaptersRead)
        .slice(0, 5);
      mangasContent.innerHTML = topMangas.length > 0
        ? topMangas.map(manga => `
            <div class="manga-card">
              <img src="${manga.thumbnailUrl || ''}" alt="${manga.title || 'Manga'}">
              <div>
                <h3>${manga.title || 'Unknown Title'}</h3>
                <p><strong>Author:</strong> ${manga.author || 'N/A'}</p>
                <p><strong>Genres:</strong> ${manga.genres?.filter(g => g !== '.').join(', ') || 'N/A'}</p>
                <p><strong>Chapters Read:</strong> ${manga.chaptersRead}</p>
              </div>
            </div>
          `).join('')
        : '<p>No mangas read in 2025.</p>';

      const topAuthors = Object.entries(authorCounts)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 5);
      authorsContent.innerHTML = topAuthors.length > 0
        ? topAuthors.map(([author, chapters]) => `
            <div class="stat-item"><strong>${author}</strong>: ${chapters} chapters</div>
          `).join('')
        : '<p>No authors data available.</p>';

      const topGenres = Object.entries(genreCounts)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 5);
      genresContent.innerHTML = topGenres.length > 0
        ? topGenres.map(([genre, chapters]) => `
            <div class="stat-item"><strong>${genre}</strong>: ${chapters} chapters</div>
          `).join('')
        : '<p>No genres data available.</p>';
    } catch (error) {
      recap.classList.remove('hidden');
      statsContent.innerHTML = '<p class="error">Error: Invalid JSON format. Please check your file.</p>';
      mangasContent.innerHTML = '';
      authorsContent.innerHTML = '';
      genresContent.innerHTML = '';
    }
  };
  reader.onerror = function() {
    recap.classList.remove('hidden');
    statsContent.innerHTML = '<p class="error">Error reading the file.</p>';
    mangasContent.innerHTML = '';
    authorsContent.innerHTML = '';
    genresContent.innerHTML = '';
  };
  reader.readAsText(file);
}
