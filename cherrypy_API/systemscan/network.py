import psutil

def _get_size(bytes, suffix="B"):
    # Scale bytes to its proper format
    factor = 1024
    for unit in ["", "K", "M", "G", "T", "P"]:
        if bytes < factor:
            return f"{bytes:.2f}{unit}{suffix}"
        bytes /= factor


def network_interface():
    network_interface = {}
    # Get Network Information

    if_addrs = psutil.net_if_addrs()
    for interface_name, interface_addresses in if_addrs.items():
        network_interface[interface_name] = {}
        for address in interface_addresses:
            if str(address.family) == 'AddressFamily.AF_INET':
                network_interface[interface_name]['IPv4'] = {
                    "IPv4 Address": address.address,
                    "IPv4 Netmask": address.netmask,
                    "IPv4 Broadcast": address.broadcast,
                }
            elif str(address.family) == 'AddressFamily.AF_PACKET':
                network_interface[interface_name]["Physical"] = {
                    "MAC Address": address.address,
                    "Broadcast MAC": address.broadcast,
                }
            elif str(address.family) == 'AddressFamily.AF_INET6':
                network_interface[interface_name]["IPv6"] = {
                    "IPv6 Address": address.address,
                    "IPv6 Netmask": address.netmask,
                    "IPv6 Broadcast": address.broadcast,
                }

    return network_interface


def network_traffic():
    # get IO statistics since boot
    net_io = psutil.net_io_counters()
    network_IO = {
        "Total Sent": _get_size(net_io.bytes_sent),
        "Total Received": _get_size(net_io.bytes_recv),
    }

    return network_IO
