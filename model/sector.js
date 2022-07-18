// eslint-disable-next-line max-classes-per-file
class Sector {
    constructor(name, index, params) {
        this.name = name;
        this.index = index;
        this.params = params;
    }
}

export class Industri extends Sector {
    constructor(index, params) {
        super("Industri", index, params);
        this.hello = 10;
    }
}

export class Policy extends Sector {
    constructor(index, params) {
        super("Policy", index, params);
        this.hello = 10;
    }
}
