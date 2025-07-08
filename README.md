# Rope Structure

Rope Structure is a data structure that is used to store strings. It is a self-balancing binary search tree where each node contains a string and a pointer to its left and right children. The tree is balanced by rotating the nodes to maintain a balanced tree.

## Features

-   Efficient String Operations:
    -   insert(index, text)
        -   Insert text at any position in O(log n) time
    -   delete(start, end)
        -   Remove characters in O(log n) time
    -   charAt(index)
        -   Get character at index in O(log n) time
    -   substring(start, end)
        -   Get substring in O(log n + m) time where m is the length of the substring
-   Self-Balancing:
    -   Uses AVL tree balancing to maintain O(log n) time complexity for operations
    -   Automatic rebalancing during inserts and concatenations
    -   rebalance() method to force a full tree rebalance
-   Memory Efficiency:
    -   Leaf nodes store actual string content
    -   Internal nodes store only metadata (weights and heights)
    -   Configurable leaf size threshold (default 1024 characters)
-   Helper Methods:

    -   length()
        -   Get total length of the string
    -   toString()
        -   Convert the entire rope to a string
    -   isBalanced()
        -   Check if the tree is balanced

## Installation

-   npm:

    ```bash
    npm install rope-structure
    ```

-   yarn:

    ```bash
    yarn add rope-structure
    ```

-   pnpm:

    ```bash
    pnpm add rope-structure
    ```

-   bun:

    ```bash
    bun add rope-structure
    ```

## Usage

-   CommonJS

    ```javascript
    const Rope = require("rope-structure");

    const rope = new Rope("Hello, World!");
    ```

-   ES Modules

    ```typescript
    import Rope from "rope-structure";

    const rope = new Rope("Hello, World!");
    ```

## Methods

-   insert(index, text)

    -   Insert text at any position in O(log n) time

-   delete(start, end)

    -   Remove characters in O(log n) time

-   charAt(index)

    -   Get character at index in O(log n) time

-   substring(start, end)

    -   Get substring in O(log n + m) time where m is the length of the substring

-   length()

    -   Get total length of the string

-   toString()

    -   Convert the entire rope to a string

-   isBalanced()
    -   Check if the tree is balanced

## Example

```typescript
const rope = new Rope("Hello, World!");

rope.insert(5, "Beautiful");
console.log(rope.toString()); // Hello, Beautiful World!

rope.delete(5, 15);
console.log(rope.toString()); // Hello, World!

console.log(rope.charAt(5)); // W

console.log(rope.substring(0, 5)); // Hello

console.log(rope.length()); // 11

console.log(rope.toString()); // Hello, World!

console.log(rope.isBalanced()); // true

rope.rebalance();
console.log(rope.isBalanced()); // true
```
