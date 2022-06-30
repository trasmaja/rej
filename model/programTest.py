import json


with open("jsonFiles/beslut.json") as json_file:
    jsonDict = json.load(json_file)
    allDec = ""
    data = None

    for i, turnData in enumerate(jsonDict):
        with open("jsonFiles/turn"+str(i)+".json") as j:
                data = json.load(j)
                if(i == 0):
                    data = data[0]
                else:
                    for x in data:
                        if(x["key"]["value"] == allDec):
                            print("match")
                            data = x
                            break
        currentDec = ""
        print("------Omgång " + str(i)+"------")
        print(allDec)
        print(data)
        for industry in turnData:
            print("------"+industry+" val:------")
            for index, dec in enumerate(turnData[industry]):
                #print(dec)
                print(str(index)+": "+dec["Namn"])
            
            choice = input("Val: ")
            currentDec += choice
        allDec += currentDec


    print(allDec)
    with open("jsonFiles/turn6.json") as j:
        data = json.load(j)
        for x in data:
            if(x["key"]["value"] == allDec):
                data = x
                break

    print(data)


#text = input("prompt")  # Python 3