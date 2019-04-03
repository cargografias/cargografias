String.prototype.capitalize = function() {
    return this.replace(/(?:^|\s)\S/g, function(a) { return a.toUpperCase(); });
};

// colores usados por Google en sus graficos, trends, etc.
// from http://bl.ocks.org/aaizemberg/78bd3dade9593896a59d
//
function colores_google(n) {
  var colores_g = ["#3366cc", "#dc3912", "#ff9900", "#109618", "#990099", "#0099c6", "#dd4477", "#66aa00", "#b82e2e", "#316395", "#994499", "#22aa99", "#aaaa11", "#6633cc", "#e67300", "#8b0707", "#651067", "#329262", "#5574a6", "#3b3eac"];
  return colores_g[n % colores_g.length];
}


function toTitleCase(str)
{
    return str.replace(/\w\S*/g, function(txt){return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();});
}


 function removeAccents(value) {
    return value
         .replace(/á/g, 'a') 
         .replace(/â/g, 'a')            
         .replace(/é/g, 'e')
         .replace(/è/g, 'e') 
         .replace(/ê/g, 'e')
         .replace(/í/g, 'i')
         .replace(/ï/g, 'i')
         .replace(/ì/g, 'i')
         .replace(/ó/g, 'o')
         .replace(/ô/g, 'o')
         .replace(/ú/g, 'u')
         .replace(/ü/g, 'u')
         .replace(/ç/g, 'c')
         .replace(/ß/g, 's');
}

function ignoreAccentsCompare(actual, expected){
        var pureActual = removeAccents(actual.toLowerCase())
        var pureExpected = removeAccents(expected.toLowerCase());
        var words = pureExpected.split(' ');
        var count = 0;
        for (var i = 0; i < words.length; i++) {
          if (pureActual.indexOf(words[i]) > -1){
            count++;
          }
        };
        return count === words.length;
}


