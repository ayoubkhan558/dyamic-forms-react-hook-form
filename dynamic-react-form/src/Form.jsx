import React from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";

const schema = yup.object().shape({
  email: yup.string().email().min(8).max(32).required(),
  username: yup.string().min(8, "Minimum 8 chars needed").max(32).required(),
});

const App = () => {
  const { register, handleSubmit, formState: { errors }, reset } = useForm({
    resolver: yupResolver(schema),
  });

  const onSubmitHandler = (values) => {
    console.log(values);
    reset();
  };

  return (
    <form onSubmit={handleSubmit(onSubmitHandler)}>
      <h2>Lets sign you in.</h2>

      <input type="text" {...register("email")} />
      <p>{errors?.email?.message}</p>
      <br />
      <input type="text" {...register("username")} />
      <p>{errors?.username?.message}</p>
      <br />
      <br />

      <button type="submit">Sign in</button>
    </form>
  );
};

export default App;