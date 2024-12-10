import { Visibility, VisibilityOff } from '@mui/icons-material';
import { Checkbox, FormControl, FormControlLabel, FormHelperText, IconButton, InputAdornment, InputLabel, MenuItem, OutlinedInput, Select } from '@mui/material'
import React from 'react'

export default function Forminput({ onChange, formtype, isError, label,signup, placeholder, children, name, value, onClick }) {
  const [showPassword, setShowPassword] = React.useState(false);

  const handleClickShowPassword = () => setShowPassword((show) => !show);

  const handleMouseDownPassword = (event) => {
    event.preventDefault();
  };

  return (
    <div className={`${signup ? '':'mb-3'} `}>
      <FormControl fullWidth error={isError}>
        {formtype === 'checkbox' &&
          <FormControlLabel className='text-xs'
            name={name} value={value}
            checked={value} onChange={onChange}
            control={<Checkbox />}
            label={placeholder} />}
        <InputLabel className='bg-white py-1 px-4' htmlFor="component-outlined">{label}</InputLabel>
        {formtype === 'select' &&
          <>
            <Select
              labelId="demo-simple-select-label"
              name={name} value={value} onChange={onChange}
              label="Age"
            >
              <MenuItem value={''}>--Select--</MenuItem>
              {children}
            </Select>
          </>}
        {formtype === 'text' &&
          <OutlinedInput name={name} value={value} onChange={onChange} onClick={onClick} />}
        {formtype === 'number' &&
          <OutlinedInput name={name} value={value} type='number' onChange={onChange} onClick={onClick} />}
        {formtype === 'password' &&
          <>
            {/* <InputLabel htmlFor="outlined-adornment-password">Password</InputLabel> */}
            <OutlinedInput
              name={name} value={value} onChange={onChange}
              type={showPassword ? 'text' : 'password'}
              endAdornment={
                <InputAdornment position="end">
                  <IconButton
                    aria-label="toggle password visibility"
                    onClick={handleClickShowPassword}
                    onMouseDown={handleMouseDownPassword}
                    edge="end"
                  >
                    {showPassword ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
              }
              label="Password"
            />
          </>}
        {isError && <FormHelperText>{isError}</FormHelperText>}
      </FormControl>


    </div>
  )
}