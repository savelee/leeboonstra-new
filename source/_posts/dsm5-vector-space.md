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
  - Applied AI
  - Mental Health AI
  - Vector Embeddings
  - Engineering Proof
alias:
  - /ai-development/engineering-proof/applied-ai/dsm5-vector-space/
  - /ai-development/vector-embeddings/mental-health-ai/applied-ai/dsm5-vector-space/
featured: vectors
date: 2026-06-26 09:00:00
---

> <small style="color: var(--color-text-muted, #777); font-style: italic; font-size: 0.5em;"><strong>NOTE:</strong> I am a software engineer and data practitioner, not a psychiatrist, psychologist, or medical professional. This project is an exploratory engineering proof examining the mathematical properties of clinical language in vector space. The underlying codebase is fully open-sourced on <a href="https://github.com/savelee/dsm-in-vector-space" target="_blank" rel="noopener">GitHub</a> as a foundational starting point, and I invite subject matter experts, clinicians, and researchers to review, collaborate, or build upon these initial findings.</small>

As an engineer, I look at the world through data architecture, relations, database schemas, and decision trees.

Before we dive into the math, here is the core argument in plain terms—and why I believe **Psychiatric AI** built on the **DSM-5** (the American Psychiatric Association's Diagnostic and Statistical Manual of Mental Disorders) is at serious risk:

1. **Symptoms overlap everywhere.** Different DSM diagnoses share many of the same symptoms—fatigue, insomnia, poor concentration, restlessness—so the boundaries between categories blur together.
2. **It classifies by checklist, not biology.** Unlike physical medicine, there is no blood test or brain scan for most psychiatric conditions; the DSM groups people using subjective, descriptive checklists.
3. **Scaling a flawed baseline causes harm.** If you train AI models to predict overlapping, subjective labels and deploy them at scale, the AI does not resolve the confusion—it automates and amplifies it.

Lately, I've been reading Daniel Oberhaus's book, [*The Silicon Shrink: How Artificial Intelligence Made the World an Asylum*](https://www.amazon.com/Silicon-Shrink-Artificial-Intelligence-Asylum/dp/026204935X/ref=sr_1_1). In Chapter 4, Oberhaus critiques **"digital phenotyping"**—the idea that we can passively track smartphone keystrokes, typing cadences, and language choices to map human behavior back to DSM-5 diagnoses. His point is simple: if the underlying diagnostic categories are arbitrary, training AI to detect them only automates subjectivity.

As I read, I wondered:

> *What if the linguistic boundaries of the DSM are so overlapping and redundant that the math of vector spaces exposes them as an artificial illusion?*

So, as an applied AI engineer with too much time at an airport, a Google Cloud project, Antigravity for vibe coding, and a healthy dose of skepticism, I built an engineering proof. I mapped the entire DSM-5 into a mathematical coordinate system (a **vector space**), projected it onto a 2D map, and looked at what the geometry of clinical language actually reveals.

The result is unambiguous: the categories collapse into one another, raising serious questions about the future of Psychiatric AI.

You can explore the live, interactive proof and run the simulations yourself here:  

<!--more-->

<div class="chart-container">

![DSM-5 disorders mapped into high-dimensional vector space](/images/vectors.jpeg)

</div>
<p><small><em><strong>Figure 1:</strong> Each point represents a DSM-5 symptom or diagnosis description projected into 2D vector space, with colors indicating different diagnostic chapters. Notice how the colored clouds bleed into one another across the center instead of forming separated islands—proving that the DSM's categories are not mathematically distinct in language.</em></small></p>

👉 **[Interactive DSM-5 Vector Space Visualizer](https://savelee.github.io/dsm-in-vector-space/)**

## The Relational Collapse: Biology vs. Categorical Boxes

In traditional physical medicine, diagnostic models are built on **discrete, biologically isolated decision trees**. If you present with an illness, determining whether you have a **Common Cold vs. COVID-19** is a binary, physically verifiable classification. You either have the rhinovirus, the SARS-CoV-2 virus or what-ever virus, or you don't. The diagnostic boundaries are clear, mutually exclusive, and grounded in objective biology.

In contrast, **psychiatric diagnostics lack biological boundaries**. Because we cannot peek into someone's brain to read a clean biomarker for depression or anxiety, the DSM relies on a *categorical classification model*. It defines complex mental disorders not by unique biomarkers, but as checklists of overlapping, descriptive behaviors.

This structural collapse isn't just a theoretical concern; it has been demonstrated. In a 2025 study published in *Scientific Reports*, researchers introduced the **High-Dimensional Symptom Space (HDSS)** model. By mapping the clinical symptom profiles of over 5,000 adolescents into a 119-dimensional space, they discovered that the mathematical distances *within* a diagnostic category were virtually indistinguishable from the distances *between* different categories. When you map actual patient data, the DSM's categorical boxes dissolve.

When distinct diagnostic categories share identical symptom definitions (e.g., fatigue, sleep disturbances, concentration difficulties), the boundaries between disorders become entangled. This creates massive **overlaps** and **tautological loops** where a clinician is likely to diagnose a patient with multiple conditions simultaneously—not necessarily reflecting clinical reality, but exposing a structural defect in the categorical model itself.

## Vibing, Scraping, Structuring, and Embedding

So here's what I did. I broke the experiment into four phases:
1. Extracting and structuring the DSM-5 criteria.
2. Normalizing the text into clean data structures.
3. Converting the clinical descriptions into **vector embeddings**—numerical coordinates that place similar meanings close together on a mathematical map.
4. Building a companion web app to visualize the results in 2D space:  
👉 **[Interactive DSM-5 Vector Space Visualizer](https://savelee.github.io/dsm-in-vector-space/)**

Because the APA aggressively copyrights the DSM-5-TR to monetize the manual, there is no open-source DSM webservice, API, or public database.
To work around this, I uploaded a PDF of a plain-language DSM-5 guide into **[NotebookLM](https://notebooklm.google/)**. It helped me extract the core diagnostic concepts and define clean JSON data structures. From there, I wrote Python scripts to parse the criteria, run quality checks, and merge duplicate symptom phrasing. (For example, if one disorder listed *insomnia* and another listed *sleeplessness*, they needed to share a canonical label. LLMs like Gemini are great at detecting and grouping synonyms across large bodies of text.)

The resulting dataset was organized into official chapters in my [data repository](https://github.com/savelee/dsm-in-vector-space/tree/main/data), culminating in a [master diagnoses list](https://github.com/savelee/dsm-in-vector-space/blob/main/data/diagnoses.json) and a [consolidated symptom dictionary](https://github.com/savelee/dsm-in-vector-space/blob/main/data/unique_symptoms.json).

With a clean dataset of clinical descriptions, I generated dense vector representations using Google Cloud's **`text-embedding-005`** model on Gemini Enterprise. In plain terms, this turns each symptom sentence into a list of 768 numbers so we can measure how close any two symptoms are in meaning.
I configured the API call with `task_type="CLUSTERING"` so the model treated each symptom description as an independent semantic entity rather than a search query:

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

To translate these 768-dimensional vectors into a visual format, I built a client-side **React + TypeScript + Vite** web application: [`modern-viz/`](https://github.com/savelee/dsm-in-vector-space/tree/main/modern-viz). It runs entirely in the browser without a backend, so I can deploy it on **GitHub Pages** for free. The application uses **t-SNE** (a dimensionality-reduction technique that squashes high-dimensional coordinates down to a flat 2D grid) alongside an interactive, physics-based network graph.

The web app exposes three distinct layers of the DSM's structural collapse:

### 1. The Topological Network Graph

Using an [interactive network mapping component](https://github.com/savelee/dsm-in-vector-space/blob/main/modern-viz/src/components/NetworkGraph.tsx), the app constructs a physics-based network where **Disorder Nodes** connect to **Symptom Nodes**. Filtering by chapter immediately exposes the overlap. You can drag nodes and watch how symptoms like fatigue, insomnia, and concentration difficulties act as gravity wells, pulling separate disorders together.

<div class="chart-container img-contain">

![Topological Network Graph mapping DSM-5 disorders to symptom nodes](/images/topology.png)

</div>
<p><small><em><strong>Figure 2:</strong> A force-directed network graph linking DSM-5 disorders (colored hubs) to individual symptom nodes. Look at the dense web of shared edges in the center: high-degree symptoms such as fatigue, insomnia, and poor concentration act as hubs pulling unrelated chapters together—proving that a single symptom profile simultaneously triggers multiple separate diagnoses.</em></small></p>

### 2. The Semantic Vector Space

This tab projects the text of the clinical descriptions into a [2D semantic space visualization](https://github.com/savelee/dsm-in-vector-space/blob/main/modern-viz/src/components/SemanticSpace.tsx). You can toggle between three levels:

- **Symptom Semantic Space**: Maps individual symptoms in 2D space.
- **Symptom-Disorder Overlap**: Select disorders—like **Major Depressive Disorder (MDD)** and **Generalized Anxiety Disorder (GAD)**—to see their symptoms land in the exact same coordinate space.
- **Diagnosis Semantic Space (Centroids)**: Maps the average vector (centroid) of each disorder's symptom profile to see which diagnoses are semantically identical.

<div class="chart-container img-contain">

![Semantic Vector Space visualizing dense embeddings of DSM-5 symptoms in 2D](/images/vector_space.png)

</div>
<p><small><em><strong>Figure 3:</strong> A 2D t-SNE projection of <code>text-embedding-005</code> symptom vectors, highlighting selected disorders side by side. Notice how symptoms from supposedly distinct conditions (such as Major Depressive Disorder and Generalized Anxiety Disorder) land at nearly identical coordinates—proving that the semantic overlap is baked directly into the DSM's clinical definitions.</em></small></p>

### 3. The Virtual Shrink Simulator

To turn this math into a practical demonstration, I built an [interactive clinical simulator](https://github.com/savelee/dsm-in-vector-space/blob/main/modern-viz/src/components/VirtualShrink.tsx), backed by a [custom diagnostic logic engine](https://github.com/savelee/dsm-in-vector-space/blob/main/modern-viz/src/utils/diagnosticEngine.ts). As you select symptoms, the engine filters the DSM database and calculates a **"System Ambiguity Score"** (clinical entropy).

If you input an overlapping clinical profile, the engine triggers a **"Comorbidity Loop Warning"** and spikes the entropy meter, proving the categorical model cannot resolve the patient into a single box.

*If I had more time—or if I revisit this project—I would build a voice chat agent that narrows down diagnostic options on the fly.*

## A Visual Proof

To see how easily the DSM's categorical architecture collapses, we can look at the **Anxiety-Depression Vortex**. When a patient presents with fatigue, sleep disturbances, poor concentration, and restlessness, the diagnostic engine enters a circular loop: Condition A requires symptoms that simultaneously trigger Condition B, locking the data model (or clinician) into over-diagnosed comorbidity.

By analyzing the geometric clusters generated by `text-embedding-005`, we can extract two structural findings that challenge the foundation of Computational Psychiatry and Psychiatric AI (PAI):

### 1. Administrative Boilerplate Clustering

When looking at the Symptom Semantic Space, I noticed a strange, tight cluster of highly unrelated symptoms pulling together near the edge of the graph. When I inspected the raw text, the cause became obvious: these sentences all contained the standard legalistic boilerplate: *"The symptoms cause clinically significant distress or impairment in social, occupational, or other important areas of functioning."*

Because the manual repeats this phrasing across hundreds of disorders, the embedding model groups these different clinical realities at the same coordinates—proving the DSM often clusters conditions based on administrative boilerplate rather than clinical reality.

### 2. Language is the Glitch

In psychiatric research, there is a highly debated concept called the **p-factor**—a single, general factor of psychopathology suggesting that if a patient has one mental health issue, they are statistically predisposed to experience others.

Our vector space suggests a much simpler, more humbling explanation: **the p-factor is a linguistic artifact**. The language used to write the DSM is highly redundant. The text embeddings prove that many diagnoses are mathematically "so close" simply because the APA used the same words to describe different constructs. The overlap isn't necessarily a deep biological secret; it's a structural design defect in the manual's language.

This is where my linguistic experiment and the HDSS paper offer two fascinating, complementary perspectives. The HDSS paper shows that *actual patient presentations* collapse into a single, continuous space rather than discrete clusters. My embedding experiment suggests a potential structural reason for this: the very *language* used to define these disorders is mathematically entangled. If the diagnostic instrument (the DSM) is built on redundant, overlapping semantic definitions, the clinical data collected through it will inevitably reflect that overlap. It raises an intriguing question: is the p-factor a deep biological mystery, or is it, at least in part, a linguistic artifact of how we designed the manual?

> Training AI models on passive smartphone data to predict DSM labels is a dead end. If the underlying labels are mathematically entangled, a model boasting high accuracy isn't discovering a biological truth. It is just predicting the circular language of the manual and automating a flawed baseline.

## Beyond Text: Multimodal Emotion Recognition & FACS

If text-based DSM checklists collapse under mathematical scrutiny, it is tempting to ask: what if AI looks beyond text—analyzing facial expressions, vocal tone, and body language instead?

In **Multimodal Emotion Recognition**, AI systems process video frames, audio waves, and text simultaneously. On the visual side, many of these models rely on the **Facial Action Coding System (FACS)**—a taxonomy that breaks human facial expressions down into individual muscle movements called **Action Units** (for example, *Inner Brow Raiser*, *Brow Lowerer*, *Lip Corner Depressor*, or *Lip Pressor*). By detecting combinations of these muscle cues, a model classifies a face into discrete labels such as *neutral*, *happy*, *fear*, *sadness*, *contempt*, *surprise*, *anger*, or *disgust*.

On the surface, this looks similar to how a human therapist reads non-verbal body language. The critical difference—and why letting a machine classify emotions through a camera at scale is genuinely concerning—is **context**:

- **A therapist knows the patient's history.** When a therapist sees the corners of a patient's lips turn down, they don't read that muscle movement in a vacuum. They know the patient's spouse recently left them and that the patient has a history of depression—so classifying that expression as *sadness* is grounded in lived reality.
- **A machine only sees surface pixels.** A camera has no access to personal history, relationships, or why someone's brow is furrowed. A tense jaw or lowered brow can come from deep concentration, screen glare, chronic discomfort, or simple habit—not anger or clinical distress. The same facial expression can also carry very different meanings across cultures, and something as mundane as a sudden light flash, poor lighting, or a camera glitch can trigger technical misclassifications.

As I explored in my post on [AI Fairness, Bias, and the Human Advantage](https://www.leeboonstra.dev/ai-development/responsible-ai/mlfairness/), pattern-recognition systems also inherit skewed training data and uneven accuracy across demographics, lighting conditions, and vocal accents. Pairing a flawed, overlapping DSM baseline with context-blind facial classification at scale doesn't deliver objective insight—it risks mislabeling vulnerable people and causing real-world harm.

## The Path Forward

If we want to build genuinely useful AI systems for mental health, we must stop trying to automate the rigid, 20th-century box models of the DSM.

A static vector map is only a starting point, because true clinical understanding is a trajectory rather than a coordinate. This is why the human conversation between a patient and a therapist remains irreplaceable. A vector embedding can measure semantic similarity between symptoms, but it cannot untangle the temporal story of a life:
- **Sequence**: Did the insomnia trigger the panic, or did the panic cause the insomnia?
- **Behavioral consequences**: Is the patient avoiding morning meetings, calling out sick, or relying on caffeine to get through the day?
- **Timing and duration**: Do panic attacks hit only on Monday evenings at 8:00 PM for 45 minutes?
- **Personal narrative context**: Is the patient carrying guilt over a recent promotion because it belonged to a laid-off colleague?

The therapist's office is where static coordinates become a coherent human story.

I am not a psychiatrist, nor have I studied psychiatry. I am a software engineer with a laptop and a vibecoding toolkit. In a way, that is the point: specialized fields—like medicine, law, finance, and logistics—benefit immensely from collaborating with software engineers and data scientists.

When you spend your entire career inside a single discipline, you naturally adopt its consensus assumptions, its vocabulary, and its traditional structures (like the DSM's categorical boxes) as absolute truth. But when a software engineer or data scientist looks at the exact same domain, they don't see academic consensus; they see **data architecture, relational integrity, schemas, and state machines**.

When we collaborate across boundaries—combining the deep contextual wisdom of the domain expert with the rigorous, systems-level architecture of the engineer—we stop automating the flaws of the past and start building the architecture of the future.

> <small style="color: var(--color-text-muted, #777); font-style: italic; font-size: 0.5em;"><strong>NOTE:</strong> The analysis presented here is strictly an engineering and computational proof of concept. I hold no medical or psychiatric credentials. All data and tools have been released as open-source software on <a href="https://github.com/savelee/dsm-in-vector-space" target="_blank" rel="noopener">GitHub (savelee/dsm-in-vector-space)</a> to encourage rigorous evaluation, refinement, and collaboration by qualified medical and psychiatric professionals.</small>

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


