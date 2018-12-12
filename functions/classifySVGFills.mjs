// Change fills to classes to allow full CSS control of SVGs
export default async function classifySVGFills($, config) {
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

  config.fills.forEach((fillDefinition) => {
    const fillSelectors = fillDefinition.fills.map(fill => `[fill="${fill}"]`);

    $svg.find(fillSelectors.join(", ")).each(function addIconFill() {
      $(this).addClass(fillDefinition.class);
    });
  });

  $("[fill]").removeAttr("fill");
  $("[style]").removeAttr("style");

  return $;
}
