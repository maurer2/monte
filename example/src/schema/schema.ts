import { z } from 'zod';

export const schema = z
  .object({
    // todo: tiles enum

    // firstName
    firstName: z
      .string({
        invalid_type_error: 'firstName must be a string',
        required_error: 'firstName must be set',
      })
      .trim()
      .min(1, 'firstName mustn\'t be empty')
    ,

    // lastName
    lastName: z
      .string({
        invalid_type_error: 'lastName must be a string',
        required_error: 'lastName must be set',
      })
      .trim()
      .min(1, 'lastName mustn\'t be empty')
    ,

    // middleName - optional, if set then it mustn't be empty and it mustn't be a palindrome
    middleName: z
      .string({
        invalid_type_error: 'middleName must be a string',
        required_error: 'middleName must be set',
      })
      .trim()
      .min(1,'middleName mustn\'t be empty')
      .transform((value: string): string => value
        .toLocaleLowerCase()
        .replace(/\s/g, "") // trim inside
      )
      .refine(
        (value: string): boolean => value.split('').reverse().join('') !== value,
        {
          message: `middleName mustn't be a palindrome`,
        },
      )
      .optional()
    ,
  })
  .strict();

export type Schema = z.infer<typeof schema>;