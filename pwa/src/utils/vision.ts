
import * as faceapi from "face-api.js";
const SSD_MOBILENETV1 = "ssd_mobilenetv1";
const TINY_FACE_DETECTOR = "tiny_face_detector";

let selectedFaceDetector = SSD_MOBILENETV1;

// ssd_mobilenetv1 options
let minConfidence = 0.5;

// tiny_face_detector options
let inputSize = 512;
let scoreThreshold = 0.5;

export const getFaceDetectorOptions = () => {
  return selectedFaceDetector === SSD_MOBILENETV1
    ? new faceapi.SsdMobilenetv1Options({ minConfidence })
    : new faceapi.TinyFaceDetectorOptions({ inputSize, scoreThreshold });
}

export const onIncreaseMinConfidence = ( updateResults: any) => {
  minConfidence = Math.min(faceapi.utils.round(minConfidence + 0.1), 1.0);
  $("#minConfidence").val(minConfidence);
  updateResults();
}

export const onDecreaseMinConfidence = (updateResults: any) => {
  minConfidence = Math.max(faceapi.utils.round(minConfidence - 0.1), 0.1);
  $("#minConfidence").val(minConfidence);
  updateResults();
}

export const onInputSizeChanged = (e:any, updateResults: any) => {
  changeInputSize(e.target.value);
  updateResults();
}

export const changeInputSize = (size:any) => {
  inputSize = parseInt(size);

  const inputSizeSelect = $("#inputSize");
  inputSizeSelect.val(inputSize);
}

export const onIncreaseScoreThreshold = (scoreThreshold: any, updateResults: any) => {
  scoreThreshold = Math.min(faceapi.utils.round(scoreThreshold + 0.1), 1.0);
  $("#scoreThreshold").val(scoreThreshold);
  updateResults();
}

export const onDecreaseScoreThreshold = (scoreThreshold: any, updateResults: any) => {
  scoreThreshold = Math.max(faceapi.utils.round(scoreThreshold - 0.1), 0.1);
  $("#scoreThreshold").val(scoreThreshold);
  updateResults();
}

export const onIncreaseMinFaceSize = (minFaceSize: any) => {
  minFaceSize = Math.min(faceapi.utils.round(minFaceSize + 20), 300);
  $("#minFaceSize").val(minFaceSize);
}

export const onDecreaseMinFaceSize = (minFaceSize: any) => {
  minFaceSize = Math.max(faceapi.utils.round(minFaceSize - 20), 50);
  $("#minFaceSize").val(minFaceSize);
}

export const getCurrentFaceDetectionNet = () => {
  if (selectedFaceDetector === SSD_MOBILENETV1) {
    return faceapi.nets.ssdMobilenetv1;
  }
  if (selectedFaceDetector === TINY_FACE_DETECTOR) {
    return faceapi.nets.tinyFaceDetector;
  }
}

export const isFaceDetectionModelLoaded = () => {
  return !!getCurrentFaceDetectionNet()?.params;
}

export const changeFaceDetector = async(detector:any) => {
  ["#ssd_mobilenetv1_controls", "#tiny_face_detector_controls"].forEach((id) =>
    $(id).hide(),
  );

  selectedFaceDetector = detector;
  const faceDetectorSelect = $("#selectFaceDetector");
  faceDetectorSelect.val(detector);


  $("#loader").show();
  if (!isFaceDetectionModelLoaded()) {
    await getCurrentFaceDetectionNet()?.load("/");
  }

  $(`#${detector}_controls`).show();
  $("#loader").hide();
}
export const onSelectedFaceDetectorChanged = async(e:any, updateResults: any) => {
  selectedFaceDetector = e.target.value;

  await changeFaceDetector(e.target.value);
  updateResults();
}

