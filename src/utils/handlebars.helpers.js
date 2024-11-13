const handlebarsHelpers = {
  formatNumber: (number, decimals = 2) => {
    if (number === null || number === undefined || isNaN(number)) {
      return 'N/A';
    }
    return Number(number).toFixed(decimals);
  },
  add: function (a, b) {
    return a + b;
  },
  and: function (a, b) {
    return a == b;
  },
  eq: function (a, b) {
    return a == b;
  },
  subtract: function (a, b) {
    return (a - b)
  },
  modifyImageUrl: (url, width, height) => {
    if (typeof url === 'string') {
      return url.replace(/width=\d+/, `width=${width}`)
        .replace(/height=\d+/, `height=${height}`);
    }
    return url;
  },
  ifCond: function (v1, operator, v2, options) {
    switch (operator) {
      case '==':
        return (v1 == v2) ? options.fn(this) : options.inverse(this);
      case '===':
        return (v1 === v2) ? options.fn(this) : options.inverse(this);
      case '!=':
        return (v1 != v2) ? options.fn(this) : options.inverse(this);
      case '!==':
        return (v1 !== v2) ? options.fn(this) : options.inverse(this);
      case '<':
        return (v1 < v2) ? options.fn(this) : options.inverse(this);
      case '<=':
        return (v1 <= v2) ? options.fn(this) : options.inverse(this);
      case '>':
        return (v1 > v2) ? options.fn(this) : options.inverse(this);
      case '>=':
        return (v1 >= v2) ? options.fn(this) : options.inverse(this);
      default:
        return options.inverse(this);
    }
  },
  or: function (a, b) {
    return a || b;
  },
  gt: function (a, b) {
    return a > b;
  },
  lt: function (a, b) {
    return a < b;
  },
  gte: (a, b) => {
    return a >= b;
  },
  lte: (a, b) => {
    return a <= b;
  },
  multiply: (a, b) => {
    return a * b;
  },
};
const calculateSubtotal = (products) => {
  console.log(products)
  return products.reduce((acc, product) => acc + (product.product.price * product.quantity), 0);
}
const calculateTotal = (products) => {
  return calculateSubtotal(products);
}

export { handlebarsHelpers, calculateSubtotal, calculateTotal };
