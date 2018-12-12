import svgpath from "svgpath";

// Remove transforms from groups and assign to child elements
export default async function bakeSVGTransforms($) {
  const $svg = $("svg");
  const groups = $svg.find("g");
  $(groups).each((i, group) => {
    const { transform } = group.attribs;

    if (transform !== undefined) {
      for (let c = 0; c < group.children.length; c += 1) {
        const childAttributes = group.children[c].attribs;

        if (childAttributes !== undefined) {
          let childTransform = childAttributes.transform;

          if (childTransform !== undefined) {
            childTransform += ` ${transform}`;
          } else {
            childTransform = transform;
          }

          group.children[c].attribs.transform = childTransform;
        }
      }

      if (group.name == "g") {
        delete group.attribs.transform;
      }
    }
    // Bake transforms into paths
    $svg.find("path").each(function bakeTransformOnPath() {
      if ($(this).attr("transform") != undefined) {
        const newPath = svgpath($(this).attr("d"))
          .transform($(this).attr("transform"))
          .round(10)
          .toString();
        $(this).attr("d", newPath);
        $(this).removeAttr("transform");
      }
    });
    $svg.find("[points][transform]").each(function bakeTransformOnPoints() {
      let translates = $(this)
        .attr("transform")
        .match(/(?<=translate\()([\d.-]+, *[\d.-]+)(?=\))/g);
      translates = translates.map(translate => translate.split(",").map(coord => coord.trim()));

      const translateX = translates.reduce(
        (value, translate) => parseFloat(value) + parseFloat(translate[0]),
        0,
      );
      const translateY = translates.reduce(
        (value, translate) => parseFloat(value) + parseFloat(translate[1]),
        0,
      );

      const pointGroups = $(this)
        .attr("points")
        .match(/([\d.]+[ ,]+[\d.]+)/g);

      const points = pointGroups.map((pointGroup) => {
        const coords = pointGroup.split(" ");
        return `${parseFloat(coords[0]) + translateX} ${parseFloat(coords[1]) + translateY}`;
      });

      $(this).attr("points", points.join(", "));

      $(this).removeAttr("transform");
    });
    // TODO: Bake transforms on other shapes?
    return $svg;
  });
  return $;
}
