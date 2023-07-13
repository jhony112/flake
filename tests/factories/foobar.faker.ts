import faker from "faker";
import { FooBar } from "../../src/models";
import { FooBarAttributes } from "../../src/models/foobar.model";
import { generateChars } from "../../src/utils/security/randomstring";

const foobarTestFaker = {
  rawCreate: async function (props?: Partial<FooBarAttributes>) {
    const data = {
      ...this.create(),
      slug: generateChars(),
      ...props,
    };
    return FooBar.create(data);
  },
  create: () => {
    return {
      name: faker.random.words(2),
      description: faker.random.words(20),
    };
  },
  update: {
    name: faker.random.words(3),
    description: faker.random.words(12),
  },
};

export default foobarTestFaker;
