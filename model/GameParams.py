import json
from numbers import Number

class GameParams:
    def __init__(self, params):
        self.__params = params
        self.changeAllDependantParams()

    def __str__(self):
        return str(self.__params)

    def getParams(self):
        return self.__params
    
    def setKey(self, key):
        if("key" in self.__params):
            self.__params["key"]["value"] = self.__params["key"]["value"] + key
        else:
            self.__params["key"] = {"value": key, "isIndependent": True}
    def jsonFileToDict(self, jsonPath):
        """Loads a json file and returns it as a dict"""
        with open(jsonPath) as json_file:
            jsonDict = json.load(json_file)
            return jsonDict

    def changeIndependantParam(self, paramName, paramValue, operation):
        """Changes a param that is not dependent on other params"""

        # Check if paramName is a valid param
        if(paramName not in self.__params):
            raise Exception("Parameter " + paramName + " not found")

        # Check if paramName is independant
        if(self.__params[paramName]["isIndependent"] == False):
            raise Exception("Parameter " + paramName + "is not independant")

        # Check if paramValue is a integer
        if(not (type(paramValue) is Number or type(paramValue is float))):
            raise Exception("paramValue must be an integer or float")

        # Do operation or throw exception if operation is not valid
        if operation == "+":
            self.__params[paramName]["value"] += paramValue
        elif operation == "*":
            self.__params[paramName]["value"] *= paramValue
        else:
            raise Exception("Operation not supported")
            
    def changeAllDependantParams(self):
        """Changes all dependant params"""
        for param in self.__params:
            if(self.__params[param]["isIndependent"] == False):
                equation = self.__params[param]["equation"].split(" ")
                newValue = None
                for index, term in enumerate(equation):
                    if(newValue == None):
                        if(term == "*"):
                            newValue = self.__params[equation[index-1]]["value"] * self.__params[equation[index+1]]["value"]
                        elif(term == "+"):
                            newValue = self.__params[equation[index-1]]["value"] + self.__params[equation[index+1]]["value"]
                        elif(term == "-"):
                            newValue = self.__params[equation[index-1]]["value"] - self.__params[equation[index+1]]["value"]
                        elif(term == "/"):
                            newValue = self.__params[equation[index-1]]["value"] / self.__params[equation[index+1]]["value"]
                    else:
                        if(term == "*"):
                            newValue *= self.__params[equation[index+1]]["value"]
                        elif(term == "+"):
                            newValue += self.__params[equation[index+1]]["value"]
                        elif(term == "-"):
                            newValue -= self.__params[equation[index+1]]["value"]
                        elif(term == "/"):
                            newValue /= self.__params[equation[index+1]]["value"]
                        
                self.__params[param]["value"] = newValue
        


