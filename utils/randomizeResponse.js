//
//   Return random products for ui components.
//

// toolbox
const randomIndex = (arrLength) => {
  const index = Math.floor(Math.random() * Number(arrLength))
  return index
}
// function
const randomizeResponse = (array, amount) => {
  // dont'n bother if pointless
  if (!array || !Array.isArray(array) || array.length === 0 || amount <= 0) {
    return
  }
  // bother just a little if sensless input
  if (Number(array.length) <= Number(amount)) {
    return array
  }
  // do the job
  const responseArray = []
  while (responseArray.length < Number(amount)) {
    const random = array[randomIndex(array.length)]
    if (!responseArray.includes(random)) {
      responseArray.push(random)
    }
  }
  return responseArray
}

module.exports = randomizeResponse
