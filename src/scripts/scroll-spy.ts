export class ScrollSpy {
  private observer: IntersectionObserver | null = null;
  private isManualScrolling = false;
  private manualScrollTimeout: number | null = null;
  private tocLinks: NodeListOf<Element> | null = null;
  private headings: Element[] = [];

  init(detailElement: HTMLElement) {
    this.destroy();

    this.tocLinks = detailElement.querySelectorAll('.toc-link');
    this.headings = Array.from(detailElement.querySelectorAll('article h1, article h2, article h3, article h4'));
    
    if (this.headings.length === 0) return;

    // 1. Initial State
    this.updateActiveLink();

    // 2. Handle Click Highlighting
    this.tocLinks.forEach(link => {
      link.addEventListener('click', () => {
        this.isManualScrolling = true;
        if (this.manualScrollTimeout) clearTimeout(this.manualScrollTimeout);
        
        this.setActiveLink(link as HTMLElement);
        
        this.manualScrollTimeout = window.setTimeout(() => {
          this.isManualScrolling = false;
        }, 800);
      });
    });

    // 3. Optimized Observer
    this.observer = new IntersectionObserver(() => {
      if (this.isManualScrolling) return;
      this.updateActiveLink();
    }, {
      rootMargin: '-10% 0px -80% 0px',
      threshold: [0, 1]
    });

    this.headings.forEach(h => this.observer?.observe(h));
  }

  private updateActiveLink() {
    if (!this.tocLinks || this.headings.length === 0) return;

    const scrollPos = window.scrollY + 120; // Offset for sticky header
    let currentHeading = this.headings[0];

    for (const heading of this.headings) {
      if ((heading as HTMLElement).offsetTop <= scrollPos) {
        currentHeading = heading;
      } else {
        break;
      }
    }

    const activeId = currentHeading.id;
    this.tocLinks.forEach(link => {
      const href = link.getAttribute('href')?.slice(1);
      if (href === activeId) {
        this.setActiveLink(link as HTMLElement);
      }
    });
  }

  private setActiveLink(link: HTMLElement) {
    if (!this.tocLinks) return;
    this.tocLinks.forEach(l => l.classList.remove('active'));
    link.classList.add('active');
    
    // Auto-scroll the TOC container if needed
    const sidebar = link.closest('.toc-sidebar');
    if (sidebar) {
      const linkTop = link.offsetTop;
      const sidebarHeight = sidebar.clientHeight;
      if (linkTop > sidebarHeight - 100 || linkTop < sidebar.scrollTop) {
        link.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
      }
    }
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
