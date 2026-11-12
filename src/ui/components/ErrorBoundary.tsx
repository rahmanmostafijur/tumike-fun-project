import { Component, type ErrorInfo, type ReactNode } from 'react'

interface Props {
  fallback: (reset: () => void) => ReactNode
  children: ReactNode
}

interface State {
  hasError: boolean
}

/** Catches render errors so a broken screen shows a friendly error state. */
export class ErrorBoundary extends Component<Props, State> {
  state: State = { hasError: false }

  static getDerivedStateFromError(): State {
    return { hasError: true }
  }

  componentDidCatch(error: Error, info: ErrorInfo): void {
    console.error('Screen crashed', error, info.componentStack)
  }

  reset = (): void => this.setState({ hasError: false })

  render(): ReactNode {
    return this.state.hasError ? this.props.fallback(this.reset) : this.props.children
  }
}
