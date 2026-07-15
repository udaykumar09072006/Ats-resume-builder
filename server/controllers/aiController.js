import ai from "../configs/ai.js";
import Resume from "../models/Resume.js";

const getFallbackText = (text) => text || "Resume details captured successfully.";

const getAtsFallback = (resumeData) => {
  const text = (resumeData && (resumeData.text || resumeData.professional_summary))
    ? String(resumeData.text || resumeData.professional_summary).toLowerCase()
    : JSON.stringify(resumeData || {}).toLowerCase();

  const lengthScore = Math.min(30, Math.floor((text.length || 0) / 200));
  const hasSkills = /skills|\btechnical skills\b/.test(text);
  const hasExperience = /experience|worked|company|position|role/.test(text);
  const hasEducation = /education|degree|bachelor|master|university|college/.test(text);
  const hasProjects = /project|projects/.test(text);
  const hasAchievements = /\b(achieved|improved|increased|reduced|led|managed)\b/.test(text);

  let score = 30 + lengthScore;
  if (hasSkills) score += 20;
  if (hasExperience) score += 20;
  if (hasEducation) score += 10;
  if (hasProjects) score += 10;
  if (hasAchievements) score += 10;

  score = Math.max(10, Math.min(98, score));

  const prediction = score >= 80 ? "Strong fit" : score >= 60 ? "Good potential" : "Needs improvement";

  const reasons = [
    hasSkills ? "Skills section is present." : "Add a clear skills section.",
    hasExperience ? "Experience details are included." : "Add relevant experience bullets.",
    text.includes("summary") || resumeData.professional_summary ? "A summary is present." : "Add a professional summary.",
    hasEducation ? "Education details are included." : "Include education information.",
  ];

  return {
    score,
    prediction,
    reasons,
    suggestion:
      "Use clear section headings, add measurable achievements, and tailor keywords to the role you want.",
  };
};

// controller for enhancing a resume's professional summary
// POST: /api/ai/enhance-pro-sum
export const enhanceProfessionalSummary = async (req, res) => {
  try {
    const { userContent } = req.body;

    if (!userContent) {
      return res.status(404).json({ message: "Missing required fields" });
    }

    if (!ai) {
      return res.status(200).json({ enhancedContent: getFallbackText(userContent) });
    }

    const response = await ai.chat.completions.create({
      model: process.env.OPENAI_MODEL || "gpt-4o-mini",
      messages: [
        {
          role: "system",
          content:
            "You are an expert in resume writing. Your task is to enhance the professional summary of a resume. The summary should be 1-2 sentences also highlighting key skills, experience, and career objectives. Make it compelling and ATS-friendly. and only return text no options or anything else.",
        },
        {
          role: "user",
          content: userContent,
        },
      ],
    });

    const enhancedContent = response.choices[0].message.content;
    return res.status(200).json({ enhancedContent });
  } catch (error) {
    return res.status(400).json({ message: error.message });
  }
};

// controller for enhancing a resume's job description
// POST: /api/ai/enhance-pro-sum
export const enhanceJobDescription = async (req, res) => {
  try {
    const { userContent } = req.body;

    if (!userContent) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    if (!ai) {
      return res.status(200).json({ enhancedContent: getFallbackText(userContent) });
    }

    const response = await ai.chat.completions.create({
      model: process.env.OPENAI_MODEL || "gpt-4o-mini",
      messages: [
        {
          role: "system",
          content:
            "You are an expert in resume writing. Your task is to enhance the job description of a resume. The job description should be only 1-2 sentences also highlighting key responsibilities and achievements. Use action verbs and quantifiable results where possible. Make it ATS-friendly. and only return text no options or anything else.",
        },
        {
          role: "user",
          content: userContent,
        },
      ],
    });

    const enhancedContent = response.choices[0].message.content;
    return res.status(200).json({ enhancedContent });
  } catch (error) {
    return res.status(400).json({ message: error.message });
  }
};

