export default class SimpleTabs {
    constructor(selector, root = document) {
      this.container = $(selector, root);
      this.container.addClass('tabs-container');
      this.init();
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
  
        // Change active tab
        this.container.find('.tab-list li').removeClass('active');
        $(e.target).parent().addClass('active');
  
        // Show the current tab
        this.container.find('.tab-content').hide();
        $(tabId).show();
      });
    }
  }
