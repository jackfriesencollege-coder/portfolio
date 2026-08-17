---
title: 'Walking AT-ST'
blurb: 'A scale bipedal walker taken from LEGO mechanism study to Fusion 360 assembly to 3D-printed servo hardware — including a hand-derived inverse kinematics solution for the legs.'
date: 2026-07-01
tags: ['Fusion 360', 'Kinematics', 'Robotics', '3D Printing']
cover: './cover.jpg'
coverAlt: 'Fusion 360 render of the AT-ST leg assembly and body'
featured: true
role: 'Personal project'
timeframe: 'Summer 2023 – present'
---

## The problem

A two-legged walker is a hard mechanism. It has to carry its own weight, stay
balanced through a gait, and do it with linkages and actuators that fit inside a
shape nobody designed with statics in mind. The AT-ST's silhouette is all
overhanging body and thin, reverse-jointed legs — which is exactly the wrong
mass distribution for walking, and exactly why it's an interesting thing to try
to build.

This has been my long-running project since 2023, and it's where most of what I
know about mechanisms and electronics actually came from.

## Prototyping the mechanism in LEGO

I didn't start in CAD. Before committing to printed geometry I built the leg
mechanism in LEGO Technic driven by an EV3 controller, because it let me change
link lengths and joint positions in minutes instead of hours.

![LEGO Technic and EV3 prototype of the walker standing on a table](./lego-prototype.jpg)

The point wasn't to make LEGO walk well. It was to find out which linkage
arrangement produced a usable foot path before any of it was expensive to
change.

![Close detail of the LEGO leg linkage arrangement](./lego-linkage.jpg)

## The kinematics

Once the leg had a defined geometry, the question became how to actually
command it. Each leg is a two-link chain, so driving the foot to a point means
solving backwards from the target position to the two joint angles.

I worked the inverse kinematics out by hand — law of cosines for the knee angle,
then an arctangent for the hip, using the link lengths straight off the CAD
model.

![Handwritten inverse kinematics derivation for the two-link leg, with dimensions taken from the CAD model](./ik-derivation.jpg)

That sheet is the bridge between the mechanical design and the code. Without it
the servos are just three arbitrary angles; with it, the foot goes where you
tell it.

## CAD

With the geometry settled, the whole thing was modelled as an assembly in
Fusion 360 — body, hips, the reverse-jointed legs, and the clawed feet.

![Fusion 360 render of the full leg assembly and body](./cad-assembly.jpg)

![Angled render showing the joint and linkage detail](./cad-detail.jpg)

## Printed hardware

Printed parts, micro servos at each joint, and a controller board mounted on top
of the body.

![3D-printed leg beside the Fusion 360 model of the same part on screen](./printed-vs-cad.jpg)

Comparing the printed part against the model on screen is where the iteration
happens — tolerances at the joints, clearance for the servo horns, whether a
link is stiff enough at the printed wall thickness.

![The assembled hardware in front of the CAD model of the full walker](./assembly-cad.jpg)

![Body with servos and the controller board mounted](./controller.jpg)

The feet were their own problem: they carry the whole load at the moment of
contact, and on this design they're also the most visually distinctive part.

![Detail of the printed clawed foot](./foot-detail.jpg)

## Result

Still ongoing, which is the point of it. It's the project where I get to be
wrong cheaply — and the loop of *prototype the mechanism, derive the math, model
it, print it, find out what I missed* is the closest thing I've had to real
engineering practice outside of a lab.
