async function getSettings(){
  const url = `https://ems-syp.000webhostapp.com/api/getSettings.php`;
  const response = await fetch(url);
  const data = await response.json();
  console.log("SettingsJSON: ", data);
  return data;
}