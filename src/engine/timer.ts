import { useEffect, useRef, useState } from 'react'

/**
 * A pausable stopwatch that measures elapsed time from a clock function.
 * Pure state in, state out, so it is easy to test without real time.
 */
export interface ClockState {
  /** Elapsed ms banked from earlier running periods. */
  banked: number
  /** Timestamp when the current running period started, or null if paused. */
  startedAt: number | null
}

export const STOPPED: ClockState = { banked: 0, startedAt: null }

export function startClock(c: ClockState, now: number): ClockState {
  return c.startedAt === null ? { ...c, startedAt: now } : c
}

export function pauseClock(c: ClockState, now: number): ClockState {
  return c.startedAt === null ? c : { banked: c.banked + (now - c.startedAt), startedAt: null }
}

export function elapsed(c: ClockState, now: number): number {
  return c.banked + (c.startedAt === null ? 0 : now - c.startedAt)
}

export function remainingMs(c: ClockState, now: number, durationMs: number): number {
  return Math.max(0, durationMs - elapsed(c, now))
}

const TICK_MS = 100

interface CountdownOptions {
  durationMs: number
  /** False pauses the countdown (frozen, answered, or untimed). */
  running: boolean
  /** Changing this restarts the countdown from full. */
  resetKey: string
  onExpire: () => void
}

/** Countdown hook. Re-renders only when the whole-second value changes. */
export function useCountdown({ durationMs, running, resetKey, onExpire }: CountdownOptions): number {
  const clock = useRef<ClockState>(STOPPED)
  const expired = useRef(false)
  const onExpireRef = useRef(onExpire)
  const [seconds, setSeconds] = useState(Math.ceil(durationMs / 1000))

  useEffect(() => {
    onExpireRef.current = onExpire
  }, [onExpire])

  useEffect(() => {
    clock.current = STOPPED
    expired.current = false
    setSeconds(Math.ceil(durationMs / 1000))
  }, [resetKey, durationMs])

  useEffect(() => {
    if (!running) {
      clock.current = pauseClock(clock.current, performance.now())
      return
    }
    clock.current = startClock(clock.current, performance.now())
    const id = window.setInterval(() => {
      const left = remainingMs(clock.current, performance.now(), durationMs)
      setSeconds(Math.ceil(left / 1000))
      if (left <= 0 && !expired.current) {
        expired.current = true
        onExpireRef.current()
      }
    }, TICK_MS)
    return () => {
      window.clearInterval(id)
      clock.current = pauseClock(clock.current, performance.now())
    }
  }, [running, resetKey, durationMs])

  return seconds
}
