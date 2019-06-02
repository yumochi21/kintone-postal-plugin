jQuery.noConflict();

(function ($, PLUGIN_ID) {
  'use strict';

  // プラグインIDの設定
  var KEY = PLUGIN_ID;
  var CONF = kintone.plugin.app.getConfig(KEY);

  function escapeHtml(htmlstr) {
    return htmlstr.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;').replace(/'/g, '&#39;');
  }

  function setDropdown() {
    // フィールド型が「文字列（１行）」「数値」のフィールド情報を取得し、選択ボックスに代入する
    KintoneConfigHelper.getFields(['SINGLE_LINE_TEXT', 'NUMBER']).then(function (resp) {
      for (var i = 0; i < resp.length; i++) {
        var prop = resp[i];
        var $option = $('<option>');

        $option.attr('value', escapeHtml(prop.code));
        $option.text(escapeHtml(prop.label));
        $('#select_postalcode_field').append($option.clone());
        $('#select_address_field').append($option.clone());
      }
      // 初期値を設定する
      $('#select_postalcode_field').val(CONF.postalcode);
      $('#select_address_field').val(CONF.address);
    }).catch(function (err) {
      alert(err.message);
    });
  }

  $(document).ready(function () {

    // 既に値が設定されている場合はフィールドに値を設定する
    if (CONF) {
      // ドロップダウンリストを作成する
      setDropdown();
    }

    // 「保存する」ボタン押下時に入力情報を設定する
    $('#postal-plugin-submit').click(function () {
      var config = [];
      var postalcode = $('#select_postalcode_field').val();
      var address = $('#select_address_field').val();

      // 必須チェック
      if (postalcode === '' || address === '') {
        alert('必須項目が入力されていません');
        return;
      }

      config.postalcode = postalcode;
      config.address = address;

      // 重複チェック
      var uniqueConfig = [postalcode, address];
      var uniqueConfig2 = uniqueConfig.filter(function (value, index, self) {
        return self.indexOf(value) === index;
      });
      if (Object.keys(config).length !== uniqueConfig2.length) {
        alert('選択肢が重複しています');
        return;
      }

      kintone.plugin.app.setConfig(config);
    });

    // 「キャンセル」ボタン押下時の処理
    $('#postal-plugin-cancel').click(function () {
      history.back();
    });
  });

})(jQuery, kintone.$PLUGIN_ID);
