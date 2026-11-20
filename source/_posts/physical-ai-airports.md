---
title: "Physical AI in the Baggage Hall: Building a Real2Sim Airport Digital Twin for Robotics"
description: "How I used Gemini 4, Google Antigravity, Blender, and MuJoCo Warp (MJWarp) on Google Cloud to turn a single 2D floorplan into a physics-accurate virtual baggage hall for training dual-arm robots."
tags:
  - Physical AI
  - Robotics
  - Real2Sim
  - Digital Twin
  - MuJoCo
  - Gemini Robotics
  - Blender
  - Google Cloud
categories:
  - Applied AI
  - Physical AI
  - Robotics
featured: robotics_sim_isometric
date: 2026-12-05 12:00:00
---

Every time you drop a suitcase at an airport check-in counter, it disappears behind a rubber curtain into a hidden factory: kilometers of conveyor belts, X-ray screening tunnels, high-speed diverters, and tilt-tray sorters. Large airports call this the **Baggage Handling System (BHS)**.

Most of that factory is already automated. Yet the system breaks down at the exact moments where a human still has to lift a bag by hand: unloading luggage from a baggage cart onto a collector belt, rescuing a bag that jammed on a curve, or packing an aircraft hold.

Those manual handoffs carry an enormous human and financial toll. In 2024, global aviation moved roughly 5.3 billion passengers—and mishandled **33.4 million bags** (6.3 per 1,000 passengers), costing the industry around **$5 billion a year**. Roughly **41%** of those mishandled bags happen during transfers between flights. Behind the scenes, a single baggage handler routinely lifts **4 to 10 tonnes** of luggage per shift—hundreds of 15 to 23 kg bags, twisted and hoisted at waist height. Back, shoulder, and knee injuries are widespread, and airports struggle to hire and retain staff for the work.

You cannot simply bolt a giant new sorting machine into an existing terminal. Those halls were built around human proportions: narrow walkways, low ceilings, and carts parked at odd angles. That is why mobile manipulators like the **AgiBot Genie 2 (G2)**—a wheeled robot with a bendable torso, two 7-joint arms, and wrist cameras—are so compelling. They fit inside spaces designed for people.

The catch? You cannot write an `if` statement for every combination of shape, texture, weight, loose strap, and belt speed. A soft 27.5 kg duffel bag behaves nothing like a 16 kg polycarbonate spinner suitcase, and the robot cannot even feel a bag’s weight until it lifts it. With infinite real-world variations, the robot has to learn through trial and error—the same way humans learn physical skills. You cannot let it learn by dropping suitcases on a live airport conveyor, so you train it in **simulation** first.

Even then, a toy simulation is not enough: if the virtual hall looks and behaves nothing like the real terminal, the **sim-to-real gap** causes the learned policy to fail the moment it hits physical hardware. To truly learn, the robot needs a faithful virtual twin where thousands of those bag, weight, and lighting variations can be simulated in parallel.

In this post, I’ll walk through how I engineered a **Real2Sim** pipeline in **Google Antigravity** using **Gemini 4**, **Blender**, and **MuJoCo Warp (MJWarp)** on Google Cloud. Starting from a single 2D floor plan and eight reference photos, an AI agent built a physics-accurate virtual baggage hall where robots can practice unloading luggage thousands of times in parallel—long before stepping onto a real tarmac.

<!--more-->

<div class="chart-container img-contain">

![AgiBot G2 Robot Unloading Luggage in a Virtual Baggage Hall](/images/robotics_sim_isometric.png)

</div>

## Why Robots Train in Simulation First

Commercial pilots train in flight simulators before they ever fly a passenger jet. A simulator lets them practice engine failures, crosswinds, and emergency landings without risking a single life or airframe.

Physical AI needs the same safety net. A physics-accurate simulation acts as a virtual gym where gravity, friction, and collisions behave like the real world, giving robotics teams five decisive advantages:

