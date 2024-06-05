import React from 'react';
import { useForm, useFieldArray } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as Yup from 'yup';

export const bioMaxLength = 300;
export const responsibilityMaxLength = 300;

const schema = Yup.object().shape({
  name: Yup.string().max(100).required(),
  bio: Yup.string().max(bioMaxLength).required(),
  experience: Yup.array()
    .of(
      Yup.object({
        position: Yup.string().min(4).required(),
        responsibility: Yup.string().min(10).max(responsibilityMaxLength).required(),
      })
    )
    .required(),
});

const emptyExperience = {
  position: '',
  responsibility: '',
};

const DynamicForm = () => {
  const {
    register,
    handleSubmit,
    control,
    formState: { errors }
  } = useForm({
    mode: 'onBlur',
    resolver: yupResolver(schema),
    defaultValues: {
      experience: [emptyExperience],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: 'experience',
  });

  const onSubmit = (data) => {
    alert()
    console.log('Form data submitted:', data);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <div className="form-section">
        <h2>Experience</h2>
        {fields.map((field, index) => (
          <div key={index} className="mb-3">
            <div className="d-flex align-items-center mb-3">
              <div className="experience-number">
                <span>{index + 1}</span>
              </div>
              <button onClick={() => remove(index)} className="btn btn-danger">
                Remove
              </button>
            </div>
            <div className="mb-3">
              <label htmlFor={`experience[${index}].position`}>Position</label>
              <input
                type="text"
                {...register(`experience[${index}].position`)}
                className={`form-control ${errors.experience?.[index]?.position ? 'is-invalid' : ''}`}
                placeholder="Senior Front End Engineer"
              />
              {errors.experience?.[index]?.position && (
                <div className="invalid-feedback">
                  {errors.experience[index].position.message}
                </div>
              )}
            </div>
            <div className="mb-3">
              <label htmlFor={`experience[${index}].responsibility`}>Responsibility</label>
              <textarea
                {...register(`experience[${index}].responsibility`)}
                className={`form-control ${errors.experience?.[index]?.responsibility ? 'is-invalid' : ''}`}
                rows="3"
                placeholder="I was responsible for..."
                maxLength={responsibilityMaxLength}
              />
              {errors.experience?.[index]?.responsibility && (
                <div className="invalid-feedback">
                  {errors.experience[index].responsibility.message}
                </div>
              )}
            </div>
          </div>
        ))}
        <button
          type="button"
          className="btn btn-primary"
          onClick={() => append(emptyExperience)}
        >
          Add Experience
        </button>
        <button type="submit" className="btn btn-success">Submit</button>
      </div>
    </form>
  );
};

export default DynamicForm;