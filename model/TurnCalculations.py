from cmath import e
import itertools
import json

from copy import deepcopy
from operator import index

import pandas as pd
from GameParams import GameParams

class TurnCalculations:
    def __init__(self, pathToTurnJson):
        self.__turnData = self.jsonFileToDict(pathToTurnJson)

    def __str__(self):
        return str(self.__turnData)

    def jsonFileToDict(self, jsonPath):
        """Loads a json file and returns it as a dict"""
        with open(jsonPath) as json_file:
            jsonDict = json.load(json_file)
            return jsonDict

    def engine(self):
        for index, turnData in enumerate(self.__turnData):
            currentStates = self.getCurrentStatesFromJson(index)
            listOfTurnData = list()
            for i,currentState in enumerate(currentStates):
                # print("Turn: " + str(index) + " Current State: " + str(i))
                self.calcDecisionsForTurn(index, turnData, currentState, listOfTurnData)
            
            self.storeTurnParamsInJSON(listOfTurnData, index)

    def calcDecisionsForTurn(self, turnNumber, turnData, currentState, listOfTurnData):
        listContainingListsOfDecisionForSectors = list()

        for sector in turnData:
            listContainingListsOfDecisionForSectors.append(turnData[sector])

        listContainingListsOfIndexesForDecisions = list()
        for sectorDecisions in listContainingListsOfDecisionForSectors:
            tmpList = list()
            for index in range(0, len(sectorDecisions)):
                tmpList.append(str(index))
            listContainingListsOfIndexesForDecisions.append(tmpList)

        keys = list(itertools.product(*listContainingListsOfIndexesForDecisions))
        for index,key in enumerate(keys):
            keys[index] = ''.join(keys[index])
        
        
        allDecisionCombinationsBetweenSectors = list(itertools.product(*listContainingListsOfDecisionForSectors))

        #print(keys)
        currentStateParams = GameParams(currentState)
        listOfAllPossibleNextStateParams = list()
        for index, uniqueDecisionCombination in enumerate(allDecisionCombinationsBetweenSectors):
            #print(index)
            key = keys[index]
            nextStateParams = self.calcNextStateParams(currentStateParams, uniqueDecisionCombination, key)
            listOfAllPossibleNextStateParams.append(nextStateParams)
            # print(nextStateParams)

        for nextStateParams in listOfAllPossibleNextStateParams:
            listOfTurnData.append(nextStateParams.getParams())
       
       
       #self.storeTurnParamsInJSON(listOfAllPossibleNextStateParams, turnNumber)
    
    def calcNextStateParams(self, currentStateParams, uniqueDecisionCombination, key):
        nextStateParams = deepcopy(currentStateParams)
        for decisions in uniqueDecisionCombination:
            self.executeDecisions(nextStateParams, decisions)
       
        nextStateParams.changeAllDependantParams()
        nextStateParams.setKey(key)
        return nextStateParams


    def executeDecisions(self, nextStateParams, decision):
        decisionEffect = decision["Effekt"]
        listOfParamsToChange = decisionEffect["Parametrar"]
        listOfTypeOfChanges = decisionEffect["TypeOfChange"]
        listOfTheChangeValues = decisionEffect["changeValue"]

        for index, param in enumerate(listOfParamsToChange):
            nextStateParams.changeIndependantParam(param, listOfTheChangeValues[index], listOfTypeOfChanges[index])


    def storeTurnParamsInJSON(self, listOfAllPossibleNextStateParams, turnNumber):
        # l = None
        # try:
        #     with open('jsonFiles/turn'+str(turnNumber+1)+'.json') as json_file:
        #         l = json.load(json_file)
        # except:
        #     print("No file yet")
        #     l = list()
        # for nextStateParams in listOfAllPossibleNextStateParams:
        #     l.append(nextStateParams.getParams())

        with open('jsonFiles/turn'+str(turnNumber+1)+'.json', 'w') as fp:
            json.dump(listOfAllPossibleNextStateParams, fp)
        print('Compltete jsonFiles/turn'+str(turnNumber+1)+'.json')


    def getCurrentStatesFromJson(self, turnNumber):
        print('jsonFiles/turn'+str(turnNumber)+'.json')
        with open('jsonFiles/turn'+str(turnNumber)+'.json') as json_file:
            currentStates = json.load(json_file)
        return currentStates




"""
    def storeTurnParamsInJSON(self, listOfAllPossibleNextStateParams, turnNumber):
        l = None
        try:
            with open('jsonFiles/turn'+str(turnNumber+1)+'.json') as json_file:
                l = json.load(json_file)
        except:
            print("No file yet")
            l = list()
        for nextStateParams in listOfAllPossibleNextStateParams:
            l.append(nextStateParams.getParams())

        with open('jsonFiles/turn'+str(turnNumber+1)+'.json', 'w') as fp:
            json.dump(l, fp)
        print('Compltete jsonFiles/turn'+str(turnNumber+1)+'.json')

"""