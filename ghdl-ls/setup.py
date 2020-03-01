#!/usr/bin/env python

import re
from setuptools import setup


def find_version():
    version_match = re.search(
        r"^__version__ = ['\"]([^'\"]*)['\"]",
        open('vhdl_langserver/version.py').read(),
        re.M
    )
    if version_match:
        return version_match.group(1)
    else:
        raise RuntimeError("cannot extract version from version.py")


setup(
    name='ghdl-language-server',
    version=find_version(),
    description='VHDL Language Server for the Language Server Protocol',
    long_description=open('README').read(),
    url='https://github.com/ghdl/ghdl-language-server',
    author='Tristan Gingold',
    packages=['vhdl_langserver'],
    package_dir={
        'vhdl_langserver': 'vhdl_langserver'
    },
    # List run-time dependencies here. For an analysis of "install_requires"
    # vs pip's requirements files see:
    # https://packaging.python.org/en/latest/requirements.html
    install_requires=[
        'attrs',
        'libghdl==1.0.dev0'
    ],
    # To provide executable scripts, use entry points in preference to the
    # "scripts" keyword. Entry points provide cross-platform support and allow
    # pip to create the appropriate form of executable for the target platform.
    entry_points={
        'console_scripts': [
            'ghdl-ls = vhdl_langserver.main:main',
        ]
    },
)
