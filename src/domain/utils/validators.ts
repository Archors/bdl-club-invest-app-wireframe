export function isValidEmail(email: string): boolean {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return re.test(email)
}

export function isValidPassword(password: string): { valid: boolean; errors: string[] } {
  const errors: string[] = []

  if (password.length < 8) {
    errors.push('Au moins 8 caractères')
  }
  if (!/[A-Z]/.test(password)) {
    errors.push('Au moins une majuscule')
  }
  if (!/[a-z]/.test(password)) {
    errors.push('Au moins une minuscule')
  }
  if (!/[0-9]/.test(password)) {
    errors.push('Au moins un chiffre')
  }

  return { valid: errors.length === 0, errors }
}

export function isValidPhone(phone: string): boolean {
  const cleaned = phone.replace(/\s/g, '')
  return /^(\+33|0)[1-9][0-9]{8}$/.test(cleaned)
}

export function isValidAmount(amount: number, min = 0, max = Infinity): boolean {
  return !isNaN(amount) && amount >= min && amount <= max
}

export function isValidIBAN(iban: string): boolean {
  const cleaned = iban.replace(/\s/g, '').toUpperCase()
  if (!/^FR[0-9]{2}[A-Z0-9]{23}$/.test(cleaned)) return false
  return true
}
