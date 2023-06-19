async function getSettings(){
  try{
      const url = `https://tauwisbackup.de/EMS/api/getSettings.php`;
      const response = await fetch(url);
      const data = await response.json();
      console.log("SettingsJSON: ", data);
      return data;
  } catch (error) {
        console.error('Fehler beim Abrufen der Einstellungen:', error);
    }
}

async function sendSettings() {
  const unitOfElectricity = document.getElementById("unitOfElectricity").value;
  const currency = document.getElementById("currency").value;
  const defaultStats = document.getElementById("defaultStats").value;
  const homeCity = document.getElementById("homeCity").value;
  const pricePerKwh = document.getElementById("pricePerKwh").value;

  const url = `https://tauwisbackup.de/EMS/api/setSettings.php?unitOfElectricity=${unitOfElectricity}&currency=${currency}&pricePerKwh=${pricePerKwh}&defaultStats=${defaultStats}&homeCity=${homeCity}`;

  try {
    const response = await fetch(url);
    if (response.ok) {
      console.log("Settings successfully saved!");
	  document.getElementById("infoBox").innerHTML = "Einstellungen erfolgreich gespeichert!";
	  document.getElementById("infoBox").style.backgroundColor = "#90EE90 ";
    } else {
      console.log("Error: ", response.status);
	  document.getElementById("infoBox").innerHTML = "Fehler beim Speichern der Einstellungen!";
	  document.getElementById("infoBox").style.backgroundColor = "red";
    }
  } catch (error) {
    console.log("Error: ", error.message);
	document.getElementById("infoBox").innerHTML = "Fehler beim Speichern der Einstellungen!";
	document.getElementById("infoBox").style.backgroundColor = "red";
  }
}