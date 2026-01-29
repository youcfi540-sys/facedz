import { GoogleGenAI, Type } from "@google/genai";
import { AnalysisResult, Gender } from "../types";

// Initialize Gemini Client
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const SYSTEM_INSTRUCTION_ANALYSIS = `
You are an expert image analyzer for a professional headshot application.
Your task is to analyze an uploaded selfie and determine:
1. Is there exactly one clear human face?
2. Is the face clearly visible, not too far away, and not blurry?
3. What is the apparent gender of the person (Male/Female)?

Rules:
- If the face is extremely unclear, blurry, covered, too small, or too far away to see features clearly, set 'valid' to false.
- If there are multiple faces, set 'valid' to false.
- If the image is not a photo of a person, set 'valid' to false.
- If 'valid' is false because the face is unclear or too far, set 'message' to: "The face is too far / unclear. Please upload a closer photo where your full face is clearly visible."
- Be objective about gender based on visual cues for the purpose of styling professional attire.
`;

export const analyzeImage = async (base64Image: string, mimeType: string): Promise<AnalysisResult> => {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: {
        parts: [
          {
            inlineData: {
              mimeType: mimeType,
              data: base64Image,
            },
          },
          {
            text: "Analyze this image. Is it a valid single face for a portrait? Is it clear enough to enhance without hallucinating details? What is the gender?",
          },
        ],
      },
      config: {
        systemInstruction: SYSTEM_INSTRUCTION_ANALYSIS,
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            valid: { type: Type.BOOLEAN, description: "True if one clear face is visible and large enough." },
            gender: { type: Type.STRING, enum: ["MALE", "FEMALE", "UNKNOWN"], description: "The apparent gender." },
            message: { type: Type.STRING, description: "Reason if invalid, or brief description if valid." },
          },
          required: ["valid", "gender"],
        },
      },
    });

    const result = JSON.parse(response.text || "{}");
    
    // Map string to Enum
    let genderEnum = Gender.UNKNOWN;
    if (result.gender === 'MALE') genderEnum = Gender.MALE;
    if (result.gender === 'FEMALE') genderEnum = Gender.FEMALE;

    return {
      valid: result.valid,
      gender: genderEnum,
      message: result.message
    };

  } catch (error) {
    console.error("Analysis failed:", error);
    return { valid: false, gender: Gender.UNKNOWN, message: "Failed to analyze image. Please try again." };
  }
};

export const generateProfessionalHeadshot = async (
  base64Image: string, 
  mimeType: string, 
  gender: Gender, 
  outfitDescription: string
): Promise<string | null> => {
  try {
    // Construct a highly specific prompt based on the user's requirements
    const basePrompt = `
      Act as a professional photo editor. Transform this selfie into a high-end professional headshot for a CV or LinkedIn profile.
      
      STRICT GUIDELINES:
      1. FACE & IDENTITY: Detect the face. Do NOT change the person's identity, age, gender, facial features, eye color, or skin tone. Keep it exactly recognizable.
      2. POSE: If the head is tilted, straighten it so it is upright and centered. Keep realistic proportions; do not stretch or deform the face.
      3. BACKGROUND: Remove the original background completely. Replace it with a clean, plain, professional background (light gray, off-white, or very soft gradient), suitable for a passport photo or CV headshot.
      4. LIGHTING: Slightly brighten the face and improve contrast if dark. Do not over-whiten the skin; keep the natural skin tone.
      5. NATURAL ENHANCEMENT (VERY IMPORTANT): Apply subtle, minimal enhancement only. Improve overall sharpness slightly. Do NOT create a "plastic" skin effect. Do NOT invent or hallucinate new facial details (eyes, nose, mouth) that are not visible. The result MUST look photorealistic and natural, not AI-generated.
      6. OUTFIT: ${outfitDescription}
      
      Ensure the final result is high resolution, sharp, and clean with professional portrait framing (head and shoulders, centered). No text, logos, or artistic filters.
    `;

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash-image", // Using flash-image for editing capabilities
      contents: {
        parts: [
          {
            inlineData: {
              mimeType: mimeType,
              data: base64Image,
            },
          },
          {
            text: basePrompt,
          },
        ],
      },
    });

    // Extract image from response
    for (const part of response.candidates?.[0]?.content?.parts || []) {
      if (part.inlineData && part.inlineData.data) {
        return part.inlineData.data;
      }
    }
    
    console.error("No image data in response");
    return null;

  } catch (error) {
    console.error("Generation failed:", error);
    throw error;
  }
};