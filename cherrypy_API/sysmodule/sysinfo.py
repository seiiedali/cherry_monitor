
import platform
import subprocess
import json
from datetime import datetime
import psutil


def sysinfo():

    uname = platform.uname()
    boot_time_timestamp = psutil.boot_time()
    bt = datetime.fromtimestamp(boot_time_timestamp)
    hw_json = subprocess.check_output(["lshw", "-json"])
    lshw_output = json.loads(hw_json)
    
    hw_data = {
        'memory': lshw_output['children'][0]['children'][0],
        'cpu': lshw_output['children'][0]['children'][1],
        'network': lshw_output['children'][0]['children'][2]['children'][6],
        
    }
    sysinfo_data = {
        "System": uname.system,
        "Node Name": uname.node,
        "Release": uname.release,
        "Version": uname.version,
        "Architecture": uname.machine,
        "Processor": uname.processor,
        "Boot Time": f"{bt.year}/{bt.month}/{bt.day} {bt.hour}:{bt.minute}:{bt.second}",

    }
    final_result = {'system': sysinfo_data, 'specs': hw_data}
    return final_result