# l10n-llm-ts


Portage TypeScript du petit utilitaire Python de LLM / ARB / Flutter fourni.


Commands:


```bash
npm install
# development
npm run dev -- --provider openai --model gpt-4o --arbs-folder ./l10n --files src/example.dart
# build + run built
npm run build
npm run start -- --provider openai --model gpt-4o --arbs-folder ./l10n --files src/example.dart
```


Notes:
- Place your prompts in `/prompts/<name>.sys` and `/prompts/<name>.hum` (ex.: `chooseLanguage.sys`, `chooseLanguage.hum`, `process.sys`, `process.hum`, `amendArb.sys`, `amendArb.hum`).
- Set environment variables from `.env` or the environment. Look at .env.example file for API keys name