import { ScrollSpy } from './scroll-spy';
import { SearchManager } from './search';
import { setupUIInteractions } from './ui-interactions';

// This will run on the first page load and every navigation after that
document.addEventListener('astro:page-load', () => {
  const scrollSpy = new ScrollSpy();
  
  // Only init SearchManager if we are on a list view
  const listView = document.getElementById('list-view');
  let searchManager: SearchManager | null = null;
  if (listView) {
    searchManager = new SearchManager();
  }

  // If we are in a detail view, init scrollspy
  const detailView = document.querySelector('.skill-detail') as HTMLElement;
  if (detailView) {
    scrollSpy.init(detailView);
  }

  // Setup interactions (handles searchManager being null)
  setupUIInteractions(searchManager as any);
});
