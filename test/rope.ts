import Rope from "../dist/index";

const rope = new Rope("Hello, world!");
console.log(rope.toString());

rope.insert(5, " beautiful");
console.log(rope.toString());

rope.delete(5, 11);
console.log(rope.toString());

console.log(rope.charAt(5));

console.log(rope.substring(5, 11));

console.log(rope.length());

console.log(rope.isBalanced());

rope.rebalance();
console.log(rope.isBalanced());
