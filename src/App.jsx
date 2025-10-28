import { useState } from 'react';
import './App.css';
import AdminDashboard from './components/admin/AdminDashboard';
import QuizEditor from './components/admin/QuizEditor';

function App() {
  const [currentView, setCurrentView] = useState('dashboard');
  const [selectedQuizId, setSelectedQuizId] = useState(null);

  const handleEditQuiz = (quizId) => {
    setSelectedQuizId(quizId);
    setCurrentView('editor');
  };

  const handleBackToDashboard = () => {
    setCurrentView('dashboard');
    setSelectedQuizId(null);
  };

  return (
    <div className="app">
      {currentView === 'dashboard' ? (
        <AdminDashboard onEditQuiz={handleEditQuiz} />
      ) : (
        <QuizEditor
          quizId={selectedQuizId}
          onBack={handleBackToDashboard}
        />
      )}
    </div>
  );
}

export default App;
