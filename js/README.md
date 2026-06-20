# Demo Rating System

This script adds a simple 5-star rating system to demo pages.

## Usage

1. Include this script in your demo's index.html:
```html
<script src="../../js/demo-rating.js"></script>
<link rel="stylesheet" href="../../js/demo-rating.css">
```

2. Add the rating widget to your page:
```html
<div class="demo-rating" data-demo-id="treasury-control-tower">
  <div class="rating-stars">
    <span data-value="1">☆</span>
    <span data-value="2">☆</span>
    <span data-value="3">☆</span>
    <span data-value="4">☆</span>
    <span data-value="5">☆</span>
  </div>
  <div class="rating-info">
    <span class="average">Loading...</span>
    <span class="count">(0 ratings)</span>
  </div>
</div>
```

## Features
- localStorage-based (no backend required)
- Star animation on hover
- Average calculation
- Rating count display