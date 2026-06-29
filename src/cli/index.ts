#!/usr/bin/env node
import { Command } from 'commander'
import { readFileSync } from 'fs'
import { join, dirname } from 'path'
import { fileURLToPath } from 'url'
import pc from 'picocolors'
import { runPrompts } from './prompts.js'
import { generate } from '../core/generator.js'
import { fetchTemplates } from '../core/fetcher.js'
import { resolveConfig } from '../core/resolver.js'
import { ProjectConfig } from '../types/index.js'

const __dirname = dirname(fileURLToPath(import.meta.url))
const pkg = JSON.parse(readFileSync(join(__dirname, '../../package.json'), 'utf-8'))

const program = new Command()

program
  .name('dev-init')
  .description('Scaffold a new project with language, AI, and feature composition')
  .version(pkg.version)

program
  .command('create', { isDefault: true })
  .description('Create a new project (interactive)')
  .option('-o, --output <dir>', 'Output base directory', '.')
  .option('--here', 'Generate in the current directory instead of a subdirectory')
  .option('--update-templates', 'Force re-download of templates before generating')
  .action(async (opts) => {
    try {
      const templatesDir = await fetchTemplates({ force: opts.updateTemplates })

      const config = await runPrompts(opts.here ? '.' : opts.output)

      if (opts.here) {
        config.outputDir = opts.output === '.' ? '.' : opts.output
      }

      const validated = ProjectConfig.safeParse(config)
      if (!validated.success) {
        console.error(pc.red('Invalid configuration:'))
        console.error(validated.error.format())
        process.exit(1)
      }

      const resolved = resolveConfig(validated.data)
      if (!resolved.valid) {
        console.error(pc.red('Configuration errors:'))
        resolved.errors.forEach((e) => console.error(pc.red(`  • ${e}`)))
        process.exit(1)
      }

      const finalConfig = { ...validated.data, features: resolved.resolvedFeatures }

      await generate(finalConfig, templatesDir)
    } catch (err) {
      if (err instanceof Error && err.message.includes('ExitPromptError')) {
        console.log(pc.yellow('\nCancelled.'))
        process.exit(0)
      }
      console.error(pc.red('Error:'), err instanceof Error ? err.message : err)
      process.exit(1)
    }
  })

program
  .command('update-templates')
  .description('Update cached templates from the remote repository')
  .action(async () => {
    await fetchTemplates({ force: true })
  })

program.parse()
