export default function calculateCost(spellData, config) {
    console.log('calculateCost', spellData, config);
    const cost = spellData.cost;
    const duration = config.duration;

    let totalCost = cost * duration;

    return totalCost;

}