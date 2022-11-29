
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
    net_io = psutil.net_io_counters()
    disk_io = psutil.disk_io_counters()
    traffic: dict = {
        "network_IO": {
            "Total Sent": _get_size(net_io.bytes_sent),
            "Total Received": _get_size(net_io.bytes_recv),
        },

        # get IO statistics since boot
        "disk_IO": {
            "Total read": _get_size(disk_io.read_bytes),
            "Total write": _get_size(disk_io.write_bytes),
        }
    }

    return traffic
