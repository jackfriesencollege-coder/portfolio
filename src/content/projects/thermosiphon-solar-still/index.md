---
title: 'Passive Thermosiphon Solar Still'
blurb: 'A solar water still built from under $60 of hardware-store parts, producing roughly 3 L/hour with no pump and no moving parts.'
date: 2026-05-10
tags: ['Thermodynamics', 'CAD', 'OpenFOAM', 'Prototyping']
cover: './cover.jpg'
coverAlt: 'The assembled thermosiphon solar still, with elevated bucket reservoir and horizontal collector tubes'
featured: true
role: 'Design and simulation — 4-person team'
timeframe: 'January – May 2026'
---

## The problem

Solar stills are only useful where they're affordable. Anything with a pump adds
cost, a power requirement, and a part that will eventually fail — which defeats
the point in exactly the places a still is most needed.

The constraint was a still that runs on sunlight alone, from parts someone could
actually source, for under $60.

## How it works

The design drives its own circulation by **thermosiphon**. Water in the collector
warms, becomes less dense, and rises; cooler water sinks to replace it. That
density difference is the entire pump.

Which means the geometry *is* the pump. Get the height difference between
reservoir and collector wrong, or the tube runs wrong, and the loop simply
doesn't establish — there's no motor to cover for a bad layout.

![The assembled still, showing the elevated reservoir and the horizontal collector array](./cover.jpg)

The reservoir is a **Home Depot bucket**, elevated on a timber A-frame to give
the loop the head it needs. The collector is the horizontal tube array at the
bottom, connected by the blue tubing running between them.

![The still during assembly in the garage](./build.jpg)

![The horizontal collector tube array](./collector.jpg)

## Validating before building

Because the whole design depends on convection actually establishing itself, we
ran **OpenFOAM** simulations to confirm the convection-driven flow before
committing to a physical build. A thermosiphon that doesn't siphon is a pile of
tubing, and we wanted to know which geometry worked before we cut anything.

![Components laid out during the build](./components.jpg)

## Result

- **~3 L/hour** of water output
- **Under $60** in parts, all from accessible suppliers
- **No pump, no moving parts** — passive from end to end

We presented the finished still at an expo to judges, classmates, and members of
the community. Our professor consistently ranked the project at the top of the
class.

![Presenting the still at the end-of-semester expo](./expo.jpg)
