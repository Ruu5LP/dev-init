import Handlebars from 'handlebars'
import { readFile } from 'fs/promises'
import type { TemplateContext } from '../types/index.js'

// Register helpers
Handlebars.registerHelper('eq', (a: unknown, b: unknown) => a === b)
Handlebars.registerHelper('includes', (arr: unknown[], val: unknown) =>
  Array.isArray(arr) && arr.includes(val),
)

export function buildContext(
  config: {
    projectName: string
    description: string
    language: string
    languageLabel: string
    aiProviders: string[]
    aiProviderLabels: string[]
    features: string[]
    featureLabels: string[]
  },
): TemplateContext {
  return {
    ...config,
    year: new Date().getFullYear(),
    hasFeature: (id: string) => config.features.includes(id),
    hasAi: (id: string) => config.aiProviders.includes(id),
  }
}

export async function renderFile(filePath: string, context: TemplateContext): Promise<string> {
  const source = await readFile(filePath, 'utf-8')
  const template = Handlebars.compile(source, { noEscape: true })
  return template(context)
}

export function renderString(source: string, context: TemplateContext): string {
  const template = Handlebars.compile(source, { noEscape: true })
  return template(context)
}
