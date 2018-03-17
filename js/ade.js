var Papa = require('./papaparse.min');
var fs = require('fs');
var csv = fs.readFileSync(__dirname + '/ADE-extract.csv', 'utf8');
var parsed = Papa.parse(csv);


module.exports = {

    convertMonth : function(month){
        return month < 10 ? '0' + month : month;
    },

    getSysDate : function() {
        d = new Date();
        jj = d.getDate();
        mm = this.convertMonth(d.getMonth() + 1);
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

    sortDate : function(a, b) {
        const da = new Date(a[1]);
        const db = new Date(b[1]);
        if (da === db) {
            return 0;
        } else {
            return (da < db) ? -1 : 1;
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
    
    
    edtGroupe : function(formation, groupe, date) { // emploi du temps du groupe
	 var arr = new Array;
	var reg1 = new RegExp(groupe);
	var reg2 = new RegExp("G[0-9]");
        parsed.data.sort(this.sortDuree);
        parsed.data.forEach(function (element) {
            if (element[1] == date && element[0] == formation) {
				if(element[4].match(reg1) || !element[4].match(reg2)) {
                console.log(element[3] + " " + element[4] + " " + element[5]);
                arr.push({
                    "intitule" : element[4],
                    "hdebut" : element[3],
                    "lieu" : element[5]
                });
				}
            }
        });
        return arr;
    },
    
    prochainExamen : function(formation) { // prochaine matière
		var res;
        parsed.data.sort(this.sortDuree);
        parsed.data.some(function (element) {
            if(element[0]==formation && element[1]>= module.exports.getSysDate() && element[4].indexOf("Examen") != -1 ){
				//console.log(element[3] + " " + element[4] + " " + element[5]);
					res = {
                    "intitule" : element[4],
					"date" : element[1],
                    "hdebut" : element[3],
                    "lieu" : element[5]
					};
						return true;
                }
        });
		return res;
    },
    
    prochainProf : function(formation, prof) {
        var arr = new Array;
        parsed.data.sort(this.sortDate);
        parsed.data.some(function (element) {
            if(element[0]==formation && element[1]>= module.exports.getSysDate() && element[6].indexOf(prof) != -1 ){
				//console.log(element[3] + " " + element[4] + " " + element[5]);
					arr.push({
                    "intitule" : element[4],
                    "hdebut" : element[3],
                    "lieu" : element[5]
                });
						return true;
                }
        });
		return arr;
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



var cours = "TD G1 Genie logiciel";
var formation = "Master Informatique";
//var tab = module.exports.edtGroupe(formation, "G1", "20/03/2018");
var tab = module.exports.prochainExamen(formation);
console.log(tab);
//edtJour(formation, date);
//console.log(module.exports.getSysHeure());
//getGroupe(groupe);
//prochainCours();
//coursADate("19/03/2018", "08:00");
//matiereActu();
//coursImportant("23/03/2018", "08:00");

//changerFormation("M1 Info");
//getProf("19/03/2018",  "10:15");

