document.addEventListener('DOMContentLoaded', () => {
    const searchInput = document.getElementById('search-input');
    const forumThreads = document.getElementById('forum-threads');

    searchInput.addEventListener('input', (e) => {
        const searchTerm = e.target.value.toLowerCase().trim();

        // Get all current thread items (dynamically loaded)
        const threadItems = Array.from(forumThreads.children).filter(child =>
            child.classList.contains('bg-white') || child.classList.contains('rounded-2xl')
        );

        threadItems.forEach(item => {
            try {
                const titleElement = item.querySelector('h3');
                const contentElement = item.querySelector('p');
                const authorElement = item.querySelector('h4');

                if (!titleElement || !contentElement) {
                    return; // Skip if elements not found
                }

                const title = titleElement.textContent.toLowerCase();
                const content = contentElement.textContent.toLowerCase();
                const author = authorElement ? authorElement.textContent.toLowerCase() : '';

                const isVisible = searchTerm === '' ||
                    title.includes(searchTerm) ||
                    content.includes(searchTerm) ||
                    author.includes(searchTerm);

                item.style.display = isVisible ? '' : 'none';
            } catch (error) {
                console.error('Error filtering post:', error);
            }
        });

        // Show message if no results
        const visibleItems = threadItems.filter(item => item.style.display !== 'none');
        if (visibleItems.length === 0 && searchTerm !== '') {
            const existingMessage = forumThreads.querySelector('.search-no-results');
            if (!existingMessage) {
                const noResultsMsg = document.createElement('div');
                noResultsMsg.className = 'search-no-results text-center text-gray-500 py-8';
                noResultsMsg.textContent = `Tidak ada hasil untuk "${searchInput.value}"`;
                forumThreads.appendChild(noResultsMsg);
            }
        } else {
            const existingMessage = forumThreads.querySelector('.search-no-results');
            if (existingMessage) {
                existingMessage.remove();
            }
        }
    });
});
