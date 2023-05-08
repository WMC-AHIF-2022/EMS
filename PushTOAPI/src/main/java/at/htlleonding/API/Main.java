package at.htlleonding.API;

import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.util.Calendar;
import java.util.Random;

public class Main {

    private static final double[] realisticValues = {0.1, 0.2, 0.3, 0.4, 0.5, 0.6, 0.7, 0.8, 0.9, 1, 1.1, 1.2, 1.3, 1.4, 1.5};

    public static EnergyValue generateRandomEnergyValue(Calendar currentTime) {

        int currentHour = currentTime.get(Calendar.HOUR_OF_DAY);
        Random random = new Random();
        int randomIndex = random.nextInt(realisticValues.length);

        if (currentHour >= 23 || currentHour < 6) {
            randomIndex = Math.max(randomIndex - 5, 0);
        }

        if (currentHour >= 6 && currentHour < 8) {
            randomIndex = Math.min(randomIndex + 3, realisticValues.length - 1);
        }

        if (currentHour >= 18 && currentHour < 23) {
            randomIndex = Math.min(randomIndex + 2, realisticValues.length - 1);
        }

        if (currentHour >= 23 || currentHour < 6) {
            randomIndex = Math.max(randomIndex - 2, 0);
        }

        boolean isGeneration = random.nextDouble() < 0.5;

        if (currentHour >= 23 && currentHour < 6) {
            isGeneration = true;
            randomIndex = 0;
        }

        return new EnergyValue(realisticValues[randomIndex], isGeneration ? EnergyType.GENERATION : EnergyType.CONSUMPTION);
    }

    public static void main(String[] args) {
        Calendar currentTime = Calendar.getInstance();
        EnergyValue energyValue = generateRandomEnergyValue(currentTime);
        System.out.println("Value: " + energyValue.getValue() + ", Type: " + energyValue.getType());
    }

}

