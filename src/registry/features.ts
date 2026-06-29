import type { FeatureMeta } from '../types/index.js'

export const features: FeatureMeta[] = [
  {
    id: 'github-actions',
    label: 'GitHub Actions',
    description: 'CI/CD with GitHub Actions',
    compatibleLanguages: 'all',
    requiredFeatures: [],
    conflicts: [],
  },
  {
    id: 'docker',
    label: 'Docker',
    description: 'Docker + docker-compose',
    compatibleLanguages: 'all',
    requiredFeatures: [],
    conflicts: [],
  },
  {
    id: 'discord',
    label: 'Discord',
    description: 'Discord Bot / Webhook integration',
    compatibleLanguages: 'all',
    requiredFeatures: [],
    conflicts: [],
  },
  {
    id: 'line-bot',
    label: 'LINE Bot',
    description: 'LINE Messaging API integration',
    compatibleLanguages: ['typescript', 'python'],
    requiredFeatures: [],
    conflicts: [],
  },
  {
    id: 'lark',
    label: 'Lark',
    description: 'Lark (Feishu) Bot integration',
    compatibleLanguages: 'all',
    requiredFeatures: [],
    conflicts: [],
  },
  {
    id: 'eslint',
    label: 'ESLint',
    description: 'JavaScript/TypeScript linter',
    compatibleLanguages: ['typescript'],
    requiredFeatures: [],
    conflicts: [],
  },
  {
    id: 'prettier',
    label: 'Prettier',
    description: 'Code formatter',
    compatibleLanguages: ['typescript'],
    requiredFeatures: [],
    conflicts: [],
  },
  {
    id: 'vitest',
    label: 'Vitest',
    description: 'Unit testing framework',
    compatibleLanguages: ['typescript'],
    requiredFeatures: [],
    conflicts: [],
  },
]

export function getFeature(id: string): FeatureMeta | undefined {
  return features.find((f) => f.id === id)
}

export function getFeaturesForLanguage(languageId: string): FeatureMeta[] {
  return features.filter(
    (f) => f.compatibleLanguages === 'all' || f.compatibleLanguages.includes(languageId as never),
  )
}
