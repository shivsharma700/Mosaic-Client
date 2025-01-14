import { useRef, useState } from "react";
import Webcam from "react-webcam";
import axios from "axios";
import logo from "./assets/1_march_Mosaic_Logo.png";

const dataURItoBlob = (dataURI: string): Blob => {
  const byteString = window.atob(dataURI.split(",")[1]);
  const mimeString = dataURI.split(",")[0].split(":")[1].split(";")[0];
  const ab = new ArrayBuffer(byteString.length);
  const ia = new Uint8Array(ab);
  for (let i = 0; i < byteString.length; i++) {
    ia[i] = byteString.charCodeAt(i);
  }
  return new File([new Blob([ab], { type: mimeString })], "image.jpeg", {
    type: "image/jpeg",
  });
};
function App() {
  const webcamRef = useRef<any>(null);
  const [capturedImage, setCapturedImage] = useState<any>("");
  // const [formData] = useState(new FormData());
  const [isSending, setIsSending] = useState(false);
  const [isSent, setIsSent] = useState(false);
  const [facingMode, setFacingMode] = useState("user"); // Default facing mode

  // Function to toggle between user and environment facing mode
  const toggleFacingMode = () => {
    setFacingMode((prevFacingMode) =>
      prevFacingMode === "user" ? "environment" : "user"
    );
  };

  const captureImage = async () => {
    if (webcamRef.current === null) return;
    const imageSrc = webcamRef.current.getScreenshot();
    setCapturedImage(imageSrc);
  };
  // const videoConstraints = {
  //   facingMode: 'user',
  //   aspectRatio: 4/6,
  //   width: { ideal: 1920 },
  //   height: { ideal: 1080 },
  // };
  // useEffect(() => {
  //   navigator.mediaDevices
  //     .getUserMedia({video:{
  //       facingMode: 'user',
  //       aspectRatio: 1/1,

  //     } })
  //     .then((stream) => {
  //       if (videoRef.current) {
  //         videoRef.current.srcObject = stream;
  //       }
  //     })
  //     .catch((error) => {
  //       console.error(
  //         "Error accessing webcam plz throw your device in garbage :)",
  //         error
  //       );
  //     });
  // });
  const handleFileUpload = async (e: any) => {
    const file = e.target.files?.[0];
    if (file) {
      const imageSrc = URL.createObjectURL(file);
      const image = new Image();
      image.src = imageSrc;
      image.onload = () => {
        const canvas = document.createElement("canvas");
        const ctx = canvas.getContext("2d");

        const squareSize = Math.min(image.width, image.height);
        canvas.width = squareSize;
        canvas.height = squareSize;

        const xOffset =
          image.width > image.height ? (image.width - squareSize) / 2 : 0;
        const yOffset =
          image.height > image.width ? (image.height - squareSize) / 2 : 0;

        if (ctx) {
          ctx.drawImage(
            image,
            xOffset,
            yOffset,
            squareSize,
            squareSize,
            0,
            0,
            squareSize,
            squareSize
          );
          const dataUrl = canvas.toDataURL("image/jpeg", 1);
          setCapturedImage(dataUrl);
        }
      };
    }
  };

  return (
    <div
      style={{
        height: "100vh",
        display: "flex",
        flexGrow: 1,
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        // backgroundColor: '#000',
        gap: 20,
      }}
    >
      <img
        style={{
          width: "18rem",
          height: '6rem',
          // object-fit: cover
        }}
        src={logo}
      />
      {/* <video
          ref={videoRef}
          autoPlay
          playsInline
          style={{
            borderRadius:18,
            // width: 500,
            height: 700,
          }}
        /> */}
      {isSending && (
        <img
          style={{
            height: 200,
          }}
          src="https://cdnl.iconscout.com/lottie/premium/thumb/sending-7908774-6293359.gif"
        />
      )}
      {isSent && (
        <div className='flex flex-col space-y-5' >
          <img
            style={{
              height: 200,
            }}
            src="https://cdnl.iconscout.com/lottie/premium/thumb/sending-completed-8025404-6410148.gif"
          />
          <button
            style={{
              borderRadius: 18,
              backgroundColor: "#000",
              color: "#fff",
              paddingLeft: 15,
              paddingRight: 15,
              paddingTop: 10,
              paddingBottom: 10,
              fontSize: 25,
              fontWeight: "bold",
              border: "none",
              cursor: "pointer",
            }}
            onClick={() => {
              setCapturedImage(null);
              setIsSent(false);
            }}
          >
            Retry Image?
          </button>
        </div>
      )}
      {!capturedImage && (
        <>
          <Webcam
            style={{
              borderRadius: 18,
              maxHeight: 300,
            }}
            videoConstraints={{
              facingMode,
              aspectRatio: 1 / 1,
            }}
            audio={false}
            ref={webcamRef}
            screenshotFormat="image/png"
          />
          <button
            style={{
              borderRadius: 18,
              backgroundColor: "#000",
              color: "#fff",
              paddingLeft: 15,
              paddingRight: 15,
              paddingTop: 10,
              paddingBottom: 10,
              fontSize: 25,
              fontWeight: "bold",
              border: "none",
              cursor: "pointer",
            }}
            onClick={captureImage}
          >
            Capture
          </button>
          <button
            onClick={toggleFacingMode}
            style={{
              borderRadius: 18,
              backgroundColor: "#fff",
              color: "#000",
              padding: "10px 20px",
              fontSize: 18,
              fontWeight: "bold",
              border: "2px solid #000",
              cursor: "pointer",
              marginTop: 20,
            }}
          >
            Switch Camera
          </button>
          <label
            htmlFor="imageUploadInput"
            className="mt-4 py-2 px-4 bg-gray-700 text-white rounded-3xl text-xl font-semibold relative overflow-hidden cursor-pointer"
          >
            Upload Image
          </label>
          <input
            type="file"
            accept="image/*"
            onChange={handleFileUpload}
            className="hidden"
            id="imageUploadInput"
          />
        </>
      )}

      {capturedImage && !isSending && !isSent && (
        <>
          <img
            src={capturedImage}
            style={{
              borderRadius: 18,
              // width: 500,
              height: 300,
            }}
          />
          <div
            style={{
              display: "flex",
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "center",
              gap: 20,
            }}
          >
            <button
              style={{
                borderRadius: 18,
                backgroundColor: "#000",
                color: "#fff",
                paddingLeft: 15,
                paddingRight: 15,
                paddingTop: 10,
                paddingBottom: 10,
                fontSize: 25,
                fontWeight: "bold",
                border: "none",
                cursor: "pointer",
              }}
              onClick={() => {
                setCapturedImage(null);
              }}
            >
              Retry Image?
            </button>
            <button
              style={{
                borderRadius: 18,
                backgroundColor: "#aaff00",
                color: "#000",
                paddingLeft: 15,
                paddingRight: 15,
                paddingTop: 10,
                paddingBottom: 10,
                fontSize: 25,
                fontWeight: "bold",
                border: "none",
                cursor: "pointer",
                // borderWidth: 5,
                // borderColor: "#000",
              }}
              onClick={async () => {
                try {
                  const formData = new FormData();
                  // the captured image is a blob data and i want to add buffer of it in form data
                  // const base64Image = capturedImage.split(",")[1];
                  const image = dataURItoBlob(capturedImage);
                  console.log("image", image);
                  // const binaryData = atob(base64Image);
                  formData.append("image", image);
                  // const data = new Uint8Array([...binaryData].map((char) => char.charCodeAt(0)));
                  setIsSending(true);
                  console.log("data", formData);
                  const response = await axios.post(
                    "https://mosaic-api.gokapturehub.com/process-my-image",
                    formData
                  );
                  setIsSending(true);
                  if (response) {
                    setIsSent(true);
                    setIsSending(false);
                  }
                } catch (err) {
                  setIsSent(true);
                  setIsSending(false);
                }
              }}
            >
              Send
            </button>
          </div>
        </>
      )}
    </div>
  );
}

export default App;
