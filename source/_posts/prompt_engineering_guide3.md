---
title: Beyond the Basics How to Choose and Configure Your LLM for Maximum Impact
description: LLM selection and configuration for business. Expert tips on model choice, output length, sampling, and safety settings. Boost your AI performance.
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
featured: promptengineering3
date: 2024-06-24 12:00:00
---

When it comes to AI prompt engineering, the choice of language model (LLM) is crucial. Each prompt should be carefully optimized for the specific LLM you're using, whether it's one of the Gemini language models in Vertex AI, GPT, Claude, or an open-source model like LLaMA. It's important to note that a prompt that was optimized for TextBison won't necessarily work in Gemini. This principle holds true not just across different models but also between different versions of the same model.

*This is the 3rd blog of the series: Prompt engineering for business applications. Prompt Engineering is complex and requires careful planning and refinement to achieve desired results from AI models. As a software engineer @Google with experience in prompt engineering for major businesses, I will share practical learnings in a blog series to help others unlock the power of AI beyond simple tasks.*

* Blog 1: [Demystifying Prompt Engineering for the Enterprise](https://www.leeboonstra.dev/prompt-engineering/prompt_engineering_guide1/)
* Blog 2: [The Foundation Understanding LLMs and Prompt Engineering, and Why It All Matters](https://www.leeboonstra.dev/prompt-engineering/prompt_engineering_guide2/)

<!--more-->

<img src="/images/medium_promptengineering3.jpeg" alt="Beyond the Basics: How to Choose and Configure Your LLM for Maximum Impact" />

Here are some considerations for choosing a model that fits with your use-case:

* **Small vs. Large Model:** The model's size can significantly impact its performance and the quality of its responses. Smaller models may be faster and more cost-effective, but they lack the complexity and nuance of larger models. For instance, a smaller model could be sufficient for basic text classification tasks, while a larger model might be necessary for complex question answering or creative text generation.
* **Industry-Specific Models:** In some cases, specialized models trained on domain-specific data can offer superior performance. For example, Med-PaLM and Sec-PaLM are tailored for medical and cybersecurity applications. If your use case falls within a specific industry, it's worth considering whether a specialized model could provide more accurate and relevant results.
* **Open-Source (e.g., Gemma) vs. Vertex AI:** The decision between open-source models and those available on Vertex AI should be based on factors such as customization needs, model size, architecture, access to computational resources, library usage and cost. Open-source models offer flexibility and potential cost savings but may (or may not) require more setup and fine-tuning. On the other hand, Vertex AI provides a managed environment with pre-trained models and seamless integration with other Google Cloud services.
* **Context Window Size & Output Token Limit:** The context window refers to the maximum amount of text the model can use when generating a response. The output token limit determines the response length the model can produce. The limits on these parameters are essential to consider, especially when working with long documents or complex prompts. For instance, if you need to summarize a lengthy legal contract, you'll need a model with a large enough context window to process the entire document. When you choose JSON as an output format, the JSON format itself might eat up half of your output tokens, so the output token limit is equally important.

## Fine-Tuning Your LLM: It's Not Just About the Model
Once you pick the correct model for your use case, you must tinker with the various configurations of an LLM, such as the output length and sampling controls, such as temperature or Top-K/Top-P. Most LLMs come with multiple configuration options that control the LLM's output. Effective, prompt engineering requires setting these configurations optimally for your task.

## Output Token Length
One of the key settings is the output token length. This controls how many tokens (roughly words) your LLM spits out in its response. Now, here's the thing: more tokens mean more computing power, which translates to higher costs and potentially slower response times. And guess what? Making the output shorter doesn't magically make your LLM more concise. It just causes the LLM to stop predicting more tokens once the limit is reached.

TIP: If you're dealing with JSON output, be extra careful with the token limit. The JSON formatting itself can eat up a lot of tokens, so you don't want to end up with a broken response, which makes the JSON invalid (and therefore, you can't chain API calls).

## Sampling Controls: Let's Get Creative (or Not)
LLMs don't just predict one word at a time. They actually calculate probabilities for all the words in their vocabulary and then sample from those probabilities to choose the next word. This is where things like temperature, Top-K, and Top-P come in. They control how random and creative (or not) your LLM gets.

## Temperature
Temperature controls the degree of randomness in token selection. Higher temperature means more random and unexpected results, while lower temperature makes your LLM stick closer to the expected output. Think of it like this: crank up the temperature if you want your LLM to write a wild marketing blog post. But if you need it to extract medical info from a patient report, keep it low and factual.

NOTE: Don't go overboard with the temperature. Above 1, things start to get weird and nonsensical. As the temperature increases, all tokens become equally likely to be the next predicted token.

## Top-K and Top-P
Top-K and Top-P (also known as nucleus sampling) are two sampling settings used in LLMs to restrict the predicted next token from tokens with the top predicted probabilities. Like temperature, these sampling settings control the randomness and diversity of generated text.

Top-K picks the top (K) most likely words, while Top-P picks the words whose combined probability doesn't exceed a certain value (P).

The best way to choose between Top-K and Top-P is to experiment with both methods (or both together) and see which one produces the results you are looking for. A low temperature (e.g., 0.1, works best with a high Top-P: 0.95)

## Safety Settings
Many large language models have safety settings or content-filtering controls. For instance, Gemini comes equipped with safety settings designed to filter model output, preventing the generation of harmful, unsafe, biased, or unfair content. These settings can be configured to align with your specific requirements and risk tolerance. They can be turned off so no filtering is applied, they can be set to moderate to mostly remove unsafe content, but potentially harmful content might still be present, or strict, which filters rigorously to minimize the risk of unsafe content.

NOTE: Safety settings depend on the model, are not foolproof, and might not catch all instances of unsafe content. Human oversight and additional safeguards are still necessary.

Coming up next in our series, we're diving into a topic that's often overlooked but very important: documenting your prompts. I know, it might not sound as exciting as playing around with LLMs, but trust me, it's a total game-changer. So stay tuned for our next post where I'll spill all the details to save yourself from future headaches!