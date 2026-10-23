/* VeriPura Food cost estimator.
   One source for food.html (data-mode="compact") and food-estimator.html (data-mode="full").
   Everything runs in the browser. Nothing is stored or sent unless the visitor chooses to contact us. */
(function () {
  var app = document.getElementById('est-app');
  if (!app) return;
  var full = app.getAttribute('data-mode') === 'full';

  // Pricing as shown to visitors: percentage of shipment value per shipment checked, with a minimum.
  var FEE_PCT = 0.8;
  var MIN_USD = 100;
  // Indicative rates per 1 USD. Used only to show the minimum fee in the chosen currency.
  var CUR = [
    ['USD', 'US dollar', 1], ['EUR', 'Euro', 0.92], ['GBP', 'British pound', 0.79], ['AUD', 'Australian dollar', 1.53],
    ['BRL', 'Brazilian real', 5.05], ['CAD', 'Canadian dollar', 1.36], ['CNY', 'Chinese yuan', 7.23], ['INR', 'Indian rupee', 83.3],
    ['JPY', 'Japanese yen', 150], ['MXN', 'Mexican peso', 17], ['NZD', 'New Zealand dollar', 1.65], ['SGD', 'Singapore dollar', 1.35],
    ['KRW', 'South Korean won', 1350], ['CHF', 'Swiss franc', 0.9], ['THB', 'Thai baht', 36], ['AED', 'UAE dirham', 3.67]
  ];
  // Fictional values for "Try an example". Not customer data.
  var EXAMPLE = {
    rate: 50, ships: 100, value: 25000,
    hDocs: 1, hLabel: 1, hFix: 1, hHs: 1, hHold: 1,
    rej: 2, del: 2, days: 5, avoid: 75
  };
  // Cargo presets (USD per day, spoilage and late-fee % per day, hint). Visitors can edit both values.
  var PRESETS = {
    dry: [500, 0.5, 'Base port demurrage'],
    cold: [750, 1.5, 'Includes a reefer surcharge'],
    peri: [750, 3, 'Includes a reefer surcharge']
  };

  function num(id) {
    var el = document.getElementById('est-' + id);
    var v = el ? parseFloat(el.value) : 0;
    return isFinite(v) && v > 0 ? v : 0;
  }
  function pct(id) { return Math.min(num(id), 100); }
  function field(id, label, hint, extra) {
    return '<label><span>' + label + '</span><input id="est-' + id + '" type="number" inputmode="decimal" min="0" step="any" placeholder="0"' + (extra || '') + '>' +
      (hint ? '<small>' + hint + '</small>' : '') + '</label>';
  }
  var cur = '<span data-cur>USD</span>';

  var opts = CUR.map(function (c) { return '<option value="' + c[0] + '">' + c[0] + ', ' + c[1] + '</option>'; }).join('');

  var more =
    '<div class="est-grp">' +
      '<p class="est-sub">Leave these empty if you only want the time estimate.</p>' +
      '<div class="est-grid">' +
        field('rej', 'Shipments rejected (%)', 'Rejected at the border. Industry avg: 2%', ' max="100"') +
        field('del', 'Shipments delayed (%)', 'Held for checks or inspection. Industry avg: 2%', ' max="100"') +
        field('days', 'Average days of delay', 'Days a container sits held at the border') +
        '<label><span>Food or cargo type</span><select id="est-cargo"><option value="">Choose a type</option>' +
          '<option value="dry">Dry goods</option><option value="cold">Cold chain</option><option value="peri">Perishable</option></select>' +
          '<small>Suggests the port cost and spoilage rate. You can edit both.</small></label>' +
        field('hold', 'Port cost per day (' + cur + ')', 'Storage, demurrage, detention, reefer power') +
        field('spoil', 'Spoilage and late fees (% per day)', 'Applied to the shipment value for every day of delay', ' max="100"') +
      '</div>' +
    '</div>';

  app.innerHTML =
    '<div class="est">' +
      '<div class="est-in">' +
        '<div class="est-grp">' +
          '<h3>Your team and volume</h3>' +
          '<div class="est-grid">' +
            '<label><span>Currency</span><select id="est-cur">' + opts + '</select></label>' +
            field('rate', 'Hourly cost of your team (' + cur + ')', 'Loaded cost of a compliance or logistics hour') +
            field('ships', 'Shipments per year', '') +
            field('value', 'Average shipment value (' + cur + ')', 'Also sets the VeriPura fee') +
          '</div>' +
        '</div>' +
        '<div class="est-grp">' +
          '<h3>Hours per shipment</h3>' +
          '<p class="est-sub">Time your team spends on each shipment today.</p>' +
          '<div class="est-grid">' +
            field('hDocs', 'Health certificates and lab reports', 'Chasing and reading them') +
            field('hLabel', 'Label checks', 'Ingredients, allergens, local rules') +
            field('hFix', 'Fixing document errors', 'Batch codes, origin, weights') +
            field('hHs', 'Tariff and HS code checks', 'Classification and duty') +
            field('hHold', 'Handling customs and sanitary holds', 'Re-inspection, quarantine, calls') +
          '</div>' +
        '</div>' +
        '<details class="est-more" id="est-more"' + (full ? ' open' : '') + '>' +
          '<summary>Add rejections and delays</summary>' + more +
        '</details>' +
        '<div class="est-grp">' +
          '<h3>Your assumption</h3>' +
          '<div class="est-grid">' +
            field('avoid', 'Share of this cost VeriPura Food™ helps you avoid (%)', 'Adjust to your own case.', ' value="75" max="100"') +
          '</div>' +
        '</div>' +
        '<div class="est-actions">' +
          '<button type="button" class="btn btn-ghost" id="est-example">Try an example</button>' +
          '<button type="button" class="btn btn-ghost" id="est-clear">Clear</button>' +
        '</div>' +
      '</div>' +
      '<div class="est-out" aria-labelledby="est-h">' +
        '<div><h3 id="est-h">Your estimate</h3><p class="est-note">Built from the numbers you entered. Nothing leaves your browser.</p></div>' +
        '<p class="est-empty" id="est-empty">Enter your hours, hourly cost and shipments per year to see the estimate.</p>' +
        '<div class="est-res" id="est-res" hidden>' +
          '<div><span class="est-lab">What this costs your team today, per year</span><span class="est-big" id="est-total" aria-live="polite"></span></div>' +
          '<div><div class="est-bar" id="est-bar" role="img" aria-label="Where the cost sits"><span class="b1"></span><span class="b2"></span><span class="b3"></span></div>' +
          '<ul class="est-rows">' +
            '<li><i class="est-sw b1"></i><span>Team time</span><b id="est-r1"></b></li>' +
            '<li><i class="est-sw b2"></i><span>Rejections</span><b id="est-r2"></b></li>' +
            '<li><i class="est-sw b3"></i><span>Delays at port</span><b id="est-r3"></b></li>' +
          '</ul></div>' +
          '<div class="est-kpis">' +
            '<div><b id="est-sav"></b><span id="est-savl">Estimated savings per year</span></div>' +
            '<div><b id="est-cost"></b><span>VeriPura Food™ cost per year</span></div>' +
            '<div><b id="est-net"></b><span>Net savings per year</span></div>' +
            '<div><b id="est-roi"></b><span>Annual ROI</span></div>' +
          '</div>' +
          '<div class="est-callout"><strong>Food Safety &amp; Brand Protection</strong>Substantially reduces labor costs, recall risks, undeclared allergen risks, missing health cert holds, reefer electricity surcharges, shelf-life degradation, and late delivery retailer fees.</div>' +
          '<p class="est-price" id="est-price"></p>' +
          '<p class="est-note">* Estimated savings reflect workflow efficiency gains, assuming VeriPura eliminates the share of documented waste set above. Perishable and cold-chain selections adjust the port holding rate (reefer power) and the daily spoilage and late-delivery percentage. Platform costs apply a validation percentage subject to a minimum fee per shipment. It is your estimate, not a measured result. Your team makes the decision.</p>' +
        '</div>' +
        '<p class="est-ill" id="est-ill" hidden>Illustrative example. Fictional numbers, not customer data.</p>' +
        '<div class="est-cta">' +
          '<a class="btn btn-solid" href="https://food.veripura.com/">Free trial</a>' +
          '<a class="btn btn-ghost" href="#contact" id="est-send">Contact us about this estimate</a>' +
        '</div>' +
      '</div>' +
    '</div>' +
    (full ? '' : '<p class="est-full"><a href="food-estimator.html">Open the full estimator</a></p>');

  var sel = document.getElementById('est-cur');
  var last = { text: '' };
  var prevRate = 1;

  function rate() {
    for (var i = 0; i < CUR.length; i++) if (CUR[i][0] === sel.value) return CUR[i][2];
    return 1;
  }
  function money(v) {
    try {
      return new Intl.NumberFormat('en', { style: 'currency', currency: sel.value, maximumFractionDigits: 0 }).format(Math.round(v));
    } catch (e) { return sel.value + ' ' + Math.round(v).toLocaleString('en'); }
  }
  function show(id, t) { document.getElementById('est-' + id).textContent = t; }

  function update() {
    document.querySelectorAll('#est-app [data-cur]').forEach(function (n) { n.textContent = sel.value; });

    var ships = num('ships'), value = num('value'), r = num('rate');
    var hours = num('hDocs') + num('hLabel') + num('hFix') + num('hHs') + num('hHold');

    var team = hours * ships * r;
    var rejected = ships * (pct('rej') / 100);
    var rejection = rejected * value;
    var delayed = ships * (pct('del') / 100);
    var delay = delayed * num('days') * num('hold') + delayed * value * (pct('spoil') / 100) * num('days');
    var total = team + rejection + delay;

    var empty = document.getElementById('est-empty'), res = document.getElementById('est-res');
    if (total <= 0) {
      empty.hidden = false; res.hidden = true; last.text = '';
      setSend(0, 0, 0, 0, 0);
      return;
    }
    empty.hidden = true; res.hidden = false;

    var avoid = pct('avoid');
    var savings = total * (avoid / 100);
    var minFee = Math.round(MIN_USD * rate());
    var rawFee = value * (FEE_PCT / 100);
    var feePer = Math.max(minFee, rawFee);
    var platform = ships * feePer;
    var net = savings - platform;

    show('total', money(total));
    var parts = [team, rejection, delay];
    var bar = document.getElementById('est-bar').children;
    for (var i = 0; i < 3; i++) {
      bar[i].style.width = (parts[i] / total * 100).toFixed(2) + '%';
      show('r' + (i + 1), money(parts[i]));
    }
    // Share next to each amount, as text, so colour is never the only signal.
    ['r1', 'r2', 'r3'].forEach(function (id, i) {
      var b = document.getElementById('est-' + id);
      var em = b.querySelector('em');
      if (!em) { em = document.createElement('em'); b.appendChild(em); }
      em.textContent = Math.round(parts[i] / total * 100) + '%';
    });

    if (avoid > 0) {
      show('sav', money(savings));
      show('savl', 'Estimated savings per year, at ' + avoid + '%');
      show('net', money(net));
      show('roi', platform > 0 ? Math.round(net / platform * 100).toLocaleString('en') + '%' : 'n/a');
    } else {
      show('sav', 'Set a share above');
      show('savl', 'Estimated savings per year');
      show('net', 'n/a');
      show('roi', 'n/a');
    }
    show('cost', ships > 0 ? money(platform) : 'n/a');

    var price = 'Pricing used: ' + FEE_PCT + '% of shipment value per shipment checked, with a minimum of ' + money(minFee) + ' per shipment.';
    if (sel.value !== 'USD') price += ' The minimum is converted at an indicative exchange rate.';
    if (!value) price += ' Add an average shipment value for the exact fee.';
    if (avoid > 0 && net < 0 && rejection + delay === 0) price += ' This counts team time only. Add rejections and delays for the full picture.';
    show('price', price);

    setSend(ships, total, savings, avoid, platform);
  }

  function setSend(ships, total, savings, avoid, platform) {
    var a = document.getElementById('est-send');
    var t = '';
    if (total > 0) {
      t = 'Cost estimate from the website (my own inputs). Shipments per year: ' + Math.round(ships).toLocaleString('en') +
        '. Cost today: ' + money(total) + ' per year.' +
        (avoid > 0 ? ' Savings at ' + avoid + '%: ' + money(savings) + '. VeriPura cost at the published pricing: ' + money(platform) + '.' : '');
    }
    last.text = t;
    if (!document.getElementById('form')) {
      a.setAttribute('href', 'food.html' + (t ? '?est=' + encodeURIComponent(t.slice(0, 480)) : '') + '#contact');
    }
  }

  function set(id, v) { var el = document.getElementById('est-' + id); if (el) el.value = v === '' ? '' : v; }
  function ill(on) { document.getElementById('est-ill').hidden = !on; }

  document.getElementById('est-example').addEventListener('click', function () {
    sel.value = 'USD'; prevRate = 1;
    Object.keys(EXAMPLE).forEach(function (k) { set(k, EXAMPLE[k]); });
    document.getElementById('est-more').open = true;
    var c = document.getElementById('est-cargo'); c.value = 'peri'; c.dispatchEvent(new Event('change'));
    ill(true); update();
  });
  document.getElementById('est-clear').addEventListener('click', function () {
    app.querySelectorAll('input').forEach(function (i) { i.value = ''; });
    set('avoid', 75);
    document.getElementById('est-cargo').value = ''; holdHint.textContent = holdHintDefault;
    ill(false); update();
  });
  app.addEventListener('input', function (e) {
    if (e.target.id !== 'est-cur') ill(false);
    update();
  });
  // Cargo type suggests the port cost and spoilage rate. Both stay editable.
  var holdHint = document.getElementById('est-hold').parentNode.querySelector('small');
  var holdHintDefault = holdHint.textContent;
  function surcharge() { return ' (about ' + money(250 * rate()) + ' a day)'; }
  document.getElementById('est-cargo').addEventListener('change', function (e) {
    var p = PRESETS[e.target.value];
    if (!p) { holdHint.textContent = holdHintDefault; update(); return; }
    set('hold', Math.round(p[0] * rate()));
    set('spoil', p[1]);
    holdHint.textContent = p[2] + (e.target.value === 'dry' ? '' : surcharge());
    ill(false); update();
  });
  document.getElementById('est-hold').addEventListener('input', function () { holdHint.textContent = 'Your own figure'; });

  // Switching currency converts the money fields at the same indicative rates.
  sel.addEventListener('change', function () {
    var ratio = rate() / prevRate;
    ['rate', 'value', 'hold'].forEach(function (id) {
      var el = document.getElementById('est-' + id);
      var v = parseFloat(el.value);
      if (isFinite(v) && v > 0) el.value = Math.round(v * ratio);
    });
    prevRate = rate();
    update();
  });

  // On the Food page, carry the estimate into the contact form.
  document.getElementById('est-send').addEventListener('click', function () {
    var form = document.getElementById('form');
    if (!form) return;
    var ta = form.querySelector('[name="problem"]'), h = form.querySelector('[name="asked_about"]');
    if (h) h.value = 'Cost estimate';
    if (ta && last.text) ta.value = last.text;
  });

  update();
})();
