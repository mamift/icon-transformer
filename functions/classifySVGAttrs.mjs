// Change fills to classes to allow full CSS control of SVGs
export default async function classifySVGAttrs($, config) {
  const $svg = $("svg");

  // Clean up clip-paths from sketch and remove white fills
  $svg.find("defs, mask").each(function removeDefs() {
    $(this).remove();
  });
  $svg.find("[mask]").each(function removeMasks() {
    $(this).removeAttr("mask");
  });
  $svg.find("[clip-path]").each(function removeClipPaths() {
    $(this).removeAttr("clip-path");
  });

  // TODO: Better names for object keys
  if (config.classify) {
    config.classify.forEach((keyedMap) => {
      keyedMap.maps.forEach((map) => {
        const selectors = map.values.map(
          value => `[${keyedMap.key || keyedMap.attribute}="${value}"]`,
        );

        $svg.find(selectors.join(", ")).each(function addIconClass() {
          $(this).addClass(map.class);
        });
      });
      $(`[${keyedMap.key}]`).removeAttr(keyedMap.key);
    });
  } else if (config.fills) {
    // Maintained for backwards compatibility
    config.fills.forEach((fillDefinition) => {
      const fillSelectors = fillDefinition.fills.map(fill => `[fill="${fill}"]`);

      $svg.find(fillSelectors.join(", ")).each(function addIconFill() {
        $(this).addClass(fillDefinition.class);
      });
    });

    $("[fill]").removeAttr("fill");
  }

  $("[style]").removeAttr("style");

  return $;
}
