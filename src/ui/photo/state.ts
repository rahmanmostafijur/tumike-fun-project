/**
 * The player's photo for the current result card. Held in memory only: it is
 * never written to any storage, so a reload brings the monogram back.
 * `S` is a decoded photo waiting to be cropped, `P` the finished photo.
 */
export interface PhotoState<S, P> {
  photo: P | null
  editing: S | null
  /** The last picked file could not be opened. */
  error: boolean
}

export type PhotoAction<S, P> =
  | { type: 'picked'; source: S }
  | { type: 'unreadable' }
  | { type: 'cancel' }
  | { type: 'done'; photo: P }
  | { type: 'remove' }
  | { type: 'dismissError' }

export function initialPhotoState<S, P>(photo: P | null = null): PhotoState<S, P> {
  return { photo, editing: null, error: false }
}

export function photoReducer<S, P>(state: PhotoState<S, P>, action: PhotoAction<S, P>): PhotoState<S, P> {
  switch (action.type) {
    case 'picked':
      return { ...state, editing: action.source, error: false }
    case 'unreadable':
      // Keep whatever is on the card (photo or monogram); only show the message.
      return { ...state, editing: null, error: true }
    case 'cancel':
      return { ...state, editing: null }
    case 'done':
      return { photo: action.photo, editing: null, error: false }
    case 'remove':
      return { photo: null, editing: null, error: false }
    case 'dismissError':
      return { ...state, error: false }
  }
}
