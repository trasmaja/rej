import pandas as pd

# Read and write from/to excel
# df = pd.read_excel (r'excelData.xlsx')
# print (df)
# df.to_excel("excelData.xlsx")
# []

excel_in = pd.read_excel (r'excelData.xlsx')
originalParams = excel_in.iloc[0]

industry = ["reduceWACC", "doNothing"]
policy = ["increaseCO2pris", "doNothing"]

print(originalParams[1])

for industryDecision in industry:
    for policyDecision in policy:
        #print(industryDecision == "reduceWACC" and policyDecision == "increaseCO2pris")
        #print(policyDecision == "increaseCO2pris")
        if industryDecision == "reduceWACC" and policyDecision == "increaseCO2pris":
            copy = originalParams.copy()
            copy["WACC"] = copy["WACC"]*0.8
            copy["CO2-pris"] = copy["CO2-pris"]*1.2
            excel_in.loc[len(excel_in.index)] = copy
        elif  industryDecision == "reduceWACC" and policyDecision == "doNothing":
            copy = originalParams.copy()
            copy["WACC"] = copy["WACC"]*0.8
            excel_in.loc[len(excel_in.index)] = copy
        elif industryDecision == "doNothing" and policyDecision == "increaseCO2pris":
            copy = originalParams.copy()
            copy["CO2-pris"] = copy["CO2-pris"]*1.2
            excel_in.loc[len(excel_in.index)] = copy
        elif industryDecision == "doNothing" and policyDecision == "doNothing":
            copy = originalParams.copy()
            excel_in.loc[len(excel_in.index)] = copy


excel_in.to_excel("test.xlsx")




# TURN 1 4^1
# beslut 1 och beslut A => test = 10
# beslut 1 och beslut B => test = 100
# beslut 2 och beslut A => test = 1000
# beslut 2 och beslut B => test = 10 000

# TURN 2 4^2



# TURN 3 4^3

# antal_beslut = len(sektor_A) * len(sektor_B);


# for choiceA in sektor_A:
#     for choiceB in sektor_B:
#         print(choiceA + choiceB)


