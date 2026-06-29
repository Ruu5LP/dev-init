import deepmerge from 'deepmerge'
import { readFile } from 'fs/promises'
import { existsSync } from 'fs'
import type { PackageJsonPatch } from '../types/index.js'

export async function mergePackageJson(
  base: Record<string, unknown>,
  patchPath: string,
): Promise<Record<string, unknown>> {
  if (!existsSync(patchPath)) return base

  const raw = await readFile(patchPath, 'utf-8')
  const patch: PackageJsonPatch = JSON.parse(raw)

  return deepmerge(base, patch, {
    arrayMerge: (dest, src) => [...new Set([...dest, ...src])],
  })
}

export function mergePackageJsonObjects(
  ...patches: Record<string, unknown>[]
): Record<string, unknown> {
  return patches.reduce(
    (acc, patch) =>
      deepmerge(acc, patch, {
        arrayMerge: (dest, src) => [...new Set([...dest, ...src])],
      }),
    {} as Record<string, unknown>,
  )
}
