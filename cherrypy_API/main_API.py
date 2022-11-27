# from os.path import os.path.abspath
import os
import json
import uuid
import jwt
import cherrypy
from sysmodule import hwinfo, sysinfo, network, log, pam
# import logging


SERVER_SECRET = "cherrypy"


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
        sys_data: dict = sysinfo.sysinfo()
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
        hdinfo_data: dict = {}
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
    def login(self, username: str, password: str) -> str:
        """API endpoint route to verify user login with host system
        users authentication

        Args:
            username (str): registered system username
            password (str): registered system password

        Returns:
            str: json string returened with authentation status, accessible
            with 'authenticated' keyword
        """
        response: dict = {'authenticated': False}
        cookie_req: dict = cherrypy.request.cookie
        cookie_res: dict = cherrypy.response.cookie

        authenticated: bool = pam.user_login(
            username=username, password=password)
        if authenticated:

            token_claims: dict = {
                'session_id': cookie_req['session_id'].value,
                'verified_user': username
            }

            session_token = jwt.encode(
                payload=token_claims, key=SERVER_SECRET, algorithm="HS256")

            response['authenticated'] = True
            cookie_res['token'] = (session_token)
        response: str = json.dumps(response)
        return response

    @cherrypy.expose
    @cherrypy.tools.json_in()
    @cherrypy.tools.json_out()
    def token_handler(self):
        
        cookie = cherrypy.request.cookie
        response: dict = {'verified': False,
                          'message': ''}
        
        session_token = cookie.get('token', False)
        if not session_token:
            response['verified'] = False
            response['message'] = 'No session token is porvided, Try to log in!'
        # verify the session token
        else:
            session_token = session_token.value
            try:
                decode_token = jwt.decode(session_token,SERVER_SECRET, algorithms=["HS256"])
            except jwt.InvalidSignatureError:
                response['verified'] = False
                response['message'] = 'Token is not verfied'
            else:
                response['verified'] = True
                response['message'] = str(decode_token)
        return response


CP_CONF = {
    '/': {
        'tools.sessions.on': True,
        'tools.staticdir.root': os.path.abspath(os.getcwd()),
        # 'tools.sessions.storage_class': cherrypy.lib.sessions.FileSession,
        # 'tools.sessions.storage_type': "File",
        # 'tools.sessions.storage_path': "sessions",
        'tools.staticdir.index': '/view/login/index.html'
    },
    '/view': {
        'tools.staticdir.on': True,
        'tools.staticdir.dir': os.path.abspath('./view')
    }
    # '/sysmodule': {
    #     'tools.staticdir.on': True,
    #     'tools.staticdir.dir': os.path.abspath('./cherrypy_API/sysmodule')
    # },
    # '/view': {
    #     'tools.staticdir.on': True,
    #     'tools.staticdir.dir': os.path.abspath('./view')
    # },
    # '/css': {
    #     'tools.staticdir.on': True,
    #     'tools.staticdir.dir': os.path.abspath('./view/css')
    # },
    # '/js': {
    #     'tools.staticdir.on': True,
    #     'tools.staticdir.dir': os.path.abspath('./view/js')
    # },
    # '/assets': {
    #     'tools.staticdir.on': True,
    #     'tools.staticdir.dir': os.path.abspath('./view/assets')
    # },
}


if __name__ == "__main__":
    cherrypy.quickstart(SystemMonitor(), '/', CP_CONF)
