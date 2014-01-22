angular.module('fobu.filters.inColumn', [])

.filter('inColumn', function() {
  return function(elements, column, comparator) {
    // Zero-index the column argument
    --column;

    var output = [];
    for (var i = 0, currentColumn = 0; i < elements.length; i++) {
      switch (comparator || '=') {
        case '=': if (currentColumn == column) { output.push(elements[i]); } break;
        case '<': if (currentColumn <  column) { output.push(elements[i]); } break;
        case '>': if (currentColumn >  column) { output.push(elements[i]); } break;
      }
      if (elements[i].type == 'column-break') {
        ++currentColumn;
      }
    }

    return output;
  };
})

;
