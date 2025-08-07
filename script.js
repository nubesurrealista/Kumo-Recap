function renderRecap() {
  const jsonInput = document.getElementById('json-input').value;
  const recap = document.getElementById('recap');
  const statsContent = document.getElementById('stats-content');
  const mangasContent = document.getElementById('mangas-content');

  try {
    const data = JSON.parse(jsonInput);

    // Clear previous content
    statsContent.innerHTML = '';
    mangasContent.innerHTML = '';

    // Show recap container
    recap.classList.remove('hidden');

    // Render stats
    if (data.stats) {
      const stats = data.stats;
      const statsHtml = `
        <div class="stat-item"><strong>Total Chapters Read:</strong> ${stats.totalChaptersRead || 'N/A'}</div>
        <div class="stat-item"><strong>Total Mangas Read:</strong> ${stats.totalMangasRead || 'N/A'}</div>
        <div class="stat-item"><strong>Most Active Month:</strong> ${stats.mostActiveMonth || 'N/A'}</div>
        <div class="stat-item"><strong>Top Genre:</strong> ${stats.topGenre || 'N/A'}</div>
      `;
      statsContent.innerHTML = statsHtml;
    } else {
      statsContent.innerHTML = '<p>No stats available.</p>';
    }

    // Render top mangas
    if (data.topMangas && Array.isArray(data.topMangas)) {
      const mangasHtml = data.topMangas.map(manga => `
        <div class="manga-card">
          <img src="${manga.thumbnailUrl || ''}" alt="${manga.title || 'Manga'}" onerror="this.src='https://via.placeholder.com/80x120?text=No+Cover'">
          <div>
            <h3>${manga.title || 'Unknown Title'}</h3>
            <p><strong>Author:</strong> ${manga.author || 'N/A'}</p>
            <p><strong>Genres:</strong> ${manga.genres?.join(', ') || 'N/A'}</p>
            <p><strong>Chapters Read:</strong> ${manga.chaptersRead || 'N/A'}</p>
          </div>
        </div>
      `).join('');
      mangasContent.innerHTML = mangasHtml;
    } else {
      mangasContent.innerHTML = '<p>No top mangas available.</p>';
    }
  } catch (error) {
    recap.classList.remove('hidden');
    statsContent.innerHTML = `<p class="error">Error: Invalid JSON format. Please check your input.</p>`;
    mangasContent.innerHTML = '';
  }
}
