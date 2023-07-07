---
layout: section
image: https://source.unsplash.com/collection/94734566/1920x1080
---

## Validation

---
layout: two-cols
image: https://source.unsplash.com/collection/94734566/1920x1080
---

## Intro examples

Schema
```ts
const someString = z.string({
    invalid_type_error: 'Must be a string',
    required_error: 'Is required',
  })
  .trim()
  .min(1, `Shouldn't be empty`)
  .max(9, `Shouldn't be larger than 9 characters`)
  .includes('test', {
    message: `Must contain 'test'`
  });
```

::right::

Validation result for "surreptitious"

```json
[
  {
    "code": "too_big",
    "maximum": 9,
    "type": "string",
    "inclusive": true,
    "exact": false,
    "message": "Shouldn't be larger than 9 characters",
    "path": []
  },
  {
    "code": "invalid_string",
    "validation": {
      "includes": "test"
    },
    "message": "Must contain 'test'",
    "path": []
  }
]
```

---
layout: image-right
image: https://source.unsplash.com/collection/94734566/1920x1080
---

## Intro

<!-- Each validator supports a custom error message -->



---
layout: image-right
image: https://source.unsplash.com/collection/94734566/1920x1080
---

## Supported types - The usual ones

* string (`email`, `url`, `uuid`, `regex`, `includes`, `startsWith`, `endsWith`, `dateString` etc.)
* number (`integer`, `float`, `positive`, `negative`, `multipleOf` etc.)
* boolean
* object
* array (`min`, `max`, `length`, `nonempty`)
* undefined
* null
* date (`min`, `max`)
* bigInt

---
layout: image-right
image: https://source.unsplash.com/collection/94734566/1920x1080
---

## Example - String validation with default validators

Each built-in data type comes with a range of supported validators out of the box.
In this example `someString` must be defined, e.g. can't be optional or empty,
must be of type string with a length of 1 to 10.
Additionally `someString` must not contain the word "test".

```ts
const someString = z.string({
    invalid_type_error: 'Must be a string',
    required_error: 'Is required',
  })
  .trim()
  .min(1, `Shouldn't be empty`)
  .max(9, `Shouldn't be larger than 9 characters`)
  .includes('test', {
    message: `Must contain 'test'`
  });
```

---
layout: image-right
image: https://source.unsplash.com/collection/94734566/1920x1080
---

## Example - String validation with custom validators

Custom validation is sometimes needed to test specific logic, that can't be handled by built-in validators.
<!-- Zod uses refine for custom validation logic. -->

```ts
const someString = z.string({
    invalid_type_error: 'Must be a string',
    required_error: 'Is required',
  })
  .trim()
  .min(1, `Shouldn't be empty`)
  .transform((value: string): string =>
    value.replace(/\s/g, ''))
  .refine(
    (value: string): boolean => {
      return split('').reverse().join('')
        !== value;
    },
    {
      message: `Must not be a palindrome`,
    },
  );
```

---
layout: image-right
image: https://source.unsplash.com/collection/94734566/1920x1080
---

## Example - Validation of related fields

```ts
// todo
```

---
layout: image-right
image: https://source.unsplash.com/collection/94734566/1920x1080
---

## Supported types - The unusual ones

* Enums
* Union types
* Discriminated union types
* Tuples

---
layout: image-right
image: https://source.unsplash.com/collection/94734566/1920x1080
---

## Example - Discriminated union types

```ts
// todo
```

---
layout: image-right
image: https://source.unsplash.com/collection/94734566/1920x1080
---

## Common pain points

* Using `refine` on a schema wraps it in a `ZodEffects` class making it difficult to access `schema.shape` to retrieve the schema values
* `refine` on a schema is not executed, when the initial schema object is initialized with invalid values