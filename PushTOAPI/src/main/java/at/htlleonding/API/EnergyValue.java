package at.htlleonding.API;

class EnergyValue {
    private double value;
    private EnergyType type;

    public EnergyValue(double value, EnergyType type) {
        this.value = value;
        this.type = type;
    }

    public double getValue() {
        return value;
    }

    public EnergyType getType() {
        return type;
    }
}
