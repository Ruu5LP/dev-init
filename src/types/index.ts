import { z } from 'zod'

// ─── Language ────────────────────────────────────────────────────────────────

export const LanguageId = z.enum(['typescript', 'laravel', 'python'])
export type LanguageId = z.infer<typeof LanguageId>

export interface LanguageMeta {
  id: LanguageId
  label: string
  description: string
}

// ─── AI Provider ─────────────────────────────────────────────────────────────

export const AiProviderId = z.enum(['claude', 'codex', 'copilot', 'gemini', 'cursor'])
export type AiProviderId = z.infer<typeof AiProviderId>

export interface AiProviderMeta {
  id: AiProviderId
  label: string
  description: string
  configFile: string  // e.g. "CLAUDE.md"
}

// ─── Feature ─────────────────────────────────────────────────────────────────

export const FeatureId = z.enum([
  'github-actions',
  'docker',
  'discord',
  'line-bot',
  'lark',
  'eslint',
  'prettier',
  'vitest',
])
export type FeatureId = z.infer<typeof FeatureId>

export interface FeatureMeta {
  id: FeatureId
  label: string
  description: string
  compatibleLanguages: LanguageId[] | 'all'
  requiredFeatures: FeatureId[]
  conflicts: FeatureId[]
}

// ─── Project Config ───────────────────────────────────────────────────────────

export const ProjectConfig = z.object({
  projectName: z.string().min(1),
  description: z.string().default(''),
  language: LanguageId,
  aiProviders: z.array(AiProviderId).min(1),
  features: z.array(FeatureId),
  outputDir: z.string(),
})
export type ProjectConfig = z.infer<typeof ProjectConfig>

// ─── Template Context ─────────────────────────────────────────────────────────

export interface TemplateContext {
  projectName: string
  description: string
  language: string
  languageLabel: string
  aiProviders: string[]
  aiProviderLabels: string[]
  features: string[]
  featureLabels: string[]
  year: number
  hasFeature: (id: string) => boolean
  hasAi: (id: string) => boolean
}

// ─── Package.json Patch ───────────────────────────────────────────────────────

export interface PackageJsonPatch {
  scripts?: Record<string, string>
  dependencies?: Record<string, string>
  devDependencies?: Record<string, string>
  [key: string]: unknown
}

// ─── Generator Layer ──────────────────────────────────────────────────────────

export type LayerType = 'base' | 'language' | 'feature' | 'ai'

export interface GeneratorLayer {
  type: LayerType
  id: string
  sourcePath: string
}
