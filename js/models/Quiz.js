"use strict";

import { Question } from "./Question.js"

export class Quiz extends EventTarget {
    /**
     * Make a new quiz model with x amount of questions
     * @param {Number} amount the amount of questions in the quiz
     */
    constructor(amount = 10) {
        super();
        this.length = amount || 10;
        this.generateQuestions(this.length);
    }

    finishQuiz() {
        let naam = this.getElement("#naam").value;
        let klas = this.getElement("#klas").value;

        if (!naam || !klas) {
            alert("Vul alstublieft eerst uw naam en klas in links boven voordat u de toets inlevered");
            return;
        }

        let unAnswered = [];
        let correctAnswers = 0;
        let wrongAnswers = 0;
        for (let i = 1; i <= this.length; i++) {
            const question = JSON.parse(localStorage.getItem(i));
            if (!question.selectedAnswer) {
                unAnswered.push(i);
                continue;
            }

            let correctAnswer = question.question.split(" ");
            let number1 = parseInt(correctAnswer[0]);
            let number2 = parseInt(correctAnswer[2]);
            if (correctAnswer[1] === "+") correctAnswer = number1 + number2;
            else if (correctAnswer[1] === "-") correctAnswer = number1 - number2;
            else if (correctAnswer[1] === "x") correctAnswer = number1 * number2;
            else if (correctAnswer[1] === "/") correctAnswer = number1 / number2;
            
            if (question.answers[question.selectedAnswer-1] === correctAnswer) correctAnswers++;
            else wrongAnswers++;
            
        }
        if (unAnswered.length > 0) {
            alert(`Je hebt de vragen ${unAnswered} nog niet beantwoord, beantwrood deze vragen eerst voordat je de toets inleverd`);
            return;
        } else {
            let grade = Math.floor(((9 * (correctAnswers/this.length) ) + 1) * 10)/10;
            this.dispatchEvent(new CustomEvent("quizEnded", { detail: { juist: correctAnswers, onjuist: wrongAnswers, cijfer: grade, naam: naam } }));
        }
    }
  
    /**
     * Set the question the user is currently on in local storage
     * @param {Number} id The id of the question the user is currently on
     */
    setCurrentQuestion(id){
        localStorage.setItem("currentQuestion", id);
    }

    /**
     * Get the ID of the question the user is currently on from local storage
     */
    getCurrentQuestion() {
        return parseInt(localStorage.getItem("currentQuestion")) || 1;
    }

    getTotalQuestions() {
        return this.length;
    }
  
    /**
     * Generate questions and put them into local cache so reloading doesn't change things 
     * @param {Number} amount the amount of questions that should be in the quiz
     */
    generateQuestions(amount) {
        // TO DO: Added true for debugging
        if (!localStorage.getItem("alreadyStarted") || !localStorage.getItem(amount) || localStorage.getItem(amount+1)) {

            for(let i = 1; i <= amount; i++) {
                new Question(i);
            }

            localStorage.setItem("alreadyStarted", true);
        }
    }

    /**
     * Go back to the previous question
     */
    setPreviousQuestion() {
        if (this.getCurrentQuestion() > 1) this.setCurrentQuestion(this.getCurrentQuestion() - 1);
        this._commit();
    }

    /**
     * Go forward to the next question
     */
    setNextQuestion() {
        if (this.getCurrentQuestion() < this.length) this.setCurrentQuestion(this.getCurrentQuestion() + 1);
        this._commit();
    }

    changeQuestion(q) {
        if (q > this.length) q = this.length;
        if (q < 1) q = 1;
        this.setCurrentQuestion(q);
        this._commit();
    }

    setQuestionAnswer(choice) {
        
        const question = JSON.parse(localStorage.getItem(this.getCurrentQuestion()));

        question.selectedAnswer = choice;

        for (let i = 1; i <= 4; i++) {
            const choiceButton = this.getElement(`#choice-${i}`)
            if (i === choice) choiceButton.classList.add("selected-choice");
            else choiceButton.classList.remove("selected-choice")
        }

        localStorage.setItem(this.getCurrentQuestion(), JSON.stringify(question))

    }

    getElement(selector) {
        return document.querySelector(selector);
    }

    bindNextQuestionButton() {
        this.next = this.getElement("#volgende");
        this.next.addEventListener('click', event => {
            this.setNextQuestion()
        })
    }

    bindPreviousQuestionButton() {
        this.next = this.getElement("#vorige");
        this.next.addEventListener('click', event => {
            this.setPreviousQuestion()
        })
    }

    bindChoiceButtons() {
        for (let i = 1; i <= 4; i++) {
            const choiceButton = this.getElement(`#choice-${i}`)
            choiceButton.addEventListener("click", () => {
                this.setQuestionAnswer(i);
                this.setNextQuestion()
                this.getElement(`#choice-${i}`).blur()
            });
        }
    }

    bindTurnInButton() {
        const turnInButton = this.getElement("#inleveren");
        turnInButton.addEventListener("click", () => {
            this.finishQuiz();
        });
    }

    /**
     * Dispatch a quiz event for the quizview to see and take action to update the screen's displayed question
     */
    _commit() {
        this.dispatchEvent(new Event("questionChanged"));
    }

    _start() {
        this.dispatchEvent(new Event("quizStart"))
    }

}