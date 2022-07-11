// states: votingInProgress, EndOfTurnCalc
// sectors: industry, policy, netbolag

import { irr } from 'node-irr';
import Params from './Params.js';

function indexOfMax(arr) {
    if (arr.length === 0) {
        return -1;
    }

    let max = arr[0];
    let maxIndex = 0;

    for (let i = 1; i < arr.length; i+=1) {
        if (arr[i] > max) {
            maxIndex = i;
            max = arr[i];
        }
    }

    return maxIndex;
}

export default class Game {
    constructor() {
        this.state = "votingInProgress";
        
        this.turn = 0;
        this.turns = ["2025", "2030", "2035", "2040", "2045"];

        this.industryVotes = [[0,0,0],[0,0,0],[0,0,0],[0,0,0],[0,0,0]];
        this.policyVotes = [[0,0,0],[0,0,0],[0,0,0],[0,0,0],[0,0,0]];
        this.netBolagVotes = [[0,0,0],[0,0,0],[0,0,0],[0,0,0],[0,0,0]];

        this.isVotingOpen = true;

        this.params = [new Params(), null, null, null, null];

        this.update();

    }

    voting(sector, decisionIndex) {
        if(!this.isVotingOpen) {
            return;
        }

        switch (sector) {
            case "industri":
                this.industryVotes[this.turn][decisionIndex] += 1;
                break
            case "policy":
                this.policyVotes[this.turn][decisionIndex] += 1;
                break
            case "netbolag":
                this.netBolagVotes[this.turn][decisionIndex] += 1;
                break
            default:
                break
        }
    }

    changeState(newState) {
        this.state = newState;
        this.update();
    }
    
    getState() {
        return this.state;
    }

    resetGame() {
        this.state = "votingInProgress";
        
        this.turn = 0;
        this.turns = ["2025", "2030", "2035", "2040", "2045"];

        this.industryVotes = [[0,0,0],[0,0,0],[0,0,0],[0,0,0],[0,0,0]];
        this.policyVotes = [[0,0,0],[0,0,0],[0,0,0],[0,0,0],[0,0,0]];
        this.netBolagVotes = [[0,0,0],[0,0,0],[0,0,0],[0,0,0],[0,0,0]];

        this.isVotingOpen = true;

        this.params = [new Params(), null, null, null, null];

        this.update();        
    }

    update() {
        switch (this.state) {
            case "votingInProgress":
                if(this.turn === 5) {
                    this.resetGame();
                    return
                }
                console.log("votingInProgress");
                this.isVotingOpen = true;
                break
            case "EndOfTurnCalc":
                console.log("EndOfTurnCalc");
                this.isVotingOpen = false;
                console.log(this.industryVotes[this.turn]);
                // eslint-disable-next-line no-case-declarations
                const decisionIndex = indexOfMax(this.industryVotes[this.turn])
                console.log(decisionIndex);
                // eslint-disable-next-line no-case-declarations
                const turnParamsCopy = Object.assign(Object.create(Object.getPrototypeOf(this.params[this.turn])), this.params[this.turn])
                this.turn += 1;
                this.params[this.turn] = turnParamsCopy;
                this.params[this.turn].makeIndustryChanges(decisionIndex);
                break
            default:
                break
        }
    }

    getGameData() {
        const data = {}
        data.turn = this.turn;
        data.params = this.params;
        data.state = this.state;
        data.irr = this.params[this.turn].getIRR();
        return data;
    }
}