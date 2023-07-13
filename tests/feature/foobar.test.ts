import foobarTestFaker from "../factories/foobar.faker";
import { expectSuccess } from "../utils/testing";
import { customRequest } from "../utils/custom.request";

describe("Foobar Tests...", () => {
  it("Can create foobar", async () => {
    const payload = foobarTestFaker.create();
    const response = await customRequest({
      path: `/auth/foobar`,
      method: "post",
      payload,
    });

    expectSuccess(response);
    expect(response.body.data.name).toBe(payload.name);
  });

  it("Can update foobar", async () => {
    const { id } = await foobarTestFaker.rawCreate();

    const payload = foobarTestFaker.update;
    const response = await customRequest({
      path: `/auth/foobar/${id}`,
      method: "patch",
      payload,
    });

    expectSuccess(response);
    expect(response.body.data.name).toBe(payload.name);
  });

  it("Can find by id", async () => {
    const { id } = await foobarTestFaker.rawCreate();

    const response = await customRequest({
      path: `/foobar/${id}`,
    });

    expectSuccess(response);
    expect(response.body.data.name).toBeDefined();
  });

  it("Can find all foobars", async () => {
    await foobarTestFaker.rawCreate();
    await foobarTestFaker.rawCreate();

    const response = await customRequest(`/foobar`);

    expectSuccess(response);
    expect(response.body.data.items.length).not.toBe(0);
  });
});
