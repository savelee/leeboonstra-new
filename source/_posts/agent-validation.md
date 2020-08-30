---
title: Create high-quality chatbots by making use of agent validation, an out of the box review feature.
description: Dialogflow provides a validation feature. Agent validation results are available automatically whenever agent training is performed and completed. You can access the results of validation from either…
categories:
  - Chatbots
tags:
  - Dialogflow
  - Chatbots
  - Machine Learning
  - AI
alias: /developer/agent-validation/
date: 2020-03-30 14:41:36
featured_image: 0_ajEHOpc-Kr03Zv1E.png
thumbnail: 0_ajEHOpc-Kr03Zv1E_1.jpg
---

Dialogflow provides a validation feature. Agent validation results are available automatically whenever agent training is performed and completed. You can access the results of validation from either the Dialogflow Console or the API.

<!--more-->

When you are building a chatbot which becomes a little bit more advanced, you will easily end up with lots of intents and entities. Maybe, you are even working with a team within your Dialogflow project. Various ux designers working on various intents. Where people work, mistakes are made. This can become a problem when you are training your Dialogflow model.

Common mistakes that can be made in Dialogflow are:

* No, or not enough training phrases in an intent.
* The intent has training phrases which are too similar to each other, or to training phrases of other intents.
* Variations of entities are not used enough in training phrases.
* Text is annotated within some training phrases but not in others.
* No negative examples for the fallback intents.

What's good to know is that Dialogflow has an automatic validation feature built-in the Dialogflow console or API. The results are available whenever the agent training is completed.

The agent validation feature is by default enabled. Should you not be able to find it, you can enable the Agent Validation toggle setting in the **Settings > ML Settings** tab.

Once you click **Validation** in the Dialogflow menu (and the agent has been trained), you will see the results of the validation:

![Dialogflow Validation](/images/0_ajEHOpc-Kr03Zv1E.png)

The validation results provide a list of warnings and errors that you should correct to improve the quality and performance of your agent. It can find issues on (global) agent level, in intents or in entities. If your agent has warnings or errors, you can choose to ignore them and launch your agent. It's for informational purposes only, but you would rob yourself from Agent Quality by not using this feature, basically this is a Dialogflow Agent Review out of the box, for free!

Issues can represent various levels of severity. Only Info, Warning and Error messages are shown in the Validation screen. The settings Critical and Unspecified are available in the SDK (or on the specific intent / entity pages).

```
INFO - The agent doesn't follow the best practice
WARNING - The agent might not behave as expected.
ERROR - The agent may experience partial failures.
CRITICAL - The agent may completely fail.
SEVERITY_UNSPECIFIED - Not specified. This value should never be used.
```

Here are some examples:
In this example there are 6 warnings in various intents.

![Dialogflow Validation](/images/0_t74TgSdQI5E7eQ8i.png)

* The **estimate-yes-agent-count-calls-per-month** intent, annotated 'Around 70000' as text, but the parameter expects a @sys.number. Just annotating the number would in the training phrase, would fix this warning.
* The **estimate-yes-agent-count-invalid-calls-per-month** intent has no training phrases. Oops, I likely forgot to provide those.

In this example, you can see there is an error in my entity FirstName where it uses duplicated aliases (values). I would likely need to delete those.

![Dialogflow Validation](/images/0_66XRF8wjABXchNfO.png)

**NOTE: At most 5000 issues are shown at a time. If you have over 5000 issues, you may not see a count reduction until less than 5000 remain.**

Besides the validation screen, when you visit either the intents list or the entities list pages, any intents or entities with validation errors show an error outline indicator next to the name.

![Dialogflow Validation](/images/0_HTGbZX-u3mEN7vIj.png)

Also, when you visit a page for a specific intent or entity that has validation errors, an error outline indicator is shown near the **Save** button.

![Dialogflow Validation](/images/0_zUjiOI8Dm5QOhulo.png)

Clicking this indicator shows a list of errors for the intent or entity. By default, only errors with a severity of *CRITICAL* or *ERROR* are shown.

It's also possible to run the validation from your code, through the SDK. ([ValidationResult](https://medium.com/r/?url=https%3A%2F%2Fcloud.google.com%2Fdialogflow%2Fdocs%2Freference%2Frpc%2Fgoogle.cloud.dialogflow.v2beta1%23google.cloud.dialogflow.v2beta1.ValidationResult)). This might be handy, in case you are building your own CI/CD pipelines, and before bringing your agent to production, you might want to run the agent validation first.

Here's an example on how you could implement this for Node.js:

{% gist 620084b4806ad6c4a5d105235dd88262 %}

The [ValidationResult](https://cloud.google.com/dialogflow/docs/reference/rpc/google.cloud.dialogflow.v2beta1#google.cloud.dialogflow.v2beta1.ValidationResult) response could look like this:

``` JSON
{
"validationErrors": [
{
"severity": "ERROR",
    "entries": [
       "projects/my-project/agent/intents/58b44b2d-4967–4a81-b017–   12623dcd5d28/parameters/bf6fdf55-b862–4101-b5b1–36f1423629d0"
    ],
"errorMessage": "Parameter 'test' has an empty value."
},
{
"severity": "WARNING",
    "entries": [
        "projects/my-project/agent/intents/271e3808–3c91–4e6b-89e8–47951abcec8d"
],
"errorMessage": "Intent 'app.current.update' does not have enough unique training phrases. Consider adding more different examples."
},
{
"severity": "ERROR",
    "entries": [
       "projects/my-project/agent/intents/26e64b1b-eaa7–4ce2-be46–631a501fccbe/trainingPhrases/a650375e-083c-4bb5–9794-ba9453e51282",
       "projects/my-project/agent/intents/58b44b2d-4967–4a81-b017–12623dcd5d28/trainingPhrases/1d947780–22d3–4f80–8d7a-3f86efbf0be3"
],
"errorMessage": "Multiple intents share training phrases which are too similar:\n - Intent 'app.notifications.open': training phrase 'open allo notifications settings'\n - Intent 'app.current.notifications.open': training phrase 'open notifications settings'"
}
]}
```

## Conclusion

As you have seen, Dialogflow provides an out of the box agent review & validation feature. It's enabled by default and you can access it via the Dialogflow console or through the API. This will give you an overview of errors and warnings, which you should fix to improve your agent quality.

When a large number of issues are found you should consider fixing the issues in small batches, based on similarity. It might be that fixing one issue may solve similar issues after you retrain the agent.

So, now you know: Before bringing your chatbots to production, always check the validation page!