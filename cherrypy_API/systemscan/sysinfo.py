        
import platform
import psutil
from datetime import datetime
import json

def sysinfo():
    uname = platform.uname()
    boot_time_timestamp = psutil.boot_time()
    bt = datetime.fromtimestamp(boot_time_timestamp)

    sysinfo_data = {
        "System": uname.system,
        "Node Name": uname.node,
        "Release": uname.release,
        "Version": uname.version,
        "Machine": uname.machine,
        "Processor": uname.processor,
        "Boot Time": f"{bt.year}/{bt.month}/{bt.day} {bt.hour}:{bt.minute}:{bt.second}",

    }
    return json.dumps(sysinfo_data)
