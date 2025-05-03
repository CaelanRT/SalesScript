import React, { useState } from 'react';
import {
  Container,
  Typography,
  TextField,
  Button,
  Paper,
  Grid,
  Alert,
  CircularProgress,
  Box,
  ThemeProvider,
} from '@mui/material';
import theme from './theme';
import { generateSalesScript } from './services/ollamaService';

interface Persona {
  name: string;
  jobTitle: string;
  industry: string;
  painPoints: string;
  decisionMaking: string;
}

interface Product {
  name: string;
  features: string;
  benefits: string;
  price: string;
  uniqueValue: string;
}

function App() {
  const [isFormValid, setIsFormValid] = useState(true);

  const validateForm = () => {
    const hasPersona = Object.values(persona).some(value => value.trim() !== '');
    const hasProduct = Object.values(product).some(value => value.trim() !== '');
    const isValid = hasPersona && hasProduct;
    setIsFormValid(isValid);
    return isValid;
  };
  const [persona, setPersona] = useState<Persona>({
    name: 'John Smith',
    jobTitle: 'Marketing Manager',
    industry: 'Technology',
    painPoints: 'Difficulty tracking marketing ROI and managing multiple campaigns',
    decisionMaking: 'Consults with team and reviews analytics before making decisions',
  });

  const [product, setProduct] = useState<Product>({
    name: 'MarketingPro',
    features: 'Advanced analytics, campaign tracking, ROI calculation, customizable dashboards',
    benefits: 'Saves time, improves decision-making, provides clear ROI insights',
    price: '$99/month',
    uniqueValue: 'The only marketing analytics platform that provides real-time ROI tracking and predictive analytics',
  });

  const [generatedScript, setGeneratedScript] = useState('');
  const [error, setError] = useState<string>('');

  const [isGenerating, setIsGenerating] = useState(false);

  const handleGenerateScript = async () => {
    if (!isFormValid) return;

    try {
      setIsGenerating(true);
      const script = await generateSalesScript({ persona, product });
      setGeneratedScript(script);
      setError('');
    } catch (error) {
      console.error('Error generating script:', error);
      setError('Failed to generate script. Please try again.');
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <ThemeProvider theme={theme}>
      <Container maxWidth="lg" sx={{ mt: 4, pb: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom sx={{
          textAlign: 'center',
          mb: 3,
          fontWeight: 700,
          textTransform: 'uppercase',
          letterSpacing: '0.05em',
        }}>
          Sales Script
        </Typography>

        <Grid container spacing={3}>
          {/* Persona Information */}
          <Grid item xs={12} md={6}>
            <Paper sx={{ 
              p: 3,
              mb: 2,
              '&:hover': {
                transform: 'translateY(-2px)',
                transition: 'transform 0.3s ease',
              },
            }}>
              <Typography variant="h5" gutterBottom sx={{
                mb: 2,
                borderBottom: '2px solid',
                borderColor: 'primary.main',
                display: 'inline-block',
                pb: 1,
              }}>
                Persona Information
              </Typography>
              <TextField
                fullWidth
                label="Full Name"
                value={persona.name}
                onChange={(e) => setPersona({ ...persona, name: e.target.value })}
                margin="normal"
                required={true}
                error={!!(error && !persona.name)}
                helperText={error && !persona.name ? 'This field is required' : ''}
              />
              <TextField
                fullWidth
                label="Job Title"
                value={persona.jobTitle}
                onChange={(e) => setPersona({ ...persona, jobTitle: e.target.value })}
                margin="normal"
              />
              <TextField
                fullWidth
                label="Industry"
                value={persona.industry}
                onChange={(e) => setPersona({ ...persona, industry: e.target.value })}
                margin="normal"
              />
              <TextField
                fullWidth
                label="Pain Points"
                value={persona.painPoints}
                onChange={(e) => setPersona({ ...persona, painPoints: e.target.value })}
                margin="normal"
                multiline
                rows={3}
              />
              <TextField
                fullWidth
                label="Decision Making Process"
                value={persona.decisionMaking}
                onChange={(e) => setPersona({ ...persona, decisionMaking: e.target.value })}
                margin="normal"
                multiline
                rows={3}
              />
            </Paper>
          </Grid>

          {/* Product Information */}
          <Grid item xs={12} md={6}>
            <Paper sx={{ 
              p: 3,
              mb: 2,
              '&:hover': {
                transform: 'translateY(-2px)',
                transition: 'transform 0.3s ease',
              },
            }}>
              <Typography variant="h5" gutterBottom sx={{
                mb: 2,
                borderBottom: '2px solid',
                borderColor: 'primary.main',
                display: 'inline-block',
                pb: 1,
              }}>
                Product Information
              </Typography>
              <TextField
                fullWidth
                label="Product Name"
                value={product.name}
                onChange={(e) => setProduct({ ...product, name: e.target.value })}
                margin="normal"
                required={true}
                error={!!(error && !product.name)}
                helperText={error && !product.name ? 'This field is required' : ''}
              />
              <TextField
                fullWidth
                label="Key Features"
                value={product.features}
                onChange={(e) => setProduct({ ...product, features: e.target.value })}
                margin="normal"
                multiline
                rows={3}
              />
              <TextField
                fullWidth
                label="Benefits"
                value={product.benefits}
                onChange={(e) => setProduct({ ...product, benefits: e.target.value })}
                margin="normal"
                multiline
                rows={3}
              />
              <TextField
                fullWidth
                label="Price"
                value={product.price}
                onChange={(e) => setProduct({ ...product, price: e.target.value })}
                margin="normal"
              />
              <TextField
                fullWidth
                label="Unique Value Proposition"
                value={product.uniqueValue}
                onChange={(e) => setProduct({ ...product, uniqueValue: e.target.value })}
                margin="normal"
                multiline
                rows={3}
              />
            </Paper>
          </Grid>

          {/* Generated Script */}
          <Grid item xs={12}>
            <Paper sx={{ 
              p: 3,
              mb: 2,
              '&:hover': {
                transform: 'translateY(-2px)',
                transition: 'transform 0.3s ease',
              },
            }}>
              <Typography variant="h5" gutterBottom sx={{
                mb: 2,
                borderBottom: '2px solid',
                borderColor: 'primary.main',
                display: 'inline-block',
                pb: 1,
              }}>
                Generated Sales Script
              </Typography>
              {error && (
                <Alert severity="error" sx={{ mb: 2 }}>
                  {error}
                </Alert>
              )}
              <TextField
                fullWidth
                value={generatedScript}
                multiline
                rows={10}
                margin="normal"
                variant="outlined"
                disabled
                sx={{
                  '& .MuiOutlinedInput-root': {
                    '& fieldset': {
                      borderColor: 'primary.main',
                    },
                  },
                }}
              />
              {isGenerating ? (
                <Box sx={{ display: 'flex', justifyContent: 'center', mt: 2 }}>
                  <CircularProgress color="primary" />
                </Box>
              ) : (
                <Button
                  variant="contained"
                  color="primary"
                  onClick={handleGenerateScript}
                  disabled={!isFormValid}
                  sx={{
                    mt: 2,
                    width: '200px',
                    '&:disabled': {
                      opacity: 0.7,
                    },
                  }}
                >
                  Generate Script
                </Button>
              )}
            </Paper>
          </Grid>
        </Grid>
      </Container>
    </ThemeProvider>
  );
}

export default App;
