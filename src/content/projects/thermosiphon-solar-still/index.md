---
title: 'Passive Thermosiphon Solar Still'
blurb: 'A solar water still built from under $60 of accessible parts, producing roughly 3 L/hour with no pump and no moving parts.'
date: 2026-05-10
tags: ['Thermodynamics', 'CAD', 'OpenFOAM', 'Prototyping']
featured: true
role: 'Design and simulation — 4-person team'
timeframe: 'January – May 2026'
---

## The problem

Solar stills are only useful where they're affordable. Anything with a pump adds
cost, power draw, and a part that will eventually fail — which defeats the point
in exactly the places a still is most needed.

The design constraint was a still that runs on sunlight alone, built from parts
someone could actually source, for under $60.

## What I did

Working on a four-person team, I helped research, model, and prototype a still
that drives its own circulation by **thermosiphon** — the density difference
between heated and cooled water moves the fluid, so no pump is required.

Because the whole design depends on that convection loop actually establishing
itself, we ran **OpenFOAM** simulations to validate the convection-driven flow
before committing to a physical build, then prototyped and tested the result.

## Result

- **~3 L/hour** of water output
- **Under $60** in parts, all from accessible suppliers
- **No pump, no moving parts** — passive operation start to finish
