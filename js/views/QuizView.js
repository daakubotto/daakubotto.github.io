export class QuizView {
    constructor(quiz) {
        this.quiz = quiz;
        this.quiz.addEventListener("questionChanged", this.onQuestionsChanged);
        this.quiz.addEventListener("quizStart", this.onStart);
        this.quiz.addEventListener("quizEnded", this.onEnd);
    }

    getElement(selector) {
        return document.querySelector(selector);
    }

    onQuestionsChanged = () => {
        this.showQuestion(this.quiz.getCurrentQuestion());
        this.showNav(this.quiz.getCurrentQuestion(), this.quiz.getTotalQuestions());
    };

    onStart = () => {
        this.createNav(this.quiz.getCurrentQuestion(), this.quiz.getTotalQuestions());
    }

    onEnd = (data) => {
        this.getElement("#eind-cijfer").innerHTML = data.detail.cijfer

        this.getElement("#center").innerHTML = `<h1 style="color: black; text-align: center; font-weight: 700;">${data.detail.cijfer > 5.5 ? `Goed gedaan ${data.detail.naam}!` : `Jammer ${data.detail.naam}...`}</h1><br><h1 style="color: black; text-align: center; font-weight: 700;">Je hebt ${data.detail.juist} van de ${data.detail.juist+data.detail.onjuist} vragen juist beantwoord<br>je eind cijfer (met een 50% = 5,5 norm) is daarom een ${data.detail.cijfer}<h1>`
    }

    showQuestion(currentQuestion) {

        const question = JSON.parse(localStorage.getItem(currentQuestion));

        const testQuestion = this.getElement("#toets-vraag");
        testQuestion.innerHTML = `Vraag ${question.id}: Hoeveel is ${question.question}?`;

        this.getElement("#answer-1").innerHTML = question.answers[0];
        this.getElement("#answer-2").innerHTML = question.answers[1];
        this.getElement("#answer-3").innerHTML = question.answers[2];
        this.getElement("#answer-4").innerHTML = question.answers[3];

        this.getElement('#choice-1').classList.remove("selected-choice")
        this.getElement('#choice-2').classList.remove("selected-choice")
        this.getElement('#choice-3').classList.remove("selected-choice")
        this.getElement('#choice-4').classList.remove("selected-choice")
        if (question.selectedAnswer) {
            this.getElement(`#choice-${question.selectedAnswer}`).classList.add("selected-choice")
        }

    }

    showNav(currentQuestion, totalQuestions) {

        for (let i = 1; i <= totalQuestions; i++) {
            const button = this.getElement(`#vraag-navigatie-${i}`);
            if (currentQuestion === i) {
                button.classList.add("btn-active");
            } else {
                button.classList.remove("btn-active");
            }
        }

    }

    createNav(currentQuestion, totalQuestions) {

        const nav = this.getElement("#vraag-navigatie");

        for (let i = 1; i <= totalQuestions; i++) {

            const navigationButton = document.createElement("button")

            navigationButton.classList.add("btn", "btn-primary", "btn-circle");
            if (currentQuestion === i) navigationButton.classList.add("btn-active");
            navigationButton.id = `vraag-navigatie-${i}`
            navigationButton.innerHTML = i;
            navigationButton.addEventListener("click", () => this.quiz.changeQuestion(i));

            nav.appendChild(navigationButton)

        }

    }
}
