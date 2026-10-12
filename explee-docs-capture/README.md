# Explee Public API Documentation Capture

Automated capture of the Explee Public API documentation site ([https://api.explee.com/public/api/docs](https://api.explee.com/public/api/docs)).

## Summary
- **Routes Discovered:** 64
- **Routes Captured:** 33
- **Screenshots Succeeded:** 33
- **Failures:** 0
- **Elapsed Time:** 121.1s
- **Date:** 2026-09-29T03:03:51.811Z

## Output Structure
```
explee-docs-capture/
  all-pages-master.json      # Complete combined JSON of all captured pages
  routes.json                # Manifest of all discovered routes & methods
  capture-report.json        # Execution metrics and error logs
  README.md                  # This file
  pages/
    001-introduction/
      full-page.png          # High-fidelity visual screenshot
      capture.json           # Typography, bounding box, parameters, response schema
    002-autogtm-overview/
      full-page.png
      capture.json
    ...
```

## Reproduction Commands
To rerun or extend this capture:
```bash
# Install dependencies
npm install

# Run default capture (Introduction & AutoGTM)
npm run capture

# Force re-capture all existing files
npm run capture -- --force

# Capture all 64 routes across all tags
npm run capture -- --filter all

# Capture specific route
npm run capture -- --only 3
```
