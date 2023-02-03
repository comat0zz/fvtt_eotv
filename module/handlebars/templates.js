export const preloadHandlebarsTemplates = async function () {
  // Define template paths to load
  let templatePaths = [
    `${game.system_path}/templates/sheets/items/clusters-sheet.hbs`,
    `${game.system_path}/templates/sheets/items/equipments-sheet.hbs`,
    `${game.system_path}/templates/sheets/items/origins-sheet.hbs`,

    `${game.system_path}/templates/dialogs/modify-attrs-roll.hbs`,
    `${game.system_path}/templates/dialogs/sheet-item-del.hbs`,

    `${game.system_path}/templates/chats/weapon-roll.hbs`,
    `${game.system_path}/templates/chats/attrs-roll.hbs`,

    `${game.system_path}/templates/sheets/actors/main-sheet.hbs`,

    `${game.system_path}/templates/sheets/actors/partials/tab-battlesuit.hbs`,

    `${game.system_path}/templates/sheets/actors/movie-fabric.hbs`
  ];

  // Load the template parts
  return loadTemplates(templatePaths); 
};