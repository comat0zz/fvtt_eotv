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
equipments = []
for row in range(1, 999):

    playbook = sheet.cell(row=row, column=1).value
    name = sheet.cell(row=row, column=2).value
    desc = sheet.cell(row=row, column=3).value
    in_action = sheet.cell(row=row, column=4).value
    key = sheet.cell(row=row, column=5).value

    if name is None:
        break

    if in_action == 1:
        in_action = True
    else:
        in_action = False


    equipments.append({
        "name": name,
        "img": "",
        "folder": None,
        "type": "equipments",
        "data": {
          "playbook": playbook,
          "key": key,
          "in_action": in_action,
          "description": desc
        }
    })

cf3 = open('equipments.json', 'w', encoding='utf-8')
cf3.writelines(json.dumps(equipments, ensure_ascii=False, indent=4, sort_keys=True))
cf3.close()


sheet = book.worksheets[3]
cfg = {}
for row in range(2, 999):

    playbook = sheet.cell(row=row, column=1).value
    res_max = sheet.cell(row=row, column=2).value
    res_tec = sheet.cell(row=row, column=3).value
    fin_max = sheet.cell(row=row, column=4).value
    fin_tec = sheet.cell(row=row, column=5).value
    pr_max = sheet.cell(row=row, column=6).value
    pr_tec = sheet.cell(row=row, column=7).value

    if playbook is None:
        break

    cfg[playbook] = {
        "res_max": res_max,
        "res_tec": res_tec,
        "fin_max": fin_max,
        "fin_tec": fin_tec,
        "pr_max": pr_max,
        "pr_tec": pr_tec
    }


cf3 = open('cfg.json', 'w', encoding='utf-8')
cf3.writelines(json.dumps(cfg, ensure_ascii=False, indent=4, sort_keys=True))
cf3.close()