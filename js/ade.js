var Papa = require('./papaparse.min');
var fs = require('fs');
var csv = fs.readFileSync(__dirname + '/ADE-extract.csv', 'utf8');
var parsed = Papa.parse(csv);
var groupe = "G1";

var date = "14/03/18";
var formation = "Master Informatique";





module.exports = {

    convertMonth : function(month){
        return month < 10 ? '0' + month : month;
    },

    getSysDate : function() {
        d = new Date();
        jj = d.getDate();
        mm = d.getMonth() + 1;
        yy = d.getFullYear();//.toString().substr(-2);
        return jj + "/" + mm + "/" + yy;
    },
    
    getSysHeure : function() {
        d = new Date();
        return d.getHours() + ":" + d.getMinutes();
    },
    
    
    
    sortDuree : function(a, b) {
        if (a[3] === b[3]) {
            return 0;
        } else {
            return (a[3] < b[3]) ? -1 : 1;
        }
    },
    
    edtJour : function(formation, date) { // 
        var arr = new Array;
        parsed.data.sort(this.sortDuree);
        parsed.data.forEach(function (element) {
            if (element[1] == date && element[0] == formation) {
                console.log(element[3] + " " + element[4] + " " + element[5]);
                arr.push({
                    "intitule" : element[4],
                    "hdebut" : element[3],
                    "lieu" : element[5]
                });
            }
        });
        return arr;
    },
    
    edtSemaine : function(date) { //TODO
        parsed.data.sort(sortDuree);
        parsed.data.forEach(function (element) {
            if (element[1] == date && element[0] == formation) {
                
            }
        });
    },
    
    
    changerFormation : function(form){
        formation = form;
        console.log("La formation selectionnée est " + formation);
    },
    
    examen : function(formation) { // prochains examens de la formation
        parsed.data.sort(sortDuree);
        parsed.data.forEach(function (element) {
            if (element[1] >= getSysDate() && element[0] == formation && element[4].indexOf("Examen") != -1) {
                console.log(element[3] + " " + element[4] + " " + element[5]);
    
            }
        });
    },
    
    
    getGroupe : function(groupe) { // emploi du temps du groupe
        parsed.data.sort(sortDuree);
        var reg = new RegExp(groupe+"|(^(?!G\d).$)");
        parsed.data.forEach(function (element) {
            if (element[1] >= getSysDate() && element[0] == formation && element[4].match(reg)) {
                console.log(element[3] + " " + element[4] + " " + element[5]);
    
            }
        });
    },
    
    prochainCours : function() { // prochaine matière
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
    },
    
    getProf : function(date, heure) {
        var arr = new Array;
         parsed.data.forEach(function (element) {
            if (element[1] == date && element[0] == formation && element[3] == heure) {
                if (element[6] == "SIMON Gilles"){
                    console.log("Gillou");
                    arr.push("Gillou");
                } else {
                    console.log(element[6]+"");
                    arr.push(element[6]);
                }
            }
            
        });
    },
    
    coursADate : function(date, heure){ // matière à telle date et telle heure
        cours=null;
        var arr = new Array;
        parsed.data.forEach(function (element) {
            if(element[0]==formation && element[4].indexOf(groupe)!=-1 && element[1]==date && element[3]==heure){
                console.log(element[4]);
                arr.push({
                    "intitule" : element[4],
                    "lieu" : element[5]
                });
            }
        });
        if(cours==null){
            console.log("Pas cours à ces dates!");
        }
    },
    
    matiereActu : function() { // matière actuelle sinon rien 
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
    },
    
    
    coursImportant : function(date, heure){ 
        parsed.data.forEach(function (element) {
            if(element[1] == date && element[3] == heure && element[0]  == formation){
                if( (formation == "Master Informatique" && element[6] == "DROUET Jean-Michel") || 
                (formation == " TELECOM 1A" && element[6] == "VRIGNAUD Katharina")){
                    console.log("Le cours du " + date + " à " + heure + " n'est pas important, tu n'es pas obligé d'y aller");
                } else {
                    console.log("Le cours du " + date + " à " + heure + "est important, va en cours");
                }
            }
            
        });
        
    }
};






//edtJour(formation, date);
//console.log(getSysHeure());
//getGroupe(groupe);
//prochainCours();
//coursADate("19/03/2018", "08:00");
//matiereActu();
//coursImportant("23/03/2018", "08:00");

//changerFormation("M1 Info");
//getProf("19/03/2018",  "10:15");
