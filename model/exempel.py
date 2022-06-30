class Params:
    def __init__(self):
        # Oberoende parametrar
        self.CO2pris = 1;
        self.Energy = 100;



    
    def EBIT(self):
        return self.CO2pris * self.Energy;


    def ny(self):
        return self.CO2pris / self.Energy;




    