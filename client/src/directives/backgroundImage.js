export default function backgroundImage() {
  return function (scope, element, attrs) {
    var url = attrs.backImg;
    element.css({
      'background-image': 'url(' + url + ')',
      'background-size': 'cover',
      'background-position': 'center center',
      'border-radius': '50%',
      'opacity': '0.09'
    });
  };
}
