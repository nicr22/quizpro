/**
 * LocalStorage Service
 * Manages quiz data persistence in browser storage
 */

const STORAGE_KEY = 'quizpro_quizzes';

export const storageService = {
  /**
   * Get all quizzes from storage
   */
  getAllQuizzes() {
    try {
      const data = localStorage.getItem(STORAGE_KEY);
      return data ? JSON.parse(data) : {};
    } catch (error) {
      console.error('Error loading quizzes:', error);
      return {};
    }
  },

  /**
   * Get a specific quiz by ID
   */
  getQuiz(quizId) {
    const quizzes = this.getAllQuizzes();
    return quizzes[quizId] || null;
  },

  /**
   * Save a quiz (create or update)
   */
  saveQuiz(quiz) {
    try {
      const quizzes = this.getAllQuizzes();
      const now = Date.now();

      const quizToSave = {
        ...quiz,
        updatedAt: now,
        createdAt: quiz.createdAt || now
      };

      quizzes[quiz.id] = quizToSave;
      localStorage.setItem(STORAGE_KEY, JSON.stringify(quizzes));

      return quizToSave;
    } catch (error) {
      console.error('Error saving quiz:', error);
      throw error;
    }
  },

  /**
   * Delete a quiz
   */
  deleteQuiz(quizId) {
    try {
      const quizzes = this.getAllQuizzes();
      delete quizzes[quizId];
      localStorage.setItem(STORAGE_KEY, JSON.stringify(quizzes));
      return true;
    } catch (error) {
      console.error('Error deleting quiz:', error);
      return false;
    }
  },

  /**
   * Duplicate a quiz
   */
  duplicateQuiz(quizId) {
    const quiz = this.getQuiz(quizId);
    if (!quiz) return null;

    const newQuiz = {
      ...quiz,
      id: this.generateId(),
      title: `${quiz.title} (copia)`,
      createdAt: Date.now(),
      updatedAt: Date.now()
    };

    return this.saveQuiz(newQuiz);
  },

  /**
   * Import quiz from JSON
   */
  importQuiz(jsonData) {
    try {
      const quiz = typeof jsonData === 'string' ? JSON.parse(jsonData) : jsonData;
      quiz.id = this.generateId();
      quiz.createdAt = Date.now();
      quiz.updatedAt = Date.now();
      return this.saveQuiz(quiz);
    } catch (error) {
      console.error('Error importing quiz:', error);
      throw error;
    }
  },

  /**
   * Export quiz to JSON
   */
  exportQuiz(quizId) {
    const quiz = this.getQuiz(quizId);
    if (!quiz) return null;
    return JSON.stringify(quiz, null, 2);
  },

  /**
   * Generate unique ID
   */
  generateId() {
    return `quiz_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  },

  /**
   * Clear all quizzes (use with caution)
   */
  clearAll() {
    localStorage.removeItem(STORAGE_KEY);
  }
};
