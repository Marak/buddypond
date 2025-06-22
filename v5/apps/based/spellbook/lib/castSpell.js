export default async function castSpell(targetType, targetName, spellName, spellData) {
  console.log(spellName, castSpell);
  if (spellName.length > 0 && castSpell.length > 0) {
    // if Buddy fails role check, reflect the spell back onto them
    let result;
    try {
      result = await this.client.apiRequest(`/spellbook/cast-spell/${targetType}/${targetName}/${spellName}`, 'POST', spellData)
    } catch (err) {
      console.error('Error casting spell:', err);
      result = {
        error: err.message
      };
      if (err.message === 'HTTP error! status: 401') {
        result.error = 'Please log in to cast spells.';
      }

    }
    console.log('castSpell result', result);
    return result;
  }
}