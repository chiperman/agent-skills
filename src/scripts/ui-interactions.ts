import type { ViewManager } from './view-manager';
import type { SearchManager } from './search';

export function setupUIInteractions(viewManager: ViewManager, searchManager: SearchManager) {
  const backToTopBtn = document.getElementById('back-to-top');
  const searchInput = document.getElementById('skill-search') as HTMLInputElement;
  const clearBtn = document.getElementById('clear-search');

  // 1. Scroll Listener for Back to Top
  let scrollTicking = false;
  window.addEventListener('scroll', () => {
    if (!scrollTicking) {
      window.requestAnimationFrame(() => {
        if (window.scrollY > 400) {
          backToTopBtn?.classList.remove('opacity-0', 'translate-y-10', 'pointer-events-none');
        } else {
          backToTopBtn?.classList.add('opacity-0', 'translate-y-10', 'pointer-events-none');
        }
        scrollTicking = false;
      });
      scrollTicking = true;
    }
  });

  backToTopBtn?.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });

  // 2. Global Click Delegation
  document.addEventListener('click', async (e) => {
    const target = e.target as HTMLElement;

    // Handle Copy Raw Button
    const copyRawBtn = target.closest('.copy-raw-btn') as HTMLButtonElement;
    if (copyRawBtn) {
      const rawUrl = copyRawBtn.dataset.rawUrl || '';
      const originalContent = copyRawBtn.innerHTML;
      try {
        const response = await fetch(rawUrl);
        const text = await response.text();
        await navigator.clipboard.writeText(text);
        copyRawBtn.innerHTML = `
          <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><polyline points="20 6 9 17 4 12"/></svg>
          <span class="hidden md:inline">COPIED!</span>
        `;
        setTimeout(() => copyRawBtn.innerHTML = originalContent, 2000);
      } catch (err) {
        console.error('Failed to copy raw content:', err);
      }
      return;
    }

    // Handle Copy Install Button
    const copyBtn = target.closest('.copy-install-btn') as HTMLButtonElement;
    if (copyBtn) {
      const command = copyBtn.dataset.command || '';
      navigator.clipboard.writeText(command);
      const original = copyBtn.innerHTML;
      copyBtn.innerHTML = `
        <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><polyline points="20 6 9 17 4 12"/></svg>
        <span class="hidden md:inline">COPIED!</span>
      `;
      setTimeout(() => copyBtn.innerHTML = original, 2000);
      return;
    }

    // Handle Back to List Button
    if (target.closest('.back-to-list')) {
      viewManager.hideDetail();
      return;
    }

    // Handle Mobile TOC Toggle
    const tocToggle = target.closest('.mobile-toc-toggle') as HTMLButtonElement;
    if (tocToggle) {
      const content = tocToggle.nextElementSibling as HTMLElement;
      const icon = tocToggle.querySelector('.chevron-icon') as HTMLElement;
      const isExpanded = tocToggle.getAttribute('aria-expanded') === 'true';
      
      if (content && content.classList.contains('mobile-toc-content')) {
        const newExpanded = !isExpanded;
        tocToggle.setAttribute('aria-expanded', String(newExpanded));
        content.classList.toggle('hidden', !newExpanded);
        if (icon) {
          icon.style.transform = newExpanded ? 'rotate(180deg)' : 'rotate(0deg)';
        }
      }
      return;
    }

    // Handle Skill Card Click
    const card = target.closest('.skill-card') as HTMLElement;
    if (card) {
      if (target.closest('a')) return;
      const type = card.dataset.type;
      const name = card.dataset.skillName || '';
      if (type === 'personal') {
        viewManager.showDetail(name, card);
      }
      return;
    }
  });

  // 3. Keyboard Accessibility
  document.addEventListener('keydown', (e) => {
    const target = e.target as HTMLElement;
    const card = target.closest('.skill-card') as HTMLElement;
    if (card && (e.key === 'Enter' || e.key === ' ')) {
      const type = card.dataset.type;
      if (type === 'personal') {
        e.preventDefault();
        const name = card.dataset.skillName || '';
        viewManager.showDetail(name, card);
      }
    }
    if (e.key === 'Escape') {
      viewManager.hideDetail();
    }
  });

  // 4. Search Input
  searchInput?.addEventListener('input', (e) => {
    searchManager.filterSkills((e.target as HTMLInputElement).value);
  });

  clearBtn?.addEventListener('click', () => {
    if (searchInput) {
      searchInput.value = '';
      searchManager.filterSkills('');
      searchInput.focus();
    }
  });

  // 5. Browser History Handling
  window.addEventListener('popstate', (e) => {
    const hash = window.location.hash.slice(1);
    if (e.state?.skill) {
      const trigger = document.querySelector(`[data-skill-name="${e.state.skill}"]`) as HTMLElement || document.body;
      viewManager.showDetail(e.state.skill, trigger, true);
    } else if (hash) {
      const detailExists = document.getElementById(`detail-${hash}`);
      if (detailExists) {
        const trigger = document.querySelector(`[data-skill-name="${hash}"]`) as HTMLElement || document.body;
        viewManager.showDetail(hash, trigger, true);
      }
    } else {
      viewManager.hideDetail(true);
    }
  });

  // 6. Initial Load Handle
  window.addEventListener('load', () => {
    const hash = window.location.hash.slice(1);
    if (hash) {
      const detail = document.getElementById(`detail-${hash}`);
      if (detail) {
        const trigger = document.querySelector(`[data-skill-name="${hash}"]`) as HTMLElement || document.body;
        viewManager.showDetail(hash, trigger, true);
      }
    }
  });
}
