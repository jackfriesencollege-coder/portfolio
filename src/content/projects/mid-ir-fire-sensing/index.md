---
title: 'Mid-IR Optical Fire Detection'
blurb: 'Prototype optical sensing system isolating the 2 µm and 4 µm bands, with a swept detector arc built to find the point of peak photodiode response.'
date: 2026-05-05
tags: ['Optics', 'Sensing', 'Research', 'Prototyping']
cover: './cover.jpg'
coverAlt: 'Illuminated 3D-printed light shield on the optical breadboard, with the printed detector arc in the foreground'
featured: false
role: 'Undergraduate researcher — SURE Research program'
timeframe: 'January – May 2026'
---

## The problem

Fire has a distinctive infrared signature, but picking it out of everything else
emitting in the same region is the hard part. Detecting it early — without the
false alarms that make a detector useless — means responding to specific narrow
bands rather than to broad IR intensity.

The target bands were **2 µm and 4 µm**, isolated with photodiodes, lenses, and
prisms.

## The optical bench

Working through CSU's **SURE Research** program alongside graduate students and
research faculty, the work happened on an optical breadboard where source,
dispersing optics, and detector could all be repositioned independently.

![The optical bench with source, mounts, power supply, and detector electronics](./optical-bench.jpg)

![Wider view of the lab setup](./lab-setup.jpg)

## Controlling stray light

An early problem was light reaching the detector by paths we hadn't intended —
reflections off the breadboard, the mounts, and everything else in the room.
Stray light doesn't just add noise; it adds a *signal* that looks real.

So we enclosed the source in a printed shield to block those reflection paths.

![The illuminated light shield on the breadboard](./cover.jpg)

That shield ran into a materials problem worth recording: the source put out
enough heat to threaten the **PLA** it was printed from. We lined the inside
with tin foil, which both reflected the heat back and stopped the plastic
reaching temperatures it couldn't survive.

It's a small fix, but it's a good example of a physical constraint that never
appears in the optical design — the optics don't care what the enclosure is made
of, right up until the enclosure melts.

## Finding the detector's best position

Once the light is dispersed, the wavelengths are smeared out across a physical
distance. The photodiode has to sit at the position where the band you care
about actually lands — and getting that by calculation alone is optimistic.

![Cardboard card held in the beam path showing the dispersed light landing as a distinct band](./dispersed-light.jpg)

To find it empirically we built a **curved arc** that sweeps the photodiode
through the smeared light, so we could scan across positions and look for the
local maximum in response rather than guess at it.

![The printed detector arc on the optical breadboard alongside optics mounts and control electronics](./goniometer-arc.jpg)

That turns detector placement into a measurement instead of an assumption: sweep
the arc, watch the signal, and put the photodiode at the peak.

## Simulation and signal

The optical path was checked against a ray-tracing simulation, so the geometry
on the bench could be compared against where the rays were predicted to go.

![Ray-tracing simulation of the optical path](./ray-trace.jpg)

On the electronics side, the photodiode output needed conditioning before it was
readable.

![The detector amplifier board](./detector-board.jpg)

![Detector response captured during a sweep](./signal-trace.jpg)

## Result

A working benchtop prototype, and a much better feel for how optical design
decisions — element choice, geometry, alignment, and stray light you didn't plan
for — propagate into what a sensor can and can't tell you.
