import { readdir, readFile, writeFile, mkdir, symlink } from 'fs/promises'
import { existsSync } from 'fs'
import { join, dirname, extname, basename } from 'path'
import pc from 'picocolors'
import { buildContext, renderFile, renderString } from './renderer.js'
import { mergePackageJsonObjects } from './merger.js'
import { getLanguage } from '../registry/languages.js'
import { getAiProvider } from '../registry/ai-providers.js'
import { getFeature } from '../registry/features.js'
import type { ProjectConfig, TemplateContext } from '../types/index.js'

interface GeneratedFile {
  path: string
  content: string
}

export async function generate(config: ProjectConfig, templatesDir: string): Promise<void> {
  const lang = getLanguage(config.language)!
  const aiProviders = config.aiProviders.map((id) => getAiProvider(id)!)
  const featureMetas = config.features.map((id) => getFeature(id)!)

  const ctx = buildContext({
    projectName: config.projectName,
    description: config.description,
    language: config.language,
    languageLabel: lang.label,
    aiProviders: config.aiProviders,
    aiProviderLabels: aiProviders.map((a) => a.label),
    features: config.features,
    featureLabels: featureMetas.map((f) => f.label),
  })

  const files: GeneratedFile[] = []
  let packageJsonBase: Record<string, unknown> = {}
  const packageJsonPatches: Record<string, unknown>[] = []

  // ── Layer 1: base ────────────────────────────────────────────────────────
  const baseDir = join(templatesDir, 'base')
  await collectLayer(baseDir, '', ctx, files)

  // ── Layer 2: language ────────────────────────────────────────────────────
  const langDir = join(templatesDir, 'languages', config.language)
  await collectLayer(langDir, '', ctx, files)

  const langPkgPath = join(langDir, 'package.json.patch')
  if (existsSync(langPkgPath)) {
    const raw = await readFile(langPkgPath, 'utf-8')
    packageJsonBase = mergePackageJsonObjects(packageJsonBase, JSON.parse(raw))
  }

  // ── Layer 3: features ────────────────────────────────────────────────────
  for (const featureId of config.features) {
    const featureDir = join(templatesDir, 'features', featureId)
    await collectLayer(featureDir, '', ctx, files)

    const patchPath = join(featureDir, 'package.json.patch')
    if (existsSync(patchPath)) {
      const raw = await readFile(patchPath, 'utf-8')
      packageJsonPatches.push(JSON.parse(raw))
    }
  }

  // Merge all package.json patches
  if (Object.keys(packageJsonBase).length > 0 || packageJsonPatches.length > 0) {
    const merged = mergePackageJsonObjects(packageJsonBase, ...packageJsonPatches)
    const rendered = renderString(JSON.stringify(merged, null, 2), ctx)
    files.push({ path: 'package.json', content: rendered })
  }

  // ── Layer 4: AI docs ─────────────────────────────────────────────────────
  const commonAiDir = join(templatesDir, 'ai', '_common')
  await collectLayer(commonAiDir, '.ai', ctx, files)

  for (const provider of aiProviders) {
    const aiDir = join(templatesDir, 'ai', provider.id)
    await collectLayer(aiDir, join('.ai', provider.id), ctx, files)
  }

  // ── Write files ──────────────────────────────────────────────────────────
  await writeFiles(config.outputDir, files)

  // ── Symlinks: CLAUDE.md / CODEX.md at root ───────────────────────────────
  await createAiSymlinks(config.outputDir, aiProviders)

  console.log(pc.green(`\n✓ ${files.length} files generated in ${config.outputDir}/`))
}

async function collectLayer(
  layerDir: string,
  outputPrefix: string,
  ctx: TemplateContext,
  files: GeneratedFile[],
): Promise<void> {
  if (!existsSync(layerDir)) return

  const entries = await readdir(layerDir, { recursive: true, withFileTypes: true })

  for (const entry of entries) {
    if (!entry.isFile()) continue

    const rel = join(entry.parentPath ?? entry.path, entry.name)
      .replace(layerDir, '')
      .replace(/^\//, '')

    // Skip meta/patch files
    if (rel === '_meta.ts' || rel.endsWith('package.json.patch')) continue

    const fullSrc = join(layerDir, rel)
    const isTemplate = extname(entry.name) === '.hbs'
    const destRel = join(outputPrefix, isTemplate ? rel.replace(/\.hbs$/, '') : rel)

    let content: string
    if (isTemplate) {
      content = await renderFile(fullSrc, ctx)
    } else {
      content = await readFile(fullSrc, 'utf-8')
    }

    files.push({ path: destRel, content })
  }
}

async function writeFiles(outputDir: string, files: GeneratedFile[]): Promise<void> {
  for (const file of files) {
    const dest = join(outputDir, file.path)
    await mkdir(dirname(dest), { recursive: true })
    await writeFile(dest, file.content, 'utf-8')
    console.log(pc.dim(`  ${file.path}`))
  }
}

async function createAiSymlinks(
  outputDir: string,
  providers: ReturnType<typeof getAiProvider>[],
): Promise<void> {
  for (const provider of providers) {
    if (!provider) continue
    const configFile = provider.configFile
    const symlinkName = basename(configFile)
    const symlinkDest = join(outputDir, symlinkName)
    const target = join('.ai', provider.id, symlinkName)

    if (!existsSync(symlinkDest)) {
      try {
        await symlink(target, symlinkDest)
        console.log(pc.dim(`  ${symlinkName} → ${target}`))
      } catch {
        // Symlink creation can fail on some systems; silently skip
      }
    }
  }
}
