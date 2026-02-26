export class ScrollSpy {
  private observer: IntersectionObserver | null = null;
  private isManualScrolling = false;
  private manualScrollTimeout: number | null = null;

  init(detailElement: HTMLElement) {
    if (this.observer) this.observer.disconnect();

    const tocLinks = detailElement.querySelectorAll('.toc-link');
    const headings = Array.from(detailElement.querySelectorAll('article h2, article h3, article h4'));
    
    // 1. Handle Click Highlighting
    tocLinks.forEach(link => {
      link.addEventListener('click', () => {
        this.isManualScrolling = true;
        if (this.manualScrollTimeout) clearTimeout(this.manualScrollTimeout);
        
        tocLinks.forEach(l => l.classList.remove('active'));
        link.classList.add('active');
        
        this.manualScrollTimeout = window.setTimeout(() => {
          this.isManualScrolling = false;
        }, 1000);
      });
    });

    // 2. Optimized Observer
    this.observer = new IntersectionObserver((_entries) => {
      if (this.isManualScrolling) return;

      const passedHeadings = headings.filter(h => {
        const rect = h.getBoundingClientRect();
        return rect.top < 150;
      });

      if (passedHeadings.length > 0) {
        const activeHeading = passedHeadings[passedHeadings.length - 1];
        const activeId = activeHeading.id;

        tocLinks.forEach(link => {
          const href = link.getAttribute('href')?.slice(1);
          if (href === activeId) {
            if (!link.classList.contains('active')) {
              link.classList.add('active');
              link.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
            }
          } else {
            link.classList.remove('active');
          }
        });
      }
    }, {
      rootMargin: '0px 0px -80% 0px',
      threshold: [0, 1]
    });

    headings.forEach(h => this.observer?.observe(h));
  }

  destroy() {
    if (this.observer) {
      this.observer.disconnect();
      this.observer = null;
    }
    if (this.manualScrollTimeout) {
      clearTimeout(this.manualScrollTimeout);
    }
  }
}
