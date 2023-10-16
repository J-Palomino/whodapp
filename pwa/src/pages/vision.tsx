import * as faceapi from "face-api.js";
import * as vision from "@/utils/vision";
import { api } from "@/utils/api";
import { useState } from "react";
import { number } from "zod";
import $ from "jquery";

console.log(faceapi.nets);
// ageGenderNet
// faceExpressionNet
// faceLandmark68Net
// faceLandmark68TinyNet
// faceRecognitionNet
// ssdMobilenetv1
// tinyFaceDetector
// tinyYolov2

export default function Vision() {
  const hello = api.example.hello.useQuery({ text: "from tRPC" });

  const [withBoxes, setWithBoxes] = useState(true);

  let forwardTimes: number[] = [];

  const updateTimeStats = (timeInMs: number) => {
    forwardTimes = [timeInMs].concat(forwardTimes).slice(0, 30);
    const avgTimeInMs =
      forwardTimes.reduce((total, t) => total + t) / forwardTimes.length;
    $("#time").val(`${Math.round(avgTimeInMs)} ms`);
    $("#fps").val(`${faceapi.utils.round(1000 / avgTimeInMs)}`);
  };

//   async function onPlay(): Promise<any> {
//     const videoEl = $("#inputVideo").get(0);

//     // if (videoEl?.paused || videoEl?.ended || !vision.isFaceDetectionModelLoaded())
//     //   return setTimeout(() => onPlay());

//     const options = vision.getFaceDetectorOptions();

//     const ts = Date.now();

//     const result = await faceapi
//       .detectSingleFace(videoEl, options)
//       .withFaceLandmarks();

//     updateTimeStats(Date.now() - ts);

//     if (result) {
//       const canvas = $("#overlay").get(0);
//     //   const dims = faceapi.matchDimensions(canvas, videoEl, true);
//     //   const resizedResult = faceapi.resizeResults(result, dims);

//       if (withBoxes) {
//         faceapi.draw.drawDetections(canvas, resizedResult);
//       }
//       faceapi.draw.drawFaceLandmarks(canvas, resizedResult);
//     }

//     setTimeout(() => onPlay());
//   }

  // function that returns a media stream await navigator.mediaDevices.getUserMedia({ video: {} })
const stream = async () => {
    const video: MediaStream = await navigator.mediaDevices.getUserMedia({ video: {} });
    const videoEl = $("#inputVideo").get(0) as HTMLVideoElement;
    videoEl.srcObject = video;
    return video;
};

stream();
  return (
    <>
      <div style={{ position: "relative" }} className="margin">
        {/* <div className="row side-by-side">
          <div id="selectList"></div>
          <div className="row">
            <input id="imgUrlInput" type="text" className="bold" />
          </div>
          <button className="waves-effect waves-light btn">Ok</button>
          <input
            id="queryImgUploadInput"
            type="file"
            className="waves-effect btn bold"
            accept=".jpg, .jpeg, .png"
          />
        </div> */}

    
        <video
          id="inputVideo"
          autoPlay
          muted
          playsInline
          height={720}
        >
   
        </video>
        <div style={{ position: "relative" }} className="margin">
          <img id="inputImg" src="" style={{ maxWidth: "800px" }} />
          <canvas id="overlay" />
        </div>
        <canvas id="overlay" />
      </div>
    </>
  );
}
