package at.htlleonding.API;

import java.net.HttpURLConnection;
import java.net.URL;
import java.util.Calendar;
import java.util.TimerTask;

import static at.htlleonding.API.Main.generateRandomEnergyValue;

public class ApiTask extends TimerTask {
    @Override
    public void run() {
        try {
            URL url = new URL("http://ems-syp.000webhostapp.com/api/pushToDB.php"); // Hier die URL der REST-API einfügen
            Calendar currentTime = Calendar.getInstance();
            EnergyValue energyValue = generateRandomEnergyValue(currentTime);
            HttpURLConnection conn = (HttpURLConnection) url.openConnection();
            conn.setRequestMethod("POST"); // Hier die HTTP-Methode einfügen
            conn.setDoOutput(true);
            conn.setRequestProperty("Content-Type", "application/json"); // Hier den Content-Type einfügen
            String body = "value: " + energyValue.getValue() + ", type: " + energyValue.getType() + "time:" + currentTime.getTime(); // Hier den JSON-Body einfügen
            conn.getOutputStream().write(body.getBytes());
            conn.getInputStream();
            System.out.println("API-Anfrage erfolgreich gesendet!");
        } catch (Exception e) {
            e.printStackTrace();
        }
    }
}
