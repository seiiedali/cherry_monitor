import psutil


def network_interface() -> dict:
    network_interface = {}
    # Get Network Information

    if_addrs = psutil.net_if_addrs()
    for interface_name, interface_addresses in if_addrs.items():
        network_interface[interface_name] = {}
        for address in interface_addresses:
            if str(address.family) == 'AddressFamily.AF_INET':
                network_interface[interface_name]["IPv4"] = {
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
