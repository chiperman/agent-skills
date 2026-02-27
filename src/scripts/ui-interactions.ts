import type { SearchManager } from './search';

export function setupUIInteractions(searchManager: SearchManager | null) {
  const backToTopBtn = document.getElementById('back-to-top');
  const searchInput = document.getElementById('skill-search') as HTMLInputElement;
  const clearBtn = document.getElementById('clear-search');

  // 1. Scroll Listener for Back to Top
  let scrollTicking = false;
  const updateBackToTop = () => {
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
  };
  
  window.addEventListener('scroll', updateBackToTop);
  
  // Call it immediately to check if we are already scrolled down
  updateBackToTop();

  backToTopBtn?.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });

  // 2. Global Click Delegation
  const handleGlobalClick = async (e: MouseEvent) => {
    const target = e.target as HTMLElement;

    // Handle TOC Links
    const tocLink = target.closest('.toc-link') as HTMLAnchorElement;
    if (tocLink) {
      e.preventDefault();
      const targetId = tocLink.getAttribute('href')?.slice(1);
      const targetEl = document.getElementById(targetId || '');
      if (targetEl) {
        window.scrollTo({
          top: targetEl.offsetTop - 100, // Offset for top spacing
          behavior: 'smooth'
        });
        // Update URL hash without reload
        history.replaceState(null, '', `#${targetId}`);
      }
      return;
    }

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
  };

  document.addEventListener('click', handleGlobalClick);

  // 3. Search Input
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
}
