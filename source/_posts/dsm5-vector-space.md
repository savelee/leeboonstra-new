---
title: "Vector Embeddings vs. The DSM-5: The Mathematical Flaw in Mental Health AI"
description: "What happens when you map the entire DSM-5 into high-dimensional vector space? The math exposes a chaotic illusion. See the interactive proof of why mental health AI is chasing a ghost."
tags:
  - Data Science
  - Vibe Coding
  - DSM
  - Vector Embeddings
  - Gemini Enterprise
  - Mental Health AI
  - Psychiatric AI
  - AI Engineering
  - Therapy AI
  - Mental Health Tech
categories:
  - AI Development
  - Engineering Proof
  - Applied AI
featured: vectors
date: 2026-06-26 09:00:00
---

<small style="display: block; color: var(--color-text-muted, #777); line-height: 1.5; font-style: italic; margin-bottom: 1.5em;">
I am a software engineer and data practitioner, not a psychiatrist, psychologist, or medical professional. This project is an exploratory engineering proof examining the mathematical properties of clinical language in vector space. The underlying codebase is fully open-sourced on <a href="https://github.com/savelee/dsm-in-vector-space" target="_blank" rel="noopener">GitHub</a> as a foundational starting point, and I invite subject matter experts, clinicians, and researchers to review, collaborate, or build upon these initial findings.
</small>