| Dimension | Real-World Baggage Hall | Virtual Simulation (MJWarp) |
| :--- | :--- | :--- |
| **Safety** | A learning robot drops bags, clips belts, or collides with staff. | Nothing breaks, and nobody gets hurt. |
| **Speed** | One physical robot runs in real time (~30 seconds per attempt). | Thousands of virtual copies run in parallel, faster than real time. |
| **Cost** | Expensive hardware plus live hall downtime. | Cloud GPUs billed by the hour. |
| **Edge Cases** | You might wait months for a torn strap or jammed diverter. | Trigger any failure mode on demand with one line of code. |
| **Access** | Airport baggage halls are secure 24/7 operations. | The virtual hall is available around the clock. |

On a single cloud GPU, 1,000 virtual robots can execute 1,000 pickup attempts side by side in roughly the time a physical robot takes to complete one.

Of course, simulation comes with a catch: the **sim-to-real gap**. If a virtual conveyor belt is slightly more slippery than the real rubber flaps, a robot trained on that belt will misjudge its grip in the physical terminal. Closing that gap requires making the virtual hall look and behave as close to reality as possible, then adding controlled randomness during training.

## Real2Sim: From One 2D Floorplan to a 3D Baggage Hall

Historically, building a digital twin of an airport terminal meant hiring a team of 3D artists to model every conveyor, walkway, and sign by hand, then having engineers convert those meshes into collision shapes for a physics engine—weeks or months of work for a single building. That manual bottleneck made custom virtual facilities slow to iterate on and prohibitively expensive to scale across multiple terminals.

I flipped that workflow on its head, giving an AI agent in **Google Antigravity** just two inputs:

1. A **2D floor plan** showing the baggage flow from check-in (`Zone 1` and `Zone 2`) through X-ray screening tunnels, the Destination Coded Tray (DCT) line, the `HELIXORTER` tilt-tray sorter, and the oval make-up carousels (`TACK@EASE`) out to the apron.
2. A **moodboard** of eight reference photos capturing the industrial aesthetic: royal blue conveyor frames, yellow safety mesh, orange gearmotors, galvanized steel catwalks, silver ceiling air ducts, and yellow `ZL 201` chute signs.

<div class="chart-container img-contain">

![2D Input Floorplan of the Baggage Handling System](/images/robotics_input_floorplan.png)

</div>

A 2D floorplan gives you layout, not reality. It labels a line as a “Destination coded tray,” but it never tells you how high that belt sits off the concrete, what material supports it, or what color the trays are. To bridge that gap, **Gemini 4** acted across four roles inside Antigravity: inspecting the drawings and photos, learning from airport standards, planning machine heights and materials, writing Python scripts to build the hall in **Blender**, and visually inspecting its own renders to fix floating belts or disconnected junctions.

If you haven’t worked with it before, **Blender** is a free, open-source 3D creation suite used across films and games—and crucially for automation, every mesh, material, light, and camera in Blender can be scripted through its Python API. While Gemini isn’t yet great at generating complex, dimensionally accurate 3D assets directly, it excels at writing Python code. Regardless, you still need a deterministic 3D composition engine like Blender to assemble hundreds of machines to exact scale, verify clearances, and export clean geometry and collision meshes into a true physics platform like **MuJoCo**.

### Step 1: The OpenCV + Vision Quality Gate

Multimodal models excel at semantic understanding (*“this rectangle is an X-ray screening tunnel”*), but they can drift when asked to transcribe hundreds of exact pixel coordinates. Conversely, a computer-vision script using **OpenCV** measures pixel coordinates with mathematical precision, even though it has no idea what an X-ray tunnel is.

Combining both tools gives you an architect paired with a laser measurer. Before generating a single 3D mesh, the pipeline compiles a JSON feed and draws the measured wireframe directly over the original floor plan. If the lines do not align, the pipeline halts at this **quality gate**.

<div class="chart-container img-contain">

![Floorplan Wireframe Overlay Quality Gate](/images/robotics_floorplan_wireframe_overlay.png)

</div>

<div class="chart-container img-contain">

