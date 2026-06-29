import { execSync } from 'child_process'
import { existsSync, mkdirSync } from 'fs'
import { join } from 'path'
import { homedir } from 'os'
import pc from 'picocolors'

const TEMPLATES_REPO = 'github:Ruu5LP/dev-init-templates'
const CACHE_DIR = join(homedir(), '.dev-init', 'templates')

export interface FetchOptions {
  force?: boolean
  ref?: string
}

export async function fetchTemplates(options: FetchOptions = {}): Promise<string> {
  const { force = false, ref = 'main' } = options

  if (!force && existsSync(CACHE_DIR)) {
    return CACHE_DIR
  }

  console.log(pc.cyan('Fetching templates...'))
  mkdirSync(CACHE_DIR, { recursive: true })

  try {
    // Use degit via CLI since ESM import can be tricky
    execSync(
      `npx degit ${TEMPLATES_REPO}#${ref} ${CACHE_DIR} --force`,
      { stdio: 'pipe' },
    )
    console.log(pc.green('✓ Templates ready'))
  } catch {
    // Fallback: if network is unavailable, check cache
    if (existsSync(join(CACHE_DIR, 'base'))) {
      console.log(pc.yellow('⚠ Using cached templates (network unavailable)'))
      return CACHE_DIR
    }
    throw new Error('Failed to fetch templates and no cache found. Check your network connection.')
  }

  return CACHE_DIR
}

export function getTemplatesDir(): string {
  return CACHE_DIR
}
