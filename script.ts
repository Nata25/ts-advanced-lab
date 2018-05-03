// Generic classes

class genericClass<T> {
  private val: T;
  setVal(val: T) {
    this.val = val;
  }
  getVal(): T {
    return this.val;
  }
}

let element1 = new genericClass<Element>();
let element2 = new genericClass<HTMLElement>();
let element3 = new genericClass<HTMLElement>();

element1.setVal(document.createElement('div'));
element2.setVal(document.createElement('div'));
element3.setVal(document.createElement('div'));

let elementsArray = [
  element1.getVal(),
  element2.getVal(),
  element3.getVal(),
];

function isHTMLElement(x: any): x is HTMLElement {
  return x.style !== undefined;
}

function convertToHTMLElement(x: HTMLElement | Element): HTMLElement {
  if (isHTMLElement(x)) {
    return x;
  } else {
    return <HTMLElement>x;
  }
}

function standardizeElements(array: Array<any>): Array<HTMLElement> {
  for (let elem of array) {
    convertToHTMLElement(elem);
  }
  return array;
}

//console.log(elementsArray);

const standartizedElems = standardizeElements(elementsArray);

// Classes

function applyMixins(derivedClass: any, baseClasses: any[]) {
  baseClasses.forEach(baseClass => {
    Object.getOwnPropertyNames(baseClass.prototype).forEach(name => {
      derivedClass.prototype[name] = baseClass.prototype[name];
    });
  });
}

class Rotater {
  rotate(elem: HTMLElement): void {
    elem.style.transform = 'rotate(315deg)';
  }
  rotateBack(elem: HTMLElement): void {
    elem.style.transform = '';
  }
}

class Mover {
  move(elem: HTMLElement): void {
    elem.style.transform = 'translate(50px)';
  }
  moveBack(elem: HTMLElement): void {
    elem.style.transform = '';
  }
}

// Decorator function
function animated(option) {
  return target => {
    console.log(target);
    target.prototype.animated = option;
  };
}

// this also works but compiles with warning
function animatedAlternative(constructor: any) {
  console.log(constructor)
  constructor.prototype.animated = true;
  return constructor;
}

// Using mixins with classes
@animated(true)
//@animatedAlternative
class movingElement  implements Rotater, Mover {
  rotate: (elem: HTMLElement) => any;
  rotateBack: (elem: HTMLElement) => any;
  move: (elem: HTMLElement) => any;
  moveBack: (elem: HTMLElement) => any;
  // this one is added by decorator function
  animated: Boolean;
  
  element: HTMLElement;

  constructor(elem: HTMLElement) {
    elem.onmousedown = () => {
      this.move(elem);
    }
    elem.onmouseup = () => {
      this.moveBack(elem);
    }
    elem.onmouseover = () => {
      this.rotate(elem);
    }
    elem.onmouseout = () => {
      this.rotateBack(elem);
    }
    this.element = elem;

    if (this.animated) {
      elem.style.transition = "transform .5s ease";
    }
  }
}

applyMixins(movingElement, [Mover, Rotater]);

for (let elem of standartizedElems) {
  elem.style.width = "60px"
  elem.style.height = "60px"
  elem.style.backgroundColor = "green";
  elem.style.margin = "5px";
  let elemClass = new movingElement(elem);
  document.body.appendChild(elemClass.element);
}


