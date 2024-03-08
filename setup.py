from setuptools import setup

setup(
    name='Wirecast Template Service',
    version='0.1',
    scripts=['app.py'],
    requires=['flask', 'rich'],
    py_modules=[]
    # packages=['wirecast_templates', 'static']
)