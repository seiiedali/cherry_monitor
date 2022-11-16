import cherrypy
import sys
sys.path.append('../')
from systemscan import hwinfo, sysinfo, network

class SystemMonitor(object):
    
    @cherrypy.expose
    @cherrypy.tools.json_in()
    @cherrypy.tools.json_out()
    def index(self):
        sys_data = sysinfo.sysinfo()
        return sys_data

    @cherrypy.expose
    @cherrypy.tools.json_in()
    @cherrypy.tools.json_out()
    def network(self, req_type = 'data'):
        if req_type == 'data':
            net_data = network.network_data()
        elif req_type == 'traffic':
            net_data = network.network_traffic()
        return net_data

    @cherrypy.expose
    @cherrypy.tools.json_in()
    @cherrypy.tools.json_out()
    def hdinfo(self, hardware):
        if hardware == 'cpu':
            hdinfo_data = hwinfo.cpu()
        elif hardware == 'memory':
            hdinfo_data = hwinfo.memory()
        elif hardware == 'disk':
            hdinfo_data = hwinfo.disk()
        return hdinfo_data

if __name__ == "__main__":
    cherrypy.quickstart(SystemMonitor())