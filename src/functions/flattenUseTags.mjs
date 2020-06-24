export default function flattenUseTags($) {
  const $svg = $("svg");
  const xlinks = $svg.find("use[href]");
  xlinks.each(function flattenEachXlink() {
    const xlinkSelector = $(this).attr("href");
    if ($(xlinkSelector).length > 0) {
      $(this).replaceWith($(xlinkSelector));
    }
  });
}
