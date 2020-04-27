
// NOTE: navigator.clipboard.* can not work in a chrome extension or in a
// background page
const writeToClipboard = (str) => {
  let el = document.createElement("textarea")
  let success = false

  el.value = str
  document.body.append(el)
  el.select()
  success = document.execCommand("copy")
  el.remove()

  return success
    ? Promise.resolve(str)
    : Promise.reject(new Error("Unable to write to clipboard"))
}

const googleImageSearchPat = /^data:image\/|https:\/\/[a-z0-9\-]+.gstatic.com/

const getImageUrl = (info) => {
  if (googleImageSearchPat.test(info.srcUrl)) {
    return (new URL(info.linkUrl)).searchParams.get('imgurl')
  } else {
    return info.srcUrl
  }
}

const copyImageUrlToClipboard = (info, tab) => {
  let imageUrl = getImageUrl(info)

  if (imageUrl === null) {
    alert('Sorry, Bild-URL konnte nicht kopiert werden. Versuche die Bild-URL aus der Ergebnisliste zu kopieren.')
  } else {
    writeToClipboard(imageUrl)
  }
}

const ctxItemId = "WL1WvsIUbGDwoS8SaItVU46nemsQZ4Yu"

browser.contextMenus.create({
  id: ctxItemId,
  title: "Copy Image URL",
  type: "normal",
  contexts: ["image"],
  enabled: true,
  onclick: copyImageUrlToClipboard
})
