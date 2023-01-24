export const preloadHandlebarsTemplates = async function () {
  // Define template paths to load
  let templatePaths = [
    `${game.system_path}/templates/sheets/items/clusters-sheet.hbs`,
    `${game.system_path}/templates/sheets/items/equipment-sheet.hbs`,
    `${game.system_path}/templates/sheets/items/origins-sheet.hbs`,

    `${game.system_path}/templates/dialogs/modify-attrs-roll.hbs`,
    `${game.system_path}/templates/dialogs/sheet-item-del.hbs`,

    `${game.system_path}/templates/chats/weapon-roll.hbs`,
    `${game.system_path}/templates/chats/attrs-roll.hbs`      
  ];

  const playbooks = [
    "noble_female",
    "cyborg_male",
    "companion",
    "courier_male",
    "mercenary_male",
    "tactician_male",
    "daredevil",
    "stranger",
    "battlesuit",
    "bountyhunter",
    "supernova_female",
    "cenzor",
    "engineer",
    "doctor",
    "juggernaut_female",
    "kinetick",
    "digital_dao_male",
    "emissary",
    "psychomant",
    "raelith",
    "janissary",
    "scoundrel",
    "shadow"
  ];

  playbooks.forEach(el => {
    templatePaths.push(`${game.system_path}/templates/sheets/actors/${el}-sheet.hbs`)
  });

  // Load the template parts
  return loadTemplates(templatePaths); 
};