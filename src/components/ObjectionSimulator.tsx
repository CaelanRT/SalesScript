import React, { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  TextField,
  Box,
  Paper,
  CircularProgress,
  Divider,
  IconButton,
  Avatar,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import PersonIcon from '@mui/icons-material/Person';
import SupportAgentIcon from '@mui/icons-material/SupportAgent';
import { ObjectionResponse } from '../services/ollamaService';

interface Message {
  id: number;
  text: string;
  sender: 'user' | 'prospect';
  context?: string;
}

interface ObjectionSimulatorProps {
  open: boolean;
  onClose: () => void;
  persona: {
    name: string;
    companyName: string;
    jobTitle: string;
  };
  product: {
    companyName: string;
  };
  script: string;
  currentObjection: ObjectionResponse | null;
  onSubmitResponse: (response: string) => Promise<void>;
  isLoading: boolean;
  messages: Message[];
  isResolved: boolean;
}

const ObjectionSimulator: React.FC<ObjectionSimulatorProps> = ({
  open,
  onClose,
  persona,
  product,
  script,
  currentObjection,
  onSubmitResponse,
  isLoading,
  messages,
  isResolved,
}) => {
  const [response, setResponse] = useState('');

  const handleSubmit = async () => {
    if (!response.trim()) return;
    
    await onSubmitResponse(response);
    setResponse('');
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  return (
    <Dialog 
      open={open} 
      onClose={onClose} 
      maxWidth="md" 
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: 3,
          boxShadow: '0 12px 40px rgba(57, 62, 65, 0.15)',
          overflow: 'hidden'
        }
      }}
    >
      <DialogTitle sx={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center',
        background: 'linear-gradient(135deg, #44BBA4 0%, #339985 100%)',
        color: 'white',
        py: 2.5,
        px: 3
      }}>
        <Typography variant="h6" sx={{ fontWeight: 500, display: 'flex', alignItems: 'center', gap: 1 }}>
          <SupportAgentIcon /> Objection Simulator: Conversation with {persona.name}
        </Typography>
        <IconButton 
          edge="end" 
          color="inherit" 
          onClick={onClose} 
          aria-label="close"
          sx={{ 
            bgcolor: 'rgba(255, 255, 255, 0.1)', 
            '&:hover': { bgcolor: 'rgba(255, 255, 255, 0.2)' } 
          }}
        >
          <CloseIcon />
        </IconButton>
      </DialogTitle>
      
      <DialogContent sx={{ p: 3, minHeight: '450px', bgcolor: '#FAFAF9' }}>
        <Box sx={{ mb: 4 }}>
          <Box sx={{ 
            display: 'flex', 
            justifyContent: 'space-between', 
            alignItems: 'flex-start',
            flexWrap: 'wrap',
            gap: 3
          }}>
            <Box sx={{ flex: '1 1 300px', minWidth: 0 }}>
              <Typography 
                variant="subtitle2" 
                color="text.secondary" 
                gutterBottom
                sx={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  gap: 0.5,
                  fontWeight: 500,
                  mb: 1
                }}
              >
                <PersonIcon fontSize="small" /> You're speaking with:
              </Typography>
              <Paper 
                elevation={0} 
                sx={{ 
                  p: 2.5, 
                  bgcolor: 'white',
                  border: '1px solid',
                  borderColor: 'divider',
                  borderRadius: 2,
                  transition: 'transform 0.2s ease, box-shadow 0.2s ease',
                  '&:hover': {
                    boxShadow: '0 4px 12px rgba(57, 62, 65, 0.08)',
                    transform: 'translateY(-2px)'
                  }
                }}
              >
                <Typography variant="subtitle1" fontWeight="bold" color="primary.dark" gutterBottom>
                  {persona.name}
                </Typography>
                <Typography variant="body2" sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                  {persona.jobTitle} at {persona.companyName}
                </Typography>
              </Paper>
            </Box>
            
            <Box sx={{ flex: '1 1 300px', minWidth: 0 }}>
              <Typography 
                variant="subtitle2" 
                color="text.secondary" 
                gutterBottom
                sx={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  gap: 0.5,
                  fontWeight: 500,
                  mb: 1,
                  justifyContent: { xs: 'flex-start', md: 'flex-end' }
                }}
              >
                Conversation Progress
              </Typography>
              <Paper 
                elevation={0} 
                sx={{ 
                  p: 2.5, 
                  bgcolor: 'white', 
                  minWidth: '180px',
                  border: '1px solid',
                  borderColor: 'divider',
                  borderRadius: 2,
                  transition: 'transform 0.2s ease, box-shadow 0.2s ease',
                  '&:hover': {
                    boxShadow: '0 4px 12px rgba(57, 62, 65, 0.08)',
                    transform: 'translateY(-2px)'
                  }
                }}
              >
                <Box sx={{ mb: 1.5 }}>
                  <Typography variant="body2" color="text.secondary">
                    Stage: <strong style={{ color: '#44BBA4' }}>{currentObjection ? currentObjection.conversationStage.charAt(0).toUpperCase() + currentObjection.conversationStage.slice(1) : 'Initial'}</strong>
                  </Typography>
                </Box>
                
                <Box sx={{ width: '100%', mb: 1.5 }}>
                  <Box
                    sx={{
                      height: 10,
                      borderRadius: 5,
                      bgcolor: '#E7E5DF',
                      position: 'relative',
                      overflow: 'hidden',
                    }}
                  >
                    <Box
                      sx={{
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        bottom: 0,
                        width: `${currentObjection?.progressIndicator || 0}%`,
                        background: currentObjection?.progressIndicator || 0 > 75 ? 'linear-gradient(90deg, #44BBA4, #339985)' : 
                                  currentObjection?.progressIndicator || 0 > 50 ? 'linear-gradient(90deg, #44BBA4, #339985)' : 
                                  currentObjection?.progressIndicator || 0 > 25 ? 'linear-gradient(90deg, #E7B841, #D19F2A)' : 'linear-gradient(90deg, #F44336, #D32F2F)',
                        transition: 'width 0.5s ease-in-out',
                      }}
                    />
                  </Box>
                </Box>
                
                <Typography 
                  variant="caption" 
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 0.5,
                    color: isResolved ? 'success.main' : 'text.secondary',
                    fontWeight: isResolved ? 500 : 400
                  }}
                >
                  Goal: {isResolved ? 'Achieved! ✓' : 'Schedule Next Steps'}
                </Typography>
              </Paper>
            </Box>
          </Box>
        </Box>
        
        <Divider sx={{ my: 3 }} />
        
        <Box sx={{ 
          display: 'flex', 
          flexDirection: 'column', 
          gap: 3, 
          maxHeight: '320px', 
          overflowY: 'auto',
          p: 1,
          pr: 1.5,
          '&::-webkit-scrollbar': {
            width: '6px',
          },
          '&::-webkit-scrollbar-track': {
            background: '#E7E5DF',
            borderRadius: '10px',
          },
          '&::-webkit-scrollbar-thumb': {
            background: '#D3D0CB',
            borderRadius: '10px',
            '&:hover': {
              background: '#C0BDB8',
            },
          },
        }}>
          {messages.map((message) => (
            <Box 
              key={message.id} 
              sx={{
                display: 'flex',
                gap: 2,
                alignSelf: message.sender === 'user' ? 'flex-end' : 'flex-start',
                maxWidth: '80%',
              }}
            >
              {message.sender === 'prospect' && (
                <Avatar 
                  sx={{ 
                    bgcolor: 'secondary.main',
                    boxShadow: '0 2px 8px rgba(231, 184, 65, 0.2)'
                  }}
                >
                  <PersonIcon />
                </Avatar>
              )}
              
              <Paper 
                elevation={0} 
                sx={{
                  p: 2.5,
                  borderRadius: 3,
                  bgcolor: message.sender === 'user' ? 'primary.main' : 'white',
                  color: message.sender === 'user' ? 'white' : 'text.primary',
                  border: message.sender === 'prospect' ? '1px solid' : 'none',
                  borderColor: message.sender === 'prospect' ? 'divider' : 'transparent',
                  boxShadow: message.sender === 'user' ? '0 4px 12px rgba(68, 187, 164, 0.2)' : '0 2px 8px rgba(57, 62, 65, 0.05)',
                }}
              >
                <Typography variant="body1">{message.text}</Typography>
                {message.context && message.sender === 'prospect' && (
                  <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mt: 1, fontStyle: 'italic' }}>
                    Context: {message.context}
                  </Typography>
                )}
              </Paper>
              
              {message.sender === 'user' && (
                <Avatar 
                  sx={{ 
                    bgcolor: 'primary.main',
                    boxShadow: '0 2px 8px rgba(68, 187, 164, 0.2)'
                  }}
                >
                  <SupportAgentIcon />
                </Avatar>
              )}
            </Box>
          ))}
        </Box>
        
        {isResolved && (
          <Paper 
            elevation={1} 
            sx={{ 
              p: 2, 
              mt: 3, 
              bgcolor: 'success.light', 
              color: 'success.contrastText',
              borderRadius: 2
            }}
          >
            <Typography variant="subtitle1" fontWeight="bold">
              Success! Next Step Secured 🎉
            </Typography>
            <Typography variant="body2">
              You've successfully addressed the prospect's concerns and secured a {currentObjection?.nextStepType || 'follow-up'}. In a real sales situation, you would now confirm the details and send a calendar invite.
            </Typography>
          </Paper>
        )}
        
        <Box sx={{ mt: 4, display: 'flex', gap: 2, position: 'relative' }}>
          <TextField
            fullWidth
            multiline
            rows={2}
            placeholder="Type your response..."
            value={response}
            onChange={(e) => setResponse(e.target.value)}
            onKeyPress={handleKeyPress}
            disabled={isLoading || isResolved}
            variant="outlined"
            sx={{
              '& .MuiOutlinedInput-root': {
                borderRadius: 2.5,
                bgcolor: 'white',
                '&.Mui-focused': {
                  boxShadow: '0 0 0 3px rgba(68, 187, 164, 0.1)'
                }
              }
            }}
          />
          <Button
            variant="contained"
            color="primary"
            onClick={handleSubmit}
            disabled={!response.trim() || isLoading || isResolved}
            sx={{ 
              alignSelf: 'flex-end', 
              minWidth: '100px',
              height: '52px',
              borderRadius: 2.5,
              boxShadow: '0 4px 12px rgba(68, 187, 164, 0.2)',
              '&:hover': {
                boxShadow: '0 6px 16px rgba(68, 187, 164, 0.3)',
              },
              '&:disabled': {
                bgcolor: '#E7E5DF',
                color: '#A9A6A1'
              }
            }}
          >
            {isLoading ? <CircularProgress size={24} color="inherit" /> : 'Send'}
          </Button>
        </Box>
      </DialogContent>
      
      <DialogActions sx={{ p: 3, bgcolor: '#F8F8F6', borderTop: '1px solid', borderColor: 'divider' }}>
        <Button 
          onClick={onClose} 
          variant="outlined"
          color="primary"
          startIcon={<CloseIcon />}
          sx={{
            borderRadius: 2,
            px: 3
          }}
        >
          Close Simulator
        </Button>
        {isResolved && (
          <Button 
            color="primary"
            variant="contained"
            sx={{
              ml: 2,
              borderRadius: 2,
              px: 3,
              background: 'linear-gradient(135deg, #44BBA4 0%, #339985 100%)',
              boxShadow: '0 4px 12px rgba(68, 187, 164, 0.2)',
            }}
          >
            Continue with Script
          </Button>
        )}
      </DialogActions>
    </Dialog>
  );
};

export default ObjectionSimulator;
