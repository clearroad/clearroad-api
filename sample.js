(function() {
  var type = '';

  function updateType(el) {
    type = el.options[el.selectedIndex].value;
  }

  function validate(e) {
    e.preventDefault();

    document.getElementById('log').innerHTML = '<p>Started...</p>'; // cleanup logs
    document.getElementById('result').innerHTML = ''; // cleanup logs

    var url = document.querySelector("[name='url']").value;
    var accessToken = document.querySelector("[name='token']").value || null;
    var typeAccessToken = document.querySelector("[name='type_token']").value || null;
    window.cr = new ClearRoad(url, accessToken, {
      type: type,
      accessToken: typeAccessToken
    });

    eval(document.querySelector("[name='usercode']").value);
  }

  var c = {};
  function wrap(key) {
    c[key] = console[key];
    console[key] = function () {
      document.getElementById('log').innerHTML += JSON.parse(JSON.stringify(arguments[0])) + '<br />';
      if (typeof c[key] === "function") {
        c[key].apply(console, arguments);
      }
    };
  }

  function init() {
    document.getElementById('form').onsubmit = validate;
    if (typeof console !== "undefined" && console) {
      wrap("log");
      wrap("info");
      wrap("warn");
      wrap("error");
    };

    var typeEl = document.querySelector("[name='type']");
    typeEl.onchange = function() {
      updateType(this);
      document.querySelector("[name='type_token']").style.display = type === 'indexeddb' ? 'none' : 'inline';
    };
    updateType(typeEl);
  }

  init();
})();
