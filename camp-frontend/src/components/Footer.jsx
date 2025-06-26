import React from 'react';
import { Box, Typography } from '@mui/material';

const Footer = () => {
  return (
    <Box component="footer" sx={{ py: 2, textAlign: 'center', color: 'text.secondary' }}>
      <Typography variant="body2">
        圖片素材來源：愛露營網站。僅供作品練習與展示使用，無商業用途。
      </Typography>
    </Box>
  );
};

export default Footer;