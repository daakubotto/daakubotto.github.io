"use strict";

const possibleExpressions = ["/", "x", "+", "-"];

export class Question {
    constructor(questionID) {
        this.id = questionID;

        let numberOne = Math.floor(Math.random() * 99) + 1;
        let numberTwo = Math.floor(Math.random() * 99) + 1;
        const expression = possibleExpressions[Math.floor(Math.random() * possibleExpressions.length)];

        let answer = 0;
        let answers = [];
        let question = "";
        switch (expression) {
            case "/":
                numberTwo = Math.ceil(numberTwo/10);
                numberOne = numberOne - numberOne % numberTwo
                // get question and answer
                question = `${(numberOne - (numberOne % numberTwo))} / ${numberTwo}`;
                answer = numberOne / numberTwo;
                answers.push(answer);

                // insert fake answers
                answers.push(numberOne / numberTwo + 1);
                answers.push(numberOne / numberTwo + Math.floor(Math.random() * 20 - 10));
                answers.push((numberOne - (numberOne % (numberTwo+1))) / (numberTwo + 1))

                break;
            case "x":
                // get question and answer
                numberOne = Math.ceil(numberOne/10);
                numberTwo = Math.ceil(numberTwo/10);
                question = `${numberOne} x ${numberTwo}`;
                answer = numberOne * numberTwo;
                answers.push(answer);

                // insert fake answers
                answers.push((numberOne-1) * numberTwo);
                answers.push(numberOne * (numberTwo+1));
                answers.push(numberOne * numberTwo + Math.floor(Math.random() * 20 - 10))

                break;
            case "+":
                // get question and answer
                question = `${numberOne} + ${numberTwo}`;
                answer = numberOne + numberTwo;
                answers.push(answer);

                // insert fake answers
                answers.push(numberOne + numberTwo + Math.floor(Math.random() * 20 - 10));
                answers.push(numberOne + numberTwo + Math.ceil(numberTwo/10));
                answers.push(Math.floor(numberOne * 0.9) + numberTwo);

                break;
            case "-":
                // get question and answer
                question = `${numberOne} - ${numberTwo}`;
                answer = numberOne - numberTwo;
                answers.push(answer);

                // insert fake answers
                answers.push(numberOne - numberTwo - Math.floor(Math.random() * 20 - 10));
                answers.push(numberOne - numberTwo - Math.ceil(numberTwo/10));
                answers.push(Math.floor(numberOne * 0.9) - numberTwo);

                break;
            default:
                console.log(`Unknown expression type: ${expression}`);
        }

        // prevent the same answer from showing up twice
        for (let i = 1; i < answers.length; i++) {
            if (answers[i] === answer) answers[i]++;
            for (let i2 = 0; i2 < answers.length; i2++) {
                if (answers.indexOf(answers[i]) !== i) answers[i]++;
            }
        }

        // put it into local storage
        localStorage.setItem(this.id, JSON.stringify({
            id: this.id,
            question: question,
            answers: Question._shuffle(answers),
            selectedAnswer: null
        }));
    }

    static _shuffle(a) {
        let j, x, i;
        for (i = a.length - 1; i > 0; i--) {
            j = Math.floor(Math.random() * (i + 1));
            x = a[i];
            a[i] = a[j];
            a[j] = x;
        }
        return a;
    }
}