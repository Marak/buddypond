export default async function castSpell(buddyName, spellName) {
  console.log(spellName, buddyName);
  if (spellName.length > 0 && buddyName.length > 0) {
    // if Buddy fails role check, reflect the spell back onto them
    await this.client.apiRequest(`/spellbook/cast-spell/${buddyName}/${spellName}`, 'POST', {
      duration: 1,
      otherProp: 'value'
    })
  }
}