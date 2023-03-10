import React, { useState, useEffect } from "react";
import { expressIP } from "../../settings";
import IconButton from "@mui/material/IconButton";
import DoneIcon from "@mui/icons-material/Done";
import EditIcon from "@mui/icons-material/Edit";
import $ from "jquery";
import MediaTray from "./MediaTray";
import Footer from "../Footer";

function EntryInput(props) {
  const [entryData, setEntryData] = useState(props.passedEntry);

  const [isMedia, setMedia] = useState(!props.createMode); //tracks if entry has media attachments (conditional rendering of MediaTray)
  const [ready, setReady] = useState(true); //tracks whether mediaTray is ready to be rendered or not

  useEffect(setDimensions);

  if (!props.createMode) {
    $("input").prop("disabled", true);
    $("textarea").prop("disabled", true);
  }

  function changeReady() {
    setReady((prev) => {
      return !prev;
    });
  }

  function setEnv(date, weather) {
    setEntryData((prev) => {
      return {
        ...prev,
        date: date,
        weather: weather,
      };
    });
  }

  function handleTextChange(event) {
    const newData = event.target.value;
    const varName = event.target.name;
    setEntryData((prev) => {
      return {
        ...prev,
        [varName]: newData,
      };
    });
  }

  function addBkgAudio(src) {
    const temp = src;
    setEntryData((prev) => {
      return {
        ...prev,
        backgroundAudio: temp,
      };
    });
  }

  function addBkgImage(index) {
    setEntryData((prev) => {
      return {
        ...prev,
        backgroundImage: index,
      };
    });
  }

  function handleSubmit(event) {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    fetch(expressIP + "/submit-entry", {
      method: "POST", // or 'PUT'
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        user: props.currentUser.username,
        entry: entryData,
      }),
    })
      .then((response) => response.json())
      .then((data) => {
        console.log("Success:", data);
        props.updateEntries(data.savedEntry);
        props.exitEntry();
      })
      .catch((error) => {
        console.error("Error:", error);
      });
  }

  function handleEdit(event) {
    event.preventDefault();
    props.invertCreateMode();
    $("input").prop("disabled", false);
    $("textarea").prop("disabled", false);
  }

  function getFiles(event) {
    const files = event.target.files;
    var reader = new FileReader();
    for (let i = 0; i < files.length; i++) {
      reader.readAsDataURL(event.target.files[i]);
      const type = event.target.files[i].type;
      const fileType = type.split("/")[0];
      reader.onload = function () {
        console.log("help pls: " + fileType);
        setEntryData((prev) => {
          let newMedia = prev.media;
          const keyList = Object.keys(newMedia);
          const valueList = Object.values(newMedia);
          const index = keyList.indexOf(fileType);
          let temp = null;
          temp = valueList[index];
          temp.push(reader.result);
          newMedia = {
            ...newMedia,
            [fileType]: [...new Set(temp)],
          };
          setMedia(true);
          return {
            ...prev,
            media: newMedia,
          };
        });
      };
      reader.onerror = function (error) {
        console.log("Error: ", error);
      };
    }
  }

  function removeMedia(type, id) {
    console.log("removing: " + id);
    let newMedia = entryData.media;
    const keyList = Object.keys(newMedia);
    const valueList = Object.values(newMedia);
    let arr = [];
    arr = valueList[keyList.indexOf(type)];
    arr.splice(id, 1);
    newMedia = {
      ...newMedia,
      [type]: arr,
    };
    setEntryData((prev) => {
      return {
        ...prev,
        media: newMedia,
      };
    });
  }

  function setDimensions() {
    // $("#textInput").addClass("pt-4");
    let windowHeight = window.innerHeight;
    // let headerHeight = $("#header").outerHeight();
    let footerHeight = $("#footer").outerHeight();
    let titleHeight = $("#title-div").outerHeight();
    $("#textInput").outerHeight(windowHeight - footerHeight - 25);
    let inputHeight = $("#textInput").outerHeight();
    $("#content-div").outerHeight(inputHeight - titleHeight);
    $("#media-div").outerHeight(windowHeight - footerHeight - 25);
  }

  function switchVisibility(visibility) {
    setEntryData((prev) => {
      return {
        ...prev,
        private: visibility,
      };
    });
  }

  return (
    <div>
      <div
        className="container-fluid width-100 text-input-container"
        id="textInput"
      >
        <form onSubmit={props.createMode ? handleSubmit : handleEdit}>
          <div className="row mx-5">
            {/* this column contains title + done button + content */}
            <div className="col-md-8 px-0">
              {/* container for title and done button */}
              <div
                className="container-fluid width-100 px-0 entry-title-container"
                id="title-div"
              >
                <div className="row title-done-button-row">
                  <div className="col-sm-11 px-0">
                    <input
                      className="entry-title"
                      type="text"
                      placeholder="Your Title"
                      onChange={handleTextChange}
                      name="title"
                      value={entryData.title}
                    ></input>
                  </div>
                  <div className="container-fluid col-sm-1 mx-auto">
                    { props.feedMode !== true ? (<IconButton className="mx-auto" type="submit">
                      {props.createMode ? (
                        <DoneIcon fontSize="large" sx={{ color: "white" }} />
                      ) : (
                        <EditIcon fontSize="large" sx={{ color: "white" }} />
                      )}
                    </IconButton>) : null}
                  </div>
                </div>
              </div>
              {/* container for content */}
              <div
                className="container-fluid px-0 entry-content-container"
                id="content-div"
              >
                <textarea
                  className="entry-content height-100"
                  placeholder="Write your thoughts away..."
                  onChange={handleTextChange}
                  name="content"
                  value={entryData.content}
                ></textarea>
              </div>
            </div>
            {/* column for media attachments */}
            <div className="col-md-4 px-0">
              {!isMedia ? (
                <table className="height-100 width-100 table-class">
                  <tbody>
                    <tr>
                      <td className="no-media-container">
                        <p className="align-middle no-media date-p">
                          You haven't added any media yet
                        </p>
                      </td>
                    </tr>
                  </tbody>
                </table>
              ) : (
                <MediaTray
                  mediaData={entryData.media}
                  removeMedia={removeMedia}
                  ready={ready}
                  changeReady={changeReady}
                  createMode={props.createMode}
                />
              )}
              <input
                onChange={getFiles}
                type="file"
                id="files"
                multiple="multiple"
                name="files"
                accept="image/*, video/*, audio/*"
              />
            </div>
          </div>
        </form>
      </div>
      <Footer
        addBkgAudio={addBkgAudio}
        addBkgImage={addBkgImage}
        return={props.exitEntry}
        setEnv={setEnv}
        createMode={props.createMode}
        entryData={entryData}
        switchVisibility={switchVisibility}
      />
      {setDimensions()}
    </div>
  );
}

export default EntryInput;
