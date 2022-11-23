import cherrypy
import os
import json
from os.path import abspath
from sysmodule import hwinfo, sysinfo, network, log


class SystemMonitor(object):

    @cherrypy.expose
    def index(self):
        raise cherrypy.HTTPRedirect(cherrypy.url('/view/login/index.html'))

    @cherrypy.expose
    @cherrypy.tools.json_in()
    @cherrypy.tools.json_out()
    def sysinfo(self):
        sys_data = sysinfo.sysinfo()
        return json.dumps(sys_data)

    @cherrypy.expose
    @cherrypy.tools.json_in()
    @cherrypy.tools.json_out()
    def network(self):
        net_data = {}
        net_data['interface'] = network.network_interface()
        net_data['traffic'] = network.network_traffic()

        return json.dumps(net_data)

    @cherrypy.expose
    @cherrypy.tools.json_in()
    @cherrypy.tools.json_out()
    def hdinfo(self):
        hdinfo_data = {}
        hdinfo_data['cpu'] = hwinfo.cpu()
        hdinfo_data['memory'] = hwinfo.memory()
        hdinfo_data['disk'] = hwinfo.disk()

        return json.dumps(hdinfo_data)

    @cherrypy.expose
    @cherrypy.tools.json_in()
    @cherrypy.tools.json_out()
    def log(self, file_name, direction, line_count):
        log_data = log.read_log_file(file_name=file_name, direction=direction,
                                     line_count=line_count)
        return json.dumps(log_data)


CP_CONF = {
    '/': {
        'tools.sessions.on': True,
        'tools.staticdir.root': abspath(os.getcwd()),
        'tools.staticdir.index': '/views/index.html'
    },
    '/view': {
        'tools.staticdir.on': True,
        'tools.staticdir.dir': abspath('./view')
    }
    # '/sysmodule': {
    #     'tools.staticdir.on': True,
    #     'tools.staticdir.dir': abspath('./cherrypy_API/sysmodule')
    # },
    # '/view': {
    #     'tools.staticdir.on': True,
    #     'tools.staticdir.dir': abspath('./view')
    # },
    # '/css': {
    #     'tools.staticdir.on': True,
    #     'tools.staticdir.dir': abspath('./view/css')
    # },
    # '/js': {
    #     'tools.staticdir.on': True,
    #     'tools.staticdir.dir': abspath('./view/js')
    # },
    # '/assets': {
    #     'tools.staticdir.on': True,
    #     'tools.staticdir.dir': abspath('./view/assets')
    # },
}


if __name__ == "__main__":
    cherrypy.quickstart(SystemMonitor(), '/', CP_CONF)
