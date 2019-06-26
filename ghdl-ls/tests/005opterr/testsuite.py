#!/usr/bin/env python3
import sys
sys.path.extend(['..', '../..'])
import testenv

testenv.run_compare('cmds.json', 'replies.json')
testenv.done()
