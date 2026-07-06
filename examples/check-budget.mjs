const daily = Number(process.env.EXPECTED_DAILY_SPEND || 0)
const ceiling = Number(process.env.MONTHLY_CEILING || 0)
const balance = Number(process.env.CARD_AVAILABLE_BALANCE || 0)
const windowDays = 3
const required = daily * windowDays
console.log(JSON.stringify({ requiredForWindow: required, balance, ceiling, funded: balance >= required, withinCeiling: required <= ceiling }, null, 2))
if (balance < required || required > ceiling) process.exitCode = 1
