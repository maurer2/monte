/* eslint-disable max-len, comma-style, function-paren-newline, @typescript-eslint/indent */
import { z } from 'zod';

import { titles, daysOfWorkWeek, minimumDaysInTheOffice } from './schema.constants';

// not available in Firefox
const stringSplitter = new Intl.Segmenter('en', {
  granularity: 'grapheme',
});

const stringEnumerationFormatter = new Intl.ListFormat('en-gb', { style: 'long', type: 'disjunction' });

export const schema = z
  .object({
    // #region title - null is needed as default value for the non optional field and is refined as invalid later on
    title: z
      .enum(titles, {
        required_error: 'title must be set',
        invalid_type_error: 'title must be a string',
      })
      .or(z.null())
      .refine((
        value): boolean => value !== null,
        {
          message: `title must either be ${stringEnumerationFormatter.format(titles)}`,
        },
      )
    ,
    // #endregion

    // #region firstName
    firstName: z
      .string({
        invalid_type_error: 'firstName must be a string',
        required_error: 'firstName must be set',
      })
      .trim()
      .min(1, 'firstName mustn\'t be empty')
    ,
    // #endregion

    // #region lastName
    lastName: z
      .string({
        invalid_type_error: 'lastName must be a string',
        required_error: 'lastName must be set',
      })
      .trim()
      .min(1, 'lastName mustn\'t be empty')
    ,
    // #endregion

    // #region middleName
    // optional - if set then it mustn't be empty and it mustn't be a palindrome
    middleName: z
      .string({
        invalid_type_error: 'middleName must be a string',
        required_error: 'middleName must be set',
      })
      .trim()
      .min(1, 'middleName mustn\'t be empty')
      // trim inside
      .transform((value) => value.replace(/\s/g, ''))
      .refine(
        (value): boolean => {
          const stringAsArray = Array.from(stringSplitter.segment(value), ({ segment }) => segment);

          // don't treat one letter words as palindromes
          if (stringAsArray.length === 1) {
            return true;
          }

          return stringAsArray.reverse().join('') !== value;
        },
        {
          message: 'middleName mustn\'t be a palindrome',
        },
      )
      .optional()
      // https://stackoverflow.com/questions/73582246/zod-schema-how-to-make-a-field-optional-or-have-a-minimum-string-contraint
      .transform((value) => (value === '' ? undefined : value))
      // https://stackoverflow.com/questions/73715295/react-hook-form-with-zod-resolver-optional-field
      // .or(z.literal(''))
    ,
    // #endregion

    // #region hasCats
    // makes numberOfCats field available or unavailable
    hasCats: z
      .boolean({
        required_error: 'hasCats must be set',
        invalid_type_error: 'hasCats must be a boolean',
      })
    ,
    // #endregion

    // #region numberOfCats
    // optional - depends on hasCats and is coerced to number
    numberOfCats: z
      .preprocess(
        (input: unknown): unknown => {
          // https://stackoverflow.com/questions/71052832/zod-set-min-max-after-transform-string-to-number
          // treat empty field as undefined, but pass thru other falsy values
          if (input === '') {
            return undefined;
          }
          return input;
        },
        z.coerce.number({
          invalid_type_error: 'numberOfCats must be number-ish', // triggered if coercion fails
        })
          .int('numberOfCats must be an integer')
          .min(1, 'numberOfCats must be more than 0')
          .max(50, 'numberOfCats must be less than or equal 50')
          .optional(),
      )
    ,
    // #endregion

    // #region daysInTheOffice
    daysInTheOffice: z
      .array(
        z.enum(daysOfWorkWeek).or(z.string()),
        {
          required_error: 'daysInTheOffice must be set',
        },
      )
      .min(minimumDaysInTheOffice, { message: `daysInTheOffice must contain at least ${minimumDaysInTheOffice} days` })
      .max(daysOfWorkWeek.length, { message: `daysInTheOffice mustn't contain more than ${daysOfWorkWeek.length} days` })
      // detect non workday values
      .refine(
        (days): boolean => {
          const hasNonWorkDaysInArray = days.some((day) => !daysOfWorkWeek.includes(day));

          return !hasNonWorkDaysInArray;
        },
        {
          message: `daysInTheOffice mustn't contain values other than ${stringEnumerationFormatter.format(daysOfWorkWeek)}`,
        },
      )
      // detect duplicates: https://github.com/colinhacks/zod/discussions/2316
      .refine((days): boolean => new Set(days).size === days.length, {
        message: 'daysInTheOffice mustn\'t contain duplicate values',
      }),
    // #endregion
  })
  .strict()
  // numberOfCats shouldn't be set if hasCats is false
  .refine(
    ({ hasCats, numberOfCats }): boolean => {
      if (!hasCats && typeof numberOfCats !== 'undefined') {
        return false;
      }
      return true;
    },
    {
      message: 'numberOfCats mustn\'t be set if hasCats is false',
      path: ['numberOfCats'],
    },
  )
  // numberOfCats should be set if hasCats is true
  .refine(
    ({ hasCats, numberOfCats }): boolean => {
      // console.log(hasCats, numberOfCats)
      if (hasCats && typeof numberOfCats === 'undefined') {
        return false;
      }
      return true;
    },
    {
      message: 'numberOfCats must be set if hasCats is true',
      path: ['numberOfCats'],
    },
  );
