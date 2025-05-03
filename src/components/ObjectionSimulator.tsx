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
          borderRadius: 2,
          boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
        }
      }}
    >
      <DialogTitle sx={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center',
        bgcolor: 'primary.main',
        color: 'white',
        py: 2
      }}>
        <Typography variant="h6">
          Objection Simulator: Conversation with {persona.name}
        </Typography>
        <IconButton edge="end" color="inherit" onClick={onClose} aria-label="close">
          <CloseIcon />
        </IconButton>
      </DialogTitle>
      
      <DialogContent sx={{ p: 3, minHeight: '400px' }}>
        <Box sx={{ mb: 3 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <Box>
              <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                You're speaking with:
              </Typography>
              <Paper elevation={1} sx={{ p: 2, bgcolor: 'background.paper' }}>
                <Typography variant="subtitle1" fontWeight="bold">
                  {persona.name}
                </Typography>
                <Typography variant="body2">
                  {persona.jobTitle} at {persona.companyName}
                </Typography>
              </Paper>
            </Box>
            
            <Box sx={{ textAlign: 'right' }}>
              <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                Conversation Progress
              </Typography>
              <Paper elevation={1} sx={{ p: 2, bgcolor: 'background.paper', minWidth: '180px' }}>
                <Box sx={{ mb: 1 }}>
                  <Typography variant="body2" color="text.secondary">
                    Stage: <strong>{currentObjection ? currentObjection.conversationStage.charAt(0).toUpperCase() + currentObjection.conversationStage.slice(1) : 'Initial'}</strong>
                  </Typography>
                </Box>
                
                <Box sx={{ width: '100%', mb: 1 }}>
                  <Box
                    sx={{
                      height: 8,
                      borderRadius: 4,
                      bgcolor: 'grey.300',
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
                        bgcolor: currentObjection?.progressIndicator || 0 > 75 ? 'success.main' : 
                                currentObjection?.progressIndicator || 0 > 50 ? 'primary.main' : 
                                currentObjection?.progressIndicator || 0 > 25 ? 'warning.main' : 'error.main',
                        transition: 'width 0.5s ease-in-out',
                      }}
                    />
                  </Box>
                </Box>
                
                <Typography variant="caption" color="text.secondary">
                  Goal: {isResolved ? 'Achieved! ✓' : 'Schedule Next Steps'}
                </Typography>
              </Paper>
            </Box>
          </Box>
        </Box>
        
        <Divider sx={{ my: 2 }} />
        
        <Box sx={{ 
          display: 'flex', 
          flexDirection: 'column', 
          gap: 2, 
          maxHeight: '300px', 
          overflowY: 'auto',
          p: 1
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
                <Avatar sx={{ bgcolor: 'secondary.main' }}>
                  <PersonIcon />
                </Avatar>
              )}
              
              <Paper 
                elevation={1} 
                sx={{
                  p: 2,
                  borderRadius: 2,
                  bgcolor: message.sender === 'user' ? 'primary.light' : 'grey.100',
                  color: message.sender === 'user' ? 'white' : 'text.primary',
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
                <Avatar sx={{ bgcolor: 'primary.dark' }}>
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
      </DialogContent>
      
      <DialogActions sx={{ p: 3, pt: 0 }}>
        <Box sx={{ display: 'flex', width: '100%', gap: 2 }}>
          <TextField
            fullWidth
            multiline
            rows={2}
            placeholder={isResolved ? "Simulation complete" : "Type your response to the objection..."}
            variant="outlined"
            value={response}
            onChange={(e) => setResponse(e.target.value)}
            disabled={isLoading || isResolved}
            onKeyPress={handleKeyPress}
          />
          <Button
            variant="contained"
            color="primary"
            onClick={handleSubmit}
            disabled={isLoading || !response.trim() || isResolved}
            sx={{ alignSelf: 'flex-end', minWidth: '120px', height: '56px' }}
          >
            {isLoading ? <CircularProgress size={24} color="inherit" /> : "Send"}
          </Button>
        </Box>
      </DialogActions>
    </Dialog>
  );
};

export default ObjectionSimulator;
