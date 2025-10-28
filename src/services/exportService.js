/**
 * Export Service
 * Generates HTML code for WordPress embedding
 */

export const exportService = {
  /**
   * Generate complete standalone HTML for WordPress
   */
  generateHTML(quiz) {
    const {
      title,
      description,
      questions,
      settings,
      styling,
      scoring,
      webhooks
    } = quiz;

    const maxScore = this.calculateMaxScore(questions);
    const questionsConfig = this.formatQuestionsForExport(questions);
    const resultsConfig = this.formatResultsForExport(scoring.results || []);
    const webhookUrl = webhooks && webhooks.length > 0 ? webhooks[0].url : '';

    return `<!-- QUIZ GENERADO CON QUIZPRO -->
<div id="quizpro-container-${quiz.id}">
    <style>
        /* Estilos encapsulados para evitar conflictos con WordPress */
        #quizpro-container-${quiz.id} {
            font-family: '${styling.fontFamily || 'Poppins, Arial, sans-serif'}';
            width: 100%;
            max-width: 680px;
            margin: 20px auto;
            background: ${styling.backgroundColor || 'white'};
            border-radius: 16px;
            padding: 40px;
            box-shadow: 0 10px 30px rgba(0,0,0,0.08);
            position: relative;
            color: #333;
            box-sizing: border-box;
        }

        #quizpro-container-${quiz.id} * {
            box-sizing: border-box;
        }

        #quizpro-container-${quiz.id} .quiz-question {
            display: none;
            text-align: center;
        }

        #quizpro-container-${quiz.id} .quiz-question.active {
            display: block;
            animation: quizFadeIn 0.7s ease;
        }

        #quizpro-container-${quiz.id} h2 {
            color: ${styling.textColor || '#1a365d'} !important;
            margin-bottom: 30px;
            font-size: 20px;
            font-weight: 600;
            line-height: 1.4;
            font-family: '${styling.fontFamily || 'Poppins, Arial, sans-serif'}' !important;
        }

        #quizpro-container-${quiz.id} .quiz-btn-container {
            display: flex;
            justify-content: space-between;
            margin-top: 30px;
            flex-wrap: wrap;
        }

        #quizpro-container-${quiz.id} .quiz-btn-container.multiple-choice {
            flex-direction: column;
        }

        #quizpro-container-${quiz.id} .quiz-btn-container.multiple-choice .quiz-btn {
            width: 100% !important;
            margin-bottom: 14px;
            text-align: left;
            padding-left: 20px;
            position: relative;
            min-height: 50px;
            display: flex;
            align-items: center;
        }

        #quizpro-container-${quiz.id} .quiz-btn {
            background-color: ${styling.primaryColor || '#4361ee'} !important;
            color: white !important;
            border: none !important;
            padding: 14px 25px;
            border-radius: 8px;
            cursor: pointer;
            font-size: 16px !important;
            font-weight: 600;
            width: 48%;
            transition: all 0.3s ease;
            margin-bottom: 16px;
            box-shadow: 0 4px 6px rgba(67, 97, 238, 0.15);
            font-family: '${styling.fontFamily || 'Poppins, Arial, sans-serif'}' !important;
            text-decoration: none !important;
        }

        #quizpro-container-${quiz.id} .quiz-btn:hover {
            background-color: ${styling.secondaryColor || '#3a56d4'} !important;
            transform: translateY(-2px);
            box-shadow: 0 6px 12px rgba(67, 97, 238, 0.2);
        }

        #quizpro-container-${quiz.id} .quiz-progress-container {
            margin-bottom: 30px;
            ${settings.showProgressBar === false ? 'display: none;' : ''}
        }

        #quizpro-container-${quiz.id} .quiz-progress-bar {
            height: 8px;
            background-color: #e9ecef;
            border-radius: 10px;
            margin-top: 5px;
            overflow: hidden;
        }

        #quizpro-container-${quiz.id} .quiz-progress {
            height: 100%;
            background: linear-gradient(90deg, ${styling.primaryColor || '#4361ee'}, ${styling.secondaryColor || '#7209b7'});
            border-radius: 10px;
            width: 0%;
            transition: width 0.6s ease;
        }

        #quizpro-container-${quiz.id} .quiz-results,
        #quizpro-container-${quiz.id} .quiz-loading-screen {
            display: none;
            text-align: center;
        }

        #quizpro-container-${quiz.id} .quiz-loader {
            display: inline-block;
            border: 5px solid #f3f3f3;
            border-top: 5px solid ${styling.primaryColor || '#4361ee'};
            border-radius: 50%;
            width: 60px;
            height: 60px;
            animation: quizSpin 1s linear infinite;
            margin: 30px auto;
        }

        #quizpro-container-${quiz.id} .quiz-form-group {
            margin-bottom: 25px;
            text-align: left;
        }

        #quizpro-container-${quiz.id} .quiz-form-group input,
        #quizpro-container-${quiz.id} .quiz-form-group select {
            width: 100%;
            padding: 16px;
            border: 1px solid #e0e0e0;
            border-radius: 8px;
            font-size: 16px;
            transition: all 0.3s ease;
            font-family: '${styling.fontFamily || 'Poppins, Arial, sans-serif'}';
        }

        #quizpro-container-${quiz.id} .quiz-form-group input:focus,
        #quizpro-container-${quiz.id} .quiz-form-group select:focus {
            outline: none;
            border-color: ${styling.primaryColor || '#4361ee'};
            box-shadow: 0 0 0 3px rgba(67, 97, 238, 0.1);
        }

        #quizpro-container-${quiz.id} .quiz-error-message {
            color: #e53e3e;
            font-size: 14px;
            margin-top: 6px;
            display: none;
        }

        #quizpro-container-${quiz.id} .quiz-error-message.visible {
            display: block;
            animation: quizShake 0.5s;
        }

        #quizpro-container-${quiz.id} .quiz-score-display {
            background: linear-gradient(135deg, ${styling.primaryColor || '#667eea'} 0%, ${styling.secondaryColor || '#764ba2'} 100%);
            color: white;
            padding: 20px;
            border-radius: 12px;
            margin: 20px 0;
            font-size: 18px;
            font-weight: 600;
            ${settings.showScore === false ? 'display: none;' : ''}
        }

        /* Animaciones */
        @keyframes quizFadeIn {
            from { opacity: 0; transform: translateY(10px); }
            to { opacity: 1; transform: translateY(0); }
        }

        @keyframes quizSpin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
        }

        @keyframes quizShake {
            0%, 100% { transform: translateX(0); }
            10%, 30%, 50%, 70%, 90% { transform: translateX(-5px); }
            20%, 40%, 60%, 80% { transform: translateX(5px); }
        }

        @keyframes pulse {
            0% {
                transform: scale(1);
                box-shadow: 0 0 0 0 rgba(255, 107, 107, 0.7);
            }
            70% {
                transform: scale(1.02);
                box-shadow: 0 0 0 10px rgba(255, 107, 107, 0);
            }
            100% {
                transform: scale(1);
                box-shadow: 0 0 0 0 rgba(255, 107, 107, 0);
            }
        }

        /* Responsive */
        @media (max-width: 768px) {
            #quizpro-container-${quiz.id} {
                padding: 25px;
                margin: 10px;
            }

            #quizpro-container-${quiz.id} .quiz-btn {
                font-size: 15px !important;
                padding: 12px 20px;
                width: 100% !important;
            }

            #quizpro-container-${quiz.id} h2 {
                font-size: 18px !important;
                margin-bottom: 20px;
            }
        }
    </style>

    <!-- Fuente Google Fonts -->
    <link href="https://fonts.googleapis.com/css2?family=${styling.fontFamily ? styling.fontFamily.replace(/\s+/g, '+') : 'Poppins'}:wght@400;500;600;700&display=swap" rel="stylesheet">

    <!-- Contenedor principal del quiz -->
    <div class="quiz-progress-container">
        <div class="quiz-progress-bar">
            <div class="quiz-progress" id="quiz-progress-bar-${quiz.id}"></div>
        </div>
    </div>

    <!-- Contenedor de preguntas dinámicas -->
    <div id="quiz-questions-container-${quiz.id}"></div>

    <!-- Pantalla de carga -->
    <div class="quiz-loading-screen" id="quiz-loading-screen-${quiz.id}">
        <h2>🔮 Calculando tus resultados...</h2>
        <div class="quiz-loader"></div>
        <p style="margin-top: 20px; font-size: 16px;">Estamos analizando tus respuestas</p>
    </div>

    <!-- Pregunta final - Email -->
    <div class="quiz-question" id="quiz-question-final-email-${quiz.id}">
        <h2>🌟 ¡Acabas de completar el quiz!</h2>
        <p style="margin-bottom: 15px; font-size: 16px; font-weight: 600;">Tu resultado ya está listo.</p>
        <p style="margin-bottom: 25px; font-size: 16px;"><strong>👉 Escribe tu correo ahora mismo</strong></p>
        <p style="margin-bottom: 25px; font-size: 16px;">Allí estoy enviando tu <strong>resultado personalizado</strong></p>
        <div class="quiz-form-group">
            <input type="email" id="quiz-final-email-input-${quiz.id}" placeholder="tucorreo@ejemplo.com">
            <div class="quiz-error-message" id="quiz-final-email-error-${quiz.id}">Por favor, ingresa un correo electrónico válido para recibir tus resultados.</div>
        </div>
        <div class="quiz-btn-container">
            <button class="quiz-btn" onclick="window.quiz_${quiz.id}_validateFinalEmail()" style="width: 100% !important;">VER MIS RESULTADOS</button>
        </div>
    </div>

    <!-- Resultados finales -->
    <div class="quiz-results" id="quiz-final-results-${quiz.id}">
        <div style="font-size: 22px; margin-bottom: 25px; font-weight: 600; color: #1a365d;">✨ ¡Resultados Enviados! ✨</div>
        <div class="quiz-score-display" id="quiz-score-display-${quiz.id}">
            Tu puntuación: <span id="quiz-final-score-${quiz.id}">0</span>/${maxScore} puntos
        </div>
        <p style="font-size: 18px; line-height: 1.5; font-weight: bold; margin-bottom: 20px;">
           Revisa tu correo electrónico para ver tu análisis completo.
        </p>
    </div>

    <script>
        (function() {
            // Configuración del quiz
            const QUIZ_CONFIG = ${questionsConfig};
            const RESULTS_CONFIG = ${resultsConfig};
            const WEBHOOK_URL = '${webhookUrl}';
            const QUIZ_ID = '${quiz.id}';

            let quizTotalQuestions = QUIZ_CONFIG.length;
            let quizCurrentQuestion = 1;
            let quizUserResponses = {};
            let quizTotalScore = 0;
            let quizUserEmail = "";
            let quizUtmParams = {};
            let quizQuestionPath = [];

            function getUrlParameter(name) {
                name = name.replace(/[\\[]/, '\\\\[').replace(/[\\]]/, '\\\\]');
                var regex = new RegExp('[\\\\?&]' + name + '=([^&#]*)');
                var results = regex.exec(location.search);
                return results === null ? '' : decodeURIComponent(results[1].replace(/\\+/g, ' '));
            }

            function captureUtmParameters() {
                quizUtmParams = {
                    utm_source: getUrlParameter('utm_source'),
                    utm_medium: getUrlParameter('utm_medium'),
                    utm_campaign: getUrlParameter('utm_campaign'),
                    utm_content: getUrlParameter('utm_content'),
                    utm_term: getUrlParameter('utm_term')
                };
            }

            function updateProgress() {
                const progressPercent = (quizCurrentQuestion / quizTotalQuestions) * 100;
                document.getElementById('quiz-progress-bar-' + QUIZ_ID).style.width = progressPercent + '%';
            }

            function generateQuestions() {
                const container = document.getElementById('quiz-questions-container-' + QUIZ_ID);
                if (!container) return;

                container.innerHTML = '';

                QUIZ_CONFIG.forEach((questionData, index) => {
                    const questionDiv = document.createElement('div');
                    questionDiv.className = 'quiz-question';
                    questionDiv.id = 'quiz-question-' + questionData.id + '-' + QUIZ_ID;

                    if (index === 0) {
                        questionDiv.classList.add('active');
                    }

                    let questionHTML = '<h2>' + questionData.question + '</h2>';

                    if (questionData.type === 'multiple-choice') {
                        questionHTML += '<div class="quiz-btn-container multiple-choice">';
                        questionData.options.forEach(function(option) {
                            const safeText = option.text.replace(/'/g, "\\\\'");
                            questionHTML += '<button class="quiz-btn" onclick="window.quiz_' + QUIZ_ID + '_recordAnswer(\\'' + safeText + '\\', ' + option.score + ')">' + option.text + '</button>';
                        });
                        questionHTML += '</div>';

                    } else if (questionData.type === 'select') {
                        questionHTML += '<div class="quiz-form-group">';
                        questionHTML += '<select id="quiz-select-' + questionData.id + '-' + QUIZ_ID + '">';
                        questionHTML += '<option value="">Selecciona una opción</option>';
                        questionData.options.forEach(function(option) {
                            questionHTML += '<option value="' + option.text + '">' + option.text + '</option>';
                        });
                        questionHTML += '</select>';
                        questionHTML += '<div class="quiz-error-message" id="quiz-select-error-' + questionData.id + '-' + QUIZ_ID + '">Por favor, selecciona una opción para continuar.</div>';
                        questionHTML += '</div>';
                        questionHTML += '<div class="quiz-btn-container">';
                        questionHTML += '<button class="quiz-btn" onclick="window.quiz_' + QUIZ_ID + '_validateSelect(' + questionData.id + ')" style="width: 100% !important;">Continuar</button>';
                        questionHTML += '</div>';

                    } else if (questionData.type === 'text') {
                        questionHTML += '<div class="quiz-form-group">';
                        questionHTML += '<input type="text" id="quiz-text-' + questionData.id + '-' + QUIZ_ID + '" placeholder="Tu respuesta...">';
                        questionHTML += '<div class="quiz-error-message" id="quiz-text-error-' + questionData.id + '-' + QUIZ_ID + '">Por favor, escribe una respuesta.</div>';
                        questionHTML += '</div>';
                        questionHTML += '<div class="quiz-btn-container">';
                        questionHTML += '<button class="quiz-btn" onclick="window.quiz_' + QUIZ_ID + '_validateText(' + questionData.id + ')" style="width: 100% !important;">Continuar</button>';
                        questionHTML += '</div>';
                    }

                    questionDiv.innerHTML = questionHTML;
                    container.appendChild(questionDiv);
                });
            }

            function recordAnswer(answer, score) {
                const currentQuestionId = 'quiz-question-' + quizCurrentQuestion + '-' + QUIZ_ID;

                quizUserResponses[currentQuestionId] = {
                    question: QUIZ_CONFIG[quizCurrentQuestion - 1].question,
                    answer: answer,
                    score: score,
                    question_number: quizCurrentQuestion
                };

                quizQuestionPath.push({
                    question: quizCurrentQuestion,
                    answer: answer,
                    score: score
                });

                quizTotalScore += score;

                document.getElementById(currentQuestionId).classList.remove('active');

                quizCurrentQuestion++;
                updateProgress();

                if (quizCurrentQuestion > quizTotalQuestions) {
                    showLoadingScreen();
                } else {
                    const nextQuestionId = 'quiz-question-' + quizCurrentQuestion + '-' + QUIZ_ID;
                    const nextElement = document.getElementById(nextQuestionId);
                    if (nextElement) {
                        nextElement.classList.add('active');
                    }
                }
            }

            function validateSelect(questionId) {
                const selectElement = document.getElementById('quiz-select-' + questionId + '-' + QUIZ_ID);
                const errorMsg = document.getElementById('quiz-select-error-' + questionId + '-' + QUIZ_ID);
                const selectedValue = selectElement.value;

                if (selectedValue === '') {
                    errorMsg.classList.add('visible');
                    selectElement.style.borderColor = '#e53e3e';
                    setTimeout(function() {
                        errorMsg.classList.remove('visible');
                        selectElement.style.borderColor = '#e0e0e0';
                    }, 3000);
                    return false;
                }

                const questionData = QUIZ_CONFIG.find(function(q) { return q.id === questionId; });
                const selectedOption = questionData.options.find(function(option) { return option.text === selectedValue; });
                const score = selectedOption ? selectedOption.score : 0;

                recordAnswer(selectedValue, score);
                return true;
            }

            function validateText(questionId) {
                const textElement = document.getElementById('quiz-text-' + questionId + '-' + QUIZ_ID);
                const errorMsg = document.getElementById('quiz-text-error-' + questionId + '-' + QUIZ_ID);
                const textValue = textElement.value.trim();

                if (textValue === '') {
                    errorMsg.classList.add('visible');
                    textElement.style.borderColor = '#e53e3e';
                    setTimeout(function() {
                        errorMsg.classList.remove('visible');
                        textElement.style.borderColor = '#e0e0e0';
                    }, 3000);
                    return false;
                }

                recordAnswer(textValue, 0);
                return true;
            }

            function showLoadingScreen() {
                document.getElementById('quiz-loading-screen-' + QUIZ_ID).style.display = 'block';
                updateProgress();

                setTimeout(function() {
                    document.getElementById('quiz-loading-screen-' + QUIZ_ID).style.display = 'none';
                    document.getElementById('quiz-question-final-email-' + QUIZ_ID).classList.add('active');
                }, 3000);
            }

            function validateFinalEmail() {
                const emailInput = document.getElementById('quiz-final-email-input-' + QUIZ_ID);
                const errorMsg = document.getElementById('quiz-final-email-error-' + QUIZ_ID);
                const email = emailInput.value.trim();

                const emailRegex = /^[^\\s@]+@[^\\s@]+\\.[^\\s@]+$/;

                if (!emailRegex.test(email)) {
                    errorMsg.classList.add('visible');
                    emailInput.style.borderColor = '#e53e3e';
                    setTimeout(function() {
                        errorMsg.classList.remove('visible');
                        emailInput.style.borderColor = '#e0e0e0';
                    }, 3000);
                    return false;
                }

                quizUserEmail = email;
                quizUserResponses['final_email'] = { answer: email, score: 0 };

                quizCurrentQuestion = quizTotalQuestions;
                updateProgress();

                showFinalResults();
                return true;
            }

            function showFinalResults() {
                document.getElementById('quiz-question-final-email-' + QUIZ_ID).classList.remove('active');
                document.getElementById('quiz-final-results-' + QUIZ_ID).style.display = 'block';
                document.getElementById('quiz-final-score-' + QUIZ_ID).textContent = quizTotalScore;

                let resultConfig = null;
                for (let i = 0; i < RESULTS_CONFIG.length; i++) {
                    const result = RESULTS_CONFIG[i];
                    if (quizTotalScore >= result.minScore && quizTotalScore <= result.maxScore) {
                        resultConfig = result;
                        break;
                    }
                }

                if (resultConfig) {
                    const resultDiv = document.getElementById('quiz-final-results-' + QUIZ_ID);
                    resultDiv.innerHTML = '<div style="font-size: 22px; margin-bottom: 25px; font-weight: 600; color: #1F2123;">✨ ¡Resultados Enviados! ✨</div>' +
                        '<div class="quiz-score-display">' + quizTotalScore + '/${maxScore} puntos<br><strong>' + resultConfig.level + '</strong></div>' +
                        '<p style="font-size: 18px; line-height: 1.5; font-weight: bold; margin-bottom: 20px; color: #1F2123;">' + resultConfig.message + '</p>' +
                        '<p style="font-size: 16px; color: rgba(255,255,255,0.9); margin-bottom: 30px;">Redirigiendo en <span id="countdown-' + QUIZ_ID + '">3</span> segundos...</p>' +
                        '<div style="margin-top: 30px;"><button class="quiz-btn" onclick="window.quiz_' + QUIZ_ID + '_redirectToResult()" style="width: 100% !important; padding: 18px 25px; font-size: 18px !important; animation: pulse 2s infinite;">VER RESULTADOS COMPLETOS</button></div>';

                    sendToWebhook(resultConfig);

                    let countdown = 3;
                    const countdownElement = document.getElementById('countdown-' + QUIZ_ID);
                    const countdownInterval = setInterval(function() {
                        countdown--;
                        if (countdownElement) {
                            countdownElement.textContent = countdown;
                        }
                        if (countdown <= 0) {
                            clearInterval(countdownInterval);
                            if (resultConfig.redirectUrl) {
                                window.location.href = resultConfig.redirectUrl;
                            }
                        }
                    }, 1000);

                    window['quiz_' + QUIZ_ID + '_redirectToResult'] = function() {
                        if (resultConfig.redirectUrl) {
                            window.location.href = resultConfig.redirectUrl;
                        }
                    };
                }
            }

            function sendToWebhook(resultConfig) {
                if (!WEBHOOK_URL) return;

                const now = new Date();
                const dataToSend = {
                    email: quizUserEmail,
                    timestamp: now.toISOString(),
                    quiz_id: QUIZ_ID,
                    quiz_title: '${title}',
                    total_score: quizTotalScore,
                    max_score: ${maxScore},
                    result_level: resultConfig ? resultConfig.level : '',
                    result_message: resultConfig ? resultConfig.message : '',
                    redirect_url: resultConfig ? resultConfig.redirectUrl : '',
                    question_path: quizQuestionPath,
                    responses: quizUserResponses,
                    utm_source: quizUtmParams.utm_source || '',
                    utm_medium: quizUtmParams.utm_medium || '',
                    utm_campaign: quizUtmParams.utm_campaign || '',
                    utm_content: quizUtmParams.utm_content || '',
                    utm_term: quizUtmParams.utm_term || ''
                };

                if (typeof fetch !== 'undefined') {
                    fetch(WEBHOOK_URL, {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify(dataToSend)
                    }).catch(function(error) {
                        console.error('Error enviando al webhook:', error);
                    });
                } else {
                    var xhr = new XMLHttpRequest();
                    xhr.open("POST", WEBHOOK_URL, true);
                    xhr.setRequestHeader("Content-Type", "application/json");
                    xhr.send(JSON.stringify(dataToSend));
                }
            }

            // Exponer funciones globales
            window['quiz_' + QUIZ_ID + '_recordAnswer'] = recordAnswer;
            window['quiz_' + QUIZ_ID + '_validateSelect'] = validateSelect;
            window['quiz_' + QUIZ_ID + '_validateText'] = validateText;
            window['quiz_' + QUIZ_ID + '_validateFinalEmail'] = validateFinalEmail;

            // Inicialización
            let quizInitialized = false;
            function initQuiz() {
                if (quizInitialized) return;
                const container = document.getElementById('quiz-questions-container-' + QUIZ_ID);
                if (!container) return;

                captureUtmParameters();
                container.innerHTML = '';
                quizInitialized = true;
                generateQuestions();
                updateProgress();
            }

            if (document.readyState === 'loading') {
                document.addEventListener('DOMContentLoaded', initQuiz);
            } else {
                setTimeout(initQuiz, 100);
            }
        })();
    </script>
</div>`;
  },

  /**
   * Calculate max score helper
   */
  calculateMaxScore(questions) {
    let maxScore = 0;
    questions.forEach(q => {
      if (q.options && q.options.length > 0) {
        const scores = q.options.map(opt => opt.score || 0);
        maxScore += Math.max(...scores);
      }
    });
    return maxScore;
  },

  /**
   * Format questions for export
   */
  formatQuestionsForExport(questions) {
    return JSON.stringify(questions, null, 2);
  },

  /**
   * Format results for export
   */
  formatResultsForExport(results) {
    return JSON.stringify(results, null, 2);
  },

  /**
   * Generate embed code for hosting solution
   */
  generateEmbedCode(quiz, hostingUrl) {
    const defaultHosting = hostingUrl || 'https://tudominio.com';
    const embedCode = `<!-- QuizPro Embed Code -->
<div id="quizpro-container"></div>
<script src="${defaultHosting}/quizpro/quizpro-loader.js?quiz=${quiz.id}"></script>`;

    const instructions = `
INSTRUCCIONES DE USO:

1. REEMPLAZA "tudominio.com" con tu dominio real

2. Asegúrate de que el archivo quizpro-loader.js esté subido en:
   ${defaultHosting}/quizpro/quizpro-loader.js

3. Pega este código en WordPress:
   - Editor Gutenberg: Bloque "HTML Personalizado"
   - Editor Clásico: Vista "Texto"
   - Elementor: Widget "HTML"

4. ¡Listo! El quiz se cargará automáticamente

NOTA: Si editas el quiz y guardas, los cambios se reflejarán
automáticamente sin necesidad de cambiar el código en WordPress.
`;

    return {
      embedCode,
      instructions,
      quizId: quiz.id,
      hostingUrl: defaultHosting
    };
  }
};
