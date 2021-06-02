//
//   Parse any string to URL-friendly format.
//

const parseUrlFriendly = (string) => {
  // remove spaces to end up with more human readable string
  // avoids populating output string with "%20"'s
  const compressed = string.replace(/ /g, "")

  // replace non url chars with "-"
  let replaced = compressed.toLowerCase().replace(/[^a-z0-9 _-]+/gi, "-")

  // remove "-" from start and end of the string
  if (replaced.charAt(0) === "-") {
    replaced = replaced.substring(1)
  }
  if (replaced.charAt(replaced.length - 1) === "-") {
    replaced = replaced.substring(0, replaced.length - 1)
  }

  // run through method for redundancy ;)
  return encodeURIComponent(replaced)
}

module.exports = parseUrlFriendly
