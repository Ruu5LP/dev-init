import { input, select, checkbox, confirm } from '@inquirer/prompts'
import pc from 'picocolors'
import { languages } from '../registry/languages.js'
import { availableAiProviders } from '../registry/ai-providers.js'
import { getFeaturesForLanguage } from '../registry/features.js'
import type { LanguageId, AiProviderId, FeatureId, ProjectConfig } from '../types/index.js'

export async function runPrompts(outputBase: string): Promise<ProjectConfig> {
  console.log(pc.bold(pc.cyan('\n  dev-init — Project Generator\n')))

  const projectName = await input({
    message: 'Project name:',
    validate: (v) => (v.trim().length > 0 ? true : 'Project name is required'),
  })

  const description = await input({
    message: 'Description (optional):',
    default: '',
  })

  const language = await select<LanguageId>({
    message: 'Language:',
    choices: languages.map((l) => ({
      name: l.label,
      value: l.id,
      description: l.description,
    })),
  })

  const aiProviders = await checkbox<AiProviderId>({
    message: 'AI providers (space to select):',
    choices: availableAiProviders.map((p) => ({
      name: p.label,
      value: p.id,
      description: p.description,
      checked: true,
    })),
    validate: (v) => (v.length > 0 ? true : 'Select at least one AI provider'),
  })

  const compatibleFeatures = getFeaturesForLanguage(language)
  const features = await checkbox<FeatureId>({
    message: 'Features (space to select):',
    choices: compatibleFeatures.map((f) => ({
      name: f.label,
      value: f.id,
      description: f.description,
    })),
  })

  const outputDir = `${outputBase}/${projectName}`

  console.log(pc.bold('\n  Summary'))
  console.log(`  ${pc.dim('Project  :')} ${projectName}`)
  console.log(`  ${pc.dim('Language :')} ${language}`)
  console.log(`  ${pc.dim('AI       :')} ${aiProviders.join(', ')}`)
  console.log(`  ${pc.dim('Features :')} ${features.length > 0 ? features.join(', ') : 'none'}`)
  console.log(`  ${pc.dim('Output   :')} ${outputDir}`)
  console.log()

  const confirmed = await confirm({ message: 'Generate project?', default: true })
  if (!confirmed) {
    console.log(pc.yellow('Cancelled.'))
    process.exit(0)
  }

  return {
    projectName,
    description,
    language,
    aiProviders,
    features,
    outputDir,
  }
}
