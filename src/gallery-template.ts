/**
 * Gallery page template - renders a complete self-contained HTML page
 * with inline CSS and JavaScript for the media gallery.
 *
 * Security note: All user-controlled strings rendered via innerHTML are
 * escaped through escapeHtml(). The token is sanitized before embedding.
 * The page content comes exclusively from our own trusted API endpoint.
 */
export function renderGalleryPage(token: string): string {
	// Escape the token for safe embedding in JS
	const safeToken = token.replace(/[\\'"<>&]/g, (c) => {
		const map: Record<string, string> = {
			"'": "\\'",
			'"': '\\"',
			"\\": "\\\\",
			"&": "\\x26",
			"<": "\\x3C",
			">": "\\x3E",
		};
		return map[c] ?? c;
	});

	return `<!DOCTYPE html>
<html lang="sk">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<meta name="referrer" content="no-referrer">
<title>Svadobn\u00e1 Gal\u00e9ria</title>
<style>
/* ===== CSS Custom Properties ===== */
:root {
  --bg-primary: #ffffff;
  --bg-secondary: #f8f7f5;
  --bg-tertiary: #f0eeeb;
  --text-primary: #1a1a1a;
  --text-secondary: #5a5a5a;
  --text-tertiary: #8a8a8a;
  --border-color: #e5e3df;
  --border-subtle: #f0eeeb;
  --overlay-bg: rgba(0, 0, 0, 0.92);
  --card-shadow: 0 1px 3px rgba(0, 0, 0, 0.06);
  --card-shadow-hover: 0 8px 24px rgba(0, 0, 0, 0.12);
  --accent: #c4956a;
  --accent-soft: #f5ede5;
  --font-sans: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif;
  --font-serif: 'Georgia', 'Times New Roman', 'Palatino Linotype', serif;
  --radius: 8px;
  --transition: 0.2s ease;
}

@media (prefers-color-scheme: dark) {
  :root {
    --bg-primary: #0a0a0a;
    --bg-secondary: #141414;
    --bg-tertiary: #1e1e1e;
    --text-primary: #e8e8e8;
    --text-secondary: #a0a0a0;
    --text-tertiary: #666666;
    --border-color: #2a2a2a;
    --border-subtle: #1e1e1e;
    --overlay-bg: rgba(0, 0, 0, 0.95);
    --card-shadow: 0 1px 3px rgba(0, 0, 0, 0.3);
    --card-shadow-hover: 0 8px 24px rgba(0, 0, 0, 0.5);
    --accent: #d4a574;
    --accent-soft: #2a2218;
  }
}

/* ===== Reset & Base ===== */
*, *::before, *::after {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
}

body {
  font-family: var(--font-sans);
  background: var(--bg-primary);
  color: var(--text-primary);
  line-height: 1.6;
  min-height: 100vh;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

/* ===== Header ===== */
.gallery-header {
  text-align: center;
  padding: 48px 24px 32px;
  border-bottom: 1px solid var(--border-subtle);
  background: var(--bg-secondary);
}

.gallery-header h1 {
  font-family: var(--font-serif);
  font-size: 2.25rem;
  font-weight: 400;
  letter-spacing: 0.02em;
  color: var(--text-primary);
  margin-bottom: 8px;
}

.gallery-header .media-count {
  font-size: 0.95rem;
  color: var(--text-secondary);
  font-weight: 300;
}

/* ===== Container ===== */
.gallery-container {
  max-width: 1400px;
  margin: 0 auto;
  padding: 32px 24px 64px;
}

/* ===== Loading State ===== */
.loading-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 120px 24px;
}

.spinner {
  width: 40px;
  height: 40px;
  border: 3px solid var(--border-color);
  border-top-color: var(--accent);
  border-radius: 50%;
  animation: spin 0.8s linear infinite;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

.loading-state p {
  margin-top: 20px;
  color: var(--text-secondary);
  font-size: 1rem;
}

/* ===== Error State ===== */
.error-state {
  text-align: center;
  padding: 120px 24px;
}

.error-state p {
  color: var(--text-secondary);
  font-size: 1.05rem;
  margin-bottom: 24px;
}

.retry-btn {
  display: inline-block;
  padding: 10px 28px;
  background: var(--accent);
  color: #fff;
  border: none;
  border-radius: var(--radius);
  font-size: 0.95rem;
  cursor: pointer;
  transition: opacity var(--transition);
}

.retry-btn:hover {
  opacity: 0.85;
}

/* ===== Empty State ===== */
.empty-state {
  text-align: center;
  padding: 120px 24px;
}

.empty-state .empty-icon {
  font-size: 3.5rem;
  margin-bottom: 16px;
  opacity: 0.5;
}

.empty-state p {
  color: var(--text-secondary);
  font-size: 1.05rem;
}

/* ===== Group Section ===== */
.group-section {
  margin-bottom: 48px;
}

.group-section:last-child {
  margin-bottom: 0;
}

.group-header {
  font-family: var(--font-serif);
  font-size: 1.35rem;
  font-weight: 400;
  color: var(--text-primary);
  padding-bottom: 12px;
  margin-bottom: 20px;
  border-bottom: 1px solid var(--border-color);
}

.group-header .group-count {
  color: var(--text-tertiary);
  font-family: var(--font-sans);
  font-size: 0.9rem;
  font-weight: 300;
}

/* ===== Media Grid ===== */
.media-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 12px;
}

@media (max-width: 1024px) {
  .media-grid {
    grid-template-columns: repeat(3, 1fr);
  }
}

@media (max-width: 640px) {
  .media-grid {
    grid-template-columns: repeat(2, 1fr);
    gap: 8px;
  }

  .gallery-header {
    padding: 32px 16px 24px;
  }

  .gallery-header h1 {
    font-size: 1.75rem;
  }

  .gallery-container {
    padding: 24px 12px 48px;
  }

  .group-header {
    font-size: 1.15rem;
  }
}

/* ===== Grid Item ===== */
.grid-item {
  position: relative;
  aspect-ratio: 1 / 1;
  border-radius: var(--radius);
  overflow: hidden;
  cursor: pointer;
  background: var(--bg-tertiary);
  box-shadow: var(--card-shadow);
  transition: transform var(--transition), box-shadow var(--transition);
  outline: none;
}

.grid-item:hover,
.grid-item:focus-visible {
  transform: scale(1.03);
  box-shadow: var(--card-shadow-hover);
}

.grid-item:focus-visible {
  outline: 2px solid var(--accent);
  outline-offset: 2px;
}

.grid-item img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
  transition: opacity var(--transition);
}

/* ===== Video Overlay ===== */
.video-overlay {
  position: absolute;
  inset: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  pointer-events: none;
}

.play-icon {
  width: 48px;
  height: 48px;
  background: rgba(0, 0, 0, 0.55);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: background var(--transition);
}

.grid-item:hover .play-icon {
  background: rgba(0, 0, 0, 0.7);
}

.play-icon svg {
  width: 20px;
  height: 20px;
  fill: #fff;
  margin-left: 3px;
}

.video-duration {
  position: absolute;
  bottom: 6px;
  right: 6px;
  background: rgba(0, 0, 0, 0.7);
  color: #fff;
  font-size: 0.75rem;
  padding: 2px 6px;
  border-radius: 4px;
  pointer-events: none;
  font-variant-numeric: tabular-nums;
}

/* ===== Lightbox ===== */
.lightbox {
  position: fixed;
  inset: 0;
  z-index: 1000;
  background: var(--overlay-bg);
  display: flex;
  align-items: center;
  justify-content: center;
  opacity: 0;
  transition: opacity 0.25s ease;
  touch-action: pan-y;
}

.lightbox.active {
  opacity: 1;
}

.lightbox-content {
  position: relative;
  max-width: 90vw;
  max-height: 85vh;
  display: flex;
  align-items: center;
  justify-content: center;
}

.lightbox-content img,
.lightbox-content video {
  max-width: 90vw;
  max-height: 85vh;
  object-fit: contain;
  border-radius: 4px;
  display: block;
}

.lightbox-content .lightbox-spinner {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
}

.lightbox-close {
  position: absolute;
  top: 16px;
  right: 16px;
  z-index: 1010;
  width: 44px;
  height: 44px;
  background: rgba(255, 255, 255, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 50%;
  color: #fff;
  font-size: 1.5rem;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: background var(--transition);
  line-height: 1;
}

.lightbox-close:hover,
.lightbox-close:focus-visible {
  background: rgba(255, 255, 255, 0.25);
}

.lightbox-close:focus-visible {
  outline: 2px solid #fff;
  outline-offset: 2px;
}

.lightbox-nav {
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  z-index: 1010;
  width: 48px;
  height: 48px;
  background: rgba(255, 255, 255, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.15);
  border-radius: 50%;
  color: #fff;
  font-size: 1.5rem;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: background var(--transition);
  line-height: 1;
}

.lightbox-nav:hover,
.lightbox-nav:focus-visible {
  background: rgba(255, 255, 255, 0.25);
}

.lightbox-nav:focus-visible {
  outline: 2px solid #fff;
  outline-offset: 2px;
}

.lightbox-prev {
  left: 16px;
}

.lightbox-next {
  right: 16px;
}

.lightbox-counter {
  position: absolute;
  bottom: 20px;
  left: 50%;
  transform: translateX(-50%);
  z-index: 1010;
  color: rgba(255, 255, 255, 0.8);
  font-size: 0.9rem;
  font-variant-numeric: tabular-nums;
  background: rgba(0, 0, 0, 0.4);
  padding: 6px 16px;
  border-radius: 20px;
  user-select: none;
}

@media (max-width: 640px) {
  .lightbox-nav {
    width: 40px;
    height: 40px;
    font-size: 1.25rem;
  }

  .lightbox-prev {
    left: 8px;
  }

  .lightbox-next {
    right: 8px;
  }

  .lightbox-close {
    top: 12px;
    right: 12px;
  }

  .lightbox-content img,
  .lightbox-content video {
    max-width: 95vw;
    max-height: 80vh;
  }
}
</style>
</head>
<body>

<header class="gallery-header">
  <h1>Svadobn\u00e1 Gal\u00e9ria</h1>
  <p class="media-count" id="headerCount"></p>
</header>

<main class="gallery-container" id="galleryMain">
  <div class="loading-state" id="loadingState">
    <div class="spinner"></div>
    <p>Na\u010d\u00edtavam gal\u00e9riu...</p>
  </div>
</main>

<!-- Lightbox -->
<div class="lightbox" id="lightbox" role="dialog" aria-modal="true" aria-label="Prehliadka m\u00e9di\u00ed" style="display:none;">
  <button class="lightbox-close" id="lightboxClose" aria-label="Zavrie\u0165">&times;</button>
  <button class="lightbox-nav lightbox-prev" id="lightboxPrev" aria-label="Predch\u00e1dzaj\u00face">&lsaquo;</button>
  <button class="lightbox-nav lightbox-next" id="lightboxNext" aria-label="Nasleduj\u00face">&rsaquo;</button>
  <div class="lightbox-content" id="lightboxContent"></div>
  <div class="lightbox-counter" id="lightboxCounter"></div>
</div>

<script>
(function() {
  'use strict';

  var TOKEN = '${safeToken}';
  var allMedia = [];
  var currentIndex = -1;
  var touchStartX = 0;
  var touchEndX = 0;
  var SWIPE_THRESHOLD = 50;

  // ===== DOM refs =====
  var mainEl = document.getElementById('galleryMain');
  var headerCountEl = document.getElementById('headerCount');
  var lightboxEl = document.getElementById('lightbox');
  var lightboxContentEl = document.getElementById('lightboxContent');
  var lightboxCounterEl = document.getElementById('lightboxCounter');
  var lightboxCloseBtn = document.getElementById('lightboxClose');
  var lightboxPrevBtn = document.getElementById('lightboxPrev');
  var lightboxNextBtn = document.getElementById('lightboxNext');

  // ===== Utility =====
  function formatDuration(seconds) {
    var mins = Math.floor(seconds / 60);
    var secs = seconds % 60;
    return mins + ':' + (secs < 10 ? '0' : '') + secs;
  }

  function escapeHtml(str) {
    var div = document.createElement('div');
    div.appendChild(document.createTextNode(str));
    return div.innerHTML;
  }

  // ===== Fetch & Render =====
  function fetchGallery() {
    showLoading();

    fetch('/api/gallery/media?token=' + encodeURIComponent(TOKEN))
      .then(function(res) {
        if (res.status === 401) {
          showError('Neplatn\\u00fd pr\\u00edstupov\\u00fd token.', false);
          return null;
        }
        if (!res.ok) {
          throw new Error('HTTP ' + res.status);
        }
        return res.json();
      })
      .then(function(data) {
        if (data === null) return;
        renderGallery(data.groups || []);
      })
      .catch(function() {
        showError('Nepodarilo sa na\\u010d\\u00edta\\u0165 gal\\u00e9riu. Sk\\u00faste to znova.', true);
      });
  }

  function showLoading() {
    if (!mainEl) return;
    while (mainEl.firstChild) mainEl.removeChild(mainEl.firstChild);

    var wrapper = document.createElement('div');
    wrapper.className = 'loading-state';

    var spinnerDiv = document.createElement('div');
    spinnerDiv.className = 'spinner';
    wrapper.appendChild(spinnerDiv);

    var textP = document.createElement('p');
    textP.textContent = 'Na\\u010d\\u00edtavam gal\\u00e9riu...';
    wrapper.appendChild(textP);

    mainEl.appendChild(wrapper);
  }

  function showError(message, showRetry) {
    if (!mainEl) return;
    while (mainEl.firstChild) mainEl.removeChild(mainEl.firstChild);
    if (headerCountEl) headerCountEl.textContent = '';

    var wrapper = document.createElement('div');
    wrapper.className = 'error-state';

    var msgP = document.createElement('p');
    msgP.textContent = message;
    wrapper.appendChild(msgP);

    if (showRetry) {
      var btn = document.createElement('button');
      btn.className = 'retry-btn';
      btn.textContent = 'Sk\\u00fasi\\u0165 znova';
      btn.addEventListener('click', fetchGallery);
      wrapper.appendChild(btn);
    }

    mainEl.appendChild(wrapper);
  }

  function renderGallery(groups) {
    if (!mainEl) return;

    // Build flat media list for lightbox navigation
    allMedia = [];
    var totalCount = 0;
    for (var g = 0; g < groups.length; g++) {
      var grp = groups[g];
      for (var m = 0; m < grp.media.length; m++) {
        allMedia.push(grp.media[m]);
        totalCount++;
      }
    }

    // Update header count
    if (headerCountEl) {
      if (totalCount === 0) {
        headerCountEl.textContent = '';
      } else if (totalCount === 1) {
        headerCountEl.textContent = '1 m\\u00e9dium';
      } else if (totalCount < 5) {
        headerCountEl.textContent = totalCount + ' m\\u00e9di\\u00e1';
      } else {
        headerCountEl.textContent = totalCount + ' m\\u00e9di\\u00ed';
      }
    }

    // Clear container
    while (mainEl.firstChild) mainEl.removeChild(mainEl.firstChild);

    // Empty state
    if (groups.length === 0 || totalCount === 0) {
      var emptyDiv = document.createElement('div');
      emptyDiv.className = 'empty-state';

      var iconDiv = document.createElement('div');
      iconDiv.className = 'empty-icon';
      iconDiv.textContent = '\\ud83d\\udcf7';
      emptyDiv.appendChild(iconDiv);

      var emptyP = document.createElement('p');
      emptyP.textContent = '\\u017diadne m\\u00e9di\\u00e1 neboli nahran\\u00e9';
      emptyDiv.appendChild(emptyP);

      mainEl.appendChild(emptyDiv);
      return;
    }

    // Build sections using DOM API
    var flatIndex = 0;
    for (var gi = 0; gi < groups.length; gi++) {
      var group = groups[gi];
      var section = document.createElement('section');
      section.className = 'group-section';

      var h2 = document.createElement('h2');
      h2.className = 'group-header';
      h2.appendChild(document.createTextNode(group.groupName + ' '));
      var countSpan = document.createElement('span');
      countSpan.className = 'group-count';
      countSpan.textContent = '(' + group.mediaCount + ')';
      h2.appendChild(countSpan);
      section.appendChild(h2);

      var grid = document.createElement('div');
      grid.className = 'media-grid';

      for (var mi = 0; mi < group.media.length; mi++) {
        var item = group.media[mi];
        var isVideo = item.mediaType === 'video';

        var gridItem = document.createElement('div');
        gridItem.className = 'grid-item';
        gridItem.setAttribute('tabindex', '0');
        gridItem.setAttribute('role', 'button');
        gridItem.setAttribute('aria-label', item.fileName);
        gridItem.setAttribute('data-index', String(flatIndex));

        var img = document.createElement('img');
        img.src = '/api/photos/' + item.id + '/thumbnail';
        img.alt = item.fileName;
        img.loading = 'lazy';
        gridItem.appendChild(img);

        if (isVideo) {
          var overlay = document.createElement('div');
          overlay.className = 'video-overlay';

          var playIcon = document.createElement('div');
          playIcon.className = 'play-icon';

          var svgNS = 'http://www.w3.org/2000/svg';
          var svg = document.createElementNS(svgNS, 'svg');
          svg.setAttribute('viewBox', '0 0 24 24');
          var polygon = document.createElementNS(svgNS, 'polygon');
          polygon.setAttribute('points', '6,3 20,12 6,21');
          svg.appendChild(polygon);
          playIcon.appendChild(svg);
          overlay.appendChild(playIcon);
          gridItem.appendChild(overlay);

          if (item.duration) {
            var durDiv = document.createElement('div');
            durDiv.className = 'video-duration';
            durDiv.textContent = formatDuration(item.duration);
            gridItem.appendChild(durDiv);
          }
        }

        // Attach event listeners
        (function(idx) {
          gridItem.addEventListener('click', function() {
            openLightbox(idx);
          });
          gridItem.addEventListener('keydown', function(e) {
            if (e.key === 'Enter' || e.key === ' ') {
              e.preventDefault();
              openLightbox(idx);
            }
          });
        })(flatIndex);

        grid.appendChild(gridItem);
        flatIndex++;
      }

      section.appendChild(grid);
      mainEl.appendChild(section);
    }
  }

  // ===== Lightbox =====
  var focusableSelector = '#lightboxClose, #lightboxPrev, #lightboxNext';
  var previouslyFocused = null;

  function openLightbox(index) {
    if (index < 0 || index >= allMedia.length) return;
    currentIndex = index;
    previouslyFocused = document.activeElement;

    lightboxEl.style.display = 'flex';
    // Trigger reflow for transition
    void lightboxEl.offsetWidth;
    lightboxEl.classList.add('active');

    document.body.style.overflow = 'hidden';
    showMedia(currentIndex);
    lightboxCloseBtn.focus();
  }

  function closeLightbox() {
    lightboxEl.classList.remove('active');
    setTimeout(function() {
      lightboxEl.style.display = 'none';
      while (lightboxContentEl.firstChild) lightboxContentEl.removeChild(lightboxContentEl.firstChild);
      document.body.style.overflow = '';
      if (previouslyFocused && previouslyFocused.focus) {
        previouslyFocused.focus();
      }
    }, 250);
    currentIndex = -1;
  }

  function showMedia(index) {
    var item = allMedia[index];
    if (!item) return;

    // Update counter
    lightboxCounterEl.textContent = (index + 1) + ' / ' + allMedia.length;

    // Update nav visibility
    lightboxPrevBtn.style.display = index === 0 ? 'none' : 'flex';
    lightboxNextBtn.style.display = index === allMedia.length - 1 ? 'none' : 'flex';

    // Clear content
    while (lightboxContentEl.firstChild) lightboxContentEl.removeChild(lightboxContentEl.firstChild);

    if (item.mediaType === 'video') {
      var video = document.createElement('video');
      video.controls = true;
      video.autoplay = true;
      video.playsInline = true;
      video.muted = true;
      video.src = '/api/photos/' + item.id + '/full';
      video.addEventListener('click', function(e) { e.stopPropagation(); });
      lightboxContentEl.appendChild(video);
    } else {
      // Show thumbnail first, then load full resolution
      var thumbImg = document.createElement('img');
      thumbImg.src = '/api/photos/' + item.id + '/thumbnail';
      thumbImg.alt = item.fileName;
      thumbImg.addEventListener('click', function(e) { e.stopPropagation(); });
      lightboxContentEl.appendChild(thumbImg);

      // Show spinner
      var spinnerWrapper = document.createElement('div');
      spinnerWrapper.className = 'lightbox-spinner';
      var spinnerDiv = document.createElement('div');
      spinnerDiv.className = 'spinner';
      spinnerWrapper.appendChild(spinnerDiv);
      lightboxContentEl.appendChild(spinnerWrapper);

      // Load full resolution
      var fullImg = new Image();
      fullImg.onload = function() {
        // Only swap if we are still viewing the same item
        if (currentIndex === index && lightboxContentEl.contains(thumbImg)) {
          thumbImg.src = fullImg.src;
          if (spinnerWrapper.parentNode) {
            spinnerWrapper.parentNode.removeChild(spinnerWrapper);
          }
        }
      };
      fullImg.onerror = function() {
        // Remove spinner on error, keep thumbnail
        if (spinnerWrapper.parentNode) {
          spinnerWrapper.parentNode.removeChild(spinnerWrapper);
        }
      };
      fullImg.src = '/api/photos/' + item.id + '/full';
    }
  }

  function navigatePrev() {
    if (currentIndex > 0) {
      currentIndex--;
      showMedia(currentIndex);
    }
  }

  function navigateNext() {
    if (currentIndex < allMedia.length - 1) {
      currentIndex++;
      showMedia(currentIndex);
    }
  }

  // ===== Event Listeners =====
  lightboxCloseBtn.addEventListener('click', closeLightbox);
  lightboxPrevBtn.addEventListener('click', function(e) {
    e.stopPropagation();
    navigatePrev();
  });
  lightboxNextBtn.addEventListener('click', function(e) {
    e.stopPropagation();
    navigateNext();
  });

  // Click outside media to close
  lightboxEl.addEventListener('click', function(e) {
    if (e.target === lightboxEl) {
      closeLightbox();
    }
  });

  // Keyboard navigation
  document.addEventListener('keydown', function(e) {
    if (currentIndex === -1) return;

    if (e.key === 'Escape') {
      closeLightbox();
    } else if (e.key === 'ArrowLeft') {
      e.preventDefault();
      navigatePrev();
    } else if (e.key === 'ArrowRight') {
      e.preventDefault();
      navigateNext();
    } else if (e.key === 'Tab') {
      // Focus trap
      var focusableEls = lightboxEl.querySelectorAll(focusableSelector);
      var visibleEls = [];
      for (var i = 0; i < focusableEls.length; i++) {
        if (focusableEls[i].style.display !== 'none') {
          visibleEls.push(focusableEls[i]);
        }
      }
      if (visibleEls.length === 0) return;

      var firstEl = visibleEls[0];
      var lastEl = visibleEls[visibleEls.length - 1];

      if (e.shiftKey) {
        if (document.activeElement === firstEl) {
          e.preventDefault();
          lastEl.focus();
        }
      } else {
        if (document.activeElement === lastEl) {
          e.preventDefault();
          firstEl.focus();
        }
      }
    }
  });

  // Touch swipe support
  lightboxEl.addEventListener('touchstart', function(e) {
    touchStartX = e.changedTouches[0].screenX;
  }, { passive: true });

  lightboxEl.addEventListener('touchend', function(e) {
    touchEndX = e.changedTouches[0].screenX;
    var diff = touchStartX - touchEndX;
    if (Math.abs(diff) > SWIPE_THRESHOLD) {
      if (diff > 0) {
        navigateNext();
      } else {
        navigatePrev();
      }
    }
  }, { passive: true });

  // ===== Init =====
  fetchGallery();
})();
</script>

</body>
</html>`;
}
