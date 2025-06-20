import React from 'react';
import '../App.css';
import areas from '../constants/list_area';
import types from '../constants/list_type';
import { Box, Stack, Typography, Button } from '@mui/material';

const CampFilter = ({ selectedAreas, setAreas, selectedTypes, setTypes }) => {
  
    const toggleSelection = (value, selectedList, setSelected) => {
      if (selectedList.includes(value)) {
        setSelected(selectedList.filter((item) => item !== value));        
      } else {
        setSelected([...selectedList, value]);
      }
    };
  
    return (
      <Stack spacing={2} sx={{ mt: 3, mb: 3 }}>
        <Box display="flex" alignItems="center">
          <Typography variant="subtitle1" sx={{ color: 'zinc.500', fontWeight: 600 }}>
            地區篩選
          </Typography>
          <Box sx={{ ml: 2 }}>
            {areas.map((area) => (
              <Button
                key={area.value}
                size="small"
                // variant={selectedAreas.includes(area.value) ? 'contained' : 'outlined'}
                sx={{
                  boxSizing: 'border-box',
                  border: '1px solid',
                  borderColor: selectedAreas.includes(area.value) ? '#a684ff' : '#d4d4d8',
                  color: selectedAreas.includes(area.value) ? 'white' : '#71717a',
                  backgroundColor: selectedAreas.includes(area.value) ? '#a684ff' : '#f9fafb',
                  mr: 1.5,
                  px: 3,
                  borderRadius: 2,
                  textTransform: 'none',
                  fontSize: 14,
                }}
                onClick={() => toggleSelection(area.value, selectedAreas, setAreas)}
              >
                {area.name}
              </Button>
            ))}
          </Box>
        </Box>
  
        <Box display="flex" alignItems="center">
          <Typography variant="subtitle1" sx={{ color: 'zinc.500', fontWeight: 600 }}>
            類型篩選
          </Typography>
          <Box sx={{ ml: 2 }}>
            {types.map((type) => (
              <Button
                key={type.value}
                size="small"
                // variant={selectedTypes.includes(type.value) ? 'contained' : 'outlined'}
                sx={{
                  boxSizing: 'border-box',
                  border: '1px solid',
                  borderColor: selectedTypes.includes(type.value) ? '#a684ff' : '#d4d4d8',
                  color: selectedTypes.includes(type.value) ? 'white' : '#71717a',
                  backgroundColor: selectedTypes.includes(type.value) ? '#a684ff' : '#f9fafb',
                  mr: 1.5,
                  px: 3,
                  borderRadius: 2,
                  textTransform: 'none',
                  fontSize: 14,
                }}
                onClick={() => toggleSelection(type.value, selectedTypes, setTypes)}
              >
                {type.name}
              </Button>
            ))}
          </Box>
        </Box>
      </Stack>
    );
  };
  
  export default CampFilter;