import { useEffect, useState } from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { KisanAiAssistantModal } from './features/ai-assistant/KisanAiAssistantModal';
import { logout } from './features/auth/authSlice';
import MainLayout from './layouts/MainLayout';
import { AppRoutes } from './routes/AppRoutes';

function App() {
  const dispatch = useDispatch();
  const [isAiModalOpen, setIsAiModalOpen] = useState(false);

  useEffect(() => {
    const handleSessionExpired = () => {
      dispatch(logout());
    };
    window.addEventListener('agrimart:auth:session-expired', handleSessionExpired);
    return () => {
      window.removeEventListener('agrimart:auth:session-expired', handleSessionExpired);
    };
  }, [dispatch]);

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
