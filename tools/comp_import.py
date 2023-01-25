#!/usr/bin/python3
## -*- coding: utf-8 -*-

import json
import os
import argparse 
import openpyxl

parser = argparse.ArgumentParser(description='Перегоняет xslx в JSON для подготовки компендиума')

parser.add_argument('--xlsx', 
    type=str, 
    help='Файл до эксельки', 
    dest = 'xlsx',
    required=True
)

args = parser.parse_args()

book = openpyxl.load_workbook(args.xlsx)
sheet = book.worksheets[0]

origins = []

for row in range(1, 999):
    playbook = sheet.cell(row=row, column=1).value
    name = sheet.cell(row=row, column=2).value
    sign = sheet.cell(row=row, column=3).value
    desc = sheet.cell(row=row, column=4).value

    if name is None:
        break

    origins.append({
        "name": name,
        "img": "",
        "folder": None,
        "type": "origins",
        "data": {
          "sign": sign,
          "description": desc,
          "playbook": playbook
        }
    })

cf1 = open('origins.json', 'w', encoding='utf-8')
cf1.writelines(json.dumps(origins, ensure_ascii=False, indent=4, sort_keys=True))
cf1.close()

sheet = book.worksheets[1]

clusters = []
for row in range(1, 999):
    playbook = sheet.cell(row=row, column=1).value
    name = sheet.cell(row=row, column=2).value
    desc = sheet.cell(row=row, column=3).value

    if name is None:
        break

    clusters.append({
        "name": name,
        "img": "",
        "folder": None,
        "type": "clusters",
        "data": {
          "description": desc,
          "playbook": playbook
        }
    })

cf2 = open('clusters.json', 'w', encoding='utf-8')
cf2.writelines(json.dumps(clusters, ensure_ascii=False, indent=4, sort_keys=True))
cf2.close()

sheet = book.worksheets[2]
princips = []
for row in range(1, 999):

    playbook = sheet.cell(row=row, column=1).value
    name = sheet.cell(row=row, column=2).value

    if name is None:
        break

    princips.append({
        "name": name,
        "img": "",
        "folder": None,
        "type": "princips",
        "data": {
          "playbook": playbook
        }
    })

cf3 = open('princips.json', 'w', encoding='utf-8')
cf3.writelines(json.dumps(princips, ensure_ascii=False, indent=4, sort_keys=True))
cf3.close()