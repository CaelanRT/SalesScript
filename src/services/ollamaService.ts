interface ScriptGenerationRequest {
  persona: {
    name: string;
    jobTitle: string;
    industry: string;
    painPoints: string;
    decisionMaking: string;
  };
  product: {
    name: string;
    features: string;
    benefits: string;
    price: string;
    uniqueValue: string;
  };
}

export const generateSalesScript = async ({ persona, product }: ScriptGenerationRequest): Promise<string> => {
  const prompt = `You are a professional sales script generator. Create a cold call script based on the following information:\n\nPersona Information:\n-Name: ${persona.name}\n-Job Title: ${persona.jobTitle}\n-Industry: ${persona.industry}\nPain Points: ${persona.painPoints}\nDecision Making Process: ${persona.decisionMaking}\n\nProduct Information:\n-Name: ${product.name}\n-Features: ${product.features}\n-Benefits: ${product.benefits}\n-Price: ${product.price}\n-Unique Value Proposition: ${product.uniqueValue}\n\nGenerate a professional cold call script that:\n1. Addresses the persona's specific pain points\n2. Highlights how the product can solve their problems\n3. Uses a natural conversational tone\n4. Includes a clear value proposition\n5. Has a natural call-to-action\n\nScript:`;

  try {
    console.log('Generating script with prompt:', prompt);
    
    // Use fetch API to handle streaming responses
    const response = await fetch('http://localhost:11434/api/generate', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'llama3',
        prompt: prompt,
        temperature: 0.7,
        max_tokens: 500,
      }),
    });
    
    // Read the response as text
    const text = await response.text();
    
    // Process the response
    let fullResponse = '';
    const lines = text.split('\n').filter(line => line.trim() !== '');
    
    for (const line of lines) {
      try {
        const data = JSON.parse(line);
        if (data.response) {
          fullResponse += data.response;
        }
      } catch (e) {
        console.error('Error parsing JSON:', e);
      }
    }
    
    console.log('Full response:', fullResponse);
    return fullResponse;
  } catch (error: any) {
    console.error('Error generating script:', error);
    console.error('Error details:', error.message);
    throw new Error('Failed to generate script. Please check the console for details.');
  }
};
