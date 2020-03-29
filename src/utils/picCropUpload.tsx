import React, { useState, useEffect } from "react";
import ReactCrop, { Crop } from "react-image-crop";
import "react-image-crop/lib/ReactCrop.scss";
import { Form, Col, Button } from "react-bootstrap";
import { requestPostFile } from "./request";

interface IProps {
  setCroppedImage: any;
  addToast: any;
  fetchUser: any;
  id: string;
}
export default function picCropUpload({
  setCroppedImage,
  addToast,
  fetchUser,
  id
}: IProps) {
  const [crop, setCrop] = useState({
    width: 75,
    height: 75,
    x: 0,
    y: 0,
    aspect: 1 / 1,
    unit: "px"
  } as Crop);
  const [croppedImageUrl, setCroppedImageUrl] = useState(null);
  const [src, setSrc] = useState();
  const [cropImage, setCropImage] = useState();
  const [imageRef, setImageRef] = useState();
  const [theInputKey, setInputKey] = useState("");
  const [previewImage, setPreviewImage] = useState(false);
  let inputElement: any;

  useEffect(() => {
    inputElement.click();
  }, []);

  const resetForm = () => {
    setCrop({
      width: 50,
      height: 50,
      aspect: 1 / 1,
      unit: "px"
    } as Crop);
    setCroppedImageUrl(null);
    setSrc(null);
    setCropImage(null);
    setImageRef(null);
    setPreviewImage(false);
    setInputKey(Math.random().toString(36));
  };
  const handleFile = (e: any) => {
    if (e.target.files && e.target.files.length > 0) {
      const reader = new FileReader();
      reader.addEventListener("load", (e: any) => {
        setSrc(e.target.result);
      });
      reader.readAsDataURL(e.target.files[0]);
    }
  };

  const onCropComplete = (crop: Crop) => {
    if (imageRef && crop.width && crop.height) {
      const croppedImageUrl = getCroppedImg(imageRef, crop);
      setCroppedImageUrl(croppedImageUrl);
    }
  };

  const getCroppedImg = (image: any, crop: Crop) => {
    const canvas = document.createElement("canvas");
    const scaleX = image.naturalWidth / image.width;
    const scaleY = image.naturalHeight / image.height;
    const ctx = canvas.getContext("2d");
    canvas.width =
      Math.ceil(crop.width * scaleX) > 300
        ? 300
        : Math.ceil(crop.width * scaleX);
    canvas.height =
      Math.ceil(crop.height * scaleY) > 300
        ? 300
        : Math.ceil(crop.height * scaleY);
    ctx.drawImage(
      image,
      crop.x * scaleX,
      crop.y * scaleY,
      crop.width * scaleX,
      crop.height * scaleY,
      0,
      0,
      crop.width * scaleX > 300 ? 300 : crop.width * scaleX, //crop.width * scaleX,
      crop.height * scaleY > 300 ? 300 : crop.height * scaleY //crop.height * scaleY
    );
    // As Base64 string
    //const base64Image = canvas.toDataURL('image/jpeg');
    // As a blob
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      canvas.toBlob(
        blob => {
          resolve(blob);
          reader.readAsDataURL(blob);
          reader.onloadend = () => {
            dataURLtoFile(reader.result, "cropped.jpg");
            setCroppedImageUrl(reader.result);
          };
        },
        "image/jpeg",
        1
      );
    });
  };
  const dataURLtoFile = (dataurl: any, filename: string) => {
    let arr = dataurl.split(","),
      mime = arr[0].match(/:(.*?);/)[1],
      bstr = atob(arr[1]),
      n = bstr.length,
      u8arr = new Uint8Array(n);

    while (n--) {
      u8arr[n] = bstr.charCodeAt(n);
    }
    const croppedImage: any = new File([u8arr], filename, { type: mime });
    setCropImage(croppedImage);
    setCroppedImage(croppedImage);
  };

  const uploadImage = (e: any) => {
    const callback = () => {
      addToast("Image uploaded", {
        appearance: "success",
        autoDismiss: true
      });
      fetchUser();
      resetForm();
    };
    e.preventDefault();
    let formData = new FormData();
    formData.append("image", cropImage);
    formData.append("userId", id);
    requestPostFile("/api/userProfile/uploadImage/", formData, callback);
  };

  const imageLoaded = (target: any) => {
    setImageRef(target);
    let size =
      target.naturalWidth > target.naturalHeight
        ? target.naturalWidth
        : target.naturalHeight;
    size = size > 150 ? 150 : size;
    crop.width = size;
    crop.height = size;
    getCroppedImg(target, crop);
  };

  return (
    <Form encType="multipart/form-data" onSubmit={uploadImage}>
      <Form.Row>
        <Form.Group as={Col}>
          <Form.Label>Choose an image </Form.Label>
          <br />
          <input
            type="file"
            ref={input => (inputElement = input)}
            className="form-input"
            onChange={handleFile}
            key={theInputKey}
          />
        </Form.Group>
      </Form.Row>
      {src && (
        <div className="floatingPicCrop">
          <div className="picCropDialog">
            <ReactCrop
              className="picCrop"
              src={src}
              crop={crop}
              onImageLoaded={imageLoaded}
              onComplete={onCropComplete}
              onChange={(crop: Crop) => setCrop(crop)}
              circularCrop={true}
            />
            {croppedImageUrl && previewImage && (
              <img className="croppedImage" alt="Crop" src={croppedImageUrl} />
            )}
            <div>
              {croppedImageUrl && (
                <Button type="submit" className="submit-btn">
                  Submit
                </Button>
              )}
              <Button
                className="cancel-btn"
                variant="secondary"
                onClick={resetForm}
              >
                Cancel
              </Button>
              {croppedImageUrl && (
                <Button
                  className="preview-btn"
                  variant="info"
                  onClick={() => setPreviewImage(!previewImage)}
                >
                  Preview
                </Button>
              )}
            </div>
          </div>
        </div>
      )}
    </Form>
  );
}
