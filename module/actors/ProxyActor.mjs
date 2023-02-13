import { HeroActor } from "./types/HeroActor.mjs";
import { EnemyActor } from "./types/EnemyActor.mjs";
import { NpcActor } from "./types/NpcActor.mjs";

const actorMappings = {
  hero: HeroActor, 
  enemy: EnemyActor, 
  npc: NpcActor
}

/**
 * Polymorphic base class.
 * Should be fairly empty, only containing functionality that all items should have regardless of type.
 * https://foundryvtt.wiki/en/development/guides/polymorphism-actors-items
 */
export const CztActor = new Proxy(function () {}, {
  //Will intercept calls to the "new" operator
  construct: function (target, args) {
    const [data] = args;

    //Handle missing mapping entries
    if (!actorMappings.hasOwnProperty(data.type))
      throw new Error("Unsupported Entity type for create(): " + data.type);

    //Return the appropriate, actual object from the right class
    return new actorMappings[data.type](...args);
  },

  //Property access on this weird, dirty proxy object
  get: function (target, prop, receiver) {
    switch (prop) {
      case "create":
      case "createDocuments":
        //Calling the class' create() static function
        return function (data, options) {
          if (data.constructor === Array) {
            //Array of data, this happens when creating Actors imported from a compendium
            return data.map(i => Actor.create(i, options));
          }

          if (!actorMappings.hasOwnProperty(data.type))
            throw new Error("Unsupported Entity type for create(): " + data.type);

          return actorMappings[data.type].create(data, options);
        };

      case Symbol.hasInstance:
        //Applying the "instanceof" operator on the instance object
        return function (instance) {
          return Object.values(actorMappings).some(i => instance instanceof i);
        };

      default:
        //Just forward any requested properties to the base Actor class
        return Actor[prop];
    }
  },

});