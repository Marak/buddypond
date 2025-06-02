export default function applyData(el, data) {
    const $el = $(el);
  
    console.log('incoming transfer card data', data);

    // Ensure data exists and provide defaults
    const safeData = {
      from: data.from || 'Unknown',
      amount: data.amount || '0',
      symbol: data.symbol || 'N/A',
      price: data.price || '0.00',
      value: data.amount * data.price
    };
  
    // Helper function to format currency with dynamic precision
    function formatCurrency(value) {
      // Convert to number, handle non-numeric inputs
      const num = parseFloat(value);
      if (isNaN(num)) return '$0.00';
  
      // Use toLocaleString for clean formatting, up to 8 decimals, removing trailing zeros
      return (
        '$' +
        num.toLocaleString('en-US', {
          minimumFractionDigits: 2,
          maximumFractionDigits: 8,
        }).replace(/\.?0+$/, '')
      );
    }
  
    // Update card content
    $el.find('.card-transfer-from').text(safeData.from);
    $el.find('.card-transfer-amount').text(safeData.amount);
    $el.find('.card-transfer-symbol').text(safeData.symbol);
    $el.find('.card-transfer-price').text(formatCurrency(safeData.price));
    $el.find('.card-transfer-value').text(formatCurrency(safeData.value));
  
    // Handle error if present
    if (data.error) {
      $el.find('.card-error').text(data.error).show();
    } else {
      $el.find('.card-error').hide();
    }

    // check if message.ctime is less than 10 seconds ago
    const now = Date.now();
    const messageCtime = new Date(data.message.ctime).getTime();
    if (now - messageCtime < 10000) {
      // updates local coin balance
      this.bp.apps.buddylist.client.wsClient.send(JSON.stringify({
          action: 'getCoinBalance',
          buddyname: this.bp.me,
          qtokenid: this.bp.qtokenid,
      }));
    }

  }