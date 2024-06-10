---
title: Documenting Your Prompts A Best Practice for Success
description: Let’s be real; documenting stuff isn’t the most exciting part of any job. But when it comes to prompt engineering, it’s an absolute lifesaver. I know it can feel like extra work, but trust me, it’ll…
tags:
  - Large Language Models
  - Prompt Engineering
  - Gemini
  - ChatGPT
  - LLM
  - Enterprise
  - Real-world
categories:
  - Prompt Engineering
featured: promptengineering4
date: 2024-06-10 12:00:00
---

Let's be real; documenting stuff isn't the most exciting part of any job. But when it comes to prompt engineering, it's an absolute lifesaver. I know it can feel like extra work, but trust me, it'll save you from major headaches later on.

<!--more-->

<img src="/images/large_promptengineering4.png" alt="Documenting Your Prompts: A Best Practice for Success" />

Given how much prompt outputs can change across different models, sampling settings, and even different versions of the same model, it's super important to document everything. You might get a response with slightly different wording or formatting, even with the exact same prompt, so keeping good records is key for future work.

I recommend using a Google Sheet, with a table like the one presented below on each tab, to track your prompts. This way, you have a complete history when you need to revisit old work, test how prompts perform on new model versions, or troubleshoot issues.

Feedback is a cornerstone of prompt engineering, providing valuable insights for improvement. If you're fortunate enough to use Vertex AI Studio (Model Garden), save your prompts (using the same name and version as listed in your documentation) and track the hyperlink to the saved prompt in the table. This way, you're always one click away from re-running your prompts and incorporating valuable feedback into your iterations.

TIP: If you're working with a Retrieval Augmented Generation (RAG) system, also note down the specific RAG settings that affect the content inserted into the prompt (such as query, chunk settings, output, etc.).

{% gist 8fd292dbcf1fb887c29f55ee4df68655 %}

Once you feel the prompt is close to perfect, please take it to your project codebase. In the codebase, save prompts in a separate file from the code so they're easier to maintain. Finally, ideally, your prompts are part of an operationalized system, and as a prompt engineer, you should rely on automated tests and evaluation procedures to understand how well your prompt generalizes to a task.

Remember, prompt engineering is all about continuous improvement. You'll need to create and test different prompts, analyze and document the results, tweak your prompts based on how the model performs, and keep experimenting until you get the results you want. If you change the model or its configuration, go back and test your old prompts again. This iterative process is key to refining and optimizing your prompts for the best possible performance.

In the next blog post, we'll dive deeper into the art of crafting effective prompts. We'll explore different techniques like role prompting, contextual prompting, and few-shot prompting, and we'll share tips on how to write prompts that are clear, concise, and effective. Stay tuned!