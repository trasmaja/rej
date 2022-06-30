import json
import pandas as pd

def main():
    for turn in range(0,7):
        with open('jsonFiles/turn'+str(turn)+'.json') as json_file:
            currentStates = json.load(json_file)
            for object in currentStates:
                for x in object:
                    object[x] = object[x]['value']

            tempDataFrame = pd.DataFrame(currentStates)
            tempDataFrame.to_excel("excelFiles/turn"+str(turn)+".xlsx")

main()