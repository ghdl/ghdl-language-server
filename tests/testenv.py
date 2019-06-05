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


def show_diffs(name, ref, res):
    if isinstance(ref, dict) and isinstance(res, dict):
        for k in ref:
            if k not in res:
                print('{}.{} not in the result'.format(name, k))
            else:
                show_diffs('{}.{}'.format(name, k), ref[k], res[k])
        for k in res:
            if k not in ref:
                print('{}.{} unexpected in the result'.format(name, k))
    elif isinstance(ref, str) and isinstance(res, str):
        if res != ref:
            print('{}: mismatch (ref: {}, result: {})'.format(name, res, ref))
    elif isinstance(ref, int) and isinstance(res, int):
        if res != ref:
            print('{}: mismatch (ref: {}, result: {})'.format(name, res, ref))
    elif isinstance(ref, list) and isinstance(res, list):
        for i in range(min(len(ref), len(res))):
            show_diffs('{}[{}]'.format(name, i), ref[i], res[i])
        if len(ref) > len(res):
            print('{}: missing elements'.format(name))
        elif len(ref) < len(res):
            print('{}: extra elements'.format(name))
    else:
        print('unhandle type {} in {}'.format(type(ref), name))

def run_compare(req_name, rep_name):
    # Convert the JSON input file to an LSP string.
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
    errs = 0
    json_res = []
    for r in ref:
        rep = ls.read_request()
        if rep is None:
            print('FAIL: number of reply does not match')
            errs += 1
            break
        rep = json.loads(rep)
        json_res.append(rep)
        if rep != r:
            print('FAIL: reply does not match for {}'.format(req_name))
            print(rep)
            print(r)
            show_diffs('', r, rep)
            errs += 1
    rep = ls.read_request()
    if rep is not None:
        print('FAIL: too many replies')
        errs += 1
    if errs != 0:
        print('FAILURE between output and {} (for {})'.format(rep_name, req_name))
        print('Writing result output to result.json')
        with open('result.json', 'w') as f:
            f.write(json.dumps(json_res, indent=2))
            f.write('\n')
        sys.exit(1)

def done():
    print('PASS')
    sys.exit(0)
