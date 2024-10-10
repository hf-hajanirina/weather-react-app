import React, { useState } from 'react';
import { 
  Autocomplete, 
  TextField, 
  CircularProgress, 
  IconButton,
  Paper,
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import { debounce } from '@mui/material/utils';
import axios from 'axios';

interface Location {
  name: string;
  country: string;
  state?: string;
}

interface SearchFormProps {
  onSearch: (location: string) => void;
}

const SearchForm: React.FC<SearchFormProps> = ({ onSearch }) => {
  const [open, setOpen] = useState(false);
  const [options, setOptions] = useState<Location[]>([]);
  const [loading, setLoading] = useState(false);
  const [inputValue, setInputValue] = useState('');

  const fetchLocations = async (input: string) => {
    if (input.length < 2) return;
    setLoading(true);
    try {
      const response = await axios.get(`http://api.openweathermap.org/geo/1.0/direct`, {
        params: {
          q: input,
          limit: 5,
          appid: import.meta.env.VITE_OPENWEATHER_API_KEY
        }
      });
      const locations: Location[] = response.data.map((item: any) => ({
        name: item.name,
        country: item.country,
        state: item.state
      }));
      setOptions(locations);
    } catch (error) {
      console.error('Error fetching locations:', error);
      setOptions([]);
    } finally {
      setLoading(false);
    }
  };

  const debouncedFetchLocations = React.useMemo(
    () => debounce(fetchLocations, 300),
    []
  );

  React.useEffect(() => {
    return () => {
      debouncedFetchLocations.clear();
    };
  }, [debouncedFetchLocations]);

  const handleInputChange = (event: React.SyntheticEvent, newInputValue: string) => {
    setInputValue(newInputValue);
    debouncedFetchLocations(newInputValue);
  };

  const handleSearch = () => {
    if (inputValue.trim()) {
      onSearch(inputValue.trim());
    }
  };

  return (
    <Paper elevation={3} sx={{ p: 2, display: 'flex', alignItems: 'center' }}>
      <Autocomplete
        id="location-search"
        sx={{ flexGrow: 1 }}
        open={open}
        onOpen={() => setOpen(true)}
        onClose={() => setOpen(false)}
        inputValue={inputValue}
        onInputChange={handleInputChange}
        options={options}
        getOptionLabel={(option) => 
          typeof option === 'string' 
            ? option 
            : `${option.name}${option.state ? `, ${option.state}` : ''}, ${option.country}`
        }
        filterOptions={(x) => x}
        freeSolo
        renderInput={(params) => (
          <TextField
            {...params}
            label="Search for a city or country"
            variant="outlined"
            InputProps={{
              ...params.InputProps,
              endAdornment: (
                <React.Fragment>
                  {loading ? <CircularProgress color="inherit" size={20} /> : null}
                  {params.InputProps.endAdornment}
                </React.Fragment>
              ),
            }}
          />
        )}
        renderOption={(props, option) => (
          <li {...props}>
            {option.name}{option.state ? `, ${option.state}` : ''}, {option.country}
          </li>
        )}
      />
      <IconButton 
        color="primary" 
        onClick={handleSearch}
        disabled={!inputValue.trim()}
        sx={{ ml: 1 }}
      >
        <SearchIcon />
      </IconButton>
    </Paper>
  );
};

export default SearchForm;