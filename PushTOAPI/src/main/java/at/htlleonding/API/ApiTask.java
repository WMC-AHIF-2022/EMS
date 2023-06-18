package at.htlleonding.API;

import java.net.HttpURLConnection;
import java.net.URL;
import java.net.URLEncoder;
import java.nio.charset.StandardCharsets;
import java.util.Arrays;
import java.util.Calendar;
import java.util.Scanner;
import java.util.TimerTask;

import static at.htlleonding.API.Main.generateRandomEnergyValue;

public class ApiTask extends TimerTask {
    @Override
    public void run() {
        try {
            URL url = new URL("http://ems-syp.000webhostapp.com/api/pushToDB.php"); // REST-API einfügen
            Calendar currentTime = Calendar.getInstance();
            EnergyValue energyValue = generateRandomEnergyValue(currentTime);
            HttpURLConnection connection = (HttpURLConnection) url.openConnection();
            connection.setRequestMethod("POST");
            connection.setDoOutput(true);
            connection.setRequestProperty("Content-Type", "application/x-www-form-urlencoded"); // Content-Type einfügen
            String measurement = String.valueOf(energyValue.getValue());
            String type = energyValue.getType().toString().toLowerCase();
            String body = "measurement=" + URLEncoder.encode(measurement, StandardCharsets.UTF_8)
                    + "&type=" + URLEncoder.encode(type, StandardCharsets.UTF_8);

            byte[] postData = body.getBytes(StandardCharsets.UTF_8);
            connection.setRequestProperty("Content-Length", String.valueOf(postData.length));
            connection.getOutputStream().write(postData);
            connection.getInputStream();
            System.out.println("API-Anfrage erfolgreich gesendet!");
            System.out.println(connection.getResponseCode());
            System.out.println(connection.getResponseMessage());
        } catch (Exception e) {
            e.printStackTrace();
            e.getMessage();
        }
    }
}
