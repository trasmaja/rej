import numpy as np
import pandas as pd

df = pd.read_excel('sample.xlsx')

print(df)


sektor_A = ["Beslut 1", "Beslut 2"]
sektor_B = ["Beslut A", "Beslut B", "Beslut C", "Beslut D"]
turns = ["one", "two", "three"]

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


