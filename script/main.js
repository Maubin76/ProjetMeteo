cpt = 744;  // Variable globale qui compte les heures depuis le jour -31 (passé) : l'heure 744 pointe vers demain à minuit
Data = "attente"; // Variable globale qui va servir à stocker les données reçues de l'API

const apiURL = "https://api.open-meteo.com/v1/forecast?latitude=48.73&longitude=-3.46&hourly=temperature_2m,precipitation,weathercode,windspeed_10m&past_days=31";

window.addEventListener("DOMContentLoaded",init);   // Déclenchement de la fonction init à la fin du chargement de la page


function init(){
	let boutonSuivant = document.getElementById("btn_next");
	let boutonPrecedent = document.getElementById("btn_prev");
	boutonSuivant.addEventListener("click",jourSuivant);  // Déclenchement de la fonction jourSuivant lorsque le bouton Jour suivant est pressé
	boutonPrecedent.addEventListener("click",jourPrecedent); // Déclenchement de la fonction jourPrecedent lorsque le bouton Jour précédent est pressé
	theTableElement = document.getElementById('theTable');  // renvoie un objet représentant l'élément dont la propriété id correspond à la chaîne de caractères spécifiée
   		fetch(apiURL)  // Requête fetch vers l'API
   			.then( (response)=>{return response.text()})  // Promesse qui stock la réponse
			.then( (data)=> {saveData(data)})  // Promesse qui appelle la fonction
}

function saveData(data){
	Data = data;  // Stocke les données recceuillies dans une variable globale
	completeTable(Data);  // Appelle la fonction qui complète le tableau de données
}

function jourSuivant(){
	cpt+=24;  // Incrémente de 24 la variable globale qui compte les heures
	clearTable();
	completeTable(Data);
}

function jourPrecedent(){
	cpt-=24;
	clearTable();
	completeTable(Data);
} 

function emptyTable(){  // Fonction qui sert à recréer la première ligne de titres du tableau après l'avoir effacé

	const newTableRow = document.createElement('tr');  // Création du tableau dans lequel on affiche les données

	const newTableDivHeure = document.createElement('th'); // Création de la case Heure
	newTableDivHeure.innerText = "Heures";  // Stockage de la variable heure sous format texte
	newTableRow.appendChild(newTableDivHeure);  // Affichage de l'heure sous format texte dans le tableau 

	const newTableDivTemp = document.createElement('th'); // Création de la case Température
	newTableDivTemp.innerText = "Températures";  // Stockage de la variable temp sous format texte
	newTableRow.appendChild(newTableDivTemp);  // Affichage de la température sous format texte dans le tableau

	const newTableDivWind = document.createElement('th');  // Création de la case Vent
	newTableDivWind.innerText = "Vent";  // Stockage de la variable wind sous format texte
	newTableRow.appendChild(newTableDivWind);  // Affichage du vent sous format texte dans le talbleau

	const newTableDivPrec = document.createElement('th');  // Création de la case Précipitation
	newTableDivPrec.innerText = "Précipitations";  // Stockage des précipitations sous format texte
	newTableRow.appendChild(newTableDivPrec);  // Affichage des précipitations sous format texte dans le tableau

	const newTableDivWeather = document.createElement('th');
	newTableDivWeather.innerText = "Météo";  // Stockage de la météo sous format texte
	newTableRow.appendChild(newTableDivWeather);  // Affichage de la météo sous format texte dans le tableau

	theTableElement.appendChild(newTableRow);  // Création d'une nouvelle ligne dans le tableau
}

function clearTable(){
	let element = document.getElementById("theTable");
	while (element.firstChild) {
  		element.removeChild(element.firstChild);
	}
}

