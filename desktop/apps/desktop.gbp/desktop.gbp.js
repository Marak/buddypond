desktop.app.gbp = {};
desktop.app.gbp.label = 'GBP';
desktop.app.gbp.icon = 'folder';

desktop.app.gbp.depositAddresses = {
  'BTC': '148dBGs99rnFHSu3euZYziABse6Prs5L7J',
  'ETH': 'buddypond.eth'
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
      $('.estimatedCostUSD').html('$' + (gbpAmount * marketData.gbpExpectedValue));
      
      let ethCost = (gbpAmount * marketData.gbpExpectedValue) / prices['ETH'];
      $('.estimatedCostETH').html(ethCost);

      let btcCost = (gbpAmount * marketData.gbpExpectedValue) / prices['BTC'];
      $('.estimatedCostBTC').html(btcCost);

      //let dogeCost = (gbpAmount * marketData.gbpActualValue) / prices['DOGE'];
      //$('.estimatedCostDOGE').html(dogeCost);

      //$('.estimatedCostBTC').html((amount / prices['BTC']));
      //$('.estimatedCostDOGE').html((amount / prices['DOGE']));
    }

    $('.gbpAmount').on('change', function () {
      let gbpAmount = $(this).val();
      updatePurchaseCosts(gbpAmount);
    });

    $('.gbpAmount').on('keyup', function () {
      var max = parseInt($(this).attr('max'));
       var min = parseInt($(this).attr('min'));
       if ($(this).val() > max) {
         $(this).val(max);
       } else if ($(this).val() < min) {
         $(this).val(min);
       }
       let gbpAmount = $(this).val();

      
      updatePurchaseCosts(gbpAmount);
    });

    $('.buyGBPForm').on('submit', function () {
      return false;
    });

    $('.buyGBPButton').on('click', function () {
      
      //$('.importantConfirmationsScreen').show();
      $('.buyGBPForm').fadeOut()
      // TODO
      // $('.pendingGBPPurchase').fadeIn()
      return;
      
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

    $('.depositAddresses').hide();
    $('.buyGBPButton').attr('disabled', true);
    $('.buyGBPButton').removeClass('desktopButton');

    buddypond.getGbpMarket(function(err, data){
      marketData = data;
      prices = data.prices;
      $('.gbpAmount').attr('max', 100000000);
      $('.gbpAmount').attr('min', 1);
      $('.marketCap').html(desktop.utils.usdFormat.format(data.total));
      $('.projectedMarketCap').html(desktop.utils.usdFormat.format(data.expected));
      $('.totalGbpSupply').html(desktop.utils.numberFormat.format(data.supply));
      $('.marketValue').html(desktop.utils.usdFormatSmall.format(data.gbpExpectedValue));
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
          });
          updatePurchaseCosts(42);
          $('#gbpTabs').tabs();
        });
      });
      next();
    });

  });
};
