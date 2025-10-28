/**
 * Sample Quizzes
 * Pre-configured quizzes for demo and templates
 */

export const sampleQuizzes = {
  energetico: {
    id: 'sample_energetico',
    title: 'Prueba Energética - Nivel de Conciencia',
    description: 'Descubre tu nivel actual de conciencia y el camino hacia tu evolución espiritual',
    questions: [
      {
        id: 1,
        type: 'multiple-choice',
        question: '¿Sientes que estás viviendo tu propia vida, o la que alguien más escribió para ti?',
        options: [
          { text: 'Es la vida que me tocó vivir', score: 1 },
          { text: 'A veces siento que no la elegí realmente', score: 2 },
          { text: 'Yo elegí mi camino con Conciencia', score: 3 }
        ],
        required: true
      },
      {
        id: 2,
        type: 'multiple-choice',
        question: '¿Con qué frecuencia repites los mismos problemas, aunque hagas todo lo posible por cambiarlos?',
        options: [
          { text: 'Siempre vuelvo a lo mismo, por más que lo intento', score: 1 },
          { text: 'A veces me pasa, aunque intento mejorar', score: 2 },
          { text: 'Estoy creando nuevas realidades en mi vida', score: 3 }
        ],
        required: true
      },
      {
        id: 3,
        type: 'multiple-choice',
        question: '¿Qué sientes cuando piensas en tu propósito de vida?',
        options: [
          { text: 'Confusión, vacío o resignación', score: 1 },
          { text: 'A veces me inspira, pero me pierdo en el camino', score: 2 },
          { text: 'Siento que estoy viviendo con sentido', score: 3 }
        ],
        required: true
      },
      {
        id: 4,
        type: 'select',
        question: '¿Desde qué parte del mundo estás respondiendo?',
        options: [
          { text: 'Colombia', score: 0 },
          { text: 'Estados Unidos', score: 0 },
          { text: 'México', score: 0 },
          { text: 'Argentina', score: 0 },
          { text: 'España', score: 0 },
          { text: 'Otro', score: 0 }
        ],
        required: true
      }
    ],
    settings: {
      showProgressBar: true,
      showScore: true,
      randomizeQuestions: false,
      randomizeAnswers: false,
      requireEmail: true,
      emailQuestion: '🌟 ¡Acabas de completar tu prueba energética!',
      emailDescription: 'Escribe tu correo para recibir tu diagnóstico personalizado',
      emailButtonText: 'QUIERO CONOCER MI DIAGNÓSTICO'
    },
    styling: {
      primaryColor: '#4361ee',
      secondaryColor: '#7209b7',
      backgroundColor: '#ffffff',
      textColor: '#1a365d',
      fontFamily: 'Poppins'
    },
    scoring: {
      results: [
        {
          minScore: 0,
          maxScore: 5,
          level: 'Nivel 1 - El Guerrero Manipulado',
          message: '🎯 Revisa tu correo electrónico para ver tu análisis completo',
          redirectUrl: 'https://ejemplo.com/nivel-1'
        },
        {
          minScore: 6,
          maxScore: 8,
          level: 'Nivel 2 - El Llamado Silenciado',
          message: '🎯 Revisa tu correo electrónico para ver tu análisis completo',
          redirectUrl: 'https://ejemplo.com/nivel-2'
        },
        {
          minScore: 9,
          maxScore: 12,
          level: 'Nivel 3 - El Despierto Consciente',
          message: '🎯 Revisa tu correo electrónico para ver tu análisis completo',
          redirectUrl: 'https://ejemplo.com/nivel-3'
        }
      ]
    },
    webhooks: [
      {
        url: 'https://flows-web.n1cr.com/webhook/ejemplo',
        events: ['quiz_completed', 'email_captured']
      }
    ]
  },

  personalidad: {
    id: 'sample_personalidad',
    title: 'Test de Personalidad Empresarial',
    description: 'Descubre qué tipo de emprendedor eres',
    questions: [
      {
        id: 1,
        type: 'multiple-choice',
        question: '¿Cómo prefieres tomar decisiones importantes?',
        options: [
          { text: 'Análisis detallado y datos concretos', score: 3 },
          { text: 'Intuición y experiencia', score: 2 },
          { text: 'Consulto con mi equipo', score: 1 }
        ],
        required: true
      },
      {
        id: 2,
        type: 'multiple-choice',
        question: '¿Qué te motiva más en tu trabajo?',
        options: [
          { text: 'Resolver problemas complejos', score: 3 },
          { text: 'Crear algo nuevo e innovador', score: 2 },
          { text: 'Ayudar a otras personas', score: 1 }
        ],
        required: true
      },
      {
        id: 3,
        type: 'text',
        question: '¿Cuál es tu mayor fortaleza profesional?',
        options: [],
        required: false
      }
    ],
    settings: {
      showProgressBar: true,
      showScore: false,
      randomizeQuestions: false,
      randomizeAnswers: false,
      requireEmail: true,
      emailQuestion: '¡Descubre tu perfil de emprendedor!',
      emailDescription: 'Ingresa tu email para recibir tu análisis personalizado',
      emailButtonText: 'VER MI PERFIL'
    },
    styling: {
      primaryColor: '#10b981',
      secondaryColor: '#059669',
      backgroundColor: '#ffffff',
      textColor: '#1f2937',
      fontFamily: 'Inter'
    },
    scoring: {
      results: [
        {
          minScore: 0,
          maxScore: 3,
          level: 'El Colaborador',
          message: 'Tu enfoque está en el trabajo en equipo y las relaciones',
          redirectUrl: ''
        },
        {
          minScore: 4,
          maxScore: 6,
          level: 'El Innovador',
          message: 'Te destacas por tu creatividad y visión de futuro',
          redirectUrl: ''
        }
      ]
    },
    webhooks: []
  },

  trivial: {
    id: 'sample_trivial',
    title: 'Quiz de Cultura General',
    description: 'Pon a prueba tus conocimientos',
    questions: [
      {
        id: 1,
        type: 'multiple-choice',
        question: '¿Cuál es la capital de Francia?',
        options: [
          { text: 'Londres', score: 0 },
          { text: 'París', score: 10 },
          { text: 'Madrid', score: 0 },
          { text: 'Roma', score: 0 }
        ],
        required: true
      },
      {
        id: 2,
        type: 'multiple-choice',
        question: '¿En qué año llegó el hombre a la luna?',
        options: [
          { text: '1965', score: 0 },
          { text: '1969', score: 10 },
          { text: '1972', score: 0 },
          { text: '1975', score: 0 }
        ],
        required: true
      },
      {
        id: 3,
        type: 'select',
        question: '¿Qué tema te interesa más?',
        options: [
          { text: 'Historia', score: 0 },
          { text: 'Ciencia', score: 0 },
          { text: 'Arte', score: 0 },
          { text: 'Deportes', score: 0 }
        ],
        required: true
      }
    ],
    settings: {
      showProgressBar: true,
      showScore: true,
      randomizeQuestions: true,
      randomizeAnswers: true,
      requireEmail: false,
      emailQuestion: '¿Quieres recibir más quizzes?',
      emailDescription: 'Suscríbete para recibir nuevos desafíos',
      emailButtonText: 'SUSCRIBIRME'
    },
    styling: {
      primaryColor: '#f59e0b',
      secondaryColor: '#d97706',
      backgroundColor: '#fffbeb',
      textColor: '#78350f',
      fontFamily: 'Roboto'
    },
    scoring: {
      results: [
        {
          minScore: 0,
          maxScore: 10,
          level: 'Principiante',
          message: '¡Sigue aprendiendo! Hay mucho por descubrir',
          redirectUrl: ''
        },
        {
          minScore: 11,
          maxScore: 20,
          level: 'Experto',
          message: '¡Excelente! Tienes muy buenos conocimientos',
          redirectUrl: ''
        }
      ]
    },
    webhooks: []
  }
};

export const defaultQuizTemplate = {
  id: '',
  title: 'Nuevo Quiz',
  description: '',
  questions: [],
  settings: {
    showProgressBar: true,
    showScore: true,
    randomizeQuestions: false,
    randomizeAnswers: false,
    requireEmail: true,
    emailQuestion: '🌟 ¡Completaste el quiz!',
    emailDescription: 'Ingresa tu email para recibir los resultados',
    emailButtonText: 'VER RESULTADOS'
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
  webhooks: []
};