// controller for uploading a resume to the database
// POST: /api/ai/upload-resume
export const atsScoreCheck = async (req, res) => {
  try {
    const { resumeData } = req.body;

    if (!resumeData) {
      return res.status(400).json({ message: "Missing resume data" });
    }

    if (!ai) {
      return res.status(200).json(getAtsFallback(resumeData));
    }

    const resumeText = resumeData.text || resumeData.professional_summary || JSON.stringify(resumeData);

    const prompt = `You are an ATS expert. Analyze the resume text below and return COMPACT JSON only with fields: score (integer 0-100), prediction (string: Strong fit | Good potential | Needs improvement), reasons (array of short strings), suggestion (single short string). Consider: presence of Skills, Experience (with years), Education, Projects, measurable achievements, and keywords relevant to common job descriptions. Resume text:\n\n${resumeText}`;

    const response = await ai.chat.completions.create({
      model: process.env.OPENAI_MODEL || "gpt-4o-mini",
      messages: [
        { role: "system", content: "Return compact JSON only with the specified fields and no extra commentary." },
        { role: "user", content: prompt },
      ],
      response_format: { type: "json_object" },
    });

    const parsed = JSON.parse(response.choices[0].message.content);
    return res.status(200).json(parsed);
  } catch (error) {
    return res.status(200).json(getAtsFallback(req.body.resumeData));
  }
};

export const uploadResume = async (req, res) => {
  try {
    const { resumeText, title } = req.body;
    const userId = req.userId;

    if (!resumeText) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    const systemPrompt =
      "You are an expert AI agent to extract date from resume.";

    const userPrompt = `extract data from this resume ${resumeText} Provide data in the following JSON format with no additional text before or after: 
      {
        professional_summary: { type: String, default: "" },
        skills: [{ type: String }],
        personal_info: {
          image: { type: String, default: "" },
          full_name: { type: String, default: "" },
          profession: { type: String, default: "" },
          email: { type: String, default: "" },
          phone: { type: String, default: "" },
          location: { type: String, default: "" },
          linkedin: { type: String, default: "" },
          github: { type: String, default: "" },
          website: { type: String, default: "" },
        },
        experience: [
          {
            company: { type: String },
            position: { type: String },
            start_date: { type: String },
            end_date: { type: String },
            description: { type: String },
            is_current: { type: Boolean },
          },
        ],
        project: [
          {
            name: { type: String },
            type: { type: String },
            description: { type: String },
          },
        ],
        experience: [
          {
            insitution: { type: String },
            degree: { type: String },
            field: { type: String },
            graduation_date: { type: String },
            gpa: { type: String },
          },
        ],
      }
    `;

    if (!ai) {
      const fallbackResume = {
        professional_summary: "",
        skills: [],
        personal_info: {
          image: "",
          full_name: "",
          profession: "",
          email: "",
          phone: "",
          location: "",
          linkedin: "",
          github: "",
          website: "",
        },
        experience: [],
        project: [],
        education: [],
      };

      const newResume = await Resume.create({ userId, title, ...fallbackResume });
      return res.status(200).json({ resumeId: newResume._id });
    }

    const response = await ai.chat.completions.create({
      model: process.env.OPENAI_MODEL || "gpt-4o-mini",
      messages: [
        {
          role: "system",
          content: systemPrompt,
        },
        {
          role: "user",
          content: userPrompt,
        },
      ],
      response_format: { type: "json_object" },
    });


    const extractedData = response.choices[0].message.content;

    let parsedData = JSON.parse(extractedData || "{}");

    // sanitize parsed data: convert objects like { default: "" } to strings,
    // and ensure professional_summary is a string to avoid mongoose cast errors
    const sanitizeValue = (val) => {
      if (val === null || val === undefined) return "";
      if (typeof val === "string") return val;
      if (Array.isArray(val)) return val.map(sanitizeValue);
      if (typeof val === "object") {
        // common patterns: { default: "" } or { type: String, default: "" }
        if ("default" in val) return sanitizeValue(val.default);
        // if object contains string fields, stringify as fallback
        return JSON.stringify(val);
      }
      return String(val);
    };

    if (parsedData.professional_summary) {
      parsedData.professional_summary = sanitizeValue(parsedData.professional_summary);
    }

    // sanitize skills to be array of strings
    if (parsedData.skills && !Array.isArray(parsedData.skills)) {
      parsedData.skills = [sanitizeValue(parsedData.skills)];
    } else if (Array.isArray(parsedData.skills)) {
      parsedData.skills = parsedData.skills.map(sanitizeValue);
    }

    const newResume = await Resume.create({ userId, title, ...parsedData });

    return res.status(200).json({ resumeId: newResume._id });
  } catch (error) {
    return res.status(400).json({ message: error.message });
  }
};
