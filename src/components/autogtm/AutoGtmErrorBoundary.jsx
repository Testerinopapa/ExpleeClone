import React from 'react';

export default class AutoGtmErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('AutoGTM Workflow caught an error:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="flex h-screen w-full items-center justify-center bg-[#fafafa] p-6 text-gray-900 font-sans">
          <div className="max-w-md w-full rounded-2xl bg-white border border-black/10 p-6 shadow-xl space-y-4 text-center">
            <div className="size-12 rounded-full bg-amber-50 text-amber-600 flex items-center justify-center mx-auto text-xl font-bold">
              ⚠️
            </div>
            <h2 className="text-lg font-bold text-gray-900">Something went wrong</h2>
            <p className="text-xs text-gray-600">
              The workflow encountered an issue rendering this stage.
            </p>
            {this.state.error?.message && (
              <pre className="text-[11px] font-mono text-left bg-gray-50 border border-black/5 p-3 rounded-lg overflow-x-auto text-red-600">
                {this.state.error.message}
              </pre>
            )}
            <div className="pt-2 flex gap-3 justify-center">
              <button
                type="button"
                onClick={() => this.setState({ hasError: false, error: null })}
                className="px-4 py-2 rounded-lg bg-black text-white text-xs font-semibold cursor-pointer"
              >
                Try again
              </button>
              <button
                type="button"
                onClick={() => {
                  window.location.href = '/app-auto-gtm';
                }}
                className="px-4 py-2 rounded-lg border border-black/15 text-xs text-gray-700 hover:bg-black/5 cursor-pointer"
              >
                Start over
              </button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
