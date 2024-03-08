from flask import Flask, request, send_file, jsonify
from config import env
import os
from rich import print

app = Flask(__name__)


def root_path():
    return os.path.abspath(os.path.dirname(__file__))


# Static File Serving
# -------------------------------
@app.route('/css/<file>')
def send_css(file):
    file_path = f'{root_path()}\static\css\{file}'
    os.path.abspath(file_path)
    return send_file(file_path)

@app.route('/js/<file>')
def send_js(file):
    file_path = f'{root_path()}\static\js\{file}'
    os.path.abspath(file_path)
    return send_file(file_path)


# -----------------------------

@app.route('/')
def index():
    return send_file(f'{root_path()}\static\html\index.html')


@app.route('/template')
def template():
    return send_file(f'{root_path()}\wirecast_templates\\1080.xml')




if __name__ == '__main__':
    app.run(use_reloader=True, port=5000)