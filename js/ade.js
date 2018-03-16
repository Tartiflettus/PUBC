var Papa = require('./papaparse.min');
var fs = require('fs');
var csv = fs.readFileSync(__dirname + '/ADE-extract.csv', 'utf8');
var parsed = Papa.parse(csv);
var groupe = "G1";

var date = "14/03/18";
var formation = "TELECOM 1A";


function getSysDate() {
    d = new Date();
    jj = d.getDate();
    mm = d.getMonth() + 1;
    yy = d.getFullYear().toString().substr(-2);
    return jj + "/" + mm + "/" + yy;
}

function getSysHeure() {
    d = new Date();
    return d.getHours() + ":" + d.getMinutes();
}



function sortDuree(a, b) {
    if (a[3] === b[3]) {
        return 0;
    } else {
        return (a[3] < b[3]) ? -1 : 1;
    }
}

function edtJour(formation, date) { // 
    parsed.data.sort(sortDuree);
    parsed.data.forEach(function (element) {
        if (element[1] == date && element[0] == formation) {
            console.log(element[3] + " " + element[4] + " " + element[5]);

        }
    });
}

function edtSemaine() {

}

function examen(formation) { // prochains examens de la formation
    parsed.data.sort(sortDuree);
    parsed.data.forEach(function (element) {
        if (element[1] >= getSysDate() && element[0] == formation && element[4].indexOf("Examen") != -1) {
            console.log(element[3] + " " + element[4] + " " + element[5]);

        }
    });
}


function getGroupe(groupe) { // emploi du temps du groupe
    parsed.data.sort(sortDuree);
    var reg = new RegExp(groupe+"|(^(?!G\d).$)");
    parsed.data.forEach(function (element) {
        if (element[1] >= getSysDate() && element[0] == formation && element[4].match(reg)) {
            console.log(element[3] + " " + element[4] + " " + element[5]);

        }
    });
}

function prochainCours() { // prochaine matière
    dateMin = "35/35/35";
    heureMin = "25:65";
    cours = null;
    
    parsed.data.forEach(function (element) {
        if(element[0]==formation && element[4].indexOf(groupe)!=-1 && element[1]>=getSysDate() && element[1]<=dateMin){
            dateMin = element[1];
            if(element[3]<heureMin){
                heureMin=element[3];
                cours=element[4];
            }
        }
    });
    if(cours==null){
        console.log("Pas de cours prévu...");
    }else{
        console.log(cours + " " + heureMin + " " + dateMin);
    }
}

function getProf(date, heure) {
	 parsed.data.forEach(function (element) {
        if (element[1] == date && element[0] == formation && element[3] == heure) {
			if (element[6] == "SIMON Gilles"){
				console.log("Gillou");
			} else {
				console.log(element[6]+"");
			}
        }
		
    });
}

function coursADate(date, heure){ // matière à telle date et telle heure
    cours=null;
    parsed.data.forEach(function (element) {
        if(element[0]==formation && element[4].indexOf(groupe)!=-1 && element[1]==date && element[3]==heure){
            console.log(element[4]);
        }
    });
    if(cours==null){
        console.log("Pas cours à ces dates!");
    }
}

function matiereActu() { // matière actuelle sinon rien 
    cours = null;
    parsed.data.forEach(function (element) {
        if(element[0]==formation && element[4].indexOf(groupe)!=-1 && element[1]==getSysDate() && element[3]==getSysHeure()){
           console.log(element[4]);
           cours = element[4];
        }
    });
    if(cours==null){
        console.log("Pas cours actuellement!");
    }
}

//edtJour(formation, date);
//console.log(getSysHeure());
//getGroupe(groupe);
prochainCours();
//coursADate("19/03/2018", "08:00");
//matiereActu();

//getProf("19/03/2018",  "10:15");
