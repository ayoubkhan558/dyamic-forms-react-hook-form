import { yupResolver } from '@hookform/resolvers/yup';
import { useForm } from 'react-hook-form';
import { useState } from 'react';
import * as yup from 'yup';
import axios from "axios";
import { Link } from "react-router-dom";
import Modal from 'react-bootstrap/Modal';

import iconDelete from "./../../Assets/delete.svg";
import iconImg from "./../../Assets/img.svg";
import iconProperty from "./../../Assets/icon-property.svg";
// import iconStep1 from "./../../Assets/step-1.svg";
import css from './Product.module.scss';
import "./AddProperty.scss";

import DynamicForm from './DynamicForm';

const schema = yup.object().shape({
  proTitle: yup.string().min(3, 'Property title must be at least 3 characters')
    .max(55, 'Property title cannot exceed 55')
    .required('Title of your property is required'),
  proDescription: yup.string().min(5, 'Description must be at least 5 characters')
    .max(300, 'Description cannot exceed 300 characters')
    .required('Description Address is required'),
  proPhotos: yup
    .mixed()
    .required('Please select an image file')
    .test('fileSize', 'File size is too large', (value) => {
      return value && value[0].size <= 1048576; // 1MB
    })
    .test('fileType', 'Unsupported file format', (value) => {
      return value && ['image/jpeg', 'image/png'].includes(value[0].type);
    }),
  // proPhotos: yup
  //   .array()
  //   .test(
  //     'atLeastOnePhoto',
  //     'Please upload at least one property photo.',
  //     (value) => value && value.length > 0
  //   )
  //   .nullable()
  //   .transform((value) => (value === '' ? null : value)),
  proPrice: yup.number().typeError('Value must be a number')
    .required('Compare-at price is required')
    .min(1, 'Compare-at price must be at least 1')
    .max(99999, 'Compare-at price cannot exceed 99999')
    .positive('Compare-at price must be a positive number')
    .integer('Compare-at price must be an integer')
    .transform((value) => (isNaN(value) ? undefined : value)),
  proPriceCompare: yup.number().typeError('Value must be a number')
    .required('Compare-at price is required')
    .min(1, 'Compare-at price must be at least 1')
    .max(99999, 'Compare-at price cannot exceed 99999')
    .positive('Compare-at price must be a positive number')
    .integer('Compare-at price must be an integer')
    .transform((value) => (isNaN(value) ? undefined : value)),
  proCostPerItem: yup.number().typeError('Value must be a number')
    .required('Cost per item price is required')
    .min(1, 'Cost per item price must be at least 1')
    .max(99999, 'Cost per item price cannot exceed 99999')
    .positive('Cost per item price must be a positive number')
    .integer('Cost per item price must be an integer')
    .transform((value) => (isNaN(value) ? undefined : value)),
  proProfit: yup.number().typeError('Value must be a number')
    .required('Profit is required')
    .min(1, 'Profit must be at least 1')
    .max(99999, 'Profit cannot exceed 99999')
    .positive('Profit must be a positive number')
    .integer('Profit must be an integer')
    .transform((value) => (isNaN(value) ? undefined : value)),
  proPriceMargin: yup.number().typeError('Value must be a number')
    .required('Margin % is required')
    .min(1, 'Margin % must be at least 1')
    .max(99999, 'Margin % cannot exceed 99999')
    .positive('Margin % must be a positive number')
    .integer('Margin % must be an integer')
    .transform((value) => (isNaN(value) ? undefined : value)),
  proTrackQuantity: yup
    .boolean()
    // .oneOf([true], 'You must select to track quantity') 
    .nullable()
    .transform((value) => (value === null ? false : value)),
  proQuantity: yup.string().min(1, 'Quantity must be at least 1 character')
    .max(1000, 'Quantity cannot exceed 1000 characters')
    .required('Quantity is required'),
  proHasSku: yup
    .boolean()
    // .oneOf([true], 'Please select the number of days in advance for free cancellation')
    .nullable()
    .transform((value) => (value === null ? false : value)),
  proContinueSelling: yup
    .boolean()
    // .oneOf([true], 'Please select the Continue Selling') // Uncomment this line to require the checkbox
    .nullable()
    .transform((value) => (value === null ? false : value)),
  shippingWeight: yup.number().min(1, 'Shipping weight must be at least 1')
    .max(999, 'Shipping weight cannot exceed 999')
    .typeError('Value must be a number')
    .required('Shipping weight is required')
    .nullable()
    .positive('Shipping weight must be a positive number')
    .integer('Shipping weight must be an integer')
    .transform((value) => (isNaN(value) ? null : value)),
  shippingWeightLb: yup.number().min(1, 'Shipping weight LB must be at least 1')
    .max(999, 'Shipping weight cannot exceed 999')
    .typeError('Value must be a number')
    .required('Shipping weight is required')
    .nullable()
    .positive('Shipping weight must be a positive number')
    .integer('Shipping weight must be an integer')
    .transform((value) => (isNaN(value) ? null : value)),
  proShipsInt: yup
    .boolean()
    // .oneOf([true], 'Please select the Continue Selling') // Uncomment this line to require the checkbox
    .nullable()
    .transform((value) => (value === null ? false : value)),
  customsInformation: yup.string().required('Customs Information is required'),
  proCode: yup.string().min(1, 'Code must be at least 1 character')
    .max(100, 'Code cannot exceed 100 characters')
    .required('Code is required'),
  // proVariants: yup.string().required('Variants is required'),
  // options: yup.array().of(
  //   yup.object().shape({
  //     name: yup.string().required('Option Name is required'),
  //     values: yup
  //       .array()
  //       .of(yup.string().required('Option Value is required'))
  //       .min(1, 'At least one value is required for each option'),
  //   })
  // ),
});

