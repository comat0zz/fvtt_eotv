#!/usr/bin/python3
## -*- coding: utf-8 -*-

import json
import string
import random

def id_generator(size=6, chars=string.ascii_uppercase + string.digits):
    return ''.join(random.choice(chars) for _ in range(size))


with open("equipments.json", 'r') as f:
  data = json.load(f)

for con in data:
  con["data"]["keyName"] = id_generator(8)


cf4 = open('new.equipments.json', 'w', encoding='utf-8')
cf4.writelines(json.dumps(data, ensure_ascii=False, indent=4, sort_keys=True))
cf4.close()