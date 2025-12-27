// App.js
// -----------------------------------------------------------------------------
// Commit: Entry point of the Frontend application.
// Purpose: 
// - Orchestrates the main layout of the Pipeline Builder.
// - Composes the Toolbar, UI Canvas (React Flow), and Submit Button.
// - Serves as the root component that initializes the React application structure.
// -----------------------------------------------------------------------------

import { PipelineToolbar } from './toolbar';
import { PipelineUI } from './ui';
import { SubmitButton } from './submit';

/**
 * App Component
 * The main container for the VectorShift Assignment frontend.
 */
function App() {
  return (
    <div>
      {/* Top toolbar for dragging and dropping new nodes */}
      <PipelineToolbar />

      {/* Main canvas area where nodes and edges are rendered */}
      <PipelineUI />

      {/* Footer/Bottom action area for pipeline submission */}
      <SubmitButton />
    </div>
  );
}

export default App;

