import React from 'react';

import FormControl from '@material-ui/core/FormControl';
import Input from '@material-ui/core/Input';
import InputLabel from '@material-ui/core/InputLabel';


const formControl = props => {

  const { formFields } = props;

  return Object.keys(props.formFields).map(f => {
    const { type, placeholder, reference } = formFields[f];

    return (
      <FormControl margin="normal" required fullWidth key={type}>
        <InputLabel htmlFor={type}>{placeholder}</InputLabel>
        <Input
          id={type}
          name={type}
          type={type}
          inputRef={reference}
        />
      </FormControl>)
  })

}

export default formControl;