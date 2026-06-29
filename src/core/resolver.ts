import { getFeature, getFeaturesForLanguage } from '../registry/features.js'
import type { FeatureId, LanguageId, ProjectConfig } from '../types/index.js'

export interface ResolveResult {
  valid: boolean
  errors: string[]
  resolvedFeatures: FeatureId[]
}

export function resolveConfig(config: ProjectConfig): ResolveResult {
  const errors: string[] = []
  const resolvedFeatures = new Set<FeatureId>(config.features)
  const compatibleFeatures = getFeaturesForLanguage(config.language)
  const compatibleIds = new Set(compatibleFeatures.map((f) => f.id))

  // Check language compatibility
  for (const featureId of config.features) {
    if (!compatibleIds.has(featureId)) {
      errors.push(`Feature "${featureId}" is not compatible with language "${config.language}"`)
    }
  }

  // Auto-resolve required dependencies
  for (const featureId of config.features) {
    const meta = getFeature(featureId)
    if (!meta) continue
    for (const required of meta.requiredFeatures) {
      if (!resolvedFeatures.has(required)) {
        resolvedFeatures.add(required)
      }
    }
  }

  // Check conflicts
  for (const featureId of resolvedFeatures) {
    const meta = getFeature(featureId)
    if (!meta) continue
    for (const conflict of meta.conflicts) {
      if (resolvedFeatures.has(conflict)) {
        errors.push(`Feature "${featureId}" conflicts with "${conflict}"`)
      }
    }
  }

  return {
    valid: errors.length === 0,
    errors,
    resolvedFeatures: Array.from(resolvedFeatures),
  }
}
