import React from 'react';
import { useField } from 'formik';
import {
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  FormHelperText,
  Chip,
  Box,
} from '@mui/material';

/**
 * A form field component that integrates with Formik
 * Can be used directly with Formik's Field component or standalone
 */
const FormField = (props) => {
  const {
    // When used directly with Field component={FormField}
    field,
    form,
    meta,
    
    // Our own props
    name: nameProp,
    type = 'text',
    label,
    options = [],
    multiple = false,
    multiline = false,
    rows = 1,
    ...restProps
  } = props;
  
  // Create a valid field name for useField hook
  const fieldName = (field && field.name) || nameProp || '_dummyField';
  
  // Always call useField to satisfy React Hooks rules
  const [fieldFromHook, metaFromHook, helpersFromHook] = useField(fieldName);
  
  // Determine which props to use (from Formik's Field or from direct usage)
  const fieldProps = field || (nameProp ? fieldFromHook : { name: fieldName, value: '', onChange: () => {}, onBlur: () => {} });
  const metaProps = meta || (nameProp ? metaFromHook : { touched: false, error: null });
  
  // Error handling
  const touched = metaProps.touched;
  const error = metaProps.error;
  const hasError = touched && Boolean(error);
  
  // Format error message
  let errorMessage = '';
  if (touched && error) {
    if (typeof error === 'string') {
      errorMessage = error;
    } else if (error && typeof error === 'object') {
      errorMessage = error.message || JSON.stringify(error);
    }
  }

  // Handle onChange events
  const handleChange = (e) => {
    const value = e.target.value;
    
    // Special handling for number fields
    if (type === 'number' && value !== '' && isNaN(parseFloat(value))) {
      return; // Don't update if not a valid number
    }
    
    if (form && form.setFieldValue) {
      form.setFieldValue(fieldName, value);
    } else if (helpersFromHook && helpersFromHook.setValue && nameProp) {
      helpersFromHook.setValue(value);
    } else if (fieldProps.onChange) {
      fieldProps.onChange(e);
    }
  };

  // Handle onBlur events
  const handleBlur = (e) => {
    if (form && form.setFieldTouched) {
      form.setFieldTouched(fieldName, true);
    } else if (helpersFromHook && helpersFromHook.setTouched && nameProp) {
      helpersFromHook.setTouched(true);
    } else if (fieldProps.onBlur) {
      fieldProps.onBlur(e);
    }
  };

  // For select fields
  if (type === 'select') {
    // Ensure proper value format for select
    let fieldValue = fieldProps.value;
    
    if (multiple) {
      // For multiple select, ensure we have an array
      fieldValue = Array.isArray(fieldValue) ? fieldValue : (fieldValue ? [fieldValue] : []);
    } else {
      // For single select, ensure we have a primitive value
      fieldValue = fieldValue === null || fieldValue === undefined || typeof fieldValue === 'object' ? '' : fieldValue;
    }

    return (
      <FormControl
        fullWidth
        error={hasError}
        variant="outlined"
        sx={{ mb: 2 }}
      >
        <InputLabel>{label}</InputLabel>
        <Select
          name={fieldName}
          value={fieldValue}
          label={label}
          multiple={multiple}
          onChange={handleChange}
          onBlur={handleBlur}
          {...restProps}
          renderValue={(selected) => {
            if (multiple && Array.isArray(selected)) {
              return (
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                  {selected.map((value) => {
                    const option = options.find(opt => opt.value === value);
                    return (
                      <Chip 
                        key={value} 
                        label={option ? option.label : String(value)} 
                        size="small" 
                      />
                    );
                  })}
                </Box>
              );
            } else {
              const option = options.find(opt => opt.value === selected);
              return option ? option.label : (selected || '');
            }
          }}
        >
          {options.map((option) => (
            <MenuItem key={option.value} value={option.value}>
              {option.label}
            </MenuItem>
          ))}
        </Select>
        {errorMessage && (
          <FormHelperText error>{errorMessage}</FormHelperText>
        )}
      </FormControl>
    );
  }

  // For all other field types (text, email, password, etc.)
  return (
    <TextField
      name={fieldName}
      type={type}
      label={label}
      value={fieldProps.value === null || fieldProps.value === undefined ? '' : fieldProps.value}
      onChange={handleChange}
      onBlur={handleBlur}
      error={hasError}
      helperText={errorMessage}
      fullWidth
      multiline={multiline}
      rows={rows}
      variant="outlined"
      sx={{ mb: 2 }}
      {...restProps}
    />
  );
};

export default FormField;
