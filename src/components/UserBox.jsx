import { Avatar, Box, Divider, Typography } from "@mui/material";

export default function UserBox({userName}) {
    return(
        <Box 
            sx={{
            display:'flex',
            alignContent: 'center',
            mb:2,
            width: "100%"
            }}
        >
            <Avatar sx={{ width: 32, height: 32, bgcolor: 'secondary.main' }}>{userName.charAt(0)}</Avatar>
            <Typography sx={{mt: 1, ml:1}}>{userName}</Typography>
            
        </Box>
    )
}