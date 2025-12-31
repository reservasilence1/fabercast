document.addEventListener("DOMContentLoaded", () => {
    const startQuizButton = document.getElementById("start-quiz");
    const nextButtons = document.querySelectorAll(".next-btn");
    const quizScreens = document.querySelectorAll(".quiz-screen");
    const backButton = document.querySelectorAll('.back-btn');
    const selecioneResposta = document.querySelector('.selecione-resposta');
    const container = document.querySelector('.container');
    const dicas = document.querySelectorAll('.dica > div');
    let currentQuestionIndex = 0;

    // Função para mostrar uma tela específica
    function showScreen(index) {
        quizScreens.forEach((screen, i) => {
            screen.classList.toggle("hidden", i !== index);
        });
    }

    // Evento para iniciar o quiz
    startQuizButton.addEventListener("click", () => {
        currentQuestionIndex = 1; // Ir para a primeira pergunta (índice 1)
        showScreen(currentQuestionIndex);
    });

    // Função para habilitar/desabilitar o botão "Próxima Pergunta"
    function updateNextButtonState(button) {
        const options = button.closest(".quiz-screen").querySelectorAll(".option");
        const optionSelected = Array.from(options).some(option => option.classList.contains("selected"));
        button.disabled = !optionSelected;
    }

    const options = document.querySelectorAll(".option");
    options.forEach(option => {
        option.addEventListener("click", () => {
            // Remover a classe 'selected' de todas as opções da tela atual
            const allOptions = option.closest(".quiz-screen").querySelectorAll(".option");
            allOptions.forEach(opt => {
                opt.classList.remove("selected", "correct-selected", "incorrect-selected");
                opt.style.backgroundColor = ""; // Limpa o fundo
            });

            // Adicionar a classe 'selected' e a classe específica de correta/incorreta
            option.classList.add("selected");
            if (option.classList.contains("correct")) {
                option.style.backgroundColor = "rgba(0, 255, 0, 0.4)"; // Verde com opacidade
            } else {
                option.style.backgroundColor = "rgba(255, 0, 0, 0.4)"; // Vermelho com opacidade
            }

            // Habilitar o botão "Próxima Pergunta" da tela atual
            const nextButton = option.closest(".quiz-screen").querySelector(".next-btn");
            updateNextButtonState(nextButton);
        });
    });

    // Eventos para os botões "Próxima Pergunta"
    nextButtons.forEach((button) => {
        button.addEventListener('click', function() {
            const options = button.closest(".quiz-screen").querySelectorAll(".option");
            const selectedOption = Array.from(options).find(option => option.classList.contains("selected"));
            const optionSelected = selectedOption !== undefined;

            if (!optionSelected) {
                // Exibe o pop-up se nenhuma opção foi selecionada
                selecioneResposta.classList.remove('hidden');
                container.classList.add('opacity');
            } else if (selectedOption.classList.contains("incorrect")) {
                // Exibe o pop-up de dica se a resposta estiver incorreta
                showHint(currentQuestionIndex);
            } else {
                // Avançar para a próxima pergunta se uma opção correta foi selecionada
                currentQuestionIndex++;
                if (currentQuestionIndex < quizScreens.length) {
                    showScreen(currentQuestionIndex);
                } else {
                    showScreen(quizScreens.length); // Mostrar tela de conclusão ou resultados
                }
            }
        });
    });


    // Evento para o botão "Voltar" no pop-up de aviso
    backButton.forEach(button => {
        button.addEventListener('click', function() {
            selecioneResposta.classList.add('hidden');
            container.classList.remove('opacity');
            dicas.forEach(dica => dica.classList.add("hidden"));
        });
    });

    // Função para exibir a dica específica
    function showHint(questionIndex) {
        // Esconde todas as dicas
        dicas.forEach(dica => dica.classList.add("hidden"));

        // Exibe o pop-up da dica correspondente
        const hintToShow = document.querySelector(`.dica-${questionIndex}`);
        if (hintToShow) {
            hintToShow.classList.remove("hidden");
        }

        // Exibe o fundo opaco
        container.classList.add('opacity');
    }

    // Inicializa o quiz mostrando apenas a tela inicial
    showScreen(0);
});
