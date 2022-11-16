import os
import psutil
import socket
import struct

def get_ip_gateway():
    route = "/proc/net/route"
    ipv4 = ""
    ipv6 = ""
    gateway = ""
    nic = ""
    RTF_GATEWAY = 0x2

    if os.path.exists(route):
        with open(route, "r") as f:

            for line in f.readlines():
                route_line = line.split()

                flags = route_line[3]

                if flags.isdigit():
                    flags = int(flags)

                    if flags & RTF_GATEWAY:
                        nic = route_line[0]

                        gateway = route_line[2]
                        gateway = int(gateway, 16)
                        gateway = socket.inet_ntoa(struct.pack("<I", gateway))

    if nic != "":
        interfaces = psutil.net_if_addrs()

        for name, addrs in interfaces.items():
            if name == nic:
                for addr in addrs:
                    if addr[0] == 2:
                        ipv4 = addr[1]

                    if addr[0] == 10:
                        ipv6 = addr[1]

    return nic, ipv4, ipv6, gateway 



print(get_ip_gateway())