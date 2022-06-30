from GameParams import GameParams
from TurnCalculations import TurnCalculations

def main():
    # gP = GameParams("jsonFiles/gameParams.json")
    # print(gP)
    # gP.changeIndependantParam("CO2Price", 1, "+")
    # gP.changeAllDependantParams()
    # print(gP)
    test = TurnCalculations("jsonFiles/beslut.json")
    test.engine()

main()