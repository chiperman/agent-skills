export class SearchManager {
  private allCards: { element: HTMLElement; text: string }[] = [];
  private searchTimeout: number | null = null;
  private countBadge: HTMLElement | null = null;
  private emptyState: HTMLElement | null = null;
  private personalSection: HTMLElement | null = null;
  private referenceSection: HTMLElement | null = null;

  constructor() {
    this.countBadge = document.getElementById('count-badge');
    this.emptyState = document.getElementById('empty-state');
    this.personalSection = document.getElementById('personal-section');
    this.referenceSection = document.getElementById('reference-section');

    this.allCards = Array.from(document.querySelectorAll('.skill-card')).map(card => ({
      element: card as HTMLElement,
      text: (card.querySelector('h2')?.textContent?.toLowerCase() || '') + ' ' + 
            (card.querySelector('p')?.textContent?.toLowerCase() || '')
    }));
  }

  filterSkills(query: string) {
    if (this.searchTimeout) cancelAnimationFrame(this.searchTimeout);
    
    this.searchTimeout = requestAnimationFrame(() => {
      const q = query.toLowerCase().trim();
      let visibleCount = 0;

      this.allCards.forEach(item => {
        const match = item.text.includes(q);
        item.element.classList.toggle('hidden', !match);
        if (match) visibleCount++;
      });

      this.personalSection?.classList.toggle('hidden', !this.allCards.filter(c => c.element.dataset.type === 'personal' && !c.element.classList.contains('hidden')).length);
      this.referenceSection?.classList.toggle('hidden', !this.allCards.filter(c => c.element.dataset.type === 'reference' && !c.element.classList.contains('hidden')).length);

      this.emptyState?.classList.toggle('hidden', visibleCount > 0);
      if (this.countBadge) this.countBadge.textContent = `${visibleCount} TOTAL`;
    });
  }
}
