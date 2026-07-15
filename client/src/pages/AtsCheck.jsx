import { useState } from "react";
import { useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { ArrowLeftIcon, ScanSearch, Sparkles, UploadCloud } from "lucide-react";
import api from "../configs/api";
import toast from "react-hot-toast";
import pdfToText from "react-pdftotext";

const AtsCheck = () => {
  const { token } = useSelector((state) => state.auth);
  const [resumeFile, setResumeFile] = useState(null);
  const [resumeText, setResumeText] = useState("");
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [title, setTitle] = useState("Uploaded Resume");
  const navigate = useNavigate();

  const runCheck = async () => {
    if (!resumeFile) {
      toast.error("Please upload a resume PDF first.");
      return;
    }

    try {
      setLoading(true);
      const extractedText = await pdfToText(resumeFile);
      setResumeText(extractedText);

      // Preview-only ATS check (no DB write) - send full extracted text
      const { data } = await api.post(
        "/api/ai/ats-score",
        { resumeData: { text: extractedText } },
        { headers: { Authorization: token } }
      );
      setResult(data);
    } catch (error) {
      toast.error(error?.response?.data?.message || error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 px-4 py-8">
      <div className="mx-auto max-w-6xl">
        <Link
          to="/app"
          className="inline-flex items-center gap-2 text-sm text-slate-600 hover:text-slate-800"
        >
          <ArrowLeftIcon className="size-4" /> Back to Dashboard
        </Link>

        <div className="mt-6 grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <div className="flex items-center gap-2">
              <div className="rounded-full bg-green-100 p-2 text-green-700">
                <ScanSearch className="size-5" />
              </div>
              <div>
                <h1 className="text-xl font-semibold text-slate-900">
                  ATS Resume Checker
                </h1>
                <p className="text-sm text-slate-600">
                  Paste your resume summary or key content to get a quick ATS score.
                </p>
              </div>
            </div>

            <label className="mt-5 flex cursor-pointer flex-col items-center justify-center gap-2 rounded-xl border border-dashed border-slate-300 bg-slate-50 p-6 text-center text-sm text-slate-600 transition hover:border-green-500 hover:text-green-700">
              <UploadCloud className="size-8" />
              <span>
                {resumeFile ? resumeFile.name : "Upload resume PDF from your device"}
              </span>
              <input
                type="file"
                accept=".pdf"
                className="hidden"
                onChange={(e) => setResumeFile(e.target.files[0])}
              />
            </label>

              <div className="mt-4">
                <label className="text-sm text-slate-700">Resume title</label>
                <input
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="mt-1 w-full rounded border border-slate-200 p-2 text-sm"
                  placeholder="Resume title (optional)"
                />
              </div>

            {resumeText && (
              <div className="mt-4 rounded-xl border border-slate-200 bg-slate-50 p-4 text-sm text-slate-600">
                <p className="mb-2 font-semibold text-slate-700">Extracted content</p>
                <p className="max-h-36 overflow-y-auto whitespace-pre-wrap">
                  {resumeText}
                </p>
              </div>
            )}

            <button
              onClick={runCheck}
              disabled={loading}
              className="mt-4 inline-flex items-center gap-2 rounded-full bg-green-600 px-5 py-2.5 text-sm font-medium text-white transition hover:bg-green-700 disabled:opacity-70"
            >
              {loading ? "Analyzing..." : "Check ATS Score"}
              <Sparkles className="size-4" />
            </button>
            {result && (
              <button
                onClick={async () => {
                  if (!token) {
                    toast.error("Please login to save this resume.");
                    return;
                  }
                  try {
                    setLoading(true);
                    const { data } = await api.post(
                      "/api/ai/upload-resume",
                      { resumeText, title },
                      { headers: { Authorization: token } }
                    );
                    toast.success("Resume saved successfully");
                    navigate("/app");
                  } catch (err) {
                    toast.error(err?.response?.data?.message || err.message);
                  } finally {
                    setLoading(false);
                  }
                }}
                className="mt-3 ml-3 inline-flex items-center gap-2 rounded-full bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
              >
                Save Resume
                <UploadCloud className="size-4" />
              </button>
            )}
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <h2 className="text-lg font-semibold text-slate-900">
              Your ATS result
            </h2>
            {!result ? (
              <div className="mt-6 rounded-xl border border-dashed border-slate-300 bg-slate-50 p-6 text-sm text-slate-600">
                Run a check to see your score, prediction, and improvement tips.
              </div>
            ) : (
              <div className="mt-4 space-y-4">
                <div className="rounded-xl bg-green-50 p-4">
                  <p className="text-sm text-green-700">ATS Score</p>
                  <p className="text-3xl font-semibold text-green-800">
                    {result.score}/100
                  </p>
                  <p className="mt-1 text-sm font-medium text-green-700">
                    {result.prediction}
                  </p>
                </div>

                <div>
                  <p className="text-sm font-semibold text-slate-700">Why this score?</p>
                  <ul className="mt-2 list-disc space-y-1 pl-5 text-sm text-slate-600">
                    {result.reasons?.map((reason, index) => (
                      <li key={index}>{reason}</li>
                    ))}
                  </ul>
                </div>

                <div className="rounded-xl bg-slate-50 p-4">
                  <p className="text-sm font-semibold text-slate-700">
                    Suggested improvements
                  </p>
                  <p className="mt-1 text-sm text-slate-600">
                    {result.suggestion}
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AtsCheck;
