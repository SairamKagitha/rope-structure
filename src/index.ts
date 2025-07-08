// Rope Data Structure Implementation for Text Editors
// A balanced binary tree of strings optimized for efficient string operations

type RopeNodeType = "LEAF" | "INTERNAL";

export class RopeNode {
    left: RopeNode | null = null;
    right: RopeNode | null = null;
    parent: RopeNode | null = null;
    weight: number = 0; // Length of the left subtree's string
    value: string = ""; // Only used for leaf nodes
    type: RopeNodeType = "LEAF";
    height: number = 1; // For AVL balancing

    constructor(value: string = "") {
        this.value = value;
        this.weight = value.length;
        this.type = "LEAF";
    }
}

export default class Rope {
    private root: RopeNode | null = null;
    private readonly LEAF_LENGTH_THRESHOLD = 1024; // Maximum length for leaf nodes
    private readonly REBALANCE_RATIO = 1.5; // Threshold for rebalancing

    constructor(initialString: string = "") {
        if (initialString) {
            this.root = this.createOptimalTree(initialString);
        }
    }

    // Create a balanced tree from a string
    private createOptimalTree(
        str: string,
        start: number = 0,
        end: number = str.length
    ): RopeNode {
        const length = end - start;

        if (length <= this.LEAF_LENGTH_THRESHOLD) {
            return new RopeNode(str.substring(start, end));
        }

        const mid = Math.floor((start + end) / 2);
        const node = new RopeNode();
        node.type = "INTERNAL";

        node.left = this.createOptimalTree(str, start, mid);
        node.right = this.createOptimalTree(str, mid, end);

        this.updateNodeMetadata(node);
        return node;
    }

    // Update weight and height of a node
    private updateNodeMetadata(node: RopeNode): void {
        if (node.type === "LEAF") {
            node.weight = node.value.length;
            node.height = 1;
            return;
        }

        // For internal nodes
        const leftHeight = node.left ? node.left.height : 0;
        const rightHeight = node.right ? node.right.height : 0;

        node.weight = this.getNodeWeight(node.left);
        node.height = Math.max(leftHeight, rightHeight) + 1;
    }

    // Get the total length of the string in a node's subtree
    private getNodeWeight(node: RopeNode | null): number {
        if (!node) return 0;
        if (node.type === "LEAF") return node.value.length;
        return this.getNodeWeight(node.left) + this.getNodeWeight(node.right);
    }

    // Get balance factor of a node for AVL balancing
    private getBalanceFactor(node: RopeNode | null): number {
        if (!node) return 0;
        const leftHeight = node.left ? node.left.height : 0;
        const rightHeight = node.right ? node.right.height : 0;
        return leftHeight - rightHeight;
    }

    // Rotate right for AVL balancing
    private rotateRight(y: RopeNode): RopeNode {
        const x = y.left!;
        const T2 = x.right;

        // Perform rotation
        x.right = y;
        y.left = T2;

        // Update parents
        x.parent = y.parent;
        y.parent = x;
        if (T2) T2.parent = y;

        // Update weights and heights
        this.updateNodeMetadata(y);
        this.updateNodeMetadata(x);

        return x;
    }

    // Rotate left for AVL balancing
    private rotateLeft(x: RopeNode): RopeNode {
        const y = x.right!;
        const T2 = y.left;

        // Perform rotation
        y.left = x;
        x.right = T2;

        // Update parents
        y.parent = x.parent;
        x.parent = y;
        if (T2) T2.parent = x;

        // Update weights and heights
        this.updateNodeMetadata(x);
        this.updateNodeMetadata(y);

        return y;
    }

    // Balance the tree starting from the given node
    private balance(node: RopeNode): RopeNode {
        this.updateNodeMetadata(node);
        const balanceFactor = this.getBalanceFactor(node);

        // Left heavy
        if (balanceFactor > 1) {
            if (this.getBalanceFactor(node.left) >= 0) {
                return this.rotateRight(node);
            } else {
                node.left = this.rotateLeft(node.left!);
                return this.rotateRight(node);
            }
        }

        // Right heavy
        if (balanceFactor < -1) {
            if (this.getBalanceFactor(node.right) <= 0) {
                return this.rotateLeft(node);
            } else {
                node.right = this.rotateRight(node.right!);
                return this.rotateLeft(node);
            }
        }

        return node;
    }

