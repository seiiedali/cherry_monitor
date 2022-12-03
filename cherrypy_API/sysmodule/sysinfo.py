
import platform
import subprocess
import json

def sysinfo() -> dict:

    uname = platform.uname()
    hw_json = subprocess.check_output(["lshw", "-json"])
    lshw_output = json.loads(hw_json)

    final_result = {
        "System": {
            "System": uname.system,
            "Node Name": uname.node,
            "Release": uname.release,
            "Version": uname.version,
            "Architecture": uname.machine,
            "Processor": uname.processor,
        },
        "CPU": {

            "Class": lshw_output['children'][0]['children'][1]['class'],
            "Model": lshw_output['children'][0]['children'][1]['product'],
            "Vendor": lshw_output['children'][0]['children'][1]['vendor'],
            "Phisical ID": lshw_output['children'][0]['children'][1]['physid'],
            "Version": lshw_output['children'][0]['children'][1]['version'],
            "Unit": lshw_output['children'][0]['children'][1]['units'],
            "Size": lshw_output['children'][0]['children'][1]['size'],
            "Capacity": lshw_output['children'][0]['children'][1]['capacity'],
            "Width": lshw_output['children'][0]['children'][1]['width'],
        },
        "Memory": lshw_output['children'][0]['children'][0],
        "Network": {
            "Handle": lshw_output['children'][0]['children'][2]['children'][6]['children'][0]["handle"],
            "Description": lshw_output['children'][0]['children'][2]['children'][6]['children'][0]["description"],
            "Product": lshw_output['children'][0]['children'][2]['children'][6]['children'][0]["product"],
            "Vendor": lshw_output['children'][0]['children'][2]['children'][6]['children'][0]["vendor"],
            "Bus Info": lshw_output['children'][0]['children'][2]['children'][6]['children'][0]["businfo"],
            "Logical Name": lshw_output['children'][0]['children'][2]['children'][6]['children'][0]["logicalname"],
            "Serial": lshw_output['children'][0]['children'][2]['children'][6]['children'][0]["serial"],
            "Units": lshw_output['children'][0]['children'][2]['children'][6]['children'][0]["units"],
            "Size": lshw_output['children'][0]['children'][2]['children'][6]['children'][0]["size"],
            "Capacity": lshw_output['children'][0]['children'][2]['children'][6]['children'][0]["capacity"],
            "Width": lshw_output['children'][0]['children'][2]['children'][6]['children'][0]["width"],
            "Clock": lshw_output['children'][0]['children'][2]['children'][6]['children'][0]["clock"]
        },
    }
    return final_result

