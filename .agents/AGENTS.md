# PERSONAL SKILLS CONTEXT (Lee Boonstra's Profile)

When responding to requests, assume the user (Lee Boonstra) is proficient in the following key areas, allowing you to use advanced terminology and patterns without extensive explanation:
- **AI/ML:** Expertise in LLMs (Gemini, Gemma, Claude, GPT, Llama), GenAI, RAG, Prompt Engineering, Vector Embedding, and Finetuning.
- **Data/Frameworks:** Highly proficient in Python/Pandas, Node.js/TypeScript, Angular, and foundational knowledge of React/Flutter.
- **Data Stores:** Comfortable across SQL, NoSQL, MongoDB, MySQL, Neo4j, Firebase, and ChromaDB.
- **Architecture:** Expert in Google Cloud, Docker, Kubernetes, OOP, CI/CD, gRPC, and REST.

**Conclusion:** Base all recommendations on the user having the senior-level capability to implement and architect complex, high-performance solutions across this diverse, enterprise-focused stack.

---

# INSTRUCTIONS
## STACK
- **Google Cloud Platform:** (Vertex AI, BigQuery, Cloud Functions, Cloud Run, GKE, Secret Manager)
- **Python 3.10+:** (**uv**, LangChain, LlamaIndex, FastAPI, Streamlit, Pandas, NumPy, Scikit-learn, PyTorch, TensorFlow)
- **JavaScript/TypeScript:** (Node.js, Angular, TypeScript)
- **SDKs:** (Google Cloud, Firebase SDK, LangChain, **ADK**, LlamaIndex, ChromaDB)
- **Design/Tooling:** Material Design, SASS (`*.scss`), mkdocs

## RULES
- Use **Google Cloud** over other clouds.
- Use **Vertex AI** solutions over Google AI Studio.
- Use **Angular** over React.
- Use **Material Design** for styling and components.
- Use the version of the libraries as declared in `package.json` or `requirements.txt`.
- For Python, strictly adhere to **PEP 8** coding standards (including maximum line length).
- Use **4 spaces over tabs** for indentation in all code.
- For TypeScript/JavaScript, use **Upper Camel Case** for class names and component names. Prefer classes over simple functions for stateful or complex components.
- **Dependency Management:** All Python code must be developed and run within a virtual environment managed by **uv**. Global installation of packages (`pip install ...` without a virtual environment) is **strictly forbidden**. The standard commands are `uv venv` and `uv pip install -r requirements.txt`.
- **Holistic Context:** When generating new code (e.g., adding a function, component, or service), you must first take the **full, existing project structure, architectural patterns, and imported dependencies** into account. Do not suggest solutions that introduce new, unnecessary libraries or conflict with established patterns unless explicitly requested.

---

# ARCHITECTURAL PRINCIPLES
All proposed solutions and code modifications must adhere to the following principles:

- **Separation of Concerns (SoC):** Clearly separate UI/Presentation logic from Business logic from Data Access logic (e.g., using repository or service patterns).
- **Loose Coupling:** Favor composition over inheritance. Design services and components to be independent and self-contained.
- **Idempotency:** For API and function design, ensure that repeated calls do not change the state beyond the initial call (especially critical for Cloud Functions/Run).
- **Observability:** All new components must include structured logging (JSON preferred), tracing hooks, and metrics endpoints (if applicable).

---

# READABILITY AND USABILITY
**Readability must be favored over micro-optimization and micro-performance.** The code must be understandable by a peer engineer at a glance.

- **Descriptive Naming:** Avoid abbreviations and single-letter variables unless they are standard mathematical or indexing conventions (e.g., `i` for loop index). Names must clearly communicate their purpose and type.
- **Python Naming Conventions:**
    - Variables, functions, methods: `snake_case`.
    - Classes: `PascalCase`.
    - Constants/Global Configuration: `SCREAMING_SNAKE_CASE`.
- **TypeScript Naming Conventions:**
    - Variables, functions, methods: `camelCase`.
    - Classes, Components, Interfaces: `PascalCase`.
    - Constants: `SCREAMING_SNAKE_CASE`.
- **Function/Method Size:** Adhere strictly to the **Single Responsibility Principle (SRP)**. Functions and methods should be short, doing one thing, and doing it well. If a function body exceeds 20 lines, suggest refactoring it into smaller, named helper methods.
