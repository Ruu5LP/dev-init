import { describe, it, expect } from 'vitest'
import { mergePackageJsonObjects } from '../src/core/merger.js'

describe('mergePackageJsonObjects', () => {
  it('deep merges scripts', () => {
    const base = { scripts: { build: 'tsc' } }
    const patch = { scripts: { test: 'vitest' } }
    const result = mergePackageJsonObjects(base, patch)
    expect(result.scripts).toEqual({ build: 'tsc', test: 'vitest' })
  })

  it('deep merges dependencies', () => {
    const base = { dependencies: { express: '^4.0.0' } }
    const patch = { dependencies: { zod: '^3.0.0' } }
    const result = mergePackageJsonObjects(base, patch)
    expect((result.dependencies as Record<string, string>)['express']).toBe('^4.0.0')
    expect((result.dependencies as Record<string, string>)['zod']).toBe('^3.0.0')
  })

  it('merges multiple patches in order', () => {
    const base = { scripts: { build: 'tsc' } }
    const p1 = { scripts: { test: 'vitest' } }
    const p2 = { scripts: { lint: 'eslint src' } }
    const result = mergePackageJsonObjects(base, p1, p2)
    expect(result.scripts).toEqual({ build: 'tsc', test: 'vitest', lint: 'eslint src' })
  })
})
