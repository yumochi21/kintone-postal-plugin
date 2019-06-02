jQuery.noConflict();

(function ($, PLUGIN_ID) {
  'use strict';

  var MODE_ON = '1';

  var CONFIG = kintone.plugin.app.getConfig(PLUGIN_ID);

  if (!CONFIG) {
    return false;
  }

  var CONFIG_POSTAL = CONFIG.postalcode;
  var CONFIG_ADDRESS = CONFIG.address;

  var getAddress = function (event) {

    var postalcode = event.changes.field.value;
    postalcode = postalcode.replace( /-/g , "" ) ;
    if (postalcode === null || postalcode.length < 7) return;

    return new kintone.Promise(function (resolve, reject) {

      $.ajax({
        url: 'https://madefor.github.io/postal-code-api/api/v1/' + postalcode.slice(0, 3) + '/' + postalcode.slice(3, 7) + '.json',
        type: 'GET'
      }).done(function (result) {

        if (result.data.length === 0) {
          resolve(event);
        }

        var res = result.data[0].ja;
        var address = res.prefecture + res.address1 + res.address2 + res.address3 + res.address4;

        var record = kintone.app.record.get();
        record.record[CONFIG_ADDRESS].value = address;
        kintone.app.record.set(record);

        resolve(event);
      }).fail(function(error) {
        resolve(event);
      })
    });
  };

  kintone.events.on([
    'app.record.create.change.' + CONFIG_POSTAL,
    'app.record.edit.change.' + CONFIG_POSTAL,
    'app.record.index.edit.change.' + CONFIG_POSTAL
  ], function (event) {
    getAddress(event);
  });

})(jQuery, kintone.$PLUGIN_ID);
