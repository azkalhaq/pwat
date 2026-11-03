(function initPWA() {
  const pathParts = window.location.pathname.replace(/\.html$/, '').split('/').filter(Boolean);
  
  // Detect if hosted on GitHub Pages project repo or root domain
  const isProjectPage = window.location.hostname.endsWith('github.io') && pathParts.length >= 1;
  const repoName = isProjectPage ? pathParts[0] : '';
  const pageSlug = (isProjectPage ? pathParts[1] : pathParts[0]) || 'index';

  const basePath = repoName ? `${window.location.origin}/${repoName}` : window.location.origin;
  const startUrl = `${basePath}/${pageSlug}`;
  const appTitle = document.title || `PWA - ${pageSlug}`;
  const shortName = pageSlug
    .replace(/[-_]/g, ' ')
    .replace(/\b\w/g, c => c.toUpperCase())
    .slice(0, 12);

  // 1. Create Dynamic Web App Manifest
  const manifest = {
    id: repoName ? `/${repoName}/${pageSlug}` : `/${pageSlug}`,
    name: appTitle,
    short_name: shortName,
    start_url: startUrl,
    scope: `${basePath}/`,
    display: "standalone",
    background_color: "#000000",
    theme_color: "#ff0025",
    icons: [
      {
        src: `${basePath}/assets/icon-192.png`,
        sizes: "192x192",
        type: "image/png",
        purpose: "any maskable"
      },
      {
        src: `${basePath}/assets/icon-512.png`,
        sizes: "512x512",
        type: "image/png",
        purpose: "any maskable"
      }
    ]
  };

  const manifestBlob = new Blob([JSON.stringify(manifest)], { type: 'application/manifest+json' });
  const manifestURL = URL.createObjectURL(manifestBlob);

  const link = document.createElement('link');
  link.rel = 'manifest';
  link.href = manifestURL;
  document.head.appendChild(link);

  // 2. Inject Apple/Mobile Meta Tags for iOS Standalone Support
  const metaTags = [
    { name: 'apple-mobile-web-app-capable', content: 'yes' },
    { name: 'apple-mobile-web-app-status-bar-style', content: 'black-translucent' },
    { name: 'apple-mobile-web-app-title', content: shortName },
    { name: 'mobile-web-app-capable', content: 'yes' }
  ];

  metaTags.forEach(({ name, content }) => {
    if (!document.querySelector(`meta[name="${name}"]`)) {
      const meta = document.createElement('meta');
      meta.name = name;
      meta.content = content;
      document.head.appendChild(meta);
    }
  });

  const appleTouchIcon = document.createElement('link');
  appleTouchIcon.rel = 'apple-touch-icon';
  appleTouchIcon.href = `${basePath}/assets/icon-192.png`;
  document.head.appendChild(appleTouchIcon);

  // 3. Register Shared Service Worker
  if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
      const swPath = repoName ? `/${repoName}/sw.js` : `/sw.js`;
      const swScope = repoName ? `/${repoName}/` : `/`;
      navigator.serviceWorker.register(swPath, { scope: swScope })
        .catch(err => console.error('SW registration failed:', err));
    });
  }
})();
