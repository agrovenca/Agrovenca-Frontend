import { User } from '@/types/auth/user'
import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export const togglePasswordVisibility = ({
  checked,
  inputIds,
}: {
  checked: string | boolean
  inputIds: string[]
}) => {
  inputIds.forEach((id) => {
    const input = document.getElementById(id)
    if (input) {
      input.setAttribute('type', checked ? 'text' : 'password')
    }
  })
}

export const getLocalDateTime = (
  datetime: string,
  locales: string[],
  onlyDate: boolean = false
) => {
  const date = new Date(datetime)
  const dateFormatPptions: Intl.DateTimeFormatOptions = {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  }

  const localDate = date.toLocaleDateString(locales, dateFormatPptions)
  const localTime = date.toLocaleTimeString(locales, {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
  })

  if (onlyDate) return localDate
  return localDate + ' ' + localTime
}

export const truncateText = (text: string | undefined, num: number) => {
  if (!text) return ''
  if (text.length > num) return text.slice(0, num) + '...'
  return text
}

export const getUserRole = (user: User) => {
  if (user.isAdmin) return 'Admin'
  if (user.isMod) return 'Mod'
  return 'Cliente'
}

export const formatDecimal = (value?: number | string): string => {
  const num = typeof value === 'number' ? value : Number(value)
  return isNaN(num) ? '0.00' : num.toFixed(2)
}

export type FormattedBlock =
  | { type: 'paragraph'; content: string }
  | { type: 'list-item'; content: string }

export function parseFormattedText(text: string | undefined): FormattedBlock[] {
  if (!text || text.length < 1) return []
  const lines = text.split('\n')
  const result: FormattedBlock[] = []

  for (const line of lines) {
    const cleaned = line.trim()

    if (cleaned.startsWith('- ') || cleaned.startsWith('﹡ ')) {
      result.push({
        type: 'list-item',
        content: applyInlineFormatting(cleaned.slice(2)),
      })
    } else if (cleaned) {
      result.push({
        type: 'paragraph',
        content: applyInlineFormatting(cleaned),
      })
    }
  }

  return result
}

export function applyInlineFormatting(text: string): string {
  return (
    text
      // Negrita tipo Markdown: **texto**
      .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
      .replace(/\*(.+?)\*/g, '<strong>$1</strong>') // <- *texto*
      // Cursiva tipo Markdown: _texto_
      .replace(/_(.+?)_/g, '<em>$1</em>')
      // Estilo "*Etiqueta:* contenido" → "<strong>Etiqueta:</strong> contenido"
      .replace(/^\*(.+?):\*/gm, '<strong>$1:</strong>')
  )
}

export function pluralize(
  text: string,
  value: string | number | object,
  pluralSuffix: string,
  singularSuffix = ''
) {
  let count: number

  if (typeof value === 'number') {
    count = value
  } else if (typeof value === 'string' && !isNaN(Number(value))) {
    count = Number(value)
  } else if (Array.isArray(value)) {
    count = value.length
  } else if (value && typeof value === 'object') {
    count = Object.keys(value).length
  } else {
    count = 0
  }

  const suffix = count === 1 ? singularSuffix : pluralSuffix
  return ` ${text}${suffix} `
}

export function generateRandomHexString(length = 6) {
  const array = new Uint8Array(length)
  window.crypto.getRandomValues(array)
  return Array.from(array)
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('')
    .toUpperCase()
}
