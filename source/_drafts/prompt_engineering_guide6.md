---
title: Best Practices for Prompt Engineering in the Enterprise
description: Elevate your enterprise AI projects with proven prompt engineering best practices.  Google SWE Lee Boonstra shows how to streamline workflows, improve accuracy, and achieve business goals.
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
featured: promptengineering6
date: 2024-06-10 12:00:00
---

Alright, we've covered a ton of ground in this blog series, from understanding the basics of LLMs and prompt engineering to diving deep into specific techniques and strategies. Now, it's time to bring it all together and share some of the best practices I've learned while working on real-world enterprise projects.

<!--more-->

<img src="/images/large_promptengineering6.png" alt="Best Practices for Prompt Engineering in the Enterprise" />

## Combine all techniques
When writing prompts for enterprise use cases, you should create a folder with each prompt as a single code file in a versioning system. These prompts can be many paragraphs long and will be changed over time. I've created a structure of a typical prompt structure. Each should be in its own paragraph. I gave short examples for each row, though the actual prompt should be more detailed with more examples and instructions.

*It's also important to understand that you can overload a model with too many instructions or constraints. - They can clash, or a model can favor one instruction over another. At some point, when there are too many instructions, the model forgets about the others. Look into splitting up prompts into multiple prompts (API Calls) and a variety of examples, and guide the instructions step by step.*

## Prompt Structure Template

### Role
Explain the role and expertise of the model.

```
Act like a legal advisor. You have expertise in analyzing rental contracts.
```

### TASK
Explain the task. Specify the task, concise in a few lines.

```
<TASK>
Provide a 1 paragraph concise and simple-to-understand (non-legal) answers 
for tenants who need help understanding this legal rental contract:
```

### Context
Insert the context in the prompt.

```
<CONTEXT>
...
[INSERT CONTRACT FROM GCS]
...
```

### Output Format
The expected output format.

```
Return valid JSON using the following JSON schema:

SCHEMA:

{
    "$schema": "http://json-schema.org/draft-04/schema#",
    "type": "object",
    "properties": {
        "answer": {
            "type": "string"
        }
    },
    "required": [
        "answer"
    ]
}
```

### <INSTRUCTIONS>
Provide a list with instructions.

```
<INSTRUCTIONS>
1. Write the answer in easy-to-understand English so a 12-year-old can 
understand.
2. Return only valid JSON responses with the previously provided JSON schemas.
3. Encourage exploring various possibilities.
```

### Examples
Few Shots, Min 3–5 few-shots/reasoning examples.
```
EXAMPLE OF REASONING:

Question:
How should gasoline be disposed?
1. The contract does not specifically mention gasoline.
2. Section 22 of the legal agreement states that all hazardous materials must be disposed of properly. 
3. Gasoline is a hazardous material.

Conclusion:
4. Therefore, gasoline must be disposed of properly.

RETURN:
```json
{
    "answer": "Gasoline must be disposed of properly."
}
```
```

### <CONSTRAINTS>
Provide a list with constraints. (but favor instructions over constraints).

```
<CONSTRAINTS>
- Refrain from using sarcasm in your response.
- Do not include any personally identifiable information.
```

### Question
End with the actual question/task.

```
Are pets allowed in this property?
```

## Provide examples
The most important best practice is to provide (one-shot / few-shot) examples within a prompt. This is very effective. These examples showcase desired outputs or similar responses, allowing the model to learn from them and tailor its generation accordingly. It's like giving the model a reference point or target to aim for, improving its response's accuracy, style, and tone to match your expectations better.

## Design with simplicity
Prompts should be concise, clear, and easy to understand for both you and the model. As a rule of thumb, if they're already confusing for you, they will likely be confusing for the model. Try not to use complex language and don't provide unnecessary information.

Try using verbs that describe the action. Here's a set of examples:

**Act, Analyze, Categorize, Classify, Contrast, Compare, Create, Describe, Define, Evaluate, Extract, Find, Generate, Identify, List, Measure, Organize, Parse, Pick, Predict, Provide, Rank, Recommend, Return, Retrieve, Rewrite, Select, Show, Sort, Summarize, Translate, Write**

Examples:

BEFORE:
```
I'm thinking about maybe changing up my investments, stocks and stuff. 
I've got some money saved, but I'm not really sure what to do with it. 
Any suggestions for good places to put it?
```

AFTER:
```
Analyze my financial portfolio and recommend suitable investment options 
based on my risk tolerance and long-term financial goals.
```

## Be specific about the output
Be specific about the desired output. A concise instruction might not guide the LLM enough or could be too generic. Providing specific details in the prompt (through system or context prompting) can help the model to focus on what's relevant, improving the overall accuracy.

Examples:

DO:
```
I am interested in investing in the technology sector. 
Identify three tech stocks with strong growth potential over the next
 five years. For each stock, provide a brief overview of the company, 
its key products or services, and the reasons for its potential growth.
```

DO NOT:
```
Tell me some stocks I should buy.
```

## Use Instructions over Constraints
Focusing on the positive instructions in prompting can be more effective than relying heavily on the constraints. This approach aligns with how humans prefer positive instructions over lists of what not to do.

If possible, use positive instructions: instead of telling the model what not to do, tell it what to do instead. This can avoid confusion and improve the accuracy of the output.

DO:
```
Summarize the patient's diagnosis, treatment plan, medications, 
and follow-up appointments in clear, concise language that the patient 
can easily understand. Focus on the key information the patient needs to 
know to manage their condition at home.
```

DO NOT:
```
Do not include any information about the patient's family history or 
social circumstances in the discharge summary. Avoid using medical jargon 
that the patient might not understand. Do not disclose any information 
that could violate patient confidentiality.
```

