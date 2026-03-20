import { useEffect, useState } from 'react';
import { useSocket } from './context/SocketContext';
import { getHeartBeat } from './requests/HeartBeat';
import { Box, Typography, TextField, Button, Paper, Avatar, IconButton, InputBase, Divider, List, ListItem, ListItemText, ListItemAvatar } from '@mui/material';
import SendIcon from '@mui/icons-material/Send';
import LoginIcon from '@mui/icons-material/Login';
import ForumIcon from '@mui/icons-material/Forum';

function App() {
  const [isConnected, setIsConnected] = useState(false);
  const [serverIsUp, setServerIsUp] = useState(false);
  const [userName, setUserName] = useState('');
  const [roomId, setRoomId] = useState('');

  const [message, setMessage] = useState('');
  const [chatHistory, setChatHistory] = useState([]);

  const {socket, connect, disconnect} = useSocket();

  const handleJoin = (e) => {
    e.preventDefault();
    if (userName && roomId){
      const ws = connect(userName, roomId);

      ws.onmessage = (event) => {
        const data = JSON.parse(event.data);
        setChatHistory( (prev) => [...prev, data] );
      };

      setIsConnected(true);
    }
  };

  const handleSendMessage = () => {
    if(socket && message.trim()){
      const payload = {
        sender: userName,
        roomId: roomId,
        text: message,
      };

      socket.send(JSON.stringify(payload));
      setMessage('');
    }
  };

  const handleLogout = () => {
    disconnect();
    setIsConnected(false);
  }

  useEffect(() => {
    const fetchStatusServer = async () => {
      const response = await getHeartBeat();
      console.log("A RESPOSTA PARA O STATUS SERVER É: ", response);
      return response;
    }

    fetchStatusServer();
  })

  if (!isConnected) {
    return (
      <Box sx={{ 
        height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', 
        bgcolor: '#f0f2f5', p: 2 
      }}>
        <Paper elevation={3} sx={{ p: 4, width: '100%', maxWidth: '400px', borderRadius: 3, textAlign: 'center' }}>
          <Avatar sx={{ m: '0 auto 16px', bgcolor: 'primary.main', width: 56, height: 56 }}>
            <ForumIcon />
          </Avatar>
          <Typography variant="h5" gutterBottom sx={{ fontWeight: 'bold' }}>Entrar no Chat</Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>Insira seus dados para acessar uma sala</Typography>
          
          <Box component="form" onSubmit={handleJoin} sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            <TextField 
              label="Seu Nome" 
              variant="outlined" 
              fullWidth 
              required
              value={userName}
              onChange={(e) => setUserName(e.target.value)}
            />
            <TextField 
              label="ID da Sala" 
              variant="outlined" 
              fullWidth 
              required
              placeholder="Ex: sala-dev-01"
              value={roomId}
              onChange={(e) => setRoomId(e.target.value)}
            />
            <Button 
              type="submit" 
              variant="contained" 
              size="large" 
              startIcon={<LoginIcon />}
              sx={{ mt: 1, py: 1.5, borderRadius: '8px' }}
            >
              Conectar
            </Button>
          </Box>
        </Paper>
      </Box>
    );
  }

  return (
    <Box sx={{ display: 'flex', height: '100vh', width: '100vw', overflow: 'hidden', bgcolor: '#e5ddd5' }}>
      
      <Box sx={{ 
        width: { xs: '80px', sm: '300px' }, 
        bgcolor: 'background.paper', 
        borderRight: '1px solid', 
        borderColor: 'divider',
        display: 'flex', flexDirection: 'column'
      }}>
        <Box sx={{ p: 2, height: '64px', display: 'flex', alignItems: 'center', borderBottom: '1px solid', borderColor: 'divider' }}>
          <Typography variant="h6" sx={{ fontWeight: 'bold', display: { xs: 'none', sm: 'block' } }}>Sala Ativa</Typography>
          <ForumIcon sx={{ display: { xs: 'block', sm: 'none' }, m: 'auto' }} />
        </Box>
        
        <Box sx={{ p: 2, textAlign: { xs: 'center', sm: 'left' } }}>
          <Typography variant="overline" color="primary" sx={{ fontWeight: 'bold' }}>ID DA SALA</Typography>
          <Typography variant="body1" sx={{ mb: 2, wordBreak: 'break-all' }}>#{roomId}</Typography>
          
          <Divider sx={{ mb: 2 }} />
          
          <Typography variant="overline" color="text.secondary" sx={{ fontWeight: 'bold' }}>VOCÊ</Typography>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, justifyContent: { xs: 'center', sm: 'flex-start' } }}>
            <Avatar sx={{ width: 32, height: 32, bgcolor: 'secondary.main' }}>{userName.charAt(0)}</Avatar>
            <Typography variant="body2" sx={{ display: { xs: 'none', sm: 'block' } }}>{userName}</Typography>
          </Box>
        </Box>

        <Button 
          variant="text" 
          color="error" 
          sx={{ mt: 'auto', mb: 2, mx: 2 }} 
          onClick={() => setIsConnected(false)}
        >
          Sair da Sala
        </Button>
      </Box>

      <Box sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
        
        <Paper square elevation={1} sx={{ p: 2, height: '64px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', zIndex: 1 }}>
          <Typography variant="subtitle1" sx={{ fontWeight: 'bold' }}>Chat: {roomId}</Typography>
          <Typography variant="caption" color="text.secondary">Online</Typography>
        </Paper>

        <Box sx={{ flexGrow: 1, overflowY: 'auto', p: 3, display: 'flex', flexDirection: 'column', gap: 1.5 }}>
          {chatHistory.map((msg) => (
            <Box 
              key={msg.id} 
              sx={{ display: 'flex', justifyContent: msg.sender === userName ? 'flex-end' : 'flex-start' }}
            >
              <Paper sx={{ 
                p: '6px 12px', 
                maxWidth: '80%', 
                bgcolor: msg.sender === userName ? '#dcf8c6' : 'white',
                borderRadius: 2,
                boxShadow: '0 1px 0.5px rgba(0,0,0,0.13)'
              }}>
                {msg.sender !== userName && (
                  <Typography variant="caption" sx={{ fontWeight: 'bold', color: 'primary.main', display: 'block' }}>
                    {msg.sender}
                  </Typography>
                )}
                <Typography variant="body1">{msg.text}</Typography>
                <Typography variant="caption" sx={{ display: 'block', textAlign: 'right', opacity: 0.5, fontSize: '0.7rem' }}>
                  {msg.time}
                </Typography>
              </Paper>
            </Box>
          ))}
        </Box>

        <Box sx={{ p: 2, bgcolor: '#f0f2f5', display: 'flex', alignItems: 'center', gap: 1 }}>
          <Paper
            sx={{ p: '4px 12px', display: 'flex', alignItems: 'center', flexGrow: 1, borderRadius: '25px' }}
            elevation={0}
          >
            <InputBase
              sx={{ ml: 1, flex: 1 }}
              placeholder="Envie uma mensagem..."
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
            />
          </Paper>
          <IconButton 
            color="primary" 
            onClick={handleSendMessage}
            sx={{ bgcolor: 'primary.main', color: 'white', '&:hover': { bgcolor: 'primary.dark' } }}
          >
            <SendIcon />
          </IconButton>
        </Box>
      </Box>
    </Box>
  );
}

export default App;