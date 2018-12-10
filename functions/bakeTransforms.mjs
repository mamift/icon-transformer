import svgpath from "svgpath";

// Remove transforms from groups and assign to child elements
export default async function bakeSVGTransforms($) {
  let $svg = $("svg");
  var groups = $svg.find("g");
  $(groups).each((i, group) => {
    var transform = group.attribs.transform;

    if (transform !== undefined) {
      for (var c = 0; c < group.children.length; c++) {
        var childAttributes = group.children[c].attribs;

        if (childAttributes !== undefined) {
          var childTransform = childAttributes.transform;

          if (childTransform !== undefined) {
            childTransform += " " + transform;
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
    $svg.find("path").each(function() {
      if ($(this).attr("transform") != undefined) {
        var newPath = svgpath($(this).attr("d"))
          .transform($(this).attr("transform"))
          .round(10)
          .toString();
        $(this).attr("d", newPath);
        $(this).removeAttr("transform");
      }
    });
    $svg.find("[points][transform]").each(function() {
      var translates = $(this)
        .attr("transform")
        .match(/(?<=translate\()([\d\.-]+, *[\d\.-]+)(?=\))/g);
      translates = translates.map(translate =>
        translate.split(",").map(coord => coord.trim())
      );

      var translateX = translates.reduce(
        (value, translate) => parseFloat(value) + parseFloat(translate[0]),
        0
      );
      var translateY = translates.reduce(
        (value, translate) => parseFloat(value) + parseFloat(translate[1]),
        0
      );

      var pointGroups = $(this)
        .attr("points")
        .match(/([\d\.]+[ ,]+[\d\.]+)/g);

      var points = pointGroups.map(group => {
        var coords = group.split(" ");
        return (
          parseFloat(coords[0]) +
          translateX +
          " " +
          (parseFloat(coords[1]) + translateY)
        );
      });

      $(this).attr("points", points.join(", "));

      $(this).removeAttr("transform");
    });
    // TODO: Bake transforms on other shapes?
    return $svg;
  });
  return $;
}