As an engineer, I look at the world through the lens of data architecture, relations, database schemas, and decision trees. 
Lately, I've been reading Daniel Oberhaus's book, [*The Silicon Shrink: How Artificial Intelligence Made the World an Asylum*](https://www.amazon.com/Silicon-Shrink-Artificial-Intelligence-Asylum/dp/026204935X/ref=sr_1_1). In Chapter 4, Oberhaus critiques **"digital phenotyping"**—the idea that we can passively track smartphone keystrokes, typing cadences, and language choices to map human behavior back to **DSM-5** (The American Psychiatric Association's Diagnostic and Statistical Manual of Mental Disorders) diagnoses. His argument is that this tracking is fundamentally flawed because the underlying foundation—the DSM itself—is broken. If the diagnostic categories are arbitrary and unscientific, training AI to detect them is just automating subjectivity.

As I read, I wondered:

> *What if the linguistic boundaries of the DSM are so overlapping and redundant that the math of vector spaces exposes them as an artificial illusion?*

So, being an applied AI engineer with too much time while waiting at an airport, a Google Cloud project, Antigravity for some vibe coding, and a healthy dose of professional skepticism, I decided to build an engineering proof. I wanted to map the entire DSM-5 into high-dimensional vector space, project it down to a 2D canvas, and see what the geometry of clinical language actually looks like.

The results are mathematically clear, clinically chaotic, and raise serious questions about the future of Psychiatric AI.

You can explore the live, interactive proof and run the simulations yourself here:  

<!--more-->

<div class="chart-container">

![DSM-5 disorders mapped into high-dimensional vector space](/images/vectors.jpeg)

</div>

👉 **[Interactive DSM-5 Vector Space Visualizer](https://savelee.github.io/dsm-in-vector-space/)**

## The Relational Collapse: Biology vs. Categorical Boxes

In traditional physical medicine, diagnostic models are built on **discrete, biologically isolated decision trees**. If you present with a illness, determining whether you have a **Common Cold vs. COVID-19** is a binary, physically verifiable classification. You either have the rhinovirus, the SARS-CoV-2 virus or what-ever virus, or you don't. The diagnostic boundaries are clear, mutually exclusive, and grounded in objective biology.

In contrast, **psychiatric diagnostics lack biological boundaries**. Because we cannot peek into someone's brain, to read a clean biomarker for depression or anxiety, the DSM relies on a *categorical classification model*. It defines complex mental disorders not by unique biomarkers, but as arbitrary checklists of overlapping, descriptive behaviors.

This structural collapse isn't just a theoretical concern; it has been demonstrated. In a 2025 study published in *Scientific Reports*, researchers introduced the **High-Dimensional Symptom Space (HDSS)** model. By mapping the clinical symptom profiles of over 5,000 adolescents into a 119-dimensional space, they discovered that the mathematical distances *within* a diagnostic category were virtually indistinguishable from the distances *between* different categories. In other words, when you map actual patient data, the DSM's categorical boxes completely dissolve.

When distinct diagnostic categories share identical symptom definitions (e.g., fatigue, sleep disturbances, concentration difficulties), the boundaries between disorders become entangled. This creates massive **overlaps** and **tautological loops** where a clinician is likely to diagnose a patient with multiple conditions simultaneously which is not necessarily the clinical reality, but rather evidence that the categorical model itself is structurally defective.

## Vibing, Scraping, Structuring, and Embedding

So here's what I did. I broke the experiment into the following phases:
1. Extracting and synthesizing the DSM-5 data,
2. Normalizing it into a clean data structures
3. Encoding the clinical text into dense vector representations.
4. Finally, I built a companion web app to visualize the results in 2D space:  
👉 **[Interactive DSM-5 Vector Space Visualizer](https://savelee.github.io/dsm-in-vector-space/)**

Because the APA aggressively copyrights the DSM-5-TR to monetize the manual, there is no clean, open-source DSM webservice, API, or public database sitting on an open registry.
To bypass this, I uploaded a PDF of an easy-to-explain DSM-5 guide into **[NotebookLM](https://notebooklm.google/)**. It allowed me to quickly extract the core diagnostic concepts and define clean JSON data structures. From there, I wrote Python scripts to parse the criteria, run quality checks, and ensure the symptom matching and labeling aligned with clinical definitions. (For example, if one disorder mentioned *insomnia* and another one has the synonym *sleeplessness*, then the synonym name should actually be the same. LLMs like Gemini are really great to detect and group synonyms from large amounts of texts.)

The resulting clean dataset was organized into official chapters in my [data repository](https://github.com/savelee/dsm-in-vector-space/tree/main/data), culminating in a [master diagnoses list](https://github.com/savelee/dsm-in-vector-space/blob/main/data/diagnoses.json) and a [consolidated symptom dictionary](https://github.com/savelee/dsm-in-vector-space/blob/main/data/unique_symptoms.json).

With a clean dataset of clinical descriptions, I generated dense vector representations using Google Cloud's **`text-embedding-005`** model on Gemini Enterprise.
I configured the API call with `task_type="CLUSTERING"` to ensure the model treated each symptom description as an independent semantic entity in a 768-dimensional space, rather than a search query:

```python
# Extract from our embedding generator script
import vertexai
from vertexai.language_models import TextEmbeddingModel, TextEmbeddingInput

vertexai.init(project=PROJECT_ID, location="global")  # Gemini Enterprise endpoint
model = TextEmbeddingModel.from_pretrained("text-embedding-005")

# Run batch embeddings with the CLUSTERING task type
inputs = [
    TextEmbeddingInput(text=text, task_type="CLUSTERING")
    for text in symptom_texts
]
response = model.get_embeddings(inputs)
symptom_vectors = [emb.values for emb in response]
```

The resulting high-dimensional vector representations were saved in my [pre-computed embedding cache](https://github.com/savelee/dsm-in-vector-space/blob/main/embeddings/embeddings_text_embedding_005.json) to optimize performance.

## Mapping the Geometry of Clinical Language

To translate these 768-dimensional vectors into a visual format, I built a client-side **React + TypeScript + Vite** web application: [`modern-viz/`](https://github.com/savelee/dsm-in-vector-space/tree/main/modern-viz). It runs entirely in the browser without a backend, so i can deploy it on **Github Pages** for free. The application uses **t-SNE** (t-Distributed Stochastic Neighbor Embedding) to project the high-dimensional coordinates down to a 2D grid, alongside an interactive, physics-based network graph.

The web app exposes three distinct layers of the DSM's structural collapse:

### 1. The Topological Network Graph

Using an [interactive network mapping component](https://github.com/savelee/dsm-in-vector-space/blob/main/modern-viz/src/components/NetworkGraph.tsx), the app constructs a physics-based network where **Disorder Nodes** connect to **Symptom Nodes**. Filtering by chapter immediately exposes the overlap. You can drag nodes and watch how symptoms like fatigue, insomnia, and concentration difficulties act as gravity wells, pulling separate disorders together.

<div class="chart-container img-contain">

![Topological Network Graph mapping DSM-5 disorders to symptom nodes](/images/topology.png)

</div>

### 2. The Semantic Vector Space

This tab projects the text of the clinical descriptions into a [2D semantic space visualization](https://github.com/savelee/dsm-in-vector-space/blob/main/modern-viz/src/components/SemanticSpace.tsx). You can toggle between three levels:

- **Symptom Semantic Space**: Maps individual symptoms in 2D space.
- **Symptom-Disorder Overlap**: Select disorders—like **Major Depressive Disorder (MDD)** and **Generalized Anxiety Disorder (GAD)**—to see their symptoms land in the exact same coordinate space.
- **Diagnosis Semantic Space (Centroids)**: Maps the average vector (centroid) of each disorder's symptom profile to see which diagnoses are semantically identical.

<div class="chart-container img-contain">

![Semantic Vector Space visualizing dense embeddings of DSM-5 symptoms in 2D](/images/vector_space.png)

</div>

### 3. The Virtual Shrink Simulator

To turn this math into a practical demonstration, I built an [interactive clinical simulator](https://github.com/savelee/dsm-in-vector-space/blob/main/modern-viz/src/components/VirtualShrink.tsx), backed by a [custom diagnostic logic engine](https://github.com/savelee/dsm-in-vector-space/blob/main/modern-viz/src/utils/diagnosticEngine.ts). As you select symptoms, the engine filters the DSM database and calculates a **"System Ambiguity Score"** (clinical entropy).

If you input an overlapping clinical profile, the engine triggers a **"Comorbidity Loop Warning"** and spikes the entropy meter, proving the categorical model cannot resolve the patient into a single box.

*If I had more time, or maybe I will pick this up at some point, then I would have build a (speech) chat agent, that could diagnose on the fly. By filtering options out.*

## A Visual Proof

To see how easily the DSM's categorical architecture collapses, we can analyze the **Anxiety-Depression Vortex**. When a patient presents with fatigue, sleep disturbances, poor concentration, and restlessness, the diagnostic engine enters a permanent, circular loop. (e.g. circular logic where Condition A requires symptoms that inherently trigger the diagnosis of Condition B, locking the data model (or the clinician) in an infinite loop of over-diagnosised conditions).

By analyzing the geometric clusters generated by `text-embedding-005`, we can extract three critical lessons that challenge the very foundation of Computational Psychiatry and Psychiatric AI (PAI):

### 1. The Tautology Trap

When looking at the Symptom Semantic Space, I noticed a strange, tight cluster of highly unrelated symptoms pulling together near the edge of the graph. When I inspected the raw text, the cause became obvious: these sentences all contained the standard legalistic boilerplate: *"The symptoms cause clinically significant distress or impairment in social, occupational, or other important areas of functioning."*

Because the manual repeats this phrasing across hundreds of disorders, the embedding model groups these different clinical realities at the same coordinates. This is a **Tautology Trap**—proving the DSM often groups conditions based on administrative boilerplate rather than clinical reality.

### 2. Language is the Glitch

In psychiatric research, there is a highly debated concept called the **p-factor**—a single, general factor of psychopathology suggesting that if a patient has one mental health issue, they are statistically predisposed to experience others.

Our vector space suggests a much simpler, more humbling explanation: **the p-factor is a linguistic artifact**. The language used to write the DSM is highly redundant. The text embeddings prove that many diagnoses are mathematically "so close" simply because the APA used the same words to describe different constructs. The overlap isn't necessarily a deep biological secret; it's a structural design defect in the manual's language.

This is where my linguistic experiment and the HDSS paper offer two fascinating, complementary perspectives. The HDSS paper shows that *actual patient presentations* collapse into a single, continuous space rather than discrete clusters. My embedding experiment suggests a potential structural reason for this: the very *language* used to define these disorders is mathematically entangled. If the diagnostic instrument (the DSM) is built on redundant, overlapping semantic definitions, the clinical data collected through it will inevitably reflect that overlap. It raises an intriguing question: is the p-factor a deep biological mystery, or is it, at least in part, a linguistic artifact of how we designed the manual?

> Training AI models on passive smartphone data to predict DSM labels is a dead end. If the underlying labels are mathematically entangled, a model boasting high accuracy isn't discovering a biological truth. It is just predicting the circular language of the manual and automating a flawed baseline.

## The Path Forward

If we want to build truly revolutionary AI systems for mental health, we must stop trying to automate the rigid, 20th-century box models of the DSM.

A static vector map is only a starting point. True clinical understanding is not just a coordinate; it is a trajectory. This is why the human conversation between a patient and a therapist remains irreplaceable. A vector embedding might capture the semantic similarity of symptoms, but it cannot untangle the complex, temporal choreography of a life: the precise **order of sequence** (e.g., did the insomnia trigger the panic, or did the panic cause the insomnia?), the downstream **behavioral consequences** (e.g., avoiding morning meetings, calling out sick, or abusing caffeine to stay awake during the day), the **situational timing and duration** (e.g., the panic attacks only hit on Monday evenings at exactly 8:00 PM and last for roughly 45 agonizing minutes), and the deeply **personal narrative context** (e.g., the client is carrying immense guilt over their recent promotion because it belonged to a laid-off colleague). The therapist's office is where these static coordinates are animated into a coherent, dynamic story.

Now, I am not a psychiatrist, nor have I ever studied psychiatry. I am just a software engineer with a laptop and a vibecoding toolkit. But in a way, that is exactly the point. This experiment proves why specialized verticals, like medicine, law, finance, logistics—can benefit immensely from working more closely with software engineers and data scientists.

When you spend your entire career inside a single discipline, you naturally adopt its consensus assumptions, its vocabulary, and its traditional structures (like the DSM's categorical boxes) as absolute truth. But when a software engineer or data scientist looks at the exact same domain, they don't see academic consensus; they see **data architecture, relational integrity, schemas, and state machines**.

When we collaborate across boundaries—combining the deep contextual wisdom of the domain expert with the rigorous, systems-level architecture of the engineer—we stop automating the flaws of the past and start building the architecture of the future.

## Further Reading

*   **[The Silicon Shrink: How Artificial Intelligence Made the World an Asylum](https://www.amazon.com/Silicon-Shrink-Artificial-Intelligence-Asylum/dp/026204935X/ref=sr_1_1)** (Daniel Oberhaus, Feb 2025) — The book that inspired this experiment, offering a brilliant critique of "digital phenotyping" and the structural flaws of the DSM.
    <small style="display: block; margin-top: 0.5em; color: var(--color-text-muted, #666); line-height: 1.6;">
    Why the race to apply AI in psychiatry is so dangerous, and how to understand the new tech-driven psychiatric paradigm.
    <br><br>
    AI psychiatrists promise to detect mental disorders with superhuman accuracy, provide affordable therapy for those who can’t afford or can’t access treatment, and even invent new psychiatric drugs. But the hype obscures an unnerving reality. In *The Silicon Shrink*, Daniel Oberhaus tells the inside story of how the quest to use AI in psychiatry has created the conditions to turn the world into an asylum. Most of these systems, he writes, have vanishingly little evidence that they improve patient outcomes, but the risks they pose have less to do with technological shortcomings than the application of deeply flawed psychiatric models of mental disorder at unprecedented scale.
    <br><br>
    Oberhaus became interested in the subject of mental health after tragically losing his sister to suicide. In *The Silicon Shrink*, he argues that these new, ostensibly therapeutic technologies already pose significant risks to vulnerable people, and they won’t stop there. These new breeds of AI systems are creating a psychiatric surveillance economy in which the emotions, behavior, and cognition of everyday people are subtly manipulated by psychologically savvy algorithms that have escaped the clinic. Oberhaus also introduces readers to the concept of “swipe psychology,” which is quickly establishing itself as the dominant mode of diagnosing and treating mental disorders.
    </small>
*   **[Modeling psychopathology in high-dimensional vector space using the high-dimensional symptom space (HDSS) model](https://pmc.ncbi.nlm.nih.gov/articles/PMC12508039/)** (Wild & Cutler, 2025) — Published in *Scientific Reports*, this paper demonstrates how mapping actual patient response data (CBCL) into high-dimensional space exposes the same categorical collapse and offers a path toward tracking personalized clinical trajectories.

<small style="display: block; color: var(--color-text-muted, #777); line-height: 1.5; font-style: italic; margin-top: 2em;">
The analysis presented here is strictly an engineering and computational proof of concept. I hold no medical or psychiatric credentials. All data and tools have been released as open-source software on <a href="https://github.com/savelee/dsm-in-vector-space" target="_blank" rel="noopener">GitHub (savelee/dsm-in-vector-space)</a> to encourage rigorous evaluation, refinement, and collaboration by qualified medical and psychiatric professionals.
</small>


