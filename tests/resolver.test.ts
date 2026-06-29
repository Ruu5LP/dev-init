import { describe, it, expect } from 'vitest'
import { resolveConfig } from '../src/core/resolver.js'
import type { ProjectConfig } from '../src/types/index.js'

const base: ProjectConfig = {
  projectName: 'test-app',
  description: '',
  language: 'typescript',
  aiProviders: ['claude'],
  features: [],
  outputDir: '/tmp/test-app',
}

describe('resolveConfig', () => {
  it('passes with valid config', () => {
    const result = resolveConfig({ ...base, features: ['vitest', 'eslint'] })
    expect(result.valid).toBe(true)
    expect(result.errors).toHaveLength(0)
  })

  it('rejects feature incompatible with language', () => {
    const result = resolveConfig({ ...base, language: 'laravel', features: ['vitest'] })
    expect(result.valid).toBe(false)
    expect(result.errors[0]).toContain('not compatible')
  })

  it('auto-resolves required features', () => {
    const result = resolveConfig({ ...base, features: ['vitest'] })
    expect(result.resolvedFeatures).toContain('vitest')
  })

  it('docker and github-actions are compatible with all languages', () => {
    const result = resolveConfig({ ...base, language: 'python', features: ['docker', 'github-actions'] })
    expect(result.valid).toBe(true)
  })
})
