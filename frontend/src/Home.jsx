import axios from "axios";
import { useRef, useState } from "react";
import { useNavigate } from "react-router-dom";

const DUMMY_IMAGE_URL =
  "https://images.unsplash.com/photo-1633356122544-f134324ef6db?w=500&h=500&fit=crop";

function App() {
  const navigate = useNavigate();
  const uploadCardRef = useRef(null);
  const fileInputRef = useRef(null);

  const [file, setFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [loading, setLoading] = useState(false);
  const [fadeOutText, setFadeOutText] = useState(false);

  // Convert file/blob to Base64 URL
  const fileToDataUrl = (file) =>
    new Promise((resolve) => {
      const reader = new FileReader();
      reader.onload = (e) => resolve(e.target.result);
      reader.readAsDataURL(file);
    });

  const displayImage = async (file) => {
    setFile(file);
    const url = await fileToDataUrl(file);
    setPreviewUrl(url);
    setFadeOutText(true);
  };

  // File selection
  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) displayImage(selectedFile);
  };

  // Drag & Drop
  const handleDrop = (e) => {
    e.preventDefault();
    const droppedFile = e.dataTransfer.files[0];
    if (droppedFile) displayImage(droppedFile);
    if (uploadCardRef.current) {
      uploadCardRef.current.style.borderColor = "var(--border)";
      uploadCardRef.current.style.backgroundColor = "transparent";
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    if (uploadCardRef.current) {
      uploadCardRef.current.style.borderColor = "var(--primary)";
      uploadCardRef.current.style.backgroundColor = "rgba(16, 185, 129, 0.1)";
    }
  };

  const handleDragLeave = () => {
    if (uploadCardRef.current) {
      uploadCardRef.current.style.borderColor = "var(--border)";
      uploadCardRef.current.style.backgroundColor = "transparent";
    }
  };

  // Use demo image
  const useDemoImage = async () => {
    try {
      const res = await fetch(DUMMY_IMAGE_URL);
      const blob = await res.blob();
      displayImage(blob);
    } catch (err) {
      console.error("Failed to load demo image", err);
    }
  };

  // Send image to backend
  const startDetecting = async () => {
    if (!file) return alert("Please upload an image first!");
    const formData = new FormData();
    formData.append("file", file);

    try {
      setLoading(true);
      const res = await axios.post("http://127.0.0.1:5000/detect", formData);
      if (!res.data.success) throw new Error("Detection failed");

      // Navigate to loading page and pass resultData
      navigate("/loading", { state: { resultData: res.data.resultData } });
    } catch (err) {
      console.error(err);
      alert("Upload or detection failed.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="overflow-hidden">
      {/* Hero Section */}
      <section
        className="flex flex-col items-center justify-center"
        style={{ height: "calc(100vh - 56px)" }}
      >
        <div className="max-w-7xl w-full">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* Left Content */}
            <div className="space-y-8">
              <div>
                <h1 className="text-6xl lg:text-7xl font-extrabold leading-tight mb-6 gradient-text">
                  e-nfo
                </h1>
                <p className="text-2xl font-semibold text-gray-300 mb-4 tracking-wide">
                  E-Waste Analysis Powered by YOLOv8 & Custom Regression Model
                </p>
              </div>

              <p className="text-xl leading-relaxed text-gray-400 mb-6 max-w-2xl">
                <span className="font-bold text-green-400">e-nfo</span> uses{" "}
                <span className="font-bold text-blue-400">YOLOv8</span> for
                object detection and a custom regression model for value
                estimation.
                <br />
                Upload your e-waste image to get instant analysis, component
                breakdown, and estimated recycling value—all powered by advanced
                AI.
              </p>
            </div>

            {/* Right Upload Card Section */}
            <div className="space-y-6">
              <div
                style={{
                  backgroundColor: "var(--surface)",
                  borderRadius: 16,
                  padding: 24,
                  border: "1px solid var(--border)",
                }}
              >
                <div className="mb-6">
                  <label
                    htmlFor="fileInput"
                    className="card-upload p-8 text-center cursor-pointer block relative overflow-hidden"
                    ref={uploadCardRef}
                    onDrop={handleDrop}
                    onDragOver={handleDragOver}
                    onDragLeave={handleDragLeave}
                    style={
                      previewUrl
                        ? {
                            backgroundImage: `url(${previewUrl})`,
                            backgroundSize: "cover",
                            backgroundPosition: "center",
                            backgroundRepeat: "no-repeat",
                            minHeight: "200px",
                            color: "#fff",
                            transition: "background-image 0.3s",
                            position: "relative",
                          }
                        : { minHeight: "200px", position: "relative" }
                    }
                  >
                    {!previewUrl && (
                      <div style={{ position: "relative", zIndex: 2 }}>
                        <div className="text-4xl mb-3">📁</div>
                        <p className="text-lg font-semibold mb-2">
                          Upload Image
                        </p>
                        <p className="text-sm text-gray-400">
                          Drag and drop or click to select
                        </p>
                      </div>
                    )}
                    <input
                      type="file"
                      id="fileInput"
                      className="input-file"
                      accept="image/*"
                      ref={fileInputRef}
                      onChange={handleFileChange}
                      style={{
                        position: "absolute",
                        width: "100%",
                        height: "100%",
                        top: 0,
                        left: 0,
                        opacity: 0,
                        cursor: "pointer",
                        zIndex: 3,
                      }}
                    />
                  </label>

                  {previewUrl && (
                    <div className="mt-4 flex justify-center">
                      <button
                        className="btn-primary w-full py-3 text-lg"
                        onClick={startDetecting}
                        disabled={loading}
                      >
                        {loading ? "Detecting..." : "Start Detecting"}
                      </button>
                    </div>
                  )}
                </div>

                {/* OR Divider */}
                <div className="flex items-center gap-3 mb-6">
                  <div
                    className="flex-1 h-px"
                    style={{ backgroundColor: "var(--border)" }}
                  ></div>
                  <span className="text-sm text-gray-500">OR</span>
                  <div
                    className="flex-1 h-px"
                    style={{ backgroundColor: "var(--border)" }}
                  ></div>
                </div>

                {/* Demo Image Button */}
                <div className="flex">
                  <button
                    className="btn-secondary py-3 flex items-center justify-center gap-2 w-full"
                    onClick={useDemoImage}
                  >
                    <span>
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="24"
                        height="24"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <rect width="18" height="18" x="3" y="3" rx="2" />
                        <path d="M11 9h4a2 2 0 0 0 2-2V3" />
                        <circle cx="9" cy="9" r="2" />
                        <path d="M7 21v-4a2 2 0 0 1 2-2h4" />
                        <circle cx="15" cy="15" r="2" />
                      </svg>
                    </span>
                    <span>Use Demo Image</span>
                  </button>
                </div>
              </div>

              {/* Info Box */}
              <div
                style={{
                  backgroundColor: "rgba(16, 185, 129, 0.1)",
                  border: "1px solid var(--primary)",
                  borderRadius: 12,
                  padding: 16,
                }}
              >
                <p className="text-sm text-gray-300">
                  <span className="font-semibold text-green-400">💡 Tip:</span>{" "}
                  Upload a clear image of electronic waste for best results. Our
                  AI will analyze components and provide detailed insights.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

export default App;
