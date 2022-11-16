import cherrypy
import random
import string

class FirstPage(object):
    @cherrypy.expose
    def index(self):
        return 'main page'

    @cherrypy.expose
    def random_gen(self, length = 8):
        return ''.join(random.sample(string.hexdigits, int(length)))
        


if __name__ == "__main__":
    cherrypy.quickstart(FirstPage())