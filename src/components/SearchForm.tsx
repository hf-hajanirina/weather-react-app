import React, { useState } from 'react';
import { 
  Autocomplete, 
  TextField, 
  CircularProgress, 
  IconButton,
  Paper,
  Typography
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
      
      const uniqueLocations = response.data.reduce((acc: Location[], item: any) => {
        const key = `${item.name}-${item.country}${item.state ? `-${item.state}` : ''}`;
        if (!acc.some(location => 
          `${location.name}-${location.country}${location.state ? `-${location.state}` : ''}` === key
        )) {
          acc.push({
            name: item.name,
            country: item.country,
            state: item.state
          });
        }
        return acc;
      }, []);

      setOptions(uniqueLocations);
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
            <Typography noWrap>
              {option.name}
              {option.state && (
                <Typography component="span" color="text.secondary">
                  , {option.state}
                </Typography>
              )}
              <Typography component="span" color="text.secondary">
                , {option.country}
              </Typography>
            </Typography>
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