![Top-Down 3D Hall Match Against Original Floorplan](/images/robotics_top_down_match.png)

</div>

### Step 2: PBR Materials, Blender Assembly, and Realistic Luggage

Plain grey geometry isn’t enough—especially if a robot’s wrist camera will later rely on synthetic images. Using **Gemini 4 Carbon** on **Gemini Enterprise**, the pipeline generated **Physically Based Rendering (PBR)** textures (albedo, roughness, and normal maps) for overlapping black rubber conveyor flaps, concrete floors, galvanized grating, and coated-canvas luggage fabrics.

From there, the agent’s Python scripts assembled the hall in Blender—complete with check-in induction belts, curved diverters, screening tunnels, tilt trays, make-up carousels, lateral chutes, and a five-layer ceiling of concrete, steel beams, ducts, cable trays, and lighting.

<div class="chart-container img-contain">

![Isometric Overview of the 3D Blender Baggage Hall](/images/robotics_blender_isometric.png)

</div>

To populate the belts and carts without bogging down memory, the pipeline instanced four 3D luggage models with realistic dimensions and masses:

| Luggage Asset | Material & Features | Dimensions | Mass |
| :--- | :--- | :--- | :--- |
| **Turquoise hard-shell suitcase** | Polycarbonate shell, 4 spinner wheels, recessed handle, barcode tag | 0.52 × 0.74 × 0.31 m | 18.5 kg |
| **Magenta hard-shell suitcase** | Polycarbonate shell, 4 spinner wheels, recessed handle, barcode tag | 0.48 × 0.68 × 0.28 m | 16.0 kg |
| **Damier Ebene duffel bag** | Checkered coated canvas with tan leather straps | 0.46 × 0.86 × 0.42 m | 23.0 kg |
| **Damier Graphite cargo bag** | Checkered coated canvas with dark webbing straps | 0.54 × 0.92 × 0.44 m | 27.5 kg |

Those weights are not cosmetic. A policy that only ever lifts a 5 kg cardboard box will stall or topple the moment it tries to hoist a 27.5 kg cargo bag.

### Illustrating the Hall with Gemini 4 Carbon

As a visual communication layer for stakeholders, I also passed the Blender renders through a two-step **Gemini 4 Carbon** pipeline—one call acting as art director, the second rendering photorealistic lighting and atmosphere.

<div class="chart-container img-contain">

![Gemini 4 Carbon Re-Imagined Photo of the Lateral Baggage Hall](/images/robotics_reimagined_lateral_hall.png)

</div>

**NOTE:** AI re-imagined renders are strictly for stakeholder illustration—never for robot training. Image-editing models can subtly shift camera angles or alter machine counts, so every physics calculation and synthetic camera feed stays anchored to the deterministic Blender and MuJoCo geometry.

## Inside the Gym: MuJoCo, MJWarp, and the AgiBot G2

A 120-meter hall is too massive to simulate at full contact fidelity all at once, and a mobile manipulator only interacts with the equipment within reach. The pipeline slices the Blender scene into operational zones and exports each zone as an **MJCF** file, the scene format for **MuJoCo** (Multi-Joint dynamics with Contact).

Originally developed at the University of Washington and now maintained as open-source software by **Google DeepMind**, **MuJoCo** is built specifically for **contact physics**—calculating the exact forces and friction when two grippers squeeze a suitcase handle and lift it without slipping. By running **MJWarp** (MuJoCo on NVIDIA Warp) on a Google Cloud **NVIDIA L4 GPU**, I can simulate thousands of robot attempts in parallel and inspect scenes live in a browser with **Viser**.

In my primary baggage-transfer scenario, the **AgiBot G2** stands in the aisle between an open-top baggage cart (canopy removed for overhead arm clearance) and the main collector belt. Its task: drive alongside the cart, reach down with both 7-DOF arms, clamp a suitcase or duffel bag from both sides, lift it clear of the cart deck, pivot 90 degrees, and release it smoothly onto the moving rubber flaps.

