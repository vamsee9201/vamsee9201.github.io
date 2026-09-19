# Vamsee Krishna Kotha | Portfolio

Static site (HTML, CSS, vanilla JS). All content lives in `data/*.json`; `assets/js/main.js` renders it.

## Run locally

```bash
python -m http.server 8000   # then open http://localhost:8000
```

## Edit content

| File | What it controls |
|---|---|
| `data/projects.json` | Featured project cards (`projects`) and the compact "Also built" list (`more`) |
| `data/hero.json`, `about.json`, `skills.json` | Hero, bio and stats, skill groups |
| `data/experience.json`, `education.json` | Timeline and certifications |
| `assets/img/projects/*.webp` | Card illustrations, 1200x800, referenced by `image` in `projects.json` |

To add a project card, drop a 1200x800 image in `assets/img/projects/` and add an entry to `projects` in `data/projects.json`.

## Refresh the GitHub activity graph

`data/contributions.json` is a snapshot of the real contribution calendar. Regenerate it with the GitHub CLI:

```bash
gh api graphql -f query='query{user(login:"vamsee9201"){contributionsCollection{contributionCalendar{totalContributions weeks{contributionDays{date contributionCount}}}}}}' \
  --jq '{generated:(now|todate), total:.data.user.contributionsCollection.contributionCalendar.totalContributions, weeks:[.data.user.contributionsCollection.contributionCalendar.weeks[].contributionDays|map(.contributionCount)]}' > data/contributions.json
```

Update `stats.contributions` in `data/hero.json` to match `total`.
