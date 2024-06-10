---
title: The Art of Writing Effective Prompts
description: Master essential prompt engineering techniques for business applications. Learn about role prompting, contextual prompting, and more from Google Software Engineer Lee Boonstra.
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
featured: promptengineering5
date: 2024-06-10 12:00:00
---

Whether you are writing a prompt to let the LLM answer a question from a contract, summarize a report, classify user feedback, or extract order information, writing a prompt containing just one line with the question is likely insufficient. You will need to provide instructions, constraints, reasoning, and a few-shot examples, and you will set your expectations for the style and output format. Trust me, you will quickly end up with an extensive written prompt, which increases in size over the various iterations.

<!--more-->

<img src="/images/large_promptengineering5.png" alt="The Art of Writing Effective Prompts" />

Writing prompts can present challenges, particularly when instructions or constraints clash. For instance, an instruction to 'avoid hallucinations or fabrications' could hinder creativity or explanations in certain edge cases. This underscores the importance of adaptability in your prompt writing approach. When working with a test set of example user inputs, it's crucial to be flexible and ready to revisit and verify if recent prompt changes don't disrupt previously successful prompts. This adaptability is key to maintaining the effectiveness of your prompts.

## Providing Instructions and Constraints

Instructions and constraints are used in prompting to guide the output of a LLM.
* An **instruction** provides explicit instructions on the desired format, style, or content of the response. It guides the model on what the model should do or produce.
* A **constraint** is a set of limitations or boundaries on the response. It limits what the model should not do or avoid.

When we as humans receive feedback, often we don't like to hear whole lists of things not to do. Similar to humans, machines prefer positive feedback also more than the negative.

Growing research suggests that focusing on positive instructions in prompting can be more effective than relying heavily on constraints.

Instructions directly communicate the desired outcome, whereas constraints might leave the model guessing about what is allowed. It gives flexibility and encourages creativity within the defined boundaries, while constraints can limit the model's potential. Also, a list of constraints can clash with each other.

Of course, constraints still have their place, especially when you need to prevent harmful or biased content or when you have strict output requirements.

Here's a quick example for instructions:

```
<INSTRUCTIONS>
- Write the answer in easy-to-understand English so a 12-year-old can understand.
- Return only valid JSON responses with the previously provided JSON schemas.
- Write the answer in a maximum of 2 paragraphs.
```

And here's an example for constraints:

```
<CONSTRAINTS>
- Refrain from using sarcasm in your response.
- Do not include any personally identifiable information.
```

## A Word About Word Counts
Be careful when giving instructions with word or character counts. LLMs process text in chunks called "tokens," and these don't always match up perfectly with words. A single word might be split into multiple tokens or vice versa. So, it's tough to predict the exact word count based on a token limit.

Similarly, a constraint with a max word count doesn't tell the LLM how to handle situations where it can't fit all the necessary info within that limit. Should it prioritize being concise or complete?

Despite these challenges, LLMs like Gemini can still be helpful in generating text within approximate word count ranges. Even if you've set a global max output token limit of 1024 in the API config, you can still use a prompt like:

```
Summarize this article in under 200 tokens.
```

This reinforces your expectation for a concise summary and helps the LLM focus on the most important info.

## Prompting Techniques for Business Applications
Alright, let's get into some of the specific prompting techniques that I've found super helpful when I'm working on business-related GenAI projects. These are the tricks I use to make sure the LLM really "understands" what I'm trying to achieve and gives me the best possible results.

## Role Prompting: Giving the Model a Persona
Role prompting assigns a specific character or identity for the language model to play. A role helps the model generate responses consistent with the assigned role and associated knowledge and behavior.

Role prompting is a technique in prompt engineering that involves assigning a specific role to the generative AI model. This can help the model generate more relevant and informative output, as the model can craft its responses to the particular role it has been assigned.

For example, you could tell the AI to act like a book editor, a financial advisor, or even a motivational speaker. Once it's in character, you can give it prompts that are related to that role. Look at the example below where the model takes on the role of a store clerk. The second tables takes away the role and goal, the LLM's answer becomes way more generic:

{% gist 28c492615eef55c784aa15f6644a8ddf %}

See the difference? By giving a role, we get a much more personalized and engaging response.

## Adding Some Style to the Role
We can even take it a step further by adding a specific style. 

Here are some styles I like to use:
**Confrontational, Descriptive, Direct, Formal, Humorous, Influential, Informal, Inspirational, Persuasive**

{% gist 84018bf6aea358d167e682185a0849cc %}

Let's try making our store clerk prompt a bit more humorous and persuasive:

Much more fun, right?

## Contextual Prompting: Providing Background Info
Another technique I use is called "contextual prompting." This is where we give the model some background information to help it understand what we're asking. The model will be able to more quickly understand your request and generate more accurate and relevant responses:

```
You are specialized in laws, and your goal is to summarize and explain in easy-to-understand English the following terms & conditions:

Google Play Terms of Service
March 15, 2023 (View archived version)

1. Introduction
Applicable Terms. Thanks for using Google Play. Google Play is a service provided by Google LLC ("Google", "we" or "us"), located at 1600 Amphitheatre Parkway, Mountain View, California 94043, USA. Your use of Google Play and the apps (including Android Instant Apps), system services, games, movies, books, magazines, or other digital content or services (referred to as "Content") available through it is subject to these Google Play Terms of Service ("Play ToS") and the Google Terms of Service ("Google ToS") (together referred to as the "Terms"). Google … 
… [ASSUME THIS IS A VERY LONG PAGE] …For additional details and restrictions regarding your access and use of Google Play Movies & TV/Google TV, see the Google Play Movies & TV/Google TV Usage Rules.

Now, summarize a 1 paragraph summary.
```

