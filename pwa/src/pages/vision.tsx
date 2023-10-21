import * as faceapi from "face-api.js";
import * as vision from "@/utils/vision";
import { api } from "@/utils/api";
import { useState } from "react";

import $ from "jquery";
import { DrawFaceLandmarksInput, TDrawDetectionsInput } from "face-api.js/build/commonjs/draw";
import { relative } from "path";



export default function Vision() {

  const [withBoxes, setWithBoxes] = useState(true);

  let forwardTimes: number[] = [];

  let stream;
  if (typeof window !== "undefined") {
    stream = async () => {
      const TINY_FACE_DETECTOR = "tiny_face_detector";
      await vision.changeFaceDetector(TINY_FACE_DETECTOR);
      await faceapi.loadFaceLandmarkModel("./../../");
      vision.changeInputSize(224);
      const video: MediaStream = await navigator.mediaDevices.getUserMedia({
        video: {},
      });
      const videoEl = $("#inputVideo").get(0) as HTMLVideoElement;
      videoEl.srcObject = video;
      return video;
    };
    stream();
  }
    const updateTimeStats = (timeInMs: number) => {
      forwardTimes = [timeInMs].concat(forwardTimes).slice(0, 30);
      const avgTimeInMs =
        forwardTimes.reduce((total, t) => total + t) / forwardTimes.length;
      $("#time").val(`${Math.round(avgTimeInMs)} ms`);
      $("#fps").val(`${faceapi.utils.round(1000 / avgTimeInMs)}`);
    };
    let results: any = [];

    const onPlay: any = async () => {
      let videoEl: HTMLVideoElement = document.createElement(
        "video",
      ) as HTMLVideoElement;
      if ($("#inputVideo").get(0) !== undefined) {
        videoEl = $("#inputVideo")?.get(0) as HTMLVideoElement;
      }

      if (
        videoEl?.paused ||
        videoEl?.ended ||
        !vision.isFaceDetectionModelLoaded()
      ) {
        return setTimeout(() => onPlay());
      }

      const options = vision.getFaceDetectorOptions();

      const ts = Date.now();

      results = await faceapi
        .detectSingleFace(videoEl, options)
        .withFaceLandmarks();

      updateTimeStats(Date.now() - ts);

      let canvas: HTMLCanvasElement = document.createElement(
        "canvas",
      ) as HTMLCanvasElement;
      if ($("#overlay").get(0) !== undefined) {
        canvas = $("#overlay").get(0) as HTMLCanvasElement;
        console.log("canvas : ", canvas);
      }

      const dims = faceapi.matchDimensions(canvas, videoEl, true);

      let resizedResult: TDrawDetectionsInput = {
        detection: new faceapi.FaceDetection(
          10,
          new faceapi.Rect(10, 10, 10, 10),
          new faceapi.Dimensions(10, 10),
        ),
      };

      let landmarkResult: DrawFaceLandmarksInput = new faceapi.FaceLandmarks68(
        [new faceapi.Point(10, 10)],
        new faceapi.Dimensions(10, 10),
        undefined,
      );

      console.log("result : ", JSON.stringify(results));
      if (results !== undefined) {
        resizedResult = faceapi.resizeResults(results, dims);
        landmarkResult = faceapi.resizeResults(results, dims);
      }

      faceapi.draw.drawDetections(canvas, resizedResult);
      faceapi.draw.drawFaceLandmarks(canvas, landmarkResult);
      let Opciones = new faceapi.draw.DrawBoxOptions({ label: "Face" });
 
      console.log("Overlay drawn");
      requestAnimationFrame(onPlay);

    };

    // function that returns a media stream await navigator.mediaDevices.getUserMedia({ video: {} })

 
    

  return (
    <>
      <div style={{ position: "relative" }} className="margin">
        <video
          onLoadedMetadata={() => onPlay()}
          id="inputVideo"
          autoPlay
          muted
          playsInline
          height={720}
          style={{ zIndex: 1 }}
        ></video>
        <canvas id="overlay" height={720} style={{ zIndex: 999 ,position:'absolute', top: 0,
  left: 0}} />
      </div>
    </>
  );
}
