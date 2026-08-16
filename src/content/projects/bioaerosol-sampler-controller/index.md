---
title: 'Bioaerosol Sampler Control System'
blurb: 'Custom KiCad PCB, watertight enclosure, and a tuned PID loop holding a 225 L/min air sampler at target flow in real time.'
date: 2026-06-15
tags: ['PCB Design', 'KiCad', 'Controls', 'Instrumentation']
featured: true
role: 'Design and build — BROADN Internship'
timeframe: 'Summer 2026'
---

## The problem

A 225 L/min bioaerosol air sampler only produces trustworthy data if it actually
moves the air it claims to. Filter loading, temperature swings, and battery sag
all pull the real flow rate away from the setpoint over a long sampling run — and
a sample collected at the wrong flow rate is a sample you can't use.

The instrument needed a controller that would hold flow steady on its own, outdoors,
unattended.

## What I did

I designed a custom PCB in **KiCad** to read pressure and flow sensors and drive
the sampler, and built a watertight enclosure so the electronics could survive
field deployment.

On top of that I implemented and tuned a **PID feedback controller** that corrects
the flow rate continuously from live sensor data, rather than trusting an open-loop
setting made at the start of a run.

## Result

The sampler holds its target flow rate in real time through changing conditions,
which means the collected samples stay comparable across a run and across
deployments.
