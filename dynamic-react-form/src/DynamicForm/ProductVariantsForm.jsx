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
        code: yup.string().required('Code is required'),
        barcode: yup.string().required('Barcode is required'),
        availability: yup.number().required('Availability is required'),
      })).required('Values are required'),
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
    });
  };

  const createVariantFields = (index) => {
    append({
      name: '',
      values: [],
      code: '', // Default code value for this new variant
      barcode: '', // Default barcode value for this new variant
      availability: 0, // Default availability value for this new variant
    });
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      {fields.map(({ name, values, code, barcode, availability }, index) => (
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
          {values.map((value, valueIndex) => (
            <div key={valueIndex}>
              <div>
                <Controller
                  name={`variants[${index}].values[${valueIndex}].code`}
                  control={control}
                  defaultValue=""
                  render={({ field }) => (
                    <input {...field} placeholder="Code" />
                  )}
                />
                {errors?.variants && errors?.variants[index]?.values && errors?.variants[index]?.values[valueIndex] && (
                  <p className="bg-dark text-white">{errors?.variants[index]?.values[valueIndex]?.code?.message}</p>
                )}
              </div>
              <div>
                <Controller
                  name={`variants[${index}].values[${valueIndex}].barcode`}
                  control={control}
                  defaultValue=""
                  render={({ field }) => (
                    <input {...field} placeholder="Barcode" />
                  )}
                />
                {errors?.variants && errors?.variants[index]?.values && errors?.variants[index]?.values[valueIndex] && (
                  <p className="bg-dark text-white">{errors?.variants[index]?.values[valueIndex]?.barcode?.message}</p>
                )}
              </div>
              <div>
                <Controller
                  name={`variants[${index}].values[${valueIndex}].availability`}
                  control={control}
                  defaultValue=""
                  render={({ field }) => (
                    <input {...field} placeholder="Availability" type="number" />
                  )}
                />
                {errors?.variants && errors?.variants[index]?.values && errors?.variants[index]?.values[valueIndex] && (
                  <p className="bg-dark text-white">{errors?.variants[index]?.values[valueIndex]?.availability?.message}</p>
                )}
              </div>
            </div>
          ))}
          <button type="button" onClick={() => createVariantFields(index)}>
            Create Variant Fields
          </button>
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
