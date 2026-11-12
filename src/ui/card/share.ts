import { APP } from '../../config'

export type ShareOutcome = 'shared' | 'cancelled' | 'unsupported'

/**
 * Opens the phone's share sheet with the PNG (so it can go straight to a
 * Facebook story). Returns 'unsupported' when files cannot be shared.
 */
export async function shareImage(blob: Blob, filename: string, text: string): Promise<ShareOutcome> {
  const file = new File([blob], filename, { type: 'image/png' })
  const data: ShareData = { files: [file], text, title: APP.name.en }
  if (typeof navigator === 'undefined' || !navigator.canShare || !navigator.canShare({ files: [file] })) {
    return 'unsupported'
  }
  try {
    await navigator.share(data)
    return 'shared'
  } catch (error: unknown) {
    if (error instanceof DOMException && error.name === 'AbortError') return 'cancelled'
    return 'unsupported'
  }
}

/** Saves a blob as a file download. */
export function downloadBlob(blob: Blob, filename: string): void {
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = filename
  document.body.appendChild(a)
  a.click()
  a.remove()
  window.setTimeout(() => URL.revokeObjectURL(url), 4000)
}
