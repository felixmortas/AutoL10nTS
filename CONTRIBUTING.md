# Contributing Guide

Thank you for considering contributing to **L10N-LLM-TS**!
This guide explains the coding conventions, documentation style, and contribution workflow for the project.

---

## 🛠 Development Setup

1. Clone the repository:

   ```bash
   git clone https://github.com/your-org/l10n-llm-ts.git
   cd l10n-llm-ts
   ```

2. Install dependencies:

   ```bash
   npm install
   ```

3. Run tests (if available):

   ```bash
   npm test
   ```

---

## 📂 Project Structure

* **`main.ts`** → CLI entry point (argument parsing, kicks off processing).
* **`l10nProcessor.ts`** → Orchestrates ARB + Flutter file processing.
* **`llm.ts`** → Wrapper around different LLM providers (Mistral, OpenAI, Google).
* **`utils.ts`** → Helper utilities (atomic file writes, JSON merging).
* **`prompts/`** → System and human prompt templates (`.sys`, `.hum`).

---

## ✍️ Code Style

We follow **TypeScript best practices**:

* Use **ESM imports** (`import fs from "fs/promises"`) over CommonJS.
* Always enable **strict typing** (`string[]`, `Promise<void>`, etc.).
* Use **async/await** for all I/O operations.
* Use **camelCase** for variables/functions, **PascalCase** for classes/interfaces.

---

## 📑 Documentation Standards

### Docstrings

* Use **JSDoc-style docstrings** above classes, methods, and exported functions.
* Describe **purpose**, **parameters**, and **returns** clearly.
* Example:

  ```ts
  /**
   * Produces a translated ARB file for a target language.
   * @param inputJson - JSON string with source keys.
   * @param langTag - Target language code.
   * @returns Translated JSON string.
   */
  async amendArb(inputJson: string, langTag: string): Promise<string> { ... }
  ```

### Inline Comments

* Use `////` for **section headers** inside methods.
* Use `//` for short inline clarifications.
* Keep comments **concise and meaningful**.

---

## 🪵 Logging Conventions

We use console logging for observability:

* `console.debug` → Detailed internal state (for debugging).
* `console.info` → Normal progress messages (language detection, file updates).
* `console.warn` → Non-fatal warnings (missing file, fallback).
* `console.error` → Errors before throwing or exiting.

Example:

```ts
console.info(`[INFO] Language detected: ${langTag}`);
console.warn(`[WARNING] Target ARB file not found, initialized to empty object`);
```

---

## ✅ Contribution Workflow

1. **Fork** the repo and create a branch:

   ```bash
   git checkout -b feature/my-feature
   ```

2. **Implement your changes** following coding and documentation standards.

3. **Run lint/tests** to ensure quality:

   ```bash
   npm run lint
   npm test
   ```

4. **Commit** with a clear message:

   ```bash
   git commit -m "feat: add translation support for XYZ"
   ```

5. **Push and open a PR**:

   ```bash
   git push origin feature/my-feature
   ```

6. PRs will be reviewed for:

   * Code style consistency
   * Documentation completeness
   * Test coverage (if applicable)

---

## 🧾 Changelog Policy

* All notable changes must be added to **`CHANGELOG.md`**.
* Use [Keep a Changelog](https://keepachangelog.com/en/1.0.0/) format.
* Versions follow **Semantic Versioning** (`MAJOR.MINOR.PATCH`).

---

## 🙌 Final Notes

* Be respectful in code reviews.
* Keep PRs focused and small.
* Aim for readability: code is read more often than it is written.
