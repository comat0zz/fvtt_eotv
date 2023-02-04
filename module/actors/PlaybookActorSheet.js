import { genId, getRandomInt } from "../utils.js";

/**
 * Extend the base Actor document to support attributes and groups with a custom template creation dialog.
 * @extends {Actor}
 */
export class PlaybookActorSheet extends ActorSheet {

  /** @override */
  get template() {
    return `${game.system_path}/templates/sheets/actors/main-sheet.hbs`;
  }

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

    const origins_pack = await game.packs.get(game.system.id + '.origins').getDocuments();
    context.origins = await origins_pack.filter(e => e.system.playbook === actor_type);

    const clusters_pack = await game.packs.get(game.system.id + '.clusters').getDocuments();
    context.clusters = await clusters_pack.filter(e => e.system.playbook === actor_type);

    const movies_pack = await game.packs.get(game.system.id + '.movies').getDocuments();
    context.movie_common = await movies_pack.filter(e => e.system.kind === "basic");
    context.movie_dramatic = await movies_pack.filter(e => e.system.kind === "dramatic");
    context.movie_cosmo = await movies_pack.filter(e => e.system.kind === "cosmo");
    context.movie_traits = await movies_pack.filter(e => e.system.kind === "traits");

    context.movie_playbook_starter = await movies_pack.filter(e => e.system.kind === actor_type && e.system.playbooks === 'starter');
    context.movie_playbook_special = await movies_pack.filter(e => e.system.kind === actor_type && e.system.playbooks === 'special');
    

    const equipments_pack = await game.packs.get(game.system.id + '.equipments').getDocuments();
    context.equipments_active = await equipments_pack.filter(e => e.system.playbook === actor_type && e.system.in_action);
    context.equipments_noactive = await equipments_pack.filter(e => e.system.playbook === actor_type && !e.system.in_action);

    context.showElements = {
      "OriginsBeforeInfo": (['shadow', 'tactician_male', 'scoundrel', 'psychomant', 'juggernaut_female', 'supernova_female', 'janissary'].indexOf(actor_type) > -1)?true:false,
      "ClusterTitle": (['shadow', 'stranger', 'juggernaut_female', 'emissary', 'janissary'].indexOf(actor_type) > -1)?true:false,
      "blockClusters": (['supernova_female', 'raelith'].indexOf(actor_type) > -1)?false:true,
    } 


    console.log(context)
    return context;
  }

  activateListeners(html) {
    super.activateListeners(html);

    html.find('.playbook-movie-action h3 span').click(evt => this._onPlaybookMovieAction(evt));
  }

  async _getDocumentByPack(name) {
    const pack = game.packs.get(name.pack);
    return await pack.getDocument(name.id);
  }

  async _extractItem(data) {

    if(Object.keys(data).includes("pack") && data.pack != "") {
      return await this._getDocumentByPack(data);
    }else if(data.type == "Item"){
      return game.items.get(data.id);
    }else if(data.type == "Actor") {
      return game.actors.get(data.id);
    }
  }
  
  async getModNum(num) {
    if(num[0] == "+" || num[0] == "-") {
      return num;
    }else{
      return `+${num}`;
    }
  }

  async movieRoll(id, opts, html) {
    const stat = html.find(`form input[name=selected-stats]:checked`).val();
    const modify = await this.getModNum(html.find(`form select[name=set-mofidy] option:selected`).val());
    const num = await this.getModNum(this.actor.system[stat]);
    const injName = CONFIG.CZT.StatToInjury[stat];
    const injActor = this.actor.system[injName];
    let injMod = "+0";
    if(injActor > 0) {
      injMod = "-1";
    }

    let formula = `2d6${modify}${num}${injMod}`;
    let roll = await new Roll(formula).evaluate({async: true});
    console.log(roll.result, roll.total)

    const tpl = await renderTemplate(`${game.system_path}/templates/chats/movie-roll.hbs`, {
      result: roll.result,
      total: roll.total,
      movie_name: opts.name,
      isInjury: (injActor > 0)?true:false,
      injMod: injMod,
      formula: formula,
      injActor: injActor,
      stat: game.i18n.localize(CONFIG.CZT.StatsLocale[stat])
    });

    ChatMessage.create({
      user: game.user._id,
      speaker: ChatMessage.getSpeaker(),
      content: tpl
    });
  }

  async _onPlaybookMovieAction(evt) {
    evt.preventDefault();
    const movie_id = $(evt.currentTarget).closest('span.playbook-movie-action').attr('movie-id');
    const movie_list = this.actor.system.movies;
    //if(movie_list.indexOf(movie_id) < 0) return;

    const playbook = $(evt.currentTarget).closest('span.playbook-movie-action').attr('movie-playbook');
    const movie_key = $(evt.currentTarget).closest('span.playbook-movie-action').attr('movie-key');
    const movies_pack = await game.packs.get(game.system.id + '.movies').getDocuments();
    const movie_item = await movies_pack.filter(e => e.system.kind === playbook && e._id === movie_id);
    const actions = movie_item[0].system.specifics.in_action;
    console.log(actions.length)

    let options = {
      name: movie_item[0].name,
      lenacts: actions.length,
      actions: actions,
      StatsLocale: CONFIG.CZT.StatsLocale
    }

    const template = await renderTemplate(`${game.system_path}/templates/dialogs/movie-roll.hbs`, {data: options});

    return new Promise(resolve => {
      const data = {
        title: game.i18n.localize("CZT.Actor.YouUseMovie") + movie_item[0].name,
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
            callback: html => resolve(this.movieRoll(movie_id, options, html))
           }        
        },
        default: "cancel",
        close: () => resolve({cancelled: true})
      }
      new Dialog(data, null).render(true);
    });
  }




}