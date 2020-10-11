"use strict";

import { Quiz } from "../models/Quiz.js";
import { QuizView } from "../views/QuizView.js";

export class Controller {
    constructor() {
        this.quiz = new Quiz();
        this.quizView = new QuizView(this.quiz);

        this.quiz.bindNextQuestionButton();
        this.quiz.bindPreviousQuestionButton();
        this.quiz.bindChoiceButtons();
        this.quiz.bindTurnInButton();

        this.quiz._start();
        this.quiz._commit();
        
    }

    // handleNextQuestion = () => {
    //     this.quiz.setNextQuestion();
    // };

    // handlePreviousQuestion = () => {
    //     this.quiz.setPreviousQuestion();
    // };

    // handleChoice = (id) => {
    //     this.quiz.setGivenAnswer(id)
    // };

    // handleSubmit = () => {
    //     this.quizView.showResult();
    // };
}
