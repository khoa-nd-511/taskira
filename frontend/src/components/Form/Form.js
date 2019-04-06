import React from 'react';

import {
  FormControl,
  Input,
  InputLabel,
  FormControlLabel,
  Switch,
  RadioGroup,
  Radio,
} from '@material-ui/core';

const formControl = props => {

  const { formFields, switched, selected } = props;

  return Object.keys(props.formFields).map(f => {
    const { name, type, placeholder, reference, options, checked } = formFields[f];

    let input = null;

    switch (type) {
      case 'text':
        input = (
          <React.Fragment>
            <InputLabel htmlFor={type}>{placeholder}</InputLabel>
            <Input
              id={type}
              name={type}
              type={type}
              inputRef={reference}
            />
          </React.Fragment>
        )
        break;

      case 'email':
        input = (
          <React.Fragment>
            <InputLabel htmlFor={type}>{placeholder}</InputLabel>
            <Input
              id={type}
              name={type}
              type={type}
              inputRef={reference}
            />
          </React.Fragment>
        )
        break;

      case 'password':
        input = (
          <React.Fragment>
            <InputLabel htmlFor={type}>{placeholder}</InputLabel>
            <Input
              id={type}
              name={type}
              type={type}
              inputRef={reference}
            />
          </React.Fragment>
        )
        break;

      case 'radio':
        input = (
          <FormControlLabel
            control={
              <Switch
                checked={checked}
                onChange={() => switched(!checked)}
              />}
            label="High Prioritized"
            labelPlacement="top"
          />
        )
        break;

      case 'select':
        const selectOptions = Object.keys(options).map(o => (
          <FormControlLabel
            key={options[o].label}
            value={options[o].label}
            label={options[o].label}
            labelPlacement="top"
            control={<Radio checked={options[o].selected} />}
          />))
        input = (
          <RadioGroup
            onChange={e => selected(e.target.value.toLowerCase())}
          >
            {selectOptions}
          </RadioGroup>
        )
        break;

      default:
        input = (
          <React.Fragment>
            <InputLabel htmlFor={type}>{placeholder}</InputLabel>
            <Input
              id={type}
              name={type}
              type={type}
              inputRef={reference}
            />
          </React.Fragment>
        )
        break;
    }

    return (
      <FormControl margin="normal" required fullWidth key={name} style={props.styles}>
        {input}
      </FormControl>)
  })

}

export default formControl;