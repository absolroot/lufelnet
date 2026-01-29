/**
 * Simple Event Emitter implementation
 */
export class EventEmitter {
    constructor() {
        this._events = {};
    }

    on(event, listener) {
        if (!this._events[event]) {
            this._events[event] = [];
        }
        this._events[event].push(listener);
        return () => this.off(event, listener);
    }

    off(event, listener) {
        if (!this._events[event]) return;
        this._events[event] = this._events[event].filter(l => l !== listener);
    }

    emit(event, data) {
        if (!this._events[event]) return;
        this._events[event].forEach(listener => listener(data));
    }
}
