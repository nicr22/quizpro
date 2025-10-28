/**
 * Hybrid Storage Service
 * Uses Supabase as primary storage with LocalStorage as fallback
 */

import { supabaseService } from './supabaseService';
import { storageService } from './storageService';

// Flag to track if Supabase is available
let useSupabase = true;

export const hybridStorageService = {
  /**
   * Initialize and check Supabase connection
   */
  async initialize() {
    try {
      useSupabase = await supabaseService.checkConnection();
      if (!useSupabase) {
        console.warn('Supabase not available, using LocalStorage only');
      } else {
        console.log('✅ Supabase connected successfully');
      }
      return useSupabase;
    } catch (error) {
      console.error('Error initializing storage:', error);
      useSupabase = false;
      return false;
    }
  },

  /**
   * Get all quizzes
   */
  async getAllQuizzes() {
    if (useSupabase) {
      try {
        const quizzes = await supabaseService.getAllQuizzes();
        // Also save to LocalStorage as cache
        localStorage.setItem('quizpro_quizzes', JSON.stringify(quizzes));
        return quizzes;
      } catch (error) {
        console.error('Error loading from Supabase, using LocalStorage:', error);
        return storageService.getAllQuizzes();
      }
    }
    return storageService.getAllQuizzes();
  },

  /**
   * Get a specific quiz by ID
   */
  async getQuiz(quizId) {
    if (useSupabase) {
      try {
        const quiz = await supabaseService.getQuiz(quizId);
        if (quiz) {
          // Cache in LocalStorage
          const quizzes = storageService.getAllQuizzes();
          quizzes[quizId] = quiz;
          localStorage.setItem('quizpro_quizzes', JSON.stringify(quizzes));
        }
        return quiz;
      } catch (error) {
        console.error('Error loading quiz from Supabase:', error);
        return storageService.getQuiz(quizId);
      }
    }
    return storageService.getQuiz(quizId);
  },

  /**
   * Save a quiz (create or update)
   */
  async saveQuiz(quiz) {
    // Always save to LocalStorage first (for immediate UI update)
    const savedQuiz = storageService.saveQuiz(quiz);

    if (useSupabase) {
      try {
        // Sync to Supabase
        const supabaseQuiz = await supabaseService.saveQuiz(savedQuiz);
        console.log('✅ Quiz saved to Supabase:', supabaseQuiz.id);
        return supabaseQuiz;
      } catch (error) {
        console.error('❌ Error saving to Supabase, kept in LocalStorage:', error);
        // Still return the LocalStorage version
        return savedQuiz;
      }
    }

    return savedQuiz;
  },

  /**
   * Delete a quiz
   */
  async deleteQuiz(quizId) {
    // Delete from LocalStorage first
    const localSuccess = storageService.deleteQuiz(quizId);

    if (useSupabase) {
      try {
        await supabaseService.deleteQuiz(quizId);
        console.log('✅ Quiz deleted from Supabase:', quizId);
      } catch (error) {
        console.error('❌ Error deleting from Supabase:', error);
      }
    }

    return localSuccess;
  },

  /**
   * Duplicate a quiz
   */
  async duplicateQuiz(quizId) {
    if (useSupabase) {
      try {
        const newQuiz = await supabaseService.duplicateQuiz(quizId);
        // Also save to LocalStorage
        if (newQuiz) {
          storageService.saveQuiz(newQuiz);
        }
        return newQuiz;
      } catch (error) {
        console.error('Error duplicating in Supabase:', error);
        return storageService.duplicateQuiz(quizId);
      }
    }
    return storageService.duplicateQuiz(quizId);
  },

  /**
   * Import quiz from JSON
   */
  async importQuiz(jsonData) {
    if (useSupabase) {
      try {
        const newQuiz = await supabaseService.importQuiz(jsonData);
        // Also save to LocalStorage
        if (newQuiz) {
          storageService.saveQuiz(newQuiz);
        }
        return newQuiz;
      } catch (error) {
        console.error('Error importing to Supabase:', error);
        return storageService.importQuiz(jsonData);
      }
    }
    return storageService.importQuiz(jsonData);
  },

  /**
   * Export quiz to JSON
   */
  async exportQuiz(quizId) {
    if (useSupabase) {
      try {
        return await supabaseService.exportQuiz(quizId);
      } catch (error) {
        console.error('Error exporting from Supabase:', error);
        return storageService.exportQuiz(quizId);
      }
    }
    return storageService.exportQuiz(quizId);
  },

  /**
   * Generate unique ID
   */
  generateId() {
    return storageService.generateId();
  },

  /**
   * Sync LocalStorage to Supabase
   */
  async syncToSupabase() {
    if (!useSupabase) {
      console.warn('Supabase not available, cannot sync');
      return { synced: 0, errors: 0 };
    }

    try {
      const result = await supabaseService.syncLocalStorageToSupabase();
      console.log(`Sync completed: ${result.synced} quizzes synced, ${result.errors} errors`);
      return result;
    } catch (error) {
      console.error('Error during sync:', error);
      return { synced: 0, errors: 1 };
    }
  },

  /**
   * Check if using Supabase
   */
  isUsingSupabase() {
    return useSupabase;
  },

  /**
   * Force enable/disable Supabase
   */
  setUseSupabase(enabled) {
    useSupabase = enabled;
  }
};