function completeTable(data){

	var i;  // incrément de la boucle for qui parcourt toutes les heures d'une journée

	emptyTable();

	for (i=0 ; i<=23 ; i++){  // Parcourt les 24 créneaux horraires de la journée

		var h = cpt + i;

    	const response = JSON.parse(data); 

		const date_heure = response.hourly.time[h];  // Stockage de la date et de l'heure dans la constante
		var date = date_heure.split("T")[0];  // On sépare la constante précédente de sorte à isoler la date
		date = diviseDate(date);  // Traduction de la date numérique en date sour la forme "jour mois année"
		sousTitre = document.getElementById("sousTitre");
		sousTitre.innerText = date;
		var heure = date_heure.split("T")[1];  // On sépare la constante date_heure de sorte à isoler l'heure
		heure = heure.split(":")[0] + "h";  // On affiche l'heure sous le format "heure"h

		const temp = response.hourly.temperature_2m[h] + "°C";  // stockage de la constante température de la plage selectionnée
		const wind = response.hourly.windspeed_10m[h] + "km/h"; // stockage de la constante du vent de la plage selectionnée
		const precip = response.hourly.precipitation[h] + "mm"; // stockage de la constante de précipitation de la plage selectionnée
		const weather = response.hourly.weathercode[h] ; // stockage de la constante de précipitation de la plage selectionnée
		let meteo = conversion(weather);

    	const newTableRow = document.createElement('tr');  // Création du tableau dans lequel on affiche les données

		const newTableDivHeure = document.createElement('td'); // Création de la case Heure
		newTableDivHeure.innerText = heure;  // Stockage de la variable heure sous format texte
		newTableRow.appendChild(newTableDivHeure);  // Affichage de l'heure sous format texte dans le tableau 

		const newTableDivTemp = document.createElement('td'); // Création de la case Température
		newTableDivTemp.innerText = temp;  // Stockage de la variable temp sous format texte
    	newTableRow.appendChild(newTableDivTemp);  // Affichage de la température sous format texte dans le tableau

		const newTableDivWind = document.createElement('td');  // Création de la case Vent
		newTableDivWind.innerText = wind;  // Stockage de la variable wind sous format texte
    	newTableRow.appendChild(newTableDivWind);  // Affichage du vent sous format texte dans le talbleau

		const newTableDivPrec = document.createElement('td');  // Création de la case Précipitation
		newTableDivPrec.innerText = precip;  // Stockage des précipitations sous format texte
    	newTableRow.appendChild(newTableDivPrec);  // Affichage des précipitations sous format texte dans le tableau

		const newTableDivWeather = document.createElement('td');  // Création de la case Précipitation
		newTableDivWeather.innerText = meteo;  // Stockage des précipitations sous format texte
    	newTableRow.appendChild(newTableDivWeather);  // Affichage des précipitations sous format texte dans le tableau

    	theTableElement.appendChild(newTableRow);}  // Création d'une nouvelle ligne dans le tableau

}


function diviseDate(date){   // Fonction qui modifie le format de la date pour un affichage plus lisible
	var year = date.split("-")[0];  // Variable qui stock l'année
	var nbMonth = date.split("-")[1];  // Variable qui stock le numéro du mois
	var day = date.split("-")[2];  // Variable qui sotck le jour
	var month;  // Variable qui va accueillir le nom du mois
	var output;  // Variable qui va accueillir la date entière et qui sera renvoyée
	switch (nbMonth){
		/* Suivant le numéro du mois nbMonth, on attribue une valeur sous forme de chaine de caractère 
		à la variable month */
		case "01" : month = "Janvier";break;
		case "02" : month = "Février";break;
		case "03" : month = "Mars";break;
		case "04" : month = "Avril";break;
		case "05" : month = "Mai";break;
		case "06" : month = "Juin";break;
		case "07" : month = "Juillet";break;
		case "08" : month = "Août";break;
		case "09" : month = "Septembre";break;
		case "10" : month = "Octobre";break;
		case "11" : month = "Novembre";break;
		case "12" : month = "Décembre";break;
	}
	output = day + " " + month + " " + year; // On rassemble les 3 variables pour former la date complète 
	return output;  // Renvoie de la date 
}

function conversion(weather){
	let meteo;
	switch (weather){
		case 0  : meteo = "Temps clair";break;
		case 1  : meteo = "Principalement clair";break;
		case 2  : meteo = "Partiellement couvert";break;
		case 3  : meteo = "Couvert";break;
		case 45 : meteo = "Brouillard";break;
		case 48 : meteo = "Dépôt de brouillard";break;
		case 51 : meteo = "Bruine légère";break;
		case 53 : meteo = "Bruine modérée";break;
		case 55 : meteo = "Bruine dense";break;
		case 61 : meteo = "Pluie légère";break;
		case 63 : meteo = "Pluie modérée";break;
		case 65 : meteo = "Pluie intense";break;
		case 66 : meteo = "Pluie légère et verglaçante";break;
		case 67 : meteo = "Pluie intense et verglaçante";break;
		case 71 : meteo = "Légère chûte de neige";break;
		case 73 : meteo = "Chûte de neige";break;
		case 75 : meteo = "Intense chûte de neige";break;
		case 77 : meteo = "Flocons de neige";break;
		case 80 : meteo = "Légères averses";break;
		case 81 : meteo = "Averses modérées";break;
		case 82 : meteo = "Violentes averses";break;
		case 85 : meteo = "Faibles averses de neige";break;
		case 86 : meteo = "Intenses averses de neige";break;
		case 95 : meteo = "Orage";break;
		case 96 : meteo = "Orage avec légère grêle";break;
		case 99 : meteo = "Orage avec forte grêle";break;
	}
	return meteo;
}