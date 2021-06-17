/**
 * Disable default event propagation
 * @param {*} e Event
 */
export function disabledEventPropagation(e) {
  if (e) {
    if (e.stopPropagation) {
      e.stopPropagation();
    } else if (window.event) {
      window.event.cancelBubble = true;
    }
  }
}

/**
 * Check if two objects are equivalent
 *
 * Thanks to http://adripofjavascript.com/blog/drips/object-equality-in-javascript.html
 * @param {object} a First object
 * @param {object} b Second object
 * @returns boolean
 */
export function isEquivalent(a, b) {
  // Create arrays of property names
  var aProps = Object.getOwnPropertyNames(a);
  var bProps = Object.getOwnPropertyNames(b);

  // If number of properties is different,
  // objects are not equivalent
  if (aProps.length != bProps.length) {
    return false;
  }

  for (var i = 0; i < aProps.length; i++) {
    var propName = aProps[i];

    // If values of same property are not equal,
    // objects are not equivalent
    if (a[propName] !== b[propName]) {
      return false;
    }
  }

  // If we made it this far, objects
  // are considered equivalent
  return true;
}

/**
 * Generate (a user's) initials given a full name
 *
 * Thanks to https://stackoverflow.com/a/33076482
 * @param {*} string Name
 * @returns {string} Deciphered initials
 */
export function getInitials(string) {
  let regex = new RegExp(/(\p{L}{1})\p{L}+/, "gu");

  let initials = [...string.matchAll(regex)] || [];

  initials = (
    (initials.shift()?.[1] || "") + (initials.pop()?.[1] || "")
  ).toUpperCase();

  return initials;
}

/**
 * Copy text to the user's clipboard
 * @param {*} text Text to copy
 * @returns null
 */
export function copyToClipboard(text) {
  if (!navigator.clipboard) {
    return;
  }

  navigator.clipboard.writeText(text).then(
    function () {
      console.log("[Clipboard] Copying to clipboard was successful!");
    },
    function (err) {
      console.error("[Clipboard] Could not copy text: ", err);
    }
  );
}
