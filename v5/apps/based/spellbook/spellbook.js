import client from './lib/client.js';
import castSpell from './lib/castSpell.js';
import spellData from './lib/spellData.js';
import calculateCost from './lib/calculateCost.js';

export default class Spellbook {
  constructor(bp, options = {}) {
    this.bp = bp;
    this.data = spellData;
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
        icon: 'desktop/assets/images/icons/icon_spellbook_64.png',
        x: 250,
        y: 75,
        width: 400,
        height: 420,
        minWidth: 200,
        minHeight: 200,
        parent: $('#desktop')[0],
        content: this.html,
        resizable: false, // no works?
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
        const spellsList = this.data[spellType];
        const $spellName = $('#spellName', $content);
        console.log('updateSpellsDropdown', spellType, spellsList);
        $spellName.empty();
        spellsList.forEach((spell) => {

          let disabled = '';

          // check spell.config.targets
          if (!spell.config || !spell.config.targets) {
            disabled = 'disabled';
          }
          // TODO: uncomment / add role check from session
          // Remark: This is validated server-side
          /*
          // Ensures that admins can cast any spell
          if (this.bp.me === 'Marak') {
            disabled = '';
          }
          */
          $spellName.append(`<option ${disabled} value="${spell.name}">${spell.label || spell.name} (${spell.costText})</option>`);
        });

        // Sort spells
        // Step 1: Group by disabled status (enabled first, disabled last)
        let options = $spellName.find('option').get().sort((a, b) => {
          const aDisabled = $(a).prop('disabled') ? 1 : 0;
          const bDisabled = $(b).prop('disabled') ? 1 : 0;
          return aDisabled - bDisabled;
        });

        // Step 2: Sort alphabetically while preserving groups
        options = options.sort((a, b) => {
          const aDisabled = $(a).prop('disabled') ? 1 : 0;
          const bDisabled = $(b).prop('disabled') ? 1 : 0;

          // Preserve group order: enabled (0) before disabled (1)
          if (aDisabled !== bDisabled) {
            return aDisabled - bDisabled;
          }

          // Sort alphabetically within groups
          return $(a).val().localeCompare($(b).val(), 'en', { sensitivity: 'base' });
        });

        // Append sorted options back to the select
        $spellName.empty().append(options);
        // prepend as first option
        $spellName.prepend('<option value="" selected>Choose your spell wisely...</option>');

        updateConfigForm();
      };

      const updateValidTargets = () => {
        const spellName = $('#spellName', $content).val();
        // get the spellData ref
        const spellType = $('#spellType', $content).val();
        const spellsList = this.data[spellType];
        const spell = spellsList.find((s) => s.name === spellName);
        const spellConfig = spell.config;

        // check the spellConfig.targets and then update the targetType dropdown with disabled options such that any values
        // not found in the spellConfig.targets are disabled
        console.log('updateValidTargets', spellName, spellType, spell);
        const $targetType = $('#spellTargetType', $content);
        $targetType.empty().append('<option value="">Choose your target wisely...</option>');
        if (spellConfig && spellConfig.targets) {
          let allTargets = ['self', 'buddy', 'pond'];
          allTargets.forEach((value) => {
            let disabled = 'disabled';
            if (spellConfig.targets.includes(value)) {
              disabled = '';
            }
            // TODO: uncomment / add role check from session
            // Remark: This is validated server-side
            // Ensures that admins can choose any target
            /*
            if (this.bp.me === 'Marak') {
                disabled = '';
            }
            */
            // upperCast first letter
            const targetLabel = value.charAt(0).toUpperCase() + value.slice(1);
            $targetType.append(`<option ${disabled} value="${value}">${targetLabel}</option>`);
          });
          // if only one targetType, select it
          if (Object.keys(spellConfig.targets).length === 1) {
            const targetType = spellConfig.targets[0];
            console.log('updateValidTargets - only one targetType', targetType);
            $targetType.val(targetType);
          }
        } else {
          $targetType.append('<option disabled value="self">Self</option>');
        }
      }

      // Populate config form based on selected spell
      const updateConfigForm = () => {
        const spellName = $('#spellName', $content).val();
        const spellType = $('#spellType', $content).val();
        const spellsList = this.data[spellType];
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
      $('#spellName', $content).on('change', updateValidTargets);
      $('#spellTargetType', $content).on('change', updateTargetVisibility);
      // spellDuration is a slider, needs to update on slide
      $('#spellDuration', $content).on('input', (e) => {
        const duration = parseInt($(e.target).val(), 10);
        const spellType = $('#spellType', $content).val();
        const spellName = $('#spellName', $content).val();
        const _spellData = this.data[spellType].find((s) => s.name === spellName);
        const spellCost = calculateCost(_spellData, { duration });
        $('#spellCost', $content).text(`Total cost: ${spellCost} buddy points`);
      });

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
      $('#castSpellForm', $content).on('submit', async (e) => {
        e.preventDefault();


        const spellType = $('#spellType', $content).val();
        const spellName = $('#spellName', $content).val();
        const targetType = $('#spellTargetType', $content).val();
        const spellDuration = $('#spellDuration', $content).val();
        const _spellData = this.data[spellType].find((s) => s.name === spellName);
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

        config.duration = spellDuration;

        let totalCost = calculateCost(_spellData, config);
        console.log(`Casting ${spellName} on ${target} with a total cost of ${totalCost} buddy points.`);

        if (spellName && target) {
          try {
            let result = await this.castSpell(target, spellName, { type: spellType, config });
            if (result && result.error) {
              // display error message
              $('.spell-message', $content).addClass('error');
              $('.spell-message', $content).text(result.error).show();
            } else {
              // display success message
              $('.spell-message', $content).removeClass('error');
              $('.spell-message', $content).text('Spell cast successfully!').show();
            }
          } catch (error) {
            throw new Error(`Error casting spell: ${error.message}`);
          }

          console.log('Spell cast result:', result);
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