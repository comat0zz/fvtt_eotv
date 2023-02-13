export const registerHandlebarsHelpers = async function () {
  
  // localize "SYSTEM.WORD.STR." VAL 
  Handlebars.registerHelper('lzCc', function (str, val) {
    return game.i18n.localize(str + val);
  });

  // Отвязываем картинки от путей
  Handlebars.registerHelper('get_assets', function (asset) {
    return `${game.system_path}/assets/${asset}`;
  });

  // if equal v1 == v2
  Handlebars.registerHelper('ife', function (v1, v2, options) {
    if (v1 === v2) return options.fn(this);
    else return options.inverse(this);
  });

  // if v1 > v2
  Handlebars.registerHelper('ifgt', function (v1, v2, options) {
    if (v1 > v2) return options.fn(this);
    else return options.inverse(this);
  });

  // if v1 < v2
  Handlebars.registerHelper('iflt', function (v1, v2, options) {
    if (v1 < v2) return options.fn(this);
    else return options.inverse(this);
  });

  Handlebars.registerHelper('ifor', function (v1, v2) {
    return (v1 || v2); 
  });

  Handlebars.registerHelper('isGM', function (options) {
    if (game.user.isGM) return options.fn(this);
    return options.inverse(this);
  });

  Handlebars.registerHelper('getCharacterActorId', function () {
    return game.user.character.id;
  });

  Handlebars.registerHelper('abs', function (num) {
    return Math.abs(num);
  });

  Handlebars.registerHelper('isArray', function (value, options) {
    if(Array.isArray(value)){
      return options.fn(this);
    }
    return options.inverse(this);
  });

  Handlebars.registerHelper('stringify', function (value) {
    return JSON.stringify(value);
  });

  Handlebars.registerHelper('frCfg', function (obj, val) {
    console.log(this.config, obj)

    //if(! Object.keys(obj).includes(val)) return undefined;
    console.log(obj[val])
    return game.i18n.localize( obj[val] );
  });

  Handlebars.registerHelper('isdefined', function (value) {
    return value === 0 ? true : typeof (value) !== undefined && value !== null;
  });
  
  // value in array
  Handlebars.registerHelper('ifIn', function(elem, list, options) {
    if(list.indexOf(elem) > -1) {
      return options.fn(this);
    }
    return options.inverse(this);
  });

  // if empty 
  Handlebars.registerHelper('ifempty', function(value) {
    return (value === "");
  });

  // Ifis not equal
  Handlebars.registerHelper('ifne', function (v1, v2, options) {
    if (v1 !== v2) return options.fn(this);
    else return options.inverse(this);
  });

  // if not
  Handlebars.registerHelper('ifn', function (v1, options) {
    if (!v1) return options.fn(this);
    else return options.inverse(this);
  });

  // if all true
  Handlebars.registerHelper('ifat', function (...args) {
    // remove handlebar options
    let options = args.pop();
    return args.indexOf(false) === -1 ? options.fn(this) : options.inverse(this);
  });
};