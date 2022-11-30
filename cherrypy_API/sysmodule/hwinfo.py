
import psutil
import re


def __get_size(bytes, suffix="B"):
    # Scale bytes to its proper format
    factor = 1024
    for unit in ["", "K", "M", "G", "T", "P"]:
        if bytes < factor:
            return f"{bytes:.2f}{unit}{suffix}"
        bytes /= factor


def cpu():
    cpu_per = {}

    cpufreq = psutil.cpu_freq()
    for i, percentage in enumerate(psutil.cpu_percent(percpu=True, interval=1)):
        cpu_per[f"Core {i+1}"] = f"{percentage}%"

    cpu_data = {
        "Physical cores": psutil.cpu_count(logical=False),
        "Total cores": psutil.cpu_count(logical=True),
        "Max Frequency": f"{cpufreq.max:.2f}Mhz",
        "Min Frequency": f"{cpufreq.min:.2f}Mhz",
        "Current Frequency": f"{cpufreq.current:.2f}Mhz",
        "Total CPU Usage": f"{psutil.cpu_percent()}%",
        "Cores usage": cpu_per
    }

    return cpu_data


def memory():
    memory = {}

    svmem = psutil.virtual_memory()
    virtual_mem = {
        "Total": __get_size(svmem.total),
        "Available": __get_size(svmem.available),
        "Used": __get_size(svmem.used),
        "Percentage": svmem.percent
    }

    # get the swap memory details (if exists)
    swap = psutil.swap_memory()
    swap_mem = {
        "Total": __get_size(swap.total),
        "Free": __get_size(swap.free),
        "Used": __get_size(swap.used),
        "Percentage": swap.percent,

    }

    memory = {
        "Virtual Memory": virtual_mem,
        "Swap Memory": swap_mem
    }
    return memory


def disk():
    disk_data = {}

    # get all disk partitions
    partitions = psutil.disk_partitions()
    for partition in partitions:
        try:
            partition_usage = psutil.disk_usage(partition.mountpoint)
        except PermissionError:
            # this can be catched due to the disk that
            # isn't ready
            continue
        is_loop: bool = re.match(r".*loop.*", partition.device)
        if not is_loop:
            disk_data[partition.device] = {
                "Mountpoint": partition.mountpoint,
                "File system type": partition.fstype,
                "Total Size": __get_size(partition_usage.total),
                "Used": __get_size(partition_usage.used),
                "Free": __get_size(partition_usage.free),
                "Percentage": partition_usage.percent,
            }

    return disk_data
