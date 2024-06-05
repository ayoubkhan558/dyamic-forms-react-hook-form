import React from 'react';
import { useForm, useFieldArray, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import CreatableSelect from 'react-select/creatable';

const schema = yup.object().shape({
  variants: yup.array().of(
    yup.object().shape({
      name: yup.string().required('Name is required'),
      values: yup.array().of(yup.object().shape({
        value: yup.string(),
        label: yup.string(),
      })).required('Values are required'),
      options: yup.object().shape({
        availability: yup.number().required('Availability is required'),
        code: yup.string().required('Code is required'),
        barcode: yup.string().required('Barcode is required'),
      }),
    })
  ),
});

const ProductVariantsForm = () => {
  const { control, handleSubmit, formState: { errors } } = useForm({
    resolver: yupResolver(schema),
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: 'variants',
  });

  const onSubmit = (data) => {
    console.log(data);
  };

  const addVariant = () => {
    append({
      name: '',
      values: [],
      options: {
        availability: 0,
        code: '',
        barcode: '',
      },
    });
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      {fields.map(({ name, values, options }, index) => (
        <div key={index}>
          <div>
            <Controller
              name={`variants[${index}].name`}
              control={control}
              defaultValue=""
              render={({ field }) => (
                <input {...field} placeholder="Variant Name" />
              )}
            />
            {errors?.variants && errors?.variants[index] && (
              <p className="bg-dark text-white">{errors?.variants[index]?.name?.message}</p>
            )}
          </div>
          <div>
            <Controller
              name={`variants[${index}].values`}
              control={control}
              defaultValue={[]}
              render={({ field }) => (
                <CreatableSelect
                  {...field}
                  isMulti
                  onChange={(selectedOptions) => field.onChange(selectedOptions)}
                />
              )}
            />
            {errors?.variants && errors?.variants[index] && (
              <p className="bg-dark text-white">{errors?.variants[index]?.values?.message}</p>
            )}
          </div>
          <div>
            <Controller
              name={`variants[${index}].options.code`}
              control={control}
              defaultValue=""
              render={({ field }) => (
                <input {...field} placeholder="Code" />
              )}
            />
            {errors?.variants && errors?.variants[index] && (
              <p className="bg-dark text-white">{errors?.variants[index]?.options?.code?.message}</p>
            )}
          </div>
          <div>
            <Controller
              name={`variants[${index}].options.barcode`}
              control={control}
              defaultValue=""
              render={({ field }) => (
                <input {...field} placeholder="Barcode" />
              )}
            />
            {errors?.variants && errors?.variants[index] && (
              <p className="bg-dark text-white">{errors?.variants[index]?.options?.barcode?.message}</p>
            )}
          </div>
          <div>
            <Controller
              name={`variants[${index}].options.availability`}
              control={control}
              defaultValue=""
              render={({ field }) => (
                <input {...field} placeholder="Availability" type="number" />
              )}
            />
            {errors?.variants && errors?.variants[index] && (
              <p className="bg-dark text-white">{errors?.variants[index]?.options?.availability?.message}</p>
            )}
          </div>
          <button type="button" onClick={() => remove(index)}>
            Remove
          </button>
        </div>
      ))}
      <button type="button" onClick={addVariant}>
        Add Variant
      </button>
      <button type="submit">Submit</button>
    </form>
  );
};

export default ProductVariantsForm;