<div class="chart-container img-contain">

![AgiBot G2 Grasping a Suitcase from an Open-Top Baggage Cart](/images/robotics_sim_grasp.png)

</div>

<div class="chart-container img-contain">

![AgiBot G2 Placing a Suitcase onto the Moving Collector Belt](/images/robotics_sim_place.png)

</div>

### From Planned Motion to Reinforcement Learning

In the initial 60 FPS rollouts across five BHS stations, the G2’s dual-arm trajectories are driven by **inverse kinematics (IK)**. This planned motion sequence calculates joint angles backward from target gripper positions. Planned motion is great for validating geometry, collision shapes, and clearances, but it cannot adapt when a bag shifts unexpectedly.

Adapting to real-world chaos requires **Reinforcement Learning (RL)** using **Proximal Policy Optimization (PPO)**—training a neural-network policy across millions of simulated episodes:

* **Reward Shaping:** Robots optimize *exactly* what you reward, not what you intend. Early G2 reaching rewards gave points even when the arms trembled near the target, teaching the robot to vibrate. Tightening the reward to favor smooth approach and holding still eliminated the oscillation.
* **Domain Randomization:** To close the sim-to-real gap, each training episode varies bag masses, belt friction, lighting conditions, and starting positions—much like training a pilot in fog and crosswinds rather than endless blue skies.

## Giving the Robot Eyes: Gemini Robotics-ER

In simulation, the environment can tell the robot the exact 3D coordinates of every suitcase. In a real airport, the robot has to figure that out from its head and wrist cameras.

That is where **Gemini Robotics-ER (Embodied Reasoning)** from Google DeepMind comes in. While a trained RL policy acts as the robot’s **muscle memory**—adjusting joint torques dozens of times per second—Gemini Robotics-ER acts as the **high-level supervisor**. Given a live camera frame, it can point to grip targets, draw bounding boxes, plan multi-step clearances, verify whether a bag landed cleanly on the belt, and halt operations if a human walks into the aisle.

When the wrist camera queries Gemini Robotics-ER with a prompt such as *“Point to the best place to grip each bag on the belt. Return JSON,”* the model returns structured pixel coordinates the controller can project directly into 3D space:

```json
[
  {"label": "turquoise hard-shell suitcase, top handle", "point": [412, 288]},
  {"label": "Louis Vuitton Damier Graphite duffel bag, side strap", "point": [655, 341]}
]
```

Because MuJoCo’s PBR renderer produces realistic synthetic camera feeds, I can test the entire closed loop—`Camera → Gemini Robotics-ER → Controller → Robot`—across thousands of virtual bag arrangements before deploying to physical hardware.

## Engineering Proof vs. Production Reality

It is important to be direct about where this technology stands today: **what you are seeing is an engineering proof, not an off-the-shelf airport product.**

* **Planned Motion vs. Autonomous Policy:** The dual-arm reaching policy is trained with PPO in MJWarp, while the full multi-bag cart-to-belt rollouts currently use planned bimanual IK. Training and generalizing the end-to-end pickup policy is the next engineering milestone.
* **The Sim-to-Real Gap Remains Real:** None of these policies have yet been validated on a physical G2 robot in a live baggage hall. Lighting shifts, soft strap deformation, and belt wear still require months of physical lab iteration.
* **Site Calibration & Certification:** Because a 2D floor plan omits vertical heights, real-world deployments require laser-verified site measurements alongside formal airport safety certification for human-adjacent operation.

A year ago, building a physics-accurate virtual airport to train a mobile manipulator required a dedicated 3D art team and months of manual engineering. Today, one engineer using an agentic coding environment can start with a single 2D drawing and a handful of reference photos, generate a 120-meter digital twin in days, and scale training across thousands of parallel simulations on cloud GPUs.

That won’t replace the airport baggage handler tomorrow. It means the robots engineered to take over the heaviest, most injury-prone lifting can be trained, stressed, and verified long before they ever roll onto a live terminal floor.
