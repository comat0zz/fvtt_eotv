import { BaseActorSheet } from "./BaseActorSheet.mjs";
import * as CztUtility from "../utilities/_module.mjs";

/**
 * Extend the base Actor document to support attributes and groups with a custom template creation dialog.
 * @extends {Actor}
 */
export class CztActorSheet extends BaseActorSheet {

  /** @override */
  static get defaultOptions() {
    return mergeObject(super.defaultOptions, {
      classes: [game.system.id, "sheet", "actor", "actor-main"],
      width: 1200,
      height: 800,
      tabs: [
        {navSelector: ".sheet-tabs", contentSelector: ".sheet-body", initial: "properties"},
        {navSelector: ".sheet-tabs-origin", contentSelector: ".sheet-body-origin", initial: "origin-list"}
      ]
    });
  }

  /** @inheritdoc */
  async getData(options) {
    const context = super.getData(options);
    const actor_type = this.actor.type;

    context.systemData = context.data.system;
    context.config = CONFIG.CZT;
    context.items = [];

    context.specialtab = (['battlesuit', 'cyborg_male', 'daredevil', 'engineer', 'janissary'].indexOf(actor_type) > -1)?actor_type:false;

    //context.isWeapons = context.items.filter((i) => i.type === "weapon");
    //context.isArmor = context.items.filter((i) => i.type === "armor");
    //context.isEquip = context.items.filter((i) => i.type === "equipment");

    const movies_pack = await game.packs.get(game.system.id + '.movies').getDocuments();
    context.movie_common = await movies_pack.filter(e => e.system.kind === "basic");
    context.movie_dramatic = await movies_pack.filter(e => e.system.kind === "dramatic");
    context.movie_cosmo = await movies_pack.filter(e => e.system.kind === "cosmo");
    context.movie_threats = await movies_pack.filter(e => e.system.kind === "threats");

    const pack = game.packs.get(game.system.id + '.playbooks');
    const playbook_id = pack.index.find(e => e.name === actor_type)._id;
    const playbook = await pack.getDocument(playbook_id);
    context.playbook_data = playbook.system;

    game.logger.log(context)
    return context;
  }

  activateListeners(html) {
    super.activateListeners(html);

    html.find('.sheet-roll-weapon').click(evt => this._onActorRollWeapon(evt));
    html.find('.sheet-roll-attrs').click(evt => this._onActorRollAttrs(evt));
    
  }

 
  async _onActorRollWeapon(evt) {
    evt.preventDefault();
    const weapon_id = $(evt.currentTarget).closest('tr').attr('item-id');
    const item = this.actor.items.filter((i) => i.type === "weapon" && i.id == weapon_id);
    const oItem = game.items.get(item[0].item_id);
    
    let roll = await new Roll(item[0].formula).roll({async: true});

    const html = await renderTemplate(`${game.system_path}/templates/chats/weapon-roll.hbs`, {
      item_name: item[0].name,
      img: item[0].img,
      dice: item[0].formula,
      desc: oItem.system.description,
      result: roll.result,
      total: roll.total
    });

    ChatMessage.create({
      user: game.user._id,
      speaker: ChatMessage.getSpeaker(),
      content: html
    });
  }

  async checkAttr(attr, html) {
    // Оставлю себе для примера
    const actor_min = this.actor.system.attrs[attr].curr;
    const actor_max = this.actor.system.attrs[attr].max;

    const dices = html.find(`form input[name=count_dices]`).val();
    const mod = html.find(`form input[type=radio][name=modificator]:checked`).val();

    let roll = await new Roll(`${dices}d20`).evaluate({async: true});
    let sortedResults = roll.terms[0].results.map(r => {return r.result}).sort(function(a, b) {
      return b - a;});
    
      const tpl = await renderTemplate(`${game.system_path}/templates/chats/attrs-roll.hbs`, {
        terms: `${dices}d20`,
        row: sortedResults.join(', '),
        rmax: parseInt(sortedResults[0]),
        rmin: parseInt(sortedResults.slice(-1)),
        attr: attr,
        mod: mod,
        actor_min: parseInt(actor_min),
        actor_max: parseInt(actor_max),
        attrLabel: CONFIG.CZT.Attrs[attr]
      });
  
    ChatMessage.create({
        user: game.user._id,
        speaker: ChatMessage.getSpeaker(),
        content: tpl
    });
  }

  async _onActorRollAttrs(evt) {
    evt.preventDefault();
    return false; // Заглушка
    const attrType = $(evt.currentTarget).attr('attr-type'); 

    const template = await renderTemplate(`${game.system_path}/templates/dialogs/attrs-roll.hbs`);
    return new Promise(resolve => {
      const data = {
        title: "", // game.i18n.localize("CZT.Common.CheckAttrs"),
        content: template,
        buttons: {
          cancel: {
            icon: '<i class="fas fa-times"></i>',
            label: game.i18n.localize("CZT.Common.Buttons.Cancel"),
            callback: html => resolve({cancelled: true})
          },
          yes: {
            icon: '<i class="fas fa-check"></i>',
            label: game.i18n.localize("CZT.Common.Select.Yes"),
            callback: html => resolve(this.checkAttr(attrType, html))
           }        
        },
        default: "cancel",
        close: () => resolve({cancelled: true})
      }
      new Dialog(data, null).render(true);
    });
  }

}