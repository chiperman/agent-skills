interface SearchItem {
  id: string; // Skill name
  n: string;  // Lowercase name
  d: string;  // Lowercase description
  t: string;  // Type (personal/reference)
}

export class SearchManager {
  private index: SearchItem[] = [];
  private allCards: Map<string, HTMLElement> = new Map();
  private searchTimeout: number | null = null;
  private isReady = false;
  private pendingQuery: string | null = null;
  
  private countBadge = document.getElementById('count-badge');
  private emptyState = document.getElementById('empty-state');
  private personalSection = document.getElementById('personal-section');
  private referenceSection = document.getElementById('reference-section');

  constructor() {
    this.init();
  }

  private async init() {
    // 1. Map existing DOM elements
    document.querySelectorAll('.skill-card').forEach(card => {
      const name = (card as HTMLElement).querySelector('h2')?.textContent;
      if (name) this.allCards.set(name, card as HTMLElement);
    });

    // 2. Fetch search index
    try {
      const response = await fetch(`${import.meta.env.BASE_URL}/api/search-index.json`);
      this.index = await response.json();
    } catch (err) {
      console.error('Failed to load search index:', err);
      // Fallback: build index from DOM if fetch fails
      this.index = Array.from(this.allCards.entries()).map(([name, el]) => ({
        id: name,
        n: name.toLowerCase(),
        d: el.querySelector('p')?.textContent?.toLowerCase() || '',
        t: (el as HTMLElement).dataset.type || ''
      }));
    } finally {
      this.isReady = true;
      if (this.pendingQuery !== null) {
        this.filterSkills(this.pendingQuery);
        this.pendingQuery = null;
      }
    }
  }

  filterSkills(query: string) {
    if (!this.isReady) {
      this.pendingQuery = query;
      return;
    }
    
    if (this.searchTimeout) cancelAnimationFrame(this.searchTimeout);
    
    this.searchTimeout = requestAnimationFrame(() => {
      const q = query.toLowerCase().trim();
      const terms = q.split(/\s+/).filter(t => t.length > 0);
      
      let visibleCount = 0;
      const visiblePersonal: string[] = [];
      const visibleReference: string[] = [];

      // If query is empty, show all
      if (terms.length === 0) {
        this.allCards.forEach(el => el.classList.remove('hidden'));
        this.updateUI(this.index.length, true, true);
        return;
      }

      // Perform matching
      this.index.forEach(item => {
        const matches = terms.every(term => item.n.includes(term) || item.d.includes(term));
        const element = this.allCards.get(item.id);
        
        if (element) {
          element.classList.toggle('hidden', !matches);
          if (matches) {
            visibleCount++;
            if (item.t === 'personal') visiblePersonal.push(item.id);
            else visibleReference.push(item.id);
          }
        }
      });

      this.updateUI(visibleCount, visiblePersonal.length > 0, visibleReference.length > 0);
    });
  }

  private updateUI(count: number, showPersonal: boolean, showReference: boolean) {
    if (this.countBadge) this.countBadge.textContent = `${count} TOTAL`;
    if (this.emptyState) this.emptyState.classList.toggle('hidden', count > 0);
    if (this.personalSection) this.personalSection.classList.toggle('hidden', !showPersonal);
    if (this.referenceSection) this.referenceSection.classList.toggle('hidden', !showReference);
  }
}
