/**
 * Scoring Service
 * Handles quiz scoring calculations and result determination
 */

export const scoringService = {
  /**
   * Calculate total score from user answers
   */
  calculateScore(answers, questions) {
    let totalScore = 0;

    questions.forEach((question, index) => {
      const answer = answers[index];
      if (!answer) return;

      switch (question.type) {
        case 'multiple-choice':
          const selectedOption = question.options.find(opt => opt.text === answer);
          if (selectedOption) {
            totalScore += selectedOption.score || 0;
          }
          break;

        case 'select':
          const selectedSelectOption = question.options.find(opt => opt.text === answer);
          if (selectedSelectOption) {
            totalScore += selectedSelectOption.score || 0;
          }
          break;

        case 'text':
          // Text answers don't have scores by default
          // Could be extended to support keyword-based scoring
          break;

        default:
          break;
      }
    });

    return totalScore;
  },

  /**
   * Calculate maximum possible score
   */
  calculateMaxScore(questions) {
    let maxScore = 0;

    questions.forEach(question => {
      if (question.options && question.options.length > 0) {
        const scores = question.options.map(opt => opt.score || 0);
        maxScore += Math.max(...scores);
      }
    });

    return maxScore;
  },

  /**
   * Determine result based on score and configured results
   */
  determineResult(score, results) {
    if (!results || results.length === 0) {
      return {
        message: 'Quiz completado',
        redirectUrl: '',
        level: 'default'
      };
    }

    // Sort results by minScore to ensure correct matching
    const sortedResults = [...results].sort((a, b) => a.minScore - b.minScore);

    // Find matching result range
    for (const result of sortedResults) {
      if (score >= result.minScore && score <= result.maxScore) {
        return result;
      }
    }

    // Return last result as fallback
    return sortedResults[sortedResults.length - 1];
  },

  /**
   * Calculate percentage score
   */
  calculatePercentage(score, maxScore) {
    if (maxScore === 0) return 0;
    return Math.round((score / maxScore) * 100);
  },

  /**
   * Validate scoring configuration
   */
  validateScoringConfig(questions, results) {
    const errors = [];

    // Check if questions have valid scores (skip text type questions)
    questions.forEach((question, index) => {
      // Skip validation for text questions (they don't need scores or options)
      if (question.type === 'text') {
        return;
      }

      // Check if non-text questions have options
      if (!question.options || question.options.length === 0) {
        errors.push(`Pregunta ${index + 1}: No tiene opciones de respuesta`);
        return;
      }

      // Check if at least one option has a valid score
      const hasValidScores = question.options.some(opt => typeof opt.score === 'number');
      if (!hasValidScores) {
        errors.push(`Pregunta ${index + 1}: Ninguna opción tiene puntaje asignado`);
      }
    });

    // Check if results cover all score ranges
    if (results && results.length > 0) {
      const maxPossibleScore = this.calculateMaxScore(questions);
      const sortedResults = [...results].sort((a, b) => a.minScore - b.minScore);

      // Check for gaps in score ranges
      for (let i = 0; i < sortedResults.length - 1; i++) {
        const current = sortedResults[i];
        const next = sortedResults[i + 1];

        if (current.maxScore + 1 < next.minScore) {
          errors.push(`Hay un vacío en los rangos de puntaje entre ${current.maxScore} y ${next.minScore}`);
        }
      }

      // Check if results cover max possible score
      const lastResult = sortedResults[sortedResults.length - 1];
      if (lastResult.maxScore < maxPossibleScore) {
        errors.push(`El rango de resultados no cubre el puntaje máximo posible (${maxPossibleScore})`);
      }
    }

    return {
      isValid: errors.length === 0,
      errors
    };
  }
};
