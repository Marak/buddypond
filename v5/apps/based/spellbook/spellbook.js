import client from './lib/client.js';
import castSpell from './lib/castSpell.js';

export default class Spellbook {
  constructor(bp, options = {}) {
    this.bp = bp;
    // Define spells and curses as objects with name, description, cost, and config
    this.spells = [
      {
        name: 'zalgo',
        description: 'Corrupts text with chaotic glyphs.',
        cost: 'ඞ3',
        config: { intensity: { type: 'number', label: 'Intensity', value: 10, min: 1, max: 50 } },
      },
      {
        name: 'ebublio',
        description: 'Traps target in a bubble.',
        cost: 'ඞ2',
        config: { duration: { type: 'number', label: 'Duration (seconds)', value: 30, min: 10, max: 300 } },
      },
      {
        name: 'cure',
        description: 'Removes a curse from the target.',
        cost: 'ඞ4',
        config: {},
      },
      {
        name: 'rickroll',
        description: 'Plays a classic prank video.',
        cost: 'ඞ1',
        config: { url: { type: 'text', label: 'Video URL', value: 'https://youtu.be/dQw4w9WgXcQ' } },
      },
      {
        name: 'forbiddenRickRoll',
        description: 'An inescapable prank video.',
        cost: 'ඞ2',
        config: { url: { type: 'text', label: 'Video URL', value: 'https://youtu.be/dQw4w9WgXcQ' } },
      },
      {
        name: 'passwordisusername',
        description: 'Forces a weak password reset.',
        cost: 'ඞ3',
        config: {},
      },
      {
        name: 'lightning',
        description: 'Strikes with a dazzling bolt.',
        cost: 'ඞ3',
        config: { intensity: { type: 'number', label: 'Intensity', value: 5, min: 1, max: 10 } },
      },
      {
        name: 'fireball',
        description: 'Hurls a fiery projectile.',
        cost: 'ඞ3',
        config: { power: { type: 'number', label: 'Power', value: 5, min: 1, max: 10 } },
      },
      {
        name: 'alert',
        description: 'Displays a custom message.',
        cost: 'ඞ1',
        config: { text: { type: 'text', label: 'Message', value: 'You have been cursed!' } },
      },
      {
        name: 'logout',
        description: 'Forces the target to log out.',
        cost: 'ඞ5',
        config: {},
      },
    ];

    this.curses = [
      {
        name: 'zalgo',
        description: 'Corrupts text with chaotic glyphs for a duration.',
        cost: 'ඞ3',
        config: { duration: { type: 'number', label: 'Duration (seconds)', value: 60, min: 10, max: 300 } },
      },
      {
        name: 'babel.js',
        description: 'Scrambles communication.',
        cost: 'ඞ3',
        config: { intensity: { type: 'number', label: 'Scramble Intensity', value: 5, min: 1, max: 10 } },
      },
      {
        name: 'riddikulus',
        description: 'Turns fears into something funny.',
        cost: 'ඞ2',
        config: { duration: { type: 'number', label: 'Duration (seconds)', value: 30, min: 10, max: 300 } },
      },
      {
        name: 'ebublio',
        description: 'Traps target in a bubble for a duration.',
        cost: 'ඞ2',
        config: { duration: { type: 'number', label: 'Duration (seconds)', value: 30, min: 10, max: 300 } },
      },
      {
        name: 'episkey',
        description: 'Heals minor injuries over time.',
        cost: 'ඞ2',
        config: { duration: { type: 'number', label: 'Duration (seconds)', value: 60, min: 10, max: 300 } },
      },
      {
        name: 'rickroll',
        description: 'Plays a prank video repeatedly.',
        cost: 'ඞ1',
        config: { url: { type: 'text', label: 'Video URL', value: 'https://youtu.be/dQw4w9WgXcQ' } },
      },
      {
        name: 'forbiddenRickRoll',
        description: 'An inescapable prank video for a duration.',
        cost: 'ඞ2',
        config: { duration: { type: 'number', label: 'Duration (seconds)', value: 60, min: 10, max: 300 } },
      },
      {
        name: 'passwordisusername',
        description: 'Forces a weak password for a duration.',
        cost: 'ඞ3',
        config: { duration: { type: 'number', label: 'Duration (seconds)', value: 300, min: 60, max: 3600 } },
      },
      {
        name: 'logout',
        description: 'Forces logout for a duration.',
        cost: 'ඞ5',
        config: { duration: { type: 'number', label: 'Duration (seconds)', value: 300, min: 60, max: 3600 } },
      },
      {
        name: 'banhammer',
        description: 'Temporarily bans the target.',
        cost: 'ඞ10',
        config: { duration: { type: 'number', label: 'Ban Duration (seconds)', value: 600, min: 300, max: 86400 } },
      },
    ];

    return this;
  }

  async init() {
    this.html = await this.bp.load('/v5/apps/based/spellbook/spellbook.html');
    await this.bp.load('/v5/apps/based/spellbook/spellbook.css');
    return 'loaded Spellbook';
  }

