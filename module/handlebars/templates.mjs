export const preloadHandlebarsTemplates = async function () {
  // Define template paths to load
  let templatePaths = {};

  const templates = {
    "ItemSheets": [
      "sheets/items/equipments-sheet.hbs",
      "sheets/items/movies-sheet.hbs",
      "sheets/items/origins-sheet.hbs",
      "sheets/items/clusters-sheet.hbs",
      "sheets/items/tags-sheet.hbs",
      "sheets/items/starter_kits-sheet.hbs"
    ],
    "ActorSheets": [
      "sheets/actors/hero-sheet.hbs",
      "sheets/actors/cosmoship-sheet.hbs",
      "sheets/actors/enemy-sheet.hbs",

      "sheets/actors/partials/movie-factory.hbs",

      "sheets/actors/partials/navigation-sheet.hbs",

      // First page: Left inside
      "sheets/actors/partials/block-description.hbs",
      "sheets/actors/partials/block-origins.hbs",
      "sheets/actors/partials/block-clusters.hbs",
      "sheets/actors/partials/block-appearancies.hbs",
      "sheets/actors/partials/block-craft.hbs",
      "sheets/actors/partials/block-specialist.hbs",
      // First page: Right inside
      "sheets/actors/partials/block-princips.hbs",
      "sheets/actors/partials/block-theme.hbs",
      "sheets/actors/partials/block-startcompects.hbs",
      "sheets/actors/partials/block-contacts.hbs",

      // Second page: Center
      // Second page: Left inside
      // Second page: Right inside

      "sheets/actors/partials/tab-sheet-archetype.hbs",
      "sheets/actors/partials/tab-sheet-self.hbs",
      "sheets/actors/partials/tab-sheet-movies.hbs",
      "sheets/actors/partials/tab-sheet-notes.hbs",
      "sheets/actors/partials/tab-sheet-cyborg_male.hbs",
      "sheets/actors/partials/tab-sheet-daredevil.hbs",
      "sheets/actors/partials/tab-sheet-battlesuit.hbs",
      "sheets/actors/partials/tab-sheet-engineer.hbs",
      "sheets/actors/partials/tab-sheet-janissary.hbs",
      
    ],
    "Dialogs": [
      "dialogs/modify-attrs-roll.hbs",
      "dialogs/actor-item-remove.hbs"
    ],
    "Chats": [
      "chats/weapon-roll.hbs",
      "chats/attrs-roll.hbs"
    ]
  };

  for (const [group, tpls] of Object.entries(templates)) {
    tpls.forEach(el => {
      const key = el.split(/(.*)\.hbs/)[1].replaceAll("/", '-');
      templatePaths[key] = `${game.system_path}/templates/${el}`;
    })
  };
  game.logger.info("Templates List");
  game.logger.log(templatePaths);
  // Load the template parts
  return await loadTemplates(templatePaths); 
};