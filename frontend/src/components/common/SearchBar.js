import React from 'react';
import {
  Paper,
  InputBase,
  IconButton,
  useTheme,
} from '@mui/material';
import { Search as SearchIcon, Clear as ClearIcon } from '@mui/icons-material';

const SearchBar = ({
  value,
  onChange,
  onSubmit,
  placeholder = 'Search...',
  fullWidth = true,
}) => {
  const theme = useTheme();

  const handleSubmit = (e) => {
    e.preventDefault();
    if (onSubmit) {
      onSubmit(value);
    }
  };

  const handleClear = () => {
    onChange('');
  };

  return (
    <Paper
      component="form"
      onSubmit={handleSubmit}
      sx={{
        p: '2px 4px',
        display: 'flex',
        alignItems: 'center',
        width: fullWidth ? '100%' : 'auto',
        mb: 2,
        border: `1px solid ${theme.palette.divider}`,
      }}
    >
      <IconButton type="submit" sx={{ p: '10px' }} aria-label="search">
        <SearchIcon />
      </IconButton>
      <InputBase
        sx={{ ml: 1, flex: 1 }}
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        inputProps={{ 'aria-label': 'search' }}
      />
      {value && (
        <IconButton
          sx={{ p: '10px' }}
          aria-label="clear"
          onClick={handleClear}
        >
          <ClearIcon />
        </IconButton>
      )}
    </Paper>
  );
};

export default SearchBar;
