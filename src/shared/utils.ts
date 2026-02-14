export function getBmi(weightKg: number, heightCm: number) {
  if (!weightKg || !heightCm) {
    return 0
  }

  const meters = heightCm / 100
  return weightKg / (meters * meters)
}

export function parseNumber(value: string) {
  const parsed = Number(value)
  return Number.isFinite(parsed) ? parsed : 0
}

export function mapList<T>(value: T | Record<string, T> | null | undefined): T[] {
  if (!value) {
    return []
  }

  if (Array.isArray(value)) {
    return value
  }

  return Object.values(value)
}
