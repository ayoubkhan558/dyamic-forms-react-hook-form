import React from 'react';
import { useForm } from "react-hook-form";
import { yupResolver } from '@hookform/resolvers/yup';
import * as Yup from 'yup';
import DynaamicForm from "./DynamicForm"

export default function Dynamic() {
  // form validation rules 
  const validationSchema = Yup.object().shape({
    numberOfTickets: Yup.string()
      .required('Number of tickets is required'),
    tickets: Yup.array().of(
      Yup.object().shape({
        name: Yup.string()
          .required('Name is required'),
        email: Yup.string()
          .email('Email is Invalid')
          .required('Email is required')
      })
    )
  });

  // functions to build form returned by useForm() hook
  const { register, handleSubmit, reset, errors, watch } = useForm({
    mode: 'onChange',
    resolver: yupResolver(validationSchema)
  });

  // watch to enable re-render when ticket number is changed
  const watchNumberOfTickets = watch('numberOfTickets');

  // return array of ticket indexes for rendering dynamic forms in the template
  function ticketNumbers() {
    return [...Array(parseInt(watchNumberOfTickets || 0)).keys()];
  }

  // Main form submission function
  function onSubmit(data) {
    // Display form data on success
    alert('Main Form - SUCCESS!! :-)\n\n' + JSON.stringify(data, null, 4));
  }

  return (
    <>
      <DynaamicForm />
      <form onSubmit={handleSubmit(onSubmit)} onReset={reset}>
        <div className="card m-3">
          <h5 className="card-header">React Dynamic Form Example with React Hook Form</h5>
          <div className="card-body border-bottom">
            <div className="form-row">
              <div className="form-group">
                <label>Number of Tickets</label>
                <select name="numberOfTickets" ref={register} className={`form-control ${errors.numberOfTickets ? 'is-invalid' : ''}`}>
                  {['', 1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map(i =>
                    <option key={i} value={i}>{i}</option>
                  )}
                </select>
                <div className="invalid-feedback">{errors.numberOfTickets?.message}</div>
              </div>
            </div>
          </div>
          {ticketNumbers().map(i => (
            <div key={i} className="list-group list-group-flush">
              <div className="list-group-item">
                <h5 className="card-title">Ticket {i + 1}</h5>
                <div className="form-row">
                  <div className="form-group col-6">
                    <label>Name</label>
                    <input name={`tickets[${i}]name`} ref={register} type="text" className={`form-control ${errors.tickets?.[i]?.name ? 'is-invalid' : ''}`} />
                    <div className="invalid-feedback">{errors.tickets?.[i]?.name?.message}</div>
                  </div>
                  <div className="form-group col-6">
                    <label>Email</label>
                    <input name={`tickets[${i}]email`} ref={register} type="text" className={`form-control ${errors.tickets?.[i]?.email ? 'is-invalid' : ''}`} />
                    <div className="invalid-feedback">{errors.tickets?.[i]?.email?.message}</div>
                  </div>
                </div>
              </div>
            </div>
          ))}
          <div className="card-footer text-center border-top-0">
            <button type="submit" className="btn btn-primary mr-1">
              Buy Tickets
            </button>
            <button className="btn btn-secondary mr-1" type="reset">Reset</button>
          </div>
        </div>
      </form>
    </>
  )
}