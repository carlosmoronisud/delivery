/* eslint-disable @typescript-eslint/no-unused-vars */
// src/components/ErrorBoundary.tsx

import { type ReactNode, Component, type ErrorInfo } from "react";


interface ErrorBoundaryProps {
  children: ReactNode;
  fallback?: ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
}

class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  state: ErrorBoundaryState = { hasError: false };

  static getDerivedStateFromError(_: Error): ErrorBoundaryState {
    return { hasError: true };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error("ErrorBoundary caught:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return this.props.fallback || <div className="p-4 bg-red-100 text-red-800">Algo deu errado. Por favor, recarregue a página.</div>;
    }

    return this.props.children;
  }
}

export default ErrorBoundary;