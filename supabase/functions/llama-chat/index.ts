import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface RequestBody {
  query_type: 'basic' | 'detailed' | 'interview' | 'resume' | 'roadmap';
  profile_text: string;
  extra_context?: Record<string, unknown>;
}

function buildSystemPrompt(queryType: string): string {
  const prompts: Record<string, string> = {
    basic: `You are an expert career counselor. Based on the user's profile, provide exactly 3 career recommendations.
    
For each career, provide:
- title: Job title
- description: 2-3 sentence description of the role
- fitScore: A number from 0-100 indicating how well this matches the user's profile
- resources: Array of 2 objects with "label" and "url" for learning resources

Respond ONLY with valid JSON in this exact format:
{
  "careers": [
    {
      "title": "string",
      "description": "string",
      "fitScore": number,
      "resources": [{"label": "string", "url": "string"}]
    }
  ],
  "extraNotes": "optional summary paragraph"
}`,

    detailed: `You are an expert career counselor. Based on the user's profile, provide 5 detailed career recommendations.

For each career, include:
- title: Job title
- description: Detailed role description (3-4 sentences)
- fitScore: 0-100 match score
- requiredSkills: Array of key skills needed
- salaryRange: Expected salary range (e.g., "$80,000 - $120,000")
- outlook: Job market outlook for next 5 years
- resources: Array of 3 learning resources with "label" and "url"

Respond ONLY with valid JSON:
{
  "careers": [...],
  "industryTrends": "paragraph about relevant industry trends",
  "extraNotes": "personalized advice"
}`,

    interview: `You are an expert interview coach. Generate interview preparation materials based on the user's target role and background.

Provide:
- questions: Array of 10 interview questions with sample answers
- starExamples: 3 STAR method examples relevant to their experience
- commonMistakes: Array of 5 common mistakes to avoid
- bodyLanguageTips: Array of 5 body language tips
- closingQuestions: 3 good questions to ask the interviewer

Respond ONLY with valid JSON:
{
  "questions": [{"question": "string", "sampleAnswer": "string", "tip": "string"}],
  "starExamples": [{"situation": "string", "task": "string", "action": "string", "result": "string"}],
  "commonMistakes": ["string"],
  "bodyLanguageTips": ["string"],
  "closingQuestions": ["string"]
}`,

    resume: `You are an expert resume writer and ATS specialist. Analyze the user's resume content and provide optimization tips.

Provide:
- skillsToHighlight: Array of skills to emphasize based on their background
- actionVerbs: Array of 10 strong action verbs to use
- metricsAdvice: Tips on quantifying achievements
- formatTips: Array of formatting recommendations
- atsKeywords: Industry keywords to include for ATS optimization
- overallScore: Rating 0-100 of current resume quality
- improvements: Array of specific improvement suggestions

Respond ONLY with valid JSON:
{
  "skillsToHighlight": ["string"],
  "actionVerbs": ["string"],
  "metricsAdvice": "string",
  "formatTips": ["string"],
  "atsKeywords": ["string"],
  "overallScore": number,
  "improvements": [{"area": "string", "suggestion": "string", "priority": "high|medium|low"}]
}`,

    roadmap: `You are an expert career development advisor. Create a detailed career roadmap based on the user's current level and target career.

Provide 4 phases:
- name: Phase name (Foundation, Growth, Mastery, Leadership)
- duration: Time estimate (e.g., "0-6 months")
- skills: Array of 3-5 skills to develop
- milestones: Array of 3-4 concrete milestones
- resources: Array of 2 learning resources with "label" and "url"

Respond ONLY with valid JSON:
{
  "roadmap": [
    {
      "name": "string",
      "duration": "string", 
      "skills": ["string"],
      "milestones": ["string"],
      "resources": [{"label": "string", "url": "string"}]
    }
  ],
  "estimatedTimeToGoal": "string",
  "keyInsights": "string"
}`
  };

  return prompts[queryType] || prompts.basic;
}

serve(async (req) => {
  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const GROQ_API_KEY = Deno.env.get('GROQ_API_KEY');
    if (!GROQ_API_KEY) {
      console.error('GROQ_API_KEY is not configured');
      return new Response(
        JSON.stringify({ error: 'AI service not configured. Please add GROQ_API_KEY.' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const { query_type, profile_text, extra_context } = await req.json() as RequestBody;

    if (!query_type || !profile_text) {
      return new Response(
        JSON.stringify({ error: 'Missing required fields: query_type and profile_text' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const systemPrompt = buildSystemPrompt(query_type);
    const userPrompt = extra_context 
      ? `${profile_text}\n\nAdditional context: ${JSON.stringify(extra_context)}`
      : profile_text;

    console.log(`Processing ${query_type} request for profile:`, profile_text.substring(0, 100));

    const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${GROQ_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'llama-3.3-70b-versatile',
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: userPrompt }
        ],
        temperature: 0.7,
        max_tokens: 4000,
        response_format: { type: 'json_object' }
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Groq API error:', response.status, errorText);
      
      if (response.status === 429) {
        return new Response(
          JSON.stringify({ error: 'Rate limit exceeded. Please try again in a moment.' }),
          { status: 429, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }
      
      return new Response(
        JSON.stringify({ error: 'AI service error. Please try again.' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const data = await response.json();
    const content = data.choices?.[0]?.message?.content;

    if (!content) {
      console.error('No content in Groq response:', data);
      return new Response(
        JSON.stringify({ error: 'No response from AI. Please try again.' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Parse the JSON response from LLaMA
    let parsedContent;
    try {
      parsedContent = JSON.parse(content);
    } catch (parseError) {
      console.error('Failed to parse LLaMA response:', content);
      return new Response(
        JSON.stringify({ error: 'Invalid AI response format. Please try again.' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    console.log(`Successfully generated ${query_type} response`);

    return new Response(
      JSON.stringify({ 
        ...parsedContent,
        model: 'meta-llama/Llama-3.3-70B-Versatile',
        provider: 'Groq'
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Error in llama-chat function:', error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : 'Unknown error occurred' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
