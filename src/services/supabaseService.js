/**
 * Supabase Service
 * Handles database operations for quizzes
 */

import { supabase } from '../lib/supabase';

export const supabaseService = {
  /**
   * Get all quizzes for current user
   */
  async getAllQuizzes() {
    try {
      const { data, error } = await supabase
        .from('quizzes')
        .select('*')
        .order('updated_at', { ascending: false });

      if (error) throw error;

      // Convert to object format for compatibility with storageService
      const quizzesObject = {};
      data.forEach(quiz => {
        quizzesObject[quiz.id] = {
          ...quiz,
          updatedAt: new Date(quiz.updated_at).getTime(),
          createdAt: new Date(quiz.created_at).getTime()
        };
      });

      return quizzesObject;
    } catch (error) {
      console.error('Error loading quizzes from Supabase:', error);
      return {};
    }
  },

  /**
   * Get a specific quiz by ID
   */
  async getQuiz(quizId) {
    try {
      const { data, error } = await supabase
        .from('quizzes')
        .select('*')
        .eq('id', quizId)
        .single();

      if (error) throw error;

      return {
        ...data,
        updatedAt: new Date(data.updated_at).getTime(),
        createdAt: new Date(data.created_at).getTime()
      };
    } catch (error) {
      console.error('Error loading quiz from Supabase:', error);
      return null;
    }
  },

  /**
   * Save a quiz (create or update)
   */
  async saveQuiz(quiz) {
    try {
      const now = new Date().toISOString();

      const quizData = {
        id: quiz.id,
        title: quiz.title,
        description: quiz.description,
        questions: quiz.questions,
        settings: quiz.settings,
        styling: quiz.styling,
        scoring: quiz.scoring,
        webhooks: quiz.webhooks,
        updated_at: now,
        created_at: quiz.createdAt ? new Date(quiz.createdAt).toISOString() : now
      };

      // Try to update first, if not exists, insert
      const { data, error } = await supabase
        .from('quizzes')
        .upsert(quizData, {
          onConflict: 'id',
          returning: 'representation'
        })
        .select()
        .single();

      if (error) throw error;

      return {
        ...data,
        updatedAt: new Date(data.updated_at).getTime(),
        createdAt: new Date(data.created_at).getTime()
      };
    } catch (error) {
      console.error('Error saving quiz to Supabase:', error);
      throw error;
    }
  },

  /**
   * Delete a quiz
   */
  async deleteQuiz(quizId) {
    try {
      const { error } = await supabase
        .from('quizzes')
        .delete()
        .eq('id', quizId);

      if (error) throw error;

      return true;
    } catch (error) {
      console.error('Error deleting quiz from Supabase:', error);
      return false;
    }
  },

  /**
   * Duplicate a quiz
   */
  async duplicateQuiz(quizId) {
    try {
      const quiz = await this.getQuiz(quizId);
      if (!quiz) return null;

      const newQuiz = {
        ...quiz,
        id: this.generateId(),
        title: `${quiz.title} (copia)`,
        createdAt: Date.now(),
        updatedAt: Date.now()
      };

      return await this.saveQuiz(newQuiz);
    } catch (error) {
      console.error('Error duplicating quiz:', error);
      return null;
    }
  },

  /**
   * Import quiz from JSON
   */
  async importQuiz(jsonData) {
    try {
      const quiz = typeof jsonData === 'string' ? JSON.parse(jsonData) : jsonData;
      quiz.id = this.generateId();
      quiz.createdAt = Date.now();
      quiz.updatedAt = Date.now();
      return await this.saveQuiz(quiz);
    } catch (error) {
      console.error('Error importing quiz:', error);
      throw error;
    }
  },

  /**
   * Export quiz to JSON
   */
  async exportQuiz(quizId) {
    const quiz = await this.getQuiz(quizId);
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
   * Sync LocalStorage to Supabase
   */
  async syncLocalStorageToSupabase() {
    try {
      const localQuizzes = JSON.parse(localStorage.getItem('quizpro_quizzes') || '{}');
      const quizIds = Object.keys(localQuizzes);

      if (quizIds.length === 0) {
        console.log('No quizzes to sync');
        return { synced: 0, errors: 0 };
      }

      let synced = 0;
      let errors = 0;

      for (const quizId of quizIds) {
        try {
          await this.saveQuiz(localQuizzes[quizId]);
          synced++;
        } catch (error) {
          console.error(`Error syncing quiz ${quizId}:`, error);
          errors++;
        }
      }

      console.log(`Sync complete: ${synced} synced, ${errors} errors`);
      return { synced, errors };
    } catch (error) {
      console.error('Error syncing to Supabase:', error);
      return { synced: 0, errors: 1 };
    }
  },

  /**
   * Check if Supabase is available
   */
  async checkConnection() {
    try {
      console.log('🔍 Checking Supabase connection...');
      const { data, error } = await supabase
        .from('quizzes')
        .select('id')
        .limit(1);

      if (error) {
        console.error('❌ Supabase connection error:', error.message);
        console.error('Error details:', error);
        return false;
      }

      console.log('✅ Supabase connection successful');
      return true;
    } catch (error) {
      console.error('❌ Supabase fatal error:', error);
      return false;
    }
  }
};
