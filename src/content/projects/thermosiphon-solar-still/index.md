---
title: 'Passive Thermosiphon Solar Still'
blurb: 'A solar water still built from under $60 of hardware-store parts, driving its own circulation by convection alone — no pump, no moving parts.'
date: 2026-05-10
tags: ['Thermodynamics', 'CAD', 'OpenFOAM', 'Prototyping']
cover: './openfoam.png'
coverAlt: 'OpenFOAM simulation of convective flow through the serpentine collector tubing'
featured: true
featuredOrder: 2
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
reservoir and collector wrong, or the tube runs wrong, and the loop never
establishes — there's no motor to cover for a bad layout.

![Early hand sketch of the thermosiphon still, showing the hot and cold sides of the collector, the vapour path, and the condenser](./concept-sketch.jpg)

That sketch is where the layout got settled: a serpentine collector run in
½-inch PVC, driven by the pressure difference the sun's temperature gradient
creates, feeding a tank with a one-way vapour path to a condenser.

![CAD render of the tank and collector assembly](./cad-render.png)

## Simulating before building

Because the whole design depends on convection actually establishing itself, we
modelled the collector in **OpenFOAM** before committing to a build. A
thermosiphon that doesn't siphon is just a pile of tubing.

![OpenFOAM simulation of flow through the serpentine collector](./openfoam.png)

The simulation showed the convective flow developing through the serpentine run,
and put the expected output at roughly **3 L/hour** — comfortably past the 2 L
per day the requirement asked for.

## Building it

The collector is a serpentine run of PVC on a timber frame; the reservoir is a
Home Depot bucket, elevated to give the loop the head it needs.

![The collector frame under construction in the garage](./build.jpg)

![The horizontal collector tube array](./collector.jpg)

![The assembled still with the elevated bucket reservoir](./assembled.jpg)

## Result

- **~3 L/hour** predicted output — from the OpenFOAM model, not a measured yield
- **Under $60** in parts, all from a hardware store
- **No pump, no moving parts** — passive from end to end
- Convective flow and pressure containment both **confirmed on the physical
  prototype**

Worth being precise about which of those came from where: the flow behaviour and
the sealing were verified on the build, but the 3 L/hour figure is the
simulation's prediction. A full sunrise-to-sunset yield test on the physical
still is the piece still missing.

We presented at an end-of-semester expo to judges, classmates, and members of the
community. Our professor consistently ranked the project at the top of the class.

![The four-person team with the still at the expo](./expo.jpg)
