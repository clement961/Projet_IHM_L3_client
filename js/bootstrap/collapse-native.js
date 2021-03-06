
/* Native Javascript for Bootstrap 4 | Collapse
-----------------------------------------------*/

// COLLAPSE DEFINITION
// ===================
var Collapse = function( element, options ) {

  // initialization element
  element = queryElement(element);

  // set options
  options = options || {};

  // event targets and constants
  var accordion = null, collapse = null, self = this, 
    isAnimating = false, // when true it will prevent click handlers
    accordionData = element[getAttribute]('data-parent'),

    // component strings
    component = 'collapse',
    collapsed = 'collapsed',

    // private methods
    openAction = function(collapseElement,toggle) {
      bootstrapCustomEvent.call(collapseElement, showEvent, component);
      isAnimating = true;
      addClass(collapseElement,collapsing);
      removeClass(collapseElement,component);
      collapseElement[style][height] = collapseElement[scrollHeight] + 'px';
      
      emulateTransitionEnd(collapseElement, function() {
        isAnimating = false;
        collapseElement[setAttribute](ariaExpanded,'true');
        toggle[setAttribute](ariaExpanded,'true');
        removeClass(collapseElement,collapsing);
        addClass(collapseElement, component);
        addClass(collapseElement,showClass);
        collapseElement[style][height] = '';
        bootstrapCustomEvent.call(collapseElement, shownEvent, component);
      });
    },
    closeAction = function(collapseElement,toggle) {
      bootstrapCustomEvent.call(collapseElement, hideEvent, component);
      isAnimating = true;
      collapseElement[style][height] = collapseElement[scrollHeight] + 'px'; // set height first
      removeClass(collapseElement,component);
      removeClass(collapseElement,showClass);
      addClass(collapseElement,collapsing);
      collapseElement[offsetWidth]; // force reflow to enable transition
      collapseElement[style][height] = '0px';
      
      emulateTransitionEnd(collapseElement, function() {
        isAnimating = false;
        collapseElement[setAttribute](ariaExpanded,'false');
        toggle[setAttribute](ariaExpanded,'false');
        removeClass(collapseElement,collapsing);
        addClass(collapseElement,component);
        collapseElement[style][height] = '';
        bootstrapCustomEvent.call(collapseElement, hiddenEvent, component);
      });
    },
    getTarget = function() {
      var href = element.href && element[getAttribute]('href'),
        parent = element[getAttribute](dataTarget),
        id = href || ( parent && parent.charAt(0) === '#' ) && parent;
      return id && queryElement(id);
    };
  
  // public methods
  this.toggle = function(e) {
    e[preventDefault]();
    if (isAnimating) return;
    if (!hasClass(collapse,showClass)) { self.show(); } 
    else { self.hide(); }
  };
  this.hide = function() {
    closeAction(collapse,element);
    addClass(element,collapsed);
  };
  this.show = function() {
    if ( accordion ) {
      var activeCollapse = queryElement('.'+component+'.'+showClass,accordion),
          toggle = activeCollapse && (queryElement('['+dataToggle+'="'+component+'"]['+dataTarget+'="#'+activeCollapse.id+'"]',accordion)
                 || queryElement('['+dataToggle+'="'+component+'"][href="#'+activeCollapse.id+'"]',accordion) ),
          correspondingCollapse = toggle && (toggle[getAttribute](dataTarget) || toggle.href);
      if ( activeCollapse && toggle && activeCollapse !== collapse ) {
        closeAction(activeCollapse,toggle); 
        if ( correspondingCollapse.split('#')[1] !== collapse.id ) { addClass(toggle,collapsed); } 
        else { removeClass(toggle,collapsed); }
      }
    }

    openAction(collapse,element);
    removeClass(element,collapsed);
  };

  // init
  if ( !(stringCollapse in element ) ) { // prevent adding event handlers twice
    on(element, clickEvent, self.toggle);
  }
  collapse = getTarget();
  accordion = queryElement(options.parent) || accordionData && getClosest(element, accordionData);
  element[stringCollapse] = self;
};

// COLLAPSE DATA API
// =================
supports[push]( [ stringCollapse, Collapse, '['+dataToggle+'="collapse"]' ] );

