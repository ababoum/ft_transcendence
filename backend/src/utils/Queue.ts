import {contains} from "class-validator";

export class Queue<T> {
    private storage: T[] = [];

    constructor(private capacity: number = Infinity) {}

    enqueue(item: T): void {
        if (this.size() === this.capacity) {
            throw Error("Queue has reached max capacity, you cannot add more items");
        }
        this.storage.push(item);
    }

    dequeue(): T | undefined {
        return this.storage.shift();
    }

    contains(item: T): boolean {
        let result: boolean = false;
        this.storage.forEach((element) => {
            if (item == element) {
                result = true;
                return;
            }
        });
        return result;
    }

    size(): number {
        return this.storage.length;
    }
}