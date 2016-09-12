"use strict";

var jourDeLaSemaineFr=["lundi","mardi","mercredi","jeudi","vendredi"];

$(document).ready(function () {
    $("#btn").click(function () {
        var d = new Date();
        console.log(d.getHours() + "h" + d.getMinutes());
        $.ajax({
            type: "GET",
            url: "bdd.xml",
            dataType: "xml",
            success: function (xml) {

                if ($(xml).find("semaine:last-of-type>[nom=" + jourDeLaSemaineFr[d.getDate() - 1] + "]").attr("total") != "00") {
                    //total de la semaine
                    if ($(xml).find("semaine:last-of-type").attr("total") == "00") {
                        $(xml).find("semaine:last-of-type>jour").each(function (index) {
                            $(this).parent().attr("total", (parseFloat($(this).parent().attr("total")) + parseFloat($(this).attr("total"))));
                        });
                    }

                    $(xml).find("bdd").append("<semaine date=\"" + d.getDate() + "/" + (d.getMonth() + 1) + "\" total=\"00\"></semaine>");
                }

                if ($(xml).find("semaine:last-of-type>jour:last-of-type").attr("date") == d.getDate() + "/" + (d.getMonth() + 1)) {//Si le dernier jour est aujourd'hui
                    var ajd = $(xml).find("semaine:last-of-type>jour:last-of-type");
                    if (ajd.find("debut").html() == "") {
                        alert("Bon matin !");
                        ajd.find("debut").html(d.getHours() + "h" + d.getMinutes());
                    } else if (ajd.find("midi>debut").html() == "") {
                        alert("Pause midi : bon appétit !");
                        ajd.find("midi>debut").html(d.getHours() + "h" + d.getMinutes());
                    } else if (ajd.find("midi>fin").html() == "") {
                        alert("Pause repas terminée !");
                        ajd.find("midi>fin").html(d.getHours() + "h" + d.getMinutes());
                    } else if (ajd.find("fin").html() == "") {
                        alert("Fin de journée !");
                        ajd.find("fin").html(d.getHours() + "h" + d.getMinutes());
                        //total de la journée
                        ajd.attr("total", ((parseInt(ajd.find("fin").html().split("h")[0]) + (parseFloat(ajd.find("fin").html().split("h")[1]) / 0.6)) -
                                              parseInt(ajd.find("debut").html().split("h")[0]) + (parseFloat(ajd.find("debut").html().split("h")[1]) / 0.6)) -
                                              ((parseInt(ajd.find("midi>fin").html().split("h")[0]) + (parseFloat(ajd.find("midi>fin").html().split("h")[1]) / 0.6) -
                                              parseInt(ajd.find("midi>debut").html().split("h")[0]) + (parseFloat(ajd.find("midi>debut").html().split("h")[1]) / 0.6)))
                                             );
                    } else {
                        alert("Journée déjà terminée !");
                    }

                } else {//Si le dernier jour n'est pas aujourd'hui, créer un jour
                    console.log("Dernier jour : " + $(xml).find("semaine:last-of-type>jour:last-of-type").attr("date"));
                    console.log("Ajd : " + d.getDate() + "/" + (d.getMonth() + 1));

                    if (d.getDay() != 0 && d.getDay() != 6) {
                        $(xml).find("semaine:last-of-type").append("<jour date=\"" + d.getDate() + "/" + (d.getMonth() + 1) + "\" nom=\"" + jourDeLaSemaineFr[d.getDate() - 1] + "\" total=\"00\">" +
                            "<debut>" + d.getHours() + "h" + d.getMinutes() + "</debut>" +
                            "<midi>" +
                                "<debut></debut>" +
                                "<fin></fin>" +
                            "</midi>" +
                            "<fin></fin>" +
                        "</jour>");

                    } else {
                        alert("On ne travaille pas le week-end !");
                    }

                }

                console.log(xml);
                $.ajax({
                    type: "GET",
                    url: "changexml.php",
                    contentType: 'application/html',
                    data: { data: data },
                    success: function (data) {
                        alert(data);
                    }
                });
            }
        });
        maj();
    });

    maj();


});


function maj(){
    $.ajax({
            type: "GET",
            url: "bdd.xml",
            dataType: "xml",
            success: function(xml) {
                $(xml).find("semaine").each(function(){
                    var anneeTrDebut="<tr><th>"+$(this).attr("date")+"</th>";
                    var anneeTrFin="<th>"+$(this).attr("total")+"h</th></tr>";
                    var anneeJourLength=$(this).find("jour").length;
                    $(this).find("jour").each(function(index){
                        anneeTrDebut+="<th>"+$(this).attr("total")+"h</th>";
                        if(index==anneeJourLength-1){
                            if(index<4){
                                anneeTrDebut+="<th colspan=\""+(5-index-1)+"\" />";
                            }
                            $("#annee>tbody").append(anneeTrDebut+anneeTrFin);
                        }
                    });
                });
                
                $(xml).find("semaine:last-of-type").find("jour").each(function(){
                    //console.log($(this).attr("date"));
                    var semaineTrDebut="<tr><th>"+$(this).attr("nom")+" "+$(this).attr("date")+"</th>";
                    var semaineTrFin="<th>"+$(this).attr("total")+"h</th></tr>";
                    var semaineHeureLength=$(this).find("debut,midi>debut,midi>fin,fin").length;
                    $(this).find("debut,fin").each(function(index){
                        semaineTrDebut+="<th>"+$(this).text()+"</th>";
                        if(index==semaineHeureLength-1){
                            if(index<3){
                                semaineTrDebut+="<th colspan=\""+(4-index-1)+"\" />";
                            }
                            $("#semaine>tbody").append(semaineTrDebut+semaineTrFin);
                        }
                    });
                });
            }
        });
}