// Define an array of country options for the select box
const countryOptions = [
  { value: 'US', label: 'United States' },
  { value: 'PK', label: 'Pakistan' },
  { value: 'IN', label: 'India' },
  // Add more countries as needed
];

const MultiStepForm = () => {
  // modals
  const [show, setShow] = useState(false);
  const [show2, setShow2] = useState(false);
  const [showSubmitModal, setShowSubmitModal] = useState(false);

  const defaultValues = {
    proTitle: '',
    proDescription: '',
    proPhotos: null,
    proPrice: '',
    proPriceCompare: '',
    proCostPerItem: '',
    proProfit: '',
    proPriceMargin: '',
    proTrackQuantity: false,
    proQuantity: '',
    proHasSku: false,
    proContinueSelling: false,
    shippingWeight: '',
    shippingWeightLb: '',
    proShipsInt: false,
    customsInformation: '',
    proCode: '',
    // proVariants: '',
    // options: [{ name: '', values: [''] }],
  };

  const { register, handleSubmit, formState: { errors }, trigger } = useForm({
    resolver: yupResolver(schema),
    mode: 'onChange',
    defaultValues
  });

  const onSubmit = (formData) => {
    // console.log(formData);
    const requestBody = {
      proTitle: formData.proTitle,
      proDescription: formData.proDescription,
      proPhotos: formData.proPhotos,
      proPrice: formData.proPrice,
      proPriceCompare: formData.proPriceCompare,
      proCostPerItem: formData.proCostPerItem,
      proProfit: formData.proProfit,
      proPriceMargin: formData.proPriceMargin,
      proTrackQuantity: formData.proTrackQuantity,
      proQuantity: formData.proQuantity,
      proHasSku: formData.proHasSku,
      proContinueSelling: formData.proContinueSelling,
      shippingWeight: formData.shippingWeight,
      shippingWeightLb: formData.shippingWeightLb,
      proShipsInt: formData.proShipsInt,
      customsInformation: formData.customsInformation,
      proCode: formData.proCode,
      // proVariants: formData.proVariants,
      // options: formData.options
    };

    console.log(requestBody);
    // setShowSubmitModal(true);

    const config = {
      headers: {
        'Content-Type': 'application/json'
      }
    };

    axios
      .post('https://dev.api.xnation.app/add-property/', requestBody, config)
      .then((response) => {
        console.log('Response from server:', response.data);
        // Handle success or show success message to the user
      })
      .catch((error) => {
        console.error('Error submitting data:', error);
        // Handle error or show error message to the user
      });
  };
  const [proPhotos, setProPhotos] = useState([]);
  const [selectedPhotos, setSelectedPhotos] = useState([]);
  const [previewUrls, setPreviewUrls] = useState([]);
  const handleFileChange = (e) => {
    const files = e.target.files || e.dataTransfer.files;
    if (files && files.length) {
      const selectedFiles = Array.from(files);
      setSelectedPhotos((prevPhotos) => [...prevPhotos, ...selectedFiles]);
      const urls = selectedFiles.map((file) => URL.createObjectURL(file));
      setPreviewUrls((prevUrls) => [...prevUrls, ...urls]);

      // Update proPhotos with the selectedFiles
      setProPhotos((prevProPhotos) => [...prevProPhotos, ...selectedFiles]);
    }
  };

  const handleFileDelete = (index) => {
    const updatedPhotos = selectedPhotos.filter((_, i) => i !== index);
    setSelectedPhotos(updatedPhotos);

    const updatedUrls = previewUrls.filter((_, i) => i !== index);
    setPreviewUrls(updatedUrls);
  };


  // const [options, setOptions] = useState([{ name: '', values: [''] }]);

  // const handleOptionNameChange = (index, event) => {
  //   const newOptions = [...options];
  //   newOptions[index].name = event.target.value;
  //   setOptions(newOptions);
  // };

  // const handleOptionValueChange = (optionIndex, valueIndex, event) => {
  //   const newOptions = [...options];
  //   newOptions[optionIndex].values[valueIndex] = event.target.value;
  //   setOptions(newOptions);
  // };

  // const addOption = () => {
  //   setOptions([...options, { name: '', values: [''] }]);
  // };

  // const addValue = (index) => {
  //   const newOptions = [...options];
  //   newOptions[index].values.push('');
  //   setOptions(newOptions);
  // };

  return (
    <section className={` p-4 ${css.welcome} pt-4 md-pt-5 pb-4 md-pb-5`}>
      <div className="container">
        <div className="row align-items-start">
          <div className="col-md-24">

            <div className="page-dash-header">
              <div className="text-1">Your All</div>
              <div className="page-dash-header-top">
                <div className="page-dash-title">
                  <h2 className="page-dash-title-xl">Add Product</h2>
                </div>
                <div className="d-flex align-items-center gap-2">
                  <button className="btn-none">Preview</button>
                  <button className="btn-none">Duplicate</button>
                  <button className="btn-fullScreen">Save</button>
                </div>
              </div>
            </div>

            <br />
            <DynamicForm />
            <form className="add-property" onSubmit={handleSubmit(onSubmit)}>
              <label className={css.formHeading} htmlFor="proTitle">
                Title
              </label>
              <div className="form-group">
                <input
                  className="form-control"
                  type="text"
                  id="proTitle"
                  {...register('proTitle')}
                />
                {errors.proTitle && (
                  <span className={css.error}>{errors.proTitle.message}</span>
                )}
              </div>

              <div className="form-group">
                <label className={css.formHeading} htmlFor="proDescription">
                  Description
                </label>
                <textarea
                  className="form-control"
                  id="proDescription"
                  {...register('proDescription')}
                  cols="20"
                  rows="6"
                ></textarea>
                {errors.proDescription && (
                  <span className={css.error}>{errors.proDescription.message}</span>
                )}
              </div>
              <div className="mb-2">
                <h3 className={css.formHeading}>Media</h3>
                <div className="form-group">
                  <label htmlFor="property-photos" className="d-block">
                    <div
                      className={css['dropzone']}
                      onDragOver={(e) => e.preventDefault()}
                      onDrop={handleFileChange}
                    >
                      <input
                        type="file"
                        className={css['dropinput']}
                        id="property-photos"
                        {...register('proPhotos')}
                        onChange={handleFileChange}
                        multiple
                        accept="image/*"
                      />
                      <div className={css['icon-img-wrapper'] + ` mb-3`}>
                        <img className={css['icon-img-upload']} src={iconImg} alt={``} />
                      </div>
                      <div className={css['btn-img-upload'] + ""}>
                        {previewUrls?.length > 0 ? "Add more images" : "Upload Photo"}
                      </div>
                    </div>
                  </label>
                  <div className={css['preview-wrapper']}>
                    {previewUrls.map((url, index) => (
                      <div key={index} className={css['preview-container']}>
                        <img className={css['preview-img']} src={url} alt={`Preview ${index}`} />
                        <button
                          type="button"
                          onClick={() => handleFileDelete(index)}
                          className={css['delete-button']}
                        >
                          <img src={iconDelete} alt={`Preview ${index}`} />
                        </button>
                      </div>
                    ))}
                  </div>
                  {errors.proPhotos && (
                    <span className={css.error}>{errors.proPhotos.message}</span>
                  )}
                </div>
              </div>
              <div className="mb-2">
                <label className={css.formHeading} htmlFor="proPrice">
                  Pricing
                </label>
                <div className="row">
                  <div className="col-md-12">
                    <div className="form-group">
                      <label className={css.label + " form-label"} htmlFor="proPrice">
                        Price:
                      </label>
                      <input
                        className="form-control"
                        type="number"
                        id="proPrice"
                        {...register('proPrice')}
                      />
                      {errors.proPrice && (
                        <span className={css.error}>{errors.proPrice.message}</span>
                      )}
                    </div>
                  </div>
                  <div className="col-md-12">
                    <div className="form-group">
                      <label className={css.label + " form-label"} htmlFor="proPriceCompare">
                        Compare-at Price:
                      </label>
                      <input
                        className="form-control"
                        type="number"
                        id="proPriceCompare"
                        {...register('proPriceCompare')}
                      />
                      {errors.proPriceCompare && (
                        <span className={css.error}>{errors.proPriceCompare.message}</span>
                      )}
                    </div>
                  </div>
                  <div className="col-md-8">
                    <div className="form-group">
                      <label className={css.label + " form-label"} htmlFor="proCostPerItem">
                        Cost per Item:
                      </label>
                      <input
                        className="form-control"
                        type="number"
                        id="proCostPerItem"
                        {...register('proCostPerItem')}
                        min="0"
                        minLength="1"

                      />
                      {errors.proCostPerItem && (
                        <span className={css.error}>{errors.proCostPerItem.message}</span>
                      )}
                    </div>
                  </div>
                  <div className="col-md-8">
                    <div className="form-group">
                      <label className={css.label + " form-label"} htmlFor="proProfit">
                        Profit:
                      </label>
                      <input
                        className="form-control"
                        type="number"
                        id="proProfit"
                        {...register('proProfit')}
                      />
                      {errors.proProfit && (
                        <span className={css.error}>{errors.proProfit.message}</span>
                      )}
                    </div>
                  </div>
                  <div className="col-md-8">
                    <div className="form-group">
                      <label className={css.label + " form-label"} htmlFor="proPriceMargin">
                        Margin %:
                      </label>
                      <input
                        className="form-control"
                        type="number"
                        id="proPriceMargin"
                        {...register('proPriceMargin')}
                      />
                      {errors.proPriceMargin && (
                        <span className={css.error}>{errors.proPriceMargin.message}</span>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              <div className="form-group">
                <h3 className={css.formHeading}>Inventory</h3>
                <div>
                  <div className="form-check">
                    <input
                      className="form-check-input"
                      type="checkbox"
                      id="proTrackQuantity"
                      {...register('proTrackQuantity')}
                    />
                    <label className="form-check-label" htmlFor="proTrackQuantity">
                      Track Quantity
                    </label>
                  </div>
                  {errors.proTrackQuantity && (
                    <span className={css.error}>{errors.proTrackQuantity.message}</span>
                  )}
                </div>
                <div className="form-group">
                  <label className={css.label + " form-label"} htmlFor="proQuantity">
                    Quantity:
                  </label>
                  <input
                    className="form-control"
                    type="text"
                    id="proQuantity"
                    {...register('proQuantity')}
                  />
                  {errors.proQuantity && (
                    <span className={css.error}>{errors.proQuantity.message}</span>
                  )}
                </div>
                <div>
                  <div className="form-check">
                    <input
                      className="form-check-input"
                      type="checkbox"
                      id="proHasSku1"
                      {...register('proHasSku')}
                    />
                    <label className="form-check-label" htmlFor="proHasSku1">
                      This product has a SKU or Barcode
                    </label>
                  </div>
                  {errors.proHasSku && (
                    <span className={css.error}>{errors.proHasSku.message}</span>
                  )}
                </div>
                <div className="">
                  <div className="form-check">
                    <input
                      className="form-check-input"
                      type="checkbox"
                      id="proContinueSelling"
                      {...register('proContinueSelling')}
                    />
                    <label className="form-check-label" htmlFor="proContinueSelling">
                      Continue selling when out of stock
                    </label>
                  </div>
                  {errors.proContinueSelling && (
                    <span className={css.error}>{errors.proContinueSelling.message}</span>
                  )}
                </div>
              </div>

              <div className="form-group">
                <h3 className={css.formHeading}>Shipping</h3>
                <div className="row">
                  <div className="col-md-12">
                    <div className="form-group">
                      <label className={css.label + " form-label"} htmlFor="shippingWeight">
                        Shipping Weight (KG)
                      </label>
                      <input
                        className="form-control"
                        type="number"
                        id="shippingWeight"
                        {...register('shippingWeight')}
                      />
                      {errors.shippingWeight && (
                        <span className={css.error}>{errors.shippingWeight.message}</span>
                      )}
                    </div>
                  </div>
                  <div className="col-md-12">
                    <div className="form-group">
                      <label className={css.label + " form-label"} htmlFor="shippingWeightLb">
                        Shipping Weight (lb)
                      </label>
                      <input
                        className="form-control"
                        type="number"
                        id="shippingWeightLb"
                        {...register('shippingWeightLb')}
                      />
                      {errors.shippingWeightLb && (
                        <span className={css.error}>{errors.shippingWeightLb.message}</span>
                      )}
                    </div>
                  </div>
                </div>
                <div className="">
                  <div className="form-check">
                    <input
                      className="form-check-input"
                      type="checkbox"
                      id="proShipsInt"
                      {...register('proShipsInt')}
                    />
                    <label className="form-check-label" htmlFor="proShipsInt">
                      This Product Ships Internationally
                    </label>
                  </div>
                  {errors.proShipsInt && (
                    <span className={css.error}>{errors.proShipsInt.message}</span>
                  )}
                </div>
              </div>

              <div className="form-group">
                <label htmlFor="customsInformation">Customs Information</label>
                <select
                  className={`form-control ${errors.customsInformation ? 'is-invalid' : ''}`}
                  name="customsInformation"
                  {...register('customsInformation')}
                >
                  <option value="">Select Customs Information</option>
                  {countryOptions.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
                {errors.customsInformation && (
                  <div className="invalid-feedback">{errors.customsInformation.message}</div>
                )}
              </div>

              <div className="form-group">
                <label className={css.label + " form-label"} htmlFor="proCode">
                  Code
                </label>
                <input
                  className="form-control"
                  type="text"
                  id="proCode"
                  {...register('proCode')}
                />
                {errors.proCode && (
                  <span className={css.error}>{errors.proCode.message}</span>
                )}
              </div>

              <div className="row">
                <div className="col-md-12">
                  <div className="form-group">
                    <label className={css.label + " form-label"} htmlFor="proVariants">
                      Variants:
                    </label>
                    {/* <button className={css.addBtn} onClick={addVariants}>
                      Add Options like different sizes and colors
                    </button> */}
                    {/* <button type="button" className="btn btn-sm btn-main" onClick={addOption}>
                      Add Option
                    </button> */}
                    {/* {options.map((option, optionIndex) => (
                      <div key={optionIndex} className="form-group">
                        <div>
                          <label>Option Name</label>
                          <input
                            type="text"
                            className="form-control"
                            value={option.name}
                            onChange={(event) => handleOptionNameChange(optionIndex, event)}
                          />
                        </div>
                        <div>
                          <label>Option Values</label>
                          {option.values.map((value, valueIndex) => (
                            <div key={valueIndex}>
                              <input
                                type="text"
                                className="form-control"
                                value={value}
                                onChange={(event) => handleOptionValueChange(optionIndex, valueIndex, event)}
                              />
                            </div>
                          ))}
                          <button type="button" onClick={() => addValue(optionIndex)}>
                            Add Value
                          </button>
                        </div>
                      </div>
                    ))} */}
                  </div>
                </div>
              </div>

              <div className={`${css.formBtns}`}>
                <button
                  className={`btn btn-main ${css.formBtn} ${css.formSubmit}`}
                  type="submit"
                >
                  Save
                </button>
              </div>
            </form>

          </div>
        </div>
      </div>
      <Modal
        className={css.modalTwo + " formModal formModal2"}
        fullscreen={"lg-down"}
        size="lg"
        centered show={showSubmitModal}
        // onHide={handleClose2}
        keyboard={false}
        backdrop="static">
        <Modal.Header>
          <Link className={css.circleBtn + ' backBtn fw-bold'} to="/">
            ←
          </Link>
          <div className="text-center w-100 bg-main">
            <Modal.Title className="text-center"> </Modal.Title>
            <p className="text-center mb-0"> </p>
          </div>
          <span></span>
        </Modal.Header>
        <Modal.Body>
          <div>
            <div className="d-flex justify-content-center text-center mb-4">
              <div className={css.iconWrapper}>
                <img className={css.icon} src={iconProperty} alt="" />
              </div>
            </div>
            <h1 className={css.modalHeading + " text-center mb-5"}>Your Property has been added successfully.</h1>

          </div>
        </Modal.Body>
        <Modal.Footer className="d-flex flex-column justify-content-center text-center">
          <Link className="circleBtn text-center fw-bold" to="/">
            →
          </Link>
          <span className="small fw-bold">Continue</span>
        </Modal.Footer>
      </Modal>
    </section>
  );
};

export default MultiStepForm;
