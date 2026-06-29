import type { LanguageMeta } from '../types/index.js'

export const languages: LanguageMeta[] = [
  {
    id: 'typescript',
    label: 'TypeScript',
    description: 'Node.js + TypeScript (ESM)',
  },
  {
    id: 'laravel',
    label: 'Laravel',
    description: 'PHP Laravel framework',
  },
  {
    id: 'python',
    label: 'Python',
    description: 'Python 3.x',
  },
]

export function getLanguage(id: string): LanguageMeta | undefined {
  return languages.find((l) => l.id === id)
}
