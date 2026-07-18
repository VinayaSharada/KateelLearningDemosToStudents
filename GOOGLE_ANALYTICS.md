# Google Analytics and demo health monitoring

The public GitHub Pages site uses the GA4 property `G-V672XGCRSK`. All public
HTML pages load [`assets/analytics.js`](assets/analytics.js) as the first script
in `<head>`, so the same implementation covers demo usage and client-side
failures everywhere.

Analytics is sent only from the production GitHub Pages host:

`https://vinayasharada.github.io/KateelLearningDemosToStudents/`

Localhost, `file://` pages, and automated browser tests keep events in the local
`dataLayer` for inspection but do not load Google Analytics or send production
traffic.

## Events collected

| Event | When it is sent | Useful dimensions |
| --- | --- | --- |
| `page_view` | GA4 automatically records every public page load | Page path, page title |
| `demo_view` | An interactive demo page reaches DOM ready | `demo_id`, `demo_name`, `demo_category` |
| `demo_ready` | The demo and its page resources finish loading | `demo_id`, `demo_name` |
| `demo_launch` | A visitor selects a Launch Demo link | `target_demo_id`, `action_name` |
| `demo_action` | A visitor uses a button or button-like control inside a demo | `demo_id`, `action_name`, `action_type` |
| `demo_rating` | A visitor selects a local star rating | `demo_id`, `rating_value` |
| `exception` | JavaScript, promise, resource, fetch, or XHR failure is detected | `demo_id`, `error_type`, `error_source`, `description`, `fatal` |

The `exception` event is GA4's recommended event for interrupted application
flow. Duplicate failures are collapsed per page load and capped at 10 events,
which prevents one broken dependency from flooding the property.

No form values, request bodies, stack traces, URL query strings, or fragments
are collected. Error text is truncated and common email addresses, long numeric
values, and identifiers are redacted. Google Signals and ad-personalization
signals are disabled in the tag configuration.

## One-time GA4 reporting setup

The event parameters are collected immediately. To use the custom parameters as
rows and filters in standard reports or Explorations, create these event-scoped
custom dimensions in **Admin → Data display → Custom definitions**:

| Dimension name | Event parameter |
| --- | --- |
| Demo ID | `demo_id` |
| Demo name | `demo_name` |
| Demo category | `demo_category` |
| Page kind | `page_kind` |
| Action name | `action_name` |
| Action type | `action_type` |
| Target demo ID | `target_demo_id` |
| Error type | `error_type` |
| Error source | `error_source` |

Custom dimensions are not retrospective. Create them before relying on an
Exploration, and allow up to 24–48 hours for them to appear in regular reports.
Realtime and DebugView can be used to inspect incoming events sooner.

## Popular demos report

In **Explore → Free form**:

1. Add **Demo name**, **Demo ID**, and **Event name** as dimensions.
2. Add **Event count** and **Total users** as metrics.
3. Put **Demo name** in Rows and the metrics in Values.
4. Filter **Event name** to exactly match `demo_view`.
5. Sort by **Event count** descending.

Use `demo_action` instead of `demo_view` to rank demos by interaction rather
than visits. Use `demo_launch` with **Target demo ID** to see which catalog links
attract the most interest.

## Broken demos report

Create a second free-form Exploration:

1. Add **Demo name**, **Demo ID**, **Error type**, **Error source**, and
   **Event name** as dimensions.
2. Add **Event count** and **Total users** as metrics.
3. Put **Demo name**, **Error type**, and **Error source** in Rows.
4. Filter **Event name** to exactly match `exception`.
5. Sort by **Event count** descending and use a recent date range.

This report identifies failures that real visitors encounter. It cannot find a
broken demo that nobody opens, so it complements the repository's proactive
site checker. `python scripts/verify_site.py` checks links, local resources,
duplicate IDs, JavaScript syntax, and catalog consistency; CI runs it before a
change is deployed.

## Maintenance

Run the installer whenever public HTML pages are added or legacy inline GA tags
need to be migrated:

```bash
python3 add_analytics.py
```

Verify coverage without changing files:

```bash
python3 add_analytics.py --check
```

To change the GA4 property and update all pages in one pass:

```bash
python3 add_analytics.py G-XXXXXXXXXX
```

The measurement ID is stored once in `assets/analytics.js`; public pages should
not contain individual `googletagmanager.com` snippets.
