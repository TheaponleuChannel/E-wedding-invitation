# Repository Guidelines

## Project Structure & Module Organization

This repository is a dependency-free static wedding invitation. `index.html` provides the document shell and metadata; `js/data.js` contains the `WEDDING_DATA` content configuration; and `js/app.js` renders sections and wires browser interactions. Styles and responsive rules live in `css/styles.css`. Keep photos in `images/` and audio in `audio/`, preserving existing relative paths when replacing assets. Utility scripts are in `tools/`: `make_links.py` creates personalized guest URLs and `make_music.py` generates the background WAV. There is no separate test directory.

## Build, Test, and Development Commands

There is no build or package installation step. From the repository root, run a local server with:

```bash
python3 -m http.server 8080
```

Then open `http://localhost:8080`; opening `index.html` directly also works. Generate guest links with `python3 tools/make_links.py --base https://example.com Alice Bob`. Regenerate the original music with `python3 tools/make_music.py` (this overwrites `audio/wedding-music.wav`).

## Coding Style & Naming Conventions

Use the existing style: two-space indentation in HTML, CSS, and JavaScript; four spaces in Python. Keep JavaScript browser-native and dependency-free. Use descriptive camelCase identifiers in JavaScript, uppercase snake case for the global `WEDDING_DATA`, and lowercase hyphenated filenames for assets. Put invitation copy and wedding-specific values in `js/data.js` rather than duplicating them in render templates. Preserve semantic HTML, accessibility attributes, and responsive behavior when changing components or styles.

## Testing Guidelines

No automated test framework or coverage requirement is configured. For changes, serve the site locally and check the affected sections at desktop and mobile widths. Verify browser console output, navigation, interactive controls, and any updated asset paths. For `tools/` changes, run the relevant script with a small sample input and confirm its output.

## Commit & Pull Request Guidelines

The visible Git history uses short, direct imperative summaries (for example, `Change name groom and bride`). Follow that pattern with a concise sentence-case subject. Pull requests should explain the user-facing change, list relevant manual checks, and include screenshots for visual updates. Link related issues when applicable and call out any changed asset names or configuration values.

## Security & Configuration Tips

Do not commit private guest lists, credentials, or production secrets. Guest-link generation accepts names as command-line inputs or from a local file; use care when sharing generated URLs. Keep external dependencies and remote asset references intentional.
