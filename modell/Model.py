import pandas as pd
import json
import itertools


class Model:
    def __init__(self, turn):
        self._paramsDict = dict()
        self._paramsList = list()
        self.initValues()
        self.decisionsData = self.getDecisionsForTurnX(turn)
        self.calculateParamsForAllDecisionCombinations()

    def initValues(self):
        """Initializes the class Dict and List with the params from a excel file
        """
        # Load in excel file
        excel_in = pd.read_excel(r'excelData.xlsx')
        # Select first row in excel file

        originalParams = excel_in.iloc[0]
        convertTable = ["WACC",
                        "CO2-pris",
                        "CO2-utsläpp per MWh",
                        "CO2-skatt per MWh",
                        "Pris ren energi",
                        "Pris CO2-energi",
                        "de facto pris CO2-energi",
                        "Differens ren och smutsig energi",
                        "Energikonsumtion",
                        "Andel CO2-energi",
                        "Start EBIT",
                        "CO2 utsläpp industri"]

        for index, paramValue in enumerate(originalParams):
            paramName = convertTable[index]
            self._paramsDict[paramName] = paramValue
            self._paramsList.append(paramValue)

        # print(self._paramsDict)
        # print(self._paramsList)

    def getDecisionsForTurnX(self, turn):
        with open('beslut.json') as json_file:
            data = json.load(json_file)
            return data[turn]

    def calculateParamsForAllDecisionCombinations(self):
        # Beräkna antalet kombinationer av beslut (Kan ses som totala antalet vägar programmet kan ta i denna turn)
        combinations = 1
        listOfDecisionLists = list()
        for sector in self.decisionsData:
            combinations = combinations * len(self.decisionsData[sector])
            listOfDecisionLists.append(self.decisionsData[sector])

        newParams = list()

        listOfCombinations = list(itertools.product(*listOfDecisionLists))

        for uniqueCombo in listOfCombinations:
            params = self.calculateNewParamsValuesFromDecisionCombinations(
                uniqueCombo)
            newParams.append(params)


        self.saveNewParamsToExcel(newParams)

    def calculateNewParamsValuesFromDecisionCombinations(self, comboOfDecisions):
        copyOfParams = self._paramsList.copy()
        for decision in comboOfDecisions:
            self.doDecisionCalculation(decision, copyOfParams)


        # Innan vi är färdiga och skickar tillbaka de nya värderna
        # Gör om beräkningar på parametrar som beror på andra parametrar
        # så att de uppdateras om en underliggande parameter har ändras i doDecisionCalculation
        return copyOfParams

    def doDecisionCalculation(self, decision, params):
        # nrOfParamsToChange = len(decision["Effekt"]["Parametrar"])
        effect = decision["Effekt"]

        for index, param in enumerate(effect["Parametrar"]):
            if(effect["TypeOfChange"][index] == "addition"):
                params[self.paramNameToIndex(
                    param)] += effect["changeValue"][index]
            elif(effect["TypeOfChange"][index] == "factorMultiplication"):
                params[self.paramNameToIndex(
                    param)] *= effect["changeValue"][index]

    def paramNameToIndex(self, paramName):
        convertTable = {
            "WACC": 0,
            "CO2-pris": 1,
            "CO2-utsläpp per MWh": 2,
            "CO2-skatt per MWh": 3,
            "Pris ren energi": 4,
            "Pris CO2-energi": 5,
            "de facto pris CO2-energi": 6,
            "Differens ren och smutsig energi": 7,
            "Energikonsumtion": 8,
            "Andel CO2-energi": 9,
            "Start EBIT": 10,
            "CO2 utsläpp industri": 11,
        }
        return convertTable[paramName]

    def indexToParamName(self, index):
        convertTable = ["WACC",
                        "CO2-pris",
                        "CO2-utsläpp per MWh",
                        "CO2-skatt per MWh",
                        "Pris ren energi",
                        "Pris CO2-energi",
                        "de facto pris CO2-energi",
                        "Differens ren och smutsig energi",
                        "Energikonsumtion",
                        "Andel CO2-energi",
                        "Start EBIT",
                        "CO2 utsläpp industri"]

        return convertTable[index]

    def saveNewParamsToExcel(self, paramsList):
        print("in save new params")
        print(paramsList)
        tempDataFrame = pd.DataFrame(paramsList)
        tempDataFrame.to_excel("test.xlsx")
        return None


def main():
    m = Model(0)


main()


"""
    def paramNameToIndex(self, paramName):
        convertTable = {
            "WACC": 0,
            "CO2-pris": 1,
            "CO2-utsläpp per MWh": 2,
            "CO2-skatt per MWh": 3,
            "Pris ren energi": 4,
            "Pris CO2-energi": 5,
            "de facto pris CO2-energi": 6,
            "Differens ren och smutsig energi": 7,
            "Energikonsumtion": 8,
            "Andel CO2-energi": 9,
            "Start EBIT": 10,
            "CO2 utsläpp industri": 11,
        }

        return convertTable[paramName]


    def indexToParamName(self, index):
        convertTable = ["WACC",
                        "CO2-pris",
                        "CO2-utsläpp per MWh",
                        "CO2-skatt per MWh",
                        "Pris ren energi",
                        "Pris CO2-energi",
                        "de facto pris CO2-energi",
                        "Differens ren och smutsig energi",
                        "Energikonsumtion",
                        "Andel CO2-energi",
                        "Start EBIT",
                        "CO2 utsläpp industri"]

        return convertTable[index]

"""
