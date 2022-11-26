import cherrypy
import os
import json
from os.path import abspath
import uuid
from sysmodule import hwinfo, sysinfo, network, log, pam
import logging


class SystemMonitor(object):
    """main system monitor application passed to cherrypy webserver
    that each of its function works as an requent endpoints base on
    function name

    Args:
        object (_type_): _description_

    Raises:
        an: redirect request
        cherrypy.HTTPRedirect: redirect request handled by cherrypy
        webserver

    Returns:
        cherrypy Object: an object passed to cherrypy webserver
    """

    @cherrypy.expose
    def index(self):
        """landing page, handle the requests to the root route and /.index(value)

        Raises:
            cherrypy.HTTPRedirect: raise an exeption of the requested redirection/
            to the cherrypy running demon to redirect the client
        """
        raise cherrypy.HTTPRedirect(cherrypy.url('/view/login/index.html'))

    @cherrypy.expose
    @cherrypy.tools.json_in()
    @cherrypy.tools.json_out()
    def sysinfo(self) -> str:
        """use external module to fetch system information and return the json
        output to the request on baseURL/sysinfo

        Returns:
            str: return json string containing information on system information
        """
        sys_data = sysinfo.sysinfo()
        sys_data_json: str = json.dumps(sys_data)
        return sys_data_json

    @cherrypy.expose
    @cherrypy.tools.json_in()
    @cherrypy.tools.json_out()
    def network(self) -> str:
        """use external modul to fetch system network interface and traffic data
        and pass it out as json string on the 'baseURL/network

        Returns:
            str: json string including network information on 'interface'
            and 'traffic'
        """
        net_data: dict = {}
        net_data['interface'] = network.network_interface()
        net_data['traffic'] = network.network_traffic()
        net_data_json: str = json.dumps(net_data)
        return net_data_json

    @cherrypy.expose
    @cherrypy.tools.json_in()
    @cherrypy.tools.json_out()
    def hdinfo(self) -> str:
        """use external module to fetch system hardware information and returns
        json string respone on 'baseURL/hdinfo' requests

        Returns:
            str: json string including information on system hardware
        """
        hdinfo_data = {}
        hdinfo_data['cpu'] = hwinfo.cpu()
        hdinfo_data['memory'] = hwinfo.memory()
        hdinfo_data['disk'] = hwinfo.disk()

        return json.dumps(hdinfo_data)

    @cherrypy.expose
    @cherrypy.tools.json_in()
    @cherrypy.tools.json_out()
    def log(self, file_name: str, direction: str, line_count: str) -> str:
        """use external module to read specified logfile from systemfiles
        with two control parameters to limit the output

        Args:
            file_name (str): exact logfile name available on '/var/log'
            direction (str): chossing whether to read from top of the file or
            end of the file with 'head' and 'tail' keywords respectively
            line_count (str): defining how many records to return the the logfile
            and if the parameter exceed the maximum recored number, all of the
            records would be returned

        Returns:
            str: json string including records of logfile
        """
        log_data: str = log.read_log_file(file_name=file_name, direction=direction,
                                          line_count=line_count)
        log_data_json: str = json.dumps(log_data)
        return log_data_json

    @cherrypy.expose
    @cherrypy.tools.json_in()
    @cherrypy.tools.json_out()
    def login(self, username: str, password: str):
        status: bool = pam.user_login(username=username, password=password)
        response = {'authenticate': status}
        if status:
            print('user authenticated')
            session_token: str = uuid.uuid4().hex
            cookie: dict = cherrypy.response.cookie
            cookie['session_token'] = (session_token)
            # raise cherrypy.HTTPRedirect(cherrypy.url('/view/dashboard/index.html'))
            return json.dumps(response)
        else:
            # return 'failed'
            return json.dumps(response)


CP_CONF = {
    '/': {
        'tools.sessions.on': True,
        'tools.staticdir.root': abspath(os.getcwd()),
        'tools.staticdir.index': '/view/login/index.html'
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
