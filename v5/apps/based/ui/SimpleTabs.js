export default class SimpleTabs {
  constructor(selector, root = document) {
      this.container = $(selector, root);
      this.container.addClass('tabs-container');
      this._onTabCallbacks = [];
      this.init();
  }

  onTab(callback) {
      // Correctly reference the instance property
      this._onTabCallbacks.push(callback);
  }

  _onTab(tabId) {
      // Call all registered callbacks
      this._onTabCallbacks.forEach(callback => callback(tabId));
  }

  init() {
      // Setup the tabs and panels
      this.container.find('.tab-content').hide();
      this.container.find('.tab-content').first().show();
      this.container.find('.tab-list li').first().addClass('active');

      // Event listener for tab clicks
      this.container.find('.tab-list li a').on('click', (e) => {
          e.preventDefault();
          const tabId = $(e.target).attr('href');

          if (!tabId || tabId.startsWith("#") === false) {
              console.warn("Invalid tab href:", tabId);
              return;
          }

          this.navigateToTab(tabId);
      });
  }

  navigateToTab(tabId) {
      // Ensure tab exists before switching
      if (!this.container.find(tabId).length) {
          console.warn(`Tab with ID ${tabId} not found.`);
          return;
      }

      this.container.find('.tab-list li').removeClass('active');
      this.container.find(`.tab-list li a[href="${tabId}"]`).parent().addClass('active');

      this.container.find('.tab-content').hide();
      this.container.find(tabId).show();

      this._onTab(tabId);
  }
}
