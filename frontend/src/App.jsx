import React, { useState } from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import { KisanAiAssistantModal } from './features/ai-assistant/KisanAiAssistantModal';
import MainLayout from './layouts/MainLayout';
import { AppRoutes } from './routes/AppRoutes';

function App() {
  const [isAiModalOpen, setIsAiModalOpen] = useState(false);

  return (
    <Router>
      <MainLayout onOpenAiAssistant={() => setIsAiModalOpen(true)}>
        <AppRoutes onOpenAiAssistant={() => setIsAiModalOpen(true)} />
      </MainLayout>
      <KisanAiAssistantModal
        isOpen={isAiModalOpen}
        onClose={() => setIsAiModalOpen(false)}
      />
    </Router>
  );
}

export default App;