  async open() {
    if (!this.spellbookWindow) {
      this.spellbookWindow = this.bp.apps.ui.windowManager.createWindow({
        id: 'spellbook',
        title: 'Spellbook',
        icon: 'desktop/assets/images/icons/icon_console_64.png',
        x: 250,
        y: 75,
        width: 650,
        height: 420,
        minWidth: 200,
        minHeight: 200,
        parent: $('#desktop')[0],
        content: this.html,
        resizable: true,
        minimizable: true,
        maximizable: true,
        closable: true,
        focusable: true,
        maximized: false,
        minimized: false,
        onClose: () => {
          this.spellbookWindow = null;
        },
      });

      const $content = $(this.spellbookWindow.content);

      // Populate spells dropdown based on spellType
      const updateSpellsDropdown = () => {
        const spellType = $('#spellType', $content).val();
        const spellsList = spellType === 'spell' ? this.spells : this.curses;
        const $spellName = $('#spellName', $content);
        $spellName.empty().append('<option value="">Choose your spell wisely...</option>');
        spellsList.forEach((spell) => {
          $spellName.append(`<option value="${spell.name}">${spell.name} (${spell.cost})</option>`);
        });
        updateConfigForm();
      };

      // Populate config form based on selected spell
      const updateConfigForm = () => {
        const spellName = $('#spellName', $content).val();
        const spellType = $('#spellType', $content).val();
        const spellsList = spellType === 'spell' ? this.spells : this.curses;
        const spell = spellsList.find((s) => s.name === spellName);
        const $config = $('#spellConfig', $content);
        $config.empty();
        if (spell && spell.config) {
          Object.entries(spell.config).forEach(([key, config]) => {
            const inputId = `spellConfig-${key}`;
            const $label = $(`<label for="${inputId}">${config.label}</label>`);
            let $input;
            if (config.type === 'number') {
              $input = $(`<input type="number" id="${inputId}" name="spellConfig[${key}]" value="${config.value}" min="${config.min}" max="${config.max}">`);
            } else {
              $input = $(`<input type="text" id="${inputId}" name="spellConfig[${key}]" value="${config.value}">`);
            }
            $config.append($label, $input);
          });
        }
      };

      // Update target visibility based on target type
      const updateTargetVisibility = () => {
        const targetType = $('#spellTargetType', $content).val();
        const spellType = $('#spellType', $content).val();
        $('#spellTargetName, #spellTargetInput, #toggleTargetInput, #spellTargetPond', $content).hide();
        if (targetType === 'buddy') {
          $('#spellTargetName, #toggleTargetInput', $content).show();
        } else if (targetType === 'pond' && spellType === 'spell') {
          $('#spellTargetPond', $content).show();
        } else if (targetType === 'self') {
          // No target input needed for self
        }
      };

      // Initialize dropdowns and events
      $('#spellType', $content).on('change', updateSpellsDropdown);
      $('#spellName', $content).on('change', updateConfigForm);
      $('#spellTargetType', $content).on('change', updateTargetVisibility);

      // Toggle between dropdown and text input for buddy
      let isUsingInput = false;
      $('#toggleTargetInput', $content).on('click', () => {
        isUsingInput = !isUsingInput;
        $('#spellTargetName', $content).toggle(!isUsingInput);
        $('#spellTargetInput', $content).toggle(isUsingInput);
        $('#toggleTargetInput', $content).text(isUsingInput ? 'Choose from list' : 'Choose name not on list');
      });

      // Populate active users
      if (this.bp.apps.buddylist?.data?.activeUsers) {
        this.bp.apps.buddylist.data.activeUsers.forEach((buddy) => {
          $('#spellTargetName', $content).append(`<option value="${buddy}">${buddy}</option>`);
        });
      }

      // Populate active ponds
      if (this.bp.apps.pond?.data?.activePonds) {
        this.bp.apps.pond.data.activePonds.forEach((pond) => {
          $('#spellTargetPond', $content).append(`<option value="${pond}">${pond}</option>`);
        });
      }

      // Autocomplete for target input
      $('#spellTargetInput', $content).autocomplete({
        source: this.bp.apps.buddylist?.data?.activeUsers || [],
      });

      // Form submission
      $('#castSpellForm', $content).on('submit', (e) => {
        e.preventDefault();
        const spellType = $('#spellType', $content).val();
        const spellName = $('#spellName', $content).val();
        const targetType = $('#spellTargetType', $content).val();
        let target = null;
        const config = {};
        if (targetType === 'buddy') {
          target = isUsingInput ? $('#spellTargetInput', $content).val() : $('#spellTargetName', $content).val();
        } else if (targetType === 'pond' && spellType === 'spell') {
          target = $('#spellTargetPond', $content).val();
        } else if (targetType === 'self') {
          target = this.bp.me; // Use current user
        }

        // Collect config values
        $('#spellConfig input', $content).each(function () {
          const name = $(this).attr('name').match(/spellConfig\[(.*)\]/)[1];
          config[name] = $(this).val();
        });

        if (spellName && target) {
          this.castSpell(target, spellName, { type: spellType, config });
        } else {
          alert('Please select a spell and a valid target.');
        }
      });

      // Orb click (alternative cast trigger)
      $('.ponderSpellbook', $content).on('click', (e) => {
        e.preventDefault();
        $('#castSpellForm', $content).trigger('submit');
      });

      // Event listeners for dynamic updates
      this.bp.on('buddy::activeUserAdded', 'update-spellbook-targets', (buddy) => {
        if (!$(`#spellTargetName option[value="${buddy}"]`, $content).length) {
          $('#spellTargetName', $content).append(`<option value="${buddy}">${buddy}</option>`);
        }
      });

      this.bp.on('pond::activeContextAdded', 'update-spellbook-pond-targets', (pond) => {
        if (!$(`#spellTargetPond option[value="${pond}"]`, $content).length) {
          $('#spellTargetPond', $content).append(`<option value="${pond}">${pond}</option>`);
        }
      });

      // Initial setup
      updateSpellsDropdown();
      updateTargetVisibility();
    }
    return this.spellbookWindow;
  }
}

Spellbook.prototype.castSpell = castSpell;
Spellbook.prototype.client = client;