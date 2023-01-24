import { NobleFemaleActor } from "./types/NobleFemaleActor.js";
import { CyborgMaleActor } from "./types/CyborgMaleActor.js";
import { CompanionActor } from "./types/CompanionActor.js";
import { CourierMaleActor } from "./types/CourierMaleActor.js";
import { MercenaryMaleActor } from "./types/MercenaryMaleActor.js";
import { TacticianMaleActor } from "./types/TacticianMaleActor.js";
import { DaredevilActor } from "./types/DaredevilActor.js";
import { StrangerActor } from "./types/StrangerActor.js";
import { BattlesuitActor } from "./types/BattlesuitActor.js";
import { BountyhunterActor } from "./types/BountyhunterActor.js";
import { SupernovaFemaleActor } from "./types/SupernovaFemaleActor.js";
import { CenzorActor } from "./types/CenzorActor.js";
import { EngineerActor } from "./types/EngineerActor.js";
import { DoctorActor } from "./types/DoctorActor.js";
import { JuggernautFemaleActor } from "./types/JuggernautFemaleActor.js";
import { KinetickActor } from "./types/KinetickActor.js";
import { DigitalDaoMaleActor } from "./types/DigitalDaoMaleActor.js";
import { EmissaryActor } from "./types/EmissaryActor.js";
import { PsychomantActor } from "./types/PsychomantActor.js";
import { RaelithActor } from "./types/RaelithActor.js";
import { JanissaryActor } from "./types/JanissaryActor.js";
import { ScoundrelActor } from "./types/ScoundrelActor.js";
import { ShadowActor } from "./types/ShadowActor.js";

const actorMappings = {
  noble_female: NobleFemaleActor, 
  cyborg_male: CyborgMaleActor,
  companion: CompanionActor,
  courier_male: CourierMaleActor,
  mercenary_male: MercenaryMaleActor,
  tactician_male: TacticianMaleActor,
  daredevil: DaredevilActor,
  stranger: StrangerActor, 
  battlesuit: BattlesuitActor, 
  bountyhunter: BountyhunterActor, 
  supernova_female: SupernovaFemaleActor, 
  cenzor: CenzorActor, 
  engineer: EngineerActor, 
  doctor: DoctorActor,
  juggernaut_female: JuggernautFemaleActor,
  kinetick: KinetickActor,
  digital_dao_male: DigitalDaoMaleActor,
  emissary: EmissaryActor,
  psychomant: PsychomantActor,
  raelith: RaelithActor,
  janissary: JanissaryActor,
  scoundrel: ScoundrelActor,
  shadow: ShadowActor
}

/**
 * Polymorphic base class.
 * Should be fairly empty, only containing functionality that all items should have regardless of type.
 * https://foundryvtt.wiki/en/development/guides/polymorphism-actors-items
 */
export const ProxyActor = new Proxy(function () {}, {
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