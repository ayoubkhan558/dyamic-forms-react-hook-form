import React from 'react';
import { useForm, useFieldArray } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';

const schema = yup.object().shape({
  variants: yup.array().of(
    yup.object().shape({
      name: yup.string().required(),
      values: yup.array().of(yup.string().required()).required(),
    })
  ),
});

const DynamicForm2 = () => {
  const { register, handleSubmit, errors, control } = useForm({
    resolver: yupResolver(schema),
  });
  const { fields, append, remove } = useFieldArray({
    control,
    name: 'variants',
  });

  const onSubmit = (data) => {
    console.log(data);
  };

  const addVariantValue = (index) => {
    append({ values: [''], name: '' }, { shouldFocus: true });
  };

  const deleteVariant = (index) => {
    remove(index);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <div>
        {fields.map((field, index) => (
          <div key={field.id} className="border border-primary p-3 mb-1">
            <label htmlFor={`variant-${index}`}>Variant {index + 1}</label>
            <input
              type="text"
              {...register(`variants[${index}].name`)}
              className="form-control form-control-sm"
            />
            <div className="mt-3">
              {field.values.map((value, valueIndex) => (
                <div key={valueIndex}>
                  <label htmlFor={`value-${valueIndex}`}>Value {valueIndex + 1}</label>
                  <input
                    type="text"
                    {...register(`variants[${index}].values[${valueIndex}]`)}
                    className="form-control form-control-sm"
                  />
                </div>
              ))}
              <div className="d-flex gap-2 mt-2">
                <button type="button" className="btn btn-sm btn-outline-dark" onClick={() => addVariantValue(index)}>
                  Add Variant Value
                </button>
                <button type="button" className="btn btn-sm btn-danger" onClick={() => deleteVariant(index)}>
                  Delete Variant
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
      <div className="d-flex gap-2 mt-2">
        <button type="button" className="btn btn-sm btn-dark" onClick={() => append({ name: '', values: [''] })}>
          Add Variant
        </button>
        <button className="btn btn-sm btn-secondary" type="submit">
          Submit
        </button>
      </div>
    </form>
  );
};

export default DynamicForm2;
