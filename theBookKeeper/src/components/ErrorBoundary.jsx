import React from 'react';
import { FiAlertTriangle, FiRefreshCw } from 'react-icons/fi';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    this.setState({
      error: error,
      errorInfo: errorInfo
    });
    
    // Log error to console in development
    if (process.env.NODE_ENV === 'development') {
      console.error('ErrorBoundary caught an error:', error, errorInfo);
    }
  }

  handleRetry = () => {
    this.setState({ hasError: false, error: null, errorInfo: null });
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-slate-50 dark:bg-slate-900 flex items-center justify-center p-4">
          <div className="max-w-md w-full">
            <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl p-8 shadow-2xl text-center">
              <div className="flex justify-center mb-6">
                <div className="bg-red-500/20 p-4 rounded-2xl">
                  <FiAlertTriangle className="w-16 h-16 text-red-500" />
                </div>
              </div>
              
              <h1 className="text-2xl font-bold text-slate-800 dark:text-white mb-4">
                Oops! Something went wrong
              </h1>
              
              <p className="text-slate-600 dark:text-slate-300 mb-6">
                We encountered an unexpected error. Don't worry, our team has been notified.
              </p>
              
              <button
                onClick={this.handleRetry}
                className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-xl transition-all duration-200 flex items-center justify-center space-x-2 mx-auto shadow-lg hover:shadow-xl"
              >
                <FiRefreshCw className="w-4 h-4" />
                <span>Try Again</span>
              </button>
              
              {process.env.NODE_ENV === 'development' && this.state.error && (
                <details className="mt-6 text-left">
                  <summary className="text-slate-500 dark:text-slate-400 cursor-pointer hover:text-slate-700 dark:hover:text-white">
                    Error Details (Development)
                  </summary>
                  <div className="mt-2 p-4 bg-slate-100 dark:bg-black/20 rounded-lg text-xs text-red-600 dark:text-red-300 font-mono overflow-auto">
                    <div className="mb-2">
                      <strong>Error:</strong> {this.state.error.toString()}
                    </div>
                    <div>
                      <strong>Stack:</strong>
                      <pre className="whitespace-pre-wrap mt-1">
                        {this.state.errorInfo.componentStack}
                      </pre>
                    </div>
                  </div>
                </details>
              )}
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
