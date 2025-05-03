import React, { useState, useEffect } from 'react';
import {
  Container,
  Typography,
  TextField,
  Button,
  Box,
  Paper,
  Grid,
  CircularProgress,
  ThemeProvider,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
  SelectChangeEvent,
  Alert,
} from '@mui/material';
import theme from './theme';
import { generateSalesScript } from './services/ollamaService';
import { saveAs } from 'file-saver';
import jsPDF from 'jspdf';

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

type ToneType = 'Friendly' | 'Professional' | 'Assertive';
type FormatType = 'Cold Email' | 'Phone Call Script' | 'LinkedIn Message';

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
  const [exportFormat, setExportFormat] = useState<'txt' | 'pdf'>('txt');
  const [tone, setTone] = useState<ToneType>('Professional');
  const [scriptFormat, setScriptFormat] = useState<FormatType>('Phone Call Script');

  const handleGenerateScript = async () => {
    if (!isFormValid) return;

    try {
      setIsGenerating(true);
      const script = await generateSalesScript({ persona, product, tone, format: scriptFormat });
      setGeneratedScript(script);
      setError('');
    } catch (error) {
      console.error('Error generating script:', error);
      setError('Failed to generate script. Please try again.');
    } finally {
      setIsGenerating(false);
    }
  };
  
  const handleExportFormatChange = (event: SelectChangeEvent) => {
    setExportFormat(event.target.value as 'txt' | 'pdf');
  };
  
  const handleToneChange = (event: SelectChangeEvent) => {
    setTone(event.target.value as ToneType);
  };
  
  const handleScriptFormatChange = (event: SelectChangeEvent) => {
    setScriptFormat(event.target.value as FormatType);
  };
  
  const handleExportScript = () => {
    if (!generatedScript) return;
    
    const fileName = `sales-script-${persona.name.replace(/\s+/g, '-').toLowerCase()}-${new Date().toISOString().split('T')[0]}`;
    
    if (exportFormat === 'txt') {
      // Export as TXT
      const blob = new Blob([generatedScript], { type: 'text/plain;charset=utf-8' });
      saveAs(blob, `${fileName}.txt`);
    } else {
      // Export as PDF
      const doc = new jsPDF();
      
      // Add title
      doc.setFontSize(16);
      doc.text('Sales Script', 20, 20);
      
      // Add persona and product info
      doc.setFontSize(12);
      doc.text(`Persona: ${persona.name}, ${persona.jobTitle}`, 20, 30);
      doc.text(`Product: ${product.name}`, 20, 40);
      
      // Add script content with word wrapping
      doc.setFontSize(11);
      const splitText = doc.splitTextToSize(generatedScript, 170);
      doc.text(splitText, 20, 55);
      
      // Save the PDF
      doc.save(`${fileName}.pdf`);
    }
  };

  return (
    <ThemeProvider theme={theme}>
      <Container maxWidth="lg" sx={{ mt: 4, pb: 4 }}>
        <Box sx={{ mb: 4 }}>
          <Typography variant="h4" component="h1" gutterBottom sx={{
            textAlign: 'center',
            mb: 2,
            fontWeight: 700,
            textTransform: 'uppercase',
            letterSpacing: '0.05em',
          }}>
            Sales Script
          </Typography>
          
          <Box sx={{ display: 'flex', justifyContent: 'center', gap: 3, mt: 2 }}>
            <FormControl size="small" sx={{ minWidth: 120 }}>
              <InputLabel id="tone-select-label">Tone</InputLabel>
              <Select
                labelId="tone-select-label"
                value={tone}
                label="Tone"
                onChange={handleToneChange}
              >
                <MenuItem value="Friendly">Friendly</MenuItem>
                <MenuItem value="Professional">Professional</MenuItem>
                <MenuItem value="Assertive">Assertive</MenuItem>
              </Select>
            </FormControl>
            <FormControl size="small" sx={{ minWidth: 180 }}>
              <InputLabel id="format-select-label">Format</InputLabel>
              <Select
                labelId="format-select-label"
                value={scriptFormat}
                label="Format"
                onChange={handleScriptFormatChange}
              >
                <MenuItem value="Cold Email">Cold Email</MenuItem>
                <MenuItem value="Phone Call Script">Phone Call Script</MenuItem>
                <MenuItem value="LinkedIn Message">LinkedIn Message</MenuItem>
              </Select>
            </FormControl>
          </Box>
        </Box>

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
                multiline
                minRows={4}
                maxRows={8}
                label={`Generated ${scriptFormat}`}
                variant="outlined"
                value={generatedScript}
                InputProps={{
                  readOnly: true,
                  sx: {
                    fontFamily: 'Georgia, serif',
                    fontSize: '1rem',
                    lineHeight: 1.6,
                  },
                }}
              />
              {isGenerating ? (
                <Box sx={{ display: 'flex', justifyContent: 'center', mt: 2 }}>
                  <CircularProgress color="primary" />
                </Box>
              ) : (
                <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2, mt: 2 }}>
                  <Button
                    onClick={handleGenerateScript}
                    variant="contained"
                    color="primary"
                    disabled={!isFormValid}
                    sx={{
                      width: '200px',
                      '&:disabled': {
                        opacity: 0.7,
                      },
                    }}
                  >
                    Generate Script
                  </Button>
                  
                  {generatedScript && (
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mt: 1 }}>
                      <FormControl size="small" sx={{ minWidth: 120 }}>
                        <InputLabel id="export-format-label">Format</InputLabel>
                        <Select
                          labelId="export-format-label"
                          value={exportFormat}
                          label="Format"
                          onChange={handleExportFormatChange}
                        >
                          <MenuItem value="txt">TXT</MenuItem>
                          <MenuItem value="pdf">PDF</MenuItem>
                        </Select>
                      </FormControl>
                      <Button
                        onClick={handleExportScript}
                        variant="outlined"
                        color="primary"
                      >
                        Export Script
                      </Button>
                    </Box>
                  )}
                </Box>
              )}
            </Paper>
          </Grid>
        </Grid>
      </Container>
    </ThemeProvider>
  );
}

export default App;
