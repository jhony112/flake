import { FooBar } from "../../models";
import { generateChars } from "../../utils/security/randomstring";

export default async () => {
  if ((await FooBar.count({})) === 0) {
    await FooBar.create({
      name: "EXE Islands",
      slug: generateChars(),
      description: "Louisiana Tools invoice proactive Avon Stream Markets Forward bypass Steel",
    });
    console.log(`Foobar created(ID)!.`);
  }
};
