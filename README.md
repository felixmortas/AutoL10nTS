# L10N-LLM-TS

This is a TypeScript port of a Python utility that uses LLMs to update Flutter and ARB files for localization purposes. The project leverages LangChain JS and LangFuse for AI-powered language processing and tracking.

## Features
- Detect the language of a Flutter file.
- Process Flutter files and update ARB localization files.
- Translate ARB files to other languages.
- Atomic file writes with `.bak` backup creation.
- Detailed debug logging for each processing step.

## Prerequisites
- Node.js >= 18
- npm >= 9
- Environment variables for your LLM and LangFuse keys:
  - `OPENAI_API_KEY`
  - `MISTRAL_API_KEY`
  - `GOOGLE_API_KEY`

Copy `.env.example` to `.env` and fill in your API keys.

## Installation
```bash
npm install
```

## Project Structure
```
├─ src/
│  ├─ llm.ts        # LLM wrapper class
│  ├─ main.ts       # CLI entry point
│  ├─ utils.ts      # Utility functions: atomicWrite, mergeJsonStrings
│  └─ types.ts      # TypeScript types
├─ prompts/         # Prompt templates
│  ├─ chooseLanguage.sys/hum
│  ├─ process.sys/hum
│  └─ amendArb.sys/hum
├─ tests/           # Vitest unit tests
├─ package.json
├─ tsconfig.json
└─ README.md
```

## Usage
### Development mode
Run directly with `tsx`:
```bash
npm run dev -- --provider openai --model gpt-4o --arbs-folder ./l10n --files ./src/example.dart
```

### Build and run
```bash
npm run build
npm run start -- --provider openai --model gpt-4o --arbs-folder ./l10n --files ./src/example.dart
```

### CLI Options
| Option | Description |
|--------|-------------|
| `--provider` | LLM provider (`mistral`, `openai`, `google`) |
| `--model` | Name of the model to use |
| `--arbs-folder` | Path to the folder containing `.arb` files |
| `--files` | List of Flutter `.dart` files to process |

### Notes
- Place your prompts in the `prompts/` directory. Each prompt requires a `.sys` and `.hum` file.
- The output JSON and Dart files are processed atomically, ensuring backups with `.bak` extensions.

## Testing
The project uses [Vitest](https://vitest.dev/) for unit tests.
```bash
npm run test
```

## Logging
- `DEBUG` logs show detailed steps, including file updates and LLM interactions.
- `INFO` logs provide high-level progress messages.
- `WARNING` and `ERROR` logs indicate missing files or processing issues.

## Contributing
1. Fork the repository.
2. Create a feature branch (`git checkout -b feature/new-feature`).
3. Commit your changes (`git commit -am 'Add new feature'`).
4. Push to the branch (`git push origin feature/new-feature`).
5. Open a Pull Request.

## License
MIT