As a best practice, start by prioritizing instructions, clearly stating what you want the model to do, and only using constraints when necessary for safety, clarity, or specific requirements. Experiment and iterate to test different combinations of instructions and constraints to find what works best for your specific tasks, and document these.

## Use variables in prompts
To reuse prompts and make them more dynamic, use variables in the prompt, which can be changed for different inputs. For, as shown below, a prompt that extracts a burger meal order. Instead of hardcoding the meal name in the prompt, use a variable. Variables can save you time and effort by allowing you to avoid repeating yourself. Suppose you need to use the same piece of information in multiple prompts. In that case, you can store it in a variable and then reference that variable in each prompt. This makes much sense when integrating prompts into your own applications.

Variable
```
meal = "Hamburger kids menu."
```
Prompt
```
You are working at a fastfood restaurant. Please take the next order:
Hi, can I have a {meal}.
```

Output: 1 hamburger kids menu has been added to your cart.

## Experiment with input formats and writing styles
Different models, model configurations, prompt formats, word choices, and submits can yield different results. Therefore, it's essential to experiment with prompt attributes like style, word choice, and type prompt (zero-shot, few-shot, system prompt).

For example, a prompt to generate results for a new diabetes drug can be formulated as a question, a statement, or an instruction, resulting in different outputs:

* **Question:** What are the clinical trial results for the new diabetes drug [drug name], and what are its potential benefits and risks compared to existing treatments?
* **Statement:** [Drug name] is a newly developed drug for treating diabetes. The clinical test results are…
* **Instruction:** Write a comprehensive report on the new diabetes drug [drug name]. Include information on its mechanism of action, clinical trial results, safety profile, and potential benefits and drawbacks compared to current treatment options.

## Adapt to Model Updates
You must stay on top of model architecture changes, added data, and capabilities. Try out newer model versions and adjust your prompts to leverage new model features better. Tools like Vertex AI Studio are great for storing, testing, and documenting the various versions of your prompt.

## Use tooling

### Model Garden (https://cloud.google.com/model-garden)
Finding the right prompt requires tinkering. The Model Garden in Vertex AI is a perfect place to play around with your prompts, with the ability to test against the various models. An advantage of using the Model Garden is saving your used prompts within your project.

### Colab (https://colab.research.google.com/)

Another great tool to help with tinkering is Google Colabs, where you can write the API code to test your prompts. An advantage of using Colabs over the Model Garden is that it allows you to play around with the various API configuration settings and automate your prompts by running over a list of inputs or pulling contents from Google Cloud storage to inject as a context. It logs errors, and you can use the built-in Gemini LLM to help you debug in case things go wrong.

### Spell Checker

Try not to use grammar or spelling mistakes in your prompt. It won't hurt, but you should steer the model towards correctly spelled phrases. Therefore, try to use a spell checker.

### Code Validators

Alternately, when using code in your examples, use validators to prevent from making coding mistakes that can steer your model towards broken code.

## Ground to evidence by citing the context or referring to sections
When working with a large context, you can make responses more accurate (and less hallucinatory) by asking the LLM to cite the specific section or section number of the context document where the information that contributed to the answer was found.

Requiring citations or section numbers forces the model to explicitly link its response to specific parts of the text and prevents it from generating answers based on general knowledge and assumptions, which might be incorrect or irrelevant to the particular document.

Not only does it ground evidence, but it also provides you with a valuable trail of where the model found the answer. This can be powerful if you want to rate and cross-check generated answers, enhancing your ability to evaluate the model's performance.

Answer the following question based on the provided contract; make sure to include the relevant section numbers that contributed to the answer.

```
Answer the following question based on the provided contract, 
make sure to include the relevant section numbers that contributed 
to the answer. 

Question:
Are pets allowed on the property?
```

## Use Human / Automatic Raters
The importance of rating your generated prompt responses cannot be overstated. Whether by a human rater using a rubric or at scale by a machine, the feedback loop created through rating is essential for refining and optimizing your prompts. Human raters provide nuanced insights into the quality, relevance, and coherence of the LLM's output, while machine raters offer scalability and efficiency in evaluating large volumes of responses. By incorporating both human and machine ratings, you can ensure that your prompts consistently guide LLMs to generate the best possible results for your enterprise AI applications.

Here are some examples of criteria:

{% gist 4eff5d2dda0b727446d594e8251a0478 %}

A human rater could better understand nuances in the language, subtle errors, and the context of the prompt. They can evaluate the tone and appropriateness for the intended audience. Letting a machine or another LLM rate your prompt outputs can be beneficial for testing on scale and evaluating large volumes of responses. Machines can also calculate objective metrics such as word count, sentence length, code correctness, etc.

The most effective approach is often to combine human and machine ratings.

## Experiment together with other prompt engineers or subject matter experts
If you are in a situation where you have to try to come up with a good prompt, you might want to find multiple people to make an attempt. When everyone follows the best practices (as listed in this chapter), you will see a variance in performance between all the different prompt attempts.

Besides prompt engineering with other engineers, it might be equally helpful to sit together with a subject matter expert. When the subject matter expert rates your prompt outputs, discuss what perfection looks like and brainstorm ideas on how to reach this goal, e.g., providing examples, rewording certain instructions, etc.

## Conclusion
Throughout this series, we've explored the world of prompt engineering for complex business problems. We've learned that effective prompting isn't just about asking the right questions; it's about crafting instructions that guide large language models toward desired outcomes, considering the nuances of language and context, and iterating based on feedback and results. By mastering these skills, we can unlock the true potential of Generative AI. Remember, prompt engineering is a journey, not a destination!