
function propsToHtmlAttributes(options) {
  var finalAttrs = '';
  if (!options) return finalAttrs;
  Object.keys(options).forEach(function (key) {
    finalAttrs += key + '="' + options[key] +'" '
  })
  return finalAttrs;
}

function htmlSelect(content, options) {
  var attrs = propsToHtmlAttributes(options);
  var htmlStr = '<select '+attrs+'>';
  content.forEach(function(opt){
    htmlStr += '<option value="'+opt.value+'">';
    htmlStr += opt.label;
    htmlStr += '</option>';
  });

  htmlStr += '</select>';
  return htmlStr;
}

function htmlList(content, options) {
  var attrs = propsToHtmlAttributes(options);
  var listTag = options.tag ? options.tag : 'ul';
  var htmlStr = '<'+listTag+' '+attrs+'>';
  content.forEach(function(opt){
    var tag = opt.tag ? opt.tag : 'li'
    var className = opt.class ? opt.class : "list-group-item";
    var href = tag === 'a' ? 'href="'+opt.href+'"' : '';
    htmlStr += '<'+tag+' '+href+' class="'+className+'">';
    htmlStr += opt.text;
    htmlStr += '</'+tag+'>';
  });

  htmlStr += '</'+listTag+'>';
  return htmlStr;
}

function htmlDropdown(content, options) {
  var attrs = propsToHtmlAttributes(options);
  var htmlStr = '<div class="dropdown" '+attrs+'>';
  
  htmlStr += htmlElement('button', options.text, { 
    class:'btn btn-default dropdown-toggle',
    type: 'button',
    id: 'dropdownMenu1',
    'data-toggle': 'dropdown',
    'aria-haspopu': 'true',
    'aria-expanded': 'true'
  })
  htmlStr += '<ul class="dropdown-menu">';
  
  content.forEach(function(opt){
    htmlStr += '<li>';
    htmlStr += opt.text;
    htmlStr += '</li>';
  });

  htmlStr += '</ul>';
  htmlStr += '</div>';
  return htmlStr;
}
function htmlElement(tag, content, options) {
  var attrs = propsToHtmlAttributes(options);
  var htmlContent = '';
  if (tag === 'img' || tag === 'input') {
    return '<'+tag+' '+attrs+'/>';
  } else if (Array.isArray(content)) {
    htmlContent = htmlNestedElement(tag, content, options);
  } else {
    htmlContent = content;
  }
  return '<'+tag+' '+attrs+'>'+htmlContent+'</'+tag+'>';
}


function htmlNestedElement(tag, content, options) {
  var attrs = propsToHtmlAttributes(options)
  var optionTag = ''
  var htmlContent = '';
  if (tag === 'ul') {
    optionTag = 'li'
  } if (tag === 'select') {
    optionTag = 'option'
  }

  content.forEach(function(opt){
    var optionAttr = ''
    if (tag === 'ul') {
      optionAttr = {
        class: 'list-group-item'
      }
    } if (tag === 'select') {
      optionAttr = {
        value: opt.value
      }
    }
    htmlContent += htmlElement(optionTag, opt.text, optionAttr);
  })

  return htmlContent;
}

function $append(target, content) {
  if (typeof target === 'string') {
    target = $(target);
  }
  var current = target.html();
  var htmlContent = current + content;
  target.html(htmlContent)
  return htmlContent
}

function $prepend(target, content) {
  var htmlContent = $(target).html($(content).html() + $(target).html())
  return htmlContent
}

// function merge(array1, array2) {
//   var arrayMerge = array1.concat(array2)
//   return arrayMerge.filter( (item, index) =>
//     arrayMerge.indexOf(item) == index
//   )
// }