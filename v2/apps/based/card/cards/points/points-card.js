export default function applyData(el, data) {
    console.log("applyData", el, data);
    const $el = $(el);
    let currentValue = 'NO VALUE';
    if (data.value) {
      // currentValue = `<em>ESTIMATED VALUE: ${desktop.utils.usdFormatSmall.format(data.value)}</em>`;
      currentValue = `<em>ESTIMATED VALUE: ${data.value}</em>`;
    }
  
    if (data.action === 'got') {
      $el.find('.points-card-title').html(`${data.from} gave Good Buddy Points to ${data.to}`);
      // $el.find('.points-card-detail').html(`${desktop.utils.numberFormat.format(data.amount)} GOOD BUDDY POINTS`);
        $el.find('.points-card-detail').html(`${data.amount} GOOD BUDDY POINTS`);
      $el.find('.points-card-value').html(currentValue);
    } else {
      let balance = desktop.utils.numberFormat.format(data.balance);
      if (data.balance === 0) {
        balance = 'ZERO';
      }
      $el.find('.points-card-title').html(data.buddyname);
      $el.find('.points-card-detail').html(`${balance} GOOD BUDDY POINTS`);
      $el.find('.points-card-value').html(currentValue);
    }
  }
  