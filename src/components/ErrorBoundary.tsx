import { Component, type ErrorInfo, type ReactNode } from 'react';
import { AlertTriangle, RefreshCw } from 'lucide-react';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('ErrorBoundary caught:', error, errorInfo);
  }

  handleRetry = () => {
    this.setState({ hasError: false, error: null });
  };

  render() {
    if (this.state.hasError && this.state.error) {
      if (this.props.fallback) {
        return this.props.fallback;
      }
      return (
        <div
          className="section"
          style={{
            minHeight: '60vh',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <div
            className="card glass-panel"
            style={{
              maxWidth: 480,
              textAlign: 'center',
              padding: '48px 32px',
            }}
          >
            <AlertTriangle size={48} color="var(--accent-neon-blue)" style={{ marginBottom: 24 }} />
            <h2 className="heading-md" style={{ marginBottom: 16 }}>
              Something went wrong
            </h2>
            <p style={{ color: 'var(--text-secondary)', marginBottom: 24 }}>
              {this.state.error.message}
            </p>
            <button
              type="button"
              className="btn btn-primary"
              onClick={this.handleRetry}
              style={{ display: 'inline-flex', alignItems: 'center', gap: 8 }}
            >
              <RefreshCw size={18} />
              Try again
            </button>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}
