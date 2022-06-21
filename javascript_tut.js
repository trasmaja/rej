console.log("hej") // Print("hej") i python
console.log("hej");


// Variabler
// Går ej att ändra
const test = "tst";
test = "hej"; // Funkar ej

// Går att ändra
let heh = "adada";
// let heh = "test"; // funkar ej
heh = "detta funkar";

// Används inte längre
var cool = "cool";
cool = "inte cool";
var cool = 5; // Ja men programmeraren menar nog cool = 5;


// Funktioner
// Innanför måsvingarna tillhör
function namn(variabel1, variabel2) {
    const hej = variabel1 + variabel2;
    return hej;
}       
console.log("hej")

// I en klass skippar man function och skriver direkt namn(...)


// Klass
class Namn {
    constructor() { //__init__

    }
}
// Använder this.variabel
this.test = "test";

// this == self


// JsonObject
const jsonO = {
    "namn": "Adam",
    "Age": 23,
    "Work": {
        "employer": "Rejlers",
        "Salary": 140,
    },
    "isMarried": false,
}
jsonO["namn"] ==> "Adam"
json0["Work"] ==> {"employer": "Rejlers", "Salary": 140}
jsoon0["Work"]["employer"] ==> "Rejlers"
json0.Work.emlpoyer ==> "Rejlers"
