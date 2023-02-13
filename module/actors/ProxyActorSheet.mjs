import { HeroActorSheet } from "./sheets/HeroActorSheet.mjs";
import { EnemyActorSheet } from "./sheets/EnemyActorSheet.mjs";
import { NpcActorSheet } from "./sheets/NpcActorSheet.mjs";

const actorSheetMappings = {
  hero: HeroActorSheet, 
  enemy: EnemyActorSheet, 
  npc: NpcActorSheet
};

/**
 * Polymorphic base class.
 * Should be fairly empty, only containing functionality that all items should have regardless of type.
 * https://foundryvtt.wiki/en/development/guides/polymorphism-actors-items
 */
 export const CztActorSheet = new Proxy(function () {}, {
  //Will intercept calls to the "new" operator
  construct: function (target, args) {
    const [data] = args;

    //Handle missing mapping entries
    if (!actorSheetMappings.hasOwnProperty(data.type))
      throw new Error("Unsupported Sheet type for create(): " + data.type);

    //Return the appropriate, actual object from the right class
    return new actorSheetMappings[data.type](...args);
  },

  //Property access on this weird, dirty proxy object
  get: function (target, prop, receiver) {
    switch (prop) {
      case "create":
      case "createDocuments":
        //Calling the class' create() static function
        return function (data, options) {
          if (data.constructor === Array) {
            //Array of data, this happens when creating Sheets imported from a compendium
            return data.map(i => ActorSheet.create(i, options));
          }

          if (!actorSheetMappings.hasOwnProperty(data.type))
            throw new Error("Unsupported Sheet type for create(): " + data.type);

          return actorSheetMappings[data.type].create(data, options);
        };

      case Symbol.hasInstance:
        //Applying the "instanceof" operator on the instance object
        return function (instance) {
          return Object.values(actorSheetMappings).some(i => instance instanceof i);
        };

      default:
        //Just forward any requested properties to the base ItemSheet class
        return ActorSheet[prop];
    }
  },

});