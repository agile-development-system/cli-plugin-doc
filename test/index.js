/*
 * @Author: 锦阳
 * @Create: 2021年04月12日
 */

/**
 * @param {string} [somebody=John Doe] - Somebody's name.
 */
export function sayHello(somebody) {
    if (!somebody) {
        somebody = 'John Doe';
    }
    alert('Hello ' + somebody);
}

/**
 * Returns the sum of all numbers passed to the function.
 * @param {...number} num - A positive or negative number.
 */
export function sum() {
    let i = 0; const n = arguments.length; let t = 0;
    for (; i < n; i++) {
        t += arguments[i];
    }
    return t;
}

/**
 * This callback type is called `requestCallback`
 * and is displayed as a global symbol.
 *
 * @callback requestCallback
 * @param {number} responseCode
 * @param {string} responseMessage
 */

/**
 * Does something asynchronously and executes the callback on completion.
 * @param {requestCallback} cb - The callback that handles the response.
 */
export function doSomethingAsynchronously(cb) {
    // code
};

/**
 * @param p0 {string} - A string param declared using TS-style
 * @param {string}  p1 - A string param.
 * @param {string=} p2 - An optional param
 * @param {string} [p3] - Another optional param.
 * @param {string} [p4=test] - An optional param with a default value
 * @return {string} This is the result
 */
function fn3(p0, p1, p2, p3, p4) {
    return 'a';
    // TODO
}
/** aaa */
class A {
    /**
     * @param p0 {string} - A string param declared using TS-style
     * @param {string}  p1 - A string param.
     * @param {string=} p2 - An optional param
     * @param {string} [p3] - Another optional param.
     * @param {string} [p4=test] - An optional param with a default value
     * @return {string} This is the result
     */
    static fn() {
        return 'a';
    }
}

/**
 * See {@link MyClass} and [MyClass's foo property]{@link MyClass#foo}.
 * Also, check out {@link http://www.google.com|Google} and
 */
function myFunction(p) {}

/**
 * Both of these will link to the bar function.
 * @see {@link bar}
 * @see bar
 */
function foo() {}

// Use the inline {@link} tag to include a link within a free-form description.
/**
  * @see {@link foo} for further information.
  * @see {@link http://github.com|GitHub}
  */
function bar() {}

/**
 * The jQuery plugin namespace.
 * @external "jQuery.fn"
 * @see {@link http://learn.jquery.com/plugins/|jQuery Plugins}
 */

/**
 * A jQuery plugin to make stars fly around your home page.
 * @function external:"jQuery.fn".starfairy
 */

/**
 * Solves equations of the form a * x = b
 * @example <caption>Example usage of method1.</caption>
 * // returns 2
 * globalNS.method1(5, 10);
 * @returns {Number} Returns the value of x for the equation.
 */
function method1(params) {

}
