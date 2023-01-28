import { CZT } from "./config.js";
import { initializeHandlebars } from "./handlebars/init.js";
import { registerSettings } from "./settings.js";

import { ProxyItemSheet } from "./items/ProxyItemSheet.js";
import { ProxyItem } from "./items/ProxyItem.js";

import { ProxyActorSheet } from "./actors/ProxyActorSheet.js";
import { ProxyActor } from "./actors/ProxyActor.js";

Hooks.once("init", function () {
  console.log(game.system.id + " | init system");

  CONFIG.CZT = CZT;
  game.system_path = "systems/eotv";

  CONFIG.Item.documentClass = ProxyItem;
  Items.unregisterSheet("core", ItemSheet);
  Items.registerSheet(game.system.id, ProxyItemSheet, {
    label: "CZT.Sheet.Item",
    makeDefault: true
  });

  CONFIG.Actor.documentClass = ProxyActor;
  Actors.unregisterSheet("core", ActorSheet);
  Actors.registerSheet(game.system.id, ProxyActorSheet, {
    label: "CZT.Sheet.Actor",
    makeDefault: true 
  });
  
  // Pre-load HTML templates
  initializeHandlebars();
  registerSettings();
});

const mm = "icons/svg/mystery-man.svg";
const mmToken = "icons/mystery-man.png";

Hooks.on("createActor", (actorData) => {
  const prevImg = actorData.img;
  const prevToken = actorData.token?.img;
  const imgPath = `${game.system_path}/assets/playbooks/${actorData.type}.png`;

  actorData.img = !prevImg || prevImg === mm ? imgPath : prevImg;
  //actorData.token.img = !prevToken || prevToken === mmToken || prevToken === mm ? tokenPath : prevToken;
});