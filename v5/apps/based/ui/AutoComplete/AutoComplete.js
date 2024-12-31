export default class Autocomplete {
    constructor(inputSelector, resultsContainer, suggestions = ['apple', 'orange', 'pear']) {
      // console.log('Autocomplete constructor', inputSelector, resultsContainer, suggestions);
      this.input = $(inputSelector, resultsContainer).get(0);
      this.suggestions = suggestions;
      this.results = document.createElement('div');
      this.results.className = 'autocomplete-results';
      resultsContainer.appendChild(this.results);
      this.initEvents();
    }
  
    initEvents() {
      this.input.addEventListener('input', () => this.onInputChange());
      this.input.addEventListener('blur', () => setTimeout(() => this.results.style.display = 'none', 150));
      this.results.addEventListener('click', (event) => this.onItemClick(event));
      this.input.addEventListener('keydown', (event) => this.onKeyDown(event));

    }
  
    onInputChange() {
      const value = this.input.value.trim();
      if (value) {
        this.fetchSuggestions(value, suggestions => {
          this.showSuggestions(suggestions);
        });
      } else {
        this.results.style.display = 'none';
      }
    }
  
    fetchSuggestions(query, callback) {
      // Simulate a fetch call
      const suggestions = this.suggestions.filter(item =>
        item.toLowerCase().startsWith(query.toLowerCase())
      );
      callback(suggestions);
    }
  
    showSuggestions(suggestions) {
      this.results.innerHTML = ''; // Clear previous results
      suggestions.forEach(suggestion => {
        const item = document.createElement('div');
        item.className = 'autocomplete-item';
        item.textContent = suggestion;
        this.results.appendChild(item);
      });
      this.results.style.display = 'block'; // Show results
    }
  
    onItemClick(event) {
      if (event.target.className === 'autocomplete-item') {
        this.input.value = event.target.textContent;
        this.results.style.display = 'none';
      }
    }

    onKeyDown(event) {
      // TODO: this isn't quite right, should highlight and show as selected
      const items = this.results.querySelectorAll('.autocomplete-item');
      let index = Array.from(items).indexOf(document.activeElement);
      // console.log('event.key', event.key);
      if (event.key === 'ArrowDown') {
        event.preventDefault();
        index = (index + 1) % items.length;
        items[index].focus();
      } else if (event.key === 'ArrowUp') {
        event.preventDefault();
        index = (index - 1 + items.length) % items.length;
        items[index].focus();
      } else if (event.key === 'Enter') {
        event.preventDefault();
        if (document.activeElement.classList.contains('autocomplete-item')) {
          this.input.value = document.activeElement.textContent;
          this.results.style.display = 'none';
        }
      }
    }
  }
  