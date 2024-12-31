import SystemsManager from "./SystemsManager";

export default class System {
    constructor(bp, options = {}) {
        this.bp = bp;
        this.SystemsManager = new SystemsManager();

        return this;
    }

    async init() {


        return 'loaded system';
    }
}