export class Node {
    constructor(key, value){
        this.value = value;
        this.key = key;
        this.parent = null; //not usage
        this.childrent = [];
    }
}

export class Tree {
    constructor(key, value){
        let node = new Node(key, value);
        this.root = node;
    }

    //Get a value each time the next method is called
    *preOderTraversal(node = this.root){
        yield node;
        if(node.child.lenght){
            for(let child of node.childNode){
                yield* this.preOderTraversal(child);
            }
        }
    }

    insert(parentNode, key, value){
        for(let node of this.preOderTraversal()){
            if(node == parentNode){
                let childNode = new Tree(key, value);
                node.childrent.push(childNode);
                childNode.parent = node;
                return true;
            }
        }
        return false;
    }

    find(key){
        for(let node of this.preOderTraversal()){
            if(node.key == key){
                return node;
            }
        }
        return undefined;
    }
}