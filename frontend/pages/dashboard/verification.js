//frontend/pages/dashboard/verification.js
import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import api from "../../utils/api";

export default function VerificationPage() {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(false);

  const [nidFrontFile, setNidFrontFile] = useState(null);
  const [nidBackFile, setNidBackFile] = useState(null);
  const [selfieFile, setSelfieFile] = useState(null);

  const [nidFrontPreview, setNidFrontPreview] = useState(null);
  const [nidBackPreview, setNidBackPreview] = useState(null);
  const [selfiePreview, setSelfiePreview] = useState(null);

  useEffect(() => {
    api.get("/auth/me").then((res) => {
      setUser(res.data);
      if (res.data.kyc?.front) setNidFrontPreview(res.data.kyc.front);
      if (res.data.kyc?.back) setNidBackPreview(res.data.kyc.back);
      if (res.data.kyc?.selfie) setSelfiePreview(res.data.kyc.selfie);
    });
  }, []);

  const handleFile = (e, setFile, setPreview) => {
    const file = e.target.files[0];
    if (!file) return;
    setFile(file);
    setPreview(URL.createObjectURL(file));
  };

  const uploadToCloudinary = async (file) => {
    const form = new FormData();
    form.append("file", file);
    form.append("upload_preset", "trust-market");

    const res = await fetch(
      "https://api.cloudinary.com/v1_1/dfynopg2e/image/upload",
      { method: "POST", body: form }
    );

    const data = await res.json();
    if (!res.ok) throw new Error("Upload failed");
    return data.secure_url;
  };

  const submit = async () => {
    if (!nidFrontFile || !nidBackFile || !selfieFile) {
      alert("সব ফাইল লাগবে");
      return;
    }

    try {
      setLoading(true);

      const front = await uploadToCloudinary(nidFrontFile);
      const back = await uploadToCloudinary(nidBackFile);
      const selfie = await uploadToCloudinary(selfieFile);

      await api.post("/kyc/submit", {
        nidFront: front,
        nidBack: back,
        selfie,
      });

      alert("KYC Submitted (Pending Review)");
      router.push("/dashboard");
    } catch (e) {
      alert(e.message);
    } finally {
      setLoading(false);
    }
  };

  if (!user) return null;

  const locked = ["pending", "verified"].includes(user.kyc?.status);

  const Card = ({ title, preview, onChange, disabled }) => (
    <div className="border rounded-xl p-4 bg-white shadow-sm">
      <h3 className="font-semibold mb-2">{title}</h3>

      <div className="h-40 border-2 border-dashed rounded-lg flex items-center justify-center mb-3 bg-gray-50">
        {preview ? (
          <img src={preview} className="h-full object-contain" />
        ) : (
          <span className="text-gray-400 text-sm">No image</span>
        )}
      </div>

      <input
        type="file"
        disabled={disabled}
        onChange={onChange}
        className="w-full text-sm"
      />
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-100 py-10">
      <div className="max-w-4xl mx-auto bg-white rounded-2xl shadow-lg p-8">
        <h1 className="text-3xl font-bold mb-2">NID Verification</h1>
        <p className="text-gray-600 mb-6">
          আপনার পরিচয় নিশ্চিত করতে নিচের তথ্যগুলো আপলোড করুন
        </p>

        {locked && (
          <div className="mb-6 p-4 rounded-lg bg-yellow-50 border border-yellow-300 text-yellow-800">
            Status: <b>{user.kyc.status.toUpperCase()}</b>  
            <br />
            Verification চলমান বা সম্পন্ন — পরিবর্তন করা যাবে না।
          </div>
        )}

        <div className="grid md:grid-cols-3 gap-6">
          <Card
            title="NID Front"
            preview={nidFrontPreview}
            disabled={locked}
            onChange={(e) =>
              handleFile(e, setNidFrontFile, setNidFrontPreview)
            }
          />
          <Card
            title="NID Back"
            preview={nidBackPreview}
            disabled={locked}
            onChange={(e) =>
              handleFile(e, setNidBackFile, setNidBackPreview)
            }
          />
          <Card
            title="Selfie with NID"
            preview={selfiePreview}
            disabled={locked}
            onChange={(e) =>
              handleFile(e, setSelfieFile, setSelfiePreview)
            }
          />
        </div>

        <div className="mt-8 text-right">
          <button
            disabled={locked || loading}
            onClick={submit}
            className={`px-6 py-3 rounded-lg font-semibold text-white ${
              locked
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-green-600 hover:bg-green-700"
            }`}
          >
            {loading ? "Submitting..." : locked ? "Verification Locked" : "Submit Verification"}
          </button>
        </div>
      </div>
    </div>
  );
}
