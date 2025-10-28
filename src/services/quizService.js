/**
 * Quiz Service
 * Business logic for quiz operations
 */

import { storageService } from './storageService';
import { scoringService } from './scoringService';

export const quizService = {
  /**
   * Create a new quiz with default structure
   */
  createNewQuiz(title = 'Nuevo Quiz') {
    const quiz = {
      id: storageService.generateId(),
      title,
      description: '',
      questions: [],
      settings: {
        showProgressBar: true,
        showScore: true,
        randomizeQuestions: false,
        randomizeAnswers: false,
        requireEmail: true,
        emailQuestion: '🌟 ¡Acabas de completar el quiz!',
        emailDescription: 'Escribe tu correo para recibir los resultados',
        emailButtonText: 'VER MIS RESULTADOS'
      },
      styling: {
        primaryColor: '#4361ee',
        secondaryColor: '#7209b7',
        backgroundColor: '#ffffff',
        textColor: '#1a365d',
        fontFamily: 'Poppins'
      },
      scoring: {
        results: []
      },
      webhooks: [],
      createdAt: Date.now(),
      updatedAt: Date.now()
    };

    return storageService.saveQuiz(quiz);
  },

  /**
   * Add a new question to quiz
   */
  addQuestion(quizId, questionType = 'multiple-choice') {
    const quiz = storageService.getQuiz(quizId);
    if (!quiz) return null;

    const newQuestion = {
      id: quiz.questions.length + 1,
      type: questionType,
      question: '¿Nueva pregunta?',
      options: this.getDefaultOptions(questionType),
      required: true
    };

    quiz.questions.push(newQuestion);
    return storageService.saveQuiz(quiz);
  },

  /**
   * Get default options based on question type
   */
  getDefaultOptions(questionType) {
    switch (questionType) {
      case 'multiple-choice':
        return [
          { text: 'Opción 1', score: 1 },
          { text: 'Opción 2', score: 2 },
          { text: 'Opción 3', score: 3 }
        ];
      case 'select':
        return [
          { text: 'Selecciona una opción', score: 0 },
          { text: 'Opción A', score: 0 },
          { text: 'Opción B', score: 0 }
        ];
      case 'text':
        return [];
      default:
        return [];
    }
  },

  /**
   * Update a question
   */
  updateQuestion(quizId, questionIndex, updatedQuestion) {
    const quiz = storageService.getQuiz(quizId);
    if (!quiz || !quiz.questions[questionIndex]) return null;

    quiz.questions[questionIndex] = {
      ...quiz.questions[questionIndex],
      ...updatedQuestion
    };

    return storageService.saveQuiz(quiz);
  },

  /**
   * Delete a question
   */
  deleteQuestion(quizId, questionIndex) {
    const quiz = storageService.getQuiz(quizId);
    if (!quiz) return null;

    quiz.questions.splice(questionIndex, 1);

    // Recalcular IDs
    quiz.questions.forEach((q, index) => {
      q.id = index + 1;
    });

    return storageService.saveQuiz(quiz);
  },

  /**
   * Reorder questions
   */
  reorderQuestions(quizId, newOrder) {
    const quiz = storageService.getQuiz(quizId);
    if (!quiz) return null;

    quiz.questions = newOrder;

    // Recalcular IDs
    quiz.questions.forEach((q, index) => {
      q.id = index + 1;
    });

    return storageService.saveQuiz(quiz);
  },

  /**
   * Update quiz settings
   */
  updateSettings(quizId, settings) {
    const quiz = storageService.getQuiz(quizId);
    if (!quiz) return null;

    quiz.settings = {
      ...quiz.settings,
      ...settings
    };

    return storageService.saveQuiz(quiz);
  },

  /**
   * Update quiz styling
   */
  updateStyling(quizId, styling) {
    const quiz = storageService.getQuiz(quizId);
    if (!quiz) return null;

    quiz.styling = {
      ...quiz.styling,
      ...styling
    };

    return storageService.saveQuiz(quiz);
  },

  /**
   * Update scoring configuration
   */
  updateScoring(quizId, scoring) {
    const quiz = storageService.getQuiz(quizId);
    if (!quiz) return null;

    quiz.scoring = {
      ...quiz.scoring,
      ...scoring
    };

    return storageService.saveQuiz(quiz);
  },

  /**
   * Add result range
   */
  addResultRange(quizId) {
    const quiz = storageService.getQuiz(quizId);
    if (!quiz) return null;

    const maxScore = scoringService.calculateMaxScore(quiz.questions);
    const existingRanges = quiz.scoring.results || [];

    let minScore = 0;
    if (existingRanges.length > 0) {
      const lastRange = existingRanges[existingRanges.length - 1];
      minScore = lastRange.maxScore + 1;
    }

    const newRange = {
      minScore,
      maxScore: Math.min(minScore + 10, maxScore),
      level: `Nivel ${existingRanges.length + 1}`,
      message: 'Mensaje personalizado del resultado',
      redirectUrl: ''
    };

    quiz.scoring.results.push(newRange);
    return storageService.saveQuiz(quiz);
  },

  /**
   * Update result range
   */
  updateResultRange(quizId, rangeIndex, updatedRange) {
    const quiz = storageService.getQuiz(quizId);
    if (!quiz || !quiz.scoring.results[rangeIndex]) return null;

    quiz.scoring.results[rangeIndex] = {
      ...quiz.scoring.results[rangeIndex],
      ...updatedRange
    };

    return storageService.saveQuiz(quiz);
  },

  /**
   * Delete result range
   */
  deleteResultRange(quizId, rangeIndex) {
    const quiz = storageService.getQuiz(quizId);
    if (!quiz) return null;

    quiz.scoring.results.splice(rangeIndex, 1);
    return storageService.saveQuiz(quiz);
  },

  /**
   * Update webhooks
   */
  updateWebhooks(quizId, webhooks) {
    const quiz = storageService.getQuiz(quizId);
    if (!quiz) return null;

    quiz.webhooks = webhooks;
    return storageService.saveQuiz(quiz);
  },

  /**
   * Validate quiz before export
   */
  validateQuiz(quizId) {
    const quiz = storageService.getQuiz(quizId);
    if (!quiz) return { isValid: false, errors: ['Quiz no encontrado'] };

    const errors = [];

    // Validar que tenga preguntas
    if (!quiz.questions || quiz.questions.length === 0) {
      errors.push('El quiz debe tener al menos una pregunta');
    }

    // Validar cada pregunta
    quiz.questions.forEach((q, index) => {
      if (!q.question || q.question.trim() === '') {
        errors.push(`Pregunta ${index + 1}: El texto está vacío`);
      }

      if (q.type !== 'text' && (!q.options || q.options.length === 0)) {
        errors.push(`Pregunta ${index + 1}: Debe tener al menos una opción`);
      }
    });

    // Validar configuración de resultados
    if (quiz.scoring.results && quiz.scoring.results.length > 0) {
      const scoringValidation = scoringService.validateScoringConfig(
        quiz.questions,
        quiz.scoring.results
      );

      if (!scoringValidation.isValid) {
        errors.push(...scoringValidation.errors);
      }
    } else {
      errors.push('Debes configurar al menos un rango de resultados');
    }

    return {
      isValid: errors.length === 0,
      errors
    };
  }
};
