import { ScrollSpy } from './scroll-spy';
import { SearchManager } from './search';
import { ViewManager } from './view-manager';
import { setupUIInteractions } from './ui-interactions';

// Initialize core modules
const scrollSpy = new ScrollSpy();
const searchManager = new SearchManager();
const viewManager = new ViewManager(scrollSpy);

// Setup interactions
setupUIInteractions(viewManager, searchManager);
