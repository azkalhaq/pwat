# Multi-PWA Prototype Hosting for GitHub Pages

Host multiple standalone HTML prototypes as individual installable Progressive Web Apps (PWAs) on GitHub Pages with clean URLs.

## How It Works
1. **Drop any `.html` file into the `prototype/` folder** (e.g., `prototype/inbox.html` or `prototype/mytelkomsel-snackbar.html`).
2. **Zero Manual Configuration Needed**: During deployment, the GitHub Actions workflow (`.github/workflows/deploy.yml`) automatically copies all HTML files from `prototype/` to the root artifact and injects `<script src="./pwa-loader.js"></script>` before `</head>` if it isn't already included.
3. **Clean URLs**: GitHub Pages serves each file without the folder prefix or `.html` extension:
   - `prototype/inbox.html` -> `https://<username>.github.io/<repo-name>/inbox`
   - `prototype/mytelkomsel-snackbar.html` -> `https://<username>.github.io/<repo-name>/mytelkomsel-snackbar`
4. **Isolated PWA Manifest**: `pwa-loader.js` dynamically reads the page's `<title>` and path to inject a unique Web App Manifest (`start_url`, `id`, and icons) and registers `sw.js`.

## Quick Setup on GitHub
1. Create a new repository on GitHub (e.g., `pwa-translator`) and push these files to the `main` branch.
2. Go to **Settings -> Pages**.
3. Under **Build and deployment > Source**, select **GitHub Actions**.
4. Once the workflow finishes running, visit your GitHub Pages URL!
