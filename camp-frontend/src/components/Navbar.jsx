import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../App.css';
import { AppBar, Button, Container, Menu, MenuItem, Toolbar, Typography, IconButton, Box, Badge } from '@mui/material';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import { useCart } from '../context/CartContext';
import { useUser } from '../context/UserContext';

const Navbar = () => {
    const [anchorEl, setAnchorEl] = useState(null);
    const { cartItems, clearCart } = useCart();
    const navigate = useNavigate();
    const open = Boolean(anchorEl);
    const { user, logout } = useUser();

    const handleMenuOpen = (event) => setAnchorEl(event.currentTarget);
    const handleMenuClose = () => setAnchorEl(null);

    const handleLogout = () => {
        localStorage.removeItem("user");
        logout();
        clearCart();
        navigate('/');
    };

    return (
        <AppBar
            position="static"
            sx={{
                backgroundColor: "#a684ff",
                boxShadow: 2,
            }}
        >
            <Container maxWidth="lg">
                <Toolbar disableGutters sx={{ display: "flex", justifyContent: "space-between" }}>
                    {/* 左側 Logo */}
                    <Typography variant="h5" fontWeight="bold" sx={{ color: "white" }}>
                        <a href="/" style={{ textDecoration: "none", color: "inherit" }}>COME CAMP</a>
                    </Typography>

                    <Box>
                        {/* 右側登入/會員 */}
                        <IconButton
                            color="inherit"
                            onClick={() => navigate('/order')}
                            sx={{ mr: 2, color: 'white' }}
                        >
                            <Badge badgeContent={cartItems.length} color="secondary">
                                <ShoppingCartIcon />
                            </Badge>
                        </IconButton>
                        { user ? (
                            <>
                            <Button
                                onClick={handleMenuOpen}
                                sx={{
                                    backgroundColor: "white",
                                    color: "#a684ff",
                                    fontWeight: 600,
                                    "&:hover": {
                                        backgroundColor: "#f4f4f5",
                                    },
                                    px: 2,
                                    borderRadius: 2,
                                    textTransform: "none",
                                }}
                            >
                                會員
                            </Button>
                                <Menu 
                                    anchorEl={anchorEl} 
                                    open={open} 
                                    onClose={handleMenuClose}
                                    anchorOrigin={{
                                        vertical: 'bottom',
                                        horizontal: 'right', // ⬅️ 錨點：對齊按鈕的左邊
                                    }}
                                    transformOrigin={{
                                        vertical: 'top',
                                        horizontal: 'right', // ⬅️ 選單的左邊對齊按鈕左邊
                                    }}
                                >                        
                                    <MenuItem onClick={() => {
                                        handleMenuClose();
                                        window.location.href = "/menber";}}>
                                        查看訂單
                                    </MenuItem>
                                    <MenuItem onClick={handleLogout}>登出</MenuItem>
                                </Menu>
                            </>
                        ) : (
                            <Button
                                variant="contained"
                                sx={{
                                    backgroundColor: "white",
                                    color: "#a684ff",
                                    fontWeight: 600,
                                    "&:hover": {
                                        backgroundColor: "#f4f4f5",
                                    },
                                    px: 2,
                                    borderRadius: 2,
                                    textTransform: "none",
                                }}
                                onClick={() => navigate('/login')}
                            >
                                登入
                            </Button>
                        )}
                    </Box>
                </Toolbar>
            </Container>
        </AppBar>
    );
};

export default Navbar;