import { test, expect } from "bun:test";
import { snakeToCamel } from "../src/utils/utils";

test("simple object", () => {
  const data = {
    first_name: "John",
    last_name: "Doe",
  };

  const result = {
    firstName: "John",
    lastName: "Doe",
  } as const;

  expect(snakeToCamel(data)).toEqual(result);
});

test("Object with array", () => {
  const data = {
    first_name: "John",
    last_name: "Doe",
    with_array: true,
    my_array: [
      {
        user_id: 1,
        username: "test",
        created_at: "2025-02-08T23:08:13.215Z",
      },
    ],
  };

  const result = {
    firstName: "John",
    lastName: "Doe",
    withArray: true,
    myArray: [
      {
        userId: 1,
        username: "test",
        createdAt: "2025-02-08T23:08:13.215Z",
      },
    ],
  } as const;

  expect(snakeToCamel(data)).toEqual(result);
});

test("Object with N depth array", () => {
  const data = {
    my_array: [
      {
        my_second_array: [
          {
            my_third_array: [
              {
                my_id: 1,
              },
            ],
            my_username: "test_user",
          },
        ],
      },
    ],
  };

  const result = {
    myArray: [
      {
        mySecondArray: [
          {
            myThirdArray: [
              {
                myId: 1,
              },
            ],
            myUsername: "test_user",
          },
        ],
      },
    ],
  } as const;

  expect(snakeToCamel(data)).toEqual(result);
});

test("snake with number", () => {
  const data = {
    what_is_42_number: "AUQLUE",
  };

  const result = {
    whatIs42Number: "AUQLUE",
  } as const;

  expect(snakeToCamel(data)).toEqual(result);
});
