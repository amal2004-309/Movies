import "./PageLoader.css";

interface PageLoaderProps {
  active: boolean;
}

export function PageLoader({ active }: PageLoaderProps) {
  if (!active) {
    return null;
  }

  return (
    <div className="page-loader" aria-live="polite">
      <div className="page-loader__panel">
        <div className="page-loader__spinner" />
        <div className="page-loader__text">Loading page...</div>
      </div>
    </div>
  );
}