    // Insert a string at the specified index
    insert(index: number, text: string): void {
        if (index < 0 || index > this.length()) {
            throw new Error("Index out of bounds");
        }

        if (!this.root) {
            this.root = new RopeNode(text);
            return;
        }

        const newNode = new RopeNode(text);
        const [left, right] = this.split(this.root, index);

        if (left) {
            const temp = this.concat(left, newNode);
            this.root = this.concat(temp, right!);
        } else {
            this.root = this.concat(newNode, right!);
        }
    }

    // Delete characters from start to end index (end not included)
    delete(start: number, end: number): void {
        if (start === end) return;
        if (start < 0 || end > this.length() || start >= end) {
            throw new Error("Invalid range");
        }

        const [left, temp] = this.split(this.root!, start);
        const [_, right] = this.split(temp!, end - start);

        this.root = left ? this.concat(left, right!) : right!;
    }

    // Get the character at the specified index
    charAt(index: number): string {
        if (!this.root || index < 0 || index >= this.length()) {
            throw new Error("Index out of bounds");
        }

        let node: RopeNode = this.root;
        let currentIndex = index;

        while (node.type === "INTERNAL") {
            if (currentIndex < node.weight) {
                if (!node.left) throw new Error("Invalid rope structure");
                node = node.left;
            } else {
                if (!node.right) throw new Error("Invalid rope structure");
                currentIndex -= node.weight;
                node = node.right;
            }
        }

        const char = node.value[currentIndex];
        if (char === undefined) {
            throw new Error("Index out of bounds");
        }
        return char;
    }

    // Get a substring from start to end index (end not included)
    substring(start: number, end: number = this.length()): string {
        if (start < 0 || end > this.length() || start > end) {
            throw new Error("Invalid range");
        }

        if (start === end) return "";
        if (start === 0 && end === this.length()) return this.toString();

        const [left, temp] = this.split(this.root!, start);
        const [middle, right] = this.split(temp!, end - start);

        const result = middle ? this.toString(middle) : "";

        // Rebuild the tree
        const firstPart = left ? this.concat(left, middle!) : middle!;
        this.root = right ? this.concat(firstPart, right) : firstPart;

        return result;
    }

    // Concatenate two ropes
    private concat(left: RopeNode, right: RopeNode): RopeNode {
        if (!left) return right;
        if (!right) return left;

        // If both are leaf nodes and their combined length is below threshold
        if (
            left.type === "LEAF" &&
            right.type === "LEAF" &&
            left.value.length + right.value.length <= this.LEAF_LENGTH_THRESHOLD
        ) {
            left.value += right.value;
            left.weight = left.value.length;
            return left;
        }

        const node = new RopeNode();
        node.type = "INTERNAL";
        node.left = left;
        node.right = right;
        left.parent = node;
        right.parent = node;

        this.updateNodeMetadata(node);
        return this.balance(node);
    }

    // Split the rope at the specified index
    private split(
        node: RopeNode,
        index: number
    ): [RopeNode | null, RopeNode | null] {
        if (node.type === "LEAF") {
            if (index === 0) return [null, node];
            if (index === node.value.length) return [node, null];

            const left = new RopeNode(node.value.substring(0, index));
            const right = new RopeNode(node.value.substring(index));
            return [left, right];
        }

        if (index < node.weight) {
            const [l, r] = this.split(node.left!, index);
            const rightSubtree = r ? this.concat(r, node.right!) : node.right;
            return [l, rightSubtree];
        } else {
            const [l, r] = this.split(node.right!, index - node.weight);
            const leftSubtree = l ? this.concat(node.left!, l) : node.left;
            return [leftSubtree, r];
        }
    }

    // Get the total length of the rope
    length(): number {
        return this.root ? this.getNodeWeight(this.root) : 0;
    }

    // Convert the rope to a string
    toString(node: RopeNode | null = this.root): string {
        if (!node) return "";
        if (node.type === "LEAF") return node.value;
        return this.toString(node.left) + this.toString(node.right);
    }

    // Check if the rope is balanced
    isBalanced(): boolean {
        const checkBalance = (node: RopeNode | null): number => {
            if (!node) return 0;

            const leftHeight = checkBalance(node.left);
            if (leftHeight === -1) return -1;

            const rightHeight = checkBalance(node.right);
            if (rightHeight === -1) return -1;

            if (Math.abs(leftHeight - rightHeight) > 1) return -1;

            return Math.max(leftHeight, rightHeight) + 1;
        };

        return checkBalance(this.root) !== -1;
    }

    // Rebuild the entire tree for optimal balance
    rebalance(): void {
        const str = this.toString();
        this.root = this.createOptimalTree(str);
    }
}
