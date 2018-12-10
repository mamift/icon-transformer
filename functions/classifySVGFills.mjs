// Change fills to classes to allow full CSS control of SVGs
export default async function classifySVGFills($, config) {
  let $svg = $("svg");

  // Clean up clip-paths from sketch and remove white fills
  $svg.find("defs, mask").each(function() {
    $(this).remove();
  });
  $svg.find("[mask]").each(function() {
    $(this).removeAttr("mask");
  });
  $svg.find("[clip-path]").each(function() {
    $(this).removeAttr("clip-path");
  });

  config.fills.forEach(fillDefinition => {
    var fillSelectors = fillDefinition.fills.map(fill => {
      return `[fill="${fill}"]`;
    });

    $svg.find(fillSelectors.join(", ")).each(function() {
      $(this).addClass(fillDefinition.class);
    });
  });

  $("[fill]").removeAttr("fill");
  $("[style]").removeAttr("style");

  return $;
}