Output: The Google Play Terms of Service outline the rules for using Google Play to access and purchase digital content like apps, games, movies, and books. It covers topics such as account requirements, payment methods, content restrictions, updates, and user privacy. Essentially, it explains your rights and responsibilities as a Google Play user, including how you can use the content you purchase and how Google may manage or remove content from the platform.

NOTE: When providing large context prompts, you will need a model capable of a large context window. As of May 2024, Gemini 1.5 Pro has a 2 million token context window. To give a rough idea, that's about 1,400,000 words of text, which could equate to several hundred pages of a PDF. This is great for use cases such as document summarization or question and answer.

TIP: Understanding how language models use attention mechanisms can be beneficial. These mechanisms weigh the importance of different parts of the input. With very long contexts, the model might not allocate enough attention to sections in the middle, leading to information loss. To mitigate this, you could test by breaking the context into smaller pieces and submitting multiple requests or experimenting with an RAG system that chunks documents into smaller, overlapping pieces.

## One-Shot & Few Shot Prompting
When I'm working with AI models, I've found that giving them examples can be super helpful. This is especially true for tasks where I need the LLM to classify things or extract specific info. Examples help the model understand the patterns and structure I want in the output.

* A **one-shot** prompt provides a single example, hence the name one-shot. The model has an example it can mimic to best complete the task.
* A **few-shot** prompt provides multiple examples of the model. This approach shows the model a pattern that it needs to follow. The idea is similar to a one-shot, but multiple examples of the desired pattern increase the chance the model follows the pattern.

## How Many Examples Are Enough?
There's no magic number for how many examples you need in few-shot prompting. It depends on how complex the task is, how good your examples are, and the specific AI model you're using. I usually start with three to five examples and adjust from there.

TIP: When using few-shot prompting for classification tasks, mix up the different types of responses in your examples. This helps the model learn the critical features of each category instead of just memorizing the order of the examples. By mixing things up, you'll get more accurate and unseen results.

See an example below:

{% gist 61557a826b47046bdf2e51cda08373ee %}

When you choose examples for your prompt, use examples relevant to the task you want to perform. The examples should be diverse, high-quality, and well-written. One small mistake can confuse the model and result in undesired output.

If your goal is to generate output that can handle a wide range of inputs, it's essential to incorporate edge cases in your examples. These are unusual or unexpected inputs that the model should still be able to process.

## Experiment with various output formats
When I'm working on projects that involve extracting, selecting, parsing, or organizing data, I've found that using structured output formats like JSON or YAML can be a game-changer. JSON objects have several advantages when returned from a data extraction prompt. In a practical scenario, the JSON format is automatically generated, the data can be sorted (particularly useful for datetime objects), and most importantly, the prompt for a JSON format compels the model to create a structure and prevent hallucinations.

TIP: Before feeding your JSON examples to a prompt, ensure they're valid. You can use online tools like JSONLint to check for errors. Trust me, even a tiny mistake, like a missing quotation mark, can mess up the AI's output.

If you're dealing with complex JSON objects, consider giving the prompt a JSON schema to work with. This helps the AI understand the expected structure and format of the output so you get consistent and reliable results. Have a look at the next example:


{% gist 1a895577d179b23fae1eb5428ee1fe34 %}

## Chain of Thought (COT) Prompting
Chain of Thought (CoT) prompting is a great way to make LLMs better at reasoning. It's like teaching the model to think step-by-step instead of just jumping to a conclusion. You can combine it with few-shot prompting to get better results on more complex tasks that require reasoning before responding as it's a challenge with a zero-shot chain of thought.

With CoT prompting, we give the LLM a problem and then show it examples of how to break down the problem into smaller steps. This helps them learn to reason through the problem logically, which can lead to more accurate and reliable answers.

Let's look at some examples:

```
Your goal is to provide answers to legal questions. You have to get answers from the contract.

CONTRACT:
…
Term 4: Animals and birds are not allowed on the property.
…

Can I have a goldfish in my house?
```

Output: The contract prohibits "animals and birds". It does not mention fish. Therefore, based on this contract alone, you could likely have a goldfish in your house.

```
Your goal is to provide answers to legal questions. You have to get answers from the contract. Let's take a step-by-step approach:

CONTRACT:
Term 4: Animals and birds are not allowed on the property.

EXAMPLE REASONING:
Question: Do I need to dispose of gasoline?
Answer:
1. Hazardous fluids need to be appropriately disposed of.
2. Gasoline is a hazardous fluid.
3. Therefore, gasoline needs to be appropriately disposed of.

Question: Can I have a goldfish in my house?
Answer:
```

Output: The contract prohibits animals and birds on the property. A goldfish is an animal. Therefore, a goldfish is not allowed on the property.

Chain of Thought can be helpful for various use-cases. Think of code generation as breaking down the request into a few steps and mapping those to specific lines of code. For creating synthetic data, when you have some kind of seed, like "The product is called XYZ, write a description guiding the model through the assumptions you would make based on the product given title." Generally, any task solved by "talking through" is a good candidate for a chain of thought. If you can explain the steps to solve the problem, try the chain of thought.

TIP: In Chain of Thought prompting, the reasoning process is crucial. Placing the answer after the reasoning is required because the generation of the reasoning changes the tokens that the model receives when it predicts the final answer.

TIP: Chain of Thought prompting is based on greedy decoding, predicting the next word in a sequence based on the highest probability assigned by the language model. Generally speaking, when using reasoning, to come up with the final answer, there's likely one single correct answer. Therefore the temperature should always set to 0.

In the next post, we'll dive into some best practices that I've found super useful in business applications. See you next time!