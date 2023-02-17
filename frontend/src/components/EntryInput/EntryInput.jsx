import React, { useState , useEffect} from "react";
import IconButton from "@mui/material/IconButton";
import DoneIcon from "@mui/icons-material/Done";
import $ from "jquery";
import MediaTray from "./MediaTray";
import Footer from "../Footer";

function EntryInput(props) {
  const [entryData, setEntryData] = useState({
    title: "",
    content: "",
    media: [],
  });

  const [isMedia, setMedia] = useState(false);

  useEffect(setDimensions);

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

  function handleSubmit(event) {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    console.log(data.get("img"));
    fetch("http://localhost:8000/submit-entry", {
      method: "POST", // or 'PUT'
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(entryData),
    })
      .then((response) => response.json())
      .then((data) => {
        console.log("Success:", data);
      })
      .catch((error) => {
        console.error("Error:", error);
      });
  }

  function getFiles(event) {
    const files = event.target.files;
    console.log(files);
    var reader = new FileReader();
    for (let i = 0; i < files.length; i++) {
      reader.readAsDataURL(event.target.files[i]);
      const type = event.target.files[i].type;
      const fileType = type.split("/")[0];
      console.log(fileType);
      reader.onload = function () {
        console.log("help pls: " + fileType);
        setEntryData((prev) => {
          let newMedia = prev.media;
          const keyList = Object.keys(newMedia);
          const valueList = Object.values(newMedia);
          const index = keyList.indexOf(fileType);
          let temp = null;
          if (index != -1) {
            temp = valueList[index];
            temp.push(reader.result);
          } else {
            temp = [reader.result];
          }
          console.log("encoded data:" + temp);
          console.log("key value: " + fileType);
          console.log("object: " + { [fileType]: temp });
          newMedia = {
            ...newMedia,
            [fileType]: temp,
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

  function setDimensions() {
    let windowHeight = window.innerHeight;
    let headerHeight = $("#header").outerHeight();
    let footerHeight = $("#footer").outerHeight();
    let titleHeight = $("#title-div").outerHeight();
    $("#textInput").outerHeight(windowHeight - headerHeight - footerHeight);
    let inputHeight = $("#textInput").outerHeight();
    $("#content-div").outerHeight(inputHeight - titleHeight);
    $("#media-div").outerHeight(windowHeight - headerHeight - footerHeight)
    const mediaHeight = $("#media-div").outerHeight();

    console.log("native script running in EntryInput via UseEffect!!!");
    console.log(
      "window: " +
        windowHeight +
        " header: " +
        headerHeight +
        " input area: " +
        $("#textInput").outerHeight() +
        " title: " +
        titleHeight +
        " content: " +
        $("#content-div").outerHeight() +
        " media: " +
        mediaHeight
    );
  }

  return (
    <div>
      <div
        className="container-fluid width-100 text-input-container"
        id="textInput"
      >
        <form onSubmit={handleSubmit}>
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
                    <IconButton className="mx-auto" type="submit">
                      <DoneIcon fontSize="large" sx={{ color: "white" }} />
                    </IconButton>
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
                        <p className="align-middle no-media">
                          You haven't added any media yet
                        </p>
                      </td>
                    </tr>
                  </tbody>
                </table>
              ) : (
                <MediaTray mediaData={entryData.media} />
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
      <Footer />
      {setDimensions()}
    </div>
  );
}

export default EntryInput;