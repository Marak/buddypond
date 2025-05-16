 // Populate config form based on selected spell
 export default function updateConfigForm ($content) {
   const spellName = $('#spellName', $content).val();
   const spellType = $('#spellType', $content).val();
   const spellsList = this.data[spellType];
   const spell = spellsList.find((s) => s.name === spellName);
   const $config = $('#spellConfig', $content);
   $config.empty();
   if (spell && spell.config) {
     Object.entries(spell.config).forEach(([key, config]) => {
       if (key === 'targets') {
         return;
       }
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
}