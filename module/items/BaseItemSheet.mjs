import * as CztUtility from "../utilities/_module.mjs";

export class BaseItemSheet extends ItemSheet {
  
  /** @override */
  get template() {
    return `${game.system_path}/templates/sheets/items/${this.item.type}-sheet.hbs`;
  }

  /** @inheritdoc */
  async getData(options) {
    const context = super.getData(options);

    context.systemData = context.data.system;
    context.config = CONFIG.CZT;
    const tags = context.systemData?.tags;
    if(!CztUtility.isEmpty(tags)) {
      const tags_pack = await game.packs.get(game.system.id + '.tags').getDocuments();
      context.tags = await tags_pack.filter(e => tags.includes(e.system.keyName));
    }
   
    game.logger.log(context)
    return context;
  }
 
}