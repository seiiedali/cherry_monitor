
from datetime import datetime, timedelta

import psutil


def _get_size(bytes, suffix="B"):
    # Scale bytes to its proper format
    factor = 1024
    for unit in ["", "K", "M", "G", "T", "P"]:
        if bytes < factor:
            return f"{bytes:.2f}{unit}{suffix}"
        bytes /= factor


def io_traffic() -> dict:
    # get IO statistics since boot

    boot_time_timestamp = psutil.boot_time()
    boot_time = datetime.fromtimestamp(boot_time_timestamp)
    now_time = datetime.now()
    up_time_seconds = int((now_time - boot_time).total_seconds())
    up_time_duration = str(timedelta(seconds=up_time_seconds))
    net_io = psutil.net_io_counters()
    disk_io = psutil.disk_io_counters()
    traffic: dict = {
        "network_IO": {
            "Bytes Sent": _get_size(net_io.bytes_sent),
            "Bytes Received": _get_size(net_io.bytes_recv),
            "Packet Sent": net_io.packets_sent,
            "Packet Received": net_io.packets_recv,
        },

        # get IO statistics since boot
        "disk_IO": {
            "Bytes read": _get_size(disk_io.read_bytes),
            "Bytes write": _get_size(disk_io.write_bytes),
            "Read Counts": disk_io.read_count,
            "Write Counts": disk_io.write_count,
            "Read Time": str(timedelta(seconds=disk_io.read_time//1000)),
            "Write Time": str(timedelta(seconds=disk_io.write_time//1000)),
        },
        "boot": {
            "Boot Time": f"{boot_time.year}/{boot_time.month}/{boot_time.day} {boot_time.hour}:{boot_time.minute}:{boot_time.second}",
            "Up Time": up_time_duration,
        },
        'cpu_load': {
            '1 minute Average': round(psutil.getloadavg()[0], 2),
            '5 minutes Average': round(psutil.getloadavg()[1], 2),
            '15 minutes Average': round(psutil.getloadavg()[2], 2)
        }
    }

    return traffic
