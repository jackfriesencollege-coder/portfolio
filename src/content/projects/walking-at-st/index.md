---
title: 'Two Legged Star Wars Walker'
blurb: 'A scale AT-ST taken from a LEGO mechanism to Fusion 360 assembly to 3D-printed servo hardware'
date: 2026-07-01
tags: ['Fusion 360', 'Kinematics', 'Robotics', '3D Printing']
cover: './cover.jpg'
coverAlt: 'Fusion 360 render of the AT-ST leg assembly and body'
featured: false
role: 'Personal project'
timeframe: 'Summer 2023 – present'
---

## The problem

A two-legged walker is a hard mechanism. It has to carry its own weight, stay
balanced through a gait, and do it with linkages and actuators that fit inside a
challenging shape. The AT-ST's silhouette is all
overhanging body and thin, reverse-jointed legs, which is exactly the wrong
mass distribution for walking, and exactly why it's an interesting thing to try
to build.

This has been my long-running project since 2023, and it's where much of my initial love and knowledge of electronics and basic mechanisms stems from.

## Prototyping the mechanism in LEGO

I started this project using LEGOs, as it was a building system I was very familiar with. I thought it would be a simple and easy task, as this project was quite similiar to others I had done with LEGO.

![Close detail of the LEGO leg linkage arrangement](./lego-linkage.jpg)

This was the first design I had. It relied on one motor to turn the legs, and was quite simple. 

![LEGO Technic and EV3 prototype of the walker standing on a table](./lego-prototype.jpg)

After months of trying to make LEGOs work, I realized I needed to switch my systems. LEGOs were a great place to start and understand the physical constraints of this problem, but they did not have the capacity I needed to make this work.

## CAD

After learning how to 3D print in a class in shcool, I picked up Fusion 360 and bought my own printer. I quickly prototyped through many different iterations, landing on what you see below.

![Fusion 360 render of the full leg assembly and body](./cad-assembly.jpg)

![Angled render showing the joint and linkage detail](./cad-detail.jpg)

This design gives the hips and ankles two degrees of freedom, which allows the robot to place its center of mass on top of the center of the foot, which gives it the greates stability possible. 

## Printed hardware

Printed parts, micro servos at each joint, a battery, and a controller board mounted on top
of the body.

![Body with servos and the controller board mounted](./controller.jpg)

Comparing the printed part against the model on screen is where the iteration
happens — tolerances at the joints, clearance for the servo horns, whether a
link is stiff enough at the printed wall thickness.

![3D-printed leg beside the Fusion 360 model of the same part on screen](./printed-vs-cad.jpg)



![The assembled hardware in front of the CAD model of the full walker](./assembly-cad.jpg)

The feet were their own problem: they carry the whole load at the moment of
contact, and on this design they're also the most visually distinctive part.

![Detail of the printed clawed foot](./foot-detail.jpg)

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



## Result

Still ongoing, which is the point of it. It's the project where I get to be
wrong cheaply — and the loop of *prototype the mechanism, derive the math, model
it, print it, find out what I missed* is the closest thing I've had to real
engineering practice outside of a lab.
