import { RouterProvider } from "react-router";
import { router } from "./routes";
import { TooltipProvider } from "@/app/components/ui/tooltip";
import { CookieBanner } from "@/app/components/CookieBanner";
import { Component, ErrorInfo, ReactNode } from "react";

// Error Boundary to catch routing errors
class ErrorBoundary extends Component<
  { children: ReactNode },
  { hasError: boolean }
> {
  constructor(props: { children: ReactNode }) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(_: Error) {
    return { hasError: true };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error("Router error:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div style={{ 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'center', 
          height: '100vh',
          fontFamily: 'Work Sans, sans-serif',
          color: '#131718'
        }}>
          <div style={{ textAlign: 'center' }}>
            <h1>Loading...</h1>
            <button 
              onClick={() => window.location.reload()}
              style={{
                marginTop: '20px',
                padding: '10px 20px',
                background: '#FEE6EA',
                border: 'none',
                borderRadius: '8px',
                cursor: 'pointer'
              }}
            >
              Refresh Page
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

function App() {
  return (
    <ErrorBoundary>
      <TooltipProvider>
        <RouterProvider router={router} />
        <CookieBanner />
      </TooltipProvider>
    </ErrorBoundary>
  );
}

export default App;