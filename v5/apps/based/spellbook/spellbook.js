import client from './lib/client.js';
import castSpell from './lib/castSpell.js';
import spellData from './lib/spellData.js';
import calculateCost from './lib/calculateCost.js';
import submitFormHandler from './lib/submitFormHandler.js';
import updateConfigForm from './lib/updateConfigForm.js';

export default class Spellbook {
  constructor(bp, options = {}) {
    this.bp = bp;
    this.data = spellData;
    return this;
  }

  async init() {
    this.html = await this.bp.load('/v5/apps/based/spellbook/spellbook.html');
    await this.bp.load('/v5/apps/based/spellbook/spellbook.css');

    this.isUsingInput = false;

    return 'loaded Spellbook';
  }

  async open(options = {}) {

    let context = null;
    let output = null;

    if (options.output) { // could be a buddy or a pond
      output = options.output;
    }

    if (options.context) { // could be a buddyname or pond name
      context = options.context;
    }

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


      //
      // Spellbook eventBind listeners
      //
      const $content = $(this.spellbookWindow.content);

      // Initialize dropdowns and events
      $('#spellType', $content).on('change', (e) => {
        updateSpellsDropdown.call(this, $content);
      });
      $('#spellName', $content).on('change', (e) => {
        updateValidTargets.call(this, $content);
      });
      // $('#spellName', $content).on('change', updateConfigForm);
      $('#spellTargetType', $content).on('change', (e) => {
        updateTargetVisibility.call(this, $content);
      });
      // spellDuration is a slider, needs to update on slide
      $('#spellDuration', $content).on('input', (e) => {
        const duration = parseInt($(e.target).val(), 10);
        const spellType = $('#spellType', $content).val();
        const spellName = $('#spellName', $content).val();
        const _spellData = this.data[spellType].find((s) => s.name === spellName);
        const spellCost = calculateCost(_spellData, { duration });
        $('#spellCost', $content).text(`Total cost: ${spellCost} buddy points`);
      });

      $('#toggleTargetInput', $content).on('click', () => {
        this.isUsingInput = !this.isUsingInput;
        $('#spellTargetName', $content).toggle(!this.isUsingInput);
        $('#spellTargetInput', $content).toggle(this.isUsingInput);
        $('#toggleTargetInput', $content).text(this.isUsingInput ? 'Choose from list' : 'Choose name not on list');
      });

      // Populate active users
      if (this.bp.apps.buddylist?.data?.activeUsers) {
        this.bp.apps.buddylist.data.activeUsers.forEach((buddy) => {
          $('#spellTargetName', $content).append(`<option value="${buddy}">${buddy}</option>`);
        });
      }

      // Populate active ponds
      if (this.bp.apps.buddylist?.data?.activePonds) {
        this.bp.apps.buddylist.data.activePonds.forEach((pond) => {
          $('#spellTargetPond', $content).append(`<option value="${pond}">${pond}</option>`);
        });
      }

      // Autocomplete for target input
      $('#spellTargetInput', $content).autocomplete({
        source: this.bp.apps.buddylist?.data?.activeUsers || [],
      });

      // Form submission
      $('#castSpellForm', $content).on('submit', async (e) => {
        this.submitFormHandler(e, $content);
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

      this.bp.on('pond::activePondAdded', 'update-spellbook-pond-targets', (pond) => {
        if (!$(`#spellTargetPond option[value="${pond}"]`, $content).length) {
          $('#spellTargetPond', $content).append(`<option value="${pond}">${pond} Pond</option>`);
        }
      });

    }

    if (output) {
      // select the targetType using the output value
      $('#spellTargetType', this.spellbookWindow.content).val(output);
      // trigger change event to update target visibility
      // $('#spellTargetType', this.spellbookWindow.content).trigger('change');
    }
    if (context) {
      if (output === 'buddy') {
        // select the targetName using the context value
        $('#spellTargetName', this.spellbookWindow.content).val(context);
        // trigger change event to update target visibility
        // $('#spellTargetName', this.spellbookWindow.content).trigger('change');
      }
      if (output === 'pond') {
        // select the targetPond using the context value
        $('#spellTargetPond', this.spellbookWindow.content).show().val(context);
        // trigger change event to update target visibility
        // $('#spellTargetPond', this.spellbookWindow.content).trigger('change');
        setTimeout(() => {
          // Remark: For some reason there is race condition with the pond dropdown
          // only when first opening the spellbook, TODO: resolve this
          $('#spellTargetPond', this.spellbookWindow.content).show();
        }, 400);
      }

    }

    let $content = $(this.spellbookWindow.content);
    updateTargetVisibility.call(this, $content);
    updateSpellsDropdown.call(this, $content);


    return this.spellbookWindow;
  }
}

//
// Spellbook functions
//

// Update target visibility based on target type
function updateTargetVisibility($content) {
  // TODO: just use spellTargetName for both pond and buddy
  const targetType = $('#spellTargetType', $content).val();
  if (targetType === 'pond') {
    $('#spellTargetPond', $content).show();
    $('#spellTargetName', $content).hide();
    $('.spellTargetSelf', $content).hide();
    $('#toggleTargetInput', $content).show();
    $('.spellTargetNameLabel').hide();
    $('.spellTargetPondLabel').show();
  }

  if (targetType === 'buddy') {
    // show the buddy dropdown
    $('#spellTargetName', $content).show();
    $('#spellTargetPond', $content).hide();
    $('.spellTargetSelf', $content).hide();
    $('#toggleTargetInput', $content).show();
    $('.spellTargetNameLabel').show();
    $('.spellTargetPondLabel').hide();
  }

  if (targetType === 'self') {
    // hide the buddy and pond dropdowns
    $('#spellTargetName', $content).hide();
    $('#spellTargetPond', $content).hide();
    $('.spellTargetSelf', $content).html(this.bp.me).show();
    $('#toggleTargetInput', $content).hide();
    $('.spellTargetNameLabel').show();
    $('.spellTargetPondLabel').hide();
  }
};

// Populate spells dropdown based on spellType
function updateSpellsDropdown($content) {
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
    $spellName.append(`<option ${disabled} value="${spell.name}">(${spell.cost}) - ${spell.label || spell.name}</option>`);
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

  // this.updateConfigForm.call($content);
};

function updateValidTargets($content) {
  const spellName = $('#spellName', $content).val();
  // get the spellData ref
  const spellType = $('#spellType', $content).val();
  const spellsList = this.data[spellType];
  const spell = spellsList.find((s) => s.name === spellName);
  const spellConfig = spell.config;
  const previousTargetType = $('#spellTargetType', $content).val();
  const previousTargetName = $('#spellTargetName', $content).val();

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
      if (targetType === 'self') {
        // hide the spellTargetName
        $('#spellTargetName', $content).hide();
        // show the spellTargetSelf with value as this.bp.me
        $('.spellTargetSelf', $content).html(this.bp.me).show();
        $('#toggleTargetInput', $content).hide();
      } else {
        // show the spellTargetName
        $('#spellTargetName', $content).show();
        // hide the spellTargetSelf
        $('.spellTargetSelf', $content).hide();
        $('#toggleTargetInput', $content).show();
      }
    } else {
      // show the spellTargetName
      $('#spellTargetName', $content).show();
      // hide the spellTargetSelf
      $('.spellTargetSelf', $content).hide();
      $('#toggleTargetInput', $content).show();
    }
  } else {
    $targetType.append('<option disabled value="self">Self</option>');
  }

  // if the previousTargetType is available in the spellConfig.targets, select it
  if (spellConfig && spellConfig.targets && spellConfig.targets.includes(previousTargetType)) {
    $targetType.val(previousTargetType);
  } else {
    $targetType.val('');
  }

}

Spellbook.prototype.castSpell = castSpell;
Spellbook.prototype.client = client;
Spellbook.prototype.submitFormHandler = submitFormHandler;
Spellbook.prototype.updateConfigForm = updateConfigForm;