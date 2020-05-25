import React, { useEffect, useState } from "react";

import { requestGet, requestPostFile, requestDelete } from "utils/request";
import { useToasts } from "react-toast-notifications";

import Container from "react-bootstrap/Container";
import Col from "react-bootstrap/Col";
import Row from "react-bootstrap/Row";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import Create from "@material-ui/icons/Create";
import DoneIcon from "@material-ui/icons/Done";
import AddAPhoto from "@material-ui/icons/AddAPhoto";

import { connect } from "react-redux";

import "./Hardware.scss";

interface Props {
  auth: any;
  errors: any;
  history: any;
}

function Hardware({ auth, errors, history }: Props) {
  const { user } = auth;
  const [pieceName, setPieceName] = useState("");
  const [pieceType, setPieceType] = useState("");
  const [hardware, setHardware] = useState([]);
  const [addingPiece, setAddingPiece] = useState(false);
  const [pieceDesc, setPieceDesc] = useState("");
  const [pieceMinVal, setMinVal]: any = useState(0);
  const [pieceMaxVal, setMaxVal]: any = useState(10000);
  const [pieceVal, setPieceVal]: any = useState(0);
  const [images, setImages]: any = useState();
  const [imagesPreview, setImagesPreview] = useState([]);
  const [error, setError] = useState({ images: "" });
  const { addToast } = useToasts();
  let inputImage: any;

  const hardwarePieces: any = {
    "": "All",
    mobo: "Motherboard",
    cpu: "CPU",
    hdd: "Hard Drive Disk",
    ssd: "Solid State Drive",
    gpu: "Graphic Card",
    ram: "Memory RAM",
    optic: "Optical Drive",
    soundcard: "Soundcard",
    case: "Case",
    psu: "Power Supply",
    etc: "Others"
  };

  useEffect(() => {
    if (!auth.isAuthenticated) {
      history.push("/login");
    } else {
      setPieceType(Object.keys(hardwarePieces)[0]);
      fetchHardwares();
    }
  }, []);

  useEffect(() => {
    if (images) {
      setError({ images: "" });
      if (images.length > 6)
        setError({ images: "Max image files exceeded, upload max 6." });
      let imagesHtml: any = [];
      for (let i = 0; i < images.length; i++) {
        let img = new Image();
        img.src = URL.createObjectURL(images[i]);
        img.title = images[i].name;
        imagesHtml.push(
          <div key={i} className="pieceImage">
            <img src={img.src} title={img.title} />
          </div>
        );
        setImagesPreview(imagesHtml);
      }
    }
  }, [images]);

  const fetchHardwares = () => {
    requestGet(`/api/hardware/${location.search}`, setHardware);
  };

  const removePiece = (hardwareId: string) => {
    if (confirm("Remove hardware ?")) {
    const callback = () => {
      fetchHardwares();
    };
    requestDelete(
      `/api/hardware/${user.id}`,
      callback,
      { hardwareId },
      addToast
    );}
  };

  const searchPiece = (e: any) => {
    e.preventDefault();
    let query = "";
    query += pieceName ? `name=${pieceName}&` : "";
    query += pieceType ? `type=${pieceType}&` : "";
    query += pieceMinVal ? `minVal=${pieceMinVal}&` : "";
    query += pieceMaxVal ? `maxVal=${pieceMaxVal}` : "";
    requestGet(`/api/hardware/?${query}`, setHardware);
    window.history.pushState("", "", `/hardware/?${query}`);
  };

  const addPiece = (e: any) => {
    e.preventDefault();
    const callback = () => {
      fetchHardwares();
    };
    let formData = new FormData();
    formData.append("name", pieceName);
    formData.append(
      "type",
      pieceType ? pieceType : Object.keys(hardwarePieces)[1]
    );
    formData.append("price", pieceVal);
    formData.append("description", pieceDesc);
    if (images) {
      for (let i = 0; i < images.length; i++) {
        if (images[i].size > 3500000) {
          alert("Image exceeds max size 3.5MB, please upload another image.");
          return false;
        }
        formData.append("images", images[i]);
      }
    }
    requestPostFile(
      `/api/hardware/add/${user.id}`,
      formData,
      callback,
      addToast
    );
    closeSubmit();
  };

  const closeSubmit = () => {
    setPieceName("");
    setPieceDesc("");
    setImages();
    setImagesPreview([]);
    setError({ images: "" });
    setAddingPiece(false);
  };

  const clearSearch = () => {
    setPieceName("");
    setPieceType(Object.keys(hardwarePieces)[0]);
    setMinVal(0);
    setMaxVal(10000);
    window.history.pushState("", "", `/hardware/`);
    fetchHardwares();
  };

  const componentOptions = (removeFieldAll?: boolean) => {
    let options = [];
    for (let key in hardwarePieces) {
      if (removeFieldAll) {
        removeFieldAll = false;
        continue;
      }
      options.push(
        <option key={key} value={key}>
          {hardwarePieces[key]}
        </option>
      );
    }

    return options;
  };

  const getHardwareHtml = (hardware: any) => {
    return (
      <Row className="hardware" key={hardware._id}>
        <Col md={2} className="align-self-center">
          <div className="pieceImage">
            {hardware.images.length > 0 && (
              <img src={hardware.images[0].image} />
            )}
          </div>
        </Col>
        <Col md={10}>
          <div className="pieceName">{hardware.name}</div>
          <div className="pieceVal">
            {hardware.price || hardware.price === 0 ? hardware.price : "¿?"} €
          </div>
          <div className="pieceType mb-2">
            {hardwarePieces[`${hardware.type}`]}
          </div>
          <div className="pieceDesc">{hardware.description}</div>
        </Col>
        <div>
          {hardware.creator._id === user.id && (
            <Button variant="danger" onClick={() => removePiece(hardware._id)}>
              Remove
            </Button>
          )}
        </div>
      </Row>
    );
  };

  return (
    <Container fluid style={{ paddingTop: "4rem" }} id="hardware">
      <Col lg={true}>
        {!addingPiece ? (
          <>
            <h1>Search hardware piece</h1>
            <Button
              className="roundBtn mb-4"
              onClick={() => setAddingPiece(!addingPiece)}
            >
              Add new hardware
              <Create />
            </Button>
            <Form className="mb-3" onSubmit={searchPiece}>
              <Form.Row>
                <Form.Group as={Col}>
                  <Form.Label>Hardware name</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="Enter piece name"
                    value={pieceName}
                    onChange={(e: any) => setPieceName(e.target.value)}
                  />
                </Form.Group>
                <Form.Group as={Col} md={3}>
                  <Form.Label>Type</Form.Label>
                  <Form.Control
                    value={pieceType}
                    onChange={(e: any) => setPieceType(e.target.value)}
                    as="select"
                    custom
                  >
                    {componentOptions()}
                  </Form.Control>
                </Form.Group>
                <Form.Group as={Col} md={1}>
                  <Form.Label>Min. Price</Form.Label>
                  <div className="priceValue">
                    <Form.Control
                      type="number"
                      min="0.00"
                      max="10000.00"
                      step="0.01"
                      value={pieceMinVal}
                      onChange={(e: any) => setMinVal(e.target.value)}
                    />
                    <span>€</span>
                  </div>
                </Form.Group>
                <Form.Group as={Col} md={1}>
                  <Form.Label>Max. Price</Form.Label>
                  <div className="priceValue">
                    <Form.Control
                      type="number"
                      min="0.00"
                      max="10000.00"
                      step="0.01"
                      value={pieceMaxVal}
                      onChange={(e: any) => setMaxVal(e.target.value)}
                    />
                    <span>€</span>
                  </div>
                </Form.Group>
              </Form.Row>
              <Button type="submit" className="mr-3">
                Search
              </Button>
              <Button variant="info" onClick={() => clearSearch()}>
                Clear parameters
              </Button>
            </Form>
            <div className="mt-4">
              {hardware && hardware.length > 0 ? (
                hardware.map((hw) => {
                  return getHardwareHtml(hw);
                })
              ) : (
                <>
                  No pieces found. Do you want to{" "}
                  <a
                    className="addIt"
                    onClick={() => setAddingPiece(!addingPiece)}
                  >
                    add it
                  </a>{" "}
                  ?
                </>
              )}
            </div>
          </>
        ) : (
          <>
            <h1>Add new hardware piece</h1>
            <Form
              encType="multipart/form-data"
              className="mb-3"
              onSubmit={addPiece}
            >
              <Form.Row>
                <Form.Group as={Col}>
                  <Form.Label>Hardware name</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="Enter piece name"
                    value={pieceName}
                    onChange={(e: any) => setPieceName(e.target.value)}
                    required
                  />
                </Form.Group>
                <Form.Group as={Col}>
                  <Form.Label>Type</Form.Label>
                  <Form.Control
                    value={pieceType}
                    onChange={(e: any) => setPieceType(e.target.value)}
                    as="select"
                    required
                  >
                    {componentOptions(true)}
                  </Form.Control>
                </Form.Group>
                <Form.Group as={Col} md="2">
                  <Form.Label>Price (€)</Form.Label>
                  <div className="priceValue">
                    <Form.Control
                      type="number"
                      min="0.00"
                      max="10000.00"
                      step="0.01"
                      value={pieceVal}
                      onChange={(e: any) => setPieceVal(e.target.value)}
                      required
                    />
                    <span>€</span>
                  </div>
                </Form.Group>
              </Form.Row>
              <Form.Row>
                <Form.Group as={Col}>
                  <Form.Label>Description</Form.Label>
                  <Form.Control
                    as="textarea"
                    rows="3"
                    type="text"
                    name="description"
                    placeholder="Hardware piece description"
                    value={pieceDesc}
                    onChange={(e: any) => setPieceDesc(e.target.value)}
                    required
                  />
                </Form.Group>
              </Form.Row>
              <div className="error">{error.images}</div>
              <div className="pieceImages">
                {images && images.length > 0 && imagesPreview}
              </div>
              <Button
                className="roundBtn mr-2"
                onClick={() => {
                  inputImage.click();
                }}
              >
                Add Images
                <AddAPhoto />
              </Button>
              <input
                ref={(input) => (inputImage = input)}
                type="file"
                className="form-input"
                accept="image/x-png,image/gif,image/jpeg"
                style={{ display: "none" }}
                name="images"
                onChange={(e: any) => setImages(e.target.files)}
                multiple
              />
              <Button type="submit" variant="success" className="roundBtn mr-2">
                Done <DoneIcon />
              </Button>
              <Button
                variant="danger"
                className="roundBtn"
                onClick={() => closeSubmit()}
              >
                Cancel <DoneIcon />
              </Button>
            </Form>
          </>
        )}
      </Col>
    </Container>
  );
}
const mapStateToProps = (state: any) => ({
  auth: state.auth,
  errors: state.errors
});
export default connect(mapStateToProps)(Hardware);
