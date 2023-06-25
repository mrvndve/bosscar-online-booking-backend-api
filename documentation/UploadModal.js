import React, { useState } from "react";
import BsButton from "react-bootstrap/Button";
import BsModal from "react-bootstrap/Modal";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faXmark } from "@fortawesome/free-solid-svg-icons";

import { ApiPostFile } from "../../Utilitites/Api";
import { LoggedIn } from "../../Utilitites/LoggedIn";

function UploadModal({
  show,
  handleClose,
  uploadLists,
  setUploadFiles,
  setHideSpinner,
}) {
  const closeButton = <FontAwesomeIcon icon={faXmark} />;
  const [formValues, setFormValues] = useState({
    label: "",
    filename: "",
    file: "",
  });
  const [uploadLabel,setUploadLabel] = useState("No file chosen...")
  const loggedIn = LoggedIn();

  const onChangeHandler = (e) => {
    let name = e.target.name;
    let value = e.target.value;

    switch (name) {
      case "label":
        setFormValues((state) => ({ ...state, label: value }));
        break;
      case "file-upload":
        let file = e.target.files[0];
        setUploadLabel(value.substring(12,35));

        setFormValues((state) => ({ ...state, filename: value, file: file }));
        break;
      default:
        break;
    }
  };

  const onConfirmHandler = async (e) => {
    e.preventDefault();

    try {
      if (formValues.label === "")
        throw new Error("File description is required.");
      if (formValues.file === "") throw new Error("File upload is required.");
    } catch (error) {
      alert(error.message);
      return;
    }

    const formData = new FormData();
    formData.append("file-upload", formValues.file);
    formData.append("userId", loggedIn.userId);
    formData.append("label", formValues.label);
    formData.append("filename", formValues.filename.substring(12));

    setHideSpinner(false);
    await ApiPostFile(formData)
      .then((res) => {
        setUploadFiles([...uploadLists, res.data]);
        setFormValues({ label: "", file: "" });
        setUploadLabel("No file chosen...");
      })
      .catch((err) => console.log(err))
      .finally(() => {
        handleClose();
        setHideSpinner(true);
      });
  };

  return (
    <BsModal show={show} onHide={handleClose} name="modal-upload">
      <div className="modal-header">
        {"Upload"}
        <div className="gc-close" onClick={handleClose}>
          {closeButton}
        </div>
      </div>
      <div className="modal-body-confirm">
        <div className="mb-label-confirm">
          <span>File Description</span>
          <input
            type={"text"}
            name={"label"}
            value={formValues.label}
            onChange={onChangeHandler}
          />
        </div>
        <div className="mb-label-confirm">
          <span>File Upload</span>
          <label className="button-choose">Choose file<input
            className="choose-file"
            type={"file"}
            name="file-upload"
            onChange={onChangeHandler}
          /></label>
          <span>{uploadLabel}</span>
        </div>
        <div>
          <BsButton variant="lights" onClick={onConfirmHandler}>
            {"Upload Now"}
          </BsButton>
          <BsButton variant="lights" onClick={handleClose}>
            {"cancel"}
          </BsButton>
        </div>
      </div>
    </BsModal>
  );
}

export default UploadModal;
