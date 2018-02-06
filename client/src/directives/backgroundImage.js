export default function backgroundImage() {
  return function (scope, element, attrs) {
    var url = attrs.backImg;
    var opacity = attrs.backOpacity;
    var backRadius = attrs.backRadius;
    element.css({
      'background-image': 'url(' + url + ')',
      'background-size': 'cover',
      'background-position': 'center center',
      'border-radius': backRadius || '50%',
      'opacity': opacity
    });
  };
}
