import os
import sys
import io
import json
import vhdl_langserver.lsp as lsp
import subprocess

class StrConn:
    def __init__(self):
        self.res = ''

    def write(self, s):
        self.res += s

def run_compare(req_name, rep_name):
    # Convert the input file to LSP
    res = json.load(open(req_name, 'r'))
    conn = StrConn()
    ls = lsp.LanguageProtocolServer(None, conn)
    for req in res:
        ls.write_output(req)
    
    # Run
    p = subprocess.run([os.environ.get('GHDLLS', '../../ghdl-ls')],
        input=conn.res.encode('utf-8'), stdout=subprocess.PIPE)
    if p.returncode != 0:
        print('FAIL: exit != 0')
        sys.exit(1)

    if rep_name is None:
        return

    # Check output
    in_io = io.BytesIO(p.stdout)
    conn = lsp.LSPConn(in_io, None)
    ls = lsp.LanguageProtocolServer(None, conn)
    ref = json.load(open(rep_name, 'r'))
    for r in ref:
        rep = ls.read_request()
        if rep is None:
            print('FAIL: number of reply does not match')
            sys.exit(1)
        rep = json.loads(rep)
        if rep != r:
            print('FAIL: reply does not match')
            print(rep)
            print(r)
            sys.exit(1)
    rep = ls.read_request()
    if rep is not None:
        print('FAIL: too many replies')
        sys.exit(1)

def done():
    print('PASS')
    sys.exit(0)
