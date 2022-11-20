import cherrypy
import os
import json
from os.path import abspath
from systemscan import hwinfo, sysinfo, network


class SystemMonitor(object):

    @cherrypy.expose
    def index(self):
        index_path = '/home/seyed/projects/cherry_monitor/view/index.html'
        with open(index_path, 'r') as f:
            front_page = f.read()
        return front_page

    @cherrypy.expose
    @cherrypy.tools.json_in()
    @cherrypy.tools.json_out()
    def sysinfo(self):
        sys_data = sysinfo.sysinfo()
        return json.dumps(sys_data)

    @cherrypy.expose
    @cherrypy.tools.json_in()
    @cherrypy.tools.json_out()
    def network(self, req_type='interface'):
        if req_type == 'interface':
            net_data = network.network_interface()
        elif req_type == 'traffic':
            net_data = network.network_traffic()
        return  json.dumps(net_data)

    @cherrypy.expose
    @cherrypy.tools.json_in()
    @cherrypy.tools.json_out()
    def hdinfo(self, hardware='memory'):
        if hardware == 'cpu':
            hdinfo_data = hwinfo.cpu()
        elif hardware == 'memory':
            hdinfo_data = hwinfo.memory()
        elif hardware == 'disk':
            hdinfo_data = hwinfo.disk()
        return json.dumps(hdinfo_data)


CP_CONF = {
    '/': {
        'tools.sessions.on': True,
        'tools.staticdir.root': abspath(os.getcwd()),
        'tools.staticdir.index': '/views/index.html'
    },
    '/view': {
        'tools.staticdir.on': True,
        'tools.staticdir.dir': abspath('./view')
    },
    '/css': {
        'tools.staticdir.on': True,
        'tools.staticdir.dir': abspath('./view/css')
    },
    '/js': {
        'tools.staticdir.on': True,
        'tools.staticdir.dir': abspath('./view/js')
    },
    '/assets': {
        'tools.staticdir.on': True,
        'tools.staticdir.dir': abspath('./view/assets')
    },
}


if __name__ == "__main__":
    cherrypy.quickstart(SystemMonitor(), '/', CP_CONF)
