/* Есть идея сделать 1 контроллер на все, и шуровать на уровне проверки типа 
если взлетит, то после причешу код

import { NobleFemaleActorSheet } from "./sheets/NobleFemaleActorSheet.js";
import { CyborgMaleActorSheet } from "./sheets/CyborgMaleActorSheet.js";
import { CompanionActorSheet } from "./sheets/CompanionActorSheet.js";
import { CourierMaleActorSheet } from "./sheets/CourierMaleActorSheet.js";
import { MercenaryMaleActorSheet } from "./sheets/MercenaryMaleActorSheet.js";
import { TacticianMaleActorSheet } from "./sheets/TacticianMaleActorSheet.js";
import { DaredevilActorSheet } from "./sheets/DaredevilActorSheet.js";
import { StrangerActorSheet } from "./sheets/StrangerActorSheet.js";
import { BattlesuitActorSheet } from "./sheets/BattlesuitActorSheet.js";
import { BountyhunterActorSheet } from "./sheets/BountyhunterActorSheet.js";
import { SupernovaFemaleActorSheet } from "./sheets/SupernovaFemaleActorSheet.js";
import { CenzorActorSheet } from "./sheets/CenzorActorSheet.js";
import { EngineerActorSheet } from "./sheets/EngineerActorSheet.js";
import { DoctorActorSheet } from "./sheets/DoctorActorSheet.js";
import { JuggernautFemaleActorSheet } from "./sheets/JuggernautFemaleActorSheet.js";
import { KinetickActorSheet } from "./sheets/KinetickActorSheet.js";
import { DigitalDaoMaleActorSheet } from "./sheets/DigitalDaoMaleActorSheet.js";
import { EmissaryActorSheet } from "./sheets/EmissaryActorSheet.js";
import { PsychomantActorSheet } from "./sheets/PsychomantActorSheet.js";
import { RaelithActorSheet } from "./sheets/RaelithActorSheet.js";
import { JanissaryActorSheet } from "./sheets/JanissaryActorSheet.js";
import { ScoundrelActorSheet } from "./sheets/ScoundrelActorSheet.js";
import { ShadowActorSheet } from "./sheets/ShadowActorSheet.js";

const actorSheetMappings = {
  noble_female: NobleFemaleActorSheet, 
  cyborg_male: CyborgMaleActorSheet,
  companion: CompanionActorSheet,
  courier_male: CourierMaleActorSheet,
  mercenary_male: MercenaryMaleActorSheet,
  tactician_male: TacticianMaleActorSheet,
  daredevil: DaredevilActorSheet,
  stranger: StrangerActorSheet, 
  battlesuit: BattlesuitActorSheet, 
  bountyhunter: BountyhunterActorSheet, 
  supernova_female: SupernovaFemaleActorSheet, 
  cenzor: CenzorActorSheet, 
  engineer: EngineerActorSheet, 
  doctor: DoctorActorSheet,
  juggernaut_female: JuggernautFemaleActorSheet,
  kinetick: KinetickActorSheet,
  digital_dao_male: DigitalDaoMaleActorSheet,
  emissary: EmissaryActorSheet,
  psychomant: PsychomantActorSheet,
  raelith: RaelithActorSheet,
  janissary: JanissaryActorSheet,
  scoundrel: ScoundrelActorSheet,
  shadow: ShadowActorSheet
};
*/
import { MainActorSheet } from "./sheets/MainActorSheet.js";

const actorSheetMappings = {
  noble_female: MainActorSheet, 
  cyborg_male: MainActorSheet,
  companion: MainActorSheet,
  courier_male: MainActorSheet,
  mercenary_male: MainActorSheet,
  tactician_male: MainActorSheet,
  daredevil: MainActorSheet,
  stranger: MainActorSheet, 
  battlesuit: MainActorSheet, 
  bountyhunter: MainActorSheet, 
  supernova_female: MainActorSheet, 
  cenzor: MainActorSheet, 
  engineer: MainActorSheet, 
  doctor: MainActorSheet,
  juggernaut_female: MainActorSheet,
  kinetick: MainActorSheet,
  digital_dao_male: MainActorSheet,
  emissary: MainActorSheet,
  psychomant: MainActorSheet,
  raelith: MainActorSheet,
  janissary: MainActorSheet,
  scoundrel: MainActorSheet,
  shadow: MainActorSheet
};


/**
 * Polymorphic base class.
 * Should be fairly empty, only containing functionality that all items should have regardless of type.
 * https://foundryvtt.wiki/en/development/guides/polymorphism-actors-items
 */
 export const ProxyActorSheet = new Proxy(function () {}, {
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