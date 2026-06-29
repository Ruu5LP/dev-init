import type { AiProviderMeta } from '../types/index.js'

export const aiProviders: AiProviderMeta[] = [
  {
    id: 'claude',
    label: 'Claude Code',
    description: 'Anthropic Claude Code',
    configFile: 'CLAUDE.md',
  },
  {
    id: 'codex',
    label: 'Codex',
    description: 'OpenAI Codex',
    configFile: 'CODEX.md',
  },
  {
    id: 'copilot',
    label: 'GitHub Copilot',
    description: 'GitHub Copilot (coming soon)',
    configFile: '.github/copilot-instructions.md',
  },
  {
    id: 'gemini',
    label: 'Gemini',
    description: 'Google Gemini (coming soon)',
    configFile: 'GEMINI.md',
  },
  {
    id: 'cursor',
    label: 'Cursor',
    description: 'Cursor AI (coming soon)',
    configFile: '.cursorrules',
  },
]

export const availableAiProviders = aiProviders.filter((p) =>
  ['claude', 'codex'].includes(p.id),
)

export function getAiProvider(id: string): AiProviderMeta | undefined {
  return aiProviders.find((p) => p.id === id)
}
