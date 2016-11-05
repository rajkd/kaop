var annotations = require("./annotations");

var Class = function(sourceClass, extendedProperties, static) {

  var inheritedProperties = Object.create(sourceClass.prototype);

  for (var propertyName in extendedProperties) {
    inheritedProperties[propertyName] = annotations.compile(sourceClass, propertyName, extendedProperties[propertyName]);
  }

  if (!static) {
    var extendedClass = function() {
      for (var propertyName in this) {
        if (typeof this[propertyName] === "function") {
          this[propertyName] = this[propertyName].bind(this);
        }
      }
      if (typeof this.constructor === "function") return this.constructor.apply(this, arguments);
    };

    extendedClass.prototype = inheritedProperties;
    return extendedClass;
  } else {
    return inheritedProperties;
  }
};

var exp = function(mainProps) {
  return Class(function() {}, mainProps);
};
exp.inherits = Class;
exp.static = function(mainProps) {
  return Class(function() {}, mainProps, true);
};

module.exports = exp;