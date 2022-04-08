desktop.app.gbp = {};
desktop.app.gbp.label = 'GBP';
desktop.app.gbp.icon = 'folder';

desktop.app.gbp.depositAddresses = {
  'BTC': '148dBGs99rnFHSu3euZYziABse6Prs5L7J',
  'ETH': '0x150eF95cdB28f7ac32926917b9342C0759DbEe04'
};

desktop.app.gbp.load = function loadDesktopgbp (params, next) {
  desktop.load.remoteAssets([
    'gbp' // this loads the sibling desktop.app.gbp.html file into <div id="window_gbp"></div>
  ], function (err) {
    $('.marketCap').html('123123');
    $('.totalCoins').html('33333');
    $('.marketPrice').html('$123');

    $('#window_gbp').css('width', '66vw');
    $('#window_gbp').css('height', '70vh');
    $('#window_gbp').css('left', 222);
    $('#window_gbp').css('top', 111);

    let prices = {};
    let marketData = {};

    // for now
    $('.buyGBPHolder').hide();

    function updatePurchaseCosts (gbpAmount) {
      $('.estimatedCostUSD').html('$' + (gbpAmount * marketData.gbpActualValue));
      
      let ethCost = (gbpAmount * marketData.gbpActualValue) / prices['ETH'];
      $('.estimatedCostETH').html(ethCost);

      let btcCost = (gbpAmount * marketData.gbpActualValue) / prices['BTC'];
      $('.estimatedCostBTC').html(btcCost);

      let dogeCost = (gbpAmount * marketData.gbpActualValue) / prices['DOGE'];
      $('.estimatedCostDOGE').html(dogeCost);

      //$('.estimatedCostBTC').html((amount / prices['BTC']));
      //$('.estimatedCostDOGE').html((amount / prices['DOGE']));
    }

    $('.gbpAmount').on('change', function () {
      let gbpAmount = $(this).val();
      updatePurchaseCosts(gbpAmount);
    });

    $('.gbpAmount').on('keyup', function () {
      let gbpAmount = $(this).val();
      updatePurchaseCosts(gbpAmount);
    });


    $('.buyGBPForm').on('submit', function () {

      
      return false;
    });
    
    $('.buyGBPButton').on('click', function () {
      buddypond.purchaseGbp({
        buddyname: buddypond.me,
        amount: Number($('.gbpAmount').val()),
        purchaseType: 'ETH',
        currentCost: Number($('.estimatedCostETH').html())
      },function(err, data){
        if (err) {
          alert(err);
        }
      });
    });

    buddypond.getGbpMarket(function(err, data){
      marketData = data;
      prices = data.prices;
      $('.marketCap').html(desktop.utils.usdFormat.format(data.total));
      $('.projectedMarketCap').html(desktop.utils.usdFormat.format(data.expected));
      $('.totalGbpSupply').html(desktop.utils.numberFormat.format(data.supply));
      $('.marketValue').html(desktop.utils.usdFormat.format(data.gbpExpectedValue));
      $('.marketPrice').html(desktop.utils.usdFormat.format(data.gbpActualValue));
      $('.buddyMultiplier').html(data.multiplier + 'x');
      buddypond.getGbpBalance({ buddyname: buddypond.me}, function (err, balance){
        //$('.marketData').html(JSON.stringify(data, true, 2))
        if (balance.gbp) {
          $('.balanceData .points').html(desktop.utils.numberFormat.format(balance.gbp));
        }
        if (balance.value) {
          $('.balanceData .value').html(desktop.utils.usdFormat.format(balance.value));
        }
        if (balance.expectedValue) {
          $('.balanceData .expectedValue').html(desktop.utils.usdFormat.format(balance.expectedValue));
        }
        buddypond.getGbpRecentTransactions({}, function(err, transactions){
          transactions.forEach(function(t){
            $('.recentTransactions').append(`
              <tr>
                <td>${desktop.DateFormat.format.date(new Date(t.createdAt), desktop.dateTimeFormat)}</td>
                <td>${t.from}</td>
                <td>${t.to}</td>
                <td>${t.amount}</td>
                <td>${desktop.utils.usdFormat.format(t.value)}</td>
                <td>${t.text}</td>
              </tr>
              `);
          })
          $('#gbpTabs').tabs();
        });
      });
      next();
    });

  });
};
