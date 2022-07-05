// states: votingInProgress, EndOfTurnCalc
// sectors: industry, policy, netbolag

import Params from './Params.js';

export default class Game {
    constructor() {
        this.state = "votingInProgress";
        
        this.turn = -1; // in update() turn is incremented so first iteration becomes 0
        this.turns = ["2025", "2030", "2035", "2040", "2045"];

        this.industryVotes = [[0,0,0],[0,0,0],[0,0,0],[0,0,0],[0,0,0]];
        this.policyVotes = [[0,0,0],[0,0,0],[0,0,0],[0,0,0],[0,0,0]];
        this.netBolagVotes = [[0,0,0],[0,0,0],[0,0,0],[0,0,0],[0,0,0]];

        this.isVotingOpen = true;

        this.params = new Params();

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

    update() {
        switch (this.state) {
            case "votingInProgress":
                console.log("votingInProgress");
                this.isVotingOpen = true;
                this.turn += 1;
                break
            case "EndOfTurnCalc":
                console.log("EndOfTurnCalc");
                console.log(this.industryVotes[this.turn]);
                this.isVotingOpen = false;
                break
            default:
                break
        }
    }

    getGameData() {
        const data = {}
        data.turn = this.turn;
        data.params = this.params.getData();
        data.state = this.state;
        return data;
    }
}