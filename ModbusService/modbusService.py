from pymodbus.constants import Defaults
from pymodbus.constants import Endian
from pymodbus.client import ModbusTcpClient
from pymodbus.payload import BinaryPayloadDecoder
from datetime import datetime

import logging
import requests
import time
import schedule
#logging.basicConfig()
#log = logging.getLogger()
#log.setLevel(logging.DEBUG)

#count= the number of registers to read
#unit= the slave unit this request is targeting
#address= the starting address to read from

def ems_service():
    client= ModbusTcpClient('192.168.1.63', port=502)
    # Battery state of charge
    SOC_REG = 843
    # Total input power from solar modules
    PV_POWER_REG = 850
    # Current power input from external grid on phase 1
    GRID_L1_POWER_REG = 820
    GRID_L2_POWER_REG = 821
    GRID_L3_POWER_REG = 822
    
    CONSUMPTION_L1_POWER_REG = 817
    CONSUMPTION_L2_POWER_REG = 818
    CONSUMPTION_L3_POWER_REG = 819
    

    UNIT_ID = 100

    #Connect to the serial modbus server
    connection = client.connect()

    result = client.read_holding_registers(SOC_REG,count=2,unit=UNIT_ID)
    decoder = BinaryPayloadDecoder.fromRegisters(result.registers, byteorder=Endian.Big)
    battery_soc = decoder.decode_16bit_uint()
    print("Battery: ", battery_soc, "%")

    result = client.read_holding_registers(PV_POWER_REG,count=2,unit=UNIT_ID)
    decoder = BinaryPayloadDecoder.fromRegisters(result.registers, byteorder=Endian.Big)
    pv_power = decoder.decode_16bit_uint()
    print("Total Solar Power: ", pv_power, "W")

    result = client.read_holding_registers(CONSUMPTION_L1_POWER_REG,count=2,unit=UNIT_ID)
    decoder = BinaryPayloadDecoder.fromRegisters(result.registers, byteorder=Endian.Big)
    grid_power_l1 = decoder.decode_16bit_int()
    result = client.read_holding_registers(GRID_L2_POWER_REG,count=2,unit=UNIT_ID)
    decoder = BinaryPayloadDecoder.fromRegisters(result.registers, byteorder=Endian.Big)
    grid_power_l2 = decoder.decode_16bit_int()
    result = client.read_holding_registers(GRID_L3_POWER_REG,count=2,unit=UNIT_ID)
    decoder = BinaryPayloadDecoder.fromRegisters(result.registers, byteorder=Endian.Big)
    grid_power_l3 = decoder.decode_16bit_int()

    print("Grid Power L1: ", grid_power_l1, "W")
    print("Grid Power L2: ", grid_power_l2, "W")
    print("Grid Power L3: ", grid_power_l3, "W")
    print("Total Grid Power: ", grid_power_l1 + grid_power_l2 + grid_power_l3, "W")
    
    
    #Consumption
    result = client.read_holding_registers(CONSUMPTION_L1_POWER_REG,count=2,unit=UNIT_ID)
    decoder = BinaryPayloadDecoder.fromRegisters(result.registers, byteorder=Endian.Big)
    consumption_power_l1 = decoder.decode_16bit_int()
    
    result = client.read_holding_registers(CONSUMPTION_L2_POWER_REG,count=2,unit=UNIT_ID)
    decoder = BinaryPayloadDecoder.fromRegisters(result.registers, byteorder=Endian.Big)
    consumption_power_l2 = decoder.decode_16bit_int()
    
    result = client.read_holding_registers(CONSUMPTION_L3_POWER_REG,count=2,unit=UNIT_ID)
    decoder = BinaryPayloadDecoder.fromRegisters(result.registers, byteorder=Endian.Big)
    consumption_power_l3 = decoder.decode_16bit_int()
    
    total_consumption = (consumption_power_l1+consumption_power_l2+consumption_power_l3)/1000
    
    print("Consumption L1: ", consumption_power_l1, "W")
    print("Consumption L2: ", consumption_power_l2, "W")
    print("Consumption L3: ", consumption_power_l3, "W")
    print("Total Consumption: ", total_consumption, "kW")

    client.close()

    # Post request
    url = "https://tauwisbackup.de/EMS/api/pushToDB.php"

    # Data to send in the POST request
    data = {
    "measurement": pv_power,
    "type": "generation",
    }

    # Send the POST request
    response = requests.post(url, data=data)

    # Check the response
    if response.status_code == 200:
        print("POST request successful!")
        print("Response:", response.text)
    else:
        print("POST request failed with status code:", response.status_code)
    
    
    data = {
    "measurement": total_consumption,
    "type": "consumption",
    }

    # Send the POST request
    response = requests.post(url, data=data)

    # Check the response
    if response.status_code == 200:
        print("POST request successful!")
        print("Response:", response.text)
    else:
        print("POST request failed with status code:", response.status_code)
    
    now = datetime.now().time()
    now_formatted = now.strftime("%H:%M:%S")
    print("Time: ", now_formatted)


while True:    
    #schedule.every(1).minutes.do(ems_service)
    #schedule.run_pending()
    ems_service()
    time.sleep(15*60)

