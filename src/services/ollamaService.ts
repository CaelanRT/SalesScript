interface ScriptGenerationRequest {
  persona: {
    name: string;
    companyName: string;
    jobTitle: string;
    industry: string;
    painPoints: string;
    decisionMaking: string;
  };
  product: {
    name: string;
    companyName: string;
    features: string;
    benefits: string;
    price: string;
    uniqueValue: string;
  };
  tone: 'Friendly' | 'Professional' | 'Assertive';
  format: 'Cold Email' | 'Phone Call Script' | 'LinkedIn Message';
}

// Function to generate a new sales script
export const generateSalesScript = async ({ persona, product, tone, format }: ScriptGenerationRequest): Promise<string> => {
  // Define tone descriptions
  const toneDescriptions: Record<string, string> = {
    'Friendly': 'warm, approachable, and conversational. Use casual language and focus on building rapport.',
    'Professional': 'polished, respectful, and business-appropriate. Maintain formality while being clear and concise.',
    'Assertive': 'confident, direct, and persuasive. Use strong language that conveys expertise and urgency.'
  };
  
  // Define format-specific instructions
  const formatInstructions: Record<string, string> = {
    'Cold Email': 'Create a cold email with a compelling subject line, brief introduction, value proposition, and clear call-to-action. Include appropriate email formatting with greeting and signature.',
    'Phone Call Script': 'Create a cold call script with introduction, engaging questions, value proposition, handling objections, and closing with next steps.',
    'LinkedIn Message': 'Create a concise LinkedIn message that establishes connection, shows you\'ve researched them, provides value, and includes a soft call-to-action appropriate for the platform.'
  };
  
  const prompt = `You are a professional sales script generator. Create a ${format} with a ${tone.toLowerCase()} tone based on the following information:\n\nPersona Information:\n-Name: ${persona.name}\n-Company: ${persona.companyName}\n-Job Title: ${persona.jobTitle}\n-Industry: ${persona.industry}\nPain Points: ${persona.painPoints}\nDecision Making Process: ${persona.decisionMaking}\n\nProduct Information:\n-Name: ${product.name}\n-Your Company: ${product.companyName}\n-Features: ${product.features}\n-Benefits: ${product.benefits}\n-Price: ${product.price}\n-Unique Value Proposition: ${product.uniqueValue}\n\nTone Instructions:\nThe tone should be ${toneDescriptions[tone]}\n\nFormat Instructions:\n${formatInstructions[format]}\n\nGenerate a ${tone.toLowerCase()} ${format.toLowerCase()} that:\n1. Addresses the persona's specific pain points\n2. Highlights how the product can solve their problems\n3. Includes a clear value proposition\n4. Has an appropriate call-to-action for the format\n\n${format === 'Cold Email' ? 'Email' : format === 'LinkedIn Message' ? 'Message' : 'Script'}:\n`;

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

// Function to tweak an existing script based on user instructions
export const tweakScript = async (
  originalScript: string,
  instruction: string,
  { persona, product, tone, format }: ScriptGenerationRequest
): Promise<string> => {
  try {
    console.log('Tweaking script with instruction:', instruction);
    
    const prompt = `You are a professional sales script editor. You have been given a ${format.toLowerCase()} with a ${tone.toLowerCase()} tone.

Original Script:
${originalScript}

User Instruction: ${instruction}

Please revise the script according to the user's instruction. Maintain the same overall structure, tone (${tone}), and format (${format}), but implement the requested changes.

Revised ${format === 'Cold Email' ? 'Email' : format === 'LinkedIn Message' ? 'Message' : 'Script'}:
`;
    
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
        max_tokens: 800,
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
    
    console.log('Tweaked response:', fullResponse);
    return fullResponse;
  } catch (error: any) {
    console.error('Error tweaking script:', error);
    console.error('Error details:', error.message);
    throw new Error('Failed to tweak script. Please check the console for details.');
  }
};

// Types for objection handling feature
export interface ObjectionResponse {
  objection: string;
  context: string;
  isResolved: boolean;
  conversationStage: 'initial' | 'consideration' | 'decision';
  progressIndicator: number; // 0-100 percentage indicating progress toward successful outcome
  nextStepType?: 'demo' | 'meeting' | 'proposal' | 'trial';
}

// Function to generate an initial objection based on the script and persona
export const generateObjection = async (
  script: string,
  { persona, product }: ScriptGenerationRequest
): Promise<ObjectionResponse> => {
  try {
    console.log('Generating initial objection');
    
    const prompt = `You are a sales objection simulator acting as ${persona.name}, a ${persona.jobTitle} at ${persona.companyName} in the ${persona.industry} industry.

You've just heard this sales pitch:
${script}

Based on the persona's pain points (${persona.painPoints}) and decision-making process (${persona.decisionMaking}), generate a realistic, common objection that this person might raise.

Choose from objection types like:
- Price/budget concerns
- Timing issues
- Satisfaction with current solution
- Need for stakeholder approval
- Implementation concerns
- ROI skepticism
- Feature comparison

Provide your response in JSON format with these fields:
- objection: The actual objection statement as spoken by the prospect
- context: Brief explanation of why this objection is relevant to this persona
- isResolved: false

Response:
`;
    
    // Use fetch API to handle the response
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
    
    console.log('Full objection response:', fullResponse);
    
    // Extract the JSON object from the response
    // Find the first occurrence of { and the last occurrence of }
    const jsonStart = fullResponse.indexOf('{');
    const jsonEnd = fullResponse.lastIndexOf('}') + 1;
    
    if (jsonStart >= 0 && jsonEnd > jsonStart) {
      const jsonStr = fullResponse.substring(jsonStart, jsonEnd);
      try {
        const objectionData = JSON.parse(jsonStr);
        return {
          objection: objectionData.objection || 'I need to think about it.',
          context: objectionData.context || 'The prospect is hesitant.',
          isResolved: false,
          conversationStage: 'initial',
          progressIndicator: 25
        };
      } catch (e) {
        console.error('Error parsing objection JSON:', e);
        return {
          objection: 'I appreciate your presentation, but I need to think about it more.',
          context: 'The prospect is giving a generic objection due to uncertainty.',
          isResolved: false,
          conversationStage: 'initial',
          progressIndicator: 20
        };
      }
    } else {
      // Generate a contextual initial objection based on persona and product
      const objectionTypes = [
        {
          type: 'price',
          text: `I'm interested in ${product.name}, but ${product.price} seems high for our budget right now.`,
          context: `${persona.name} is budget-conscious as mentioned in their decision-making process.`
        },
        {
          type: 'implementation',
          text: `This looks promising, but I'm concerned about how much work it would be to implement ${product.name} into our existing systems.`,
          context: `As a ${persona.jobTitle}, ${persona.name} is likely concerned about operational disruption.`
        },
        {
          type: 'stakeholder',
          text: `I like what I'm hearing, but I'll need to get buy-in from my team before moving forward with ${product.name}.`,
          context: `${persona.name}'s decision-making process involves other stakeholders.`
        },
        {
          type: 'competition',
          text: `We're currently using a different solution. What makes ${product.name} better than what we already have?`,
          context: `${persona.name} is evaluating against existing solutions.`
        },
        {
          type: 'roi',
          text: `I understand the benefits, but I'm not convinced we'll see a clear ROI from ${product.name} given our specific challenges.`,
          context: `ROI validation is important in the ${persona.industry} industry.`
        }
      ];
      
      // Select the most relevant objection based on persona information
      let relevantObjection = objectionTypes[0]; // Default to price objection
      
      if (persona.painPoints.toLowerCase().includes('implement') || persona.painPoints.toLowerCase().includes('integrat')) {
        relevantObjection = objectionTypes[1]; // Implementation objection
      } else if (persona.decisionMaking.toLowerCase().includes('team') || persona.decisionMaking.toLowerCase().includes('consult')) {
        relevantObjection = objectionTypes[2]; // Stakeholder objection
      } else if (persona.painPoints.toLowerCase().includes('current') || persona.painPoints.toLowerCase().includes('existing')) {
        relevantObjection = objectionTypes[3]; // Competition objection
      } else if (persona.painPoints.toLowerCase().includes('roi') || persona.painPoints.toLowerCase().includes('cost') || persona.painPoints.toLowerCase().includes('budget')) {
        relevantObjection = objectionTypes[4]; // ROI objection
      }
      
      return {
        objection: relevantObjection.text,
        context: relevantObjection.context,
        isResolved: false,
        conversationStage: 'initial',
        progressIndicator: 25 // Starting at 25% - they're engaged enough to raise an objection
      };
    }
  } catch (error: any) {
    console.error('Error generating objection:', error);
    console.error('Error details:', error.message);
    throw new Error('Failed to generate objection. Please check the console for details.');
  }
};

// Function to handle the user's response to an objection
// Helper function to generate contextual fallback responses
function generateContextualFallbackResponse(
  persona: ScriptGenerationRequest['persona'], 
  type: 'neutral' | 'considering' | 'stakeholder',
  productName: string = 'your product'
): string {
  const responses = {
    neutral: [
      `I see your point about ${productName}. Let me think about how this would fit into our current processes.`,
      `That's an interesting perspective. I'm curious how other ${persona.industry} companies have implemented this.`,
      `I understand the value proposition, but I need to consider our current priorities.`
    ],
    considering: [
      `You make some compelling points about how ${productName} could address our ${persona.painPoints.split(' ')[0]} issues.`,
      `I appreciate your thorough explanation. I need to evaluate this against our current solution.`,
      `That clarifies some of my concerns, but I still need to consider our budget constraints for this quarter.`
    ],
    stakeholder: [
      `This sounds promising. I'll need to discuss this with my ${persona.decisionMaking.includes('CMO') ? 'CMO' : persona.decisionMaking.includes('team') ? 'team' : 'colleagues'} before moving forward.`,
      `I'd like to bring in our ${persona.industry.includes('Tech') ? 'IT director' : 'department head'} to get their perspective on this.`,
      `Before we proceed, I need to review this with the other stakeholders involved in our ${persona.painPoints.includes('ROI') ? 'ROI tracking process' : 'decision-making process'}.`
    ]
  };
  
  // Select a random response from the appropriate category
  const categoryResponses = responses[type];
  const randomIndex = Math.floor(Math.random() * categoryResponses.length);
  return categoryResponses[randomIndex];
}

export const handleObjectionResponse = async (
  script: string,
  objection: ObjectionResponse,
  userResponse: string,
  { persona, product }: ScriptGenerationRequest
): Promise<ObjectionResponse> => {
  try {
    console.log('Processing user response to objection');
        // Determine the next conversation stage based on current stage
      let nextStage = objection.conversationStage;
      if (objection.conversationStage === 'initial') {
        nextStage = 'consideration';
      } else if (objection.conversationStage === 'consideration') {
        nextStage = 'decision';
      }
      
      const prompt = `You are a sales objection simulator acting as ${persona.name}, a ${persona.jobTitle} at ${persona.companyName} in the ${persona.industry} industry with these pain points: ${persona.painPoints}.

Sales context:
${script}

Your previous objection: "${objection.objection}"

The salesperson from ${product.companyName} responded: "${userResponse}"

Current conversation stage: ${objection.conversationStage}
Next stage if progressing well: ${nextStage}

Your goal is to simulate a realistic sales conversation that can be completed in 2-3 total exchanges. The conversation should progress toward a clear outcome - either scheduling a next step or declining to move forward.

Evaluate how effectively the salesperson addressed your objection, then respond accordingly:

1. If they addressed your concern VERY well (90-100% effective):
   - If in 'initial' stage: Show strong interest and ask a final clarifying question, moving to 'consideration' stage
   - If in 'consideration' stage: Show readiness to take next steps, moving to 'decision' stage
   - If in 'decision' stage: Agree to a specific next step (meeting, demo, etc.) and mark as resolved

2. If they addressed your concern MODERATELY well (60-89% effective):
   - If in 'initial' stage: Acknowledge their point but raise a more specific follow-up concern, staying in 'initial' stage
   - If in 'consideration' stage: Show more interest but raise one final important concern, staying in 'consideration' stage
   - If in 'decision' stage: Show interest in next steps but request specific information first, staying in 'decision' stage

3. If they addressed your concern POORLY (below 60% effective):
   - Restate your concern more firmly or explain why their answer was insufficient
   - Do not progress to the next stage
   - If this is the third exchange with poor responses, indicate you need to end the conversation

Provide your response in JSON format with these fields:
- objection: Your new statement/question as the prospect
- context: Brief explanation of why you responded this way
- isResolved: true only if you're agreeing to a specific next step
- conversationStage: '${objection.conversationStage}' if not progressing, or '${nextStage}' if progressing
- progressIndicator: A number from 0-100 indicating how close the salesperson is to securing next steps (increase if they're doing well, decrease if poorly)
- nextStepType: Include 'demo', 'meeting', 'proposal', or 'trial' ONLY if isResolved is true

Response:
`;
    
    // Use fetch API to handle the response
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
    
    console.log('Full response handler response:', fullResponse);
    
    // Extract the JSON object from the response
    // Find the first occurrence of { and the last occurrence of }
    const jsonStart = fullResponse.indexOf('{');
    const jsonEnd = fullResponse.lastIndexOf('}') + 1;
    
    if (jsonStart >= 0 && jsonEnd > jsonStart) {
      const jsonStr = fullResponse.substring(jsonStart, jsonEnd);
      try {
        const responseData = JSON.parse(jsonStr);
        return {
          objection: responseData.objection || generateContextualFallbackResponse(persona, 'neutral', product.name),
          context: responseData.context || `${persona.name} is evaluating your response based on their role as ${persona.jobTitle} at ${persona.companyName}.`,
          isResolved: responseData.isResolved || false,
          conversationStage: responseData.conversationStage || objection.conversationStage,
          progressIndicator: responseData.progressIndicator || Math.min(objection.progressIndicator + 10, 95)
        };
      } catch (e) {
        console.error('Error parsing response JSON:', e);
        return {
          objection: generateContextualFallbackResponse(persona, 'considering', product.name),
          context: `Based on ${persona.name}'s pain points (${persona.painPoints.substring(0, 50)}...), they need more information before deciding.`,
          isResolved: false,
          conversationStage: objection.conversationStage,
          progressIndicator: Math.max(objection.progressIndicator - 5, 15)
        };
      }
    } else {
      return {
        objection: generateContextualFallbackResponse(persona, 'stakeholder', product.name),
        context: `As a ${persona.jobTitle} at ${persona.companyName}, ${persona.name} typically involves others in the ${persona.decisionMaking.includes('team') ? 'team' : 'decision-making process'}.`,
        isResolved: false,
        conversationStage: objection.conversationStage === 'decision' ? 'decision' : 'consideration',
        progressIndicator: objection.conversationStage === 'decision' ? 75 : 50
      };
    }
  } catch (error: any) {
    console.error('Error handling objection response:', error);
    console.error('Error details:', error.message);
    throw new Error('Failed to process response. Please check the console for details.');
  }
};
