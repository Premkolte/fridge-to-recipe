import { Component } from 'react';

/**
 * ErrorBoundary — catches render errors in the component tree
 * and displays a graceful fallback UI instead of a blank screen.
 *
 * Must be a class component — React does not yet support
 * getDerivedStateFromError or componentDidCatch in function components.
 */
class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
    this.handleReset = this.handleReset.bind(this);
  }

  /**
   * Called when a descendant throws during rendering.
   * Returns the new state to merge.
   * @param {Error} error
   * @returns {{ hasError: boolean, error: Error }}
   */
  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  /**
   * Called after an error is captured. Used for logging.
   * @param {Error} error
   * @param {React.ErrorInfo} info
   */
  componentDidCatch(error, info) {
    console.error('[ErrorBoundary] Caught error:', error, info);
  }

  /** Resets the error state so the user can retry. */
  handleReset() {
    this.setState({ hasError: false, error: null });
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="flex flex-col items-center justify-center
          min-h-[60vh] gap-6 px-4 text-center"
        >
          <div className="text-5xl">💥</div>
          <div className="flex flex-col gap-2 max-w-sm">
            <h2 className="text-lg font-semibold text-white">
              Something went wrong
            </h2>
            <p className="text-sm text-muted">
              {this.state.error?.message ??
                'An unexpected error occurred.'}
            </p>
          </div>
          <button
            onClick={this.handleReset}
            className="px-6 py-2.5 rounded-lg bg-primary text-white
              text-sm font-medium hover:opacity-90
              transition-opacity duration-200"
          >
            Try again
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
