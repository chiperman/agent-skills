import type { ScrollSpy } from './scroll-spy';

export class ViewManager {
  private listView = document.getElementById('list-view');
  private detailsContainer = document.getElementById('details-container');
  private footer = document.getElementById('main-footer');
  private currentScrollPos = 0;
  private lastFocusedElement: HTMLElement | null = null;
  private originTitle = document.title;

  constructor(private scrollSpy: ScrollSpy) {}

  showDetail(skillName: string, triggerElement: HTMLElement, skipHistory = false) {
    document.querySelectorAll('.skill-detail').forEach(el => el.classList.add('hidden'));
    
    const detail = document.getElementById(`detail-${skillName}`);
    if (detail) {
      this.lastFocusedElement = triggerElement;
      this.currentScrollPos = window.scrollY;
      detail.classList.remove('hidden');
      
      this.scrollSpy.init(detail as HTMLElement);

      const skillDisplayName = detail.querySelector('h2')?.textContent || skillName;
      document.title = `${skillDisplayName} | Agent Skills`;
      
      this.listView?.classList.add('opacity-0', '-translate-y-4');
      setTimeout(() => {
        this.listView?.classList.add('hidden');
        this.footer?.classList.add('hidden');
        this.detailsContainer?.classList.remove('hidden');
        
        this.detailsContainer?.offsetHeight; 
        
        requestAnimationFrame(() => {
          this.detailsContainer?.classList.remove('opacity-0', 'translate-y-4');
          window.scrollTo(0, 0);
          const backBtn = detail.querySelector('.back-to-list') as HTMLElement;
          backBtn?.focus();
        });
      }, 300);
      
      if (!skipHistory) {
        history.pushState({ skill: skillName }, '', `#${skillName}`);
      }
    }
  }

  hideDetail(skipHistory = false) {
    if (this.detailsContainer?.classList.contains('hidden')) return;

    this.detailsContainer?.classList.add('opacity-0', 'translate-y-4');
    this.scrollSpy.destroy();
    document.title = this.originTitle;

    setTimeout(() => {
      this.detailsContainer?.classList.add('hidden');
      this.listView?.classList.remove('hidden');
      this.footer?.classList.remove('hidden');
      
      this.listView?.offsetHeight;

      requestAnimationFrame(() => {
        this.listView?.classList.remove('opacity-0', '-translate-y-4');
        window.scrollTo(0, this.currentScrollPos);
        if (this.lastFocusedElement) {
          this.lastFocusedElement.focus();
        }
      });
    }, 300);
    
    if (!skipHistory) {
      history.pushState({}, '', window.location.pathname);
    }
  }

  getListView() { return this.listView; }
  getDetailsContainer() { return this.detailsContainer; }
}
